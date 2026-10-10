// The alias chain: a 1 px path through points, drawn on with evolvePath. Nodes are
// vertex indices that get a 6 px hollow circle scaling in (no overshoot) as the head
// passes them; the terminal is a 10 px filled circle at the last point. The pop lasts
// `popFrames` of a `drawFrames` draw, so the kit stays frame-free while the scene
// states its timing. Retracting (`draw` back to 0) unpops them in reverse.
import { evolvePath } from "@remotion/paths";
import { useMemo } from "react";
import { Easing } from "remotion";
import { alpha, useIllus } from "./theme";

export type WirePt = { x: number; y: number };
export type WireColor = "state" | "stroke" | (string & {});

export type WireProps = {
  points: WirePt[];
  nodes?: number[];
  /** 0..1, the head along the path. */
  draw?: number;
  color?: WireColor;
  width?: number;
  node?: number;
  terminal?: number;
  /** The floor behind a hollow node, so the wire does not show through it; "none" leaves it a ring. */
  nodeFill?: string;
  popFrames?: number;
  drawFrames?: number;
  opacity?: number;
};

// The film's entrance curve, the same bezier the shared anim helpers define; the kit does not import from there.
const EO = Easing.bezier(0.16, 1, 0.3, 1);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** The path through the points and each vertex's position along it as a fraction of its length. */
export const wireGeometry = (points: WirePt[]) => {
  const cum: number[] = [0];
  for (let i = 1; i < points.length; i++) cum.push(cum[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
  const total = cum[cum.length - 1] || 1;
  return { d: points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" "), at: cum.map((c) => c / total), total };
};

export const Wire = ({
  points,
  nodes = [],
  draw = 1,
  color = "state",
  width = 1,
  node = 6,
  terminal = 10,
  nodeFill = "none",
  popFrames = 4,
  drawFrames = 42,
  opacity = 1,
}: WireProps) => {
  const th = useIllus();
  const c = color === "state" ? th.state : color === "stroke" ? alpha(th.stroke, 1) : color;
  const geo = useMemo(() => wireGeometry(points), [points]);
  const d = clamp01(draw);
  const pop = popFrames / Math.max(1, drawFrames);
  const e = evolvePath(d, geo.d);
  const last = points[points.length - 1];
  const termP = EO(clamp01((d - (1 - pop)) / pop));
  if (points.length < 2) return null;
  return (
    <svg width={1} height={1} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", display: "block", opacity, pointerEvents: "none" }}>
      <path d={geo.d} fill="none" stroke={c} strokeWidth={width} strokeLinejoin="round" strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />
      {nodes.map((i) => {
        const p = points[i];
        if (!p) return null;
        const k = EO(clamp01((d - geo.at[i]) / pop));
        if (k <= 0) return null;
        return <circle key={i} cx={p.x} cy={p.y} r={(node / 2) * k} fill={nodeFill} stroke={c} strokeWidth={width} />;
      })}
      {termP > 0 ? <circle cx={last.x} cy={last.y} r={(terminal / 2) * termP} fill={c} /> : null}
    </svg>
  );
};
