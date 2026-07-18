import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

// Primary — inverse fill, color inversion on hover, scale on press. Radius 10.
export function PrimaryBtn({
  href,
  children,
  full = false,
  icon = true,
  className = "",
}: {
  href: string;
  children: ReactNode;
  full?: boolean;
  icon?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={[
        full ? "w-full" : "",
        "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[10px]",
        "text-[15px] font-medium tracking-wide",
        "border border-transparent bg-[var(--invert-bg)] text-[var(--invert-fg)]",
        "transition-all duration-200 active:scale-[0.96]",
        "hover:bg-transparent hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]",
        className,
      ].join(" ")}
    >
      {children}
      {icon && <ArrowUpRight size={16} />}
    </a>
  );
}

// Secondary — outline, inverts on hover. Radius 10.
export function SecondaryBtn({
  href,
  children,
  full = false,
}: {
  href: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <a
      href={href}
      className={[
        full ? "w-full" : "",
        "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[10px]",
        "text-[15px] font-medium tracking-wide",
        "border border-[var(--border-default)] text-[var(--text-primary)]",
        "transition-all duration-200 active:scale-[0.96]",
        "hover:bg-[var(--invert-bg)] hover:text-[var(--invert-fg)] hover:border-transparent",
      ].join(" ")}
    >
      {children}
    </a>
  );
}
