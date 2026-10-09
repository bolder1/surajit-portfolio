import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ModuleShell, Em } from "../../lib/ModuleShell";
import { C, sans } from "../../lib/theme";
import { clamp, EIO, EO, lerp, prog } from "../../lib/anim";
import { Glow } from "../../lib/FX";
import { keySfx, type Cue } from "../../lib/cues";
import { DotGrid, flashAt, GRANT, Mono, Stage, type Pt } from "../_M1/kit";

/**
 * SCOPE 03 · MFA & SIGN-UP FLOWS (60 f) — "Prove it's you, painlessly."
 * A sign-up step (ACCOUNT → VERIFY → ACCESS) asking for a 6-digit code.
 * f0     six slot reels already spinning (motion-blurred); vermilion focus ring on cell 1; expiry bar draining
 * f15 19 22 26 30 34   reels lock one by one on 16th notes; focus ring hops to the next cell
 * f34–39 focus ring widens over the whole code — verifying sheen sweeps
 * f40–46 the ring collapses down into a filled vermilion pill → f45 (beat 4) "Approved", check draws,
 *        stepper advances to ACCESS; grant pulse.  f49–57 exit.
 */

const CODE = [4, 8, 1, 7, 2, 6];
const LOCKS = [15, 19, 22, 26, 30, 34]; // 16th-note grid (3.75 f) from beat 2
const SW = 132;
const SH = 180;
const GAP = 14;
const MID = 44;
const X0 = 880;
const RY = 338; // reel top
const sx = (i: number) => X0 + i * (SW + GAP) + (i >= 3 ? MID - GAP : 0);
const X1 = sx(5) + SW; // 1772
const FOCUS: Pt = { x: 1326, y: 450 };

type Box = { x: number; y: number; w: number; h: number; r: number };
const slotBox = (i: number): Box => ({ x: sx(i) - 7, y: RY - 7, w: SW + 14, h: SH + 14, r: 24 });
const rowBox: Box = { x: X0 - 7, y: RY - 7, w: X1 - X0 + 14, h: SH + 14, r: 24 };
const PILL: Box = { x: X1 - 252, y: 588, w: 252, h: 58, r: 29 };
const lerpBox = (a: Box, b: Box, t: number): Box => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t), r: lerp(a.r, b.r, t) });

/* ---------------- reels ---------------- */
const PRE = -7;
const reelPos = (i: number, f: number) => {
  const L = LOCKS[i];
  const R0 = Math.round((L - PRE) * 0.8);
  const target = 60 + CODE[i];
  const u = interpolate(f, [PRE, L], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 0.55, 0.3, 1) });
  const t = f - L;
  const settle = t >= 0 ? 0.14 * Math.exp(-t / 1.7) * Math.sin(t * 2.3) : 0;
  return target - R0 * (1 - u) + settle;
};

const Reel: React.FC<{ i: number; f: number }> = ({ i, f }) => {
  const p = reelPos(i, f);
  const v = Math.abs(p - reelPos(i, f - 1)) * SH; // px / frame
  const locked = f >= LOCKS[i];
  const fl = flashAt(f, LOCKS[i], 6);
  const grant = flashAt(f, GRANT, 10);
  const base = Math.floor(p);
  const blur = Math.min(v / 26, 8);
  const stretch = 1 + Math.min(v / 1400, 0.35);
  const x = sx(i);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: RY,
        width: SW,
        height: SH,
        borderRadius: 20,
        background: `linear-gradient(180deg, ${C.ink2} 0%, rgba(13,10,7,0.96) 100%)`,
        border: `1.5px solid rgba(243,236,222,${0.18 + (locked ? 0.22 : 0) + 0.5 * grant})`,
        boxShadow: "inset 0 1px 0 rgba(243,236,222,0.08)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 26%, #000 74%, transparent 100%)",
          maskImage: "linear-gradient(180deg, transparent 0%, #000 26%, #000 74%, transparent 100%)",
        }}
      >
        <div style={{ position: "absolute", inset: 0, filter: blur > 0.3 ? `blur(${blur.toFixed(2)}px)` : undefined, transform: `scaleY(${stretch})` }}>
          {[-1, 0, 1, 2].map((k) => {
            const idx = base + k;
            const d = ((idx % 10) + 10) % 10;
            const y = (idx - p) * SH;
            const isTarget = locked && k === 0 && Math.abs(idx - p) < 0.5;
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: 0,
                  width: SW,
                  top: y,
                  height: SH,
                  lineHeight: `${SH}px`,
                  textAlign: "center",
                  fontFamily: sans,
                  fontWeight: 500,
                  fontSize: 118,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.02em",
                  color: isTarget && fl > 0.2 ? C.acc : C.paper,
                  opacity: locked ? 1 : 0.62,
                  textShadow: isTarget && fl > 0.2 ? `0 0 26px ${C.accGlow}` : "none",
                }}
              >
                {d}
              </div>
            );
          })}
        </div>
      </div>
      {/* centre reading line */}
      <div style={{ position: "absolute", left: 14, right: 14, top: SH / 2, height: 1, background: C.paper, opacity: locked ? 0 : 0.08 }} />
    </div>
  );
};

/* ---------------- focus ring → pill ---------------- */
const focusBox = (f: number): Box => {
  if (f < LOCKS[5]) {
    let idx = 0;
    for (let i = 0; i < 5; i++) if (f >= LOCKS[i]) idx = i;
    const from = f < LOCKS[0] ? 0 : idx;
    const lastLock = f < LOCKS[0] ? -99 : LOCKS[idx];
    const t = prog(f, lastLock, lastLock + 3.5, EO);
    return f < LOCKS[0] ? slotBox(0) : lerpBox(slotBox(from), slotBox(from + 1), t);
  }
  const expand = prog(f, LOCKS[5], LOCKS[5] + 5, EIO);
  const b1 = lerpBox(slotBox(5), rowBox, expand);
  const morph = prog(f, 40, 46, Easing.bezier(0.7, 0, 0.2, 1));
  return lerpBox(b1, PILL, morph);
};

const Focus: React.FC<{ f: number }> = ({ f }) => {
  const b = focusBox(f);
  const fill = prog(f, 43, 46, EO);
  const verifying = f >= LOCKS[5] && f < 42;
  const sheen = prog(f, LOCKS[5] + 2, 41, Easing.bezier(0.45, 0, 0.55, 1));
  const breathe = verifying ? 0.75 + 0.25 * Math.cos((f - LOCKS[5]) * 0.9) : 1;
  const textP = prog(f, GRANT, GRANT + 5, EO);
  const check = prog(f, GRANT + 1, GRANT + 6, EO);
  const pulse = prog(f, GRANT + 1, GRANT + 13, EO);
  return (
    <>
      {pulse > 0 && pulse < 1 ? (
        <div
          style={{
            position: "absolute",
            left: PILL.x - 34 * pulse,
            top: PILL.y - 34 * pulse,
            width: PILL.w + 68 * pulse,
            height: PILL.h + 68 * pulse,
            borderRadius: PILL.r + 34 * pulse,
            border: `1.5px solid ${C.acc}`,
            opacity: 0.8 * (1 - pulse),
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: b.x,
          top: b.y,
          width: b.w,
          height: b.h,
          borderRadius: b.r,
          border: `2px solid ${C.acc}`,
          background: fill > 0 ? `rgba(255,59,31,${fill})` : "transparent",
          boxShadow: `0 0 ${26 + 16 * fill}px rgba(255,59,31,${0.45 * breathe}), inset 0 0 18px rgba(255,59,31,${0.18 * (1 - fill)})`,
          overflow: "hidden",
          opacity: breathe,
        }}
      >
        {verifying ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 180,
              left: -180 + (b.w + 180) * sheen,
              background: "linear-gradient(90deg, transparent, rgba(255,59,31,0.22), transparent)",
            }}
          />
        ) : null}
        {textP > 0 ? (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, opacity: textP }}>
            <svg width={26} height={26} viewBox="0 0 26 26">
              <circle cx={13} cy={13} r={12} fill="none" stroke={C.ink} strokeWidth={2} />
              <path d="M7.5 13.5 L11.5 17.2 L18.8 9.4" fill="none" stroke={C.ink} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - check} />
            </svg>
            <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 27, color: C.ink, letterSpacing: "-0.005em", transform: `translateX(${(1 - textP) * 10}px)` }}>Approved</div>
          </div>
        ) : null}
      </div>
    </>
  );
};

/* ---------------- flow stepper + header ---------------- */
const Stepper: React.FC<{ f: number }> = ({ f }) => {
  const inP = prog(f, 0, 10);
  const adv = prog(f, GRANT, GRANT + 7, EO);
  const n3 = prog(f, GRANT + 5, GRANT + 9, EO);
  const y = 240;
  const nodes = [X0 + 6, 1166, 1426];
  const labels = ["Account", "Verify", "Access"];
  const pulse = 0.6 + 0.4 * Math.cos(f * 0.42);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: inP }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* 1 → 2 (done) */}
        <line x1={nodes[0] + 120} y1={y} x2={nodes[1] - 16} y2={y} stroke={C.paper} strokeOpacity={0.55} strokeWidth={1.2} />
        {/* 2 → 3 (pending → done) */}
        <line x1={nodes[1] + 104} y1={y} x2={nodes[2] - 16} y2={y} stroke={C.paper} strokeOpacity={0.2} strokeWidth={1.2} strokeDasharray="2 5" />
        <line x1={nodes[1] + 104} y1={y} x2={lerp(nodes[1] + 104, nodes[2] - 16, adv)} y2={y} stroke={C.paper} strokeOpacity={0.6} strokeWidth={1.2} />
        {/* node 1 — done */}
        <circle cx={nodes[0]} cy={y} r={7} fill={C.paper} fillOpacity={0.7} />
        <path d={`M ${nodes[0] - 3} ${y} l 2 2.2 l 4 -4.2`} stroke={C.ink} strokeWidth={1.6} fill="none" strokeLinecap="round" />
        {/* node 2 — active → done */}
        <circle cx={nodes[1]} cy={y} r={7} fill={adv > 0.5 ? C.paper : "none"} fillOpacity={0.7} stroke={adv > 0.5 ? C.paper : C.acc} strokeOpacity={adv > 0.5 ? 0 : 1} strokeWidth={1.8} />
        {adv <= 0.5 ? <circle cx={nodes[1]} cy={y} r={13} fill="none" stroke={C.acc} strokeOpacity={0.35 * pulse} strokeWidth={1} /> : null}
        {adv > 0.5 ? <path d={`M ${nodes[1] - 3} ${y} l 2 2.2 l 4 -4.2`} stroke={C.ink} strokeWidth={1.6} fill="none" strokeLinecap="round" /> : null}
        {/* node 3 — pending → active */}
        <circle cx={nodes[2]} cy={y} r={7} fill={n3 > 0 ? C.acc : "none"} fillOpacity={n3} stroke={n3 > 0 ? C.acc : C.paper} strokeOpacity={n3 > 0 ? 1 : 0.3} strokeWidth={1.4} />
        {n3 > 0 ? <circle cx={nodes[2]} cy={y} r={7 + 9 * n3} fill="none" stroke={C.acc} strokeOpacity={0.5 * (1 - n3) + 0.2} strokeWidth={1} /> : null}
      </svg>
      {labels.map((l, k) => (
        <Mono
          key={k}
          size={13}
          color={k === 0 ? C.dim : k === 1 ? (adv > 0.5 ? C.dim : C.paper) : n3 > 0 ? C.acc : C.faint}
          style={{ position: "absolute", left: nodes[k] + 18, top: y - 9 }}
        >
          {String(k + 1).padStart(2, "0")} {l}
        </Mono>
      ))}
    </div>
  );
};

const Header: React.FC<{ f: number }> = ({ f }) => {
  const inP = prog(f, 1, 11);
  return (
    <div style={{ position: "absolute", left: X0, top: 272, opacity: inP, transform: `translateY(${(1 - inP) * 10}px)`, display: "flex", alignItems: "baseline", gap: 20 }}>
      <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 32, color: C.paper, letterSpacing: "-0.01em" }}>Enter the 6-digit code</div>
    </div>
  );
};

const Expiry: React.FC<{ f: number }> = ({ f }) => {
  const rem = interpolate(Math.min(f, GRANT), [0, GRANT], [0.74, 0.48], clamp);
  const done = f >= GRANT;
  const y = 560;
  const w = X1 - X0;
  const secs = 29 - Math.floor(Math.min(f, GRANT) / 30);
  const fade = 1 - 0.5 * prog(f, GRANT, GRANT + 8);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: prog(f, 0, 8) }}>
      <div style={{ position: "absolute", left: X0, top: y, width: w, height: 2, background: C.paper, opacity: 0.12, borderRadius: 1 }} />
      <div style={{ position: "absolute", left: X0, top: y, width: w * rem, height: 2, background: C.paper, opacity: 0.75 * fade, borderRadius: 1 }} />
      <div style={{ position: "absolute", left: X0 + w * rem - 1, top: y - 5, width: 2, height: 12, background: C.paper, opacity: 0.9 * fade }} />
      <Mono size={13} color={done ? C.paper : C.dim} style={{ position: "absolute", left: X0, top: y + 20 }}>
        {done ? "Code accepted · 0:" + String(secs).padStart(2, "0") : f >= LOCKS[5] ? "Verifying …" : "Code expires in 0:" + String(secs).padStart(2, "0")}
      </Mono>
    </div>
  );
};

const Motif: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage focus={FOCUS}>
      <DotGrid focus={FOCUS} id="m3" rx={760} ry={420} />
      <Glow x={FOCUS.x} y={RY + SH / 2} r={560} color="rgba(243,236,222,0.05)" />
      <Glow x={PILL.x + PILL.w / 2} y={PILL.y + PILL.h / 2} r={260} opacity={0.55 * prog(f, GRANT - 1, GRANT + 5)} />
      <Stepper f={f} />
      <Header f={f} />
      {CODE.map((_, i) => (
        <Reel key={i} i={i} f={f} />
      ))}
      {/* 3+3 split mark */}
      <div style={{ position: "absolute", left: sx(2) + SW + (MID - 18) / 2 + 2, top: RY + SH / 2 - 1, width: 14, height: 2, background: C.paper, opacity: 0.4 }} />
      <Expiry f={f} />
      <Focus f={f} />
    </Stage>
  );
};

export const Scene: React.FC = () => (
  <ModuleShell index={3} title="MFA & SIGN-UP FLOWS" line={<>Prove it’s you, <Em>painlessly.</Em></>}>
    <AbsoluteFill>
      <Motif />
    </AbsoluteFill>
  </ModuleShell>
);

export const cues: Cue[] = [
  { f: 0, sfx: "glitch-3", vol: 0.28 },
  { f: 0, sfx: "chatter", vol: 0.24 }, // reels spinning
  ...LOCKS.map((l, i) => ({ f: l, sfx: keySfx(i), vol: 0.2 + 0.01 * i })),
  { f: LOCKS[0], sfx: "click", vol: 0.16 },
  { f: LOCKS[4], sfx: "click", vol: 0.16 },
  { f: 36, sfx: "blip-down", vol: 0.16 }, // verifying
  { f: GRANT, sfx: "blip-up", vol: 0.36 }, // approved
  { f: GRANT, sfx: "snap", vol: 0.22 },
  { f: 50, sfx: "swish", vol: 0.3 },
];
