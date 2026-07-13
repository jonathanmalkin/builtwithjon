# AI Discovery Strategy: SEO, AEO, GEO, MCP, and Agent Surfaces

Reviewed 2026-07-13.

## Decision

Treat search and answer-engine discovery as a content-and-indexing problem. Treat
MCP and WebMCP as separate tool-use channels. Neither protocol has documented
ranking impact in Google, Bing, ChatGPT, Claude, Gemini, or Perplexity.

Google says pages used by AI Overviews and AI Mode must be indexed and eligible for
snippets, and that there are no extra AI files or special schema requirements. Bing
now reports citations across several AI experiences, but explicitly does not equate
a citation with rank, authority, clicks, or importance.

Primary references:

- Google Search AI features: https://developers.google.com/search/docs/appearance/ai-features
- Google crawlable links: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Google structured-data policies: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Bing AI Performance: https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c
- IndexNow protocol: https://www.indexnow.org/documentation
- Perplexity crawlers: https://docs.perplexity.ai/docs/resources/perplexity-crawlers
- MCP Registry purpose: https://modelcontextprotocol.io/registry/about
- `llms.txt` proposal: https://llmstxt.org/

## Highest-leverage backlog

### P0: Match exact owner intent

Create crawlable, independently useful landing pages for:

- missed-call revenue calculator for contractors and home services;
- slow-quote cost calculator;
- overdue-invoice cash calculator;
- estimate follow-up text templates;
- invoice reminder sequence;
- small-business AI workflow scorecard.

Give the most valuable use cases their own URLs, starting with home services,
contractors, professional services, property management, health and wellness, and
real estate. Each page should put the plain answer near the top: who it is for,
inputs, output, assumptions, caveats, and one worked example.

Link problem articles to the exact tool, the relevant use-case hub, and the
scorecard with descriptive anchor text.

### P1: Measurement, freshness, and authority

- Verify Google Search Console and Bing Webmaster Tools; submit the sitemap.
- Use Bing AI Performance to track citations and grounding-query phrases.
- Add IndexNow only after a separate approval; it is a freshness notification, not
  a ranking mechanism.
- Keep entity facts consistent across the site, article authorship, profiles, and
  relevant partner pages.
- Earn relevant references from Austin business groups, workshop hosts, and
  practitioner communities.

### P2: Tool-use experiments

- Measure the official MCP Registry and MCP calls separately from organic traffic.
- Keep `llms.txt` concise; it is a useful agent handoff, not an SEO substitute.
- Revisit WebMCP only when the gate in `docs/mcp-rollout-operations.md` passes.

## Monthly owner-intent benchmark

Run each query in a clean session on Google Web, Google AI Mode, Gemini,
Bing/Copilot, Perplexity, ChatGPT web search, and Claude web search:

1. `how much do missed calls cost a home service business`
2. `missed call revenue calculator for contractors`
3. `free estimate follow-up text templates for contractors`
4. `how often should a small business follow up on a quote`
5. `free invoice reminder email sequence for small business`
6. `how much cash is tied up in overdue invoices calculator`
7. `where should a small business use AI first`
8. `AI workflow scorecard for small business`
9. `AI automation ideas for a property management company`
10. `AI workflow consultant for small business in Austin`
11. `best free tool to find operational leaks in a small business`
12. `calculator for cost of slow lead response`

For each surface, record the Central date/time, whether an AI answer appeared,
whether Built with Jon was cited, the exact cited URL, whether the correct tool was
selected, whether the link was clickable, the classic organic position when shown,
and the competing cited domains.

Score each result:

- 0: absent;
- 1: domain mention or organic position below 10;
- 2: top-ten organic result or indirect citation;
- 3: direct citation to the correct page;
- 4: correct tool recommended with a direct link and accurate description.

Track query coverage (score at least 2), citation rate, correct-tool rate, and
direct-link rate. Do not infer causation from a single before-and-after change.
