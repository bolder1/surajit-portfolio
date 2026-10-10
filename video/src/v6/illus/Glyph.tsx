// The eight anatomy glyphs the kit may draw inside a redrawn component. Each is at
// most two strokes on a 16-unit grid, 1 px at 1x; the stroke scales with the
// component when a scene scales it, which is correct. No icon library, nothing else.
import { useIllus } from "./theme";

export type GlyphName = "check-circle" | "x-circle" | "triangle" | "info-circle" | "circle" | "x" | "chevron" | "search";

export const GLYPH_NAMES: GlyphName[] = ["check-circle", "x-circle", "triangle", "info-circle", "circle", "x", "chevron", "search"];

export type GlyphProps = {
  name: GlyphName;
  size?: number;
  color?: string;
  x?: number;
  y?: number;
  /** 0..1, the strokes drawing on. */
  draw?: number;
  /** Degrees about the centre (a chevron opens at 90). */
  rotate?: number;
  opacity?: number;
};

type Stroke = { kind: "circle"; cx: number; cy: number; r: number } | { kind: "path"; d: string };

const circle = (cx: number, cy: number, r: number): Stroke => ({ kind: "circle", cx, cy, r });
const path = (d: string): Stroke => ({ kind: "path", d });

const STROKES: Record<GlyphName, Stroke[]> = {
  circle: [circle(8, 8, 6.5)],
  "check-circle": [circle(8, 8, 6.5), path("M5 8.2 L7.2 10.4 L11.2 6")],
  "x-circle": [circle(8, 8, 6.5), path("M5.5 5.5 L10.5 10.5 M10.5 5.5 L5.5 10.5")],
  triangle: [path("M8 2.5 L14.5 13.5 H1.5 Z"), path("M8 6.5 V9.5")],
  "info-circle": [circle(8, 8, 6.5), path("M8 7.2 V11.2 M8 4.8 V5.4")],
  x: [path("M4 4 L12 12 M12 4 L4 12")],
  chevron: [path("M6 3.5 L10.5 8 L6 12.5")],
  search: [circle(7, 7, 4.5), path("M10.3 10.3 L14 14")],
};

export const Glyph = ({ name, size = 16, color, x = 0, y = 0, draw = 1, rotate = 0, opacity = 1 }: GlyphProps) => {
  const th = useIllus();
  const stroke = color ?? th.stroke;
  const d = Math.min(1, Math.max(0, draw));
  const common = {
    fill: "none",
    stroke,
    strokeWidth: 1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1 - d,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity, display: "block" }}
    >
      <g transform={rotate ? `rotate(${rotate} 8 8)` : undefined}>
        {STROKES[name].map((s, i) =>
          s.kind === "circle" ? <circle key={i} cx={s.cx} cy={s.cy} r={s.r} {...common} /> : <path key={i} d={s.d} {...common} />,
        )}
      </g>
    </svg>
  );
};
