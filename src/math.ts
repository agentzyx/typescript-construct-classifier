/**
 * Clamps a number to a range.
 *
 * @param n - the value
 * @param lo - lower bound
 * @param hi - upper bound
 */
export function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

/**
 * Linear interpolation.
 *
 * @param a - start
 * @param b - end
 * @param t - fraction between 0 and 1
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
