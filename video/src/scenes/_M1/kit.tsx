import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, mono } from "../../lib/theme";
import { clamp, EI, prog } from "../../lib/anim";

/**
 * Family kit for SCOPE modules M1–M3 (IdP · SSO / PASSWORD VAULT / MFA).
 * Shared language: blueprint dot grid, 1–1.5 px cream linework, mono labels (16 px minimum),
 * a slow camera push, one vermilion state change per module on beat 3 (f30), held for
 * 20 f, then the same speed-ramped exit into the cut (f50 → f58).
 */

export type Pt = { x: number; y: number };

/* ------------------------------------------------------------------ polylines */

/** Manhattan corner list → sampled polyline with rounded elbows. */
export const roundPoly = (corners: Pt[], r: number, seg = 7): Pt[] => {
  if (corners.length < 3) return corners.slice();
  const out: Pt[] = [corners[0]];
  for (let i = 1; i < corners.length - 1; i++) {
    const a = corners[i - 1];
    const b = corners[i];
    const c = corners[i + 1];
    const l1 = Math.hypot(b.x - a.x, b.y - a.y);
    const l2 = Math.hypot(c.x - b.x, c.y - b.y);
    const rr = Math.min(r, l1 / 2, l2 / 2);
    if (rr < 0.5 || l1 === 0 || l2 === 0) {
      out.push(b);
      continue;
    }
    const p1 = { x: b.x - ((b.x - a.x) / l1) * rr, y: b.y - ((b.y - a.y) / l1) * rr };
    const p2 = { x: b.x + ((c.x - b.x) / l2) * rr, y: b.y + ((c.y - b.y) / l2) * rr };
    for (let k = 0; k <= seg; k++) {
      const t = k / seg;
      const u = 1 - t;
      out.push({ x: u * u * p1.x + 2 * u * t * b.x + t * t * p2.x, y: u * u * p1.y + 2 * u * t * b.y + t * t * p2.y });
    }
  }
  out.push(corners[corners.length - 1]);
  return out;
};

export type Poly = { pts: Pt[]; cum: number[]; len: number };

export const poly = (pts: Pt[]): Poly => {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  return { pts, cum, len: cum[cum.length - 1] };
};

export const pointAt = (p: Poly, s: number): Pt => {
  const d = Math.max(0, Math.min(p.len, s));
  let i = 1;
  while (i < p.cum.length - 1 && p.cum[i] < d) i++;
  const seg = p.cum[i] - p.cum[i - 1] || 1;
  const t = (d - p.cum[i - 1]) / seg;
  const a = p.pts[i - 1];
  const b = p.pts[i];
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
};

/** Points of the polyline from 0 to length s (as an SVG points attribute). */
export const partialAttr = (p: Poly, s: number): string => {
  if (s <= 0) return "";
  const out: Pt[] = [p.pts[0]];
  for (let i = 1; i < p.pts.length; i++) {
    if (p.cum[i] <= s) out.push(p.pts[i]);
    else {
      out.push(pointAt(p, s));
      break;
    }
  }
  return out.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(" ");
};

/* ------------------------------------------------------------------ chrome */

/** Camera for the motif: slow push about `focus`, then a speed-ramped exit into the cut. */
export const Stage: React.FC<{ focus: Pt; children: React.ReactNode; push?: number; exitA?: number; exitB?: number }> = ({
  focus,
  children,
  push = 0.05,
  exitA = 50,
  exitB = 58,
}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 60], [1, 1 + push], clamp);
  const ex = prog(f, exitA, exitB, EI);
  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${-160 * ex}px) scale(${s + 0.025 * ex})`,
        transformOrigin: `${focus.x}px ${focus.y}px`,
        opacity: 1 - 0.92 * ex,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Blueprint dot grid with a radial falloff around `focus`, drifting slowly (parallax layer). Dots only: no registration crosses. */
export const DotGrid: React.FC<{ focus: Pt; rx?: number; ry?: number; drift?: number; id: string; opacity?: number }> = ({
  focus,
  rx = 760,
  ry = 460,
  drift = 0.35,
  id,
  opacity = 1,
}) => {
  const f = useCurrentFrame();
  const off = -f * drift;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity }}>
      <defs>
        <pattern id={`${id}-p`} width={32} height={32} patternUnits="userSpaceOnUse" x={off} y={off * 0.3}>
          <circle cx={16} cy={16} r={1.1} fill={C.paper} opacity={0.16} />
        </pattern>
        <radialGradient id={`${id}-g`} cx={focus.x} cy={focus.y} r={rx} gradientUnits="userSpaceOnUse"
          gradientTransform={`translate(${focus.x} ${focus.y}) scale(1 ${ry / rx}) translate(${-focus.x} ${-focus.y})`}>
          <stop offset="0" stopColor="#fff" stopOpacity={1} />
          <stop offset="0.55" stopColor="#fff" stopOpacity={0.55} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </radialGradient>
        <mask id={`${id}-m`}>
          <rect width={1920} height={1080} fill={`url(#${id}-g)`} />
        </mask>
      </defs>
      <g mask={`url(#${id}-m)`}>
        <rect width={1920} height={1080} fill={`url(#${id}-p)`} />
      </g>
    </svg>
  );
};

/** Mono system label (uppercase, tracked). Never below 16 px. */
export const Mono: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({
  children,
  size = 16,
  color = C.dim,
  style,
}) => (
  <div style={{ fontFamily: mono, fontSize: Math.max(16, size), letterSpacing: "0.22em", textTransform: "uppercase", color, whiteSpace: "nowrap", ...style }}>
    {children}
  </div>
);

/** Masked wipe reveal (left → right) for labels: UI snaps in behind a hard edge, no fade-up. */
export const Wipe: React.FC<{ p: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ p, children, style }) => (
  <div style={{ clipPath: `inset(-20% ${(1 - Math.max(0, Math.min(1, p))) * 100}% -20% 0)`, ...style }}>{children}</div>
);

/** Brief 0→1→0 flash envelope starting at frame `at`. */
export const flashAt = (f: number, at: number, len = 6) => interpolate(f, [at, at + 1, at + len], [0, 1, 0], clamp);
