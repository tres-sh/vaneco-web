"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Read current state from html class (set by BaseLayout inline script)
    const dark = document.documentElement.classList.contains("dark");
    setIsDark(dark);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);

    // Dispatch event — BaseLayout listens and syncs class + localStorage
    window.dispatchEvent(
      new CustomEvent("vaneco:theme-change", {
        detail: { theme: next ? "dark" : "light" },
      })
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={[
        "relative w-9 h-9",
        "flex items-center justify-center",
        "rounded-lg border border-gray-800",
        "bg-gray-950",
        "hover:border-veta",
        "transition-all duration-200",
        "active:scale-[0.93]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-veta/30",
      ].join(" ")}
    >
      <span
        className="absolute transition-all duration-500"
        style={{
          opacity: isDark ? 0 : 1,
          transform: isDark
            ? "rotate(90deg) scale(0.4)"
            : "rotate(0deg) scale(1)",
        }}
      >
        <Sun size={18} color="#FFFFFF" strokeWidth={1.5} />
      </span>
      <span
        className="absolute transition-all duration-500"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark
            ? "rotate(0deg) scale(1)"
            : "rotate(-90deg) scale(0.4)",
        }}
      >
        <Moon size={18} color="#FFFFFF" strokeWidth={1.5} />
      </span>
    </button>
  );
}
