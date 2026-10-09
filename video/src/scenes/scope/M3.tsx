import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ModuleShell, Em } from "../../lib/ModuleShell";
import { C, sans } from "../../lib/theme";
import { clamp, EIO, EO, lerp, prog } from "../../lib/anim";
import { keySfx, type Cue } from "../../lib/cues";
import { DotGrid, flashAt, Mono, Stage, Wipe, type Pt } from "../_M1/kit";

/**
 * SCOPE 03 · MFA & SIGN-UP FLOWS (60 f) · "Prove it's you, painlessly."
 * A sign-up step (ACCOUNT → VERIFY → ACCESS) waiting on a one-time code.
 * f0      six slot reels already spinning (motion-blurred); vermilion focus ring on cell 1 (the active input);
 *         stepper lines draw on, nodes snap, labels wipe in; the expiry bar draws on and runs in real time.
 * f4 8 11 15 19 22   reels lock one by one on 16th notes; the focus ring hops to the next cell
 * f22–25  the ring widens over the whole code (the one "verifying" signal)
 * f23–29  SFX quiet
 * f26–30  the ring collapses into a pill and fills → f30 (beat 3) "Approved", check draws, stepper advances
 *         to ACCESS, expiry freezes and dims. Held f30–50, exit f50–58.
 */

const APPROVE = 30;
const CODE = [4, 8, 1, 7, 2, 6];
const LOCKS = [4, 8, 11, 15, 19, 22]; // 16th-note grid (3.75 f)
const SW = 128;
const SH = 180;
const GAP = 14;
const MID = 40;
const X0 = 850;
const RY = 318; // reel top
const sx = (i: number) => X0 + i * (SW + GAP) + (i >= 3 ? MID - GAP : 0);
const X1 = sx(5) + SW; // 1714
const FOCUS: Pt = { x: (X0 + X1) / 2, y: 450 };

type Box = { x: number; y: number; w: number; h: number; r: number };
const slotBox = (i: number): Box => ({ x: sx(i) - 7, y: RY - 7, w: SW + 14, h: SH + 14, r: 24 });
const rowBox: Box = { x: X0 - 7, y: RY - 7, w: X1 - X0 + 14, h: SH + 14, r: 24 };
const PILL: Box = { x: X1 - 252, y: 572, w: 252, h: 58, r: 29 };
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
  const grant = flashAt(f, APPROVE, 10);
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
        background: C.ink2,
        border: `1.5px solid rgba(243,236,222,${0.18 + (locked ? 0.22 : 0) + 0.5 * grant})`,
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
    if (f < LOCKS[0]) return slotBox(0);
    let idx = 0;
    for (let i = 0; i < 5; i++) if (f >= LOCKS[i]) idx = i;
    const t = prog(f, LOCKS[idx], LOCKS[idx] + 2.5, EO);
    return lerpBox(slotBox(idx), slotBox(idx + 1), t);
  }
  const expand = prog(f, LOCKS[5], LOCKS[5] + 3, EIO);
  const b1 = lerpBox(slotBox(5), rowBox, expand);
  const morph = prog(f, APPROVE - 4, APPROVE, Easing.bezier(0.7, 0, 0.2, 1));
  return lerpBox(b1, PILL, morph);
};

const Focus: React.FC<{ f: number }> = ({ f }) => {
  const b = focusBox(f);
  const fill = prog(f, APPROVE - 2, APPROVE, EO);
  // the module's one glow: the pill flares on the approve beat and settles for the hold
  const glow = fill * (6 + 18 * flashAt(f, APPROVE, 12));
  const textP = prog(f, APPROVE, APPROVE + 4, EO);
  const check = prog(f, APPROVE + 1, APPROVE + 6, EO);
  return (
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
        boxShadow: glow > 0.3 ? `0 0 ${glow.toFixed(1)}px rgba(255,59,31,0.5)` : "none",
        overflow: "hidden",
      }}
    >
      {textP > 0 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            clipPath: `inset(0 ${(1 - textP) * 100}% 0 0)`,
          }}
        >
          <svg width={26} height={26} viewBox="0 0 26 26">
            <circle cx={13} cy={13} r={12} fill="none" stroke={C.ink} strokeWidth={2} />
            <path d="M7.5 13.5 L11.5 17.2 L18.8 9.4" fill="none" stroke={C.ink} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - check} />
          </svg>
          <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 27, color: C.ink, letterSpacing: "-0.005em" }}>Approved</div>
        </div>
      ) : null}
    </div>
  );
};

/* ---------------- flow stepper ---------------- */
const ST_Y = 262;
const NODES = [X0 + 6, X0 + 300, X0 + 580];
const LABELS = ["Account", "Verify", "Access"];
const LABEL_W = [131, 118, 118]; // 16 px JetBrains Mono, 0.22em tracking

const Stepper: React.FC<{ f: number }> = ({ f }) => {
  const y = ST_Y;
  const adv = prog(f, APPROVE, APPROVE + 7, EO);
  const n3 = f >= APPROVE + 5;
  const snap = (k: number) => prog(f, k * 2, k * 2 + 3, Easing.out(Easing.back(2)));
  const l1a = NODES[0] + 18 + LABEL_W[0] + 14;
  const l1b = NODES[1] - 16;
  const l2a = NODES[1] + 18 + LABEL_W[1] + 14;
  const l2b = NODES[2] - 16;
  const draw1 = prog(f, 1, 9, EO);
  const draw2 = prog(f, 4, 12, EO);
  const check = (cx: number) => <path d={`M ${cx - 3} ${y} l 2 2.2 l 4 -4.2`} stroke={C.ink} strokeWidth={1.6} fill="none" strokeLinecap="round" />;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* 1 → 2 (done) */}
        <line x1={l1a} y1={y} x2={lerp(l1a, l1b, draw1)} y2={y} stroke={C.paper} strokeOpacity={0.55} strokeWidth={1.2} />
        {/* 2 → 3 (pending → done) */}
        <line x1={l2a} y1={y} x2={lerp(l2a, l2b, draw2)} y2={y} stroke={C.paper} strokeOpacity={0.25} strokeWidth={1.2} strokeDasharray="2 5" />
        <line x1={l2a} y1={y} x2={lerp(l2a, l2b, adv)} y2={y} stroke={C.paper} strokeOpacity={0.6} strokeWidth={1.2} />
        {/* node 1: done */}
        <g transform={`translate(${NODES[0]} ${y}) scale(${snap(0)}) translate(${-NODES[0]} ${-y})`}>
          <circle cx={NODES[0]} cy={y} r={8} fill={C.paper} fillOpacity={0.7} />
          {check(NODES[0])}
        </g>
        {/* node 2: active → done */}
        <g transform={`translate(${NODES[1]} ${y}) scale(${snap(1)}) translate(${-NODES[1]} ${-y})`}>
          {adv > 0.5 ? (
            <>
              <circle cx={NODES[1]} cy={y} r={8} fill={C.paper} fillOpacity={0.7} />
              {check(NODES[1])}
            </>
          ) : (
            <circle cx={NODES[1]} cy={y} r={7} fill="none" stroke={C.paper} strokeWidth={2} />
          )}
        </g>
        {/* node 3: pending → active */}
        <g transform={`translate(${NODES[2]} ${y}) scale(${snap(2)}) translate(${-NODES[2]} ${-y})`}>
          <circle cx={NODES[2]} cy={y} r={7} fill="none" stroke={C.paper} strokeOpacity={n3 ? 1 : 0.45} strokeWidth={n3 ? 2 : 1.4} strokeDasharray={n3 ? undefined : "2 3"} />
        </g>
      </svg>
      {LABELS.map((l, k) => {
        const active = k === 1 ? adv <= 0.5 : k === 2 ? n3 : false;
        return (
          <Wipe key={k} p={prog(f, 2 + k * 2, 10 + k * 2, EO)} style={{ position: "absolute", left: NODES[k] + 18, top: y - 11 }}>
            <Mono size={16} color={active ? C.paper : k === 2 ? "rgba(243,236,222,0.5)" : C.dim}>
              {String(k + 1).padStart(2, "0")} {l}
            </Mono>
          </Wipe>
        );
      })}
    </div>
  );
};

/* ---------------- expiry (real time: a 30 s code with ~21 s left) ---------------- */
const LEFT_S = 21.4;
const Expiry: React.FC<{ f: number }> = ({ f }) => {
  const t = Math.min(f, APPROVE); // frozen once approved
  const remS = LEFT_S - t / 30;
  const rem = remS / 30;
  const y = 534;
  const w = X1 - X0;
  const draw = prog(f, 0, 10, EO);
  const dim = f >= APPROVE ? 0.35 : 1;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: dim }}>
      <div style={{ position: "absolute", left: X0, top: y, width: w * draw, height: 2, background: C.paper, opacity: 0.14, borderRadius: 1 }} />
      <div style={{ position: "absolute", left: X0, top: y, width: w * rem * draw, height: 2, background: C.paper, opacity: 0.75, borderRadius: 1 }} />
      {draw > 0.98 ? <div style={{ position: "absolute", left: X0 + w * rem - 1, top: y - 5, width: 2, height: 12, background: C.paper, opacity: 0.9 }} /> : null}
      <Wipe p={prog(f, 3, 11, EO)} style={{ position: "absolute", left: X0, top: y + 20 }}>
        <Mono size={16} color="rgba(243,236,222,0.6)">Code expires in 0:{String(Math.floor(remS)).padStart(2, "0")}</Mono>
      </Wipe>
    </div>
  );
};

const Motif: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage focus={FOCUS}>
      <DotGrid focus={FOCUS} id="m3" rx={760} ry={420} />
      <Stepper f={f} />
      {CODE.map((_, i) => (
        <Reel key={i} i={i} f={f} />
      ))}
      {/* 3+3 split mark */}
      <div style={{ position: "absolute", left: sx(2) + SW + (MID - 14) / 2, top: RY + SH / 2 - 1, width: 14, height: 2, background: C.paper, opacity: 0.4 }} />
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
  // one key per reel lock (six variants, rising slightly); no spin texture, no cut glitch
  ...LOCKS.map((l, i) => ({ f: l, sfx: keySfx(i), vol: 0.2 + 0.012 * i })),
  // f23–29: quiet while the ring verifies and collapses
  { f: APPROVE, sfx: "blip-up", vol: 0.36 }, // approved
  { f: APPROVE, sfx: "snap", vol: 0.22 },
];
