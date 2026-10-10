// A stat tile: a container in the panel tone with a caption bar, a value bar, an
// optional delta tick (a chevron and a short bar) and an optional 1 px sparkline.
// The value is a bar: no number ever appears in a tile.
import { useMemo } from "react";
import { Glyph } from "./Glyph";
import { Bar } from "./Greek";
import { GREEK, greekWidths, seriesFrom, stagger } from "./greek";
import { Outline, phase, polyPath, Strokes } from "./Outline";
import { Slab } from "./Slab";

export type StatTileProps = {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  delta?: boolean;
  spark?: boolean;
  seed?: number;
  assemble?: number;
  /** 0..1, the sparkline drawing on; defaults to the tail of `assemble`. */
  draw?: number;
};

const PAD = 24;

export const StatTile = ({ x = 0, y = 0, w = 280, h = 120, delta = false, spark = false, seed = 1, assemble = 1, draw }: StatTileProps) => {
  const surface = phase(assemble, 0, 6);
  const strokes = phase(assemble, 0, 12);
  const bars = phase(assemble, 4, 18);
  const sparkDraw = draw ?? phase(assemble, 10, 18);
  const captionW = greekWidths(seed + 1, 1, Math.round(w * 0.4))[0];
  const valueW = Math.max(48, greekWidths(seed + 2, 1, Math.round(w * 0.42))[0]);
  const deltaW = greekWidths(seed + 3, 1, 48)[0];

  const sparkPath = useMemo(() => {
    if (!spark) return "";
    const n = 12;
    const s = seriesFrom(seed, n);
    const left = Math.round(w * 0.55);
    const right = w - PAD;
    const top = h - 52;
    const bottom = h - PAD;
    return polyPath(s.map((v, i) => ({ x: left + ((right - left) * i) / (n - 1), y: bottom - (bottom - top) * v })));
  }, [spark, seed, w, h]);

  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      <Slab w={w} h={h} elevation="flat" tone="panel" opacity={surface} />
      <Outline w={w} h={h} radius={8} draw={strokes} />
      <Bar x={PAD} y={PAD} w={captionW} h={GREEK.caption.h} tone="lo" grow={stagger(bars, 0, 2)} />
      <Bar x={PAD} y={PAD + 20} w={valueW} h={GREEK.value.h} tone="hi" grow={stagger(bars, 1, 2)} />
      {delta ? (
        <>
          <Glyph name="chevron" x={PAD - 2} y={h - PAD - 16} rotate={-90} draw={strokes} />
          <Bar x={PAD + 18} y={h - PAD - 12} w={deltaW} h={GREEK.caption.h} tone="lo" grow={stagger(bars, 1, 2)} />
        </>
      ) : null}
      {spark ? <Strokes w={w} h={h} paths={[{ d: sparkPath, draw: sparkDraw, tone: "hi" }]} /> : null}
    </div>
  );
};
