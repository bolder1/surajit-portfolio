// The leader: a 1 px line that draws over the 6 f before a label lands, with @remotion/paths evolvePath, and
// fades over the label's 6 f sink. Points are frame px; the SVG covers the whole frame so any object can be
// pointed at. A TextBlock label draws its own short hairline; this one is for leaders that reach from an object
// (a plane, a slab's edge, a word) to its label. Frames are chapter-local.
// Source: v6/V1-DIRECTION.md section 4 (conventions): "Label draws a 6 f leader then appears whole".
import React from "react";
import { useCurrentFrame } from "remotion";
import { evolvePath } from "@remotion/paths";
import { EO, prog } from "../../lib/anim";
import { H, W, supportRgba } from "../tokens";

export type Pt = readonly [number, number];

export type LeaderProps = {
  /** The line, from the object to the label, in frame px (two points for a straight leader, more for an elbow). */
  points: readonly Pt[];
  /** Chapter-local frame the label lands: the line is complete here. */
  at: number;
  /** Drawing length in frames (6). */
  dur?: number;
  /** Chapter-local frame the label's exit begins; the leader fades over `exitDur` from here. */
  exitStart?: number;
  exitDur?: number;
  color?: string;
  width?: number;
  /** A small dot at the first point (the object end), in px; 0 for none. */
  dot?: number;
  opacity?: number;
  style?: React.CSSProperties;
};

/** An SVG path through the points. */
export const leaderPath = (points: readonly Pt[]) => points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");

/** The leader's draw progress 0..1 at frame f (EO over the `dur` frames before `at`). */
export const leaderDraw = (f: number, at: number, dur = 6) => prog(f, at - dur, at, EO);

export const Leader: React.FC<LeaderProps> = ({ points, at, dur = 6, exitStart, exitDur = 6, color, width = 1, dot = 0, opacity = 1, style }) => {
  const f = useCurrentFrame();
  if (f < at - dur) return null;
  if (exitStart !== undefined && f >= exitStart + exitDur) return null;
  const draw = leaderDraw(f, at, dur);
  const fade = exitStart === undefined ? 1 : 1 - prog(f, exitStart, exitStart + exitDur, EO);
  const d = leaderPath(points);
  const c = color ?? supportRgba(0.9);
  const [x0, y0] = points[0];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none", opacity: opacity * fade, ...style }}>
      <path d={d} fill="none" stroke={c} strokeWidth={width} strokeLinecap="butt" strokeLinejoin="miter" {...evolvePath(draw, d)} />
      {dot > 0 ? <circle cx={x0} cy={y0} r={dot / 2} fill={c} opacity={Math.min(1, draw * 3)} /> : null}
    </svg>
  );
};
