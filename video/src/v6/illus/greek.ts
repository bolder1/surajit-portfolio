// Greeking: the seeded rhythm every bar, chart and key-value row is built on.
// Everything here is a pure function of a seed. Nothing changes per frame: a bar's
// width is fixed for the component's life and only its extension (scaleX) animates,
// driven by a progress prop the scene computes.
import { EO, rand } from "../../lib/anim";

/** Bar height and line pitch per type scale (0.55 of the type size, on its line pitch). */
export const GREEK = {
  caption: { h: 6, pitch: 16 },
  body: { h: 8, pitch: 20 },
  title: { h: 12, pitch: 28 },
  value: { h: 18, pitch: 36 },
  display: { h: 24, pitch: 48 },
} as const;

export type GreekScale = keyof typeof GREEK;

export const BAR_RADIUS = 2;
export const BAR_MIN = 24;

const quant = (v: number, step: number) => Math.max(BAR_MIN, Math.round(v / step) * step);

/** A default seed from a component's position so two components in one frame differ. */
export const seedFrom = (x: number, y: number) => ((Math.round(x) * 73 + Math.round(y) * 151) % 9973) + 1;

/** n bar widths from a base width: base times 0.42 to 1.0, quantised to 8, never under 24. */
export const greekWidths = (seed: number, n: number, base: number): number[] => {
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(quant(base * (0.42 + 0.58 * rand(seed * 1009 + i * 17)), 8));
  return out;
};

/**
 * A paragraph: lines 1 to n-1 in 0.86 to 1.0 of base, the last in 0.38 to 0.70, and no two
 * consecutive lines within 8 px of each other (nudged by 8 if they are).
 */
export const greekLines = (seed: number, n: number, base: number): number[] => {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const r = rand(seed * 1009 + i * 17);
    const last = i === n - 1 && n > 1;
    let w = quant(base * (last ? 0.38 + 0.32 * r : 0.86 + 0.14 * r), 4);
    if (i > 0 && Math.abs(w - out[i - 1]) < 8) w = w + 8 <= base ? w + 8 : w - 8;
    out.push(Math.max(BAR_MIN, w));
  }
  return out;
};

/** A key-value row: the key at keyW of the row, the value at 0.48 to 1.0 of the rest. */
export const kvWidths = (seed: number, w: number, keyW = 0.32) => {
  const key = quant(w * keyW, 4);
  const rest = w - key - 16;
  const value = quant(rest * (0.48 + 0.52 * rand(seed * 1009 + 311)), 4);
  return { key, value };
};

const seriesCache = new Map<string, number[]>();

/**
 * A seeded random walk (steps of at most 0.12), smoothed with a three-tap mean and
 * normalised to 0.15 to 0.85. Values are heights in 0..1 (1 is the top). Memoised on [seed, n].
 */
export const seriesFrom = (seed: number, n: number): number[] => {
  const key = `${seed}:${n}`;
  const hit = seriesCache.get(key);
  if (hit) return hit;
  const walk: number[] = [];
  let v = 0.5;
  for (let i = 0; i < n; i++) {
    v += (rand(seed * 613 + i * 7) * 2 - 1) * 0.12;
    walk.push(v);
  }
  const smooth = walk.map((_, i) => {
    const a = walk[Math.max(0, i - 1)];
    const c = walk[Math.min(n - 1, i + 1)];
    return (a + walk[i] + c) / 3;
  });
  let lo = Infinity;
  let hi = -Infinity;
  for (const s of smooth) {
    lo = Math.min(lo, s);
    hi = Math.max(hi, s);
  }
  const span = hi - lo;
  const out = smooth.map((s) => (span < 1e-6 ? 0.5 : 0.15 + ((s - lo) / span) * 0.7));
  seriesCache.set(key, out);
  return out;
};

/** Two to four donut segments, each at least 0.12, summing to 1. */
export const donutFrom = (seed: number): number[] => {
  const k = 2 + Math.floor(rand(seed * 31 + 5) * 3);
  const raw: number[] = [];
  let sum = 0;
  for (let i = 0; i < k; i++) {
    const r = 0.2 + rand(seed * 97 + i * 13);
    raw.push(r);
    sum += r;
  }
  const free = 1 - 0.12 * k;
  const out = raw.map((r) => 0.12 + (free * r) / sum);
  const drift = out.reduce((a, b) => a + b, 0) - 1;
  out[k - 1] -= drift;
  return out;
};

/**
 * Staggered progress for item i of a group: each item takes `each` units and starts
 * `gap` units after the one before, so a group of n spans each + (n - 1) * gap units.
 * Pass the group's linear progress 0..1; the item's own curve is EO.
 */
export const stagger = (p: number, i: number, n: number, each = 8, gap = 2) => {
  const total = each + Math.max(0, n - 1) * gap;
  const local = (p * total - i * gap) / each;
  const c = Math.min(1, Math.max(0, local));
  return EO(c);
};
