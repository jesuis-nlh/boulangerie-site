import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductArt } from "@/components/art/ProductArt";
import { AddToCart } from "@/components/cart/AddToCart";
import { ProductTile } from "@/components/catalog/ProductTile";
import { CAT_TINT } from "@/lib/tints";
import { PriceNotice } from "@/components/catalog/PriceNotice";
import { Icon } from "@/components/Icon";
import { categories, getProduct, products } from "@/data/products";
import { formatPrice, formatWeight, pricePerKg } from "@/lib/format";
import { SITE_URL, pageMeta } from "@/lib/seo";
import styles from "@/components/product/Product.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return pageMeta({
    title: `${p.name} — ${formatPrice(p.priceCents)}`,
    description: `${p.short} ${p.name} de Trame, boulangerie au levain de la Croix-Rousse à Lyon. À réserver en ligne, à retirer en boutique.`,
    path: `/produits/${p.slug}/`,
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const cat = categories.find((c) => c.id === p.category)!;
  const kg = pricePerKg(p.priceCents, p.weightG);
  const related = products.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 3);
  const more = related.length < 3 ? products.filter((x) => x.signature && x.slug !== p.slug && !related.includes(x)).slice(0, 3 - related.length) : [];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    category: cat.label,
    brand: { "@type": "Brand", name: "Trame" },
    offers: {
      "@type": "Offer",
      price: (p.priceCents / 100).toFixed(2),
      priceCurrency: "EUR",
      url: `${SITE_URL}/produits/${p.slug}/`,
      availability: "https://schema.org/InStoreOnly",
      seller: { "@id": `${SITE_URL}/#bakery` },
    },
  };

  return (
    <article className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.visual} style={{ background: CAT_TINT[p.category] }}>
          <div className={styles.art} data-reveal="mask">
            <ProductArt id={p.art} label={`Illustration : ${p.name}`} />
          </div>
          <p className={styles.fig}>Illustration originale — pas une photographie du produit</p>
        </div>

        <div className={styles.info}>
          <nav aria-label="Fil d'Ariane" className={styles.crumbs}>
            <ol>
              <li>
                <Link href="/">Accueil</Link>
              </li>
              <li>
                <Link href="/produits/">Nos produits</Link>
              </li>
              <li>
                <Link href={`/produits/?rayon=${cat.id}`}>{cat.label}</Link>
              </li>
              <li aria-current="page">{p.name}</li>
            </ol>
          </nav>

          <div className={styles.tags}>
            {p.signature && <span className="tag">Signature de la maison</span>}
            {p.seasonal && <span className="tag tag--pink">De saison</span>}
          </div>

          <h1 className={`display ${styles.title}`}>{p.name}</h1>
          <p className={styles.short}>{p.short}</p>

          <div className={`ecriteau ${styles.price}`}>
            <span>{[p.size, formatWeight(p.weightG)].filter(Boolean).join(" · ")}</span>
            <span className="ecriteau__price">{formatPrice(p.priceCents)}</span>
            <span className="ecriteau__meta">Prix TTC{kg ? ` · soit ${kg} / kg` : ""}</span>
          </div>

          <AddToCart product={p} withQty openOnAdd />

          {p.leadTimeHours ? (
            <p className={styles.lead}>
              <Icon name="calendar" size={18} /> À commander au moins {p.leadTimeHours} heures avant le retrait.
            </p>
          ) : null}

          <div className={styles.desc}>
            <p>{p.description}</p>
          </div>

          <section className={styles.food} aria-labelledby="food-title">
            <h2 id="food-title" className={styles.foodTitle}>
              Composition &amp; allergènes
            </h2>
            {p.allergens.status === "verified" ? (
              <dl>
                <dt>Contient</dt>
                <dd>{p.allergens.contains.join(", ")}</dd>
                <dt>Traces possibles</dt>
                <dd>{p.allergens.mayContain.join(", ")}</dd>
              </dl>
            ) : (
              <p>
                <Icon name="alert" size={18} />
                <span>
                  Les ingrédients et allergènes de ce produit ne sont pas encore publiés en ligne. Ils sont indiqués par écrit en
                  boutique, à côté du produit : demandez-nous, nous vous montrerons la fiche. En cas d&apos;allergie, ne vous fiez pas à
                  la seule description ci-dessus.
                </span>
              </p>
            )}
          </section>
        </div>
      </div>

      <section className={`wrap ${styles.related}`} aria-labelledby="rel-title">
        <h2 id="rel-title" className="h3">
          Dans la même fournée
        </h2>
        <ul className={styles.relGrid}>
          {[...related, ...more].map((r) => (
            <li key={r.slug}>
              <ProductTile p={r} />
            </li>
          ))}
        </ul>
        <PriceNotice />
      </section>
    </article>
  );
}
