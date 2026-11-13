import Link from "next/link";
import { Icon } from "@/components/Icon";
import { bakery } from "@/config/bakery";
import styles from "./ClickCollect.module.css";

export function ClickCollect() {
  const lead = bakery.ordering.leadTimeMinutes / 60;
  const steps = [
    { n: "01", t: "Composez", d: "Ajoutez miches, viennoiseries et gâteaux à votre panier, en choisissant les quantités." },
    { n: "02", t: "Choisissez l'heure", d: `Un créneau de retrait de 30 minutes, au plus tôt ${lead} h après votre commande — 48 h pour les gâteaux entiers.` },
    { n: "03", t: "Passez prendre", d: "Votre commande vous attend au comptoir, à votre nom. Vous réglez sur place." },
  ];
  return (
    <section className={styles.section} aria-labelledby="cc-title">
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.intro}>
          <p className="eyebrow">Click &amp; collect</p>
          <h2 id="cc-title" className="h2" data-reveal>
            Réservez votre miche, <em>sautez la file.</em>
          </h2>
          <p className={styles.lede}>Le samedi matin, la file déborde sur la montée. Commandez la veille, passez quand vous voulez.</p>
          <Link href="/commander/" className="btn btn--light" data-magnetic>
            Préparer ma commande <Icon name="arrow" />
          </Link>
          {bakery.ordering.mode === "demo" && (
            <p className={styles.demo}>
              <Icon name="info" size={16} /> Parcours de démonstration : aucune commande n&apos;est transmise ni payée.
            </p>
          )}
        </div>
        <ol className={styles.steps}>
          {steps.map((s, i) => (
            <li key={s.n} data-reveal style={{ "--d": `${i * 0.1}s` } as React.CSSProperties}>
              <span className={styles.n}>{s.n}</span>
              <h3 className="h3">{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
