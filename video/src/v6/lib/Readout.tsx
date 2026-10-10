// The readout: a two-row token readout, R1 (the Theme row) and R2 (the Mode row) of chapter 6. Row 1 is the
// token path; row 2 is two columns, "BLUE #0052CC · ORANGE #EB5424", the lit column in Ink and the unlit one in
// Support. On a flip the lit column moves (lit 0 to 1 over 6 f, linear, the scene's prog with Easing.linear).
// The scene registers one block (kind "readout", text "path\ncolA · colB"); this renders it through TextBlock as
// one derived block per piece, each with the registered block's frames, so the leader, the landing and the sink
// are the block's own. Nothing here registers. Source: v6/V1-DIRECTION.md 4.6 B6, 9.2.
import React from "react";
import { K } from "../tokens";
import { TextBlock } from "../TextBlock";
import type { BlockSpec } from "../text-manifest";
import { label, measureLine, useArchivo } from "../type";

/** Mix two hex colours (#rrggbb) at t 0..1. */
export const mixHex = (a: string, b: string, t: number): string => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r1, g1, b1] = p(a);
  const [r2, g2, b2] = p(b);
  const k = Math.max(0, Math.min(1, t));
  const c = (x: number, y: number) => Math.round(x + (y - x) * k);
  return `rgb(${c(r1, r2)},${c(g1, g2)},${c(b1, b2)})`;
};

export type ReadoutProps = {
  /** The registered readout block: line 1 the token path, line 2 "A · B" (the columns, split at " · "). */
  block: BlockSpec;
  /** Left edge in frame px. */
  x: number;
  /** Top of row 1 in frame px. */
  y: number;
  /** 0..1: which column is lit (0 the first, 1 the second); tween it over the flip's 6 f. */
  lit?: number;
  /** Row pitch in px (row 2's top is y + pitch). */
  pitch?: number;
  /** Gap on either side of the middle dot, in px. */
  gap?: number;
  litColor?: string;
  unlitColor?: string;
  pathColor?: string;
  leader?: { len?: number; color?: string } | false;
};

/** The pieces of a readout block: the path, and the two columns of row 2. */
export const readoutParts = (block: BlockSpec) => {
  const [path = "", row = ""] = block.text.split("\n");
  const cols = row.split(" · ");
  return { path, a: cols[0] ?? "", b: cols.slice(1).join(" · ") };
};

const piece = (block: BlockSpec, suffix: string, text: string): BlockSpec => ({
  ...block,
  id: `${block.id}${suffix}`,
  text,
  lineException: !/\s/.test(text.trim()),
});

export const Readout: React.FC<ReadoutProps> = ({ block, x, y, lit = 0, pitch, gap = 14, litColor = K.ink, unlitColor = K.support, pathColor = K.ink, leader }) => {
  const ready = useArchivo();
  const { path, a, b } = readoutParts(block);
  const style = label(block.size, true);
  const rowPitch = pitch ?? Math.round(block.size * 1.2) + 14;
  const wA = ready ? measureLine(a, style).width : 0;
  const wDot = ready ? measureLine("·", style).width : 0;
  const xDot = x + wA + gap;
  const xB = xDot + wDot + gap;
  const colA = mixHex(litColor, unlitColor, lit);
  const colB = mixHex(unlitColor, litColor, lit);
  const y2 = y + rowPitch;
  return (
    <>
      <TextBlock block={piece(block, ".path", path)} x={x} y={y} real color={pathColor} leader={leader} />
      <TextBlock block={piece(block, ".a", a)} x={x} y={y2} width={wA + 4} real color={colA} leader={false} />
      <TextBlock block={piece(block, ".dot", "·")} x={xDot} y={y2} width={wDot + 4} real color={unlitColor} leader={false} />
      <TextBlock block={piece(block, ".b", b)} x={xB} y={y2} real color={colB} leader={false} />
    </>
  );
};
