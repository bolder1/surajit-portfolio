// Strokes. Every 1 px line a screen component draws is an SVG path here, so it can
// draw on with evolvePath during assembly. Paths sit on pixel centres (offset by a
// half) so a 1 px line renders as one crisp pixel at 1x. One svg per group of paths
// keeps the node count down: a region passes its rules, boxes and hairlines as one list.
import { evolvePath } from "@remotion/paths";
import { stagger } from "./greek";
import { toneColor, useIllus, useIllusMode } from "./theme";
import type { Tone } from "./theme";

export const unit = (v: number) => Math.min(1, Math.max(0, v));

/** A component's own assembly clock: progress p over `span` units, the window a..b as 0..1. */
export const phase = (p: number, a: number, b: number, span = 18) => unit((p * span - a) / (b - a));

/** The entrance curve (EO) for a 0..1 value; the same curve the bars use. */
export const eo = (p: number) => stagger(unit(p), 0, 1, 1, 0);

const H = 0.5;

/** A rounded rectangle path on pixel centres, clockwise from the top-left corner. */
export const rectPath = (x: number, y: number, w: number, h: number, r = 0) => {
  const X = x + H;
  const Y = y + H;
  const W = Math.max(0, w - 1);
  const Hh = Math.max(0, h - 1);
  const R = Math.max(0, Math.min(r, W / 2, Hh / 2));
  if (R <= 0) return `M${X} ${Y} H${X + W} V${Y + Hh} H${X} Z`;
  return [
    `M${X + R} ${Y}`,
    `H${X + W - R}`,
    `A${R} ${R} 0 0 1 ${X + W} ${Y + R}`,
    `V${Y + Hh - R}`,
    `A${R} ${R} 0 0 1 ${X + W - R} ${Y + Hh}`,
    `H${X + R}`,
    `A${R} ${R} 0 0 1 ${X} ${Y + Hh - R}`,
    `V${Y + R}`,
    `A${R} ${R} 0 0 1 ${X + R} ${Y}`,
    "Z",
  ].join(" ");
};

/** A straight line on pixel centres. */
export const linePath = (x1: number, y1: number, x2: number, y2: number) => `M${x1 + H} ${y1 + H} L${x2 + H} ${y2 + H}`;

/** A circle as two arcs, starting at the top. */
export const circlePath = (cx: number, cy: number, r: number) =>
  `M${cx} ${cy - r} A${r} ${r} 0 1 1 ${cx} ${cy + r} A${r} ${r} 0 1 1 ${cx} ${cy - r}`;

/** An open polyline through points. */
export const polyPath = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");

export type StrokeSpec = {
  d: string;
  /** 0..1, the path drawing on from its start. */
  draw?: number;
  tone?: Tone;
  /** A colour that overrides the tone (an artefact value a scene passes). */
  color?: string;
  width?: number;
  /** A dash length; the path is dashed instead of drawn on. */
  dash?: number;
  opacity?: number;
};

export type StrokesProps = {
  x?: number;
  y?: number;
  w: number;
  h: number;
  paths: StrokeSpec[];
  opacity?: number;
};

/** One svg holding a list of 1 px paths, each drawing on with its own `draw`. */
export const Strokes = ({ x = 0, y = 0, w, h, paths, opacity = 1 }: StrokesProps) => {
  const th = useIllus();
  const t = useIllusMode();
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: x, top: y, overflow: "visible", display: "block", opacity }}>
      {paths.map((p, i) => {
        const d = unit(p.draw ?? 1);
        if (d <= 0) return null;
        const ev = p.dash ? null : evolvePath(d, p.d);
        return (
          <path
            key={i}
            d={p.d}
            fill="none"
            stroke={p.color ?? toneColor(th, t, p.tone ?? "stroke")}
            strokeWidth={p.width ?? 1}
            strokeLinecap="butt"
            strokeLinejoin="miter"
            strokeDasharray={p.dash ? `${p.dash} ${p.dash}` : d >= 1 ? undefined : ev?.strokeDasharray}
            strokeDashoffset={p.dash || d >= 1 ? undefined : ev?.strokeDashoffset}
            opacity={p.opacity}
          />
        );
      })}
    </svg>
  );
};

export type OutlineProps = {
  x?: number;
  y?: number;
  w: number;
  h: number;
  radius?: number;
  draw?: number;
  tone?: Tone;
  color?: string;
  opacity?: number;
};

/** A 1 px rounded-rectangle outline drawing on. */
export const Outline = ({ x = 0, y = 0, w, h, radius = 8, draw = 1, tone = "stroke", color, opacity = 1 }: OutlineProps) => (
  <Strokes x={x} y={y} w={w} h={h} opacity={opacity} paths={[{ d: rectPath(0, 0, w, h, radius), draw, tone, color }]} />
);

export type RuleProps = { x?: number; y?: number; length: number; vertical?: boolean; draw?: number; tone?: Tone; opacity?: number };

/** A hairline, horizontal unless `vertical`. */
export const Rule = ({ x = 0, y = 0, length, vertical = false, draw = 1, tone = "stroke", opacity = 1 }: RuleProps) => (
  <Strokes
    x={x}
    y={y}
    w={vertical ? 1 : length}
    h={vertical ? length : 1}
    opacity={opacity}
    paths={[{ d: vertical ? linePath(0, 0, 0, length - 1) : linePath(0, 0, length - 1, 0), draw, tone }]}
  />
);

/** The tone one step above a panel: the surface of an active row, a selected node, a highlighted table row. */
export const rowLift = (lo: string) => {
  const m = lo.match(/rgba?\(([^)]+)\)/);
  if (!m) return lo;
  const p = m[1].split(",").map((v) => parseFloat(v));
  const a = (p.length > 3 ? p[3] : 1) * 0.45;
  return `rgba(${p[0]}, ${p[1]}, ${p[2]}, ${+a.toFixed(4)})`;
};
