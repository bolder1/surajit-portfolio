// C6 SYSTEM: the stage geometry every beat of the chapter shares (lanes 4a and 4b import from here; lane 4a owns it).
// Everything is in frame px and chapter-local frames (local = global - 2664). Nothing here reads the frame.
//   STAGE_C6        the fixed 3/4 elevation (perspective 2400, rotateX 26, rotateY -16) over the whole frame
//   SCREEN          where the kit's DASHBOARD lies on that stage (its top-left in stage px and its scale, 0.78)
//   screenPoint()   a point of the screen (screen px, a lift in px) projected to frame px, for docked labels
//   ALERT_2X        the Alert at 2x, flat to camera, centre-left (B3 and B4); PAIR the Alert beside the orange
//                   button in B7 and B8; BUTTON_3X the lifted button at 3x, centre (B4 and B5); PANEL the surface
//                   panel of B6 with the 2x button on it and stepped off it (B6, B7)
//   FLOOR_Y         the floor line the labels under the screen sit on
//   lightAt(f)      the key light for every local frame of the chapter (C6System renders it once; beats draw objects)
//   BEATS           the frame window each beat module renders in; BeatModule the shape every beat file exports
// Source: v6/V1-DIRECTION.md 2.4, 4.6, 5.2; ILLUSTRATION.md 3.2, 3.3, 3.6.
import type React from "react";
import type { Cue } from "../../../lib/cues";
import { EO, lerp, prog } from "../../../lib/anim";
import { ALERT, BUTTON, DASHBOARD, LIFT_Z, type Region } from "../../illus";
import { STAGE_3Q, project3Q, type Stage3QSpec } from "../../lib/explode";
import type { Quiet } from "../../registry";
import { sectionOf } from "../../timeline";
import type { BlockSpec } from "../../text-manifest";
import { H, W } from "../../tokens";

export const SEC = "C6" as const;
export const C6_START = sectionOf(SEC).from; // 2664
export const C6_END = sectionOf(SEC).dur; // 1944

/** Every beat file exports this shape, chapter-local frames. */
export type BeatModule = {
  Beat: React.FC;
  blocks: BlockSpec[];
  cues: Cue[];
  quiet: Quiet[] | [number, number][];
};

/** The frame window [from, to) each beat renders in (4.6 and 5.2, chapter-local). */
export const BEATS = {
  whole: [0, 135],
  layout: [135, 309],
  bridge: [309, 423],
  ladder: [366, 720],
  wire: [720, 948],
  modes: [948, 1417],
  rule: [1417, 1674],
  rebuild: [1674, 1800],
  reach: [1800, C6_END],
} as const satisfies Record<string, readonly [number, number]>;

/** The 3/4 elevation: perspective 2400, rotateX 26, rotateY -16, pivoting on the frame's centre. */
export const STAGE_C6: Stage3QSpec = { ...STAGE_3Q, w: W, h: H };
/**
 * The vanishing point (the CSS perspective origin) in frame px. The tilt pivots on the frame's centre; the
 * perspective projects about this point, which sits above the screen so a lifted plane grows toward the camera
 * instead of sliding up the frame over the region above it (the regions lift along the slab's normal, which
 * points up on the frame). StageScreen (Whole.tsx) builds the perspective container with this origin.
 */
export const STAGE_ORIGIN = { x: W / 2, y: -600 } as const;

/** The dashboard on the stage: its top-left in stage px and its scale (0.78 per 5.2). The same seed as chapter 3. */
export const SCREEN = { x: 300, y: 120, s: 0.78, seed: 3 } as const;
export const SCREEN_W = DASHBOARD.w * SCREEN.s;
export const SCREEN_H = DASHBOARD.h * SCREEN.s;
/** The lift inside the scaled wrapper is scaled with the screen; this many px of translateZ give 1 px of lift. */
export const LIFT_PER_PX = 1 / SCREEN.s;

/** The screen's own clipped light pool (ILLUSTRATION.md 1.2: lit corner upper-left), in screen px. */
export const SCREEN_POOL = { cx: Math.round(DASHBOARD.w * 0.2), cy: Math.round(DASHBOARD.h * 0.15), r: Math.round(DASHBOARD.w * 0.8), a: 0.08 };

/** The region order of the explode: planes lift 18 f apart in this order; the table rides with the charts. */
export const LIFT_ORDER: Region[] = ["nav", "header", "tiles", "charts"];

/** The lift values of the screen's planes at progress p (0 lying, 1 fully lifted) per region. */
export const liftAt = (p: Partial<Record<Region, number>>): Partial<Record<Region, number>> => {
  const out: Partial<Record<Region, number>> = {};
  for (const r of LIFT_ORDER) out[r] = LIFT_Z[r] * (p[r] ?? 0);
  out.table = LIFT_Z.table * (p.charts ?? 0);
  return out;
};

/**
 * A point of the screen in frame px: (sx, sy) in the screen's own px (0..1530, 0..853), z its lift in frame px
 * (StageScreen compensates the wrapper's scale with LIFT_PER_PX so a lift of 270 is 270 px of translateZ).
 * The rotation is project3Q's (pivot and origin at the centre); the perspective is then re-projected about
 * STAGE_ORIGIN, as CSS does with a perspective-origin away from the pivot.
 */
export const screenPoint = (sx: number, sy: number, z = 0) => {
  const p = project3Q(SCREEN.x + SCREEN.s * sx, SCREEN.y + SCREEN.s * sy, z, STAGE_C6);
  const cx = STAGE_C6.w / 2;
  const cy = STAGE_C6.h / 2;
  // Undo the centre projection to the rotated point, then project about the vanishing point.
  const rx = cx + (p.x - cx) / p.scale;
  const ry = cy + (p.y - cy) / p.scale;
  return { x: STAGE_ORIGIN.x + (rx - STAGE_ORIGIN.x) * p.scale, y: STAGE_ORIGIN.y + (ry - STAGE_ORIGIN.y) * p.scale, scale: p.scale };
};

/** The floor line under the screen: the top of the first label beneath it (6.1, 6.13). */
export const FLOOR_Y = 884;
/** 6.14 sits one label line under 6.13. */
export const FLOOR_Y2 = FLOOR_Y + 56;

/** The Alert at 2x (840 x 250), flat to camera, centre-left: B3 slides it in here, B4 ladders down from it. */
export const ALERT_SCALE = 2;
export const ALERT_2X = { x: 400, y: 400, w: ALERT.w * ALERT_SCALE, h: ALERT.h * ALERT_SCALE } as const;
/** The Alert slides in from below the frame over 18 f (B3, 366..384): translateY from this many px. */
export const ALERT_SLIDE_PX = 360;
/** The Alert's elevation as an object on the floor. */
export const ALERT_ELEVATION = "low" as const;

/** The lifted button at 3x (258 x 108), centre of the frame (B4 ATOM; B5 draws the wire from it). */
export const BUTTON_SCALE = 3;
export const BUTTON_3X = { x: Math.round(W / 2 - (BUTTON.w * BUTTON_SCALE) / 2), y: Math.round(H / 2 - (BUTTON.h * BUTTON_SCALE) / 2) - 54, w: BUTTON.w * BUTTON_SCALE, h: BUTTON.h * BUTTON_SCALE } as const;

/** The surface panel of B6 (600 x 360), centre, flat to camera. */
export const PANEL = { x: Math.round(W / 2 - 300), y: 360, w: 600, h: 360 } as const;
/** The 2x button (172 x 72) centred on the panel, and stepped off it 420 px to the right (B6 3854..3866). */
export const BUTTON_2X_SCALE = 2;
export const BUTTON_2X = { w: BUTTON.w * BUTTON_2X_SCALE, h: BUTTON.h * BUTTON_2X_SCALE } as const;
export const BUTTON_ON_PANEL = { x: Math.round(PANEL.x + PANEL.w / 2 - BUTTON_2X.w / 2), y: PANEL.y + 209 - BUTTON_2X.h / 2 } as const;
export const BUTTON_STEP_PX = 420;
export const BUTTON_OFF_PANEL = { x: BUTTON_ON_PANEL.x + BUTTON_STEP_PX, y: BUTTON_ON_PANEL.y } as const;

/**
 * B7 and B8: the Alert at 2x beside the orange button at 2x, both flat to camera (the button where B6 left it,
 * the Alert to its left, their centres on one line). Positions are the top-left of the drawn (scaled) box:
 * render with scaleOrigin "0 0".
 */
export const PAIR = {
  button: { x: BUTTON_OFF_PANEL.x, y: BUTTON_OFF_PANEL.y, w: BUTTON_2X.w, h: BUTTON_2X.h },
  alert: { x: BUTTON_OFF_PANEL.x - 120 - ALERT_2X.w, y: Math.round(BUTTON_OFF_PANEL.y + BUTTON_2X.h / 2 - ALERT_2X.h / 2), w: ALERT_2X.w, h: ALERT_2X.h },
} as const;

/** The key light at a local frame: one warm pool, moving only where the storyboard says the light leaves or pans. */
export type Light = { cx: number; cy: number; r: number; intensity: number };

// Keyframes: the light rests over the screen, pans away as the planes recede (B3), comes to the Alert, then to the
// lifted button (B4), rests on the panel (B6), narrows to the pair (B7), and returns to the screen for the rebuild.
const LIGHT_KEYS: [number, Light][] = [
  [0, { cx: 760, cy: 300, r: 1040, intensity: 0 }],
  [24, { cx: 760, cy: 300, r: 1040, intensity: 0 }],
  [48, { cx: 760, cy: 300, r: 1040, intensity: 0.9 }],
  [BEATS.bridge[0], { cx: 760, cy: 300, r: 1040, intensity: 0.9 }],
  [BEATS.bridge[0] + 50, { cx: 520, cy: 760, r: 980, intensity: 0.85 }],
  [BEATS.ladder[0], { cx: 520, cy: 760, r: 980, intensity: 0.85 }],
  [BEATS.ladder[0] + 18, { cx: 560, cy: 520, r: 980, intensity: 0.9 }],
  [621, { cx: 560, cy: 520, r: 980, intensity: 0.9 }],
  [639, { cx: 860, cy: 520, r: 940, intensity: 0.9 }],
  [BEATS.modes[0], { cx: 860, cy: 520, r: 940, intensity: 0.9 }],
  [BEATS.modes[0] + 12, { cx: 900, cy: 480, r: 980, intensity: 0.9 }],
  [BEATS.rule[0], { cx: 900, cy: 480, r: 980, intensity: 0.9 }],
  [BEATS.rule[0] + 12, { cx: 980, cy: 520, r: 1000, intensity: 0.9 }],
  [BEATS.rebuild[0] + 78, { cx: 980, cy: 520, r: 1000, intensity: 0.9 }],
  [BEATS.rebuild[0] + 102, { cx: 760, cy: 300, r: 1040, intensity: 0.9 }],
  [C6_END, { cx: 760, cy: 300, r: 1040, intensity: 0.9 }],
];

export const lightAt = (f: number): Light => {
  let a = LIGHT_KEYS[0];
  let b = LIGHT_KEYS[LIGHT_KEYS.length - 1];
  for (let i = 0; i < LIGHT_KEYS.length - 1; i++) {
    if (f >= LIGHT_KEYS[i][0] && f < LIGHT_KEYS[i + 1][0]) {
      a = LIGHT_KEYS[i];
      b = LIGHT_KEYS[i + 1];
      break;
    }
  }
  if (f >= b[0]) a = b;
  const t = a === b ? 1 : prog(f, a[0], b[0], EO);
  return { cx: lerp(a[1].cx, b[1].cx, t), cy: lerp(a[1].cy, b[1].cy, t), r: lerp(a[1].r, b[1].r, t), intensity: lerp(a[1].intensity, b[1].intensity, t) };
};
