import Link from "next/link";
import { ProductArt } from "@/components/art/ProductArt";
import { Icon } from "@/components/Icon";
import styles from "./SurMesure.module.css";

const OCCASIONS = ["Anniversaires", "Mariages & pièces montées", "Baptêmes & communions", "Petits-déjeuners d'entreprise", "Buffets & cocktails"];

export function SurMesure() {
  return (
    <section className={`section ${styles.section}`} aria-labelledby="sm-title">
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.visual} data-reveal="mask">
          <ProductArt id="entremets" className={styles.art} />
          <ProductArt id="tarteentiere" className={styles.art2} />
        </div>
        <div className={styles.copy}>
          <p className="eyebrow">Gâteaux &amp; événements</p>
          <h2 id="sm-title" className="h2" data-reveal>
            Pour les grandes <em>tablées.</em>
          </h2>
          <p className="lede">
            Un entremets pour vingt, une tarte aux pralines pour la fête des voisins, trois cents mini-viennoiseries pour un séminaire :
            dites-nous l&apos;occasion, nous vous répondons avec une proposition et un prix.
          </p>
          <ul className={styles.list}>
            {OCCASIONS.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          <Link href="/sur-mesure/" className="btn" data-magnetic>
            Demander un devis <Icon name="arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}
