import { useState, useEffect, useRef } from "react";
import { Settings, Calendar, ArrowUpRight, Mail } from "lucide-react";

// =====================
// TYPES
// =====================
type Lang = "es" | "en";
type Theme = "light" | "dark";

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
      work: "Trabajos",
      process: "Proceso",
      about: "Nosotros",
    },
    cta: "Agenda tu cita",
    settings: {
      label: "Preferencias",
      language: "Idioma",
      theme: "Tema",
      light: "Claro",
      dark: "Oscuro",
      whatsapp: "WhatsApp",
      email: "Correo",
    },
  },
  en: {
    nav: {
      home: "Home",
      work: "Our Work",
      process: "Process",
      about: "About",
    },
    cta: "Book a visit",
    settings: {
      label: "Preferences",
      language: "Language",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      whatsapp: "WhatsApp",
      email: "Email",
    },
  },
} as const;

// =====================
// NAV LINKS
// =====================
const navLinks = [
  { key: "home", href: "/" },
  { key: "work", href: "/work" },
  { key: "process", href: "/#process" },
  { key: "about", href: "/about" },
] as const;

// =====================
// NAVBAR
// =====================
export function Navbar({ currentPath = "/" }: NavbarProps) {
  const [lang, setLang] = useState<Lang>("es");
  const [theme, setTheme] = useState<Theme>("light");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Read initial theme from html class
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  // Read stored lang
  useEffect(() => {
    const stored = localStorage.getItem("vaneco-lang") as Lang | null;
    if (stored === "en" || stored === "es") setLang(stored);
  }, []);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target as Node)
      ) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function handleTheme(next: Theme) {
    setTheme(next);
    window.dispatchEvent(
      new CustomEvent("vaneco:theme-change", { detail: { theme: next } })
    );
  }

  function handleLang(next: Lang) {
    setLang(next);
    localStorage.setItem("vaneco-lang", next);
    // Dispatch for other components to react
    window.dispatchEvent(
      new CustomEvent("vaneco:lang-change", { detail: { lang: next } })
    );
  }

  const tx = t[lang];

  return (
    <header
      className={[
        "hidden fixed top-0 left-0 right-0 z-50 h-15",
        "md:flex items-center justify-between",
        "px-8 transition-all duration-300",
        scrolled
          ? "bg-black/85 backdrop-blur-md border-b border-gray-800"
          : "bg-transparent border-b border-gray-900",
      ].join(" ")}
    >
      {/* LOGO */}
      <a
        href="/"
        className="font-franchise text-xl tracking-wide text-[var(--text-primary)] hover:text-veta transition-colors duration-200 flex-shrink-0"
      >
        vaneco
      </a>

      {/* CENTER LINKS */}
      <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8">
        {navLinks.map(({ key, href }) => {
          const isActive = currentPath === href;
          return (
            <a
              key={key}
              href={href}
              className={[
                "relative text-[13px] tracking-wide py-1",
                "transition-colors duration-200",
                "after:absolute after:-bottom-0.5 after:left-0 after:right-0",
                "after:h-px after:bg-veta after:transition-transform after:duration-200",
                isActive
                  ? "text-(--text-primary) after:scale-x-100"
                  : "text-(--text-muted) after:scale-x-0 hover:text-(--text-primary) hover:after:scale-x-100",
              ].join(" ")}
            >
              {tx.nav[key as keyof typeof tx.nav]}
            </a>
          );
        })}
      </nav>

      {/* RIGHT — Settings + CTA */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* CTA */}
        <a
          href="/book"
          className={[
            "inline-flex items-center gap-1.5",
            "px-4 py-2 rounded-[10px]",
            "text-[12px] font-medium tracking-wide",
            "bg-[var(--text-primary)] text-[var(--bg-base)]",
            "hover:opacity-90 hover:-translate-y-px",
            "transition-all duration-200",
          ].join(" ")}
        >
          {tx.cta}
          <ArrowUpRight size={13} />
        </a>

        {/* SETTINGS */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setSettingsOpen((o) => !o)}
            aria-label="Settings"
            aria-expanded={settingsOpen}
            className={[
              "w-9 h-9 flex items-center justify-center",
              "rounded-[10px] border transition-all duration-200",
              settingsOpen
                ? "border-veta text-veta bg-veta/8"
                : "border-gray-800 text-[var(--text-muted)] hover:border-veta hover:text-veta",
            ].join(" ")}
          >
            <Settings size={15} />
          </button>

          {/* DROPDOWN */}
          {settingsOpen && (
            <div
              className={[
                "absolute top-[calc(100%+10px)] right-0 w-52",
                "rounded-xl border border-[var(--border-default)]",
                "bg-[var(--bg-surface)] shadow-float",
                "p-2 z-50",
                "animate-in fade-in-0 zoom-in-95 duration-150",
              ].join(" ")}
            >
              {/* Label */}
              <p className="section-label px-2 pb-2">{tx.settings.label}</p>

              {/* Language */}
              <div className="flex items-center justify-between px-2 py-2 rounded-lg">
                <span className="text-[13px] text-[var(--text-secondary)]">
                  {tx.settings.language}
                </span>
                <div className="flex bg-[var(--bg-elevated)] rounded-lg p-0.5 border border-[var(--border-default)] gap-0.5">
                  {(["es", "en"] as Lang[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => handleLang(l)}
                      className={[
                        "px-3 py-1 rounded-md text-[11px] font-medium transition-all duration-200",
                        lang === l
                          ? "bg-black text-white"
                          : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                      ].join(" ")}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div className="flex items-center justify-between px-2 py-2 rounded-lg">
                <span className="text-[13px] text-[var(--text-secondary)]">
                  {tx.settings.theme}
                </span>
                <div className="flex bg-[var(--bg-elevated)] rounded-lg p-0.5 border border-[var(--border-default)] gap-0.5">
                  {(["light", "dark"] as Theme[]).map((th) => (
                    <button
                      key={th}
                      onClick={() => handleTheme(th)}
                      className={[
                        "px-3 py-1 rounded-md text-[11px] font-medium transition-all duration-200",
                        theme === th
                          ? "bg-black text-white"
                          : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                      ].join(" ")}
                    >
                      {th === "light" ? tx.settings.light : tx.settings.dark}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="my-1.5 border-t border-[var(--border-default)]" />

              {/* WhatsApp */}
              <a
                href="https://wa.me/526640000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors duration-150 group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[var(--text-muted)] group-hover:text-veta transition-colors duration-150 text-[14px]">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </span>
                  <span className="text-[13px] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors duration-150">
                    {tx.settings.whatsapp}
                  </span>
                </div>
                <ArrowUpRight
                  size={13}
                  className="text-[var(--text-muted)] group-hover:text-veta transition-colors duration-150"
                />
              </a>

              {/* Email */}
              <a
                href="mailto:hola@pvane.co"
                className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors duration-150 group"
              >
                <div className="flex items-center gap-2">
                  <Mail
                    size={14}
                    className="text-[var(--text-muted)] group-hover:text-veta transition-colors duration-150"
                  />
                  <span className="text-[13px] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors duration-150">
                    hola@pvane.co
                  </span>
                </div>
                <ArrowUpRight
                  size={13}
                  className="text-[var(--text-muted)] group-hover:text-veta transition-colors duration-150"
                />
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
