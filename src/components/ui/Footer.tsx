import { useLang } from "../../lib/useLang";
import { PrimaryBtn } from "./Button";

const copy = {
  es: {
    heading: ["TRABAJEMOS", "JUNTOS"],
    body: "Cubiertas de granito, cuarzo y mármol. Del taller a tu cocina, sin intermediarios. La visita para tomar medidas es gratis.",
    cta: "Agendar visita",
    site: "Sitio",
    siteLinks: [
      { label: "Proyectos", href: "/proyectos" },
      { label: "Materiales", href: "/materiales" },
      { label: "Nosotros", href: "/nosotros" },
      { label: "FAQ", href: "/faq" },
    ],
    contact: "Contacto",
    zone: "Tijuana · Rosarito · Tecate · Ensenada",
    rights: "© 2026 Piedras Vaneco",
    privacy: "Aviso de privacidad",
  },
  en: {
    heading: ["LET'S WORK", "TOGETHER"],
    body: "Granite, quartz and marble countertops. From the workshop to your kitchen, no middlemen. The measuring visit is free.",
    cta: "Book a visit",
    site: "Site",
    siteLinks: [
      { label: "Projects", href: "/proyectos" },
      { label: "Materials", href: "/materiales" },
      { label: "About", href: "/nosotros" },
      { label: "FAQ", href: "/faq" },
    ],
    contact: "Contact",
    zone: "Tijuana · Rosarito · Tecate · Ensenada",
    rights: "© 2026 Piedras Vaneco",
    privacy: "Privacy Notice",
  },
} as const;

const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com/piedrasvaneco" },
  { label: "WhatsApp", href: "https://wa.me/526643202318" },
  { label: "Facebook", href: "https://facebook.com/piedrasvaneco" },
];

const linkCls =
  "text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors";
const legalLinkCls = "hover:text-[var(--text-secondary)] transition-colors";

export function Footer() {
  const [lang] = useLang("es");
  const t = copy[lang];

  return (
    <footer id="contacto" className="border-t border-[var(--border-default)]">
      {/* ===== CTA + link columns ===== */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-[60px] px-6 md:px-20 pt-8 md:pt-16 pb-6 md:pb-11">
        <div className="flex flex-col gap-4 md:gap-5 md:max-w-[560px]">
          <h2 className="font-franchise text-[34px] md:text-[56px] leading-none uppercase text-[var(--text-primary)]">
            {t.heading[0]}
            <br />
            {t.heading[1]}
          </h2>
          <p className="text-[14px] md:text-[16px] font-light text-[var(--text-secondary)]">
            {t.body}
          </p>
          <PrimaryBtn href="/cita" className="w-full md:w-auto">
            {t.cta}
          </PrimaryBtn>
        </div>

        <div className="flex gap-10 md:gap-[72px]">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] md:text-[11px] uppercase tracking-[2px] text-[var(--text-muted)]">
              {t.site}
            </span>
            {t.siteLinks.map((l) => (
              <a key={l.href} href={l.href} className={linkCls}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[10px] md:text-[11px] uppercase tracking-[2px] text-[var(--text-muted)]">
              {t.contact}
            </span>
            <a href="tel:+526643202318" className={linkCls}>
              (664) 320 2318
            </a>
            <a href="mailto:contacto@piedrasvaneco.com" className={linkCls}>
              contacto@piedrasvaneco.com
            </a>
            <span className={linkCls}>{t.zone}</span>
          </div>
        </div>
      </div>

      {/* ===== Legal row ===== */}
      <div className="border-t border-[var(--border-default)] px-6 md:px-20 py-4 text-[12px] md:text-[13px] text-[var(--text-muted)]">
        {/* mobile: social row, then a combined rights · privacy line */}
        <div className="flex flex-col gap-3 md:hidden">
          <div className="flex items-center gap-[18px]">
            {SOCIAL.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={legalLinkCls}>
                {s.label}
              </a>
            ))}
          </div>
          <div>
            {t.rights} ·{" "}
            <a href="/privacidad" className={legalLinkCls}>
              {t.privacy}
            </a>
          </div>
        </div>

        {/* desktop: rights left, social + privacy right */}
        <div className="hidden md:flex md:items-center md:justify-between">
          <span>{t.rights}</span>
          <div className="flex items-center gap-6">
            {SOCIAL.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={legalLinkCls}>
                {s.label}
              </a>
            ))}
            <a href="/privacidad" className={legalLinkCls}>
              {t.privacy}
            </a>
          </div>
        </div>
      </div>

      {/* ===== Wordmark a sangre ===== */}
      <div className="h-[66px] md:h-[180px] overflow-hidden flex justify-center">
        <span
          className="font-franchise leading-none whitespace-nowrap select-none text-[104px] md:text-[305px] tracking-[1px] md:tracking-[6px]"
          style={{ color: "#9BA8B0" }}
        >
          VANECO
        </span>
      </div>
    </footer>
  );
}
