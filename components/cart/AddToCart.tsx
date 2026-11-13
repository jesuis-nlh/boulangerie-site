"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCart } from "@/lib/cart";
import { Icon } from "@/components/Icon";
import type { Product } from "@/data/products";
import { QtyStepper } from "./QtyStepper";

/** Bouton d'ajout avec confirmation animée ; `withQty` affiche un sélecteur. */
export function AddToCart({ product, withQty = false, variant = "", openOnAdd = false }: { product: Product; withQty?: boolean; variant?: string; openOnAdd?: boolean }) {
  const cart = useCart();
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();

  if (!product.orderable) {
    return <p className="mono" style={{ fontSize: ".8rem", color: "var(--ink-3)", margin: 0 }}>En boutique uniquement</p>;
  }

  const add = () => {
    cart.add(product.slug, withQty ? qty : 1);
    setDone(true);
    setTimeout(() => setDone(false), 1600);
    if (openOnAdd) cart.open();
  };

  return (
    <div style={{ display: "flex", gap: ".6rem", alignItems: "center", flexWrap: "wrap" }}>
      {withQty && <QtyStepper value={qty} onChange={setQty} label={product.name} min={1} />}
      <button type="button" className={`btn ${variant}`} onClick={add} aria-label={`Ajouter ${withQty ? qty + " × " : ""}${product.name} au panier`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={done ? "ok" : "add"}
            initial={reduce ? false : { y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? undefined : { y: -14, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ display: "inline-flex", alignItems: "center", gap: ".55em" }}
          >
            {done ? (
              <>
                <Icon name="check" /> Ajouté
              </>
            ) : (
              <>
                <Icon name="plus" /> Ajouter
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </button>
      <span className="sr-only" aria-live="polite">{done ? `${product.name} ajouté au panier` : ""}</span>
    </div>
  );
}
