# Website Conversion Assessment — July 2026

Scope: full-site assessment of builtwithjon.com focused on (a) attracting the ideal customer — SMB owners/operators, the Hidden Profit Review buyer — and (b) getting them to complete an action and submit their information. This document records what was found, what was changed on branch `claude/website-assessment-conversion-a8b5m5`, what requires a manual step from Jon, and what is recommended but deliberately not built yet.

---

## 1. The three structural findings

1. **Nothing was measured.** No analytics script existed anywhere in the codebase, and no CTA or form was instrumented. The privacy policy claimed Cloudflare Web Analytics, but Workers-static-assets deployments do not auto-inject the beacon. Every funnel question ("do article readers ever reach the scorecard?", "where does the quiz lose people?") was unanswerable.
2. **Traffic and offer point at different people.** 29 articles — the site's main organic surface — are written for Claude Code power users and solo builders (22 of 29 are story 1). The marketing pages sell to SMB owners. Article readers hit a generic newsletter box and left; nothing bridged them to the business funnel.
3. **The AI-facing and SEO metadata had drifted.** `llms.txt` pointed "Services" at the dead `/workshops/` URL and described a retired "AI Workflow Friction Map" offer; the OG image was the wrong aspect ratio (1200×800) and ~987KB; there was no Service/ProfessionalService structured data for the actual offer; the Person `jobTitle` differed between the homepage and the about page.

Plus one strategic change requested during the engagement: **replace open calendar booking with a Daniel Priestley–style waitlist** ("Oversubscribed" model). The scorecard stays the wide-open free front door; the paid review is now gated behind a capacity-limited waitlist. This works honestly here because Jon personally runs every review — the scarcity is real.

## 2. The funnel as now built

```
Articles (technical audience)          Home / marketing pages (SMB audience)
        │                                        │
        ▼                                        ▼
  BusinessBridge block  ──────────────►  /scorecard/  (free, 3-min quiz)
  (story-aware CTA on                        │
   every article)                            ▼
                                     email-gated leak report
                                     (Worker → Resend + Formspree)
                                             │  email CTA
                                             ▼
                            /hidden-profit-review/#waitlist
                            (waitlist form: name, email, company,
                             "where do you feel it most?")
                                             │
                                             ▼
                            /hidden-profit-review/thanks
                            (spot held → private booking invite
                             sent by Jon, in order, when a slot opens)
```

Side doors that feed the same pool: newsletter block on every article, starter-kit email gates (cowork / claude-code), workshop waitlist, contact form (which now signposts the review waitlist as "the fast lane").

### Jon's new operating rhythm (the part software can't do)

The waitlist replaces the instant Google Calendar link on the review path. That trade only works if the follow-up rhythm is kept:

- **Read every waitlist entry within 2 business days** — the thanks page promises this explicitly.
- **Send private booking invites in order** when a monthly slot opens — the pages promise "no skipping the line."
- **Set the true monthly capacity.** `monthlyCapacity` in `src/pages/hidden-profit-review.astro` is a placeholder of **4**. Set it to the number you can actually deliver; never display a number you can't honor.
- The old booking link (`calendar.app.google/rC9Kz37aZANXAUgt5`) is no longer linked anywhere — it's now what you send *inside* the invite email.

## 3. Measurement: how to use what was built

### One manual step to finish web analytics
Cloudflare dashboard → **Web Analytics** → add site `builtwithjon.com` → copy the token → paste it into `CF_BEACON_TOKEN` in `src/layouts/Base.astro` → deploy. Until then the site ships clean with no beacon.

### Custom events (already live after deploy)
Every instrumented click/form fires a `sendBeacon` POST to `/api/event` on the existing Worker, which writes to the **Workers Analytics Engine** dataset `site_events` (binding `SITE_EVENTS`, created on first deploy). Events never block or break the UI; if the binding is missing the endpoint no-ops.

**Event dictionary** (blob1 = event, blob2 = path, blob3 = referrer host, index1 = category):

| Event | Meaning |
|---|---|
| `cta:scorecard-nav / -footer / -hero / -frontdoor / -final` | Scorecard CTA clicks by placement |
| `cta:scorecard-article`, `cta:scorecard-article-s3` | Article bridge clicks (technical vs solo-founder articles) |
| `cta:waitlist-final / -contact / -next / -scorecard`, `cta:waitlist-article` | Waitlist CTA clicks by placement |
| `scorecard:q1` … `scorecard:q9` | Quiz step reached (drop-off funnel) |
| `scorecard:result` | Quiz completed, result shown |
| `scorecard-gate:start / :submit`, `scorecard:gate-success` | Report email gate funnel |
| `hpr-waitlist:start / :submit / :success` | **Bottom-of-funnel: waitlist signups** |
| `hpr:sample-click`, `waitlist:sample-click`, `waitlist:usecases-click` | Proof-content engagement |
| `newsletter:* / starter-kit:* / contact:*` | Secondary capture forms (`:start`, `:submit`) |

**Querying** — Analytics Engine SQL API:

```
curl -s "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/analytics_engine/sql" \
  -H "Authorization: Bearer <API_TOKEN>" \
  -d "SELECT blob1 AS event, SUM(_sample_interval) AS count
      FROM site_events
      WHERE timestamp > NOW() - INTERVAL '7' DAY
      GROUP BY event ORDER BY count DESC"
```

The three numbers to watch weekly:
1. `scorecard:q1` → `scorecard:gate-success` (quiz completion rate; a cliff at one `qN` means fix that question)
2. `scorecard:gate-success` → `hpr-waitlist:success` (how many report readers join the waitlist — the money metric)
3. `cta:scorecard-article*` (whether the article bridge actually moves technical traffic into the funnel)

## 4. What was changed in this branch

**Measurement**
- `wrangler.jsonc`: `SITE_EVENTS` Analytics Engine binding.
- `src/worker.js`: additive `/api/event` endpoint (origin-checked, size-capped, validated, fail-open). Scorecard handler untouched — verified by local `wrangler dev` + curl.
- `src/layouts/Base.astro`: conditional CF beacon (off until token pasted) + ~1KB inline `bwjTrack` helper with delegated `data-track` / `data-track-form` listeners.
- Instrumentation attributes across Header, Footer, homepage, scorecard, HPR, thanks pages, contact, newsletter, starter-kit gates. Privacy policy updated with one sentence disclosing anonymous first-party events.

**Waitlist (Priestley model)**
- `hidden-profit-review.astro`: form reframed as "Join the waitlist" with capacity line, qualifying "Where do you feel it most?" dropdown, `inquiry_type=hpr-waitlist`, fairness/risk-reversal microcopy, `#waitlist` anchor.
- `hidden-profit-review/thanks.astro`: rebuilt as waitlist confirmation — 3-step "what happens next" + while-you-wait links (sample, scorecard, use cases). Booking link removed.
- Scorecard report email (worker templates): CTA now "Join the review waitlist" with capacity framing.
- Waitlist plugged into: homepage final CTA, scorecard post-gate thanks, contact page, post-workshop `/next/thanks` page, story-3 article bridges.

**Article → funnel bridge**
- New `src/components/BusinessBridge.astro`, rendered on every article via `Article.astro` (finally using the `story` prop): direct business CTA on story-3 articles, softer "I do this for businesses too" on story-1/2. Newsletter block unchanged beneath it.

**SEO/GEO**
- `public/llms.txt` rewritten: SMB positioning, current offers (Scorecard, Hidden Profit Review + sample, AI assistant hub, use cases), dead `/workshops/` and "Friction Map" references removed.
- `public/og-default.png` regenerated: 1200×630, 155KB (was 1200×800, 987KB); `og:image:width/height` emitted for the default image.
- `ProfessionalService` schema (Austin, TX + offers) on the homepage; `Service` schema on the review page; Person `jobTitle` unified to "AI Workflow Consultant & Implementation Partner".
- Homepage hero microcopy: "Free · 3 minutes · no call, no pitch."

**Verified**: `npm run build` green (54 pages); story-1 vs story-3 bridge variants confirmed in dist; beacon absent while token empty; `/api/event` accepts valid events and rejects bad origins/names; `/api/scorecard-report` routing unchanged; `wrangler deploy --dry-run` validates the new binding.

## 5. Bringing in more of the right people (recommended, not built)

The conversion machinery now exists; the constraint is SMB-relevant traffic. In priority order:

### a. Publish scorecard-segment content
Each of the 7 scorecard segments deserves 2–3 articles written for the owner, not the builder, each ending at the scorecard. The segment copy in `src/worker.js` (`LINES`) is already a topic map:

- **General contracting**: "Why slow bid follow-up loses jobs you already priced" · "The change-order revenue you never invoice"
- **Home services**: "The missed-call → lost-job math for a 6-truck shop" · "Why your invoice chase is a payroll problem"
- **Real estate**: "The 5-minute reply window: who actually wins the listing"
- **Property management**: "The same five tenant problems are eating your week — on a loop"
- **Professional services**: "Audit your non-billable admin before you hire" · "Engagement letters that go out same-day"
- **Health & wellness**: "Empty chairs: what no-shows actually cost a 3-provider clinic"
- **Coaching/creator**: "Leads go cold while you're heads-down creating"

Format that works for GEO too: first paragraph = plain answer with a number, then the worked example, then the scorecard CTA. These pages target buying-intent queries the current article library never touches.

### b. Work the Austin angle
- Create/claim a **Google Business Profile** ("AI workflow consultant, Austin TX") pointing at the site — near-zero effort, captures local intent searches.
- The `ai-assistant-workshop-austin` page already exists; cross-link it from contact and about, and mention Austin on the homepage (the ProfessionalService schema now declares it — the visible copy should too).
- Keep doing AI Tinkerers–style live demos; each one should produce a short recap post with photos (the hero image already proves this works as social proof).

### c. Split distribution by audience
- **LinkedIn** is where the SMB owner actually is: post the segment articles and worked-sample excerpts there. The technical articles stay on **X/Reddit/HN** as proof-of-work — they build the "he really builds this stuff" credibility the business buyer checks later.
- Add each new article's `platforms:` frontmatter so cross-posts are linked.

### d. Make the sample do more work
The $24M contractor sample is the strongest asset on the site. Consider a one-page teaser version per segment ("what a review finds in a home-services business") — same skeleton, segment-specific numbers — each a landing page for the segment articles.

## 6. Deferred conversion ideas (revisit once data flows)

- **Social proof on the review page**: even two one-line client outcomes with names/industries would materially help; testimonials were not fabricated in this pass because none exist in the repo.
- **Price anchoring**: the review page never mentions price. Priestley's model tolerates (and benefits from) a stated price next to scarcity. Decide and publish when ready.
- **Waitlist count display** ("3 of 4 July spots taken"): high-converting but only with real numbers — wire it to actual state, never fake it. Analytics Engine + a KV counter could power this later.
- **Scorecard result share/save**: a shareable result card would give the quiz a viral loop.
- **A/B alternatives**: with events flowing, the first test worth running is the article bridge copy (direct vs soft) measured by `cta:scorecard-article*` clickthrough.

## 7. Manual checklist for Jon

- [ ] Set `monthlyCapacity` in `src/pages/hidden-profit-review.astro` to the honest number (currently 4).
- [ ] Cloudflare dashboard → Web Analytics → create site → paste token into `CF_BEACON_TOKEN` in `src/layouts/Base.astro` → deploy.
- [ ] Adopt the waitlist rhythm: read entries ≤ 2 business days, invite in order, calendar link goes in the invite email only.
- [ ] Deploy: `npm run build && wrangler deploy --name jonathanmalkin-site --assets dist` (first deploy creates the `site_events` dataset).
- [ ] Optional: create a Cloudflare API token with Analytics read access for the SQL queries in §3.
