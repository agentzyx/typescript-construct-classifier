/**
 * A shopping basket that tracks item counts.
 *
 * @remarks
 * Counts are kept per SKU; adding the same SKU twice increments its count.
 *
 * @example
 * const b = new Basket();
 * b.add("sku-1");
 */
export class Basket {
  /** Item counts keyed by SKU. */
  private counts = new Map<string, number>();

  /**
   * Adds one unit of a SKU.
   *
   * @param sku - the stock-keeping unit to add
   * @returns the new count for `sku`
   */
  add(sku: string): number {
    const next = (this.counts.get(sku) ?? 0) + 1;
    this.counts.set(sku, next);
    return next;
  }

  /**
   * Total number of units across all SKUs.
   */
  get total(): number {
    let sum = 0;
    for (const c of this.counts.values()) sum += c;
    return sum;
  }
}

/**
 * Raises a number to an integer power.
 *
 * @param base - the number to raise
 * @param exp - a non-negative integer exponent
 * @returns `base` raised to `exp`
 * @throws RangeError if `exp` is negative or not an integer
 */
export function power(base: number, exp: number): number {
  if (exp < 0 || !Number.isInteger(exp)) throw new RangeError("bad exponent");
  return base ** exp;
}

/**
 * Wraps a value in a single-element array.
 *
 * @typeParam T - the element type
 * @typeParam U - unused
 * @param value - the value to wrap
 * @returns a one-element array containing `value`
 */
export function wrap<T>(value: T): T[] {
  return [value];
}

/**
 * Squares a number.
 *
 * @deprecated Use {@link power} with `exp = 2` instead.
 * @param n - the value to square
 */
export function oldSquare(n: number): number {
  return n * n;
}

/**
 * Resets internal caches. Not part of the public API.
 *
 * @internal
 */
export function resetCaches(): void {}

/** Settings accepted by {@link power}-based helpers. */
export interface PowerOptions {
  /** Maximum exponent allowed. */
  maxExp: number;
  /**
   * Whether to round the result.
   * @defaultValue false
   */
  round?: boolean;
}

/** Supported unit systems. */
export enum Unit {
  /** Metric units. */
  Metric,
  /** Imperial units. */
  Imperial,
}

/** A function that maps a number to a number. */
export type NumFn = (n: number) => number;
