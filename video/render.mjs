// Renders index.html frame-by-frame and encodes to MP4.
// Usage: node video/render.mjs [out.mp4]
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const out = process.argv[2] || path.join(dir, '..', 'public', 'video', 'folio-reel.mp4');
const only = process.env.STILLS; // e.g. "1,5,9" -> png stills instead of video
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto('file://' + path.join(dir, 'index.html'));
await page.evaluate(() => document.fonts.ready);
const { DUR, FPS } = await page.evaluate(() => ({ DUR: window.DUR, FPS: window.FPS }));
if (only) {
  for (const s of only.split(',')) { await page.evaluate(t => render(t), +s); await page.screenshot({ path: `${out}-${s}.png` }); }
  await browser.close(); process.exit(0);
}
const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
for (let f = 0; f < DUR * FPS; f++) {
  await page.evaluate(t => render(t), f / FPS);
  ff.stdin.write(await page.screenshot({ type: 'png' }));
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log('wrote', out);
