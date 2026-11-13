# Art direction — bakery

## Choosing a direction
| Business type | Direction that usually fits | Watch out for |
|---|---|---|
| Traditional artisan boulangerie | Heritage: paper, ink, serif, bread close-ups | Pastiche "à l'ancienne" clichés (fake chalkboards, script fonts) |
| Premium boulangerie-pâtisserie | Luxury pâtisserie: dark surfaces, dramatic light, restrained type | Over-gold, low contrast text on dark |
| Urban bakery-café | Editorial lifestyle: people, coffee, grid layouts | Generic "brunch" stock imagery |
| Organic / natural | Raw textures, grain, documentary photos | Green-washing words without certificates |
| Specialized (vegan, GF) | Clear, bright, information-first | Health claims (regulated) |

Pick one. Combining directions produces the generic look the client is paying to avoid.

## Photography shot list (when the client can shoot)
Shoot in the shop, morning light, one consistent set-up per series.
1. Hero: signature loaf, 3/4 angle, crust texture readable at 390 px width.
2. Crumb: loaf cut in half, macro, raking light.
3. Hands: shaping (no faces needed), flour in the air.
4. Oven: peel loading the sole oven, door open, steam.
5. Viennoiserie: croissant cross-section showing lamination.
6. Pâtisserie: signature tart from above + 45°.
7. Shopfront from the street (local recognition, used in Visit section).
8. Team portrait — only with written consent.
Deliver 2400 px long edge, sRGB; export AVIF + WebP; set `width`/`height` to avoid CLS.

## Risograph illustration system (no photos available)
- Base shape in `INK.wheat` → crust shading `INK.crust` with `mask="url(#shade-br)"` + multiply → halftone dots → flour dust.
- Scoring ("grignes") via `lens()`; highlight strokes in `INK.flour` at 0.6–0.75 opacity.
- Misregistered ink outline (`<Line>` translates by 3,-2) gives the printed feel. Keep it partial (bottom contour only).
- Grain filter `#riso`: displacement 5, hole matrix `0 0 0 -8 5.6`. Heavier grain makes dark items (entremets, coffee lid) look noisy.
- Always present on a tinted square (category tint) so items read as a set.
- Label as illustration (fig. caption, alt text "Illustration : …").

## Generated imagery (Higgsfield or similar)
Only with the client's authorisation and budget. Build a campaign, not singles: fixed seed/style references, same light direction, same surface. Never present outputs as the real shop, team or products; caption them. Prefer them for mood (flour, oven glow) over specific products whose look the customer will compare in store.
