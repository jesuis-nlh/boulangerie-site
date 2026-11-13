/**
 * Illustrations produits « risographie » — dessinées en SVG.
 *
 * Choix de direction artistique : en l'absence de photographies réelles de la
 * boutique, le site utilise une série d'illustrations imprimées (trois encres,
 * trame de points, grain, léger décalage de repérage) plutôt que des visuels
 * génériques. Chaque illustration peut être remplacée par une photographie via
 * `ProductVisual` (voir components/ProductVisual.tsx) dès que la boutique en fournit.
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

/** Une forme cuite : base + ombrage croûte + trame de points. */
function Baked({ d, base = INK.wheat, crust = 0.85, dots = true, flour = false }: { d: string; base?: string; crust?: number; dots?: boolean; flour?: boolean }) {
  return (
    <g>
      <path d={d} fill={base} />
      <path d={d} fill={INK.crust} mask="url(#shade-br)" opacity={crust} style={MUL} />
      {dots && <path d={d} fill="url(#dots-crust)" mask="url(#shade-b)" opacity={0.9} style={MUL} />}
      {flour && <path d={d} fill="url(#flour-dust)" mask="url(#shade-tl)" />}
    </g>
  );
}

function Cut({ d }: { d: string }) {
  return (
    <g>
      <path d={d} fill={INK.cream} />
      <path d={d} fill="url(#dots-wheat)" opacity={0.7} />
    </g>
  );
}

/** Trait d'encre décalé (défaut de repérage volontaire). */
function Line({ d, w = 2.6, o = 0.85 }: { d: string; w?: number; o?: number }) {
  return (
    <path d={d} fill="none" stroke={INK.ink} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={o} transform="translate(3 -2)" />
  );
}

// ————————————————————————————————————————————— Pains

const BOULE = "M58 248 C52 150 128 92 200 92 C276 92 350 150 342 248 C338 300 292 320 200 320 C108 320 62 300 58 248Z";

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
      <Shadow cx={205} cy={322} rx={168} ry={30} />
      <Baked d={BOULE} flour />
      {[...A, ...B].map(([a, b, c, d], i) => (
        <Cut key={i} d={lens(a, b, c, d, 11, 0.25)} />
      ))}
      <Line d="M66 262 C78 304 130 320 200 320 C270 320 322 304 334 262" />
      <Line d="M92 160 C120 118 160 100 200 98" w={2} o={0.55} />
    </g>
  );
}

function Demi() {
  const d = "M88 250 C84 175 140 128 200 128 C262 128 318 175 312 250 C309 290 270 306 200 306 C130 306 92 290 88 250Z";
  return (
    <g>
      <Shadow cx={203} cy={308} rx={138} ry={24} />
      <Baked d={d} flour />
      <Cut d={lens(120, 250, 286, 168, 18, 0.2)} />
      <Line d="M96 262 C106 294 142 306 200 306 C258 306 294 294 304 262" />
    </g>
  );
}

function Baguette() {
  const d = "M36 206 C36 182 66 168 108 166 L300 160 C346 160 370 178 370 200 C370 223 346 238 300 238 L108 242 C66 242 36 230 36 206Z";
  return (
    <g transform="rotate(-18 200 200)">
      <Shadow cx={205} cy={262} rx={180} ry={20} />
      <Baked d={d} crust={0.7} />
      {[64, 120, 176, 232, 288].map((x) => (
        <Cut key={x} d={lens(x, 214, x + 58, 186, 9, 0.2)} />
      ))}
      <Line d="M46 222 C60 240 90 242 108 242 L300 238 C340 238 362 226 368 210" />
    </g>
  );
}

function Seigle() {
  const d = "M54 228 C54 168 120 140 200 140 C282 140 348 168 348 228 C348 282 284 300 200 300 C118 300 54 282 54 228Z";
  const r = rng(9);
  const cracks = Array.from({ length: 9 }, (_, i) => {
    const x = r2(92 + i * 26 + r() * 10);
    const y = r2(160 + r() * 20);
    return `M${x} ${y} l${r2(8 + r() * 10)} ${r2(18 + r() * 12)} l${r2(-6 + r() * 14)} ${r2(16 + r() * 14)} l${r2(6 + r() * 8)} ${r2(14 + r() * 10)}`;
  });
  return (
    <g>
      <Shadow cx={203} cy={302} rx={160} ry={26} />
      <path d={d} fill={INK.dark} />
      <path d={d} fill={INK.ink} mask="url(#shade-br)" opacity={0.6} style={MUL} />
      <path d={d} fill={INK.flour} mask="url(#shade-t)" opacity={0.95} />
      <path d={d} fill="url(#flour-dust)" />
      {cracks.map((c, i) => (
        <path key={i} d={c} stroke={INK.dark} strokeWidth={4.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ))}
      <Line d="M62 244 C76 286 130 300 200 300 C272 300 330 286 342 244" />
    </g>
  );
}

function Noix() {
  const d = "M44 214 C44 166 110 146 200 146 C292 146 356 166 356 214 C356 262 292 280 200 280 C110 280 44 262 44 214Z";
  const r = rng(4);
  const nuts = Array.from({ length: 14 }, () => ({ x: r2(70 + r() * 260), y: r2(168 + r() * 90), s: r2(0.7 + r() * 0.6), a: r2(r() * 180) }));
  return (
    <g>
      <Shadow cx={202} cy={282} rx={168} ry={24} />
      <Baked d={d} base={INK.wheat} crust={1} />
      <path d={d} fill={INK.crust} opacity={0.35} style={MUL} />
      <Cut d={lens(80, 220, 320, 196, 16, 0.2)} />
      {nuts.map((n, i) => (
        <g key={i} transform={`translate(${n.x} ${n.y}) rotate(${n.a}) scale(${n.s})`}>
          <path d="M-11 -6 C-14 5 -5 11 0 7 C5 11 14 5 11 -6 C7 -11 2 -7 0 -10 C-2 -7 -7 -11 -11 -6Z" fill={INK.crust} />
          <path d="M0 -8 V6 M-6 -3 q3 3 0 6 M6 -3 q-3 3 0 6" stroke={INK.dark} strokeWidth={1.6} fill="none" />
        </g>
      ))}
      <Line d="M52 230 C66 268 120 280 200 280 C282 280 336 268 350 230" />
    </g>
  );
}

function Courge() {
  const d = "M74 236 C70 160 132 118 200 118 C270 118 332 160 326 236 C322 290 276 310 200 310 C124 310 78 290 74 236Z";
  const r = rng(21);
  const seeds = Array.from({ length: 34 }, () => ({ x: r2(96 + r() * 210), y: r2(138 + r() * 150), a: r2(r() * 180) }));
  return (
    <g>
      <Shadow cx={203} cy={312} rx={146} ry={26} />
      <Baked d={d} base="#D9803A" />
      {[0, 60, 120, 180, 240, 300].map((a) => {
        const rad = (a * Math.PI) / 180;
        return <Cut key={a} d={lens(200 + Math.cos(rad) * 18, 206 + Math.sin(rad) * 14, 200 + Math.cos(rad) * 92, 206 + Math.sin(rad) * 70, 9, 0.2)} />;
      })}
      {seeds.map((s, i) => (
        <ellipse key={i} cx={s.x} cy={s.y} rx={5} ry={2.4} transform={`rotate(${s.a} ${s.x} ${s.y})`} fill={i % 3 ? INK.cream : INK.ink} opacity={i % 3 ? 1 : 0.7} />
      ))}
      <Line d="M82 250 C94 296 136 310 200 310 C266 310 308 296 318 250" />
    </g>
  );
}

// ————————————————————————————————————————————— Viennoiseries

function Lobe({ cx, cy, rx, ry, rot, lines = 3 }: { cx: number; cy: number; rx: number; ry: number; rot: number; lines?: number }) {
  const d = `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${rx * 2} 0 a${rx} ${ry} 0 1 0 ${-rx * 2} 0Z`;
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      <Baked d={d} />
      {Array.from({ length: lines }, (_, i) => {
        const y = r2(cy - ry * 0.5 + (i * ry * 1.1) / lines);
        return <path key={i} d={`M${cx - rx * 0.78} ${y + ry * 0.25} Q${cx} ${y - ry * 0.18} ${cx + rx * 0.78} ${y + ry * 0.25}`} stroke={INK.crust} strokeWidth={2.2} fill="none" opacity={0.75} style={MUL} />;
      })}
    </g>
  );
}

function Croissant() {
  return (
    <g>
      <Shadow cx={202} cy={292} rx={170} ry={24} />
      <Lobe cx={58} cy={268} rx={22} ry={16} rot={-52} lines={1} />
      <Lobe cx={342} cy={268} rx={22} ry={16} rot={52} lines={1} />
      <Lobe cx={92} cy={244} rx={40} ry={32} rot={-38} lines={2} />
      <Lobe cx={308} cy={244} rx={40} ry={32} rot={38} lines={2} />
      <Lobe cx={140} cy={220} rx={56} ry={50} rot={-18} />
      <Lobe cx={260} cy={220} rx={56} ry={50} rot={18} />
      <Lobe cx={200} cy={206} rx={70} ry={66} rot={0} lines={4} />
      <path d="M160 168 Q190 150 222 156" stroke={INK.flour} strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.75} />
      <Line d="M136 262 C160 276 240 276 264 262" />
    </g>
  );
}

function PainChoc() {
  const top = "M96 170 L284 156 C300 156 312 166 312 178 L314 200 L104 214 C92 214 84 206 84 194 L84 186 C84 177 88 171 96 170Z";
  const front = "M84 194 C84 206 92 214 104 214 L314 200 L316 252 C316 262 306 270 294 270 L108 278 C94 278 84 270 84 258Z";
  return (
    <g>
      <Shadow cx={202} cy={284} rx={150} ry={22} />
      <Baked d={front} crust={1} />
      <Baked d={top} crust={0.6} />
      {[226, 240, 254].map((y) => (
        <path key={y} d={`M92 ${y + 4} L312 ${y - 10}`} stroke={INK.crust} strokeWidth={2.4} opacity={0.8} style={MUL} />
      ))}
      <ellipse cx={104} cy={236} rx={9} ry={6} fill={INK.ink} />
      <ellipse cx={106} cy={258} rx={9} ry={6} fill={INK.ink} />
      <path d="M120 176 L260 166" stroke={INK.flour} strokeWidth={6} strokeLinecap="round" opacity={0.6} />
      <Line d="M86 262 C92 274 100 278 110 278 L294 270" />
    </g>
  );
}

function Brioche() {
  const d = "M62 250 C56 196 92 140 140 130 C160 104 240 104 260 130 C310 140 346 196 338 250 C334 296 290 314 200 314 C110 314 66 296 62 250Z";
  const r = rng(5);
  const pr = Array.from({ length: 30 }, () => ({ x: r2(90 + r() * 220), y: r2(132 + r() * 160), s: r2(0.6 + r() * 0.9), a: r2(r() * 360) }));
  return (
    <g>
      <Shadow cx={203} cy={316} rx={162} ry={28} />
      <Baked d={d} crust={1} />
      <path d={d} fill={INK.crust} opacity={0.4} style={MUL} />
      <path d="M118 198 C150 230 190 214 214 246 M226 150 C238 190 278 196 286 232 M150 150 C168 170 190 160 206 180" stroke={INK.praline} strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.8} style={MUL} />
      {pr.map((p, i) => (
        <path key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.a}) scale(${p.s})`} d="M-9 -4 L-2 -10 L9 -6 L10 4 L1 10 L-8 6Z" fill={INK.praline} style={MUL} />
      ))}
      <path d="M128 150 Q160 126 200 126" stroke={INK.flour} strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.55} />
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
      <path d="M150 220 Q190 196 230 184 M200 222 Q240 206 270 204" stroke={INK.flour} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.7} />
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
      <path d={top} fill={INK.dark} />
      <path d={top} fill="url(#dots-crust-lg)" opacity={0.9} />
      <path d="M150 176 Q200 166 250 162" stroke={INK.ink} strokeWidth={6} opacity={0.4} fill="none" strokeLinecap="round" />
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
      <Line d="M46 246 C70 296 140 316 200 316 C262 316 330 296 354 246" />
    </g>
  );
}

function Entremets() {
  return (
    <g>
      <Shadow cx={204} cy={300} rx={160} ry={28} />
      <path d="M86 186 V268 a114 34 0 0 0 228 0 V186Z" fill={INK.ink} />
      <path d="M86 186 V268 a114 34 0 0 0 228 0 V186Z" fill="url(#hatch-ink)" opacity={0.6} />
      <path d="M100 210 C102 236 112 228 112 252 M150 214 C152 248 164 238 162 262 M246 214 C248 240 258 236 256 258 M292 206 C294 230 300 226 300 244" stroke={INK.coffee} strokeWidth={4} strokeLinecap="round" opacity={0.7} fill="none" />
      <ellipse cx={200} cy={186} rx={114} ry={34} fill="#3B2A23" />
      <path d="M120 182 Q170 160 250 166" stroke={INK.cream} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.55} />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} transform={`translate(${150 + i * 13} ${r2(186 + Math.sin(i) * 6)}) rotate(${i * 40})`} d="M-6 -3 L-1 -7 L6 -4 L7 3 L0 7 L-5 4Z" fill={INK.praline} />
      ))}
      <path d="M176 176 l10 -6 l8 6 l-10 4Z M214 180 l8 -5 l6 5 l-8 3Z" fill={INK.wheat} />
      <Line d="M88 270 C100 296 150 304 200 304 C250 304 300 296 312 270" />
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
        <Cut key={x0} d={lens(x0, 178, x0 + 52, 156, 7, 0.2)} />
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
