// Matrice de captures : pages × largeurs + états d'interaction. Sortie : qa/shots/<largeur>/<nom>.png
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
const { chromium } = createRequire(import.meta.url)("playwright");
const BASE = process.env.BASE_URL || "http://localhost:3000";
const WIDTHS = (process.env.WIDTHS || "390,768,1024,1440").split(",").map(Number);
const PAGES = [
  ["home", "/"],
  ["produits", "/produits/"],
  ["fiche", "/produits/brioche-pralines/"],
  ["commander", "/commander/"],
  ["sur-mesure", "/sur-mesure/"],
];
const FULL = process.env.FULL !== "0";

async function settle(page) {
  const H = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < H; y += 600) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
}

const browser = await chromium.launch();
for (const w of WIDTHS) {
  mkdirSync(`qa/shots/${w}`, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 844 : 900 }, deviceScaleFactor: 1, locale: "fr-FR", timezoneId: "Europe/Paris", hasTouch: w < 1024 });
  const page = await ctx.newPage();
  for (const [name, path] of PAGES) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `qa/shots/${w}/${name}-fold.png` });
    if (FULL) {
      await settle(page);
      await page.screenshot({ path: `qa/shots/${w}/${name}-full.png`, fullPage: true });
    }
  }
  // États : panier ouvert avec articles
  await page.goto(BASE + "/produits/", { waitUntil: "networkidle" });
  for (const n of ["Croissant au beurre", "La Trame", "Brioche aux pralines roses"]) await page.getByRole("button", { name: `Ajouter ${n} au panier` }).click();
  await page.getByRole("button", { name: /Ouvrir le panier/ }).click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `qa/shots/${w}/state-cart.png` });
  await page.keyboard.press("Escape");
  // Commande : erreurs de validation
  await page.goto(BASE + "/commander/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Envoyer la demande" }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `qa/shots/${w}/state-order-errors.png`, fullPage: true });
  // Menu mobile
  if (w < 1180) {
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `qa/shots/${w}/state-menu.png` });
  }
  // Survol de l'index des rayons (desktop)
  if (w >= 1024) {
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    const row = page.locator('a[href="/produits/?rayon=viennoiseries"]');
    await row.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    const b = await row.boundingBox();
    await page.mouse.move(b.x + b.width * 0.55, b.y + b.height / 2, { steps: 8 });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `qa/shots/${w}/state-category-hover.png` });
  }
  await ctx.close();
  console.log("✓", w);
}
await browser.close();
