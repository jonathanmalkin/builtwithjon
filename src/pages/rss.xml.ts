import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const contentArticles = (await getCollection('articles', ({ data }) => !data.draft))
    .map((article) => ({
      title: article.data.title,
      pubDate: article.data.date,
      description: article.data.description,
      link: `/articles/${article.id}/`,
    }));

  const articles = contentArticles.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: 'Open Door Learning',
    description: 'Articles by Jonathan Malkin on making AI useful in a business: Claude Code, AI systems and automation workflows.',
    site: context.site!,
    items: articles,
  });
}
