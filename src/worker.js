import {
  SEGMENTS,
  LINES,
  TIER_VERDICTS,
  FIRST_MOVES,
  AXIS_LABELS,
  tierFor,
  compositeScore,
  segmentBusinessPhrase,
  segmentBusinessPlural,
} from "./data/scorecard";
import { CALCS } from "./data/leak-calculators";
import { isMcpRequest, handleMcp } from "./mcp/handler";
import {
  parseSenderFrom,
  senderAssertTransactionalDeliverable,
  senderTransactionalSend,
  senderUpsertSubscriber,
} from "./lib/sender";

const DEFAULT_FORMSPREE_ENDPOINT = "https://formspree.io/f/xdapgpae";
const SCORECARD_REPORT_PATH = "/api/scorecard-report";
const SUBSCRIBE_PATH = "/api/subscribe";
const CONTACT_PATH = "/api/contact";
const MAX_FORM_BODY_BYTES = 32_000;
const MAX_SCORECARD_BODY_BYTES = 32_000;
const EVENT_PATH = "/api/event";
const MAX_EVENT_BODY_BYTES = 2048;
const AGENT_DOWNLOAD_URL = "https://builtwithjon.com/ai-assistant/cowork/personal-assistant-cowork-plugin.zip";
const AGENT_SHORT_PATHS = new Set(["/agent", "/agent/"]);
const PERMANENT_REDIRECTS = new Map([
  ["/workshops", "/ai-assistant/"],
  ["/workshops/", "/ai-assistant/"],
  ["/ai-assistant-workshop", "/ai-assistant/"],
  ["/ai-assistant-workshop/", "/ai-assistant/"],
  ["/ai-assistant-workshop/thanks", "/ai-assistant/"],
  ["/ai-assistant-workshop/thanks/", "/ai-assistant/"],
  ["/ai-assistant-workshop-austin", "/ai-assistant/"],
  ["/ai-assistant-workshop-austin/", "/ai-assistant/"],
  ["/ai-assistant/claude-code", "/ai-assistant/course/"],
  ["/ai-assistant/claude-code/", "/ai-assistant/course/"],
]);
const MCP_REGISTRY_AUTH_PATH = "/.well-known/mcp-registry-auth";
const MCP_REGISTRY_AUTH_PROOF =
  "v=MCPv1; k=ecdsap384; p=AvUGKTlupoWJNtt1rtl5R5SD9Z3yK59b7dTHmdbt53BWO/EqQARKJm+V22+awwN/HA==";
const ALLOWED_EVENT_NAMES = new Set([
  "contact:start", "contact:submit",
  "cta:scorecard-article", "cta:scorecard-article-s2", "cta:scorecard-article-s3",
  "cta:scorecard-contact", "cta:scorecard-final", "cta:scorecard-footer",
  "cta:scorecard-frontdoor", "cta:scorecard-hero", "cta:scorecard-nav",
  "cta:scorecard-waitlist", "cta:usecases-article", "cta:waitlist-article",
  "cta:waitlist-contact", "cta:waitlist-final", "cta:waitlist-scorecard",
  "hpr-waitlist:start", "hpr-waitlist:submit", "hpr-waitlist:success", "hpr:sample-click",
  "lead-magnet:start", "lead-magnet:submit", "leakcalc:unlock",
  "newsletter:start", "newsletter:submit",
  "private-workshop:start", "private-workshop:submit", "private-workshop:success",
  "scorecard:result", "scorecard:gate-success", "scorecard-gate:start", "scorecard-gate:submit",
  "starter-kit:start", "starter-kit:submit",
  "tools:view", "tools:start:scorecard", "tools:start:calculator",
  "tools:start:use-cases", "tools:copy-prompt", "tools:copy:chatgpt",
  "tools:open:claude", "tools:hpr-click",
  "waitlist:sample-click", "waitlist:usecases-click",
  "workshop-waitlist:start", "workshop-waitlist:submit", "workshop-waitlist:success",
]);
const ALLOWED_CALCULATOR_EVENTS = new Set(CALCS.map((calculator) => `leakcalc:pick:${calculator.id}`));
const FORM_MAP = {
  newsletter: { groups: [], fields: {}, allowed: ["source", "source_url"] },
  "workshop-next": { groups: [], fields: {}, allowed: ["comments"] },
  "hpr-waitlist": {
    groups: ["offer:hidden-profit-review"],
    fields: { company: "company", biggest_leak: "biggest_leak" },
    allowed: ["company", "biggest_leak"],
    required: ["name", "biggest_leak"],
    enums: { biggest_leak: ["Losing deals", "Losing time", "Cash coming in slow", "Not sure yet"] },
  },
  "kit-invoice-chase": { groups: ["asset:invoice-chase-kit"], fields: {}, allowed: ["which_kit"] },
  "kit-follow-up-swipe-file": { groups: ["asset:follow-up-swipe-file"], fields: {}, allowed: ["which_kit"] },
  "tool-leak-calculator": { groups: ["asset:leak-calculator"], fields: {}, allowed: ["which_kit"] },
  "starter-kit-cowork": { groups: ["asset:starter-kit-cowork"], fields: {}, allowed: ["which_kit"] },
  "course-waitlist": {
    groups: ["offer:email-course"],
    fields: { role: "role", team_size: "team_size", company: "company", cohort: "cohort" },
    allowed: ["role", "team_size", "company", "cohort"],
    required: ["name", "role", "team_size"],
    enums: { role: ["owner", "team-lead", "personal"], team_size: ["solo", "2-10", "11-50", "50+"] },
  },
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // The slash path is documentation only. Keeping every protocol method on
    // exact /mcp prevents alternate-path bypasses of the exact-path WAF rule.
    if (url.pathname === "/mcp/" && request.method !== "GET") {
      return new Response(null, { status: 405, headers: { Allow: "GET" } });
    }

    // MCP server (POST /mcp + preflight + SSE-GET rejection); plain browser
    // GETs on /mcp fall through to the static docs page.
    if (isMcpRequest(url, request)) {
      return handleMcp(request, env);
    }

    if (AGENT_SHORT_PATHS.has(url.pathname)) {
      return Response.redirect(AGENT_DOWNLOAD_URL, 302);
    }

    const permanentTarget = PERMANENT_REDIRECTS.get(url.pathname);
    if (permanentTarget) {
      url.pathname = permanentTarget;
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === MCP_REGISTRY_AUTH_PATH && request.method === "GET") {
      return new Response(`${MCP_REGISTRY_AUTH_PROOF}\n`, {
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=300" },
      });
    }

    if (url.pathname === SCORECARD_REPORT_PATH) {
      return handleScorecardReport(request, env);
    }

    if (url.pathname === SUBSCRIBE_PATH) {
      return handleSubscribe(request, env);
    }

    if (url.pathname === CONTACT_PATH) {
      return handleContact(request, env);
    }

    if (url.pathname === EVENT_PATH) {
      return handleEvent(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleScorecardReport(request, env) {
  if (request.method !== "POST") {
    return json({ ok: false, error: "method_not_allowed" }, 405);
  }

  if (!originAllowed(request)) {
    return json({ ok: false, error: "origin_not_allowed" }, 403);
  }

  const parsed = await boundedRequestData(request, MAX_SCORECARD_BODY_BYTES);
  if (parsed.tooLarge) return json({ ok: false, error: "payload_too_large" }, 413);
  const form = parsed.form;
  if (!form) return json({ ok: false, error: "invalid_form" }, 400);

  if (String(form.get("company_website") || "").trim()) {
    return json({ ok: true, ignored: true });
  }

  const payload = normalizePayload(form, request);
  if (!payload.email) {
    return json({ ok: false, error: "valid_email_required" }, 400);
  }
  const rate = await enforceRateLimits(env, request, payload.email, "scorecard");
  if (!rate.ok) return json({ ok: false, error: "rate_limited" }, 429);

  const report = buildReport(payload, env);
  const idempotencyKey = await stableKey(payload);
  const provider = env.EMAIL_PROVIDER || "resend";
  const senderConfigured = provider === "sender" && senderEnabled(env);
  const senderBudgetAvailable = !senderConfigured || (await consumeSenderBudget(env)).ok;
  const useSender = senderConfigured && senderBudgetAvailable;
  if (senderConfigured && !senderBudgetAvailable) logOperational("sender_budget_exhausted", { route: "scorecard" });

  const formspreeKey = `scorecard:formspree:${idempotencyKey}`;
  const formspreeDuplicate = await dedupeHit(env, formspreeKey);
  if (shouldDualWriteFormspree(env) && !formspreeDuplicate) {
    const formspree = await submitLeadToFormspree(payload, env);
    if (!formspree.ok) {
      logOperational("scorecard_formspree_failed", { status: formspree.status });
      return json({ ok: false, error: "lead_capture_failed" }, 502);
    }
    await markDedupe(env, formspreeKey);
  }

  const deliveryKey = `scorecard:delivery:${idempotencyKey}`;
  const deliveryDuplicate = await dedupeHit(env, deliveryKey);
  let delivery = { ok: true, id: null };
  let senderSuppressed = false;
  let senderStatusInconclusive = false;
  if (!deliveryDuplicate && useSender) {
    try {
      validateSenderConfig(env);
      delivery = await sendReportEmailSender(report, env);
    } catch (error) {
      logOperational("scorecard_sender_failed", { operation: error?.operation, status: error?.status });
      senderSuppressed = error?.suppressed === true;
      senderStatusInconclusive = error?.inconclusiveStatus === true;
      delivery = { ok: false };
    }
  }
  if (senderSuppressed) return json({ ok: false, error: "recipient_suppressed" }, 502);
  if (senderStatusInconclusive) return json({ ok: false, error: "recipient_status_unavailable" }, 502);
  if (!deliveryDuplicate && (!useSender || !delivery.ok)) {
    if (senderConfigured && !senderBudgetAvailable) {
      try {
        await senderAssertTransactionalDeliverable(env, report.to);
      } catch (error) {
        return json({
          ok: false,
          error: error?.suppressed ? "recipient_suppressed" : "recipient_status_unavailable",
        }, 502);
      }
    }
    if (!env.RESEND_API_KEY || !env.RESEND_FROM) {
      return useSender
        ? json({ ok: false, error: "report_send_failed" }, 502)
        : json({ ok: false, error: "resend_not_configured" }, 503);
    }
    delivery = await sendReportEmailResend(report, env, idempotencyKey);
  }

  if (!delivery.ok) {
    logOperational("scorecard_report_failed", { status: delivery.status, provider });
    return json({ ok: false, error: "report_send_failed" }, 502);
  }
  if (!deliveryDuplicate) await markDedupe(env, deliveryKey);

  if (useSender) {
    const leadKey = `scorecard:lead:${idempotencyKey}`;
    const consentKey = `scorecard:consent:${payload.email}`;
    const leadDuplicate = await dedupeHit(env, leadKey);
    const consentDuplicate = !payload.marketing_opt_in || await dedupeHit(env, consentKey);
    if (!leadDuplicate || !consentDuplicate) {
      try {
        const upsert = await upsertScorecardLead(payload, env);
        if (!upsert.suppressed) {
          await markDedupe(env, leadKey);
          if (payload.marketing_opt_in) await markDedupe(env, consentKey);
        }
      } catch (error) {
        logOperational("scorecard_subscriber_failed", { operation: error?.operation, status: error?.status });
      }
    }
  }

  return json({ ok: true, duplicate: deliveryDuplicate, report_id: delivery.id || null });
}

async function handleSubscribe(request, env) {
  if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
  if (!originAllowed(request)) return json({ ok: false, error: "origin_not_allowed" }, 403);
  const parsed = await boundedRequestData(request, MAX_FORM_BODY_BYTES);
  if (parsed.tooLarge) return json({ ok: false, error: "payload_too_large" }, 413);
  const form = parsed.form;
  if (!form) return json({ ok: false, error: "invalid_form" }, 400);
  if (safeText(form.get("company_website"), 200)) return json({ ok: true, ignored: true });
  const formId = safeText(form.get("form_id"), 80);
  const config = FORM_MAP[formId];
  if (!config) return json({ ok: false, error: "unknown_form_id" }, 400);
  if (!validateMappedForm(form, config)) return json({ ok: false, error: "invalid_form_fields" }, 400);
  const email = normalizeEmail(form.get("email"));
  if (!email) return json({ ok: false, error: "valid_email_required" }, 400);
  const rate = await enforceRateLimits(env, request, email, `subscribe:${formId}`);
  if (!rate.ok) return json({ ok: false, error: "rate_limited" }, 429);

  const name = safeText(form.get("name"), 120);
  const extras = Object.fromEntries(config.allowed.map((key) => [key, safeText(form.get(key), 240)]).filter(([, value]) => value));
  const optIn = isTrue(form.get("marketing_opt_in"));
  const wantsMarketing = formId === "newsletter" || optIn;
  const senderCaptureKey = `sender-capture:${email}:${formId}`;
  const senderNotificationKey = `sender-notification:${email}:${formId}`;
  const formspreeKey = `formspree:${email}:${formId}`;
  const consentKey = `consent:${email}:${formId}`;
  const senderCaptureDuplicate = await dedupeHit(env, senderCaptureKey);
  const senderNotificationDuplicate = await dedupeHit(env, senderNotificationKey);
  const formspreeDuplicate = await dedupeHit(env, formspreeKey);
  const consentDuplicate = !wantsMarketing || await dedupeHit(env, consentKey);
  const senderIsEnabled = senderEnabled(env);
  const needsSenderNotification = senderIsEnabled && formId === "workshop-next" && !senderNotificationDuplicate;
  const needsSenderCapture = senderIsEnabled
    && (((formId !== "workshop-next") && !senderCaptureDuplicate) || !consentDuplicate);
  const needsFormspree = shouldDualWriteFormspree(env) && !formspreeDuplicate;
  if (!needsSenderNotification && !needsSenderCapture && !needsFormspree) {
    if (!senderIsEnabled && !shouldDualWriteFormspree(env)) {
      return json({ ok: false, error: "submission_not_configured" }, 503);
    }
    return json({ ok: true, duplicate: true });
  }
  const senderBudgetAvailable = (!needsSenderNotification && !needsSenderCapture)
    || (await consumeSenderBudget(env)).ok;
  if (!senderBudgetAvailable) logOperational("sender_budget_exhausted", { route: "subscribe" });

  let senderCaptureSucceeded = senderCaptureDuplicate;
  let senderNotificationSucceeded = senderNotificationDuplicate;
  let consentSucceeded = false;
  let senderAttempted = false;
  if (senderBudgetAvailable && (needsSenderNotification || needsSenderCapture)) {
    senderAttempted = true;
    try {
      validateSenderConfig(env);
      if (needsSenderNotification) {
        await senderTransactionalSend(env, {
          to: "jonathan@builtwithjon.com",
          subject: "Cowork workshop: What's Next",
          replyTo: email,
          text: `Email: ${email}\n\n${extras.comments || "(No comments provided)"}`,
          html: `<p><strong>Email:</strong> ${escapeHtml(email)}</p><p>${escapeHtml(extras.comments || "(No comments provided)").replace(/\n/g, "<br>")}</p>`,
          checkRecipientStatus: true,
        });
        senderNotificationSucceeded = true;
        await markDedupe(env, senderNotificationKey);
      }
      if (needsSenderCapture) {
        const fields = !senderCaptureDuplicate ? { ...mapFields(config.fields, extras) } : {};
        if (!consentDuplicate) {
          fields.consent_requested_at = new Date().toISOString();
          fields.consent_source = formId;
        }
        const groupSlugs = [
          ...(!senderCaptureDuplicate ? config.groups : []),
          ...(!consentDuplicate ? ["consent:pending"] : []),
        ];
        const groups = resolveGroupIds(env, groupSlugs);
        const automationGroupIds = !consentDuplicate
          ? resolveGroupIds(env, ["consent:pending"])
          : [];
        const upsert = await senderUpsertSubscriber(env, {
          ...splitName(name),
          email,
          groups,
          fields,
          automationGroupIds,
        });
        senderCaptureSucceeded = !upsert.suppressed;
        consentSucceeded = !consentDuplicate && !upsert.suppressed;
        if (upsert.suppressed) logOperational("subscriber_suppressed", { formId });
        if (senderCaptureSucceeded) await markDedupe(env, senderCaptureKey);
        if (consentSucceeded) await markDedupe(env, consentKey);
      }
    } catch (error) {
      logOperational("subscribe_sender_failed", { operation: error?.operation, status: error?.status, formId });
    }
  }

  let formspreeSucceeded = false;
  if (shouldDualWriteFormspree(env)) {
    if (formspreeDuplicate) {
      formspreeSucceeded = true;
    } else {
      const forward = await submitFormToFormspree(
        form,
        env,
        `Website form: ${formId}`,
        new Set(["form_id", "email", "name", "marketing_opt_in", ...config.allowed]),
      );
      formspreeSucceeded = forward.ok;
      if (formspreeSucceeded) await markDedupe(env, formspreeKey);
    }
  }

  const senderPathSucceeded = formId === "workshop-next"
    ? senderNotificationSucceeded && (!wantsMarketing || senderCaptureSucceeded)
    : senderCaptureSucceeded;
  if (!senderPathSucceeded && !formspreeSucceeded) return json({ ok: false, error: "submission_failed" }, 502);
  if (formId === "newsletter" && senderAttempted && !senderCaptureSucceeded) {
    return json({ ok: false, error: "subscription_temporarily_unavailable" }, 503);
  }
  return json({
    ok: true,
    marketing_pending: consentSucceeded,
    marketing_captured: !wantsMarketing || consentSucceeded,
  });
}

async function handleContact(request, env) {
  if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
  if (!originAllowed(request)) return json({ ok: false, error: "origin_not_allowed" }, 403);
  const parsed = await boundedRequestData(request, MAX_FORM_BODY_BYTES);
  if (parsed.tooLarge) return json({ ok: false, error: "payload_too_large" }, 413);
  const form = parsed.form;
  if (!form) return json({ ok: false, error: "invalid_form" }, 400);
  if (safeText(form.get("company_website"), 200)) return json({ ok: true, ignored: true });
  if (!validateContactForm(form)) return json({ ok: false, error: "invalid_form_fields" }, 400);

  const name = safeText(form.get("name"), 120);
  const email = normalizeEmail(form.get("email"));
  const message = safeText(form.get("message"), 8_000);
  if (!name || !email || !message) return json({ ok: false, error: "required_fields_missing" }, 400);
  const rate = await enforceRateLimits(env, request, email, "contact");
  if (!rate.ok) return json({ ok: false, error: "rate_limited" }, 429);
  const contactId = await stableContactKey(name, email, message);
  const senderKey = `contact:sender:${contactId}`;
  const formspreeKey = `contact:formspree:${contactId}`;
  const senderDuplicate = await dedupeHit(env, senderKey);
  const formspreeDuplicate = await dedupeHit(env, formspreeKey);
  const senderBudgetAvailable = !senderEnabled(env) || senderDuplicate || (await consumeSenderBudget(env)).ok;
  if (!senderBudgetAvailable) logOperational("sender_budget_exhausted", { route: "contact" });

  let senderSucceeded = senderDuplicate;
  if (env.EMAIL_PROVIDER === "sender" && senderEnabled(env) && senderBudgetAvailable && !senderDuplicate) {
    try {
      validateSenderConfig(env);
      await senderTransactionalSend(env, {
        to: "jonathan@builtwithjon.com",
        subject: `Contact inquiry from ${name}`,
        replyTo: email,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
        checkRecipientStatus: true,
      });
      senderSucceeded = true;
      await markDedupe(env, senderKey);
    } catch (error) {
      logOperational("contact_sender_failed", { operation: error?.operation, status: error?.status });
    }
  }

  let formspreeSucceeded = formspreeDuplicate;
  if (shouldDualWriteFormspree(env) && !formspreeDuplicate) {
    const forward = await submitFormToFormspree(
      form,
      env,
      "Contact inquiry from builtwithjon.com",
      new Set(["name", "email", "message", "inquiry_type"]),
    );
    formspreeSucceeded = forward.ok;
    if (formspreeSucceeded) await markDedupe(env, formspreeKey);
  }
  if (!senderSucceeded && !formspreeSucceeded) return json({ ok: false, error: "contact_send_failed" }, 502);
  return json({ ok: true, notified: senderSucceeded || formspreeSucceeded });
}

async function stableContactKey(name, email, message) {
  const basis = JSON.stringify({ name, email, message });
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(basis));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function handleEvent(request, env) {
  if (request.method === "GET" || request.method === "HEAD") {
    return json({ ok: true, endpoint: "event", methods: ["POST"] });
  }

  if (request.method !== "POST") {
    return json({ ok: false, error: "method_not_allowed" }, 405);
  }

  if (!originAllowed(request)) {
    return json({ ok: false, error: "origin_not_allowed" }, 403);
  }

  let body;
  try {
    const bytes = await readBoundedBody(request, MAX_EVENT_BODY_BYTES);
    if (!bytes) return json({ ok: false, error: "payload_too_large" }, 413);
    body = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return json({ ok: false, error: "invalid_body" }, 400);
  }

  const event = String(body?.e || "");
  const eventAllowed = ALLOWED_EVENT_NAMES.has(event)
    || ALLOWED_CALCULATOR_EVENTS.has(event)
    || /^scorecard:q[1-9]$/.test(event);
  if (!eventAllowed) {
    return json({ ok: false, error: "invalid_event" }, 400);
  }

  const path = String(body?.p || "");
  if (path.length > 200 || !/^\/[a-z0-9/_-]*$/.test(path) || path.includes("//")) {
    return json({ ok: false, error: "invalid_path" }, 400);
  }

  let referrerHost = "";
  try {
    const hostname = new URL(body?.r || "").hostname.toLowerCase();
    if (/^[a-z0-9.-]{1,253}$/.test(hostname) && !hostname.includes("..")) {
      referrerHost = hostname;
    }
  } catch {
    referrerHost = "";
  }

  if (!env.SITE_EVENTS) {
    return json({ ok: true, skipped: true });
  }

  const category = event.split(":")[0];
  try {
    env.SITE_EVENTS.writeDataPoint({ blobs: [event, path, referrerHost], doubles: [1], indexes: [category] });
  } catch (err) {
    console.error("site event write failed", err);
  }

  return json({ ok: true });
}

function normalizePayload(form, request) {
  const rawSegment = safeText(form.get("segment"), 40) || "general";
  const segment = SEGMENTS[rawSegment] ? rawSegment : "general";
  const scores = normalizeScores(parseJsonField(form.get("scores"), {}));
  const answers = normalizeAnswers(parseJsonField(form.get("answers"), {}));
  const computedTier = tierFor(compositeScore(scores));
  const submittedTier = safeText(form.get("tier"), 40);
  const tier = TIER_VERDICTS[submittedTier] ? submittedTier : computedTier;
  const url = new URL(request.url);

  return {
    name: safeText(form.get("name"), 120),
    email: normalizeEmail(form.get("email")),
    inquiry_type: "scorecard-lead",
    segment,
    segmentLabel: SEGMENTS[segment],
    businessPhrase: segmentBusinessPhrase(segment),
    businessPlural: segmentBusinessPlural(segment),
    tier,
    scores,
    answers,
    source_url: safeUrl(form.get("source_url")) || `${url.origin}/scorecard/`,
    marketing_opt_in: isTrue(form.get("marketing_opt_in")),
    submitted_at: new Date().toISOString(),
  };
}

function normalizeScores(input) {
  const scores = {};
  for (const axis of ["deals", "time", "cash"]) {
    const value = Number(input?.[axis]);
    scores[axis] = Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : 0;
  }
  return scores;
}

function normalizeAnswers(input) {
  const answers = {};
  for (const key of ["segment", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9"]) {
    answers[key] = safeText(input?.[key], 240);
  }
  return answers;
}

function buildReport(payload, env) {
  const lines = LINES[payload.segment] || LINES.general;
  const axes = ["deals", "time", "cash"];
  const axisReports = axes.map((axis) => ({
    axis,
    label: AXIS_LABELS[axis],
    level: tierFor(payload.scores[axis]),
    line: lines[axis],
    estimate: estimateFor(axis, payload),
    score: payload.scores[axis],
  }));
  const worst = axisReports.slice().sort((a, b) => b.score - a.score)[0];
  const firstName = firstNameOf(payload.name);
  const subject = `Your workflow leak report${firstName ? `, ${firstName}` : ""}`;
  const ctaUrl = `${siteOrigin(env)}/hidden-profit-review/#waitlist`;
  const sampleUrl = `${siteOrigin(env)}/hidden-profit-review/sample/`;
  const useCasesUrl = `${siteOrigin(env)}/use-cases/`;
  const revenueProvided = payload.answers.q9 && payload.answers.q9 !== "Skip";

  const model = {
    ...payload,
    firstName,
    subject,
    preheader: `Where deals, time, and cash are slipping in ${payload.businessPhrase}, and the one fix worth doing first.`,
    verdict: TIER_VERDICTS[payload.tier],
    axisReports,
    worst,
    firstMove: FIRST_MOVES[worst.axis],
    revenueProvided,
    ctaUrl,
    sampleUrl,
    useCasesUrl,
  };

  return {
    to: payload.email,
    from: env.RESEND_FROM,
    reply_to: env.RESEND_REPLY_TO || "jonathan@builtwithjon.com",
    subject,
    html: renderHtmlEmail(model),
    text: renderTextEmail(model),
    tags: [
      { name: "source", value: "scorecard" },
      { name: "tier", value: payload.tier.toLowerCase().replace(/[^a-z0-9_-]+/g, "-") },
      { name: "segment", value: payload.segment },
    ],
  };
}

async function sendReportEmailResend(report, env, idempotencyKey) {
  let response;
  try {
    response = await providerFetch(env, `${String(env.RESEND_API_BASE || "https://api.resend.com").replace(/\/$/, "")}/emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
        "User-Agent": "builtwithjon-scorecard/1.0",
      },
      body: JSON.stringify(report),
    });
  } catch {
    return { ok: false, status: 0 };
  }

  const body = await readJson(response);
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
    };
  }

  return { ok: true, id: body?.id || body?.data?.id || null };
}

async function sendReportEmailSender(report, env) {
  const variables = Object.fromEntries((report.tags || []).map((tag) => [tag.name, tag.value]));
  return senderTransactionalSend(env, {
    to: report.to,
    subject: report.subject,
    html: report.html,
    text: report.text,
    replyTo: report.reply_to,
    variables,
    checkRecipientStatus: true,
  });
}

async function upsertScorecardLead(payload, env) {
  const slugs = ["source:scorecard", ...(payload.marketing_opt_in ? ["consent:pending"] : [])];
  const groups = resolveGroupIds(env, slugs);
  const automationGroupIds = payload.marketing_opt_in
    ? resolveGroupIds(env, ["consent:pending"])
    : [];
  return senderUpsertSubscriber(env, {
    ...splitName(payload.name),
    email: payload.email,
    groups,
    automationGroupIds,
    fields: {
      scorecard_tier: payload.tier,
      scorecard_segment: payload.segment,
      source: "scorecard",
      ...(payload.marketing_opt_in ? {
        consent_requested_at: new Date().toISOString(),
        consent_source: "scorecard",
      } : {}),
    },
  });
}

async function submitLeadToFormspree(payload, env) {
  const body = new URLSearchParams();
  body.set("_subject", "Scorecard lead");
  body.set("inquiry_type", "scorecard-lead");
  body.set("segment", payload.segment);
  body.set("tier", payload.tier);
  body.set("scores", JSON.stringify(payload.scores));
  body.set("answers", JSON.stringify(payload.answers));
  body.set("name", payload.name);
  body.set("email", payload.email);
  body.set("source_url", payload.source_url);
  body.set("submitted_at", payload.submitted_at);

  let response;
  try {
    response = await providerFetch(env, formspreeEndpoint(env), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "User-Agent": "builtwithjon-scorecard/1.0",
      },
      body,
    });
  } catch {
    return { ok: false, status: 0 };
  }

  const data = await readJson(response);
  if (!response.ok || data?.ok === false) {
    return {
      ok: false,
      status: response.status,
    };
  }
  return { ok: true };
}

async function submitFormToFormspree(form, env, subject, allowedKeys = null) {
  const body = new URLSearchParams();
  body.set("_subject", subject);
  for (const [key, value] of form.entries()) {
    if (key === "company_website" || key === "_subject") continue;
    if (allowedKeys && !allowedKeys.has(key)) continue;
    body.set(key, safeText(value, 8_000));
  }
  try {
    const response = await providerFetch(env, formspreeEndpoint(env), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "User-Agent": "builtwithjon-forms/1.0",
      },
      body,
    });
    const data = await readJson(response);
    if (!response.ok || data?.ok === false) return { ok: false };
    return { ok: true };
  } catch {
    logOperational("formspree_forward_failed");
    return { ok: false };
  }
}

function providerFetch(env, url, init) {
  const timeout = Number(env.EMAIL_PROVIDER_TIMEOUT_MS || 8_000);
  return fetch(url, {
    ...init,
    signal: init.signal || AbortSignal.timeout(Number.isFinite(timeout) ? timeout : 8_000),
  });
}

function validateMappedForm(form, config) {
  if ([...form.keys()].length > 24) return false;
  const allowed = new Set([
    "form_id", "email", "name", "marketing_opt_in", "company_website",
    "_subject", "_next", "inquiry_type", ...config.allowed,
  ]);
  for (const [key, value] of form.entries()) {
    if (!allowed.has(key) || typeof value !== "string") return false;
    const limit = key === "email" ? 254 : key === "name" ? 120 : 240;
    if (value.length > limit) return false;
  }
  for (const field of config.required || []) {
    if (!safeText(form.get(field), 240)) return false;
  }
  for (const [field, values] of Object.entries(config.enums || {})) {
    if (!values.includes(safeText(form.get(field), 240))) return false;
  }
  return true;
}

function validateContactForm(form) {
  const limits = {
    name: 120,
    email: 254,
    message: 8_000,
    company_website: 200,
    _subject: 240,
    inquiry_type: 80,
  };
  if ([...form.keys()].length > 8) return false;
  for (const [key, value] of form.entries()) {
    if (!(key in limits) || typeof value !== "string" || value.length > limits[key]) return false;
  }
  return true;
}

async function requestData(request) {
  const contentType = request.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const form = new FormData();
      for (const [key, value] of Object.entries(body || {})) {
        if (value != null) form.set(key, String(value));
      }
      return form;
    }
    return await request.formData();
  } catch {
    return null;
  }
}

async function boundedRequestData(request, maxBytes) {
  try {
    const bytes = await readBoundedBody(request, maxBytes);
    if (!bytes) return { form: null, tooLarge: true };
    const bounded = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: bytes,
    });
    return { form: await requestData(bounded), tooLarge: false };
  } catch {
    return { form: null, tooLarge: false };
  }
}

async function readBoundedBody(request, maxBytes) {
  const declared = request.headers.get("content-length");
  if (declared != null) {
    const length = Number(declared);
    if (!Number.isFinite(length) || length < 0 || length > maxBytes) return null;
  }
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel("payload_too_large");
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

function senderEnabled(env) {
  return env.EMAIL_PROVIDER === "sender"
    && env.SENDER_SENDS_ENABLED !== "false"
    && Boolean(env.SENDER_API_TOKEN)
    && Boolean(env.SUBSCRIBE_DEDUPE)
    && String(env.FORM_HASH_SALT || "").length >= 16;
}

function shouldDualWriteFormspree(env) {
  return env.FORMSPREE_DUAL_WRITE !== "false";
}

function formspreeEndpoint(env) {
  return env.FORMSPREE_ENDPOINT || DEFAULT_FORMSPREE_ENDPOINT;
}

function isTrue(value) {
  return value === true || ["true", "1", "on", "yes"].includes(String(value || "").toLowerCase());
}

function splitName(name) {
  const parts = safeText(name, 120).split(/\s+/).filter(Boolean);
  return { firstname: parts.shift() || "", lastname: parts.join(" ") };
}

function mapFields(map, values) {
  return Object.fromEntries(Object.entries(map).map(([field, source]) => [field, values[source]]).filter(([, value]) => value));
}

function validateSenderConfig(env) {
  if (!env.SUBSCRIBE_DEDUPE) throw new Error("sender_dedupe_not_configured");
  if (String(env.FORM_HASH_SALT || "").length < 16) throw new Error("form_hash_salt_not_configured");
  parseSenderFrom(env.SENDER_FROM);
  const required = new Set([
    "consent:pending",
    "consent:confirmed",
    "source:newsletter",
    "offer:hidden-profit-review",
    "asset:invoice-chase-kit",
    "asset:follow-up-swipe-file",
    "asset:leak-calculator",
    "asset:starter-kit-cowork",
    "offer:email-course",
    "source:scorecard",
  ]);
  const ids = parseGroupIds(env);
  const missing = [...required].filter((slug) => !ids[slug]);
  if (missing.length) {
    const error = new Error("sender_group_mapping_incomplete");
    error.operation = "validate_config";
    error.missingCount = missing.length;
    throw error;
  }
}

function resolveGroupIds(env, slugs) {
  const ids = parseGroupIds(env);
  return [...new Set(slugs)].map((slug) => {
    if (ids[slug]) return String(ids[slug]);
    const error = new Error("sender_group_mapping_missing");
    error.operation = "resolve_group";
    throw error;
  });
}

function parseGroupIds(env) {
  let ids;
  try {
    ids = JSON.parse(env.SENDER_GROUP_IDS || "{}");
  } catch {
    const error = new Error("sender_group_mapping_invalid");
    error.operation = "parse_group_config";
    throw error;
  }
  if (!ids || typeof ids !== "object" || Array.isArray(ids)) {
    const error = new Error("sender_group_mapping_invalid");
    error.operation = "parse_group_config";
    throw error;
  }
  return ids;
}

async function dedupeHit(env, key) {
  if (!env.SUBSCRIBE_DEDUPE) return false;
  try {
    return Boolean(await env.SUBSCRIBE_DEDUPE.get(await privateKey(env, "dedupe", key)));
  } catch {
    logOperational("dedupe_read_failed");
    return false;
  }
}

async function markDedupe(env, key) {
  if (env.SUBSCRIBE_DEDUPE) {
    try {
      await env.SUBSCRIBE_DEDUPE.put(await privateKey(env, "dedupe", key), "1", { expirationTtl: 86_400 });
    } catch {
      logOperational("dedupe_write_failed");
    }
  }
}

async function enforceRateLimits(env, request, email, route) {
  if (!env.SUBSCRIBE_DEDUPE || env.FORM_RATE_LIMITS_ENABLED === "false") return { ok: true };
  try {
    const ip = safeText(request.headers.get("CF-Connecting-IP") || "local", 80);
    const now = new Date();
    const hour = now.toISOString().slice(0, 13);
    const day = now.toISOString().slice(0, 10);
    const ipLimit = positiveInt(env.FORM_RATE_LIMIT_IP_HOURLY, 20);
    const emailLimit = positiveInt(env.FORM_RATE_LIMIT_EMAIL_DAILY, 5);
    const checks = [
      [await privateKey(env, "limit", `ip:${ip}:${hour}`), ipLimit, 3_600],
      [await privateKey(env, "limit", `email:${email}:${route}:${day}`), emailLimit, 86_400],
    ];
    for (const [key, limit, ttl] of checks) {
      const current = Number(await env.SUBSCRIBE_DEDUPE.get(key) || "0");
      if (current >= limit) return { ok: false };
      await env.SUBSCRIBE_DEDUPE.put(key, String(current + 1), { expirationTtl: ttl });
    }
  } catch {
    logOperational("rate_limit_storage_failed");
  }
  return { ok: true };
}

async function consumeSenderBudget(env) {
  if (!senderEnabled(env) || !env.SUBSCRIBE_DEDUPE || env.FORM_RATE_LIMITS_ENABLED === "false") {
    return { ok: true };
  }
  try {
    const day = new Date().toISOString().slice(0, 10);
    const key = await privateKey(env, "limit", `sender-budget:${day}`);
    const limit = positiveInt(env.FORM_RATE_LIMIT_GLOBAL_DAILY, 100);
    const current = Number(await env.SUBSCRIBE_DEDUPE.get(key) || "0");
    if (current >= limit) return { ok: false };
    await env.SUBSCRIBE_DEDUPE.put(key, String(current + 1), { expirationTtl: 86_400 });
  } catch {
    logOperational("sender_budget_storage_failed");
    return { ok: false };
  }
  return { ok: true };
}

function positiveInt(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

async function privateKey(env, namespace, value) {
  const salt = String(env.FORM_HASH_SALT || "");
  if (salt.length < 16) throw new Error("form_hash_salt_not_configured");
  const basis = `${salt}:${namespace}:${value}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(basis));
  const hex = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${namespace}:${hex}`;
}

function logOperational(event, details = {}) {
  const safe = Object.fromEntries(Object.entries(details).filter(([, value]) =>
    typeof value === "number" || (typeof value === "string" && /^[a-z0-9:_-]{1,100}$/i.test(value))
  ));
  console.error(event, JSON.stringify(safe));
}

function renderHtmlEmail(model) {
  const axisRows = model.axisReports.map((item) => `
    <tr>
      <td style="padding:14px 0;border-top:1px solid #E5D7C3;">
        <p style="margin:0 0 4px;font:700 14px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1F1713;">${escapeHtml(item.label)}: ${escapeHtml(item.level)}</p>
        <p style="margin:0 0 6px;font:400 15px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#5E5047;">${escapeHtml(item.line)}</p>
        <p style="margin:0;font:400 14px/1.45 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#5E5047;"><strong>Rough size:</strong> ${escapeHtml(item.estimate)}</p>
      </td>
    </tr>`).join("");

  return `<!doctype html>
<html>
  <body style="margin:0;background:#FBF6EC;padding:24px;color:#1F1713;">
    <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(model.preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#FFFDF8;border:1px solid #E5D7C3;border-radius:14px;">
      <tr>
        <td style="padding:28px 28px 10px;">
          <p style="margin:0 0 10px;font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;color:#8F4E24;">Built with Jon scorecard</p>
          <h1 style="margin:0 0 16px;font:750 28px/1.12 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1F1713;">Your workflow leak report</h1>
          <p style="margin:0 0 18px;font:400 16px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1F1713;">Hi${model.firstName ? ` ${escapeHtml(model.firstName)}` : ""},</p>
          <p style="margin:0 0 16px;font:400 16px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1F1713;">You just ran the scorecard for ${escapeHtml(model.businessPhrase)} and came out <strong>${escapeHtml(model.tier)}</strong>. Here is what that means, in plain numbers.</p>
          <p style="margin:0 0 18px;font:400 15px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#5E5047;">Quick honesty up front: these are estimates, built from your answers and benchmarks for businesses like yours. They describe the size of the problem. They are not a promise. The audit is how you turn them into measured numbers with your real data.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 28px 10px;">
          <div style="background:#F5EEDD;border-left:4px solid #8F4E24;border-radius:0 10px 10px 0;padding:16px 18px;">
            <p style="margin:0 0 5px;font:700 15px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1F1713;">Your score: ${escapeHtml(model.tier)}</p>
            <p style="margin:0;font:400 15px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#5E5047;">${escapeHtml(model.verdict)}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:6px 28px 4px;">
          <h2 style="margin:12px 0 0;font:750 18px/1.2 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1F1713;">Where it is leaking</h2>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${axisRows}</table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 28px 24px;">
          <h2 style="margin:16px 0 8px;font:750 18px/1.2 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1F1713;">Where I would start</h2>
          <p style="margin:0 0 16px;font:400 16px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1F1713;">${escapeHtml(model.firstMove)} One working thing beats a grand plan.</p>
          <h2 style="margin:16px 0 8px;font:750 18px/1.2 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1F1713;">The next fidelity</h2>
          <p style="margin:0 0 16px;font:400 16px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1F1713;">Everything above is the assumption version. The Hidden Profit Review is the same picture, measured with your real data, plus a first pilot plan you keep whether or not we work together again.${model.revenueProvided ? "" : " It is also where the dollar figure comes from. That needs your real numbers, which is exactly what the review measures."}</p>
          <p style="margin:0 0 16px;font:400 15px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#5E5047;">I run every review personally, so I take on a handful each month. The waitlist holds your spot, and invites go out in order.</p>
          <p style="margin:0 0 18px;"><a href="${escapeAttribute(model.ctaUrl)}" style="display:inline-block;background:#8F4E24;color:#FFFFFF;text-decoration:none;border-radius:8px;padding:12px 16px;font:700 15px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Join the review waitlist</a></p>
          <p style="margin:0;font:400 14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#5E5047;">Not ready to talk? Fair. Here is <a href="${escapeAttribute(model.sampleUrl)}" style="color:#1D4ED8;">a complete worked example</a>. Or browse <a href="${escapeAttribute(model.useCasesUrl)}" style="color:#1D4ED8;">use cases</a> other ${escapeHtml(model.businessPlural)} started with.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:18px 28px 24px;border-top:1px solid #E5D7C3;">
          <p style="margin:0 0 8px;font:400 15px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1F1713;">Either way, you keep the report. Reply to this email if you want a second pair of eyes on any of it.</p>
          <p style="margin:0 0 16px;font:400 15px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1F1713;">Jonathan<br>Built with Jon</p>
          <p style="margin:0;font:400 12px/1.45 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#5E5047;">You got this because you ran the scorecard at builtwithjon.com. <a href="${escapeAttribute(siteOrigin(model))}/privacy" style="color:#1D4ED8;">Privacy policy</a> · jonathan@builtwithjon.com</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function renderTextEmail(model) {
  const lines = [
    `Hi${model.firstName ? ` ${model.firstName}` : ""},`,
    "",
    `You just ran the scorecard for ${model.businessPhrase} and came out ${model.tier}.`,
    "",
    "Quick honesty up front: these are estimates, built from your answers and benchmarks for businesses like yours. They describe the size of the problem. They are not a promise. The audit is how you turn them into measured numbers with your real data.",
    "",
    "Where it is leaking",
    ...model.axisReports.flatMap((item) => [
      `${item.label}: ${item.level}. ${item.line}`,
      `Rough size: ${item.estimate}`,
      "",
    ]),
    "Where I would start",
    `${model.firstMove} One working thing beats a grand plan.`,
    "",
    "The next fidelity",
    `Everything above is the assumption version. The Hidden Profit Review is the same picture, measured with your real data, plus a first pilot plan you keep whether or not we work together again.${model.revenueProvided ? "" : " It is also where the dollar figure comes from. That needs your real numbers, which is exactly what the review measures."}`,
    "",
    "I run every review personally, so I take on a handful each month. The waitlist holds your spot, and invites go out in order.",
    "",
    `Join the review waitlist: ${model.ctaUrl}`,
    `Complete worked example: ${model.sampleUrl}`,
    `Use cases: ${model.useCasesUrl}`,
    "",
    "Either way, you keep the report. Reply to this email if you want a second pair of eyes on any of it.",
    "",
    "Jonathan",
    "Built with Jon",
  ];
  return lines.join("\n");
}

function estimateFor(axis, payload) {
  const answers = payload.answers;
  if (axis === "deals") {
    return `You reported ${lower(answers.q4 || "some")} monthly leads and "${answers.q2 || "not sure"}" response timing. The first fix is faster response plus a follow-up loop that does not depend on memory.`;
  }
  if (axis === "time") {
    return `You reported ${lower(answers.q5 || "some")} weekly admin and status-chasing time. That is the cleanest place to recover hours before touching higher-risk work.`;
  }
  if (answers.q9 && answers.q9 !== "Skip") {
    return `With monthly revenue in the ${answers.q9} range, this is worth measuring with real invoice timing before assigning a dollar number.`;
  }
  return `Because revenue was skipped, keep this as a timing and collections leak for now. The audit is where the dollar number gets measured.`;
}

function firstNameOf(name) {
  const first = String(name || "").trim().split(/\s+/)[0] || "";
  return safeText(first, 40);
}

function safeText(value, max) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function normalizeEmail(value) {
  const email = safeText(value, 320).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "";
  return email;
}

function safeUrl(value) {
  const text = safeText(value, 500);
  if (!text) return "";
  try {
    const url = new URL(text);
    if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") return "";
    return url.toString();
  } catch {
    return "";
  }
}

function parseJsonField(value, fallback) {
  try {
    return JSON.parse(String(value || ""));
  } catch {
    return fallback;
  }
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

function originAllowed(request) {
  const origin = request.headers.get("Origin") || "";
  if (!origin) return false;
  try {
    const url = new URL(origin);
    if (["https://builtwithjon.com", "https://www.builtwithjon.com",
      "https://jonathanmalkin-site.jonathan-d-malkin.workers.dev"].includes(url.origin)) return true;
    return url.protocol === "http:"
      && ["127.0.0.1", "localhost"].includes(url.hostname)
      && (!url.port || /^\d{2,5}$/.test(url.port));
  } catch {
    return false;
  }
}

async function stableKey(payload) {
  const basis = JSON.stringify({
    email: payload.email,
    segment: payload.segment,
    tier: payload.tier,
    scores: payload.scores,
    answers: payload.answers,
  });
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(basis));
  const hex = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `scorecard-${hex.slice(0, 48)}`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function lower(value) {
  const text = String(value || "");
  return text ? text.charAt(0).toLowerCase() + text.slice(1) : "";
}

function siteOrigin(env) {
  return env.SITE_ORIGIN || "https://builtwithjon.com";
}
