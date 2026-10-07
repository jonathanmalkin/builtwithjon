import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    // Shorter <title> for search results when the headline runs past ~70 characters.
    seoTitle: z.string().max(70).optional(),
    date: z.date(),
    updated: z.date().optional(),
    description: z.string(),
    story: z.number().min(1).max(3),
    tags: z.array(z.string()),
    platforms: z.object({
      reddit: z.string().url().optional(),
      x: z.string().url().optional(),
    }).optional(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
