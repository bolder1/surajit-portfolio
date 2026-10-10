// D10 NUMBERS (abs 1200-1320). Four colour blocks on the grid (2 x 2, 6 cols x 3 rows each). Each block wipes in only when its count starts,
// the odometer digits roll inside their masks and land EXACTLY on local 30 / 45 / 60 / 75 (abs 1230 / 1245 / 1260 / 1275).
// 105-120: tape-stop. Every rate (the rotating stickers) eases to zero and the whole lockup sags down a little. Hard cut at 1320.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, EO } from "../../lib/anim";
import type { Cue } from "../../lib/cues";
import { G, P } from "../tokens";
import { head } from "../type";
import { pop, draw } from "../motion";
import { RingBadge, ScribbleCircle, Starburst } from "../kit/doodles";
import { Icon } from "../kit/icons";
import { Odometer, odometerWidth } from "./_D10/Odometer";

const SIZE = 340; // numeral size in px (>= 200 required)
const BW = 6 * G.CW; // block width: 6 columns
const BH = 3 * G.RH; // block height: 3 rows
const PADX = 48;
const NUM_H = Math.round(SIZE * 0.86); // digit box height
const NUM_TOP = Math.round((BH - NUM_H) / 2); // numeral box top inside the block

type Blk = {
  value: string;
  lines: string[];
  bg: string;
  ink: string;
  numColor: string;
  shadow: string;
  col: number;
  row: number;
  /** wipe-in frame (the block appears when its count starts), roll start, landing (the hit) */
  a: number;
  r: number;
  L: number;
  edge?: string;
};

const BLOCKS: Blk[] = [
  { value: "4", lines: ["YEARS", "DESIGNING"], bg: P.orange, ink: P.void, numColor: P.void, shadow: P.orangeDeep, col: 0, row: 0, a: 2, r: 4, L: 30 },
  { value: "58", lines: ["PROJECTS"], bg: P.yellow, ink: P.void, numColor: P.void, shadow: P.orange, col: 6, row: 0, a: 20, r: 22, L: 45 },
  { value: "12+", lines: ["ENTERPRISE", "PRODUCTS", "SHIPPED"], bg: P.paper, ink: P.void, numColor: P.void, shadow: P.orange, col: 0, row: 3, a: 36, r: 38, L: 60 },
  { value: "3", lines: ["COMPANIES,", "2 CITIES"], bg: P.card, ink: P.paper, numColor: P.paper, shadow: P.orange, col: 6, row: 3, a: 52, r: 54, L: 75, edge: P.line },
];

const TAPE_A = 105;
const TAPE_B = 120;

/** rate multiplier of everything that keeps moving: 1 until 105, then eases to exactly 0 at 120 (tape-stop) */
const rateAt = (f: number) => {
  const t = interpolate(f, [TAPE_A, TAPE_B], [0, 1], clamp);
  return (1 - t) * (1 - t);
};
/** integrated motion (what a constant-rate thing has travelled by frame f) */
const travel = (f: number) => {
  let s = 0;
  for (let k = 0; k < f; k++) s += rateAt(k);
  return s;
};

const Block: React.FC<{ b: Blk; f: number; spin: number }> = ({ b, f, spin }) => {
  const x = G.x(b.col);
  const y = G.y(b.row);
  const wipe = interpolate(f, [b.a, b.a + 8], [0, 1], { ...clamp, easing: EO });
  if (wipe <= 0) return null;
  const nw = odometerWidth(b.value, SIZE);
  // numeral punch on landing
  const k = f >= b.L ? Math.exp(-(f - b.L) / 3.2) * Math.cos((f - b.L) * 0.95) : 0;
  const punch = 1 + 0.075 * k;
  const sh = interpolate(f, [b.L, b.L + 5], [0, 11], { ...clamp, easing: EO });
  const lx = x + PADX + nw + 60;
  const lab = interpolate(f, [b.L - 4, b.L + 6], [0, 1], { ...clamp, easing: EO });
  const fs = 56;
  const lineH = fs * 0.98;
  const labH = lineH * b.lines.length;
  return (
    <>
      <div style={{ position: "absolute", left: x, top: y, width: BW, height: BH, background: b.bg, boxShadow: b.edge ? `inset 0 0 0 3px ${b.edge}` : undefined, clipPath: `inset(${(1 - wipe) * 100}% 0px 0px 0px)` }} />
      <div style={{ position: "absolute", left: x + PADX, top: y + NUM_TOP, width: nw, height: NUM_H, transform: `scale(${punch})`, transformOrigin: "0% 78%" }}>
        <Odometer value={b.value} frame={f} start={b.r} land={b.L} size={SIZE} color={b.numColor} shadow={b.shadow} shadowPx={sh} />
      </div>
      <div style={{ position: "absolute", left: lx, top: y + NUM_TOP + NUM_H * 0.915 - labH, width: BW - (lx - x) - 16, height: labH, overflow: "hidden" }}>
        <div style={{ transform: `translateY(${(1 - lab) * 105}%)`, color: b.ink, ...head(fs, 84, 800), lineHeight: `${lineH}px`, textTransform: "uppercase", whiteSpace: "nowrap" }}>
          {b.lines.map((l, i) => (
            <div key={i} style={{ height: lineH }}>
              {l}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const m = travel(f);
  // tape-stop sag: the whole lockup droops a little as the platter slows
  const t = interpolate(f, [TAPE_A, TAPE_B], [0, 1], clamp);
  const sag = 20 * (1 - (1 - t) * (1 - t));
  const [, b1, , b3] = BLOCKS;
  return (
    <AbsoluteFill style={{ background: P.void }}>
      <AbsoluteFill style={{ transform: `translateY(${sag}px) scaleY(${1 - 0.012 * t})`, transformOrigin: "50% 0%" }}>
        {BLOCKS.map((b) => (
          <Block key={b.value} b={b} f={f} spin={m} />
        ))}
        {/* 4 YEARS: "and counting" starburst */}
        <Starburst x={G.x(5) - 20} y={G.y(0) + 215} size={250} fill={P.paper} color={P.void} shadow={P.void} fontSize={31} rotate={-10 + 6 * Math.sin(m * 0.16)} pop={pop(f, 33)} seed={21}>
          AND COUNTING
        </Starburst>
        {/* 58 PROJECTS: circle round the number */}
        <ScribbleCircle x={G.x(6) + PADX + odometerWidth("58", SIZE) / 2} y={G.y(0) + BH / 2} w={410} h={330} color={P.void} stroke={9} rotate={-3} draw={draw(f, b1.L + 3, b1.L + 15)} seed={5} />
        {/* 3 COMPANIES, 2 CITIES: the two cities */}
        <RingBadge x={G.x(10) + 85} y={G.y(3) + BH / 2} size={250} items={["Kolkata", "Pune", "Kolkata", "Pune"]} speed={0} angle={m * 1.4} pop={pop(f, b3.L + 4)} shadow={P.orangeDeep}>
          <div style={{ position: "absolute", left: -23, top: -23 }}>
            <Icon name="pin" size={46} color={P.orange} fill={P.orange} stroke={3.5} />
          </div>
        </RingBadge>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const cues: Cue[] = [
  // block slams (each block appears only when its count starts)
  ...BLOCKS.flatMap((b): Cue[] => [
    { f: b.a, sfx: "snap", vol: 0.4 },
    { f: b.r + 4, sfx: "click", vol: 0.22 },
    { f: b.r + 10, sfx: "click", vol: 0.2 },
    { f: b.r + 16, sfx: "click", vol: 0.2 },
    { f: b.L, sfx: "arcade-blip", vol: 0.55 },
    { f: b.L, sfx: "glass-tink", vol: 0.35 },
  ]),
  { f: 33, sfx: "glass-tink-2", vol: 0.4 },
  { f: 48, sfx: "swish", vol: 0.3 },
  { f: 79, sfx: "glass-tink-2", vol: 0.45 },
  { f: 104, sfx: "tape-stop", vol: 0.85 },
];
