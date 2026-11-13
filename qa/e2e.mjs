// Tests fonctionnels de bout en bout — à lancer contre le build statique servi sur :3000
//   npm run build && npx serve out -l 3000 &  puis  node qa/e2e.mjs
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";
const { chromium } = createRequire(import.meta.url)("playwright");

const BASE = process.env.BASE_URL || "http://localhost:3000";
const results = [];
const consoleErrors = [];
let browser;

async function test(name, fn) {
  const t0 = Date.now();
  try {
    await fn();
    results.push({ name, ok: true, ms: Date.now() - t0 });
    console.log(`  ✓ ${name}`);
  } catch (e) {
    results.push({ name, ok: false, error: String(e.message || e).slice(0, 400) });
    console.log(`  ✗ ${name}\n    ${String(e.message || e).split("\n")[0]}`);
  }
}
const assert = (c, m) => {
  if (!c) throw new Error(m);
};

async function newPage(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "fr-FR", timezoneId: "Europe/Paris", ...opts });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(`${page.url()} — ${m.text()}`));
  page.on("pageerror", (e) => consoleErrors.push(`${page.url()} — ${e}`));
  return { ctx, page };
}

browser = await chromium.launch();
console.log("E2E —", BASE);

await test("Accueil : titre, H1 unique, CTA Commander et Découvrir", async () => {
  const { ctx, page } = await newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  assert((await page.title()).includes("Boulangerie"), "titre de page");
  assert((await page.locator("h1").count()) === 1, "un seul h1");
  assert(await page.getByRole("link", { name: /^Commander/ }).first().isVisible(), "CTA Commander visible");
  assert(await page.getByRole("link", { name: "Découvrir nos produits" }).isVisible(), "CTA Découvrir visible");
  await ctx.close();
});

await test("Navigation : liens principaux et ancres", async () => {
  const { ctx, page } = await newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.getByRole("navigation", { name: "Navigation principale" }).getByRole("link", { name: "Nos produits" }).click();
  await page.waitForURL(/\/produits\/$/);
  await page.getByRole("navigation", { name: "Navigation principale" }).getByRole("link", { name: "Contact" }).click();
  await page.waitForURL(/#contact$/);
  await page.waitForTimeout(800);
  assert(await page.locator("#contact").isVisible(), "section contact");
  await ctx.close();
});

await test("Catalogue : filtre par rayon, lien profond, recherche, état vide", async () => {
  const { ctx, page } = await newPage();
  await page.goto(BASE + "/produits/", { waitUntil: "networkidle" });
  const tiles = page.locator("main ul li article");
  assert((await tiles.count()) === 20, `20 produits (reçu ${await tiles.count()})`);
  await page.getByRole("button", { name: /^Viennoiseries/ }).click();
  await page.waitForTimeout(700);
  assert((await tiles.count()) === 4, "4 viennoiseries");
  assert(page.url().includes("rayon=viennoiseries"), "URL mise à jour");
  await page.goto(BASE + "/produits/?rayon=pains", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  assert((await tiles.count()) === 6, "lien profond pains = 6");
  assert((await page.getByRole("button", { name: /^Pains/ }).getAttribute("aria-pressed")) === "true", "chip pressé");
  await page.getByRole("button", { name: /^Tout/ }).click();
  await page.getByLabel("Rechercher un produit").fill("praline");
  await page.waitForTimeout(700);
  assert((await tiles.count()) >= 3, "recherche praline ≥ 3");
  await page.getByLabel("Rechercher un produit").fill("xyzzy");
  await page.waitForTimeout(500);
  assert(await page.getByText(/Rien ne correspond/).isVisible(), "état vide");
  await page.getByRole("button", { name: "Réinitialiser les filtres" }).click();
  await page.waitForTimeout(600);
  assert((await tiles.count()) === 20, "réinitialisation");
  await ctx.close();
});

await test("Panier : ajout, quantités, calcul du total, persistance, suppression", async () => {
  const { ctx, page } = await newPage();
  await page.goto(BASE + "/produits/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Ajouter Croissant au beurre au panier" }).click();
  await page.getByRole("button", { name: "Ajouter Croissant au beurre au panier" }).click();
  await page.getByRole("button", { name: "Ajouter La Trame au panier" }).click();
  await page.getByRole("button", { name: /Ouvrir le panier, 3 articles/ }).click();
  const dlg = page.getByRole("dialog", { name: "Votre panier" });
  await dlg.waitFor();
  // 2 × 1,50 + 9,80 = 12,80
  assert((await dlg.innerText()).includes("12,80"), "total 12,80 €");
  await dlg.getByRole("button", { name: "Ajouter un Croissant au beurre" }).click();
  await page.waitForTimeout(300);
  assert((await dlg.innerText()).includes("14,30"), "total 14,30 € après +1");
  await page.keyboard.press("Escape");
  await dlg.waitFor({ state: "detached" });
  await page.reload({ waitUntil: "networkidle" });
  assert(await page.getByRole("button", { name: /Ouvrir le panier, 4 articles/ }).isVisible(), "persistance après rechargement");
  await page.goto(BASE + "/commander/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Retirer La Trame du panier" }).click();
  await page.waitForTimeout(600);
  assert((await page.locator("aside").innerText()).includes("4,50"), "total 4,50 € après suppression");
  await ctx.close();
});

await test("Fiche produit : prix TTC, prix au kg, ajout avec quantité, allergènes non inventés", async () => {
  const { ctx, page } = await newPage();
  await page.goto(BASE + "/produits/baguette-tradition/", { waitUntil: "networkidle" });
  const t = (await page.locator("main").innerText()).replace(/[\u202f\u00a0]/g, " ");
  assert(t.includes("1,40") && t.includes("5,60 € / kg"), "prix et prix/kg (1,40 € / 250 g = 5,60 €/kg)");
  assert(/ne sont pas encore publiés en ligne/.test(t), "mention allergènes non vérifiés");
  await page.getByRole("button", { name: /^Ajouter un Baguette/ }).click();
  await page.getByRole("button", { name: /^Ajouter 2 × Baguette/ }).click();
  const dlg = page.getByRole("dialog", { name: "Votre panier" });
  await dlg.waitFor();
  assert((await dlg.innerText()).includes("2,80"), "2 baguettes = 2,80 €");
  await ctx.close();
});

await test("Commande : validation accessible puis issue « démonstration » sans faux succès", async () => {
  const { ctx, page } = await newPage();
  await page.goto(BASE + "/commander/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Envoyer la demande" }).click();
  const summary = page.locator(".error-summary[role=alert]");
  await summary.waitFor();
  assert((await summary.innerText()).includes("points à corriger"), "récapitulatif d'erreurs");
  assert(await summary.evaluate((el) => el === document.activeElement), "focus sur le récapitulatif");
  await page.getByRole("button", { name: /La Trame/ }).first().click();
  await page.locator('input[name="day"]').nth(1).check({ force: true });
  const opts = await page.locator("#slot option").count();
  assert(opts > 1, "créneaux proposés");
  await page.selectOption("#slot", { index: 1 });
  await page.fill("#name", "Camille");
  await page.fill("#phone", "12");
  await page.locator("#phone").blur();
  assert(await page.locator("#phone-err").isVisible(), "erreur téléphone en ligne");
  assert((await page.locator("#phone").getAttribute("aria-invalid")) === "true", "aria-invalid");
  await page.fill("#phone", "06 12 34 56 78");
  await page.getByRole("button", { name: "Envoyer la demande" }).click();
  await page.getByRole("heading", { name: /n'a pas été envoyée/ }).waitFor();
  const txt = await page.locator("main").innerText();
  assert(/aucun paiement n'a été effectué/.test(txt), "mention aucun paiement");
  assert(!/commande confirmée|paiement accepté/i.test(txt), "pas de faux succès");
  await ctx.close();
});

await test("Gâteaux sur commande : délai de 48 h appliqué aux créneaux", async () => {
  const { ctx, page } = await newPage();
  await page.goto(BASE + "/produits/entremets-canut/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /^Ajouter 1 × Le Canut/ }).click();
  await page.goto(BASE + "/commander/", { waitUntil: "networkidle" });
  const t = await page.locator("main").innerText();
  assert(/au plus tôt dans 48 heures/.test(t), "message délai 48 h");
  const labels = await page.locator('input[name="day"]').evaluateAll((els) => els.map((e) => e.parentElement.innerText));
  assert(!labels.some((l) => /Aujourd'hui/.test(l)), "pas de retrait aujourd'hui");
  await ctx.close();
});

await test("Devis sur mesure : validation (contact requis, date min) et issue démo", async () => {
  const { ctx, page } = await newPage();
  await page.goto(BASE + "/sur-mesure/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();
  await page.locator(".error-summary").waitFor();
  assert((await page.locator(".error-summary").innerText()).includes("moyen de vous recontacter"), "contact requis");
  await page.selectOption("#occasion", "Anniversaire");
  const min = await page.locator("#date").getAttribute("min");
  await page.fill("#date", min);
  await page.fill("#guests", "12");
  await page.fill("#message", "Un entremets chocolat praliné pour 12 personnes.");
  await page.fill("#name", "Camille");
  await page.fill("#email", "camille@exemple.fr");
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();
  await page.getByRole("heading", { name: /pas envoyée/ }).waitFor();
  assert(await page.getByRole("link", { name: /Envoyer par e-mail/ }).isVisible(), "alternative e-mail réelle");
  await ctx.close();
});

await test("Clavier : lien d'évitement, menu mobile (Échap), panier (piège de focus)", async () => {
  const { ctx, page } = await newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  assert((await page.evaluate(() => document.activeElement?.textContent)) === "Aller au contenu", "lien d'évitement en premier");
  const menuBtn = page.getByRole("button", { name: "Ouvrir le menu" });
  await menuBtn.click();
  const sheet = page.getByRole("dialog", { name: "Menu" });
  await sheet.waitFor();
  await page.waitForTimeout(400);
  assert(await page.evaluate(() => document.activeElement?.textContent?.includes("Accueil")), "focus sur le 1er lien");
  await page.keyboard.press("Escape");
  await sheet.waitFor({ state: "detached" });
  assert(await page.evaluate(() => document.activeElement?.getAttribute("aria-controls") === "menu-mobile"), "focus rendu au bouton");
  await page.getByRole("button", { name: /Ouvrir le panier/ }).click();
  const dlg = page.getByRole("dialog", { name: "Votre panier" });
  await dlg.waitFor();
  for (let i = 0; i < 6; i++) await page.keyboard.press("Tab");
  assert(await dlg.evaluate((d) => d.contains(document.activeElement)), "focus reste dans le panier");
  await ctx.close();
});

await test("Mouvement réduit : contenu visible, bandeau défilant arrêté", async () => {
  const { ctx, page } = await newPage({ reducedMotion: "reduce" });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const hidden = await page.evaluate(() => [...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).opacity === "0").length);
  assert(hidden === 0, `${hidden} éléments masqués`);
  const anim = await page.evaluate(() => getComputedStyle(document.querySelector('[class*="track"]')).animationName);
  assert(anim === "none", "marquee arrêté");
  await ctx.close();
});

await test("Liens internes et images : aucun lien cassé", async () => {
  const { ctx, page } = await newPage();
  const seen = new Set();
  const queue = ["/"];
  const broken = [];
  while (queue.length) {
    const path = queue.shift();
    if (seen.has(path)) continue;
    seen.add(path);
    const res = await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
    if (!res || res.status() >= 400) {
      broken.push(`${path} → ${res?.status()}`);
      continue;
    }
    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
    for (const h of hrefs) {
      if (!h || !h.startsWith("/")) continue;
      const clean = h.split("#")[0].split("?")[0];
      if (clean && !seen.has(clean)) queue.push(clean);
    }
    const badImg = await page.$$eval("img", (imgs) => imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src));
    broken.push(...badImg.map((s) => `${path} image ${s}`));
  }
  assert(broken.length === 0, broken.join(", "));
  assert(seen.size >= 26, `pages explorées : ${seen.size}`);
  await ctx.close();
});

await test("SEO : titres uniques, meta description, canonique, JSON-LD Bakery, noindex démo", async () => {
  const { ctx, page } = await newPage();
  const paths = ["/", "/produits/", "/produits/la-trame/", "/commander/", "/sur-mesure/", "/mentions-legales/", "/confidentialite/"];
  const titles = new Set();
  for (const p of paths) {
    await page.goto(BASE + p, { waitUntil: "domcontentloaded" });
    const t = await page.title();
    assert(!titles.has(t), `titre dupliqué : ${t}`);
    titles.add(t);
    const d = await page.getAttribute('meta[name="description"]', "content");
    assert(d && d.length > 60 && d.length < 200, `description ${p} (${d?.length})`);
    assert(await page.getAttribute('link[rel="canonical"]', "href"), `canonique ${p}`);
    assert((await page.locator("h1").count()) === 1, `h1 unique ${p}`);
  }
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  const ld = await page.$$eval('script[type="application/ld+json"]', (s) => s.map((x) => JSON.parse(x.textContent)));
  assert(ld.some((x) => x["@type"] === "Bakery" && x.openingHoursSpecification?.length === 6), "JSON-LD Bakery + horaires");
  assert(!JSON.stringify(ld).includes("aggregateRating"), "aucune note inventée");
  assert((await page.getAttribute('meta[name="robots"]', "content")).includes("noindex"), "noindex en démo");
  await ctx.close();
});

await browser.close();

const passed = results.filter((r) => r.ok).length;
console.log(`\n${passed}/${results.length} tests réussis · erreurs console : ${consoleErrors.length}`);
consoleErrors.slice(0, 10).forEach((e) => console.log("  console:", e));
mkdirSync("qa/reports", { recursive: true });
writeFileSync("qa/reports/e2e.json", JSON.stringify({ base: BASE, date: new Date().toISOString(), results, consoleErrors }, null, 2));
process.exit(passed === results.length && consoleErrors.length === 0 ? 0 : 1);
