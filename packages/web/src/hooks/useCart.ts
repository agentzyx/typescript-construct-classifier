import { useCallback, useMemo, useReducer, useState } from "react";

/** A line in the cart. */
export interface CartItem {
  sku: string;
  qty: number;
}

/** Actions accepted by {@link cartReducer}. */
export type CartAction =
  | { type: "add"; sku: string }
  | { type: "remove"; sku: string }
  | { type: "clear" };

/**
 * Applies an action to the cart.
 *
 * @param items - current cart lines
 * @param action - the change to apply
 * @returns the new cart lines
 */
export function cartReducer(items: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "add":
      return [...items, { sku: action.sku, qty: 1 }];
    case "remove":
      return items.filter((i) => i.sku !== action.sku);
    case "clear":
      return [];
    default: {
      const unreachable: never = action;
      return unreachable;
    }
  }
}

/**
 * Cart state and actions.
 *
 * @param initial - starting cart lines
 * @returns the lines, their total quantity, and an `add` function
 */
export function useCart(initial: CartItem[]) {
  const [items, dispatch] = useReducer(cartReducer, initial);
  const total = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
  const add = useCallback((sku: string) => dispatch({ type: "add", sku }), []);
  return { items, total, add };
}

/**
 * A numeric counter.
 *
 * @param start - initial value
 * @returns a `[value, increment]` tuple
 */
export function useCounter(start = 0) {
  const [value, setValue] = useState(start);
  const increment = () => setValue((v) => v + 1);
  return { value, increment };
}
