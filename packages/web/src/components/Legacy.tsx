import { Component, type ErrorInfo, type ReactNode } from "react";

/** Props for {@link Counter}. */
interface CounterProps {
  step: string;
}

interface CounterState {
  count: number;
}

/** A class component with state and lifecycle methods. */
export class Counter extends Component<CounterProps, CounterState> {
  state: CounterState = { count: 0 };

  componentDidMount() {
    console.log("mounted");
  }

  componentDidUpdate(prev: CounterProps) {
    if (prev.step !== this.props.step) console.log("step changed");
  }

  increment = () => {
    this.setState((s) => ({ count: s.count + this.props.step }));
  };

  render() {
    return <button onClick={this.increment}>{this.state.count}</button>;
  }
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
