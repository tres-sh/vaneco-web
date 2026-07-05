import { useEffect, useState } from "react";

export type Lang = "es" | "en";

const STORAGE_KEY = "vaneco-lang";
const EVENT = "vaneco:lang-change";

/**
 * Shared language state for React islands.
 * - Reads the persisted choice from localStorage on mount.
 * - Listens for `vaneco:lang-change` events dispatched by any island.
 * - `setLang` persists the choice and broadcasts it to the other islands.
 */
export function useLang(initial: Lang = "es") {
  const [lang, setLangState] = useState<Lang>(initial);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === "es" || stored === "en") setLangState(stored);

    const onLang = (e: Event) => {
      const next = (e as CustomEvent).detail?.lang as Lang | undefined;
      if (next === "es" || next === "en") setLangState(next);
    };
    window.addEventListener(EVENT, onLang);
    return () => window.removeEventListener(EVENT, onLang);
  }, []);

  function setLang(next: Lang) {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { lang: next } }));
  }

  return [lang, setLang] as const;
}
