// Lighthouse (mobile, throttling simulé par défaut) sur les pages clés. Rapport : qa/reports/lighthouse.json
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const PAGES = ["/", "/produits/", "/produits/la-trame/", "/commander/"];
const chrome = await chromeLauncher.launch({ chromePath: process.env.CHROME_PATH || "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome", chromeFlags: ["--headless=new", "--no-sandbox"] });
const out = [];
for (const p of PAGES) {
  const r = await lighthouse(BASE + p, { port: chrome.port, output: "json", logLevel: "error", onlyCategories: ["performance", "accessibility", "best-practices", "seo"] });
  const c = r.lhr.categories;
  const a = r.lhr.audits;
  const row = {
    page: p,
    performance: Math.round(c.performance.score * 100),
    accessibility: Math.round(c.accessibility.score * 100),
    bestPractices: Math.round(c["best-practices"].score * 100),
    seo: Math.round(c.seo.score * 100),
    LCP: a["largest-contentful-paint"].displayValue,
    CLS: a["cumulative-layout-shift"].displayValue,
    TBT: a["total-blocking-time"].displayValue,
    FCP: a["first-contentful-paint"].displayValue,
  };
  out.push(row);
  console.log(JSON.stringify(row));
}
await chrome.kill();
mkdirSync("qa/reports", { recursive: true });
writeFileSync("qa/reports/lighthouse.json", JSON.stringify(out, null, 2));
