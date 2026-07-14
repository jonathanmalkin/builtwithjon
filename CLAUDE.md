# builtwithjon.com

Personal site for Jonathan Malkin. Portfolio, articles, Jules showcase.

## Stack

- **Framework:** Astro v6 (static output)
- **Hosting:** Cloudflare Workers project `jonathanmalkin-site`. Push to `main`, then deploy with Wrangler.
- **Domains:** builtwithjon.com (primary), jonathanmalkin.com (301 redirect)
- **Email:** jonathan@builtwithjon.com, jules@builtwithjon.com (Cloudflare Email Routing → Gmail)
- **Repo:** github.com/jonathanmalkin/builtwithjon
- **Content:** Markdown with frontmatter in `src/content/articles/`
- **Styling:** Hand-written CSS, system font stack, dark mode via prefers-color-scheme
- **SEO/GEO:** JSON-LD schema, sitemap, RSS, llms.txt, robots.txt (AI-permissive)

## Content Collections

Articles use the glob loader (`src/content.config.ts`). Frontmatter schema:

```yaml
title: string (required)
date: date (required)
updated: date (optional)
description: string (required) — used for meta tags and AI extraction
story: 1 | 2 | 3 (required) — brand story classification
tags: string[] (required)
platforms: { reddit?: url, x?: url } (optional)
image: string (optional)
draft: boolean (default false)
```

**Story numbers:**
1. The Setup Is The Product (Claude Code infrastructure)
2. Build Where They Won't (taboo-to-mainstream thesis)
3. Solo Founder + AI = Unfair Advantage

## Design System

One website, one visual system (Jonathan's directive, 2026-07-13). `PRODUCT.md` holds the product principles, `DESIGN.md` and `.impeccable/design.json` hold the tokens and components, and `src/styles/global.css` implements everything. Page types vary by density, components, and semantic color — not by choosing between named registers. Reading pages (articles, use cases, documentation) stay paper-and-ink with restraint; interactive and funnel pages (tools, scorecard, calculators, signup, course) may additionally use the semantic business-axis, result, and status colors. Reference implementation for the semantic-color end: `src/pages/scorecard.astro`. Do not invent new palettes; reach for the existing tokens.

Token layers in `global.css`: shared foundations under `--ucl-*` (paper, ink, lines, type, spacing) with generic `--color-*` aliases, and semantic axis/status hues under `--exp-*`.

Two gotchas (learned 2026-07-13): the global `.panel` class has no padding by design, so every page using it must add its own (1.5rem is the common choice); and a foundations `:root` block remaps all `--color-*` tokens to the drier paper palette, so meaning-bearing color must use the `--exp-*` tokens for true axis hues.

The standalone packages `Code/personal/field-manual-design-system/` and `Code/personal/expressive-design-system/` are historical source archives, not competing registers; do not pick between them for new pages.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Build static site to dist/
npm run preview  # Preview built site
```

## Publishing an Article

1. Create `src/content/articles/{slug}.md` with frontmatter
2. First paragraph should be the AI-extractable summary (the "quick answer layer")
3. End with `*Full source: [github.com/jonathanmalkin/jules](https://github.com/jonathanmalkin/jules)*`
4. Commit and push to main
5. Run Wrangler deploy

**Deploy command:** `npm run build && find dist -name .DS_Store -delete && wrangler deploy`

(name, worker entry, assets directory, `run_worker_first` for /mcp, and compatibility date all come from `wrangler.jsonc` — don't re-specify them on the CLI, or overrides can drop the MCP routing config)

In the broader `Active-Work` workspace, prefer `Scripts/deploy-website.sh` because it pushes `main`, builds, cleans deploy artifacts, and runs Wrangler in one sequence.

## Project Structure

```
src/
  pages/           — Route pages (index, about, jules, projects, articles)
  layouts/         — Base.astro (HTML shell), Article.astro (article layout)
  components/      — Header, Footer, ArticleCard, SEOHead, JsonLd, StoryBadge
  content/articles/ — Markdown articles
  data/            — Shared data modules (use cases, scorecard, leak calculators, frameworks)
  mcp/             — MCP server (handler.js transport, tools.js tool definitions)
  worker.js        — Cloudflare Worker: /api routes + MCP server + assets
  styles/global.css — All styles, single file
public/            — Static assets (robots.txt, llms.txt, favicon.svg, .well-known/mcp.json)
```

## MCP Server

The Worker serves a public, read-only MCP server at `POST /mcp` (Streamable
HTTP, stateless, no auth). Docs page: `/mcp/`. Ten tools expose the use case
library, scorecard, leak calculators, frameworks, the Hidden Profit Review
offer, and article search (via the build-time index `dist/mcp/articles.json`).
Tool calls log to the `site_events` Analytics Engine dataset with
`index1='mcp'` (queries in `docs/analytics-queries.md`).

**Shared-data rule:** anything both a page and the worker/MCP present —
calculator math, scorecard questions/scoring, use-case data — lives in
`src/data/` and is imported by both. Never fork a second copy. Exception:
`scorecard.astro`'s inline quiz script (needs `define:vars`) keeps a copy;
keep it in sync with `src/data/scorecard.ts`.

## Code Style

- Minimal. No CSS framework. No JavaScript unless absolutely necessary.
- Astro components use `.astro` format (HTML-first, zero JS by default).
- Keep the CSS in one file (`src/styles/global.css`); reach for existing tokens before adding new rules.
