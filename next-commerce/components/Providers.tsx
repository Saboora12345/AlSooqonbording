'use client';
import type { ReactNode } from 'react';
import { LangProvider } from './LangProvider';
import { CartProvider } from './Cart';
import type { Lang } from '@/lib/types';

/** Client providers in one place so the server layout stays thin. */
export function Providers({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangProvider initial={lang}><CartProvider>{children}</CartProvider></LangProvider>;
}
