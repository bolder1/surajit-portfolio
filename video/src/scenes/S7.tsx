import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { noise2D } from "@remotion/noise";
import { C, mona, mono } from "../lib/theme";
import { clamp, EI, EIO, EO, lerp, rand } from "../lib/anim";
import { Flash, Glow } from "../lib/FX";
import { LightLeak } from "@remotion/light-leaks";
import type { Cue, Sfx } from "../lib/cues";
import face from "../assets/face.json";

/**
 * 07 · GRANTED (120 f) — the final drop. The letterbox opens globally on f0.
 * f0–6    impact. ACCESS DENIED, condensed hairline in vermilion, flickers and shakes like a rejected
 *         password field.
 * f7–14   it collapses into a single vermilion seam that stretches across the frame (the closed door).
 * f15     beat: the seam splits. ACCESS bursts up out of it and GRANTED down, each letter rippling from
 *         condensed-hairline to extended-black (centre out). Chime, flash, warm RGB split, light leak.
 *         The burst throws out the identity graph: his face-mesh points as a drifting network.
 * f45–66  the lockup steps left; f46–90 the graph converges, clockwise, into his initials avatar:
 *         a 120-dot ring (the verification ring from 02) around an SD dot-matrix monogram.
 * f64     SUBJECT · S. DUTTA   SCOPE · 7 DOMAINS types in. f90 avatar locks, presence badge on.
 * f104–117 exit: type wipes up out of its own cap line, the avatar's dots go out from the rim inward.
 */

const HIT = 15;
const LEAK_DUR = 30;
const LEAK_SEED = 9;
const LEAK_HUE = 20; // 0 drifts yellow, 330 goes green; 20 sits on vermilion/amber
const LEAK_O = 0.3;
const SEAM_Y = 540;
const F1 = 318; // ACCESS (sized so both lines are the same width at wdth 125 / wght 900)
const F2 = 268; // GRANTED
const GAP = 34;
const BASE = 0.885; // baseline from line-box top (em) for Mona Sans at line-height 1
const CAPTOP = 0.156; // cap top from line-box top (em)
const TRACK = -0.012;

/* ---------- avatar targets: 120-dot ring + SD dot-matrix ---------- */
type Pt = { x: number; y: number };
const AV: Pt = { x: 1462, y: 540 };
const RING_R = 270;
const P = 14; // dot pitch

/** Hand-set dot-matrix glyphs, 11 × 19, 3-dot strokes with chamfered corners (180° symmetric S). */
const S_MAP = [
  "··●●●●●●●··",
  "·●●●●●●●●●·",
  "●●●●●●●●●●●",
  "●●●·····●●●",
  "●●●·····●●●",
  "●●●········",
  "●●●········",
  "●●●●·······",
  "●●●●●●●●●··",
  "·●●●●●●●●●·",
  "··●●●●●●●●●",
  "·······●●●●",
  "········●●●",
  "········●●●",
  "●●●·····●●●",
  "●●●·····●●●",
  "●●●●●●●●●●●",
  "·●●●●●●●●●·",
  "··●●●●●●●··",
];
const D_MAP = [
  "●●●●●●●····",
  "●●●●●●●●●··",
  "●●●●●●●●●●·",
  "●●●····●●●●",
  "●●●·····●●●",
  "●●●·····●●●",
  "●●●·····●●●",
  "●●●·····●●●",
  "●●●·····●●●",
  "●●●·····●●●",
  "●●●·····●●●",
  "●●●·····●●●",
  "●●●·····●●●",
  "●●●·····●●●",
  "●●●·····●●●",
  "●●●····●●●●",
  "●●●●●●●●●●·",
  "●●●●●●●●●··",
  "●●●●●●●····",
];
const cellsOf = (map: string[]) => map.flatMap((row, y) => row.split("").flatMap((c, x) => (c === "●" ? [{ x, y }] : [])));
const GW = 11;
const GH = 19;
const S_CELLS = cellsOf(S_MAP);
const D_CELLS = cellsOf(D_MAP);
const MONO_COLS = GW * 2 + 3;
const ox = AV.x - ((MONO_COLS - 1) * P) / 2;
const oy = AV.y - ((GH - 1) * P) / 2;

type Target = Pt & { ring: boolean; ang: number };
const angOf = (x: number, y: number) => {
  const a = Math.atan2(y - AV.y, x - AV.x) + Math.PI / 2; // 0 at 12 o'clock, clockwise
  return ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
};
const TARGETS: Target[] = [
  ...Array.from({ length: 120 }, (_, k) => {
    const a = (k / 120) * Math.PI * 2 - Math.PI / 2;
    const x = AV.x + Math.cos(a) * RING_R;
    const y = AV.y + Math.sin(a) * RING_R;
    return { x, y, ring: true, ang: angOf(x, y) };
  }),
  ...S_CELLS.map((c) => ({ x: ox + c.x * P, y: oy + c.y * P, ring: false, ang: 0 })),
  ...D_CELLS.map((c) => ({ x: ox + (c.x + GW + 3) * P, y: oy + c.y * P, ring: false, ang: 0 })),
].map((t) => ({ ...t, ang: angOf(t.x, t.y) }));

/* ---------- identity graph: his face-mesh points, scattered into a network ---------- */
const FP = face.pts as number[][];
const NODES = FP.map((p, i) => ({
  bx: 960 + (p[0] - face.w / 2) * 0.7 + (rand(i * 1.3) - 0.5) * 1560,
  by: 540 + (p[1] - face.h * 0.45) * 0.45 + (rand(i * 2.9) - 0.5) * 820,
  sx: 960 + (rand(i * 7.7) - 0.5) * 1520,
  sy: SEAM_Y + (rand(i * 8.8) - 0.5) * 6,
  d: rand(i * 3.7) * 7,
  hub: rand(i * 4.1) < 0.07,
  hot: rand(i * 6.3) < 0.05,
  o: 0.28 + rand(i * 9.2) * 0.4,
  swirl: (rand(i * 5.5) - 0.5) * 220,
}));

// sources and targets both sorted by angle around the avatar → each point flies roughly radially in
const ORDER = NODES.map((n, i) => ({ i, a: angOf(n.bx, n.by) })).sort((p, q) => p.a - q.a);
const TSORT = TARGETS.map((t, k) => ({ k, a: t.ang })).sort((p, q) => p.a - q.a);
const ASSIGN = new Map<number, number>(); // node index → target index
TSORT.forEach((t, j) => {
  const src = ORDER[Math.floor((j * ORDER.length) / TSORT.length)].i;
  ASSIGN.set(src, t.k);
});
const LX0 = Math.min(...TARGETS.filter((t) => !t.ring).map((t) => t.x));
const LX1 = Math.max(...TARGETS.filter((t) => !t.ring).map((t) => t.x));
/** Ring fills clockwise from 12 o'clock (the verification ring from 02); letters lock in reading order. */
const startOf = (k: number) => {
  const t = TARGETS[k];
  return t.ring ? 47 + (t.ang / (2 * Math.PI)) * 21 + rand(k * 2.3) * 1.5 : 44 + ((t.x - LX0) / (LX1 - LX0)) * 20 + rand(k * 2.3) * 3;
};
const FLIGHT = 20;
const LOCKED = 90; // beat 7: last dot lands at ~f89, the avatar locks on the beat
const flyEase = Easing.bezier(0.7, 0, 0.3, 1);

// identity graph, not a plexus mesh: every identity links to its nearest resource hub (an app / IdP)
const HUBS = NODES.map((n, i) => (n.hub ? i : -1)).filter((i) => i >= 0);
const EDGES: [number, number][] = NODES.flatMap((n, i) => {
  if (n.hub) return [];
  let best = -1;
  let bd = 250;
  for (const h of HUBS) {
    const d = Math.hypot(NODES[h].bx - n.bx, NODES[h].by - n.by);
    if (d < bd) {
      bd = d;
      best = h;
    }
  }
  return best >= 0 && rand(i * 2.71) < 0.8 ? [[i, best] as [number, number]] : [];
});

/* ---------- lockup ---------- */
const ACCESS = "ACCESS";
const GRANTED = "GRANTED";

const Word: React.FC<{ text: string; size: number; hit: number; color: string; glow: boolean; heat?: number; f: number; fps: number }> = ({ text, size, hit, color, glow, heat = 0, f, fps }) => {
  const n = text.length;
  return (
    <div style={{ display: "flex", justifyContent: "center", fontSize: size, lineHeight: 1, letterSpacing: `${TRACK}em`, whiteSpace: "nowrap" }}>
      {text.split("").map((ch, i) => {
        const ord = Math.abs(i - (n - 1) / 2) * 1.1; // ripple from the centre out
        const s = f < hit + ord ? 0 : spring({ frame: f - hit - ord, fps, config: { stiffness: 230, damping: 16, mass: 0.8 } });
        const wd = interpolate(s, [0, 1], [75, 125], clamp);
        const wg = interpolate(s, [0, 1], [200, 900], clamp);
        return (
          <span key={i} style={{ ...mona(wd, wg), color, textShadow: glow ? `0 0 46px rgba(255,59,31,0.5)` : heat > 0.02 ? `0 0 ${30 + 30 * heat}px rgba(255,90,50,${0.85 * heat})` : "none" }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};

const Lockup: React.FC<{ f: number; fps: number; tint?: string; exit: number }> = ({ f, fps, tint, exit }) => {
  const syA = f < HIT ? 0 : spring({ frame: f - HIT, fps, config: { stiffness: 320, damping: 15, mass: 0.7 } });
  const syG = f < HIT + 2 ? 0 : spring({ frame: f - HIT - 2, fps, config: { stiffness: 320, damping: 15, mass: 0.7 } });
  const accessColor = tint ?? C.paper;
  const heat = tint ? 0 : interpolate(f, [HIT, HIT + 10], [1, 0], { ...clamp, easing: EO });
  // exit: each word slides up through a mask fixed at its own top edge
  const eA = interpolate(exit, [0, 0.8], [0, 1], { ...clamp, easing: EI });
  const eG = interpolate(exit, [0.15, 1], [0, 1], { ...clamp, easing: EI });
  const topA = SEAM_Y - GAP / 2 - BASE * F1;
  const topG = SEAM_Y + GAP / 2 - CAPTOP * F2;
  const dA = eA * F1 * 0.95;
  const dG = eG * F2 * 0.95;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: topA,
          transformOrigin: `50% ${BASE * F1}px`,
          transform: `translateY(${-dA}px) scaleY(${Math.max(0.012, syA)})`,
          clipPath: dA > 0 ? `inset(${dA + CAPTOP * F1 - 6}px 0 0 0)` : undefined,
        }}
      >
        <Word text={ACCESS} size={F1} hit={HIT} color={accessColor} glow={false} heat={heat} f={f} fps={fps} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: topG,
          transformOrigin: `50% ${CAPTOP * F2}px`,
          transform: `translateY(${-dG}px) scaleY(${Math.max(0.012, syG)})`,
          clipPath: dG > 0 ? `inset(${dG + CAPTOP * F2 - 6}px 0 0 0)` : undefined,
        }}
      >
        <Word text={GRANTED} size={F2} hit={HIT + 2} color={tint ?? C.acc} glow={!tint} f={f} fps={fps} />
      </div>
    </>
  );
};

/* ---------- scene ---------- */
const MONO_LINE: { t: string; hi?: boolean }[] = [
  { t: "SUBJECT · " },
  { t: "S. DUTTA", hi: true },
  { t: "    SCOPE · " },
  { t: "7 DOMAINS", hi: true },
];
const MONO_LEN = MONO_LINE.reduce((n, s) => n + s.t.length, 0);
const TYPE_AT = 64;

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* camera: push + local shake on the burst (the global shake handles f0) */
  const push = interpolate(f, [HIT, 117], [1, 1.045], clamp);
  const sh = f >= HIT && f < HIT + 14 ? 18 * Math.exp(-(f - HIT) / 3.5) : 0;
  const shx = (rand(f * 1.7 + 3) - 0.5) * 2 * sh;
  const shy = (rand(f * 3.1 + 5) - 0.5) * 2 * sh;

  /* DENIED → seam */
  const deniedOn = f < 7 ? [1, 1, 0, 1, 0, 1, 1][f] : 1;
  const shake = f >= 1 && f < 9 ? Math.sin((f - 1) * Math.PI * 0.9) * 16 * Math.exp(-(f - 1) / 4) : 0;
  const collapse = interpolate(f, [7, 13], [1, 0.012], { ...clamp, easing: EI });
  const seamW = interpolate(f, [9, 14], [700, 1560], { ...clamp, easing: EIO });
  const seamO = interpolate(f, [9, 11, HIT, HIT + 6], [0, 1, 1, 0], clamp);

  /* lockup move */
  const m = interpolate(f, [45, 66], [0, 1], { ...clamp, easing: EIO });
  const exit = interpolate(f, [104, 114], [0, 1], clamp);
  const chroma = interpolate(f, [HIT, HIT + 6], [18, 0], { ...clamp, easing: EO });

  /* identity graph → avatar */
  const netIn = interpolate(f, [24, 42], [0, 1], clamp);
  const pos: Pt[] = [];
  const tArr: number[] = [];
  const strayO: number[] = [];
  NODES.forEach((n, i) => {
    const b = interpolate(f, [HIT + n.d, HIT + n.d + 24], [0, 1], { ...clamp, easing: EO });
    const nx = n.bx + noise2D("nx", i * 0.07, f * 0.012) * 36 - (f - HIT) * 0.25;
    const ny = n.by + noise2D("ny", i * 0.07, f * 0.012) * 26;
    let x = lerp(n.sx, nx, b);
    let y = lerp(n.sy, ny, b);
    const k = ASSIGN.get(i);
    let t = 0;
    let so = 1;
    if (k !== undefined) {
      const tg = TARGETS[k];
      t = flyEase(interpolate(f, [startOf(k), startOf(k) + FLIGHT], [0, 1], clamp));
      const dx = tg.x - x;
      const dy = tg.y - y;
      const len = Math.hypot(dx, dy) || 1;
      const bend = Math.sin(Math.PI * t) * n.swirl;
      x = lerp(x, tg.x, t) + (-dy / len) * bend;
      y = lerp(y, tg.y, t) + (dx / len) * bend;
    } else {
      const g = interpolate(f, [46 + n.d * 2, 72 + n.d * 2], [0, 1], { ...clamp, easing: EI });
      x += (x - AV.x) * 0.25 * g;
      y += (y - AV.y) * 0.25 * g;
      so = 1 - g;
    }
    pos.push({ x, y });
    tArr.push(t);
    strayO.push(so);
  });

  const outro = (k: number) => {
    const tg = TARGETS[k];
    const rim = Math.hypot(tg.x - AV.x, tg.y - AV.y) / RING_R; // 1 on the ring, ~0.5–0.8 inside
    const d = Math.max(0, 1 - rim) * 6; // rim first, centre last; everything gone by f116
    return 1 - interpolate(f, [104 + d, 110 + d], [0, 1], { ...clamp, easing: EI });
  };

  const badge = f < LOCKED ? 0 : spring({ frame: f - LOCKED, fps, config: { stiffness: 300, damping: 14 } }) * (1 - interpolate(f, [111, 116], [0, 1], { ...clamp, easing: EI }));
  const lockPulse = interpolate(f, [LOCKED, LOCKED + 2, 104], [0, 1, 0], clamp);

  const typed = Math.floor(interpolate(f, [TYPE_AT, TYPE_AT + MONO_LEN / 2.2], [0, MONO_LEN], clamp));
  const monoExit = interpolate(f, [104, 111], [0, 1], { ...clamp, easing: EI });

  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${shx}px, ${shy}px) scale(${push})` }}>
        {/* identity graph */}
        {f >= HIT ? (
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {netIn > 0
              ? EDGES.map(([i, j], e) => {
                  const o = 0.11 * netIn * (1 - Math.max(tArr[i], tArr[j])) * Math.min(strayO[i], strayO[j]);
                  if (o < 0.01) return null;
                  return <line key={e} x1={pos[i].x} y1={pos[i].y} x2={pos[j].x} y2={pos[j].y} stroke={C.paper} strokeOpacity={o} strokeWidth={1} />;
                })
              : null}
            {NODES.map((n, i) => {
              const k = ASSIGN.get(i);
              const t = tArr[i];
              const p = pos[i];
              if (k === undefined) {
                if (strayO[i] < 0.02) return null;
                if (n.hub) return <circle key={i} cx={p.x} cy={p.y} r={5} fill="none" stroke={C.paper} strokeWidth={1.25} opacity={0.7 * strayO[i]} />;
                return <rect key={i} x={p.x - 1.3} y={p.y - 1.3} width={2.6} height={2.6} fill={n.hot ? C.acc : C.paper} opacity={(n.hot ? 0.9 : n.o) * strayO[i]} />;
              }
              const tg = TARGETS[k];
              const lockF = startOf(k) + FLIGHT;
              const flash = f >= lockF - 1 && f < lockF + 3;
              const rEnd = tg.ring ? 3.3 : 4.6;
              const s0 = n.hub ? rEnd * 2 : 2.6;
              const size = lerp(s0, rEnd * 2, t) * outro(k);
              if (size < 0.3) return null;
              if (n.hub && t < 0.55) return <circle key={i} cx={p.x} cy={p.y} r={lerp(5, rEnd, t / 0.55)} fill="none" stroke={C.paper} strokeWidth={1.25} opacity={0.7 * outro(k)} />;
              const fill = flash ? C.acc : tg.ring ? C.paper : n.hot && t < 0.5 ? C.acc : C.paper;
              const op = t < 0.98 ? lerp(n.hot ? 0.9 : n.o, 1, t) : tg.ring ? 0.62 + 0.38 * lockPulse : 1;
              return <rect key={i} x={p.x - size / 2} y={p.y - size / 2} width={size} height={size} rx={(size / 2) * t} fill={fill} opacity={op} />;
            })}
          </svg>
        ) : null}

        {/* presence badge: session active */}
        {badge > 0.01 ? (
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <circle cx={AV.x + RING_R * Math.SQRT1_2} cy={AV.y + RING_R * Math.SQRT1_2} r={24 * badge} fill={C.acc} stroke={C.ink} strokeWidth={9 * badge} />
          </svg>
        ) : null}
        {badge > 0.01 ? <Glow x={AV.x + RING_R * Math.SQRT1_2} y={AV.y + RING_R * Math.SQRT1_2} r={90} opacity={0.6 * badge} /> : null}

        {/* DENIED: condensed hairline, flickering, shaking like a rejected field, then collapsing */}
        {f < HIT ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: SEAM_Y - 0.52 * 150,
              display: "flex",
              justifyContent: "center",
              fontSize: 150,
              lineHeight: 1,
              letterSpacing: "0.06em",
              color: C.acc,
              ...mona(75, 200),
              opacity: deniedOn,
              transformOrigin: `50% ${0.52 * 150}px`,
              transform: `translateX(${shake}px) scaleY(${collapse})`,
              textShadow: `0 0 30px ${C.accGlow}`,
              whiteSpace: "nowrap",
            }}
          >
            ACCESS DENIED
          </div>
        ) : null}
        {seamO > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 960 - seamW / 2,
              top: SEAM_Y - 1.5,
              width: seamW,
              height: 3,
              background: f >= HIT && f < HIT + 2 ? "#fff4e6" : C.acc,
              opacity: seamO,
              boxShadow: `0 0 24px 4px ${C.accGlow}`,
            }}
          />
        ) : null}

        {/* ACCESS / GRANTED lockup */}
        {f >= HIT ? (
          <AbsoluteFill
            style={{
              transformOrigin: "960px 540px",
              transform: `translate(${lerp(0, -401, m)}px, ${lerp(0, -12, m)}px) scale(${lerp(1, 0.55, m)})`,
            }}
          >
            <Glow x={960} y={650} r={760} opacity={interpolate(f, [HIT, HIT + 4, 45, 66], [0.6, 0.42, 0.24, 0.18], clamp) * (1 - exit)} />
            {chroma > 0.4 ? (
              <>
                <AbsoluteFill style={{ transform: `translateX(${-chroma}px)`, mixBlendMode: "screen", opacity: 0.85 }}>
                  <Lockup f={f} fps={fps} tint="#ff2a1a" exit={exit} />
                </AbsoluteFill>
                <AbsoluteFill style={{ transform: `translateX(${chroma}px)`, mixBlendMode: "screen", opacity: 0.6 }}>
                  <Lockup f={f} fps={fps} tint="#ffb45a" exit={exit} />
                </AbsoluteFill>
              </>
            ) : null}
            <Lockup f={f} fps={fps} exit={exit} />
          </AbsoluteFill>
        ) : null}

        {/* session summary, set under the lockup once it has moved */}
        {f >= TYPE_AT ? (
          <div
            style={{
              position: "absolute",
              left: 142,
              top: 690,
              fontFamily: mono,
              fontSize: 21,
              letterSpacing: "0.22em",
              color: C.dim,
              whiteSpace: "pre",
              clipPath: `inset(0 ${monoExit * 100}% 0 0)`,
            }}
          >
            {(() => {
              let left = typed;
              return MONO_LINE.map((seg, i) => {
                const t = seg.t.slice(0, Math.max(0, left));
                left -= seg.t.length;
                return (
                  <span key={i} style={{ color: seg.hi ? C.paper : C.dim }}>
                    {t}
                  </span>
                );
              });
            })()}
            {typed < MONO_LEN ? <span style={{ color: C.acc }}>▌</span> : null}
          </div>
        ) : null}
      </AbsoluteFill>

      <Flash at={0} len={7} color={C.acc} max={0.2} />
      {/* the seam bursts: light spreads from the line, not a flat white frame */}
      {f >= HIT && f < HIT + 6 ? (
        <AbsoluteFill
          style={{
            background: "radial-gradient(ellipse 58% 22% at 50% 50%, rgba(255,244,230,0.95) 0%, rgba(255,120,80,0.35) 45%, transparent 75%)",
            opacity: interpolate(f, [HIT, HIT + 5], [1, 0], { ...clamp, easing: EO }),
            transform: `scaleY(${interpolate(f, [HIT, HIT + 5], [0.35, 1.6], clamp)})`,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      ) : null}
      {/* one warm leak on the burst; hue pulled back to vermilion/amber (no magenta) */}
      <Sequence from={HIT} durationInFrames={LEAK_DUR} layout="none">
        <AbsoluteFill style={{ opacity: LEAK_O, mixBlendMode: "screen", pointerEvents: "none" }}>
          <LightLeak durationInFrames={LEAK_DUR} seed={LEAK_SEED} hueShift={LEAK_HUE} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

/* ---------- sound ---------- */
export const cues: Cue[] = [
  // the final drop: letterbox opens on ACCESS DENIED
  { f: 0, sfx: "impact", vol: 0.95 },
  { f: 0, sfx: "boom", vol: 0.7 },
  { f: 1, sfx: "whoosh-rev", vol: 0.42 }, // pulls into the burst, ends on f15
  { f: 1, sfx: "blip-down", vol: 0.32 }, // deny double-beep, 5 f apart, on lit flicker frames
  { f: 6, sfx: "blip-down", vol: 0.3 },
  { f: 13, sfx: "swish", vol: 0.38 },
  // f15: the seam splits
  { f: HIT, sfx: "granted", vol: 0.72 },
  { f: HIT, sfx: "snap", vol: 0.3 },
  { f: HIT + 1, sfx: "glitch-2", vol: 0.3 },
  // the lockup steps aside, the graph converges
  { f: 45, sfx: "whoosh", vol: 0.3 },
  { f: 48, sfx: "chatter", vol: 0.25 },
  ...Array.from({ length: Math.ceil(MONO_LEN / 2.2) }, (_, k) => ({ f: TYPE_AT + k, sfx: `key-${k % 6}` as Sfx, vol: 0.14 })).filter((_, k) => k % 2 === 0),
  { f: 67, sfx: "dial", vol: 0.4 }, // ring fills clockwise
  { f: LOCKED, sfx: "lock", vol: 0.5 },
  { f: LOCKED, sfx: "blip-hi", vol: 0.24 },
  { f: 104, sfx: "whoosh", vol: 0.3 },
];
