"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/Icon";

/** Récapitulatif d'erreurs (motif GOV.UK) : reçoit le focus, liens vers les champs. */
export function ErrorSummary({ errors, show }: { errors: Record<string, string>; show: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const entries = Object.entries(errors);
  useEffect(() => {
    if (show && entries.length) ref.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);
  if (!show || !entries.length) return null;
  return (
    <div ref={ref} tabIndex={-1} role="alert" className="error-summary" aria-labelledby="err-title">
      <p id="err-title">
        <Icon name="alert" size={18} /> {entries.length === 1 ? "Un point à corriger" : `${entries.length} points à corriger`}
      </p>
      <ul>
        {entries.map(([id, msg]) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.focus();
              }}
            >
              {msg}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
