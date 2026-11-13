/**
 * Marque Trame : un « carton Jacquard » (grille perforée 3×3, comme les
 * cartes des métiers à tisser des canuts) + le mot-symbole en Instrument Serif.
 */
const HOLES = [1, 0, 1, 0, 1, 0, 1, 1, 0]; // le motif lit un « T » tissé

export function Mark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 30 30" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      <rect x="0.75" y="0.75" width="28.5" height="28.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {HOLES.map((on, i) => {
        const x = 8 + (i % 3) * 7;
        const y = 8 + Math.floor(i / 3) * 7;
        return on ? <circle key={i} cx={x} cy={y} r="2.3" fill="currentColor" /> : <circle key={i} cx={x} cy={y} r="2.1" fill="none" stroke="currentColor" strokeWidth="1" opacity=".55" />;
      })}
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem" }}>
      <Mark />
      <span style={{ fontFamily: "var(--f-display)", fontSize: "1.9rem", lineHeight: 1, letterSpacing: "-0.01em" }}>Trame</span>
    </span>
  );
}
