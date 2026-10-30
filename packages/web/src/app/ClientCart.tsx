"use client";

import { useActionState } from "react";
import { saveCart } from "./actions";

/** A form that calls a server action. */
export function ClientCart() {
  const [status, submit, pending] = useActionState(saveCart, "idle");
  return (
    <form action={submit}>
      <input name="sku" />
      <button disabled={pending}>Save</button>
      <output>{status}</output>
    </form>
  );
}
