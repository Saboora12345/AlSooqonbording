'use client';
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '@/lib/types';

interface Line { product: Product; qty: number; }
interface CartCtx { lines: Line[]; count: number; total: number; add: (p: Product) => void; remove: (id: string) => void; }
const Ctx = createContext<CartCtx>({ lines: [], count: 0, total: 0, add: () => {}, remove: () => {} });
export const useCart = () => useContext(Ctx);

/** In-memory cart. Swap for the provider's cart (e.g. Shopify cartCreate) behind the same four members. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const value = useMemo<CartCtx>(() => ({
    lines,
    count: lines.reduce((s, l) => s + l.qty, 0),
    total: lines.reduce((s, l) => s + l.qty * l.product.price, 0),
    add: (p) => setLines((ls) => ls.some((l) => l.product.id === p.id) ? ls.map((l) => l.product.id === p.id ? { ...l, qty: l.qty + 1 } : l) : [...ls, { product: p, qty: 1 }]),
    remove: (id) => setLines((ls) => ls.filter((l) => l.product.id !== id)),
  }), [lines]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
