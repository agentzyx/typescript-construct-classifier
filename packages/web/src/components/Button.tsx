import { forwardRef, useImperativeHandle, useRef, type Ref } from "react";

/** Props for {@link Button}. */
export interface ButtonProps {
  label: string;
  onPress?: () => void;
}

/** A button that forwards its ref (pre-React-19 style). */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ label, onPress }, ref) {
  return (
    <button ref={ref} onClick={onPress}>
      {label}
    </button>
  );
});

/** Imperative handle exposed by {@link Input}. */
export interface InputHandle {
  focus(): void;
}

/** An input that takes `ref` as a prop (React 19 style). */
export function Input({ ref, placeholder }: { ref?: Ref<InputHandle>; placeholder: string }) {
  const inner = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => ({ focus: () => inner.current?.focus() }), []);
  return <input ref={inner} placeholder={placeholder} />;
}
