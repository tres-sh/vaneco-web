import { ArrowLeft, MapPin, AtSign, ExternalLink } from "lucide-react";
import { useLang } from "../../lib/useLang";
import { StonePlaceholder } from "../home/StonePlaceholder";
import { PrimaryBtn } from "../ui/Button";
import { stripAccents } from "../../lib/text";
import type { Proyecto } from "../../data/projects";

const SHELL = "mx-auto w-full max-w-[1120px] px-5 md:px-8";

const ui = {
  es: {
    back: "Volver a la galería",
    specs: {
      material: "Material",
      color: "Color predominante",
      finish: "Acabado",
      sqft: "Superficie",
      type: "Tipo de trabajo",
    },
    cta: "Quiero algo así",
    publicTitle: "Obra abierta al público",
    maps: "Cómo llegar",
    more: "MAS IMAGENES",
  },
  en: {
    back: "Back to gallery",
    specs: {
      material: "Material",
      color: "Predominant color",
      finish: "Finish",
      sqft: "Area",
      type: "Work type",
    },
    cta: "I want something like this",
    publicTitle: "Open to the public",
    maps: "Directions",
    more: "MORE IMAGES",
  },
} as const;

function goBack() {
  if (typeof window === "undefined") return;
  if (window.history.length > 1) window.history.back();
  else window.location.assign("/proyectos");
}

export function ProjectDetail({ project: p }: { project: Proyecto }) {
  const [lang] = useLang("es");
  const t = ui[lang];
  const images = p.images ?? [];
  const moreImages = images.slice(1); // images[0] is the hero
  const chips = [p.material, p.type, p.finishName].filter(Boolean);

  return (
    <div className="pt-15">
      <article className={`${SHELL} py-8 md:py-12`}>
        {/* top bar */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft size={16} /> {t.back}
          </button>
          <span className="text-[12px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
            REF · {p.id}
          </span>
        </div>

        {/* main image */}
        {(() => {
          const chipsOverlay = (
            <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-[10px] px-3 py-1.5 text-[12px] text-white backdrop-blur-md"
                  style={{ background: "rgba(10,10,10,0.7)" }}
                >
                  {chip}
                </span>
              ))}
            </div>
          );
          return p.img ? (
            <div className="relative h-[300px] md:h-[460px] overflow-hidden rounded-2xl">
              <img src={p.img} alt={p.title} className="h-full w-full object-cover" />
              {chipsOverlay}
            </div>
          ) : (
            <StonePlaceholder
              className="h-[300px] md:h-[460px] rounded-2xl"
              label={p.colorName.toUpperCase()}
              material={p.material.toLowerCase()}
            >
              {chipsOverlay}
            </StonePlaceholder>
          );
        })()}

        {/* title + description + specs */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-12">
          {/* left */}
          <div>
            <h1 className="font-franchise text-[40px] md:text-[56px] leading-[0.95] text-[var(--text-primary)]">
              {stripAccents(p.title)}
            </h1>
            <div className="mt-5 space-y-4 text-[16px] font-light leading-[1.7] text-[var(--text-secondary)]">
              <p>{p.description}</p>
              {p.description2 && <p>{p.description2}</p>}
            </div>

            {/* public block */}
            {p.isPublic && (
              <div className="mt-8 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6">
                <p className="text-[11px] uppercase tracking-[0.14em] text-veta">{t.publicTitle}</p>
                {p.place && (
                  <p className="mt-2 text-[20px] font-semibold text-[var(--text-primary)]">
                    {p.place}
                  </p>
                )}
                {p.location && (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[14px] text-[var(--text-secondary)]">
                    <MapPin size={14} /> {p.location}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.instagram && (
                    <a
                      href={`https://instagram.com/${p.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--border-default)] px-3.5 py-2 text-[13px] text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
                    >
                      <AtSign size={14} /> {p.instagram}
                    </a>
                  )}
                  {p.mapsUrl && (
                    <a
                      href={p.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--border-default)] px-3.5 py-2 text-[13px] text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
                    >
                      <ExternalLink size={14} /> {t.maps}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* right — specs */}
          <div>
            <dl className="rounded-2xl border border-[var(--border-default)] overflow-hidden">
              {[
                [t.specs.material, p.material],
                [t.specs.color, p.colorName],
                [t.specs.finish, p.finishName],
                [t.specs.sqft, p.sqft],
                [t.specs.type, p.type],
              ]
                .filter(([, value]) => Boolean(value))
                .map(([label, value], i) => (
                <div
                  key={label}
                  className={[
                    "flex items-center justify-between gap-4 px-4 py-3.5",
                    i > 0 ? "border-t border-[var(--border-default)]" : "",
                  ].join(" ")}
                >
                  <dt className="text-[13px] text-[var(--text-muted)]">{label}</dt>
                  <dd className="text-[14px] font-medium text-[var(--text-primary)] text-right">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-4">
              <PrimaryBtn href="/cita" full>
                {t.cta}
              </PrimaryBtn>
            </div>
          </div>
        </div>

        {/* more images */}
        {moreImages.length > 0 && (
          <div className="mt-14">
            <h2 className="font-franchise text-[24px] md:text-[28px] text-[var(--text-primary)] mb-5">
              {t.more}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {moreImages.map((src, i) => (
                <div
                  key={src}
                  className={[
                    "h-[220px] md:h-[280px] overflow-hidden rounded-[14px]",
                    // last one spans full width when the count is odd
                    i === moreImages.length - 1 && moreImages.length % 2 === 1
                      ? "col-span-2"
                      : "",
                  ].join(" ")}
                >
                  <img
                    src={src}
                    alt={`${p.title} — ${i + 2}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
