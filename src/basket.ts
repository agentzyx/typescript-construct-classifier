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
