import { createPortal } from "react-dom";
import type { ReactNode } from "react";

/** Renders its children into `document.body`. */
export function Modal({ children }: { children: ReactNode }) {
  return createPortal(<div className="modal">{children}</div>, document.getElementById("modal"));
}
