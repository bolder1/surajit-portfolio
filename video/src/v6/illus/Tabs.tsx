// A tab row: lo bars in a line, a 2 px state underline under the active one. `index`
// may be fractional, so the underline slides between two tabs. A hairline along the
// bottom unless the parent draws its own rule.
import { Bar } from "./Greek";
import { GREEK, greekWidths, stagger } from "./greek";
import { linePath, phase, Strokes, unit } from "./Outline";
import { toneColor, useIllus, useIllusMode } from "./theme";

export type TabsProps = {
  x?: number;
  y?: number;
  w: number;
  items?: number;
  index?: number;
  seed?: number;
  assemble?: number;
  rule?: boolean;
  /** The underline colour: the state colour, or the hi bar tone inside a screen whose lit thing is elsewhere. */
  markerTone?: "state" | "hi";
};

export const TABS_H = 40;
const GAP = 24;

/** Tab lefts and widths for `items` tabs from a seed. */
export const tabRects = (seed: number, items: number) => {
  const widths = greekWidths(seed + 17, items, 96);
  const out: { x: number; w: number }[] = [];
  let x = 0;
  for (let i = 0; i < items; i++) {
    out.push({ x, w: widths[i] });
    x += widths[i] + GAP;
  }
  return out;
};

export const Tabs = ({ x = 0, y = 0, w, items = 3, index = 0, seed = 1, assemble = 1, rule = true, markerTone = "state" }: TabsProps) => {
  const th = useIllus();
  const t = useIllusMode();
  const rects = tabRects(seed, items);
  const strokes = phase(assemble, 0, 12);
  const bars = phase(assemble, 4, 18);
  const lit = phase(assemble, 14, 18);
  const i0 = Math.min(items - 1, Math.max(0, Math.floor(index)));
  const i1 = Math.min(items - 1, i0 + 1);
  const k = unit(index - i0);
  const a = rects[i0];
  const b = rects[i1];
  const ux = a.x + (b.x - a.x) * k;
  const uw = a.w + (b.w - a.w) * k;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: TABS_H }}>
      {rule ? <Strokes w={w} h={TABS_H} paths={[{ d: linePath(0, TABS_H - 1, w - 1, TABS_H - 1), draw: strokes }]} /> : null}
      {rects.map((r, i) => (
        <Bar key={i} x={r.x} y={(TABS_H - 2 - GREEK.body.h) / 2} w={r.w} h={GREEK.body.h} tone="lo" grow={stagger(bars, i, items)} />
      ))}
      <div style={{ position: "absolute", left: ux, top: TABS_H - 2, width: uw, height: 2, background: toneColor(th, t, markerTone), opacity: lit }} />
    </div>
  );
};
