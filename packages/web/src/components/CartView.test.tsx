import { CartView } from "./CartView";

declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => void): void;
declare function render(ui: unknown): { getByTestId(id: string): { click(): void } };

describe("CartView", () => {
  it("adds a sample item", () => {
    const view = render(<CartView initial={[]} currency="EUR" />);
    view.getByTestId("add").click();
  });
});
