export function CartView(props: { count: number }) {
  return <div class="cart">{props.count}</div>;
}

export const Badge = ({ label }: { label: string }) => {
  return <strong>{label}</strong>;
};

export const page = <CartView count={1} />;
