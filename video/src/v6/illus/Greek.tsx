// Greeked text: bars that stand in for copy. One bar per line, a fixed seeded width,
// radius 2, two tones per block. A bar extends left to right with `grow` and is
// still afterwards; nothing here changes per frame on its own.
import { BAR_RADIUS, GREEK, greekLines, kvWidths, seedFrom, stagger } from "./greek";
import type { GreekScale } from "./greek";
import { toneColor, useIllus, useIllusMode } from "./theme";

export type BarTone = "lo" | "hi" | "state";

export type BarProps = {
  x?: number;
  y?: number;
  w: number;
  h?: number;
  tone?: BarTone;
  /** 0..1, scaleX from the left. */
  grow?: number;
  opacity?: number;
};

export const Bar = ({ x = 0, y = 0, w, h = 8, tone = "lo", grow = 1, opacity = 1 }: BarProps) => {
  const th = useIllus();
  const t = useIllusMode();
  const g = Math.min(1, Math.max(0, grow));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: BAR_RADIUS,
        background: toneColor(th, t, tone),
        transform: `scaleX(${g})`,
        transformOrigin: "left center",
        opacity,
      }}
    />
  );
};

export type LinesProps = {
  x?: number;
  y?: number;
  w: number;
  n?: number;
  scale?: GreekScale;
  seed?: number;
  tone?: BarTone;
  /** The paragraph's linear progress 0..1; lines take 8 units each, `stagger` units apart. */
  grow?: number;
  stagger?: number;
  /** The first line in the `hi` tone (a title over its body). */
  titled?: boolean;
};

/** A paragraph: n bars at the scale's height and pitch, widths from greekLines. */
export const Lines = ({ x = 0, y = 0, w, n = 3, scale = "body", seed, tone = "lo", grow = 1, stagger: gap = 2, titled = false }: LinesProps) => {
  const s = seed ?? seedFrom(x, y);
  const { h, pitch } = GREEK[scale];
  const widths = greekLines(s, n, w);
  return (
    <>
      {widths.map((bw, i) => (
        <Bar key={i} x={x} y={y + i * pitch} w={bw} h={h} tone={titled && i === 0 ? "hi" : tone} grow={stagger(grow, i, n, 8, gap)} />
      ))}
    </>
  );
};

export type KVProps = {
  x?: number;
  y?: number;
  w: number;
  keyW?: number;
  seed?: number;
  grow?: number;
  scale?: GreekScale;
  /** Row pitch; the bars centre in it. */
  pitch?: number;
};

/** A key-value row: a short `lo` key, a longer `hi` value, on a 32 px pitch. */
export const KV = ({ x = 0, y = 0, w, keyW = 0.32, seed, grow = 1, scale = "body", pitch = 32 }: KVProps) => {
  const s = seed ?? seedFrom(x, y);
  const { h } = GREEK[scale];
  const { key, value } = kvWidths(s, w, keyW);
  const top = y + Math.round((pitch - h) / 2);
  return (
    <>
      <Bar x={x} y={top} w={key} h={h} tone="lo" grow={stagger(grow, 0, 2, 8, 2)} />
      <Bar x={x + key + 16} y={top} w={value} h={h} tone="hi" grow={stagger(grow, 1, 2, 8, 2)} />
    </>
  );
};
