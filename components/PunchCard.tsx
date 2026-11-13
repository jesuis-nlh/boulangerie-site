/**
 * Motif « carton perforé » — signature graphique de la marque.
 * `pattern` : chaîne de 0/1 (1 = perforé). Purement décoratif.
 */
export function PunchCard({ cols = 12, rows = 6, seed = 3, className, style }: { cols?: number; rows?: number; seed?: number; className?: string; style?: React.CSSProperties }) {
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const cells = Array.from({ length: cols * rows }, () => rnd() > 0.52);
  const W = cols * 14 + 10;
  const H = rows * 14 + 10;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} style={style} aria-hidden="true" focusable="false">
      {cells.map((on, i) => (
        <circle key={i} cx={12 + (i % cols) * 14} cy={12 + Math.floor(i / cols) * 14} r={on ? 4 : 1.4} fill="currentColor" opacity={on ? 1 : 0.45} />
      ))}
    </svg>
  );
}
