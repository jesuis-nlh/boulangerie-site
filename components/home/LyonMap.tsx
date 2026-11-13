/** Plan schématique (non à l'échelle) : Saône, Rhône, Presqu'île, Croix-Rousse. */
export function LyonMap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 440" className={className} role="img" aria-label="Plan schématique : la boutique se situe sur les pentes de la Croix-Rousse, entre Saône et Rhône, au-dessus de l'Hôtel de Ville.">
      <rect width="400" height="440" fill="var(--paper-2)" />
      {/* courbes de niveau de la colline */}
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={212} cy={92} rx={150 - i * 26} ry={92 - i * 16} fill="none" stroke="var(--crust)" strokeOpacity={0.28 + i * 0.08} strokeWidth={1.2} strokeDasharray={i % 2 ? "3 5" : undefined} />
      ))}
      {/* Saône */}
      <path d="M40 0 C70 60 60 120 104 170 C140 212 128 280 150 330 C168 372 200 400 226 440" fill="none" stroke="var(--praline)" strokeWidth={16} strokeLinecap="round" opacity={0.85} style={{ mixBlendMode: "multiply" }} />
      {/* Rhône */}
      <path d="M400 70 C350 120 330 170 318 230 C306 296 288 360 252 440" fill="none" stroke="var(--praline)" strokeWidth={24} strokeLinecap="round" opacity={0.85} style={{ mixBlendMode: "multiply" }} />
      {/* rues schématiques */}
      <g stroke="var(--ink)" strokeOpacity={0.35} strokeWidth={1.2} fill="none">
        <path d="M150 200 L300 190" />
        <path d="M160 250 L296 246" />
        <path d="M170 300 L284 300" />
        <path d="M222 120 C226 160 230 180 232 196" strokeDasharray="2 4" strokeWidth={2} strokeOpacity={0.7} />
      </g>
      <g fontFamily="var(--f-mono), monospace" fontSize={11} fill="var(--ink)" letterSpacing={1}>
        <text x={168} y={70}>CROIX-ROUSSE</text>
        <text x={60} y={250} transform="rotate(-70 60 250)" fill="var(--praline-ink)">SAÔNE</text>
        <text x={336} y={300} transform="rotate(-72 336 300)" fill="var(--praline-ink)">RHÔNE</text>
        <text x={186} y={290}>PRESQU&apos;ÎLE</text>
        <text x={64} y={360}>VIEUX LYON</text>
        <text x={240} y={222} fontSize={10}>Hôtel de Ville</text>
      </g>
      {/* repère boutique */}
      <g transform="translate(232 170)">
        <circle r={22} fill="var(--ink)" opacity={0.12}>
          <animate attributeName="r" values="12;26;12" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle r={9} fill="var(--ink)" />
        <circle r={3.5} fill="var(--praline)" />
        <text x={16} y={-12} fontFamily="var(--font-display), serif" fontSize={22} fontStyle="italic" fill="var(--ink)">Trame</text>
      </g>
      <text x={12} y={428} fontFamily="var(--f-mono), monospace" fontSize={9} fill="var(--ink-3)">Schéma non à l&apos;échelle</text>
    </svg>
  );
}
