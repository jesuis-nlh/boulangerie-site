"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { bakery } from "@/config/bakery";
import { isEmail, isPhoneFR, required } from "@/lib/validate";
import { ErrorSummary } from "./ErrorSummary";
import { Field, describedBy } from "./Field";
import styles from "./OrderFlow.module.css";

const OCCASIONS = ["Anniversaire", "Mariage", "Baptême / communion", "Événement d'entreprise", "Autre"];
const MIN_DAYS = 3;

type F = { occasion: string; date: string; guests: string; message: string; name: string; phone: string; email: string };

const iso = (d: Date) => d.toISOString().slice(0, 10);

export function InquiryForm() {
  const reduce = useReducedMotion();
  const [f, setF] = useState<F>({ occasion: "", date: "", guests: "", message: "", name: "", phone: "", email: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);
  const [minDate, setMinDate] = useState("");
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMinDate(iso(new Date(Date.now() + MIN_DAYS * 86400000))), []);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!f.occasion) e.occasion = "Choisissez le type d'occasion.";
    if (!f.date) e.date = "Indiquez la date de l'événement.";
    else if (minDate && f.date < minDate) e.date = `Pour une création sur mesure, comptez au moins ${MIN_DAYS} jours de délai.`;
    const g = Number(f.guests);
    if (!f.guests || !Number.isInteger(g) || g < 4 || g > 300) e.guests = "Indiquez un nombre de parts entre 4 et 300.";
    if (!required(f.message, 10)) e.message = "Décrivez votre projet en quelques mots (10 caractères minimum).";
    if (!required(f.name)) e.name = "Indiquez votre nom.";
    if (!f.phone && !f.email) e.phone = "Laissez au moins un moyen de vous recontacter : téléphone ou e-mail.";
    else {
      if (f.phone && !isPhoneFR(f.phone)) e.phone = "Ce numéro ne semble pas valide, par exemple 06 12 34 56 78.";
      if (f.email && !isEmail(f.email)) e.email = "Cette adresse e-mail semble incomplète.";
    }
    return e;
  }, [f, minDate]);

  const show = (k: string) => (submitted || touched[k] ? errors[k] : undefined);
  const set = (k: keyof F) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF((s) => ({ ...s, [k]: ev.target.value }));
  const blur = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) return;
    setDone(true);
    requestAnimationFrame(() => doneRef.current?.focus());
  };

  if (done) {
    const body = encodeURIComponent(`Occasion : ${f.occasion}\nDate : ${f.date}\nParts : ${f.guests}\n\n${f.message}\n\n${f.name} — ${f.phone} ${f.email}`);
    return (
      <motion.div ref={doneRef} tabIndex={-1} className={styles.result} initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className={styles.resultBadge}>
          <Icon name="info" size={18} /> Démonstration
        </span>
        <h2 className="h2">
          Demande prête, <em>mais pas envoyée.</em>
        </h2>
        <p className="lede">
          Ce formulaire de démonstration ne transmet rien. Pour une vraie demande, écrivez-nous ou appelez-nous : nous répondons
          avec une proposition et un prix, sans engagement.
        </p>
        <div className={styles.resultActions}>
          <a className="btn" href={`mailto:${bakery.contact.email}?subject=${encodeURIComponent("Demande de devis — " + f.occasion)}&body=${body}`}>
            <Icon name="mail" /> Envoyer par e-mail
          </a>
          <a className="btn btn--ghost" href={`tel:${bakery.contact.phoneHref}`}>
            <Icon name="phone" /> {bakery.contact.phoneDisplay}
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className={styles.main} style={{ maxWidth: "52rem" }}>
      <ErrorSummary errors={errors} show={submitted} />
      <div className={styles.fields}>
        <Field id="occasion" label="Occasion" error={show("occasion")}>
          <select id="occasion" className="input" value={f.occasion} onChange={set("occasion")} onBlur={blur("occasion")} aria-invalid={!!show("occasion")} aria-describedby={describedBy("occasion", false, show("occasion"))}>
            <option value="">Choisir…</option>
            {OCCASIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field id="date" label="Date de l'événement" hint={`Au moins ${MIN_DAYS} jours de délai.`} error={show("date")}>
          <input id="date" type="date" className="input" min={minDate || undefined} value={f.date} onChange={set("date")} onBlur={blur("date")} aria-invalid={!!show("date")} aria-describedby={describedBy("date", true, show("date"))} />
        </Field>
        <Field id="guests" label="Nombre de parts" hint="De 4 à 300." error={show("guests")}>
          <input id="guests" type="number" inputMode="numeric" min={4} max={300} className="input" value={f.guests} onChange={set("guests")} onBlur={blur("guests")} aria-invalid={!!show("guests")} aria-describedby={describedBy("guests", true, show("guests"))} />
        </Field>
        <Field id="name" label="Votre nom" error={show("name")}>
          <input id="name" className="input" autoComplete="name" value={f.name} onChange={set("name")} onBlur={blur("name")} aria-invalid={!!show("name")} aria-describedby={describedBy("name", false, show("name"))} />
        </Field>
        <Field id="phone" label="Téléphone" hint="Téléphone ou e-mail : au moins l'un des deux." error={show("phone")}>
          <input id="phone" type="tel" inputMode="tel" autoComplete="tel" className="input" value={f.phone} onChange={set("phone")} onBlur={blur("phone")} aria-invalid={!!show("phone")} aria-describedby={describedBy("phone", true, show("phone"))} />
        </Field>
        <Field id="email" label="E-mail" error={show("email")}>
          <input id="email" type="email" autoComplete="email" className="input" value={f.email} onChange={set("email")} onBlur={blur("email")} aria-invalid={!!show("email")} aria-describedby={describedBy("email", false, show("email"))} />
        </Field>
      </div>
      <Field id="message" label="Votre projet" hint="Saveurs, thème, contraintes alimentaires à signaler, budget indicatif…" error={show("message")}>
        <textarea id="message" className="input" value={f.message} onChange={set("message")} onBlur={blur("message")} maxLength={1200} aria-invalid={!!show("message")} aria-describedby={describedBy("message", true, show("message"))} />
      </Field>
      <p className={styles.privacy}>
        Ces informations servent uniquement à vous répondre et sont supprimées sous 6 mois sans suite. <Link href="/confidentialite/">Confidentialité</Link>.
      </p>
      <div>
        <button type="submit" className="btn">
          Envoyer ma demande <Icon name="arrow" />
        </button>
      </div>
    </form>
  );
}
