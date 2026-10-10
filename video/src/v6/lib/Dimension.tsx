// The dimension line: a 1 px Support line with end ticks and a value label (Label 28 px), snapping on in 6 f (the
// line draws with evolvePath over the 6 f before the value lands whole with `snap`; `click-lo` on each end tick is
// the scene's cue). Chapter 6 B7 draws three of them on the Alert and the Button. The struck state is chapter 5's
// revision: "3 WEEKS" turns Support and a single 1 px hairline strikes through it, drawn left to right over 12 f
// (Strike, with struckInk for the word's colour). Source: v6/V1-DIRECTION.md 4.5, 4.6 B7, 9.2.
import React from "react";
import { useCurrentFrame } from "remotion";
import { evolvePath } from "@remotion/paths";
import { EO, prog } from "../../lib/anim";
import { H, K, W, supportRgba } from "../tokens";
import { TextBlock } from "../TextBlock";
import type { BlockSpec } from "../text-manifest";
import { capHeight } from "../type";
import type { Pt } from "./Leader";
import { mixHex } from "./Readout";

export type DimensionProps = {
  /** The measured span, in frame px. */
  from: Pt;
  to: Pt;
  /** The value, a registered block of kind "diagram" (text "STROKE · 1 PX"); its enterDone is the snap frame. */
  block: BlockSpec;
  /** Where the value sits relative to the line: offset in px along the line's normal (negative is above or left). */
  offset?: number;
  /** The value's position along the line, 0..1 (0.5 centres it). */
  along?: number;
  align?: "left" | "center" | "right";
  /** End tick length in px (8). */
  tick?: number;
  /** Drawing length in frames (6). */
  drawDur?: number;
  color?: string;
  valueColor?: string;
  width?: number;
};

const norm = (a: Pt, b: Pt) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  return { ux: dx / len, uy: dy / len, nx: -dy / len, ny: dx / len, len };
};

/** The dimension's path: tick, line, tick, as one path (so one evolvePath draws it in reading order). */
export const dimensionPath = (a: Pt, b: Pt, tick = 8) => {
  const { nx, ny } = norm(a, b);
  const t = tick / 2;
  const seg = (p: Pt) => `M${(p[0] - nx * t).toFixed(1)} ${(p[1] - ny * t).toFixed(1)} L${(p[0] + nx * t).toFixed(1)} ${(p[1] + ny * t).toFixed(1)}`;
  return `${seg(a)} M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)} ${seg(b)}`;
};

export const Dimension: React.FC<DimensionProps> = ({ from, to, block, offset = -18, along = 0.5, align = "center", tick = 8, drawDur = 6, color, valueColor = K.ink, width = 1 }) => {
  const f = useCurrentFrame();
  const at = block.enterDone;
  const exitDur = 6;
  if (f < at - drawDur || f >= block.exitStart + exitDur) return null;
  const draw = prog(f, at - drawDur, at, EO);
  const fade = 1 - prog(f, block.exitStart, block.exitStart + exitDur, EO);
  const d = dimensionPath(from, to, tick);
  const c = color ?? supportRgba(1);
  const { ux, uy, nx, ny, len } = norm(from, to);
  const lineH = block.size * 1.2;
  // The value's anchor: `along` the line, pushed `offset` px along the normal, then centred on its line box.
  const ax = from[0] + ux * len * along + nx * offset;
  const ay = from[1] + uy * len * along + ny * offset;
  return (
    <>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none", opacity: fade }}>
        <path d={d} fill="none" stroke={c} strokeWidth={width} strokeLinecap="butt" {...evolvePath(draw, d)} />
      </svg>
      <TextBlock block={block} x={ax} y={ay - lineH / 2} align={align} width={align === "center" ? 600 : undefined} color={valueColor} leader={false} />
    </>
  );
};

export type StrikeProps = {
  /** The word's box: left edge and width in frame px, and the baseline of the struck line. */
  x: number;
  width: number;
  baseline: number;
  /** The word's font size, so the hairline crosses at half the cap height. */
  size: number;
  /** Chapter-local frame the strike starts; it draws left to right over `dur` (12). */
  at: number;
  dur?: number;
  /** Chapter-local frame the strike leaves with the word (fades 1 f); omit to keep it. */
  exitStart?: number;
  color?: string;
  thickness?: number;
};

/** The word's ink as it is struck: Ink to Support over the strike's frames. */
export const struckInk = (f: number, at: number, dur = 12) => mixHex(K.ink, K.support, prog(f, at, at + dur, EO));

/** A single 1 px hairline drawn left to right through a display word (the drawing-revision convention). */
export const Strike: React.FC<StrikeProps> = ({ x, width, baseline, size, at, dur = 12, exitStart, color, thickness = 1 }) => {
  const f = useCurrentFrame();
  if (f < at || (exitStart !== undefined && f >= exitStart)) return null;
  const y = baseline - capHeight(size) / 2;
  const d = `M${x.toFixed(1)} ${y.toFixed(1)} L${(x + width).toFixed(1)} ${y.toFixed(1)}`;
  const draw = prog(f, at, at + dur, EO);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      <path d={d} fill="none" stroke={color ?? K.support} strokeWidth={thickness} {...evolvePath(draw, d)} />
    </svg>
  );
};
