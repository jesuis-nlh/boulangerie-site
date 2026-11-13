# Projet Trame — consignes

- Projet autonome : ne dépend d'aucun autre dépôt. Tout reste dans ce dossier (`/ghost` → `/home/user/ghost`).
- Next.js 16 (App Router, export statique), React 19, TypeScript, CSS Modules + `app/globals.css`, Motion pour React. Lire `node_modules/next/dist/docs/` avant d'utiliser une API Next.
- Données de la boutique : uniquement `config/bakery.ts` et `data/products.ts`. Ne jamais inventer allergènes, avis, notes, labels, distinctions.
- Ne pas déployer, publier, acheter ni connecter de service payant sans autorisation explicite.
- Avant de déclarer un travail terminé : `npm run build`, servir `out/`, `node qa/e2e.mjs`, `node qa/a11y.mjs`, regarder les captures (`node qa/screenshots.mjs`).
- Workflow détaillé : `.claude/skills/premium-boulangerie-site/SKILL.md`.
@AGENTS.md
