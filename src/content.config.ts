// Content collections. Two collections:
//   sections — one small YAML file per menu section (she manages these in the CMS)
//   posts    — one Markdown file per post ("menu item")
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** "2026-09-30-lemon-loaf" -> "lemon-loaf". Filenames carry a date prefix so they sort; URLs don't. */
function stripDatePrefix(entry: string): string {
  return entry.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

/** The CMS stores a section reference as its filename ("bakes.yml"); we key sections by the stem ("bakes"). */
function sectionId(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/^.*\//, '').replace(/\.(ya?ml|md)$/i, '');
}

/** Treat "" and null as "no cover photo" so a cleared field never breaks the build. */
function emptyToUndefined(value: unknown): unknown {
  return value === '' || value === null ? undefined : value;
}

const sections = defineCollection({
  loader: glob({ pattern: '*.yml', base: './src/content/sections' }),
  schema: z.object({
    title: z.string(),
    blurb: z.string().optional(),
    order: z.coerce.number().default(10),
  }),
});

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/posts',
    generateId: ({ entry }) => stripDatePrefix(entry),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().default(''),
      section: z.preprocess(sectionId, z.string()),
      date: z.coerce.date(),
      cover: z.preprocess(emptyToUndefined, image().optional()),
      draft: z.boolean().default(false),
    }),
});

export const collections = { sections, posts };
