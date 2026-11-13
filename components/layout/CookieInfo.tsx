"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";

/**
 * Le site ne dépose aucun cookie de mesure ni de publicité : seul le panier est
 * mémorisé dans le navigateur (stockage local), à la demande de l'utilisateur.
 * D'où un panneau d'information plutôt qu'un bandeau de consentement.
 * Si un outil de mesure ou une carte intégrée est ajouté, remplacer par un
 * vrai gestionnaire de consentement (voir docs/COMPLIANCE.md).
 */
export function CookieInfo({ className }: { className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [cleared, setCleared] = useState(false);
  useEffect(() => {
    const d = ref.current;
    const close = (e: MouseEvent) => e.target === d && d?.close();
    d?.addEventListener("click", close);
    return () => d?.removeEventListener("click", close);
  }, []);
  return (
    <>
      <button type="button" className={className} onClick={() => ref.current?.showModal()}>
        Cookies
      </button>
      <dialog ref={ref} className="dialog" aria-labelledby="cookie-title">
        <div className="dialog__inner">
          <h2 id="cookie-title" className="h3">
            Cookies &amp; stockage
          </h2>
          <p>
            Ce site n&apos;utilise <strong>aucun cookie de mesure d&apos;audience, de publicité ou de réseaux sociaux</strong>. Aucune
            carte ni vidéo tierce n&apos;est chargée sans action de votre part.
          </p>
          <p>
            Votre panier est mémorisé dans votre navigateur (stockage local) pour que vous le retrouviez d&apos;une page à l&apos;autre.
            Il n&apos;est envoyé nulle part.
          </p>
          <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => {
                try {
                  localStorage.removeItem("trame-panier-v1");
                } catch {}
                setCleared(true);
              }}
            >
              <Icon name="trash" /> Effacer mon panier mémorisé
            </button>
            <button type="button" className="btn btn--sm" onClick={() => ref.current?.close()}>
              Fermer
            </button>
          </div>
          {cleared && <p role="status">Panier effacé. Rechargez la page pour vider l&apos;affichage.</p>}
          <p className="hint">
            En savoir plus : <Link href="/confidentialite/">politique de confidentialité</Link>.
          </p>
        </div>
      </dialog>
    </>
  );
}
