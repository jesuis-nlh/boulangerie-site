"use client";

import { useEffect, useState, type ReactNode } from "react";
import { lyonNow } from "@/lib/hours";
import type { DayKey } from "@/config/bakery";

/** Ligne du tableau d'horaires, mise en avant si c'est aujourd'hui (heure de Lyon). */
export function TodayRow({ day, children }: { day: DayKey; children: ReactNode }) {
  const [today, setToday] = useState(false);
  useEffect(() => setToday(lyonNow().day === day), [day]);
  return (
    <tr data-today={today || undefined} aria-current={today ? "date" : undefined}>
      {children}
    </tr>
  );
}
