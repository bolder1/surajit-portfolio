// A form: fields as a lo label bar over a 1 px box (36 tall, radius 4) with a lo bar
// inside, in one or more columns; an action row at the bottom with a filled button
// (the hi bar colour at full alpha in a dark screen, the ground in a light one, never
// the state colour) and an outlined button.
import { Bar } from "./Greek";
import { GREEK, greekWidths, stagger } from "./greek";
import { phase, rectPath, Strokes } from "./Outline";
import type { StrokeSpec } from "./Outline";
import { alpha, toneColor, useIllus, useIllusMode } from "./theme";

export type FormProps = {
  x?: number;
  y?: number;
  w?: number;
  fields?: number;
  cols?: number;
  buttons?: ("fill" | "outline")[];
  seed?: number;
  assemble?: number;
};

const FIELD_H = 36;
const LABEL_GAP = 8;
const ROW_PITCH = 76;
const COL_GAP = 24;
const BTN_W = 96;
const BTN_H = 36;
const ACTION_GAP = 16;

export const formHeight = (fields: number, cols: number, buttons: number) => Math.ceil(fields / cols) * ROW_PITCH + (buttons > 0 ? ACTION_GAP + BTN_H : 0);

export const Form = ({ x = 0, y = 0, w = 640, fields = 4, cols = 1, buttons = ["fill", "outline"], seed = 1, assemble = 1 }: FormProps) => {
  const th = useIllus();
  const t = useIllusMode();
  const rows = Math.ceil(fields / cols);
  const colW = Math.floor((w - COL_GAP * (cols - 1)) / cols);
  const strokes = phase(assemble, 0, 12);
  const bars = phase(assemble, 4, 18);
  const h = formHeight(fields, cols, buttons.length);
  const labels = greekWidths(seed + 1, fields, 112);
  const inner = greekWidths(seed + 2, fields, Math.round(colW * 0.5));

  const paths: StrokeSpec[] = [];
  const boxes: { x: number; y: number }[] = [];
  for (let i = 0; i < fields; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const bx = c * (colW + COL_GAP);
    const by = r * ROW_PITCH + GREEK.caption.h + LABEL_GAP;
    boxes.push({ x: bx, y: by });
    paths.push({ d: rectPath(bx, by, colW, FIELD_H, 4), draw: stagger(strokes, i, fields, 8, 1) });
  }
  const actionY = rows * ROW_PITCH + ACTION_GAP;
  let right = w;
  const btns: { kind: "fill" | "outline"; x: number }[] = [];
  for (let i = buttons.length - 1; i >= 0; i--) {
    right -= BTN_W;
    btns.unshift({ kind: buttons[i], x: right });
    if (buttons[i] === "outline") paths.push({ d: rectPath(right, actionY, BTN_W, BTN_H, 4), draw: strokes });
    right -= 12;
  }
  const fill = alpha(toneColor(th, t, "hi"), 1);
  const onFill = alpha(toneColor(th, t, "surface"), 0.7);

  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      <Strokes w={w} h={h} paths={paths} />
      {boxes.map((b, i) => (
        <div key={i}>
          <Bar x={b.x} y={b.y - LABEL_GAP - GREEK.caption.h} w={labels[i]} h={GREEK.caption.h} tone="lo" grow={stagger(bars, i, fields + 1)} />
          <Bar x={b.x + 12} y={b.y + (FIELD_H - GREEK.body.h) / 2} w={inner[i]} h={GREEK.body.h} tone="lo" grow={stagger(bars, i, fields + 1)} />
        </div>
      ))}
      {btns.map((b, i) => (
        <div key={i}>
          {b.kind === "fill" ? (
            <div style={{ position: "absolute", left: b.x, top: actionY, width: BTN_W, height: BTN_H, borderRadius: 4, background: fill, opacity: phase(assemble, 8, 14) }} />
          ) : null}
          <div
            style={{
              position: "absolute",
              left: b.x + 24,
              top: actionY + (BTN_H - GREEK.body.h) / 2,
              width: BTN_W - 48,
              height: GREEK.body.h,
              borderRadius: 2,
              background: b.kind === "fill" ? onFill : toneColor(th, t, "lo"),
              transform: `scaleX(${stagger(bars, fields, fields + 1)})`,
              transformOrigin: "left center",
            }}
          />
        </div>
      ))}
    </div>
  );
};
