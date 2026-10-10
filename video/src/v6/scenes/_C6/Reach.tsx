// C6 B9, the reach (L1800..1944; G4464..4608). HIT 3 lands the rebuilt screen (every lift 0, the same drawing as
// B1); 30 f of settle; then the two halves of REACH_LINE land beneath it as two stacked labels, 6.13 at 1830
// (leader 1824..1830) and 6.14 at 1848 (leader 1842..1848), snap on each, nothing new after 1848 to the cut.
// The light: on the hit the key light comes up over the rebuilt screen (the slab's clipped pool at HIT_POOL
// instead of SCREEN_POOL, and lightAt at full intensity), so the payoff is the brightest the dashboard ever is;
// the drawing is the same pixels as B1, only the light on it changes.
// Source: V1-DIRECTION.md 4.6 (B8 hit, B9), 5.2; ILLUSTRATION.md 1.2.
import React from "react";
import type { Cue } from "../../../lib/cues";
import { REACH_LINE } from "../../illus";
import { DockLabel } from "../../lib/explode";
import type { Quiet } from "../../registry";
import { TextBlock } from "../../TextBlock";
import { defineBlock, type BlockSpec } from "../../text-manifest";
import { C6_END, FLOOR_Y, FLOOR_Y2, HIT_POOL, SEC } from "./shared";
import { SLAB_FOOT, StageScreen } from "./Whole";

const REACH_DONE = 1830;
const REACH2_DONE = 1848;

// The reach line split at its second middle dot: the first two parts on one line, the count on the next.
const PARTS = REACH_LINE.split(" · ");
export const REACH_A = `${PARTS[0]} · ${PARTS[1]}`;
export const REACH_B = PARTS.slice(2).join(" · ");

const LINE_A = defineBlock({ id: "6.13", chapter: SEC, kind: "label", text: REACH_A, enterDone: REACH_DONE, exitStart: C6_END, size: 28, exit: "cut" });
const LINE_B = defineBlock({ id: "6.14", chapter: SEC, kind: "label", text: REACH_B, enterDone: REACH2_DONE, exitStart: C6_END, size: 28, exit: "cut" });

export const blocks: BlockSpec[] = [LINE_A, LINE_B];

export const cues: Cue[] = [
  { f: REACH_DONE, sfx: "snap", vol: 0.4 },
  { f: REACH2_DONE, sfx: "snap", vol: 0.4 },
];

/** Nothing new after the second label: 96 f of settle before the cut. */
export const quiet: Quiet[] = [[REACH2_DONE, C6_END]];

export const Beat: React.FC = () => (
  <>
    <StageScreen pool={HIT_POOL} />
    <DockLabel
      block={LINE_A}
      anchor={[SLAB_FOOT.x, SLAB_FOOT.y + 6]}
      points={[
        [SLAB_FOOT.x, SLAB_FOOT.y + 6],
        [SLAB_FOOT.x, FLOOR_Y - 10],
      ]}
      dot={0}
      x={SLAB_FOOT.x}
      y={FLOOR_Y}
      align="center"
      width={1200}
    />
    <TextBlock block={LINE_B} x={SLAB_FOOT.x} y={FLOOR_Y2} align="center" width={1200} />
  </>
);
