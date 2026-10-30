function logged<T>(value: T, _context: ClassMethodDecoratorContext): T {
  return value;
}

export abstract class Shape {
  abstract area(): number;

  describe() {
    return `area ${this.area()}`;
  }
}

export class Cart extends Shape {
  static count = 0;
  readonly id = 1;
  #secret = "x";
  accessor label = "cart";

  static {
    Cart.count = 1;
  }

  constructor(private items: string[] = [], public owner?: string) {
    super();
  }

  get size() {
    return this.items.length;
  }

  set size(v: number) {
    this.items.length = v;
  }

  @logged
  add(item: string) {
    this.items.push(item);
  }

  #hidden() {
    return this.#secret;
  }

  override describe() {
    return "cart " + this.#hidden();
  }

  area() {
    return this.items.length;
  }

  *[Symbol.iterator]() {
    yield* this.items;
  }

  async flush(): Promise<number> {
    return this.items.length;
  }
}

export const Anon = class {
  run() {
    return 1;
  }
};

export function Timestamped<B extends new (...a: any[]) => object>(Base: B) {
  return class extends Base {
    ts = Date.now();
  };
}
