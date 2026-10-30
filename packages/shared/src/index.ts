/** An amount of money in minor units (cents). */
export interface Money {
  cents: number;
  currency: string;
}

/**
 * Formats money for display.
 *
 * @param money - the amount
 * @returns the amount with its currency code, e.g. `12.50 EUR`
 */
export function formatPrice(money: Money): string {
  return `${toMajor(money.cents)} ${money.currency}`;
}

/** Converts minor units to a major-unit string. */
export function toMajor(cents: number): string {
  return (cents / 100).toFixed(2);
}

/** Currencies the shop accepts. */
export const SUPPORTED_CURRENCIES = ["EUR", "USD"] as const;
