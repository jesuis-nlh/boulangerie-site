"use client";

import { Icon } from "@/components/Icon";
import { bakery } from "@/config/bakery";

export function QtyStepper({ value, onChange, label, min = 0 }: { value: number; onChange: (n: number) => void; label: string; min?: number }) {
  const max = bakery.ordering.maxQuantityPerLine;
  return (
    <div className="stepper" role="group" aria-label={`Quantité — ${label}`}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Retirer un ${label}`}>
        <Icon name="minus" />
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`Ajouter un ${label}`}>
        <Icon name="plus" />
      </button>
    </div>
  );
}
