import type { ComponentType } from "react";

/**
 * Wraps a component and logs each render.
 *
 * @typeParam P - the wrapped component's props
 * @param Wrapped - the component to wrap
 */
export function withLogger<P extends object>(Wrapped: ComponentType<P>) {
  function Logged(props: P) {
    console.log("render", Wrapped.displayName ?? Wrapped.name);
    return <Wrapped {...props} />;
  }
  return Logged;
}
