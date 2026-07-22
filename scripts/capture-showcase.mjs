/*
  Capture REAL screens of every showcase product.

  Run locally (needs open network access to the live products):
    npm i -D playwright   # if not already installed
    node scripts/capture-showcase.mjs

  For each product in lib/showcase.ts this visits the live URL, scrolls
  through the whole app (triggering lazy content), then captures a tall
  desktop (1280w) and mobile (390w) screenshot into public/showcase/,
  replacing the checked-in concept renders. No code changes needed.
*/

import { chromium } from "playwright";
import { mkdirSync, statSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "public", "showcase");
mkdirSync(OUT, { recursive: true });

// Parse the product list straight out of lib/showcase.ts (slug + url).
const src = readFileSync(join(root, "lib", "showcase.ts"), "utf8");
const PRODUCTS = [...src.matchAll(/slug:\s*"([^"]+)"[\s\S]*?url:\s*"([^"]+)"/g)].map(
  ([, slug, url]) => ({ slug, url })
);
if (PRODUCTS.length === 0) {
  console.error("No products parsed from lib/showcase.ts");
  process.exit(1);
}
console.log(`${PRODUCTS.length} products`);

const browser = await chromium.launch();

async function shoot(ctxOpts, url, path, maxH) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForLoadState("networkidle", { timeout: 25000 }).catch(() => {});
    // Scroll through the whole app so lazy content and animations settle.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.75;
      const max = Math.min(document.body.scrollHeight, 12000);
      for (let y = 0; y < max; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 220));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 500));
    });
    const h = await page.evaluate(() =>
      Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        window.innerHeight
      )
    );
    await page.setViewportSize({
      width: ctxOpts.viewport.width,
      height: Math.min(h, maxH),
    });
    await page.waitForTimeout(700);
    await page.screenshot({ path, type: "jpeg", quality: 70 });
    console.log(
      `  OK ${path.split("/").pop()} (${Math.round(statSync(path).size / 1024)}KB)`
    );
  } catch (e) {
    console.log(`  FAIL ${url}: ${String(e).split("\n")[0]}`);
  } finally {
    await ctx.close();
  }
}

for (const p of PRODUCTS) {
  console.log(p.slug);
  await shoot(
    { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 },
    p.url,
    join(OUT, `${p.slug}-d.jpg`),
    4200
  );
  await shoot(
    {
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true,
    },
    p.url,
    join(OUT, `${p.slug}-m.jpg`),
    2600
  );
}

await browser.close();
console.log("done — commit the refreshed public/showcase/*.jpg");
