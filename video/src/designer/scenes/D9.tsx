// D9 How I work (film 1080-1200): a winding path across the grid, five big numbered stops on grid intersections, a pulse that reaches one stop per beat from local 15, then the line.
import React from "react";
import { AbsoluteFill, Easing, interpolateColors, useCurrentFrame } from "remotion";
import { prog } from "../../lib/anim";
import { keySfx, type Cue } from "../../lib/cues";
import { draw, pop, wob } from "../motion";
import { G, P } from "../tokens";
import { head, sans } from "../type";
import { RingBadge, ScribbleUnderline, Smiley, Sparkle, Trace, traceGeometry, traceHead, Wobble, type Pt } from "../kit/doodles";

/* ---------------------------------------------------------------- the route */
// stops sit on grid intersections: columns 2,4,6,8,10, rows 3 and 5 alternate (peak / valley)
const STOPS: Pt[] = [
  [G.x(2), G.y(5)],
  [G.x(4), G.y(3)],
  [G.x(6), G.y(5)],
  [G.x(8), G.y(3)],
  [G.x(10), G.y(5)],
];
const E0: Pt = [-40, G.y(4) + 20];
const E1: Pt = [1960, G.y(4) + 20];
const NODE_R = 56;
const T_STOP = [15, 30, 45, 60, 75];
const LABELS = ["DISCOVER & FRAME", "RESEARCH & TEST", "DEFINE THE SYSTEM", "DESIGN & REFINE", "DELIVER & SUPPORT"];

/** dense polyline: a cubic S-curve with horizontal tangents between consecutive points */
const buildRoute = () => {
  const keys: Pt[] = [E0, ...STOPS, E1];
  const pts: Pt[] = [];
  const stopIdx: number[] = [];
  const N = 36;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    const dx = (b[0] - a[0]) * 0.5;
    for (let k = i === 0 ? 0 : 1; k <= N; k++) {
      const t = k / N;
      const u = 1 - t;
      const x = u * u * u * a[0] + 3 * u * u * t * (a[0] + dx) + 3 * u * t * t * (b[0] - dx) + t * t * t * b[0];
      const y = u * u * u * a[1] + 3 * u * u * t * a[1] + 3 * u * t * t * b[1] + t * t * t * b[1];
      pts.push([x, y]);
    }
    if (i < keys.length - 2) stopIdx.push(pts.length - 1);
  }
  return { pts, stopIdx };
};
const ROUTE = buildRoute();
const GEO = traceGeometry(ROUTE.pts, 2);
const STOP_P = ROUTE.stopIdx.map((vi) => GEO.vertex[vi][2] / GEO.total);
const ease = Easing.bezier(0.55, 0, 0.25, 1);

/** pulse progress along the route: reaches stop k exactly on T_STOP[k], then leaves the frame */
const pulseP = (f: number) => {
  const t = [0, ...T_STOP, 108];
  const p = [0, ...STOP_P, 1];
  for (let i = 0; i < t.length - 1; i++) {
    if (f <= t[i + 1]) return p[i] + (p[i + 1] - p[i]) * ease(Math.min(1, Math.max(0, (f - t[i]) / (t[i + 1] - t[i]))));
  }
  return 1;
};

/* ---------------------------------------------------------------- pieces */

const Mask: React.FC<{ left: number; top: number; h: number; p: number; out?: number; children: React.ReactNode; w?: number | string }> = ({ left, top, h, p, out = 0, children, w }) => (
  <div style={{ position: "absolute", left, top, height: h, width: w ?? "max-content", overflow: "hidden", whiteSpace: "nowrap" }}>
    <div style={{ transform: `translateY(${(1 - p) * 125 - out * 125}%)` }}>{children}</div>
  </div>
);

const Headlines: React.FC<{ f: number }> = ({ f }) => {
  const inP = prog(f, -6, 8);
  const outP = prog(f, 70, 77);
  const a = prog(f, 75, 83);
  const b = prog(f, 79, 87);
  return (
    <>
      {f < 78 && (
        <Mask left={G.x(0)} top={96} h={232} p={inP} out={outP}>
          <div style={{ ...head(250, 84), color: P.paper, lineHeight: "232px" }}>
            HOW I <span style={{ color: P.orange }}>WORK</span>
          </div>
        </Mask>
      )}
      {f >= 75 && (
        <>
          <Mask left={G.x(0)} top={82} h={192} p={a}>
            <div style={{ ...head(170, 82), color: P.paper, lineHeight: "192px", textTransform: "none" }}>Research-led.</div>
          </Mask>
          <Mask left={G.x(0)} top={244} h={192} p={b}>
            <div style={{ ...head(170, 82), color: P.void, lineHeight: "192px", textTransform: "none" }}>
              <div style={{ position: "relative", width: "max-content", padding: "0 30px" }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: 18, bottom: 18, background: P.orange, borderRadius: 14, boxShadow: `8px 8px 0 ${P.orangeDeep}` }} />
                <div style={{ position: "relative" }}>Decision-first.</div>
              </div>
            </div>
          </Mask>
          <ScribbleUnderline x={460} y={254} w={800} thickness={14} color={P.yellow} draw={draw(f, 88, 104)} />
        </>
      )}
    </>
  );
};

const Node: React.FC<{ f: number; i: number }> = ({ f, i }) => {
  const [x, y] = STOPS[i];
  const enter = pop(f, i * 2 - 4);
  const t = T_STOP[i];
  const lit = f >= t;
  const bounce = pop(f, t);
  const sc = enter * (lit ? 1 + 0.3 * (1 - bounce) : 1);
  const ring = prog(f, t, t + 14);
  const peak = i % 2 === 1;
  const labColor = interpolateColors(lit ? 1 : 0, [0, 1], [P.dim, P.paper]);
  return (
    <>
      {lit && ring < 1 && (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <circle cx={x} cy={y} r={NODE_R + 6 + ring * 70} fill="none" stroke={P.orange} strokeWidth={6 * (1 - ring) + 1} opacity={1 - ring} />
        </svg>
      )}
      <div
        style={{
          position: "absolute",
          left: x - NODE_R,
          top: y - NODE_R,
          width: NODE_R * 2,
          height: NODE_R * 2,
          boxSizing: "border-box",
          borderRadius: NODE_R,
          border: `6px solid ${lit ? P.void : "rgba(246,238,224,0.6)"}`,
          background: lit ? P.orange : P.card,
          boxShadow: lit ? `7px 7px 0 ${P.orangeDeep}` : "none",
          transform: `scale(${Math.max(0, sc)})`,
          opacity: enter > 0.01 ? 1 : 0,
          textAlign: "center",
          ...head(70, 88),
          lineHeight: `${NODE_R * 2 - 12}px`,
          color: lit ? P.void : P.dim,
        }}
      >
        {i + 1}
      </div>
      <div style={{ position: "absolute", left: x - 200, width: 400, top: peak ? y - NODE_R - 16 - 40 : y + NODE_R + 16, height: 40, overflow: "hidden", textAlign: "center" }}>
        <div style={{ ...sans(760, 82, 28), fontSize: 33, lineHeight: "40px", letterSpacing: "0.02em", whiteSpace: "nowrap", color: labColor, opacity: enter > 0.05 ? 1 : 0 }}>{LABELS[i]}</div>
      </div>
    </>
  );
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const drawOn = prog(f, -8, 16);
  const p = pulseP(f);
  const head0 = traceHead(ROUTE.pts, p, 2);
  const onScreen = p < 0.995;
  const lastLit = f >= T_STOP[4];
  return (
    <AbsoluteFill style={{ background: P.void }}>
      <Headlines f={f} />
      <RingBadge x={1700} y={250} size={290} items={["Discover", "Research", "Define", "Design", "Deliver"]} speed={1.4} bg={P.orange} ink={P.void} centerBg={P.void} pop={pop(f, -2)} rotate={8} shadow={P.orangeDeep}>
        <Smiley x={0} y={0} size={96} />
      </RingBadge>
      <Wobble scale={4} freq={0.012} boil={4} seed={5}>
        <Trace points={ROUTE.pts} progress={drawOn} stroke={8} radius={2} color="rgba(246,238,224,0.2)" pads={[]} />
        <Trace points={ROUTE.pts} progress={p} stroke={10} radius={2} pads={[]} />
      </Wobble>
      {STOPS.map((_, i) => (
        <Node key={i} f={f} i={i} />
      ))}
      {onScreen && (
        <div style={{ position: "absolute", left: head0.x - 26, top: head0.y - 26, width: 52, height: 52, borderRadius: 26, boxSizing: "border-box", background: P.orange, border: `7px solid ${P.paper}`, boxShadow: `5px 5px 0 ${P.void}` }} />
      )}
      {lastLit && <Sparkle x={STOPS[4][0] + 92} y={STOPS[4][1] - 84} size={96} twin color={P.yellow} pop={pop(f, 78) * (1 + 0.1 * Math.sin(f * 0.3))} rotate={wob(f, 6, 40)} />}
    </AbsoluteFill>
  );
};

export const cues: Cue[] = [
  { f: 0, sfx: "swish", vol: 0.4 },
  { f: 2, sfx: "snap", vol: 0.35 },
  ...T_STOP.map((t, i): Cue => ({ f: t, sfx: keySfx(i), vol: 0.45 })),
  { f: 75, sfx: "impact-soft", vol: 0.7 },
  { f: 75, sfx: "snap", vol: 0.45 },
  { f: 78, sfx: "glass-tink", vol: 0.4 },
  { f: 88, sfx: "swish", vol: 0.3 },
];

