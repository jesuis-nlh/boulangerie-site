// Usage: node qa/shot.mjs <path> <out.png> [width] [height] [fullPage]
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
const [, , path = "/", out = "qa/shots/tmp.png", w = "1440", h = "900", full = "0"] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
if (full === "1") {
  const H = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < H; y += 500) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
}
await page.screenshot({ path: out, fullPage: full === "1" });
if (errors.length) console.log("ERRORS:", errors.join("\n"));
await browser.close();
