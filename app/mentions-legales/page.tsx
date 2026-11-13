import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { bakery } from "@/config/bakery";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Mentions légales", description: "Mentions légales du site de Trame, boulangerie de la Croix-Rousse à Lyon.", path: "/mentions-legales/" });

export default function Mentions() {
  const c = bakery.contact;
  return (
    <LegalPage eyebrow="Informations légales" title="Mentions légales">
      <h2>Éditeur du site</h2>
      <dl>
        <dt>Raison sociale</dt>
        <dd>{bakery.brand.legalName}</dd>
        <dt>Adresse</dt>
        <dd>
          {c.street}, {c.postalCode} {c.city}
        </dd>
        <dt>Téléphone</dt>
        <dd>{c.phoneDisplay}</dd>
        <dt>E-mail</dt>
        <dd>{c.email}</dd>
        <dt>SIRET</dt>
        <dd>{bakery.legal.siret}</dd>
        <dt>Directeur de la publication</dt>
        <dd>{bakery.legal.publicationDirector}</dd>
      </dl>
      <p>À compléter selon la forme juridique : capital social, RCS ou répertoire des métiers, numéro de TVA intracommunautaire.</p>
      <h2>Hébergement</h2>
      <p>{bakery.legal.host}. Indiquer le nom, l&apos;adresse et le téléphone de l&apos;hébergeur.</p>
      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, illustrations et éléments graphiques de ce site sont des créations originales. Les illustrations de produits sont
        des dessins et non des photographies des produits vendus.
      </p>
      <h2>Prix et informations produits</h2>
      <p>
        Les prix sont indiqués en euros toutes taxes comprises. Les informations sur les allergènes sont affichées par écrit en boutique,
        à proximité de chaque produit ; en cas de doute, demandez-nous.
      </p>
      <h2>Médiation de la consommation</h2>
      <p>Si la vente en ligne est activée : indiquer le médiateur de la consommation dont relève l&apos;entreprise.</p>
    </LegalPage>
  );
}
