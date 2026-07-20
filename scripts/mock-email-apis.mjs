import http from "node:http";

const port = Number(process.env.PORT || process.argv[2] || 8791);
const requests = [];
const subscribers = new Map();
const failures = new Map();

function record(request, body) {
  const headers = { ...request.headers };
  delete headers.authorization;
  delete headers.cookie;
  const rawPath = new URL(request.url, `http://${request.headers.host}`).pathname;
  const path = rawPath.startsWith("/v2/subscribers/")
    && !rawPath.startsWith("/v2/subscribers/groups/")
    ? "/v2/subscribers/:identifier"
    : rawPath;
  requests.push({
    method: request.method,
    path,
    headers,
    body: sanitizeRecordedBody(body),
  });
}

function sanitizeRecordedBody(value, key = "") {
  if (typeof value === "string") {
    if (key === "html") {
      return {
        redacted: true,
        containsRawScript: value.includes("<script>"),
        containsEscapedScript: value.includes("&lt;script&gt;"),
      };
    }
    return "[redacted]";
  }
  if (Array.isArray(value)) return value.map((item) => sanitizeRecordedBody(item, key));
  if (!value || typeof value !== "object") return value;
  const safe = {};
  for (const [childKey, childValue] of Object.entries(value)) {
    if (["groups", "trigger_automation", "email_status", "subscriber_status", "transactional_email_status", "status"].includes(childKey)) {
      safe[childKey] = childValue;
    } else {
      safe[childKey] = sanitizeRecordedBody(childValue, childKey);
    }
  }
  return safe;
}

function send(response, status, body) {
  response.writeHead(status, { "content-type": "application/json" });
  response.end(JSON.stringify(body));
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString();
  const contentType = request.headers["content-type"] || "";
  if (contentType.includes("application/json")) {
    try { return JSON.parse(raw); } catch { return raw; }
  }
  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(raw));
  }
  return raw;
}

const server = http.createServer(async (request, response) => {
  if (![ `127.0.0.1:${port}`, `localhost:${port}` ].includes(request.headers.host || "")) {
    return send(response, 400, { message: "invalid test host" });
  }
  const url = new URL(request.url, `http://${request.headers.host}`);
  const body = await readBody(request);
  record(request, body);

  if (request.method === "GET" && url.pathname === "/__requests") return send(response, 200, { requests });
  if (request.method === "POST" && url.pathname === "/__reset") {
    requests.length = 0;
    subscribers.clear();
    failures.clear();
    return send(response, 200, { ok: true });
  }
  if (request.method === "POST" && url.pathname === "/__subscribers") {
    subscribers.set(String(body.email).toLowerCase(), body);
    return send(response, 200, { ok: true });
  }
  if (request.method === "POST" && url.pathname === "/__config") {
    failures.clear();
    for (const [path, failure] of Object.entries(body.failures || {})) {
      failures.set(path, typeof failure === "number" ? { status: failure } : failure);
    }
    return send(response, 200, { ok: true });
  }
  if (request.method === "POST" && url.pathname === "/__confirm") {
    const email = String(body.email || "").toLowerCase();
    const subscriber = subscribers.get(email);
    if (!subscriber) return send(response, 404, { message: "subscriber not found" });
    subscribers.set(email, {
      ...subscriber,
      groups: [...new Set([...(subscriber.groups || []).filter((group) => group !== "pending"), "confirmed", "newsletter"])],
    });
    return send(response, 200, { ok: true });
  }
  if (request.method === "GET" && url.pathname === "/__state") {
    return send(response, 200, { subscribers: [...subscribers.values()] });
  }

  const failure = failures.get(url.pathname);
  if (failure?.delayMs) await new Promise((resolve) => setTimeout(resolve, Number(failure.delayMs)));
  if (failure?.disconnect) return response.destroy();
  if (failure?.status) return send(response, Number(failure.status), { message: "forced mock failure" });

  if (request.method === "GET" && url.pathname.startsWith("/v2/subscribers/")) {
    const email = decodeURIComponent(url.pathname.slice("/v2/subscribers/".length)).toLowerCase();
    const subscriber = subscribers.get(email);
    return subscriber ? send(response, 200, { data: subscriber }) : send(response, 404, { message: "not found" });
  }
  if (request.method === "POST" && url.pathname === "/v2/subscribers") {
    if (!body.email || !Array.isArray(body.groups) || body.trigger_automation !== false) {
      return send(response, 422, { message: "invalid subscriber contract" });
    }
    subscribers.set(String(body.email).toLowerCase(), {
      ...body,
      status: { email: "active", temail: "active" },
    });
    return send(response, 201, {
      success: true,
      message: [],
      data: subscribers.get(String(body.email).toLowerCase()),
    });
  }
  if (request.method === "PATCH" && url.pathname.startsWith("/v2/subscribers/")) {
    if (body.trigger_automation !== false || ["subscriber_status", "email_status", "transactional_email_status", "status", "channels"].some((key) => key in body)) {
      return send(response, 422, { message: "invalid subscriber update contract" });
    }
    const email = decodeURIComponent(url.pathname.slice("/v2/subscribers/".length)).toLowerCase();
    subscribers.set(email, { ...(subscribers.get(email) || {}), ...body, email });
    return send(response, 200, { success: true, message: "Success", data: [] });
  }
  if (request.method === "POST" && url.pathname.startsWith("/v2/subscribers/groups/")) {
    if (!Array.isArray(body.subscribers) || typeof body.trigger_automation !== "boolean") {
      return send(response, 422, { message: "invalid group contract" });
    }
    const group = decodeURIComponent(url.pathname.slice("/v2/subscribers/groups/".length));
    for (const value of body.subscribers) {
      const email = String(value || "").toLowerCase();
      const subscriber = subscribers.get(email) || { email, status: { email: "active", temail: "active" } };
      subscribers.set(email, { ...subscriber, groups: [...new Set([...(subscriber.groups || []), group])] });
    }
    return send(response, 200, {
      success: true,
      message: { subscribers_added_to_group: body.subscribers, non_existing_subscribers: [] },
    });
  }
  if (request.method === "POST" && url.pathname === "/v2/message/send") {
    const replyTo = body.headers?.["Reply-To"];
    if (!body.from?.email || !body.from?.name || !body.to?.email || !body.subject
      || (!body.html && !body.text) || (replyTo && /[\r\n]/.test(replyTo))) {
      return send(response, 422, { message: "invalid transactional contract" });
    }
    return send(response, 200, { success: true, emailId: "sender-message-1" });
  }
  if (request.method === "POST" && url.pathname === "/emails") return send(response, 200, { id: "resend-message-1" });
  if (request.method === "POST" && url.pathname === "/f/xdapgpae") {
    const contentType = request.headers["content-type"] || "";
    if (!contentType.includes("application/x-www-form-urlencoded")
      || !body || typeof body !== "object" || Array.isArray(body)
      || !body._subject || !body.email) {
      return send(response, 422, { ok: false, message: "invalid Formspree contract" });
    }
    return send(response, 200, { ok: true });
  }

  return send(response, 404, { message: "mock route not found" });
});

server.listen(port, "127.0.0.1", () => console.log(`Mock email APIs listening on http://127.0.0.1:${port}`));
