// "Line boil" for the pen doodles: every doodle is drawn three times with a tiny
// random jitter on each coordinate, and CSS flips between the copies a few times a
// second so the line shivers like a redrawn flipbook.
//
// The jitter is deterministic (seeded PRNG) so a rebuild produces byte-identical HTML.
//
// IMPORTANT: paths must NOT use the arc command (A/a). Arc segments carry two boolean
// flags (large-arc, sweep) that look like numbers; jittering them would break the path.
// Draw curves with C/Q instead. wobble() throws if it sees an arc so the mistake
// surfaces at build time.

/** mulberry32: a tiny, good-enough 32-bit PRNG. Returns numbers in [0, 1). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a string hash, so a path can seed itself and two paths never share a jitter pattern. */
export function seedFrom(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Numbers inside path data: "35", "3.5", ".5", "-2". No exponents; we never write them. */
const NUMBER = /-?\d*\.?\d+/g;

/**
 * Jitter every numeric coordinate of an SVG path string by up to +/- `amount`
 * (in user units). Same `d` + same `seed` always gives the same result.
 */
export function wobble(d: string, seed: number, amount = 0.6): string {
  if (/[Aa]/.test(d)) {
    throw new Error(
      'wobble(): path data must not use the A (arc) command; draw the curve with C or Q instead.',
    );
  }
  const rand = mulberry32(seed);
  return d.replace(NUMBER, (token) => {
    const jittered = Number(token) + (rand() * 2 - 1) * amount;
    // Two decimals is plenty at these sizes and keeps the HTML small.
    const rounded = Math.round(jittered * 100) / 100;
    return String(rounded === 0 ? 0 : rounded); // no "-0"
  });
}

/**
 * The `n` flipbook frames of a path. Frame 1 is the original, unjittered drawing
 * (it is also the still frame shown under prefers-reduced-motion); the rest are
 * wobbled with seeds derived from `seed` (default: a hash of the path itself).
 */
export function frames(d: string, n = 3, amount = 0.6, seed = seedFrom(d)): string[] {
  return Array.from({ length: n }, (_, i) => (i === 0 ? d : wobble(d, seed + i * 7919, amount)));
}
