import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, mona, mono } from "../lib/theme";
import { clamp, EI, EO, prog, rand } from "../lib/anim";
import { Glow } from "../lib/FX";
import type { Cue, Sfx } from "../lib/cues";
import { keySfx } from "../lib/cues";

/**
 * 00 · REQUEST (120 f) — cold open. A left-hung terminal column, the right of frame left empty.
 * f0–29   black; the request clock idles 000→012 while a block caret blinks twice on the beat.
 * f30/45/60/75  one real handshake step per beat, machine-typed; older lines recede (dim, blur, scale).
 * f80–89  silence, only the caret blinks after "subject = ?".
 * f90     the stack lifts, "IDENTITY:" prints and UNVERIFIED drops in huge (vermilion): letters print wide
 *         and light, then clamp narrow-heavy on the second deny beep (f94) with a wrong-password shake.
 *         One blink on the 8th (f98–104), then it stays lit into the push.
 * f106–117 speed-ramped push into the word, then the cut.
 */

type Kind = "kw" | "tx" | "dm" | "q";
type Seg = { t: string; k: Kind };
type Line = { at: number; cps: number; ts: string; segs: Seg[] };

const LINES: Line[] = [
  {
    at: 30,
    cps: 4,
    ts: "[00:00.012]",
    segs: [
      { t: "GET", k: "kw" },
      { t: " /authorize", k: "tx" },
      { t: "?client_id=", k: "dm" },
      { t: "portfolio", k: "kw" },
      { t: "&scope=", k: "dm" },
      { t: "openid profile", k: "kw" },
    ],
  },
  {
    at: 45,
    cps: 4,
    ts: "[00:00.031]",
    segs: [
      { t: "302", k: "kw" },
      { t: " → ", k: "dm" },
      { t: "idp/saml/sso", k: "tx" },
      { t: "   ", k: "tx" },
      { t: "AuthnRequest", k: "kw" },
      { t: "  ID=", k: "dm" },
      { t: "_8f3a…c21", k: "tx" },
    ],
  },
  {
    at: 60,
    cps: 4,
    ts: "[00:00.048]",
    segs: [
      { t: "WebAuthn challenge", k: "kw" },
      { t: " · ", k: "dm" },
      { t: "32 bytes", k: "tx" },
      { t: " · ", k: "dm" },
      { t: "9f1c…e07a", k: "tx" },
    ],
  },
  {
    at: 75,
    cps: 2,
    ts: "[00:00.061]",
    segs: [
      { t: "subject", k: "kw" },
      { t: " = ", k: "dm" },
      { t: "?", k: "q" },
    ],
  },
];

const lineLen = (l: Line) => l.segs.reduce((s, g) => s + g.t.length, 0);
const typed = (l: Line, f: number) => Math.max(0, Math.min(lineLen(l), Math.floor((f - l.at + 1) * l.cps)));
const doneAt = (l: Line) => l.at + Math.ceil(lineLen(l) / l.cps) - 1;

const HIT = 90; // the answer lands (beat 7)
const DENY2 = 94; // second deny beep, the word clamps

// Layout (pre-camera). Mono 26 px → 15.6 px per char.
const FS = 26;
const LH = FS * 1.3;
const CH = FS * 0.6;
const X0 = 200; // timestamp column
const X1 = X0 + 14 * CH; // content column (≈418)
const Y_ACTIVE = 560; // top of the line being typed
const GAP = 50;
const LIFT = 96; // the stack lifts this much when the answer lands
const LIFT_LEN = 6; // …snapping up in 6 frames
const BIG = 200; // UNVERIFIED size
const BIG_BASE = 742; // UNVERIFIED baseline
const ID_TOP = Y_ACTIVE - LIFT + GAP; // "IDENTITY:" line (slot under "subject = ?")

const tone: Record<Kind, React.CSSProperties> = {
  kw: { color: C.paper },
  tx: { color: "rgba(243,236,222,0.72)" },
  dm: { color: "rgba(243,236,222,0.38)" },
  q: { color: C.paper },
};

/** Block caret; `base` stands it on the baseline at cap height instead of centring it in the line box. */
const Caret: React.FC<{ on: boolean; color?: string; h?: number; w?: number; base?: boolean; gap?: number }> = ({
  on,
  color = C.paper,
  h = FS * 1.08,
  w = CH,
  base = false,
  gap = 2,
}) => (
  <span
    style={{
      display: "inline-block",
      width: w,
      height: h,
      marginLeft: gap,
      verticalAlign: base ? "baseline" : "top",
      marginTop: base ? 0 : (LH - h) / 2,
      background: color,
      opacity: on ? 1 : 0,
    }}
  />
);

const LogLine: React.FC<{ l: Line; f: number; idx: number }> = ({ l, f, idx }) => {
  if (f < l.at) return null;
  // depth = how many lines arrived after this one (smoothed) + the answer
  let lift = 0;
  let age = 0;
  for (let j = idx + 1; j < LINES.length; j++) {
    const p = prog(f, LINES[j].at, LINES[j].at + 9, EO);
    lift += GAP * p;
    age += p;
  }
  const bigP = prog(f, HIT, HIT + LIFT_LEN, EO);
  lift += LIFT * bigP;
  age += bigP * 1.3;
  const n = typed(l, f);
  const op = interpolate(age, [0, 1, 2, 3, 4.5], [1, 0.5, 0.29, 0.18, 0.1], clamp);
  const blur = interpolate(age, [0, 1, 4.5], [0, 0.35, 2.2], clamp);
  const depth = 1 - 0.022 * age;
  const isLast = idx === LINES.length - 1;
  const typing = n < lineLen(l);
  const active = f < (LINES[idx + 1]?.at ?? HIT);
  const caretOn = typing || (active && (f - l.at) % 15 < 8);
  const alert = isLast && f >= HIT;

  let left = n;
  const segs = l.segs.map((s, i) => {
    const vis = s.t.slice(0, Math.max(0, left));
    left -= s.t.length;
    if (!vis) return null;
    const st = s.k === "q" && alert ? { color: C.acc } : tone[s.k];
    return (
      <span key={i} style={st}>
        {vis}
      </span>
    );
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: Y_ACTIVE - lift,
        width: 1920,
        height: LH,
        fontFamily: mono,
        fontSize: FS,
        lineHeight: `${LH}px`,
        whiteSpace: "pre",
        opacity: op,
        filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
        transform: `scale(${depth})`,
        transformOrigin: `${X1}px 50%`, // the reading edge stays aligned; stamps drift inward with depth
      }}
    >
      <span style={{ position: "absolute", left: X0, color: active ? "rgba(243,236,222,0.5)" : "rgba(243,236,222,0.34)" }}>{l.ts}</span>
      <span style={{ position: "absolute", left: X1 }}>
        {segs}
        {active ? <Caret on={caretOn} /> : null}
      </span>
    </div>
  );
};

const WORD = "UNVERIFIED";

const Answer: React.FC<{ f: number }> = ({ f }) => {
  if (f < HIT) return null;
  const t = f - HIT;
  const clampP = prog(f, DENY2, DENY2 + 7, EO);
  const shake = f >= DENY2 ? Math.sin((f - DENY2) * 2.1) * 24 * Math.exp(-(f - DENY2) / 3.2) : 0;
  // one blink on the 8th after the clamp, then it stays lit into the push-in (caret keeps blinking)
  const low = f >= 98 && f < 105;
  const pulse = low ? 0.34 : 1;
  const lift = LIFT * prog(f, HIT, HIT + LIFT_LEN, EO);
  const track = interpolate(clampP, [0, 1], [0.05, -0.012]);
  const kick = prog(f, HIT, HIT + 6, EO);
  const idN = Math.max(0, Math.min(9, Math.floor(t * 4.5))); // prints from f91, once the stack has cleared
  return (
    <>
      <Glow x={X1 + 560} y={BIG_BASE - 80} r={600} opacity={(0.14 + 0.24 * (low ? 0.25 : 1)) * kick} />
      {/* the system prints the field name in the next log slot */}
      <div
        style={{
          position: "absolute",
          left: X1,
          top: ID_TOP + LIFT - lift,
          height: LH,
          lineHeight: `${LH}px`,
          fontFamily: mono,
          fontSize: FS,
          whiteSpace: "pre",
          color: C.acc,
          opacity: low ? 0.6 : 1,
        }}
      >
        {"IDENTITY:".slice(0, idN)}
      </div>
      <div
        style={{
          position: "absolute",
          left: X1 - 12 + shake,
          top: BIG_BASE - 0.885 * BIG,
          height: BIG,
          fontSize: BIG,
          lineHeight: `${BIG}px`,
          whiteSpace: "nowrap",
          letterSpacing: `${track}em`,
          color: C.acc,
          opacity: pulse,
          textShadow: low ? undefined : "0 0 36px rgba(255,59,31,0.38)",
        }}
      >
        {WORD.split("").map((ch, i) => {
          const at = i / 2.5;
          if (t < at) return null;
          const p = interpolate(t - at, [0, 4], [0, 1], { ...clamp, easing: EO });
          const wdth = interpolate(clampP, [0, 1], [interpolate(p, [0, 1], [125, 112]), 98]);
          const wght = interpolate(clampP, [0, 1], [interpolate(p, [0, 1], [240, 520]), 800]);
          const fresh = t - at < 2;
          return (
            <span key={i} style={{ ...mona(wdth, wght), color: fresh ? "#ffd9cf" : C.acc }}>
              {ch}
            </span>
          );
        })}
        <Caret on={f < 98 || (f >= 105 && f < 112)} color={C.acc} h={BIG * 0.729} w={BIG * 0.3} base gap={BIG * 0.06} />
      </div>
    </>
  );
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();

  const push = interpolate(f, [0, 106], [1, 1.055], { ...clamp, easing: Easing.bezier(0.33, 0, 0.2, 1) });
  const ramp = interpolate(f, [106, 117], [0, 1], { ...clamp, easing: EI });
  const scale = push * (1 + 0.45 * ramp);
  const exitBlur = ramp * 10;

  const introCaret = f % 15 < 8;

  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      <Glow x={760} y={560} r={760} color="rgba(243,236,222,0.045)" />
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          transformOrigin: `${X1 + 520}px ${BIG_BASE - 70}px`,
          filter: exitBlur > 0.2 ? `blur(${exitBlur.toFixed(1)}px)` : undefined,
          opacity: 1 - ramp * 0.6,
        }}
      >
        {f < 30 ? (
          <div style={{ position: "absolute", left: 0, top: Y_ACTIVE, height: LH, lineHeight: `${LH}px`, fontFamily: mono, fontSize: FS, whiteSpace: "pre" }}>
            {/* the request clock idles up to the first stamp, which the GET line then inherits */}
            <span style={{ position: "absolute", left: X0, color: "rgba(243,236,222,0.42)", opacity: prog(f, 0, 6, EO) }}>
              [00:00.{String(Math.floor(interpolate(f, [0, 29], [0, 12], clamp))).padStart(3, "0")}]
            </span>
            <span style={{ position: "absolute", left: X1 }}>
              <Caret on={introCaret} />
            </span>
          </div>
        ) : null}
        {LINES.map((l, i) => (
          <LogLine key={i} l={l} f={f} idx={i} />
        ))}
        <Answer f={f} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- sound
// One key per 2 typed chars, a blip as each protocol step arrives, silence 80–89, deny double-beep.
const typingCues: Cue[] = LINES.flatMap((l, li) => {
  const out: Cue[] = [{ f: l.at, sfx: (li % 2 ? "blip-hi" : "blip") as Sfx, vol: 0.24 }];
  const end = doneAt(l);
  for (let fr = l.at + 1, k = 0; fr <= end; fr += 2, k++) {
    out.push({ f: fr, sfx: keySfx(li * 3 + k), vol: 0.12 + rand(fr) * 0.05 });
  }
  return out;
});

export const cues: Cue[] = [
  { f: 0, sfx: "click-lo", vol: 0.16 },
  { f: 15, sfx: "click-lo", vol: 0.13 },
  ...typingCues,
  { f: 31, sfx: "chatter", vol: 0.24 },
  { f: HIT, sfx: "blip-down", vol: 0.42 },
  { f: HIT, sfx: "click", vol: 0.24 },
  { f: DENY2, sfx: "blip-down", vol: 0.42 },
  { f: 107, sfx: "whoosh-rev", vol: 0.4 },
];
