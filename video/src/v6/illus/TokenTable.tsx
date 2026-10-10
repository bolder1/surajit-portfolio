// A token table: a header row (a type column, a name column, and the two mode names
// the scene passes as the table's own column names), rows of a name, swatch A with its
// hex, swatch B with its hex. Rows marked greek draw name and hex as bars and the
// swatches as 1 px outlined squares; `far` greeks every row not marked typed. The lit
// column is the ink, the unlit one the support. The only typed words are the ones the
// scene passes in; the kit types nothing of its own.
import type { ReactNode } from "react";
import { ARTEFACT_FONT } from "./artefact";
import { Bar } from "./Greek";
import { GREEK, greekWidths, stagger } from "./greek";
import { linePath, phase, rectPath, Strokes } from "./Outline";
import type { StrokeSpec } from "./Outline";
import { Slab } from "./Slab";
import { alpha, toneColor, useIllus, useIllusMode } from "./theme";

export type TokenRow = {
  /** The token's name as the scene gives it (through tokenName in the scene). */
  name?: string;
  a?: { hex: string };
  b?: { hex: string };
  greek?: boolean;
  typed?: boolean;
};

export type TokenTableProps = {
  x?: number;
  y?: number;
  rows: TokenRow[];
  colA: string;
  colB: string;
  /** The first two header cells, typed only if the scene passes them; bars otherwise. */
  colType?: string;
  colName?: string;
  lit?: "a" | "b";
  far?: boolean;
  w?: number;
  rowH?: number;
  seed?: number;
  assemble?: number;
  card?: boolean;
};

const PAD = 24;
const TYPE_W = 120;
const MODE_W = 300;
const SWATCH = 20;
const FONT = 18;

export const tokenTableHeight = (rows: number, rowH: number, card = true) => (rows + 1) * rowH + (card ? PAD * 2 : 0);

export const TokenTable = ({ x = 0, y = 0, rows, colA, colB, colType, colName, lit, far = false, w = 1200, rowH = 44, seed = 1, assemble = 1, card = true }: TokenTableProps) => {
  const th = useIllus();
  const t = useIllusMode();
  const pad = card ? PAD : 0;
  const h = tokenTableHeight(rows.length, rowH, card);
  const surface = phase(assemble, 0, 6);
  const strokes = phase(assemble, 0, 12);
  const bars = phase(assemble, 4, 18);
  const ink = alpha(toneColor(th, t, "hi"), 1);
  const support = alpha(toneColor(th, t, "stroke"), 1);
  const litA = lit === "a" ? ink : support;
  const litB = lit === "b" ? ink : support;

  const innerW = w - pad * 2;
  const xType = pad;
  const xName = pad + TYPE_W;
  const nameW = innerW - TYPE_W - MODE_W * 2;
  const xA = xName + nameW;
  const xB = xA + MODE_W;

  const paths: StrokeSpec[] = [];
  for (let r = 1; r <= rows.length; r++) {
    const ry = pad + r * rowH;
    paths.push({ d: linePath(pad, ry, w - pad - 1, ry), draw: stagger(strokes, r, rows.length + 1, 6, 1), opacity: r === 1 ? 1 : 0.6 });
  }

  const text = (s: string, color: string, left: number, top: number, grow: number) => (
    <div
      style={{
        position: "absolute",
        left,
        top,
        height: rowH,
        lineHeight: `${rowH}px`,
        fontFamily: ARTEFACT_FONT,
        fontSize: FONT,
        color,
        whiteSpace: "nowrap",
        opacity: grow,
      }}
    >
      {s}
    </div>
  );

  const swatchOutlines: StrokeSpec[] = [];
  const cells: ReactNode[] = [];
  rows.forEach((row, i) => {
    const r = i + 1;
    const top = pad + r * rowH;
    const g = stagger(bars, r, rows.length + 1);
    const greek = row.greek || (far && !row.typed);
    const cy = top + (rowH - SWATCH) / 2;
    if (greek || !row.name) {
      cells.push(<Bar key={`n${i}`} x={xName} y={top + (rowH - GREEK.body.h) / 2} w={greekWidths(seed + i * 3, 1, Math.round(nameW * 0.7))[0]} h={GREEK.body.h} tone="lo" grow={g} />);
    } else {
      cells.push(<div key={`n${i}`}>{text(row.name, ink, xName, top, g)}</div>);
    }
    cells.push(<Bar key={`t${i}`} x={xType} y={top + (rowH - GREEK.caption.h) / 2} w={greekWidths(seed + i * 5, 1, 56)[0]} h={GREEK.caption.h} tone="lo" grow={g} />);
    const modeCell = (key: string, left: number, v: { hex: string } | undefined, color: string, sd: number) => {
      if (greek || !v) {
        swatchOutlines.push({ d: rectPath(left, cy, SWATCH, SWATCH, 4), draw: g });
        cells.push(<Bar key={key} x={left + SWATCH + 12} y={top + (rowH - GREEK.body.h) / 2} w={greekWidths(seed + sd, 1, 72)[0]} h={GREEK.body.h} tone="lo" grow={g} />);
      } else {
        cells.push(
          <div key={key}>
            <div style={{ position: "absolute", left, top: cy, width: SWATCH, height: SWATCH, borderRadius: 4, background: v.hex, opacity: g }} />
            {text(v.hex, color, left + SWATCH + 12, top, g)}
          </div>,
        );
      }
    };
    modeCell(`a${i}`, xA, row.a, litA, i * 7 + 1);
    modeCell(`b${i}`, xB, row.b, litB, i * 7 + 2);
  });

  const headTop = pad;
  const hg = stagger(bars, 0, rows.length + 1);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      {card ? (
        <>
          <Slab w={w} h={h} elevation="flat" tone="panel" opacity={surface} />
          <Strokes w={w} h={h} paths={[{ d: rectPath(0, 0, w, h, 8), draw: strokes }]} />
        </>
      ) : null}
      <Strokes w={w} h={h} paths={paths} />
      {colType ? text(colType, support, xType, headTop, hg) : <Bar x={xType} y={headTop + (rowH - GREEK.caption.h) / 2} w={48} h={GREEK.caption.h} tone="hi" grow={hg} />}
      {colName ? text(colName, support, xName, headTop, hg) : <Bar x={xName} y={headTop + (rowH - GREEK.caption.h) / 2} w={96} h={GREEK.caption.h} tone="hi" grow={hg} />}
      {text(colA, litA, xA, headTop, hg)}
      {text(colB, litB, xB, headTop, hg)}
      {cells}
      <Strokes w={w} h={h} paths={swatchOutlines} />
    </div>
  );
};
