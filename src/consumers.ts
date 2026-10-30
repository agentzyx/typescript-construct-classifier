import { fmt as f } from "./variables";
import * as fns from "./functions";

export const viaAlias = f(1);
export const viaNamespace = fns.plain(1, 2);
export const asValue = [fns.identity];

export async function lazy() {
  const m = await import("./functions");
  return m.plain(2, 3);
}
