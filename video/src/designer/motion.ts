// Shared motion helpers for the designer reel (funky: springs with a little overshoot are welcome on pops).
import { interpolate, spring } from "remotion";
import { clamp } from "../lib/anim";

/** Sticker pop: scale 0 -> 1 with overshoot, starting at frame `at`. */
export const pop = (f: number, at: number, fps = 30, damping = 9, stiffness = 190) =>
  spring({ frame: f - at, fps, config: { damping, stiffness, mass: 0.6 } });

/** 0..1 progress between two frames (for stroke draw-on: strokeDashoffset = (1 - draw) * len). */
export const draw = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);

/** Little hand-made wobble: rotation in degrees, deterministic. */
export const wob = (f: number, amp = 2, period = 24, phase = 0) => Math.sin(((f + phase) / period) * Math.PI * 2) * amp;
