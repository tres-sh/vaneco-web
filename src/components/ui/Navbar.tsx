import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLang, type Lang } from "../../lib/useLang";
import { useTheme } from "../../lib/useTheme";
import { LangToggle, ThemeButton } from "./Controls";

interface NavbarProps {
  currentPath?: string;
}

// =====================
// TRANSLATIONS
// =====================
const t = {
  es: {
    nav: {
      home: "Inicio",
      projects: "Proyectos",
      materials: "Materiales",
      about: "Nosotros",
      faq: "FAQ",
    },
    cta: "Agendar visita",
  },
  en: {
    nav: {
      home: "Home",
      projects: "Projects",
      materials: "Materials",
      about: "About",
      faq: "FAQ",
    },
    cta: "Book a visit",
  },
} as const;

const navLinks = [
  { key: "home", href: "/" },
  { key: "projects", href: "/proyectos" },
  { key: "materials", href: "/materiales" },
  { key: "about", href: "/nosotros" },
  { key: "faq", href: "/faq" },
] as const;

// =====================
// DESKTOP NAVBAR (hidden < md)
// =====================
export function Navbar({ currentPath = "/" }: NavbarProps) {
  const [lang, setLang] = useLang("es");
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tx = t[lang];

  return (
    <header
      className={[
        "hidden md:flex fixed top-0 left-0 right-0 z-50 h-15",
        "items-center justify-between px-8 lg:px-20",
        "border-b transition-colors duration-300",
        scrolled
          ? "bg-[var(--bg-base)]/85 backdrop-blur-md border-[var(--border-default)]"
          : "bg-[var(--bg-base)] border-[var(--border-default)]",
      ].join(" ")}
    >
      {/* LOGO — single color, Franchise */}
      <a
        href="/"
        className="font-franchise text-[28px] leading-none tracking-wide text-[var(--text-primary)] flex-shrink-0"
      >
        vaneco
      </a>

      {/* CENTER LINKS */}
      <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8">
        {navLinks.map(({ key, href }) => {
          const isActive = currentPath === href || (href === "/" && currentPath === "/");
          return (
            <a
              key={key}
              href={href}
              className={[
                "relative text-[14px] tracking-wide py-1 transition-colors duration-200",
                "after:absolute after:-bottom-0.5 after:left-0 after:right-0 after:h-0.5",
                "after:bg-veta after:transition-transform after:duration-200 after:origin-left",
                isActive
                  ? "text-[var(--text-primary)] after:scale-x-100"
                  : "text-[var(--text-muted)] after:scale-x-0 hover:text-[var(--text-primary)] hover:after:scale-x-100",
              ].join(" ")}
            >
              {tx.nav[key as keyof typeof tx.nav]}
            </a>
          );
        })}
      </nav>

      {/* RIGHT — lang · theme · CTA */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <LangToggle lang={lang} onChange={(l: Lang) => setLang(l)} />
        <ThemeButton theme={theme} onToggle={toggle} />
        <a
          href="/cita"
          className={[
            "inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px]",
            "text-[13px] font-medium tracking-wide",
            "bg-[var(--invert-bg)] text-[var(--invert-fg)]",
            "transition-transform duration-200 hover:-translate-y-px active:scale-[0.96]",
          ].join(" ")}
        >
          {tx.cta}
          <ArrowUpRight size={14} />
        </a>
      </div>
    </header>
  );
}

// =====================
// MOBILE TOP BAR (hidden >= md)
// Logo + compact lang toggle + theme button. Navigation lives in the
// FloatingBottomNav, so no links / CTA here.
// =====================
export function MobileTopBar() {
  const [lang, setLang] = useLang("es");
  const { theme, toggle } = useTheme();

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-15 flex items-center justify-between px-5 bg-[var(--bg-base)] border-b border-[var(--border-default)]">
      <a
        href="/"
        className="font-franchise text-[24px] leading-none tracking-wide text-[var(--text-primary)]"
      >
        vaneco
      </a>
      <div className="flex items-center gap-2">
        <LangToggle lang={lang} onChange={(l: Lang) => setLang(l)} size="sm" />
        <ThemeButton theme={theme} onToggle={toggle} size="sm" />
      </div>
    </header>
  );
}
