import { memo } from "react";

/** A small label. */
export const Badge = memo(function Badge({ label }: { label: string }) {
  return <span className="badge">{label}</span>;
});
Badge.displayName = "ShopBadge";

/** A rounded label (anonymous component inside `memo`). */
export const Pill = memo((props: { text: string }) => <span className="pill">{props.text}</span>);
