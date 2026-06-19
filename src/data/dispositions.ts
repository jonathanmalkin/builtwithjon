// The five dispositions: the per-step verdict lens applied inside "Decide each
// step" of the process. This is the brand's third framework (the others are the
// Principles and the Process in ./process.ts).
//
// Single source of truth, shared by:
//   - /dispositions  (the full standalone page)
//   - /use-cases     (the compact legend + per-case tags)
// so the wording and the icon glyphs cannot drift between them.
//
// Copy here is lifted verbatim from the original use-cases.astro framework block.
// `icon` is the SVG inner-path markup for each disposition's line glyph; render
// it inside an <svg viewBox="0 0 24 24"> that sets stroke + currentColor so the
// glyph picks up the disposition's color from its container.

export type DispositionId = 'eliminate' | 'simplify' | 'automate' | 'optimize' | 'report';

export interface Disposition {
  id: DispositionId;
  label: string;
  question: string;
  meaning: string;
  /** Inner SVG markup for a 24x24, stroke="currentColor" line icon. */
  icon: string;
}

export const dispositions: Disposition[] = [
  {
    id: 'eliminate',
    label: 'Eliminate',
    question: 'Should this step exist at all?',
    meaning: 'Stop doing it. Nobody misses it.',
    icon: '<path d="M6 6l12 12M18 6L6 18"/>',
  },
  {
    id: 'simplify',
    label: 'Simplify',
    question: 'Can this be fewer steps, fewer tools, fewer people?',
    meaning: 'Make the default smarter.',
    icon: '<path d="M5 5l7 7M19 5l-7 7M12 12v7"/>',
  },
  {
    id: 'automate',
    label: 'Automate',
    question: 'Can software do this without a human?',
    meaning: 'A trigger fires, the work happens.',
    icon: '<path d="M13 3L5 13h6l-1 8 8-11h-6z"/>',
  },
  {
    id: 'optimize',
    label: 'Optimize',
    question: 'A human still does it, can they do it in a tenth of the time?',
    meaning: 'AI drafts, you approve.',
    icon: '<path d="M5 18a7 7 0 0 1 14 0"/><path d="M12 18l4-5"/>',
  },
  {
    id: 'report',
    label: 'Report',
    question: "Can the exhaust of this work give you visibility you've never had?",
    meaning: "Finally see what's actually happening.",
    icon: '<path d="M6 20V13M12 20V7M18 20v-9"/>',
  },
];

// The order verdicts are presented in (matches the disposition array above).
export const dispositionOrder: DispositionId[] = [
  'eliminate',
  'simplify',
  'automate',
  'optimize',
  'report',
];

// Framework framing copy, lifted verbatim from the original use-cases.astro.
export const dispositionFraming = {
  heading: 'Every workflow gets the same five-question treatment.',
  intro:
    'Before you automate anything, you should ask harder questions first. For every step in a workflow, there are five possible verdicts:',
  afterTable:
    'Most "automation" advice skips straight to the blue. The biggest wins usually come from the red and orange, work that never needed doing, and the green: numbers you’ve been running your business without.',
  aiHeading: 'Where AI actually fits (and where it doesn’t):',
  aiBody:
    'A lot of what gets sold as "AI" is plain automation, a form submission triggers an email, a calendar invite syncs to a spreadsheet. That’s been possible for a decade and it’s great. AI earns its keep on the messy parts: reading an email and figuring out what the person wants, drafting a reply in your voice, pulling totals out of a PDF invoice, summarizing a week of job-site photos into a client update. Throughout this library, we mark which is which. If someone tells you everything needs AI, they’re selling you AI.',
} as const;
