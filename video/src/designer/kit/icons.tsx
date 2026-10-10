// ICON FAMILY for the funky-dark reel. One family, 24 px grid, chunky round-cap line icons authored by hand from
// SVG primitives (no icon library). Stroke is drawn with vector-effect non-scaling-stroke, so it is a constant
// number of screen pixels at ANY size. Dots are zero-length round-cap segments (their diameter equals the stroke).
import React from "react";
import { P } from "../tokens";

/** A glyph part: SVG path data, or [path, true] when the closed shape can take a flat `fill`. */
type Part = string | [string, true];

// ---------- tiny path helpers (all output is plain SVG path data on the 24 grid) ----------
const f = (n: number) => +n.toFixed(2);
/** circle as path */
const circ = (cx: number, cy: number, r: number): string =>
  `M${f(cx - r)} ${cy}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0z`;
/** rounded rectangle as path */
const rr = (x: number, y: number, w: number, h: number, r: number): string =>
  `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}z`;
/** round dot (zero-length segment) */
const dot = (x: number, y: number): string => `M${x} ${y}h.01`;
/** open-ended capsule: starts at the inner end (x1,y1), runs to the outer end (x2,y2) and rounds it off */
const ocap = (x1: number, y1: number, x2: number, y2: number, r: number): string => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l = Math.hypot(dx, dy);
  const nx = (-dy / l) * r;
  const ny = (dx / l) * r;
  return `M${f(x1 + nx)} ${f(y1 + ny)}L${f(x2 + nx)} ${f(y2 + ny)}A${r} ${r} 0 0 0 ${f(x2 - nx)} ${f(y2 - ny)}L${f(x1 - nx)} ${f(y1 - ny)}`;
};

const GLYPHS = {
  cart: ["M2.5 3.6h3.1l2.3 10.7a1.6 1.6 0 0 0 1.6 1.3h8a1.6 1.6 0 0 0 1.6-1.2L20.9 7H6.1", circ(9.6, 19.7, 1.1), circ(17, 19.7, 1.1)],
  bag: [["M5.2 7.6h13.6l1.7 13.4H3.5z", true], "M8.6 10.6V7.4a3.4 3.4 0 0 1 6.8 0v3.2"],
  pin: [["M12 21.6c-4.3-4.5-6.6-7.7-6.6-11.2a6.6 6.6 0 0 1 13.2 0c0 3.5-2.3 6.7-6.6 11.2z", true], circ(12, 10.3, 2.3)],
  card: [[rr(2.5, 5, 19, 14, 3.4), true], "M2.8 10.2h18.4", "M6.6 15.2h4"],
  check: ["M4.2 12.8l5.2 5.1L19.8 6.2"],
  search: [[circ(10.4, 10.4, 6.6), true], "M15.4 15.6L21 21.2"],
  menu: ["M3.5 6h17", "M3.5 12h17", "M3.5 18h11"],
  heart: [["M12 20.6C6.4 16.4 3 13 3 8.9A4.6 4.6 0 0 1 12 7.2A4.6 4.6 0 0 1 21 8.9C21 13 17.6 16.4 12 20.6Z", true]],
  star: [["M12 3L14.53 9.12L21.13 9.63L16.09 13.93L17.64 20.37L12 16.9L6.36 20.37L7.91 13.93L2.87 9.63L9.47 9.12Z", true]],
  home: [["M5.6 9.8V20.6h12.8V9.8", true], "M2.8 11.4L12 3.4l9.2 8", "M10 20.6v-5.4h4v5.4"],
  user: [[circ(12, 7.8, 4.1), true], ["M4 20.6c0-3.9 3.4-6.6 8-6.6s8 2.7 8 6.6z", true]],
  users: [[circ(9, 8.4, 3.6), true], ["M2.4 20.4c0-3.6 2.8-6 6.6-6s6.6 2.4 6.6 6z", true], "M15.2 5.2a3.4 3.4 0 0 1 0 6.5", "M17.2 14.4c2.8.5 4.4 2.5 4.4 6h-3.2"],
  bell: [["M4.5 18h15l-1.8-2.4v-5.4a5.7 5.7 0 0 0-11.4 0v5.4z", true], "M12 3.2v1.4", "M9.8 21h4.4"],
  calendar: [[rr(3, 5, 18, 16, 3.6), true], "M3.2 10.6h17.6", "M8 3v4", "M16 3v4", dot(8, 15), dot(12, 15), dot(16, 15)],
  clock: [[circ(12, 12, 9), true], "M12 6.8V12l3.5 2.2"],
  plus: ["M12 4.6v14.8", "M4.6 12h14.8"],
  minus: ["M4.6 12h14.8"],
  x: ["M5.6 5.6l12.8 12.8", "M18.4 5.6L5.6 18.4"],
  arrow: ["M3.4 12h16.4", "M13.6 5.8l6.2 6.2-6.2 6.2"],
  chevron: ["M9 4.8l7.2 7.2L9 19.2"],
  chevdown: ["M4.8 9l7.2 7.2L19.2 9"],
  layers: [["M12 3.2l9 4.7-9 4.7-9-4.7z", true], "M3 12.4l9 4.8 9-4.8", "M3 16.8l9 4.8 9-4.8"],
  grid: [[rr(3.5, 3.5, 7.2, 7.2, 2.2), true], rr(13.3, 3.5, 7.2, 7.2, 2.2), rr(3.5, 13.3, 7.2, 7.2, 2.2), rr(13.3, 13.3, 7.2, 7.2, 2.2)],
  list: [dot(4, 6.5), dot(4, 12), dot(4, 17.5), "M9 6.5h12", "M9 12h12", "M9 17.5h8"],
  sliders: ["M7.5 3.5v5.2", "M7.5 15.3v5.2", [circ(7.5, 12, 3), true], "M16.5 3.5v2.2", "M16.5 12.3v8.2", [circ(16.5, 8.9, 3), true]],
  chart: [[rr(3.6, 12.4, 4.8, 8.2, 1.4), true], [rr(9.6, 4.4, 4.8, 16.2, 1.4), true], [rr(15.6, 8.6, 4.8, 12, 1.4), true]],
  pulse: ["M2 12.6h4.6l2.5-7.2 3.9 13.2 2.6-8.2 1.5 2.2H22"],
  cross: [[rr(3, 3, 18, 18, 5.2), true], "M12 7.6v8.8", "M7.6 12h8.8"],
  fork: ["M5 3.6v4.8a2.5 2.5 0 0 0 5 0V3.6", "M7.5 3.6v5.2", "M7.5 11v10", "M17.6 21V3.6c-2.9 1.2-4.1 3.7-4.1 7.1 0 1.8 1.4 2.9 4.1 2.9"],
  ticket: [["M3 8.2a1.6 1.6 0 0 1 1.6-1.6h14.8A1.6 1.6 0 0 1 21 8.2V10a2 2 0 0 0 0 4v1.8a1.6 1.6 0 0 1-1.6 1.6H4.6A1.6 1.6 0 0 1 3 15.8V14a2 2 0 0 0 0-4z", true], "M14.6 8.6v1", "M14.6 11.5v1", "M14.6 14.4v1"],
  tag: [["M3.6 4.4h8.2l8.8 8.8-7.2 7.2-9.8-9.8z", true], dot(8.1, 8.9)],
  phone: [["M4.5 5.5C4.5 4.5 5.2 3.8 6.2 3.8h2.4l2 4.4-2.2 1.6c1.2 2.5 3.3 4.6 5.8 5.8l1.6-2.2 4.4 2v2.4c0 1-.7 1.7-1.7 1.7C10.6 19.5 4.5 13.4 4.5 5.5z", true]],
  mail: [[rr(2.5, 5, 19, 14, 3.4), true], "M3.2 7.6L12 14l8.8-6.4"],
  globe: [[circ(12, 12, 9.2), true], "M12 2.8c-3 2.4-4.4 5.5-4.4 9.2s1.4 6.8 4.4 9.2c3-2.4 4.4-5.5 4.4-9.2S15 5.2 12 2.8z", "M3 12h18"],
  eye: [["M2.2 12S5.8 5.2 12 5.2 21.8 12 21.8 12 18.2 18.8 12 18.8 2.2 12 2.2 12z", true], circ(12, 12, 3.1)],
  box: [["M12 2.8l8.7 4.6v9.2L12 21.2l-8.7-4.6V7.4z", true], "M3.3 7.4L12 12l8.7-4.6", "M12 12v9.2", "M7.6 5.1l8.7 4.6"],
  pencil: [["M4 20.2l1.1-4.7L16.3 4.3a2.2 2.2 0 0 1 3.1 0l.3.3a2.2 2.2 0 0 1 0 3.1L8.5 18.9z", true], "M14.2 6.4l3.4 3.4", "M5.4 15.7l2.9 2.9"],
  message: [["M4 5.6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8.8a2 2 0 0 1-2 2h-6.6L7 20.6v-4.2H6a2 2 0 0 1-2-2z", true], "M8.2 8.6h7.6", "M8.2 12h4.4"],
  bolt: [["M13.6 2.8L5 13.4h6.2l-1 7.8 8.8-11.2h-6.3z", true]],
  image: [[rr(3, 4, 18, 16, 3.4), true], circ(8.6, 9.4, 1.6), "M3.4 17.2l5-4.8 4 3.8 3.1-2.9 5.1 4.9"],
  play: [["M7.6 4.8l12 7.2-12 7.2z", true]],
  link: [ocap(11.2, 12.8, 5.4, 18.6, 3.3), ocap(12.8, 11.2, 18.6, 5.4, 3.3), "M9.8 14.2l4.4-4.4"],
  toggle: [[rr(2.2, 6.4, 19.6, 11.2, 5.6), true], [circ(16.2, 12, 2.2), true]],
  send: [["M21 3.5L3.4 9.6l7.2 3.9 3.9 7z", true], "M10.6 13.5L21 3.5"],
  bookmark: [["M6.4 3.6h11.2v17.6L12 16.8l-5.6 4.4z", true]],
  download: ["M12 3.6v12", "M6.4 10.4l5.6 5.6 5.6-5.6", "M4 20.4h16"],
  trending: ["M3 17.4l6-6 4 4L21 7.4", "M15 6.8h6.2v6.2"],
} satisfies Record<string, Part[]>;

/** Every icon name, in specimen order. */
export const ICON_NAMES = Object.keys(GLYPHS) as ReadonlyArray<keyof typeof GLYPHS>;
export type IconName = keyof typeof GLYPHS;

export interface IconProps {
  /** which glyph */
  name: IconName;
  /** rendered square size in px (default 32) */
  size?: number;
  /** stroke colour (default cream) */
  color?: string;
  /** stroke width in SCREEN px, constant at any size (default ~size/12, min 2.5, max 8) */
  stroke?: number;
  /** flat fill for the closed main shape(s) of the glyph (default none) */
  fill?: string;
  /** 0..1 draw-on progress of the whole glyph (default 1 = fully drawn) */
  draw?: number;
  style?: React.CSSProperties;
}

/** Default stroke for a given size: chunky, never thinner than 2.5 px. */
export const iconStroke = (size: number): number => Math.min(8, Math.max(2.5, +(size * 0.085).toFixed(2)));

/** One chunky rounded line icon from the kit's 24 px family. Colour via `color`, flat fill via `fill`. */
export const Icon: React.FC<IconProps> = ({ name, size = 32, color = P.paper, stroke, fill, draw = 1, style }) => {
  const sw = stroke ?? iconStroke(size);
  const parts = GLYPHS[name] as ReadonlyArray<Part>;
  const dashed = draw < 1;
  const usw = (sw * 24) / size;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ overflow: "visible", flex: "none", verticalAlign: "middle", ...style }}
      fill="none"
      stroke={color}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {parts.map((p, i) => {
        const d = typeof p === "string" ? p : p[0];
        const fillable = typeof p !== "string";
        return (
          <path
            key={i}
            d={d}
            fill={fillable && fill ? fill : "none"}
            // while drawing on, the dash needs user-space units, so the same screen width is expressed in grid units
            strokeWidth={dashed ? usw : undefined}
            vectorEffect={dashed ? undefined : "non-scaling-stroke"}
            pathLength={dashed ? 1 : undefined}
            strokeDasharray={dashed ? "1 1.01" : undefined}
            strokeDashoffset={dashed ? 1 - Math.max(0, draw) : undefined}
            opacity={dashed && draw <= 0 ? 0 : 1}
          />
        );
      })}
    </svg>
  );
};
