import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, useCurrentFrame } from "remotion";
import { C, mona, mono, serif } from "../lib/theme";
import { clamp, EIO, EO, lerp, prog } from "../lib/anim";
import { Glow } from "../lib/FX";
import { keySfx, type Cue } from "../lib/cues";
import face from "../assets/face.json";
// Pre-graded portrait layers (baked from public/img/portrait-cut.png: warm duotone, ghost-band artefact
// removed; rim = the light-facing silhouette edge plus the photo's own red highlights).
import portraitSrc from "./_S8/portrait.png";
import rimSrc from "./_S8/rim.png";

/**
 * 08 · SESSION (180 f) — the end card. Full 16:9, no letterbox.
 *
 * f0   a vermilion "focused field" underline draws on; status chip snaps in; face contours start drawing
 * f2   SURAJIT DUTTA rises out of the underline (mask) while its tracking compresses 0.14em → -0.02em
 * f30  the underline collapses into the full stop: a vermilion period lands (click)
 * f38  one specular band crosses the name, f60 it reaches the period: glint (shimmer peaks)
 * f45  "Let's build something users trust." rises from its baseline
 * f75  contact types in (email, separator on f90, LinkedIn), vermilion caret
 * f120 sub boom: the portrait resolves under the mesh and its vermilion rim light ignites
 * f120–165 hold (caret blinks on the beat) · f165–177 fade to black
 */

const DUR = 180;
const SETTLE = 30;
const LINE_IN = 45;
const TYPE_A = 75;
const SEP_F = 90;
const TYPE_B = 92;
const BOOM = 120;
const FADE_A = 165;
const FADE_B = 177;

// ---------- name metrics (Mona Sans @ wdth 118 / wght 800, no kerning; measured with fontTools) ----------
const NAME = "SURAJIT DUTTA";
const ADV: Record<string, number> = { S: 718, U: 778, R: 778, A: 831, J: 455, I: 304, T: 669, D: 797, " ": 208 };
const FS = 152;
const X0 = 150;
const NAME_TOP = 470;
const BASE = NAME_TOP + 0.885 * FS; // baseline (asc 1090 / desc 320, line-height 1)
const MASK_H = 0.9 * FS; // mask edge sits just under the baseline
const TRACK_A = 0.14;
const TRACK_B = -0.02;
const advSum = NAME.split("").reduce((s, ch) => s + ADV[ch], 0) / 1000; // em
const nameW = (ls: number) => (advSum + NAME.length * ls) * FS;
const DOT_W = 0.2 * FS;
const DOT_H = 0.165 * FS;
const DOT_X = X0 + nameW(TRACK_B) + 0.0197 * FS;
const DOT_Y = BASE - DOT_H + 1.4;

const track = (f: number) => lerp(TRACK_A, TRACK_B, prog(f, 0, SETTLE, Easing.bezier(0.3, 0, 0.1, 1)));

// ---------- specular sweep ----------
const SW_A = 43;
const SW_B = 71;
const SW_EASE = Easing.bezier(0.45, 0, 0.25, 1);
const bandX = (f: number) => interpolate(f, [SW_A, SW_B], [X0 - 280, DOT_X + 300], { ...clamp, easing: SW_EASE });
const GLINT = (() => {
  for (let f = SW_A; f <= SW_B; f += 0.25) if (bandX(f) >= DOT_X + DOT_W / 2) return Math.round(f);
  return SW_B;
})();

// ---------- portrait + face mesh geometry ----------
const PSC = 0.78; // display scale vs the 1500×1800 original (baked at 0.9)
const FACE_C = { x: 809, y: 848 }; // face centre in original px
const STAGE_C = { x: 1676, y: 448 };
const IMG_L = STAGE_C.x - FACE_C.x * PSC;
const IMG_T = STAGE_C.y - FACE_C.y * PSC;
const P = (face.pts as number[][]).map((p) => [IMG_L + p[0] * PSC, IMG_T + p[1] * PSC] as const);
const TESS_D = (face.tess as number[][]).map(([a, b]) => `M${P[a][0].toFixed(1)} ${P[a][1].toFixed(1)}L${P[b][0].toFixed(1)} ${P[b][1].toFixed(1)}`).join("");
const CONT = (face.contours as number[][]).map(([a, b]) => {
  const [x1, y1] = P[a];
  const [x2, y2] = P[b];
  return { x1, y1, x2, y2, len: Math.hypot(x2 - x1, y2 - y1), mx: (x1 + x2) / 2 };
});
const CX_MIN = Math.min(...CONT.map((c) => c.mx));
const CX_MAX = Math.max(...CONT.map((c) => c.mx));

// ---------- contact ----------
const EMAIL = "surajit3255@gmail.com";
const LINKEDIN = "linkedin.com/in/surajit3255";
const RATE = 1.5; // chars per frame
const emailN = (f: number) => Math.max(0, Math.min(EMAIL.length, Math.floor((f - TYPE_A) * RATE)));
const linkN = (f: number) => Math.max(0, Math.min(LINKEDIN.length, Math.floor((f - TYPE_B) * RATE)));
const charFrame = (start: number, i: number) => start + Math.ceil((i + 1) / RATE);
const TYPE_END = charFrame(TYPE_B, LINKEDIN.length - 1);

// ---------- layers ----------
const FaceField: React.FC<{ f: number }> = ({ f }) => {
  const resolve = prog(f, BOOM, BOOM + 24, EO);
  const flare = interpolate(f, [BOOM, BOOM + 2, BOOM + 30], [0, 1, 0], { ...clamp, easing: EO });
  const photoO = lerp(0.06, 0.22, resolve);
  const rimO = Math.min(1, lerp(0, 0.62, resolve) + flare * 0.5);
  const tessO = interpolate(f, [10, 60], [0, 0.085], clamp) * lerp(1, 0.4, resolve);
  const contO = lerp(0.3, 0.07, resolve);
  const wipe = interpolate(f, [4, 56], [CX_MIN - 60, CX_MAX + 60], { ...clamp, easing: EIO });
  const drift = interpolate(f, [0, DUR], [14, -14], clamp);
  return (
    <AbsoluteFill style={{ transform: `translateX(${drift}px) scale(${interpolate(f, [0, DUR], [1.0, 1.035], clamp)})`, transformOrigin: "1680px 450px" }}>
      <Glow x={STAGE_C.x - 230} y={STAGE_C.y - 160} r={520} opacity={0.16 * resolve + 0.12 * flare} />
      <AbsoluteFill
        style={{
          WebkitMaskImage: "linear-gradient(90deg, transparent 0px, transparent 1180px, #000 1500px)",
          maskImage: "linear-gradient(90deg, transparent 0px, transparent 1180px, #000 1500px)",
        }}
      >
        <Img src={portraitSrc} style={{ position: "absolute", left: IMG_L, top: IMG_T, width: 1500 * PSC, height: 1800 * PSC, opacity: photoO }} />
        <Img src={rimSrc} style={{ position: "absolute", left: IMG_L, top: IMG_T, width: 1500 * PSC, height: 1800 * PSC, opacity: rimO }} />
      </AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="s8wipe">
            <rect x={0} y={0} width={wipe} height={1080} />
          </clipPath>
        </defs>
        <path d={TESS_D} stroke={C.paper} strokeWidth={0.6} fill="none" opacity={tessO} clipPath="url(#s8wipe)" />
        <g stroke={C.paper} strokeWidth={0.9} strokeLinecap="round" opacity={contO}>
          {CONT.map((c, i) => {
            const a = 4 + ((c.mx - CX_MIN) / (CX_MAX - CX_MIN)) * 40;
            const p = prog(f, a, a + 16, EO);
            if (p <= 0) return null;
            return <line key={i} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} strokeDasharray={`${c.len} ${c.len}`} strokeDashoffset={c.len * (1 - p)} />;
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const Chip: React.FC<{ f: number }> = ({ f }) => {
  const sx = interpolate(f, [0, 3], [0.8, 1], { ...clamp, easing: EO });
  return (
    <div
      style={{
        position: "absolute",
        left: X0 + 4,
        top: NAME_TOP - 58,
        height: 34,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 16px 0 13px",
        border: `1px solid ${C.faint}`,
        borderRadius: 17,
        transform: `scaleX(${sx})`,
        transformOrigin: "0 50%",
        fontFamily: mono,
        fontSize: 15,
        letterSpacing: "0.22em",
        color: C.dim,
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ width: 8, height: 8, borderRadius: 4, background: C.acc, boxShadow: `0 0 10px ${C.accGlow}` }} />
      ACCESS GRANTED · VERIFIED
    </div>
  );
};

const Name: React.FC<{ f: number }> = ({ f }) => {
  const ls = track(f);
  const settled = f >= SETTLE + 4;
  const nameStyle: React.CSSProperties = {
    ...mona(118, 800),
    fontSize: FS,
    lineHeight: 1,
    letterSpacing: `${ls}em`,
    whiteSpace: "pre",
    fontKerning: "none",
  };

  // specular band: dark trough · hot core · dark trough, crossing once
  const bx = bandX(f);
  const sweepO = interpolate(f, [SW_A, SW_A + 4, SW_B - 4, SW_B], [0, 1, 1, 0], clamp);
  const BW = 900;
  const band =
    "linear-gradient(100deg, rgba(13,10,7,0) 12%, rgba(52,44,34,0.42) 30%, rgba(110,100,86,0.3) 41%, rgba(255,252,246,0.95) 47.5%, #ffffff 50%, rgba(255,252,246,0.95) 52.5%, rgba(110,100,86,0.3) 59%, rgba(52,44,34,0.42) 70%, rgba(13,10,7,0) 88%)";
  const core = "linear-gradient(100deg, rgba(255,255,255,0) 40%, rgba(255,246,232,0.9) 50%, rgba(255,255,255,0) 60%)";

  return (
    <>
      {/* mask: letters rise out of the field underline */}
      <div style={{ position: "absolute", left: X0, top: NAME_TOP, height: settled ? FS * 1.2 : MASK_H, overflow: settled ? "visible" : "hidden" }}>
        <div style={{ ...nameStyle, color: C.paper, textShadow: "0 0 40px rgba(243,236,222,0.12)" }}>
          {NAME.split("").map((ch, i) => {
            const a = 2 + i * 1.2;
            const p = prog(f, a, a + 16, Easing.bezier(0.2, 0.9, 0.25, 1));
            return (
              <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - p) * 104}%)` }}>
                {ch}
              </span>
            );
          })}
        </div>
      </div>
      {sweepO > 0 ? (
        <>
          <div
            style={{
              position: "absolute",
              left: X0,
              top: NAME_TOP,
              ...nameStyle,
              letterSpacing: `${TRACK_B}em`,
              backgroundImage: band,
              backgroundSize: `${BW}px 100%`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: `${bx - X0 - BW / 2}px 0`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              opacity: sweepO,
            }}
          >
            {NAME}
          </div>
          {/* bloom of the hot core spilling past the letter edges */}
          <div
            style={{
              position: "absolute",
              left: X0,
              top: NAME_TOP,
              ...nameStyle,
              letterSpacing: `${TRACK_B}em`,
              backgroundImage: core,
              backgroundSize: `${BW}px 100%`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: `${bx - X0 - BW / 2}px 0`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: "blur(9px)",
              mixBlendMode: "screen",
              opacity: sweepO * 0.9,
            }}
          >
            {NAME}
          </div>
        </>
      ) : null}
    </>
  );
};

/** The field underline: draws on, follows the tracking, then collapses into the full stop. */
const Underline: React.FC<{ f: number }> = ({ f }) => {
  const right = X0 + nameW(track(f)) + 0.0197 * FS + DOT_W;
  const draw = interpolate(f, [0, 14], [0.22, 1], { ...clamp, easing: EO });
  const collapse = prog(f, 20, SETTLE, Easing.bezier(0.6, 0, 0.2, 1));
  const grow = prog(f, SETTLE - 2, SETTLE + 3, Easing.bezier(0.3, 1.6, 0.5, 1));
  const left = lerp(X0, DOT_X, collapse);
  const r = lerp(X0, right, draw);
  const lineY = NAME_TOP + MASK_H + 1;
  const h = lerp(2, DOT_H, grow);
  const top = lerp(lineY, DOT_Y, grow);
  const pop = interpolate(f, [SETTLE, SETTLE + 2, SETTLE + 10], [0, 1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: Math.max(DOT_W * grow, r - left),
        height: h,
        background: C.acc,
        borderRadius: grow > 0.5 ? 3 : 0,
        boxShadow: `0 0 ${12 + pop * 26}px ${C.accGlow}`,
      }}
    />
  );
};

const Glint: React.FC<{ f: number }> = ({ f }) => {
  const s = interpolate(f, [GLINT - 3, GLINT, GLINT + 7], [0, 1, 0], { ...clamp, easing: Easing.bezier(0.3, 0, 0.3, 1) });
  if (s <= 0.001) return null;
  const cx = DOT_X + DOT_W / 2;
  const cy = DOT_Y + DOT_H / 2;
  const rot = interpolate(f, [GLINT - 3, GLINT + 7], [-8, 14], clamp);
  return (
    <div style={{ position: "absolute", left: cx, top: cy, transform: `rotate(${rot}deg) scale(${s})`, mixBlendMode: "screen" }}>
      <div style={{ position: "absolute", left: -110, top: -1.5, width: 220, height: 3, background: "radial-gradient(ellipse at center, #fffaf2 0%, rgba(255,240,220,0.5) 30%, transparent 70%)" }} />
      <div style={{ position: "absolute", left: -1.5, top: -55, width: 3, height: 110, background: "radial-gradient(ellipse at center, #fffaf2 0%, rgba(255,240,220,0.5) 30%, transparent 70%)" }} />
      <div style={{ position: "absolute", left: -26, top: -26, width: 52, height: 52, borderRadius: 26, background: "radial-gradient(circle, rgba(255,250,240,0.95) 0%, rgba(255,120,80,0.35) 35%, transparent 70%)" }} />
    </div>
  );
};

const Line: React.FC<{ f: number }> = ({ f }) => {
  const p = prog(f, LINE_IN, LINE_IN + 18, EO);
  return (
    <div style={{ position: "absolute", left: X0 + 2, top: NAME_TOP + FS + 26, height: 96, overflow: "hidden" }}>
      <div
        style={{
          fontFamily: serif,
          fontStyle: "italic",
          fontSize: 70,
          lineHeight: "92px",
          color: C.paper,
          whiteSpace: "nowrap",
          transform: `translateY(${(1 - p) * 100}%)`,
          filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined,
        }}
      >
        Let’s build something users <span style={{ color: C.acc }}>trust.</span>
      </div>
    </div>
  );
};

const Contact: React.FC<{ f: number }> = ({ f }) => {
  if (f < TYPE_A - 3) return null;
  const a = emailN(f);
  const b = linkN(f);
  const sepOn = f >= SEP_F;
  const typing = f < TYPE_END + 1;
  const caretOn = typing || f < BOOM || f % 30 < 15; // blinks on the beat once the line is complete
  return (
    <div
      style={{
        position: "absolute",
        left: X0 + 4,
        top: NAME_TOP + FS + 150,
        fontFamily: mono,
        fontSize: 26,
        letterSpacing: "0.04em",
        color: C.paper,
        whiteSpace: "pre",
        display: "flex",
        alignItems: "center",
      }}
    >
      <span>{EMAIL.slice(0, a)}</span>
      {sepOn ? <span style={{ color: C.dim }}>{"   ·   "}</span> : null}
      <span>{LINKEDIN.slice(0, b)}</span>
      <span style={{ display: "inline-block", width: 14, height: 30, marginLeft: 4, background: C.acc, opacity: caretOn ? 1 : 0 }} />
    </div>
  );
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const push = interpolate(f, [0, DUR], [1.0, 1.045], clamp);
  const fade = interpolate(f, [FADE_A, FADE_B], [0, 1], { ...clamp, easing: EIO });
  const tail = interpolate(f, [BOOM, BOOM + 4, BOOM + 26], [0, 1, 0], { ...clamp, easing: EO });
  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${push + tail * 0.006})`, transformOrigin: "7.8% 56%" }}>
        <FaceField f={f} />
        <Chip f={f} />
        <Name f={f} />
        <Underline f={f} />
        <Glint f={f} />
        <Line f={f} />
        <Contact f={f} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
    </AbsoluteFill>
  );
};

// ---------- sound ----------
const typeCues = (text: string, start: number, base: number): Cue[] =>
  text
    .split("")
    .map((_, i) => ({ f: charFrame(start, i), i }))
    .filter(({ i }) => i % 2 === 0)
    .map(({ f, i }) => ({ f, sfx: keySfx(base + i / 2), vol: 0.13 + ((i * 7) % 5) * 0.012 }));

export const cues: Cue[] = [
  { f: 0, sfx: "whoosh-long", vol: 0.42 },
  { f: 1, sfx: "snap", vol: 0.18 },
  { f: SETTLE, sfx: "click", vol: 0.28 },
  { f: GLINT - 24, sfx: "shimmer", vol: 0.38 },
  { f: LINE_IN, sfx: "swish", vol: 0.28 },
  ...typeCues(EMAIL, TYPE_A, 0),
  { f: SEP_F, sfx: "click-lo", vol: 0.16 },
  ...typeCues(LINKEDIN, TYPE_B, 3),
  { f: BOOM, sfx: "boom", vol: 0.5 },
];

