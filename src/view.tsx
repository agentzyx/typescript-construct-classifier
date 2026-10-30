export function CartView(props: { count: number }) {
  return <div class="cart">{props.count * 2}</div>;
}

export const Badge = ({ label }: { label: string }) => {
  return <span>{label}</span>;
};

export const page = <CartView count={1} />;
