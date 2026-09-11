// Paid-ads demand test landing pages (September 2026). One record per message.
// Copy authority: Workspace/04-Marketing/Campaigns/2026-09-09-paid-ads-demand-test/Copy.md
// Each record drives a landing page at /<slug>/ and a thank-you page at /<slug>/thanks/.

export interface LeadMagnet {
  slug: string;
  formId: string;
  kitId: string;
  title: string;
  shortTitle: string;
  kind: 'worksheet' | 'checklist' | 'kit';
  eyebrow: string;
  headline: string;
  lede: string;
  insideHeading: string;
  inside: { lead: string; body: string }[];
  formHeading: string;
  formLede: string;
  interestLabel: string;
  button: string;
  consent: string;
  metaDescription: string;
  fileHtml: string;
  filePdf: string;
  thanks: { kicker: string; headline: string; body: string; second: string };
}

const about = {
  heading: 'Who made this',
  body: 'Jonathan Malkin. Twenty-plus years making technology work inside large companies, now working with owner-led businesses in Austin. Practical AI and automation, starting from the problem, using the tools that fit.',
};

export const aboutBlock = about;

export const leadMagnets: Record<string, LeadMagnet> = {
  'repeat-questions': {
    slug: 'repeat-questions',
    formId: 'ads-repeat-questions',
    kitId: 'repeat-questions-log',
    title: 'The Repeat-Questions Log',
    shortTitle: 'worksheet',
    kind: 'worksheet',
    eyebrow: 'Free worksheet for owner-led businesses',
    headline: 'Your team asks you the same questions every day.',
    lede: "Where's the file. What did we quote them last time. Who approved this. Each one takes you two minutes, and there are thirty of them. Most of the answers already exist. They live in your head, your inbox, or a folder only you can find.",
    insideHeading: "What's in the worksheet",
    inside: [
      { lead: 'The one-week log.', body: 'A simple table for catching every question that lands on you, who asked, and how long it took. Most owners are surprised by the list.' },
      { lead: 'The three-pile sort.', body: 'Approved answer exists, needs your judgment, nobody actually knows. Only the first pile gets fixed this month, and that is usually the biggest.' },
      { lead: 'The first ten.', body: 'How to turn ten approved answers into a place your team checks before they ask, using the tools you already have.' },
    ],
    formHeading: 'Get the worksheet',
    formLede: 'First name and email. If you want, tell me the question you hear most. I read every one.',
    interestLabel: 'What question do you hear most? (optional)',
    button: 'Send me the worksheet',
    consent: "You'll get the worksheet by email. Tick the box if you also want occasional practical notes on AI and automation for small businesses. Optional, unsubscribe anytime.",
    metaDescription: 'A free one-page worksheet for owners: log the questions your team asks you for a week, sort them into three piles, and make the first ten answer themselves.',
    fileHtml: '/worksheets/repeat-questions-log/',
    filePdf: '/downloads/repeat-questions-log.pdf',
    thanks: {
      kicker: 'Sent',
      headline: 'Your worksheet is on its way.',
      body: 'It is in your inbox now, and you can open it here too. Print it or keep it on a second screen. The log works best when you fill it in during the week, not from memory on Friday.',
      second: 'If you want to compare notes once your list exists, reply to the email with the question you hear most. I read every one and I answer the interesting ones.',
    },
  },
  'step-away': {
    slug: 'step-away',
    formId: 'ads-step-away',
    kitId: 'handoff-checklist',
    title: 'The One-Workflow Handoff Checklist',
    shortTitle: 'checklist',
    kind: 'checklist',
    eyebrow: 'Free checklist for owner-led businesses',
    headline: 'Take a week off and the work waits for you.',
    lede: "Not because your team can't do it. Because the steps, the exceptions, and the judgment calls live in your head, and nobody has watched you make them. Writing a forty-page manual will not fix that. Handing off one workflow properly will.",
    insideHeading: "What's in the checklist",
    inside: [
      { lead: 'Pick the right workflow.', body: 'Recurring, already working, one operator, one accepted output. The checklist has a five-question filter so you do not start with the hardest thing.' },
      { lead: 'Watch one run and catch the hidden parts.', body: 'Where the inputs really come from, which steps you skip, and the decisions you make without noticing. This is the page most owners have never written.' },
      { lead: 'The cold handoff test.', body: 'A short operating guide, one fresh example, and the rule that decides whether it held: the other person finishes without asking you anything.' },
    ],
    formHeading: 'Get the checklist',
    formLede: 'First name and email. If you want, name the workflow you would hand off first. I read every one.',
    interestLabel: 'Which workflow would you hand off first? (optional)',
    button: 'Send me the checklist',
    consent: "You'll get the checklist by email. Tick the box if you also want occasional practical notes on AI and automation for small businesses. Optional, unsubscribe anytime.",
    metaDescription: 'A free one-page checklist for owners who cannot step away: pick one workflow, watch one run, write down the hidden decisions, and test a cold handoff.',
    fileHtml: '/worksheets/handoff-checklist/',
    filePdf: '/downloads/handoff-checklist.pdf',
    thanks: {
      kicker: 'Sent',
      headline: 'Your checklist is on its way.',
      body: 'It is in your inbox now, and you can open it here too. Start with the five-question filter on page one before you pick a workflow. The obvious choice is usually not the right first one.',
      second: 'If you get to the cold handoff test, reply to the email and tell me what happened. I read every one and I answer the interesting ones.',
    },
  },
  'next-hire': {
    slug: 'next-hire',
    formId: 'ads-next-hire',
    kitId: 'next-hire-kit',
    title: 'The Next-Hire Training Kit',
    shortTitle: 'kit',
    kind: 'kit',
    eyebrow: 'Free kit for owner-led businesses',
    headline: 'Every new hire learns the job from your head. Again.',
    lede: 'You have recordings, old emails, past examples, a few documents. The material exists. It just is not a training anyone can run without you sitting there. So each new person gets the tour from you, and each departure resets the clock.',
    insideHeading: "What's in the kit",
    inside: [
      { lead: 'The material inventory.', body: 'One page to list what already teaches the job: recordings, documents, past work that was accepted, the emails where you explained it. You have more than you think.' },
      { lead: 'The one-module template.', body: 'What the job looks like done well, which sources to point at, one exercise, one check. Filled in for a single task, not the whole role.' },
      { lead: 'The handover rule.', body: 'The new hire prepares the second module using the first as the pattern. If they can, the training runs without you. If they cannot, the template shows you what is missing.' },
    ],
    formHeading: 'Get the kit',
    formLede: 'First name and email. If you want, tell me which job you train from scratch most often. I read every one.',
    interestLabel: 'Which job do you keep training from scratch? (optional)',
    button: 'Send me the kit',
    consent: "You'll get the kit by email. Tick the box if you also want occasional practical notes on AI and automation for small businesses. Optional, unsubscribe anytime.",
    metaDescription: 'A free two-page kit for owners: inventory the material you already have and turn it into one training module a new hire can run without you.',
    fileHtml: '/worksheets/next-hire-kit/',
    filePdf: '/downloads/next-hire-kit.pdf',
    thanks: {
      kicker: 'Sent',
      headline: 'Your kit is on its way.',
      body: 'It is in your inbox now, and you can open it here too. Start with the inventory page. Most owners find the material for a first module in under an hour.',
      second: 'If you build a module, reply to the email and tell me which job you picked. I read every one and I answer the interesting ones.',
    },
  },
};
