// The Leak Calculator: definitions and math for the ten leak calculators.
// Single source of truth, shared by:
//   - /tools/leak-calculator  (the interactive page)
//   - the MCP server in src/worker.js  (the calculate_leak tool)
// so the on-page numbers and the MCP numbers can never drift.
//
// computeLeak returns pre-formatted display strings ({big, bigLabel, rows})
// because both consumers present the same rounded dollar figures.

export interface CalcField {
  k: string;
  label: string;
  v: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface Calc {
  id: string;
  title: string;
  segment: string;
  axis: 'deals' | 'cash';
  desc: string;
  fields: CalcField[];
  note: string;
  cite: string;
  article: string;
  articleTitle: string;
}

export interface LeakResult {
  big: string;
  bigLabel: string;
  rows: [string, string][];
}

export const CALCS: Calc[] = [
  {
    id: 'missed-calls',
    title: 'Missed calls',
    segment: 'Home services',
    axis: 'deals',
    desc: 'Calls that ring out while your crews are on jobs. The caller usually dials the next company on the list.',
    fields: [
      { k: 'calls', label: 'Missed calls per month (check your call log, do not guess)', v: 30, min: 0 },
      { k: 'per', label: 'One real job request per how many missed calls?', v: 3, min: 1 },
      { k: 'ticket', label: 'Average ticket ($)', v: 450, min: 0 },
    ],
    note: 'Pull the actual call log before believing any of this. If your working-hours answer rate is genuinely high, this is not your leak. Look at your invoice chase instead.',
    cite: 'Example inputs from the article. No industry benchmark is assumed here.',
    article: '/articles/missed-call-math-home-services/',
    articleTitle: 'The missed-call math',
  },
  {
    id: 'slow-bids',
    title: 'Slow bid follow-up',
    segment: 'Contractors',
    axis: 'deals',
    desc: 'Bids that go out and then go quiet. The close-rate difference between fast and slow follow-up is the leak.',
    fields: [
      { k: 'bids', label: 'Bids sent per month', v: 20, min: 0 },
      { k: 'value', label: 'Average job value ($)', v: 18000, min: 0 },
      { k: 'fast', label: 'Close rate with follow-up inside a day (%)', v: 30, min: 0, max: 100 },
      { k: 'slow', label: 'Close rate when follow-up slips past a week (%)', v: 25, min: 0, max: 100 },
    ],
    note: 'Every bid that dies from silence still consumed the walk-through, the takeoff, and the proposal. You paid to lose.',
    cite: 'Example inputs, not benchmarks. The five-point swing is the article’s illustration. Use a swing you actually believe.',
    article: '/articles/slow-bid-follow-up-loses-jobs/',
    articleTitle: 'Slow bid follow-up loses jobs',
  },
  {
    id: 'change-orders',
    title: 'Unbilled change orders',
    segment: 'Contractors',
    axis: 'cash',
    desc: 'Extra work that got a verbal yes in the field and never made it onto an invoice.',
    fields: [
      { k: 'value', label: 'Typical contract value ($)', v: 400000, min: 0 },
      { k: 'co', label: 'Change orders as % of contract', v: 8, min: 0, max: 100 },
      { k: 'undoc', label: 'Portion never formally documented (%)', v: 30, min: 0, max: 100 },
      { k: 'jobs', label: 'Jobs per year at this scale', v: 5, min: 0 },
    ],
    note: 'This is completed work you already paid crews for. Capture at the moment of the yes beats reconstruction at billing time.',
    cite: 'The 8% and 30% figures are the article’s typical-remodel illustration. Put in your real contract mix.',
    article: '/articles/change-order-revenue-never-invoiced/',
    articleTitle: 'Change-order revenue you never invoiced',
  },
  {
    id: 'inquiries',
    title: 'Unanswered inquiries',
    segment: 'Professional services',
    axis: 'deals',
    desc: 'New inquiries that sit past the day they arrive. Prospects reached promptly close at a very different rate than prospects reached late.',
    fields: [
      { k: 'inq', label: 'New inquiries per month (email + phone)', v: 20, min: 0 },
      { k: 'sameday', label: 'Portion answered same-day today (%)', v: 40, min: 0, max: 100 },
      { k: 'value', label: 'Average engagement value ($)', v: 8000, min: 0 },
      { k: 'fast', label: 'Close rate when reached within the day (%)', v: 30, min: 0, max: 100 },
      { k: 'slow', label: 'Close rate when reached late or never (%)', v: 10, min: 0, max: 100 },
    ],
    note: 'The estimate assumes half of your slow-answered inquiries would have converted at the prompt rate. The other half were never going to hire you anyway.',
    cite: 'The same-day default reflects Clio’s 2024 Legal Trends finding that only 40% of firms answered calls and 60% never answered email inquiries at all.',
    article: '/articles/inquiry-that-booked-your-competitor/',
    articleTitle: 'The inquiry that booked your competitor',
  },
  {
    id: 'letters',
    title: 'Engagement-letter delay',
    segment: 'Professional services',
    axis: 'cash',
    desc: 'The gap between the verbal yes and the signed letter. The fee clock does not start until the document goes out.',
    fields: [
      { k: 'eng', label: 'New engagements per month, firm-wide', v: 6, min: 0 },
      { k: 'delay', label: 'Average delay from verbal yes to signed letter (business days)', v: 6, min: 0 },
      { k: 'fee', label: 'Average monthly fee once engaged ($)', v: 4000, min: 0 },
    ],
    note: 'This money is pushed later, not lost outright. But a slow-start engagement is more likely to become a slow-pay engagement.',
    cite: 'Example inputs from the article. No industry benchmark is assumed here.',
    article: '/articles/same-day-engagement-letters/',
    articleTitle: 'Same-day engagement letters',
  },
  {
    id: 'cold-dms',
    title: 'Cold DMs and inquiries',
    segment: 'Coaches and creators',
    axis: 'deals',
    desc: 'Your content generated the interest. Then the inquiry sat in an inbox while you were heads-down creating.',
    fields: [
      { k: 'inq', label: 'Inbound inquiries per month (DMs, form fills, replies)', v: 25, min: 0 },
      { k: 'un', label: 'Portion that go unanswered past 24 hours (%)', v: 50, min: 0, max: 100 },
      { k: 'book', label: 'Portion of those still worth booking a call with (%)', v: 25, min: 0, max: 100 },
      { k: 'value', label: 'Value of a booked call that converts ($)', v: 1500, min: 0 },
    ],
    note: 'This counts only the conversations that went quiet before you saw them. Late replies that still lose are on top of this.',
    cite: 'Context: RevenueHero’s 2024 study of 1,000 B2B companies found 63.5% never responded to inbound leads at all.',
    article: '/articles/leads-go-cold-heads-down-creating/',
    articleTitle: 'Leads go cold while you are heads-down creating',
  },
  {
    id: 'slow-quotes',
    title: 'Slow quotes',
    segment: 'Home services',
    axis: 'deals',
    desc: 'The quote that waits until Friday competes with everyone who answered sooner.',
    fields: [
      { k: 'quotes', label: 'Quotes sent per month', v: 25, min: 0 },
      { k: 'ticket', label: 'Average ticket ($)', v: 2200, min: 0 },
      { k: 'fast', label: 'Close rate with same-day follow-up (%)', v: 35, min: 0, max: 100 },
      { k: 'slow', label: 'Close rate when follow-up slips a few days (%)', v: 28, min: 0, max: 100 },
    ],
    note: 'These are stated example inputs, not benchmarks. Put in your own quote volume, ticket size, and a follow-up-speed swing you actually believe.',
    cite: 'Example inputs from the article. No industry benchmark is assumed here.',
    article: '/articles/quote-that-waited-until-friday/',
    articleTitle: 'The quote that waited until Friday',
  },
  {
    id: 'no-shows',
    title: 'No-shows',
    segment: 'Clinics and wellness',
    axis: 'deals',
    desc: 'Visits that were scheduled, staffed for, and never delivered.',
    fields: [
      { k: 'prov', label: 'Providers', v: 3, min: 0 },
      { k: 'visits', label: 'Visits scheduled per provider, per day', v: 25, min: 0 },
      { k: 'rate', label: 'No-show rate (%)', v: 6.81, min: 0, max: 100, step: 0.01 },
      { k: 'value', label: 'Average visit value, net collected ($)', v: 140, min: 0 },
      { k: 'days', label: 'Clinic days per month', v: 22, min: 0, max: 31 },
    ],
    note: 'Pull your real no-show rate from your scheduling system rather than guessing. Most owners underestimate it. North of 10% and this is very likely your biggest leak.',
    cite: 'The 6.81% default is the MGMA 2023 median patient no-show rate.',
    article: '/articles/empty-chairs-no-show-math/',
    articleTitle: 'The empty-chairs no-show math',
  },
  {
    id: 'first-reply',
    title: 'The first-reply window',
    segment: 'Real estate',
    axis: 'deals',
    desc: 'Online leads mostly go to whoever replies first. This is what is riding on your reply speed.',
    fields: [
      { k: 'leads', label: 'Online leads per month (site, Zillow, Realtor.com)', v: 40, min: 0 },
      { k: 'share', label: 'Portion that go to whoever replies first (%)', v: 50, min: 0, max: 100 },
      { k: 'close', label: 'Lead-to-close rate (%)', v: 4, min: 0, max: 100, step: 0.1 },
      { k: 'comm', label: 'Average commission per closed deal ($)', v: 9000, min: 0 },
    ],
    note: 'This is commission riding on speed, not commission lost. Even the conservative read, one extra closed deal a quarter from being consistently first, is real money.',
    cite: 'NAR 2024: 78% of buyers work with the first agent who responds. The up-for-grabs share is an example input, not a benchmark.',
    article: '/articles/five-minute-reply-window-listing/',
    articleTitle: 'The five-minute reply window',
  },
  {
    id: 'invoice-aging',
    title: 'Invoice aging',
    segment: 'Any business',
    axis: 'cash',
    desc: 'Money you already earned, parked in receivables while payroll stays a fixed date.',
    fields: [
      { k: 'out', label: 'Total outstanding receivables ($)', v: 17500, min: 0 },
      { k: 'share', label: 'Portion sitting 30+ days past due (%)', v: 47, min: 0, max: 100 },
      { k: 'payroll', label: 'Weekly payroll ($)', v: 18000, min: 0 },
    ],
    note: 'This is cash parked, not cash lost. Pull your own aging report before trusting it. If the 30-plus bucket is small, this is not your leak.',
    cite: 'Defaults are the Intuit QuickBooks 2025 national pattern: $17,500 average owed, 47% of small businesses carrying invoices 30+ days overdue.',
    article: '/articles/invoice-chase-payroll-problem/',
    articleTitle: 'The invoice chase is a payroll problem',
  },
];

function money(n: number): string {
  if (!isFinite(n)) n = 0;
  return '$' + Math.round(n).toLocaleString('en-US');
}

function num(n: number, dp?: number): string {
  if (!isFinite(n)) n = 0;
  return dp ? n.toFixed(dp) : Math.round(n).toLocaleString('en-US');
}

type Formula = (v: Record<string, number>) => LeakResult;

const FORMULAS: Record<string, Formula> = {
  'missed-calls': (v) => {
    const jobs = v.per > 0 ? v.calls / v.per : 0;
    const mo = jobs * v.ticket;
    return {
      big: money(mo), bigLabel: 'estimated leak per month',
      rows: [
        ['Per year', money(mo * 12)],
        ['Real job requests missed per month', num(jobs)],
      ],
    };
  },
  'slow-bids': (v) => {
    const swing = (v.fast - v.slow) / 100;
    const mo = v.bids * v.value * swing;
    return {
      big: money(mo), bigLabel: 'estimated leak per month',
      rows: [
        ['Per year', money(mo * 12)],
        ['Extra jobs per month at stake', num(v.bids * swing, 1)],
      ],
    };
  },
  'change-orders': (v) => {
    const perJob = v.value * (v.co / 100) * (v.undoc / 100);
    return {
      big: money(perJob), bigLabel: 'per job, completed and never invoiced',
      rows: [
        ['Per year at ' + num(v.jobs) + ' jobs', money(perJob * v.jobs)],
        ['Change-order revenue per job', money(v.value * (v.co / 100))],
      ],
    };
  },
  'inquiries': (v) => {
    const unanswered = v.inq * (1 - v.sameday / 100);
    const extraEng = unanswered * 0.5 * ((v.fast - v.slow) / 100);
    const mo = extraEng * v.value;
    return {
      big: money(mo), bigLabel: 'estimated leak per month',
      rows: [
        ['Per year', money(mo * 12)],
        ['Inquiries not answered same-day', num(unanswered, 1) + ' / month'],
        ['Engagements at stake per month', num(extraEng, 1)],
      ],
    };
  },
  'letters': (v) => {
    const daily = (v.fee * 12) / 365;
    const mo = v.eng * v.delay * daily;
    return {
      big: money(mo), bigLabel: 'in fees pushed later each month (not lost outright)',
      rows: [
        ['Per year', money(mo * 12)],
        ['Drag per engagement', money(v.delay * daily)],
      ],
    };
  },
  'cold-dms': (v) => {
    const convos = v.inq * (v.un / 100) * (v.book / 100);
    const mo = convos * v.value;
    return {
      big: money(mo), bigLabel: 'estimated leak per month',
      rows: [
        ['Per year', money(mo * 12)],
        ['Qualified conversations gone quiet', num(convos, 1) + ' / month'],
      ],
    };
  },
  'slow-quotes': (v) => {
    const swing = (v.fast - v.slow) / 100;
    const mo = v.quotes * v.ticket * swing;
    return {
      big: money(mo), bigLabel: 'estimated leak per month',
      rows: [
        ['Per year', money(mo * 12)],
        ['Extra jobs per month at stake', num(v.quotes * swing, 1)],
      ],
    };
  },
  'no-shows': (v) => {
    const perDay = v.prov * v.visits * (v.rate / 100) * v.value;
    const mo = perDay * v.days;
    return {
      big: money(mo), bigLabel: 'estimated leak per month',
      rows: [
        ['Per day', money(perDay)],
        ['Per year', money(mo * 12)],
        ['No-shows per day across the clinic', num(v.prov * v.visits * (v.rate / 100), 1)],
      ],
    };
  },
  'first-reply': (v) => {
    const contested = v.leads * (v.share / 100);
    const yr = contested * (v.close / 100) * v.comm * 12;
    return {
      big: money(yr), bigLabel: 'in commission riding on who replies first, per year',
      rows: [
        ['Leads up for grabs on speed', num(contested) + ' / month'],
        ['Conservative read (one extra deal a quarter)', money(v.comm * 4) + ' / year'],
      ],
    };
  },
  'invoice-aging': (v) => {
    const over30 = v.out * (v.share / 100);
    const weeks = v.payroll > 0 ? v.out / v.payroll : 0;
    return {
      big: money(over30), bigLabel: 'sitting 30+ days past due (parked, not lost)',
      rows: [
        ['Total parked in receivables', money(v.out)],
        ['Weeks of payroll that covers', num(weeks, 1)],
      ],
    };
  },
};

/** Run one calculator. Unknown ids return null; missing keys are treated as 0
 *  (matching the page's parseFloat(...) || 0 input handling). */
export function computeLeak(id: string, values: Record<string, number>): LeakResult | null {
  const fn = FORMULAS[id];
  if (!fn) return null;
  const v: Record<string, number> = {};
  const calc = CALCS.find((c) => c.id === id);
  for (const f of calc ? calc.fields : []) {
    const raw = values[f.k];
    v[f.k] = typeof raw === 'number' && isFinite(raw) ? raw : 0;
  }
  return fn(v);
}
