// A design canvas seen from far away: page rectangles in the panel tone with a 1 px
// stroke, each holding a few lo bars at 3 px as texture, dimmed except the pages the
// scene lights. The library canvas is two clusters of small rectangles drawn as one
// path each. No tag, no word, no count.
import { useMemo } from "react";
import { CANVAS_AD } from "./layouts";
import type { CanvasLayout, Rect } from "./layouts";
import { greekLines, greekWidths } from "./greek";
import { rectPath, Strokes } from "./Outline";
import { toneColor, useIllus, useIllusMode } from "./theme";

export type CanvasThumbsProps = {
  x?: number;
  y?: number;
  layout?: CanvasLayout;
  w?: number;
  h?: number;
  pages?: Rect[];
  lit?: number[];
  dim?: number;
  seed?: number;
  /** 0..1, the pages fading up in a seeded order. */
  assemble?: number;
};

const BAR_PITCH = 8;

export const CanvasThumbs = ({ x = 0, y = 0, layout = CANVAS_AD, w, h, pages, lit = [], dim = 0.15, seed = 1, assemble = 1 }: CanvasThumbsProps) => {
  const th = useIllus();
  const t = useIllusMode();
  const W = w ?? layout.w;
  const H = h ?? layout.h;
  const rects = pages ?? layout.pages;
  const panel = toneColor(th, t, "panel");
  const stroke = toneColor(th, t, "stroke");
  const lo = toneColor(th, t, "lo");
  const order = useMemo(() => greekWidths(seed * 5, rects.length, 1000), [seed, rects.length]);

  const clusterPaths = useMemo(
    () => layout.clusters.map((c) => c.rects.map((r) => rectPath(r.x, r.y, r.w, r.h, 0)).join(" ")),
    [layout],
  );

  return (
    <div style={{ position: "absolute", left: x, top: y, width: W, height: H }}>
      {rects.map((r, i) => {
        const n = layout.bars.min + Math.round((layout.bars.max - layout.bars.min) * ((order[i] - 420) / 580));
        const count = Math.min(n, Math.floor((r.h - 16) / BAR_PITCH));
        const widths = greekLines(seed * 7 + i * 3, Math.max(1, count), r.w - 16);
        const on = Math.min(1, Math.max(0, assemble * 1.5 - (order[i] - 420) / 580 * 0.5));
        const isLit = lit.includes(i);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              width: r.w,
              height: r.h,
              boxSizing: "border-box",
              background: panel,
              border: `1px solid ${stroke}`,
              opacity: on * (isLit ? 1 : dim),
            }}
          >
            {widths.slice(0, count).map((bw, k) => (
              <div key={k} style={{ position: "absolute", left: 8, top: 8 + k * BAR_PITCH, width: bw, height: layout.bars.h, borderRadius: 1, background: lo }} />
            ))}
          </div>
        );
      })}
      {clusterPaths.length ? (
        <>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0, display: "block", opacity: dim * assemble }}>
            {clusterPaths.map((d, i) => (
              <path key={i} d={d} fill={panel} stroke="none" />
            ))}
          </svg>
          <Strokes w={W} h={H} opacity={dim * assemble} paths={clusterPaths.map((d) => ({ d, draw: 1 }))} />
        </>
      ) : null}
    </div>
  );
};
