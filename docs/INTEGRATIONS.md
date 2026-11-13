# Intégrations externes — état et besoins

| Intégration | État | Ce qu'il faut pour l'activer |
|---|---|---|
| Commande click & collect | **Démo** (`ordering.mode = "demo"`) | Choisir un prestataire, renseigner `ordering.externalUrl` + `mode: "external"`, ou développer un backend (API + notifications boutique). Voir `.claude/skills/premium-boulangerie-site/references/ordering.md` |
| Paiement en ligne | Non implémenté (paiement au retrait) | Via la page hébergée du prestataire uniquement. Jamais de saisie de carte sur ce site |
| Envoi des demandes de devis | Démo + lien `mailto:` prérempli | Service de formulaires (ou route serveur) avec anti-spam ; mettre à jour la page Confidentialité |
| Avis Google | Non connecté (`reviews.provider = null`) | Google Business Profile API (compte du commerçant), affichage sans tri ni retouche |
| Carte | Plan schématique SVG + liens Google Maps / OpenStreetMap | Iframe possible **avec** gestion du consentement |
| Disponibilités du jour | Non connecté — aucun « disponible » / « en stock » affiché | Source fiable (caisse, back-office) ; sinon ne rien afficher |
| Catalogue | Fichier `data/products.ts` | CMS headless ou export caisse → même schéma `Product` |
| Hébergement | Export statique `out/` (aucun serveur requis) | N'importe quel hébergeur statique. **Aucun déploiement effectué** (non autorisé) |
| Photos | Illustrations SVG | Séance photo (liste de plans dans la Skill) |

## Outils de la session — audit (13/11/2026)
| Outil | Disponible ? | Usage |
|---|---|---|
| Recherche web | Oui | Recherche marché + réglementation |
| Accès direct Légifrance / economie.gouv / service-public | Non (bloqué par le réseau de l'environnement) | Sources secondaires citées, à revalider |
| Banques d'images (Unsplash, Pexels, Wikimedia) | Non (bloqué) | — |
| Higgsfield | Uniquement location GPU payante (Qwen Image, 98 crédits/h) | **Refusé par l'utilisateur** → direction illustrée |
| Bloom | Non présent dans cette session | — |
| Render | Outils de workflows uniquement ; pas nécessaire (site statique) | Non utilisé |
| Vercel (API) | Connecté | Non utilisé : aucun déploiement autorisé |
| Playwright + Chromium | Oui | Captures, tests E2E |
| axe-core | Installé (`@axe-core/playwright`) | Audit WCAG |
| Lighthouse | Installé (devDependency) | Audit perf/SEO |
| Skills | ui-ux-pro-max (système de design), superpowers | Recommandations de départ ; palette/typo affinées manuellement |
