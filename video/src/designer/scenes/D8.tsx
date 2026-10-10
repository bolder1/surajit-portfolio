// D8 What I do (film 960-1080): seven disciplines as a stacked list, an orange highlight steps through them on the eighths, a rolling 01-07 counter, a toolbox ticker.
import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { EI, EO, prog } from "../../lib/anim";
import { keySfx, type Cue } from "../../lib/cues";
import { pop } from "../motion";
import { G, P } from "../tokens";
import { head, label, numeral } from "../type";
import { Asterisk, Eye, Lightning, Smiley, Sparkle, Spiral, Star } from "../kit/doodles";
import { Marquee } from "../kit/Marquee";
import { Card } from "../kit/ui";
import { RollDigit } from "./_D7/Roll";

const WORDS = ["PRODUCT DESIGN", "INTERACTION DESIGN", "DESIGN SYSTEMS", "UX RESEARCH", "PROTOTYPING", "INFORMATION ARCHITECTURE", "USABILITY TESTING"];
const FS = 96;
const PITCH = 100;
const TOP0 = 108;
const BLOCK_H = 90;
const PADX = 28;
const DIM = "rgba(246,238,224,0.38)";

// pass 1: each word slams in on an eighth (7.5 f) and takes the highlight. pass 2 (from the bar at 60): the highlight reads through the list again.
const T1 = WORDS.map((_, k) => Math.round(k * 7.5));
const A0 = -5; // the first word is already mid-slam on frame 0
const T2 = WORDS.map((_, k) => Math.round(60 + k * 7.5));
const END = 140; // open-ended
/** active intervals [a, b) for word k */
const spans = (k: number): [number, number][] => [
  [k === 0 ? A0 : T1[k], k < 6 ? T1[k + 1] : 60],
  [T2[k], k < 6 ? T2[k + 1] : END],
];

const coverage = (f: number, k: number) => {
  let best = 0;
  for (const [a, b] of spans(k)) {
    if (f < a - 0.001) continue;
    const i = prog(f, a, a + 5);
    const o = prog(f, b, b + 4, EI);
    best = Math.max(best, i * (1 - o));
  }
  return best;
};
const stickerPop = (f: number, k: number) => {
  let best = 0;
  for (const [a, b] of spans(k)) {
    if (f < a) continue;
    best = Math.max(best, Math.max(0, pop(f, a + 2)) * (1 - prog(f, b, b + 3)));
  }
  return best;
};
const stickerDraw = (f: number, k: number) => {
  let best = 0;
  for (const [a, b] of spans(k)) {
    if (f < a) continue;
    best = Math.max(best, prog(f, a + 1, a + 9) * (1 - prog(f, b, b + 3)));
  }
  return best;
};

/** counter value 1..7 (continuous while it rolls) */
const counterPos = (f: number) => {
  const times = [0, ...T1.slice(1), ...T2];
  const vals = [1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7];
  let idx = 0;
  for (let i = 0; i < times.length; i++) if (f >= times[i]) idx = i;
  const prev = idx === 0 ? 1 : vals[idx - 1];
  return prev + (vals[idx] - prev) * prog(f, times[idx], times[idx] + 6, EO);
};
const activeIndex = (f: number) => {
  let best = 0;
  let bestV = -1;
  for (let k = 0; k < WORDS.length; k++) {
    const c = coverage(f, k);
    if (c > bestV + 1e-6) {
      bestV = c;
      best = k;
    }
  }
  return best;
};

const sticker = (k: number, f: number): React.ReactNode => {
  const pp = stickerPop(f, k);
  const dd = stickerDraw(f, k);
  if (pp <= 0.001 || dd <= 0) return null;
  const c = { x: 50, y: 0, pop: pp, draw: dd, seed: k + 2 } as const;
  switch (k) {
    case 0:
      return <Star {...c} size={96} color={P.yellow} rotate={-10} />;
    case 1:
      return <Lightning {...c} size={96} color={P.yellow} rotate={6} />;
    case 2:
      return <Asterisk {...c} size={92} color={P.orange} />;
    case 3:
      return <Eye {...c} size={118} iris={P.orange} />;
    case 4:
      return <Spiral {...c} size={96} color={P.orange} />;
    case 5:
      return <Sparkle {...c} size={104} twin color={P.yellow} />;
    default:
      return <Smiley {...c} size={100} rotate={-8} />;
  }
};

const Line: React.FC<{ f: number; k: number }> = ({ f, k }) => {
  const cov = coverage(f, k);
  const rise = prog(f, (k === 0 ? A0 : T1[k]) - 5, (k === 0 ? A0 : T1[k]) + 5);
  if (rise <= 0.001) return null;
  const color = interpolateColors(cov, [0, 1], [DIM, P.paper]);
  return (
    <div style={{ position: "absolute", left: G.x(0), top: TOP0 + k * PITCH, height: BLOCK_H, width: "max-content", padding: `0 ${PADX}px` }}>
      <div style={{ position: "absolute", inset: 0, background: P.orange, borderRadius: 12, boxShadow: `6px 6px 0 ${P.orangeDeep}`, transform: `scaleX(${cov})`, transformOrigin: "0% 50%", opacity: cov > 0.002 ? 1 : 0 }} />
      <div style={{ position: "relative", height: BLOCK_H, overflow: "hidden" }}>
        <div style={{ ...head(FS, 84), color, lineHeight: `${BLOCK_H}px`, whiteSpace: "nowrap", transform: `translateY(${(1 - rise) * 105}%)` }}>{WORDS[k]}</div>
      </div>
      <div style={{ position: "absolute", left: "100%", top: BLOCK_H / 2, width: 0, height: 0 }}>{sticker(k, f)}</div>
    </div>
  );
};

const CounterCard: React.FC<{ f: number }> = ({ f }) => {
  const s = pop(f, -4);
  const pos = counterPos(f);
  const act = activeIndex(f);
  const SIZE = 400;
  const BOXW = 238;
  const H = Math.round(SIZE * 0.86);
  const W = G.x(12) - G.x(8);
  const HH = PITCH * 6 + BLOCK_H;
  return (
    <div style={{ position: "absolute", left: G.x(8), top: TOP0, width: W, height: HH, transform: `scale(${Math.min(1.02, s)})`, transformOrigin: "50% 50%", opacity: s > 0.01 ? 1 : 0 }}>
      <Card w={W} h={HH} pad={0} shadow={P.orangeDeep}>
        <div style={{ position: "absolute", left: 36, top: 30, ...label(28, 640), color: P.dim }}>DISCIPLINE</div>
        <div style={{ position: "absolute", left: (W - 6 - BOXW * 2) / 2, top: 96, height: H, whiteSpace: "nowrap" }}>
          <div style={{ position: "absolute", left: 0, top: 0 }}>
            <RollDigit pos={0} size={SIZE} color={P.orange} boxW={BOXW} boxH={H} />
          </div>
          <div style={{ position: "absolute", left: BOXW, top: 0 }}>
            <RollDigit pos={pos} size={SIZE} color={P.orange} boxW={BOXW} boxH={H} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 36, top: 500, whiteSpace: "nowrap" }}>
          {WORDS.map((_, i) => (
            <div key={i} style={{ position: "absolute", left: i * 76, top: 0, width: 64, height: 18, borderRadius: 9, background: i <= act ? P.orange : "rgba(246,238,224,0.18)" }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 36, bottom: 34, ...numeral(48, 92, 780), lineHeight: 1, color: P.paper, whiteSpace: "nowrap" }}>
          07<span style={{ color: P.dim }}> / DISCIPLINES</span>
        </div>
      </Card>
    </div>
  );
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const stripIn = prog(f, -6, 10);
  return (
    <AbsoluteFill style={{ background: P.void }}>
      {WORDS.map((_, k) => (
        <Line key={k} f={f} k={k} />
      ))}
      <CounterCard f={f} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${(1 - stripIn) * 220}px)` }}>
        <Marquee items={["FIGMA", "FRAMER", "NOTION", "ILLUSTRATOR", "PHOTOSHOP", "LOTTIE"]} x={960} y={895} height={100} angle={-2} speed={6} bg={P.paper} color={P.void} fontSize={52} sepColor={P.orange} shadow={P.orangeDeep} />
      </div>
    </AbsoluteFill>
  );
};

export const cues: Cue[] = [
  { f: 0, sfx: "impact", vol: 0.8 },
  { f: 0, sfx: keySfx(0), vol: 0.4 },
  { f: 4, sfx: "whoosh-retro", vol: 0.35 },
  ...T1.slice(1).map((t, i): Cue => ({ f: t, sfx: keySfx(i + 1), vol: 0.4 })),
  { f: 60, sfx: "swish", vol: 0.4 },
  ...T2.map((t): Cue => ({ f: t, sfx: "snap", vol: 0.28 })),
];
