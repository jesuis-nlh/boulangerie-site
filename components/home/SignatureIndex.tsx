"use client";

import { useEffect, useState } from "react";
import styles from "./Signatures.module.css";

/** Index collant : suit le tableau visible au centre de l'écran. */
export function SignatureIndex({ items }: { items: { slug: string; name: string }[] }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.sig))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    document.querySelectorAll("[data-sig]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <nav className={styles.index} aria-label="Signatures">
      <ol>
        {items.map((p, i) => (
          <li key={p.slug}>
            <a href={`#sig-${p.slug}`} aria-current={active === i ? "true" : undefined}>
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              {p.name}
            </a>
          </li>
        ))}
      </ol>
      <div className={styles.progress} aria-hidden="true">
        <span style={{ transform: `scaleY(${(active + 1) / items.length})` }} />
      </div>
    </nav>
  );
}
