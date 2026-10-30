import { createContext, use, useContext, type ReactNode } from "react";

/** Visual theme values. */
export interface Theme {
  color: string;
  dense: "yes" | "no";
}

/** The current theme. */
export const ThemeContext = createContext<Theme>({ color: "black", dense: false });

/**
 * Provides a theme to its children.
 *
 * @param props - the theme and the subtree it applies to
 */
export function ThemeProvider({ theme, children }: { theme: Theme; children: ReactNode }) {
  return <ThemeContext value={theme}>{children}</ThemeContext>;
}

/** Reads the theme with `useContext`. */
export function useTheme() {
  return useContext(ThemeContext);
}

/** Reads the theme with React 19 `use`. */
export function useThemeColor() {
  return use(ThemeContext).color;
}
