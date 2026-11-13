"use client";

import Link from "next/link";
import { ProductArt } from "@/components/art/ProductArt";
import { Icon } from "@/components/Icon";
import { useCart } from "@/lib/cart";
import { formatPrice, formatWeight, pricePerKg } from "@/lib/format";
import type { Product } from "@/data/products";
import { CAT_TINT } from "@/lib/tints";
import styles from "./ProductTile.module.css";

export function ProductTile({ p }: { p: Product }) {
  const cart = useCart();
  const kg = pricePerKg(p.priceCents, p.weightG);
  const href = `/produits/${p.slug}/`;
  return (
    <article className={styles.tile} aria-labelledby={`t-${p.slug}`}>
      <Link href={href} className={styles.visual} style={{ background: CAT_TINT[p.category] }} tabIndex={-1} aria-hidden="true" data-cursor="Voir">
        <ProductArt id={p.art} className={styles.art} />
        <span className={styles.tags}>
          {p.signature && <span className="tag">Signature</span>}
          {p.seasonal && <span className="tag tag--pink">Saison</span>}
          {p.leadTimeHours && <span className="tag">{p.leadTimeHours} h</span>}
        </span>
      </Link>
      <div className={styles.body}>
        <h3 id={`t-${p.slug}`} className={styles.name}>
          <Link href={href}>{p.name}</Link>
        </h3>
        <p className={styles.short}>{p.short}</p>
        <div className="ecriteau">
          <span className={styles.fmt}>{[p.size, formatWeight(p.weightG)].filter(Boolean).join(" · ")}</span>
          <span className="ecriteau__price">{formatPrice(p.priceCents)}</span>
          {kg && <span className="ecriteau__meta">soit {kg} / kg</span>}
        </div>
      </div>
      {p.orderable ? (
        <button type="button" className={styles.quick} onClick={() => cart.add(p.slug)} aria-label={`Ajouter ${p.name} au panier`}>
          <Icon name="plus" size={20} />
        </button>
      ) : (
        <span className={styles.shopOnly}>En boutique</span>
      )}
    </article>
  );
}
