/**
 * Configuration centrale de la boulangerie.
 *
 * Tout ce qui est propre à une boutique (identité, coordonnées, horaires,
 * commande, réseaux, palette) vit ici. Pour adapter le site à une autre
 * boulangerie, on remplace ce fichier et `data/products.ts` — pas les composants.
 *
 * ⚠️ DÉMONSTRATION : « Trame » est une boulangerie fictive. L'adresse, le
 * téléphone, l'e-mail, les horaires et le SIRET ci-dessous sont des valeurs
 * de démonstration et ne doivent jamais être publiés tels quels.
 */

export type DayKey = "lun" | "mar" | "mer" | "jeu" | "ven" | "sam" | "dim";

/** Plages horaires au format "HH:MM". Tableau vide = fermé. */
export type Hours = Record<DayKey, { open: string; close: string }[]>;

export type OrderingMode =
  /** Parcours complet en mode démo : rien n'est transmis, aucun paiement. */
  | "demo"
  /** Redirige vers un prestataire réel (URL fournie par la boutique). */
  | "external"
  /** Pas de commande en ligne : téléphone / boutique uniquement. */
  | "phone";

export const bakery = {
  /** Passe à `false` uniquement quand toutes les données ont été vérifiées. */
  isDemo: true,

  brand: {
    name: "Trame",
    legalName: "Trame — boulangerie (entreprise fictive)",
    tagline: "Boulangerie au levain · Croix-Rousse",
    descriptor: "Boulangerie au levain naturel sur les pentes de la Croix-Rousse, à Lyon.",
    founded: "2019",
    baker: "L'équipe du fournil",
  },

  /**
   * Conditions de l'article L122-17 du Code de la consommation.
   * Le site n'emploie le mot « boulangerie » que si `qualifiesAsBoulangerie`
   * est vrai, ce qui doit être confirmé par le professionnel.
   */
  compliance: {
    qualifiesAsBoulangerie: true, // ⚠️ à confirmer pour une boutique réelle
    madeOnSite: {
      kneading: true,
      fermentation: true,
      shaping: true,
      bakingAtPointOfSale: true,
      noFrozenDoughOrBread: true,
    },
    organicCertified: false, // ne jamais afficher « bio » sans certificat
    allergenDataVerified: false,
  },

  contact: {
    street: "Montée de la Grande-Côte (adresse fictive)",
    postalCode: "69001",
    city: "Lyon",
    neighbourhood: "Pentes de la Croix-Rousse",
    country: "FR",
    phoneDisplay: "04 00 00 00 00",
    phoneHref: "+33400000000",
    email: "bonjour@trame.example",
    geo: { lat: 45.7705, lng: 4.8315 },
    transport: [
      { line: "Métro C", stop: "Croix-Paquet", note: "à vérifier" },
      { line: "Métro A / C", stop: "Hôtel de Ville – Louis Pradel", note: "à vérifier" },
    ],
  },

  hours: {
    lun: [],
    mar: [{ open: "07:00", close: "19:30" }],
    mer: [{ open: "07:00", close: "19:30" }],
    jeu: [{ open: "07:00", close: "19:30" }],
    ven: [{ open: "07:00", close: "19:30" }],
    sam: [{ open: "07:00", close: "19:30" }],
    dim: [{ open: "07:00", close: "13:00" }],
  } satisfies Hours,

  ordering: {
    mode: "demo" as OrderingMode,
    externalUrl: "", // ex. URL d'un prestataire click & collect
    leadTimeMinutes: 120, // délai minimal avant retrait
    slotMinutes: 30,
    daysAhead: 6,
    maxQuantityPerLine: 12,
  },

  /**
   * Avis clients : uniquement depuis une source vérifiable (ex. Google Business
   * Profile via API officielle). `null` = aucun avis affiché, jamais d'avis inventés.
   */
  reviews: { provider: null as null | "google", placeUrl: "" },

  social: [
    { label: "Instagram", href: "https://www.instagram.com/" },
  ],

  site: {
    url: "https://trame-boulangerie.example",
    locale: "fr_FR",
  },

  legal: {
    siret: "000 000 000 00000 (fictif)",
    host: "À définir lors de la mise en ligne",
    publicationDirector: "À renseigner",
  },
} as const;

export type Bakery = typeof bakery;

export const DAY_ORDER: DayKey[] = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];

export const DAY_LABEL: Record<DayKey, string> = {
  lun: "Lundi",
  mar: "Mardi",
  mer: "Mercredi",
  jeu: "Jeudi",
  ven: "Vendredi",
  sam: "Samedi",
  dim: "Dimanche",
};
