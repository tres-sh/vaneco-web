import type { ReactNode } from "react";

/**
 * Marked placeholder standing in for a real project photo (spec §7.6).
 * Renders the Vaneco watermark + a material label, with a small "demo"
 * marker so it's never mistaken for a final asset.
 */
export function StonePlaceholder({
  className = "",
  label,
  material,
  children,
}: {
  className?: string;
  /** Bottom-right bold label, e.g. "BLANCO DALLAS" */
  label?: string;
  /** Bottom-right small material, e.g. "granito" */
  material?: string;
  /** Overlay content (chips, captions) */
  children?: ReactNode;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden stone-placeholder",
        "ring-1 ring-inset ring-white/5",
        className,
      ].join(" ")}
    >
      {/* demo marker */}
      <span className="absolute top-2.5 right-2.5 z-10 rounded-[6px] bg-black/50 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-white/45 backdrop-blur-sm">
        demo
      </span>

      {/* watermark */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 opacity-70">
        <span className="grid h-4 w-4 place-items-center rounded-[3px] bg-white/85">
          <span className="block h-2 w-2 rotate-45 border-t border-l border-black" />
        </span>
        <span className="text-[11px] font-medium text-white/80">
          piedras<span className="font-semibold">vaneco</span>.com
        </span>
      </div>

      {/* material label */}
      {label && (
        <div className="absolute bottom-3 right-3 z-10 text-right leading-tight">
          <span className="block text-[12px] font-semibold tracking-wide text-white/90">
            {label}
          </span>
          {material && (
            <span className="block text-[10px] tracking-wide text-white/55">
              {material}
            </span>
          )}
        </div>
      )}

      {/* soft bottom gradient for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

      {children}
    </div>
  );
}
