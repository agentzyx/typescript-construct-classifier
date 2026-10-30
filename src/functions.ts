export function plain(a: number, b: number): number {
  // add the two operands
  const sum = a + b;
  return sum;
}

export async function load(id: string): Promise<string> {
  return id;
}

export function* counter(n: number) {
  for (let i = 0; i < n; i++) {
    yield i;
  }
}

export function pick(x: string): string;
export function pick(x: number): number;
export function pick(x: string | number) {
  return x;
}

export function identity<T extends object>(v: T): T {
  return v;
}

export function assertDefined(v: unknown): asserts v {
  if (v == null) throw new Error("undefined");
}

export function isString(v: unknown): v is string {
  return typeof v === "string";
}

export function withThis(this: { n: number }, k = 1, ...rest: number[]) {
  return this.n + k + rest.length;
}

function internalHelper() {
  return 42;
}

export function outer() {
  function inner() {
    return internalHelper();
  }
  const viaArrow = () => inner();
  return viaArrow();
}

export function withResource() {
  using res = { [Symbol.dispose]() {} };
  return res;
}

// Formats a number for display with two decimals.
export function display(n: number) {
  return n.toFixed(2);
}

/**
 * Squares a number.
 * @param n the value to square
 */
export function square(n: number) {
  // multiply rather than Math.pow for speed
  return n * n;
}

export function doubled(xs: number[]) {
  return xs.map((x) => {
    return x * 2;
  });
}

export function report(values: number[]) {
  const count = values.length;
  const sum = values.reduce((a, b) => a + b, 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const mean = count === 0 ? 0 : sum / count;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(count / 2);
  const median = count % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  const range = max - min;
  const lines = [
    `count: ${count}`,
    `sum: ${sum}`,
    `min: ${min}`,
    `max: ${max}`,
    `mean: ${mean}`,
    `median: ${median}`,
    `range: ${range}`,
  ];
  return lines.join("\n");
}
