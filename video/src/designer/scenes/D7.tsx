// D7 Proof (film 780-960): 15 workday cells fold to 5, "3 WEEKS -> 5 DAYS", D1..D5 chips, then THE STAT ~70% FASTER on local 120 (abs 900).
import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { clamp, EI, EIO, prog } from "../../lib/anim";
import { keySfx, type Cue } from "../../lib/cues";
import { draw, pop, wob } from "../motion";
import { G, P } from "../tokens";
import { head, sans } from "../type";
import { CurlyArrow, ScribbleCircle, ScribbleUnderline, Sparkle, Starburst } from "../kit/doodles";
import { Sticker } from "../kit/Collage";
import { CalendarCell, Chip, Icon, Pop } from "../kit/ui";
import { GlyphBox, odometer, RollDigit } from "./_D7/Roll";

/* ---------------------------------------------------------------- layout (px, snapped to the 12 x 6 grid) */
const CW = 232; // 5 cells + 4 gaps = 1200 = columns 0-7
const CH = 148;
const GX = 10;
const cellX = (c: number) => G.x(0) + c * (CW + GX);
const cellY = (r: number) => G.y(1) + r * G.RH;
const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];

const COL_X = 1350; // the 5-day sprint column
const PITCH = 154;
const ITEM_TOP = (i: number) => 256 + i * PITCH;
const T_CHIP = [75, 82.5, 90, 97.5, 105];
const CHIP_LABEL = [
  ["INTERVIEWS", "+ JTBD"],
  ["5 FLOW VARIANTS", "IN 4 HOURS"],
  ["HI-FI ON THE", "DESIGN SYSTEM"],
  ["PROTOTYPE", "+ DESIGN QA"],
  ["WALKTHROUGH", "+ HANDOFF"],
];

// hero block ("5 DAYS") and the stat block it grows into
const HERO_BLOCK = { x: G.x(0), y: 670, w: 960, h: 290 };
const STAT = { x: G.x(0), y: G.y(2), w: 1200, h: 580 };
const SIZE_NUM = 380;
const BOX_D = 226; // digit box width
const BOX_T = 205; // "~" box
const BOX_P = 350; // "%" box
const NUM_H = Math.round(SIZE_NUM * 0.86);
const NUM_X = 40;
const NUM_Y = 82;

const win = (f: number, t: number, len: number) => Math.sin(Math.PI * Math.min(1, Math.max(0, (f - t) / len)));
const foldT0 = (c: number, r: number) => 15 + (2 - r) * 7 + Math.abs(c - 2) * 2;

/* ---------------------------------------------------------------- pieces */

const Title: React.FC<{ f: number }> = ({ f }) => {
  const p = prog(f, -6, 8);
  return (
    <>
      <div style={{ position: "absolute", left: G.x(0), top: 100, height: 96, overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ ...head(88), color: P.paper, transform: `translateY(${(1 - p) * 115}%)` }}>
          ACTIVE DIRECTORY <span style={{ color: P.orange }}>PROTOTYPE</span>
        </div>
      </div>
      <ScribbleUnderline x={840} y={186} w={390} thickness={12} color={P.yellow} draw={draw(f, 20, 36)} />
    </>
  );
};

const Cells: React.FC<{ f: number }> = ({ f }) => {
  const cells: React.ReactNode[] = [];
  // folding rows first (they slide up under/over row 0), then the surviving row on top
  for (const r of [2, 1, 0]) {
    for (let c = 0; c < 5; c++) {
      const n = r * 5 + c + 1;
      const s = pop(f, (c + r) * 1.2 - 9);
      let sc = s;
      let ty = 0;
      let rot = 0;
      let vis = s > 0.01;
      let on: number = 0;
      const tone = "yellow" as const;
      let mark = 0;
      let day: number | string = n;
      if (r > 0) {
        const p = prog(f, foldT0(c, r), foldT0(c, r) + 14, EIO);
        ty = -p * r * G.RH;
        sc = s * (1 - 0.88 * p);
        rot = (c % 2 ? 1 : -1) * p * 7;
        if (p >= 0.995) vis = false;
      } else {
        const bump = Math.min(1, win(f, foldT0(c, 1) + 14, 9) + win(f, foldT0(c, 2) + 14, 9));
        sc = s * (1 + 0.07 * bump);
        const lit = prog(f, T_CHIP[c], T_CHIP[c] + 3);
        on = bump * 0.9;
        mark = draw(f, T_CHIP[c] + 1, T_CHIP[c] + 8);
        if (lit > 0.5) day = `D${c + 1}`;
        // hold: a single wave runs along the five days
        ty = -14 * win(f, 128 + c * 4, 12);
      }
      if (!vis) continue;
      cells.push(
        <div key={`${c}-${r}`} style={{ position: "absolute", left: cellX(c), top: cellY(r), width: CW, height: CH, transform: `translateY(${ty}px) rotate(${rot}deg) scale(${sc})`, transformOrigin: "50% 0%" }}>
          <CalendarCell day={day} caption={DAYS[c]} w={CW} h={CH} on={on} tone={tone} mark={mark} />
        </div>,
      );
    }
  }
  return <>{cells}</>;
};

const Sprint: React.FC<{ f: number }> = ({ f }) => {
  const lineH = interpolate(f, T_CHIP, [0, 1, 2, 3, 4].map((k) => k * PITCH), clamp);
  const lineO = pop(f, -3) > 0.02 ? 1 : 0;
  return (
    <>
      <Sticker x={COL_X} y={122} rotate={-3} fontSize={30} anchor="tl" pop={pop(f, 2)}>
        5 BUSINESS DAYS
      </Sticker>
      <div style={{ position: "absolute", left: COL_X + 40, top: ITEM_TOP(0) + 22, width: 4, height: 4 * PITCH, opacity: lineO, background: "rgba(246,238,224,0.16)", borderRadius: 2 }} />
      <div style={{ position: "absolute", left: COL_X + 40, top: ITEM_TOP(0) + 22, width: 4, height: lineH, background: P.orange, borderRadius: 2 }} />
      {T_CHIP.map((t, i) => {
        const lit = prog(f, t, t + 3);
        const top = ITEM_TOP(i);
        const ink = interpolateColors(lit, [0, 1], [P.dim, P.paper]);
        const tickAt = 138 + i * 8;
        return (
          <React.Fragment key={i}>
            <Pop at={-3 + i * 2} x={COL_X} y={top}>
              <Chip label={`D${i + 1}`} w={84} active={lit} />
            </Pop>
            <div style={{ position: "absolute", left: COL_X + 108, top: top - 6, opacity: pop(f, -3 + i * 2) > 0.02 ? 1 : 0, color: ink, whiteSpace: "nowrap", ...sans(740, 80, 28), fontSize: 33, lineHeight: 1.1, letterSpacing: "0.01em" }}>
              {CHIP_LABEL[i][0]}
              <br />
              {CHIP_LABEL[i][1]}
            </div>
            <div style={{ position: "absolute", left: G.x(12) - 44, top: top - 2 }}>
              <Icon name="check" size={44} color={P.orange} stroke={6} draw={draw(f, tickAt, tickAt + 8)} />
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

/** Phase 2: "3 WEEKS" slams, a drawn arrow, "5 DAYS" on an orange block. */
const Hero: React.FC<{ f: number }> = ({ f }) => {
  const a = prog(f, 55, 63);
  const b = prog(f, 68, 76);
  const gone = f >= 121;
  if (f < 54 || gone) return null;
  return (
    <>
      <div style={{ position: "absolute", left: G.x(0), top: 394, height: 252, overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ ...head(270, 84), color: P.paper, transform: `translateY(${(1 - a) * 108}%)` }}>3 WEEKS</div>
      </div>
      <CurlyArrow kind="swoop" x={1130} y={580} size={270} rotate={0} flip stroke={9} color={P.yellow} draw={draw(f, 64, 82)} />
      <div style={{ position: "absolute", left: HERO_BLOCK.x, top: HERO_BLOCK.y, width: HERO_BLOCK.w, height: HERO_BLOCK.h, background: P.orange, boxShadow: `10px 10px 0 ${P.orangeDeep}`, borderRadius: 12, clipPath: `inset(0 ${(1 - b) * 100}% 0 0)` }} />
    </>
  );
};

const HeroText: React.FC<{ f: number }> = ({ f }) => {
  const b = prog(f, 68, 76);
  if (f < 70 || f >= 112) return null;
  return (
    <div style={{ position: "absolute", left: HERO_BLOCK.x, top: HERO_BLOCK.y, width: HERO_BLOCK.w, height: HERO_BLOCK.h, overflow: "hidden", clipPath: `inset(0 ${(1 - b) * 100}% 0 0)` }}>
      <div style={{ ...head(270, 84), color: P.void, lineHeight: `${HERO_BLOCK.h}px`, paddingLeft: 40, whiteSpace: "nowrap" }}>5 DAYS</div>
    </div>
  );
};

/** THE STAT: an orange block that grows out of the "5 DAYS" block and slams to full size on frame 120. */
const Stat: React.FC<{ f: number }> = ({ f }) => {
  if (f < 104) return null;
  const A = prog(f, 104, 112, EIO);
  const B = prog(f, 112, 120, EI);
  const top = (HERO_BLOCK.y - STAT.y) * (1 - A);
  const right = (STAT.w - HERO_BLOCK.w) * (1 - B);
  const clip = `inset(${top}px ${right}px 0px 0px round 12px)`;
  const punch = 1 + 0.03 * (1 - prog(f, 120, 130));
  const push = 1 + 0.035 * prog(f, 120, 180, (t) => t);
  const count = 70 * prog(f, 112, 120, (t) => 1 - Math.pow(1 - t, 2.2));
  const [tens, ones] = odometer(count);
  const showNum = f >= 112;
  const strike = draw(f, 134, 148);
  return (
    <div style={{ position: "absolute", left: STAT.x, top: STAT.y, width: STAT.w, height: STAT.h, transform: `scale(${punch})`, transformOrigin: "0% 50%" }}>
      <div style={{ position: "absolute", inset: 0, background: P.orangeDeep, transform: "translate(10px, 10px)", clipPath: clip }} />
      <div style={{ position: "absolute", inset: 0, background: P.orange, clipPath: clip, overflow: "hidden" }}>
        {showNum ? (
          <div style={{ position: "absolute", inset: 0, transform: `scale(${push})`, transformOrigin: "30% 50%" }}>
            <div style={{ position: "absolute", left: NUM_X, top: NUM_Y, height: NUM_H, whiteSpace: "nowrap" }}>
              <div style={{ position: "absolute", left: 0, top: 0 }}>
                <svg width={BOX_T} height={NUM_H} viewBox={`0 0 ${BOX_T} ${NUM_H}`}>
                  <path d={`M26 ${NUM_H * 0.58} C 56 ${NUM_H * 0.4} 98 ${NUM_H * 0.38} 114 ${NUM_H * 0.5} C 130 ${NUM_H * 0.62} 160 ${NUM_H * 0.64} 184 ${NUM_H * 0.44}`} fill="none" stroke={P.void} strokeWidth={48} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ position: "absolute", left: BOX_T, top: 0 }}>
                <RollDigit pos={tens} size={SIZE_NUM} color={P.void} boxW={BOX_D} boxH={NUM_H} />
              </div>
              <div style={{ position: "absolute", left: BOX_T + BOX_D, top: 0 }}>
                <RollDigit pos={ones} size={SIZE_NUM} color={P.void} boxW={BOX_D} boxH={NUM_H} />
              </div>
              <div style={{ position: "absolute", left: BOX_T + BOX_D * 2, top: 0 }}>
                <GlyphBox ch="%" size={SIZE_NUM} color={P.void} boxW={BOX_P} boxH={NUM_H} />
              </div>
            </div>
            {/* the caption: 3 WEEKS struck through, 5 BUSINESS DAYS */}
            <div style={{ position: "absolute", left: NUM_X + 6, top: 486, whiteSpace: "nowrap", ...sans(780, 84, 32), fontSize: 52, color: P.void, letterSpacing: "0.01em" }}>
              <span style={{ position: "relative" }}>
                3 WEEKS
                <svg width={190} height={30} viewBox="0 0 190 30" style={{ position: "absolute", left: -8, top: 14, overflow: "visible" }}>
                  <path d="M2 24 C 50 14, 110 30, 188 14" fill="none" stroke={P.paper} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray="1 1.01" strokeDashoffset={1 - strike} />
                </svg>
              </span>
              <svg width={56} height={34} viewBox="0 0 52 30" style={{ margin: "0 20px", verticalAlign: "middle" }} fill="none" stroke={P.void} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15 H46 M33 4 L46 15 L33 26" />
              </svg>
              5 BUSINESS DAYS
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const StatDoodles: React.FC<{ f: number }> = ({ f }) => {
  if (f < 121) return null;
  const bx = STAT.x + NUM_X + BOX_T + BOX_D; // centre of the "70"
  return (
    <>
      <ScribbleCircle x={bx} y={STAT.y + NUM_Y + NUM_H / 2 - 4} w={520} h={348} color={P.paper} stroke={8} draw={draw(f, 126, 146)} seed={4} />
      <Starburst x={1224} y={384} size={250} fill={P.yellow} color={P.void} shadow={P.void} fontSize={48} rotate={-10 + wob(f, 4, 48)} pop={pop(f, 122) * (1 + 0.025 * Math.sin(f * 0.35))}>
        FASTER
      </Starburst>
      <Sparkle x={96} y={392} size={84} twin color={P.yellow} pop={pop(f, 130) * (1 + 0.12 * Math.sin(f * 0.3))} seed={3} />
    </>
  );
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: P.void }}>
      <Title f={f} />
      <Cells f={f} />
      <Sprint f={f} />
      <Hero f={f} />
      <Stat f={f} />
      <HeroText f={f} />
      <StatDoodles f={f} />
    </AbsoluteFill>
  );
};

export const cues: Cue[] = [
  { f: 0, sfx: "impact-soft", vol: 0.6 },
  { f: 3, sfx: "click", vol: 0.3 },
  { f: 15, sfx: "swish", vol: 0.45 },
  { f: 30, sfx: "snap", vol: 0.4 },
  { f: 38, sfx: "glass-tink", vol: 0.3 },
  { f: 59, sfx: "impact", vol: 0.7 },
  { f: 66, sfx: "swish", vol: 0.3 },
  { f: 68, sfx: "snap", vol: 0.5 },
  ...T_CHIP.map((t, i): Cue => ({ f: Math.round(t), sfx: keySfx(i), vol: 0.42 })),
  { f: 106, sfx: "riser", vol: 0.45 },
  { f: 120, sfx: "impact", vol: 0.9 },
  { f: 120, sfx: "boom", vol: 0.55 },
  { f: 122, sfx: "glass-tink", vol: 0.5 },
  { f: 122, sfx: "snap", vol: 0.5 },
  { f: 126, sfx: "swish", vol: 0.4 },
  { f: 134, sfx: "swish", vol: 0.3 },
  ...[0, 1, 2, 3, 4].map((i): Cue => ({ f: 138 + i * 8, sfx: "blip-hi", vol: 0.28 })),
];

