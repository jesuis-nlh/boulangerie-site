# QA checklist & scoring

## Per width
- **390** — CTAs above the fold; no horizontal scroll (`document.documentElement.scrollWidth === 390`); tap targets ≥ 44 px; chips scroll horizontally; menu sheet focus-trapped; drawer full width.
- **768** — hero stage below copy reads well; catalogue 2–3 columns; forms 2 columns.
- **1024** — sticky indexes engage; header shows menu button (nav appears ≥ 1180).
- **1440** — hero headline ≥ 150 px; no orphan words in H2s; max line length ~70ch.

## Visual passes
1. Composition / type / imagery: hierarchy, rag, image scale, colour balance per section, rhythm between light and dark sections.
2. Motion / navigation: reveal timing, no flashes of hidden content, sticky header behaviour, menu/drawer transitions, hover states.
3. Responsive / a11y polish: contrast (axe), focus rings visible on every surface (dark footer uses pink ring), reduced motion, zoom 200 %.

## Contrast references (computed)
- Ink #221c18 on paper #f3ebdd ≈ 15:1
- Praline-ink #b0265a on paper ≈ 5.8:1 (OK for body)
- Ink on praline #e2487a ≈ 4.4:1 ✗ for body → use `--praline-soft` #e8628c ≈ 5.3:1

## Scoring grid (100)
Art direction & identity 15 · Hero 15 · Typography & composition 10 · Imagery & consistency 15 · Animation & interaction 10 · Discovery & ordering 10 · Responsive & a11y 10 · Performance & tech 10 · Copy & credibility 5. Pass ≥ 90 with every category ≥ 8/10 (normalised). Justify each score with evidence (screenshot path, test output).
