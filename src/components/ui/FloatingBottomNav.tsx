import { useState, useEffect } from "react";
import { Home, Image, CalendarDays, MessageCircle, Settings } from "lucide-react";
import { useLang } from "../../lib/useLang";

type Item = {
  key: string;
  href: string;
  icon: React.ReactNode;
  labelEs: string;
  labelEn: string;
};

interface FloatingBottomNavProps {
  currentPath?: string;
}

// Regular (non-CTA) items, in display order around the Agendar button.
const leftItems: Item[] = [
  {
    key: "home",
    href: "/",
    icon: <Home size={18} strokeWidth={2} />,
    labelEs: "Inicio",
    labelEn: "Home",
  },
  {
    key: "gallery",
    href: "/proyectos",
    icon: <Image size={18} strokeWidth={2} />,
    labelEs: "Galería",
    labelEn: "Gallery",
  },
];

const rightItems: Item[] = [
  {
    key: "contact",
    href: "#contacto",
    icon: <MessageCircle size={18} strokeWidth={2} />,
    labelEs: "Contacto",
    labelEn: "Contact",
  },
  {
    key: "settings",
    href: "#ajustes",
    icon: <Settings size={18} strokeWidth={2} />,
    labelEs: "Ajustes",
    labelEn: "Settings",
  },
];

function pathToKey(path: string): string {
  if (path === "/") return "home";
  if (path.startsWith("/proyectos")) return "gallery";
  // Other routes (e.g. /cita) show no active pill — the Agendar button,
  // which is always highlighted, carries the context.
  return "";
}

export function FloatingBottomNav({ currentPath = "/" }: FloatingBottomNavProps) {
  const [lang] = useLang("es");
  const [active, setActive] = useState<string>(() => pathToKey(currentPath));

  useEffect(() => {
    setActive(pathToKey(currentPath));
  }, [currentPath]);

  const bounce = "cubic-bezier(0.34, 1.2, 0.64, 1)";

  const renderItem = (item: Item) => {
    const isActive = active === item.key;
    const label = lang === "es" ? item.labelEs : item.labelEn;
    return (
      <a
        key={item.key}
        href={item.href}
        onClick={() => setActive(item.key)}
        aria-label={label}
        aria-current={isActive ? "page" : undefined}
        className={[
          "flex items-center rounded-[14px] cursor-pointer overflow-hidden",
          "transition-all duration-300",
          isActive ? "bg-[#2E2E2E] px-3.5 py-2.5 gap-1.5" : "p-2.5 hover:bg-white/5",
        ].join(" ")}
        style={{ transitionTimingFunction: bounce }}
      >
        <span
          className={[
            "flex-shrink-0 transition-colors duration-200",
            isActive ? "text-white" : "text-[#9B9B9B]",
          ].join(" ")}
        >
          {item.icon}
        </span>
        <span
          className={[
            "text-[13px] font-medium text-white whitespace-nowrap",
            "transition-all duration-300 overflow-hidden",
            isActive ? "max-w-[90px] opacity-100" : "max-w-0 opacity-0",
          ].join(" ")}
          style={{ transitionTimingFunction: bounce }}
          aria-hidden={!isActive}
        >
          {label}
        </span>
      </a>
    );
  };

  return (
    // Mobile only — hidden on md+
    <div className="md:hidden fixed bottom-5 left-0 right-0 flex justify-center z-50 px-4 pointer-events-none">
      <nav
        role="navigation"
        aria-label={lang === "es" ? "Navegación" : "Navigation"}
        className={[
          "pointer-events-auto flex items-center gap-1",
          "px-2 py-2 rounded-[18px]",
          "border border-[#2E2E2E]",
          "bg-[rgba(20,20,20,0.85)] backdrop-blur-[16px]",
          "shadow-float",
        ].join(" ")}
      >
        {leftItems.map(renderItem)}

        {/* Agendar — always highlighted, never competes with active */}
        <a
          href="/cita"
          aria-label={lang === "es" ? "Agendar visita" : "Book a visit"}
          className={[
            "flex items-center justify-center rounded-[14px] p-2.5",
            "bg-veta/12 transition-colors duration-200 hover:bg-veta/20",
          ].join(" ")}
        >
          <span className="text-veta flex-shrink-0">
            <CalendarDays size={18} strokeWidth={2} />
          </span>
        </a>

        {rightItems.map(renderItem)}
      </nav>
    </div>
  );
}
