const { add } = require("./legacy-cjs.cjs");

/** @param {number} n */
function addOne(n) {
  return add(n, 1);
}

module.exports = { addOne };
