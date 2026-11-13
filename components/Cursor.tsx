"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Cursor.module.css";

/**
 * Halo de curseur : n'enlève jamais le curseur natif. Il s'agrandit et
 * affiche un libellé sur les éléments [data-cursor="Voir"].
 * Désactivé sur écrans tactiles et si réduction des animations.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [on, setOn] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setOn(true);
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, raf = 0;
    const tick = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      if (ref.current) ref.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const el = (e.target as Element | null)?.closest?.("[data-cursor]");
      setLabel(el?.getAttribute("data-cursor") ?? "");
      setVisible(true);
    };
    const leave = () => setVisible(false);
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  if (!on) return null;
  return (
    <div ref={ref} className={`${styles.cursor} ${visible ? "" : styles.hidden} ${label ? styles.big : ""}`} aria-hidden="true">
      <span className={styles.label}>{label}</span>
    </div>
  );
}
