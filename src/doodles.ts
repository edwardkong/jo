// Doodle slots. Each animated doodle lives in a fixed-size slot so that a hand-drawn
// image file can replace the inline SVG stand-in without touching layout.
//
// To swap in a drawing: export it (APNG recommended; GIF or WebP also fine) at 2x the
// slot size, save it in public/doodles/ together with a still frame named
// "<file>-still.png", then add one line to `doodleFiles` below.

export type DoodleName =
  | 'header-steam'
  | 'closed-sign'
  | 'item-whisk'
  | 'item-crumb'
  | 'item-star'
  | 'footer-crumbs';

export interface DoodleSlotSpec {
  /** CSS pixels */
  width: number;
  height: number;
  /** Where it appears, for the README */
  where: string;
}

export const doodleSlots: Record<DoodleName, DoodleSlotSpec> = {
  'header-steam': { width: 120, height: 120, where: 'homepage header, beside the name' },
  'closed-sign': { width: 160, height: 110, where: 'homepage, below the last menu section' },
  'item-whisk': { width: 40, height: 40, where: 'menu items (rotates with crumb and star)' },
  'item-crumb': { width: 40, height: 40, where: 'menu items (rotates with whisk and star)' },
  'item-star': { width: 40, height: 40, where: 'menu items (rotates with whisk and crumb)' },
  'footer-crumbs': { width: 240, height: 60, where: 'post page footer' },
};

/**
 * Her drawings, once they exist. Filenames are relative to public/doodles/.
 * Example:  'closed-sign': 'closed-sign.png',   // also needs closed-sign-still.png
 */
export const doodleFiles: Partial<Record<DoodleName, string>> = {};
