import { useEffect, useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { useLang } from "../../lib/useLang";
import { StonePlaceholder } from "../home/StonePlaceholder";
import {
  materialOptions,
  colorOptions,
  finishOptions,
  colorSwatch,
  colorLabels,
  finishLabels,
} from "../../data/projects";
import type { Proyecto } from "../../data/projects";

const SHELL = "mx-auto w-full max-w-[1440px] px-5 md:px-20";
const ALL = "todos";

const ui = {
  es: {
    eyebrow: "Galería",
    title: ["NUESTROS", "PROYECTOS"],
    lead: "Cocinas, islas, barras y baños en piedra natural. Filtra por material, color y acabado.",
    groups: { material: "Material", color: "Color", finish: "Acabado" },
    all: "Todos",
    count: (n: number) => `${n} ${n === 1 ? "proyecto" : "proyectos"}`,
    clear: "Limpiar filtros",
    empty: "Ningún proyecto coincide con esos filtros.",
    emptyCatalog: "Pronto publicaremos nuestros proyectos aquí.",
    public: "Público",
  },
  en: {
    eyebrow: "Gallery",
    title: ["OUR", "PROJECTS"],
    lead: "Kitchens, islands, bars and baths in natural stone. Filter by material, color and finish.",
    groups: { material: "Material", color: "Color", finish: "Finish" },
    all: "All",
    count: (n: number) => `${n} ${n === 1 ? "project" : "projects"}`,
    clear: "Clear filters",
    empty: "No project matches those filters.",
    emptyCatalog: "We'll publish our projects here soon.",
    public: "Public",
  },
} as const;

type FilterState = { material: string; color: string; finish: string };

function readFromUrl(): FilterState {
  if (typeof window === "undefined") return { material: ALL, color: ALL, finish: ALL };
  const p = new URLSearchParams(window.location.search);
  return {
    material: p.get("material") || ALL,
    color: p.get("color") || ALL,
    finish: p.get("finish") || ALL,
  };
}

// =====================
// CHIP
// =====================
function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "inline-flex items-center gap-2 shrink-0 rounded-[10px] px-3.5 py-[7px]",
        "text-[13px] tracking-wide transition-all duration-200 active:scale-[0.96]",
        active
          ? "bg-[var(--invert-bg)] text-[var(--invert-fg)] border border-transparent"
          : "bg-transparent text-[var(--text-secondary)] border border-[var(--border-default)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// =====================
// CARD
// =====================
function ProjectCard({ p, publicLabel }: { p: Proyecto; publicLabel: string }) {
  const meta = [p.colorName, p.finishName].filter(Boolean).join(" · ");
  const overlay = (
    <>
      {/* material + type chips */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
        {p.material && (
          <span
            className="rounded-[10px] px-2.5 py-1 text-[12px] backdrop-blur-md"
            style={{ background: "rgba(155,168,176,0.18)", color: "#DCE3E7" }}
          >
            {p.material}
          </span>
        )}
        {p.type && (
          <span
            className="rounded-[10px] px-2.5 py-1 text-[12px] text-[#9B9B9B] backdrop-blur-md"
            style={{ background: "rgba(10,10,10,0.6)" }}
          >
            {p.type}
          </span>
        )}
      </div>
      {/* public badge */}
      {p.isPublic && (
        <span
          className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] text-white/90 backdrop-blur-md"
          style={{ background: "rgba(10,10,10,0.6)" }}
        >
          <MapPin size={11} /> {publicLabel}
        </span>
      )}
    </>
  );

  return (
    <a
      href={`/proyectos/${p.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] transition-colors duration-200 hover:border-[var(--border-strong)]"
    >
      {p.img ? (
        <div className="relative h-[240px] md:h-[300px] overflow-hidden">
          <img
            src={p.img}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {overlay}
        </div>
      ) : (
        <StonePlaceholder
          className="h-[240px] md:h-[300px]"
          label={p.colorName.toUpperCase()}
          material={p.material.toLowerCase()}
        >
          {overlay}
        </StonePlaceholder>
      )}

      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[17px] font-semibold text-[var(--text-primary)]">{p.title}</h3>
          {p.sqft && (
            <span className="shrink-0 text-[13px] text-[var(--text-muted)]">{p.sqft}</span>
          )}
        </div>
        {meta && <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{meta}</p>}
      </div>
    </a>
  );
}

// =====================
// GALLERY
// =====================
export function ProjectGallery({ projects }: { projects: Proyecto[] }) {
  const [lang] = useLang("es");
  const t = ui[lang];
  const [f, setF] = useState<FilterState>({ material: ALL, color: ALL, finish: ALL });

  // hydrate filters from the URL (so returning from a detail keeps them)
  useEffect(() => {
    setF(readFromUrl());
  }, []);

  // keep the URL in sync without adding history entries
  useEffect(() => {
    const p = new URLSearchParams();
    if (f.material !== ALL) p.set("material", f.material);
    if (f.color !== ALL) p.set("color", f.color);
    if (f.finish !== ALL) p.set("finish", f.finish);
    const qs = p.toString();
    const url = qs ? `?${qs}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [f]);

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (f.material === ALL || p.material === f.material) &&
          (f.color === ALL || p.color === f.color) &&
          (f.finish === ALL || p.finish === f.finish),
      ),
    [f, projects],
  );

  const set = (key: keyof FilterState, val: string) =>
    setF((prev) => ({ ...prev, [key]: prev[key] === val ? ALL : val }));
  const clear = () => setF({ material: ALL, color: ALL, finish: ALL });

  return (
    <div className="pt-15">
      {/* ============ HEADER ============ */}
      <section className={`${SHELL} pt-12 pb-8 md:pt-20 md:pb-12`}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-[12px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              {t.eyebrow}
            </p>
            <h1 className="mt-3 font-franchise leading-[0.92] text-[var(--text-primary)] text-[44px] md:text-[88px]">
              {t.title[0]}
              <br />
              {t.title[1]}
            </h1>
          </div>
          <p className="max-w-[360px] text-[15px] md:text-[16px] font-light leading-relaxed text-[var(--text-secondary)]">
            {t.lead}
          </p>
        </div>
      </section>

      {/* ============ FILTERS ============ */}
      <section className={`${SHELL} pb-6`}>
        <div className="flex flex-col gap-4">
          {/* Material */}
          <FilterRow label={t.groups.material}>
            <Chip active={f.material === ALL} onClick={() => set("material", ALL)}>
              {t.all}
            </Chip>
            {materialOptions.map((m) => (
              <Chip key={m} active={f.material === m} onClick={() => set("material", m)}>
                {m}
              </Chip>
            ))}
          </FilterRow>

          {/* Color */}
          <FilterRow label={t.groups.color}>
            <Chip active={f.color === ALL} onClick={() => set("color", ALL)}>
              {t.all}
            </Chip>
            {colorOptions.map((c) => (
              <Chip key={c} active={f.color === c} onClick={() => set("color", c)}>
                <span
                  className="h-2.5 w-2.5 rounded-full border border-black/20"
                  style={{ background: colorSwatch[c] }}
                />
                {colorLabels[c] ?? c}
              </Chip>
            ))}
          </FilterRow>

          {/* Finish */}
          <FilterRow label={t.groups.finish}>
            <Chip active={f.finish === ALL} onClick={() => set("finish", ALL)}>
              {t.all}
            </Chip>
            {finishOptions.map((fin) => (
              <Chip key={fin} active={f.finish === fin} onClick={() => set("finish", fin)}>
                {finishLabels[fin] ?? fin}
              </Chip>
            ))}
          </FilterRow>
        </div>

        {/* count + clear */}
        <div className="mt-5 flex items-center justify-between border-t border-[var(--border-default)] pt-4">
          <span className="text-[13px] text-[var(--text-secondary)]">
            {t.count(filtered.length)}
          </span>
          <button
            type="button"
            onClick={clear}
            className="text-[13px] text-[var(--text-muted)] underline underline-offset-2 hover:text-[var(--text-secondary)] transition-colors"
          >
            {t.clear}
          </button>
        </div>
      </section>

      {/* ============ GRID ============ */}
      <section className={`${SHELL} pb-20 md:pb-28`}>
        {filtered.length === 0 ? (
          <div className="py-24 text-center text-[15px] text-[var(--text-secondary)]">
            {projects.length === 0 ? t.emptyCatalog : t.empty}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProjectCard key={p.id} p={p} publicLabel={t.public} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Group label + horizontally-scrollable chip row (scrolls on mobile).
function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[88px_1fr] md:items-center gap-2 md:gap-4">
      <span className="text-[12px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
        {label}
      </span>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 md:mx-0 md:px-0">
        {children}
      </div>
    </div>
  );
}
