import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const EVENT = "vaneco:theme-change";

/**
 * Shared theme state for React islands.
 * The actual `light`/`dark` class on <html> and localStorage persistence are
 * handled by the inline scripts in BaseLayout; islands only read the current
 * value and broadcast changes through the `vaneco:theme-change` event.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setThemeState(isDark ? "dark" : "light");

    const onTheme = (e: Event) => {
      const next = (e as CustomEvent).detail?.theme as Theme | undefined;
      if (next === "light" || next === "dark") setThemeState(next);
    };
    window.addEventListener(EVENT, onTheme);
    return () => window.removeEventListener(EVENT, onTheme);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setThemeState(next);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { theme: next } }));
  }

  function setTheme(next: Theme) {
    setThemeState(next);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { theme: next } }));
  }

  return { theme, toggle, setTheme };
}
