// A drawn switch: a 1 px stroke track (radius 4, a control) and a 16 px knob that
// slides with `on` 0..1. No text and no colour change on a flip; what the flip means
// is said by the readout beside it, never by the switch.
import { alpha, useIllus } from "./theme";

export type SwitchProps = {
  x?: number;
  y?: number;
  /** 0..1, the knob's travel from the left end to the right. */
  on?: number;
  w?: number;
  h?: number;
  knob?: number;
  /** Defaults to the support role at full alpha, on any surface. */
  color?: string;
  opacity?: number;
};

export const Switch = ({ x = 0, y = 0, on = 0, w = 48, h = 24, knob = 16, color, opacity = 1 }: SwitchProps) => {
  const th = useIllus();
  const c = color ?? alpha(th.stroke, 1);
  const k = Math.min(1, Math.max(0, on));
  const inset = (h - knob) / 2;
  const travel = w - 2 * inset - knob;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box", borderRadius: 4, border: `1px solid ${c}`, opacity }}>
      <div
        style={{
          position: "absolute",
          left: inset - 1,
          top: inset - 1,
          width: knob,
          height: knob,
          borderRadius: 4,
          background: c,
          transform: `translateX(${travel * k}px)`,
        }}
      />
    </div>
  );
};
