"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { OpenStatus } from "@/components/OpenStatus";
import { useCart } from "@/lib/cart";
import { bakery } from "@/config/bakery";
import { NAV } from "./nav";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();
  const cart = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const reduce = useReducedMotion();
  const menuBtn = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const holdUntil = useRef(0);

  useEffect(() => {
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      setScrolled(y > 24);
      if (Date.now() > holdUntil.current) setHidden(y > 480 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenu(false), [pathname]);

  // Un ajout au panier fait réapparaître l'en-tête pour montrer le compteur.
  useEffect(() => {
    if (!cart.pulse) return;
    holdUntil.current = Date.now() + 1200;
    setHidden(false);
  }, [cart.pulse]);

  useEffect(() => {
    if (!menu) return;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        menuBtn.current?.focus();
      }
    };
    addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href));
  const orderHref = bakery.ordering.mode === "external" && bakery.ordering.externalUrl ? bakery.ordering.externalUrl : "/commander/";

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""} ${hidden && !menu ? styles.hidden : ""} ${menu ? styles.menuOpen : ""}`}>
        <div className={`wrap ${styles.bar}`}>
          <Link href="/" className={styles.brand} aria-label={`${bakery.brand.name} — accueil`}>
            <Logo />
          </Link>

          <nav className={styles.nav} aria-label="Navigation principale">
            <ul>
              {NAV.filter((n) => n.label !== "Commander").map((n) => (
                <li key={n.href}>
                  <Link href={n.href} aria-current={isActive(n.href) ? "page" : undefined}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <OpenStatus className={styles.status} />
            <Link href={orderHref} className={`btn btn--sm ${styles.cta}`} data-magnetic>
              Commander
            </Link>
            <button type="button" className={styles.cartBtn} onClick={cart.open} aria-label={`Ouvrir le panier, ${cart.count} article${cart.count > 1 ? "s" : ""}`}>
              <Icon name="bag" size={22} />
              <AnimatePresence initial={false}>
                {cart.count > 0 && (
                  <motion.span
                    key={cart.pulse}
                    className={styles.badge}
                    initial={reduce ? false : { scale: 0.4, y: -6 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 520, damping: 18 }}
                    aria-hidden="true"
                  >
                    {cart.count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              ref={menuBtn}
              type="button"
              className={styles.menuBtn}
              aria-expanded={menu}
              aria-controls="menu-mobile"
              onClick={() => setMenu((m) => !m)}
            >
              <span className="sr-only">{menu ? "Fermer le menu" : "Ouvrir le menu"}</span>
              <Icon name={menu ? "close" : "menu"} size={24} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            id="menu-mobile"
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          >
            <nav className="wrap" aria-label="Menu mobile">
              <ol className={styles.sheetList}>
                {NAV.map((n, i) => (
                  <motion.li
                    key={n.href}
                    initial={reduce ? false : { y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link ref={i === 0 ? firstLink : undefined} href={n.href} onClick={() => setMenu(false)} aria-current={isActive(n.href) ? "page" : undefined}>
                      <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                      {n.label}
                    </Link>
                  </motion.li>
                ))}
              </ol>
              <div className={styles.sheetFoot}>
                <OpenStatus />
                <a href={`tel:${bakery.contact.phoneHref}`} className="link-arrow">
                  <Icon name="phone" /> {bakery.contact.phoneDisplay}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
