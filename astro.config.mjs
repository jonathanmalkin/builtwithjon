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
    // Retired workshop URLs now lead to the current AI assistant offer.
    '/workshops': '/ai-assistant/',
    '/ai-assistant-workshop': '/ai-assistant/',
    '/ai-assistant-workshop/thanks': '/ai-assistant/',
    '/ai-assistant-workshop-austin': '/ai-assistant/',
    '/ai-assistant/claude-code': '/ai-assistant/course/',
  },
});
