"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ProductArt } from "@/components/art/ProductArt";
import { Icon } from "@/components/Icon";
import { categories, products, type ArtId } from "@/data/products";
import { formatPrice } from "@/lib/format";
import styles from "./CategoryIndex.module.css";

const COVER: Record<string, ArtId> = {
  pains: "trame",
  viennoiseries: "croissant",
  patisseries: "eclair",
  gateaux: "entremets",
  dejeuner: "sandwich",
  boissons: "cafe",
};

/** Index typographique des rayons ; l'illustration suit le pointeur au survol. */
export function CategoryIndex() {
  const [hover, setHover] = useState<string | null>(null);
  const float = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent) => {
    if (!box.current || !float.current || e.pointerType !== "mouse") return;
    const r = box.current.getBoundingClientRect();
    float.current.style.transform = `translate3d(${e.clientX - r.left}px, ${e.clientY - r.top}px, 0)`;
  };

  return (
    <section className={`section ${styles.section}`} aria-labelledby="cat-title">
      <div className="wrap">
        <div className={styles.head}>
          <div>
            <p className="eyebrow">Nos produits</p>
            <h2 id="cat-title" className="h2" data-reveal>
              La vitrine, <em>rayon par rayon.</em>
            </h2>
          </div>
          <Link href="/produits/" className="link-arrow">
            Toute la vitrine <Icon name="arrow" />
          </Link>
        </div>

        <div ref={box} className={styles.box} onPointerMove={move} onPointerLeave={() => setHover(null)}>
          <ul className={styles.list}>
            {categories.map((c, i) => {
              const items = products.filter((p) => p.category === c.id);
              const from = Math.min(...items.map((p) => p.priceCents));
              return (
                <li key={c.id} data-reveal style={{ "--d": `${i * 0.05}s` } as React.CSSProperties}>
                  <Link href={`/produits/?rayon=${c.id}`} className={styles.row} onPointerEnter={() => setHover(c.id)} onFocus={() => setHover(c.id)} onBlur={() => setHover(null)}>
                    <span className={`mono ${styles.idx}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.thumb} aria-hidden="true">
                      <ProductArt id={COVER[c.id]} />
                    </span>
                    <span className={styles.name}>{c.label}</span>
                    <span className={styles.blurb}>{c.blurb}</span>
                    <span className={`mono ${styles.meta}`}>
                      {items.length} réf. · dès {formatPrice(from)}
                    </span>
                    <Icon name="arrow" className={styles.arrow} />
                  </Link>
                </li>
              );
            })}
          </ul>
          <div ref={float} className={styles.float} aria-hidden="true">
            {categories.map((c) => (
              <div key={c.id} className={`${styles.floatArt} ${hover === c.id ? styles.show : ""}`}>
                <ProductArt id={COVER[c.id]} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
