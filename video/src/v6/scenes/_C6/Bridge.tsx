// C6 B3, the bridge (L309..423; G2973..3087). The four lifted planes recede into the dark as the light leaves
// them (opacity to 0 over 50 f along the pan, whoosh-rev); the system's name lands once, centre bottom (6.3,
// SYSTEM_LABEL, leader 312..318, lands 318, holds to 417, sinks). The Alert's slide-in (366..384) and MOLECULE
// belong to the ladder beat, which starts at 366 so the same drawing carries on; the label 6.3 overlaps it.
// Source: V1-DIRECTION.md 4.6 (B3), 5.2.
import React from "react";
import { useCurrentFrame } from "remotion";
import type { Cue } from "../../../lib/cues";
import { EO, prog } from "../../../lib/anim";
import { SYSTEM_LABEL } from "../../illus";
import type { Quiet } from "../../registry";
import { TextBlock } from "../../TextBlock";
import { defineBlock, type BlockSpec } from "../../text-manifest";
import { FLOOR_Y, SEC, liftAt } from "./shared";
import { StageScreen } from "./Whole";

export const RECEDE: readonly [number, number] = [309, 359];
const NAME_DONE = 318;
const NAME_EXIT = 417;

// "DESIGN SYSTEM · v1.0" is set in its real case (the version's "v" as the file has it), so tracking is 0 here.
const NAME = defineBlock({ id: "6.3", chapter: SEC, kind: "label", text: SYSTEM_LABEL, enterDone: NAME_DONE, exitStart: NAME_EXIT, size: 28 });

export const blocks: BlockSpec[] = [NAME];

export const cues: Cue[] = [
  { f: RECEDE[0], sfx: "whoosh-rev", vol: 0.3 },
  { f: NAME_DONE, sfx: "snap", vol: 0.4 },
  { f: NAME_EXIT, sfx: "whoosh-rev", vol: 0.25 },
];

/** The name alone until the Alert arrives. */
export const quiet: Quiet[] = [[NAME_DONE, 366]];

const FULL = liftAt({ nav: 1, header: 1, tiles: 1, charts: 1 });

export const Beat: React.FC = () => {
  const f = useCurrentFrame();
  const gone = prog(f, RECEDE[0], RECEDE[1], EO);
  return (
    <>
      <StageScreen lift={FULL} opacity={1 - gone} />
      <TextBlock block={NAME} x={960} y={FLOOR_Y} align="center" width={1200} real />
    </>
  );
};
