// The figure: his untreated photograph standing in the key light with his silhouette shadow lying on the floor,
// placed exactly as the Stage specimen places it (portrait-clean.png, never masked, never treated; the shadow is
// the silhouette path filled with the shadow colour, skewed away from the light, down-right of him). Shared by
// chapters 1, 2 and 8. Frame-agnostic: the scene drives opacity and the slides. Source: V1-DIRECTION.md 2.3, 4.1.
import React from "react";
import { Img } from "remotion";
import { portraitUrl } from "../../lib/assets";
import { SilhouetteShadow } from "../../stage";

export type Box = { x: number; y: number; w: number; h: number };

/** The specimen's shadow treatment: skewed 26 degrees away from the light, shifted 120 px toward it. */
export const SHADOW_SKEW = -26;
export const SHADOW_DX = -120;

export type FigureProps = {
  /** The portrait's box in frame px (1500 x 1800 scaled to 1020 px tall, the bottom edge below the frame). */
  box: Box;
  /** The photograph's opacity (0 keeps only the shadow: chapter 1 before he steps in). */
  opacity?: number;
  shadowOpacity?: number;
  /** Px the figure (photo and shadow) is shifted along x, for a slide in from an edge. */
  shift?: number;
  /** Px the shadow alone is shifted along x (chapter 1: the shadow arrives before the person). */
  shadowShift?: number;
};

export const Figure: React.FC<FigureProps> = ({ box, opacity = 1, shadowOpacity = 1, shift = 0, shadowShift = 0 }) => (
  <>
    {shadowOpacity > 0 ? (
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${(shift + shadowShift).toFixed(2)}px)`, pointerEvents: "none" }}>
        <SilhouetteShadow portrait={box} skew={SHADOW_SKEW} dx={SHADOW_DX} opacity={shadowOpacity} />
      </div>
    ) : null}
    {opacity > 0 ? (
      <Img
        src={portraitUrl()}
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          opacity,
          transform: shift ? `translateX(${shift.toFixed(2)}px)` : undefined,
          pointerEvents: "none",
        }}
      />
    ) : null}
  </>
);
