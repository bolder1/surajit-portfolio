import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C } from "./theme";
import { clamp, rand } from "./anim";

/** Animated film grain from pre-baked noise tiles. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const f = useCurrentFrame();
  const i = f % 8;
  const ox = Math.floor(rand(f * 1.3) * 512);
  const oy = Math.floor(rand(f * 2.7) * 512);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile(`img/grain-${i}.png`)})`,
        backgroundPosition: `${ox}px ${oy}px`,
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.75 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 75% 70% at 50% 50%, transparent 45%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

export const Scanlines: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => (
  <AbsoluteFill
    style={{
      backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.9) 0 1px, transparent 1px 4px)",
      opacity,
      mixBlendMode: "overlay",
      pointerEvents: "none",
    }}
  />
);

/** Slow cinematic push-in + drift for the whole scene. */
export const Camera: React.FC<{
  children: React.ReactNode;
  dur: number;
  from?: number;
  to?: number;
  driftX?: number;
  driftY?: number;
  rotate?: number;
}> = ({ children, dur, from = 1, to = 1.06, driftX = 0, driftY = 0, rotate = 0 }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, dur], [0, 1], clamp);
  const s = from + (to - from) * t;
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${driftX * t}px, ${driftY * t}px) scale(${s}) rotate(${rotate * t}deg)`,
        transformOrigin: "50% 50%",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** RGB-split text/element. amount in px. */
export const Chroma: React.FC<{ children: React.ReactNode; amount: number; style?: React.CSSProperties }> = ({
  children,
  amount,
  style,
}) => {
  if (amount < 0.3) return <div style={style}>{children}</div>;
  return (
    <div style={{ position: "relative", ...style }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-amount}px)`, color: "#ff2a1a", mixBlendMode: "screen", opacity: 0.9 }}>
        {children}
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${amount}px)`, color: "#19e6ff", mixBlendMode: "screen", opacity: 0.7 }}>
        {children}
      </div>
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
};

/** Horizontal slice glitch. intensity 0..1, seeded per frame. */
export const Glitch: React.FC<{ children: React.ReactNode; intensity: number; seed?: number; slices?: number }> = ({
  children,
  intensity,
  seed = 1,
  slices = 9,
}) => {
  const f = useCurrentFrame();
  if (intensity <= 0.01) return <>{children}</>;
  const bands: React.ReactNode[] = [];
  let y = 0;
  for (let i = 0; i < slices; i++) {
    const h = (100 / slices) * (0.4 + rand(i * 3.1 + seed + Math.floor(f / 2)) * 1.2);
    const top = y;
    const bottom = Math.min(100, y + h);
    y = bottom;
    const r = rand(i * 9.7 + f * 0.37 + seed);
    const off = (r - 0.5) * 2 * 90 * intensity * (r > 0.55 || r < 0.25 ? 1 : 0.1);
    bands.push(
      <AbsoluteFill key={i} style={{ clipPath: `inset(${top}% 0 ${100 - bottom}% 0)`, transform: `translateX(${off}px)` }}>
        {children}
      </AbsoluteFill>,
    );
    if (y >= 100) break;
  }
  return <AbsoluteFill>{bands}</AbsoluteFill>;
};

/** Radial emissive glow blob */
export const Glow: React.FC<{ x: number; y: number; r: number; color?: string; opacity?: number }> = ({
  x,
  y,
  r,
  color = C.accGlow,
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
      opacity,
      pointerEvents: "none",
    }}
  />
);

/** Flash frame (white or accent) */
export const Flash: React.FC<{ at: number; len?: number; color?: string; max?: number }> = ({ at, len = 6, color = "#fff", max = 0.85 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 1, at + len], [0, max, 0], clamp);
  return <AbsoluteFill style={{ background: color, opacity: o, mixBlendMode: "screen", pointerEvents: "none" }} />;
};

/** Vermilion light leak (WebGL), toned down and screened over the scene. */
import { LightLeak } from "@remotion/light-leaks";
export const Leak: React.FC<{ dur?: number; seed?: number; opacity?: number }> = ({ dur = 30, seed = 4, opacity = 0.55 }) => (
  <AbsoluteFill style={{ opacity, mixBlendMode: "screen", pointerEvents: "none" }}>
    <LightLeak durationInFrames={dur} seed={seed} hueShift={40} />
  </AbsoluteFill>
);
