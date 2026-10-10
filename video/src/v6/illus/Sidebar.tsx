// A navigation column: a greeked title bar where a product name would be, rows of a
// glyph slot and a bar on a 44 px pitch, a hairline between groups, and the active row
// lifted one step with a 2 px state marker on its left edge. No word, no logo, no avatar.
import { Bar } from "./Greek";
import { GREEK, greekWidths, stagger } from "./greek";
import { linePath, phase, rectPath, rowLift, Strokes, unit } from "./Outline";
import { toneColor, useIllus, useIllusMode } from "./theme";

export type SidebarProps = {
  x?: number;
  y?: number;
  w?: number;
  h: number;
  rows?: number;
  active?: number;
  glyph?: "slot" | "dot" | "none";
  groups?: number[];
  seed?: number;
  /** 0..1, the column's own 18-unit assembly. */
  assemble?: number;
  /** 0..1, the marker's own appearance; defaults to the tail of `assemble`. */
  state?: number;
  /** Draw a panel surface behind the rows (off inside a Screen, where the column sits on the surface). */
  panel?: boolean;
  /** The hairline along the right edge; defaults to `panel`. */
  rule?: boolean;
  /** The marker colour: the state colour, or the hi bar tone when another region of the screen is the lit one. */
  markerTone?: "state" | "hi";
};

export const SIDEBAR_PITCH = 44;
const PAD = 24;
const TOP = 72;
const SLOT = 16;
const GROUP_GAP = 16;

/** Row tops for `rows` rows in `groups`, with a 16 px gap holding a hairline between groups. */
export const sidebarRows = (rows: number, groups: number[]) => {
  const tops: number[] = [];
  const rules: number[] = [];
  let y = TOP;
  let inGroup = 0;
  let g = 0;
  for (let i = 0; i < rows; i++) {
    if (g < groups.length - 1 && inGroup === groups[g]) {
      rules.push(y + GROUP_GAP / 2);
      y += GROUP_GAP;
      inGroup = 0;
      g++;
    }
    tops.push(y);
    y += SIDEBAR_PITCH;
    inGroup++;
  }
  return { tops, rules };
};

export const Sidebar = ({ x = 0, y = 0, w = 240, h, rows = 8, active = 2, glyph = "slot", groups = [3, 5], seed = 1, assemble = 1, state, panel = true, rule, markerTone = "state" }: SidebarProps) => {
  const th = useIllus();
  const t = useIllusMode();
  const { tops, rules } = sidebarRows(rows, groups);
  const widths = greekWidths(seed, rows, 136);
  const titleW = greekWidths(seed + 7, 1, 120)[0];
  const surface = phase(assemble, 0, 6);
  const strokes = phase(assemble, 0, 12);
  const bars = phase(assemble, 4, 18);
  const lit = state ?? phase(assemble, 14, 18);
  const barX = PAD + (glyph === "none" ? 0 : SLOT + 12);

  const paths = [];
  if (rule ?? panel) paths.push({ d: linePath(w - 1, 0, w - 1, h - 1), draw: strokes });
  for (const ry of rules) paths.push({ d: linePath(PAD, ry, w - PAD - 1, ry), draw: strokes });
  if (glyph === "slot") {
    for (let i = 0; i < rows; i++) {
      const top = tops[i] + (SIDEBAR_PITCH - SLOT) / 2;
      paths.push({ d: rectPath(PAD, top, SLOT, SLOT, 4), draw: stagger(strokes, i, rows, 6, 1) });
    }
  }

  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      {panel ? <div style={{ position: "absolute", inset: 0, background: toneColor(th, t, "panel"), opacity: surface }} /> : null}
      {active >= 0 && active < rows ? (
        <>
          <div style={{ position: "absolute", left: 0, top: tops[active], width: w, height: SIDEBAR_PITCH, background: rowLift(toneColor(th, t, "lo")), opacity: lit }} />
          <div style={{ position: "absolute", left: 0, top: tops[active] + 8, width: 2, height: SIDEBAR_PITCH - 16, background: toneColor(th, t, markerTone), opacity: lit }} />
        </>
      ) : null}
      <Strokes w={w} h={h} paths={paths} />
      {glyph === "dot"
        ? tops.map((top, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: PAD + 5,
                top: top + SIDEBAR_PITCH / 2 - 3,
                width: 6,
                height: 6,
                borderRadius: 3,
                background: toneColor(th, t, "lo"),
                opacity: unit(stagger(strokes, i, rows, 6, 1)),
              }}
            />
          ))
        : null}
      <Bar x={PAD} y={PAD} w={titleW} h={GREEK.title.h} tone="hi" grow={stagger(bars, 0, rows + 1)} />
      {tops.map((top, i) => (
        <Bar key={i} x={barX} y={top + (SIDEBAR_PITCH - GREEK.body.h) / 2} w={widths[i]} h={GREEK.body.h} tone="lo" grow={stagger(bars, i + 1, rows + 1)} />
      ))}
    </div>
  );
};
