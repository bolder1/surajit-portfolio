// C6 B7, the rule, measured (local 1417..1674; global 4081..4338). Lane 4b.
// The panel recedes into the dark; the Alert slides back in and sits beside the orange button, both flat to
// camera, both at 2x. The Alert's slot is empty (lift 1): its button is the orange one beside it, lifted out in
// B4 and dropped back in B8, so nothing pops in or out of the slot at 4338. Three dimension lines snap on 18 f
// apart, each a 1 px Support line with end ticks and a Label 28 px value: the stroke (borderWidth/thin, the same
// 1 px border the Alert's inner button carries) measured on the orange button's top border, the control radius
// on the orange button's corner, the container radius on the Alert's corner. His rule fades up in quotation marks beneath the pair and
// holds with the dimension group; then the quote fades and the lines sink. Spacing is not drawn: the sentence
// carries it. Values from RULE in artefact.ts. The rebuild (lane 4a) takes the pair over from 1674 at PAIR.
// Source: v6/V1-DIRECTION.md 4.6 B7, 5.2 B7; ILLUSTRATION.md 3.7.
import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import type { Cue } from "../../../lib/cues";
import { EO, prog } from "../../../lib/anim";
import { ALERT, AlertCard, BUTTON, ButtonAtom, RULE } from "../../illus";
import { Dimension } from "../../lib/Dimension";
import type { Pt } from "../../lib/Leader";
import type { Quiet } from "../../registry";
import { TextBlock } from "../../TextBlock";
import { defineBlock, type BlockSpec } from "../../text-manifest";
import { PanelView } from "./Modes";
import { ALERT_ELEVATION, ALERT_SCALE, BEATS, BUTTON_2X_SCALE, PAIR } from "./shared";

const LIN = Easing.linear;
const [FROM, TO] = BEATS.rule;

// The table's frames, chapter-local.
const SLIDE_AT = FROM; // 4081: the panel recedes and the Alert slides in, 12 f
const SLIDE_DUR = 12;
const DIM_AT = [FROM + 23, FROM + 41, FROM + 59] as const; // 4104, 4122, 4140: the three values snap on
const DIM_DRAW = 6;
const QUOTE_AT = FROM + 87; // 4168: 6.12 is up (it fades over the 10 f before)
const OUT_AT = FROM + 245; // 4326: the quote fades, the lines sink

const VALUE_SIZE = 28;
const QUOTE_SIZE = 48; // two lines: the one-line form is 60 characters, over the 42-character line (2.2: two-line sentences 48 px)
const LINE_H = Math.round(VALUE_SIZE * 1.2);

// One diagram group of three labels ("rule"), so the checker counts them as one unit.
export const blocks: BlockSpec[] = [
  defineBlock({ id: "6.11a", chapter: "C6", kind: "diagram", text: `STROKE · ${RULE.stroke} PX`, enterDone: DIM_AT[0], exitStart: OUT_AT, size: VALUE_SIZE, unit: "rule" }),
  defineBlock({ id: "6.11b", chapter: "C6", kind: "diagram", text: `RADIUS · ${RULE.radiusControl} PX · CONTROLS`, enterDone: DIM_AT[1], exitStart: OUT_AT, size: VALUE_SIZE, unit: "rule" }),
  defineBlock({ id: "6.11c", chapter: "C6", kind: "diagram", text: `RADIUS · ${RULE.radiusContainer} PX · CONTAINERS`, enterDone: DIM_AT[2], exitStart: OUT_AT, size: VALUE_SIZE, unit: "rule" }),
  defineBlock({ id: "6.12", chapter: "C6", kind: "sentence", text: "“One stroke weight, two corner radii,\nthree spacing scales.”", enterDone: QUOTE_AT, exitStart: OUT_AT, size: QUOTE_SIZE }),
];

// Each value snaps on with its two end ticks: snap 0.4 and click-lo 0.3 twice, the film's busiest frame (6.4).
export const cues: Cue[] = [
  { f: SLIDE_AT, sfx: "whoosh-rev", vol: 0.3 }, // the panel recedes
  { f: SLIDE_AT + SLIDE_DUR, sfx: "impact-soft", vol: 0.4 }, // the Alert lands beside the button
  ...DIM_AT.flatMap((at): Cue[] => [
    { f: at, sfx: "snap", vol: 0.4 },
    { f: at, sfx: "click-lo", vol: 0.3 },
    { f: at, sfx: "click-lo", vol: 0.3 },
  ]),
  { f: OUT_AT, sfx: "whoosh-rev", vol: 0.25 }, // the lines sink
];

/** The dimension group and the quote hold together (4168 to 4326). */
export const quiet: Quiet[] = [[QUOTE_AT, OUT_AT]];

// Geometry, frame px (PAIR from shared.ts: the button where B6 left it, the Alert to its left, centres aligned).
const A = PAIR.alert;
const B = PAIR.button;
const S = ALERT_SCALE;
const ALERT_SLIDE_PX = 240;
// A rounded corner's arc midpoint, from the corner's outer point toward the centre by r(1 - 1/sqrt2) each way.
const arcMid = (cx: number, cy: number, r: number, sx: number, sy: number): Pt => [cx + sx * r * (1 - Math.SQRT1_2), cy + sy * r * (1 - Math.SQRT1_2)];
// The three callouts: a line from the measured feature out onto the floor, the value at its far end.
const VALUE_Y = 760; // the top of the value that sits beneath the pair
const ABOVE_Y = A.y - 68; // the far end of the two lines that run up (their values share one line above the pair)
const R4_FROM = arcMid(B.x + B.w, B.y + B.h, BUTTON.radius * BUTTON_2X_SCALE, -1, -1);
const R4_TO: Pt = [R4_FROM[0], VALUE_Y - 16];
const R8_FROM = arcMid(A.x, A.y, ALERT.radius * S, 1, 1);
const R8_TO: Pt = [R8_FROM[0], ABOVE_Y];
// The stroke on the orange button's top border, mid-edge (its bottom-right corner carries the radius callout).
const STROKE_FROM: Pt = [B.x + B.w / 2, B.y];
const STROKE_TO: Pt = [STROKE_FROM[0], ABOVE_Y];
const QUOTE_Y = 830;

/** `along` that puts the value's line box `gap` px past the line's far end (the box's top for a downward line). */
const past = (from: Pt, to: Pt, gap: number) => {
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]) || 1;
  return (len + gap + LINE_H / 2) / len;
};

export const Beat: React.FC = () => {
  const f = useCurrentFrame();
  if (f < FROM || f >= TO) return null;

  const gone = 1 - prog(f, SLIDE_AT, SLIDE_AT + SLIDE_DUR, LIN);
  const slideP = prog(f, SLIDE_AT, SLIDE_AT + SLIDE_DUR, EO);
  const slide = ALERT_SLIDE_PX * (1 - slideP);
  const arrive = prog(f, SLIDE_AT, SLIDE_AT + 4, LIN);

  return (
    <>
      {/* The panel of B6 receding into the dark, dark mode, both switches on; the button has already left it. */}
      {gone > 0 ? <PanelView mode={1} theme={1} opacity={gone} /> : null}
      {/* The Alert slides back in from below and sits beside the orange button. */}
      <div style={{ position: "absolute", inset: 0, transform: slide ? `translateY(${slide.toFixed(2)}px)` : undefined, opacity: arrive, pointerEvents: "none" }}>
        <AlertCard x={A.x} y={A.y} emphasis="subtle" color="positive" scale={S} scaleOrigin="0 0" elevation={ALERT_ELEVATION} lift={1} seed={7} />
      </div>
      <ButtonAtom x={B.x} y={B.y} scale={BUTTON_2X_SCALE} scaleOrigin="0 0" theme="orange" elevation="low" />

      {/* The stroke, measured on the orange button's top border: the line runs up, the value sits above it, centred. */}
      <Dimension from={STROKE_FROM} to={STROKE_TO} block={blocks[0]} along={past(STROKE_FROM, STROKE_TO, 12)} offset={0} align="center" drawDur={DIM_DRAW} />
      {/* The control radius on the orange button's corner. */}
      <Dimension from={R4_FROM} to={R4_TO} block={blocks[1]} along={past(R4_FROM, R4_TO, 16)} offset={0} align="center" drawDur={DIM_DRAW} />
      {/* The container radius on the Alert's corner: the line runs up, the value sits above it, left-aligned. */}
      <Dimension from={R8_FROM} to={R8_TO} block={blocks[2]} along={past(R8_FROM, R8_TO, 12)} offset={-4} align="left" drawDur={DIM_DRAW} />

      <TextBlock block={blocks[3]} x={960} y={QUOTE_Y} align="center" width={1680} />
    </>
  );
};
