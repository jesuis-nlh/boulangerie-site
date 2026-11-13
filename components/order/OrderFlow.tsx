"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProductArt } from "@/components/art/ProductArt";
import { QtyStepper } from "@/components/cart/QtyStepper";
import { Icon } from "@/components/Icon";
import { bakery } from "@/config/bakery";
import { signatureProducts } from "@/data/products";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { pickupDays } from "@/lib/hours";
import { isEmail, isPhoneFR, required } from "@/lib/validate";
import { ErrorSummary } from "./ErrorSummary";
import { Field, describedBy } from "./Field";
import styles from "./OrderFlow.module.css";

type Form = { name: string; phone: string; email: string; note: string };
type Result = null | { summary: string };

export function OrderFlow() {
  const cart = useCart();
  const reduce = useReducedMotion();
  const [days, setDays] = useState<ReturnType<typeof pickupDays>>([]);
  const [day, setDay] = useState<number | null>(null);
  const [slot, setSlot] = useState("");
  const [form, setForm] = useState<Form>({ name: "", phone: "", email: "", note: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Créneaux calculés côté navigateur (heure de Lyon), selon le délai le plus long du panier.
  useEffect(() => {
    const d = pickupDays(cart.leadHours);
    setDays(d);
    setDay((cur) => (cur !== null && d.some((x) => x.offset === cur) ? cur : d[0]?.offset ?? null));
  }, [cart.leadHours]);

  const currentDay = days.find((d) => d.offset === day);
  useEffect(() => {
    if (currentDay && slot && !currentDay.slots.includes(slot)) setSlot("");
  }, [currentDay, slot]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!cart.lines.length) e["panier"] = "Votre panier est vide : ajoutez au moins un produit.";
    if (!slot) e["slot"] = "Choisissez une heure de retrait.";
    if (!required(form.name)) e["name"] = "Indiquez le nom pour la commande.";
    if (!isPhoneFR(form.phone)) e["phone"] = "Indiquez un numéro de téléphone français valide, par exemple 06 12 34 56 78.";
    if (form.email && !isEmail(form.email)) e["email"] = "L'adresse e-mail semble incomplète, par exemple prenom@exemple.fr.";
    return e;
  }, [cart.lines.length, slot, form]);

  const show = (k: string) => (submitted || touched[k] ? errors[k] : undefined);
  const set = (k: keyof Form) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: ev.target.value }));
  const blur = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }));

  const summary = () => {
    const lines = cart.lines.map((l) => `- ${l.qty} × ${l.product.name} (${formatPrice(l.totalCents)})`).join("\n");
    return `Commande à retirer — ${currentDay?.label ?? ""} à ${slot.replace(":", " h ")}\n${lines}\nTotal TTC : ${formatPrice(cart.totalCents)}\nNom : ${form.name}\nTéléphone : ${form.phone}${form.email ? `\nE-mail : ${form.email}` : ""}${form.note ? `\nNote : ${form.note}` : ""}`;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) return;
    // Aucun envoi réel : voir docs/INTEGRATIONS.md pour brancher un prestataire.
    setResult({ summary: summary() });
    requestAnimationFrame(() => resultRef.current?.focus());
  };

  if (bakery.ordering.mode === "phone") {
    return (
      <div className="notice">
        <Icon name="phone" />
        <p>
          Les commandes se font par téléphone au <a href={`tel:${bakery.contact.phoneHref}`}>{bakery.contact.phoneDisplay}</a> ou directement en boutique.
        </p>
      </div>
    );
  }

  if (result) {
    return (
      <motion.div ref={resultRef} tabIndex={-1} className={styles.result} initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} aria-labelledby="res-title">
        <span className={styles.resultBadge}>
          <Icon name="info" size={18} /> Démonstration
        </span>
        <h2 id="res-title" className="h2">
          Votre demande <em>n&apos;a pas été envoyée.</em>
        </h2>
        <p className="lede">
          Ce site est une démonstration : aucune commande n&apos;a été transmise à la boulangerie et aucun paiement n&apos;a été effectué. Dans la version en
          ligne, cette étape enverra la commande à la boutique et vous recevrez une confirmation.
        </p>
        <pre className={styles.pre} aria-label="Récapitulatif de la demande">
          {result.summary}
        </pre>
        <div className={styles.resultActions}>
          <a className="btn" href={`tel:${bakery.contact.phoneHref}`}>
            <Icon name="phone" /> Commander par téléphone
          </a>
          <button type="button" className="btn btn--ghost" onClick={() => setResult(null)}>
            Modifier la demande
          </button>
        </div>
      </motion.div>
    );
  }

  const step = (n: string, title: string, done: boolean) => (
    <h2 className={styles.stepTitle}>
      <span className={`${styles.stepNum} ${done ? styles.done : ""}`} aria-hidden="true">
        {done ? <Icon name="check" size={16} /> : n}
      </span>
      {title}
      {done && <span className="sr-only"> (complété)</span>}
    </h2>
  );

  return (
    <form className={styles.flow} onSubmit={submit} noValidate>
      <div className={styles.main}>
        <ErrorSummary errors={errors} show={submitted} />

        {/* 1 — Panier */}
        <section className={styles.step} aria-labelledby="s1" id="panier" tabIndex={-1}>
          <div id="s1">{step("1", "Votre panier", cart.lines.length > 0)}</div>
          {cart.lines.length === 0 ? (
            <div className={styles.empty}>
              <p>Votre panier est vide. Quelques idées pour commencer :</p>
              <ul className={styles.suggest}>
                {signatureProducts.slice(0, 4).map((p) => (
                  <li key={p.slug}>
                    <button type="button" onClick={() => cart.add(p.slug)} className={styles.suggestBtn}>
                      <span className={styles.suggestArt}>
                        <ProductArt id={p.art} />
                      </span>
                      <span>
                        <strong>{p.name}</strong>
                        <span className="mono">{formatPrice(p.priceCents)}</span>
                      </span>
                      <Icon name="plus" size={18} />
                      <span className="sr-only">Ajouter au panier</span>
                    </button>
                  </li>
                ))}
              </ul>
              <Link href="/produits/" className="link-arrow">
                Toute la vitrine <Icon name="arrow" />
              </Link>
              {show("panier") && <p className={styles.err}>{errors.panier}</p>}
            </div>
          ) : (
            <ul className={styles.lines}>
              <AnimatePresence initial={false}>
                {cart.lines.map((l) => (
                  <motion.li key={l.slug} layout={!reduce} exit={reduce ? { opacity: 0 } : { opacity: 0, x: 30 }} className={styles.line}>
                    <span className={styles.thumb}>
                      <ProductArt id={l.product.art} />
                    </span>
                    <span className={styles.lname}>
                      <Link href={`/produits/${l.slug}/`}>{l.product.name}</Link>
                      <span className="mono">{formatPrice(l.product.priceCents)}</span>
                      {l.product.leadTimeHours ? <span className={styles.leadNote}>Délai {l.product.leadTimeHours} h</span> : null}
                    </span>
                    <QtyStepper value={l.qty} onChange={(n) => cart.setQty(l.slug, n)} label={l.product.name} />
                    <span className={`mono ${styles.ltotal}`}>{formatPrice(l.totalCents)}</span>
                    <button type="button" className={styles.remove} onClick={() => cart.remove(l.slug)} aria-label={`Retirer ${l.product.name} du panier`}>
                      <Icon name="trash" size={18} />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </section>

        {/* 2 — Retrait */}
        <section className={styles.step} aria-labelledby="s2">
          <div id="s2">{step("2", "Jour et heure de retrait", !!slot)}</div>
          {cart.leadHours > 0 && (
            <p className={styles.info}>
              <Icon name="calendar" size={18} /> Votre panier contient un gâteau sur commande : retrait au plus tôt dans {cart.leadHours} heures.
            </p>
          )}
          <fieldset className={styles.fs}>
            <legend className="sr-only">Jour de retrait</legend>
            <div className={styles.days}>
              {days.map((d) => (
                <label key={d.offset} className={`${styles.day} ${day === d.offset ? styles.dayOn : ""}`}>
                  <input type="radio" name="day" value={d.offset} checked={day === d.offset} onChange={() => setDay(d.offset)} />
                  <span className={styles.dayLabel}>{d.label}</span>
                  <span className="mono">{d.slots.length} créneaux</span>
                </label>
              ))}
              {days.length === 0 && <p>Calcul des créneaux…</p>}
            </div>
          </fieldset>
          <Field id="slot" label="Heure de retrait" hint="Créneaux de 30 minutes, selon nos horaires d'ouverture." error={show("slot")}>
            <select id="slot" className="input" value={slot} onChange={(e) => setSlot(e.target.value)} onBlur={blur("slot")} aria-invalid={!!show("slot")} aria-describedby={describedBy("slot", true, show("slot"))}>
              <option value="">Choisir une heure…</option>
              {currentDay?.slots.map((s) => (
                <option key={s} value={s}>
                  {s.replace(":", " h ")}
                </option>
              ))}
            </select>
          </Field>
        </section>

        {/* 3 — Coordonnées */}
        <section className={styles.step} aria-labelledby="s3">
          <div id="s3">{step("3", "Vos coordonnées", !errors.name && !errors.phone && !errors.email)}</div>
          <div className={styles.fields}>
            <Field id="name" label="Nom pour la commande" error={show("name")}>
              <input id="name" className="input" autoComplete="name" value={form.name} onChange={set("name")} onBlur={blur("name")} aria-invalid={!!show("name")} aria-describedby={describedBy("name", false, show("name"))} />
            </Field>
            <Field id="phone" label="Téléphone" hint="Uniquement pour vous prévenir en cas d'imprévu." error={show("phone")}>
              <input id="phone" className="input" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} onBlur={blur("phone")} aria-invalid={!!show("phone")} aria-describedby={describedBy("phone", true, show("phone"))} />
            </Field>
            <Field id="email" label="E-mail" optional hint="Pour recevoir le récapitulatif." error={show("email")}>
              <input id="email" className="input" type="email" autoComplete="email" value={form.email} onChange={set("email")} onBlur={blur("email")} aria-invalid={!!show("email")} aria-describedby={describedBy("email", true, show("email"))} />
            </Field>
            <Field id="note" label="Une précision ?" optional hint="Ex. : baguette bien cuite, tranchée…">
              <textarea id="note" className="input" rows={3} value={form.note} onChange={set("note")} maxLength={300} aria-describedby="note-hint" style={{ minHeight: 96 }} />
            </Field>
          </div>
          <p className={styles.privacy}>
            Vos coordonnées servent uniquement à préparer et retirer cette commande. <Link href="/confidentialite/">En savoir plus</Link>.
          </p>
        </section>
      </div>

      {/* 4 — Récapitulatif */}
      <aside className={styles.aside} aria-labelledby="s4">
        <div className={styles.recap}>
          <h2 id="s4" className="h3">
            Récapitulatif
          </h2>
          <dl className={styles.recapList}>
            <div>
              <dt>Articles</dt>
              <dd className="mono">{cart.count}</dd>
            </div>
            <div>
              <dt>Retrait</dt>
              <dd>{slot && currentDay ? `${currentDay.label}, ${slot.replace(":", " h ")}` : "—"}</dd>
            </div>
            <div>
              <dt>Lieu</dt>
              <dd>En boutique, {bakery.contact.neighbourhood}</dd>
            </div>
            <div>
              <dt>Paiement</dt>
              <dd>Sur place, au retrait</dd>
            </div>
          </dl>
          <div className={styles.total}>
            <span>Total TTC</span>
            <motion.span key={cart.totalCents} className="mono" initial={reduce ? false : { y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              {formatPrice(cart.totalCents)}
            </motion.span>
          </div>
          {bakery.ordering.mode === "external" && bakery.ordering.externalUrl ? (
            <a className="btn" href={bakery.ordering.externalUrl} target="_blank" rel="noopener noreferrer">
              Finaliser chez notre prestataire <Icon name="external" />
            </a>
          ) : (
            <button type="submit" className="btn">
              Envoyer la demande <Icon name="arrow" />
            </button>
          )}
          {bakery.ordering.mode === "demo" && (
            <p className={styles.demo}>
              <Icon name="info" size={16} /> Démonstration : rien n&apos;est transmis ni payé. Pour commander pour de vrai, appelez le{" "}
              <a href={`tel:${bakery.contact.phoneHref}`}>{bakery.contact.phoneDisplay}</a>.
            </p>
          )}
        </div>
      </aside>
    </form>
  );
}
