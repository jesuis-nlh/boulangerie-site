import type { Metadata } from "next";
import { ProductArt } from "@/components/art/ProductArt";
import { InquiryForm } from "@/components/order/InquiryForm";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Gâteaux sur mesure & événements",
  description: "Gâteaux d'anniversaire, pièces de mariage, buffets d'entreprise : demandez un devis à Trame, boulangerie-pâtisserie de la Croix-Rousse à Lyon.",
  path: "/sur-mesure/",
});

export default function SurMesurePage() {
  return (
    <div className="wrap" style={{ paddingTop: "calc(var(--header-h) + clamp(2rem, 6vw, 4.5rem))", paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
      <header style={{ display: "grid", gap: "1.2rem", marginBottom: "2.5rem", gridTemplateColumns: "minmax(0,1fr)", position: "relative" }}>
        <p className="eyebrow">Gâteaux &amp; événements</p>
        <h1 className="h2" style={{ maxWidth: "12em" }}>
          Racontez-nous <em style={{ color: "var(--praline-ink)" }}>l&apos;occasion.</em>
        </h1>
        <p className="lede">Nous revenons vers vous sous 48 heures ouvrées avec une proposition, un visuel si besoin, et un prix. Rien n&apos;est engagé avant votre accord.</p>
        <ProductArt id="entremets" style={{ position: "absolute", right: 0, top: "-1rem", width: "min(300px, 32vw)", opacity: 0.95 }} />
      </header>
      <div className="sm-layout">
        <InquiryForm />
        <aside className="sm-aside" aria-labelledby="how-title">
          <h2 id="how-title" className="h3">
            Comment ça se passe
          </h2>
          <ol>
            <li>
              <span className="mono">01</span>
              <strong>Vous décrivez l&apos;occasion.</strong> Date, nombre de convives, envies, contraintes.
            </li>
            <li>
              <span className="mono">02</span>
              <strong>Nous proposons.</strong> Une création, un prix, un délai — par écrit.
            </li>
            <li>
              <span className="mono">03</span>
              <strong>Vous validez.</strong> Rien n&apos;est lancé sans votre accord.
            </li>
            <li>
              <span className="mono">04</span>
              <strong>Vous retirez en boutique</strong>, au créneau convenu.
            </li>
          </ol>
          <p className="hint">Allergies ou régimes particuliers : signalez-les dans votre message, nous vous dirons honnêtement ce que nous pouvons garantir.</p>
        </aside>
      </div>
    </div>
  );
}
