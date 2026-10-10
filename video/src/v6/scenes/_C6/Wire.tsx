// C6 B5, the Transparent Back and the mapping (local 720..948; global 3384..3612). Lane 4b.
// The 3x button's fill turns clear over 12 f; a 1 px Hero wire draws from the empty fill leftward across the
// floor through one node to a terminal (42 f); the FILL marker docks on the button with the semantic token; the
// primitive and its hex land at the terminal and the fill refills on that frame; the BORDER marker docks on the
// button's edge; the full map holds 120 f as one diagram group of three labels; then the markers and the wire
// retract and the labels sink. Every name and value comes from artefact.ts through tokenName() and TOKENS.
// Source: v6/V1-DIRECTION.md 4.6 B5, 5.2 B5, 5.4 (the border row is verified on the Theme table); ILLUSTRATION.md 3.4.
import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import type { Cue } from "../../../lib/cues";
import { prog } from "../../../lib/anim";
import { ButtonAtom, Marker, TOKENS, Wire as KitWire, markerAnchor, tokenName } from "../../illus";
import type { Quiet } from "../../registry";
import { TextBlock } from "../../TextBlock";
import { defineBlock, linesOf, type BlockSpec } from "../../text-manifest";
import { K } from "../../tokens";
import { BEATS, BUTTON_3X, BUTTON_SCALE } from "./shared";

const LIN = Easing.linear;
const [FROM, TO] = BEATS.wire;

// The table's frames, chapter-local.
const CLEAR_AT = FROM; // 3384: the fill turns clear over 12 f
const CLEAR_DUR = 12;
const WIRE_AT = FROM + 12; // 3396: the wire draws over 42 f
const WIRE_DUR = 42;
const FILL_AT = FROM + 24; // 3408: 6.7a docks (its marker draws over the 6 f line and 2 f dot before)
const PRIM_AT = FROM + 60; // 3444: 6.7b lands; the fill refills over 6 f
const REFILL_DUR = 6;
const BORDER_AT = FROM + 96; // 3480: 6.7c docks
const SINK_AT = FROM + 216; // 3600: the markers and the wire retract over 12 f; the labels sink
const RETRACT_DUR = 12;

const SIZE = 28;
/** The two lines of a marker label (the role word over the token path) sit this far apart. */
const PITCH = 36;

// The blocks: one diagram group ("map"), at most three labels, so they count as one unit for the checker.
// 6.7a and 6.7c are two lines each (the role word, then the path), because the one-line form is 51 and 47
// characters: over the 42-character line and not a single path, so the 48-character exception cannot carry it.
export const blocks: BlockSpec[] = [
  defineBlock({ id: "6.7a", chapter: "C6", kind: "diagram", text: `FILL\n${tokenName("primaryFill")}`, enterDone: FILL_AT, exitStart: SINK_AT, size: SIZE, unit: "map", lineException: true }),
  defineBlock({ id: "6.7b", chapter: "C6", kind: "diagram", text: `${tokenName("blue500")} · ${TOKENS.blue500.hex}`, enterDone: PRIM_AT, exitStart: SINK_AT, size: SIZE, unit: "map" }),
  defineBlock({ id: "6.7c", chapter: "C6", kind: "diagram", text: `BORDER\n${tokenName("primaryBorder")}`, enterDone: BORDER_AT, exitStart: SINK_AT, size: SIZE, unit: "map", lineException: true }),
];

export const cues: Cue[] = [
  { f: CLEAR_AT, sfx: "swish", vol: 0.3 }, // the fill turns clear
  { f: WIRE_AT, sfx: "swish", vol: 0.3 }, // the wire draws
  { f: FILL_AT, sfx: "snap", vol: 0.4 }, // 6.7a docks
  { f: PRIM_AT, sfx: "snap", vol: 0.4 }, // 6.7b lands
  { f: PRIM_AT, sfx: "blip-up", vol: 0.3 }, // the fill refills
  { f: BORDER_AT, sfx: "snap", vol: 0.4 }, // 6.7c docks
  { f: SINK_AT, sfx: "whoosh-rev", vol: 0.3 }, // the wire retracts
];

/** The full map holds: nothing new enters (3480 to 3600). */
export const quiet: Quiet[] = [[BORDER_AT, SINK_AT]];

// Geometry, frame px. The button is where B4 left it (BUTTON_3X); the wire leaves its left edge at mid height,
// runs left to the node, drops, and runs left again to the terminal; the markers dock on its top and right edges.
const BTN = BUTTON_3X;
const FILL_PT = { x: BTN.x + BTN.w / 2, y: BTN.y };
const BORDER_PT = { x: BTN.x + BTN.w, y: BTN.y + BTN.h / 2 };
const MARKER_LEN = 48;
const MARKER_DOT = 8;
const FILL_DOCK = markerAnchor(FILL_PT, "up", MARKER_LEN, MARKER_DOT);
const BORDER_DOCK = markerAnchor(BORDER_PT, "right", MARKER_LEN, MARKER_DOT);
const NODE_X = 660;
const WIRE_Y2 = 660;
const TERMINAL_X = 380;
const WIRE_PTS = [
  { x: BTN.x, y: BTN.y + BTN.h / 2 },
  { x: NODE_X, y: BTN.y + BTN.h / 2 },
  { x: NODE_X, y: WIRE_Y2 },
  { x: TERMINAL_X, y: WIRE_Y2 },
];
const LINE_H = Math.round(SIZE * 1.2);

const piece = (block: BlockSpec, suffix: string, text: string, lineException: boolean): BlockSpec => ({ ...block, id: `${block.id}${suffix}`, text, lineException });

/**
 * A marker's label: the role word (Label, uppercase, tracked) over the token path (its real case, tracking 0),
 * two TextBlocks derived from the one registered block so the landing and the sink are the block's own. The
 * marker's own line and dot are the leader, so the TextBlock hairline is off.
 */
const MarkerLabel: React.FC<{ block: BlockSpec; x: number; y: number; align: "left" | "center" | "right" }> = ({ block, x, y, align }) => {
  const [word = "", path = ""] = linesOf(block);
  return (
    <>
      <TextBlock block={piece(block, ".word", word, false)} x={x} y={y} align={align} leader={false} />
      <TextBlock block={piece(block, ".path", path, true)} x={x} y={y + PITCH} align={align} real leader={false} />
    </>
  );
};

export const Beat: React.FC = () => {
  const f = useCurrentFrame();
  if (f < FROM || f >= TO) return null;

  const retract = 1 - prog(f, SINK_AT, SINK_AT + RETRACT_DUR, LIN);
  const fillAlpha = Math.min(1, 1 - prog(f, CLEAR_AT, CLEAR_AT + CLEAR_DUR, LIN) + prog(f, PRIM_AT, PRIM_AT + REFILL_DUR, LIN));
  const wireDraw = Math.min(prog(f, WIRE_AT, WIRE_AT + WIRE_DUR, LIN), retract);
  const fillMarker = Math.min(prog(f, FILL_AT - 8, FILL_AT, LIN), retract);
  const borderMarker = Math.min(prog(f, BORDER_AT - 8, BORDER_AT, LIN), retract);
  // The 3x button leaves with the map over the retract's last 6 f, so the panel of B6 arrives on an empty floor.
  const buttonOpacity = 1 - prog(f, TO - 6, TO, LIN);

  return (
    <>
      <ButtonAtom x={BTN.x} y={BTN.y} scale={BUTTON_SCALE} scaleOrigin="0 0" fillAlpha={fillAlpha} elevation="mid" opacity={buttonOpacity} />
      <KitWire points={WIRE_PTS} nodes={[1]} draw={wireDraw} nodeFill={K.ground} popFrames={4} drawFrames={WIRE_DUR} />
      <Marker at={FILL_PT} dir="up" length={MARKER_LEN} dot={MARKER_DOT} draw={fillMarker} />
      <Marker at={BORDER_PT} dir="right" length={MARKER_LEN} dot={MARKER_DOT} draw={borderMarker} />
      {/* 6.7a above the FILL marker's dot, centred on the button. */}
      <MarkerLabel block={blocks[0]} x={FILL_DOCK.x} y={FILL_DOCK.y - PITCH - LINE_H} align="center" />
      {/* 6.7b above the wire's last run, from the terminal. */}
      <TextBlock block={blocks[1]} x={TERMINAL_X} y={WIRE_Y2 - 12 - LINE_H} real />
      {/* 6.7c beyond the BORDER marker's dot, its two lines centred on the button's mid height. */}
      <MarkerLabel block={blocks[2]} x={BORDER_DOCK.x} y={BORDER_DOCK.y - (PITCH + LINE_H) / 2} align="left" />
    </>
  );
};
