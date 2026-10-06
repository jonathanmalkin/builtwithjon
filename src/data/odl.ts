// Shared copy and facts for the Open Door Learning site (October 2026 revamp).
// One place for the things several pages say, so they say them the same way.
// Authority: PRODUCT.md "Current authority update: October 5, 2026" and the site
// map in Workspace/04-Marketing/Website/2026-10-05-workshops-led-update.md.
// Rules carried from PRODUCT.md: no prices, no host or client names without
// clearance, no measured results, no em dashes.

export const SITE = {
  company: 'Open Door Learning',
  legal: 'Open Door Learning LLC',
  person: 'Jonathan Malkin',
  title: 'AI Educator and Builder',
  titleLower: 'AI educator and builder',
  email: 'jonathan@builtwithjon.com',
  city: 'Austin, Texas',
  url: 'https://builtwithjon.com',
  // Word for word from Identity.md.
  positioning:
    'I work with owners and executives who are using AI and want to make it more useful in their business. I teach them and their teams to solve real business problems with AI, and I build solutions when needed.',
  cue: 'We’ve tried AI. Now we need help making it work in our business.',
};

// Four items (October 6, 13:00): Materials folded into Speaking; the host page
// is labelled by who it is for, since "Host a workshop" beside "Workshops" read
// as the same thing.
export const NAV = [
  { href: '/workshops/', label: 'Workshops' },
  { href: '/host-a-workshop/', label: 'For your group' },
  { href: '/speaking/', label: 'Speaking' },
  { href: '/about/', label: 'About' },
];

export const SOCIAL = [
  { href: 'https://linkedin.com/in/jonathanmalkin', label: 'LinkedIn' },
  { href: 'https://x.com/builtwithjon', label: 'X' },
  { href: 'https://github.com/jonathanmalkin', label: 'GitHub' },
];

// The workshops, grouped by the kind of room each one runs in (decided
// October 6 after the review panel: the process differs by kind, so the
// page says how each kind runs instead of one process for all). The four
// marked home appear on Home. Names are the allowlisted interest values in
// src/worker.js.
export const FORMATS = [
  {
    id: 'build',
    name: 'Hands-on build workshops',
    how: 'Laptops open. Each person brings one real task from their own week, builds on it with help beside them, and leaves with something that works. Ninety minutes.',
    who: 'For owners, executives and their teams.',
    image: { src: '/home/austin-workshop.jpg', alt: 'Jonathan Malkin teaching a room of owners in Austin, people working on laptops.' },
  },
  {
    id: 'lead',
    name: 'Leadership sessions',
    how: 'No laptops needed. The owner and the people who run the business work through where AI fits, what it may and may not do, and what to start first. You leave with decisions written down. Ninety minutes.',
    who: 'For an owner and the leadership team.',
    image: { src: '/home/austin-hero.jpg', alt: 'Jonathan Malkin speaking to a room, holding a presentation clicker.' },
  },
  {
    id: 'tech',
    name: 'For IT and technical teams',
    how: 'For the people who run systems and build things inside the business. Technical and hands-on, on real files and real tools. Ninety minutes, or a half day for a team that wants to leave with it running.',
    who: 'For IT departments, developers and technical staff.',
    image: { src: '/workshops/decks/give-claude-a-map/company-map.jpg', alt: 'A folder tree: Brain, Indexes, Email and Support Calls, with instruction files highlighted.' },
  },
];

export const WORKSHOPS = [
  {
    name: 'Put Your Business Knowledge to Work',
    format: 'build',
    home: true,
    summary:
      'Organize what matters about your customers, services, processes and priorities into a shared reference, then practice using it with a teammate and AI to answer questions and prepare work.',
    leaveWith: 'A shared reference your team and your AI can both use.',
  },
  {
    name: 'Build One Useful AI Workflow',
    format: 'build',
    home: true,
    summary:
      'Give a recurring task a repeatable approach. Work through what you start with, what a useful result looks like, and where AI can help. Try the method and check the result.',
    leaveWith: 'A repeatable method for one recurring task, tested on the real thing.',
  },
  {
    name: 'Build Your Personal AI Assistant',
    format: 'build',
    home: true,
    summary:
      'Prepare for meetings with the right information at hand and keep track of what comes next. Set up a personal assistant, turn meeting notes into clear next steps, and bring saved information and commitments into a daily brief.',
    leaveWith: 'An assistant set up for meeting preparation, next steps and a daily brief.',
  },
  {
    name: 'Hand Off Your First Task to an AI Agent',
    format: 'build',
    summary:
      'Pick one recurring task you would hand to a capable assistant. Write down what a good result looks like and what the agent may and may not do on its own, then set it running and check its first result together.',
    leaveWith: 'One recurring task running under your own approval rules, and a short list of what an agent may and may not do for you.',
  },
  {
    name: 'See Where AI Could Help Your Business',
    format: 'lead',
    home: true,
    summary:
      'Look at everyday business tasks and discuss where a different approach could help. Explore practical AI examples and what they could mean for your own work, with room for questions.',
    leaveWith: 'A short list of places to start, drawn from your own week.',
  },
  {
    name: 'Set Your Team’s AI Direction',
    format: 'lead',
    summary:
      'Where AI is already in use in your business, where it should be, what it may and may not do, and who owns what. Write it on one page: the rules, the first three projects with an owner each, and how you will know in ninety days whether they worked.',
    leaveWith: 'A one-page AI direction for the team: the rules, three first projects with owners, and what to check in ninety days.',
  },
  {
    name: 'Give Your AI Agents a Map',
    format: 'tech',
    summary:
      'Set up the shared structure of files, folders and instructions that people and AI agents both work from, so every AI tool in the business reads the same brain. Connect two agents to it on your own files and watch them use it the same way.',
    leaveWith: 'A folder structure and instruction files an agent can find its way around, running with two tools on your own files.',
  },
];

// What happens in the room. Used on Home (short) and Workshops (with detail).
export const STEPS = [
  {
    title: 'You bring one real task.',
    text: 'Something that comes back every week and gets rebuilt from scratch each time: preparing for meetings, a recurring report, the follow-ups after a call.',
    detail:
      'Before the session I ask what people do all week. In the room, each person picks one task of their own. Nobody works on a made-up example.',
  },
  {
    title: 'You build it yourself, with help beside you.',
    text: 'A short explanation, then working time. I move between tables. You use the AI tool you already have.',
    detail:
      'The method carries across ChatGPT, Claude, Copilot and Gemini. If you get stuck, I sit down next to you. If you finish early, there is a next step waiting.',
  },
  {
    title: 'You leave with something that works.',
    text: 'A working tool or workflow, a skill applied to your own work, or a clear decision about where to start.',
    detail:
      'You also leave with the materials, so you can repeat what you did on Monday without me in the room.',
  },
];

// Rooms, described by type. No host names. Dates and places are public facts;
// the hosts are not named until each one clears it.
export const ROOMS = [
  {
    name: 'A hands-on class for a founder and operator community',
    when: 'May 2026, Austin',
    short:
      'Each person set up a personal AI assistant for meeting preparation and follow-through, on their own laptop.',
    long:
      'A Sunday class for a community of founders and operators. Each person set up a personal AI assistant for meeting preparation and follow-through, on their own laptop, using the AI tool they already had. The ten-second clip on this page is from this class.',
  },
  {
    name: 'A cohort program for companies',
    when: 'Running, autumn 2026, online',
    short:
      'A multi-week applied AI program. Each company sends an owner and the person leading AI inside the business. I teach individual sessions and hold office hours after each.',
    long:
      'A multi-week applied AI program for a group of companies. Each company sends an owner and the person leading AI inside the business. I teach individual sessions, one hour each, and hold office hours after every one. In one session each person set up a workspace of plain files and folders that holds what their AI assistant needs to know about their people, companies and priorities, then used it to prepare for a real meeting.',
  },
  {
    name: 'A build day for owners and technical members',
    when: 'Booked, November 2026, Austin',
    short:
      'Owners are paired with someone technical around one real problem from the owner’s business. Each pair builds one working tool in about two hours.',
    long:
      'Members of a co-working community pair up ahead of time: an owner and someone technical, agreed on one real problem from the owner’s business. On the day, each pair builds one working AI tool for it in about two hours, and a few pairs show the room what they made. Nobody builds before the day; the point is to do it together.',
  },
  {
    name: 'A free public workshop',
    when: 'Booked, November 2026, Austin',
    short:
      'A two-hour hands-on session for local owners and operators, hosted by an organization that already serves them. Education only.',
    long:
      'A two-hour hands-on session for local small-business owners and operators, hosted and promoted by an organization that already serves them. About ninety minutes of teaching, the rest for questions and setup. Education only: nobody is pitched from the front of the room.',
  },
];

// Decks from workshops and talks. Guides, templates and the write-up stay at
// their URLs but are off the page until the personal assistant workshop is
// revamped and a writing section exists (decided October 6, 2026).
export const MATERIALS = [
  {
    title: 'Build Your Personal AI Assistant',
    desc: 'The slides from the workshop: a daily brief, meeting preparation and keeping track of what comes next.',
    href: '/workshops/personal-assistant/',
    tag: 'Workshop deck',
    cover: { kind: 'image', src: '/workshops/decks/personal-assistant-cover.jpg', alt: 'The title slide of the Personal AI Assistant workshop.' },
  },
  {
    title: 'Give Claude a map, not a dump',
    desc: 'Fourteen slides from the Austin Claude Code Meetup talk on organizing what a business knows so people and AI can both use it.',
    href: '/workshops/give-claude-a-map/',
    tag: 'Talk deck',
    cover: { kind: 'image', src: '/workshops/decks/give-claude-a-map/cover.jpg', alt: 'A slide from the talk: why does every session feel like starting over?' },
  },
];

// Talks. Dates and venues are public facts; no links to event pages (decided October 6).
export const TALKS = [
  {
    event: 'Clawstin, October meetup',
    where: 'Pershing Hall, Austin',
    date: 'Thursday, October 8, 2026',
    title: 'Two Agents, One Brain',
    desc: 'A fifteen-minute talk with a live demo on two AI agents sharing one working structure. The slides and the take-home tool go up here after the talk.',
  },
  {
    event: 'Austin Claude Code Meetup',
    where: 'Capital Factory, Austin',
    date: 'August 10, 2026',
    title: 'Give Claude a map, not a dump',
    desc: 'Fourteen slides to a room of Claude Code users: the folder map, the context card, and why the record is longer than the answer.',
    href: '/workshops/give-claude-a-map/',
    linkLabel: 'Slides',
  },
];

export const BIO = {
  short:
    'Jonathan Malkin is an AI educator and builder in Austin, Texas, who teaches owners, executives and their teams to solve real business problems with AI.',
  medium:
    'Jonathan Malkin is an AI educator and builder in Austin, Texas. He teaches owners, executives and their teams to solve real business problems with AI, and builds solutions when needed. Before going independent in 2025 he spent more than twenty years in enterprise technology, including eight years at Automation Anywhere. He founded Open Door Learning.',
  // First person, for pages that speak as Jonathan.
  first:
    'I am an AI educator and builder in Austin, Texas. I teach owners, executives and their teams to solve real business problems with AI, and I build solutions when needed. Before going independent in 2025 I spent more than twenty years in enterprise technology, including eight years at Automation Anywhere. I work as Open Door Learning.',
  intro:
    'Our speaker today is Jonathan Malkin, an AI educator and builder here in Austin. He spent more than twenty years in enterprise technology helping big companies actually use the tools they bought. Now he teaches owners, executives and their teams to solve real business problems with AI, hands-on, on their own work. Please welcome Jonathan.',
};
