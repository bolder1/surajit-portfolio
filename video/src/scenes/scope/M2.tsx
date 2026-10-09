import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ModuleShell, Em } from "../../lib/ModuleShell";
import { C, dots, mono } from "../../lib/theme";
import { clamp, EIO, EO, prog } from "../../lib/anim";
import { Glow } from "../../lib/FX";
import type { Cue } from "../../lib/cues";
import { DotGrid, flashAt, Mono, Stage, Wipe, type Pt } from "../_M1/kit";

/**
 * SCOPE 02 · PASSWORD VAULT (60 f) — "Secrets, kept simple."
 * A blueprint combination dial on a slowly yawing 3D plane (rings on separate depth layers → parallax).
 * f0   dial already spinning (ratchet) → f15 snaps to 37 (beat 2)
 * f17  reverses → f30 snaps to 82 (beat 3)
 * f31  short turn → f37 snaps to 14 (8th after beat 3); readout locks each pair in Doto
 * f38–44 eight bolts retract into the door, one after another
 * f45  (beat 4) centre slot turns 90° and glows vermilion — UNLOCKED, grant pulse; f49–57 exit.
 */

const O: Pt = { x: 1508, y: 520 };
const DIAL_SCALE = 0.86;
const GRANT = 45;
const SZ = 760; // layer box
const H = SZ / 2;
const COMBO = [37, 82, 14];
const SNAPS = [15, 30, 37];

/* ---------------- dial angle (deg, clockwise) ---------------- */
const A = (n: number) => -n * 3.6;
const A1 = A(COMBO[0]); // -133.2
const A2 = A(COMBO[1]) + 360; // 64.8   (turn back the other way)
const A3 = A(COMBO[2]); // -50.4
const settle = (f: number, at: number, amp: number) => (f >= at ? amp * Math.exp(-(f - at) / 2.2) * Math.sin((f - at) * 1.9) : 0);
const dialAngle = (f: number) => {
  let a: number;
  if (f <= SNAPS[0]) a = interpolate(f, [0, SNAPS[0]], [A1 + 330, A1], { ...clamp, easing: Easing.bezier(0.12, 0.55, 0.25, 1) });
  else if (f <= SNAPS[1]) a = interpolate(f, [SNAPS[0] + 2, SNAPS[1]], [A1, A2], { ...clamp, easing: Easing.bezier(0.55, 0, 0.2, 1) });
  else a = interpolate(f, [SNAPS[1] + 1, SNAPS[2]], [A2, A3], { ...clamp, easing: Easing.bezier(0.5, 0, 0.2, 1) });
  return a + settle(f, SNAPS[0], -4) + settle(f, SNAPS[1], 4) + settle(f, SNAPS[2], -3.5);
};
const reading = (a: number) => {
  const n = Math.round(-a / 3.6) % 100;
  return (n + 100) % 100;
};

/* ---------------- helpers ---------------- */
const polar = (r: number, deg: number) => {
  const t = ((deg - 90) * Math.PI) / 180; // 0° = 12 o'clock, clockwise
  return { x: Math.cos(t) * r, y: Math.sin(t) * r };
};
const Layer: React.FC<{ z: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ z, children, style }) => (
  <div style={{ position: "absolute", left: -H, top: -H, width: SZ, height: SZ, transform: `translateZ(${z}px)`, ...style }}>
    <svg width={SZ} height={SZ} viewBox={`${-H} ${-H} ${SZ} ${SZ}`} style={{ overflow: "visible" }}>
      {children}
    </svg>
  </div>
);
const ring = (r: number, o: number, w = 1, dash?: string, rot = 0) => (
  <circle r={r} fill="none" stroke={C.paper} strokeOpacity={o} strokeWidth={w} strokeDasharray={dash} transform={rot ? `rotate(${rot})` : undefined} />
);

const BOLTS = Array.from({ length: 8 }, (_, k) => 22.5 + k * 45);
const R_BOLT_LOCK = 276;
const BOLT_LEN = 54;
const BOLT_RETRACT = 38;

/* ---------------- dial ---------------- */
const Dial: React.FC<{ f: number }> = ({ f }) => {
  const a = dialAngle(f);
  const yaw = interpolate(f, [0, 60], [-22, -7], { ...clamp, easing: EIO });
  const pitch = interpolate(f, [0, 60], [9, 3], { ...clamp, easing: EIO });
  const snapFl = Math.max(...SNAPS.map((s) => flashAt(f, s, 7)));
  const aligned = f >= SNAPS[2];
  const open = prog(f, GRANT - 3, GRANT + 4, Easing.out(Easing.back(1.7)));
  const glowP = prog(f, GRANT - 2, GRANT + 3);
  const pulse = prog(f, GRANT, GRANT + 13, EO);
  const pulse2 = prog(f, GRANT + 3, GRANT + 16, EO);
  const inP = prog(f, 0, 10);

  return (
    <div style={{ position: "absolute", inset: 0, perspective: 1500, perspectiveOrigin: `${O.x - 260}px ${O.y}px` }}>
      <div
        style={{
          position: "absolute",
          left: O.x,
          top: O.y,
          width: 0,
          height: 0,
          transformStyle: "preserve-3d",
          transform: `rotateX(${pitch}deg) rotateY(${yaw}deg) scale(${DIAL_SCALE})`,
        }}
      >
        {/* z −50: frame, sockets, outer hairline */}
        <Layer z={-50}>
          {ring(340, 0.14)}
          {ring(316, 0.45, 1.2)}
          {Array.from({ length: 120 }, (_, i) => {
            const p1 = polar(316, i * 3);
            const p2 = polar(i % 10 === 0 ? 330 : 322, i * 3);
            return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={C.paper} strokeOpacity={i % 10 === 0 ? 0.5 : 0.18} strokeWidth={1} />;
          })}
          {BOLTS.map((d, k) => (
            <rect key={k} x={-10} y={-(316 + 16)} width={20} height={26} rx={3} fill="none" stroke={C.paper} strokeOpacity={0.3} strokeWidth={1} transform={`rotate(${d})`} />
          ))}
        </Layer>

        {/* z −20: bolts */}
        <Layer z={-20}>
          {BOLTS.map((d, k) => {
            const p = prog(f, 38 + k * 0.8, 45 + k * 0.8, Easing.out(Easing.back(1.5)));
            const r0 = R_BOLT_LOCK - BOLT_RETRACT * p;
            return (
              <g key={k} transform={`rotate(${d})`}>
                <rect x={-7} y={-(r0 + BOLT_LEN)} width={14} height={BOLT_LEN} rx={4} fill={C.ink} stroke={C.paper} strokeOpacity={0.7} strokeWidth={1.3} />
                <line x1={0} y1={-(r0 + 8)} x2={0} y2={-(r0 + BOLT_LEN - 8)} stroke={C.paper} strokeOpacity={0.3} strokeWidth={1} />
              </g>
            );
          })}
        </Layer>

        {/* z 0: door face */}
        <Layer z={0}>
          <circle r={288} fill={C.ink} fillOpacity={0.55} stroke={C.paper} strokeOpacity={0.75} strokeWidth={1.5} />
          {ring(274, 0.22, 1, "40 8", f * 0.9 + a * 0.12)}
          {ring(240, 0.12)}
        </Layer>

        {/* z 22: combination dial (ticks + numerals) */}
        <Layer z={22}>
          <g transform={`rotate(${a})`}>
            {ring(232, 0.5, 1.2)}
            {Array.from({ length: 100 }, (_, i) => {
              const major = i % 10 === 0;
              const mid = i % 5 === 0;
              const r1 = major ? 206 : mid ? 214 : 222;
              const p1 = polar(r1, i * 3.6);
              const p2 = polar(230, i * 3.6);
              return (
                <line
                  key={i}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={C.paper}
                  strokeOpacity={major ? 0.95 : mid ? 0.6 : 0.3}
                  strokeWidth={major ? 1.6 : 1}
                />
              );
            })}
            {Array.from({ length: 10 }, (_, k) => (
              <text
                key={k}
                transform={`rotate(${k * 36}) translate(0 ${-186})`}
                textAnchor="middle"
                dominantBaseline="central"
                fill={C.paper}
                fillOpacity={0.85}
                style={{ fontFamily: mono, fontSize: 16, letterSpacing: "0.05em" }}
              >
                {String(k * 10).padStart(2, "0")}
              </text>
            ))}
            {ring(168, 0.3)}
          </g>
        </Layer>

        {/* z 40: inner counter-rotating rings + knurl */}
        <Layer z={40}>
          {ring(150, 0.45, 1.2, "2 8", -a * 0.6 + f * 0.4)}
          {ring(128, 0.7, 1.4)}
          <g transform={`rotate(${a * 0.5})`}>
            {Array.from({ length: 60 }, (_, i) => {
              const p1 = polar(106, i * 6);
              const p2 = polar(116, i * 6);
              return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={C.paper} strokeOpacity={0.28} strokeWidth={1} />;
            })}
          </g>
        </Layer>

        {/* z 60: centre disc + slot + fixed index */}
        <Layer z={60}>
          <defs>
            <radialGradient id="m2-core">
              <stop offset="0" stopColor={C.acc} stopOpacity={0.75} />
              <stop offset="0.45" stopColor={C.acc} stopOpacity={0.22} />
              <stop offset="1" stopColor={C.acc} stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle r={150 * (0.6 + 0.4 * glowP)} fill="url(#m2-core)" opacity={glowP * 0.7} />
          <circle r={96} fill={C.ink} stroke={C.paper} strokeOpacity={0.75} strokeWidth={1.5} />
          {ring(84, 0.18)}
          <g transform={`rotate(${90 * open})`}>
            <rect x={-9} y={-40} width={18} height={80} rx={9} fill={C.acc} opacity={glowP} style={{ filter: `drop-shadow(0 0 ${16 * glowP}px ${C.acc})` }} />
            <rect x={-9} y={-40} width={18} height={80} rx={9} fill="none" stroke={glowP > 0.5 ? C.acc : C.paper} strokeWidth={1.5} />
            <line x1={-30} y1={0} x2={-18} y2={0} stroke={C.paper} strokeOpacity={0.4} />
            <line x1={18} y1={0} x2={30} y2={0} stroke={C.paper} strokeOpacity={0.4} />
          </g>
          {/* fixed index: reticle + triangle at 12 o'clock */}
          <line x1={0} y1={-100} x2={0} y2={-202} stroke={aligned || snapFl > 0.02 ? C.acc : C.paper} strokeOpacity={aligned ? 0.8 : 0.2 + 0.7 * snapFl} strokeWidth={1.2} />
          <polygon points={`0,${-236} -9,${-252} 9,${-252}`} fill={aligned || snapFl > 0.3 ? C.acc : C.paper} style={{ filter: aligned ? `drop-shadow(0 0 8px ${C.accGlow})` : undefined }} />
          {/* grant pulse */}
          {pulse > 0 && pulse < 1 ? <circle r={96 + 250 * pulse} fill="none" stroke={C.acc} strokeWidth={1.6} opacity={0.85 * (1 - pulse)} /> : null}
          {pulse2 > 0 && pulse2 < 1 ? <circle r={96 + 220 * pulse2} fill="none" stroke={C.paper} strokeWidth={1} opacity={0.4 * (1 - pulse2)} /> : null}
        </Layer>
      </div>
      {/* fade-in veil for the first frames (dial is visible from f0) */}
      <AbsoluteFill style={{ background: C.ink, opacity: 0.35 * (1 - inP), pointerEvents: "none" }} />
    </div>
  );
};

/* ---------------- readout ---------------- */
const Readout: React.FC<{ f: number }> = ({ f }) => {
  const a = dialAngle(f);
  const live = reading(a);
  const inP = prog(f, 3, 11, EO);
  const opened = f >= GRANT;
  const st = flashAt(f, GRANT, 10);
  const groups = COMBO.map((n, g) => {
    const startLive = g === 0 ? 0 : SNAPS[g - 1];
    const locked = f >= SNAPS[g];
    const isLive = !locked && f >= startLive;
    const fl = flashAt(f, SNAPS[g], 7);
    const txt = locked ? String(n).padStart(2, "0") : isLive ? String(live).padStart(2, "0") : "--";
    const color = fl > 0.25 ? C.acc : locked ? C.paper : isLive ? "rgba(243,236,222,0.7)" : C.faint;
    return (
      <span key={g} style={{ color, textShadow: fl > 0.25 ? `0 0 18px ${C.accGlow}` : "none", display: "inline-block", width: "1.25em", textAlign: "center" }}>
        {txt}
      </span>
    );
  });
  return (
    <Wipe p={inP} style={{ position: "absolute", left: 830, top: 398 }}>
      <Mono size={14}>Combination</Mono>
      <div style={{ fontFamily: dots, fontWeight: 800, fontSize: 60, lineHeight: 1, marginTop: 14, display: "flex", alignItems: "center", gap: 2 }}>
        {groups[0]}
        <span style={{ color: C.faint, fontSize: 30 }}>·</span>
        {groups[1]}
        <span style={{ color: C.faint, fontSize: 30 }}>·</span>
        {groups[2]}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18 }}>
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: 5,
            background: opened ? C.acc : "transparent",
            border: `1.5px solid ${opened ? C.acc : C.dim}`,
            boxShadow: opened ? `0 0 ${10 + 14 * st}px ${C.accGlow}` : "none",
          }}
        />
        <Mono size={14} color={opened ? C.acc : C.dim}>
          {opened ? "Vault · open" : f >= SNAPS[2] ? "Bolts · retracting" : "Vault · sealed"}
        </Mono>
      </div>
    </Wipe>
  );
};

const Blueprint: React.FC<{ f: number }> = ({ f }) => {
  const draw = prog(f, 0, 14, EO);
  const x0 = 790;
  const x1 = 1800;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <line x1={x0} y1={O.y} x2={x0 + (x1 - x0) * draw} y2={O.y} stroke={C.paper} strokeOpacity={0.16} strokeWidth={1} strokeDasharray="6 6" />
      {Array.from({ length: 26 }, (_, i) => {
        const x = x0 + i * 40;
        if (x > x0 + (x1 - x0) * draw) return null;
        const big = i % 5 === 0;
        return <line key={i} x1={x} y1={O.y - (big ? 8 : 4)} x2={x} y2={O.y + (big ? 8 : 4)} stroke={C.paper} strokeOpacity={big ? 0.3 : 0.16} strokeWidth={1} />;
      })}
      <line x1={O.x} y1={O.y - 380 * draw} x2={O.x} y2={O.y + 380 * draw} stroke={C.paper} strokeOpacity={0.08} strokeWidth={1} />
    </svg>
  );
};

const Motif: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage focus={O} exitA={51}>
      <DotGrid focus={O} id="m2" rx={700} ry={460} />
      <Glow x={O.x} y={O.y} r={520} color="rgba(243,236,222,0.06)" />
      <Glow x={O.x} y={O.y} r={300} opacity={0.32 * prog(f, GRANT - 2, GRANT + 6)} />
      <Blueprint f={f} />
      <Dial f={f} />
      <Readout f={f} />
    </Stage>
  );
};

export const Scene: React.FC = () => (
  <ModuleShell index={2} title="PASSWORD VAULT" line={<>Secrets, <Em>kept simple.</Em></>}>
    <AbsoluteFill>
      <Motif />
    </AbsoluteFill>
  </ModuleShell>
);

export const cues: Cue[] = [
  { f: 0, sfx: "dial", vol: 0.5 }, // dial already spinning: ratchet decelerates into…
  { f: SNAPS[0], sfx: "snap", vol: 0.32 }, // …37
  { f: SNAPS[0], sfx: "click-lo", vol: 0.2 },
  { f: SNAPS[0] + 2, sfx: "dial", vol: 0.38 }, // turn back
  { f: SNAPS[1], sfx: "snap", vol: 0.32 }, // 82
  { f: SNAPS[1] + 1, sfx: "dial", vol: 0.28 },
  { f: SNAPS[2], sfx: "snap", vol: 0.36 }, // 14
  { f: SNAPS[2], sfx: "click-lo", vol: 0.22 },
  { f: 39, sfx: "click-lo", vol: 0.2 }, // bolts retract
  { f: 41, sfx: "click", vol: 0.15 },
  { f: 43, sfx: "click-lo", vol: 0.18 },
  { f: GRANT, sfx: "lock", vol: 0.56 }, // slot turns: open
];
