// Rise and sink: the floor's two moves for anything that is not a TextBlock (a slab, a day tick, a panel).
// An object rises out of the floor over 12 f (clipped at the floor line, translateY from below, EO) and sinks
// back into it over 12 f the same way. The clip is `clipPath: inset()` at the floor line; nothing fades.
// TextBlock has the same move built in for text; this file is the generic one. Frames are chapter-local.
// Source: v6/V1-DIRECTION.md section 4 (conventions): "Display rises from the floor (12 f)", "sink into the floor (12 f)".
import React from "react";
import { useCurrentFrame } from "remotion";
import { EO, prog } from "../../lib/anim";

export type RiseSinkOpts = {
  /** Chapter-local frame the rise is complete (the object stands still). Omit for no rise. */
  enterDone?: number;
  enterDur?: number;
  /** Chapter-local frame the sink begins. Omit for no sink. */
  exitStart?: number;
  exitDur?: number;
};

export type RiseSinkState = {
  /** 0..1: how far into the floor the object is (0 standing, 1 fully under). */
  inFloor: number;
  /** 0..1 rising progress still to go (1 at the start of the rise, 0 when standing). */
  rise: number;
  /** 0..1 sinking progress (0 standing, 1 under). */
  sink: number;
  /** False before the rise begins and after the sink ends, so the caller can render nothing. */
  visible: boolean;
};

/** The pure state at frame f. */
export const riseSinkState = (f: number, { enterDone, enterDur = 12, exitStart, exitDur = 12 }: RiseSinkOpts): RiseSinkState => {
  const rise = enterDone === undefined ? 0 : 1 - prog(f, enterDone - enterDur, enterDone, EO);
  const sink = exitStart === undefined ? 0 : prog(f, exitStart, exitStart + exitDur, EO);
  const before = enterDone !== undefined && f < enterDone - enterDur;
  const after = exitStart !== undefined && f >= exitStart + exitDur;
  return { inFloor: Math.min(1, rise + sink), rise, sink, visible: !before && !after };
};

export type RiseSinkProps = RiseSinkOpts & {
  /** The box in the parent's px. The floor line is `floor` px from the box's top (default the bottom edge). */
  x: number;
  y: number;
  w: number;
  h: number;
  floor?: number;
  /** Px below the floor line that stay visible while standing (an object's shadow reach); clipped as it sinks. */
  reach?: number;
  /** Extra travel in px past the clip, so a soft edge is fully gone at the end of the sink. */
  depth?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/**
 * A box whose children rise from and sink into the floor line. While moving, the box is clipped at the floor
 * line plus `reach` and its content is shifted down by the same distance times the move's progress.
 */
export const RiseSink: React.FC<RiseSinkProps> = ({ x, y, w, h, floor, reach = 0, depth = 0, style, children, ...opts }) => {
  const f = useCurrentFrame();
  const s = riseSinkState(f, opts);
  if (!s.visible) return null;
  const line = (floor ?? h) + reach;
  const shift = s.inFloor * (line + depth);
  const moving = s.inFloor > 0;
  // The box grows to the clip line when the reach runs past it, so the inset is never negative.
  const boxH = Math.max(h, line);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: boxH,
        clipPath: moving ? `inset(0px 0px ${(boxH - line).toFixed(1)}px 0px)` : undefined,
        pointerEvents: "none",
        ...style,
      }}
    >
      <div style={{ position: "absolute", inset: 0, transform: moving ? `translateY(${shift.toFixed(2)}px)` : undefined }}>{children}</div>
    </div>
  );
};
