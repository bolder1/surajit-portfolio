// The ONE circuit trace shared by D1 (Origin) and D2 (Thesis). D1 draws it from the top edge, down a spine, through two year pads and
// into the bottom run; D2 continues from the same head position at its local frame 0 (film frame 120) so the cut is invisible.
// Everything here is in absolute frame px and in FILM frames (t): D1 passes t = local, D2 passes t = 120 + local.
import { clamp } from "../../../lib/anim";
import { interpolate } from "remotion";
import { traceGeometry, traceHead, type Pt } from "../../kit/doodles";
import { G } from "../../tokens";

export const RADIUS = 16;

/** Row 5 is the "flow" rail of D2; it is also where D1's trace is heading when the film cuts. */
export const RUN_Y = 905;

/** Vertex indices of the pads (year A, year B, then the three flow nodes). */
export const PAD_A = 0;
export const PAD_B = 3;
export const NODES = [6, 7, 8] as const;

export const ROUTE: Pt[] = [
  [G.x(1), G.y(1)], // 0 PAD A (2016): the trace is born on this pad
  [G.x(1), G.y(2) + 160], // 1
  [G.x(1) + 160, G.y(3)], // 2 (45 degrees)
  [G.x(4), G.y(3)], // 3 PAD B (2019)
  [G.x(4), RUN_Y - 240], // 4
  [G.x(4) + 240, RUN_Y], // 5 (45 degrees) corner into the rail
  [G.x(7), RUN_Y], // 6 NODE 1
  [G.x(9), RUN_Y], // 7 NODE 2
  [G.x(11), RUN_Y], // 8 NODE 3
];

export const GEO = traceGeometry(ROUTE, RADIUS);
export const TOTAL = GEO.total;
/** length along the route of vertex i */
export const vCum = (i: number) => GEO.vertex[i][2];
export const vPos = (i: number): Pt => [GEO.vertex[i][0], GEO.vertex[i][1]];

// head speed (px per film frame): eager draw-on, steady through the years, a touch slower at the cut, then accelerating along the rail.
const KEYS: [number, number][] = [[0, 0], [4, 0], [8, 12], [58, 12], [120, 8.2], [135, 10], [165, 14], [200, 15], [260, 15]];
const speed = (t: number) => {
  for (let i = 1; i < KEYS.length; i++) if (t <= KEYS[i][0]) return interpolate(t, [KEYS[i - 1][0], KEYS[i][0]], [KEYS[i - 1][1], KEYS[i][1]], clamp);
  return KEYS[KEYS.length - 1][1];
};
const CUMUL: number[] = [0];
for (let f = 0; f < 300; f++) CUMUL.push(CUMUL[f] + speed(f + 0.5));

/** distance (px) the head has travelled at film frame t (fractional frames interpolate). */
export const headDist = (t: number) => {
  const i = Math.max(0, Math.min(CUMUL.length - 2, Math.floor(t)));
  const fr = Math.max(0, Math.min(1, t - i));
  return Math.min(TOTAL, CUMUL[i] + (CUMUL[i + 1] - CUMUL[i]) * fr);
};

/** film frame at which the head reaches vertex i. */
export const arriveAt = (i: number) => {
  const target = vCum(i);
  let f = 0;
  while (f < 299 && CUMUL[f + 1] < target) f++;
  return f + (target - CUMUL[f]) / Math.max(1e-6, CUMUL[f + 1] - CUMUL[f]);
};

/** tip of the head (for hanging a sparkle on it) */
export const headTip = (t: number) => traceHead(ROUTE, headDist(t) / TOTAL, RADIUS);

/** film frame at which a pad on vertex i pops (pad A is born when the head leaves it, at frame 4). */
export const padTime = (i: number) => (i === 0 ? 4 : arriveAt(i));
