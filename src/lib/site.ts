// Site-wide settings, edited in the CMS under "Site settings" (src/data/site.json).
import { z } from 'astro/zod';
import raw from '../data/site.json';

const SiteSchema = z.object({
  name: z.string().default('Small Hours'),
  intro: z.string().default(''),
  sign_text: z.string().default("kitchen's closed"),
  /** Where the closed sign points. Empty = not a link yet. */
  sign_link: z.string().default(''),
  footer: z.string().default(''),
  /** Keep search engines away while it's a prototype. */
  noindex: z.boolean().default(true),
});

export type SiteSettings = z.infer<typeof SiteSchema>;

export function getSite(): SiteSettings {
  return SiteSchema.parse(raw);
}
