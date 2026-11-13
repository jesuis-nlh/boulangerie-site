# Recherche — marché et cadre réglementaire (13/11/2026)

Méthode : recherche web (outil de recherche de la session). L'accès direct aux sites officiels (Légifrance, economie.gouv.fr, service-public.fr) est **bloqué** par la politique réseau de l'environnement : les textes ci-dessous sont résumés à partir de sources secondaires concordantes et **doivent être relus sur Légifrance avant toute mise en ligne réelle**.

## Marché lyonnais — observations
- Lyon compte de nombreuses boulangeries reconnues ; plusieurs misent sur le levain naturel et les farines anciennes (ex. fiches Le Fooding sur une fabrique au levain de la Croix-Rousse ; Jocteur et ses levains aux grains anciens).
- La **praline rose** est la spécialité identitaire (brioche, tarte). La « Praluline » est une marque de la maison Pralus (créée en 1955) : ne pas réutiliser ce nom.
- Le **coussin de Lyon** est associé à la maison Voisin : ne pas l'employer comme nom de produit.
- Les classements/récompenses (ex. « Boulangerie de l'année 2026 » d'un acteur de livraison) montrent que les distinctions sont un argument fort — d'où l'interdiction d'en inventer.
- Tendances visuelles des sites de boulangeries premium : photo plein cadre de miche, palettes crème/noir, typographies serif éditoriales. Opportunité : se distinguer par une identité graphique propre plutôt qu'une énième photo de pain.
- Parcours de commande observés : click & collect avec créneaux, délai 24–48 h pour les gâteaux, paiement en ligne ou au retrait selon les maisons.

Sources consultées :
- [Le Fooding — Bonomia (Croix-Rousse)](https://lefooding.com/commerces/bonomia)
- [Lyon Capitale — Fête du pain : Lyon, capitale de la boulangerie ?](https://www.lyoncapitale.fr/?p=54880)
- [Le Bonbon — Pain du Gone](https://www.lebonbon.fr/lyon/actu/pain-gone-lyon-meilleure-boulangerie-france/)
- [Table Journey — Pralus Lyon](https://tablejourney.com/france/lyon/bakeries/pralus/)
- [Table Journey — Jocteur](https://tablejourney.com/france/lyon/bakeries/jocteur/)
- [Gault&Millau — Antoinette Pain et Brioche](https://fr.gaultmillau.com/fr/artisans/antoinette-pain-and-brioche-bugeaud)

## Cadre réglementaire (synthèse — à faire valider)
### Appellation « boulanger / boulangerie » — art. L122-17 C. conso.
Réservée aux professionnels qui assurent eux-mêmes, à partir de matières premières choisies, le pétrissage, la fermentation et la mise en forme de la pâte, ainsi que la cuisson **sur le lieu de vente** ; la pâte et le pain ne doivent à aucun stade être surgelés ou congelés. L122-18 étend la vente ambulante sous la responsabilité du professionnel. Un commerce cuisant des pâtons surgelés relève du « dépôt de pain ».
→ Implémentation : `config.compliance.qualifiesAsBoulangerie` + `madeOnSite` ; les engagements ne s'affichent que si les drapeaux sont vrais.
Sources : [Légifrance (texte officiel)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032227324) · [INPI — boulanger-pâtissier](https://www.inpi.fr/annuaire-activites-et-professions/boulanger-patissier-0) · [Mapa — appellation boulangerie](https://www.mapa-assurances.fr/boulangerie/appellation-boulangerie) · [Assemblée nationale, QE 26244](https://www.assemblee-nationale.fr/dyn/15/questions/QANR5L15QE26244.pdf)

### Affichage des prix du pain — arrêté n° 78-89/P (9 août 1978)
Prix libres depuis 1987. Pains exposés : écriteau par catégorie (dénomination, poids, prix à la pièce, et prix au kg pour les pains ≥ 200 g). Affiche « prix du pain » en boutique (40 × 30 cm min.). Viennoiseries/pâtisseries vendues au poids : prix au kg ou aux 100 g. Produits décongelés : mention « décongelé ».
→ Implémentation : composant « écriteau » (dénomination, format/poids, prix TTC en mono, prix au kg calculé dès 200 g). L'affichage en ligne **ne remplace pas** l'affichage en boutique.
Sources : [economie.gouv.fr — affichage des prix](https://www.economie.gouv.fr/entreprises/gerer-son-entreprise-au-quotidien/gerer-un-commerce/professionnels-quelles-sont-vos-obligations-en-matiere-daffichage-des-prix) · [Mapa — poids et prix du pain](https://www.mapa-assurances.fr/boulangerie/poids-prix-pain) · [Mapa — obligations réglementaires](https://www.mapa-assurances.fr/boulangerie/obligations-reglementaires)

### Allergènes — décret n° 2015-447 (17 avril 2015)
Denrées non préemballées (pain, pâtisserie en vitrine) : indication **par écrit**, à proximité du produit, des 14 allergènes. Support libre. Pour la vente à distance de denrées préemballées, les informations obligatoires doivent être disponibles avant la conclusion de l'achat ; pour le non-préemballé vendu à distance, **point à faire vérifier** (non tranché par les sources consultées) — par prudence, publier les fiches vérifiées avant d'activer une vraie vente en ligne.
→ Implémentation : `allergens.status = "unverified"` pour tous les produits démo ; la fiche affiche un avertissement explicite au lieu d'une liste inventée.
Sources : [DGCCRF — étiquetage des denrées](https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/etiquetage-des-denrees-alimentaires-les-regles-connaitre) · [FAOLEX — décret 2015-447](https://leap.unep.org/en/countries/fr/national-legislation/decret-no-2015-447-du-17-avril-2015-relatif-linformation-des) · [Mapa — allergènes en boulangerie](https://www.mapa-assurances.fr/boulangerie/allergenes-boulangerie)
