"use client";

import { useEffect, useRef } from "react";
import { PunchCard } from "@/components/PunchCard";
import styles from "./Manifesto.module.css";

const TEXT =
  "Trame est née d'une idée simple : un bon pain se tisse comme une étoffe. Une chaîne — la farine, l'eau, le sel. Une trame — le temps, la main, le feu. Entre les deux, le levain fait le reste, à son rythme, pas au nôtre.";

/**
 * Paragraphe-manifeste dont les mots s'encrent au fil du défilement.
 * État « non encré » : #8c7f74 (≥ 3:1 sur le papier, seuil des grands textes).
 */
export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-w]"));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => w.style.setProperty("--k", "100%"));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const start = innerHeight * 0.85;
      const end = innerHeight * 0.35;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height * 0.6)));
      const n = p * words.length;
      words.forEach((w, i) => w.style.setProperty("--k", `${Math.round(100 * Math.min(1, Math.max(0, n - i)))}%`));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="histoire" className={`section ${styles.section}`} aria-labelledby="histoire-title">
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.side}>
          <h2 id="histoire-title" className="eyebrow">
            Notre histoire
          </h2>
          <PunchCard className={styles.card} cols={6} rows={9} seed={2} />
          <p className={styles.note}>
            Les canuts de la Croix-Rousse tissaient la soie sur des métiers Jacquard, guidés par des cartons perforés. Nous en avons
            gardé le nom, et le goût du travail lent.
          </p>
        </div>
        <p ref={ref} className={styles.text}>
          {TEXT.split(" ").map((w, i) => (
            <span key={i} data-w>
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
