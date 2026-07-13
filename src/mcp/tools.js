// Tool definitions and dispatch for the builtwithjon MCP server.
// Read-only + diagnostics: every tool serves content that is already public
// on the site, computed with the same shared modules the pages use.
// No tool accepts or stores PII, sends email, or touches secrets.

import { categories, useCases } from "../data/use-cases/index";
import { CALCS, computeLeak } from "../data/leak-calculators";
import {
  SEGMENTS,
  QUESTIONS,
  LINES,
  TIER_VERDICTS,
  FIRST_MOVES,
  AXIS_LABELS,
  tierFor,
  compositeScore,
  axisScores,
} from "../data/scorecard";
import { dispositions, dispositionFraming } from "../data/dispositions";
import { processPhases } from "../data/process";

const MAX_QUERY_CHARS = 200;
const MAX_SEARCH_RESULTS = 20;
const MAX_ARTICLE_BODY_CHARS = 50_000;

const DISPOSITION_IDS = dispositions.map((d) => d.id);
const CATEGORY_IDS = categories.map((c) => c.id);
const CALC_IDS = CALCS.map((c) => c.id);
const AUTOMATION_LEVELS = ["Fully automatable", "Mostly automatable", "Partially automatable"];

function origin(env) {
  return env.SITE_ORIGIN || "https://builtwithjon.com";
}

// Thrown for schema-shaped problems; the handler maps it to JSON-RPC -32602.
export class ToolInputError extends Error {}

function optionLabels(questionId) {
  const q = QUESTIONS.find((x) => x.id === questionId);
  return q.options.map(([label]) => label);
}

function questionText(questionId) {
  return QUESTIONS.find((x) => x.id === questionId).q;
}

function nextSteps(env, lines) {
  const o = origin(env);
  const items = lines.map((l) => `- ${l.replace(/\{origin\}/g, o)}`);
  return `\n\n---\n**Next steps**\n${items.join("\n")}`;
}

const FUNNEL_LINKS = [
  "Run the free 3-minute scorecard (full emailed breakdown): {origin}/scorecard/",
  "The Hidden Profit Review measures your leak with real data (waitlist, 4/month): {origin}/hidden-profit-review/#waitlist",
  "See a complete worked review sample: {origin}/hidden-profit-review/sample/",
];

function text(value) {
  return { content: [{ type: "text", text: value }] };
}

function toolError(message) {
  return { content: [{ type: "text", text: message }], isError: true };
}

function requireString(args, key, { required = false, max = MAX_QUERY_CHARS } = {}) {
  const value = args?.[key];
  if (value === undefined || value === null) {
    if (required) throw new ToolInputError(`Missing required argument: ${key}`);
    return undefined;
  }
  if (typeof value !== "string") throw new ToolInputError(`Argument ${key} must be a string`);
  if (value.length > max) throw new ToolInputError(`Argument ${key} exceeds ${max} characters`);
  return value;
}

function requireEnum(args, key, allowed, { required = false } = {}) {
  const value = requireString(args, key, { required, max: 300 });
  if (value === undefined) return undefined;
  if (!allowed.includes(value)) {
    throw new ToolInputError(`Argument ${key} must be one of: ${allowed.join(" | ")}`);
  }
  return value;
}

// ---------- Use Case Library ----------

function categoryById(id) {
  return categories.find((c) => c.id === id);
}

function useCaseLine(uc) {
  const cat = categoryById(uc.categoryId);
  return `- **${uc.id} — ${uc.name}** (${cat ? cat.name : uc.categoryId} · ${uc.frequency} · ${uc.automation})\n  ${uc.painLine}`;
}

function listUseCaseCategories(args, ctx) {
  const groups = [
    ["function", "By business function"],
    ["industry", "By industry"],
    ["personal", "Personal"],
  ];
  const sections = groups.map(([group, title]) => {
    const rows = categories
      .filter((c) => c.group === group)
      .map((c) => {
        const count = useCases.filter((u) => u.categoryId === c.id).length;
        const stat = c.stat ? ` Key stat: ${c.stat.value} — ${c.stat.text} (${c.stat.source})` : "";
        return `- **${c.id}** — ${c.name} (${count} use cases).${stat}`;
      });
    return `### ${title}\n${rows.join("\n")}`;
  });
  const body = `# Use Case Library — ${useCases.length} worked examples across ${categories.length} categories\n\nBrowse the full library at ${origin(ctx.env)}/use-cases/. Use \`search_use_cases\` to filter, or \`get_use_case\` with an id (e.g. "A1") for the full workflow breakdown.\n\n${sections.join("\n\n")}`;
  return text(body + nextSteps(ctx.env, FUNNEL_LINKS.slice(0, 2)));
}

function searchUseCases(args, ctx) {
  const query = requireString(args, "query");
  const categoryId = requireEnum(args, "category_id", CATEGORY_IDS);
  const frequency = requireString(args, "frequency", { max: 60 });
  const automation = requireEnum(args, "automation", AUTOMATION_LEVELS);
  const disposition = requireEnum(args, "disposition", DISPOSITION_IDS);

  if (!query && !categoryId && !frequency && !automation && !disposition) {
    throw new ToolInputError("Provide at least one of: query, category_id, frequency, automation, disposition");
  }

  const q = (query || "").toLowerCase();
  const freq = (frequency || "").toLowerCase();

  const matches = useCases.filter((uc) => {
    if (categoryId && uc.categoryId !== categoryId) return false;
    if (automation && uc.automation !== automation) return false;
    if (freq && !uc.frequency.toLowerCase().includes(freq)) return false;
    if (disposition && !uc.breakdown.some((b) => b.dispositions.includes(disposition))) return false;
    if (q) {
      const haystack = [uc.id, uc.name, uc.subject, uc.painLine, uc.aiFit || "", (uc.workflow || []).join(" ")]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  if (!matches.length) {
    return text(
      `No use cases matched. Try a broader keyword, or call \`list_use_case_categories\` to see what's in the library.` +
        nextSteps(ctx.env, [`Browse all ${useCases.length} use cases: {origin}/use-cases/`])
    );
  }

  const shown = matches.slice(0, MAX_SEARCH_RESULTS);
  const header = `Found ${matches.length} matching use case${matches.length === 1 ? "" : "s"}${matches.length > shown.length ? ` (showing first ${shown.length})` : ""}. Call \`get_use_case\` with an id for the full workflow and per-step verdicts.`;
  return text(`${header}\n\n${shown.map(useCaseLine).join("\n")}` + nextSteps(ctx.env, FUNNEL_LINKS.slice(0, 2)));
}

function getUseCase(args, ctx) {
  const id = requireString(args, "id", { required: true, max: 10 });
  const uc = useCases.find((u) => u.id.toLowerCase() === id.toLowerCase());
  if (!uc) {
    return toolError(`No use case with id "${id}". Ids look like "A1" or "S3" — call list_use_case_categories or search_use_cases to find one.`);
  }
  const cat = categoryById(uc.categoryId);
  const workflow = uc.workflow.map((step, i) => `${i + 1}. ${step}`).join("\n");
  const breakdown = uc.breakdown
    .map((b) => {
      const steps = b.steps && b.steps.length ? `Steps ${b.steps.join(", ")}` : "Overall";
      return `- **${steps} → ${b.dispositions.join(" + ")}**: ${b.rationale}`;
    })
    .join("\n");

  const parts = [
    `# ${uc.id} — ${uc.name}`,
    `**Category:** ${cat ? cat.name : uc.categoryId} · **Subject:** ${uc.subject} · **Frequency:** ${uc.frequency} · **Automation:** ${uc.automation}`,
    `**The pain:** ${uc.painLine}`,
  ];
  if (uc.contextStat) parts.push(`**Context:** ${uc.contextStat}`);
  parts.push(`## The workflow as it runs today\n${workflow}`);
  parts.push(`## Per-step verdicts (eliminate / simplify / automate / optimize / report)\n${breakdown}`);
  if (uc.aiFit) parts.push(`## Where AI actually fits\n${uc.aiFit}`);
  if (uc.afterState) parts.push(`## After the fix\n${uc.afterState}`);
  if (uc.complianceNote) parts.push(`**Compliance note:** ${uc.complianceNote}`);
  parts.push(`Full library: ${origin(ctx.env)}/use-cases/`);

  return text(parts.join("\n\n") + nextSteps(ctx.env, FUNNEL_LINKS.slice(0, 2)));
}

// ---------- Scorecard ----------

function runScorecard(args, ctx) {
  const segment = requireEnum(args, "segment", Object.keys(SEGMENTS), { required: true });
  const weights = {};
  for (const q of QUESTIONS) {
    const required = !q.mag;
    const label = requireEnum(args, q.id, optionLabels(q.id), { required });
    if (label !== undefined) {
      weights[q.id] = q.options.find(([l]) => l === label)[1];
    }
  }

  const scores = axisScores(weights);
  const composite = compositeScore(scores);
  const tier = tierFor(composite);
  const lines = LINES[segment] || LINES.general;
  const axes = ["deals", "time", "cash"];
  const worst = axes.slice().sort((a, b) => scores[b] - scores[a])[0];
  const segmentLabel = SEGMENTS[segment];

  const axisRows = axes
    .map((a) => `- **${AXIS_LABELS[a]} — ${tierFor(scores[a])}** (${scores[a]}/100): ${lines[a]}`)
    .join("\n");

  const body = [
    `# Scorecard result: ${tier}`,
    TIER_VERDICTS[tier],
    `For a ${segmentLabel.toLowerCase()} business, here is where it is leaking:`,
    axisRows,
    `**Your biggest leak right now:** ${lines[worst].replace(/\.$/, "")}. For a ${segmentLabel.toLowerCase()} business, that is usually the most expensive one to leave alone.`,
    `**Where I would start:** ${FIRST_MOVES[worst]} One working thing beats a grand plan.`,
    `_Quick honesty: this is an estimate built from your answers and benchmarks for businesses like yours, scored exactly the way the scorecard at builtwithjon.com scores it. It describes the size of the problem; the Hidden Profit Review measures it with your real data._`,
  ].join("\n\n");

  return text(body + nextSteps(ctx.env, [
    "Put a dollar figure on the worst leak with `calculate_leak`, or browse fixes with `search_use_cases`.",
    ...FUNNEL_LINKS.slice(1),
  ]));
}

// ---------- Leak calculators ----------

function listLeakCalculators(args, ctx) {
  const rows = CALCS.map((c) => {
    const fields = c.fields.map((f) => `\`${f.k}\` (${f.label}; default ${f.v})`).join(", ");
    return `- **${c.id}** — ${c.title} (${c.segment} · ${c.axis}). ${c.desc}\n  Inputs: ${fields}`;
  });
  const body = `# The Leak Calculator — 10 ways to put a dollar figure on an operational leak\n\nCall \`calculate_leak\` with a calculator_id and the numbers you know; anything you leave out uses the illustrative default. Interactive version: ${origin(ctx.env)}/tools/leak-calculator/\n\n${rows.join("\n")}`;
  return text(body + nextSteps(ctx.env, FUNNEL_LINKS.slice(0, 2)));
}

function calculateLeak(args, ctx) {
  const id = requireEnum(args, "calculator_id", CALC_IDS, { required: true });
  const calc = CALCS.find((c) => c.id === id);
  const inputs = args?.inputs ?? {};
  if (typeof inputs !== "object" || Array.isArray(inputs)) {
    throw new ToolInputError("Argument inputs must be an object of numbers keyed by field name");
  }

  const knownKeys = new Set(calc.fields.map((f) => f.k));
  for (const key of Object.keys(inputs)) {
    if (!knownKeys.has(key)) {
      throw new ToolInputError(`Unknown input "${key}" for ${id}. Valid inputs: ${[...knownKeys].join(", ")}`);
    }
    if (typeof inputs[key] !== "number" || !isFinite(inputs[key])) {
      throw new ToolInputError(`Input "${key}" must be a finite number`);
    }
  }

  const values = {};
  const defaulted = [];
  const clamped = [];
  for (const f of calc.fields) {
    let v = inputs[f.k];
    if (v === undefined) {
      v = f.v;
      defaulted.push(f.k);
    }
    if (f.min !== undefined && v < f.min) { v = f.min; clamped.push(f.k); }
    if (f.max !== undefined && v > f.max) { v = f.max; clamped.push(f.k); }
    values[f.k] = v;
  }

  const result = computeLeak(id, values);
  const rows = result.rows.map(([k, v]) => `- ${k}: **${v}**`).join("\n");
  const caveats = [];
  if (defaulted.length) caveats.push(`Used illustrative defaults for: ${defaulted.join(", ")} — swap in real numbers for a figure worth acting on.`);
  if (clamped.length) caveats.push(`Clamped out-of-range inputs: ${clamped.join(", ")}.`);

  const body = [
    `# ${calc.title}: ${result.big}`,
    `_${result.bigLabel}_`,
    rows,
    caveats.length ? caveats.map((c) => `⚠ ${c}`).join("\n") : null,
    `This is an estimate from your inputs, not a measurement. ${calc.note}`,
    `_${calc.cite}_`,
    `The fix is in the article: ${origin(ctx.env)}${calc.article} (${calc.articleTitle})`,
  ].filter(Boolean).join("\n\n");

  return text(body + nextSteps(ctx.env, [
    "This prices one leak. `run_scorecard` ranks all three axes: deals, time, and cash.",
    ...FUNNEL_LINKS.slice(1, 2),
  ]));
}

// ---------- Frameworks & offer ----------

function getFrameworks(args, ctx) {
  const section = requireEnum(args, "section", ["dispositions", "process", "all"]) || "all";
  const parts = [];

  if (section === "dispositions" || section === "all") {
    const rows = dispositions
      .map((d) => `- **${d.label}** — "${d.question}" ${d.meaning}`)
      .join("\n");
    parts.push(
      `# The Five Dispositions\n${dispositionFraming.heading} ${dispositionFraming.intro}\n\n${rows}\n\n${dispositionFraming.afterTable}\n\n**${dispositionFraming.aiHeading}** ${dispositionFraming.aiBody}\n\nFull page: ${origin(ctx.env)}/dispositions/`
    );
  }

  if (section === "process" || section === "all") {
    const rows = processPhases
      .map((p) => `${p.num}. **${p.name}** (${p.short}) — ${p.body}\n   Principle: _${p.principle}_ · Output: ${p.output}`)
      .join("\n");
    parts.push(`# The 5-Phase Process\n${rows}\n\nFull pages: ${origin(ctx.env)}/process/ and ${origin(ctx.env)}/principles/`);
  }

  return text(parts.join("\n\n---\n\n") + nextSteps(ctx.env, FUNNEL_LINKS.slice(0, 2)));
}

function getHiddenProfitReviewInfo(args, ctx) {
  const o = origin(ctx.env);
  const body = [
    `# The Hidden Profit Review`,
    `**Find the profit hiding in how your business actually runs.**`,
    `Bring one recurring process that is quietly costing time, follow-up, or cash. Jonathan Malkin (AI Workflow Consultant & Implementation Partner, Austin TX) maps the workflow, surfaces the profit it is leaking, and tells you whether to pilot AI now, clean up first, hand it off, or leave it alone.`,
    `**What it is:** a measured review of one recurring business workflow to surface the profit it is leaking in deals, time, and cash, with one safe first AI pilot recommendation. Every step that touches a high-stakes decision keeps a human at the gate by design, and clients own everything that gets built.`,
    `**What you get:** the business case with financial projections, a process scorecard, the workflow mapped end to end with per-step verdicts (eliminate / simplify / automate / optimize / report), and the first pilot recommendation. See a complete worked sample for a $24M general contractor: ${o}/hidden-profit-review/sample/`,
    `**How it runs:** Jonathan runs every review personally, so capacity is 4 reviews a month and spots go through a waitlist — invites go out in order, no obligation. Joining takes about 30 seconds at ${o}/hidden-profit-review/#waitlist`,
    `**Not sure it's for you yet?** The free 3-minute scorecard (${o}/scorecard/) ranks where you're leaking deals, time, and cash — or run it right here with the \`run_scorecard\` tool. The use case library (${o}/use-cases/) shows ${useCases.length} worked examples of what fixes look like.`,
  ].join("\n\n");
  return text(body);
}

// ---------- Articles ----------

let articlesCache = null;

async function loadArticles(ctx) {
  if (articlesCache) return articlesCache;
  const url = new URL("/mcp/articles.json", origin(ctx.env));
  const response = await ctx.env.ASSETS.fetch(new Request(url, { redirect: "follow" }));
  if (!response.ok) throw new Error(`article index unavailable (${response.status})`);
  articlesCache = await response.json();
  return articlesCache;
}

async function searchArticles(args, ctx) {
  const query = requireString(args, "query");
  const tag = requireString(args, "tag", { max: 60 });
  let limit = args?.limit ?? 10;
  if (typeof limit !== "number" || !isFinite(limit)) throw new ToolInputError("limit must be a number");
  limit = Math.max(1, Math.min(MAX_SEARCH_RESULTS, Math.floor(limit)));

  const articles = await loadArticles(ctx);
  const q = (query || "").toLowerCase();
  const t = (tag || "").toLowerCase();

  const matches = [];
  for (const a of articles) {
    if (t && !a.tags.some((x) => x.toLowerCase() === t)) continue;
    let rank = 0;
    if (q) {
      const meta = `${a.title} ${a.description} ${a.tags.join(" ")}`.toLowerCase();
      if (meta.includes(q)) rank = 0;
      else if ((a.body || "").toLowerCase().includes(q)) rank = 1;
      else continue;
    }
    matches.push({ a, rank });
  }
  // Title/description/tag matches outrank body-only mentions; newest first within each.
  matches.sort((x, y) => x.rank - y.rank || (x.a.date < y.a.date ? 1 : -1));

  if (!matches.length) {
    return text(`No articles matched. All articles: ${origin(ctx.env)}/articles/ (RSS: ${origin(ctx.env)}/rss.xml)`);
  }

  const shown = matches.slice(0, limit).map((m) => m.a);
  const rows = shown.map((a) => `- **${a.title}** (${a.date}) — ${a.description}\n  slug: \`${a.slug}\` · ${a.url}`);
  const header = `Found ${matches.length} article${matches.length === 1 ? "" : "s"}${matches.length > shown.length ? ` (showing ${shown.length})` : ""}. Call \`get_article\` with a slug for the full text.`;
  return text(`${header}\n\n${rows.join("\n")}`);
}

async function getArticle(args, ctx) {
  const slug = requireString(args, "slug", { required: true, max: 120 });
  const articles = await loadArticles(ctx);
  const article = articles.find((a) => a.slug === slug);
  if (!article) {
    return toolError(`No article with slug "${slug}". Use search_articles to find one.`);
  }
  if (!article.body) {
    return text(`**${article.title}** (${article.date})\n\n${article.description}\n\nThis one is an interactive page rather than markdown — read it at ${article.url}`);
  }
  let body = article.body;
  let truncated = "";
  if (body.length > MAX_ARTICLE_BODY_CHARS) {
    body = body.slice(0, MAX_ARTICLE_BODY_CHARS);
    truncated = `\n\n_[Truncated — full article at ${article.url}]_`;
  }
  const meta = `# ${article.title}\n_${article.date} · tags: ${article.tags.join(", ")} · canonical: ${article.url}_\n\n> ${article.description}\n\n`;
  return text(meta + body + truncated);
}

// ---------- Tool registry ----------

const SCORECARD_PROPERTIES = (() => {
  const props = {
    segment: {
      type: "string",
      enum: Object.keys(SEGMENTS),
      description:
        "What kind of business is this? " +
        Object.entries(SEGMENTS).map(([id, label]) => `${id} = ${label}`).join("; "),
    },
  };
  for (const q of QUESTIONS) {
    props[q.id] = {
      type: "string",
      enum: optionLabels(q.id),
      description: q.q + (q.mag ? " (optional — flavors the reading, does not affect the score)" : ""),
    };
  }
  return props;
})();

export const TOOLS = [
  {
    name: "list_use_case_categories",
    description:
      "List the 15 categories of the Built with Jon Use Case Library (96 worked small-business AI/automation examples), grouped by business function, industry, and personal, with counts and key stats. Call this first to orient before searching.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    handler: listUseCaseCategories,
  },
  {
    name: "search_use_cases",
    description:
      "Search the 96-entry Use Case Library of small-business AI and automation workflows. Call this when a user describes a recurring business pain (missed leads, invoice chasing, status meetings, no-shows...) to find worked examples with per-step automation verdicts. Filter by keyword, category, frequency, automation level, or disposition.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Keyword matched against name, subject, pain line, workflow steps, and AI-fit text" },
        category_id: { type: "string", enum: CATEGORY_IDS, description: "Category id from list_use_case_categories" },
        frequency: { type: "string", description: "Substring match on frequency, e.g. 'daily', 'weekly', 'monthly', 'per hire'" },
        automation: { type: "string", enum: AUTOMATION_LEVELS },
        disposition: { type: "string", enum: DISPOSITION_IDS, description: "Only use cases where some step gets this verdict" },
      },
      additionalProperties: false,
    },
    handler: searchUseCases,
  },
  {
    name: "get_use_case",
    description:
      "Get one use case from the library in full: the pain, the workflow as it actually runs, per-step verdicts (eliminate / simplify / automate / optimize / report) with rationale, where AI genuinely fits, and the after state. Ids look like 'A1' or 'S3'.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", description: "Use case id, e.g. 'A1'" } },
      required: ["id"],
      additionalProperties: false,
    },
    handler: getUseCase,
  },
  {
    name: "run_scorecard",
    description:
      "Run Built with Jon's 3-minute AI Workflow Scorecard: ask the user these questions conversationally, then call this with their answers to get a scored verdict on where their business is leaking deals, time, and cash — plus the first fix worth making. Same deterministic scoring as builtwithjon.com/scorecard/. No email or signup involved.",
    inputSchema: {
      type: "object",
      properties: SCORECARD_PROPERTIES,
      required: ["segment", "q2", "q3", "q6", "q7", "q8"],
      additionalProperties: false,
    },
    handler: runScorecard,
  },
  {
    name: "list_leak_calculators",
    description:
      "List the 10 leak calculators (missed calls, slow bids, unbilled change orders, unanswered inquiries, engagement-letter delay, cold DMs, slow quotes, no-shows, first-reply speed, invoice aging) with their input fields and defaults. Use before calculate_leak.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    handler: listLeakCalculators,
  },
  {
    name: "calculate_leak",
    description:
      "Put a monthly/annual dollar figure on one operational leak using Built with Jon's Leak Calculator math (identical to the website's). Call when a user wants to know what missed calls, slow follow-up, no-shows, unbilled change orders, or aging invoices are costing them. Missing inputs fall back to illustrative defaults and are flagged.",
    inputSchema: {
      type: "object",
      properties: {
        calculator_id: { type: "string", enum: CALC_IDS },
        inputs: {
          type: "object",
          description: "Numbers keyed by the field names from list_leak_calculators; omit any you don't know",
          additionalProperties: { type: "number" },
        },
      },
      required: ["calculator_id"],
      additionalProperties: false,
    },
    handler: calculateLeak,
  },
  {
    name: "get_frameworks",
    description:
      "Get Built with Jon's decision frameworks: the Five Dispositions (the five-question treatment every workflow step gets before anyone automates anything) and the 5-phase implementation process. Call when discussing how to decide what to automate.",
    inputSchema: {
      type: "object",
      properties: { section: { type: "string", enum: ["dispositions", "process", "all"] } },
      additionalProperties: false,
    },
    handler: getFrameworks,
  },
  {
    name: "get_hidden_profit_review_info",
    description:
      "Get the details of the Hidden Profit Review — Jonathan Malkin's paid, measured review of one recurring business workflow (deliverables, worked sample, waitlist mechanics, capacity). Call when a user wants professional help finding or fixing a profit leak.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    handler: getHiddenProfitReviewInfo,
  },
  {
    name: "search_articles",
    description:
      "Search Jonathan Malkin's ~50 articles on small-business workflow leaks, Claude Code infrastructure (the Jules system), AI agents, and AI operations. Filter by keyword and/or tag; returns titles, descriptions, and slugs for get_article.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Keyword matched against title, description, tags, and body" },
        tag: { type: "string", description: "Exact tag match, case-insensitive" },
        limit: { type: "number", description: "Max results, 1-20 (default 10)" },
      },
      additionalProperties: false,
    },
    handler: searchArticles,
  },
  {
    name: "get_article",
    description: "Get the full markdown text of one article by slug (from search_articles), with canonical URL.",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string", description: "Article slug, e.g. 'missed-call-math-home-services'" } },
      required: ["slug"],
      additionalProperties: false,
    },
    handler: getArticle,
  },
];

export function toolList() {
  return TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema }));
}

/** Dispatch a tools/call. Returns an MCP tool result; throws ToolInputError
 *  for schema-shaped problems (mapped to -32602 by the handler). */
export async function callTool(name, args, ctx) {
  const tool = TOOLS.find((t) => t.name === name);
  if (!tool) return null;
  try {
    return await tool.handler(args || {}, ctx);
  } catch (err) {
    if (err instanceof ToolInputError) throw err;
    console.error(`mcp tool ${name} failed`, err);
    return toolError("Tool execution failed. Try again, or browse the site directly at " + origin(ctx.env));
  }
}
