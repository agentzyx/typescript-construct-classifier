import type { FC, PropsWithChildren } from "react";

/** Props for {@link Header}. */
export interface HeaderProps {
  title: string;
}

/** Page header typed with `FC`. */
export const Header: FC<PropsWithChildren<HeaderProps>> = ({ title, children }) => {
  return (
    <header>
      <h1>{title}</h1>
      {children}
    </header>
  );
};
