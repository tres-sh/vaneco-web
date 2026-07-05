import { Moon, Sun } from "lucide-react";
import type { Lang } from "../../lib/useLang";
import type { Theme } from "../../lib/useTheme";

// =====================
// LANGUAGE TOGGLE — segmented pill (ES / EN)
// Active segment uses the inverse pair; radius 10.
// =====================
export function LangToggle({
  lang,
  onChange,
  size = "md",
}: {
  lang: Lang;
  onChange: (l: Lang) => void;
  size?: "md" | "sm";
}) {
  const pad = size === "sm" ? "px-2 py-1 text-[11px]" : "px-2.5 py-1.5 text-[12px]";
  return (
    <div className="flex items-center rounded-[10px] bg-[var(--bg-elevated)] border border-[var(--border-default)] p-0.5">
      {(["es", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          aria-pressed={lang === l}
          className={[
            "rounded-[8px] font-medium tracking-wide transition-all duration-200",
            pad,
            lang === l
              ? "bg-[var(--invert-bg)] text-[var(--invert-fg)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
          ].join(" ")}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

// =====================
// THEME BUTTON — fixed #1A1A1A background, white icon.
// Does NOT invert with the theme (per spec). Radius 10.
// =====================
export function ThemeButton({
  theme,
  onToggle,
  size = "md",
}: {
  theme: Theme;
  onToggle: () => void;
  size?: "md" | "sm";
}) {
  const box = size === "sm" ? "w-8 h-8" : "w-9 h-9";
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className={[
        box,
        "relative flex items-center justify-center rounded-[10px]",
        "bg-[#1A1A1A] border border-[#2E2E2E]",
        "transition-transform duration-200 active:scale-[0.93]",
        "hover:border-veta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-veta/30",
      ].join(" ")}
    >
      <span
        className="absolute transition-all duration-500"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.4)",
        }}
      >
        <Moon size={17} color="#FFFFFF" strokeWidth={1.5} />
      </span>
      <span
        className="absolute transition-all duration-500"
        style={{
          opacity: isDark ? 0 : 1,
          transform: isDark ? "rotate(90deg) scale(0.4)" : "rotate(0deg) scale(1)",
        }}
      >
        <Sun size={17} color="#FFFFFF" strokeWidth={1.5} />
      </span>
    </button>
  );
}
