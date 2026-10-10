// TextBlock: every text on screen goes through this. It renders a registered block in its role, measures it,
// refuses over 42 characters per line (one declared token-path exception up to 48) or over two lines, and applies
// the role's entrance and exit from v6/V1-DIRECTION.md section 4 (conventions):
//   display   rises from the floor over 12 f with its TypeShadow; sinks into the floor over 12 f
//   statement fades 10 f with an 8 px rise; fades out 10 f
//   label     draws a 6 f leader, then appears whole (the scene cues `snap`); sinks 6 f
// All frames are chapter-local (the block lives inside its chapter's Sequence).
import React, { useMemo } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clamp, EO, prog } from "../lib/anim";
import { K, MAX_CHARS, MAX_CHARS_TOKEN_PATH, SIDE_MARGIN, W, supportRgba } from "./tokens";
import { baselineAt, capHeight, fitLine, roleStyle, useArchivo } from "./type";
import { TypeShadow } from "./stage";
import {
  type BlockSpec,
  defaultEnter,
  defaultExit,
  enterDur as enterDurOf,
  exitDur as exitDurOf,
  linesOf,
  roleOf,
} from "./text-manifest";

export type TextBlockProps = {
  block: BlockSpec;
  /** Left edge, centre or right edge (by `align`) in the parent's px. */
  x: number;
  /** Display: the baseline of the first line. Other roles: the top of the box. */
  y: number;
  align?: "left" | "center" | "right";
  /** Box width; display lines are fitted inside it when `fit` is set. */
  width?: number;
  /** Display only: fit the longest line to the box (default the frame minus the side margins); overrides `block.size`. */
  fit?: boolean;
  color?: string;
  /** Axis overrides: display width (125 for "3 WEEKS") and weight; statement weight (500 for the sector words). */
  wdth?: number;
  wght?: number;
  /** Labels: keep the text's real case with tracking 0 (token paths, hex values, addresses). */
  real?: boolean;
  /** Display: draw the TypeShadow (on by default). */
  shadow?: boolean;
  /** Label leader: a 1 px hairline above the label, drawn over the 6 f before it lands. `false` for none. */
  leader?: { len?: number; color?: string } | false;
  /** Per-line colours (a readout's lit and unlit columns, the struck word). */
  lineColors?: (string | undefined)[];
  style?: React.CSSProperties;
};

/** Throws when a block breaks the readability limits, so a still fails loudly instead of showing it. */
export const assertReadable = (b: BlockSpec) => {
  const lines = linesOf(b);
  const multi = b.kind === "list" || b.kind === "contact";
  if (!multi && lines.length > 2) throw new Error(`TextBlock ${b.chapter} ${b.id}: ${lines.length} lines (max 2)`);
  for (const l of lines) {
    const single = b.lineException && !/\s/.test(l.trim());
    const max = single ? MAX_CHARS_TOKEN_PATH : MAX_CHARS;
    if (l.length > max) throw new Error(`TextBlock ${b.chapter} ${b.id}: line "${l}" is ${l.length} chars (max ${max})`);
  }
};

/** The entrance window [from, to]; "cut" and "items" entrances are visible from `show` (default enterDone). */
export const enterWindow = (b: BlockSpec) => {
  const kind = b.enter ?? defaultEnter(b.kind);
  if (kind === "cut" || kind === "items") return { from: b.show ?? b.enterDone, to: b.enterDone, kind };
  return { from: b.enterDone - enterDurOf(b), to: b.enterDone, kind };
};
/** The exit window [from, to]. */
export const exitWindow = (b: BlockSpec) => {
  const kind = b.exit ?? defaultExit(b.kind);
  return { from: b.exitStart, to: b.exitStart + exitDurOf(b), kind };
};

export const TextBlock: React.FC<TextBlockProps> = ({
  block,
  x,
  y,
  align = "left",
  width,
  fit = false,
  color,
  wdth,
  wght,
  real,
  shadow = true,
  leader,
  lineColors,
  style,
}) => {
  const f = useCurrentFrame();
  const ready = useArchivo();
  assertReadable(block);
  const role = roleOf(block.kind);
  const lines = linesOf(block);
  const boxW = width ?? (align === "left" ? W - x - SIDE_MARGIN : align === "right" ? x - SIDE_MARGIN : W - 2 * SIDE_MARGIN);

  const size = useMemo(() => {
    if (!ready || !fit || role !== "display") return block.size;
    const longest = lines.reduce((a, l) => (l.length > a.length ? l : a), "");
    return fitLine(longest, "display", boxW, { max: 400, min: 72, wdth, wght });
  }, [ready, fit, role, lines, boxW, block.size, wdth, wght]);

  const en = enterWindow(block);
  const ex = exitWindow(block);
  if (!ready || f < en.from || f >= ex.to) return null;

  const base = roleStyle(role, size, { wdth, wght, real: real ?? block.kind === "contact" });
  const ink = color ?? K.ink;
  const lineH = Number(base.lineHeight ?? 1.15) * size;
  const n = lines.length;
  const isDisplay = role === "display";
  // The floor line: the last baseline for display, the bottom of the box otherwise. The clip for rise and sink.
  const floorY = isDisplay ? baselineAt(size) + lineH * (n - 1) : lineH * n;
  const left = align === "left" ? x : align === "center" ? x - boxW / 2 : x - boxW;
  const top = isDisplay ? y - baselineAt(size) : y;

  const pin = en.kind === "cut" || en.kind === "items" ? 1 : prog(f, en.from, en.to, EO);
  const pout = ex.kind === "cut" ? 0 : ex.kind === "dark" ? interpolate(f, [ex.from, ex.to], [0, 1], clamp) : prog(f, ex.from, ex.to, EO);
  const rise = en.kind === "rise" ? 1 - pin : 0;
  const sink = ex.kind === "sink" ? pout : 0;
  const inFloor = Math.min(1, rise + sink);
  const shadowReach = capHeight(size) * 0.35;
  const yShift = inFloor * (floorY + shadowReach + size * 0.12);
  const fadeIn = en.kind === "fade" ? pin : 1;
  const fadeOut = ex.kind === "fade" || ex.kind === "dark" ? 1 - pout : 1;
  const liftIn = en.kind === "fade" ? (1 - pin) * 8 : 0;

  const items = en.kind === "items" ? (block.landings ?? []) : null;
  const colorOf = (i: number) => lineColors?.[i] ?? ink;
  const lineStyle = (i: number): React.CSSProperties => ({
    ...base,
    position: "absolute",
    left: 0,
    right: 0,
    top: i * lineH,
    height: lineH,
    lineHeight: `${lineH}px`,
    textAlign: align,
    whiteSpace: "pre",
    color: colorOf(i),
  });

  const leaderOn = role === "label" && en.kind === "leader" && leader !== false;
  const leaderLen = leader && typeof leader === "object" ? (leader.len ?? 56) : 56;
  const leaderColor = leader && typeof leader === "object" ? (leader.color ?? supportRgba(0.9)) : supportRgba(0.9);
  const leaderW = leaderLen * prog(f, en.from, en.to, EO);
  const bodyOn = !(en.kind === "leader" && f < en.to);

  return (
    <div style={{ position: "absolute", left, top, width: boxW, height: floorY, pointerEvents: "none", ...style }}>
      {leaderOn ? (
        <div
          style={{
            position: "absolute",
            left: align === "right" ? boxW - leaderW : align === "center" ? (boxW - leaderW) / 2 : 0,
            top: -12,
            width: leaderW,
            height: 1,
            background: leaderColor,
            opacity: 1 - sink,
          }}
        />
      ) : null}
      {/* The shadow, anchored at each baseline and offset down-right, sinks and rises with the word: its own clip
          sits one shadow offset below the floor line, so it goes into the floor as the letters do. */}
      {isDisplay && shadow && bodyOn ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: floorY + shadowReach, overflow: inFloor > 0 ? "hidden" : "visible" }}>
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${yShift.toFixed(2)}px)`, opacity: fadeIn * fadeOut }}>
            {lines.map((line, i) => (
              <div key={`s${i}`} style={{ position: "absolute", left: 0, right: 0, top: i * lineH, height: baselineAt(size) }}>
                <TypeShadow text={line} size={size} style={{ ...base, lineHeight: `${lineH}px`, textAlign: align, whiteSpace: "pre" }} />
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {bodyOn ? (
        <div style={{ position: "absolute", inset: 0, overflow: inFloor > 0 ? "hidden" : "visible" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateY(${(yShift - liftIn).toFixed(2)}px)`,
              opacity: fadeIn * fadeOut,
            }}
          >
            {lines.map((line, i) => (
              <div key={i} style={{ ...lineStyle(i), opacity: items ? (f >= (items[i] ?? 0) ? 1 : 0) : 1 }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
