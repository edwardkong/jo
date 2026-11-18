// Doodle slots. Each animated doodle lives in a fixed-size slot so that a hand-drawn
// image file can replace the inline SVG stand-in without touching layout.
//
// Which built-in drawing fills a slot is chosen in the CMS (Site settings > Look).
// Her own drawings are uploaded there too (Look > Drawings). The map at the bottom is
// the code-side alternative: a file in public/doodles/ plus one line here.

export type DoodleName = 'header' | 'item-a' | 'item-b' | 'item-c' | 'footer';

export interface DoodleSlotSpec {
  /** CSS pixels */
  width: number;
  height: number;
  /** Where it appears, for the README */
  where: string;
}

export const doodleSlots: Record<DoodleName, DoodleSlotSpec> = {
  header: { width: 120, height: 120, where: 'homepage, beside the site name' },
  'item-a': { width: 40, height: 40, where: 'beside posts: 1st, 4th, 7th…' },
  'item-b': { width: 40, height: 40, where: 'beside posts: 2nd, 5th, 8th…' },
  'item-c': { width: 40, height: 40, where: 'beside posts: 3rd, 6th, 9th…' },
  footer: { width: 240, height: 60, where: 'end of a post' },
};

/** The built-in drawings to choose from, per slot. "none" leaves the slot empty. */
export const HEADER_KINDS = ['cup', 'pencil', 'leaf', 'moon', 'none'] as const;
export const ITEM_KINDS = ['whisk', 'crumb', 'star', 'dot', 'leaf', 'heart', 'spiral', 'arrow'] as const;
export const FOOTER_KINDS = ['pin', 'dots', 'line', 'none'] as const;
export type HeaderKind = (typeof HEADER_KINDS)[number];
export type ItemKind = (typeof ITEM_KINDS)[number];
export type FooterKind = (typeof FOOTER_KINDS)[number];

/**
 * Her drawings, the code way. Filenames are relative to public/doodles/; a still frame
 * named "<file>-still.png" must sit next to each one.
 * Example:  header: 'header.png',
 */
export const doodleFiles: Partial<Record<DoodleName, string>> = {};
