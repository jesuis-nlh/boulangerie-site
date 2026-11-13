"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { bakery } from "@/config/bakery";
import { getProduct, type Product } from "@/data/products";

export type CartLine = { slug: string; qty: number };
type Line = CartLine & { product: Product; totalCents: number };

type CartCtx = {
  lines: Line[];
  count: number;
  totalCents: number;
  /** Délai le plus long imposé par un article du panier (heures). */
  leadHours: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  /** Incrémenté à chaque ajout, pour animer le compteur. */
  pulse: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "trame-panier-v1";
const MAX = bakery.ordering.maxQuantityPerLine;

const clamp = (n: number) => Math.max(0, Math.min(MAX, Math.round(n)));

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]") as CartLine[];
      if (Array.isArray(saved)) setRaw(saved.filter((l) => getProduct(l.slug)?.orderable && l.qty > 0).map((l) => ({ ...l, qty: clamp(l.qty) })));
    } catch {
      /* stockage indisponible : panier en mémoire seulement */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(raw));
    } catch {
      /* ignore */
    }
  }, [raw, hydrated]);

  const add = useCallback((slug: string, qty = 1) => {
    const p = getProduct(slug);
    if (!p?.orderable) return;
    setRaw((prev) => {
      const found = prev.find((l) => l.slug === slug);
      if (found) return prev.map((l) => (l.slug === slug ? { ...l, qty: clamp(l.qty + qty) } : l));
      return [...prev, { slug, qty: clamp(qty) }];
    });
    setPulse((n) => n + 1);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setRaw((prev) => prev.map((l) => (l.slug === slug ? { ...l, qty: clamp(qty) } : l)).filter((l) => l.qty > 0));
  }, []);

  const remove = useCallback((slug: string) => setRaw((prev) => prev.filter((l) => l.slug !== slug)), []);
  const clear = useCallback(() => setRaw([]), []);

  const value = useMemo<CartCtx>(() => {
    const lines = raw
      .map((l) => {
        const product = getProduct(l.slug);
        return product ? { ...l, product, totalCents: product.priceCents * l.qty } : null;
      })
      .filter(Boolean) as Line[];
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      totalCents: lines.reduce((n, l) => n + l.totalCents, 0),
      leadHours: lines.reduce((n, l) => Math.max(n, l.product.leadTimeHours ?? 0), 0),
      add,
      setQty,
      remove,
      clear,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      pulse,
    };
  }, [raw, add, setQty, remove, clear, isOpen, pulse]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart doit être utilisé dans <CartProvider>");
  return c;
}
