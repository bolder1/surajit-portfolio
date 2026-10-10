// Designer kit, illustration layer: hand-drawn doodles, stickers, tangle/untangle, circuit trace, wobble.
// Everything is frame-driven SVG (no CSS animation), deterministic (seeded rand), flat colour, round caps/joins.
//
// Conventions shared by every export here:
//  - x, y  = CENTRE of the element in px (parent must be positioned, e.g. an AbsoluteFill).  `anchor` moves that to a corner.
//  - size  = width of the doodle's box in px (the drawing scales, the stroke stays 5-8 px on screen).
//  - draw  = 0..1 stroke draw-on progress (default 1).  pop = scale-in 0..1 (spring values > 1 overshoot are fine).
//  - shadow = optional CSS colour of a hard offset shadow (fixed screen direction, down-right).
import React, { useId } from "react";
import { useCurrentFrame } from "remotion";
import { rand } from "../../lib/anim";
import { P } from "../tokens";
import { sans } from "../type";

/* ------------------------------------------------------------------ small maths */

/** [x, y] point in px. */
export type Pt = [number, number];
const c01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const f2 = (n: number) => Math.round(n * 100) / 100;
/** deterministic jitter in [-amp, amp] */
const jit = (seed: number, i: number, amp: number) => (rand(seed * 17.31 + i * 5.77) - 0.5) * 2 * amp;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Ease-out with a small overshoot (0..1 -> 0..1, peaks near 1.1). */
export const easeOutBack = (t: number) => {
  const x = c01(t) - 1;
  return 1 + 2.4 * x * x * x + 1.4 * x * x;
};

/** Catmull-Rom spline through points as a cubic-bezier path string (closed optional). */
export const smoothPath = (pts: Pt[], closed = false, k = 1): string => {
  const n = pts.length;
  if (n < 2) return "";
  const at = (i: number): Pt => (closed ? pts[((i % n) + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${f2(pts[0][0])} ${f2(pts[0][1])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    d += `C${f2(p1[0] + ((p2[0] - p0[0]) / 6) * k)} ${f2(p1[1] + ((p2[1] - p0[1]) / 6) * k)} ${f2(p2[0] - ((p3[0] - p1[0]) / 6) * k)} ${f2(
      p2[1] - ((p3[1] - p1[1]) / 6) * k,
    )} ${f2(p2[0])} ${f2(p2[1])}`;
  }
  return closed ? d + "Z" : d;
};

const polyPath = (pts: Pt[], close = false) => pts.map((p, i) => `${i ? "L" : "M"}${f2(p[0])} ${f2(p[1])}`).join("") + (close ? "Z" : "");
const autoStroke = (size: number) => Math.round(Math.min(8, Math.max(5, size * 0.065)) * 10) / 10;

/* ------------------------------------------------------------------ placement + ink primitives */

export type Anchor = "c" | "tl" | "tr" | "bl" | "br" | "t" | "b" | "l" | "r";
const ANCHOR: Record<Anchor, [number, number]> = {
  c: [-50, -50],
  tl: [0, 0],
  tr: [-100, 0],
  bl: [0, -100],
  br: [-100, -100],
  t: [-50, 0],
  b: [-50, -100],
  l: [0, -50],
  r: [-100, -50],
};

/** CSS for an absolutely placed box of w x h whose `anchor` sits at (x, y), rotated and scaled about its centre. */
export const placeStyle = (x: number, y: number, w: number, h: number, anchor: Anchor = "c", rotate = 0, scale = 1, flip = false): React.CSSProperties => {
  const [ax, ay] = ANCHOR[anchor];
  return {
    position: "absolute",
    left: x,
    top: y,
    width: w,
    height: h,
    transform: `translate(${ax}%, ${ay}%) rotate(${rotate}deg) scale(${flip ? -scale : scale}, ${scale})`,
    transformOrigin: "50% 50%",
  };
};

/** Offset (px) to apply INSIDE a rotated/flipped/scaled box so the shadow keeps a fixed screen direction (d right, d down). */
export const shadowLocal = (rotate: number, scale: number, flip: boolean, d: number): Pt => {
  const r = (rotate * Math.PI) / 180;
  const lx = d * Math.cos(r) + d * Math.sin(r);
  const ly = -d * Math.sin(r) + d * Math.cos(r);
  const s = Math.max(0.25, Math.abs(scale));
  return [(flip ? -lx : lx) / s, ly / s];
};

/** A stroke that draws on with pathLength=1; optional flat fill that fades in once the outline is mostly drawn. */
const Ink: React.FC<{
  d: string;
  stroke: string;
  sw: number;
  draw: number;
  from?: number;
  to?: number;
  fill?: string;
  fillAt?: number;
}> = ({ d, stroke, sw, draw, from = 0, to = 1, fill, fillAt = 0.55 }) => {
  const t = c01((draw - from) / Math.max(1e-6, to - from));
  const fo = fill ? c01((draw - fillAt) / Math.max(1e-6, 1 - fillAt)) : 0;
  if (t <= 0 && fo <= 0) return null;
  return (
    <path
      d={d}
      pathLength={1}
      fill={fill ?? "none"}
      fillOpacity={fill ? fo : undefined}
      stroke={t > 0 ? stroke : "none"}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={t >= 1 ? undefined : "1 1"}
      strokeDashoffset={t >= 1 ? undefined : 1 - t}
    />
  );
};

interface Ctx {
  /** map a colour: identity normally, the shadow colour when drawing the shadow layer */
  c: (col: string) => string;
  /** stroke width in viewBox units */
  sw: number;
  draw: number;
}

export interface DoodleProps {
  /** centre x in px */
  x: number;
  /** centre y in px */
  y: number;
  /** box width in px */
  size?: number;
  /** degrees */
  rotate?: number;
  /** stroke / fill colour */
  color?: string;
  /** stroke width in screen px (default 5-8 by size) */
  stroke?: number;
  /** 0..1 draw-on progress (default 1) */
  draw?: number;
  /** 0..1(+) scale-in progress (default 1) */
  pop?: number;
  /** CSS colour of a hard offset shadow (off by default) */
  shadow?: string;
  /** mirror horizontally */
  flip?: boolean;
  /** changes the hand-made imperfection */
  seed?: number;
}

/** Shared frame for the line doodles: SVG box w x h px, viewBox vw x vh, placed at (x, y), popped and rotated. */
const Doodle: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  vw: number;
  vh: number;
  rotate: number;
  pop: number;
  flip: boolean;
  shadow?: string;
  stroke: number;
  draw: number;
  children: (ctx: Ctx) => React.ReactNode;
}> = ({ x, y, w, h, vw, vh, rotate, pop, flip, shadow, stroke, draw, children }) => {
  if (pop <= 0.001 || draw <= 0) return null;
  const k = vw / w;
  const sw = stroke * k;
  const [lx, ly] = shadowLocal(rotate, pop, flip, Math.max(4, Math.round(stroke * 0.9)));
  return (
    <div style={placeStyle(x, y, w, h, "c", rotate, pop, flip)}>
      <svg width={w} height={h} viewBox={`0 0 ${vw} ${vh}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {shadow ? <g transform={`translate(${f2(lx * k)} ${f2(ly * k)})`}>{children({ c: () => shadow, sw, draw })}</g> : null}
        {children({ c: (col) => col, sw, draw })}
      </svg>
    </div>
  );
};

/* ------------------------------------------------------------------ wobble */

/**
 * Hand-made jitter for everything inside: ONE feTurbulence + displacement filter on a full-frame wrapper.
 * Use at most one per scene-level container (never per doodle); keep a perfectly straight Untangle line OUTSIDE it. `boil` = frames per re-seed (0 = frozen); 3-4 gives a light line-boil.
 */
export const Wobble: React.FC<{ children: React.ReactNode; scale?: number; freq?: number; octaves?: number; seed?: number; boil?: number }> = ({
  children,
  scale = 3,
  freq = 0.02,
  octaves = 1,
  seed = 3,
  boil = 0,
}) => {
  const f = useCurrentFrame();
  const id = "wob" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const s = seed + (boil > 0 ? Math.floor(f / boil) % 3 : 0);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, filter: `url(#${id})` }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={id} x="-1%" y="-1%" width="102%" height="102%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={octaves} seed={s} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ sparkle, star, asterisk, plus */

/** Concave 4-point star centred at (cx, cy) with tip radius r, slightly lopsided by seed. */
const sparkleD = (cx: number, cy: number, r: number, seed: number, rot = 0, chub = 0.2) => {
  const tips: Pt[] = [];
  for (let i = 0; i < 4; i++) {
    const a = ((rot + i * 90 - 90) * Math.PI) / 180;
    const rr = r * (i % 2 === 0 ? 1 : 0.93) * (1 + jit(seed, i, 0.05));
    tips.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  let d = `M${f2(tips[0][0])} ${f2(tips[0][1])}`;
  for (let i = 0; i < 4; i++) {
    const a = tips[i];
    const b = tips[(i + 1) % 4];
    const mx = (a[0] + b[0]) / 2;
    const my = (a[1] + b[1]) / 2;
    d += `Q${f2(lerp(cx, mx, chub * 2))} ${f2(lerp(cy, my, chub * 2))} ${f2(b[0])} ${f2(b[1])}`;
  }
  return d + "Z";
};

/** 4-point sparkle star (solid). `twin` adds a small second sparkle at the top right. */
export const Sparkle: React.FC<DoodleProps & { twin?: boolean }> = ({
  x, y, size = 96, rotate = 0, color = P.yellow, stroke, draw = 1, pop = 1, shadow, flip = false, seed = 1, twin = false,
}) => (
  <Doodle x={x} y={y} w={size} h={size} vw={100} vh={100} rotate={rotate} pop={pop} flip={flip} shadow={shadow} stroke={stroke ?? autoStroke(size) * 0.7} draw={draw}>
    {({ c, sw, draw: dr }) => (
      <>
        <Ink d={sparkleD(twin ? 40 : 50, twin ? 60 : 50, twin ? 36 : 46, seed)} stroke={c(color)} fill={c(color)} sw={sw} draw={dr} to={twin ? 0.7 : 1} />
        {twin ? <Ink d={sparkleD(80, 20, 17, seed + 3, 8)} stroke={c(color)} fill={c(color)} sw={sw * 0.8} draw={dr} from={0.35} /> : null}
      </>
    )}
  </Doodle>
);

/** Chunky 5-point star (solid by default, `solid={false}` for an outline). */
export const Star: React.FC<DoodleProps & { solid?: boolean }> = ({
  x, y, size = 96, rotate = -8, color = P.yellow, stroke, draw = 1, pop = 1, shadow, flip = false, seed = 2, solid = true,
}) => {
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const a = ((i * 36 - 90) * Math.PI) / 180;
    const r = (i % 2 === 0 ? 45 : 25) + jit(seed, i, 1.8);
    pts.push([50 + Math.cos(a) * r, 54 + Math.sin(a) * r]);
  }
  return (
    <Doodle x={x} y={y} w={size} h={size} vw={100} vh={100} rotate={rotate} pop={pop} flip={flip} shadow={shadow} stroke={stroke ?? autoStroke(size)} draw={draw}>
      {({ c, sw, draw: dr }) => <Ink d={polyPath(pts, true)} stroke={c(color)} fill={solid ? c(color) : undefined} sw={sw} draw={dr} />}
    </Doodle>
  );
};

/** Three crossing strokes (6 arms), each a little bowed. */
export const Asterisk: React.FC<DoodleProps> = ({ x, y, size = 90, rotate = 0, color = P.orange, stroke, draw = 1, pop = 1, shadow, flip = false, seed = 3 }) => (
  <Doodle x={x} y={y} w={size} h={size} vw={100} vh={100} rotate={rotate} pop={pop} flip={flip} shadow={shadow} stroke={stroke ?? autoStroke(size) * 1.15} draw={draw}>
    {({ c, sw, draw: dr }) => (
      <>
        {[0, 1, 2].map((i) => {
          const a = ((i * 60 - 90 + jit(seed, i, 5)) * Math.PI) / 180;
          const r = 42 + jit(seed, i + 9, 3);
          const ox = Math.cos(a) * r;
          const oy = Math.sin(a) * r;
          const bow = jit(seed, i + 4, 4);
          return (
            <Ink
              key={i}
              d={`M${f2(50 - ox)} ${f2(50 - oy)}Q${f2(50 + bow)} ${f2(50 - bow)} ${f2(50 + ox)} ${f2(50 + oy)}`}
              stroke={c(color)}
              sw={sw}
              draw={dr}
              from={i * 0.28}
              to={i * 0.28 + 0.44}
            />
          );
        })}
      </>
    )}
  </Doodle>
);

/** Plus sign: two crooked strokes. */
export const Plus: React.FC<DoodleProps> = ({ x, y, size = 76, rotate = 4, color = P.paper, stroke, draw = 1, pop = 1, shadow, flip = false, seed = 4 }) => (
  <Doodle x={x} y={y} w={size} h={size} vw={100} vh={100} rotate={rotate} pop={pop} flip={flip} shadow={shadow} stroke={stroke ?? autoStroke(size) * 1.5} draw={draw}>
    {({ c, sw, draw: dr }) => (
      <>
        <Ink d={`M${f2(50 + jit(seed, 1, 3))} 10Q${f2(52 + jit(seed, 2, 3))} 50 ${f2(49 + jit(seed, 3, 2))} 90`} stroke={c(color)} sw={sw} draw={dr} to={0.55} />
        <Ink d={`M11 ${f2(52 + jit(seed, 4, 3))}Q50 ${f2(48 + jit(seed, 5, 3))} 90 ${f2(50 + jit(seed, 6, 2))}`} stroke={c(color)} sw={sw} draw={dr} from={0.45} />
      </>
    )}
  </Doodle>
);

/* ------------------------------------------------------------------ curly arrows */

export type ArrowKind = "curl" | "loop" | "swoop" | "tick";
const ARROWS: Record<ArrowKind, Pt[]> = {
  curl: [[34, 60], [24, 54], [14, 60], [12, 73], [22, 83], [40, 86], [62, 79], [86, 62], [106, 42], [122, 24]],
  loop: [[8, 74], [30, 68], [54, 70], [74, 64], [81, 48], [70, 34], [54, 38], [53, 55], [70, 66], [92, 58], [112, 46], [130, 36]],
  swoop: [[8, 12], [34, 8], [62, 20], [86, 42], [104, 68], [116, 90]],
  tick: [[16, 70], [44, 58], [76, 52], [104, 42], [122, 32]],
};

/** Hand-drawn arrow with a 2-stroke head. kind: curl | loop | swoop (down-right) | tick (small). Points up-right/right; use rotate/flip to aim. */
export const CurlyArrow: React.FC<DoodleProps & { kind?: ArrowKind }> = ({
  x, y, size = 150, rotate = 0, color = P.orange, stroke, draw = 1, pop = 1, shadow, flip = false, seed = 5, kind = "curl",
}) => {
  const pts = ARROWS[kind].map((p, i): Pt => [p[0] + jit(seed, i, 1.2), p[1] + jit(seed, i + 40, 1.2)]);
  const n = pts.length;
  const tip = pts[n - 1];
  const prev = pts[n - 2];
  const prev2 = pts[n - 3];
  const ang = Math.atan2(tip[1] - (prev[1] * 0.6 + prev2[1] * 0.4), tip[0] - (prev[0] * 0.6 + prev2[0] * 0.4));
  const head = (len: number, off: number): string => {
    const a = ang + Math.PI + off;
    return `M${f2(tip[0])} ${f2(tip[1])}L${f2(tip[0] + Math.cos(a) * len)} ${f2(tip[1] + Math.sin(a) * len)}`;
  };
  return (
    <Doodle x={x} y={y} w={size} h={size * 0.714} vw={140} vh={100} rotate={rotate} pop={pop} flip={flip} shadow={shadow} stroke={stroke ?? autoStroke(size * 0.7)} draw={draw}>
      {({ c, sw, draw: dr }) => (
        <>
          <Ink d={smoothPath(pts)} stroke={c(color)} sw={sw} draw={dr} to={0.8} />
          <Ink d={head(24, 0.56)} stroke={c(color)} sw={sw} draw={dr} from={0.78} to={0.9} />
          <Ink d={head(20, -0.6)} stroke={c(color)} sw={sw} draw={dr} from={0.88} to={1} />
        </>
      )}
    </Doodle>
  );
};

/* ------------------------------------------------------------------ squiggle, underline, circle, spiral */

/** Wavy line of a given length (px); x,y = centre. */
export const Squiggle: React.FC<Omit<DoodleProps, "size"> & { length?: number; amp?: number; wave?: number }> = ({
  x, y, length = 220, amp = 11, wave = 38, rotate = 0, color = P.yellow, stroke = 6, draw = 1, pop = 1, shadow, flip = false, seed = 6,
}) => {
  const n = Math.max(2, Math.round(length / (wave / 2)));
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const edge = i === 0 || i === n;
    pts.push([(i / n) * length, (edge ? 0 : (i % 2 ? -1 : 1) * amp * (0.85 + rand(seed + i * 3.1) * 0.35))]);
  }
  const h = amp * 2 + stroke * 2;
  const shifted = pts.map((p): Pt => [p[0], p[1] + h / 2]);
  return (
    <Doodle x={x} y={y} w={length} h={h} vw={length} vh={h} rotate={rotate} pop={pop} flip={flip} shadow={shadow} stroke={stroke} draw={draw}>
      {({ c, sw, draw: dr }) => <Ink d={smoothPath(shifted)} stroke={c(color)} sw={sw} draw={dr} />}
    </Doodle>
  );
};

/** Marker highlighter: two overlapping passes, thick, slightly diagonal. x,y = centre of the underline, w = length in px. */
export const ScribbleUnderline: React.FC<Omit<DoodleProps, "size"> & { w?: number; thickness?: number }> = ({
  x, y, w = 420, thickness = 18, rotate = -2, color = P.orange, draw = 1, pop = 1, shadow, flip = false, seed = 7,
}) => {
  const h = thickness * 3.2;
  const m = thickness * 0.6;
  const a: Pt[] = [];
  const nA = 7;
  for (let i = 0; i <= nA; i++) a.push([m + (i / nA) * (w - 2 * m), h * 0.3 - (i / nA) * 5 + jit(seed, i, 2.2)]);
  const b: Pt[] = [];
  const nB = 6;
  for (let i = 0; i <= nB; i++) b.push([w - m * 1.6 - (i / nB) * (w * 0.78), h * 0.3 + thickness * 0.78 - (i / nB) * 2 + jit(seed, i + 20, 2)]);
  return (
    <Doodle x={x} y={y} w={w} h={h} vw={w} vh={h} rotate={rotate} pop={pop} flip={flip} shadow={shadow} stroke={thickness} draw={draw}>
      {({ c, sw, draw: dr }) => (
        <>
          <Ink d={smoothPath(a)} stroke={c(color)} sw={sw} draw={dr} to={0.62} />
          <Ink d={smoothPath(b)} stroke={c(color)} sw={sw * 0.82} draw={dr} from={0.5} />
        </>
      )}
    </Doodle>
  );
};

/** Hand-drawn ellipse around something: about 1.2 laps with an overshoot. w,h = ellipse size; x,y = its centre. */
export const ScribbleCircle: React.FC<Omit<DoodleProps, "size"> & { w?: number; h?: number }> = ({
  x, y, w = 220, h = 140, rotate = -4, color = P.yellow, stroke = 7, draw = 1, pop = 1, shadow, flip = false, seed = 8,
}) => {
  const pad = 28;
  const bw = w + pad * 2;
  const bh = h + pad * 2;
  const laps = 1.22;
  const n = 52;
  const a0 = -2.35;
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const ang = a0 + t * laps * Math.PI * 2;
    const rad = 0.97 + 0.085 * t + 0.035 * Math.sin(t * 7 + seed) + jit(seed, i, 0.012);
    pts.push([bw / 2 + (w / 2) * rad * Math.cos(ang), bh / 2 + (h / 2) * rad * Math.sin(ang)]);
  }
  return (
    <Doodle x={x} y={y} w={bw} h={bh} vw={bw} vh={bh} rotate={rotate} pop={pop} flip={flip} shadow={shadow} stroke={stroke} draw={draw}>
      {({ c, sw, draw: dr }) => <Ink d={smoothPath(pts)} stroke={c(color)} sw={sw} draw={dr} />}
    </Doodle>
  );
};

/** Spiral from the centre out (about 2.6 turns). */
export const Spiral: React.FC<DoodleProps & { turns?: number }> = ({
  x, y, size = 100, rotate = 0, color = P.orange, stroke, draw = 1, pop = 1, shadow, flip = false, seed = 9, turns = 2.6,
}) => {
  const n = Math.round(turns * 18);
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const ang = t * turns * Math.PI * 2 + seed;
    const r = 4 + t * 43 + jit(seed, i, 0.9);
    pts.push([50 + Math.cos(ang) * r, 50 + Math.sin(ang) * r]);
  }
  return (
    <Doodle x={x} y={y} w={size} h={size} vw={100} vh={100} rotate={rotate} pop={pop} flip={flip} shadow={shadow} stroke={stroke ?? autoStroke(size)} draw={draw}>
      {({ c, sw, draw: dr }) => <Ink d={smoothPath(pts)} stroke={c(color)} sw={sw} draw={dr} />}
    </Doodle>
  );
};

/* ------------------------------------------------------------------ lightning, smiley, heart, eye, crown */

/** Chunky lightning bolt (solid). */
export const Lightning: React.FC<DoodleProps & { solid?: boolean }> = ({
  x, y, size = 90, rotate = 8, color = P.yellow, stroke, draw = 1, pop = 1, shadow, flip = false, seed = 10, solid = true,
}) => {
  const base: Pt[] = [[68, 4], [16, 56], [44, 56], [30, 96], [86, 38], [56, 38]];
  const pts = base.map((p, i): Pt => [p[0] + jit(seed, i, 1.5), p[1] + jit(seed, i + 9, 1.5)]);
  return (
    <Doodle x={x} y={y} w={size} h={size} vw={100} vh={100} rotate={rotate} pop={pop} flip={flip} shadow={shadow} stroke={stroke ?? autoStroke(size)} draw={draw}>
      {({ c, sw, draw: dr }) => <Ink d={polyPath(pts, true)} stroke={c(color)} fill={solid ? c(color) : undefined} sw={sw} draw={dr} />}
    </Doodle>
  );
};

const blobD = (cx: number, cy: number, r: number, seed: number, n = 10, amp = 0.025): string => {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - 1.2;
    const rr = r * (1 + jit(seed, i, amp));
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return smoothPath(pts, true);
};

/** Funky face: yellow disc, pill eyes, wide smile, orange cheeks. `wink` closes one eye. `ink` = feature colour. */
export const Smiley: React.FC<DoodleProps & { wink?: boolean; ink?: string }> = ({
  x, y, size = 100, rotate = -8, color = P.yellow, stroke, draw = 1, pop = 1, shadow, flip = false, seed = 11, wink = false, ink = P.void,
}) => {
  const st = stroke ?? autoStroke(size);
  return (
    <Doodle x={x} y={y} w={size} h={size} vw={100} vh={100} rotate={rotate} pop={pop} flip={flip} shadow={shadow} stroke={st} draw={draw}>
      {({ c, sw, draw: dr }) => {
        const shadowLayer = c("#000") !== "#000";
        return (
          <>
            <Ink d={blobD(50, 50, 44, seed)} stroke={c(color)} fill={c(color)} sw={sw} draw={dr} to={0.55} fillAt={0.3} />
            {shadowLayer ? null : (
              <>
                <Ink d="M19 50L20 52" stroke={P.orange} sw={sw * 2.2} draw={dr} from={0.7} to={0.8} />
                <Ink d="M81 50L80 52" stroke={P.orange} sw={sw * 2.2} draw={dr} from={0.7} to={0.8} />
                <Ink d="M35 31L35 43" stroke={ink} sw={sw * 1.5} draw={dr} from={0.5} to={0.65} />
                {wink ? (
                  <Ink d="M57 41Q65 31 73 40" stroke={ink} sw={sw * 1.1} draw={dr} from={0.55} to={0.7} />
                ) : (
                  <Ink d="M65 31L65 43" stroke={ink} sw={sw * 1.5} draw={dr} from={0.55} to={0.7} />
                )}
                <Ink d="M28 57Q50 88 72 57" stroke={ink} sw={sw * 1.1} draw={dr} from={0.65} to={1} />
              </>
            )}
          </>
        );
      }}
    </Doodle>
  );
};

/** Lopsided heart (solid by default). */
export const Heart: React.FC<DoodleProps & { solid?: boolean }> = ({
  x, y, size = 90, rotate = 10, color = P.orange, stroke, draw = 1, pop = 1, shadow, flip = false, seed = 12, solid = true,
}) => {
  const j = (i: number) => jit(seed, i, 1.5);
  const d = `M${f2(50 + j(1))} ${f2(88 + j(2))}C${f2(22 + j(3))} 68 ${f2(7 + j(4))} 50 ${f2(10 + j(5))} 33C${f2(13 + j(6))} 16 ${f2(36 + j(7))} 12 ${f2(50 + j(8))} 31C${f2(63 + j(9))} 9 ${f2(88 + j(10))} 15 ${f2(90 + j(11))} 35C${f2(92 + j(12))} 52 ${f2(77 + j(13))} 68 ${f2(50 + j(1))} ${f2(88 + j(2))}Z`;
  return (
    <Doodle x={x} y={y} w={size} h={size} vw={100} vh={100} rotate={rotate} pop={pop} flip={flip} shadow={shadow} stroke={stroke ?? autoStroke(size)} draw={draw}>
      {({ c, sw, draw: dr }) => <Ink d={d} stroke={c(color)} fill={solid ? c(color) : undefined} sw={sw} draw={dr} />}
    </Doodle>
  );
};

/** Open eye with lashes: almond outline, orange iris, pupil. `ink` = pupil colour. */
export const Eye: React.FC<DoodleProps & { iris?: string; ink?: string }> = ({
  x, y, size = 120, rotate = -4, color = P.paper, stroke, draw = 1, pop = 1, shadow, flip = false, seed = 13, iris = P.orange, ink = P.void,
}) => {
  const j = (i: number) => jit(seed, i, 1.2);
  return (
    <Doodle x={x} y={y} w={size} h={size * 0.7} vw={100} vh={70} rotate={rotate} pop={pop} flip={flip} shadow={shadow} stroke={stroke ?? autoStroke(size)} draw={draw}>
      {({ c, sw, draw: dr }) => (
        <>
          <Ink d={`M${f2(6 + j(1))} 40C26 8 ${f2(72 + j(2))} 6 ${f2(95 + j(3))} 38C72 68 28 70 ${f2(6 + j(1))} 40Z`} stroke={c(color)} sw={sw} draw={dr} to={0.7} />
          <Ink d={blobD(50, 38, 16, seed, 8, 0.04)} stroke={c(iris)} fill={c(iris)} sw={sw * 0.5} draw={dr} from={0.45} fillAt={0.6} />
          <Ink d="M50 31L50 37" stroke={c(ink)} sw={sw * 1.5} draw={dr} from={0.8} to={1} />
          <Ink d="M26 12L20 2" stroke={c(color)} sw={sw * 0.9} draw={dr} from={0.7} to={0.82} />
          <Ink d="M50 6L50 -4" stroke={c(color)} sw={sw * 0.9} draw={dr} from={0.76} to={0.88} />
          <Ink d="M74 12L80 2" stroke={c(color)} sw={sw * 0.9} draw={dr} from={0.82} to={0.94} />
        </>
      )}
    </Doodle>
  );
};

/** Three-point crown with ball tips (solid). `ink` = band colour. */
export const Crown: React.FC<DoodleProps & { solid?: boolean; ink?: string }> = ({
  x, y, size = 100, rotate = -12, color = P.yellow, stroke, draw = 1, pop = 1, shadow, flip = false, seed = 14, solid = true, ink = P.void,
}) => {
  const base: Pt[] = [[14, 82], [8, 32], [32, 54], [50, 20], [68, 54], [92, 32], [86, 82]];
  const pts = base.map((p, i): Pt => [p[0] + jit(seed, i, 1.5), p[1] + jit(seed, i + 7, 1.5)]);
  return (
    <Doodle x={x} y={y} w={size} h={size} vw={100} vh={100} rotate={rotate} pop={pop} flip={flip} shadow={shadow} stroke={stroke ?? autoStroke(size)} draw={draw}>
      {({ c, sw, draw: dr }) => (
        <>
          <Ink d={polyPath(pts, true)} stroke={c(color)} fill={solid ? c(color) : undefined} sw={sw} draw={dr} to={0.85} />
          <Ink d="M8 28L8 28" stroke={c(color)} sw={sw * 1.9} draw={dr} from={0.8} to={0.88} />
          <Ink d="M50 14L50 14" stroke={c(color)} sw={sw * 1.9} draw={dr} from={0.84} to={0.92} />
          <Ink d="M92 28L92 28" stroke={c(color)} sw={sw * 1.9} draw={dr} from={0.88} to={0.96} />
          {solid ? <Ink d="M24 69Q50 73 76 69" stroke={c(ink)} sw={sw * 0.6} draw={dr} from={0.85} /> : null}
        </>
      )}
    </Doodle>
  );
};

/* ------------------------------------------------------------------ stickers: sparkle mark, ring badge, starburst, speech bubble */

/** Small drawn separator mark (never a font glyph). Used by Marquee and RingBadge; inline SVG. */
export const SepMark: React.FC<{ kind?: "dot" | "star" | "sparkle" | "asterisk"; size?: number; color?: string; style?: React.CSSProperties }> = ({
  kind = "star",
  size = 26,
  color = P.orange,
  style,
}) => {
  let body: React.ReactNode;
  if (kind === "dot") body = <circle cx={50} cy={50} r={36} fill={color} />;
  else if (kind === "sparkle") body = <path d={sparkleD(50, 50, 46, 1)} fill={color} stroke={color} strokeWidth={4} strokeLinejoin="round" />;
  else if (kind === "asterisk")
    body = (
      <g stroke={color} strokeWidth={17} strokeLinecap="round">
        <path d="M50 10L50 90" />
        <path d="M15 30L85 70" />
        <path d="M85 30L15 70" />
      </g>
    );
  else {
    const pts: Pt[] = [];
    for (let i = 0; i < 10; i++) {
      const a = ((i * 36 - 90) * Math.PI) / 180;
      const r = i % 2 === 0 ? 44 : 24;
      pts.push([50 + Math.cos(a) * r, 54 + Math.sin(a) * r]);
    }
    body = <path d={polyPath(pts, true)} fill={color} stroke={color} strokeWidth={8} strokeLinejoin="round" />;
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ verticalAlign: "middle", ...style }}>
      {body}
    </svg>
  );
};

/**
 * Round badge with text running round the edge (rotates with the frame) and a centre slot (children, origin = badge centre:
 * a number, a label, or `<Smiley x={0} y={0} size={70}/>`). items are separated by drawn stars; keep total characters under ~36.
 */
export const RingBadge: React.FC<{
  x: number;
  y: number;
  size?: number;
  items?: string[];
  /** deg per frame (default 1.4); negative reverses */
  speed?: number;
  /** extra start angle in deg */
  angle?: number;
  bg?: string;
  ink?: string;
  /** colour of the centre disc */
  centerBg?: string;
  pop?: number;
  rotate?: number;
  shadow?: string | false;
  anchor?: Anchor;
  children?: React.ReactNode;
}> = ({ x, y, size = 260, items = ["PRODUCT DESIGN", "UX / UI", "SYSTEMS"], speed = 1.4, angle = 0, bg = P.orange, ink = P.void, centerBg = P.void, pop = 1, rotate = 0, shadow = P.orangeDeep, anchor = "c", children }) => {
  const f = useCurrentFrame();
  const id = "rb" + useId().replace(/[^a-zA-Z0-9]/g, "");
  if (pop <= 0.001) return null;
  const R = 74;
  const circ = 2 * Math.PI * R;
  const fs = 21;
  const weights = items.map((s) => s.length + 3);
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  const segs = items.map((s, i) => {
    const frac = weights[i] / total;
    const start = acc;
    acc += frac;
    const used = (s.length / weights[i]) * 0.96;
    return { s, start, frac, textLen: frac * circ * used, mid: start + frac * (used + (1 - used) / 2) };
  });
  const spin = angle + f * speed;
  const [lx, ly] = shadowLocal(rotate, pop, false, 9);
  return (
    <div style={placeStyle(x, y, size, size, anchor, rotate, pop)}>
      <svg width={size} height={size} viewBox="0 0 200 200" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs>
          <path id={id} d={`M100 ${100 - 0}m${-R} 0a${R} ${R} 0 1 1 ${2 * R} 0a${R} ${R} 0 1 1 ${-2 * R} 0`} />
        </defs>
        {shadow ? <circle cx={100 + lx * (200 / size)} cy={100 + ly * (200 / size)} r={98} fill={shadow} /> : null}
        <circle cx={100} cy={100} r={98} fill={bg} />
        <g transform={`rotate(${f2(spin)} 100 100)`}>
          {segs.map((g, i) => (
            <text key={i} fill={ink} style={{ ...sans(800, 88, 24), fontSize: fs, letterSpacing: "0.02em" }} dy={-1}>
              <textPath href={`#${id}`} startOffset={`${f2(g.start * 100)}%`} textLength={f2(g.textLen)} lengthAdjust="spacing">
                {g.s.toUpperCase()}
              </textPath>
            </text>
          ))}
          {segs.map((g, i) => {
            const a = g.mid * Math.PI * 2 + Math.PI;
            const px = 100 + Math.cos(a) * (R + 7);
            const py = 100 + Math.sin(a) * (R + 7);
            return (
              <g key={`m${i}`} transform={`translate(${f2(px)} ${f2(py)}) rotate(${f2((a * 180) / Math.PI + 90)}) scale(0.24) translate(-50 -50)`}>
                <path d={sparkleD(50, 50, 46, i + 2)} fill={ink} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
              </g>
            );
          })}
        </g>
        <circle cx={100} cy={100} r={50} fill={centerBg} />
      </svg>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 0, height: 0 }}>{children}</div>
    </div>
  );
};

/** Text style shared by the sticker shapes (children are laid over the shape, centred). */
const stickerText = (fontSize: number, color: string): React.CSSProperties => ({
  ...sans(800, 88, 48),
  fontSize,
  lineHeight: 0.98,
  letterSpacing: "-0.005em",
  textTransform: "uppercase",
  textAlign: "center",
  color,
});

/** Centred overlay for text inside a shape box (no flex). */
const CenterBox: React.FC<{ children: React.ReactNode; style: React.CSSProperties; w: number }> = ({ children, style, w }) => (
  <div style={{ position: "absolute", left: 0, top: "50%", width: w, transform: "translateY(-50%)", ...style }}>{children}</div>
);

const shadowFor = (fill: string) => (fill === P.orange ? P.orangeDeep : fill === P.paper || fill === P.yellow ? P.orange : P.orangeDeep);

/** Zig-zag-edged sticker (price-tag burst) with centred text. fill orange | yellow | cream. */
export const Starburst: React.FC<{
  x: number;
  y: number;
  size?: number;
  points?: number;
  fill?: string;
  color?: string;
  fontSize?: number;
  rotate?: number;
  pop?: number;
  shadow?: string | false;
  anchor?: Anchor;
  seed?: number;
  children?: React.ReactNode;
}> = ({ x, y, size = 230, points = 16, fill = P.yellow, color = P.void, fontSize, rotate = -10, pop = 1, shadow, anchor = "c", seed = 15, children }) => {
  if (pop <= 0.001) return null;
  const sh = shadow === undefined ? shadowFor(fill) : shadow;
  const pts: Pt[] = [];
  for (let i = 0; i < points * 2; i++) {
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = (i % 2 === 0 ? 95 : 79) + jit(seed, i, 1.8);
    pts.push([100 + Math.cos(a) * r, 100 + Math.sin(a) * r]);
  }
  const d = polyPath(pts, true);
  const k = 200 / size;
  const [lx, ly] = shadowLocal(rotate, pop, false, 8);
  return (
    <div style={placeStyle(x, y, size, size, anchor, rotate, pop)}>
      <svg width={size} height={size} viewBox="0 0 200 200" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {sh ? <path d={d} fill={sh} stroke={sh} strokeWidth={7} strokeLinejoin="round" transform={`translate(${f2(lx * k)} ${f2(ly * k)})`} /> : null}
        <path d={d} fill={fill} stroke={fill} strokeWidth={7} strokeLinejoin="round" />
      </svg>
      <CenterBox w={size} style={stickerText(fontSize ?? size * 0.17, color)}>
        {children}
      </CenterBox>
    </div>
  );
};

/** Rounded squircle blob with a tail (pointing down-left by default) and centred text. x,y anchor the BLOB; the tail hangs below it. */
export const SpeechBubble: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  fill?: string;
  color?: string;
  fontSize?: number;
  /** tail side */
  tail?: "bl" | "br";
  /** keep the text in sentence case instead of uppercase */
  plain?: boolean;
  rotate?: number;
  pop?: number;
  shadow?: string | false;
  anchor?: Anchor;
  seed?: number;
  children?: React.ReactNode;
}> = ({ x, y, w = 520, h = 190, fill = P.orange, color = P.void, fontSize = 44, tail = "bl", plain = false, rotate = -3, pop = 1, shadow, anchor = "c", seed = 16, children }) => {
  if (pop <= 0.001) return null;
  const sh = shadow === undefined ? shadowFor(fill) : shadow;
  const n = 56;
  const e = 3.6;
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const cs = Math.cos(t);
    const sn = Math.sin(t);
    const px = Math.sign(cs) * Math.pow(Math.abs(cs), 2 / e);
    const py = Math.sign(sn) * Math.pow(Math.abs(sn), 2 / e);
    pts.push([w / 2 + (w / 2) * px * (1 + jit(seed, i, 0.004)), h / 2 + (h / 2) * py * (1 + jit(seed, i + 30, 0.01))]);
  }
  const blob = smoothPath(pts, true);
  const th = h * 0.34;
  const L = tail === "bl";
  const bx = (v: number) => (L ? v : w - v);
  const tailD = `M${f2(bx(w * 0.15))} ${f2(h - 6)}C${f2(bx(w * 0.13))} ${f2(h + th * 0.45)} ${f2(bx(w * 0.08))} ${f2(h + th * 0.8)} ${f2(bx(w * 0.05))} ${f2(h + th)}C${f2(bx(w * 0.14))} ${f2(h + th * 0.9)} ${f2(bx(w * 0.27))} ${f2(h + th * 0.5)} ${f2(bx(w * 0.33))} ${f2(h - 6)}Z`;
  const [lx, ly] = shadowLocal(rotate, pop, false, 9);
  const shapes = (col: string, key: string) => (
    <g key={key} fill={col} stroke={col} strokeWidth={5} strokeLinejoin="round">
      <path d={blob} />
      <path d={tailD} />
    </g>
  );
  return (
    <div style={placeStyle(x, y, w, h, anchor, rotate, pop)}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {sh ? <g transform={`translate(${f2(lx)} ${f2(ly)})`}>{shapes(sh, "s")}</g> : null}
        {shapes(fill, "f")}
      </svg>
      <CenterBox w={w} style={{ ...stickerText(fontSize, color), textTransform: plain ? "none" : "uppercase", padding: "0 " + Math.round(w * 0.07) + "px", boxSizing: "border-box" }}>
        {children}
      </CenterBox>
    </div>
  );
};

/* ------------------------------------------------------------------ tangle / untangle */

/** The scribble ball's polyline (n points around (0,0), radius ~ size/2) - the SAME points that Untangle morphs. */
const tanglePts = (size: number, seed: number, n: number): Pt[] => {
  // a "pen" walks with momentum, turns erratically and is steered back when it strays: a natural scribble ball
  const raw: Pt[] = [];
  let px = 0;
  let py = 0;
  let a = jit(seed, 99, 3);
  for (let i = 0; i < n; i++) {
    a += (rand(seed * 3.3 + i * 1.7) - 0.5) * 3.1 + 0.35;
    const dist = Math.hypot(px, py);
    if (dist > 1.25) {
      let dd = Math.atan2(-py, -px) - a;
      dd = Math.atan2(Math.sin(dd), Math.cos(dd));
      a += dd * 0.6;
    }
    px += Math.cos(a) * 0.5;
    py += Math.sin(a) * 0.5;
    raw.push([px, py]);
  }
  let cx = 0;
  let cy = 0;
  raw.forEach((p) => {
    cx += p[0] / n;
    cy += p[1] / n;
  });
  let m = 0;
  raw.forEach((p) => (m = Math.max(m, Math.hypot(p[0] - cx, p[1] - cy))));
  const k = size / 2 / m;
  return raw.map((p): Pt => [(p[0] - cx) * k, (p[1] - cy) * k]);
};

export interface UntangleProps {
  x: number;
  y: number;
  /** diameter of the tangle in px */
  size?: number;
  /** length of the final straight line in px */
  length?: number;
  /** 0 = scribble ball, 1 = perfectly straight horizontal line (same polyline, point by point) */
  progress?: number;
  color?: string;
  stroke?: number;
  /** draw-on 0..1 (default 1) */
  draw?: number;
  pop?: number;
  seed?: number;
  shadow?: string;
}

/** Orange scribble ball that pulls itself into a straight horizontal line as `progress` goes 0 -> 1. x,y = centre of the ball AND of the final line. */
export const Untangle: React.FC<UntangleProps> = ({ x, y, size = 260, length = 720, progress = 1, color = P.orange, stroke = 6, draw = 1, pop = 1, seed = 2, shadow }) => {
  const n = 84;
  const tg = tanglePts(size, seed, n);
  const spread = 0.65;
  const pts: Pt[] = tg.map((p, i) => {
    const s = i / (n - 1);
    const q = c01(progress * (1 + spread) - spread * s);
    const e = easeInOut(q);
    const lineX = -length / 2 + s * length;
    const sag = Math.sin(Math.PI * e) * size * 0.2 * (Math.sin(s * 11 + seed) + 0.45 * Math.sin(s * 23 + seed * 2.1));
    return [lerp(p[0], lineX, e), lerp(p[1], 0, e) + sag * (1 - e)];
  });
  const W = Math.max(size, length) + stroke * 4;
  const H = size + stroke * 4;
  const shifted = pts.map((p): Pt => [p[0] + W / 2, p[1] + H / 2]);
  return (
    <Doodle x={x} y={y} w={W} h={H} vw={W} vh={H} rotate={0} pop={pop} flip={false} shadow={shadow} stroke={stroke} draw={draw}>
      {({ c, sw, draw: dr }) => <Ink d={smoothPath(shifted)} stroke={c(color)} sw={sw} draw={dr} />}
    </Doodle>
  );
};

/** The hand-drawn scribble ball on its own (draw it on with `draw`). */
export const Tangle: React.FC<Omit<UntangleProps, "progress" | "length">> = (p) => <Untangle {...p} progress={0} />;

/* ------------------------------------------------------------------ circuit trace */

export interface TraceGeometry {
  /** dense polyline following the rounded route */
  pts: Pt[];
  /** cumulative length at each dense point */
  cum: number[];
  total: number;
  /** for each input vertex: [x, y, length along the route] of the point on the route that belongs to it */
  vertex: Array<[number, number, number]>;
}

/** Sample a route (corner points) with rounded bends into a dense polyline with cumulative lengths. Corners bend by `radius` px. */
export const traceGeometry = (points: Pt[], radius = 16): TraceGeometry => {
  const pts: Pt[] = [];
  const vmark: number[] = [];
  const push = (p: Pt) => pts.push(p);
  push(points[0]);
  vmark.push(0);
  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i - 1];
    const v = points[i];
    const b = points[i + 1];
    const l1 = Math.hypot(v[0] - a[0], v[1] - a[1]);
    const l2 = Math.hypot(b[0] - v[0], b[1] - v[1]);
    const r = Math.min(radius, l1 / 2, l2 / 2);
    const s: Pt = [v[0] + ((a[0] - v[0]) / l1) * r, v[1] + ((a[1] - v[1]) / l1) * r];
    const e: Pt = [v[0] + ((b[0] - v[0]) / l2) * r, v[1] + ((b[1] - v[1]) / l2) * r];
    const steps = 10;
    for (let k = 0; k <= steps; k++) {
      const t = k / steps;
      const u = 1 - t;
      const p: Pt = [u * u * s[0] + 2 * u * t * v[0] + t * t * e[0], u * u * s[1] + 2 * u * t * v[1] + t * t * e[1]];
      if (k === steps / 2) vmark.push(pts.length);
      push(p);
    }
  }
  push(points[points.length - 1]);
  if (points.length > 1) vmark.push(pts.length - 1);
  const cum: number[] = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, cum, total: cum[cum.length - 1] || 1, vertex: vmark.map((m): [number, number, number] => [pts[m][0], pts[m][1], cum[m]]) };
};

/** Position and direction (deg) of the trace head at progress p (0..1) - to hang a sparkle or pulse dot on the tip. */
export const traceHead = (points: Pt[], p: number, radius = 16): { x: number; y: number; angle: number } => {
  const g = traceGeometry(points, radius);
  const target = c01(p) * g.total;
  let i = 1;
  while (i < g.pts.length - 1 && g.cum[i] < target) i++;
  const seg = Math.max(1e-6, g.cum[i] - g.cum[i - 1]);
  const t = c01((target - g.cum[i - 1]) / seg);
  const a = g.pts[i - 1];
  const b = g.pts[i];
  return { x: lerp(a[0], b[0], t), y: lerp(a[1], b[1], t), angle: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI };
};

/** Total length (px) of a trace route - handy for travel speed. */
export const traceLength = (points: Pt[], radius = 16): number => traceGeometry(points, radius).total;

/** Chunky circuit-style route (give 45/90-degree corner points) that draws on with `progress`; pads pop as the head passes them. */
export const Trace: React.FC<{
  /** corner points in absolute px; use only 0/45/90 degree runs */
  points: Pt[];
  /** 0..1 */
  progress: number;
  stroke?: number;
  color?: string;
  /** corner rounding in px */
  radius?: number;
  /** vertex indices that get a pad (orange dot + cream ring). Default: first and last. */
  pads?: number[];
  padSize?: number;
  /** how much progress a pad's pop takes (default 0.06) */
  popSpan?: number;
  padColor?: string;
  ringColor?: string;
  /** draw the whole route faintly underneath (true or a CSS colour) */
  ghost?: boolean | string;
  /** show a cream dot at the moving head while it travels */
  headDot?: boolean;
}> = ({ points, progress, stroke = 6, color = P.orange, radius = 16, pads, padSize = 17, popSpan = 0.06, padColor = P.orange, ringColor = P.paper, ghost = false, headDot = false }) => {
  const g = traceGeometry(points, radius);
  const p = c01(progress);
  const target = p * g.total;
  const vis: Pt[] = [];
  for (let i = 0; i < g.pts.length; i++) {
    if (g.cum[i] <= target) vis.push(g.pts[i]);
    else {
      const seg = Math.max(1e-6, g.cum[i] - g.cum[i - 1]);
      const t = (target - g.cum[i - 1]) / seg;
      vis.push([lerp(g.pts[i - 1][0], g.pts[i][0], t), lerp(g.pts[i - 1][1], g.pts[i][1], t)]);
      break;
    }
  }
  const padIdx = pads ?? [0, points.length - 1];
  const head = vis[vis.length - 1];
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      {ghost ? <path d={polyPath(g.pts)} fill="none" stroke={typeof ghost === "string" ? ghost : "rgba(246,238,224,0.16)"} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" /> : null}
      {vis.length > 1 ? <path d={polyPath(vis)} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" /> : null}
      {padIdx.map((vi, i) => {
        const v = g.vertex[Math.max(0, Math.min(g.vertex.length - 1, vi))];
        const at = Math.min(v[2] / g.total, 1 - popSpan * 0.9);
        const s = easeOutBack((p - at) / popSpan);
        if (p < at || s <= 0.001) return null;
        return (
          <g key={i} transform={`translate(${f2(v[0])} ${f2(v[1])}) scale(${f2(s)})`}>
            <circle r={padSize} fill={P.void} stroke={ringColor} strokeWidth={Math.max(4, stroke * 0.85)} />
            <circle r={padSize * 0.52} fill={padColor} />
          </g>
        );
      })}
      {headDot && p > 0 && p < 1 ? <circle cx={f2(head[0])} cy={f2(head[1])} r={stroke * 1.05} fill={ringColor} /> : null}
    </svg>
  );
};
