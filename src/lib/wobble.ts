// STUB — replaced by the doodle build agent.
export function wobble(d: string, _seed: number, _amount = 0.6): string { return d; }
export function frames(d: string, n = 3, amount = 0.6): string[] {
  return Array.from({ length: n }, (_, i) => wobble(d, i + 1, amount));
}
