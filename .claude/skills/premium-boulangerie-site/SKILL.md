---
name: premium-boulangerie-site
description: Use when designing, building, adapting or reviewing a website for a French bakery (boulangerie, pâtisserie, bakery-café) — especially in Lyon. Covers brand direction, product catalog and click-and-collect UX, French copy, food-information and price-display safeguards (L122-17, arrêté 78-89/P, décret 2015-447), local SEO, and a screenshot-based QA gate. Also use when swapping this repo's demo bakery ("Trame") for a real client.
---

# Premium boulangerie site — workflow

This skill encodes how the Trame demo in this repo was built and how to adapt it to a real bakery without losing quality or making unsupported claims. Follow the phases in order. Each phase ends with a checklist; do not move on with unchecked boxes.

Repo map (what to touch when adapting):

| Concern | File |
|---|---|
| Identity, address, hours, ordering mode, legal flags | `config/bakery.ts` |
| Catalogue, prices, allergens | `data/products.ts` |
| Colour tokens, type scale, shared UI | `app/globals.css`, `app/fonts.ts` |
| Illustrations (risograph SVG system) | `components/art/*` |
| Home sections (one file per chapter) | `components/home/*` |
| Click & collect, devis | `components/order/*`, `lib/cart.tsx`, `lib/hours.ts` |
| SEO helpers, JSON-LD | `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts` |
| QA scripts | `qa/*.mjs` |

---

## Phase 1 — Facts before pixels

Collect from the client, in writing. Nothing on this list may be invented; if missing, the site shows a neutral placeholder or hides the element.

- [ ] Legal name, SIRET, address, phone, email, host for mentions légales
- [ ] Opening hours per day (including closures), holiday exceptions
- [ ] Product list with **their** names, prices TTC, weights (all breads ≥ 200 g need a weight → price/kg is computed automatically)
- [ ] For each product: allergens as written on their in-store fiche (14 EU allergens) — or explicitly "not provided" → `allergens: { status: "unverified" }`
- [ ] Which production steps happen on site (kneading, fermentation, shaping, baking) and whether any dough/bread is frozen → `config.compliance.madeOnSite`
- [ ] Certifications with certificate numbers (bio, label rouge, etc.). No certificate → no claim.
- [ ] Ordering: real provider URL, phone-only, or demo → `config.ordering.mode`
- [ ] Review source (Google Business Profile) or none → `config.reviews.provider`
- [ ] Real photos? If yes, shot list (see `references/art-direction.md`). If no, keep the illustration system.

**Hard rule — the word "boulangerie".** Art. L122-17 Code de la consommation reserves *boulanger/boulangerie* for businesses that knead, ferment, shape and bake on the point of sale, with no frozen dough or bread at any stage. If the client buys in pâtons or frozen bread, use "dépôt de pain", "pâtisserie", "café" etc. — never "boulangerie". `components/home/Engagements.tsx` renders claims only from config flags; keep it that way.

## Phase 2 — Market & brand

1. Research 6–10 Lyon competitors (official sites first; guides like Le Fooding, Gault&Millau, Lyon Capitale for context). Note: positioning, signature products, price level, ordering options, photo style. Record sources in `docs/RESEARCH.md`.
2. Find the white space. Lyon specifics worth using **when true for the client**: praline rose (brioche, tarte), bugnes (carnival season), coussin (trademarked by Voisin — don't name a product "coussin de Lyon"), neighbourhood identity (Croix-Rousse/canuts, Vieux Lyon, Presqu'île, Guillotière…). Never reuse another bakery's product names (e.g. "Praluline" is Pralus's trademark).
3. Write two **substantially different** directions (palette, type, imagery, motion, voice) on one page each; pick one and write down why. See `docs/BRAND.md` for the Trame example (Atelier Jacquard vs Nuit du Fournil).
4. Define: name check (search "<name> boulangerie Lyon"), positioning sentence, audience, story, product philosophy, 3 conversion goals.

- [ ] Two directions documented, one chosen with reasons
- [ ] Name collision search done
- [ ] Brand story uses only facts from Phase 1

## Phase 3 — Art direction

Read `references/art-direction.md`. Key rules:

- One idea carried everywhere (Trame: the weave/punch-card → logo, dividers, engagement markers, thread under the H1, the loaf's crosshatch scoring).
- Palette = 3 inks + paper + one dark "night" surface. Check contrast with the numbers in `references/qa-checklist.md`; pink backgrounds needed a lighter tint (`--praline-soft`) to keep body text ≥ 4.5:1.
- Type: one expressive display serif (Instrument Serif), one sober grotesk (Hanken Grotesk), one mono for prices/labels (IBM Plex Mono). Prices always in mono with tabular numerals — it reads like a shelf label.
- No rounded-card grids. Products live on tinted squares separated by 1 px rules (shelf grid), signatures get editorial spreads with a sticky index.
- Imagery: real photography beats everything if it is good. Without it, use the risograph SVG system (`components/art`) rather than stock or generated images. Always label illustrations as illustrations. Generated images must never be presented as photos of the shop, team or products.

## Phase 4 — Structure & UX

Home chapters (each one a component, each with a job):

1. Hero — appetite + identity + both CTAs ("Commander", "Découvrir nos produits") + open status + neighbourhood. CTAs must be visible above the fold at 390 px.
2. Manifesto — the story in one paragraph (scroll-inked words).
3. Signatures — 3–5 products, editorial, add-to-cart in place.
4. Savoir-faire — the night process (only steps the bakery really does).
5. Category index — typographic list, hover-follow preview.
6. Engagements — each claim + "Preuve" line (law article, document, or "à voir au fournil").
7. Click & collect — 3 steps, honest about payment and demo state.
8. Gâteaux & événements — devis CTA.
9. Visit — address, hours table (today highlighted, Lyon timezone), transport, directions links, review slot.
10. Final CTA — "Découvrir la boutique" + "Nous trouver".

Click & collect rules (`references/ordering.md`):

- Slots derive from opening hours + `leadTimeMinutes`; products with `leadTimeHours` (gâteaux) push the earliest slot.
- Never simulate a successful order or payment. Demo mode ends on "Votre demande n'a pas été envoyée" + phone CTA.
- Minimal data: name + phone (email optional). Info notice linking to `/confidentialite/`, no pre-ticked boxes.
- Validation: inline on blur, error summary on submit that receives focus and links to fields, `aria-invalid` + `aria-describedby`.

## Phase 5 — Copy (French)

- Tutoiement never; vouvoiement, short sentences, concrete nouns (pétrin, banneton, sole, grigne).
- Ban list: "savoir-faire d'exception", "passion" in every paragraph, "artisanal" without proof, "le meilleur pain de Lyon", "fait maison" for bought-in items, any superlative without a source.
- Every factual statement (times, flour origin, fermentation hours) must come from Phase 1 or be marked as demo.
- Prices: "9,80 €" (narrow no-break space via `Intl.NumberFormat("fr-FR")`), always "TTC" somewhere on the page, price/kg for breads ≥ 200 g.

## Phase 6 — Motion & interaction

See `references/motion.md`. Budget: CSS for reveals and marquee; Motion for React for drawer, menu, cart badge, layout filtering. No GSAP/Three.js unless a specific effect needs it (Trame needed neither — 3D was evaluated and rejected: illustrations do the appetite job better at a fraction of the weight).

- Every animation has a reduced-motion path (global CSS kill-switch + `useReducedMotion`).
- Cursor halo never hides the native cursor; disabled on touch.
- `IntersectionObserver` gotcha: an element fully clipped by its own `clip-path` never intersects — observe the parent (see `components/SiteEffects.tsx`).
- SSR gotcha: trig/random values in client components must be rounded (`r2`) or hydration fails.
- Don't export plain constants from `"use client"` files for server components — they become client references (`lib/tints.ts` exists for that reason).

## Phase 7 — Local SEO

`references/seo.md`. Checklist:

- [ ] Unique `<title>` + 70–160 char description per page (`pageMeta`)
- [ ] One H1 per page, no skipped heading levels (axe `heading-order`)
- [ ] `Bakery` JSON-LD with address, geo, `openingHoursSpecification` from config; **no `aggregateRating` unless real**
- [ ] `Product` JSON-LD on product pages (Offer, EUR, InStoreOnly)
- [ ] Canonical, Open Graph image (1200×630), sitemap, robots
- [ ] Neighbourhood names only where geographically true (Croix-Rousse ≠ Presqu'île)
- [ ] Demo/staging: `robots: noindex` (driven by `bakery.isDemo`)

## Phase 8 — QA gate (do not skip)

```bash
npm run build
npx serve out -l 3000 &
node qa/e2e.mjs          # functional: nav, filters, cart maths, validation, keyboard, reduced motion, links, SEO
node qa/a11y.mjs         # axe WCAG 2.1 AA, 8 pages × 2 widths
node qa/screenshots.mjs  # 390/768/1024/1440 × pages + states → qa/shots/
node qa/lighthouse.mjs   # performance/a11y/SEO/best-practices, mobile
```

Then **look at the screenshots** — at least three passes (composition/type/images → motion/navigation → responsive/a11y polish). `references/qa-checklist.md` lists what to look for at each width and the 100-point scoring grid. Record real numbers in `docs/QA-REPORT.md`; never round up, never invent.

Acceptance: ≥ 90/100 overall, no category below 8/10, 0 axe violations, 0 console errors, all e2e green.
