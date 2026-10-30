import { lazy, Suspense, useRef } from "react";
import { CartView } from "./components/CartView";
import { Badge, Pill } from "./components/Badge";
import { Button, Input, type InputHandle } from "./components/Button";
import { Header } from "./components/Header";
import { List } from "./components/List";
import { Counter, ErrorBoundary } from "./components/Legacy";
import { Tabs } from "./components/Tabs";
import { Modal } from "./components/Modal";
import { withLogger } from "./components/withLogger";
import { Outer } from "./components/Nested";
import { Icon } from "./components/Icon";
import { ThemeProvider, useThemeColor } from "./context/Theme";
import { useCounter } from "./hooks/useCart";
import { ClientCart } from "./app/ClientCart";
import Page from "./app/Page";

const Heavy = lazy(() => import("./components/Heavy"));
const LoggedBadge = withLogger(Badge);

function Swatch() {
  const color = useThemeColor();
  const [clicks, increment] = useCounter(1);
  return (
    <button style={{ color }} onClick={increment}>
      {clicks}
    </button>
  );
}

/** The application root. */
export function App() {
  const inputRef = useRef<InputHandle>(null);
  return (
    <ThemeProvider theme={{ color: "teal", dense: true }}>
      <ErrorBoundary>
        <Header title="Shop">
          <Badge label="new" />
          <Pill text="sale" />
        </Header>
        <CartView initial={[{ sku: "a", qty: 1 }]} title="Your cart" />
        <Button label="Buy" onPress={() => inputRef.current?.focus()} />
        <Input ref={inputRef} placeholder="Coupon" />
        <List items={[{ id: "1", name: "x" }]} render={(item) => <b>{item.name}</b>} />
        <Counter step={2} />
        <Tabs>
          <Tabs.Panel title="One">first</Tabs.Panel>
        </Tabs>
        <Modal>
          <Icon size={24} />
        </Modal>
        <LoggedBadge label="logged" />
        <Outer names={["r1", "r2"]} />
        <Swatch />
        <ClientCart />
        <Page />
        <Suspense fallback={<p>loading</p>}>
          <Heavy />
        </Suspense>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
