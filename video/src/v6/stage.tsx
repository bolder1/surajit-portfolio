// The stage: a matte floor, one warm key light from upper-left, and the three kinds of shadow every object casts.
// Source: v6/V1-DIRECTION.md section 2.3. Shadows are text copies, box-shadow or a filled path: never filter: blur().
// Everything here is frame-agnostic; scenes drive the numbers from useCurrentFrame().
import React from "react";
import { AbsoluteFill } from "remotion";
import { ELEVATION, ELEVATION_ORDER, K, inkRgba, shadowRgba, type Elevation } from "./tokens";
import { capHeight } from "./type";
import { SILHOUETTE_BOX, SILHOUETTE_PATH } from "./silhouette";

/** The floor: Ground, edge to edge. */
export const Floor: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ background: K.ground, ...style }}>{children}</AbsoluteFill>
);

export type KeyLightProps = {
  /** Centre of the pool in the parent's px. */
  cx: number;
  cy: number;
  /** Radius where the pool has faded to nothing. */
  r: number;
  /** 0..1: scales the pool's peak from 0 to 10 percent Ink (the direction's 6 to 10 percent is 0.6 to 1). */
  intensity?: number;
  style?: React.CSSProperties;
};

/** The key light: one radial of Ink at 6 to 10 percent on the floor. Not a colour, a pool; the grade warms it. */
export const KeyLight: React.FC<KeyLightProps> = ({ cx, cy, r, intensity = 1, style }) => {
  const a = 0.1 * Math.max(0, Math.min(1, intensity));
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle ${r}px at ${cx}px ${cy}px, ${inkRgba(a)} 0%, ${inkRgba(a * 0.55)} 38%, ${inkRgba(a * 0.18)} 70%, ${inkRgba(0)} 100%)`,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};

/** The light pool as a plain style, for a slab that clips a second copy inside itself (lit corner upper-left). */
export const keyLightBackground = (cx: number, cy: number, r: number, intensity = 1) => {
  const a = 0.1 * Math.max(0, Math.min(1, intensity));
  return `radial-gradient(circle ${r}px at ${cx}px ${cy}px, ${inkRgba(a)} 0%, ${inkRgba(a * 0.55)} 38%, ${inkRgba(a * 0.18)} 70%, ${inkRgba(0)} 100%)`;
};

export type TypeShadowProps = {
  /** The text as rendered (same string, same style as the lit copy). */
  text: React.ReactNode;
  /** The lit copy's full style (font, size, axes, tracking, case). */
  style: React.CSSProperties;
  /** Font size in px, for the cap-height offset. */
  size: number;
  /** Skew in degrees; the shadow lies down-right of the letter (the light is upper-left). */
  skew?: number;
  /** Shadow depth as a fraction of the cap height. */
  depth?: number;
  /** 0..1: how much of the shadow is there (0 while a word is still inside the floor). */
  amount?: number;
  /** "offset" (default): the copy skewed and shifted down-right by the cap height times `depth`, behind the lit text. "floor": a mirrored, flattened copy lying in front of the baseline (a floor reflection; not the direction's look). */
  mode?: "floor" | "offset";
  color?: string;
  /** The soft edge in px (default 2); 0 draws no text-shadow. */
  blur?: number;
};

/**
 * TypeShadow: a second copy of the text in the shadow colour (#050506 at 85 percent), skewed 24 degrees around
 * its baseline (the top leans right, away from the light), offset down-right by the cap height times 0.35,
 * softened with a 2 px edge from text-shadow (`blur`; 0 for none). Place it in the same box as the lit text, before it in the DOM,
 * so the letters sit on top; `amount` 0..1 pulls it in while a word is still inside the floor.
 */
export const TypeShadow: React.FC<TypeShadowProps> = ({ text, style, size, skew = 24, depth = 0.35, amount = 1, mode = "offset", color, blur = 2 }) => {
  const cap = capHeight(size);
  const c = color ?? shadowRgba();
  const off = (cap * depth * amount).toFixed(1);
  const transform = mode === "floor" ? `scaleY(${(-depth * amount).toFixed(4)}) skewX(${-skew}deg)` : `translate(${off}px, ${off}px) skewX(${-skew}deg)`;
  return (
    <div
      aria-hidden
      style={{
        ...style,
        position: "absolute",
        inset: 0,
        color: c,
        transformOrigin: mode === "floor" ? "50% 100%" : "0% 100%",
        transform,
        ...(blur > 0 ? { textShadow: `0 0 ${blur.toFixed(2)}px ${c}` } : {}),
        pointerEvents: "none",
        userSelect: "none",
        opacity: amount > 0 ? 1 : 0,
      }}
    >
      {text}
    </div>
  );
};

/** The box-shadow for an elevation, or for a fractional level 0..2 (low to mid to high) while a slab lifts. */
export const elevationShadow = (level: Elevation | number, color = shadowRgba()): string => {
  if (typeof level === "string") {
    const e = ELEVATION[level];
    return `0 ${e.y}px ${e.blur}px ${e.spread}px ${color}`;
  }
  const t = Math.max(0, Math.min(2, level));
  const a = ELEVATION[ELEVATION_ORDER[Math.floor(t)]];
  const b = ELEVATION[ELEVATION_ORDER[Math.min(2, Math.ceil(t))]];
  const p = t - Math.floor(t);
  const mix = (x: number, y: number) => x + (y - x) * p;
  return `0 ${mix(a.y, b.y).toFixed(1)}px ${mix(a.blur, b.blur).toFixed(1)}px ${mix(a.spread, b.spread).toFixed(1)}px ${color}`;
};

export type SlabShadowProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** "low" | "mid" | "high", or a fractional level 0..2 while lifting. */
  elevation?: Elevation | number;
  radius?: number;
  /** Surface tone; Ground lifted one step by default. */
  surface?: string;
  /** Draw a clipped copy of the light pool inside, lit corner upper-left, from this pool (in the slab's own px). */
  pool?: { cx: number; cy: number; r: number; intensity?: number };
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/** A slab: a rounded rectangle lifted off the floor with one shadow from the elevation table. */
export const SlabShadow: React.FC<SlabShadowProps> = ({ x, y, w, h, elevation = "low", radius = 8, surface = K.surface, pool, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: radius,
      background: surface,
      boxShadow: elevationShadow(elevation),
      ...style,
    }}
  >
    <div style={{ position: "absolute", inset: 0, borderRadius: radius, overflow: "hidden" }}>
      {pool ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: keyLightBackground(pool.cx, pool.cy, pool.r, pool.intensity ?? 1),
            pointerEvents: "none",
          }}
        />
      ) : null}
      {children}
    </div>
  </div>
);

export type SilhouetteShadowProps = {
  /** The portrait's rendered box in the parent's px (the path maps onto portrait-clean.png's full 1500 x 1800). */
  portrait: { x: number; y: number; w: number; h: number };
  /** Skew in degrees around the portrait's bottom edge; positive leans the head to the left (away from the light). */
  skew?: number;
  /** Extra offset of the shadow on the floor in px. */
  dx?: number;
  dy?: number;
  /** Vertical squash 0..1 (1 keeps the portrait's height). */
  squash?: number;
  opacity?: number;
  color?: string;
  style?: React.CSSProperties;
};

/**
 * SilhouetteShadow: the silhouette path filled with the shadow colour, scaled to the portrait's placement and
 * skewed, lying where the light implies. A path only, never a mask on the photograph. The soft edge is two
 * translucent strokes, not a filter.
 */
export const SilhouetteShadow: React.FC<SilhouetteShadowProps> = ({ portrait, skew = 24, dx = 0, dy = 0, squash = 1, opacity = 1, color, style }) => {
  const c = color ?? shadowRgba();
  return (
    <svg
      width={portrait.w}
      height={portrait.h}
      viewBox={`0 0 ${SILHOUETTE_BOX.w} ${SILHOUETTE_BOX.h}`}
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        left: portrait.x + dx,
        top: portrait.y + dy,
        transformOrigin: "50% 100%",
        transform: `skewX(${skew}deg) scaleY(${squash})`,
        opacity,
        overflow: "visible",
        pointerEvents: "none",
        ...style,
      }}
    >
      <path d={SILHOUETTE_PATH} fill="none" stroke={c} strokeOpacity={0.25} strokeWidth={10} strokeLinejoin="round" />
      <path d={SILHOUETTE_PATH} fill="none" stroke={c} strokeOpacity={0.45} strokeWidth={4} strokeLinejoin="round" />
      <path d={SILHOUETTE_PATH} fill={c} />
    </svg>
  );
};
