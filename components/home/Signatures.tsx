import Link from "next/link";
import { ProductArt } from "@/components/art/ProductArt";
import { AddToCart } from "@/components/cart/AddToCart";
import { Icon } from "@/components/Icon";
import { signatureProducts } from "@/data/products";
import { formatPrice, formatWeight, pricePerKg } from "@/lib/format";
import { SignatureIndex } from "./SignatureIndex";
import styles from "./Signatures.module.css";

const TINTS = ["var(--wheat-tint)", "var(--paper-2)", "var(--praline-tint)", "var(--paper-3)", "var(--praline-tint)"];

/**
 * Vitrine éditoriale : index collant à gauche, grands tableaux à droite.
 * Composant serveur : les illustrations sont rendues dans le HTML ; seuls
 * l'index (SignatureIndex) et les boutons d'ajout sont interactifs.
 */
export function Signatures() {
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
          <SignatureIndex items={signatureProducts.map((p) => ({ slug: p.slug, name: p.name }))} />

          <div className={styles.panels}>
            {signatureProducts.map((p, i) => {
              const kg = pricePerKg(p.priceCents, p.weightG);
              return (
                <article
                  key={p.slug}
                  id={`sig-${p.slug}`}
                  data-sig={i}
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
