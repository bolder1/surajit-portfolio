// A progress bar: a 1 px track (radius 4), a hi fill to `value`, an optional lo
// caption bar above it. 8 px tall track; 24 tall with the caption.
import { Bar } from "./Greek";
import { GREEK, greekWidths } from "./greek";
import { Outline, phase, unit } from "./Outline";
import { toneColor, useIllus, useIllusMode } from "./theme";

export type ProgressProps = {
  x?: number;
  y?: number;
  w?: number;
  value?: number;
  label?: boolean;
  seed?: number;
  assemble?: number;
};

export const PROGRESS_H = 8;

export const Progress = ({ x = 0, y = 0, w = 360, value = 0.4, label = true, seed = 1, assemble = 1 }: ProgressProps) => {
  const th = useIllus();
  const t = useIllusMode();
  const top = label ? 16 : 0;
  const strokes = phase(assemble, 0, 12);
  const fill = phase(assemble, 6, 14);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: top + PROGRESS_H }}>
      {label ? <Bar x={0} y={0} w={greekWidths(seed + 9, 1, 120)[0]} h={GREEK.caption.h} tone="lo" grow={phase(assemble, 4, 12)} /> : null}
      <Outline y={top} w={w} h={PROGRESS_H} radius={4} draw={strokes} />
      <div
        style={{
          position: "absolute",
          left: 1,
          top: top + 1,
          width: Math.round((w - 2) * unit(value)),
          height: PROGRESS_H - 2,
          borderRadius: 3,
          background: toneColor(th, t, "hi"),
          transform: `scaleX(${fill})`,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
};
