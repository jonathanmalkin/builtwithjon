# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are owners of owner-led businesses: founders, CEOs, and the operators who run the
whole thing. Size is not the qualifier and no revenue band is published. The qualifier is the
situation: answers live in people's heads, everything routes back through the owner, and a
project they already want stays blocked because pulling the information together is too painful.

They are not looking for AI entertainment or a transformation program. They want the blocked
project moving, a credible operator, and evidence before a conversation.

Secondary audiences (technical builders, partners, event organizers, people learning from the
implementation work) must stay legible. They do not replace the owner as the primary reader.

## Product Purpose

builtwithjon.com exists to get the right person into one of two conversations with Jonathan:

1. **Direct.** An owner with a stuck project. The public door is the homepage conversation and
   intake at `/#tell-me`.
2. **Workshop.** A host with a room of owners or a company team. The public door is `/workshops/`.

Success for Direct is a captured email (`business-map:capture` on `/`). The three-question
follow-up is a quality diagnostic, not the north star. Success for Workshop is a host form
submit (`workshop-host:submit` on `/workshops/`).

The site's jobs:

1. Make the right owner recognize their situation before any technology is mentioned.
2. Start a conversation through the Direct intake: email first, three questions, Jonathan reads
   every one and replies. No advertised timeframe.
3. Show operating judgment and practical evidence: the anonymized case study, the map-not-dump
   pattern, real event photography.
4. Route rooms of owners to workshops and everyone else to a plain contact path.

`/ai-assistant/` remains the public entry for the free Claude Cowork mini-course, a separate
secondary audience.

## Positioning

Canonical one-liner, reused word for word across hero meta, schema, GBP, and LinkedIn:

> I help owner-led businesses turn knowledge trapped in people and scattered tools into systems
> their team and AI can actually use.

The product noun leads with the plain description, then the name: "It is folders and files your
team and your AI assistants can both read and use. I call the finished system a company brain."
Singular attribution only (one paying client so far; never "clients call it").

Jonathan's jobTitle everywhere is "Knowledge Systems Builder."

The public Direct offer is a conversation that can become a phased, client-owned build. The
homepage sells talking to Jonathan. Do not name a first-phase deliverable on public surfaces,
in schema, in nav, or in CTAs.

"Business Map" is internal delivery language only: paid Phase 1 of a build (people, process, and
systems on one page, ending in a continue-or-stop decision). It is never a named public offer.
Event names that start with `business-map:` stay as-is for analytics continuity. The retired
`/business-map/` path 301s to `/#tell-me`.

Capacity is honest and evergreen: one build at a time; the next build can start as the current
one wraps.

The promise is unblocking via the path, plus visibility and a continue-or-stop decision from
the first phase itself. Never revelation. Never a measured business result.

## Operating Context

The site is an Astro static site on Cloudflare Workers (`jonathanmalkin-site`), deployed only
through `deploy-builtwithjon` after Jonathan's explicit approval.

Owners arrive from rooms, referrals, and search. The working evaluation ritual is: recognize the
stuck project, send a short intake, wait for Jonathan's reply. Direct intake lives on `/`
at `/#tell-me` (`?f=` framing and `data-track` values stay as built, including `business-map:*`
event names). Jonathan reads every submission himself.

Durable product truth lives in this file, `Workspace/00-HQ/`, and
`Workspace/04-Marketing/Website/copy-kernel-2026-08-15.md`. Current page briefs and lab HTML live
in `Workspace/04-Marketing/Website/`. Implementation lives only in this repo.

## Capabilities and Constraints

Confirmed:

- No public pricing. No client name. No measured business, ROI, or revenue claim.
- Privacy treatment is a treatment, not a guarantee. The legal check is "a targeted primary-source
  legal issue scan, not a legal opinion."
- No "AI consultant" title, no "Operating Partner", fractional is never the lead.
- No em dashes. No "apply to work with me", no "waitlist".
- No book-a-call in the hero and no advertised free session (retired 2026-08-16).
- "See if it's a fit" is the approved secondary gate framing. Qualification stays silent.
- The public MCP server is retired (decided 2026-08-17). Remove at implementation: worker `/mcp`
  route, `src/mcp/`, `/mcp/` docs, `.well-known/mcp.json`, and the MCP section of `CLAUDE.md`.
- Enterprise-decomposition copy ("ten people do one job") is retired from the website.
- Do not name the Business Map as a public offer, CTA, schema entity, or nav destination.

Open:

- Keep, kill, or park the live-only pages that the undeployed repo would drop
  (`/use-cases/`, `/tools/`, `/scorecard/`, `/hidden-profit-review/`, kits, `/principles/`,
  `/dispositions/`, `/process/`, `/knowledge-os-proof/`).
- Whether case-study copy may use she/her for the anonymized owner.
- Where Onboarding and Exit framings live now that they left the homepage.

## Brand Commitments

Name: Jonathan Malkin / Built with Jon. Voice follows `Workspace/00-HQ/Voice-Profile.md`.

Personality: practical, credible, and human. A working session with an experienced operator.
Technically capable without tool hype, warm without becoming cute, direct without becoming
abrasive. The desired result is recognition, then grounded confidence: this person understands
how the business actually runs and can get the stuck project moving.

Do not become: generic blue-gradient SaaS, dark hacker-terminal costume, tool-stack flexing,
AI-agency peer language, glossy enterprise consulting, literal coffee-shop theming, creator
funnels for prompt collectors, or marketing that buries the action under MCP, models, or
infrastructure.

## Evidence on Hand

Use only documented atoms. Do not invent customers, quotes, counts, or results.

- Anonymized BR101 case study, currently held at `src/held/case-study.astro` until clearance.
  Public funnel figures (case study only): about 5,000 scattered messages to about 1,200 in-scope
  threads to about 900 organized, privacy-treated files. 696 artifacts organized; 770 automated
  checks, all green. Homepage may tell the outcome story without those counts.
- Approved scrubbed owner quotes, including "I have a very complicated, intimidating project
  plan that I avoid like the plague" and "I open up about fifteen different things every month."
- Privacy-treatment and killed-feature trust stories, as scoped in the copy kernel.
- Real Capital Factory / Austin event photography in `public/home/`.
- Credibility allowed publicly: 20+ years enterprise tech; 8 years at Automation Anywhere;
  scaled a global SE org from 6 to 250; Austin-based; met in Austin, delivered anywhere.

Do not fabricate a second client, a testimonial, a measured ROI, or a photographer-unverified
photo credit.

## Product Principles

- **Recognition before technology.** The owner's situation leads. AI is the mechanism, not the pitch.
- **Sell the conversation on the homepage.** One dominant next action. Direct = `/#tell-me`.
  Workshop = `/workshops/`. The first-phase map is internal delivery language, not the public offer.
- **Show practical evidence before sophistication.** Case study, honest rounded numbers, real
  photography, working artifacts.
- **Keep the first step concrete and low-risk.** Email, three questions, Jonathan replies.
- **Keep claims honest.** Only documented proof atoms. Privacy and delivery promises match the
  real system.

## Accessibility & Inclusion

WCAG 2.2 AA is the practical baseline. Preserve keyboard access, visible focus, semantic
structure, useful alternative text, sufficient contrast, readable type, meaningful labels,
reduced-motion support, and responsive behavior from small phones through wide desktop.

Do not use color as the only signal. Keep body copy within readable line lengths. Motion must
leave content visible by default. Forms must expose errors and success states to assistive
technology.
