// A donut: two to four arcs from a seeded split, in alpha steps of the bar colour, a
// 2 px gap between segments, each drawn on in turn with stroke-dashoffset. One
// segment may be the state colour. Nothing in the centre.
import { useMemo } from "react";
import { evolvePath } from "@remotion/paths";
import { donutFrom } from "./greek";
import { unit } from "./Outline";
import { alpha, toneColor, useIllus, useIllusMode } from "./theme";

export type DonutProps = {
  x?: number;
  y?: number;
  r?: number;
  stroke?: number;
  segments?: number[];
  seed?: number;
  /** 0..1, the segments drawing in turn (6 f each in a screen). */
  draw?: number;
  /** The index of the one state-coloured segment, if any. */
  state?: number;
  opacity?: number;
};

const GAP = 2;

const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => ({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  const s = p(a0);
  const e = p(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${s.x} ${s.y} A${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
};

export const Donut = ({ x = 0, y = 0, r = 72, stroke = 16, segments, seed = 1, draw = 1, state, opacity = 1 }: DonutProps) => {
  const th = useIllus();
  const t = useIllusMode();
  const segs = useMemo(() => segments ?? donutFrom(seed), [segments, seed]);
  const rm = r - stroke / 2;
  const paths = useMemo(() => {
    const gapA = GAP / rm;
    let a = -Math.PI / 2;
    return segs.map((s) => {
      const span = s * Math.PI * 2;
      const d = arc(r, r, rm, a + gapA / 2, a + span - gapA / 2);
      a += span;
      return d;
    });
  }, [segs, r, rm]);
  const tones = [toneColor(th, t, "hi"), toneColor(th, t, "lo"), toneColor(th, t, "stroke"), alpha(toneColor(th, t, "stroke"), 0.5)];
  const n = segs.length;
  return (
    <svg width={r * 2} height={r * 2} viewBox={`0 0 ${r * 2} ${r * 2}`} style={{ position: "absolute", left: x, top: y, overflow: "visible", display: "block", opacity }}>
      {paths.map((d, i) => {
        const p = unit(unit(draw) * n - i);
        if (p <= 0) return null;
        const ev = evolvePath(p, d);
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={state === i ? toneColor(th, t, "state") : tones[i % tones.length]}
            strokeWidth={stroke}
            strokeDasharray={p >= 1 ? undefined : ev.strokeDasharray}
            strokeDashoffset={p >= 1 ? undefined : ev.strokeDashoffset}
          />
        );
      })}
    </svg>
  );
};
