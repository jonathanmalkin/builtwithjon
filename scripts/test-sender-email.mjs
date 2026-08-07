import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { request as httpRequest } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";

const basePort = Number(process.env.EMAIL_TEST_BASE_PORT || (20_000 + ((process.pid * 2) % 30_000)));
const mockPort = basePort;
const workerPort = basePort + 1;
const mockBase = `http://127.0.0.1:${mockPort}`;
const workerBase = `http://127.0.0.1:${workerPort}`;
const stateDir = mkdtempSync(join(tmpdir(), `bwj-sender-test-${process.pid}-`));
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
  sender = true,
  emailDailyLimit = 1000,
  globalDailyLimit = 1000,
  groupIds = defaultGroupIds,
  hashSalt = "local-test-only-secret",
  timeoutMs = 8_000,
} = {}) {
  const args = [
    "dev", "--local", "--port", String(workerPort),
    "--persist-to", stateDir,
    "--var", `SENDER_API_BASE:${mockBase}/v2`,
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
      Origin: workerBase,
      "content-type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams(fields),
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

    await test("8. Workshop permission is honored", async () => {
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

    await test("9. Scorecard sends its report and one owner notification", async () => {
      await reset();
      assert((await scorecard("scorecard@example.test")).ok, "scorecard failed");
      assert((await scorecard("scorecard@example.test", { marketing_opt_in: "true" })).ok, "opt-in escalation failed");
      const all = await requests();
      assert(pathRequests(all, "/v2/message/send", "POST").length === 2, "scorecard report or owner notification missing");
      assert(pathRequests(all, "/v2/subscribers/groups/pending", "POST").length === 1, "scorecard opt-in missing");
    });

    await test("10. Sender failures never falsely claim marketing capture", async () => {
      await reset();
      await configure({ "/v2/subscribers": 500 });
      const asset = await form("/api/subscribe", { email: "failure@example.test", form_id: "kit-invoice-chase", marketing_opt_in: "true" });
      const assetBody = await asset.json();
      assert(asset.ok && assetBody.marketing_captured === false, "failed capture was claimed");
      const newsletter = await form("/api/subscribe", { email: "newsletter-failure@example.test", form_id: "newsletter" });
      assert(newsletter.status === 503, "failed newsletter returned success");
    });

    await test("11. Invalid and oversized input does not call Sender", async () => {
      await reset();
      assert((await form("/api/subscribe", { email: "bad", form_id: "newsletter" })).status === 400, "invalid email accepted");
      assert((await form("/api/subscribe", { email: "valid@example.test", form_id: "nope" })).status === 400, "unknown form accepted");
      assert((await chunkedForm("/api/contact", { name: "A", email: "large@example.test", message: "x".repeat(33_000) })).status === 413, "oversized body accepted");
      assert((await requests()).filter((request) => !request.path.startsWith("/__")).length === 0, "invalid input called Sender");
    });

    await stop(worker);
    worker = await startWorker({ emailDailyLimit: 1 });
    await test("12. Per-email rate limit blocks repeated intake", async () => {
      await reset();
      assert((await form("/api/subscribe", { email: "limited@example.test", form_id: "kit-invoice-chase" })).ok, "first request failed");
      assert((await form("/api/subscribe", { email: "limited@example.test", form_id: "kit-invoice-chase" })).status === 429, "second request was not limited");
    });

    await stop(worker);
    worker = await startWorker({ sender: false });
    await test("13. Missing Sender configuration fails closed for newsletter and reports", async () => {
      await reset();
      assert((await form("/api/subscribe", { email: "disabled@example.test", form_id: "newsletter" })).status === 503, "newsletter failed open");
      assert((await scorecard("disabled-scorecard@example.test")).status === 503, "scorecard failed open");
      assert((await requests()).filter((request) => request.path.startsWith("/v2/")).length === 0, "Sender was called without configuration");
    });
  } finally {
    await stop(worker);
    await stop(mock);
    rmSync(stateDir, { recursive: true, force: true });
    for (const [name, result] of results) console.log(`${result} ${name}`);
  }

  assert(results.length === 13 && results.every(([, result]) => result === "PASS"), "not all Sender tests passed");
}

run().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
