'use client';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Lang } from '@/lib/types';

interface LangCtx { lang: Lang; setLang: (l: Lang) => void; t: (ar: string, en: string) => string; }
const Ctx = createContext<LangCtx>({ lang: 'ar', setLang: () => {}, t: (ar) => ar });
export const useLang = () => useContext(Ctx);

/** `initial` comes from the aq-lang cookie in the server layout, so SSR already has the right lang/dir (no flash). */
export function LangProvider({ initial, children }: { initial: Lang; children: ReactNode }) {
  const [lang, set] = useState<Lang>(initial);
  const setLang = useCallback((l: Lang) => {
    set(l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    document.cookie = `aq-lang=${l}; path=/; max-age=31536000; samesite=lax`;
  }, []);
  const value = useMemo(() => ({ lang, setLang, t: (ar: string, en: string) => (lang === 'ar' ? ar : en) }), [lang, setLang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
