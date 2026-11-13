// Audit axe-core (WCAG 2.1 A/AA) sur les pages clés, en desktop et mobile.
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const { AxeBuilder } = require("@axe-core/playwright");

const BASE = process.env.BASE_URL || "http://localhost:3000";
const PAGES = ["/", "/produits/", "/produits/brioche-pralines/", "/commander/", "/sur-mesure/", "/mentions-legales/", "/confidentialite/", "/introuvable/"];
const SIZES = [{ w: 1440, h: 900 }, { w: 390, h: 844 }];
const browser = await chromium.launch();
const report = [];
let total = 0;
for (const s of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]).analyze();
    const v = r.violations.map((x) => ({ id: x.id, impact: x.impact, help: x.help, nodes: x.nodes.slice(0, 3).map((n) => n.target.join(" ")) }));
    total += v.length;
    report.push({ page: p, width: s.w, violations: v, passes: r.passes.length });
    console.log(`${s.w}px ${p.padEnd(30)} ${v.length ? "✗ " + v.map((x) => `${x.id}(${x.impact})`).join(", ") : "✓ 0 violation"}  [${r.passes.length} règles OK]`);
  }
  await ctx.close();
}
await browser.close();
mkdirSync("qa/reports", { recursive: true });
writeFileSync("qa/reports/a11y.json", JSON.stringify(report, null, 2));
console.log(`\nTotal violations : ${total}`);
process.exit(total ? 1 : 0);
