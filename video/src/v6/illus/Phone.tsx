// A phone: a 1 px frame with an outer radius of 32 and a screen of radius 8 inside a
// 32 px margin, a status pill as one lo bar at the top (no time, no battery), and an
// optional bottom tab bar of glyph slots with the active one in the state colour.
// Children draw in the screen's own px, below the 44 px top safe area.
import type { ReactNode } from "react";
import { Bar } from "./Greek";
import { linePath, phase, rectPath, Strokes } from "./Outline";
import type { StrokeSpec } from "./Outline";
import { toneColor, useIllus, useIllusMode } from "./theme";

export type PhoneProps = {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  frame?: number;
  status?: boolean;
  nav?: number | false;
  seed?: number;
  assemble?: number;
  children?: ReactNode;
};

export const PHONE_SAFE_TOP = 44;
const TAB_H = 56;
const SLOT = 16;
const TABS = 5;

export const Phone = ({ x = 0, y = 0, w = 300, h = 620, frame = 32, status = true, nav = 0, assemble = 1, children }: PhoneProps) => {
  const th = useIllus();
  const t = useIllusMode();
  const W = w + frame * 2;
  const H = h + frame * 2;
  const strokes = phase(assemble, 0, 12);
  const paths: StrokeSpec[] = [
    { d: rectPath(0, 0, W, H, frame), draw: strokes },
    { d: rectPath(frame, frame, w, h, 8), draw: strokes },
  ];
  if (nav !== false) {
    const top = frame + h - TAB_H;
    paths.push({ d: linePath(frame, top, frame + w - 1, top), draw: strokes });
    const pitch = w / TABS;
    for (let i = 0; i < TABS; i++) {
      const sx = Math.round(frame + pitch * i + (pitch - SLOT) / 2);
      paths.push({ d: rectPath(sx, top + (TAB_H - SLOT) / 2, SLOT, SLOT, 4), draw: strokes, tone: i === nav ? "state" : "stroke" });
    }
  }
  return (
    <div style={{ position: "absolute", left: x, top: y, width: W, height: H }}>
      <div style={{ position: "absolute", left: frame, top: frame, width: w, height: h, borderRadius: 8, background: toneColor(th, t, "panel"), opacity: phase(assemble, 0, 6) }} />
      <div style={{ position: "absolute", left: frame, top: frame + PHONE_SAFE_TOP, width: w, height: h - PHONE_SAFE_TOP - (nav === false ? 0 : TAB_H), overflow: "hidden" }}>{children}</div>
      {status ? <Bar x={frame + (w - 72) / 2} y={frame + 14} w={72} h={8} tone="lo" grow={phase(assemble, 4, 12)} /> : null}
      <Strokes w={W} h={H} paths={paths} />
    </div>
  );
};
