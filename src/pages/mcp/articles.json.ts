// Build-time article index for the MCP server's search_articles / get_article
// tools. The worker fetches this from ASSETS at runtime instead of bundling
// 500+ KB of markdown it rarely needs. astro:content is a build-time-only
// virtual module — keep it inside src/pages, never import it from the worker.
import { getCollection } from 'astro:content';

const SITE = 'https://builtwithjon.com';

export async function GET() {
  const entries = await getCollection('articles', ({ data }) => !data.draft);

  const articles = entries.map((entry) => ({
    slug: entry.id,
    title: entry.data.title,
    date: entry.data.date.toISOString().slice(0, 10),
    description: entry.data.description,
    tags: entry.data.tags,
    story: entry.data.story,
    url: `${SITE}/articles/${entry.id}/`,
    body: entry.id === 'multiple-email-accounts-with-claude' ? null : entry.body ?? '',
  }));

  articles.sort((a, b) => (a.date < b.date ? 1 : -1));

  return new Response(JSON.stringify(articles), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
