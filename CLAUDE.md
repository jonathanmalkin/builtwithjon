# builtwithjon.com

Personal site for Jonathan Malkin. Portfolio, articles, Jules showcase.

## Stack

- **Framework:** Astro v6 (static output)
- **Hosting:** Cloudflare Workers Builds (auto-deploy on push to main). Project name: `jonathanmalkin-site`.
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
4. Commit and push to main — Cloudflare Workers Builds auto-deploys

**Manual deploy fallback:** `npm run build && npx wrangler deploy --name jonathanmalkin-site --assets dist --compatibility-date 2026-03-18`

## Project Structure

```
src/
  pages/           — Route pages (index, about, jules, projects, articles)
  layouts/         — Base.astro (HTML shell), Article.astro (article layout)
  components/      — Header, Footer, ArticleCard, SEOHead, JsonLd, StoryBadge
  content/articles/ — Markdown articles
  styles/global.css — All styles (< 5KB)
public/            — Static assets (robots.txt, llms.txt, favicon.svg)
```

## Code Style

- Minimal. No CSS framework. No JavaScript unless absolutely necessary.
- Astro components use `.astro` format (HTML-first, zero JS by default).
- Keep the CSS in one file. If it grows past 300 lines, reconsider.
