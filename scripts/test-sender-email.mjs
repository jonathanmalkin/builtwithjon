import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { createServer, request as httpRequest } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";

const basePort = Number(process.env.EMAIL_TEST_BASE_PORT || (20_000 + ((process.pid * 2) % 30_000)));
const mockPort = basePort;
const workerPort = basePort + 1;
const senderProxyPort = basePort + 2;
const mockBase = `http://127.0.0.1:${mockPort}`;
const workerBase = `http://127.0.0.1:${workerPort}`;
const senderProxyBase = `http://127.0.0.1:${senderProxyPort}`;
const testOrigin = "https://builtwithjon.com";
const stateDir = mkdtempSync(join(tmpdir(), `bwj-sender-test-${process.pid}-`));
const senderBodies = [];
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

async function startSenderProxy() {
  const proxy = createServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    if (request.method === "POST" && request.url === "/v2/message/send") {
      try { senderBodies.push(JSON.parse(body.toString())); } catch { senderBodies.push(null); }
    }
    const headers = { ...request.headers, host: `127.0.0.1:${mockPort}` };
    delete headers.connection;
    delete headers["keep-alive"];
    delete headers["transfer-encoding"];
    if (body.length) headers["content-length"] = String(body.length);
    else delete headers["content-length"];
    const upstream = httpRequest(`${mockBase}${request.url}`, {
      method: request.method,
      headers,
    }, (upstreamResponse) => {
      response.writeHead(upstreamResponse.statusCode || 502, upstreamResponse.headers);
      upstreamResponse.pipe(response);
    });
    upstream.on("error", () => {
      if (!response.headersSent) response.writeHead(502, { "content-type": "application/json" });
      response.end(JSON.stringify({ message: "sender proxy failed" }));
    });
    upstream.end(body);
  });
  await new Promise((resolve, reject) => {
    proxy.once("error", reject);
    proxy.listen(senderProxyPort, "127.0.0.1", resolve);
  });
  return proxy;
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
  sender = true,
  emailDailyLimit = 1000,
  globalDailyLimit = 1000,
  groupIds = defaultGroupIds,
  hashSalt = "local-test-only-secret",
  timeoutMs = 8_000,
  turnstile = false,
  senderBase = senderProxyBase,
} = {}) {
  const args = [
    "dev", "--local", "--port", String(workerPort),
    "--persist-to", stateDir,
    "--var", `SENDER_API_BASE:${senderBase}/v2`,
    "--var", `SENDER_GROUP_IDS:${groupIds}`,
    "--var", "SENDER_FROM:Built with Jon <jonathan@builtwithjon.com>",
    "--var", `SENDER_SENDS_ENABLED:${sender}`,
    "--var", `SENDER_CAPTURE_ENABLED:${sender}`,
    "--var", "FORM_RATE_LIMITS_ENABLED:true",
    "--var", "FORM_RATE_LIMIT_IP_HOURLY:1000",
    "--var", `FORM_RATE_LIMIT_EMAIL_DAILY:${emailDailyLimit}`,
    "--var", `FORM_RATE_LIMIT_GLOBAL_DAILY:${globalDailyLimit}`,
    "--var", `FORM_HASH_SALT:${hashSalt}`,
    "--var", `SENDER_TIMEOUT_MS:${timeoutMs}`,
  ];
  if (turnstile) {
    args.push(
      "--var", "TURNSTILE_ENABLED:true",
      "--var", "TURNSTILE_SECRET_KEY:dummy-turnstile-secret",
      "--var", `TURNSTILE_SITEVERIFY_URL:${mockBase}/turnstile/siteverify`,
      "--var", `SITE_ORIGIN:${workerBase}`,
    );
  } else {
    args.push("--var", "TURNSTILE_ENABLED:false");
  }
  if (sender) args.push("--var", "SENDER_API_TOKEN:dummy-local-token");
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
  senderBodies.length = 0;
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

async function form(path, fields) {
  return fetch(`${workerBase}${path}`, {
    method: "POST",
    headers: {
      Origin: testOrigin,
      "content-type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams(fields),
  });
}

async function formEntries(path, entries) {
  const body = new URLSearchParams();
  for (const [key, value] of entries) body.append(key, value);
  return fetch(`${workerBase}${path}`, {
    method: "POST",
    headers: {
      Origin: testOrigin,
      "content-type": "application/x-www-form-urlencoded",
      Accept: "application/json",
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
      Origin: testOrigin,
        "content-type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "transfer-encoding": "chunked",
      },
    }, (response) => {
      response.resume();
      response.on("end", () => resolve({ status: response.statusCode }));
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
  let senderProxy;
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
    senderProxy = await startSenderProxy();
    worker = await startWorker();

    await test("1. New asset signup creates a safe subscriber and owner notification", async () => {
      await reset();
      const response = await form("/api/subscribe", { email: "asset@example.test", form_id: "kit-invoice-chase" });
      assert(response.ok, "request failed");
      const all = await requests();
      const created = pathRequests(all, "/v2/subscribers", "POST");
      assert(created.length === 1 && created[0].body.groups.includes("invoice"), "asset group missing");
      assert(created[0].body.trigger_automation === false, "asset signup triggered consent automation");
      assert(!containsStatusField(created[0].body), "status field was written");
      assert(pathRequests(all, "/v2/message/send", "POST").length === 1, "asset lead notification missing");
    });

    await test("2. Explicit opt-in enters pending and triggers confirmation", async () => {
      await reset();
      const response = await form("/api/subscribe", {
        email: "optin@example.test", form_id: "course-waitlist", name: "Opt In",
        role: "personal", team_size: "solo", marketing_opt_in: "true",
      });
      const body = await response.json();
      assert(response.ok && body.marketing_pending === true, "pending consent not reported");
      const pending = pathRequests(await requests(), "/v2/subscribers/groups/pending", "POST");
      assert(pending.length === 1 && pending[0].body.trigger_automation === true, "confirmation automation not triggered");
    });

    await test("3. Existing active subscriber is patched without status mutation", async () => {
      await reset();
      await seed({ email: "active@example.test", status: { email: "active", temail: "active" } });
      assert((await form("/api/subscribe", { email: "active@example.test", form_id: "kit-invoice-chase" })).ok, "request failed");
      const patch = pathRequests(await requests(), "/v2/subscribers/:identifier", "PATCH");
      assert(patch.length === 1 && !containsStatusField(patch[0].body), "unsafe patch");
    });

    await test("4. Unsubscribed subscriber is never reactivated", async () => {
      await reset();
      await seed({ email: "off@example.test", status: { email: "unsubscribed", temail: "active" } });
      const response = await form("/api/subscribe", { email: "off@example.test", form_id: "newsletter" });
      assert(response.status === 503, "suppressed subscriber returned success");
      const all = await requests();
      assert(pathRequests(all, "/v2/subscribers/:identifier", "PATCH").length === 0, "suppressed subscriber was patched");
      assert(pathRequests(all, "/v2/subscribers/groups/pending", "POST").length === 0, "suppressed subscriber entered pending");
    });

    await test("5. Duplicate signups do not duplicate upstream writes", async () => {
      await reset();
      const fields = { email: "duplicate@example.test", form_id: "kit-invoice-chase" };
      assert((await form("/api/subscribe", fields)).ok, "first request failed");
      assert((await form("/api/subscribe", fields)).ok, "second request failed");
      const all = await requests();
      assert(pathRequests(all, "/v2/subscribers", "POST").length === 1, "subscriber created twice");
      assert(pathRequests(all, "/v2/message/send", "POST").length === 1, "identical retry notified twice");
    });

    await test("6. Same-day opt-in escalation is not swallowed", async () => {
      await reset();
      await form("/api/subscribe", { email: "escalate@example.test", form_id: "kit-invoice-chase" });
      assert((await form("/api/subscribe", { email: "escalate@example.test", form_id: "kit-invoice-chase", marketing_opt_in: "true" })).ok, "escalation failed");
      const all = await requests();
      assert(pathRequests(all, "/v2/subscribers/groups/pending", "POST").length === 1, "pending group missing");
      assert(pathRequests(all, "/v2/message/send", "POST").length === 2, "distinct second submission was not notified");
    });

    await test("7. Contact notifications are escaped and deduplicated", async () => {
      await reset();
      const fields = { name: "A\r\nBcc: bad@example.test", email: "contact@example.test", message: "<script>alert(1)</script>" };
      assert((await form("/api/contact", fields)).ok, "first contact failed");
      assert((await form("/api/contact", fields)).ok, "duplicate contact failed");
      const sent = pathRequests(await requests(), "/v2/message/send", "POST");
      assert(sent.length === 1, "contact notification duplicated");
      assert(!/[\r\n]/.test(sent[0].body.subject), "header injection survived");
      assert(sent[0].body.html?.containsEscapedScript && !sent[0].body.html?.containsRawScript, "HTML was not escaped");
    });

    await test("8. Workshop interests render as separate approved notification fields", async () => {
      await reset();
      const approvedInterests = [
        "Put Your Business Knowledge to Work",
        "Build One Useful AI Workflow",
        "Build Your Personal AI Assistant",
        "See Where AI Could Help Your Business",
      ];
      for (const [index, workshopInterest] of approvedInterests.entries()) {
        const response = await form("/api/contact", {
          name: `Workshop Host ${index + 1}`,
          email: `workshop-interest-${index + 1}@example.test`,
          message: `Please include the agenda and timing for workshop ${index + 1}.`,
          inquiry_type: "workshop-host",
          workshop_interest: workshopInterest,
          attribution: `s=workshop|interest=${index + 1}`,
        });
        assert(response.ok, `workshop contact ${index + 1} failed`);
      }
      assert(senderBodies.length === approvedInterests.length, "workshop notifications missing");
      approvedInterests.forEach((workshopInterest, index) => {
        const notification = senderBodies[index];
        assert(notification.text?.includes(`Message: Please include the agenda and timing for workshop ${index + 1}.`), "visitor message was not preserved");
        assert(notification.text?.includes(`Attribution: s=workshop|interest=${index + 1}`), "attribution was not preserved");
        assert(notification.text?.includes(`Workshop interest: ${workshopInterest}`), "approved workshop name was not rendered separately");
        assert(notification.html?.includes("Workshop interest") && notification.html?.includes(workshopInterest), "workshop interest missing from HTML notification");
      });
    });

    await test("9. Empty workshop interest remains optional and does not add a lead field", async () => {
      await reset();
      const response = await form("/api/contact", {
        name: "Uncertain Host",
        email: "workshop-empty@example.test",
        message: "I am still deciding what would help.",
        inquiry_type: "workshop-host",
        workshop_interest: "",
      });
      assert(response.ok, "empty workshop interest rejected");
      assert(senderBodies.length === 1, "empty workshop notification missing");
      assert(!senderBodies[0].text?.includes("Workshop interest:"), "empty workshop interest was stored");
    });

    await test("10. Unknown or duplicate workshop interest is rejected before Sender", async () => {
      await reset();
      const unknown = await form("/api/contact", {
        name: "Unknown Host",
        email: "workshop-unknown@example.test",
        message: "Please help me choose.",
        inquiry_type: "workshop-host",
        workshop_interest: "unknown-workshop",
      });
      assert(unknown.status === 400, "unknown workshop interest accepted");
      assert(senderBodies.length === 0, "unknown workshop interest reached Sender");
      const duplicate = await formEntries("/api/contact", [
        ["name", "Duplicate Host"],
        ["email", "workshop-duplicate@example.test"],
        ["message", "Please help me choose."],
        ["inquiry_type", "workshop-host"],
        ["workshop_interest", "Put Your Business Knowledge to Work"],
        ["workshop_interest", "Put Your Business Knowledge to Work"],
      ]);
      assert(duplicate.status === 400, "duplicate workshop interest accepted");
      assert(senderBodies.length === 0, "duplicate workshop interest reached Sender");
    });

    await test("11. Generic contact keeps its historical notification contract", async () => {
      await reset();
      const response = await form("/api/contact", {
        name: "General Contact",
        email: "generic-contact@example.test",
        message: "A general question for the site.",
        inquiry_type: "contact",
        attribution: "s=homepage|c=contact",
      });
      assert(response.ok, "generic contact failed");
      assert(senderBodies.length === 1, "generic contact notification missing");
      const notification = senderBodies[0];
      assert(notification.text?.includes("Message: A general question for the site."), "generic contact message changed");
      assert(notification.text?.includes("Attribution: s=homepage|c=contact"), "generic contact attribution changed");
      assert(!notification.text?.includes("Workshop interest:"), "generic contact gained workshop field");
    });

    await test("12. Workshop permission is honored", async () => {
      await reset();
      assert((await form("/api/subscribe", { email: "workshop@example.test", form_id: "workshop-next", comments: "Interested" })).ok, "workshop failed");
      let all = await requests();
      assert(pathRequests(all, "/v2/message/send", "POST").length === 1, "notification missing");
      assert(all.filter((request) => request.path.startsWith("/v2/subscribers") && request.method !== "GET").length === 0, "subscriber created without opt-in");
      await reset();
      assert((await form("/api/subscribe", { email: "workshop-optin@example.test", form_id: "workshop-next", comments: "Interested", marketing_opt_in: "true" })).ok, "opt-in failed");
      all = await requests();
      assert(pathRequests(all, "/v2/subscribers/groups/pending", "POST").length === 1, "opt-in did not enter pending");
    });

    await test("13. Scorecard sends its report and one owner notification", async () => {
      await reset();
      assert((await scorecard("scorecard@example.test")).ok, "scorecard failed");
      assert((await scorecard("scorecard@example.test", { marketing_opt_in: "true" })).ok, "opt-in escalation failed");
      const all = await requests();
      assert(pathRequests(all, "/v2/message/send", "POST").length === 2, "scorecard report or owner notification missing");
      assert(pathRequests(all, "/v2/subscribers/groups/pending", "POST").length === 1, "scorecard opt-in missing");
    });

    await test("14. Sender failures never falsely claim marketing capture", async () => {
      await reset();
      await configure({ "/v2/subscribers": 500 });
      const asset = await form("/api/subscribe", { email: "failure@example.test", form_id: "kit-invoice-chase", marketing_opt_in: "true" });
      const assetBody = await asset.json();
      assert(asset.ok && assetBody.marketing_captured === false, "failed capture was claimed");
      const newsletter = await form("/api/subscribe", { email: "newsletter-failure@example.test", form_id: "newsletter" });
      assert(newsletter.status === 503, "failed newsletter returned success");
    });

    await test("15. Invalid and oversized input does not call Sender", async () => {
      await reset();
      assert((await form("/api/subscribe", { email: "bad", form_id: "newsletter" })).status === 400, "invalid email accepted");
      assert((await form("/api/subscribe", { email: "valid@example.test", form_id: "nope" })).status === 400, "unknown form accepted");
      assert((await chunkedForm("/api/contact", { name: "A", email: "large@example.test", message: "x".repeat(33_000) })).status === 413, "oversized body accepted");
      assert((await requests()).filter((request) => !request.path.startsWith("/__")).length === 0, "invalid input called Sender");
    });

    await stop(worker);
    const todoGroups = JSON.parse(defaultGroupIds);
    todoGroups["source:direct"] = "TODO-replace-with-real-sender-group-id";
    worker = await startWorker({ groupIds: JSON.stringify(todoGroups) });
    await test("16. Direct placeholder group does not fail capture", async () => {
      await reset();
      const response = await form("/api/subscribe", {
        email: "bizmap-todo@example.test",
        form_id: "business-map",
        inquiry_type: "business-map-intake",
      });
      const body = await response.json();
      assert(response.ok && body.ok, "business-map failed");
      const all = await requests();
      const created = pathRequests(all, "/v2/subscribers", "POST");
      assert(created.length === 1, "subscriber not created");
      assert(!created[0].body.groups.includes("TODO-replace-with-real-sender-group-id"), "placeholder group was sent");
      assert(all.every((request) => !String(request.path).includes("TODO-replace")), "placeholder group endpoint called");
    });

    await stop(worker);
    worker = await startWorker({ emailDailyLimit: 1 });
    await test("17. Per-email rate limit blocks repeated intake", async () => {
      await reset();
      assert((await form("/api/subscribe", { email: "limited@example.test", form_id: "kit-invoice-chase" })).ok, "first request failed");
      assert((await form("/api/subscribe", { email: "limited@example.test", form_id: "kit-invoice-chase" })).status === 429, "second request was not limited");
    });

    await stop(worker);
    worker = await startWorker({ sender: false });
    await test("18. Missing Sender configuration fails closed for newsletter and reports", async () => {
      await reset();
      assert((await form("/api/subscribe", { email: "disabled@example.test", form_id: "newsletter" })).status === 503, "newsletter failed open");
      assert((await scorecard("disabled-scorecard@example.test")).status === 503, "scorecard failed open");
      assert((await requests()).filter((request) => request.path.startsWith("/v2/")).length === 0, "Sender was called without configuration");
    });

    await stop(worker);
    worker = await startWorker({ turnstile: true });
    await test("19. Turnstile blocks missing or invalid tokens before lead processing", async () => {
      await reset();
      assert((await form("/api/subscribe", { email: "missing-token@example.test", form_id: "newsletter" })).status === 403, "missing token accepted");
      assert((await form("/api/contact", { name: "Test", email: "invalid-token@example.test", message: "Hello", "cf-turnstile-response": "invalid-token" })).status === 403, "invalid token accepted");
      assert((await scorecard("valid-scorecard@example.test", { "cf-turnstile-response": "valid-token-scorecard" })).ok, "valid scorecard token rejected");
      assert((await form("/api/subscribe", { email: "valid-token@example.test", form_id: "kit-invoice-chase", "cf-turnstile-response": "valid-token-subscribe" })).ok, "valid subscribe token rejected");
      assert((await form("/api/contact", { name: "Valid Contact", email: "valid-contact@example.test", message: "Hello", "cf-turnstile-response": "valid-token-contact" })).ok, "valid contact token rejected");
      const all = await requests();
      assert(pathRequests(all, "/turnstile/siteverify", "POST").length === 4, "unexpected verification call count");
      assert(pathRequests(all, "/v2/subscribers", "POST").length === 2, "blocked leads reached Sender or valid leads did not");
    });
  } finally {
    await stop(worker);
    await new Promise((resolve) => senderProxy?.close(resolve));
    await stop(mock);
    rmSync(stateDir, { recursive: true, force: true });
    for (const [name, result] of results) console.log(`${result} ${name}`);
  }

  assert(results.length === 19 && results.every(([, result]) => result === "PASS"), "not all Sender tests passed");
}

run().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
