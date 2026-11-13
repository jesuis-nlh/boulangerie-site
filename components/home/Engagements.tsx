import { bakery } from "@/config/bakery";
import styles from "./Engagements.module.css";

type E = { title: string; text: string; proof: string; show: boolean };

/**
 * Chaque engagement est conditionné à la configuration (config/bakery.ts) :
 * on n'affiche que ce que la boutique peut justifier.
 */
export function Engagements() {
  const m = bakery.compliance.madeOnSite;
  const items: E[] = [
    {
      title: "Tout est fait ici.",
      text: "Pétrissage, fermentation, façonnage et cuisson : chaque pain est fabriqué dans notre fournil, sur le lieu de vente. C'est ce qui nous autorise, légalement, à nous appeler boulangerie.",
      proof: "Code de la consommation, art. L122-17",
      show: m.kneading && m.fermentation && m.shaping && m.bakingAtPointOfSale,
    },
    {
      title: "Jamais de surgelé.",
      text: "Ni pâte, ni pain congelés, à aucun moment. Ce qui n'est pas vendu le soir ne revient pas le lendemain.",
      proof: "Même article — pas de surgélation",
      show: m.noFrozenDoughOrBread,
    },
    {
      title: "Le levain, tous les jours.",
      text: "Notre levain naturel est rafraîchi chaque jour. Il donne aux miches leur acidité douce et leur longue conservation.",
      proof: "À voir au fournil, sur demande",
      show: true,
    },
    {
      title: "Des farines nommées.",
      text: "Nous indiquons en boutique le moulin et la variété de chaque farine. Pas de mélange anonyme.",
      proof: "Fiches farines affichées en boutique",
      show: true,
    },
    {
      title: "Les allergènes, par écrit.",
      text: "Pour chaque produit, les allergènes sont indiqués par écrit, en boutique. En ligne, ils apparaîtront dès que nos fiches auront été vérifiées.",
      proof: "Décret n° 2015-447",
      show: true,
    },
  ];

  return (
    <section id="engagements" className={`section ${styles.section}`} aria-labelledby="eng-title">
      <div className="wrap">
        <div className={styles.head}>
          <p className="eyebrow">Nos engagements</p>
          <h2 id="eng-title" className="h2" data-reveal>
            Ce que nous promettons, <em>et comment le vérifier.</em>
          </h2>
        </div>
        <ol className={styles.list}>
          {items
            .filter((e) => e.show)
            .map((e, i) => (
              <li key={e.title} className={styles.item} data-reveal style={{ "--d": `${i * 0.06}s` } as React.CSSProperties}>
                <span className={styles.n} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <svg className={styles.holes} viewBox="0 0 64 16" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((k) => (
                    <circle key={k} cx={6 + k * 13} cy={8} r={k <= i ? 4.4 : 1.6} fill="currentColor" />
                  ))}
                </svg>
                <h3 className={styles.t}>{e.title}</h3>
                <p className={styles.p}>{e.text}</p>
                <p className={styles.proof}>
                  <span>Preuve</span> {e.proof}
                </p>
              </li>
            ))}
        </ol>
      </div>
    </section>
  );
}
