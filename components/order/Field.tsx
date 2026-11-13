import type { ReactNode } from "react";
import { Icon } from "@/components/Icon";

export function Field({ id, label, hint, error, children, optional }: { id: string; label: string; hint?: string; error?: string; children: ReactNode; optional?: boolean }) {
  return (
    <div className="field" data-invalid={error ? "true" : undefined}>
      <label htmlFor={id}>
        {label} {optional && <span style={{ fontWeight: 400, color: "var(--ink-3)" }}>(facultatif)</span>}
      </label>
      {children}
      {hint && (
        <span className="hint" id={`${id}-hint`}>
          {hint}
        </span>
      )}
      {error && (
        <span className="error" id={`${id}-err`}>
          <Icon name="alert" size={16} /> {error}
        </span>
      )}
    </div>
  );
}

export const describedBy = (id: string, hint?: boolean, error?: string) => [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
