import { useLang } from "../../lib/useLang";

const SHELL = "mx-auto w-full max-w-[1440px] px-5 md:px-20";

const t = {
  es: { rights: "© 2026 Vaneco · piedrasvaneco.com" },
  en: { rights: "© 2026 Vaneco · piedrasvaneco.com" },
} as const;

export function Footer() {
  const [lang] = useLang("es");
  return (
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
        <div className="text-[13px] text-[var(--text-muted)]">{t[lang].rights}</div>
      </div>
    </footer>
  );
}
