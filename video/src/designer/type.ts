// Designer reel type: ONE family, sans-serif only: Bricolage Grotesque (variable opsz/wdth/wght). No serif, no mono, no dot-matrix.
import type React from "react";
import { bric } from "../lib/theme";

export const family = bric;

/** Bricolage at a given weight (200-800), width (75-100) and optical size (12-96). */
export const sans = (wght = 500, wdth = 100, opsz = 24): React.CSSProperties => ({
  fontFamily: bric,
  fontVariationSettings: `'wght' ${wght.toFixed(0)}, 'wdth' ${wdth.toFixed(1)}, 'opsz' ${opsz.toFixed(0)}`,
});

/** Chunky display headline: heavy, condensed a little, tight, optical size 96. */
export const head = (size: number, wdth = 86, wght = 800): React.CSSProperties => ({
  ...sans(wght, wdth, 96),
  fontSize: size,
  lineHeight: 0.9,
  letterSpacing: "-0.015em",
});

/** Small caps-style label: uppercase, tracked. Use >= 18 px. */
export const label = (size = 20, wght = 560): React.CSSProperties => ({
  ...sans(wght, 100, 14),
  fontSize: size,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  lineHeight: 1.2,
});

/** Body / statement text. */
export const body = (size = 32, wght = 500): React.CSSProperties => ({
  ...sans(wght, 100, Math.min(96, Math.max(14, size * 0.6))),
  fontSize: size,
  lineHeight: 1.18,
  letterSpacing: "-0.005em",
});

/** Big numerals: heavy, tabular digits (equal widths). */
export const numeral = (size: number, wdth = 92, wght = 800): React.CSSProperties => ({
  ...sans(wght, wdth, 96),
  fontSize: size,
  lineHeight: 0.9,
  letterSpacing: "-0.02em",
  fontVariantNumeric: "tabular-nums",
  fontFeatureSettings: "'tnum' 1",
});
