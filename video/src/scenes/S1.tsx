import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, mona, mono, sans, serif } from "../lib/theme";
import { clamp, EI, EIO, EO, lerp, prog, rand } from "../lib/anim";
import { Glow } from "../lib/FX";
import type { Cue } from "../lib/cues";
import { keySfx } from "../lib/cues";

/**
 * 01 · HOOK (120 f) — the password field decodes the thesis.
 * Composition hangs off one left edge (x 170): field, then a huge two-line headline, right of frame left open.
 * f0      field takes focus (ring contracts), caret blinks.
 * f4–43   22 masked dots on 32nd notes (a key on every 16th).
 * f45     eye toggles (beat): slash retracts, pupil turns vermilion = revealed.
 * f46–60  dots flip to vermilion symbols, then lock L→R; each lock pulls its slot tight (tracking compresses).
 *         Last letter locks on f60 (downbeat).
 * f60–75  the input folds shut; letters reflow out of it into EVERY LOGIN / IS A DOOR. at 200 px,
 *         weight 600 → 820 on the way (EIO, line by line, lands on beat f75).
 * f75–89  "Someone has to design it." rises from a baseline mask, hung off the D of DOOR.
 * f90     "design" turns vermilion (beat). Hold.
 * f104–117 everything exits up through its line masks; whoosh.
 */

const TEXT = "EVERY LOGIN IS A DOOR.";
const N = TEXT.length; // 22
// Mona Sans @ wdth 112 / wght 820: advance widths + GPOS kerning (units / 1000 em), measured from the font file.
const ADV = [672, 818, 672, 764, 780, 207, 593, 833, 844, 309, 828, 207, 309, 704, 207, 807, 207, 783, 833, 833, 764, 236];
const KERN = [11, 0, 0, -21, 0, 0, -18, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 28, 0, 8, 0];
const TRACK = -0.012; // em
const BREAK = 11; // the space that becomes the line break
const lineOf = (i: number) => (i < BREAK ? 0 : 1);

const dotAt = (i: number) => Math.round(3.75 + i * 1.875); // 32nd notes
const EYE = 45;
const flipAt = (i: number) => 46 + i * 0.22;
const lockAt = (i: number) => 49 + (i * 11) / (N - 1); // last lock lands on f60
const DONE = 60;
// reflow: each line moves as one rigid group (no per-glyph stagger, so spacing never collides).
// Line 1 lifts off first (f60–69), then both lines grow together (f62–75) and land on the beat.
const LIFT_AT = DONE;
const GROW_AT = DONE + 2;
const FLY = 13;
const LINE2 = 75;
const ACC = 90;
const OUT = 104;

// ---- layout (pre-camera)
const XL = 170; // the one left edge everything hangs from (≥150 after the camera push)
const FX = XL;
const FW = 1210;
const FH = 148;
const FY = 540 - FH / 2;
const CW = 46; // masked slot width
const CX0 = FX + 58;
const EYE_X = FX + FW - 70;

const FS_A = 58; // headline size inside the field
const FS_B = 200; // headline size once it owns the frame
const BASE_A = 540 + (0.729 * FS_A) / 2; // in-field baseline (caps centred in the field)
const BASE_B = [396, 584]; // baselines of the two headline lines
const ASC = 0.885; // Mona Sans: baseline offset from the top of a line-height:1 box

const L2_FS = 84;
const L2_H = 116;
const L2_BASE = 712;

const POOL = "#$%&*+=/<>?!@{}[]0123456789ABCDEFXK";
const isSym = (c: string) => !/[A-Z]/.test(c);

const advB = (i: number) => ((ADV[i] + KERN[i]) / 1000 + TRACK) * FS_B;
const advA = (i: number) => ((ADV[i] + KERN[i]) / 1000 + TRACK) * FS_A;
// final x of every glyph origin (two flush-left lines)
const XB: number[] = (() => {
  const out: number[] = [];
  let x = XL;
  for (let i = 0; i < N; i++) {
    if (i === BREAK + 1) x = XL;
    out.push(x);
    if (i !== BREAK) x += advB(i);
  }
  return out;
})();

const Eye: React.FC<{ f: number }> = ({ f }) => {
  const t = prog(f, EYE, EYE + 7, EO);
  const pop = f >= EYE ? 1 + 0.5 * Math.exp(-(f - EYE) / 2.5) : 1;
  const len = 66; // > the slash length (62.2) so nothing is left once it retracts
  return (
    <svg width={72} height={72} viewBox="0 0 72 72" style={{ position: "absolute", left: EYE_X - 36, top: 540 - 36, overflow: "visible" }}>
      <path
        d="M6 36 C 18 17, 54 17, 66 36 C 54 55, 18 55, 6 36 Z"
        fill="none"
        stroke="rgba(243,236,222,0.72)"
        strokeWidth={1.5}
        transform={`translate(36 36) scale(1 ${lerp(0.82, 1, t)}) translate(-36 -36)`}
      />
      <circle cx={36} cy={36} r={8 * pop} fill={f >= EYE ? C.acc : "rgba(243,236,222,0.75)"} />
      {t < 0.98 ? (
        <>
          <line x1={17} y1={60} x2={60} y2={17} stroke={C.ink} strokeWidth={3.5} strokeDasharray={len} strokeDashoffset={len * t} />
          <line x1={14} y1={58} x2={58} y2={14} stroke="rgba(243,236,222,0.85)" strokeWidth={1.5} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * t} />
        </>
      ) : null}
    </svg>
  );
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const push = interpolate(f, [0, 118], [1, 1.05], { ...clamp, easing: Easing.bezier(0.33, 0, 0.2, 1) });

  // ---- field
  const focus = prog(f, 0, 12, EO);
  const chromeOut = prog(f, DONE - 6, DONE + 2, EI);
  const fold = prog(f, DONE, DONE + 10, EIO);
  const typedN = Array.from({ length: N }, (_, i) => i).filter((i) => f >= dotAt(i)).length;
  const typing = f >= dotAt(0) && f <= dotAt(N - 1) + 1;
  const caretOn = f < EYE && (typing || f % 15 < 8);

  // ---- in-field slots (left-aligned like a real input; locking pulls each slot to its glyph width)
  const lockP = (i: number) => prog(f, lockAt(i), lockAt(i) + 5, EO);
  const slotW = Array.from({ length: N }, (_, i) => lerp(CW, advA(i), lockP(i)));
  const slotX: number[] = [];
  slotW.reduce((x, w, i) => {
    slotX[i] = x;
    return x + w;
  }, CX0);

  const wrapTop = (ln: number) => BASE_B[ln] - 168;
  const lines: React.ReactNode[][] = [[], []];

  TEXT.split("").forEach((ch, i) => {
    if (f < dotAt(i)) return;
    const ln = lineOf(i);
    const x = slotX[i];
    const w = slotW[i];
    // 1) masked dot (snaps in)
    if (f < flipAt(i)) {
      const sp = spring({ frame: f - dotAt(i), fps, config: { stiffness: 420, damping: 16, mass: 0.6 } });
      lines[ln].push(
        <div
          key={i}
          style={{
            position: "absolute",
            left: x + w / 2 - 8,
            top: 540 - 8 - wrapTop(ln),
            width: 16,
            height: 16,
            borderRadius: 8,
            background: C.paper,
            transform: `scale(${sp})`,
          }}
        />,
      );
      return;
    }
    // 2) unresolved symbol
    if (f < lockAt(i)) {
      const g = POOL[Math.floor(rand(i * 7.1 + Math.floor(f / 2) * 3.3) * POOL.length)];
      const sym = isSym(g);
      lines[ln].push(
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            width: w,
            top: 540 - 30 - wrapTop(ln),
            height: 60,
            lineHeight: "60px",
            textAlign: "center",
            fontFamily: mono,
            fontWeight: 500,
            fontSize: 44,
            color: sym ? C.acc : "rgba(243,236,222,0.5)",
            transform: `scaleY(${prog(f, flipAt(i), flipAt(i) + 2, EO)})`,
          }}
        >
          {g}
        </div>,
      );
      return;
    }
    if (ch === " ") return;
    // 3) locked glyph: sits centred in its slot inside the field, then reflows to its line
    const fp = prog(f, GROW_AT, GROW_AT + FLY, EIO);
    const s = lerp(FS_A, FS_B, fp);
    const gx = lerp(x + (w - advA(i)) / 2, XB[i], fp);
    // line 1 lifts out of the field before it grows, so it never rides over line 2
    const base = lerp(BASE_A, BASE_B[ln], ln === 0 ? prog(f, LIFT_AT, LIFT_AT + 9, EIO) : fp);
    const fresh = f - lockAt(i) < 2;
    const out = prog(f, OUT + (i - (ln ? BREAK + 1 : 0)) * 0.35, OUT + (i - (ln ? BREAK + 1 : 0)) * 0.35 + 8, EI);
    lines[ln].push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: gx,
          top: base - ASC * s - wrapTop(ln),
          fontSize: s,
          lineHeight: `${s}px`,
          ...mona(lerp(104, 112, fp), lerp(600, 820, fp)),
          color: fresh ? "#fffaf2" : C.paper,
          textShadow: fresh ? "0 0 22px rgba(255,236,210,0.75)" : undefined,
          transform: `translateY(${-out * 125}%)`,
          whiteSpace: "pre",
        }}
      >
        {ch}
      </div>,
    );
  });

  // ---- line 2 (the one human phrase)
  const WORDS: { t: string; acc?: boolean }[] = [{ t: "Someone" }, { t: "has" }, { t: "to" }, { t: "design", acc: true }, { t: "it." }];
  const l2Top = L2_BASE - (L2_H - 1.3 * L2_FS) / 2 - 0.99 * L2_FS;

  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      <Glow x={700} y={500} r={900} color="rgba(243,236,222,0.045)" />
      {/* alert light while the field shows unresolved symbols */}
      <Glow x={700} y={540} r={520} opacity={0.24 * prog(f, EYE, EYE + 6, EO) * (1 - prog(f, DONE - 2, DONE + 10, EO))} />
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "760px 500px" }}>
        {/* ------------------------------------------------ field */}
        <div
          style={{
            position: "absolute",
            left: FX - 10 + 6 * focus,
            top: FY - 10 + 6 * focus,
            width: FW + 20 - 12 * focus,
            height: FH + 20 - 12 * focus,
            borderRadius: 34 - 4 * focus,
            border: "1px solid rgba(243,236,222,0.3)",
            opacity: (1 - 0.45 * focus) * (1 - chromeOut),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: FX,
            top: lerp(FY, 540, fold),
            width: FW,
            height: FH * (1 - fold),
            borderRadius: lerp(28, 1, fold),
            border: "1.5px solid rgba(243,236,222,0.55)",
            background: "rgba(243,236,222,0.03)",
            opacity: 1 - prog(fold, 0.5, 1, EO),
          }}
        />
        <div style={{ position: "absolute", left: FX + 6, top: FY - 50, fontFamily: sans, fontWeight: 500, fontSize: 26, color: "rgba(243,236,222,0.7)", opacity: 1 - chromeOut }}>
          Password
        </div>
        <div style={{ opacity: 1 - chromeOut }}>
          <Eye f={f} />
        </div>
        {caretOn ? <div style={{ position: "absolute", left: CX0 + typedN * CW + 8, top: 540 - 30, width: 3, height: 60, background: C.paper, borderRadius: 1 }} /> : null}

        {/* ------------------------------------------------ headline, one mask per line for the exit */}
        {lines.map((nodes, ln) => (
          <div key={ln} style={{ position: "absolute", left: 0, top: wrapTop(ln), width: 1920, height: 186, overflow: f >= OUT ? "hidden" : "visible" }}>
            {nodes}
          </div>
        ))}

        {/* ------------------------------------------------ line 2 */}
        {f >= LINE2 ? (
          <div
            style={{
              position: "absolute",
              left: XB[17] + 4,
              top: l2Top,
              height: L2_H,
              overflow: "hidden",
              display: "flex",
              gap: 20,
              fontFamily: serif,
              fontStyle: "italic",
              fontSize: L2_FS,
              lineHeight: `${L2_H}px`,
              color: C.paper,
              whiteSpace: "nowrap",
            }}
          >
            {WORDS.map((w, k) => {
              const p = prog(f, LINE2 + k * 2.5, LINE2 + k * 2.5 + 14, EO);
              const ep = prog(f, OUT + k, OUT + k + 9, EI);
              const lit = w.acc && f >= ACC;
              return (
                <span
                  key={k}
                  style={{
                    display: "inline-block",
                    color: lit ? C.acc : C.paper,
                    textShadow: lit ? `0 0 ${(26 * Math.exp(-(f - ACC) / 6) + 10).toFixed(1)}px rgba(255,59,31,0.5)` : undefined,
                    transform: `translateY(${(1 - p) * 105 - ep * 110}%) rotate(${w.acc ? lerp(-4, 0, p) : 0}deg)`,
                    filter: p < 0.99 ? `blur(${((1 - Math.min(1, p * 1.5)) * 6).toFixed(2)}px)` : undefined,
                  }}
                >
                  {w.t}
                </span>
              );
            })}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- sound
export const cues: Cue[] = [
  { f: 0, sfx: "click-lo", vol: 0.2 }, // focus
  // a key on every 2nd masked dot → 16th notes
  ...Array.from({ length: N }, (_, i) => i)
    .filter((i) => i % 2 === 0)
    .map((i, k) => ({ f: dotAt(i), sfx: keySfx(k * 5 + 1), vol: 0.14 + rand(i * 3.3) * 0.06 }) as Cue),
  { f: EYE, sfx: "click", vol: 0.32 },
  { f: EYE + 1, sfx: "chatter", vol: 0.28 },
  // lock ticks, thinned to every other frame of the decode
  ...[50, 52, 54, 56, 58].map((fr, k) => ({ f: fr, sfx: keySfx(k + 2), vol: 0.13 }) as Cue),
  { f: DONE, sfx: "snap", vol: 0.3 },
  { f: DONE, sfx: "impact-soft", vol: 0.5 },
  { f: DONE + 3, sfx: "swish", vol: 0.34 }, // peaks at the reflow's fastest frame
  { f: ACC, sfx: "blip-up", vol: 0.24 }, // "design" turns vermilion
  { f: OUT - 1, sfx: "whoosh", vol: 0.4 },
];
