import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ModuleShell, Em } from "../../lib/ModuleShell";
import { C, dots, mona, mono, sans } from "../../lib/theme";
import { clamp, EI, EO, prog } from "../../lib/anim";
import { Glow } from "../../lib/FX";
import type { Cue } from "../../lib/cues";

/**
 * SCOPE 04 · PRIVILEGED ACCESS (60 f) · just-in-time elevation, no padlock.
 * The vermilion IS the privilege: it floods in on the grant, drains with the clock hand, and is gone at revoke.
 *  f0–14  token card (REQUESTED) + dial already drawing in
 *  f15    GRANT (beat 1): pill, card, connector, 120 ticks ignite vermilion; shockwave; glow spikes
 *  f17–45 hand sweeps clockwise eating the arc; Doto timer 00:59:59 → 00:00:00 (fast, decelerating into zero)
 *  f45    ZERO (beat 3): power-down flicker, strike through DOMAIN ADMIN, pill REVOKED, dial AUTO-REVOKED
 *  f52–57 exit
 */
const GRANT = 15;
const ZERO = 45;
const CX = 1484;
const CY = 432;
const R = 188; // main arc radius
const TICKS = 120;

// Token card, docked to the dial's 9 o'clock by a short connector
const CARD = { x: 818, y: CY - 86, w: 404, h: 172 };

const pt = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [CX + r * Math.sin(a), CY - r * Math.cos(a)] as const;
};
/** clockwise arc from a0 to a1 (deg, 0 = 12 o'clock) */
const arc = (r: number, a0: number, a1: number) => {
  const span = Math.max(0, Math.min(359.99, a1 - a0));
  if (span <= 0.01) return "";
  const [x0, y0] = pt(r, a0);
  const [x1, y1] = pt(r, a0 + span);
  return `M ${x0} ${y0} A ${r} ${r} 0 ${span > 180 ? 1 : 0} 1 ${x1} ${y1}`;
};

// Fast through the hour, decelerating into the last seconds so zero lands on the beat.
const DRAIN = Easing.bezier(0.42, 0, 0.3, 1);
const drainP = (f: number) => interpolate(f, [GRANT + 2, ZERO], [0, 1], { ...clamp, easing: DRAIN });

const hms = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return [h, m, ss].map((v) => String(v).padStart(2, "0"));
};

// Power-down flicker after zero (deterministic)
const FLICK = [1, 0.25, 0.85, 0.15, 0.6, 0.2, 0.45];
const SETTLE = 0.42; // dial rests dim after power-down

const Colon: React.FC<{ color: string }> = ({ color }) => (
  <span style={{ display: "inline-flex", flexDirection: "column", justifyContent: "center", gap: 14, height: 60, margin: "0 10px", verticalAlign: "middle" }}>
    <span style={{ width: 7, height: 7, background: color, borderRadius: 1 }} />
    <span style={{ width: 7, height: 7, background: color, borderRadius: 1 }} />
  </span>
);

const Dial: React.FC<{ f: number; lit: number; p: number; dead: number; pop: number }> = ({ f, lit, p, dead, pop }) => {
  const draw = interpolate(f, [0, 14], [0.3, 1], { ...clamp, easing: EO });
  const hand = 360 * p;
  const live = f >= GRANT && f < ZERO;
  const bezel = interpolate(f, [0, 60], [-8, 6]);
  const sw = prog(f, GRANT, GRANT + 14, EO);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {/* grant shockwave */}
      {f >= GRANT && sw < 1 ? (
        <circle cx={CX} cy={CY} r={R + 150 * sw} fill="none" stroke={C.acc} strokeWidth={2 * (1 - sw) + 0.5} opacity={0.7 * (1 - sw)} />
      ) : null}
      <g transform={`translate(${CX} ${CY}) scale(${pop}) translate(${-CX} ${-CY})`}>
        {/* machined outer bezel, slow counter-rotation */}
        <g transform={`rotate(${bezel} ${CX} ${CY})`} opacity={0.45 * draw}>
          <circle cx={CX} cy={CY} r={234} fill="none" stroke={C.paper} strokeWidth={1} strokeDasharray="2 10" />
          {[0, 90, 180, 270].map((a) => {
            const [x0, y0] = pt(229, a);
            const [x1, y1] = pt(241, a);
            return <line key={a} x1={x0} y1={y0} x2={x1} y2={y1} stroke={C.paper} strokeWidth={1.5} />;
          })}
        </g>
        {/* 120 ticks: cream 20% at rest, vermilion while the grant has time left */}
        {Array.from({ length: TICKS }, (_, i) => {
          const a = i * 3;
          const major = i % 10 === 0;
          const appear = interpolate(f, [i * 0.07 - 4, i * 0.07 + 1], [0, 1], clamp);
          const isLit = i / TICKS < lit && a >= hand - 0.01 && live;
          const r0 = major ? 197 : 202;
          const r1 = major ? 222 : 214;
          const [x0, y0] = pt(r0, a);
          const [x1, y1] = pt(r1 + (isLit ? 3 : 0), a);
          return (
            <line
              key={i}
              x1={x0}
              y1={y0}
              x2={x1}
              y2={y1}
              stroke={isLit ? C.acc : C.paper}
              strokeWidth={major ? 2 : 1.5}
              opacity={(isLit ? 1 : major ? 0.45 : 0.2) * appear * (isLit ? 1 : 1 - dead * 0.3)}
            />
          );
        })}
        {/* base track */}
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke={C.paper}
          strokeWidth={1}
          opacity={0.2}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
          transform={`rotate(-90 ${CX} ${CY})`}
        />
        <circle cx={CX} cy={CY} r={158} fill="none" stroke={C.paper} strokeWidth={1} opacity={0.12 * draw} />
        {/* remaining time: thick vermilion arc from the hand round to 12 o'clock */}
        {live && lit > 0 ? (
          <>
            <path d={arc(R, hand, 360 * Math.min(1, lit))} fill="none" stroke={C.acc} strokeWidth={16} opacity={0.13} />
            <path d={arc(R, hand, 360 * Math.min(1, lit))} fill="none" stroke={C.acc} strokeWidth={4} />
          </>
        ) : null}
        {/* the sweeping hand */}
        {f >= GRANT + 2 && f < ZERO + 1
          ? (() => {
              const [hx0, hy0] = pt(170, hand);
              const [hx1, hy1] = pt(232, hand);
              const [dx, dy] = pt(R, hand);
              return (
                <g>
                  <line x1={hx0} y1={hy0} x2={hx1} y2={hy1} stroke={C.paper} strokeWidth={1.5} />
                  <circle cx={dx} cy={dy} r={14} fill={C.acc} opacity={0.25} />
                  <circle cx={dx} cy={dy} r={5.5} fill={C.paper} />
                </g>
              );
            })()
          : null}
        {/* 12 o'clock index · where time runs out */}
        <path
          d={`M ${CX - 7} ${CY - 250} L ${CX + 7} ${CY - 250} L ${CX} ${CY - 240} Z`}
          fill={f >= ZERO && f < ZERO + 4 ? C.acc : C.paper}
          opacity={draw * 0.8}
        />
      </g>
    </svg>
  );
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const push = interpolate(f, [0, 60], [1, 1.05], clamp);
  const exit = interpolate(f, [52, 57], [0, 1], { ...clamp, easing: EI });

  const lit = prog(f, GRANT, GRANT + 5, EO); // ignition sweep (fast, clockwise)
  const p = drainP(f);
  const secs = f < GRANT + 2 ? 3599 : Math.round(3599 * (1 - p));
  const granted = f >= GRANT && f < ZERO;
  const dead = prog(f, ZERO, ZERO + 8, EO);
  const flick = f >= ZERO && f < ZERO + FLICK.length ? FLICK[f - ZERO] : f >= ZERO ? SETTLE : 1;
  const pop =
    1 +
    0.035 * (1 - spring({ frame: f - GRANT, fps, config: { stiffness: 320, damping: 14 } })) * (f >= GRANT ? 1 : 0) -
    0.012 * dead;

  // vermilion energy: spikes on the grant, drains with the clock
  const energy =
    f < GRANT ? 0 : f < ZERO ? interpolate(f, [GRANT, GRANT + 2, GRANT + 8], [0.4, 1, 0.75], clamp) * (1 - p * 0.85) : 0.1 * flick;

  // card
  const cardIn = interpolate(f, [0, 3], [0.3, 1], clamp);
  const cardSnap = spring({ frame: f, fps, config: { stiffness: 380, damping: 22 } });
  const wipe = prog(f, GRANT, GRANT + 7, EO);
  const strike = prog(f, ZERO + 1, ZERO + 6, EO);
  const timerFlash = f >= ZERO && f < ZERO + 3;

  const status = f < GRANT ? "REQUESTED" : f < ZERO ? "GRANTED" : "REVOKED";
  const statusPop = spring({ frame: f - (f < ZERO ? GRANT : ZERO), fps, config: { stiffness: 400, damping: 18 } });

  const digitColor = timerFlash ? C.acc : f >= ZERO ? C.dim : f < GRANT ? C.faint : C.paper;
  const [hh, mm, ss] = hms(secs);

  return (
    <ModuleShell index={4} title="PRIVILEGED ACCESS" line={<>Power, <Em>only when needed.</Em></>}>
      <AbsoluteFill style={{ opacity: 1 - exit, transform: `scale(${1 + exit * 0.03})`, transformOrigin: `${CX}px ${CY}px` }}>
        {/* parallax back layer: slower push */}
        <AbsoluteFill style={{ transform: `scale(${1 + (push - 1) * 0.4})`, transformOrigin: `${CX}px ${CY}px` }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <circle cx={CX} cy={CY} r={320} fill="none" stroke={C.paper} strokeWidth={1} opacity={0.06} />
            <circle cx={CX} cy={CY} r={410} fill="none" stroke={C.paper} strokeWidth={1} opacity={0.04} strokeDasharray="1 7" />
            <line x1={780} y1={CY} x2={1840} y2={CY} stroke={C.paper} strokeWidth={1} opacity={0.07} />
            <line x1={CX} y1={176} x2={CX} y2={680} stroke={C.paper} strokeWidth={1} opacity={0.05} />
          </svg>
        </AbsoluteFill>

        <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: `${(CARD.x + CX) / 2}px ${CY}px` }}>
          <Glow x={CX} y={CY} r={420} opacity={energy * 0.75} />
          <Glow x={CARD.x + CARD.w / 2} y={CY} r={300} opacity={energy * 0.4} />

          <div style={{ position: "absolute", inset: 0, opacity: flick }}>
            <Dial f={f} lit={granted ? lit : 0} p={p} dead={dead} pop={pop} />
          </div>

          {/* connector: token → dial */}
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {(() => {
              const x0 = CARD.x + CARD.w;
              const x1 = CX - 197;
              const draw = prog(f, 4, 12, EO);
              const hot = granted;
              return (
                <g>
                  <line
                    x1={x0}
                    y1={CY}
                    x2={x0 + (x1 - x0) * draw}
                    y2={CY}
                    stroke={hot ? C.acc : C.paper}
                    strokeWidth={1.5}
                    opacity={hot ? 1 - p * 0.6 : 0.45}
                  />
                  <circle cx={x0} cy={CY} r={4} fill={C.ink} stroke={hot ? C.acc : C.paper} strokeWidth={1.5} opacity={draw} />
                </g>
              );
            })()}
          </svg>

          {/* centre readout */}
          <div
            style={{
              position: "absolute",
              left: CX - 170,
              top: CY - 74,
              width: 340,
              textAlign: "center",
              opacity: interpolate(f, [0, 10], [0.4, 1], { ...clamp, easing: EO }) * (f >= ZERO ? 0.3 + 0.7 * flick : 1),
              transform: `scale(${pop})`,
            }}
          >
            <div style={{ fontFamily: mono, fontSize: 16, letterSpacing: "0.3em", color: C.dim, height: 20 }}>
              {f < ZERO ? "EXPIRES IN" : "EXPIRED"}
            </div>
            <div
              style={{
                fontFamily: dots,
                fontWeight: 800,
                fontSize: 74,
                lineHeight: "60px",
                height: 60,
                marginTop: 18,
                whiteSpace: "nowrap",
                color: digitColor,
                textShadow: granted ? `0 0 24px rgba(255,59,31,${0.4 * (1 - p)})` : timerFlash ? `0 0 30px ${C.accGlow}` : "none",
              }}
            >
              {hh}
              <Colon color={digitColor} />
              {mm}
              <Colon color={digitColor} />
              {ss}
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 16,
                letterSpacing: "0.3em",
                marginTop: 22,
                color: f >= ZERO ? C.paper : granted ? C.acc : C.faint,
              }}
            >
              {f < GRANT ? "○ PENDING" : f < ZERO ? "● ACTIVE" : "AUTO-REVOKED"}
            </div>
          </div>

          {/* the token */}
          <div
            style={{
              position: "absolute",
              left: CARD.x,
              top: CARD.y,
              width: CARD.w,
              height: CARD.h,
              borderRadius: 16,
              border: `1.5px solid ${granted ? C.acc : f >= ZERO ? C.faint : C.dim}`,
              background: "rgba(13,10,7,0.86)",
              overflow: "hidden",
              opacity: cardIn,
              transform: `scale(${0.94 + 0.06 * cardSnap})`,
              transformOrigin: "100% 50%",
              boxShadow: granted ? `0 0 ${40 * (1 - p)}px rgba(255,59,31,${0.35 * (1 - p)})` : "none",
            }}
          >
            {/* vermilion fill wipe on grant, drains with the clock */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${wipe * 100}%`,
                background: `linear-gradient(90deg, rgba(255,59,31,${granted ? 0.24 * (1 - p * 0.8) : 0}) 0%, rgba(255,59,31,${granted ? 0.07 : 0}) 75%, rgba(255,59,31,0) 100%)`,
              }}
            />
            <div style={{ position: "absolute", left: 26, top: 22, right: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: mono, fontSize: 14, letterSpacing: "0.26em", color: C.dim }}>ROLE:</span>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 13,
                  letterSpacing: "0.2em",
                  padding: "3px 8px 3px 10px",
                  borderRadius: 5,
                  border: `1px solid ${granted ? C.acc : C.faint}`,
                  color: granted ? C.acc : C.dim,
                }}
              >
                JIT · 60 MIN
              </span>
            </div>
            <div style={{ position: "absolute", left: 24, top: 60, whiteSpace: "nowrap" }}>
              <span
                style={{
                  ...mona(98, 760),
                  fontSize: 44,
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                  color: C.paper,
                  opacity: f >= ZERO ? interpolate(strike, [0, 1], [1, 0.32]) : 1,
                  position: "relative",
                  display: "inline-block",
                }}
              >
                DOMAIN ADMIN
                <span
                  style={{
                    position: "absolute",
                    left: -6,
                    right: -6,
                    top: "50%",
                    height: 3,
                    background: C.paper,
                    transform: `scaleX(${strike})`,
                    transformOrigin: "0 50%",
                  }}
                />
              </span>
            </div>
            <div style={{ position: "absolute", left: 24, bottom: 20, right: 24, display: "flex", alignItems: "center", gap: 14 }}>
              <span
                style={{
                  fontFamily: sans,
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: "0.12em",
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: granted ? C.acc : "transparent",
                  border: `1.5px solid ${granted ? C.acc : f >= ZERO ? C.paper : C.dim}`,
                  color: granted ? C.ink : f >= ZERO ? C.paper : C.dim,
                  transform: `scale(${f >= GRANT ? 0.88 + 0.12 * statusPop : 1})`,
                  transformOrigin: "0 50%",
                  display: "inline-block",
                }}
              >
                {status}
              </span>
              <span style={{ fontFamily: mono, fontSize: 13, letterSpacing: "0.2em", color: C.faint }}>u.dutta</span>
            </div>
          </div>

        </AbsoluteFill>
      </AbsoluteFill>
    </ModuleShell>
  );
};

export const cues: Cue[] = [
  { f: 0, sfx: "glitch-1", vol: 0.3 },
  { f: 2, sfx: "swish", vol: 0.22 }, // title slides up
  { f: 6, sfx: "click", vol: 0.18 },
  // grant: ignite
  { f: GRANT, sfx: "blip-up", vol: 0.35 },
  { f: GRANT, sfx: "snap", vol: 0.28 },
  { f: GRANT + 1, sfx: "shimmer", vol: 0.18 },
  // clock ticks: 16ths (firm) + 32nds (soft) while time drains
  ...[22, 30, 37].map((t) => ({ f: t, sfx: "click" as const, vol: 0.22 })),
  ...[19, 26, 34, 41].map((t) => ({ f: t, sfx: "click-lo" as const, vol: 0.16 })),
  // zero: auto-revoke
  { f: ZERO, sfx: "blip-down", vol: 0.35 },
  { f: ZERO, sfx: "power-down", vol: 0.45 },
  { f: ZERO + 2, sfx: "snap", vol: 0.2 },
];
