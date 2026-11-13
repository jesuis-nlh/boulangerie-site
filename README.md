# Trame — boulangerie au levain, Croix-Rousse (démo)

Site vitrine + click & collect pour une **boulangerie fictive** de Lyon, conçu comme une expérience éditoriale : identité « Atelier Jacquard », illustrations risographie en SVG, catalogue filtrable, panier, créneaux de retrait, demande de devis, SEO local.

> ⚠️ Démonstration : adresse, téléphone, horaires, produits et prix sont fictifs. Aucune commande n'est transmise, aucun paiement n'est possible. Le site est en `noindex`.

## Démarrer
```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # export statique dans out/
npx serve out -l 3000
```

## QA
```bash
npm run qa:e2e        # 12 scénarios fonctionnels
npm run qa:a11y       # axe-core WCAG 2.1 AA
npm run qa:shots      # captures 390/768/1024/1440 → qa/shots/
npm run qa:lighthouse # Lighthouse mobile
```
Résultats : `docs/QA-REPORT.md`.

## Adapter à une vraie boulangerie
1. `config/bakery.ts` — identité, coordonnées, horaires, mode de commande, drapeaux de conformité, `isDemo: false`.
2. `data/products.ts` — catalogue réel, allergènes vérifiés.
3. `app/globals.css` / `app/fonts.ts` — palette et typographies si la direction change.
4. Suivre la Skill `.claude/skills/premium-boulangerie-site/SKILL.md`.

## Documentation
- `docs/BRAND.md` — positionnement, deux directions, choix
- `docs/RESEARCH.md` — marché lyonnais, réglementation (sources)
- `docs/COMPLIANCE.md` — ce qui est couvert / à valider
- `docs/INTEGRATIONS.md` — commande, paiement, avis, hébergement ; audit des outils
- `docs/QA-REPORT.md` — tests, audits, notation
