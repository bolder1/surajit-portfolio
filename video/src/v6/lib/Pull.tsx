// The Pull: the film's one camera move, used exactly three times (288, 2160, 5400). A word stands on the floor at
// 3.2 times the frame width, cropped on all four sides; the camera dollies straight back until it fits. Built as
// a perspective container whose scale runs `from` to `to` with prog(f, start, start + dur, EO): at `start` the
// scale is still `from`, so the first frame is the composed cropped still and motion begins on the second frame.
// Everything inside scales together, so a TextBlock's TypeShadow scales with its letters and the crop reads as
// staging: a neighbour's shadow (the D's bowl under the A's counter in "5 DAYS") shows through the counters
// exactly as a floor shadow would. The current scale is published through PullScaleContext so a TextBlock
// inside the Pull keeps its TypeShadow's soft edge at 2 px on screen (2 / scale) instead of 2 px times the
// scale (a 30 px fog at 15x). Source: v6/V1-DIRECTION.md sections 2.4 and 3.3.
import React from "react";
import { useCurrentFrame } from "remotion";
import { EO, prog } from "../../lib/anim";
import { H, W } from "../tokens";

export type PullProps = {
  /** Start scale (the word at 3.2 times the frame width). */
  from?: number;
  /** End scale (fitted with the side margins). */
  to?: number;
  /** Chapter-local frame of the composed still; motion starts at start + 1. */
  start: number;
  /** Length of the move in frames (96 to 108). */
  dur: number;
  /** The point of the frame the camera backs away from, as a CSS transform-origin (default the frame's centre). */
  origin?: string;
  /** The perspective distance in px (the direction's stage uses 2400). */
  perspective?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/** The Pull's scale at frame f: `from` through `start`, easing to `to` by start + dur. */
export const pullScaleAt = (f: number, start: number, dur: number, from = 3.2, to = 1) => from + (to - from) * prog(f, start, start + dur, EO);

/** The scale of the enclosing Pull at the current frame (1 outside any Pull). */
export const PullScaleContext = React.createContext(1);
export const usePullScale = () => React.useContext(PullScaleContext);

export const Pull: React.FC<PullProps> = ({ from = 3.2, to = 1, start, dur, origin = "50% 50%", perspective = 2400, style, children }) => {
  const f = useCurrentFrame();
  const s = pullScaleAt(f, start, dur, from, to);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, overflow: "hidden", perspective: `${perspective}px`, perspectiveOrigin: origin, ...style }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: origin, transform: `scale(${s.toFixed(4)})` }}>
        <PullScaleContext.Provider value={s}>{children}</PullScaleContext.Provider>
      </div>
    </div>
  );
};
