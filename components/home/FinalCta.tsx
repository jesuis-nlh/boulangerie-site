import Link from "next/link";
import { ProductArt } from "@/components/art/ProductArt";
import { Icon } from "@/components/Icon";
import styles from "./FinalCta.module.css";

export function FinalCta() {
  return (
    <section className={styles.section} aria-labelledby="final-title">
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.arts} aria-hidden="true">
          <ProductArt id="brioche" className={styles.a1} />
          <ProductArt id="baguette" className={styles.a2} />
          <ProductArt id="croissant" className={styles.a3} />
        </div>
        <h2 id="final-title" className={`display ${styles.title}`} data-reveal>
          Votre prochaine <em>gourmandise</em> vous attend.
        </h2>
        <div className={styles.ctas} data-reveal style={{ "--d": ".15s" } as React.CSSProperties}>
          <Link href="/produits/" className="btn" data-magnetic>
            Découvrir la boutique <Icon name="arrow" />
          </Link>
          <Link href="/#contact" className="btn btn--ghost" data-magnetic>
            Nous trouver
          </Link>
        </div>
      </div>
    </section>
  );
}
