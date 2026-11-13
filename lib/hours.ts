import { bakery, DAY_ORDER, DAY_LABEL, type DayKey } from "@/config/bakery";

const JS_TO_KEY: DayKey[] = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const fmtTime = (hhmm: string) => {
  const [h, m] = hhmm.split(":");
  return `${Number(h)} h ${m === "00" ? "" : m}`.trim();
};

/** Heure de Lyon, quel que soit le fuseau du visiteur. */
export function lyonNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const wd = parts.find((p) => p.type === "weekday")!.value;
  const h = Number(parts.find((p) => p.type === "hour")!.value);
  const m = Number(parts.find((p) => p.type === "minute")!.value);
  const map: Record<string, DayKey> = { Mon: "lun", Tue: "mar", Wed: "mer", Thu: "jeu", Fri: "ven", Sat: "sam", Sun: "dim" };
  return { day: map[wd], minutes: h * 60 + m };
}

export type OpenStatus = { open: boolean; label: string };

export function openStatus(date = new Date()): OpenStatus {
  const { day, minutes } = lyonNow(date);
  const today = bakery.hours[day];
  const current = today.find((r) => minutes >= toMin(r.open) && minutes < toMin(r.close));
  if (current) return { open: true, label: `Ouvert jusqu'à ${fmtTime(current.close)}` };
  const later = today.find((r) => minutes < toMin(r.open));
  if (later) return { open: false, label: `Ouvre à ${fmtTime(later.open)}` };
  const idx = DAY_ORDER.indexOf(day);
  for (let i = 1; i <= 7; i++) {
    const k = DAY_ORDER[(idx + i) % 7];
    const r = bakery.hours[k][0];
    if (r) return { open: false, label: `Fermé · ouvre ${i === 1 ? "demain" : DAY_LABEL[k].toLowerCase()} à ${fmtTime(r.open)}` };
  }
  return { open: false, label: "Fermé" };
}

export const hoursRows = () =>
  DAY_ORDER.map((k) => ({
    key: k,
    label: DAY_LABEL[k],
    value: bakery.hours[k].length ? bakery.hours[k].map((r) => `${fmtTime(r.open)} – ${fmtTime(r.close)}`).join(", ") : "Fermé",
  }));

/** Créneaux de retrait générés à partir des horaires d'ouverture. */
export function pickupDays(leadHours = 0, now = new Date()) {
  const { leadTimeMinutes, slotMinutes, daysAhead } = bakery.ordering;
  const lead = Math.max(leadTimeMinutes, leadHours * 60);
  const { day, minutes } = lyonNow(now);
  const startIdx = DAY_ORDER.indexOf(day);
  const out: { offset: number; key: DayKey; label: string; date: Date; slots: string[] }[] = [];
  for (let off = 0; off <= daysAhead; off++) {
    const key = DAY_ORDER[(startIdx + off) % 7];
    const earliest = minutes + lead - off * 1440;
    const slots: string[] = [];
    for (const r of bakery.hours[key]) {
      for (let t = toMin(r.open) + slotMinutes; t <= toMin(r.close) - slotMinutes; t += slotMinutes) {
        if (t >= earliest) slots.push(`${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`);
      }
    }
    const date = new Date(now.getTime() + off * 86400000);
    const label =
      off === 0 ? "Aujourd'hui" : off === 1 ? "Demain" :
      new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Paris" }).format(date);
    if (slots.length) out.push({ offset: off, key, label, date, slots });
  }
  return out;
}

/** Spécification schema.org openingHoursSpecification. */
export function openingHoursSchema() {
  const map: Record<DayKey, string> = { lun: "Monday", mar: "Tuesday", mer: "Wednesday", jeu: "Thursday", ven: "Friday", sam: "Saturday", dim: "Sunday" };
  return DAY_ORDER.flatMap((k) =>
    bakery.hours[k].map((r) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${map[k]}`, opens: r.open, closes: r.close })),
  );
}
