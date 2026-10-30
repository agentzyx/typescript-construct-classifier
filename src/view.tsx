export function CartView(props: { count: number }) {
  return <div class="cart">{props.count}</div>;
}

export const Badge = ({ label }: { label: string }) => {
  return <span>{label}</span>;
};

export const page = <CartView count={1} />;

export function SvgUse() {
  return (
    <svg>
      <use xlink:href="#icon" />
    </svg>
  );
}
