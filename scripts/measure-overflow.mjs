import { chromium } from "playwright-core";

const URL = process.argv[2] || "http://localhost:3232/";
const WIDTH = Number(process.argv[3] || 390);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: WIDTH, height: 844 }, deviceScaleFactor: 2 });
await page.goto(URL, { waitUntil: "networkidle" });

const result = await page.evaluate((vw) => {
  const docW = document.documentElement.scrollWidth;
  const bodyW = document.body.scrollWidth;
  const offenders = [];
  for (const el of document.querySelectorAll("*")) {
    // skip intentionally-scrollable shelves + off-screen drawer
    if (el.closest(".nav-drawer") || el.closest(".nav-drawer-backdrop")) continue;
    if (el.closest(".proc-grid") || el.closest(".pkg-grid") || el.closest(".eeat-list")) continue;
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 && r.width > 0 && r.height > 0) {
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className && el.className.toString) ? el.className.toString().slice(0, 50) : "",
        right: Math.round(r.right), width: Math.round(r.width), left: Math.round(r.left),
      });
    }
  }
  offenders.sort((a, b) => b.right - a.right);
  return { docW, bodyW, vw, count: offenders.length, top: offenders.slice(0, 12) };
}, WIDTH);

console.log(`vw=${result.vw} | document.scrollWidth=${result.docW} | body.scrollWidth=${result.bodyW} | REAL content offenders (excl. shelves/drawer)=${result.count}`);
for (const o of result.top) console.log(`  right=${o.right} w=${o.width} left=${o.left} <${o.tag} class="${o.cls}">`);
await browser.close();
