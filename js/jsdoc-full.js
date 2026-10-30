/** @import { Item } from "./plain.js" */

/**
 * A point in 2D.
 * @typedef {object} Point
 * @property {number} x - horizontal position
 * @property {number} y - vertical position
 * @property {string=} label - optional label
 */

/**
 * Picks the first element.
 * @template T
 * @param {T[]} items - the list
 * @returns {T | undefined}
 * @see {@linkcode last} for the opposite end
 */
export function first(items) {
  return items[0];
}

/**
 * Picks the last element.
 * @template T
 * @param {T[]} items - the list
 * @returns {T | undefined}
 * @see {@linkplain first}
 * @see first
 */
export function last(items) {
  return items[items.length - 1];
}

/**
 * @overload
 * @param {string} value
 * @returns {string}
 */
/**
 * @overload
 * @param {number} value
 * @returns {number}
 */
/**
 * @param {string | number} value
 * @returns {string | number}
 */
export function echo(value) {
  return value;
}

/**
 * Accepts loosely typed values (JSDoc type syntax).
 * @param {?number} maybe - nullable
 * @param {!Object} required - non-nullable
 * @param {...number} rest - variadic
 * @returns {*}
 */
export function loose(maybe, required, ...rest) {
  return [maybe, required, rest];
}

/** @satisfies {Point} */
export const origin = { x: 0, y: 0 };

/** @implements {Iterable<number>} */
export class Counter {
  /** @readonly */
  start = 0;
  /** @private */
  secret = 1;
  /** @protected */
  shared = 2;
  /** @public */
  open = 3;
  *[Symbol.iterator]() {
    yield this.start;
  }
}

/** @extends {Array<number>} */
export class Numbers extends Array {}

export class Base {
  greet() {
    return "base";
  }
}

export class Derived extends Base {
  /** @override */
  greet() {
    return "derived";
  }
}

/**
 * @this {{ factor: string }}
 * @param {number} n
 */
export function scaleBy(n) {
  return n * this.factor;
}

/** @param {Item} item */
export function itemId(item) {
  return item.id;
}
