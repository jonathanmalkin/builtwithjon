// Scorecard content and scoring, shared by:
//   - src/worker.js  (/api/scorecard-report email + the MCP run_scorecard tool)
//   - src/pages/scorecard.astro keeps its own inline copy of QUESTIONS/LINES
//     (its script uses define:vars) — if you change wording or weights here,
//     change them there too.
//
// LINES copy here is the email/report variant (no contractions), lifted
// verbatim from the original worker.js constants.

export const SEGMENTS: Record<string, string> = {
  gc: 'General contracting',
  re: 'Real estate',
  hs: 'Home services & trades',
  pm: 'Property management',
  ps: 'Professional services',
  hw: 'Health & wellness',
  cc: 'Coaching or creator',
  general: 'Something else / general business',
};

/** Sentence-ready segment wording. Keep grammar here so every scorecard
 * surface describes the general fallback without producing “business business.” */
export function segmentBusinessPhrase(segment: string): string {
  if (segment === 'general') return 'a general business';
  const label = SEGMENTS[segment] || SEGMENTS.general;
  return `a ${label.toLowerCase()} business`;
}

export function segmentBusinessPlural(segment: string): string {
  if (segment === 'general') return 'general businesses';
  const label = SEGMENTS[segment] || SEGMENTS.general;
  return `${label.toLowerCase()} businesses`;
}

export type Axis = 'deals' | 'time' | 'cash';

export interface ScorecardQuestion {
  id: string;
  axis: Axis | null;
  q: string;
  help?: string;
  /** Magnitude questions flavor copy and dollar estimates; they are NOT leak
   *  signals and are excluded from scoring. */
  mag?: 'volume' | 'hours' | 'revenue';
  optional?: boolean;
  /** [label, leak weight 0..3] — higher = more leak on the axis. */
  options: [string, number][];
}

// Mirrors the quiz in src/pages/scorecard.astro (q1/segment handled separately).
export const QUESTIONS: ScorecardQuestion[] = [
  {
    id: 'q2', axis: 'deals', q: 'A new lead comes in. How fast does someone respond?',
    options: [['Within minutes', 0], ['Same day', 1], ['A day or two', 2], ["Honestly, it's inconsistent", 3]],
  },
  {
    id: 'q3', axis: 'deals', q: "A lead doesn't buy right away. Then what?",
    options: [['They go into a follow-up sequence that runs on its own', 0], ['Someone follows up manually, when they remember', 2], ['Usually nothing', 3], ['Not sure', 2]],
  },
  {
    id: 'q4', axis: 'deals', q: 'Roughly how many new leads or inquiries come in a month?', mag: 'volume',
    options: [['Under 10', 0], ['10 to 50', 1], ['50 to 200', 2], ['More than 200', 3]],
  },
  {
    id: 'q5', axis: 'time', q: 'How many hours a week do you spend on admin, chasing status, and re-typing the same information?', mag: 'hours',
    options: [['A few', 0], ['Around 5 to 10', 1], ['10 to 20', 2], ['More than I want to admit', 3]],
  },
  {
    id: 'q6', axis: 'time', q: 'How much of your work lives across separate tools you copy between by hand?',
    options: [["It's mostly connected", 0], ['Some manual copying', 1], ['A lot of manual copying', 2], ["It's all held together by hand", 3]],
  },
  {
    id: 'q7', axis: 'time', q: 'How often does work get redone because of a miss, a gap, or bad information?',
    options: [['Rarely', 0], ['A few times a month', 1], ['Most weeks', 2], ['Constantly', 3]],
  },
  {
    id: 'q8', axis: 'cash', q: 'After work is done, how fast do you invoice and get paid?',
    options: [['Right away, mostly automated', 0], ['Within a week', 1], ['Slow and manual', 2], ['It slips, and some of it never gets chased', 3]],
  },
  {
    id: 'q9', axis: 'cash', q: "Last one, and you can skip it. Roughly, what's monthly revenue?", mag: 'revenue', optional: true,
    help: "Skip it and we'll show your leaks as percentages instead of dollars.",
    options: [['Under $25k', 0], ['$25k to $100k', 1], ['$100k to $500k', 1], ['More than $500k', 1], ['Skip', 0]],
  },
];

export const LINES: Record<string, Record<Axis, string>> = {
  gc: {
    deals: 'Bids and follow-ups are slipping between the field and the office.',
    time: 'Too much of the week goes to chasing information instead of building.',
    cash: 'Slow invoicing and rework are eating margin you already earned.',
  },
  re: {
    deals: 'The first agent to respond usually wins, and you are not always first.',
    time: 'Non-revenue admin and document wrangling are eating hours that should be in front of clients.',
    cash: 'Deals fall through in the gaps in follow-through, not in pricing.',
  },
  hs: {
    deals: 'Calls that hit voicemail go straight to the next contractor on the list.',
    time: 'Intake and quoting are getting squeezed between jobs, so follow-up slips.',
    cash: 'Jobs are done but the invoice chase drags, and some of it never gets chased.',
  },
  pm: {
    deals: 'Leasing inquiries are slipping before anyone follows up.',
    time: 'The same handful of recurring problems eat the week on a loop.',
    cash: 'Rent chasing and late payments are a standing drain on the month.',
  },
  ps: {
    deals: 'Inquiries are going unanswered, and prospects book whoever replied first.',
    time: 'Too much expert time is non-billable, reconstructing and re-drafting from scratch.',
    cash: 'Invoices and engagement letters drag, so earned fees collect slowly.',
  },
  hw: {
    deals: 'New callers who reach voicemail do not call back, they book elsewhere.',
    time: 'Insurance and intake admin are eating clinical hours.',
    cash: 'No-shows and unfilled slots are leaving revenue in empty chairs.',
  },
  cc: {
    deals: 'Leads that found you are going unanswered while you are heads-down creating.',
    time: 'Packaging and posting are eating the hours that should go to the work only you can do.',
    cash: 'Churn and refunds are leaking revenue you already won.',
  },
  general: {
    deals: 'Leads are going cold before anyone answers. Odds of even qualifying a lead drop sharply between a 5-minute and a 30-minute reply.',
    time: 'Too much of the week goes to status-chasing and re-typing the same thing between disconnected tools.',
    cash: 'Invoices and collections are slipping, and money you earned is sitting uncollected.',
  },
};

export const TIER_VERDICTS: Record<string, string> = {
  Holding: 'Your systems are mostly holding. The leaks here are small, and most of the win is sharpening what already works.',
  Leaking: 'There are real, fixable losses here. A couple of spots are quietly costing you, and they are the kind of thing that is fixable without ripping anything out.',
  'Wide open': 'A lot is getting through the gaps. Deals, hours, and cash are leaking in more than one place. The good news: that also means the first fix pays for itself fast.',
};

export const FIRST_MOVES: Record<Axis, string> = {
  deals: 'Start with the first-response and follow-up path. Make one owner, one trigger, and one reviewed follow-up loop clear before adding any fancy automation.',
  time: 'Start with the repeated admin handoff. Pick the status chase or copy-paste loop that happens every week and turn it into one reviewed workflow.',
  cash: 'Start with the invoice and collection moment. Make the handoff from work complete to invoice sent visible, timed, and reviewed.',
};

export const AXIS_LABELS: Record<Axis, string> = {
  deals: 'Deals',
  time: 'Time',
  cash: 'Cash',
};

export function tierFor(score: number): string {
  if (score >= 60) return 'Wide open';
  if (score >= 30) return 'Leaking';
  return 'Holding';
}

export function compositeScore(scores: Record<Axis, number>): number {
  return Math.round((scores.deals + scores.time + scores.cash) / 3);
}

/** Axis scores 0..100 from per-question leak weights (0..3). Same formula as
 *  the quiz: average weight over the answered, non-magnitude questions on the
 *  axis. Unanswered axes score 0. */
export function axisScores(weights: Partial<Record<string, number>>): Record<Axis, number> {
  const scores = { deals: 0, time: 0, cash: 0 } as Record<Axis, number>;
  for (const axis of ['deals', 'time', 'cash'] as Axis[]) {
    const items = QUESTIONS.filter((x) => x.axis === axis && !x.mag && typeof weights[x.id] === 'number');
    if (!items.length) continue;
    const sum = items.reduce((a, x) => a + (weights[x.id] || 0), 0);
    scores[axis] = Math.round((sum / (items.length * 3)) * 100);
  }
  return scores;
}
