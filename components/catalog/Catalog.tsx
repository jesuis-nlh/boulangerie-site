"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { categories, products, type CategoryId } from "@/data/products";
import { ProductTile } from "./ProductTile";
import styles from "./Catalog.module.css";

type Filter = CategoryId | "tout";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function Catalog() {
  const [filter, setFilter] = useState<Filter>("tout");
  const [q, setQ] = useState("");
  const reduce = useReducedMotion();

  // Lien profond : /produits/?rayon=pains
  useEffect(() => {
    const r = new URLSearchParams(location.search).get("rayon");
    if (r && categories.some((c) => c.id === r)) setFilter(r as CategoryId);
  }, []);

  const choose = (f: Filter) => {
    setFilter(f);
    const url = new URL(location.href);
    if (f === "tout") url.searchParams.delete("rayon");
    else url.searchParams.set("rayon", f);
    history.replaceState(null, "", url);
  };

  const list = useMemo(() => {
    const nq = norm(q.trim());
    return products.filter((p) => (filter === "tout" || p.category === filter) && (!nq || norm(`${p.name} ${p.short} ${p.description}`).includes(nq)));
  }, [filter, q]);

  const counts = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, products.filter((p) => p.category === c.id).length])), []);
  const current = categories.find((c) => c.id === filter);

  return (
    <div className={styles.root}>
      <div className={styles.bar}>
        <div className={styles.chips} role="group" aria-label="Filtrer par rayon">
          <button type="button" className="chip" aria-pressed={filter === "tout"} onClick={() => choose("tout")}>
            Tout <span className="count">{products.length}</span>
          </button>
          {categories.map((c) => (
            <button key={c.id} type="button" className="chip" aria-pressed={filter === c.id} onClick={() => choose(c.id)}>
              {c.label} <span className="count">{counts[c.id]}</span>
            </button>
          ))}
        </div>
        <div className={styles.search}>
          <label htmlFor="q" className="sr-only">
            Rechercher un produit
          </label>
          <Icon name="search" size={18} />
          <input id="q" type="search" className={styles.input} placeholder="Rechercher : levain, praline…" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
        </div>
      </div>

      <h2 className="sr-only">Liste des produits</h2>
      <p className={styles.status} role="status" aria-live="polite">
        {current ? <strong>{current.label}</strong> : <strong>Toute la vitrine</strong>}
        {current && <span> — {current.blurb}</span>}
        <span className="mono"> · {list.length} produit{list.length > 1 ? "s" : ""}</span>
      </p>

      {list.length === 0 ? (
        <div className={styles.empty}>
          <p className="h3">Rien ne correspond à « {q} ».</p>
          <button type="button" className="btn btn--ghost" onClick={() => { setQ(""); choose("tout"); }}>
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <motion.ul className={styles.grid} layout={!reduce}>
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p) => (
              <motion.li
                key={p.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductTile p={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
