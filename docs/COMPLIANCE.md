# Conformité — ce que fait le site, ce qui reste à valider

> Ce document n'est pas un avis juridique. Les points ⚠️ doivent être validés par un professionnel (juriste, expert-comptable, DPO) avant une mise en ligne réelle.

| Sujet | Implémentation dans le site | Reste à faire / à valider |
|---|---|---|
| Appellation « boulangerie » (L122-17) | Drapeaux `compliance.qualifiesAsBoulangerie` et `madeOnSite` ; l'engagement « Tout est fait ici » et « Jamais de surgelé » ne s'affichent que si vrais | ⚠️ Attestation du professionnel sur ses pratiques réelles |
| Prix TTC | Tous les prix via `Intl` fr-FR en euros ; mention « TTC » sur catalogue, fiche, panier, commande | Vérifier les prix avec la caisse de la boutique |
| Prix au kg (arrêté 78-89/P) | Calculé automatiquement pour les pains ≥ 200 g (écriteau) | ⚠️ L'affichage en ligne ne remplace pas les écriteaux et l'affiche « prix du pain » en boutique |
| Allergènes (décret 2015-447) | Aucun allergène inventé ; avertissement explicite sur chaque fiche ; modèle `verified` prêt (contains / mayContain / source) | ⚠️ Fiches réelles par produit ; ⚠️ règles d'information pour la vente à distance de denrées non préemballées |
| Ingrédients | Champ optionnel `ingredients` avec `source`, vide en démo | Fournis par la boutique |
| Avis clients | Aucun avis ni note ; JSON-LD sans `aggregateRating` ; emplacement documenté | Intégration API officielle (Google Business Profile) si souhaitée |
| Distinctions / labels | Aucun affiché | Afficher seulement avec justificatif |
| RGPD — commande | Données minimales (nom, téléphone, e-mail facultatif) ; notice + page Confidentialité ; aucune transmission en démo | ⚠️ Registre des traitements, durées, contrat de sous-traitance avec le prestataire de commande |
| RGPD — devis | Notice + durée de conservation indicative (6 mois) | ⚠️ Valider la durée |
| Cookies | Aucun cookie ; panier en `localStorage` (fonction demandée par l'utilisateur) ; panneau d'information + effacement ; liens Maps sortants (pas d'iframe) | ⚠️ Si ajout d'analytics, carte intégrée, pixel : bandeau de consentement conforme CNIL (refus aussi simple qu'accepter) |
| Mentions légales | Modèle structuré, champs depuis `config.legal` | ⚠️ Compléter (forme juridique, RCS/RM, TVA, hébergeur) |
| Vente à distance | Mode démo : aucune vente | ⚠️ Si paiement en ligne : CGV, droit de rétractation (exceptions denrées périssables), médiateur de la consommation |
| Indexation | `noindex` + robots `Disallow` tant que `isDemo` | Passer `isDemo: false` uniquement avec données réelles |
| Illustrations | Mention « illustration originale — pas une photographie » | Remplacer par photos réelles si disponibles |
