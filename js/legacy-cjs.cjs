/**
 * Adds two numbers (CommonJS).
 * @param {number} a
 * @param {number} b
 */
function add(a, b) {
  return a + b;
}

/** @param {number} n */
function negate(n) {
  return -n;
}

module.exports = { add, negate };
