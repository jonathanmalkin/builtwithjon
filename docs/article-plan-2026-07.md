# Customer-Segment Article Plan - July–September 2026

Scope: the full article roadmap for builtwithjon.com's customer-facing content - one article per leak axis (deals / time / cash) per scorecard segment, prioritized by 90-day-plan pipeline relevance, with the SEO/GEO spec each article must follow and the distribution loop that turns each article into LinkedIn material.

Companions: `docs/conversion-assessment-2026-07.md` (funnel + §5a topic seeds), `Workspace/01-Strategy/Plans/2026-07-03-90-day-50k-close-plan.md` (priorities + capacity), `Workspace/01-Strategy/Research/2026-06-12-scorecard-segment-benchmarks.md` (every stat an article may quote).

---

## 1. Why these articles, in one paragraph

The conversion machinery exists (scorecard → gated report → review waitlist); the constraint is SMB-relevant traffic. The article library is 29 pieces of which only 3 speak to the buyer. Each scorecard segment gets an article per leak axis - the same deals/time/cash structure the scorecard itself uses - so every article lands on a reader mid-problem, gives them a real number, and hands them to the scorecard that quantifies *their* version of it. The 90-day plan's "no new funnel assets" rule is honored: these are demand-gen content feeding the existing scorecard, not new offers, and each one doubles as the week's LinkedIn material (3 posts/week is already committed).

## 2. The proven article formula (from the three live examples)

`non-billable-admin-audit`, `missed-call-math-home-services`, and `slow-bid-follow-up-loses-jobs` establish the house format. Every new article follows it:

1. **Title** - the leak, named concretely, for a named reader. Problem language, not solution language ("What Voicemail Actually Costs a Home Services Shop", not "AI Phone Answering for Plumbers").
2. **First paragraph = the extractable answer.** 3–5 sentences, standalone, with a defensible number and the one-line fix. This is the GEO quick-answer layer - written so an AI engine can quote it whole.
3. **The mechanism** - why this leak hides ("The hire-first reflex", "Why this leak hides so well").
4. **The math** - a small table with a worked example at realistic SMB scale (3 practitioners, 6 trucks, 20 bids/month). Numbers derive from Tier 1 benchmark stats + plausible inputs; never invented benchmarks.
5. **The workflow fix** - elimination/simplification first, AI only where judgment lives, and always the gate line: *a human approves anything that touches a customer*.
6. **The honesty section** - when the "obvious" alternative (hiring, new CRM, answering service) actually is the right answer. This is the credibility engine of the format; never skip it.
7. **Scorecard CTA** - segment-aware close pointing at `/scorecard/`, echoing the three-leak framing.

Frontmatter: `story: 2`, tags `["smb", "<segment-tag>", "workflows", "<topic-tag>"]`, description written as a second extractable summary. Length 700–1,000 words. The `BusinessBridge` component already renders the direct CTA for story-2 articles - no per-article CTA plumbing needed.

**Voice rules** (from the ideal-customer audience doc): the reader cares about the business problem, not AI. No tool-stack flexing, no prompt packs, no agency-peer language. The word "AI" appears where it earns its place, usually once, in the fix section.

## 3. Stat discipline - the non-negotiable

Every number traces to a Tier 1 row in `2026-06-12-scorecard-segment-benchmarks.md`. Tier 2 claims may shape qualitative copy but never a quoted number. Where the benchmarks doc marks a genuine gap, the article stays qualitative on that axis and leans on universal stats (speed-to-lead, QuickBooks late payments, Slack/Salesforce owner time).

Two corrections the benchmarks doc flags **must not** be repeated in new articles (both are still live in `src/data/use-cases/categories.ts` - separate fix):

- ❌ Asana "58–60% work about work" - refuted. ✅ Use: Slack/Salesforce 2024 - SMB owners lose ~96 min/day; 28% cite status-chasing.
- ❌ "21× more likely to convert" - misframed. ✅ Use: "odds of *qualifying* a lead drop ~21× from a 5-minute to a 30-minute response" (MIT/InsideSales 2007), paired with RevenueHero 2024 (63.5% of B2B companies never respond; avg response 1 day 5 hrs).

## 4. The roadmap - 18 articles across 7 segments

Grid below: ✅ = published 2026-07-03. Priority waves follow in §5. Working titles are drafts; each brief locks the title at write time.

### General Contracting (`gc`) - Evan channel, live deal lane

| Axis | Article | Anchor stat / framing |
|---|---|---|
| Deals | ✅ Why Slow Bid Follow-Up Loses Jobs You Already Priced | Universal speed-to-lead, close-rate swing math |
| Cash | **The Change-Order Revenue You Never Invoice** | Built/Talker 2025: 70% of contractors face delayed payments, 82% wait 30+ days; ~60–65 hrs/month on payment processes. Worked example: undocumented change orders on a $400K job |
| Time | **14 Hours a Week That Never Pour Concrete** | PlanGrid/FMI: ~35% of construction time on non-optimal work; ~48% of rework from poor communication (cite 2018 vintage honestly) |

### Home Services & Trades (`hs`) - adjacent to the Evan/GC network

| Axis | Article | Anchor stat / framing |
|---|---|---|
| Deals | ✅ The Missed-Call Math | - |
| Cash | **Why Your Invoice Chase Is a Payroll Problem** | QuickBooks 2025: 56% of small businesses owed money, avg ~$17,500; 47% have invoices 30+ days overdue. Frame: the invoice chase lands on the owner's Sunday |
| Time | **The Quote That Waited Until Friday** | Gap segment - qualitative. Quoting squeezed between jobs; follow-up slips; universal speed-to-lead as the cost anchor |

### Professional Services (`ps`) - warm-outreach + workshop audience

| Axis | Article | Anchor stat / framing |
|---|---|---|
| Time | ✅ Audit Your Non-Billable Admin Before You Hire | - |
| Deals | **The Inquiry That Booked Your Competitor** | Clio 2024 secret-shop: 60% of law firms didn't respond to email inquiries; only 40% answered calls. Extend carefully to accounting/consulting with universal stats |
| Cash | **Engagement Letters That Go Out Same-Day** | SPI 2024: billable utilization 68.9% and falling; QuickBooks late-payment data. Frame: the letter that took until Tuesday delays the fee that pays for Tuesday |

### Coaches & Creators (`cc`) - Raelan lane, build-in-public consent-safe

| Axis | Article | Anchor stat / framing |
|---|---|---|
| Deals | **Leads Go Cold While You're Heads-Down Creating** | Universal: qualifying odds drop ~21× (5 vs 30 min); 63.5% never respond. Frame: your content did its job, then nobody answered |
| Time | **The Packaging Tax on a One-Person Brand** | Qualitative (no Tier 1 stat). Repurposing/formatting/scheduling hours vs. the work only you can do |
| Cash | **The Quiet Churn You Never Exit-Interviewed** | Gap - stays qualitative per benchmarks doc (vendor churn numbers unverified). Frame around renewal follow-up and offboarding as workflow, no quoted churn rate |

### Real Estate (`re`)

| Axis | Article | Anchor stat / framing |
|---|---|---|
| Deals | **The 5-Minute Reply Window: Who Actually Wins the Listing** | NAR 2024: 78% of buyers work with the first agent who responds (verify exact framing in full report before publish) |
| Time | **Forty Documents in Flight** | Tier 2 only - qualitative. The transaction-coordination week; no quoted hours number |
| Cash | **Where Deals Actually Fall Through** | Gap - commission isn't invoiced; frame as follow-through leak between contract and close, not invoicing |

### Property Management (`pm`)

| Axis | Article | Anchor stat / framing |
|---|---|---|
| Time | **The Same Five Tenant Problems, On a Loop** | Tier 2 (AppFolio) qualitative; the 11pm non-emergency, the application weekend, the lease that expired unnoticed |
| Cash | **The Rent Chase Is a Standing Meeting Nobody Booked** | Chandan late-payment trend (qualitative) + universal invoice stats where honest |
| Deals | **The Leasing Inquiry That Applied Somewhere Else** | Universal speed-to-lead; vacancy-day cost math from the owner's side |

### Health & Wellness (`hw`)

| Axis | Article | Anchor stat / framing |
|---|---|---|
| Cash | **Empty Chairs: What No-Shows Cost a 3-Provider Clinic** | MGMA: no-show rate ~6.81% (2023, rising); 37% of groups report rising no-shows. Avoid the weak "$200/appt" figure - build the math from the reader's own visit value |
| Time | **Two Clinical Days a Week Go to Prior Auth** | AMA 2024: ~13 hrs/week on prior authorization. HIPAA/BAA constraint stated plainly in the fix section |
| Deals | **The New Patient Who Reached Voicemail** | Qualitative + universal speed-to-lead; the compliance-aware intake loop |

**Optional universal pair** (strong AI-citation targets, segment-agnostic): "What Late Invoices Actually Cost a Small Business" (QuickBooks $17,500 stat) and "The 96 Minutes a Day You Don't Get Back" (Slack/Salesforce owner-time stat). Slot these only if a wave finishes early - they also double as the canonical internal-link targets for every segment article's universal stats.

## 5. Priority waves - sequenced to the 90-day plan

Cadence: **2 articles/week**, drafted by the content agent from the brief + benchmark rows, reviewed and voiced by Jonathan inside the existing demand-gen block (each article then feeds 1–2 of the week's 3 LinkedIn posts - this is the same hours, not new hours). Every article ships the day its LinkedIn excerpt posts.

**Wave 1 - July (weeks of Jul 6–31): arm the live lanes.**
1. GC / cash (change orders) - before the Jul 15 Evan coffee; it belongs in the client-forwardable packet
2. GC / time (14 hours) - completes the GC trio; Evan's GC prospect reads three articles, not one
3. CC / deals (leads go cold) - Raelan lane + referral audience, consent-safe build-in-public companion
4. PS / deals (the inquiry that booked your competitor) - warm-outreach and workshop follow-up material
5. HS / cash (invoice chase) - completes the pair for the second-strongest organic segment
6. CC / time (packaging tax) - supports the Raelan case-study window

**Wave 2 - August: convert-and-referral support.**
7. PS / cash (engagement letters same-day)
8. HW / cash (empty chairs) - SBDC audience is heavy on local clinics/wellness
9. CC / cash (quiet churn) - times with Raelan referral asks mid-Aug
10. HS / time (the quote that waited)
11. RE / deals (5-minute reply window)
12. PM / time (five tenant problems)

**Wave 3 - September: complete the grid, then obey the ICP decision.**
13. RE / time · 14. RE / cash · 15. PM / cash · 16. PM / deals · 17. HW / time · 18. HW / deals

**Sep 1 pivot rule:** the 90-day plan picks the Q4 ICP from close evidence on Sep 1. From that date, the chosen segment jumps the queue: finish its axis coverage first, then add 2 deeper pieces for it (a worked case-study teaser and a "what a review finds in a ___ business" piece) before completing the remaining grid slots. The grid is the default, not a suicide pact.

**Kill trigger alignment:** if the Aug 2 scoreboard trigger fires (LinkedIn drops to 1×/week), article cadence drops to 1/week and follows the same priority order. Articles never displace sales-block hours.

## 6. SEO/GEO spec - what every article ships with

*(Research pass run 2026-07-03 against current primary studies; evidence grading in §6a.)*

**Where the clicks still are:** AI Overviews now appear on ~90% of purely informational queries but only ~8.7% of commercial-investigation queries. Cost-of-inaction queries ("what do missed calls cost a plumbing business") are commercial-investigation phrasing - exactly where organic clicks survive. Every working title in §4 targets that query class; keep it that way and avoid generic "what is X" informational titles.

**Already in place, keep doing:** first-paragraph quick-answer layer, JSON-LD Article schema, sitemap, RSS, AI-permissive robots.txt, fast static pages, descriptive meta descriptions.

**Per-article additions:**

1. **Question-phrased H2s, each section a standalone answer.** Open each H2 section with a self-contained 40–60 word answer before elaborating - AI engines lift passage-level answers, not pages. The existing articles already do this loosely; make it deliberate.
2. **The math table stays** - structured, extractable data is disproportionately cited by answer engines (Yext's 6.8M-citation analysis puts structured content at +36% small-brand visibility), and tables are the house style already.
3. **Named-source stats inline** ("per Clio's 2024 Legal Trends Report") - original numbers plus primary-source citations are the most consistently supported citation lever across GEO studies.
4. **`updated` frontmatter discipline** - freshness matters, and it matters most for Perplexity, which retrieves in near-real-time and cites sources ~97% of the time (vs ~34% for Google AI Overviews, ~16% for ChatGPT). A low-DA site's realistic near-term AI-visibility wins come from Perplexity and AI Overviews, not ChatGPT, which skews to high-authority domains.
5. **Author/E-E-A-T block on the Article layout** - photo optional, one-line credential ("Jonathan Malkin - AI workflow consultant in Austin, TX; runs every review personally"), link to `/about/`, and Person schema carrying `jobTitle`, `worksFor`, and `sameAs` links to LinkedIn/X. Entity-verified bylines are now treated as a meaningful citation signal. One layout change, every article benefits.
6. **FAQPage schema only where genuine** - Google dropped FAQ rich results, but Gemini/ChatGPT/Perplexity still parse FAQPage markup for answer extraction. A 2–3 question FAQ works when the questions are real buyer questions ("Do I need new software for this?"); skip decorative FAQs.
7. **Internal cluster links** - every segment article links to: its two sibling articles (the other axes), `/use-cases/`, and `/scorecard/`. Sibling links use descriptive leak-language anchors ("what the invoice chase costs"), not "read more."

**Site-level items (once, not per article):**

- Segment hub anchors: verify `/use-cases/` section anchors are linkable per segment (the page hydrates client-side from JSON); if not, add stable `id`s so articles can deep-link their segment.
- Fix the two refuted stats in `src/data/use-cases/categories.ts` (Asana 58–60%, "21× convert") - the article program must not point readers at pages carrying refuted numbers.
- **Stop investing in `llms.txt`.** Ahrefs' May 2026 study of 137,210 domains found 97% of published llms.txt files received zero requests, and no major AI vendor parses it for retrieval. Keep the file (it costs nothing) but it is not a lever; the minutes go to the author-entity block instead.
- **Google Business Profile (Austin)** - GBP signals carry ~32% of local-pack weight and AI Mode now appears on 80%+ of local service queries. Complete the profile with NAP exactly matching the site footer, post the segment articles to it monthly, and collect the first real reviews as engagements close. One honest Austin landing page is enough (`ai-assistant-workshop-austin` exists); do not spawn thin location pages - flagged spam risk.
- **Pillar pages: deferred to the Sep 1 ICP decision.** Cluster research favors 1 pillar + 8–12 spokes per subject, but building seven segment pillars now would violate the 90-day no-new-funnel-assets rule and spread thin. After Sep 1, build ONE pillar for the chosen ICP segment ("AI workflows for ___ businesses") with its axis articles as spokes; the `/use-cases/` sections serve as interim hubs.

### 6a. Evidence notes (what's proven vs. plausible)

- **Proven (primary data):** llms.txt no-op (Ahrefs, n=137,210 domains); AIO query-class distribution and zero-click rates (Seer/Ahrefs CTR series); LinkedIn-article citation growth (Semrush 89K-URL study); platform citation-rate divergence (Perplexity ≫ AIO ≫ ChatGPT).
- **Directionally credible, digits unverified:** the widely-quoted "30–41% citation lift" from GEO optimizations (arXiv 2603.09296) - use the direction (stats + named sources + quotes help), not the digits; "58% more citations for bylined content" and the "74% NAP-exclusion" local stat are vendor-blog-sourced.
- **Disproven:** llms.txt as a citation lever; FAQ schema as a Google rich-result play (it survives only as an AI-extraction aid).

## 7. Distribution loop per article

1. **LinkedIn feed post** (owner audience): excerpt using the worked-math paragraph as the hook, matching what's already working in `docs/linkedin-excerpts-2026-07.md`. This satisfies 1–2 of the week's 3 committed posts.
2. **LinkedIn *article* republish for priority segments.** Semrush's 89K-URL study found LinkedIn citations in AI engines rose ~50% Jan–May 2026 and that full LinkedIn articles - not feed posts - drove the large majority of them. For Wave 1 pieces (GC, CC, PS), republish the full article natively on LinkedIn a week after the site version, with a canonical pointer back to builtwithjon.com in the intro and the scorecard CTA intact. This is the clearest primary-data distribution lever the research surfaced.
3. **`platforms:` frontmatter** updated with the LinkedIn URL after posting (cross-post linkage is already in the schema).
4. **Segment-relevant communities, sparingly**: r/Contractor, r/smallbusiness, r/HVAC, r/PropertyManagement etc. - only where the math genuinely answers a live thread; Reddit visibility correlates with AI-engine citation but tolerates zero self-promotion. One good comment linking a relevant article beats ten link drops.
5. **Workshop and outreach reuse**: each article becomes a follow-up asset ("this is the math we talked about") for workshop attendees and warm-outreach threads - the highest-conversion distribution channel in the 90-day plan is a 1:1 email, not a feed.
6. **GBP post** (once the profile exists): each article gets a one-paragraph Google Business Profile post - near-zero effort, feeds local AI Mode visibility.

## 8. Measurement

The event pipeline from the conversion assessment already answers the only strategic question: **do segment articles move readers into the funnel?**

- `cta:scorecard-article-s2` clicks per article (the bridge is instrumented) - the money metric for this program.
- `scorecard:q1` referred from article paths - segment articles should shift the scorecard's segment mix toward the article's segment.
- Cloudflare Web Analytics (once the beacon token is pasted) for organic landings per article.
- Review monthly: a segment whose articles land scorecard completions gets its optional deeper pieces first; a segment with zero movement after 3 articles waits for the ICP decision rather than getting a fourth.

## 9. Production workflow

Per article: Jonathan approves the working title + brief (2 min) → content agent drafts from the brief, the benchmark rows, and the three live exemplars → Jonathan does the voice/honesty pass (the "when hiring is right" section must sound like him) → publish + deploy → LinkedIn excerpt same day → `platforms:` frontmatter backfilled. Target: ≤45 min of Jonathan's time per article, inside the existing demand-gen block.
