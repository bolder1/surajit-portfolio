// KEY LIGHT tokens: four colours, one shadow colour, the system's elevation table, the clock.
// Source: v6/V1-DIRECTION.md sections 2.1, 2.3 and 9.2. Nothing glows; the only gradient is the light pool.

export { BPM, BEAT, BAR, V6_TOTAL, V6_HITS, V6_STOP, V6_CHORD, V6_LAMP_OFF, V6_SECTIONS } from "./timeline";
export const TOTAL = 5976;
export const HITS = [288, 2160, 4464] as const;
export const STOP = 2664;
export const CHORD = 5616;

/** The palette. Ground is the floor and everything unlit; Ink is every readable glyph. */
export const K = {
  ground: "#121214",
  ink: "#ECE9E2",
  hero: "#EB5424", // his own token, Product/Orange/500: hits, lit steps, the counter, the orange button
  support: "#A9A7A1", // rails, hairlines, dimension lines, unlit steps
  /** The floor in shadow under an object. Not a fifth colour: the shadow colour. */
  shadow: "#050506",
  shadowAlpha: 0.85,
  /** A slab's surface is Ground lifted one step; a panel inside it one more (ILLUSTRATION.md 1.3). */
  surface: "#1A1A1D",
  panel: "#202024",
  /** The warm overlay of the grade (FinishKey): flat, soft-light, 4 percent. */
  warm: "#2A1E12",
} as const;

export const shadowRgba = (alpha = K.shadowAlpha) => `rgba(5,5,6,${alpha})`;
export const inkRgba = (alpha: number) => `rgba(236,233,226,${alpha})`;
export const supportRgba = (alpha: number) => `rgba(169,167,161,${alpha})`;

/** The system's own elevation tokens (02 Chain F), rendered as box-shadow on a slab, never as filter: blur(). */
export const ELEVATION = {
  low: { blur: 16, y: 2, spread: 0 }, // lowRaised: lying on the floor
  mid: { blur: 24, y: 8, spread: 0 }, // midRaised: lifting
  high: { blur: 48, y: 16, spread: -4 }, // highRaised: lifted
} as const;
export type Elevation = keyof typeof ELEVATION;
export const ELEVATION_ORDER: Elevation[] = ["low", "mid", "high"];

export const W = 1920;
export const H = 1080;
export const FPS = 30;

/** Readability minimums (R11): sizes under these never reach the screen. */
export const MIN_SIZE = { display: 72, statement: 40, label: 24, contact: 28 } as const;
/** The side margin every fitted display line keeps. */
export const SIDE_MARGIN = 120;
/** Longest line in characters (one declared exception: a single token path up to 48). */
export const MAX_CHARS = 42;
export const MAX_CHARS_TOKEN_PATH = 48;
