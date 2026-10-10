// KEY LIGHT type: one family, Archivo (variable: wdth 62 to 125, wght 100 to 900), playing three roles through
// the width axis. Source: v6/V1-DIRECTION.md section 2.2. No serif, no mono, no second sans.
// The cmap was checked at vendoring (python3 fontTools): tilde, percent, middle dot, apostrophe, right single
// quote, slash, hash, arrow, both curly double quotes, at, en dash and underscore are all present.
import type React from "react";
import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import { fitTextOnNLines, measureText } from "@remotion/layout-utils";
import { SIDE_MARGIN, W } from "./tokens";

export const archivo = "Archivo Var";
/** Cap height as a fraction of the font size (sCapHeight 686 / 1000 upm). */
export const CAP = 0.686;
export const capHeight = (size: number) => size * CAP;
/** Baseline offset from the top of a line box set at line-height 1 (hhea ascent 878, descent 210: half-leading -44). */
export const BASELINE = 0.834;
export const baselineAt = (size: number) => size * BASELINE;

let fontDone = false;
/** Resolves when Archivo is usable; the checker imports this module in Node, where nothing is loaded. */
export const archivoReady: Promise<void> =
  typeof document === "undefined"
    ? Promise.resolve()
    : loadFont({
        family: archivo,
        url: staticFile("fonts/Archivo-var.woff2"),
        format: "woff2",
        weight: "100 900",
        stretch: "62% 125%",
      }).then(() => {
        fontDone = true;
      });

/** True once Archivo is loaded; holds the frame until it is, so measureText never measures a fallback face. */
export const useArchivo = (): boolean => {
  const [ready, setReady] = useState(fontDone);
  const [handle] = useState(() => (fontDone ? null : delayRender("Archivo for measurement")));
  useEffect(() => {
    if (ready) return;
    let alive = true;
    archivoReady.then(() => {
      if (!alive) return;
      setReady(true);
      if (handle !== null) continueRender(handle);
    });
    return () => {
      alive = false;
    };
  }, [ready, handle]);
  return ready;
};

export type Role = "display" | "statement" | "label";

const axes = (wdth: number, wght: number) => `'wdth' ${wdth.toFixed(0)}, 'wght' ${wght.toFixed(0)}`;
const tnum = { fontVariantNumeric: "tabular-nums", fontFeatureSettings: "'tnum' 1" } as const;

/** Display: wdth 70, wght 800, uppercase, tracking -0.02 em, tabular figures. 120 to 400 px fitted. */
export const display = (size: number, wdth = 70, wght = 800): React.CSSProperties => ({
  fontFamily: archivo,
  fontSize: size,
  fontVariationSettings: axes(wdth, wght),
  textTransform: "uppercase",
  letterSpacing: "-0.02em",
  lineHeight: 1,
  ...tnum,
});

/** Statement: wdth 100, wght 450 (500 for the sector words and the day list), sentence case, line height 1.15. */
export const statement = (size: number, wght = 450): React.CSSProperties => ({
  fontFamily: archivo,
  fontSize: size,
  fontVariationSettings: axes(100, wght),
  letterSpacing: 0,
  lineHeight: 1.15,
  ...tnum,
});

/**
 * Label: wdth 112, wght 600. Uppercase with tracking 0.12 em; `real` keeps the text's own case with tracking 0
 * (token paths, hex values, contact addresses).
 */
export const label = (size = 24, real = false): React.CSSProperties => ({
  fontFamily: archivo,
  fontSize: size,
  fontVariationSettings: axes(112, 600),
  textTransform: real ? "none" : "uppercase",
  letterSpacing: real ? 0 : "0.12em",
  lineHeight: 1.2,
  ...tnum,
});

export const roleStyle = (role: Role, size: number, opts: { wdth?: number; wght?: number; real?: boolean } = {}) =>
  role === "display"
    ? display(size, opts.wdth, opts.wght)
    : role === "statement"
      ? statement(size, opts.wght)
      : label(size, opts.real);

/** Measurement words for @remotion/layout-utils, built from a role style. Call only once `useArchivo()` is true. */
const word = (style: React.CSSProperties) => ({
  fontFamily: archivo,
  fontSize: Number(style.fontSize),
  letterSpacing: typeof style.letterSpacing === "number" ? `${style.letterSpacing}px` : String(style.letterSpacing),
  fontVariantNumeric: "tabular-nums",
  textTransform: style.textTransform as "uppercase" | "none" | undefined,
  additionalStyles: { fontVariationSettings: String(style.fontVariationSettings) } as Record<string, string>,
});

/** Width and height of one line set in a role style. */
export const measureLine = (text: string, style: React.CSSProperties) => measureText({ text, ...word(style) });

/**
 * The largest font size (at most `max`) at which `text` fits on one line inside `maxWidth`.
 * Linear in the size, so one measurement at `max` is enough; `min` floors the result.
 */
export const fitLine = (
  text: string,
  role: Role,
  maxWidth = W - 2 * SIDE_MARGIN,
  { max = 400, min = 72, wdth, wght, real }: { max?: number; min?: number; wdth?: number; wght?: number; real?: boolean } = {},
): number => {
  const probe = roleStyle(role, max, { wdth, wght, real });
  const w = measureLine(text, probe).width;
  if (w <= 0) return max;
  return Math.max(min, Math.min(max, Math.floor((max * maxWidth) / w)));
};

/** Fit `text` on at most `maxLines` lines inside `maxWidth` (the contact block, two-line statements). */
export const fitLines = (text: string, role: Role, maxWidth: number, maxLines: number, max = 56, real = false) => {
  const probe = roleStyle(role, max, { real });
  const w = word(probe);
  return fitTextOnNLines({
    text,
    maxLines,
    maxBoxWidth: maxWidth,
    fontFamily: w.fontFamily,
    letterSpacing: w.letterSpacing,
    fontVariantNumeric: w.fontVariantNumeric,
    textTransform: w.textTransform,
    additionalStyles: w.additionalStyles,
    maxFontSize: max,
  });
};

/** A Pull's start scale: the word set at `times` the frame width, from its fitted width. */
export const pullScale = (fittedWidth: number, times = 3.2) => (times * W) / fittedWidth;
