import type React from "react";
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// All fonts are local files (the headless renderer cannot reach Google Fonts).
export const serif = "Instrument Serif";
export const sans = "Inter Tight";
export const mono = "JetBrains Mono";
export const display = "Mona Sans Var"; // variable: wdth 75–125, wght 200–900
export const dots = "Doto Var"; // dot-matrix numerals
export const bric = "Bricolage Grotesque"; // designer reel: THE one family (variable: opsz 12-96, wdth 75-100, wght 200-800)

const f = (family: string, file: string, extra: Record<string, string> = {}) =>
  loadFont({ family, url: staticFile(`fonts/${file}`), format: "woff2", ...extra } as Parameters<typeof loadFont>[0]);
f(serif, "InstrumentSerif-normal.woff2", { style: "normal" });
f(serif, "InstrumentSerif-italic.woff2", { style: "italic" });
f(sans, "InterTight-normal.woff2", { weight: "100 900" });
f(mono, "JetBrainsMono-normal.woff2", { weight: "100 800" });
f(display, "MonaSans-var.woff2", { weight: "200 900", stretch: "75% 125%" });
f(dots, "Doto-var.woff2", { weight: "100 900" });
f(bric, "BricolageGrotesque-var.woff2", { weight: "200 800", stretch: "75% 100%" });

/** Mona Sans at a given width/weight (both animatable). */
export const mona = (wdth: number, wght: number): React.CSSProperties => ({
  fontFamily: display,
  fontVariationSettings: `'wdth' ${wdth.toFixed(1)}, 'wght' ${wght.toFixed(0)}`,
});

export const C = {
  void: "#060504",
  ink: "#0d0a07",
  ink2: "#1a140e",
  line: "rgba(243,236,222,0.14)",
  dim: "rgba(243,236,222,0.45)",
  faint: "rgba(243,236,222,0.2)",
  paper: "#f3ecde",
  acc: "#ff3b1f", // vermilion, pushed brighter for emissive use on black
  accDeep: "#d8331a",
  accGlow: "rgba(255,59,31,0.55)",
};

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const BEAT = 15; // 120 BPM @ 30 fps
export const BAR = 60;
