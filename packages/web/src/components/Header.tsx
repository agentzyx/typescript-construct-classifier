import type { FC, PropsWithChildren } from "react";

/** Props for {@link Header}. */
export interface HeaderProps {
  title: string;
}

/** Page header typed with `FC`. */
export const Header: FC<HeaderProps> = ({ title }) => {
  const children = null;
  return (
    <header>
      <h1>{title}</h1>
      {children}
    </header>
  );
};
