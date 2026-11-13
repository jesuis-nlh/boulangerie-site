/**
 * Définitions SVG partagées par toutes les illustrations « risographie ».
 * Monté une seule fois dans le layout ; les illustrations y font référence
 * par url(#…). Les teintes viennent de INK (components/art/ink.ts).
 */
import { INK } from "./ink";

const dotPattern = (id: string, color: string, size: number, r: number, angle = 15) => (
  <pattern key={id} id={id} width={size} height={size} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
    <circle cx={size / 2} cy={size / 2} r={r} fill={color} />
  </pattern>
);

export function RisoDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        {/* Encre irrégulière : bords légèrement tremblés + micro-manques d'encre */}
        <filter id="riso" x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="5" xChannelSelector="R" yChannelSelector="G" result="shaky" />
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -8 5.6" result="holes" />
          <feComposite in="shaky" in2="holes" operator="in" />
        </filter>
        {/* Variante plus douce pour les petits formats */}
        <filter id="riso-soft" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="11" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {dotPattern("dots-crust", INK.crust, 7, 2.1)}
        {dotPattern("dots-crust-lg", INK.crust, 9, 3.4)}
        {dotPattern("dots-ink", INK.ink, 6, 1.5, 30)}
        {dotPattern("dots-ink-lg", INK.ink, 8, 2.6, 30)}
        {dotPattern("dots-pink", INK.praline, 7, 2.2, 75)}
        {dotPattern("dots-wheat", INK.wheat, 6, 1.8, 45)}
        {dotPattern("dots-flour", INK.flour, 9, 1.6, 10)}

        <pattern id="hatch-crust" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={INK.crust} strokeWidth="1.6" />
        </pattern>
        <pattern id="hatch-ink" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
          <line x1="0" y1="0" x2="0" y2="5" stroke={INK.ink} strokeWidth="1.2" />
        </pattern>

        {/* Farine : poudrage irrégulier */}
        <pattern id="flour-dust" width="38" height="38" patternUnits="userSpaceOnUse">
          {[
            [4, 6, 1.6], [17, 3, 1], [29, 9, 2], [9, 19, 1.2], [23, 22, 1.7], [34, 28, 1], [6, 32, 2.1], [18, 34, 1.1], [30, 17, 0.9], [13, 11, 0.8],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={INK.flour} />
          ))}
        </pattern>

        {/* Masques d'ombrage réutilisables (relatifs à la forme masquée) */}
        <linearGradient id="g-br" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0.38" stopColor="#000" />
          <stop offset="0.95" stopColor="#fff" />
        </linearGradient>
        <linearGradient id="g-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.42" stopColor="#000" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <linearGradient id="g-tl" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0.05" stopColor="#fff" />
          <stop offset="0.55" stopColor="#000" />
        </linearGradient>
        <linearGradient id="g-t" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.6" stopColor="#000" />
        </linearGradient>
        <mask id="shade-br" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#g-br)" /></mask>
        <mask id="shade-b" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#g-b)" /></mask>
        <mask id="shade-tl" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#g-tl)" /></mask>
        <mask id="shade-t" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#g-t)" /></mask>

        {/* Ombre portée tramée, fondue sur les bords */}
        <radialGradient id="shadow-fade">
          <stop offset="0.35" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask id="shadow-mask" maskContentUnits="objectBoundingBox">
          <rect width="1" height="1" fill="url(#shadow-fade)" />
        </mask>
      </defs>
    </svg>
  );
}
