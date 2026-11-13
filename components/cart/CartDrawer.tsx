"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { ProductArt } from "@/components/art/ProductArt";
import { Icon } from "@/components/Icon";
import { bakery } from "@/config/bakery";
import { QtyStepper } from "./QtyStepper";
import styles from "./CartDrawer.module.css";

export function CartDrawer() {
  const cart = useCart();
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    if (!cart.isOpen) return;
    opener.current = document.activeElement;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => closeBtn.current?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cart.close();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      removeEventListener("keydown", onKey);
      (opener.current as HTMLElement | null)?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.isOpen]);

  return (
    <AnimatePresence>
      {cart.isOpen && (
        <div className={styles.root}>
          <motion.div className={styles.scrim} onClick={cart.close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
          <motion.div
            ref={panel}
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.head}>
              <h2 id="cart-title" className="h3">
                Votre panier
              </h2>
              <button ref={closeBtn} type="button" className={styles.close} onClick={cart.close} aria-label="Fermer le panier">
                <Icon name="close" size={22} />
              </button>
            </div>

            {cart.lines.length === 0 ? (
              <div className={styles.empty}>
                <ProductArt id="croissant" className={styles.emptyArt} />
                <p className="h3">Rien pour l&apos;instant.</p>
                <p>Une miche, deux croissants ? La vitrine vous attend.</p>
                <Link href="/produits/" className="btn" onClick={cart.close}>
                  Voir la vitrine <Icon name="arrow" />
                </Link>
              </div>
            ) : (
              <>
                <ul className={styles.lines}>
                  <AnimatePresence initial={false}>
                    {cart.lines.map((l) => (
                      <motion.li
                        key={l.slug}
                        layout={!reduce}
                        initial={reduce ? false : { opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, x: 40, height: 0, paddingBlock: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className={styles.line}
                      >
                        <div className={styles.thumb}>
                          <ProductArt id={l.product.art} />
                        </div>
                        <div className={styles.info}>
                          <Link href={`/produits/${l.slug}/`} onClick={cart.close} className={styles.name}>
                            {l.product.name}
                          </Link>
                          <span className="mono">{formatPrice(l.product.priceCents)} / {l.product.size?.toLowerCase() ?? "pièce"}</span>
                          {l.product.leadTimeHours ? <span className={styles.lead}>À commander {l.product.leadTimeHours} h avant</span> : null}
                          <div className={styles.row}>
                            <QtyStepper value={l.qty} onChange={(n) => cart.setQty(l.slug, n)} label={l.product.name} />
                            <span className="mono">{formatPrice(l.totalCents)}</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <div className={styles.foot}>
                  <div className={styles.total}>
                    <span>Total TTC</span>
                    <span className="mono">{formatPrice(cart.totalCents)}</span>
                  </div>
                  <p className={styles.small}>
                    Retrait en boutique uniquement. {bakery.ordering.mode === "demo" && "Démonstration : aucune commande n'est transmise."}
                  </p>
                  <Link href="/commander/" className="btn" onClick={cart.close}>
                    Choisir mon créneau de retrait <Icon name="arrow" />
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
