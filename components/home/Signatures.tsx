"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProductArt } from "@/components/art/ProductArt";
import { AddToCart } from "@/components/cart/AddToCart";
import { Icon } from "@/components/Icon";
import { signatureProducts } from "@/data/products";
import { formatPrice, formatWeight, pricePerKg } from "@/lib/format";
import styles from "./Signatures.module.css";

const TINTS = ["var(--wheat-tint)", "var(--paper-2)", "var(--praline-tint)", "var(--paper-3)", "var(--praline-tint)"];

/** Vitrine éditoriale : index collant à gauche, grands tableaux à droite. */
export function Signatures() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <section className={`section ${styles.section}`} aria-labelledby="sig-title">
      <div className="wrap">
        <header className={styles.head}>
          <p className="eyebrow">Nos signatures</p>
          <h2 id="sig-title" className="h2" data-reveal>
            Cinq raisons de <em>remonter</em> la pente.
          </h2>
        </header>

        <div className={styles.layout}>
          <nav className={styles.index} aria-label="Signatures">
            <ol>
              {signatureProducts.map((p, i) => (
                <li key={p.slug}>
                  <a href={`#sig-${p.slug}`} aria-current={active === i ? "true" : undefined}>
                    <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                    {p.name}
                  </a>
                </li>
              ))}
            </ol>
            <div className={styles.progress} aria-hidden="true">
              <span style={{ transform: `scaleY(${(active + 1) / signatureProducts.length})` }} />
            </div>
          </nav>

          <div className={styles.panels}>
            {signatureProducts.map((p, i) => {
              const kg = pricePerKg(p.priceCents, p.weightG);
              return (
                <article
                  key={p.slug}
                  id={`sig-${p.slug}`}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  data-i={i}
                  className={styles.panel}
                  aria-labelledby={`sig-h-${p.slug}`}
                >
                  <Link href={`/produits/${p.slug}/`} className={styles.visual} style={{ background: TINTS[i % TINTS.length] }} data-cursor="Voir" data-num={String(i + 1).padStart(2, "0")} tabIndex={-1} aria-hidden="true">
                    <div className={styles.art} data-reveal="mask">
                      <ProductArt id={p.art} />
                    </div>
                  </Link>
                  <div className={styles.body}>
                    <h3 id={`sig-h-${p.slug}`} className="h3">
                      <Link href={`/produits/${p.slug}/`}>{p.name}</Link>
                    </h3>
                    <p className={styles.desc}>{p.description}</p>
                    <div className="ecriteau">
                      <span>{[p.size, formatWeight(p.weightG)].filter(Boolean).join(" · ") || "Pièce"}</span>
                      <span className="ecriteau__price">{formatPrice(p.priceCents)}</span>
                      {kg && <span className="ecriteau__meta">soit {kg} / kg</span>}
                    </div>
                    <div className={styles.actions}>
                      <AddToCart product={p} />
                      <Link href={`/produits/${p.slug}/`} className="link-arrow">
                        La fiche <Icon name="arrow" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
