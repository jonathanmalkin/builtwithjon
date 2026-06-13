const FORMSPREE_ENDPOINT = "https://formspree.io/f/xdapgpae";
const SCORECARD_REPORT_PATH = "/api/scorecard-report";
const MAX_SCORECARD_BODY_BYTES = 32_000;

const SEGMENTS = {
  gc: "General contracting",
  re: "Real estate",
  hs: "Home services & trades",
  pm: "Property management",
  ps: "Professional services",
  hw: "Health & wellness",
  cc: "Coaching or creator",
  general: "Something else / general business",
};

const LINES = {
  gc: {
    deals: "Bids and follow-ups are slipping between the field and the office.",
    time: "Too much of the week goes to chasing information instead of building.",
    cash: "Slow invoicing and rework are eating margin you already earned.",
  },
  re: {
    deals: "The first agent to respond usually wins, and you are not always first.",
    time: "Non-revenue admin and document wrangling are eating hours that should be in front of clients.",
    cash: "Deals fall through in the gaps in follow-through, not in pricing.",
  },
  hs: {
    deals: "Calls that hit voicemail go straight to the next contractor on the list.",
    time: "Intake and quoting are getting squeezed between jobs, so follow-up slips.",
    cash: "Jobs are done but the invoice chase drags, and some of it never gets chased.",
  },
  pm: {
    deals: "Leasing inquiries are slipping before anyone follows up.",
    time: "The same handful of recurring problems eat the week on a loop.",
    cash: "Rent chasing and late payments are a standing drain on the month.",
  },
  ps: {
    deals: "Inquiries are going unanswered, and prospects book whoever replied first.",
    time: "Too much expert time is non-billable, reconstructing and re-drafting from scratch.",
    cash: "Invoices and engagement letters drag, so earned fees collect slowly.",
  },
  hw: {
    deals: "New callers who reach voicemail do not call back, they book elsewhere.",
    time: "Insurance and intake admin are eating clinical hours.",
    cash: "No-shows and unfilled slots are leaving revenue in empty chairs.",
  },
  cc: {
    deals: "Leads that found you are going unanswered while you are heads-down creating.",
    time: "Packaging and posting are eating the hours that should go to the work only you can do.",
    cash: "Churn and refunds are leaking revenue you already won.",
  },
  general: {
    deals: "Leads are going cold before anyone answers. Odds of even qualifying a lead drop sharply between a 5-minute and a 30-minute reply.",
    time: "Too much of the week goes to status-chasing and re-typing the same thing between disconnected tools.",
    cash: "Invoices and collections are slipping, and money you earned is sitting uncollected.",
  },
};

const TIER_VERDICTS = {
  Holding: "Your systems are mostly holding. The leaks here are small, and most of the win is sharpening what already works.",
  Leaking: "There are real, fixable losses here. A couple of spots are quietly costing you, and they are the kind of thing that is fixable without ripping anything out.",
  "Wide open": "A lot is getting through the gaps. Deals, hours, and cash are leaking in more than one place. The good news: that also means the first fix pays for itself fast.",
};

const FIRST_MOVES = {
  deals: "Start with the first-response and follow-up path. Make one owner, one trigger, and one reviewed follow-up loop clear before adding any fancy automation.",
  time: "Start with the repeated admin handoff. Pick the status chase or copy-paste loop that happens every week and turn it into one reviewed workflow.",
  cash: "Start with the invoice and collection moment. Make the handoff from work complete to invoice sent visible, timed, and reviewed.",
};

const AXIS_LABELS = {
  deals: "Deals",
  time: "Time",
  cash: "Cash",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === SCORECARD_REPORT_PATH) {
      return handleScorecardReport(request, env);
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

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > MAX_SCORECARD_BODY_BYTES) {
    return json({ ok: false, error: "payload_too_large" }, 413);
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: "invalid_form" }, 400);
  }

  if (String(form.get("company_website") || "").trim()) {
    return json({ ok: true, ignored: true });
  }

  const payload = normalizePayload(form, request);
  if (!payload.email) {
    return json({ ok: false, error: "valid_email_required" }, 400);
  }

  if (!env.RESEND_API_KEY) {
    return json({ ok: false, error: "resend_not_configured" }, 503);
  }

  if (!env.RESEND_FROM) {
    return json({ ok: false, error: "resend_sender_not_configured" }, 503);
  }

  const report = buildReport(payload, env);
  const idempotencyKey = await stableKey(payload);

  const resend = await sendReportEmail(report, env, idempotencyKey);
  if (!resend.ok) {
    console.error("scorecard resend failed", JSON.stringify(resend.publicError));
    return json({ ok: false, error: "report_send_failed" }, 502);
  }

  const formspree = await submitLeadToFormspree(payload);
  if (!formspree.ok) {
    console.error("scorecard formspree failed", JSON.stringify(formspree.publicError));
    return json({ ok: false, error: "lead_capture_failed" }, 502);
  }

  return json({ ok: true, report_id: resend.id || null });
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
    tier,
    scores,
    answers,
    source_url: safeUrl(form.get("source_url")) || `${url.origin}/scorecard/`,
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
  const ctaUrl = `${siteOrigin(env)}/ai-workflow-audit/`;
  const sampleUrl = `${siteOrigin(env)}/ai-workflow-audit/profit-leak-assessment/`;
  const useCasesUrl = `${siteOrigin(env)}/use-cases/`;
  const revenueProvided = payload.answers.q9 && payload.answers.q9 !== "Skip";

  const model = {
    ...payload,
    firstName,
    subject,
    preheader: `Where deals, time, and cash are slipping in a ${payload.segmentLabel.toLowerCase()} business, and the one fix worth doing first.`,
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

async function sendReportEmail(report, env, idempotencyKey) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
      "User-Agent": "builtwithjon-scorecard/1.0",
    },
    body: JSON.stringify(report),
  });

  const body = await readJson(response);
  if (!response.ok) {
    return {
      ok: false,
      publicError: {
        status: response.status,
        name: body?.name || body?.error?.name || "resend_error",
        message: body?.message || body?.error?.message || "Resend request failed",
      },
    };
  }

  return { ok: true, id: body?.id || body?.data?.id || null };
}

async function submitLeadToFormspree(payload) {
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

  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "User-Agent": "builtwithjon-scorecard/1.0",
    },
    body,
  });

  const data = await readJson(response);
  if (!response.ok || data?.ok === false) {
    return {
      ok: false,
      publicError: {
        status: response.status,
        message: data?.error || data?.message || "Formspree request failed",
      },
    };
  }
  return { ok: true };
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
          <p style="margin:0 0 16px;font:400 16px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1F1713;">You just ran the scorecard for a ${escapeHtml(model.segmentLabel.toLowerCase())} business and came out <strong>${escapeHtml(model.tier)}</strong>. Here is what that means, in plain numbers.</p>
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
          <p style="margin:0 0 16px;font:400 16px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1F1713;">Everything above is the assumption version. The audit is the same picture, measured with your real data, plus a first pilot plan you keep whether or not we work together again.${model.revenueProvided ? "" : " It is also where the dollar figure comes from. That needs your real numbers, which is exactly what the audit measures."}</p>
          <p style="margin:0 0 18px;"><a href="${escapeAttribute(model.ctaUrl)}" style="display:inline-block;background:#8F4E24;color:#FFFFFF;text-decoration:none;border-radius:8px;padding:12px 16px;font:700 15px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">See how the audit works</a></p>
          <p style="margin:0;font:400 14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#5E5047;">Not ready to talk? Fair. Here is <a href="${escapeAttribute(model.sampleUrl)}" style="color:#1D4ED8;">a complete worked example</a>. Or browse <a href="${escapeAttribute(model.useCasesUrl)}" style="color:#1D4ED8;">use cases</a> other ${escapeHtml(model.segmentLabel.toLowerCase())} businesses started with.</p>
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
    `You just ran the scorecard for a ${model.segmentLabel.toLowerCase()} business and came out ${model.tier}.`,
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
    `Everything above is the assumption version. The audit is the same picture, measured with your real data, plus a first pilot plan you keep whether or not we work together again.${model.revenueProvided ? "" : " It is also where the dollar figure comes from. That needs your real numbers, which is exactly what the audit measures."}`,
    "",
    `See how the audit works: ${model.ctaUrl}`,
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

function tierFor(score) {
  if (score >= 60) return "Wide open";
  if (score >= 30) return "Leaking";
  return "Holding";
}

function compositeScore(scores) {
  return Math.round((scores.deals + scores.time + scores.cash) / 3);
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
    },
  });
}

function originAllowed(request) {
  const origin = request.headers.get("Origin") || "";
  if (!origin) return false;
  try {
    const url = new URL(origin);
    return [
      "builtwithjon.com",
      "www.builtwithjon.com",
      "127.0.0.1",
      "localhost",
      "jonathanmalkin-site.jonathan-d-malkin.workers.dev",
    ].includes(url.hostname);
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
