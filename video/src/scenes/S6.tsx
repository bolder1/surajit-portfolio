import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { noise2D } from "@remotion/noise";
import { C, mona, mono, sans, serif } from "../lib/theme";
import { clamp, EI, EO, lerp, rand } from "../lib/anim";
import { Glitch, Glow } from "../lib/FX";
import type { Cue, Sfx } from "../lib/cues";

/**
 * 06 · THESIS (120 f) — breakdown.
 * f0–56   "Security is complex." The frame floods on 8ths/16ths: error toasts, warning chips, raw
 *         SAML / JWT / policy / HTTP fragments and tangled connectors. "complex." fights itself: every
 *         letter jumps to a different width/weight. Jitter escalates; two short stutters (f45, f50).
 * f57–59  freeze (near-silence).
 * f60     downbeat SNAP: every fragment FLIPs into a 12-column layout grid (staggered left→right),
 *         duplicates merge into their original, alerts go quiet, connectors straighten into the
 *         grid's column guides. The headline calms to one weight and steps up.
 * f68/75  "Using it shouldn't be." rises (serif italic), "shouldn't be." in vermilion on the beat.
 * f80–112 riser; camera push accelerates, the system recedes. f112–120 only the words, in silence.
 */

const SNAP = 60;
const FREEZE = 57;

/* ---------- 12-column layout grid inside the safe area ---------- */
const GX = 140;
const GW = 1640;
const GUT = 24;
const COLW = (GW - GUT * 11) / 12;
const colX = (c: number) => GX + c * (COLW + GUT);
const spanW = (n: number) => n * COLW + (n - 1) * GUT;
const GUIDE_X = [GX, ...Array.from({ length: 11 }, (_, k) => colX(k + 1) - GUT / 2), GX + GW];
const BANDS = [
  { y0: 178, y1: 314 },
  { y0: 778, y1: 904 },
];

/* ---------- fragments ---------- */
type Tok = { t: string; hi?: 1 | 2 }; // hi 1 = cream 100 %, 2 = alert (vermilion until resolved)
type Kind = "toast" | "chip" | "code";
type Frag = {
  kind: Kind;
  at: number;
  cx: number;
  cy: number;
  rot: number;
  sc: number;
  col: number;
  span: number;
  y: number;
  h: number;
  title?: string;
  detail?: string;
  lines?: Tok[][];
  alert?: boolean;
  ghost?: boolean;
};

const toast = (at: number, cx: number, cy: number, rot: number, sc: number, col: number, title: string, detail: string, ghost = false): Frag => ({
  kind: "toast", at, cx, cy, rot, sc, col, span: 3, y: 194, h: 58, title, detail, alert: true, ghost,
});
const chip = (at: number, cx: number, cy: number, rot: number, sc: number, col: number, title: string, alert = false): Frag => ({
  kind: "chip", at, cx, cy, rot, sc, col, span: 2, y: 270, h: 36, title, alert,
});
const code = (at: number, cx: number, cy: number, rot: number, sc: number, col: number, lines: Tok[][]): Frag => ({
  kind: "code", at, cx, cy, rot, sc, col, span: 3, y: 792, h: 98, lines,
});

const T = (t: string, hi?: 1 | 2): Tok => ({ t, hi });

const FRAGS: Frag[] = [
  toast(4, 560, 318, -3.5, 1.12, 0, "MFA FAILED", "ATTEMPT 3 OF 3"),
  code(8, 430, 792, 1.5, 1.06, 0, [
    [T("<saml:Assertion ", 1), T('ID="_8f3a…c21">')],
    [T("  <ds:SignatureValue>"), T("MIIC9z…", 2)],
    [T("  <saml:Conditions NotOnOrAfter=")],
  ]),
  toast(15, 1420, 300, 2.5, 1.18, 3, "403 FORBIDDEN", "GET /admin/users"),
  chip(15, 1010, 226, -2, 1.12, 0, "CLOCK SKEW 312s"),
  code(19, 1540, 772, -3, 1.0, 3, [
    [T('{"alg":"RS256","kid":"k1"}', 1)],
    [T('{"sub":'), T("null", 2), T(',"exp":1718049600}')],
    [T('{"aud":"portfolio","nbf":0}')],
  ]),
  chip(22, 262, 612, 4, 1.04, 2, "BAD SIGNATURE", true),
  chip(26, 1690, 424, -3, 1.08, 4, "SESSION TIMEOUT"),
  toast(30, 1190, 724, -2, 1.08, 6, "TOKEN EXPIRED", "exp < now"),
  code(31, 300, 404, -4, 0.98, 6, [
    [T('{"Effect":', 1), T('"Deny"', 2), T(",")],
    [T(' "Action":"*",')],
    [T(' "Resource":"admin/*"}')],
  ]),
  chip(34, 870, 846, 3, 1.1, 6, "UNKNOWN DEVICE", true),
  chip(37, 700, 418, -5, 1.05, 8, "CERT EXPIRED"),
  code(41, 1590, 590, 5, 0.92, 9, [
    [T("HTTP/1.1 ", 1), T("401 Unauthorized", 2)],
    [T("WWW-Authenticate: Bearer")],
    [T("  error="), T('"invalid_token"', 2)],
  ]),
  toast(45, 730, 692, 4, 1.2, 9, "POLICY CONFLICT", "ALLOW · DENY"),
  // alarm fatigue: the same errors fire again (they merge back into one on the snap)
  toast(48, 600, 346, 1, 1.12, 0, "MFA FAILED", "ATTEMPT 3 OF 3", true),
  chip(49, 1290, 418, -6, 1.15, 10, "RETRY LIMIT", true),
  toast(51, 1384, 338, 6, 1.18, 3, "403 FORBIDDEN", "GET /admin/users", true),
  toast(54, 770, 728, -2, 1.2, 9, "POLICY CONFLICT", "ALLOW · DENY", true),
  toast(56, 1222, 756, 3, 1.08, 6, "TOKEN EXPIRED", "exp < now", true),
];

/** Snap order: a left→right sweep, top row first. */
const fragDelay = (fr: Frag) => {
  const row = fr.kind === "toast" ? 0 : fr.kind === "chip" ? 1 : 2;
  return Math.round(((colX(fr.col) - GX) / GW) * 7 + row * 1.5) + (fr.ghost ? 1 : 0);
};

/* ---------- tangled connectors → column guides ---------- */
type Pt = { x: number; y: number };
type Wire = { at: number; c: Pt[]; g: Pt[]; o: number; delay: number };
const WIRES: Wire[] = GUIDE_X.flatMap((gx, k) =>
  BANDS.map((b, bi) => {
    const i = k * 2 + bi;
    const r = (n: number) => rand(i * 17.3 + n * 5.1);
    const p0 = { x: 60 + r(1) * 1800, y: 160 + r(2) * 760 };
    const p3 = { x: 60 + r(3) * 1800, y: 160 + r(4) * 760 };
    const p1 = { x: p0.x + (r(5) - 0.5) * 1400, y: p0.y + (r(6) - 0.5) * 900 };
    const p2 = { x: p3.x + (r(7) - 0.5) * 1400, y: p3.y + (r(8) - 0.5) * 900 };
    const g0 = { x: gx, y: b.y0 };
    const g3 = { x: gx, y: b.y1 };
    const at = i % 3 === 0 ? 0 : i % 3 === 1 ? 22 : 45;
    const o = r(9) < 0.2 ? 0.7 : r(9) < 0.6 ? 0.45 : 0.22;
    return {
      at: at + Math.floor(r(10) * 6),
      c: [p0, p1, p2, p3],
      g: [g0, { x: gx, y: lerp(b.y0, b.y1, 1 / 3) }, { x: gx, y: lerp(b.y0, b.y1, 2 / 3) }, g3],
      o,
      delay: Math.round(((gx - GX) / GW) * 7) + bi,
    };
  }),
);

/* ---------- chaos helpers ---------- */
const amp = (fc: number) => interpolate(fc, [0, 20, 45, 56], [0.25, 0.45, 0.8, 1], clamp);
const jitter = (i: number, fc: number, a: number) => {
  const st = Math.floor(fc / 2);
  const big = rand(i * 3.3 + st * 1.9) > 0.93 ? 4 : 1;
  return {
    x: (rand(i * 13.1 + st * 7.7) - 0.5) * 2 * 9 * a * big,
    y: (rand(i * 5.9 + st * 3.1) - 0.5) * 2 * 7 * a * big,
  };
};
const snapP = (f: number, delay: number, fps: number) =>
  f < SNAP + delay ? 0 : spring({ frame: f - SNAP - delay, fps, config: { stiffness: 420, damping: 30, mass: 0.7 } });

/* ---------- fragment visuals ---------- */
const Dot: React.FC<{ hot: boolean; size?: number }> = ({ hot, size = 10 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      flexShrink: 0,
      background: hot ? C.acc : "transparent",
      border: hot ? "none" : `1.5px solid ${C.dim}`,
      boxSizing: "border-box",
      boxShadow: hot ? `0 0 12px ${C.accGlow}` : "none",
    }}
  />
);

const FragBody: React.FC<{ fr: Frag; hot: boolean }> = ({ fr, hot }) => {
  const w = spanW(fr.span);
  if (fr.kind === "toast") {
    return (
      <div
        style={{
          width: w,
          height: fr.h,
          borderRadius: 12,
          background: C.ink2,
          border: `1px solid ${hot ? "rgba(243,236,222,0.28)" : "rgba(243,236,222,0.2)"}`,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 20px",
          boxSizing: "border-box",
        }}
      >
        <Dot hot={hot} />
        <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 21, letterSpacing: "0.03em", color: C.paper, whiteSpace: "nowrap" }}>{fr.title}</div>
        <div style={{ marginLeft: "auto", fontFamily: mono, fontSize: 14, letterSpacing: "0.08em", color: C.dim, whiteSpace: "nowrap" }}>{fr.detail}</div>
      </div>
    );
  }
  if (fr.kind === "chip") {
    return (
      <div
        style={{
          width: w,
          height: fr.h,
          borderRadius: fr.h / 2,
          border: `1px solid ${C.dim}`,
          background: C.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          boxSizing: "border-box",
          fontFamily: mono,
          fontSize: 15,
          letterSpacing: "0.14em",
          color: "rgba(243,236,222,0.82)",
          whiteSpace: "nowrap",
        }}
      >
        {fr.alert ? <Dot hot={hot} size={7} /> : null}
        {fr.title}
      </div>
    );
  }
  return (
    <div
      style={{
        width: w,
        height: fr.h,
        border: "1px solid rgba(243,236,222,0.16)",
        background: "rgba(13,10,7,0.9)",
        padding: "12px 16px",
        boxSizing: "border-box",
        fontFamily: mono,
        fontSize: 15,
        lineHeight: 1.6,
        color: C.dim,
        whiteSpace: "pre",
        overflow: "hidden",
      }}
    >
      {fr.lines!.map((ln, li) => (
        <div key={li}>
          {ln.map((tk, ti) => (
            <span key={ti} style={{ color: tk.hi === 2 ? (hot ? C.acc : C.paper) : tk.hi === 1 ? C.paper : undefined }}>
              {tk.t}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

/* ---------- headline ---------- */
const LINE = "Security is complex.";
const COMPLEX_FROM = 12;

const Headline: React.FC<{ f: number; fc: number; pT: number }> = ({ f, fc, pT }) => {
  const ampC = interpolate(fc, [8, 30, 56], [0.55, 0.75, 1], clamp) * (1 - pT);
  const ampS = interpolate(fc, [30, 56], [0, 0.45], clamp) * (1 - pT);
  const st = Math.floor(fc / 3);
  const rise = interpolate(f, [0, 9], [1.1, 0], { ...clamp, easing: EO });
  const calmW = lerp(720, 430, pT);
  return (
    <div style={{ display: "flex", alignItems: "baseline", fontSize: 150, lineHeight: 1, color: C.paper, whiteSpace: "pre" }}>
      {LINE.split("").map((ch, i) => {
        const isC = i >= COMPLEX_FROM;
        const a = isC ? ampC : ampS;
        const wd = Math.min(125, Math.max(75, 100 + (rand(i * 9.1 + st * 3.7) - 0.5) * 2 * 60 * a));
        const wg = Math.min(900, Math.max(200, calmW + (rand(i * 4.3 + st * 5.9) - 0.5) * 2 * 520 * a));
        const dy = (rand(i * 2.2 + st * 8.1) - 0.5) * 2 * 20 * a;
        // "complex." arrives letter by letter from f8, each letter stuttering in
        const appear = isC ? 8 + (i - COMPLEX_FROM) * 0.75 : 0;
        if (f < appear) return <span key={i} style={{ ...mona(75, 200), opacity: 0 }}>{ch}</span>;
        const flick = isC && f - appear < 2 ? 0.45 : 1;
        return (
          <span key={i} style={{ display: "inline-block", overflow: isC ? "visible" : "hidden", padding: "0.2em 0 0.25em", margin: "-0.2em 0 -0.25em" }}>
            <span
              style={{
                display: "inline-block",
                ...mona(wd, wg),
                opacity: flick,
                transform: `translateY(${isC ? dy : dy + rise * 100}%)`.replace("%", "px").replace(/translateY\((.*)px\)/, (_m, v) => `translateY(${isC ? dy : dy + rise * 150}px)`),
              }}
            >
              {ch === " " ? " " : ch}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/* ---------- scene ---------- */
export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fc = Math.min(f, FREEZE); // chaos clock: frozen from f57, the snap takes over at f60
  const a = amp(fc);
  const calm = f >= SNAP;

  const cam = interpolate(f, [0, 120], [1, 1.025], clamp) + interpolate(f, [70, 114], [0, 0.035], { ...clamp, easing: EI });
  const stutter = (f >= 45 && f < 47) || (f >= 50 && f < 52) ? 0.42 : 0;

  // after the snap the system recedes, then leaves the words alone for the silence
  const recede = interpolate(f, [70, 100], [1, 0.55], clamp) * interpolate(f, [102, 112], [1, 0], { ...clamp, easing: EI });

  const pT = f < SNAP + 2 ? 0 : spring({ frame: f - SNAP - 2, fps, config: { stiffness: 190, damping: 26 } });
  const lineA = interpolate(f, [68, 82], [0, 1], { ...clamp, easing: EO });
  const lineB = interpolate(f, [75, 89], [0, 1], { ...clamp, easing: EO });
  const inhale = interpolate(f, [112, 118], [0, 1], { ...clamp, easing: EI });

  const wires = (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {WIRES.map((w, i) => {
        if (f < w.at) return null;
        const draw = interpolate(f, [w.at, w.at + 10], [0, 1], { ...clamp, easing: EO });
        const p = snapP(f, w.delay, fps);
        const wob = (n: number) => ({
          x: noise2D(`wx${i}-${n}`, fc * 0.03, 0) * 90 * a,
          y: noise2D(`wy${i}-${n}`, fc * 0.03, 0) * 70 * a,
        });
        const pts = w.c.map((c, n) => {
          const wb = n === 1 || n === 2 ? wob(n) : jitter(i * 7 + n, fc, a);
          return { x: lerp(c.x + wb.x, w.g[n].x, p), y: lerp(c.y + wb.y, w.g[n].y, p) };
        });
        const d = `M ${pts[0].x} ${pts[0].y} C ${pts[1].x} ${pts[1].y} ${pts[2].x} ${pts[2].y} ${pts[3].x} ${pts[3].y}`;
        const op = lerp(w.o, 0.16, p) * (calm ? recede : 1);
        const port = (1 - p) * 0.7;
        return (
          <g key={i}>
            <path d={d} pathLength={1} strokeDasharray={`${p > 0 ? 1 : draw} 1`} stroke={C.paper} strokeOpacity={op} strokeWidth={1.25} fill="none" />
            {port > 0.02 ? (
              <>
                <rect x={pts[0].x - 3} y={pts[0].y - 3} width={6} height={6} fill={C.paper} opacity={port * draw} />
                <rect x={pts[3].x - 3} y={pts[3].y - 3} width={6} height={6} fill={C.paper} opacity={port * (draw > 0.98 ? 1 : 0)} />
              </>
            ) : null}
          </g>
        );
      })}
    </svg>
  );

  const frags = FRAGS.map((fr, i) => {
    if (f < fr.at) return null;
    const w = spanW(fr.span);
    const age = f - fr.at;
    const pop = interpolate(age, [0, 4], [1.08, 1], { ...clamp, easing: EO });
    const flick = age === 1 ? 0.35 : 1;
    const p = snapP(f, fragDelay(fr), fps);
    const j = jitter(i, fc, a);
    const drift = { x: (rand(i * 5.1) - 0.5) * 0.9 * fc, y: (rand(i * 6.7) - 0.5) * 0.5 * fc };
    const chaosX = fr.cx + j.x + drift.x;
    const chaosY = fr.cy + j.y + drift.y;
    const slotX = colX(fr.col) + w / 2;
    const slotY = fr.y + fr.h / 2;
    const x = lerp(chaosX, slotX, p);
    const y = lerp(chaosY, slotY, p);
    const rot = lerp(fr.rot, 0, p);
    const sc = lerp(fr.sc * pop, 1, p);
    const hot = p < 0.5;
    const ghostFade = fr.ghost ? 1 - p : 1;
    const op = flick * ghostFade * (calm ? lerp(1, 0.62, Math.min(1, p)) * recede : fr.ghost ? 0.8 : 1);
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x - w / 2,
          top: y - fr.h / 2,
          transform: `rotate(${rot}deg) scale(${sc})`,
          opacity: op,
        }}
      >
        <FragBody fr={fr} hot={hot} />
      </div>
    );
  });

  const scene = (
    <AbsoluteFill style={{ transform: `scale(${cam})` }}>
      {wires}
      {frags}
      {/* headline: chaos centred at y 540 → calm line one, smaller and lighter */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            transform: `translateY(${lerp(0, -118, pT)}px) scale(${lerp(1, 0.4, pT)})`,
            opacity: lerp(1, 0.72, pT) * (1 - inhale * 0.3),
          }}
        >
          <Headline f={f} fc={fc} pT={pT} />
        </div>
      </AbsoluteFill>
      {f >= 66 ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Glow x={1150} y={590} r={420} opacity={0.22 * lineB * (1 - inhale * 0.5)} />
          <div style={{ display: "flex", gap: "0.24em", fontFamily: serif, fontStyle: "italic", fontSize: 156, lineHeight: 1.1, marginTop: 130, opacity: 1 - inhale * 0.25 }}>
            <div style={{ overflow: "hidden", padding: "0.05em 0.08em 0.12em", margin: "-0.05em -0.08em -0.12em" }}>
              <div style={{ color: C.paper, transform: `translateY(${(1 - lineA) * 105}%)`, filter: `blur(${(1 - lineA) * 7}px)` }}>Using it</div>
            </div>
            <div style={{ overflow: "hidden", padding: "0.05em 0.08em 0.12em", margin: "-0.05em -0.08em -0.12em" }}>
              <div style={{ color: C.acc, transform: `translateY(${(1 - lineB) * 105}%)`, filter: `blur(${(1 - lineB) * 7}px)`, textShadow: `0 0 34px rgba(255,59,31,${0.35 * lineB})` }}>
                shouldn’t be.
              </div>
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      {stutter > 0 ? <Glitch intensity={stutter} seed={f < 48 ? 6 : 11} slices={7}>{scene}</Glitch> : scene}
    </AbsoluteFill>
  );
};

/* ---------- sound ---------- */
const snapCues: Cue[] = (() => {
  const frames = [...new Set(FRAGS.filter((fr) => !fr.ghost).map((fr) => SNAP + fragDelay(fr)))].sort((x, y) => x - y);
  const out: Cue[] = [];
  frames.forEach((fr, k) => {
    if (fr === SNAP) return; // the downbeat has its own layered hit
    out.push({ f: fr, sfx: (k % 2 ? "snap" : "click") as Sfx, vol: Math.max(0.14, 0.3 - k * 0.02) });
  });
  return out;
})();

export const cues: Cue[] = [
  // chaos: every arrival has its own sound; errors get the low deny tone
  { f: 0, sfx: "glitch-1", vol: 0.35 },
  { f: 0, sfx: "chatter", vol: 0.26 },
  { f: 4, sfx: "blip-down", vol: 0.26 },
  { f: 8, sfx: "key-1", vol: 0.16 },
  { f: 11, sfx: "key-4", vol: 0.13 },
  { f: 15, sfx: "blip-down", vol: 0.28 },
  { f: 15, sfx: "click", vol: 0.18 },
  { f: 19, sfx: "key-2", vol: 0.15 },
  { f: 22, sfx: "click-lo", vol: 0.2 },
  { f: 26, sfx: "click", vol: 0.16 },
  { f: 27, sfx: "chatter", vol: 0.34 },
  { f: 30, sfx: "blip-down", vol: 0.3 },
  { f: 31, sfx: "key-5", vol: 0.15 },
  { f: 34, sfx: "click-lo", vol: 0.18 },
  { f: 37, sfx: "click", vol: 0.18 },
  { f: 41, sfx: "key-3", vol: 0.16 },
  { f: 45, sfx: "blip-down", vol: 0.32 },
  { f: 45, sfx: "glitch-2", vol: 0.42 },
  { f: 48, sfx: "blip-hi", vol: 0.22 },
  { f: 49, sfx: "click", vol: 0.18 },
  { f: 50, sfx: "glitch-1", vol: 0.38 },
  { f: 51, sfx: "blip-hi", vol: 0.24 },
  { f: 52, sfx: "riser", vol: 0.55 }, // 2 s, inaudible until ~f76, hard stop at f112
  { f: 54, sfx: "blip-hi", vol: 0.26 },
  { f: 56, sfx: "blip-hi", vol: 0.26 },
  // f57–59 freeze: nothing new
  { f: SNAP, sfx: "lock", vol: 0.3 },
  { f: SNAP, sfx: "snap", vol: 0.32 },
  ...snapCues,
  { f: 68, sfx: "swish", vol: 0.16 },
  { f: 75, sfx: "blip-up", vol: 0.18 },
  // f112–120: silence before the final drop
];
