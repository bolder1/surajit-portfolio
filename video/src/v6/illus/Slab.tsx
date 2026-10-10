// The object wrapper. Every screen, panel and card sits in one: a rounded rectangle
// with a surface by theme and mode, one shadow by theme (the elevation tokens as a
// box-shadow, a hard offset, or a 1 px stroke), an optional clipped light pool, and
// opacity for dimming. The 3D clip lives on an inner child so a slab used as a plane
// can keep preserve-3d on itself.
import type { CSSProperties, ReactNode } from "react";
import { ELEVATION } from "./artefact";
import { alpha, IllusMode, modeT, parseColor, toneColor, useIllus, useIllusMode } from "./theme";
import type { Mode } from "./theme";

export type Elevation = "low" | "mid" | "high" | "flat" | number;

export type Pool = { cx: number; cy: number; r: number; a: number };

export type SlabProps = {
  x?: number;
  y?: number;
  w: number;
  h: number;
  radius?: number;
  /** A name, or a number 0..2 that interpolates low to mid to high (a lifting plane). */
  elevation?: Elevation;
  /** 0..1: the shadow fading in from nothing to its resting value (assembly phase 1). */
  shadow?: number;
  mode?: Mode;
  tone?: "surface" | "panel";
  opacity?: number;
  /** The key-light pool, in the slab's own coordinates, clipped to it. */
  pool?: Pool;
  /** Extra style on the outer element (a transform for a lift, a transformStyle for planes). */
  style?: CSSProperties;
  children?: ReactNode;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** The elevation row at t in 0..2: 0 low, 1 mid, 2 high, fractional between. */
export const elevationAt = (e: Elevation) => {
  const t = e === "low" ? 0 : e === "mid" ? 1 : e === "high" ? 2 : e === "flat" ? -1 : Math.min(2, Math.max(0, e));
  if (t < 0) return null;
  const a = t < 1 ? ELEVATION.low : ELEVATION.mid;
  const b = t < 1 ? ELEVATION.mid : ELEVATION.high;
  const k = t < 1 ? t : t - 1;
  return { blur: lerp(a.blur, b.blur, k), y: lerp(a.y, b.y, k), spread: lerp(a.spread, b.spread, k), t };
};

const r1 = (v: number) => Math.round(v * 10) / 10;

export const Slab = ({ x = 0, y = 0, w, h, radius = 8, elevation = "low", shadow = 1, mode, tone = "surface", opacity = 1, pool, style, children }: SlabProps) => {
  const th = useIllus();
  // A slab with no mode of its own takes the mode of the slab it sits in.
  const t = modeT(mode, useIllusMode());
  const row = elevationAt(elevation);
  const s = Math.min(1, Math.max(0, shadow));

  let boxShadow: string | undefined;
  if (row && s > 0) {
    if (th.shadow === "elevation") {
      const c = parseColor(th.shadowColor);
      boxShadow = `0 ${r1(row.y * s)}px ${r1(row.blur * s)}px ${r1(row.spread * s)}px ${alpha(th.shadowColor, c.a * s)}`;
    } else if (th.shadow === "hard") {
      const off = r1((12 + 6 * row.t) * s);
      boxShadow = `${off}px ${off}px 0 0 ${th.shadowColor}`;
    }
  }

  // The theme's edge belongs to the object (a slab with an elevation), never to a flat
  // panel inside it; a component draws its own 1 px strokes for those.
  const border = th.border && row ? `${th.border.width}px solid ${th.border.color}` : undefined;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: "border-box",
        borderRadius: radius,
        background: toneColor(th, t, tone),
        boxShadow,
        border,
        opacity,
        ...style,
      }}
    >
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: Math.max(0, radius - (border && th.border ? th.border.width : 0)) }}>
        {pool ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at ${pool.cx}px ${pool.cy}px, ${alpha(th.pool, pool.a)} 0px, ${alpha(th.pool, 0)} ${pool.r}px)`,
            }}
          />
        ) : null}
        <IllusMode value={t}>{children}</IllusMode>
      </div>
    </div>
  );
};
