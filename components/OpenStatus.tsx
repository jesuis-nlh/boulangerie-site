"use client";

import { useEffect, useState } from "react";
import { openStatus, type OpenStatus as S } from "@/lib/hours";

/** Statut calculé côté client (heure de Lyon) pour éviter un état figé au build. */
export function OpenStatus({ className = "" }: { className?: string }) {
  const [s, setS] = useState<S | null>(null);
  useEffect(() => {
    const update = () => setS(openStatus());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={`status ${s?.open ? "status--open" : ""} ${className}`} aria-live="polite">
      <span className="status__dot" aria-hidden="true" />
      <span>{s ? s.label : "Horaires d'ouverture"}</span>
    </span>
  );
}
