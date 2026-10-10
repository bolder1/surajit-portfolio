// A data table in a card: a header row of hi bars, body rows of lo bars, one hairline
// between rows, one bar per cell. The highlighted row lifts its surface one step and
// carries a 2 px state marker at the card's left edge. Column widths come from the seed
// unless given. No value anywhere: every cell is a bar.
import { Bar } from "./Greek";
import { GREEK, greekWidths, stagger } from "./greek";
import { linePath, Outline, phase, rowLift, Strokes } from "./Outline";
import { Slab } from "./Slab";
import { toneColor, useIllus, useIllusMode } from "./theme";

export type TableProps = {
  x?: number;
  y?: number;
  w: number;
  cols?: number;
  rows?: number;
  rowH?: number;
  header?: boolean;
  /** Fractions of the content width, summing to about 1. */
  colWidths?: number[];
  highlight?: number;
  seed?: number;
  assemble?: number;
  state?: number;
  /** The card around the rows (off inside another container). */
  card?: boolean;
  /** A fixed height for the card; defaults to the rows' height plus padding. */
  h?: number;
  markerTone?: "state" | "hi";
};

const PAD = 24;
const CELL_GAP = 16;

/** Column fractions from a seed: the greeking rhythm at a large base, normalised. */
export const tableColumns = (seed: number, cols: number) => {
  const raw = greekWidths(seed * 419, cols, 1000);
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map((r) => r / sum);
};

export const tableHeight = (rows: number, rowH: number, header: boolean, card = true) => (rows + (header ? 1 : 0)) * rowH + (card ? PAD * 2 : 0);

export const Table = ({ x = 0, y = 0, w, cols = 5, rows = 6, rowH = 40, header = true, colWidths, highlight, seed = 1, assemble = 1, state, card = true, h, markerTone = "state" }: TableProps) => {
  const th = useIllus();
  const t = useIllusMode();
  const pad = card ? PAD : 0;
  const innerW = w - pad * 2;
  const fr = colWidths ?? tableColumns(seed, cols);
  const total = rows + (header ? 1 : 0);
  const height = h ?? tableHeight(rows, rowH, header, card);
  const surface = phase(assemble, 0, 6);
  const strokes = phase(assemble, 0, 12);
  const bars = phase(assemble, 4, 18);
  const lit = state ?? phase(assemble, 14, 18);

  // Column lefts and widths inside the padding.
  const colX: number[] = [];
  const colW: number[] = [];
  let cx = pad;
  for (let c = 0; c < cols; c++) {
    const cw = Math.floor(innerW * fr[c]);
    colX.push(cx);
    colW.push(cw - CELL_GAP);
    cx += cw;
  }

  const paths = [];
  for (let r = 1; r < total; r++) {
    const ry = pad + r * rowH;
    paths.push({ d: linePath(pad, ry, w - pad - 1, ry), draw: stagger(strokes, r, total, 6, 1) });
  }

  const hiRow = highlight !== undefined && highlight >= 0 && highlight < rows ? highlight + (header ? 1 : 0) : -1;

  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: height }}>
      {card ? (
        <>
          <Slab w={w} h={height} elevation="flat" tone="panel" opacity={surface} />
          <Outline w={w} h={height} radius={8} draw={strokes} />
        </>
      ) : null}
      {hiRow >= 0 ? (
        <>
          <div style={{ position: "absolute", left: card ? 8 : 0, top: pad + hiRow * rowH, width: w - (card ? 16 : 0), height: rowH, background: rowLift(toneColor(th, t, "lo")), opacity: lit }} />
          <div style={{ position: "absolute", left: 0, top: pad + hiRow * rowH + 8, width: 2, height: rowH - 16, background: toneColor(th, t, markerTone), opacity: lit }} />
        </>
      ) : null}
      <Strokes w={w} h={height} paths={paths} />
      {Array.from({ length: total }, (_, r) => {
        const isHead = header && r === 0;
        const bh = isHead ? GREEK.caption.h : GREEK.body.h;
        return Array.from({ length: cols }, (_, c) => {
          const base = Math.max(32, Math.round(colW[c] * (isHead ? 0.6 : 0.8)));
          const bw = Math.min(colW[c], greekWidths(seed * 7 + r * 31 + c * 3, 1, base)[0]);
          return (
            <Bar
              key={`${r}-${c}`}
              x={colX[c]}
              y={pad + r * rowH + (rowH - bh) / 2}
              w={bw}
              h={bh}
              tone={isHead ? "hi" : "lo"}
              grow={stagger(bars, r, total)}
            />
          );
        });
      })}
    </div>
  );
};
