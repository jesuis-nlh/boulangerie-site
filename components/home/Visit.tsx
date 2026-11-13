import { bakery } from "@/config/bakery";
import { hoursRows } from "@/lib/hours";
import { Icon } from "@/components/Icon";
import { OpenStatus } from "@/components/OpenStatus";
import { TodayRow } from "./TodayRow";
import { LyonMap } from "./LyonMap";
import styles from "./Visit.module.css";

export function Visit() {
  const c = bakery.contact;
  const gmaps = `https://www.google.com/maps/search/?api=1&query=${c.geo.lat},${c.geo.lng}`;
  const osm = `https://www.openstreetmap.org/?mlat=${c.geo.lat}&mlon=${c.geo.lng}#map=17/${c.geo.lat}/${c.geo.lng}`;
  return (
    <section id="contact" className={`section ${styles.section}`} aria-labelledby="visit-title">
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.info}>
          <p className="eyebrow">Nous trouver</p>
          <h2 id="visit-title" className="h2" data-reveal>
            En haut des marches, <em>à gauche.</em>
          </h2>
          <OpenStatus />

          <dl className={styles.facts}>
            <div>
              <dt>
                <Icon name="pin" size={18} /> Adresse
              </dt>
              <dd>
                <address>
                  {c.street}
                  <br />
                  {c.postalCode} {c.city} — {c.neighbourhood}
                </address>
              </dd>
            </div>
            <div>
              <dt>
                <Icon name="phone" size={18} /> Téléphone
              </dt>
              <dd>
                <a href={`tel:${c.phoneHref}`}>{c.phoneDisplay}</a>
              </dd>
            </div>
            <div>
              <dt>
                <Icon name="metro" size={18} /> Accès
              </dt>
              <dd>
                {c.transport.map((t) => (
                  <span key={t.stop} className={styles.line}>
                    {t.line} — {t.stop}
                  </span>
                ))}
              </dd>
            </div>
          </dl>

          <div className={styles.hours}>
            <h3 className={styles.hh}>
              <Icon name="clock" size={18} /> Horaires
            </h3>
            <table>
              <caption className="sr-only">Horaires d&apos;ouverture de la boutique</caption>
              <tbody>
                {hoursRows().map((r) => (
                  <TodayRow key={r.key} day={r.key}>
                    <th scope="row">{r.label}</th>
                    <td className="mono">{r.value}</td>
                  </TodayRow>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.ctas}>
            <a className="btn" href={gmaps} target="_blank" rel="noopener noreferrer" data-magnetic>
              Itinéraire <Icon name="external" />
              <span className="sr-only"> (Google Maps, nouvel onglet)</span>
            </a>
            <a className="btn btn--ghost" href={osm} target="_blank" rel="noopener noreferrer">
              OpenStreetMap
              <span className="sr-only"> (nouvel onglet)</span>
            </a>
          </div>
        </div>

        <figure className={styles.map} data-reveal="mask">
          <LyonMap />
          <figcaption>Les coordonnées et l&apos;adresse affichées sont fictives (démonstration).</figcaption>
        </figure>
      </div>

      {bakery.reviews.provider === null && bakery.isDemo && (
        <div className={`wrap ${styles.reviews}`}>
          <div className={styles.reviewsBox}>
            <Icon name="star" size={22} />
            <div>
              <p className={styles.rt}>Ce que disent nos clients</p>
              <p>
                Cet emplacement accueillera les avis publiés sur notre fiche Google, importés automatiquement et sans tri. Nous n&apos;affichons
                ni avis rédigés par nos soins, ni note inventée.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
