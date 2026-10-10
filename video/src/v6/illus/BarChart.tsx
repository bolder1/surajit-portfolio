// A bar chart: 1 px outlined bars rising from a baseline, heights from a seeded series,
// one bar optionally in the state colour. Bars are divs with a border (no path), the
// baseline is one hairline. No axis values.
import { seriesFrom, stagger } from "./greek";
import { Rule, unit } from "./Outline";
import { toneColor, useIllus, useIllusMode } from "./theme";

export type BarChartProps = {
  x?: number;
  y?: number;
  w: number;
  h: number;
  bars?: number;
  seed?: number;
  /** 0..1, the bars rising in turn. */
  draw?: number;
  state?: number;
  gap?: number;
};

export const BarChart = ({ x = 0, y = 0, w, h, bars = 8, seed = 1, draw = 1, state, gap = 12 }: BarChartProps) => {
  const th = useIllus();
  const t = useIllusMode();
  const s = seriesFrom(seed, bars);
  const bw = Math.floor((w - gap * (bars - 1)) / bars);
  const top = 0;
  const plotH = h - 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      {s.map((v, i) => {
        const bh = Math.max(4, Math.round((plotH - top) * v));
        const g = stagger(unit(draw), i, bars, 6, 1);
        const color = state === i ? toneColor(th, t, "state") : toneColor(th, t, "stroke");
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: i * (bw + gap),
              top: plotH - bh,
              width: bw,
              height: bh,
              boxSizing: "border-box",
              border: `1px solid ${color}`,
              borderBottom: "none",
              borderRadius: "2px 2px 0 0",
              transform: `scaleY(${g})`,
              transformOrigin: "center bottom",
            }}
          />
        );
      })}
      <Rule y={h - 1} length={w} draw={unit(draw * 2)} />
    </div>
  );
};
