// Odometer numeral for D10: every digit sits in its own masked box and a strip of 0-9 rolls inside it (absolute layout only).
// The strip eases out so the final digit lands EXACTLY on frame `land` (progress is 1 from then on).
import React from "react";
import { Easing, interpolate } from "remotion";
import { numeral } from "../../type";

const ROLL = Easing.bezier(0.2, 0.85, 0.25, 1);

export interface OdometerProps {
  /** digits to land on, e.g. "58" ("+" is drawn as a static glyph that slams in on `land`) */
  value: string;
  frame: number;
  /** frame the roll begins */
  start: number;
  /** frame the digits settle (the hit) */
  land: number;
  size: number;
  color: string;
  /** hard shadow colour and offset in px (0 = none) */
  shadow?: string;
  shadowPx?: number;
  /** box width of one digit as a multiple of size */
  dw?: number;
  wdth?: number;
}

const PAD = 14;

const Digit: React.FC<{ x: number; d: number; cycles: number; p: number; size: number; bh: number; dw: number; color: string; shadow?: string; shadowPx: number; wdth: number }> = ({
  x, d, cycles, p, size, bh, dw, color, shadow, shadowPx, wdth,
}) => {
  const steps = cycles * 10 + d;
  const pos = p * steps;
  const lo = Math.max(0, Math.floor(pos) - 1);
  const hi = Math.min(steps, Math.ceil(pos) + 2);
  const items: React.ReactNode[] = [];
  const glyph: React.CSSProperties = { ...numeral(size, wdth, 800), position: "absolute", left: PAD, width: dw, textAlign: "center", height: bh, lineHeight: `${bh}px` };
  for (let i = lo; i <= hi; i++) {
    const top = PAD + (i - pos) * bh;
    items.push(
      <React.Fragment key={i}>
        {shadow && shadowPx > 0 ? <div style={{ ...glyph, top: top + shadowPx, left: PAD + shadowPx, color: shadow }}>{i % 10}</div> : null}
        <div style={{ ...glyph, top, color }}>{i % 10}</div>
      </React.Fragment>,
    );
  }
  return <div style={{ position: "absolute", left: x - PAD, top: -PAD, width: dw + PAD * 2, height: bh + PAD * 2, overflow: "hidden" }}>{items}</div>;
};

/** Total width of the numeral in px (digits + the "+"). */
export const odometerWidth = (value: string, size: number, dw = 0.5) => value.split("").reduce((a, ch) => a + (ch === "+" ? size * 0.5 : size * dw), 0);

export const Odometer: React.FC<OdometerProps> = ({ value, frame, start, land, size, color, shadow, shadowPx = 0, dw = 0.5, wdth = 78 }) => {
  const bh = Math.round(size * 0.86);
  const w = Math.round(size * dw);
  const chars = value.split("");
  const nd = chars.filter((c) => c !== "+").length;
  let di = 0;
  let x = 0;
  const out: React.ReactNode[] = [];
  chars.forEach((ch, i) => {
    if (ch === "+") {
      // the plus slams in on the landing frame
      const t = interpolate(frame, [land, land + 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 1.5, 0.4, 1) });
      if (t > 0) {
        out.push(
          <div key={i} style={{ position: "absolute", left: x, top: 0, width: size * 0.5, height: bh, transform: `scale(${t})`, transformOrigin: "50% 58%", ...numeral(size, wdth, 800), lineHeight: `${bh}px`, textAlign: "center", color }}>
            {shadow && shadowPx > 0 ? <div style={{ position: "absolute", left: shadowPx, top: shadowPx, width: "100%", color: shadow }}>+</div> : null}
            <div style={{ position: "absolute", left: 0, top: 0, width: "100%" }}>+</div>
          </div>,
        );
      }
      x += size * 0.5;
      return;
    }
    const idx = di++;
    const fromEnd = nd - 1 - idx;
    const s = interpolate(frame, [start, land], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ROLL });
    out.push(<Digit key={i} x={x} d={Number(ch)} cycles={fromEnd === 0 ? 2 : 1} p={s} size={size} bh={bh} dw={w} color={color} shadow={shadow} shadowPx={shadowPx} wdth={wdth} />);
    x += w;
  });
  return <div style={{ position: "absolute", left: 0, top: 0, width: x, height: bh }}>{out}</div>;
};
