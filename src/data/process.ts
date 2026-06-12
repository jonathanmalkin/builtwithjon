// The implementation process: the third framework, the action-altitude
// sequence that carries a workflow from "here is my mess" to "here is a
// working system." Shared by /process (full page) and /principles (right rail)
// so the two cannot drift.
//
// How the three frameworks nest:
//   Principles (beliefs)  govern  this Process (the sequence),
//   and inside the "Decide each step" phase you apply the five Dispositions
//   (eliminate / simplify / automate / optimize / report).
//
// The `accent` on each phase reuses a disposition color token so the process
// reads as part of the same brand system, without claiming to BE a disposition.

export const processPhases = [
  {
    num: '01',
    accent: 'automate',
    name: 'See the data',
    short: 'Where it lives, how it moves',
    body:
      'Before anything else, we look at where your information actually lives and how it travels between people and tools. This is the assess phase, and it is also the whole point of the audit: you cannot find the friction without following the data.',
    principle: 'Connect the data first',
    output: 'A map of your data sources and the gaps between them',
  },
  {
    num: '02',
    accent: 'simplify',
    name: 'Map the workflow',
    short: 'The real steps, not the tidy version',
    body:
      'We lay out the recurring process exactly as it runs today, every handoff, every wait, every place a thing gets re-typed. The friction shows itself once the steps are on the table instead of in your head.',
    principle: 'Audit the workflow, not the tool',
    output: 'One honest workflow map with the friction marked',
  },
  {
    num: '03',
    accent: 'eliminate',
    name: 'Decide each step',
    short: 'Apply the five questions',
    body:
      'Now each step gets a verdict using the five dispositions: eliminate it, simplify it, automate it, optimize it, or turn its exhaust into a report. Most steps never need AI. The ones that do get flagged honestly, and so do the ones to leave alone for now.',
    principle: 'Most wins need no AI at all',
    output: 'A per-step plan: eliminate / simplify / automate / optimize / report',
    usesDispositions: true,
  },
  {
    num: '04',
    accent: 'optimize',
    name: 'Build the first pilot',
    short: 'Wire the data, ship one win',
    body:
      'We connect the sources that needed connecting and build the single highest-value, lowest-risk automation first. One working thing beats a grand plan. Anything that touches a high-stakes decision keeps a human at the gate by design.',
    principle: 'Keep a human at the high-stakes gate',
    output: 'One live automation, with the human checkpoints built in',
  },
  {
    num: '05',
    accent: 'report',
    name: 'Run and measure',
    short: 'Watch it, then decide what is next',
    body:
      'The pilot runs in the real world and we watch what it actually does. What worked becomes the template for the next step; what did not gets a clear "not yet." The process loops, one safe win at a time, instead of one risky big bang.',
    principle: '"Don\'t automate yet" is an answer',
    output: 'A measured result and the next prioritized step',
  },
] as const;
