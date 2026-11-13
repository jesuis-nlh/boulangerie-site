import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/produits/", "/commander/", "/sur-mesure/", "/mentions-legales/", "/confidentialite/"];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.6 })),
    ...products.map((p) => ({ url: `${SITE_URL}/produits/${p.slug}/`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
