// D11 PRINCIPLE (abs 1320-1380): the quiet breakdown. The orange tangle pulls itself into one straight line on the grid's own line,
// "Make complex feel calm." settles in while the width axis relaxes (tense and heavy -> open and calm), then everything shrinks into a dot (1365-1377)
// and a single dot stays on black (1377-1380, silence).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp, EIO, EO, lerp } from "../../lib/anim";
import type { Cue } from "../../lib/cues";
import { G, P } from "../tokens";
import { label, sans } from "../type";
import { draw, pop } from "../motion";
import { Untangle } from "../kit/doodles";

const CX = G.x(6); // 960: the grid's centre intersection, where the final dot lands
const CY = G.y(3); // 540
const LINE_Y = G.y(4); // 700: the straight line lies on a grid line
const LINE_X0 = G.x(1);
const LINE_X1 = G.x(11);
const LINE_W = LINE_X1 - LINE_X0; // 1500 = ten columns

const PULL_A = 6;
const PULL_B = 30;
const SHRINK_A = 45; // abs 1365
const SHRINK_B = 57; // abs 1377

const WORDS: { w: string; at: number; orange?: boolean }[][] = [
  [{ w: "Make", at: 12 }, { w: "complex", at: 16 }],
  [{ w: "feel", at: 21 }, { w: "calm.", at: 25, orange: true }],
];

const FS = 200;
const LH = 0.98;

const Word: React.FC<{ w: string; at: number; f: number; orange?: boolean }> = ({ w, at, f, orange }) => {
  const rise = interpolate(f, [at, at + 12], [1, 0], { ...clamp, easing: EO });
  // the width axis relaxes: tense, heavy and tight -> open, lighter and calm
  const t = interpolate(f, [at, at + 20], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0.6, 0.2, 1) });
  const wdth = lerp(75, 100, t);
  const wght = lerp(820, 560, t);
  const ls = lerp(-0.05, -0.012, t);
  return (
    <span style={{ position: "relative", top: rise * FS * 1.15, color: orange ? P.orange : P.paper, ...sans(wght, wdth, 96), fontSize: FS, letterSpacing: `${ls}em`, whiteSpace: "pre" }}>{w}</span>
  );
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [PULL_A, PULL_B], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const settle = interpolate(f, [PULL_A, PULL_B], [0, 1], { ...clamp, easing: EO });
  const y = lerp(CY, LINE_Y, settle);
  const unspin = -38 * (1 - p);
  const sh = interpolate(f, [SHRINK_A, SHRINK_B], [0, 1], { ...clamp, easing: EIO });
  const scale = Math.max(0, 1 - sh);
  const dotR = 15 * interpolate(f, [SHRINK_A + 3, SHRINK_B - 1], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const lab = interpolate(f, [38, 48], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: P.void }}>
      {scale > 0.002 ? (
        <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: `${CX}px ${CY}px` }}>
          {/* the thread: scribble ball -> straight line */}
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `rotate(${unspin}deg)`, transformOrigin: `${CX}px ${y}px` }}>
            <Untangle x={CX} y={y} size={260} length={LINE_W} progress={p} stroke={8} draw={draw(f, -4, 6)} seed={2} />
          </div>
          {/* ruler ticks on every column line, laid after the thread passes */}
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
            {Array.from({ length: 11 }, (_, k) => {
              const h = 26 * interpolate(f, [20 + k * 1.5, 26 + k * 1.5], [0, 1], { ...clamp, easing: EO });
              return h > 0.2 ? <line key={k} x1={LINE_X0 + k * G.CW} x2={LINE_X0 + k * G.CW} y1={LINE_Y + 14} y2={LINE_Y + 14 + h} stroke={P.faint} strokeWidth={3} strokeLinecap="round" /> : null;
            })}
            {[LINE_X0, LINE_X1].map((px, i) => {
              const s = pop(f, 28 + i * 2);
              return s > 0.01 ? (
                <g key={i} transform={`translate(${px} ${LINE_Y}) scale(${s})`}>
                  <circle r={19} fill={P.void} stroke={P.paper} strokeWidth={5} />
                  <circle r={8} fill={P.orange} />
                </g>
              ) : null;
            })}
          </svg>
          {/* the principle */}
          <div style={{ position: "absolute", left: 0, top: LINE_Y - 135 - 2 * (FS * LH + 8), width: 1920, textAlign: "center" }}>
            {WORDS.map((ln, i) => (
              <div key={i} style={{ height: FS * LH + 8, overflow: "hidden", lineHeight: `${FS * LH}px`, whiteSpace: "pre", paddingBottom: 8 }}>
                {ln.map((o, j) => (
                  <Word key={o.w} w={(j ? " " : "") + o.w} at={o.at} f={f} orange={o.orange} />
                ))}
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: LINE_X0 - 19, top: LINE_Y + 60, opacity: lab, color: P.orange, ...label(24, 700) }}>Principle</div>
        </AbsoluteFill>
      ) : null}
      {dotR > 0.1 ? <div style={{ position: "absolute", left: CX - dotR, top: CY - dotR, width: dotR * 2, height: dotR * 2, borderRadius: "50%", background: P.orange }} /> : null}
    </AbsoluteFill>
  );
};

export const cues: Cue[] = [
  { f: 5, sfx: "sine-calm", vol: 0.32 },
  { f: 8, sfx: "swish", vol: 0.28 },
  { f: 29, sfx: "glass-tink", vol: 0.3 },
  { f: 45, sfx: "whoosh-rev", vol: 0.3 },
];
