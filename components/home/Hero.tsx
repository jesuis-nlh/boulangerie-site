import Link from "next/link";
import { ProductArt } from "@/components/art/ProductArt";
import { Icon } from "@/components/Icon";
import { OpenStatus } from "@/components/OpenStatus";
import { PunchCard } from "@/components/PunchCard";
import { bakery } from "@/config/bakery";
import { products } from "@/data/products";
import { HeroStage } from "./HeroStage";
import styles from "./Hero.module.css";

export function Hero() {
  const ticker = products.filter((p) => p.category !== "boissons").map((p) => p.name);
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <HeroStage className={`wrap ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={`eyebrow fade-up ${styles.eyebrow}`} style={{ "--d": ".1s" } as React.CSSProperties}>
            Boulangerie au levain · Croix-Rousse, Lyon
          </p>
          <h1 id="hero-title" className={`display ${styles.title}`}>
            <span className="line-mask">
              <span style={{ "--d": ".15s" } as React.CSSProperties}>Le pain,</span>
            </span>
            <span className="line-mask">
              <span style={{ "--d": ".3s" } as React.CSSProperties}>
                <em>fil à fil</em>.
              </span>
            </span>
            <svg className={styles.thread} viewBox="0 0 900 120" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <path d="M8 70 C120 20 190 112 300 64 S470 10 560 60 S760 108 892 38" />
            </svg>
          </h1>
          <p className={`lede fade-up ${styles.lede}`} style={{ "--d": ".55s" } as React.CSSProperties}>
            Farine, eau, sel — et une nuit entière de patience. Chaque miche est pétrie, fermentée, façonnée et cuite ici, sur les
            pentes, avant que la Croix-Rousse ne se réveille.
          </p>
          <div className={`fade-up ${styles.ctas}`} style={{ "--d": ".7s" } as React.CSSProperties}>
            <Link href="/commander/" className="btn" data-magnetic>
              Commander <Icon name="arrow" />
            </Link>
            <Link href="/produits/" className="btn btn--ghost" data-magnetic>
              Découvrir nos produits
            </Link>
          </div>
          <ul className={`fade-up ${styles.facts}`} style={{ "--d": ".85s" } as React.CSSProperties}>
            <li>
              <OpenStatus />
            </li>
            <li>
              <Icon name="pin" size={16} />
              <span>
                {bakery.contact.neighbourhood}, Lyon 1<sup>er</sup>
              </span>
            </li>
            <li>
              <Icon name="bag" size={16} /> Retrait en boutique
            </li>
          </ul>
        </div>

        <div className={styles.stage} aria-hidden="true">
          <div className={`${styles.layer} ${styles.disc}`} />
          <PunchCard className={`${styles.layer} ${styles.card}`} cols={10} rows={5} seed={7} />
          <div className={`${styles.layer} ${styles.loaf}`}>
            <ProductArt id="trame" />
          </div>
          <div className={`${styles.layer} ${styles.croissant}`}>
            <ProductArt id="croissant" />
          </div>
          <div className={`${styles.layer} ${styles.slice}`}>
            <ProductArt id="tartepart" />
          </div>
          <p className={`${styles.caption} fade-up`} style={{ "--d": "1s" } as React.CSSProperties}>
            <span>Fig. 01</span> La Trame — miche au levain, 1 kg
          </p>
        </div>
      </HeroStage>

      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.track}>
          {[0, 1].map((k) => (
            <span key={k}>
              {ticker.map((t) => (
                <span key={t + k} className={styles.item}>
                  {t}
                  <svg viewBox="0 0 10 10" width="10" height="10">
                    <circle cx="5" cy="5" r="3.2" fill="currentColor" />
                  </svg>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
