// C2 WHO (288 to 504, 216 f, 7.2 s). HIT 1: his name set so large it crops the frame; the camera backs off until
// it fits; one label; his portrait slides in front so the type passes behind his head. Source: V1-DIRECTION.md 4.2.
// Chapter-local L = global - 288.
//   L0        hard cut: SURAJIT over DUTTA at the Pull's start scale, cropped on all four sides, the TypeShadow
//             on the cropped letters (frame 288 is a composed still; impact 0.9; the band enters)
//   L1..108   PULL 1: scale to 1 (swell 0.5); the name fits with 120 px side margins at L108 (396)
//   L108..114 the label's leader draws; L114 (402) block 2.2 lands (snap 0.4)
//   L150..186 the portrait slides in from the right, in front of the name; its shadow joins the type's (whoosh-long)
//   L186..216 settle; hard cut on the bar
import React from "react";
import { useCurrentFrame } from "remotion";
import type { Cue } from "../../lib/cues";
import { EO, prog } from "../../lib/anim";
import { PORTRAIT_C1 } from "../lib/assets";
import { Pull } from "../lib/Pull";
import type { Quiet } from "../registry";
import { Floor, KeyLight } from "../stage";
import { TextBlock } from "../TextBlock";
import { defineBlock, type BlockSpec } from "../text-manifest";
import { V6_PULLS, toLocal } from "../timeline";
import { Figure } from "./_C1/Figure";

const SEC = "C2" as const;
const PULL_START = toLocal(SEC, V6_PULLS[0][0]); // 0
const PULL_DUR = V6_PULLS[0][1]; // 108
const SETTLE = PULL_START + PULL_DUR; // 108
const LABEL_AT = SETTLE + 6; // 114
const PORTRAIT_IN = [150, 186] as const;
const END = 216;

// The name: two display lines fitted to the frame minus the side margins (400 px, cap about 274 px), the first
// baseline at y 380 and the second at 780. The label lands beneath at the stage's left margin (x 160, y 880): the
// portrait stands in front of the right half, and a centred label would pass behind his shoulders. One unit.
const NAME_Y = 380;
const TAG_XY = { x: 160, y: 880 };
// The portrait 60 px further right than in chapter 1, flush with the frame's right edge, so his shoulders clear the label.
const PORTRAIT_C2 = { ...PORTRAIT_C1, x: 1070 };
const NAME = defineBlock({ id: "2.1", chapter: SEC, kind: "display", text: "SURAJIT\nDUTTA", enterDone: SETTLE, exitStart: END, size: 400, enter: "cut", show: PULL_START, exit: "cut", unit: "name" });
const TAG = defineBlock({ id: "2.2", chapter: SEC, kind: "label", text: "PRODUCT DESIGNER · DESIGNING SINCE 2022", enterDone: LABEL_AT, exitStart: END, size: 28, exit: "cut", unit: "name" });

export const blocks: BlockSpec[] = [NAME, TAG];

export const cues: Cue[] = [
  { f: PULL_START, sfx: "impact", vol: 0.9 },
  { f: PULL_START + 1, sfx: "swell", vol: 0.5 },
  { f: LABEL_AT, sfx: "snap", vol: 0.4 },
  { f: PORTRAIT_IN[0], sfx: "whoosh-long", vol: 0.3 },
];

export const quiet: Quiet[] = [
  [LABEL_AT, PORTRAIT_IN[0]],
  [PORTRAIT_IN[1], END],
];

// The camera backs away from the gap between the two lines, so the cropped still shows the foot of SURAJIT
// ("RAJI") above the head of DUTTA ("UTT"), cropped on all four sides.
const PULL_ORIGIN = "50% 470px";

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const slide = 1100 * (1 - prog(f, PORTRAIT_IN[0], PORTRAIT_IN[1], EO));

  return (
    <Floor>
      <KeyLight cx={560} cy={300} r={1100} intensity={0.9} />
      <Pull from={3.2} to={1} start={PULL_START} dur={PULL_DUR} origin={PULL_ORIGIN}>
        <TextBlock block={NAME} x={960} y={NAME_Y} align="center" width={1680} fit />
      </Pull>
      <TextBlock block={TAG} x={TAG_XY.x} y={TAG_XY.y} width={1000} />
      {f >= PORTRAIT_IN[0] ? <Figure box={PORTRAIT_C2} shift={slide} /> : null}
    </Floor>
  );
};
