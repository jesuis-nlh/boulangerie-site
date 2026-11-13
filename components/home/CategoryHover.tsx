"use client";

import { useRef, type ReactNode } from "react";

/**
 * Gère l'aperçu flottant des rayons directement dans le DOM (classes CSS),
 * sans re-rendu : les illustrations restent rendues par le serveur.
 */
export function CategoryHover({ children, className, floatClass, showClass }: { children: ReactNode; className: string; floatClass: string; showClass: string }) {
  const box = useRef<HTMLDivElement>(null);
  const show = (id: string | null) =>
    box.current?.querySelectorAll<HTMLElement>("[data-float]").forEach((el) => el.classList.toggle(showClass, el.dataset.float === id));
  const target = (e: React.SyntheticEvent) => (e.target as Element).closest<HTMLElement>("[data-cat]")?.dataset.cat ?? null;
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !box.current) return;
    const r = box.current.getBoundingClientRect();
    const f = box.current.querySelector<HTMLElement>(`.${floatClass}`);
    if (f) f.style.transform = `translate3d(${e.clientX - r.left}px, ${e.clientY - r.top}px, 0)`;
    show(target(e));
  };
  return (
    <div ref={box} className={className} onPointerMove={move} onPointerLeave={() => show(null)} onFocus={(e) => show(target(e))} onBlur={() => show(null)}>
      {children}
    </div>
  );
}
