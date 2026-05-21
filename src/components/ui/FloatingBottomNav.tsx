import { useState, useEffect } from "react";
import { Home, LayoutGrid, Calendar, Info, Settings } from "lucide-react";

// =====================
// TYPES
// =====================
type Lang = "es" | "en";

type NavItem = {
  key: string;
  href: string;
  icon: React.ReactNode;
  labelEs: string;
  labelEn: string;
};

interface FloatingBottomNavProps {
  currentPath?: string;
}

// =====================
// NAV ITEMS
// =====================
const navItems: NavItem[] = [
  {
    key: "home",
    href: "/",
    icon: <Home size={18} strokeWidth={1.5} />,
    labelEs: "Inicio",
    labelEn: "Home",
  },
  {
    key: "work",
    href: "/work",
    icon: <LayoutGrid size={18} strokeWidth={1.5} />,
    labelEs: "Trabajos",
    labelEn: "Work",
  },
  {
    key: "about",
    href: "/about",
    icon: <Info size={18} strokeWidth={1.5} />,
    labelEs: "Nosotros",
    labelEn: "About",
  },
  {
    key: "settings",
    href: "#settings",
    icon: <Settings size={18} strokeWidth={1.5} />,
    labelEs: "Más",
    labelEn: "More",
  },
];

// =====================
// COMPONENT
// =====================
export function FloatingBottomNav({
  currentPath = "/",
}: FloatingBottomNavProps) {
  const [lang, setLang] = useState<Lang>("es");
  const [active, setActive] = useState<string>("home");

  // Read stored lang
  useEffect(() => {
    const stored = localStorage.getItem("vaneco-lang") as Lang | null;
    if (stored === "en" || stored === "es") setLang(stored);

    // Listen for lang changes from Navbar
    const onLang = (e: Event) => {
      const { lang: l } = (e as CustomEvent).detail;
      setLang(l);
    };
    window.addEventListener("vaneco:lang-change", onLang);
    return () => window.removeEventListener("vaneco:lang-change", onLang);
  }, []);

  // Set active based on current path
  useEffect(() => {
    if (currentPath === "/") setActive("home");
    else if (currentPath.startsWith("/work")) setActive("work");
    else if (currentPath.startsWith("/about")) setActive("about");
  }, [currentPath]);

  function handleClick(item: NavItem) {
    if (item.key === "settings") return; // handled separately
    setActive(item.key);
  }

  return (
    // Only visible on mobile — hidden on md+
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 md:hidden px-4">
      <nav
        role="navigation"
        aria-label="Mobile navigation"
        className={[
          "flex items-center gap-1",
          "px-1.5 py-1.5",
          "rounded-[18px]",
          "border border-[var(--border-default)]",
          "bg-black/88 backdrop-blur-xl",
          "shadow-float",
        ].join(" ")}
      >
        {/* Regular nav items */}
        {navItems.slice(0, 3).map((item) => {
          const isActive = active === item.key;
          const label = lang === "es" ? item.labelEs : item.labelEn;

          return (
            <a
              key={item.key}
              href={item.href}
              onClick={() => handleClick(item)}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className={[
                "flex items-center rounded-[12px] cursor-pointer",
                "transition-all duration-300",
                "overflow-hidden",
                isActive
                  ? "bg-[#F5F5F5] px-3 py-2 gap-1.5"
                  : "p-2 hover:bg-veta/8",
              ].join(" ")}
              style={{
                transitionTimingFunction: "cubic-bezier(0.34, 1.2, 0.64, 1)",
              }}
            >
              {/* Icon */}
              <span
                className={[
                  "flex-shrink-0 transition-colors duration-200",
                  isActive ? "text-black" : "text-[#4A4A4A]",
                ].join(" ")}
              >
                {item.icon}
              </span>

              {/* Label — only visible when active */}
              <span
                className={[
                  "text-[12px] font-medium text-black whitespace-nowrap",
                  "transition-all duration-300 overflow-hidden",
                  isActive
                    ? "max-w-[80px] opacity-100 ml-0"
                    : "max-w-0 opacity-0",
                ].join(" ")}
                style={{
                  transitionTimingFunction: "cubic-bezier(0.34, 1.2, 0.64, 1)",
                }}
                aria-hidden={!isActive}
              >
                {label}
              </span>
            </a>
          );
        })}

        {/* Book CTA — always expanded with Veta accent */}
        <a
          href="/book"
          aria-label={lang === "es" ? "Agendar cita" : "Book a visit"}
          className={[
            "flex items-center gap-1.5 px-3 py-2 rounded-[12px]",
            "bg-veta/15 border border-veta/25",
            "transition-all duration-200",
            "hover:bg-veta/25",
          ].join(" ")}
        >
          <span className="text-veta flex-shrink-0">
            <Calendar size={18} strokeWidth={1.5} />
          </span>
          <span className="text-[12px] font-medium text-veta whitespace-nowrap">
            {lang === "es" ? "Cita" : "Book"}
          </span>
        </a>

        {/* Settings */}
        <button
          onClick={() => handleClick(navItems[3])}
          aria-label={lang === "es" ? "Más opciones" : "More options"}
          className={[
            "flex items-center rounded-[12px] cursor-pointer p-2",
            "transition-all duration-200",
            "text-[#4A4A4A] hover:bg-veta/8 hover:text-veta",
          ].join(" ")}
        >
          <Settings size={18} strokeWidth={1.5} />
        </button>
      </nav>
    </div>
  );
}
