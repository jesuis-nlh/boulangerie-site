import Link from "next/link";
import { bakery } from "@/config/bakery";
import { hoursRows } from "@/lib/hours";
import { Icon } from "@/components/Icon";
import { Mark } from "@/components/Logo";
import { NAV } from "./nav";
import { CookieInfo } from "./CookieInfo";
import styles from "./Footer.module.css";

export function Footer() {
  const c = bakery.contact;
  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <div className={styles.top}>
          <p className={styles.word} aria-hidden="true">
            Trame<span>.</span>
          </p>
          <p className={styles.sign}>
            {bakery.brand.descriptor}
            <br />
            Pétri, fermenté, façonné et cuit sur place.
          </p>
        </div>

        <div className={styles.cols}>
          <nav aria-label="Pied de page">
            <h2 className={styles.h}>Plan du site</h2>
            <ul>
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/sur-mesure/">Gâteaux &amp; événements</Link>
              </li>
            </ul>
          </nav>
          <div>
            <h2 className={styles.h}>Nous trouver</h2>
            <address>
              {c.street}
              <br />
              {c.postalCode} {c.city}
            </address>
            <ul>
              <li>
                <a href={`tel:${c.phoneHref}`}>{c.phoneDisplay}</a>
              </li>
              <li>
                <a href={`mailto:${c.email}`}>{c.email}</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className={styles.h}>Horaires</h2>
            <dl className={styles.hours}>
              {hoursRows().map((r) => (
                <div key={r.key}>
                  <dt>{r.label}</dt>
                  <dd>{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className={styles.h}>Suivre le fournil</h2>
            <ul>
              {bakery.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} rel="noopener noreferrer" target="_blank" className={styles.social}>
                    <Icon name="instagram" size={18} /> {s.label}
                    <span className="sr-only"> (nouvel onglet)</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className={styles.small}>
              Allergènes : la liste des 14 allergènes réglementaires est consultable en boutique pour chaque produit.
            </p>
          </div>
        </div>

        {bakery.isDemo && (
          <p className={styles.demo}>
            <Icon name="info" size={16} />
            <span>
              <strong>Site de démonstration.</strong> Trame est une boulangerie fictive : adresse, téléphone, horaires, prix et
              produits sont des exemples. Les illustrations sont des créations originales, pas des photographies.
            </span>
          </p>
        )}

        <div className={styles.legal}>
          <Mark size={22} />
          <span>© {new Date().getFullYear()} {bakery.brand.name}</span>
          <Link href="/mentions-legales/">Mentions légales</Link>
          <Link href="/confidentialite/">Confidentialité</Link>
          <CookieInfo className={styles.linkBtn} />
        </div>
      </div>
    </footer>
  );
}
