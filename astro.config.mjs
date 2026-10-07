// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// Markdown tables scroll sideways on narrow screens (global.css), so keyboard
// users need to be able to focus them to scroll (WCAG 2.1.1).
function rehypeFocusableTables() {
  const visit = (node) => {
    if (node.type === 'element' && node.tagName === 'table') {
      node.properties = { ...node.properties, tabIndex: 0 };
    }
    node.children?.forEach(visit);
  };
  return visit;
}

// Article dates keyed by slug, so sitemap entries can carry a real lastmod.
// Google schedules recrawls off lastmod; without it the 52 articles give no
// freshness signal at all. Pages with no known date get no lastmod rather than
// a guessed one, since a wrong date is worse than a missing one.
const articleDates = (() => {
  const dir = fileURLToPath(new URL('./src/content/articles', import.meta.url));
  const dates = new Map();
  for (const file of readdirSync(dir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const frontmatter = readFileSync(join(dir, file), 'utf8').split('---')[1] ?? '';
    const raw = (frontmatter.match(/^updated:\s*(\S+)/m) ?? frontmatter.match(/^date:\s*(\S+)/m))?.[1];
    const parsed = raw ? new Date(raw.replace(/['"]/g, '')) : null;
    if (parsed && !Number.isNaN(parsed.valueOf())) dates.set(file.replace(/\.mdx?$/, ''), parsed.toISOString());
  }
  return dates;
})();

// These pages are intentionally reachable only by a direct link. Keeping them
// out of the sitemap preserves that disposition without adding a noindex tag.
const unlistedOrRetiredPaths = new Set([
  '/principles/',
  '/dispositions/',
  '/process/',
  '/hidden-profit-review/',
  '/kits/follow-up-swipe-file/',
  '/kits/invoice-chase-kit/',
  '/knowledge-os-proof/',
  '/masterclass/',
  '/construction/',
]);

export default defineConfig({
  site: 'https://opendoorlearningai.com',
  markdown: {
    // github-dark's comment colour fails WCAG AA contrast (3.0:1); the
    // -default variant keeps the look and passes (6.2:1).
    shikiConfig: { theme: 'github-dark-default' },
    rehypePlugins: [rehypeFocusableTables],
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !page.endsWith('/thanks/') &&
        !page.endsWith('/card/') &&
        !page.endsWith('/qr/') &&
        !page.endsWith('/claude-meetup/') &&
        // Follow-up form for past attendees; nothing links to it.
        !page.endsWith('/next/') &&
        !page.includes('/business-map') &&
        !unlistedOrRetiredPaths.has(new URL(page).pathname) &&
        // Sends noindex; submitting it produces a Search Console coverage error.
        !page.endsWith('/email-confirmed/'),
      serialize: (item) => {
        const slug = item.url.match(/\/articles\/([^/]+)\/$/)?.[1];
        const lastmod = slug ? articleDates.get(slug) : undefined;
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
    icon(),
  ],
  redirects: {
    // Static fallbacks for removed page files. The worker (src/worker.js
    // PERMANENT_REDIRECTS) answers these paths first with a real 301.
    // NOTE: '/workshops' itself is a real page, so it is intentionally not here.
    '/ai-assistant-workshop': '/workshops/',
    '/ai-assistant-workshop/thanks': '/workshops/',
    '/ai-assistant-workshop-austin': '/workshops/',
    // Retired 2026-08-19: Business Map is internal delivery language only.
    // Public Direct intake is the homepage conversation at /#tell-me.
    '/business-map': '/#tell-me',
    '/knowledge-os-product': '/#tell-me',
    // Materials folded into Speaking, October 6, 2026.
    '/materials': '/speaking/#decks',
    // Open Door Learning rebrand, 2026-10-06: page files moved out of src/pages.
    '/ai-assistant': '/workshops/',
    '/ai-assistant/claude-code': '/ai-assistant/cowork/',
    '/principles': '/making-ai-useful/',
    '/process': '/making-ai-useful/',
    '/dispositions': '/making-ai-useful/',
    '/use-cases': '/making-ai-useful/',
    '/scorecard': '/',
    '/tools': '/',
    '/tools/leak-calculator': '/',
    '/knowledge-os-proof': '/map-not-dump/',
    '/hidden-profit-review': '/',
    '/hidden-profit-review/thanks': '/',
    '/kits/follow-up-swipe-file': '/',
    '/kits/invoice-chase-kit': '/',
    '/masterclass': '/ai-assistant/cowork/',
    '/construction': '/',
    '/jules': '/about/',
  },
});
