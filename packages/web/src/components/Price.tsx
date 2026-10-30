import { formatPrice, type Money } from "@fixture/shared";
import { useTally as useCounter } from "@/hooks/useCart";

/** Shows a formatted price (imports from the shared workspace package and through the `@/` alias). */
export function Price({ amount }: { amount: Money }) {
  const [views] = useCounter(0);
  return (
    <span data-views={views}>
      {formatPrice(amount)}
    </span>
  );
}
