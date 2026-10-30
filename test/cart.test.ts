import { Cart } from "../src/classes";

declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => void): void;

describe("Cart", () => {
  it(`adds ${1}`, () => {
    const c = new Cart();
    c.add("x");
  });

  describe("size", () => {
    it("starts at zero", () => {
      if (new Cart().size !== 0) throw new Error("bad");
    });
  });
});
