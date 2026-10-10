import { Easing, interpolate } from "remotion";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const EO = Easing.bezier(0.16, 1, 0.3, 1); // expo-ish out
export const EIO = Easing.bezier(0.83, 0, 0.17, 1); // hard in-out (cinematic)
export const EI = Easing.bezier(0.7, 0, 0.84, 0);

/** 0..1 progress between frames a..b with easing */
export const prog = (f: number, a: number, b: number, easing = EO) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** deterministic pseudo random in [0,1) */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+=/<>[]{}";
/** Decode/scramble: characters resolve left→right as p goes 0→1 */
export const scramble = (text: string, p: number, frame: number, seed = 1) => {
  const n = text.length;
  return text
    .split("")
    .map((ch, i) => {
      if (ch === " ") return " ";
      const threshold = i / n;
      if (p >= threshold + 0.12 || p >= 1) return ch;
      if (p < threshold - 0.25) return " ";
      return GLYPHS[Math.floor(rand(i * 7.1 + Math.floor(frame / 2) * 3.3 + seed) * GLYPHS.length)];
    })
    .join("");
};
