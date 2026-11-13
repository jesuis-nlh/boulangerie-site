# Click & collect — rules

## Modes (`config.ordering.mode`)
- `demo` — full UI, nothing transmitted, final screen says so and offers the phone number. Use for prototypes only.
- `external` — the recap's primary button links to the provider (e.g. a click-and-collect SaaS the bakery already pays for). Cart stays local for browsing.
- `phone` — no online flow; `/commander/` shows the phone.

## Integrating a real provider (checklist)
1. Provider contract + GDPR sub-processor agreement signed by the bakery.
2. Catalogue sync: map `Product.slug` ↔ provider SKU; prices come from the provider (single source of truth).
3. Slots: provider's API if it has capacity rules; otherwise keep `lib/hours.ts` and send the chosen slot.
4. Payment: only through the provider's hosted page (PCI scope stays with them). Never collect card data here.
5. Confirmation: show success **only** after the provider's API confirms; display their order reference.
6. Failure: keep the cart, show the error and the phone number.
7. Update `/confidentialite/` (recipients, retention) and mentions légales (médiateur de la consommation for distance selling).

## Data minimisation
Name + phone are enough to hand over an order. Email optional. Free-text note max 300 chars. No account creation.

## Lead times
`ordering.leadTimeMinutes` (default 120) applies to everything; `product.leadTimeHours` (gâteaux = 48) overrides when larger. Slots are generated in Europe/Paris time whatever the visitor's timezone.
