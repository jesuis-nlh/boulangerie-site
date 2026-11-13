"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Comportements globaux, sans dépendance :
 * - révélations au défilement ([data-reveal]) ;
 * - boutons « magnétiques » ([data-magnetic]) ;
 * Tout est neutralisé si l'utilisateur préfère réduire les animations.
 */
export function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    // Un élément entièrement masqué par son propre clip-path n'est jamais
    // « visible » pour IntersectionObserver : on observe alors son parent.
    const targets = new Map<Element, HTMLElement[]>();
    els.forEach((el) => {
      const t = el.dataset.reveal === "mask" && el.parentElement ? el.parentElement : el;
      targets.set(t, [...(targets.get(t) ?? []), el]);
    });
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            targets.get(e.target)?.forEach((el) => el.classList.add("is-in"));
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    targets.forEach((_, t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    const fine = matchMedia("(pointer: fine)").matches;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    const onMove = (e: PointerEvent) => {
      const t = (e.target as Element | null)?.closest?.<HTMLElement>("[data-magnetic]");
      document.querySelectorAll<HTMLElement>("[data-magnetic].is-magnet").forEach((el) => {
        if (el !== t) {
          el.classList.remove("is-magnet");
          el.style.transform = "";
        }
      });
      if (!t) return;
      const r = t.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * 0.22;
      const y = (e.clientY - (r.top + r.height / 2)) * 0.3;
      t.classList.add("is-magnet");
      t.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
