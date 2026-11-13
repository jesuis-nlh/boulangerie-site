import Link from "next/link";
import { ProductArt } from "@/components/art/ProductArt";
import { Icon } from "@/components/Icon";

export default function NotFound() {
  return (
    <div className="wrap" style={{ minHeight: "80vh", display: "grid", placeItems: "center", textAlign: "center", paddingTop: "var(--header-h)" }}>
      <div style={{ display: "grid", gap: "1.2rem", justifyItems: "center" }}>
        <ProductArt id="demi" style={{ width: 220 }} />
        <p className="eyebrow no-rule">Erreur 404</p>
        <h1 className="h2">
          Cette page n&apos;est <em style={{ color: "var(--praline-ink)" }}>pas sortie du four.</em>
        </h1>
        <p className="lede" style={{ marginInline: "auto" }}>
          L&apos;adresse a peut-être changé. La vitrine, elle, est toujours là.
        </p>
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/" className="btn">
            Retour à l&apos;accueil
          </Link>
          <Link href="/produits/" className="btn btn--ghost">
            Nos produits <Icon name="arrow" />
          </Link>
        </div>
      </div>
    </div>
  );
}
