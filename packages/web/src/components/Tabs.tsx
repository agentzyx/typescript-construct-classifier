import type { ReactNode } from "react";

/** A tab container (compound component). */
export function Tabs({ children }: { children: ReactNode }) {
  return <div role="tablist">{children}</div>;
}

/** One panel inside {@link Tabs}. */
Tabs.Panel = function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} role="tabpanel">
      {children}
    </section>
  );
};
