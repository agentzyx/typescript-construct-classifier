/**
 * @typedef {{ id: number, label: string }} Item
 */

/**
 * @param {Item} item
 * @returns {string}
 */
export function label(item) {
  return item.label;
}

/**
 * @callback Mapper
 * @param {number} n
 * @returns {number}
 */

/** @type {Mapper} */
export const double = (n) => n * 2;
