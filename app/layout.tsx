import type { Metadata, Viewport } from "next";
import "./globals.css";
import { display, text, mono } from "./fonts";
import { RisoDefs } from "@/components/art/RisoDefs";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SiteEffects } from "@/components/SiteEffects";
import { Cursor } from "@/components/Cursor";
import { bakery } from "@/config/bakery";
import { SITE_URL, bakerySchema } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Trame — Boulangerie au levain à la Croix-Rousse, Lyon",
    template: "%s · Trame, boulangerie Croix-Rousse",
  },
  description:
    "Boulangerie au levain naturel sur les pentes de la Croix-Rousse (Lyon 1er) : miches, baguette de tradition, croissants, brioche et tarte aux pralines. Commande en ligne et retrait en boutique.",
  applicationName: bakery.brand.name,
  // Site de démonstration (entreprise fictive) : jamais indexé.
  robots: bakery.isDemo ? { index: false, follow: false } : { index: true, follow: true },
  icons: { icon: "/icon.svg" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f3ebdd",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${text.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bakerySchema()) }} />
      </head>
      <body>
        <a href="#contenu" className="skip-link">
          Aller au contenu
        </a>
        <RisoDefs />
        <CartProvider>
          <Header />
          <main id="contenu" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
        <SiteEffects />
        <Cursor />
      </body>
    </html>
  );
}
