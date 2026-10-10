// A line chart card: a greeked title, a 1 px axis pair, hairline gridlines with tick
// marks, one polyline from a seeded series drawn on with evolvePath, and an optional
// highlighted point (a 6 px state dot on a vertical hairline). No labels, no numbers,
// no fill under the line.
import { useMemo } from "react";
import { Bar } from "./Greek";
import { GREEK, greekWidths, seriesFrom, stagger } from "./greek";
import { linePath, Outline, phase, polyPath, Strokes } from "./Outline";
import type { StrokeSpec } from "./Outline";
import { Slab } from "./Slab";
import { toneColor, useIllus, useIllusMode } from "./theme";

export type LineChartProps = {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  points?: number;
  grid?: number;
  highlight?: number;
  seed?: number;
  /** 0..1, the polyline drawing on (24 f in a screen). */
  draw?: number;
  assemble?: number;
  /** The card around the plot (off when the chart sits in a card of its own). */
  card?: boolean;
};

const PAD = 24;
const TITLE_H = 36;

export const LineChart = ({ x = 0, y = 0, w = 720, h = 300, points = 24, grid = 4, highlight, seed = 1, draw = 1, assemble = 1, card = true }: LineChartProps) => {
  const th = useIllus();
  const t = useIllusMode();
  const surface = phase(assemble, 0, 6);
  const strokes = phase(assemble, 0, 12);
  const bars = phase(assemble, 4, 12);
  const titleW = greekWidths(seed + 1, 1, 200)[0];

  const left = PAD;
  const right = w - PAD;
  const top = PAD + (card ? TITLE_H : 0);
  const bottom = h - PAD;

  const { line, pts } = useMemo(() => {
    const s = seriesFrom(seed, points);
    const p = s.map((v, i) => ({ x: left + 0.5 + ((right - left - 1) * i) / (points - 1), y: bottom - 0.5 - (bottom - top - 1) * v }));
    return { line: polyPath(p), pts: p };
  }, [seed, points, left, right, top, bottom]);

  const frame: StrokeSpec[] = [];
  frame.push({ d: linePath(left, top, left, bottom - 1), draw: strokes });
  frame.push({ d: linePath(left, bottom - 1, right - 1, bottom - 1), draw: strokes });
  for (let g = 1; g <= grid; g++) {
    const gy = Math.round(bottom - 1 - ((bottom - top - 1) * g) / grid);
    frame.push({ d: linePath(left + 4, gy, right - 1, gy), draw: stagger(strokes, g, grid + 1, 6, 1), opacity: 0.6 });
    frame.push({ d: linePath(left - 4, gy, left, gy), draw: strokes });
  }
  const ticks = 6;
  for (let k = 1; k <= ticks; k++) {
    const tx = Math.round(left + ((right - left - 1) * k) / ticks);
    frame.push({ d: linePath(tx, bottom - 1, tx, bottom + 3), draw: strokes });
  }

  const hi = highlight !== undefined && highlight >= 0 && highlight < points ? pts[highlight] : null;
  const hiOn = phase(assemble, 14, 18) * (draw >= 1 ? 1 : 0);

  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      {card ? (
        <>
          <Slab w={w} h={h} elevation="flat" tone="panel" opacity={surface} />
          <Outline w={w} h={h} radius={8} draw={strokes} />
          <Bar x={PAD} y={PAD} w={titleW} h={GREEK.title.h} tone="hi" grow={stagger(bars, 0, 1)} />
        </>
      ) : null}
      <Strokes w={w} h={h} paths={frame} />
      <Strokes w={w} h={h} paths={[{ d: line, draw, tone: "hi" }]} />
      {hi ? (
        <>
          <Strokes w={w} h={h} paths={[{ d: linePath(Math.round(hi.x) , top, Math.round(hi.x), bottom - 1), draw: 1 }]} opacity={hiOn} />
          <div
            style={{
              position: "absolute",
              left: hi.x - 3,
              top: hi.y - 3,
              width: 6,
              height: 6,
              borderRadius: 3,
              background: toneColor(th, t, "state"),
              opacity: hiOn,
            }}
          />
        </>
      ) : null}
    </div>
  );
};
