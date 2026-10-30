import { useId, useLayoutEffect, useOptimistic, useRef, useSyncExternalStore, useTransition } from "react";

const listeners = new Set<() => void>();
let online = true;

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Whether the browser reports being online. */
export function useOnline() {
  return useSyncExternalStore(subscribe, () => online);
}

/**
 * Measures an element's width after layout.
 *
 * @returns a ref to attach and the measured width
 */
export function useWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const width = useRef(0);
  useLayoutEffect(() => {
    width.current = ref.current?.offsetWidth ?? 0;
  });
  return { ref, width };
}

/**
 * A labelled field id plus an optimistic value.
 *
 * @param value - the confirmed value
 */
export function useField(value: string) {
  const id = useId();
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(value, (_current, next: string) => next);
  return { id, pending, startTransition, optimistic, setOptimistic };
}
