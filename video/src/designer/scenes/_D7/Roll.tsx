// Rolling-mask numerals (odometer): each digit lives in its own fixed-width box, so the total width never jumps.
import React from "react";
import { numeral } from "../../type";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

/** One digit window. `pos` is the continuous column position (0..10): 0 shows "0", 7 shows "7", 10 shows the wrapped "0". */
export const RollDigit: React.FC<{ pos: number; size: number; color: string; boxW: number; boxH?: number }> = ({ pos, size, color, boxW, boxH }) => {
  const h = boxH ?? Math.round(size * 0.86);
  return (
    <div style={{ position: "relative", width: boxW, height: h, overflow: "hidden", flex: "none" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: boxW, transform: `translateY(${-pos * h}px)` }}>
        {DIGITS.map((d, i) => (
          <div key={i} style={{ ...numeral(size), height: h, lineHeight: `${h}px`, width: boxW, textAlign: "center", color }}>
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

/** A static glyph in a fixed box (for "~", "%", ".", ...). */
export const GlyphBox: React.FC<{ ch: string; size: number; color: string; boxW: number; boxH?: number; style?: React.CSSProperties }> = ({ ch, size, color, boxW, boxH, style }) => {
  const h = boxH ?? Math.round(size * 0.86);
  return (
    <div style={{ position: "relative", width: boxW, height: h, flex: "none", ...style }}>
      <div style={{ ...numeral(size), height: h, lineHeight: `${h}px`, width: boxW, textAlign: "center", color, whiteSpace: "nowrap" }}>{ch}</div>
    </div>
  );
};

/** Odometer positions for a two-digit counter that counts to `value` (continuous float 0..99). Tens advance while the ones wrap. */
export const odometer = (value: number): [number, number] => {
  const v = Math.max(0, value);
  const ones = v % 10;
  const tens = Math.floor(v / 10) + Math.max(0, ones - 9);
  return [tens, ones];
};
