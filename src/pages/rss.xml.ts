import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { customArticles } from '../data/customArticles';

export async function GET(context: APIContext) {
  const contentArticles = (await getCollection('articles', ({ data }) => !data.draft))
    .map((article) => ({
      title: article.data.title,
      pubDate: article.data.date,
      description: article.data.description,
      link: `/articles/${article.id}/`,
    }));

  const articles = [
    ...customArticles.map((article) => ({
      title: article.title,
      pubDate: article.date,
      description: article.description,
      link: `/articles/${article.slug}/`,
    })),
    ...contentArticles,
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: 'Jonathan Malkin',
    description: 'Articles on Claude Code, AI systems, automation workflows, and implementation strategy.',
    site: context.site!,
    items: articles,
  });
}
