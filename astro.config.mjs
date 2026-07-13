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
    // One evergreen in-person workshop page replaces the retired online cohort
    // and the completed July 2026 Austin event while preserving inbound links.
    '/workshops': '/ai-assistant-workshop/',
    '/ai-assistant-workshop-austin': '/ai-assistant-workshop/',
  },
});
