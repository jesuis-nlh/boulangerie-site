import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { bakery } from "@/config/bakery";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Confidentialité & cookies", description: "Comment Trame traite vos données : commandes, demandes de devis, stockage local du panier. Aucun cookie publicitaire.", path: "/confidentialite/" });

export default function Confidentialite() {
  return (
    <LegalPage eyebrow="Données personnelles" title="Confidentialité & cookies">
      <h2>Ce que nous collectons</h2>
      <ul>
        <li>
          <strong>Commande en click &amp; collect</strong> : nom, téléphone, e-mail facultatif, précision éventuelle, contenu du panier et
          créneau de retrait. Finalité : préparer votre commande. Base légale : exécution d&apos;un contrat (art. 6.1.b RGPD).
        </li>
        <li>
          <strong>Demande de devis</strong> : occasion, date, nombre de parts, description, nom et moyen de contact. Finalité : vous
          répondre. Base légale : mesures précontractuelles (art. 6.1.b RGPD).
        </li>
      </ul>
      <h2>Durées de conservation</h2>
      <p>
        Commandes : durée nécessaire au retrait puis aux obligations comptables. Demandes de devis sans suite : 6 mois. Durées à valider
        avec le responsable de traitement.
      </p>
      <h2>Destinataires</h2>
      <p>
        L&apos;équipe de la boutique uniquement, et le prestataire technique de commande s&apos;il est activé (à nommer, avec son
        contrat de sous-traitance).
      </p>
      <h2>Cookies et stockage local</h2>
      <p>
        Le site ne dépose aucun cookie de mesure d&apos;audience, de publicité ou de réseaux sociaux, et ne charge aucune carte ni vidéo tierce
        sans action de votre part. Le panier est conservé dans le stockage local de votre navigateur, à votre demande, pour le retrouver
        d&apos;une page à l&apos;autre ; il n&apos;est transmis à personne. Vous pouvez l&apos;effacer à tout moment depuis le lien « Cookies » en pied de page.
      </p>
      <h2>Vos droits</h2>
      <p>
        Accès, rectification, effacement, limitation, opposition : écrivez à {bakery.contact.email}. Vous pouvez aussi saisir la CNIL
        (cnil.fr).
      </p>
      <h2>État actuel (démonstration)</h2>
      <p>Sur cette version de démonstration, aucun formulaire ne transmet de données : tout reste dans votre navigateur.</p>
    </LegalPage>
  );
}
