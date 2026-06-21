// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://builtwithjon.com',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.endsWith('/thanks/'),
    }),
    icon(),
  ],
  redirects: {
    // Workshops page hidden 2026-05-28 while focusing on company workshops.
    // Restore by moving src/_drafts/workshops-index.astro back to
    // src/pages/workshops/index.astro and removing this redirect.
    '/workshops': '/contact/',
  },
});
