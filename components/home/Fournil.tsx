"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Fournil.module.css";

const r2 = (n: number) => Math.round(n * 100) / 100;

const STEPS = [
  { t: "22 h", h: 22, verb: "Pétrir", text: "Farine, eau, sel et levain. Le pétrin tourne lentement, pour ne pas chauffer la pâte." },
  { t: "23 h", h: 23, verb: "Pointer", text: "Première fermentation, en bac. La pâte se détend, gonfle et commence à sentir la noisette." },
  { t: "2 h", h: 26, verb: "Façonner", text: "Chaque pâton est pesé puis façonné à la main : boule, bâtard, baguette." },
  { t: "3 h", h: 27, verb: "Laisser lever", text: "Deuxième pousse, au frais, dans des bannetons de lin farinés." },
  { t: "5 h", h: 29, verb: "Grigner, cuire", text: "Un coup de lame, puis le four à sole. Les miches crépitent en sortant." },
  { t: "7 h", h: 31, verb: "Ouvrir", text: "La vitrine se remplit, la porte s'ouvre. Les premiers habitués sont déjà là." },
];

/** « Le fournil, la nuit » : une horloge dont l'aiguille suit le défilement. */
export function Fournil() {
  const list = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  // Aiguilles et lueur mises à jour directement dans le DOM : pas de re-rendu par image.
  const hourRef = useRef<SVGLineElement>(null);
  const minRef = useRef<SVGLineElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const mid = innerHeight * 0.55;
      const prog = Math.min(1, Math.max(0, (mid - r.top) / r.height));
      const hours = 22 + prog * 9; // 22 h → 7 h
      hourRef.current?.setAttribute("transform", `rotate(${((hours % 12) * 30).toFixed(1)} 100 100)`);
      minRef.current?.setAttribute("transform", `rotate(${(prog * 9 * 360).toFixed(1)} 100 100)`);
      glowRef.current?.style.setProperty("opacity", (0.25 + prog * 0.75).toFixed(3));
      setActive(Math.min(STEPS.length - 1, Math.floor(prog * STEPS.length)));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => {
      removeEventListener("scroll", on);
      removeEventListener("resize", on);
    };
  }, []);

  return (
    <section id="savoir-faire" className={styles.section} aria-labelledby="fournil-title">
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.sticky}>
          <p className={`eyebrow ${styles.eyebrow}`}>Le savoir-faire</p>
          <h2 id="fournil-title" className={`h2 ${styles.title}`}>
            Pendant que la Croix-Rousse <em>dort</em>.
          </h2>
          <svg className={styles.clock} viewBox="0 0 200 200" role="img" aria-label={`Horloge du fournil : ${STEPS[active].t}, ${STEPS[active].verb}`}>
            <circle cx="100" cy="100" r="92" className={styles.face} />
            {Array.from({ length: 60 }, (_, i) => {
              const a = (i * 6 * Math.PI) / 180;
              const long = i % 5 === 0;
              return (
                <line
                  key={i}
                  x1={r2(100 + Math.sin(a) * (long ? 74 : 80))}
                  y1={r2(100 - Math.cos(a) * (long ? 74 : 80))}
                  x2={r2(100 + Math.sin(a) * 86)}
                  y2={r2(100 - Math.cos(a) * 86)}
                  className={long ? styles.tickL : styles.tick}
                />
              );
            })}
            <circle ref={glowRef} cx="100" cy="100" r="40" className={styles.glow} style={{ opacity: 0.25 }} />
            <line x1="100" y1="100" x2="100" y2="54" className={styles.hour} ref={hourRef} transform="rotate(300 100 100)" />
            <line x1="100" y1="100" x2="100" y2="32" className={styles.minute} ref={minRef} />
            <circle cx="100" cy="100" r="4" className={styles.pin} />
          </svg>
          <p className={styles.now} aria-hidden="true">
            <span className="mono">{STEPS[active].t}</span> {STEPS[active].verb}
          </p>
        </div>

        <ol ref={list} className={styles.steps}>
          {STEPS.map((s, i) => (
            <li key={s.t} className={i <= active ? styles.on : undefined}>
              <span className={`mono ${styles.time}`}>{s.t}</span>
              <h3 className={styles.verb}>{s.verb}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
      <p className={`wrap ${styles.disclaimer}`}>Horaires de fabrication donnés à titre d&apos;illustration (boulangerie fictive).</p>
    </section>
  );
}
