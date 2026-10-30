import { useEffect, useState } from "react";
import styles from "./CartView.module.css";
import { useCart, type CartItem } from "../hooks/useCart";

/** Props for {@link CartView}. */
export interface CartViewProps {
  /** Lines shown when the cart first renders. */
  initial: CartItem[];
  /** Heading text. */
  title?: string;
}

export function CartView({ initial, title = "Cart" }: CartViewProps) {
  const { items, total, add } = useCart(initial);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    document.title = `${title} (${total})`;
  }, [title, total]);

  useEffect(() => {
    console.log("cart mounted");
  }, []);

  const handleAdd = () => {
    add("sample");
  };

  if (!open) return null;

  return (
    <>
      {/* heading and close button */}
      <h2 className={styles.cart}>{title}</h2>
      <button onClick={() => setOpen(false)}>close</button>
      {items.length === 0 ? (
        <p className={styles.empty}>Empty</p>
      ) : (
        <ul>
          {items.map((i) => (
            <li key={i.sku}>
              {i.sku} × {i.qty}
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleAdd} data-testid="add">
        Add
      </button>
    </>
  );
}
