import type { Metadata } from "next";
import { OrderFlow } from "@/components/order/OrderFlow";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Commander en click & collect",
  description: "Réservez vos pains, viennoiseries et gâteaux chez Trame, boulangerie de la Croix-Rousse à Lyon, et retirez-les en boutique au créneau de votre choix.",
  path: "/commander/",
});

export default function CommanderPage() {
  return (
    <div className="wrap" style={{ paddingTop: "calc(var(--header-h) + clamp(2rem, 6vw, 4.5rem))", paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
      <header style={{ display: "grid", gap: "1.2rem", marginBottom: "2.5rem", maxWidth: "52rem" }}>
        <p className="eyebrow">Click &amp; collect</p>
        <h1 className="h2">
          Commander, <em style={{ color: "var(--praline-ink)" }}>retirer en boutique.</em>
        </h1>
        <p className="lede">Composez votre panier, choisissez un créneau, passez le prendre. Le règlement se fait sur place.</p>
      </header>
      <OrderFlow />
    </div>
  );
}
