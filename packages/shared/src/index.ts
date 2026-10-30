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
export function formatPrice(money: Money, locale: string): string {
  return `${(money.cents / 100).toLocaleString(locale)} ${money.currency}`;
}

/** Currencies the shop accepts. */
export const SUPPORTED_CURRENCIES = ["EUR", "USD"] as const;
