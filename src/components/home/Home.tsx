import { ArrowRight } from "lucide-react";
import { useLang } from "../../lib/useLang";
import { StonePlaceholder } from "./StonePlaceholder";
import { PrimaryBtn, SecondaryBtn } from "../ui/Button";
import { Footer } from "../ui/Footer";
import type { Proyecto } from "../../data/projects";

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
      chips: ["Taj Mahal", "Cuarcita"],
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
      url: "piedrasvaneco.com/proyectos",
      items: [
        { name: "Cocina Chapultepec", material: "Granito" },
        { name: "Isla Hipódromo", material: "Cuarzo" },
      ],
    },
    process: {
      heading: "COMO LO HACEMOS",
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
      noteUrl: "piedrasvaneco.com/cita",
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
      chips: ["Taj Mahal", "Quartzite"],
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
      url: "piedrasvaneco.com/projects",
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
      noteUrl: "piedrasvaneco.com/cita",
    },
    footer: {
      tagline: "Natural stone countertops · Tijuana, B.C.",
      rights: "© 2026 Vaneco · piedrasvaneco.com",
    },
  },
} as const;

const SHELL = "mx-auto w-full max-w-[1440px] px-5 md:px-20";

// =====================
// HOME
// =====================
export function Home({ featured = [] }: { featured?: Proyecto[] }) {
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

            <p className="mt-6 max-w-[440px] text-[15px] md:text-[18px] font-normal leading-relaxed text-[var(--text-primary)]/80">
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
            <div className="relative h-[300px] md:h-[560px] rounded-2xl overflow-hidden ring-1 ring-inset ring-white/5">
              <img
                src="/images/taj-mahal.jpg"
                alt="Cubierta de cuarcita Taj Mahal instalada por Vaneco"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
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
            </div>
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

      {/* ============ FEATURED PROJECTS (carousel) ============ */}
      <section className={`${SHELL} py-14 md:py-24`}>
        <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-5 px-5 md:mx-0 md:px-0">
          {/* intro card */}
          <div className="snap-start shrink-0 w-[280px] md:w-[360px] rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-7 md:p-8 flex flex-col">
            <h2 className="font-franchise text-[36px] md:text-[44px] leading-[0.95] text-[var(--text-primary)]">
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

          {/* featured project cards (from the backend) */}
          {featured.map((p) => {
            const caption = [p.title, p.material].filter(Boolean).join(" · ");
            return (
              <a
                key={p.id}
                href={`/proyectos/${p.id}`}
                className="group snap-start shrink-0 relative w-[280px] md:w-[380px] h-[300px] md:h-[400px] rounded-2xl overflow-hidden border border-[var(--border-default)]"
              >
                {p.img ? (
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <StonePlaceholder className="h-full w-full" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 z-10 rounded-[10px] bg-black/70 px-3 py-1.5 text-[13px] text-white backdrop-blur-md">
                  {caption}
                </span>
              </a>
            );
          })}
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
      <Footer />
    </div>
  );
}
