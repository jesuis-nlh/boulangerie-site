# Rapport QA — 13/11/2026

Build testé : export statique `out/` (Next.js 16.4.6), servi localement sur :3000. Navigateur : Chromium 1243 (Playwright 1.63). Toutes les valeurs ci-dessous sont celles mesurées, sans arrondi favorable.

## 1. Tests fonctionnels — `node qa/e2e.mjs`
**12/12 réussis · 0 erreur console** (rapport : `qa/reports/e2e.json`)

| Scénario | Résultat |
|---|---|
| Accueil : titre, H1 unique, CTA « Commander » et « Découvrir nos produits » | ✓ |
| Navigation principale + ancres | ✓ |
| Catalogue : filtre par rayon, lien profond `?rayon=`, recherche sans accents, état vide, réinitialisation | ✓ |
| Panier : ajout, quantités, total (12,80 € → 14,30 €), persistance après rechargement, suppression | ✓ |
| Fiche produit : prix TTC, prix au kg (1,40 € / 250 g = 5,60 €/kg), ajout avec quantité, mention allergènes non vérifiés | ✓ |
| Commande : récapitulatif d'erreurs focalisé, erreurs en ligne + `aria-invalid`, issue « non envoyée / aucun paiement » | ✓ |
| Gâteaux : délai 48 h appliqué (pas de créneau « Aujourd'hui ») | ✓ |
| Devis : contact requis, date minimale, issue démo + alternative e-mail réelle | ✓ |
| Clavier (390 px) : lien d'évitement, menu mobile Échap + retour du focus, piège de focus du panier | ✓ |
| Mouvement réduit : aucun contenu masqué, bandeau arrêté | ✓ |
| Liens internes (exploration de 29 pages) et images : aucun cassé | ✓ |
| SEO : titres uniques, descriptions, canoniques, H1 unique, JSON-LD Bakery (6 plages horaires), aucune note, `noindex` démo | ✓ |

## 2. Accessibilité — `node qa/a11y.mjs` (axe-core, WCAG 2.1 A/AA + bonnes pratiques)
**0 violation** sur 8 pages × 2 largeurs (1440, 390). Corrigé pendant la QA : `heading-order` (catalogue), contraste du manifeste (état non encré passé de 16 % d'opacité à une couleur ≥ 3:1), chiffres décoratifs des signatures.

## 3. Lighthouse — `node qa/lighthouse.mjs` (mobile, throttling simulé)
| Page | Perf. | A11y | Bonnes pratiques | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 86 – 99* | 100 | 100 | 66** | 1,1 s | 0 | 120 – 550 ms* |
| `/produits/` | 99 – 100 | 100 | 100 | 66** | 1,1 s | 0 | 80 – 100 ms |
| `/produits/la-trame/` | 96 – 99 | 100 | 100 | 66** | 0,9 s | 0 | 140 – 210 ms |
| `/commander/` | 97 – 99 | 100 | 100 | 66** | 0,9 s | 0 | 130 – 200 ms |

\* Fourchette sur 3 exécutions : le TBT de l'accueil varie fortement (hydratation de nombreuses illustrations SVG dans des composants client).
\*\* Seul audit en échec : `is-crawlable`, **volontaire** (`noindex` tant que `bakery.isDemo`). Tous les autres audits SEO passent.

## 4. Revue visuelle (captures `qa/shots/<largeur>/`)
Largeurs : 390, 768, 1024, 1440. Pages : accueil, catalogue, fiche, commande, devis (pli + pleine page). États : panier ouvert, erreurs de commande, menu mobile, survol des rayons.

**Passe 1 — composition, typographie, images**
- Illustrations agrandies dans les signatures (78 % → 96 %), disque du hero rendu circulaire sur mobile, carton perforé allégé, exposant « 1er » réparé, alignement des champs de formulaire (aide sous le champ), panneau « Comment ça se passe » ajouté au devis, illustration finale décalée du titre.

**Passe 2 — animation, navigation, interactions**
- Révélations masquées invisibles (IntersectionObserver ignore un élément entièrement clippé) → observation du parent.
- Halo de curseur affiché au centre avant tout mouvement → masqué jusqu'au premier mouvement.
- En-tête masqué au défilement cachant le compteur du panier après un ajout → l'en-tête réapparaît et reste visible 1,2 s après chaque ajout.
- Aperçu flottant des rayons qui masquait le texte et doublait l'étiquette du curseur → décalé, placé sous le texte, étiquette retirée.

**Passe 3 — responsive, accessibilité, cohérence**
- Écarts d'hydratation (flottants trigonométriques serveur/navigateur) → coordonnées arrondies.
- Teinte de fond des fiches perdue (constante exportée depuis un module client) → `lib/tints.ts`.
- Contraste du bandeau click & collect (4,4:1) → fond `--praline-soft` (≈ 5,3:1).
- Contrôle : 390 px sans défilement horizontal, CTA visibles au premier écran, cibles ≥ 44 px.

## 5. Grille de qualité (100 points)
| Critère | Note | Justification |
|---|---|---|
| Direction artistique & identité | 14/15 | Concept « Atelier Jacquard » cohérent (carton perforé, fil, grigne en croisillon, écriteaux) appliqué partout |
| Hero & impact | 13/15 | Typographie forte, composition imprimée en couches, parallaxe ; moins « appétissant » qu'une vraie photo de miche |
| Typographie & composition | 9/10 | Système à trois familles, rythme clair/sombre ; quelques retours à la ligne de titres perfectibles en 1024 |
| Imagerie & cohérence | 12/15 | 20 illustrations originales et homogènes ; certaines (croissant, seigle) restent schématiques ; **aucune photographie** (bloquée par le réseau, génération payante refusée) |
| Animation & interactions | 9/10 | Langage cohérent, tout désactivable ; pas de transition entre pages |
| Découverte & commande | 9/10 | Filtres, recherche, fiches, panier, créneaux, devis ; commande réelle non branchée (démo honnête) |
| Responsive & accessibilité | 10/10 | 0 violation axe, clavier, mouvement réduit, 4 largeurs vérifiées |
| Performance & technique | 8/10 | Export statique, CLS 0, LCP ≤ 1,1 s ; TBT de l'accueil instable (jusqu'à 550 ms) |
| Rédaction & crédibilité | 4/5 | Texte français original, aucune affirmation non étayée hors démo ; à faire relire par un rédacteur natif |
| **Total** | **88/100** | Aucune catégorie sous 8/10 (normalisée) |

### Verdict
**Seuil de 90 non atteint (88/100).** Le site est fonctionnellement et techniquement prêt pour une démonstration, mais je ne gonfle pas la note. Les points manquants viennent surtout de l'imagerie : sans photographie réelle ni génération autorisée, les illustrations portent l'identité mais pas tout l'appétit d'une photo.

Pour franchir 90 :
1. **Photographie réelle** de la boutique (liste de plans dans la Skill) ou génération d'images autorisée → +3 à +5 points (hero, imagerie).
2. Réduire l'hydratation de l'accueil (illustrations rendues côté serveur et passées en `children` aux sections client) → TBT stable < 200 ms.
3. Relecture du texte par un rédacteur francophone.
