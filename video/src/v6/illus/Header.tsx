// A page header band: a greeked title at the left, an optional search box, outlined
// action pills at the right, a hairline along the bottom. No avatar, no chip, no mark.
import { Glyph } from "./Glyph";
import { Bar } from "./Greek";
import { GREEK, greekWidths, stagger } from "./greek";
import { linePath, phase, rectPath, Strokes } from "./Outline";

export type HeaderProps = {
  x?: number;
  y?: number;
  w: number;
  h?: number;
  title?: boolean;
  actions?: number;
  search?: boolean;
  seed?: number;
  assemble?: number;
  /** A taller title row (a page title): the title bar is drawn at the display scale. */
  titleH?: number;
  /** The hairline under the band (off when the band is the top of a plain panel). */
  rule?: boolean;
};

const PAD = 24;
const PILL_H = 32;
const SEARCH_W = 240;

export const Header = ({ x = 0, y = 0, w, h = 64, title = true, actions = 2, search = false, seed = 1, assemble = 1, titleH, rule = true }: HeaderProps) => {
  const strokes = phase(assemble, 0, 12);
  const n = 1 + actions + (search ? 1 : 0);
  const bars = phase(assemble, 4, 18);
  const scale = titleH && titleH >= 44 ? GREEK.display : GREEK.title;
  const titleW = greekWidths(seed + 3, 1, 240)[0];
  const pillBars = greekWidths(seed + 11, actions, 88);

  const paths = [];
  if (rule) paths.push({ d: linePath(0, h - 1, w - 1, h - 1), draw: strokes });
  // Action pills, right-aligned, 12 apart.
  const pills: { x: number; w: number }[] = [];
  let right = w - PAD;
  for (let i = 0; i < actions; i++) {
    const pw = pillBars[i] + 32;
    right -= pw;
    pills.push({ x: right, w: pw });
    paths.push({ d: rectPath(right, (h - PILL_H) / 2, pw, PILL_H, 4), draw: stagger(strokes, i + 1, n, 8, 2) });
    right -= 12;
  }
  const searchX = right - 16 - SEARCH_W;
  if (search) paths.push({ d: rectPath(searchX, (h - PILL_H) / 2, SEARCH_W, PILL_H, 4), draw: stagger(strokes, n - 1, n, 8, 2) });

  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      <Strokes w={w} h={h} paths={paths} />
      {title ? <Bar x={PAD} y={(h - scale.h) / 2} w={titleW} h={scale.h} tone="hi" grow={stagger(bars, 0, n)} /> : null}
      {pills.map((p, i) => (
        <Bar key={i} x={p.x + 16} y={(h - GREEK.body.h) / 2} w={p.w - 32} h={GREEK.body.h} tone="lo" grow={stagger(bars, i + 1, n)} />
      ))}
      {search ? (
        <>
          <Glyph name="search" x={searchX + 10} y={(h - 16) / 2} draw={stagger(strokes, n - 1, n, 8, 2)} />
          <Bar x={searchX + 36} y={(h - GREEK.body.h) / 2} w={greekWidths(seed + 5, 1, 120)[0]} h={GREEK.body.h} tone="lo" grow={stagger(bars, n - 1, n)} />
        </>
      ) : null}
    </div>
  );
};
