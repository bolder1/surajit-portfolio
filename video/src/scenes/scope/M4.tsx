import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ModuleShell, Em } from "../../lib/ModuleShell";
import { C, dots, mona, mono, sans } from "../../lib/theme";
import { clamp, EI, EO, prog } from "../../lib/anim";
import { Glow } from "../../lib/FX";
import type { Cue } from "../../lib/cues";

/**
 * SCOPE 04 · PRIVILEGED ACCESS (60 f) · just-in-time elevation, no padlock.
 * Vermilion = live privilege, and only three things carry it: the GRANTED pill, the remaining-time arc,
 * and one soft glow on the dial. It all drains with the clock hand and is gone at revoke.
 *  f0–14  token card (REQUESTED) snaps in, connector + dial ticks draw on
 *  f15    GRANT (beat 2): pill fills, arc ignites clockwise, one glow on the dial
 *  f17–38 hand sweeps clockwise eating the arc; Doto timer 00:59:59 → 00:00:00 (fast, decelerating into zero)
 *  f31–37 SFX quiet
 *  f38    ZERO (8th after beat 3): power-down flicker, strike through DOMAIN ADMIN, pill REVOKED, dial AUTO-REVOKED
 *  f38–53 hold on the revoked state, f53–58 exit
 */
const GRANT = 15;
const ZERO = 38;
const CX = 1500;
const CY = 452;
const R = 188; // main arc radius
const TICKS = 120;

// Token card, docked to the dial's 9 o'clock by a short connector
const CARD = { x: CX - 222 - 64 - 404, y: CY - 86, w: 404, h: 172 };

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

// Fast through the hour, decelerating into the last seconds so zero lands on the 8th.
const DRAIN = Easing.bezier(0.42, 0, 0.3, 1);
const drainP = (f: number) => interpolate(f, [GRANT + 2, ZERO], [0, 1], { ...clamp, easing: DRAIN });

const hms = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return [h, m, ss].map((v) => String(v).padStart(2, "0"));
};

// Power-down flicker after zero (deterministic, 4 f), then the dial rests dim.
const FLICK = [1, 0.3, 0.8, 0.45];
const SETTLE = 0.62;

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
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <g transform={`translate(${CX} ${CY}) scale(${pop}) translate(${-CX} ${-CY})`}>
        {/* 120 ticks draw on clockwise; while the grant has time left they stand bright in the remaining span */}
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
              stroke={C.paper}
              strokeWidth={major ? 2 : 1.5}
              opacity={(isLit ? 0.95 : major ? 0.45 : 0.2) * appear * (isLit ? 1 : 1 - dead * 0.3)}
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
        {/* remaining time: vermilion arc from the hand round to 12 o'clock */}
        {live && lit > 0 ? <path d={arc(R, hand, 360 * Math.min(1, lit))} fill="none" stroke={C.acc} strokeWidth={4} strokeLinecap="round" /> : null}
        {/* the sweeping hand */}
        {f >= GRANT + 2 && f < ZERO + 1
          ? (() => {
              const [hx0, hy0] = pt(170, hand);
              const [hx1, hy1] = pt(232, hand);
              const [dx, dy] = pt(R, hand);
              return (
                <g>
                  <line x1={hx0} y1={hy0} x2={hx1} y2={hy1} stroke={C.paper} strokeWidth={1.5} />
                  <circle cx={dx} cy={dy} r={5.5} fill={C.paper} />
                </g>
              );
            })()
          : null}
        {/* 12 o'clock index · where time runs out */}
        <path d={`M ${CX - 7} ${CY - 238} L ${CX + 7} ${CY - 238} L ${CX} ${CY - 228} Z`} fill={C.paper} opacity={draw * 0.8} />
      </g>
    </svg>
  );
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const push = interpolate(f, [0, 60], [1, 1.05], clamp);
  const exit = interpolate(f, [53, 58], [0, 1], { ...clamp, easing: EI });

  const lit = prog(f, GRANT, GRANT + 5, EO); // ignition sweep (fast, clockwise)
  const p = drainP(f);
  const secs = f < GRANT + 2 ? 3599 : Math.round(3599 * (1 - p));
  const granted = f >= GRANT && f < ZERO;
  const revoked = f >= ZERO;
  const dead = prog(f, ZERO, ZERO + 8, EO);
  const flick = f >= ZERO && f < ZERO + FLICK.length ? FLICK[f - ZERO] : revoked ? SETTLE : 1;
  const pop =
    1 +
    0.035 * (1 - spring({ frame: f - GRANT, fps, config: { stiffness: 320, damping: 14 } })) * (f >= GRANT ? 1 : 0) -
    0.012 * dead;

  // the module's one glow: spikes on the grant, drains with the clock, gone at revoke (≤ 0.5)
  const glow = granted ? 0.5 * interpolate(f, [GRANT, GRANT + 2, GRANT + 8], [0.4, 1, 0.75], clamp) * (1 - p * 0.85) : 0;

  // card
  const cardIn = interpolate(f, [0, 3], [0.3, 1], clamp);
  const cardSnap = spring({ frame: f, fps, config: { stiffness: 380, damping: 22 } });
  const strike = prog(f, ZERO + 1, ZERO + 6, EO);
  const timerFlash = f >= ZERO && f < ZERO + 3;
  const revokedLabel = prog(f, ZERO + 2, ZERO + 7, EO);

  const status = f < GRANT ? "REQUESTED" : f < ZERO ? "GRANTED" : "REVOKED";
  const statusPop = spring({ frame: f - (f < ZERO ? GRANT : ZERO), fps, config: { stiffness: 400, damping: 18 } });

  const digitColor = timerFlash ? C.acc : revoked ? C.dim : f < GRANT ? C.dim : C.paper;
  const [hh, mm, ss] = hms(secs);
  const label: React.CSSProperties = { fontFamily: mono, fontSize: 16, letterSpacing: "0.3em", whiteSpace: "nowrap" };

  return (
    <ModuleShell index={4} title="PRIVILEGED ACCESS" line={<>Power, <Em>only when needed.</Em></>}>
      <AbsoluteFill style={{ opacity: 1 - exit, transform: `scale(${1 + exit * 0.03})`, transformOrigin: `${CX}px ${CY}px` }}>
        <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: `${(CARD.x + CX) / 2}px ${CY}px` }}>
          {glow > 0.01 ? <Glow x={CX} y={CY} r={380} opacity={glow} /> : null}

          <div style={{ position: "absolute", inset: 0, opacity: flick }}>
            <Dial f={f} lit={granted ? lit : 0} p={p} dead={dead} pop={pop} />
          </div>

          {/* connector: token → dial */}
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {(() => {
              const x0 = CARD.x + CARD.w;
              const x1 = CX - 197;
              const draw = prog(f, 4, 12, EO);
              return (
                <g>
                  <line x1={x0} y1={CY} x2={x0 + (x1 - x0) * draw} y2={CY} stroke={C.paper} strokeWidth={1.5} opacity={granted ? 0.85 : 0.4} />
                  <circle cx={x0} cy={CY} r={4} fill={C.ink} stroke={C.paper} strokeWidth={1.5} opacity={draw} />
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
              opacity: revoked ? 0.3 + 0.7 * flick : 1,
              transform: `scale(${pop})`,
            }}
          >
            <div style={{ ...label, color: C.dim, height: 20, visibility: revoked ? "hidden" : "visible" }}>EXPIRES IN</div>
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
              }}
            >
              {hh}
              <Colon color={digitColor} />
              {mm}
              <Colon color={digitColor} />
              {ss}
            </div>
            <div style={{ ...label, marginTop: 22, height: 20, color: C.paper, clipPath: `inset(0 ${(1 - revokedLabel) * 100}% 0 0)` }}>AUTO-REVOKED</div>
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
              border: `1.5px solid ${granted ? "rgba(243,236,222,0.85)" : revoked ? C.faint : C.dim}`,
              background: "rgba(13,10,7,0.86)",
              overflow: "hidden",
              opacity: cardIn,
              transform: `scale(${0.94 + 0.06 * cardSnap})`,
              transformOrigin: "100% 50%",
            }}
          >
            <div style={{ position: "absolute", left: 26, top: 22, right: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ ...label, letterSpacing: "0.26em", color: C.dim }}>ROLE</span>
              <span style={{ ...label, letterSpacing: "0.2em", padding: "3px 8px 3px 10px", borderRadius: 5, border: `1px solid ${C.faint}`, color: "rgba(243,236,222,0.6)" }}>
                JIT · 60 MIN
              </span>
            </div>
            <div style={{ position: "absolute", left: 24, top: 62, whiteSpace: "nowrap" }}>
              <span
                style={{
                  ...mona(98, 760),
                  fontSize: 44,
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                  color: C.paper,
                  opacity: revoked ? interpolate(strike, [0, 1], [1, 0.45]) : 1,
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
            <div style={{ position: "absolute", left: 24, bottom: 20 }}>
              <span
                style={{
                  fontFamily: sans,
                  fontWeight: 700,
                  fontSize: 16,
                  letterSpacing: "0.12em",
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: granted ? C.acc : "transparent",
                  border: `1.5px solid ${granted ? C.acc : revoked ? C.paper : C.dim}`,
                  color: granted ? C.ink : revoked ? C.paper : "rgba(243,236,222,0.6)",
                  transform: `scale(${f >= GRANT ? 0.88 + 0.12 * statusPop : 1})`,
                  transformOrigin: "0 50%",
                  display: "inline-block",
                }}
              >
                {status}
              </span>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </ModuleShell>
  );
};

export const cues: Cue[] = [
  { f: 1, sfx: "click", vol: 0.16 }, // token card snaps in (no cut glitch, no title swish)
  // grant: ignite
  { f: GRANT, sfx: "blip-up", vol: 0.35 },
  { f: GRANT, sfx: "snap", vol: 0.28 },
  // clock ticks while time drains, alternating weight; last one on beat 3
  { f: 19, sfx: "click-lo", vol: 0.16 },
  { f: 22, sfx: "click", vol: 0.2 },
  { f: 26, sfx: "click-lo", vol: 0.16 },
  { f: 30, sfx: "click", vol: 0.2 },
  // f31–37: quiet before zero
  { f: ZERO, sfx: "blip-down", vol: 0.35 },
  { f: ZERO, sfx: "power-down", vol: 0.45 },
  { f: ZERO + 2, sfx: "snap", vol: 0.2 }, // strike-through
];
