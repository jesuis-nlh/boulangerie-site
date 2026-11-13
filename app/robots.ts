import type { MetadataRoute } from "next";
import { bakery } from "@/config/bakery";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Démonstration : on bloque l'indexation d'une entreprise fictive.
  if (bakery.isDemo) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
