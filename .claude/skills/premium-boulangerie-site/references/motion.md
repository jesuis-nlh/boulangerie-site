# Motion & interaction language

| Element | Technique | Timing | Reduced motion |
|---|---|---|---|
| H1 lines | CSS mask slide-up | 1.25 s, ease-out expo, 150 ms stagger | instant |
| Thread under H1 | SVG stroke-dashoffset | 2.2 s after 0.9 s | drawn |
| Hero layers | pointer parallax (CSS vars from rAF), 3 depths | lerp 0.08 | disabled |
| Section reveals | `[data-reveal]` + IntersectionObserver | 0.9–1.1 s | visible |
| Image reveals | `[data-reveal="mask"]` clip-path | 1.3 s | visible |
| Manifesto | word opacity scrubbed by scroll | — | full opacity |
| Night clock | hands rotate with scroll progress | — | static (still readable) |
| Ticker | CSS marquee 48 s, pauses on hover | — | stopped |
| Cart badge | Motion spring (520/18) keyed on add | — | no scale |
| Drawer / menu | Motion x / clip-path | 0.55–0.6 s | opacity fade |
| Catalogue filter | Motion layout + popLayout | 0.45 s | opacity |
| Buttons | ink fill from bottom + magnetic offset | 0.45 s | colour only |

Principles: motion explains (thread = "fil à fil", clock = night work), never decorates for its own sake; exit faster than enter; nothing blocks input; everything works without JS (content visible, links real).
