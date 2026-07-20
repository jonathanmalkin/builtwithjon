const DEFAULT_BASE = "https://api.sender.net/v2";

export async function senderGetSubscriber(env, email) {
  const url = `${senderBase(env)}/subscribers/${encodeURIComponent(email)}`;
  let response;

  try {
    response = await senderFetch(env, url, { method: "GET" });
  } catch (error) {
    // Sender does not offer idempotency for writes. GET is the sole request we
    // retry, and only when no HTTP response was received.
    response = await senderFetch(env, url, { method: "GET" });
  }

  if (response.status === 404) return null;
  const body = await readJson(response);
  if (!response.ok) throw senderError("get_subscriber", response, body);
  return body?.data || body?.subscriber || body;
}

export async function senderUpsertSubscriber(env, {
  email,
  firstname,
  lastname,
  groups = [],
  fields = {},
  automationGroupIds = [],
}) {
  const existing = await senderGetSubscriber(env, email);
  const safeFields = Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== "" && value != null));

  if (existing) {
    const marketingStatuses = senderChannelStatuses(existing, "marketing");
    const marketingStatus = senderChannelStatus(existing, "marketing");
    const transactionalStatus = senderChannelStatus(existing, "transactional");
    if (!marketingStatuses.length || !marketingStatuses.every((status) => status === "active")) {
      return { existing: true, suppressed: true, marketingStatus, transactionalStatus, subscriber: existing };
    }

    const patch = { firstname, lastname, fields: safeFields, trigger_automation: false };
    const response = await senderFetch(env, `${senderBase(env)}/subscribers/${encodeURIComponent(email)}`, {
      method: "PATCH",
      headers: jsonHeaders(env),
      body: JSON.stringify(patch),
    });
    const body = await readJson(response);
    if (!response.ok) throw senderError("update_subscriber", response, body);

    const automationGroups = new Set(automationGroupIds.map(String));
    for (const groupId of groups) {
      const groupResponse = await senderFetch(env, `${senderBase(env)}/subscribers/groups/${encodeURIComponent(groupId)}`, {
        method: "POST",
        headers: jsonHeaders(env),
        body: JSON.stringify({
          subscribers: [email],
          trigger_automation: automationGroups.has(String(groupId)),
        }),
      });
      const groupBody = await readJson(groupResponse);
      if (!groupResponse.ok) throw senderError("add_subscriber_group", groupResponse, groupBody);
    }

    return { existing: true, suppressed: false, marketingStatus, transactionalStatus, subscriber: body?.data || body };
  }

  const automationGroups = new Set(automationGroupIds.map(String));
  const passiveGroups = groups.filter((groupId) => !automationGroups.has(String(groupId)));
  const response = await senderFetch(env, `${senderBase(env)}/subscribers`, {
    method: "POST",
    headers: jsonHeaders(env),
    body: JSON.stringify({
      email,
      firstname,
      lastname,
      groups: passiveGroups,
      fields: safeFields,
      trigger_automation: false,
    }),
  });
  const body = await readJson(response);
  if (!response.ok) throw senderError("create_subscriber", response, body);
  const subscriber = await senderGetSubscriber(env, email);
  const marketingStatuses = senderChannelStatuses(subscriber, "marketing");
  const transactionalStatus = senderChannelStatus(subscriber, "transactional");
  const suppressed = !marketingStatuses.length || !marketingStatuses.every((status) => status === "active");
  if (suppressed) {
    return {
      existing: false,
      suppressed: true,
      marketingStatus: senderChannelStatus(subscriber, "marketing"),
      transactionalStatus,
      subscriber,
    };
  }
  for (const groupId of automationGroups) {
    const groupResponse = await senderFetch(env, `${senderBase(env)}/subscribers/groups/${encodeURIComponent(groupId)}`, {
      method: "POST",
      headers: jsonHeaders(env),
      body: JSON.stringify({ subscribers: [email], trigger_automation: true }),
    });
    const groupBody = await readJson(groupResponse);
    if (!groupResponse.ok) throw senderError("add_subscriber_group", groupResponse, groupBody);
  }
  return {
    existing: false,
    suppressed,
    marketingStatus: senderChannelStatus(subscriber, "marketing"),
    transactionalStatus,
    subscriber,
  };
}

export async function senderAssertTransactionalDeliverable(env, to) {
  try {
    const existing = await senderGetSubscriber(env, to);
    if (!existing) return { deliverable: true, subscriber: null };
    if (isTransactionalDeliverable(existing)) return { deliverable: true, subscriber: existing };
    const error = new Error("sender_transactional_recipient_suppressed");
    error.operation = "check_transactional_status";
    error.suppressed = true;
    throw error;
  } catch (error) {
    if (!error?.suppressed) error.inconclusiveStatus = true;
    throw error;
  }
}

export async function senderTransactionalSend(env, { to, subject, html, text, replyTo, variables = {}, checkRecipientStatus = false }) {
  if (checkRecipientStatus) await senderAssertTransactionalDeliverable(env, to);
  const response = await senderFetch(env, `${senderBase(env)}/message/send`, {
    method: "POST",
    headers: jsonHeaders(env),
    body: JSON.stringify({
      from: parseSenderFrom(env.SENDER_FROM),
      to: { email: to },
      subject,
      html,
      text,
      ...(replyTo ? { headers: { "Reply-To": replyTo } } : {}),
      variables,
    }),
  });
  const body = await readJson(response);
  if (!response.ok) throw senderError("send_transactional", response, body);
  return { ok: true, id: body?.emailId || body?.id || body?.data?.emailId || body?.data?.id || null };
}

function senderBase(env) {
  return String(env.SENDER_API_BASE || DEFAULT_BASE).replace(/\/$/, "");
}

function senderFetch(env, url, init) {
  const timeout = Number(env.SENDER_TIMEOUT_MS || 8_000);
  return fetch(url, {
    ...init,
    signal: init.signal || AbortSignal.timeout(Number.isFinite(timeout) ? timeout : 8_000),
    headers: {
      Authorization: `Bearer ${env.SENDER_API_TOKEN}`,
      ...(init.headers || {}),
    },
  });
}

function jsonHeaders(env) {
  return {
    Authorization: `Bearer ${env.SENDER_API_TOKEN}`,
    "Content-Type": "application/json",
  };
}

export function parseSenderFrom(value) {
  const source = String(value || "").trim();
  const match = source.match(/^(.*?)\s*<([^>]+)>$/);
  const parsed = match ? { name: match[1].trim(), email: match[2].trim() } : { name: "", email: source };
  if (!parsed.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed.email || "")) {
    throw new Error("sender_from_invalid");
  }
  return parsed;
}

export function senderChannelStatus(subscriber, channel) {
  const statuses = senderChannelStatuses(subscriber, channel);
  return statuses.find(isSuppressedStatus) || statuses[0] || "";
}

export function senderChannelStatuses(subscriber, channel) {
  const marketingValues = [
    subscriber?.email_status,
    subscriber?.subscriber_status,
    subscriber?.status?.email,
    subscriber?.channels?.email?.status,
    typeof subscriber?.email === "object" ? subscriber.email?.status : null,
  ];
  const transactionalValues = [
    subscriber?.transactional_email_status,
    subscriber?.temail,
    subscriber?.status?.transactional_email,
    subscriber?.status?.temail,
    subscriber?.channels?.transactional_email?.status,
  ];
  const values = channel === "transactional" ? transactionalValues : marketingValues;
  return [...new Set(values
    .filter((value) => typeof value === "string" && value.trim())
    .map(normalizeStatus))];
}

export function isSuppressedStatus(value) {
  return ["unsubscribed", "bounced", "reported_spam", "spam_reported", "complained"].includes(normalizeStatus(value));
}

export function isTransactionalDeliverable(subscriber) {
  const statuses = senderChannelStatuses(subscriber, "transactional");
  return statuses.length > 0 && statuses.every((status) => status === "active");
}

function normalizeStatus(value) {
  return String(value || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function senderError(operation, response, body) {
  const error = new Error(`sender_${operation}_failed`);
  error.status = response.status;
  error.operation = operation;
  error.providerCode = String(body?.code || body?.error?.code || "").slice(0, 80);
  return error;
}
