// The count: a number counting from `from` to `to` in exactly 30 f (linear, tabular figures), then holding; the
// scene registers one block of kind "number" (text "~70%") and this renders it through TextBlock with the value
// of the frame, so the digits change and the TypeShadow follows. The prefix stays put: the string is left-aligned
// from the point where the final string sits centred (or where the scene puts it). countCues gives the `dial`
// detents for the scene's cue list. Source: v6/V1-DIRECTION.md 4.5 (block 5.6), 6.4, 9.2.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { Cue, Sfx } from "../../lib/cues";
import { clamp } from "../../lib/anim";
import { W } from "../tokens";
import { TextBlock } from "../TextBlock";
import type { BlockSpec } from "../text-manifest";
import { display, measureLine, useArchivo } from "../type";

export type CountProps = {
  /** The registered number block; its text is the final string ("~70%") and its enterDone the count's last frame. */
  block: BlockSpec;
  /** Chapter-local frame the count starts (value `from`); it reaches `to` at start + dur. */
  start: number;
  dur?: number;
  from?: number;
  to?: number;
  /** Text before and after the digits ("~" and "%"); defaults read off the block's text. */
  prefix?: string;
  suffix?: string;
  /** Centre of the final string in frame px ("center") or its left edge ("left"). */
  x: number;
  /** Baseline in frame px. */
  y: number;
  align?: "left" | "center";
  color?: string;
  wdth?: number;
  wght?: number;
  shadow?: boolean;
};

/** The value at frame f: linear from `from` to `to` over [start, start + dur], clamped. */
export const countValue = (f: number, start: number, dur = 30, from = 0, to = 70) => interpolate(f, [start, start + dur], [from, to], clamp);

/** The `dial` detents: `detents` cues spread evenly over the count (14 over 30 f by default). */
export const countCues = (start: number, dur = 30, detents = 14, sfx: Sfx = "dial", vol = 0.45): Cue[] =>
  Array.from({ length: detents }, (_, i) => ({ f: start + Math.floor((i * dur) / detents), sfx, vol }));

/** The prefix and suffix around the digits of a number block's text ("~70%" gives "~" and "%"). */
export const countAffixes = (text: string) => {
  const m = text.match(/^([^\d]*)(\d+)([^\d]*)$/);
  return { prefix: m?.[1] ?? "", suffix: m?.[3] ?? "", value: m ? Number(m[2]) : 0 };
};

export const Count: React.FC<CountProps> = ({ block, start, dur = 30, from = 0, to, prefix, suffix, x, y, align = "center", color, wdth, wght, shadow = true }) => {
  const f = useCurrentFrame();
  const ready = useArchivo();
  const affix = countAffixes(block.text);
  const pre = prefix ?? affix.prefix;
  const suf = suffix ?? affix.suffix;
  const end = to ?? affix.value;
  const v = Math.round(countValue(f, start, dur, from, end));
  const text = `${pre}${v}${suf}`;
  const style = display(block.size, wdth, wght);
  const finalW = ready ? measureLine(block.text, style).width : 0;
  const left = align === "center" ? x - finalW / 2 : x;
  const spec: BlockSpec = { ...block, text, enter: block.enter ?? "cut", show: block.show ?? start };
  return <TextBlock block={spec} x={left} y={y} align="left" width={W - left} color={color} wdth={wdth} wght={wght} shadow={shadow} />;
};
