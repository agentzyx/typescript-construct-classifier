import { Component, useEffect, useState, type ErrorInfo, type ReactNode } from "react";

/** Props for {@link Counter}. */
interface CounterProps {
  step: number;
}

interface CounterState {
  count: number;
}

/** A counter component (function version of the former class component). */
export function Counter({ step }: CounterProps) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log("mounted");
  }, []);
  const increment = () => {
    setCount((c) => c + step);
  };
  return <button onClick={increment}>{count}</button>;
}

/** Catches render errors in its subtree. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    return this.state.failed ? <p>Something broke</p> : this.props.children;
  }
}
