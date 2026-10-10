// A browser window: a 1 px frame (radius 8), a 44 px header band in the panel tone
// with three 8 px hollow circles and an address field as a 1 px box holding a lo bar.
// No title, no favicon, no address text. Children draw in the content area's own px.
import type { ReactNode } from "react";
import { Bar } from "./Greek";
import { greekWidths } from "./greek";
import { circlePath, linePath, phase, rectPath, Strokes } from "./Outline";
import type { StrokeSpec } from "./Outline";
import { toneColor, useIllus, useIllusMode } from "./theme";

export type WindowProps = {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  header?: number;
  address?: boolean;
  seed?: number;
  assemble?: number;
  children?: ReactNode;
};

const PAD = 16;

export const Window = ({ x = 0, y = 0, w = 1200, h = 760, header = 44, address = true, seed = 1, assemble = 1, children }: WindowProps) => {
  const th = useIllus();
  const t = useIllusMode();
  const strokes = phase(assemble, 0, 12);
  const paths: StrokeSpec[] = [
    { d: rectPath(0, 0, w, h, 8), draw: strokes },
    { d: linePath(0, header - 1, w - 1, header - 1), draw: strokes },
  ];
  for (let i = 0; i < 3; i++) paths.push({ d: circlePath(PAD + 4.5 + i * 16, header / 2 + 0.5, 4), draw: strokes });
  const addrX = PAD + 64;
  const addrW = Math.min(480, Math.round(w * 0.4));
  if (address) paths.push({ d: rectPath(addrX, (header - 28) / 2, addrW, 28, 4), draw: strokes });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: header, borderRadius: "8px 8px 0 0", background: toneColor(th, t, "panel"), opacity: phase(assemble, 0, 6) }} />
      <div style={{ position: "absolute", left: 0, top: header, width: w, height: h - header, overflow: "hidden", borderRadius: "0 0 8px 8px" }}>{children}</div>
      {address ? <Bar x={addrX + 12} y={(header - 8) / 2} w={greekWidths(seed + 21, 1, Math.round(addrW * 0.5))[0]} h={8} tone="lo" grow={phase(assemble, 4, 12)} /> : null}
      <Strokes w={w} h={h} paths={paths} />
    </div>
  );
};
