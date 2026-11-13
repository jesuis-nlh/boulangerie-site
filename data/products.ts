/**
 * Catalogue — DONNÉES DE DÉMONSTRATION.
 *
 * Les noms, descriptions et prix ci-dessous sont fictifs et servent à
 * présenter l'expérience. Aucune composition ni liste d'allergènes n'est
 * inventée : `allergens.status` vaut "unverified" tant que la boutique n'a
 * pas fourni ses fiches. Voir docs/INTEGRATIONS.md pour brancher un catalogue réel.
 */

export type CategoryId =
  | "pains"
  | "viennoiseries"
  | "patisseries"
  | "gateaux"
  | "dejeuner"
  | "boissons";

export type Category = { id: CategoryId; label: string; blurb: string };

export const categories: Category[] = [
  { id: "pains", label: "Pains", blurb: "Levain, tradition, seigle — la base de tout." },
  { id: "viennoiseries", label: "Viennoiseries", blurb: "Pâte feuilletée au beurre, brioche lyonnaise." },
  { id: "patisseries", label: "Pâtisseries", blurb: "Parts et individuels de la vitrine." },
  { id: "gateaux", label: "Gâteaux sur commande", blurb: "Entiers, à commander 48 h à l'avance." },
  { id: "dejeuner", label: "Déjeuner", blurb: "Sandwichs sur pain maison, formule du midi." },
  { id: "boissons", label: "Boissons", blurb: "Pour accompagner, sur place ou à emporter." },
];

/** Identifiant d'illustration (voir components/art). */
export type ArtId =
  | "trame"
  | "demi"
  | "baguette"
  | "seigle"
  | "noix"
  | "courge"
  | "croissant"
  | "painchoc"
  | "brioche"
  | "chausson"
  | "tartepart"
  | "flan"
  | "eclair"
  | "millefeuille"
  | "tarteentiere"
  | "entremets"
  | "sandwich"
  | "formule"
  | "cafe"
  | "chocolat";

export type Allergens =
  | { status: "unverified" }
  | { status: "verified"; contains: string[]; mayContain: string[]; source: string };

export type Product = {
  slug: string;
  name: string;
  category: CategoryId;
  /** Phrase courte, ton de la maison. */
  short: string;
  /** Texte éditorial de la fiche produit. */
  description: string;
  /** Prix TTC en centimes. */
  priceCents: number;
  /** Poids net en grammes (affiché, et prix au kg calculé dès 200 g). */
  weightG?: number;
  /** Format quand le poids n'est pas pertinent (part, pièce, tasse…). */
  size?: string;
  art: ArtId;
  signature?: boolean;
  seasonal?: boolean;
  /** Délai de commande spécifique (gâteaux entiers). */
  leadTimeHours?: number;
  orderable: boolean;
  allergens: Allergens;
  /** Ingrédients : uniquement si fournis et vérifiés par la boutique. */
  ingredients?: { list: string; source: string };
};

const U: Allergens = { status: "unverified" };

export const products: Product[] = [
  // ——— Pains
  {
    slug: "la-trame",
    name: "La Trame",
    category: "pains",
    short: "Notre miche au levain, grignée en croisillon.",
    description:
      "La miche qui a donné son nom à la maison. Une croûte épaisse et sombre, une mie crème aux alvéoles irrégulières, une acidité douce qui s'arrondit le deuxième jour. Le croisillon de la grigne rappelle la trame des métiers à tisser des pentes.",
    priceCents: 980,
    weightG: 1000,
    art: "trame",
    signature: true,
    orderable: true,
    allergens: U,
  },
  {
    slug: "demi-trame",
    name: "Demi-Trame",
    category: "pains",
    short: "La même miche, pour une semaine à deux.",
    description:
      "La Trame en demi-format, pour ceux qui veulent un pain qui tient la semaine sans en avoir trop. Même levain, même cuisson longue.",
    priceCents: 520,
    weightG: 500,
    art: "demi",
    orderable: true,
    allergens: U,
  },
  {
    slug: "baguette-tradition",
    name: "Baguette de tradition",
    category: "pains",
    short: "Croûte qui chante, mie nacrée.",
    description:
      "Une baguette de tradition française façonnée à la main, à la croûte fine et cassante. Celle qu'on entame en remontant la Grande-Côte.",
    priceCents: 140,
    weightG: 250,
    art: "baguette",
    signature: true,
    orderable: true,
    allergens: U,
  },
  {
    slug: "pain-de-seigle",
    name: "Seigle des Pentes",
    category: "pains",
    short: "Dense, profond, presque chocolaté.",
    description:
      "Un pain de seigle à la mie serrée et humide, qui gagne en goût au fil des jours. Parfait avec un saint-marcellin ou des huîtres.",
    priceCents: 690,
    weightG: 600,
    art: "seigle",
    orderable: true,
    allergens: U,
  },
  {
    slug: "pain-aux-noix",
    name: "Pain aux noix",
    category: "pains",
    short: "Généreux en cerneaux, taillé pour le fromage.",
    description:
      "Une pâte au levain généreusement garnie de cerneaux. On le tranche fin, on le fait griller, on le partage avec un plateau de fromages.",
    priceCents: 560,
    weightG: 400,
    art: "noix",
    orderable: true,
    allergens: U,
  },
  {
    slug: "pain-d-automne",
    name: "Pain d'automne",
    category: "pains",
    short: "Courge rôtie et graines, le temps de la saison.",
    description:
      "Le pain de saison : une mie dorée par la courge rôtie, une croûte constellée de graines. Il quitte la vitrine avec les premiers froids.",
    priceCents: 620,
    weightG: 500,
    art: "courge",
    seasonal: true,
    orderable: true,
    allergens: U,
  },

  // ——— Viennoiseries
  {
    slug: "croissant",
    name: "Croissant au beurre",
    category: "viennoiseries",
    short: "Feuilletage net, cœur alvéolé.",
    description:
      "Un croissant feuilleté au beurre, tourné à la main. On le reconnaît au bruit qu'il fait quand on le casse en deux.",
    priceCents: 150,
    size: "Pièce",
    art: "croissant",
    signature: true,
    orderable: true,
    allergens: U,
  },
  {
    slug: "pain-au-chocolat",
    name: "Pain au chocolat",
    category: "viennoiseries",
    short: "Deux barres, pas une de moins.",
    description: "La même pâte que notre croissant, roulée autour de deux barres de chocolat noir.",
    priceCents: 165,
    size: "Pièce",
    art: "painchoc",
    orderable: true,
    allergens: U,
  },
  {
    slug: "brioche-pralines",
    name: "Brioche aux pralines roses",
    category: "viennoiseries",
    short: "La lyonnaise, filante et rose.",
    description:
      "Une brioche moelleuse où les pralines roses fondent à la cuisson et laissent des veines sucrées et croquantes. La gourmandise lyonnaise par excellence, à partager — ou pas.",
    priceCents: 1400,
    weightG: 450,
    art: "brioche",
    signature: true,
    orderable: true,
    allergens: U,
  },
  {
    slug: "chausson-aux-pommes",
    name: "Chausson aux pommes",
    category: "viennoiseries",
    short: "Compotée maison, feuilletage doré.",
    description: "Un feuilletage croustillant replié sur une compotée de pommes peu sucrée.",
    priceCents: 260,
    size: "Pièce",
    art: "chausson",
    orderable: true,
    allergens: U,
  },

  // ——— Pâtisseries
  {
    slug: "tarte-pralines-part",
    name: "Tarte aux pralines",
    category: "patisseries",
    short: "Rose vif, croquante, sans détour.",
    description:
      "Une pâte sablée et une garniture de pralines roses fondues à la crème. Le classique des bouchons, en part individuelle.",
    priceCents: 480,
    size: "Part",
    art: "tartepart",
    signature: true,
    orderable: true,
    allergens: U,
  },
  {
    slug: "flan-vanille",
    name: "Flan vanille",
    category: "patisseries",
    short: "Haut, tremblant, caramélisé dessus.",
    description: "Un flan pâtissier épais sur pâte feuilletée, à la surface brûlée au four.",
    priceCents: 420,
    size: "Part",
    art: "flan",
    orderable: true,
    allergens: U,
  },
  {
    slug: "eclair-cafe",
    name: "Éclair café",
    category: "patisseries",
    short: "Pâte à choux, crème au café torréfié.",
    description: "Une pâte à choux craquante garnie d'une crème pâtissière au café, glaçage fondant.",
    priceCents: 450,
    size: "Pièce",
    art: "eclair",
    orderable: true,
    allergens: U,
  },
  {
    slug: "mille-feuille",
    name: "Mille-feuille",
    category: "patisseries",
    short: "Feuilletage caramélisé, crème vanillée.",
    description: "Trois feuilletages caramélisés, deux couches de crème légère à la vanille.",
    priceCents: 520,
    size: "Pièce",
    art: "millefeuille",
    orderable: true,
    allergens: U,
  },

  // ——— Gâteaux sur commande
  {
    slug: "tarte-pralines-entiere",
    name: "Tarte aux pralines entière",
    category: "gateaux",
    short: "Pour six, à commander 48 h avant.",
    description:
      "Notre tarte aux pralines roses en grand format, pour les tablées du dimanche. À commander au moins 48 heures à l'avance.",
    priceCents: 2800,
    size: "6 parts",
    art: "tarteentiere",
    leadTimeHours: 48,
    orderable: true,
    allergens: U,
  },
  {
    slug: "entremets-canut",
    name: "Le Canut",
    category: "gateaux",
    short: "Chocolat noir, praliné, croustillant.",
    description:
      "Un entremets chocolat noir et praliné noisette sur un croustillant, glacé miroir. Notre gâteau d'anniversaire, à commander 48 heures à l'avance.",
    priceCents: 3600,
    size: "6 parts",
    art: "entremets",
    leadTimeHours: 48,
    orderable: true,
    allergens: U,
  },

  // ——— Déjeuner
  {
    slug: "jambon-beurre",
    name: "Jambon-beurre",
    category: "dejeuner",
    short: "Sur baguette de tradition, rien d'autre.",
    description: "Une baguette de tradition, du beurre, du jambon. Le minimum, très bien fait.",
    priceCents: 650,
    size: "Pièce",
    art: "sandwich",
    orderable: true,
    allergens: U,
  },
  {
    slug: "formule-pentes",
    name: "Formule des Pentes",
    category: "dejeuner",
    short: "Sandwich, pâtisserie, boisson.",
    description:
      "Un sandwich au choix, une pâtisserie de la vitrine et une boisson. Servie du mardi au samedi, de 11 h 30 à 14 h 30.",
    priceCents: 1290,
    size: "Formule",
    art: "formule",
    orderable: true,
    allergens: U,
  },

  // ——— Boissons
  {
    slug: "cafe-filtre",
    name: "Café filtre",
    category: "boissons",
    short: "Un café doux, à emporter.",
    description: "Un café filtre préparé à la tasse.",
    priceCents: 250,
    size: "25 cl",
    art: "cafe",
    orderable: false,
    allergens: U,
  },
  {
    slug: "chocolat-chaud",
    name: "Chocolat chaud",
    category: "boissons",
    short: "Épais, à l'ancienne.",
    description: "Un chocolat chaud épais préparé au lait entier.",
    priceCents: 380,
    size: "25 cl",
    art: "chocolat",
    orderable: false,
    allergens: U,
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const signatureProducts = products.filter((p) => p.signature);
export const seasonalProducts = products.filter((p) => p.seasonal);
