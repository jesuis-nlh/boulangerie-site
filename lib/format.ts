const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export const formatPrice = (cents: number) => eur.format(cents / 100);

/** Prix au kilo TTC, exigé pour les pains de 200 g et plus (arrêté 78-89/P). */
export const pricePerKg = (cents: number, weightG?: number) =>
  weightG && weightG >= 200 ? formatPrice(Math.round((cents * 1000) / weightG)) : null;

export const formatWeight = (g?: number) =>
  g ? (g >= 1000 ? `${(g / 1000).toLocaleString("fr-FR")} kg` : `${g} g`) : null;
