const { add, negate } = require("./legacy-cjs.cjs");

/** @param {number} n */
function addOne(n) {
  return negate(add(n, 1));
}

module.exports = { addOne };
