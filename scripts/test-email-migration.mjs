import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { request as httpRequest } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Use a per-process default so concurrent reviewer suites cannot share mock state.
// An explicit base remains available for reproducible local debugging.
const basePort = Number(process.env.EMAIL_TEST_BASE_PORT || (20_000 + ((process.pid * 2) % 30_000)));
const mockPort = basePort;
const workerPort = basePort + 1;
const mockBase = `http://127.0.0.1:${mockPort}`;
const workerBase = `http://127.0.0.1:${workerPort}`;
const stateDir = mkdtempSync(join(tmpdir(), `bwj-email-test-${process.pid}-`));
const defaultGroupIds = JSON.stringify({
  "consent:pending": "pending",
  "consent:confirmed": "confirmed",
  "source:newsletter": "newsletter",
  "offer:hidden-profit-review": "hpr",
  "asset:invoice-chase-kit": "invoice",
  "asset:follow-up-swipe-file": "followup",
  "asset:leak-calculator": "leak",
  "asset:starter-kit-cowork": "cowork",
  "offer:email-course": "course",
  "source:scorecard": "scorecard",
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const pathRequests = (requests, path, method) =>
  requests.filter((request) => request.path === path && (!method || request.method === method));
const containsStatusField = (value) => {
  if (!value || typeof value !== "object") return false;
  const prohibited = new Set([
    "email_status", "subscriber_status", "transactional_email_status",
    "status", "channels", "temail",
  ]);
  return Object.entries(value).some(([key, child]) => prohibited.has(key) || containsStatusField(child));
};

function start(command, args) {
  return spawn(command, args, { stdio: ["ignore", "pipe", "pipe"], env: process.env });
}

async function waitFor(url, process, label) {
  let output = "";
  process.stdout?.on("data", (chunk) => { output += chunk; });
  process.stderr?.on("data", (chunk) => { output += chunk; });
  for (let attempt = 0; attempt < 150; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await sleep(100);
  }
  throw new Error(`${label} did not start:\n${output}`);
}

async function startWorker({
  provider,
  sender = false,
  resend = false,
  emailDailyLimit = 1000,
  globalDailyLimit = 1000,
  groupIds = defaultGroupIds,
  hashSalt = "local-test-only-secret",
  dualWrite = true,
  senderSendsEnabled = true,
  timeoutMs = 8_000,
} = {}) {
  const args = [
    "dev", "--local", "--port", String(workerPort),
    "--persist-to", stateDir,
    "--var", `SENDER_API_BASE:${mockBase}/v2`,
    "--var", `RESEND_API_BASE:${mockBase}`,
    "--var", `FORMSPREE_ENDPOINT:${mockBase}/f/xdapgpae`,
    "--var", `SENDER_GROUP_IDS:${groupIds}`,
    "--var", "SENDER_FROM:Built with Jon <jonathan@builtwithjon.com>",
    "--var", `SENDER_SENDS_ENABLED:${senderSendsEnabled}`,
    "--var", `FORMSPREE_DUAL_WRITE:${dualWrite}`,
    "--var", "FORM_RATE_LIMITS_ENABLED:true",
    "--var", "FORM_RATE_LIMIT_IP_HOURLY:1000",
    "--var", `FORM_RATE_LIMIT_EMAIL_DAILY:${emailDailyLimit}`,
    "--var", `FORM_RATE_LIMIT_GLOBAL_DAILY:${globalDailyLimit}`,
    "--var", `FORM_HASH_SALT:${hashSalt}`,
    "--var", `SENDER_TIMEOUT_MS:${timeoutMs}`,
    "--var", `EMAIL_PROVIDER_TIMEOUT_MS:${timeoutMs}`,
  ];
  if (provider) args.push("--var", `EMAIL_PROVIDER:${provider}`);
  if (sender) args.push("--var", "SENDER_API_TOKEN:dummy-local-token");
  if (resend) args.push("--var", "RESEND_API_KEY:dummy-resend-token");
  const process = start("./node_modules/.bin/wrangler", args);
  await waitFor(`${workerBase}/api/event`, process, "Worker");
  return process;
}

async function stop(process) {
  if (!process || process.exitCode !== null) return;
  process.kill("SIGTERM");
  await Promise.race([new Promise((resolve) => process.once("exit", resolve)), sleep(5_000)]);
}

async function reset() {
  await fetch(`${mockBase}/__reset`, { method: "POST" });
}

async function configure(failures = {}) {
  await fetch(`${mockBase}/__config`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ failures }),
  });
}

async function seed(subscriber) {
  await fetch(`${mockBase}/__subscribers`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(subscriber),
  });
}

async function requests() {
  return (await (await fetch(`${mockBase}/__requests`)).json()).requests;
}

async function state() {
  return (await (await fetch(`${mockBase}/__state`)).json()).subscribers;
}

async function confirm(email) {
  return fetch(`${mockBase}/__confirm`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

async function form(path, fields, extraHeaders = {}) {
  const body = new URLSearchParams(fields);
  return fetch(`${workerBase}${path}`, {
    method: "POST",
    headers: {
      Origin: workerBase,
      "content-type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      ...extraHeaders,
    },
    body,
  });
}

async function chunkedForm(path, fields) {
  const body = new URLSearchParams(fields).toString();
  return new Promise((resolve, reject) => {
    const request = httpRequest(`${workerBase}${path}`, {
      method: "POST",
      headers: {
        Origin: workerBase,
        "content-type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "transfer-encoding": "chunked",
      },
    }, (response) => {
      response.resume();
      response.on("end", () => resolve({ ok: response.statusCode >= 200 && response.statusCode < 300, status: response.statusCode }));
    });
    request.on("error", reject);
    request.write(body.slice(0, Math.ceil(body.length / 2)));
    request.end(body.slice(Math.ceil(body.length / 2)));
  });
}

async function scorecard(email, extra = {}) {
  return form("/api/scorecard-report", {
    email,
    name: "Test Person",
    segment: "general",
    tier: "Developing",
    scores: JSON.stringify({ deals: 25, time: 30, cash: 15 }),
    answers: JSON.stringify({ q2: "Fast", q3: "Yes", q4: "Few", q5: "Some", q6: "No", q7: "No", q8: "No", q9: "Skip" }),
    source_url: `${workerBase}/scorecard/`,
    ...extra,
  });
}

async function run() {
  const mock = start("node", ["scripts/mock-email-apis.mjs", String(mockPort)]);
  let worker;
  const results = [];
  const test = async (name, fn) => {
    try {
      await fn();
      results.push([name, "PASS"]);
    } catch (error) {
      results.push([name, `FAIL: ${error.message}`]);
      throw error;
    }
  };

  try {
    await waitFor(`${mockBase}/__requests`, mock, "Mock server");
    worker = await startWorker({ provider: "sender", sender: true });

    await test("1. New asset subscriber uses safe GET/POST, group, and Formspree", async () => {
      await reset();
      const response = await form("/api/subscribe", { email: "asset-new@example.test", form_id: "kit-invoice-chase" });
      assert(response.ok, "response was not ok");
      const all = await requests();
      assert(pathRequests(all, "/v2/subscribers/:identifier", "GET").length === 2, "missing create verification GET");
      const created = pathRequests(all, "/v2/subscribers", "POST");
      assert(created.length === 1 && created[0].body.groups.includes("invoice"), "missing asset group");
      assert(created[0].body.trigger_automation === false, "asset-only create triggered automation");
      assert(!containsStatusField(created[0].body), "status field was written");
      assert(pathRequests(all, "/f/xdapgpae", "POST").length === 1, "missing Formspree dual-write");
    });

    await test("2. Existing active subscriber uses PATCH and group add", async () => {
      await reset();
      await seed({ email: "active@example.test", status: { email: "active", temail: "active" } });
      assert((await form("/api/subscribe", { email: "active@example.test", form_id: "kit-invoice-chase" })).ok, "request failed");
      const all = await requests();
      const patch = pathRequests(all, "/v2/subscribers/:identifier", "PATCH");
      assert(patch.length === 1 && !containsStatusField(patch[0].body), "missing safe PATCH");
      const groupAdd = pathRequests(all, "/v2/subscribers/groups/invoice", "POST");
      assert(groupAdd.length === 1 && Array.isArray(groupAdd[0].body.subscribers) && groupAdd[0].body.trigger_automation === false, "missing safe group add");
      assert(pathRequests(all, "/v2/subscribers", "POST").length === 0, "unexpected create");
    });

    await test("3. Marketing request enters pending only", async () => {
      await reset();
      const response = await form("/api/subscribe", { email: "pending@example.test", form_id: "newsletter" });
      assert(response.ok, "newsletter failed");
      const created = pathRequests(await requests(), "/v2/subscribers", "POST");
      assert(created.length === 1 && created[0].body.groups.length === 0, "pending group was added during passive create");
      assert(created[0].body.trigger_automation === false, "subscriber create triggered automation");
      const pendingAdds = pathRequests(await requests(), "/v2/subscribers/groups/pending", "POST");
      assert(pendingAdds.length === 1 && pendingAdds[0].body.trigger_automation === true, "pending confirmation automation was not triggered");
      assert(!created[0].body.groups.includes("newsletter") && !created[0].body.groups.includes("confirmed"), "premature confirmation group");
      assert(created[0].body.fields.consent_requested_at, "request timestamp missing");
      assert(!created[0].body.fields.consent_marketing_at, "confirmation timestamp written too early");
      const abandoned = (await state()).find((subscriber) => subscriber.email === "pending@example.test");
      assert(abandoned.groups.includes("pending") && !abandoned.groups.includes("confirmed"), "abandoned request was promoted");
      assert((await confirm("pending@example.test")).ok, "confirmation simulation failed");
      const confirmed = (await state()).find((subscriber) => subscriber.email === "pending@example.test");
      assert(confirmed.groups.includes("confirmed") && confirmed.groups.includes("newsletter") && !confirmed.groups.includes("pending"), "confirmed request was not promoted");
    });

    await test("4. Unsubscribed subscriber is never mutated or reactivated", async () => {
      await reset();
      await seed({
        email: "off@example.test",
        status: { email: "unsubscribed", temail: "active" },
      });
      assert((await form("/api/subscribe", { email: "off@example.test", form_id: "kit-follow-up-swipe-file", marketing_opt_in: "true" })).ok, "safe fallback failed");
      const writes = (await requests()).filter((request) => request.path.startsWith("/v2/subscribers") && request.method !== "GET");
      assert(writes.length === 0, "suppressed contact was mutated");
    });

    await test("5. Sequential duplicate causes one subscriber write", async () => {
      await reset();
      await form("/api/subscribe", { email: "duplicate@example.test", form_id: "kit-invoice-chase" });
      assert((await form("/api/subscribe", { email: "duplicate@example.test", form_id: "kit-invoice-chase" })).ok, "duplicate failed");
      assert(pathRequests(await requests(), "/v2/subscribers", "POST").length === 1, "duplicate created twice");
    });

    await test("6. Same-day opt-in escalation is not swallowed by delivery dedupe", async () => {
      await reset();
      await form("/api/subscribe", { email: "escalate@example.test", form_id: "kit-invoice-chase" });
      assert((await form("/api/subscribe", { email: "escalate@example.test", form_id: "kit-invoice-chase", marketing_opt_in: "true" })).ok, "opt-in escalation failed");
      const all = await requests();
      assert(pathRequests(all, "/v2/subscribers/groups/pending", "POST").length === 1, "pending group not added");
      const formspreeWrites = pathRequests(all, "/f/xdapgpae", "POST").length;
      assert(formspreeWrites === 1, `asset delivery was repeated (${formspreeWrites} writes)`);
    });

    await test("7. Concurrent duplicate has bounded best-effort behavior", async () => {
      await reset();
      const responses = await Promise.all([
        form("/api/subscribe", { email: "concurrent@example.test", form_id: "kit-invoice-chase" }),
        form("/api/subscribe", { email: "concurrent@example.test", form_id: "kit-invoice-chase" }),
      ]);
      assert(responses.every((response) => response.ok), "concurrent request failed");
      const creates = pathRequests(await requests(), "/v2/subscribers", "POST").length;
      assert(creates >= 1 && creates <= 2, "unbounded concurrent behavior");
    });

    await test("8. Honeypot returns success with zero upstream hits", async () => {
      await reset();
      assert((await form("/api/subscribe", { email: "bot@example.test", form_id: "kit-invoice-chase", company_website: "spam" })).ok, "honeypot failed");
      assert((await requests()).filter((request) => !request.path.startsWith("/__")).length === 0, "honeypot called upstream");
    });

    await test("9. Invalid, unknown, and oversized requests fail without writes", async () => {
      await reset();
      assert((await form("/api/subscribe", { email: "bad", form_id: "kit-invoice-chase" })).status === 400, "invalid email accepted");
      assert((await form("/api/subscribe", { email: "valid@example.test", form_id: "nope" })).status === 400, "unknown form accepted");
      assert((await form("/api/contact", { name: "A", email: "large@example.test", message: "x".repeat(33_000) })).status === 413, "oversized body accepted");
      const oversizedField = await form("/api/subscribe", { email: "field@example.test", form_id: "kit-invoice-chase", name: "x".repeat(121) });
      const oversizedFieldBody = await oversizedField.text();
      assert(oversizedField.status === 400, `oversized field accepted (${oversizedField.status} ${oversizedFieldBody})`);
      assert((await requests()).filter((request) => !request.path.startsWith("/__")).length === 0, "invalid request wrote upstream");
    });

    await test("10. Notification content is escaped and header-safe", async () => {
      await reset();
      assert((await form("/api/contact", { name: "A\r\nBcc: bad@example.test", email: "contact@example.test", message: "<script>alert(1)</script>", inquiry_type: "contact" })).ok, "contact failed");
      const sent = pathRequests(await requests(), "/v2/message/send", "POST");
      assert(sent.length === 1, "notification missing");
      assert(sent[0].body.to?.email === "[redacted]" && sent[0].body.headers?.["Reply-To"] === "[redacted]", "transactional recipient/reply-to contract missing");
      assert(!/[\r\n]/.test(sent[0].body.subject), "header injection survived");
      assert(sent[0].body.html?.containsEscapedScript && !sent[0].body.html?.containsRawScript, "HTML was not escaped");
    });

    await test("11. Workshop opt-in off notifies without creating subscriber", async () => {
      await reset();
      assert((await form("/api/subscribe", { email: "workshop@example.test", form_id: "workshop-next", comments: "Interested" })).ok, "workshop failed");
      const all = await requests();
      assert(pathRequests(all, "/v2/message/send", "POST").length === 1, "notification missing");
      assert(all.filter((request) => request.path.startsWith("/v2/subscribers") && request.method !== "GET").length === 0, "subscriber created without opt-in");
    });

    await test("12. Workshop opt-in on notifies and enters pending", async () => {
      await reset();
      assert((await form("/api/subscribe", { email: "workshop-optin@example.test", form_id: "workshop-next", comments: "Interested", marketing_opt_in: "true" })).ok, "workshop opt-in failed");
      const all = await requests();
      const created = pathRequests(all, "/v2/subscribers", "POST");
      assert(created.length === 1 && created[0].body.groups.length === 0, "pending subscriber was created with active automation");
      assert(pathRequests(all, "/v2/subscribers/groups/pending", "POST")[0]?.body.trigger_automation === true, "pending automation add missing");
    });

    await stop(worker);
    worker = await startWorker({ provider: "sender", sender: true, emailDailyLimit: 1 });
    await test("13. Per-email rate limit blocks the second request", async () => {
      await reset();
      assert((await form("/api/subscribe", { email: "limited@example.test", form_id: "kit-invoice-chase" })).ok, "first request failed");
      assert((await form("/api/subscribe", { email: "limited@example.test", form_id: "kit-invoice-chase" })).status === 429, "second request was not limited");
    });

    await stop(worker);
    worker = await startWorker({ resend: true });
    await test("14. Resend scorecard retains Idempotency-Key", async () => {
      await reset();
      assert((await scorecard("resend-scorecard@example.test")).ok, "scorecard failed");
      const sent = pathRequests(await requests(), "/emails", "POST");
      assert(sent.length === 1 && sent[0].headers["idempotency-key"], "idempotency key missing");
    });

    await stop(worker);
    worker = await startWorker({ provider: "sender", sender: true });
    await test("15. Sender scorecard sends, upserts pending opt-in, and dedupes", async () => {
      await reset();
      assert((await scorecard("sender-scorecard@example.test")).ok, "first scorecard failed");
      assert((await scorecard("sender-scorecard@example.test", { marketing_opt_in: "true" })).ok, "opt-in escalation failed");
      assert((await scorecard("sender-scorecard@example.test", { marketing_opt_in: "true" })).ok, "duplicate scorecard failed");
      const all = await requests();
      assert(pathRequests(all, "/v2/message/send", "POST").length === 1, "scorecard sent twice");
      const created = pathRequests(all, "/v2/subscribers", "POST");
      assert(created.length === 1 && created[0].body.groups.includes("scorecard"), "scorecard group missing");
      assert(pathRequests(all, "/v2/subscribers/groups/pending", "POST").length === 1, "scorecard opt-in escalation was swallowed");
      await reset();
      await seed({ email: "transaction-off@example.test", status: { email: "active", temail: "unsubscribed" } });
      assert((await scorecard("transaction-off@example.test")).status === 502, "suppressed transactional recipient was accepted");
      assert(pathRequests(await requests(), "/v2/message/send", "POST").length === 0, "suppressed transactional email was sent");
      await reset();
      await seed({ email: "transaction-unknown@example.test", status: { email: "active" } });
      assert((await scorecard("transaction-unknown@example.test")).status === 502, "unknown transactional status failed open");
      assert(pathRequests(await requests(), "/v2/message/send", "POST").length === 0, "unknown transactional status was sent");
    });

    await test("16. Sender failure falls back safely without false marketing capture", async () => {
      await reset();
      await configure({ "/v2/subscribers": 500 });
      const response = await form("/api/subscribe", { email: "fallback@example.test", form_id: "kit-invoice-chase", marketing_opt_in: "true" });
      const body = await response.json();
      assert(response.ok && body.marketing_captured === false, "asset fallback did not preserve safe UX");
      assert(pathRequests(await requests(), "/f/xdapgpae", "POST").length === 1, "Formspree fallback missing");

      await reset();
      await configure({ "/v2/subscribers": 429 });
      assert((await form("/api/subscribe", { email: "limited-upstream@example.test", form_id: "kit-invoice-chase" })).ok, "Sender 429 did not fall back");

      await reset();
      await configure({ "/v2/subscribers": 500, "/f/xdapgpae": 500 });
      assert((await form("/api/subscribe", { email: "both-fail@example.test", form_id: "kit-invoice-chase" })).status === 502, "combined provider failure returned success");

      await reset();
      await configure({ "/v2/message/send": 500 });
      assert((await form("/api/contact", { name: "Contact", email: "contact-fallback@example.test", message: "Hello" })).ok, "notification failure did not fall back");
    });

    await stop(worker);
    worker = await startWorker({});
    await test("17. Sender disabled stays Formspree-only", async () => {
      await reset();
      const response = await form("/api/subscribe", { email: "formspree-only@example.test", form_id: "newsletter" });
      assert(response.ok, "Formspree-only form failed");
      const all = await requests();
      assert(all.filter((request) => request.path.startsWith("/v2/")).length === 0, "Sender was called");
      assert(pathRequests(all, "/f/xdapgpae", "POST").length === 1, "Formspree was not called");
    });

    await stop(worker);
    worker = await startWorker({ provider: "sender", sender: true, groupIds: "{}" });
    await test("18. Incomplete Sender group configuration fails closed", async () => {
      await reset();
      const response = await form("/api/subscribe", { email: "missing-groups@example.test", form_id: "newsletter" });
      assert(response.status === 503, "missing groups did not fail closed");
      assert((await requests()).filter((request) => request.path.startsWith("/v2/")).length === 0, "Sender was called with incomplete groups");
    });

    await stop(worker);
    worker = await startWorker({ provider: "sender", sender: true, globalDailyLimit: 1, hashSalt: "budget-test-secret" });
    await test("19. Sender global budget stops upstream calls without disabling Formspree-only mode", async () => {
      await reset();
      assert((await form("/api/subscribe", { email: "budget-one@example.test", form_id: "kit-invoice-chase" })).ok, "first budgeted request failed");
      assert((await form("/api/subscribe", { email: "budget-two@example.test", form_id: "kit-follow-up-swipe-file" })).ok, "Sender budget did not preserve fallback");
      const all = await requests();
      assert(pathRequests(all, "/v2/subscribers/:identifier", "GET").length === 2, "Sender received calls beyond budget");
      assert(pathRequests(all, "/f/xdapgpae", "POST").length === 2, "budget fallback missed Formspree");
    });

    await stop(worker);
    worker = await startWorker({ provider: "sender", sender: true, timeoutMs: 25 });
    await test("20. Sender timeout is bounded and falls back to Formspree", async () => {
      await reset();
      await configure({ "/v2/subscribers/timeout%40example.test": { delayMs: 100 } });
      const response = await form("/api/subscribe", { email: "timeout@example.test", form_id: "kit-invoice-chase" });
      assert(response.ok, "Sender timeout did not preserve asset fallback");
      assert(pathRequests(await requests(), "/f/xdapgpae", "POST").length === 1, "timeout fallback missed Formspree");
    });

    await stop(worker);
    worker = await startWorker({ dualWrite: false });
    await test("21. Disabled providers never report false success", async () => {
      await reset();
      assert((await form("/api/subscribe", { email: "no-provider@example.test", form_id: "kit-invoice-chase" })).status === 503, "subscribe returned false success");
      assert((await form("/api/contact", { name: "No Provider", email: "contact-no-provider@example.test", message: "Hello" })).status === 502, "contact returned false success");
      assert((await requests()).filter((request) => !request.path.startsWith("/__")).length === 0, "disabled providers received a request");
    });

    await stop(worker);
    worker = await startWorker({ provider: "sender", sender: true, resend: true, senderSendsEnabled: false });
    await test("22. Sender circuit breaker preserves Resend scorecard delivery", async () => {
      await reset();
      assert((await scorecard("circuit-breaker@example.test")).ok, "scorecard did not fall back to Resend");
      const all = await requests();
      assert(pathRequests(all, "/emails", "POST").length === 1, "Resend fallback missing");
      assert(all.filter((request) => request.path.startsWith("/v2/")).length === 0, "Sender called while circuit breaker disabled");
    });

    await stop(worker);
    worker = await startWorker({ provider: "sender", sender: true, resend: true });
    await test("23. Transactional suppression never bypasses through Resend", async () => {
      await reset();
      await seed({ email: "suppressed-with-fallback@example.test", status: { email: "active", temail: "unsubscribed" } });
      assert((await scorecard("suppressed-with-fallback@example.test")).status === 502, "suppressed scorecard returned success");
      const all = await requests();
      assert(pathRequests(all, "/v2/message/send", "POST").length === 0, "Sender sent to suppressed recipient");
      assert(pathRequests(all, "/emails", "POST").length === 0, "Resend bypassed Sender suppression");
    });

    await test("24. Contact notification retries are deduped per provider", async () => {
      await reset();
      const fields = { name: "Browser Contract", email: "contact-dedupe@example.test", message: "Hello", inquiry_type: "contact" };
      assert((await form("/api/contact", fields)).ok, "first contact failed");
      assert((await form("/api/contact", fields)).ok, "duplicate contact failed");
      const all = await requests();
      assert(pathRequests(all, "/v2/message/send", "POST").length === 1, "contact Sender notification duplicated");
      assert(pathRequests(all, "/f/xdapgpae", "POST").length === 1, "contact Formspree notification duplicated");
      const formspree = pathRequests(all, "/f/xdapgpae", "POST")[0];
      assert(
        JSON.stringify(Object.keys(formspree.body).sort()) === JSON.stringify(["_subject", "email", "inquiry_type", "message", "name"]),
        "contact Formspree payload keys drifted",
      );
      assert(formspree.headers["content-type"].includes("application/x-www-form-urlencoded"), "contact Formspree content type drifted");
    });

    await test("25. Sender status HTTP failure never bypasses through Resend", async () => {
      await reset();
      await configure({ "/v2/subscribers/status-fail%40example.test": 500 });
      assert((await scorecard("status-fail@example.test")).status === 502, "status failure fell through");
      const all = await requests();
      assert(pathRequests(all, "/v2/message/send", "POST").length === 0, "Sender sent after failed status lookup");
      assert(pathRequests(all, "/emails", "POST").length === 0, "Resend bypassed failed status lookup");
    });

    await stop(worker);
    worker = await startWorker({ provider: "sender", sender: true, resend: true, timeoutMs: 25 });
    await test("26. Sender status timeout never bypasses through Resend", async () => {
      await reset();
      await configure({ "/v2/subscribers/status-timeout%40example.test": { delayMs: 100 } });
      assert((await scorecard("status-timeout@example.test")).status === 502, "status timeout fell through");
      const all = await requests();
      assert(pathRequests(all, "/v2/message/send", "POST").length === 0, "Sender sent after timed-out status lookup");
      assert(pathRequests(all, "/emails", "POST").length === 0, "Resend bypassed timed-out status lookup");
    });

    await stop(worker);
    worker = await startWorker({ provider: "sender", sender: true, resend: true, hashSalt: "short" });
    await test("27. Missing Sender runtime safety skips Sender", async () => {
      await reset();
      assert((await scorecard("unsafe-runtime@example.test")).ok, "safe Resend fallback failed");
      const all = await requests();
      assert(all.filter((request) => request.path.startsWith("/v2/")).length === 0, "Sender ran without a valid hash salt");
      assert(pathRequests(all, "/emails", "POST").length === 1, "Resend fallback missing");
    });

    await stop(worker);
    worker = await startWorker({ provider: "sender", sender: true, resend: true, globalDailyLimit: 1 });
    await test("28. Sender budget fallback still enforces suppression", async () => {
      await reset();
      assert((await form("/api/subscribe", { email: "budget-primer@example.test", form_id: "kit-invoice-chase" })).ok, "budget primer failed");
      await seed({ email: "budget-suppressed@example.test", status: { email: "active", temail: "unsubscribed" } });
      assert((await scorecard("budget-suppressed@example.test")).status === 502, "budget fallback bypassed suppression");
      const all = await requests();
      assert(pathRequests(all, "/v2/message/send", "POST").length === 0, "Sender sent beyond budget");
      assert(pathRequests(all, "/emails", "POST").length === 0, "Resend bypassed suppression after budget exhaustion");
    });

    await stop(worker);
    worker = await startWorker({ provider: "sender", sender: true });
    await test("29. Chunked oversized body is rejected without upstream writes", async () => {
      await reset();
      assert((await chunkedForm("/api/contact", { name: "A", email: "chunked@example.test", message: "x".repeat(33_000) })).status === 413, "chunked oversized body accepted");
      assert((await requests()).filter((request) => !request.path.startsWith("/__")).length === 0, "chunked oversized request wrote upstream");
    });
  } finally {
    await stop(worker);
    await stop(mock);
    rmSync(stateDir, { recursive: true, force: true });
    for (const [name, result] of results) console.log(`${result} ${name}`);
  }

  assert(results.length === 29 && results.every(([, result]) => result === "PASS"), "not all migration tests passed");
}

run().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
