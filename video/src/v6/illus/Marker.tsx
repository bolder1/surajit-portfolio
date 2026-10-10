// The anatomy marker: a 1 px line from a point on a component, an 8 px dot at the
// far end, and a label the scene docks beyond the dot (a TextBlock, never drawn
// here). `draw` runs the line first and the dot after it, in the proportion of the
// frames the scene gives (6 f line, 2 f dot by default). Redrawn after the file's
// own marker style; nothing of the file is placed.
import { evolvePath } from "@remotion/paths";
import { alpha, useIllus } from "./theme";

export type MarkerDir = "up" | "down" | "left" | "right";
export type MarkerColor = "stroke" | "state" | (string & {});

export type MarkerProps = {
  at: { x: number; y: number };
  dir?: MarkerDir;
  length?: number;
  dot?: number;
  /** 0..1: the line draws, then the dot. */
  draw?: number;
  /** "stroke" (the support role at full alpha), "state", or a colour. */
  color?: MarkerColor;
  lineFrames?: number;
  dotFrames?: number;
  opacity?: number;
};

const DIRS: Record<MarkerDir, { x: number; y: number }> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };

/** The far end of a marker's line (the dot's centre). */
export const markerEnd = (at: { x: number; y: number }, dir: MarkerDir = "up", length = 48) => ({ x: at.x + DIRS[dir].x * length, y: at.y + DIRS[dir].y * length });

/** Where a label docks: `gap` px beyond the dot, continuing the marker's direction. */
export const markerAnchor = (at: { x: number; y: number }, dir: MarkerDir = "up", length = 48, dot = 8, gap = 12) => {
  const e = markerEnd(at, dir, length);
  return { x: e.x + DIRS[dir].x * (dot / 2 + gap), y: e.y + DIRS[dir].y * (dot / 2 + gap), dir };
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const Marker = ({ at, dir = "up", length = 48, dot = 8, draw = 1, color = "stroke", lineFrames = 6, dotFrames = 2, opacity = 1 }: MarkerProps) => {
  const th = useIllus();
  const c = color === "stroke" ? alpha(th.stroke, 1) : color === "state" ? th.state : color;
  const d = clamp01(draw);
  const split = lineFrames / (lineFrames + dotFrames);
  const lineP = clamp01(d / split);
  const dotP = clamp01((d - split) / (1 - split));
  const end = markerEnd(at, dir, length);
  const path = `M${at.x} ${at.y} L${end.x} ${end.y}`;
  const e = evolvePath(lineP, path);
  return (
    <svg width={1} height={1} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", display: "block", opacity, pointerEvents: "none" }}>
      <path d={path} fill="none" stroke={c} strokeWidth={1} strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />
      {dotP > 0 ? <circle cx={end.x} cy={end.y} r={(dot / 2) * dotP} fill={c} /> : null}
    </svg>
  );
};
