// Mesure répétée de la performance d'une page (Lighthouse mobile) : médiane + détail du thread principal.
//   node qa/perf-home.mjs [chemin] [runs]
import { writeFileSync, mkdirSync } from "node:fs";
import lighthouse from "lighthouse";
import * as cl from "chrome-launcher";
const BASE = process.env.BASE_URL || "http://localhost:3000";
const path = process.argv[2] || "/";
const runs = Number(process.argv[3] || 3);
const rows = [];
for (let i = 0; i < runs; i++) {
  const c = await cl.launch({ chromePath: process.env.CHROME_PATH || "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome", chromeFlags: ["--headless=new", "--no-sandbox"] });
  const r = await lighthouse(BASE + path, { port: c.port, output: "json", logLevel: "error", onlyCategories: ["performance"] });
  await c.kill();
  const a = r.lhr.audits;
  const row = {
    perf: Math.round(r.lhr.categories.performance.score * 100),
    TBT: Math.round(a["total-blocking-time"].numericValue),
    LCP: Math.round(a["largest-contentful-paint"].numericValue),
    SI: Math.round(a["speed-index"].numericValue),
    mainThread: Object.fromEntries(a["mainthread-work-breakdown"].details.items.map((x) => [x.group, Math.round(x.duration)])),
    scripts: a["bootup-time"].details.items.slice(0, 4).map((x) => [x.url.replace(BASE, ""), Math.round(x.total), Math.round(x.scripting)]),
    htmlKB: Math.round((a["network-requests"].details.items.find((x) => x.resourceType === "Document")?.transferSize || 0) / 1024),
    jsKB: Math.round(a["network-requests"].details.items.filter((x) => x.resourceType === "Script").reduce((s, x) => s + x.transferSize, 0) / 1024),
  };
  rows.push(row);
  console.log(JSON.stringify(row));
}
const med = (k) => rows.map((r) => r[k]).sort((a, b) => a - b)[Math.floor(rows.length / 2)];
console.log(`MÉDIANE ${path} — perf ${med("perf")} · TBT ${med("TBT")} ms · LCP ${med("LCP")} ms · SI ${med("SI")} ms`);
mkdirSync("qa/reports", { recursive: true });
writeFileSync(`qa/reports/perf${path.replace(/\//g, "_") || "_"}.json`, JSON.stringify(rows, null, 2));
