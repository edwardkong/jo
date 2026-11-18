// Site-wide settings, edited in the CMS under "Site settings" (src/data/site.json).
import { z } from 'astro/zod';
import raw from '../data/site.json';

// Every phrase the site prints that isn't content. Defaults are plain; the themed
// versions live in site.json and are edited in the CMS under Site settings > Wording.
const WordingSchema = z.object({
  home_tab: z.string().default('home'),              // browser tab title of the homepage
  back_link: z.string().default('← back'),
  empty_section: z.string().default('nothing here yet.'),
  unsorted_title: z.string().default('Other'),        // group for posts whose section was deleted
  unsorted_blurb: z.string().default(''),
  comments_title: z.string().default('comments'),
  comments_empty: z.string().default('no comments yet.'),
  comments_form_hint: z.string().default('no account needed. it appears after a minute or two.'),
  comments_name_label: z.string().default('name (optional)'),
  comments_body_label: z.string().default('comment'),
  comments_submit: z.string().default('send'),
  comments_sent: z.string().default('sent. it will appear once the page has rebuilt, a minute or two.'),
  comments_failed: z.string().default('that did not go through. try again in a moment.'),
  comments_off: z.string().default('comments are not switched on yet.'),
  comments_anonymous: z.string().default('anonymous'),
  not_found_tab: z.string().default('not found'),
  not_found_title: z.string().default('nothing here.'),
  not_found_text: z.string().default('that page does not exist.'),
});

export type Wording = z.infer<typeof WordingSchema>;

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'a colour like #2c2219');

// Fonts, colours, favicon, and which drawings show. Edited in the CMS under
// Site settings > Look. Fonts are Google Fonts family names, fetched at build time.
const LookSchema = z.object({
  font_heading: z.string().default('Gaegu'),
  font_body: z.string().default('Literata'),
  color_background: hex.default('#f3ead9'),
  color_background_deep: hex.default('#e9dcc4'),
  color_ink: hex.default('#2c2219'),
  color_ink_soft: hex.default('#7c6a57'),
  color_accent: hex.default('#b5452f'),
  /** An emoji or 1-2 characters drawn into the tab icon. Empty = the drawn default. */
  favicon: z.string().default(''),
  show_header_doodle: z.boolean().default(true),
  show_item_doodles: z.boolean().default(true),
  show_badge: z.boolean().default(true),
  show_footer_doodle: z.boolean().default(true),
  /**
   * Her own drawings, uploaded through the CMS (Site settings > Look > Drawings).
   * One entry per slot; `file` is the animated image, `still` the frame shown when
   * motion is reduced. Paths are "/src/assets/uploads/..." as the CMS writes them.
   */
  drawings: z
    .array(
      z.object({
        slot: z.enum(['header-steam', 'closed-sign', 'item-whisk', 'item-crumb', 'item-star', 'footer-crumbs']),
        file: z.string().default(''),
        still: z.string().default(''),
      }),
    )
    .default([]),
});

export type Look = z.infer<typeof LookSchema>;

const SiteSchema = z.object({
  name: z.string().default('Untitled'),
  intro: z.string().default(''),
  /** Short text on the small hanging badge at the bottom of the homepage. */
  badge_text: z.string().default(''),
  badge_link: z.string().default(''),
  footer: z.string().default(''),
  /** Keep search engines away while it's a prototype. */
  noindex: z.boolean().default(true),
  /** URL of the deployed notes Worker (worker/). Empty = the note form is switched off. */
  notes_endpoint: z.string().default(''),
  /** Cloudflare Turnstile site key (public). Empty = no captcha widget. */
  turnstile_site_key: z.string().default(''),
  wording: WordingSchema.default({}),
  look: LookSchema.default({}),
});

export type SiteSettings = z.infer<typeof SiteSchema>;

export function getSite(): SiteSettings {
  return SiteSchema.parse(raw);
}
