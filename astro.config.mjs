// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

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

export default defineConfig({
  site: 'https://builtwithjon.com',
  integrations: [
    mdx(),
    sitemap({
      customPages: ['https://builtwithjon.com/hidden-profit-review/sample/'],
      filter: (page) =>
        !page.endsWith('/thanks/') &&
        !page.endsWith('/card/') &&
        !page.endsWith('/claude-meetup/') &&
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
    // Retired workshop URLs now lead to the current AI assistant offer.
    // NOTE: '/workshops' itself is now a real page (src/pages/workshops.astro,
    // 2026-08-15 revamp), so it is intentionally not in this map.
    '/ai-assistant-workshop': '/ai-assistant/',
    '/ai-assistant-workshop/thanks': '/ai-assistant/',
    '/ai-assistant-workshop-austin': '/ai-assistant/',
    '/ai-assistant/claude-code': '/ai-assistant/course/',
    // Old funnel retired for the Business Map front door, 2026-08-15.
    // These pages were removed from src/pages/ so they don't shadow the
    // 301s below (or the matching entries in src/worker.js and
    // public/_redirects). See src/data/{scorecard,use-cases,leak-calculators},
    // still imported by src/worker.js and src/mcp/tools.js, kept in place.
    '/scorecard': '/',
    '/hidden-profit-review': '/business-map/',
    '/hidden-profit-review/thanks': '/business-map/',
    '/tools': '/',
    '/tools/leak-calculator': '/',
    '/kits/invoice-chase-kit': '/',
    '/kits/follow-up-swipe-file': '/',
    '/use-cases': '/business-map/',
  },
});
