import type { Metadata } from "next";
import { Catalog } from "@/components/catalog/Catalog";
import { PriceNotice } from "@/components/catalog/PriceNotice";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Nos produits — pains au levain, viennoiseries, pâtisseries",
  description:
    "La vitrine de Trame, boulangerie de la Croix-Rousse à Lyon : miches au levain, baguette de tradition, croissants, brioche et tarte aux pralines, gâteaux sur commande. Prix TTC et prix au kilo.",
  path: "/produits/",
});

export default function ProduitsPage() {
  return (
    <div className="wrap" style={{ paddingTop: "calc(var(--header-h) + clamp(2rem, 6vw, 5rem))", paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
      <header style={{ display: "grid", gap: "1.2rem", marginBottom: "2rem", maxWidth: "60rem" }}>
        <p className="eyebrow">Nos produits</p>
        <h1 className="h2">
          La vitrine <em style={{ color: "var(--praline-ink)" }}>du jour.</em>
        </h1>
        <p className="lede">Tout ce qui sort du fournil, rayon par rayon. Ajoutez au panier pour réserver, retirez en boutique.</p>
      </header>
      <Catalog />
      <PriceNotice />
    </div>
  );
}
