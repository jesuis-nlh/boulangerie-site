/**
 * Illustrations produits « risographie » — dessinées en SVG.
 *
 * Choix de direction artistique : en l'absence de photographies réelles de la
 * boutique, le site utilise une série d'illustrations imprimées (trois encres,
 * trame de points, grain, léger décalage de repérage) plutôt que des visuels
 * génériques. Pour passer à de vraies photos, remplacer `<ProductArt>` par une
 * image (AVIF/WebP, largeur et hauteur fixées) là où il est utilisé.
 */
import type { CSSProperties, ReactNode } from "react";
import type { ArtId } from "@/data/products";
import { INK } from "./ink";

const MUL: CSSProperties = { mixBlendMode: "multiply" };

/** Grigne : entaille en amande, plus ouverte d'un côté (l'« oreille »). */
function lens(x1: number, y1: number, x2: number, y2: number, w: number, back = 0.3) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const L = Math.hypot(x2 - x1, y2 - y1);
  const nx = (-(y2 - y1) / L) * w;
  const ny = ((x2 - x1) / L) * w;
  return `M${r2(x1)} ${r2(y1)} Q${r2(mx + nx)} ${r2(my + ny)} ${r2(x2)} ${r2(y2)} Q${r2(mx - nx * back)} ${r2(my - ny * back)} ${r2(x1)} ${r2(y1)}Z`;
}

/** Arrondi : évite les écarts de flottants entre serveur et navigateur. */
const r2 = (n: number) => Math.round(n * 100) / 100;

/** Générateur pseudo-aléatoire déterministe (rendu identique serveur/client). */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function Shadow({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#dots-ink)" opacity={0.5} mask="url(#shadow-mask)" />;
}

/**
 * Une forme cuite, en cinq passages d'encre :
 * base · reflet (volume) · ombrage de croûte · bord cuit · cloques et trame.
 */
function Baked({ d, base = INK.wheat, crust = 0.85, dots = true, flour = false, blister = true, hi = 0.55 }: { d: string; base?: string; crust?: number; dots?: boolean; flour?: boolean; blister?: boolean; hi?: number }) {
  return (
    <g>
      <path d={d} fill={base} />
      <path d={d} fill={INK.cream} mask="url(#hi-tl)" opacity={hi} />
      <path d={d} fill={INK.crust} mask="url(#shade-br)" opacity={crust} style={MUL} />
      <path d={d} fill={INK.dark} mask="url(#rim-b)" opacity={0.55} style={MUL} />
      {blister && <path d={d} fill="url(#blister)" opacity={0.32} style={MUL} />}
      {dots && <path d={d} fill="url(#dots-crust)" mask="url(#shade-b)" opacity={0.8} style={MUL} />}
      {flour && <path d={d} fill="url(#flour-dust)" mask="url(#shade-tl)" />}
    </g>
  );
}

/**
 * Grigne ouverte : mie claire au fond, « oreille » soulevée d'un côté
 * (arête claire + ombre portée dans l'entaille), comme sur une vraie miche.
 */
function Grigne({ x1, y1, x2, y2, w, back = 0.25, flour = false }: { x1: number; y1: number; x2: number; y2: number; w: number; back?: number; flour?: boolean }) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const L = Math.hypot(x2 - x1, y2 - y1);
  const nx = -(y2 - y1) / L;
  const ny = (x2 - x1) / L;
  const P = (k: number) => `${r2(mx + nx * w * k)} ${r2(my + ny * w * k)}`;
  const a = `${r2(x1)} ${r2(y1)}`;
  const b = `${r2(x2)} ${r2(y2)}`;
  return (
    <g>
      <path d={`M${a} Q${P(1)} ${b} Q${P(-back)} ${a}Z`} fill={flour ? INK.flour : INK.cream} />
      <path d={`M${a} Q${P(1)} ${b} Q${P(-back)} ${a}Z`} fill="url(#crumb)" opacity={0.75} style={MUL} />
      {/* ombre de l'oreille dans l'entaille */}
      <path d={`M${a} Q${P(1)} ${b} Q${P(0.45)} ${a}Z`} fill={INK.crust} opacity={0.55} style={MUL} />
      {/* arête de l'oreille, plus cuite, avec un reflet */}
      <path d={`M${a} Q${P(1.08)} ${b}`} fill="none" stroke={INK.dark} strokeWidth={2.4} strokeLinecap="round" opacity={0.7} style={MUL} />
      <path d={`M${a} Q${P(1.35)} ${b}`} fill="none" stroke={INK.flour} strokeWidth={1.6} strokeLinecap="round" opacity={0.65} />
    </g>
  );
}

/** Compatibilité : grigne simple à partir d'un tracé `lens()`. */
function Cut({ d }: { d: string }) {
  return (
    <g>
      <path d={d} fill={INK.cream} />
      <path d={d} fill="url(#crumb)" opacity={0.75} style={MUL} />
    </g>
  );
}

/** Trait d'encre décalé (défaut de repérage volontaire). */
function Line({ d, w = 2.6, o = 0.85 }: { d: string; w?: number; o?: number }) {
  return (
    <path d={d} fill="none" stroke={INK.ink} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={o} transform="translate(3 -2)" />
  );
}

/**
 * Tranche / face coupée : demi-ellipse de mie alvéolée bordée de croûte.
 * Les alvéoles sont tirées au hasard (déterministe) à l'intérieur de la forme.
 */
function Slice({ cx, base, rx, ry, seed, dark = false }: { cx: number; base: number; rx: number; ry: number; seed: number; dark?: boolean }) {
  const outer = `M${cx - rx} ${base} A${rx} ${ry} 0 0 1 ${cx + rx} ${base} Q${cx} ${base + 7} ${cx - rx} ${base}Z`;
  const t = 9;
  const irx = rx - t;
  const iry = ry - t;
  const inner = `M${cx - irx} ${base - 4} A${irx} ${iry} 0 0 1 ${cx + irx} ${base - 4} Q${cx} ${base} ${cx - irx} ${base - 4}Z`;
  const r = rng(seed);
  const holes: { x: number; y: number; a: number; b: number; t: number }[] = [];
  for (let i = 0; holes.length < 34 && i < 600; i++) {
    const x = cx - irx + r() * irx * 2;
    const y = base - 8 - r() * iry;
    const s = 2 + Math.pow(r(), 2.2) * 11;
    const e = ((x - cx) / (irx - s - 3)) ** 2 + ((y - (base - 4)) / (iry - s - 3)) ** 2;
    if (e > 1 || y > base - s - 6) continue;
    if (holes.some((h) => Math.hypot(h.x - x, h.y - y) < h.a + s * 1.2 + 2)) continue;
    holes.push({ x: r2(x), y: r2(y), a: r2(s * (1 + r() * 0.5)), b: r2(s * (0.6 + r() * 0.3)), t: r2(-25 + r() * 50) });
  }
  return (
    <g>
      <path d={outer} fill={dark ? INK.dark : INK.crust} />
      <path d={outer} fill={INK.dark} mask="url(#shade-br)" opacity={0.6} style={MUL} />
      <path d={inner} fill={dark ? "#C7A07A" : INK.cream} />
      <path d={inner} fill={INK.wheat} mask="url(#edge)" opacity={0.6} style={MUL} />
      <path d={inner} fill="url(#crumb)" opacity={0.7} style={MUL} />
      {holes.map((h, i) => (
        <g key={i} transform={`rotate(${h.t} ${h.x} ${h.y})`}>
          <ellipse cx={h.x} cy={h.y} rx={h.a} ry={h.b} fill={INK.wheat} opacity={0.9} style={MUL} />
          <ellipse cx={r2(h.x + h.a * 0.18)} cy={r2(h.y - h.b * 0.22)} rx={r2(h.a * 0.78)} ry={r2(h.b * 0.62)} fill={INK.crust} opacity={0.42} style={MUL} />
        </g>
      ))}
    </g>
  );
}

// ————————————————————————————————————————————— Pains

const BOULE = "M58 248 C52 150 128 92 200 92 C276 92 350 150 342 248 C338 300 292 320 200 320 C108 320 62 300 58 248Z";

/** La Trame : miche grignée en croisillon + une tranche qui montre la mie. */
function Trame() {
  const A: [number, number, number, number][] = [
    [104, 196, 214, 120],
    [122, 248, 270, 140],
    [164, 284, 306, 186],
  ];
  const B: [number, number, number, number][] = [
    [180, 116, 300, 206],
    [124, 146, 262, 262],
    [98, 204, 196, 290],
  ];
  return (
    <g>
      <Shadow cx={214} cy={330} rx={176} ry={28} />
      <g transform="translate(-26 -4) scale(0.9)">
        <Baked d={BOULE} flour crust={0.95} />
        {B.map(([a, b, c, d], i) => (
          <Grigne key={`b${i}`} x1={a} y1={b} x2={c} y2={d} w={16} />
        ))}
        {A.map(([a, b, c, d], i) => (
          <Grigne key={`a${i}`} x1={a} y1={b} x2={c} y2={d} w={16} />
        ))}
        <path d={BOULE} fill="url(#flour-dust)" mask="url(#shade-t)" opacity={0.8} />
        <Line d="M66 262 C78 304 130 320 200 320 C270 320 322 304 334 262" />
      </g>
      <g transform="rotate(-7 300 330)">
        <Slice cx={300} base={330} rx={78} ry={106} seed={11} />
        <Line d="M222 330 A78 106 0 0 1 300 224" w={2} o={0.6} />
      </g>
    </g>
  );
}

/** Demi-Trame : la miche coupée, face de mie vers nous. */
function Demi() {
  const back = "M96 262 C92 186 146 136 214 136 C282 136 330 186 326 262 C322 296 286 310 214 310 Z";
  return (
    <g>
      <Shadow cx={206} cy={316} rx={146} ry={24} />
      <Baked d={back} flour crust={1} />
      <Grigne x1={150} y1={176} x2={300} y2={210} w={17} />
      <path d={back} fill="url(#flour-dust)" mask="url(#shade-t)" opacity={0.8} />
      <Slice cx={186} base={316} rx={112} ry={118} seed={4} />
      <Line d="M76 316 A112 118 0 0 1 186 198" w={2.2} o={0.6} />
    </g>
  );
}

function Baguette() {
  const d = "M36 206 C36 182 66 168 108 166 L300 160 C346 160 370 178 370 200 C370 223 346 238 300 238 L108 242 C66 242 36 230 36 206Z";
  return (
    <g transform="rotate(-18 200 200)">
      <Shadow cx={205} cy={262} rx={180} ry={20} />
      <Baked d={d} crust={0.75} hi={0.6} />
      {[64, 120, 176, 232, 288].map((x) => (
        <Grigne key={x} x1={x} y1={216} x2={x + 62} y2={184} w={13} back={0.15} />
      ))}
      <path d="M40 206 C40 228 70 240 108 240" stroke={INK.dark} strokeWidth={3} fill="none" opacity={0.35} style={MUL} />
      <Line d="M46 222 C60 240 90 242 108 242 L300 238 C340 238 362 226 368 210" />
    </g>
  );
}

/**
 * Seigle des Pentes : bâtard sombre fariné, grigné de cinq entailles
 * parallèles peu ouvertes (la pâte de seigle se développe peu).
 */
function Seigle() {
  const d = "M54 228 C54 168 120 140 200 140 C282 140 348 168 348 228 C348 282 284 300 200 300 C118 300 54 282 54 228Z";
  return (
    <g>
      <Shadow cx={203} cy={302} rx={160} ry={26} />
      <path d={d} fill={INK.dark} />
      <path d={d} fill={INK.crust} mask="url(#hi-tl)" opacity={0.7} />
      <path d={d} fill={INK.ink} mask="url(#shade-br)" opacity={0.45} style={MUL} />
      <path d={d} fill="url(#blister)" opacity={0.4} style={MUL} />
      {/* farine du banneton, plus dense au sommet */}
      <path d={d} fill={INK.flour} mask="url(#shade-t)" opacity={0.85} />
      <path d={d} fill="url(#flour-dust)" mask="url(#hi-tl)" />
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 104 + i * 44;
        return (
          <g key={i}>
            <path d={lens(x, 262, x + 44, 162, 6, 0.3)} fill={INK.crust} />
            <path d={lens(x, 262, x + 44, 162, 6, 0.3)} fill="url(#crumb)" opacity={0.6} style={MUL} />
            <path d={`M${x} 262 Q${x + 28} 214 ${x + 44} 162`} stroke={INK.flour} strokeWidth={1.6} fill="none" opacity={0.7} transform="translate(-3 0)" />
            <path d={`M${x} 262 Q${x + 18} 210 ${x + 44} 162`} stroke={INK.ink} strokeWidth={1.8} fill="none" opacity={0.6} transform="translate(3 1)" />
          </g>
        );
      })}
      <path d={d} fill={INK.dark} mask="url(#rim-b)" opacity={0.5} style={MUL} />
      <Line d="M62 244 C76 286 130 300 200 300 C272 300 330 286 342 244" />
    </g>
  );
}

function Walnut({ x, y, s, a }: { x: number; y: number; s: number; a: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      <path d="M-12 -2 C-14 -9 -7 -12 -3 -9 C-1 -12 1 -12 3 -9 C7 -12 14 -9 12 -2 C14 5 7 11 2 8 C1 11 -1 11 -2 8 C-7 11 -14 5 -12 -2Z" fill="#A8693A" />
      <path d="M-12 -2 C-14 -9 -7 -12 -3 -9 C-1 -12 1 -12 3 -9 C7 -12 14 -9 12 -2 C14 5 7 11 2 8 C1 11 -1 11 -2 8 C-7 11 -14 5 -12 -2Z" fill={INK.dark} mask="url(#shade-br)" opacity={0.45} style={MUL} />
      <path d="M0 -9 V8 M-8 -4 q4 2 1 7 M8 -4 q-4 2 -1 7" stroke={INK.dark} strokeWidth={1.3} fill="none" opacity={0.8} />
      <path d="M-8 -6 q3 -3 6 -1" stroke={INK.cream} strokeWidth={1.4} fill="none" opacity={0.7} />
    </g>
  );
}

function Noix() {
  const d = "M44 214 C44 166 110 146 200 146 C292 146 356 166 356 214 C356 262 292 280 200 280 C110 280 44 262 44 214Z";
  const r = rng(4);
  const nuts = Array.from({ length: 9 }, () => ({ x: r2(80 + r() * 240), y: r2(178 + r() * 64), s: r2(0.95 + r() * 0.4), a: r2(r() * 180) }));
  return (
    <g>
      <Shadow cx={202} cy={282} rx={168} ry={24} />
      <Baked d={d} base={INK.wheat} crust={1} />
      <path d={d} fill={INK.crust} opacity={0.3} style={MUL} />
      <Grigne x1={74} y1={222} x2={326} y2={192} w={18} />
      {nuts.map((n, i) => (
        <Walnut key={i} {...n} />
      ))}
      <Walnut x={176} y={204} s={1.1} a={20} />
      <Walnut x={236} y={200} s={0.95} a={-30} />
      <Line d="M52 230 C66 268 120 280 200 280 C282 280 336 268 350 230" />
    </g>
  );
}

function Courge() {
  const d = "M74 236 C70 160 132 118 200 118 C270 118 332 160 326 236 C322 290 276 310 200 310 C124 310 78 290 74 236Z";
  const r = rng(21);
  const seeds = Array.from({ length: 40 }, () => ({ x: r2(96 + r() * 210), y: r2(134 + r() * 160), a: r2(r() * 180) }));
  return (
    <g>
      <Shadow cx={203} cy={312} rx={146} ry={26} />
      <Baked d={d} base="#D98038" crust={0.9} />
      {[0, 60, 120, 180, 240, 300].map((a) => {
        const rad = (a * Math.PI) / 180;
        return <Grigne key={a} x1={200 + Math.cos(rad) * 20} y1={208 + Math.sin(rad) * 15} x2={200 + Math.cos(rad) * 98} y2={208 + Math.sin(rad) * 74} w={10} back={0.15} />;
      })}
      {seeds.map((s, i) => (
        <g key={i} transform={`rotate(${s.a} ${s.x} ${s.y})`}>
          <ellipse cx={s.x} cy={s.y} rx={5.2} ry={2.6} fill={i % 4 === 0 ? "#3E5A2E" : INK.cream} />
          <ellipse cx={s.x} cy={r2(s.y + 0.8)} rx={5.2} ry={1.4} fill={INK.crust} opacity={0.35} style={MUL} />
        </g>
      ))}
      <Line d="M82 250 C94 296 136 310 200 310 C266 310 308 296 318 250" />
    </g>
  );
}

// ————————————————————————————————————————————— Viennoiseries

/**
 * Croissant : silhouette en croissant, segments enroulés séparés par des
 * sillons sombres, stries de feuilletage et dorure brillante.
 */
function Croissant() {
  const body =
    "M34 296 C30 270 52 236 86 218 C104 172 150 138 200 136 C250 138 296 172 314 218 C348 236 370 270 366 296 C340 300 314 288 292 282 C264 292 234 298 200 298 C166 298 136 292 108 282 C86 288 60 300 34 296Z";
  // sillons entre les tours de pâte : [x haut, y haut, x bas, y bas, courbure]
  const seams: [number, number, number, number, number][] = [
    [96, 214, 104, 284, -12],
    [140, 158, 146, 292, -20],
    [260, 158, 254, 292, 20],
    [304, 214, 296, 284, 12],
  ];
  const strata = (x0: number, x1: number, ys: number[], bend: number) =>
    ys.map((y) => `M${x0} ${y} Q${(x0 + x1) / 2} ${y + bend} ${x1} ${y}`).join(" ");
  return (
    <g>
      <Shadow cx={202} cy={304} rx={176} ry={22} />
      <Baked d={body} crust={0.95} hi={0.5} blister={false} />
      {/* bouts plus cuits */}
      <path d="M34 296 C30 270 52 236 86 218 C92 250 96 270 108 282 C86 288 60 300 34 296Z M366 296 C370 270 348 236 314 218 C308 250 304 270 292 282 C314 288 340 300 366 296Z" fill={INK.crust} opacity={0.45} style={MUL} />
      {/* stries de feuilletage */}
      <path d={strata(150, 252, [170, 196, 222, 248, 272], -16) + " " + strata(104, 140, [214, 240, 264], -8) + " " + strata(262, 298, [214, 240, 264], -8)} stroke={INK.crust} strokeWidth={1.6} fill="none" opacity={0.6} style={MUL} />
      {/* sillons */}
      {seams.map(([x1, y1, x2, y2, c], i) => (
        <g key={i}>
          <path d={`M${x1} ${y1} Q${(x1 + x2) / 2 + c} ${(y1 + y2) / 2} ${x2} ${y2}`} stroke={INK.dark} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.75} style={MUL} />
          <path d={`M${x1 + (c > 0 ? -5 : 5)} ${y1 + 4} Q${(x1 + x2) / 2 + c + (c > 0 ? -6 : 6)} ${(y1 + y2) / 2} ${x2 + (c > 0 ? -5 : 5)} ${y2 - 4}`} stroke={INK.cream} strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.55} />
        </g>
      ))}
      {/* dorure : reflets */}
      <path d="M168 160 Q200 146 234 158" stroke="url(#gloss)" strokeWidth={9} strokeLinecap="round" fill="none" />
      <path d="M108 216 Q120 200 136 196 M264 196 Q282 200 292 216" stroke={INK.flour} strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.55} />
      <Line d="M108 284 C140 296 170 300 200 300 C232 300 262 296 292 284" />
    </g>
  );
}

/** Pain au chocolat : pâton roulé, tranche visible avec spirale et deux barres. */
function PainChoc() {
  const body = "M70 214 C70 184 92 170 122 168 L286 160 C318 160 334 178 334 204 L334 248 C334 268 318 280 292 280 L118 286 C88 286 70 272 70 252Z";
  const end = "M70 214 C70 190 84 178 98 178 C114 178 126 192 126 214 L126 254 C126 274 112 286 98 286 C84 286 70 274 70 254Z";
  return (
    <g>
      <Shadow cx={204} cy={292} rx={156} ry={20} />
      <Baked d={body} crust={1} />
      <path d="M126 176 L300 168" stroke="url(#gloss)" strokeWidth={10} strokeLinecap="round" />
      {/* feuilletage sur le côté */}
      <path d="M128 240 L330 232 M128 258 L330 250 M130 274 L320 268" stroke={INK.crust} strokeWidth={1.8} opacity={0.65} style={MUL} />
      {/* tranche : spirale de feuilletage + chocolat */}
      <path d={end} fill={INK.cream} />
      <path d={end} fill="url(#crumb)" opacity={0.8} style={MUL} />
      <path d="M78 214 C78 196 88 186 98 186 C110 186 118 198 118 214 L118 252 C118 268 108 278 98 278 C88 278 78 268 78 252Z M86 220 C86 206 92 198 98 198 C106 198 110 208 110 220 L110 248 C110 260 104 268 98 268 C92 268 86 260 86 248Z" fill="none" stroke={INK.wheat} strokeWidth={2.4} opacity={0.9} style={MUL} />
      <path d={end} fill="none" stroke={INK.crust} strokeWidth={4} opacity={0.9} style={MUL} />
      <rect x={88} y={210} width={20} height={11} rx={2} fill={INK.ink} />
      <rect x={88} y={244} width={20} height={11} rx={2} fill={INK.ink} />
      <path d="M91 212 h10 M91 246 h10" stroke={INK.coffee} strokeWidth={2} opacity={0.8} />
      <Line d="M72 262 C76 280 92 286 118 286 L292 280 C318 280 334 268 334 248" />
    </g>
  );
}

/** Brioche aux pralines : dôme doré et brillant, pralines roses qui affleurent. */
function Brioche() {
  const d = "M62 250 C56 196 92 140 140 130 C160 104 240 104 260 130 C310 140 346 196 338 250 C334 296 290 314 200 314 C110 314 66 296 62 250Z";
  const r = rng(5);
  const pr = Array.from({ length: 34 }, () => ({ x: r2(88 + r() * 224), y: r2(132 + r() * 160), s: r2(0.55 + r() * 0.9), a: r2(r() * 360) }));
  const inBody = (p: { x: number; y: number }) => ((p.x - 200) / 132) ** 2 + ((p.y - 222) / 92) ** 2 < 1;
  const chunk = "M-9 -4 L-2 -10 L9 -6 L10 4 L1 10 L-8 6Z";
  return (
    <g>
      <Shadow cx={203} cy={316} rx={162} ry={28} />
      <Baked d={d} crust={1} hi={0.45} />
      <path d={d} fill={INK.crust} opacity={0.38} style={MUL} />
      {/* sucre de praline fondu et caramélisé */}
      <path d="M118 198 C150 230 190 214 214 246 M226 150 C238 190 278 196 286 232 M150 150 C168 170 190 160 206 180 M260 252 C276 262 296 258 306 246" stroke={INK.praline} strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.75} style={MUL} />
      {pr.filter(inBody).map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.a}) scale(${p.s})`}>
          <path d={chunk} fill={INK.praline} />
          <path d="M1 10 L-8 6 L-9 -4 L-3 1Z" fill={INK.crust} opacity={0.5} style={MUL} />
          <circle cx={3} cy={-4} r={1.8} fill={INK.flour} opacity={0.85} />
        </g>
      ))}
      {/* brillance de la dorure */}
      <path d="M118 158 Q160 120 214 118" stroke="url(#gloss)" strokeWidth={14} strokeLinecap="round" fill="none" />
      <path d="M262 142 Q288 156 300 178" stroke={INK.flour} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.5} />
      <Line d="M70 264 C84 302 132 314 200 314 C268 314 318 302 330 264" />
    </g>
  );
}

function Chausson() {
  const d = "M58 262 C56 166 150 112 236 120 C310 128 352 190 344 262 C300 278 110 280 58 262Z";
  return (
    <g>
      <Shadow cx={202} cy={282} rx={160} ry={22} />
      <Baked d={d} crust={0.9} />
      <path d="M92 250 C140 190 210 156 300 168" stroke={INK.crust} strokeWidth={3} fill="none" opacity={0.9} style={MUL} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 122 + i * 32;
        const y = 222 - i * 12;
        return (
          <g key={i}>
            <path d={`M${x} ${y} l-14 -30`} stroke={INK.crust} strokeWidth={2.6} opacity={0.85} style={MUL} />
            <path d={`M${x} ${y} l14 28`} stroke={INK.crust} strokeWidth={2.6} opacity={0.85} style={MUL} />
          </g>
        );
      })}
      <path d="M64 262 C110 280 300 278 344 262" stroke={INK.crust} strokeWidth={8} strokeDasharray="3 7" fill="none" opacity={0.9} />
      <path d="M150 150 Q190 128 240 132" stroke={INK.flour} strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.6} />
      <Line d="M60 268 C120 286 290 286 342 268" />
    </g>
  );
}

// ————————————————————————————————————————————— Pâtisseries

function TartePart({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  const top = "M96 248 L228 146 C268 150 314 172 336 206 Z";
  const side = "M96 248 L336 206 L336 238 L96 282 Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow cx={214} cy={282} rx={150} ry={20} />
      <path d={side} fill={INK.praline} />
      <path d="M96 268 L336 226 L336 238 L96 282Z" fill={INK.wheat} />
      <path d="M96 268 L336 226 L336 238 L96 282Z" fill="url(#dots-crust)" style={MUL} />
      <path d={side} fill="url(#dots-pink)" opacity={0.7} style={MUL} />
      <path d={top} fill={INK.praline} />
      <path d={top} fill={INK.crust} opacity={0.35} mask="url(#shade-br)" style={MUL} />
      <path d="M228 146 C268 150 314 172 336 206" stroke={INK.wheat} strokeWidth={20} strokeLinecap="round" fill="none" />
      <path d="M228 146 C268 150 314 172 336 206" stroke="url(#dots-crust)" strokeWidth={20} strokeLinecap="round" fill="none" style={MUL} />
      {/* éclats de pralines dans la garniture */}
      {Array.from({ length: 22 }, (_, i) => {
        const r = rng(30 + i);
        const u = r(), v = r() * (1 - u);
        const px = r2(96 + (228 - 96) * u + (336 - 96) * v), py = r2(248 + (146 - 248) * u + (206 - 248) * v);
        return <path key={i} transform={`translate(${px} ${py}) rotate(${r2(r() * 360)}) scale(${r2(0.4 + r() * 0.5)})`} d="M-6 -3 L-1 -7 L6 -4 L7 3 L0 7 L-5 4Z" fill={INK.crust} opacity={0.4} style={MUL} />;
      })}
      <path d="M160 214 Q200 190 246 180" stroke="url(#gloss)" strokeWidth={9} strokeLinecap="round" fill="none" />
      <path d="M206 222 Q246 206 276 204" stroke={INK.flour} strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.6} />
      <Line d="M96 282 L336 238" />
    </g>
  );
}

function Flan() {
  const top = "M112 168 L268 150 L316 178 L160 198Z";
  const front = "M112 168 L160 198 L160 296 L112 266Z";
  const side = "M160 198 L316 178 L316 272 L160 296Z";
  return (
    <g>
      <Shadow cx={214} cy={298} rx={150} ry={20} />
      <path d={side} fill="#EFBF5C" />
      <path d={front} fill="#E3AE4A" />
      <path d={front} fill="url(#dots-crust)" opacity={0.5} style={MUL} />
      <path d="M160 280 L316 258 L316 272 L160 296Z M112 252 L160 280 L160 296 L112 266Z" fill={INK.wheat} />
      <path d="M160 280 L316 258 L316 272 L160 296Z" fill="url(#dots-crust)" style={MUL} />
      {/* crème : reflet + grains de vanille */}
      <path d={side} fill={INK.cream} mask="url(#hi-tl)" opacity={0.55} />
      {Array.from({ length: 26 }, (_, i) => {
        const r = rng(60 + i);
        const u = r(), v = r();
        return <ellipse key={i} cx={r2(166 + u * 144)} cy={r2(206 + v * 52 - u * 20)} rx={1.3} ry={0.8} fill={INK.ink} opacity={0.55} />;
      })}
      <path d={top} fill={INK.dark} />
      <path d={top} fill={INK.crust} mask="url(#hi-tl)" opacity={0.8} />
      <path d={top} fill="url(#blister)" opacity={0.7} style={MUL} />
      <path d="M150 178 Q200 166 252 162" stroke="url(#gloss)" strokeWidth={7} opacity={0.7} fill="none" strokeLinecap="round" />
      <Line d="M160 296 L316 272 M160 198 L160 296" />
    </g>
  );
}

function Eclair() {
  const body = "M66 200 C66 176 84 164 112 164 L290 158 C318 158 336 172 336 196 C336 222 318 236 290 236 L112 240 C84 240 66 226 66 200Z";
  const glaze = "M70 194 C70 174 88 164 112 164 L290 158 C316 158 332 170 334 190 C300 204 110 210 70 194Z";
  return (
    <g transform="rotate(-8 200 200)">
      <Shadow cx={204} cy={256} rx={160} ry={18} />
      <Baked d={body} crust={0.9} />
      <path d={glaze} fill={INK.coffee} />
      <path d={glaze} fill="url(#dots-ink)" opacity={0.35} />
      <path d="M110 176 L270 170" stroke={INK.cream} strokeWidth={5} strokeLinecap="round" opacity={0.75} />
      <Line d="M72 214 C80 232 98 240 112 240 L290 236 C316 236 332 224 334 210" />
    </g>
  );
}

function MilleFeuille() {
  const layers = [
    { y: 268, h: 22, c: INK.wheat, pastry: true },
    { y: 240, h: 28, c: INK.cream, pastry: false },
    { y: 218, h: 22, c: INK.wheat, pastry: true },
    { y: 190, h: 28, c: INK.cream, pastry: false },
    { y: 170, h: 20, c: INK.wheat, pastry: true },
  ];
  const X0 = 90, X1 = 270, DX = 52, DY = -30;
  return (
    <g>
      <Shadow cx={214} cy={292} rx={160} ry={20} />
      {layers.map((l, i) => (
        <g key={i}>
          <path d={`M${X0} ${l.y} H${X1} V${l.y + l.h} H${X0}Z`} fill={l.c} />
          <path d={`M${X1} ${l.y} L${X1 + DX} ${l.y + DY} V${l.y + l.h + DY} L${X1} ${l.y + l.h}Z`} fill={l.c} />
          <path d={`M${X1} ${l.y} L${X1 + DX} ${l.y + DY} V${l.y + l.h + DY} L${X1} ${l.y + l.h}Z`} fill={INK.crust} opacity={0.25} style={MUL} />
          {l.pastry && <path d={`M${X0} ${l.y} H${X1} V${l.y + l.h} H${X0}Z`} fill="url(#hatch-crust)" opacity={0.8} style={MUL} />}
        </g>
      ))}
      <path d={`M${X0} 170 L${X0 + DX} ${170 + DY} H${X1 + DX} L${X1} 170Z`} fill={INK.flour} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M${X0 + 14 + i * 32} 168 L${X0 + 14 + i * 32 + DX * 0.9} ${168 + DY * 0.9}`} stroke={INK.coffee} strokeWidth={2.4} opacity={0.8} />
      ))}
      <path d={`M${X0 + 20} 154 Q${X0 + 120} 150 ${X1 + 30} 144`} stroke={INK.coffee} strokeWidth={1.8} fill="none" opacity={0.6} />
      <Line d={`M${X0} 290 H${X1} L${X1 + DX} ${290 + DY}`} />
    </g>
  );
}

function TarteEntiere() {
  const r = rng(8);
  const flutes = Array.from({ length: 36 }, (_, i) => (i / 36) * Math.PI * 2);
  return (
    <g>
      <Shadow cx={204} cy={300} rx={170} ry={34} />
      <ellipse cx={200} cy={228} rx={156} ry={86} fill={INK.wheat} />
      <path d="M44 228 a156 86 0 0 0 312 0 v20 a156 86 0 0 1 -312 0Z" fill={INK.wheat} />
      <path d="M44 228 a156 86 0 0 0 312 0 v20 a156 86 0 0 1 -312 0Z" fill="url(#dots-crust)" style={MUL} />
      {flutes.map((a, i) => (
        <circle key={i} cx={r2(200 + Math.cos(a) * 150)} cy={r2(228 + Math.sin(a) * 82)} r={8} fill={INK.wheat} />
      ))}
      <ellipse cx={200} cy={228} rx={156} ry={86} fill={INK.crust} mask="url(#shade-br)" opacity={0.5} style={MUL} />
      <ellipse cx={200} cy={226} rx={128} ry={68} fill={INK.praline} />
      <ellipse cx={200} cy={226} rx={128} ry={68} fill={INK.crust} mask="url(#shade-br)" opacity={0.3} style={MUL} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2 + 0.3;
        return <path key={i} d={`M200 226 L${r2(200 + Math.cos(a) * 126)} ${r2(226 + Math.sin(a) * 66)}`} stroke={INK.dark} strokeWidth={1.6} opacity={0.45} />;
      })}
      {Array.from({ length: 7 }, (_, i) => (
        <ellipse key={i} cx={r2(140 + r() * 120)} cy={r2(196 + r() * 50)} rx={r2(10 + r() * 8)} ry={3} fill={INK.flour} opacity={0.6} />
      ))}
      {Array.from({ length: 30 }, (_, i) => {
        const r = rng(90 + i);
        const a = r() * Math.PI * 2;
        const k = Math.sqrt(r()) * 0.9;
        return <path key={i} transform={`translate(${r2(200 + Math.cos(a) * 124 * k)} ${r2(226 + Math.sin(a) * 64 * k)}) rotate(${r2(r() * 360)}) scale(${r2(0.4 + r() * 0.5)})`} d="M-6 -3 L-1 -7 L6 -4 L7 3 L0 7 L-5 4Z" fill={INK.crust} opacity={0.38} style={MUL} />;
      })}
      <path d="M128 200 Q190 172 262 178" stroke="url(#gloss)" strokeWidth={10} strokeLinecap="round" fill="none" />
      <Line d="M46 246 C70 296 140 316 200 316 C262 316 330 296 354 246" />
    </g>
  );
}

/** Le Canut : entremets glacé miroir, et une part qui montre ses couches. */
function Entremets() {
  const glaze = "#3A2620";
  const drips = [104, 132, 170, 214, 250, 286];
  // part : couches de haut en bas (épaisseur, couleur)
  const layers: [number, string][] = [
    [5, glaze],
    [20, "#7A4A33"],
    [7, "#D7A462"],
    [12, "#4A2E22"],
    [9, INK.wheat],
  ];
  let acc = 0;
  return (
    <g>
      <Shadow cx={208} cy={318} rx={176} ry={26} />
      <g transform="translate(-34 -18) scale(0.9)">
        <path d="M86 186 V268 a114 34 0 0 0 228 0 V186Z" fill={glaze} />
        <path d="M86 186 V268 a114 34 0 0 0 228 0 V186Z" fill={INK.ink} mask="url(#shade-br)" opacity={0.7} style={MUL} />
        <path d="M112 204 L136 210 L136 296 L112 288Z" fill="url(#gloss)" opacity={0.5} />
        {drips.map((x, i) => (
          <path key={x} d={`M${x - 7} 200 V${222 + (i % 3) * 9} a7 7 0 0 0 14 0 V200Z`} fill={glaze} />
        ))}
        <ellipse cx={200} cy={186} rx={114} ry={34} fill={glaze} />
        <ellipse cx={200} cy={186} rx={114} ry={34} fill={INK.coffee} mask="url(#hi-tl)" opacity={0.8} />
        <path d="M118 182 Q160 160 236 162" stroke="url(#gloss)" strokeWidth={7} strokeLinecap="round" fill="none" />
        {Array.from({ length: 11 }, (_, i) => (
          <g key={i} transform={`translate(${140 + i * 12} ${r2(194 - Math.sin((i / 10) * Math.PI) * 14)}) rotate(${i * 37})`}>
            <path d="M-6 -3 L-1 -7 L6 -4 L7 3 L0 7 L-5 4Z" fill={INK.praline} />
            <circle cx={2} cy={-3} r={1.3} fill={INK.flour} opacity={0.8} />
          </g>
        ))}
        <path d="M232 170 l12 -7 l9 7 l-12 5Z M248 182 l9 -5 l7 5 l-9 3Z" fill={INK.wheat} />
        <Line d="M88 270 C100 296 150 304 200 304 C250 304 300 296 312 270" />
      </g>
      <g transform="translate(120 128) scale(0.66)">
        <path d="M96 248 L228 146 C268 150 314 172 336 206 Z" fill={glaze} />
        <path d="M96 248 L228 146 C268 150 314 172 336 206 Z" fill={INK.coffee} mask="url(#hi-tl)" opacity={0.7} />
        <path d="M150 220 Q210 180 280 186" stroke="url(#gloss)" strokeWidth={8} strokeLinecap="round" fill="none" />
        {layers.map(([h, c], i) => {
          const y0 = acc;
          acc += h * 1.6;
          return <path key={i} d={`M96 ${248 + y0} L336 ${206 + y0} L336 ${r2(206 + acc)} L96 ${r2(248 + acc)}Z`} fill={c} />;
        })}
        <path d={`M96 ${r2(248 + acc - 14)} L336 ${r2(206 + acc - 14)} L336 ${r2(206 + acc)} L96 ${r2(248 + acc)}Z`} fill="url(#dots-crust)" style={MUL} />
        <path d={`M96 248 L336 206 L336 ${r2(206 + acc)} L96 ${r2(248 + acc)}Z`} fill={INK.ink} mask="url(#shade-br)" opacity={0.25} style={MUL} />
        <Line d={`M96 ${r2(248 + acc)} L336 ${r2(206 + acc)}`} />
      </g>
    </g>
  );
}

// ————————————————————————————————————————————— Déjeuner & boissons

function Sandwich({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  const bottom = "M40 230 C40 214 64 206 100 206 L300 202 C340 202 362 212 362 228 C362 246 340 256 300 256 L100 258 C64 258 40 248 40 230Z";
  const top = "M46 194 C46 166 76 152 112 150 L296 146 C336 146 358 162 358 186 C358 196 340 200 300 200 L100 204 C68 204 46 202 46 194Z";
  const ham = "M46 206 q12 -12 24 0 q12 12 24 0 q12 -12 24 0 q12 12 24 0 q12 -12 24 0 q12 12 24 0 q12 -12 24 0 q12 12 24 0 q12 -12 24 0 q12 12 24 0 q12 -12 24 0 q12 12 24 0 q12 -12 24 0 L358 214 L46 216Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(-8 200 200)`}>
      <Shadow cx={204} cy={270} rx={176} ry={18} />
      <Baked d={bottom} crust={1} />
      <path d="M44 204 L358 200" stroke={INK.cream} strokeWidth={8} strokeLinecap="round" />
      <path d={ham} fill={INK.praline} opacity={0.92} />
      <path d={ham} fill="url(#dots-pink)" opacity={0.5} style={MUL} />
      <Baked d={top} crust={0.7} />
      {[80, 150, 220, 290].map((x0) => (
        <Grigne key={x0} x1={x0} y1={180} x2={x0 + 54} y2={156} w={8} back={0.15} />
      ))}
      <Line d="M44 240 C56 254 80 258 100 258 L300 256 C336 256 356 248 362 236" />
    </g>
  );
}

function Cup({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow cx={200} cy={318} rx={96} ry={16} />
      <path d="M134 120 L266 120 L248 312 C246 318 236 322 200 322 C164 322 154 318 152 312Z" fill={INK.flour} />
      <path d="M134 120 L266 120 L248 312 C246 318 236 322 200 322 C164 322 154 318 152 312Z" fill="url(#dots-ink)" mask="url(#shade-br)" opacity={0.5} />
      <path d="M140 180 L260 180 L252 262 L148 262Z" fill={INK.praline} />
      <text x={200} y={232} textAnchor="middle" fontFamily="var(--font-display), serif" fontSize={40} fill={INK.flour} fontStyle="italic">T</text>
      <path d="M124 104 L276 104 C282 104 284 108 284 114 L284 122 L116 122 L116 114 C116 108 118 104 124 104Z" fill={INK.ink} />
      <path d="M150 96 L250 96 L262 104 L138 104Z" fill={INK.ink} />
      <path d="M186 80 C176 64 196 52 186 36 M214 82 C204 66 224 54 214 38" stroke={INK.ink} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.5} />
      <Line d="M150 312 C156 320 170 322 200 322 C232 322 246 318 250 312" />
    </g>
  );
}

function Chocolat() {
  return (
    <g>
      <Shadow cx={200} cy={302} rx={150} ry={22} />
      <ellipse cx={200} cy={286} rx={148} ry={30} fill={INK.cream} />
      <ellipse cx={200} cy={286} rx={148} ry={30} fill="url(#dots-ink)" mask="url(#shade-b)" opacity={0.45} />
      <path d="M296 182 C346 182 350 252 296 252" stroke={INK.flour} strokeWidth={18} fill="none" />
      <path d="M296 182 C346 182 350 252 296 252" stroke="url(#dots-ink)" strokeWidth={18} fill="none" opacity={0.4} />
      <path d="M104 160 L296 160 L286 262 C284 282 250 292 200 292 C150 292 116 282 114 262Z" fill={INK.flour} />
      <path d="M104 160 L296 160 L286 262 C284 282 250 292 200 292 C150 292 116 282 114 262Z" fill="url(#dots-ink)" mask="url(#shade-br)" opacity={0.55} />
      <path d="M104 196 L296 196" stroke={INK.praline} strokeWidth={10} opacity={0.9} />
      <ellipse cx={200} cy={160} rx={96} ry={22} fill={INK.flour} />
      <ellipse cx={200} cy={162} rx={84} ry={17} fill="#5A3424" />
      <path d="M160 156 Q190 148 220 150" stroke={INK.coffee} strokeWidth={4} fill="none" opacity={0.9} strokeLinecap="round" />
      <path d="M178 128 C168 110 190 98 178 80 M214 130 C204 112 226 100 214 82" stroke={INK.ink} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.5} />
      <Line d="M114 262 C116 282 150 292 200 292 C250 292 284 282 286 262" />
    </g>
  );
}

function Formule() {
  return (
    <g>
      <Sandwich x={-10} y={-20} s={0.66} />
      <Cup x={190} y={60} s={0.62} />
      <TartePart x={30} y={140} s={0.58} />
    </g>
  );
}

const ART: Record<ArtId, () => ReactNode> = {
  trame: Trame,
  demi: Demi,
  baguette: Baguette,
  seigle: Seigle,
  noix: Noix,
  courge: Courge,
  croissant: Croissant,
  painchoc: PainChoc,
  brioche: Brioche,
  chausson: Chausson,
  tartepart: () => <TartePart />,
  flan: Flan,
  eclair: Eclair,
  millefeuille: MilleFeuille,
  tarteentiere: TarteEntiere,
  entremets: Entremets,
  sandwich: () => <Sandwich />,
  formule: Formule,
  cafe: () => <Cup />,
  chocolat: Chocolat,
};

export function ProductArt({ id, label, className, style }: { id: ArtId; label?: string; className?: string; style?: CSSProperties }) {
  const Draw = ART[id];
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      style={{ isolation: "isolate", overflow: "visible", ...style }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {/* Un seul filtre « encre » par illustration (et non par forme) : ~15× moins de calculs de rendu */}
      <g filter="url(#riso)">
        <Draw />
      </g>
    </svg>
  );
}
