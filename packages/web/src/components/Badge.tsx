import { memo } from "react";

/** A small label. */
export const Badge = memo(function Badge({ label }: { label: string }) {
  return <span className="badge">{label}</span>;
});
Badge.displayName = "Badge";

