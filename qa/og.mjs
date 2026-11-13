// Génère public/og.png (1200×630) à partir du hero rendu.
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
await p.goto((process.env.BASE_URL || "http://localhost:3000") + "/", { waitUntil: "networkidle" });
await p.addStyleTag({ content: "header,[class*=ticker],[class*=facts],[class*=ctas]{display:none!important} [class*=hero]{padding-top:40px!important}" });
await p.waitForTimeout(800);
await p.screenshot({ path: "public/og.png" });
await b.close();
