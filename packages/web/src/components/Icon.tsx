/** An SVG icon. */
export function Icon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx={8} cy={8} r={7} strokeWidth={2} />
    </svg>
  );
}
