import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, dots, mona, mono } from "../lib/theme";
import { clamp, EI, EIO, EO, prog } from "../lib/anim";
import { Glow } from "../lib/FX";
import type { Cue } from "../lib/cues";
import face from "../assets/face.json";
import cleanSrc from "./_S2/clean.png";
import halfSrc from "./_S2/halftone.png";
import rimSrc from "./_S2/rim.png";

/**
 * 02 · CHALLENGE (180 f) — the hero biometric scan.
 * f0 halftone portrait (unverified) · f1–15 brackets fly in & lock · f10–26 ring boots
 * f30–120 scan beam resolves the photo, mesh draws, landmarks pop · ring fills in beat-packets
 * f60 LIVENESS ✓ · f75 IdP OIDC · f90 SUBJECT S.DUTTA (values snap in) · f135 verify: ring snaps, check, stamp
 * f140–172 tension build under the riser · f172–180 held breath before S3's impact.
 * Accent budget: the ring fill + one verify ripple + badge are flat vermilion; the stamp carries the only glow.
 */

const DUR = 180;
const VERIFY = 135;
const HOLD = 172;

// ---------- geometry (stage px, 1920×1080) ----------
// Face sits on the frame's vertical centre and a touch smaller than first cut, so the crown clears the
// 138 px letterbox bar until the end-of-scene push (hair top ≈ y165 at f0, ≈ y141 at the verify beat).
const S = 0.62; // portrait scale vs. the 1500×1800 original
const ANCHOR = { x: 890, y: 850 }; // face centre in original px
const FC = { x: 912, y: 548 }; // where that lands on stage
const IMG_L = FC.x - ANCHOR.x * S;
const IMG_T = FC.y - ANCHOR.y * S;
const IMG_W = 1500 * S;
const IMG_H = 1800 * S;
const K = S / 0.66; // ring + brackets keep their fit around the face
const R_IN = Math.round(266 * K); // ring tick inner radius
const R_OUT = Math.round(286 * K);
const HB = Math.round(318 * K); // bracket half-side
const BRK = Math.round(62 * K); // bracket arm length

const PTS = (face.pts as number[][]).map((p) => [p[0] * S + IMG_L, p[1] * S + IMG_T] as const);
const segs = (edges: number[][]) =>
  edges.map(([a, b]) => `M${PTS[a][0].toFixed(1)} ${PTS[a][1].toFixed(1)}L${PTS[b][0].toFixed(1)} ${PTS[b][1].toFixed(1)}`).join("");
const TESS_D = segs(face.tess as number[][]);
const CONT_D = segs(face.contours as number[][]);

// ---------- scan beam ----------
const BEAM_A = 30;
const BEAM_B = 120;
const BEAM_Y0 = 120;
const BEAM_Y1 = 960;
const beamY = (f: number) =>
  interpolate(f, [BEAM_A, BEAM_B], [BEAM_Y0, BEAM_Y1], { ...clamp, easing: Easing.bezier(0.42, 0, 0.58, 1) });

// frame at which the beam passes each landmark
const POP = PTS.map(([, y]) => {
  for (let f = 0; f <= DUR; f++) if (beamY(f) >= y) return f;
  return DUR + 1;
});
const LAST_POP = Math.max(...POP);

// ---------- ring: fills clockwise in beat-locked packets ----------
const PACKETS = [
  { a: 30, n: 12, len: 10 },
  { a: 45, n: 18, len: 10 },
  { a: 60, n: 16, len: 10 },
  { a: 75, n: 20, len: 10 },
  { a: 90, n: 18, len: 10 },
  { a: 105, n: 20, len: 10 },
  { a: 120, n: 16, len: 14 },
];
const ringP = (f: number) =>
  PACKETS.reduce((s, k, i) => s + k.n * prog(f, k.a, k.a + k.len, i === PACKETS.length - 1 ? EIO : EO), 0) / 120;
const litCount = (f: number) => Math.min(120, Math.floor(ringP(f) * 120 + 1e-6));
const LIT_AT = Array.from({ length: 120 }, (_, i) => {
  for (let f = 0; f <= DUR; f++) if (litCount(f) > i) return f;
  return DUR + 1;
});

// ---------- brackets ----------
const CORNERS = [
  { sx: -1, sy: -1, start: 1 },
  { sx: 1, sy: -1, start: 3 },
  { sx: 1, sy: 1, start: 5 },
  { sx: -1, sy: 1, start: 7 },
];
const BRACKET_CFG = { stiffness: 340, damping: 20, mass: 0.6 };
const landFrame = (start: number) => {
  for (let f = start; f < start + 30; f++) if (spring({ frame: f - start, fps: 30, config: BRACKET_CFG }) >= 0.97) return f;
  return start + 8;
};

// ---------- key landmarks that get a crosshair ----------
const KEYS = [468, 473, 1, 61, 291, 152, 10];

// one sonar ripple off the ring, on the verify beat only
const RIPPLES = [{ f: 135, a: 0.7, reach: 180 }];

// ---------- helpers ----------
const typed = (s: string, f: number, start: number, cpf = 1) => s.slice(0, Math.max(0, Math.floor((f - start) * cpf)));
const polar = (r: number, i: number) => {
  const a = ((i * 3 - 90) * Math.PI) / 180;
  return [FC.x + r * Math.cos(a), FC.y + r * Math.sin(a)] as const;
};

/** Tension envelope 0→1 across the riser (f135→172), frozen through the held breath. */
const tension = (f: number) => interpolate(f, [VERIFY + 5, HOLD], [0, 1], { ...clamp, easing: EI });

// ======================================================================================
const Portrait: React.FC<{ f: number }> = ({ f }) => {
  const by = f < BEAM_A ? BEAM_Y0 : beamY(f);
  const rv = Math.max(0, Math.min(IMG_H, by - IMG_T));
  const halfIn = interpolate(f, [0, 12], [0.45, 0.72], { ...clamp, easing: EO });
  const t = tension(f);
  const verifyFlare = interpolate(f, [VERIFY, VERIFY + 2, VERIFY + 16], [0, 1, 0], clamp);
  // vermilion rim = portrait lighting, held steady once the photo has resolved (no verify flare, no riser ramp)
  const rimO = interpolate(f, [BEAM_A, BEAM_B], [0.35, 0.62], clamp);
  const exposure = 1 + verifyFlare * 0.12 + t * 0.05;
  const mask = "radial-gradient(ellipse 50% 58% at 50% 44%, #000 62%, transparent 100%)";
  return (
    <div
      style={{
        position: "absolute",
        left: IMG_L,
        top: IMG_T,
        width: IMG_W,
        height: IMG_H,
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    >
      <Img
        src={halfSrc}
        style={{ position: "absolute", inset: 0, width: IMG_W, height: IMG_H, opacity: halfIn, clipPath: `inset(${rv}px 0px 0px 0px)` }}
      />
      <Img
        src={cleanSrc}
        style={{
          position: "absolute",
          inset: 0,
          width: IMG_W,
          height: IMG_H,
          clipPath: `inset(0px 0px ${IMG_H - rv}px 0px)`,
          filter: exposure > 1.001 ? `brightness(${exposure.toFixed(3)})` : undefined,
        }}
      />
      <Img
        src={rimSrc}
        style={{
          position: "absolute",
          inset: 0,
          width: IMG_W,
          height: IMG_H,
          opacity: Math.min(1, rimO),
          mixBlendMode: "screen",
          clipPath: `inset(0px 0px ${IMG_H - rv}px 0px)`,
        }}
      />
    </div>
  );
};

const Beam: React.FC<{ f: number }> = ({ f }) => {
  if (f < BEAM_A - 2 || f > BEAM_B + 2) return null;
  const y = beamY(f);
  const o = interpolate(f, [BEAM_A - 2, BEAM_A + 2, BEAM_B - 6, BEAM_B + 2], [0, 1, 1, 0], clamp);
  const x0 = 520;
  const w = 880;
  const fadeX = "linear-gradient(90deg, transparent 0%, #000 22%, #000 78%, transparent 100%)";
  return (
    <div style={{ position: "absolute", left: x0, top: y - 120, width: w, height: 124, opacity: o, pointerEvents: "none" }}>
      {/* light tail above the beam */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(0deg, rgba(255,59,31,0.30) 0%, rgba(255,59,31,0.08) 35%, transparent 100%)",
          WebkitMaskImage: fadeX,
          maskImage: fadeX,
          mixBlendMode: "screen",
        }}
      />
      {/* the line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 119,
          height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${C.acc} 18%, #ffb59f 50%, ${C.acc} 82%, transparent 100%)`,
          boxShadow: `0 0 14px 2px ${C.accGlow}`,
        }}
      />
    </div>
  );
};

const Mesh: React.FC<{ f: number }> = ({ f }) => {
  const by = f < BEAM_A ? BEAM_Y0 : beamY(f);
  const t = tension(f);
  const lift = 1 + 0.028 * t; // mesh lifts off the face under the riser
  const meshO = interpolate(f, [VERIFY, VERIFY + 3, VERIFY + 18], [1, 1.9, 1.15], clamp) * (1 + t * 0.5);
  // landmark dots: pop as the beam passes, settle small
  let hot = "";
  let cold = "";
  for (let i = 0; i < PTS.length; i++) {
    const age = f - POP[i];
    if (age < 0) continue;
    const [x, y] = PTS[i];
    const popR = age <= 2 ? interpolate(age, [0, 2], [1.5, 3.6]) : interpolate(age, [2, 12], [3.6, 1.25], { ...clamp, easing: EO });
    const r = popR * (1 + t * 0.35);
    const d = `M${(x - r).toFixed(1)} ${y.toFixed(1)}a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(2 * r).toFixed(2)} 0a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-2 * r).toFixed(2)} 0`;
    if (age < 7) hot += d;
    else cold += d;
  }
  const tf = `translate(${FC.x} ${FC.y}) scale(${lift}) translate(${-FC.x} ${-FC.y})`;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <clipPath id="s2-above">
          <rect x={0} y={-200} width={1920} height={Math.max(0, by + 200)} />
        </clipPath>
        <clipPath id="s2-band">
          <rect x={0} y={by - 70} width={1920} height={70} />
        </clipPath>
        <linearGradient id="s2-hot" gradientUnits="userSpaceOnUse" x1={0} y1={by - 70} x2={0} y2={by}>
          <stop offset="0" stopColor={C.paper} stopOpacity={0} />
          <stop offset="1" stopColor={C.paper} stopOpacity={0.95} />
        </linearGradient>
      </defs>
      <g transform={tf}>
        <g clipPath="url(#s2-above)">
          <path d={TESS_D} stroke={C.paper} strokeOpacity={Math.min(0.24, 0.13 * meshO)} strokeWidth={0.7} fill="none" />
          <path d={CONT_D} stroke={C.paper} strokeOpacity={Math.min(0.62, 0.42 * meshO)} strokeWidth={1.1} fill="none" />
        </g>
        {f >= BEAM_A && f <= BEAM_B + 4 ? (
          <g clipPath="url(#s2-band)">
            <path d={TESS_D} stroke="url(#s2-hot)" strokeWidth={1} fill="none" />
          </g>
        ) : null}
        <path d={cold} fill={C.paper} fillOpacity={Math.min(0.85, 0.42 * meshO)} />
        <path d={hot} fill={C.paper} />
        {KEYS.map((k) => {
          const age = f - POP[k];
          if (age < 0) return null;
          const [x, y] = PTS[k];
          const s = prog(age, 0, 8);
          const L = 9 + 5 * (1 - s);
          return (
            <g key={k} opacity={0.75 * s}>
              <path d={`M${x - L} ${y}H${x - 3}M${x + 3} ${y}H${x + L}M${x} ${y - L}V${y - 3}M${x} ${y + 3}V${y + L}`} stroke={C.paper} strokeWidth={1} />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

const Ring: React.FC<{ f: number }> = ({ f }) => {
  const { fps } = useVideoConfig();
  const boot = prog(f, 10, 26, EIO);
  const lit = litCount(f);
  let off = "";
  let on = "";
  for (let i = 0; i < 120; i++) {
    if (i >= boot * 120) break;
    const major = i % 10 === 0;
    const age = f - LIT_AT[i];
    const ext = i < lit ? 12 * Math.exp(-Math.max(0, age) / 3) : 0;
    const [x1, y1] = polar(major ? R_IN - 12 : R_IN, i);
    const [x2, y2] = polar(R_OUT + ext, i);
    const seg = `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
    if (i < lit) on += seg;
    else off += seg;
  }
  const snap = f >= VERIFY ? spring({ frame: f - VERIFY, fps, config: { stiffness: 260, damping: 11, mass: 0.7 } }) : 0;
  const sc = f >= VERIFY ? 1 + 0.045 * (1 - snap) : 1;
  const rot = f >= VERIFY ? -7 * (1 - snap) : 0;
  const white = f >= VERIFY && f < VERIFY + 2;
  const badge = f >= VERIFY ? spring({ frame: f - VERIFY - 1, fps, config: { stiffness: 220, damping: 13 } }) : 0;
  const check = prog(f, VERIFY + 3, VERIFY + 11, EO);
  const [bx, by] = polar(R_OUT + 2, 0);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <g transform={`translate(${FC.x} ${FC.y}) rotate(${rot}) scale(${sc}) translate(${-FC.x} ${-FC.y})`}>
        {/* faint outer & inner hairlines */}
        <circle cx={FC.x} cy={FC.y} r={R_OUT + 22} fill="none" stroke={C.paper} strokeOpacity={0.1 * boot} strokeWidth={1} />
        <path d={off} stroke={C.paper} strokeOpacity={0.24} strokeWidth={1.5} fill="none" />
        <path d={on} stroke={white ? C.paper : C.acc} strokeWidth={2} fill="none" />
      </g>
      {RIPPLES.map((rp) => {
        const age = f - rp.f;
        if (age < 0 || age > 26) return null;
        const q = prog(age, 0, 26, EO);
        return <circle key={rp.f} cx={FC.x} cy={FC.y} r={R_OUT + 6 + rp.reach * q} fill="none" stroke={C.acc} strokeWidth={1.5 * (1 - q) + 0.5} strokeOpacity={rp.a * (1 - q)} />;
      })}
      {badge > 0.01 ? (
        <g transform={`translate(${bx} ${by}) scale(${badge})`}>
          <circle r={23} fill={C.acc} />
          <path d="M-9 0.5 L-3 6.5 L9.5 -6" stroke={C.ink} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - check} />
        </g>
      ) : null}
    </svg>
  );
};

const Brackets: React.FC<{ f: number }> = ({ f }) => {
  const { fps } = useVideoConfig();
  const lock = f >= VERIFY ? spring({ frame: f - VERIFY, fps, config: { stiffness: 300, damping: 14 } }) : 0;
  const hb = HB - 14 * lock;
  const settle = interpolate(f, [VERIFY + 8, VERIFY + 24], [1, 0.6], clamp);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {CORNERS.map((c, k) => {
        const s = spring({ frame: f - c.start, fps, config: BRACKET_CFG });
        if (f < c.start) return null;
        const out = (1 - s) * 260;
        const x = FC.x + c.sx * (hb + out);
        const y = FC.y + c.sy * (hb + out);
        const r = 14;
        const d = `M0 ${BRK}V${r}Q0 0 ${r} 0H${BRK}`;
        return (
          <g key={k} transform={`translate(${x} ${y}) rotate(${(1 - s) * 18 * c.sx * c.sy}) scale(${-c.sx} ${-c.sy})`} opacity={Math.min(1, s * 1.4)}>
            <path d={d} stroke={C.paper} strokeOpacity={settle} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          </g>
        );
      })}
    </svg>
  );
};

// ---------- screen-space readouts ----------
const LX = 140;
const LW = 400;

const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily: mono, fontSize: 17, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", whiteSpace: "nowrap", ...style }}>{children}</div>
);

const Check: React.FC<{ p: number; size?: number }> = ({ p, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
    <path d="M3 12.5 L9.5 19 L21 6" stroke={C.acc} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
  </svg>
);

const Readouts: React.FC<{ f: number }> = ({ f }) => {
  const t = tension(f);
  const dim = 1 - 0.3 * t; // recede under the riser, but stay readable

  // The one big number is real: the 478 MediaPipe landmarks of his face, counted as the beam captures them.
  const count = POP.filter((pf) => pf <= f).length;
  const done = count >= PTS.length;
  const doneFlash = interpolate(f, [LAST_POP, LAST_POP + 2, LAST_POP + 12], [0, 1, 0], clamp);
  const numCol = count > 0 ? C.paper : C.faint;

  const rule = prog(f, 6, 22, EIO);
  // entrances vary: the header types, the count snaps on, labels are drawn out by their rules, values snap
  const wipe = (p: number): React.CSSProperties => (p < 1 ? { clipPath: `inset(-4px ${((1 - p) * 100).toFixed(1)}% -4px 0)` } : {});
  const rows: { label: string; at: number; resolve: number; node: React.ReactNode; raw?: boolean }[] = [
    {
      label: "LIVENESS",
      at: 12,
      resolve: 60,
      node: (
        <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
          PASS
          <Check p={prog(f, 61, 68, EO)} />
        </span>
      ),
    },
    { label: "IdP", at: 16, resolve: 75, raw: true, node: "OIDC" },
    { label: "SUBJECT", at: 20, resolve: 90, node: "S. DUTTA" },
  ];

  return (
    <div style={{ position: "absolute", left: LX, top: 262, width: LW, opacity: dim }}>
      <Label style={{ color: C.paper, opacity: 0.85, height: 22 }}>{typed("FACTOR 2 OF 2", f, 3)}</Label>
      <div style={{ display: "flex", alignItems: "flex-end", marginTop: 18, marginLeft: -8, opacity: f >= 4 ? 1 : 0 }}>
        <div
          style={{
            fontFamily: dots,
            fontWeight: 700,
            fontSize: 168,
            lineHeight: 0.86,
            letterSpacing: "0.02em",
            color: numCol,
            textShadow: doneFlash > 0.01 ? `0 0 ${24 * doneFlash}px rgba(255,241,230,${(0.6 * doneFlash).toFixed(2)})` : "none",
          }}
        >
          {String(count).padStart(3, "0")}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
        <Label style={{ color: done ? C.paper : C.dim, opacity: done ? 0.85 : 1, ...wipe(rule) }}>FACE LANDMARKS</Label>
        <Label style={{ color: done ? C.paper : C.dim, opacity: done ? 0.85 : 1 }}>{f >= 22 ? "/ 478" : ""}</Label>
      </div>
      <div style={{ height: 1, background: C.faint, width: `${rule * 100}%`, marginTop: 16 }} />
      {rows.map((r, i) => {
        const resolved = f >= r.resolve;
        const pend = f >= r.at + 4 && !resolved;
        const blink = Math.floor(f / 8) % 2 === 0;
        const lineP = prog(f, 8 + i * 3, 24 + i * 3, EIO);
        return (
          <div key={r.label} style={{ position: "relative", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Label style={{ color: resolved ? C.paper : C.dim, opacity: resolved ? 0.85 : 1, textTransform: r.raw ? "none" : "uppercase", ...wipe(lineP) }}>{r.label}</Label>
            <div style={{ fontFamily: mono, fontSize: 24, letterSpacing: "0.12em", color: C.paper, display: "flex", alignItems: "center", height: 28 }}>
              {pend ? <span style={{ color: C.dim }}>{r.label === "SUBJECT" ? "?" : blink ? "· · ·" : " · ·"}</span> : resolved ? r.node : null}
            </div>
            <div style={{ position: "absolute", left: 0, bottom: 0, height: 1, width: `${lineP * 100}%`, background: C.line }} />
          </div>
        );
      })}
    </div>
  );
};

/** IDENTITY VERIFIED — lands hard on the verify beat, right of the face (where he is looking). */
const STAMP_X = FC.x + HB + 88;
const Stamp: React.FC<{ f: number }> = ({ f }) => {
  if (f < VERIFY) return null;
  const k = f - VERIFY;
  const hit = prog(f, VERIFY, VERIFY + 8, EO);
  const wdth = interpolate(hit, [0, 1], [114, 92]);
  const wght = interpolate(hit, [0, 1], [900, 820]);
  const sc = interpolate(hit, [0, 1], [1.06, 1]);
  const glow = interpolate(k, [0, 14], [1, 0.3], clamp) + tension(f) * 0.3; // the scene's one glow
  const track = interpolate(f, [VERIFY + 5, HOLD], [-0.012, 0.018], { ...clamp, easing: EI });
  const line = (txt: string, delay: number) => (
    <div
      style={{
        ...mona(wdth, wght),
        fontSize: 102,
        lineHeight: 0.9,
        letterSpacing: `${track}em`,
        color: k < 2 + delay ? C.paper : C.acc,
        opacity: k >= delay ? 1 : 0,
        whiteSpace: "nowrap",
        textShadow: `0 0 ${16 + 26 * glow}px rgba(255,59,31,${(0.22 + 0.28 * glow).toFixed(2)})`,
      }}
    >
      {txt}
    </div>
  );
  return (
    <div style={{ position: "absolute", left: STAMP_X, top: FC.y - 92, transform: `scale(${sc})`, transformOrigin: "0% 50%" }}>
      {line("IDENTITY", 0)}
      {line("VERIFIED", 1)}
    </div>
  );
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const t = tension(f);

  // camera: slow push, accelerating into the hold
  const push = interpolate(f, [0, VERIFY], [1, 1.035], clamp) + interpolate(f, [VERIFY, HOLD, DUR], [0, 0.04, 0.046], { ...clamp, easing: EI });
  const hudPush = push + 0.006 * t;
  const driftY = interpolate(f, [0, DUR], [6, -8], clamp);

  // steady low backlight that grows with the resolved photo; the verify beat's glow lives on the stamp only
  const glowO = interpolate(f, [0, BEAM_B], [0.08, 0.16], clamp);
  const breath = interpolate(f, [HOLD, HOLD + 3, DUR], [0, 0.16, 0.2], clamp);

  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateY(${driftY}px) scale(${push})`, transformOrigin: `${FC.x}px ${FC.y}px` }}>
        <Glow x={FC.x - 90} y={FC.y - 170} r={640} opacity={glowO} />
        <Portrait f={f} />
        <Beam f={f} />
        <Mesh f={f} />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateY(${driftY}px) scale(${hudPush})`, transformOrigin: `${FC.x}px ${FC.y}px` }}>
        <Ring f={f} />
        <Brackets f={f} />
      </AbsoluteFill>
      {/* focus vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 46% 62% at ${FC.x}px ${FC.y}px, transparent 55%, rgba(6,5,4,${0.55 + 0.2 * t}) 100%)`,
          pointerEvents: "none",
        }}
      />
      <Readouts f={f} />
      <Stamp f={f} />
      <AbsoluteFill style={{ background: C.void, opacity: breath, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

// ---------- sound ----------
const ringCues: Cue[] = PACKETS.flatMap((k, n) => [
  { f: k.a, sfx: (n % 2 ? "blip-hi" : "blip") as Cue["sfx"], vol: 0.2 + n * 0.015 },
  { f: k.a + 2, sfx: "click" as const, vol: 0.16 },
]);

export const cues: Cue[] = [
  { f: 0, sfx: "heartbeat", vol: 0.55 },
  { f: 1, sfx: "whoosh", vol: 0.32 }, // brackets fly in
  ...CORNERS.map((c, i) => ({ f: landFrame(c.start), sfx: "snap" as const, vol: 0.18 + i * 0.04 })),
  { f: 4, sfx: "chatter", vol: 0.22 },
  { f: BEAM_A, sfx: "scan", vol: 0.42 },
  { f: 46, sfx: "chatter-long", vol: 0.26 },
  ...ringCues,
  { f: 61, sfx: "blip-up", vol: 0.26 },
  { f: 76, sfx: "click-lo", vol: 0.3 },
  { f: 91, sfx: "snap", vol: 0.26 }, // SUBJECT snaps to his name
  { f: 112, sfx: "riser", vol: 0.55 },
  { f: VERIFY, sfx: "lock", vol: 0.55 },
  { f: VERIFY, sfx: "blip-up", vol: 0.35 },
  { f: VERIFY + 3, sfx: "click", vol: 0.2 },
  // nothing after the check: the riser carries f140–172, then near-silence into S3's impact
];
