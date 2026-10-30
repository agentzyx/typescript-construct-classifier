import type { ReactNode } from "react";

/** Props for {@link List}. */
export interface ListProps<T extends { id: string }> {
  items: T[];
  render: (item: T) => ReactNode;
}

/**
 * Renders any list of items with a render prop.
 *
 * @typeParam T - the item type
 */
export function List<T extends { id: number }>({ items, render }: ListProps<T>) {
  return <ul>{items.map((item) => <li key={item.id}>{render(item)}</li>)}</ul>;
}
