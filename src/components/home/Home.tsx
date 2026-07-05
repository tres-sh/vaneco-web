import type { ReactNode } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useLang } from "../../lib/useLang";
import { StonePlaceholder } from "./StonePlaceholder";

// =====================
// COPY (ES / EN)
// =====================
const copy = {
  es: {
    hero: {
      badge: "Disponible esta semana · 3 espacios",
      title: ["DEL BLOQUE", "A TU COCINA."],
      lead: "Diseñamos, fabricamos e instalamos cubiertas de piedra natural. De la visita a la instalación, sin intermediarios.",
      cta: "Agendar visita",
      secondary: "Ver proyectos",
      chips: ["Blanco Dallas", "Granito"],
    },
    stats: [
      { n: "10", label: "Años de taller" },
      { n: "500", label: "Cocinas instaladas" },
      { n: "25,000", label: "ft² de piedra instalada", accent: true },
    ],
    projects: {
      heading: ["PROYECTOS", "RECIENTES"],
      body: "Cocinas, islas, barras y baños en piedra natural.",
      cta: "Ver galería completa",
      url: "vaneco.com/proyectos",
      items: [
        { name: "Cocina Chapultepec", material: "Granito" },
        { name: "Isla Hipódromo", material: "Cuarzo" },
      ],
    },
    process: {
      heading: "CÓMO LO HACEMOS",
      steps: [
        {
          n: "01",
          title: "Agenda",
          desc: "Agenda una cita y con gusto asistiremos a tu domicilio, totalmente gratis y sin compromiso. Al agendar se crea tu ",
          hl: "folio",
          descAfter: ".",
        },
        {
          n: "02",
          title: "Cotiza",
          desc: "En base al área de la estructura y el material seleccionado se proporciona una cotización ligada a tu folio. Págala en efectivo o por transferencia.",
        },
        {
          n: "03",
          title: "Plantillas",
          desc: "Creamos un molde que nos ayuda a hacer una instalación más precisa y limpia.",
        },
        {
          n: "04",
          title: "Fabricación",
          desc: "El tiempo de fabricación varía en cada proyecto, de 5 a 10 días.",
        },
        {
          n: "05",
          title: "Instalación",
          desc: "Normalmente nos toma un día, pero todo dependerá de tu proyecto.",
        },
      ],
      closing: "Nuestro compromiso es acompañarte en cada paso, desde el inicio hasta el final.",
    },
    finalCta: {
      title: "AGENDA UNA VISITA",
      sub: "Sin costo y sin compromiso. Llevamos muestras. Al agendar se crea tu folio.",
      cta: "Agendar visita",
      note: "La consulta de cotización por folio vive en ",
      noteUrl: "vaneco.com/cita",
    },
    footer: {
      tagline: "Cubiertas de piedra natural · Tijuana, B.C.",
      rights: "© 2026 Vaneco · piedrasvaneco.com",
    },
  },
  en: {
    hero: {
      badge: "Available this week · 3 slots",
      title: ["FROM THE BLOCK", "TO YOUR KITCHEN."],
      lead: "We design, fabricate and install natural stone countertops. From the visit to the install, no middlemen.",
      cta: "Book a visit",
      secondary: "See projects",
      chips: ["Blanco Dallas", "Granite"],
    },
    stats: [
      { n: "10", label: "Years in the shop" },
      { n: "500", label: "Kitchens installed" },
      { n: "25,000", label: "ft² of stone installed", accent: true },
    ],
    projects: {
      heading: ["RECENT", "PROJECTS"],
      body: "Kitchens, islands, bars and baths in natural stone.",
      cta: "See full gallery",
      url: "vaneco.com/projects",
      items: [
        { name: "Chapultepec Kitchen", material: "Granite" },
        { name: "Hipódromo Island", material: "Quartz" },
      ],
    },
    process: {
      heading: "HOW WE DO IT",
      steps: [
        {
          n: "01",
          title: "Book",
          desc: "Book an appointment and we'll gladly visit your home, completely free and with no commitment. Booking creates your ",
          hl: "folio",
          descAfter: ".",
        },
        {
          n: "02",
          title: "Quote",
          desc: "Based on the area of the structure and the chosen material we prepare a quote linked to your folio. Pay in cash or by transfer.",
        },
        {
          n: "03",
          title: "Templates",
          desc: "We create a mold that helps us deliver a more precise, cleaner installation.",
        },
        {
          n: "04",
          title: "Fabrication",
          desc: "Fabrication time varies per project, from 5 to 10 days.",
        },
        {
          n: "05",
          title: "Installation",
          desc: "It usually takes us a day, but it all depends on your project.",
        },
      ],
      closing: "Our commitment is to walk with you every step, from start to finish.",
    },
    finalCta: {
      title: "BOOK A VISIT",
      sub: "Free and with no commitment. We bring samples. Booking creates your folio.",
      cta: "Book a visit",
      note: "Quote lookup by folio lives at ",
      noteUrl: "vaneco.com/cita",
    },
    footer: {
      tagline: "Natural stone countertops · Tijuana, B.C.",
      rights: "© 2026 Vaneco · piedrasvaneco.com",
    },
  },
} as const;

// =====================
// BUTTONS — radius 10, color inversion on hover, scale on press
// =====================
function PrimaryBtn({
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
        "border border-transparent bg-[var(--invert-bg)] text-[var(--invert-fg)]",
        "transition-all duration-200 active:scale-[0.96]",
        "hover:bg-transparent hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]",
      ].join(" ")}
    >
      {children}
      <ArrowUpRight size={16} />
    </a>
  );
}

function SecondaryBtn({
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

const SHELL = "mx-auto w-full max-w-[1440px] px-5 md:px-20";

// =====================
// HOME
// =====================
export function Home() {
  const [lang] = useLang("es");
  const c = copy[lang];

  return (
    <div className="pt-15">
      {/* ============ HERO ============ */}
      <section className={SHELL}>
        <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr] items-center gap-10 md:gap-16 py-12 md:py-20">
          {/* left */}
          <div className="order-1">
            <span className="inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13px] text-veta bg-veta/12">
              <span className="h-1.5 w-1.5 rounded-full bg-veta" />
              {c.hero.badge}
              <ArrowRight size={13} />
            </span>

            <h1 className="mt-6 font-franchise leading-[0.95] text-[var(--text-primary)] text-[56px] md:text-[104px]">
              {c.hero.title[0]}
              <br />
              {c.hero.title[1]}
            </h1>

            <p className="mt-6 max-w-[440px] text-[15px] md:text-[18px] font-light leading-relaxed text-[var(--text-secondary)]">
              {c.hero.lead}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <PrimaryBtn href="/cita" full>
                {c.hero.cta}
              </PrimaryBtn>
              <SecondaryBtn href="/proyectos" full>
                {c.hero.secondary}
              </SecondaryBtn>
            </div>
          </div>

          {/* right — main photo */}
          <div className="order-2">
            <StonePlaceholder
              className="h-[300px] md:h-[560px] rounded-2xl"
              label="BLANCO DALLAS"
              material="granito"
            >
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                {c.hero.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-[10px] px-3 py-1.5 text-[12px] text-white backdrop-blur-md"
                    style={{ background: "rgba(10,10,10,0.75)" }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </StonePlaceholder>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="border-y border-[var(--border-default)]">
        <div className={SHELL}>
          <div className="grid grid-cols-3">
            {c.stats.map((s, i) => (
              <div
                key={s.label}
                className={[
                  "py-8 md:py-12 px-2 md:px-4",
                  i > 0 ? "border-l border-[var(--border-default)] pl-4 md:pl-10" : "",
                ].join(" ")}
              >
                <div
                  className="font-franchise text-[32px] md:text-[56px] leading-none"
                  style={{ color: s.accent ? "#9BA8B0" : "var(--text-primary)" }}
                >
                  {s.n}
                </div>
                <div className="mt-2 text-[10px] md:text-[12px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROJECTS (teaser) ============ */}
      <section className={`${SHELL} py-14 md:py-24`}>
        {/* mobile header */}
        <div className="flex items-end justify-between md:hidden mb-5">
          <h2 className="font-franchise text-[32px] leading-none text-[var(--text-primary)]">
            {c.projects.heading.join(" ")}
          </h2>
          <a
            href="/proyectos"
            className="inline-flex items-center gap-1 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {lang === "es" ? "Ver todos" : "See all"} <ArrowRight size={13} />
          </a>
        </div>

        {/* mobile: horizontal carousel */}
        <div className="md:hidden -mx-5 px-5 flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">
          {c.projects.items.map((p) => (
            <StonePlaceholder
              key={p.name}
              className="snap-start shrink-0 w-[240px] h-[220px] rounded-[14px]"
            >
              <span className="absolute bottom-3 left-3 z-10 rounded-[10px] bg-black/70 px-2.5 py-1.5 text-[12px] text-white backdrop-blur-md">
                {p.name}
              </span>
            </StonePlaceholder>
          ))}
        </div>

        {/* desktop: 3 equal columns */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {/* card */}
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-8 flex flex-col">
            <h2 className="font-franchise text-[44px] leading-[0.95] text-[var(--text-primary)]">
              {c.projects.heading[0]}
              <br />
              {c.projects.heading[1]}
            </h2>
            <p className="mt-auto pt-8 text-[15px] text-[var(--text-secondary)]">
              {c.projects.body}
            </p>
            <div className="mt-5">
              <SecondaryBtn href="/proyectos">
                {c.projects.cta} <ArrowRight size={15} />
              </SecondaryBtn>
            </div>
            <p className="mt-3 text-[12px] text-[var(--text-muted)]">{c.projects.url}</p>
          </div>

          {/* two photos */}
          {c.projects.items.map((p) => (
            <StonePlaceholder
              key={p.name}
              className="h-[340px] rounded-2xl"
              label={p.name.toUpperCase()}
              material={p.material.toLowerCase()}
            >
              <span className="absolute bottom-3 left-3 z-10 rounded-[10px] bg-black/70 px-3 py-1.5 text-[13px] text-white backdrop-blur-md">
                {p.name} · {p.material}
              </span>
            </StonePlaceholder>
          ))}
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section id="proceso" className={`${SHELL} py-8 md:py-16 scroll-mt-20`}>
        <h2 className="font-franchise text-[32px] md:text-[48px] leading-none text-[var(--text-primary)] mb-8 md:mb-12">
          {c.process.heading}
        </h2>

        <div className="border-t border-[var(--border-default)]">
          {c.process.steps.map((step) => (
            <div
              key={step.n}
              className="grid grid-cols-[36px_1fr] md:grid-cols-[120px_320px_1fr] gap-x-4 md:gap-x-0 border-b border-[var(--border-default)] py-6 md:py-8"
            >
              <div className="font-franchise text-[20px] md:text-[24px] leading-none text-veta-dark">
                {step.n}
              </div>
              <div className="md:contents">
                <h3 className="text-[18px] md:text-[22px] font-semibold text-[var(--text-primary)] mb-1.5 md:mb-0">
                  {step.title}
                </h3>
                <p className="text-[13px] md:text-[16px] font-light leading-relaxed text-[var(--text-secondary)]">
                  {step.desc}
                  {step.hl && (
                    <span className="font-medium text-[var(--text-primary)]">{step.hl}</span>
                  )}
                  {step.descAfter}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[15px] md:text-[16px] text-veta">{c.process.closing}</p>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className={`${SHELL} pb-16 md:pb-24`}>
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-6 py-12 md:px-8 md:py-20 text-center">
          <h2 className="font-franchise text-[40px] md:text-[72px] leading-[0.95] text-[var(--text-primary)]">
            {c.finalCta.title.split(" ").length > 1 ? (
              <>
                {c.finalCta.title.split(" ").slice(0, -1).join(" ")}
                <br className="md:hidden" />{" "}
                {c.finalCta.title.split(" ").slice(-1)}
              </>
            ) : (
              c.finalCta.title
            )}
          </h2>
          <p className="mx-auto mt-4 max-w-[440px] text-[15px] md:text-[16px] text-[var(--text-secondary)]">
            {c.finalCta.sub}
          </p>
          <div className="mt-7 flex justify-center">
            <PrimaryBtn href="/cita">{c.finalCta.cta}</PrimaryBtn>
          </div>
          <p className="mt-8 text-[13px] text-[var(--text-muted)]">
            {c.finalCta.note}
            <a href="/cita" className="text-[var(--text-secondary)] underline underline-offset-2">
              {c.finalCta.noteUrl}
            </a>
          </p>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer id="contacto" className="border-t border-[var(--border-default)]">
        <div
          className={`${SHELL} py-8 md:py-6 pb-32 md:pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4`}
        >
          <a
            href="/"
            className="font-franchise text-[20px] leading-none tracking-wide text-[var(--text-primary)]"
          >
            vaneco
          </a>
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-[13px] text-[var(--text-muted)]">
            <a
              href="mailto:contacto@piedrasvaneco.com"
              className="hover:text-[var(--text-secondary)] transition-colors"
            >
              contacto@piedrasvaneco.com
            </a>
            <a
              href="tel:+526648081307"
              className="hover:text-[var(--text-secondary)] transition-colors"
            >
              (664) 808 1307
            </a>
            <span>Tijuana, B.C.</span>
          </div>
          <div className="text-[13px] text-[var(--text-muted)]">{c.footer.rights}</div>
        </div>
      </footer>
    </div>
  );
}
