// The explode stage and its docked labels. Stage3Q is the fixed 3/4 elevation of chapter 6 (perspective 2400 px,
// rotateX 26, rotateY -16, transform-style preserve-3d): the objects move, the camera never does. The planes are
// the kit Screen's regions driven by its `lift` prop, so there is no Plane here and no clip on the 3D group (the
// light-pool clip lives inside each slab). DockLabel is a label flat to camera, never in the tilted space, with a
// leader from a point on the plane to the label; project3Q turns a point in the stage's 3D space into frame px
// so the leader lands where the plane's corner is drawn. Source: v6/V1-DIRECTION.md 2.4, 4.6 B2, 9.2; ILLUSTRATION.md 3.2.
import React from "react";
import { H, W } from "../tokens";
import { TextBlock, type TextBlockProps } from "../TextBlock";
import { Leader, type Pt } from "./Leader";

export type Stage3QSpec = {
  perspective: number;
  rotateX: number;
  rotateY: number;
  /** The stage box in frame px; the transform origin and the perspective origin are its centre. */
  w: number;
  h: number;
};

/** The direction's elevation. */
export const STAGE_3Q: Stage3QSpec = { perspective: 2400, rotateX: 26, rotateY: -16, w: W, h: H };

export type Stage3QProps = Partial<Stage3QSpec> & {
  x?: number;
  y?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/**
 * The tilted stage. Children are placed in its own px (0..w, 0..h at z 0) and may carry translateZ transforms;
 * a kit Screen with `lift` goes straight in.
 */
export const Stage3Q: React.FC<Stage3QProps> = ({ perspective = STAGE_3Q.perspective, rotateX = STAGE_3Q.rotateX, rotateY = STAGE_3Q.rotateY, w = W, h = H, x = 0, y = 0, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, perspective: `${perspective}px`, perspectiveOrigin: "50% 50%", pointerEvents: "none", ...style }}>
    <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 50%", transformStyle: "preserve-3d", transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }}>{children}</div>
  </div>
);

const rad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Where a point of the tilted stage lands on screen, in the stage's px (add the stage's x and y for frame px).
 * (x, y) is the point's place at rest and z its translateZ; the CSS order `rotateX(a) rotateY(b)` applies
 * rotateY first, then rotateX, then the parent's perspective about the stage's centre.
 */
export const project3Q = (x: number, y: number, z: number, s: Stage3QSpec = STAGE_3Q): { x: number; y: number; scale: number } => {
  const cx = s.w / 2;
  const cy = s.h / 2;
  const px = x - cx;
  const py = y - cy;
  const b = rad(s.rotateY);
  const a = rad(s.rotateX);
  // rotateY(b)
  const x1 = px * Math.cos(b) + z * Math.sin(b);
  const z1 = -px * Math.sin(b) + z * Math.cos(b);
  const y1 = py;
  // rotateX(a)
  const y2 = y1 * Math.cos(a) - z1 * Math.sin(a);
  const z2 = y1 * Math.sin(a) + z1 * Math.cos(a);
  const x2 = x1;
  const k = s.perspective / (s.perspective - z2);
  return { x: cx + x2 * k, y: cy + y2 * k, scale: k };
};

export type DockLabelProps = Omit<TextBlockProps, "leader"> & {
  /** The point on the lifted plane the leader starts from, in frame px (use project3Q for a tilted point). */
  anchor: Pt;
  /** Px between the leader's end and the label's near edge. */
  gap?: number;
  /** Override the leader's points entirely (frame px, object first). */
  points?: readonly Pt[];
  /** A dot at the anchor, in px (4 by default; 0 for none). */
  dot?: number;
  leaderColor?: string;
};

/**
 * A label docked beside a plane: a straight 1 px leader from `anchor` to the label's near edge draws over the
 * 6 f before the block lands (the TextBlock's own hairline is off), then the label appears whole, flat to camera.
 * Place it outside Stage3Q. The block's enterDone and exitStart drive both the leader and the label.
 */
export const DockLabel: React.FC<DockLabelProps> = ({ anchor, gap = 16, points, dot = 4, leaderColor, ...tb }) => {
  const { block, x, y, align = "left", width } = tb;
  const lineH = block.size * 1.2;
  const midY = y + lineH / 2;
  const edgeX = align === "left" ? x - gap : align === "right" ? x + gap : x - (width ?? 0) / 2 - gap;
  const pts: readonly Pt[] = points ?? [anchor, [edgeX, midY]];
  return (
    <>
      <Leader points={pts} at={block.enterDone} dur={6} exitStart={block.exitStart} exitDur={6} dot={dot} color={leaderColor} />
      <TextBlock {...tb} align={align} leader={false} />
    </>
  );
};
