import type { Metadata } from "next";
import { bakery } from "@/config/bakery";
import { openingHoursSchema } from "./hours";

export const SITE_URL = bakery.site.url;

/** Métadonnées par page : titre unique, description, canonique, Open Graph. */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", locale: bakery.site.locale, siteName: bakery.brand.name, images: [{ url: "/og.png", width: 1200, height: 630, alt: "Trame, boulangerie au levain — Croix-Rousse, Lyon" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  };
}

/** Données structurées schema.org/Bakery (LocalBusiness). */
export function bakerySchema() {
  const c = bakery.contact;
  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "@id": `${SITE_URL}/#bakery`,
    name: bakery.brand.name,
    description: bakery.brand.descriptor,
    url: SITE_URL,
    image: `${SITE_URL}/og.png`,
    telephone: c.phoneHref,
    email: c.email,
    priceRange: "€",
    servesCuisine: "Boulangerie française",
    address: {
      "@type": "PostalAddress",
      streetAddress: c.street,
      postalCode: c.postalCode,
      addressLocality: c.city,
      addressCountry: c.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: c.geo.lat, longitude: c.geo.lng },
    openingHoursSpecification: openingHoursSchema(),
    sameAs: bakery.social.map((s) => s.href),
    // Aucune note ni avis : à n'ajouter qu'avec des données réelles et vérifiables.
  };
}
