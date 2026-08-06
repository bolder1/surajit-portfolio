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
import { mkdirSync, statSync, readFileSync, existsSync, renameSync, unlinkSync } from "node:fs";
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

const SUSPECT = [];
const FAILED = [];
const browser = await chromium.launch();

/*
  How the checked-in placeholders happened, and what stops it recurring:
  several captures were taken while the app was still showing its loading
  skeleton, so the "screenshot" was grey bars. A skeleton is easy to spot
  numerically — it is a handful of greys repeated over a huge area — so every
  capture is scored before it is kept, and a low-variety frame is retried with
  a longer settle and reported at the end rather than written silently.
*/
async function looksLikeSkeleton(page) {
  return page.evaluate(async () => {
    const c = document.createElement("canvas");
    const w = (c.width = 160);
    const h = (c.height = 160);
    const ctx = c.getContext("2d");
    // Sample what the page actually painted, via an SVG-free path: read the
    // computed colours of the elements covering a grid of points.
    const seen = new Map();
    let filled = 0;
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        const el = document.elementFromPoint(
          (x + 0.5) * (window.innerWidth / 20),
          (y + 0.5) * (window.innerHeight / 20)
        );
        if (!el) continue;
        const cs = getComputedStyle(el);
        const key = cs.backgroundColor + "|" + cs.color;
        seen.set(key, (seen.get(key) || 0) + 1);
        if (el.textContent && el.textContent.trim().length > 1) filled++;
      }
    }
    void ctx;
    void w;
    void h;
    return { variety: seen.size, withText: filled };
  });
}

async function shoot(ctxOpts, url, path, maxH, attempt = 1) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForLoadState("networkidle", { timeout: 25000 }).catch(() => {});
    // Fonts settle after networkidle, and a page that swaps a face mid-capture
    // reads as broken typography in the shot.
    await page.evaluate(() => document.fonts?.ready).catch(() => {});
    // Give the app its own beat to render past any skeleton, longer each retry.
    await page.waitForTimeout(1800 * attempt);
    // Dismiss the usual overlays so they do not become the screenshot.
    await page.evaluate(() => {
      const pat = /accept|agree|got it|dismiss|close|allow all/i;
      for (const b of Array.from(document.querySelectorAll("button, [role=button], a"))) {
        if (pat.test(b.textContent || "") && b.offsetParent) {
          b.click();
          break;
        }
      }
    }).catch(() => {});
    await page.waitForTimeout(400);
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

    const score = await looksLikeSkeleton(page);
    // A real app paints many distinct colour pairs and a lot of text. A
    // skeleton paints three greys and none.
    const thin = score.variety < 6 || score.withText < 8;
    if (thin && attempt < 3) {
      console.log(
        `  retry ${path.split("/").pop()} — looks unloaded (variety ${score.variety}, text ${score.withText})`
      );
      await ctx.close();
      return shoot(ctxOpts, url, path, maxH, attempt + 1);
    }

    // Write beside the existing file, then swap, so a failed run never leaves
    // a half-written image where a good one used to be.
    const tmp = path + ".tmp.jpg";
    await page.screenshot({ path: tmp, type: "jpeg", quality: 72 });
    if (existsSync(path)) unlinkSync(path);
    renameSync(tmp, path);

    const kb = Math.round(statSync(path).size / 1024);
    if (thin) {
      SUSPECT.push(`${path.split("/").pop()} (variety ${score.variety}, text ${score.withText})`);
      console.log(`  KEPT-BUT-THIN ${path.split("/").pop()} (${kb}KB)`);
    } else {
      console.log(`  OK ${path.split("/").pop()} (${kb}KB)`);
    }
  } catch (e) {
    FAILED.push(`${path.split("/").pop()}: ${String(e).split("\n")[0]}`);
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

// Say plainly what came out. Silent partial success is what put concept
// renders into a section headed "Everything here is deployed".
if (FAILED.length) {
  console.log(`\n${FAILED.length} FAILED:`);
  for (const f of FAILED) console.log(`  ${f}`);
}
if (SUSPECT.length) {
  console.log(`\n${SUSPECT.length} still look unloaded after 3 attempts — check these by eye before shipping:`);
  for (const f of SUSPECT) console.log(`  ${f}`);
}
if (!FAILED.length && !SUSPECT.length) console.log("\nAll captures look like real, loaded screens.");
console.log("done — commit the refreshed public/showcase/*.jpg");
