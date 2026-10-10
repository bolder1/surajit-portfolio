// C1 COLD OPEN (0 to 288, 9.6 s). A lamp clicks on. A shadow arrives before the person. His three words arrive
// last. Source: v6/V1-DIRECTION.md 4.1. Chapter-local frames equal global frames here (the chapter starts at 0).
//   0..18    black, true silence
//   18..54   the lamp clicks on: the key light pool fades up at upper-left on an empty floor (click, hum loop)
//   30..100  his shadow slides onto the floor from frame left; the person is not in the frame (whoosh-long)
//   100..140 he steps into the light: the portrait fades up where the shadow implies; aligned by 140
//   160..170 block 1.1 fades up: "Systems then surfaces." Statement 56 px, left at x 160, baseline y 820
//   170..260 breath; 260..270 fade out; 270..278 settle; 278..288 near-silence before hit 1
import React from "react";
import { useCurrentFrame } from "remotion";
import type { Cue } from "../../lib/cues";
import { EO, prog } from "../../lib/anim";
import { PORTRAIT_C1 } from "../lib/assets";
import type { Quiet } from "../registry";
import { Floor, KeyLight } from "../stage";
import { TextBlock } from "../TextBlock";
import { defineBlock, type BlockSpec } from "../text-manifest";
import { Figure } from "./_C1/Figure";

const LAMP_ON = 18;
const SHADOW_IN = [30, 100] as const;
const FIGURE_IN = [100, 140] as const;

// Statement 56 px, line height 1.15: the first baseline sits 51 px under the box top, so baseline 820 is top 769.
const LINE = defineBlock({ id: "1.1", chapter: "C1", kind: "sentence", text: "Systems then surfaces.", enterDone: 170, exitStart: 260, size: 56 });

export const blocks: BlockSpec[] = [LINE];

/** Chapter-local cues (6.4): the lamp, the room tone (hum-80f is 80 f, looped by three cues), the shadow's slide. */
export const cues: Cue[] = [
  { f: LAMP_ON, sfx: "click", vol: 0.35 },
  { f: LAMP_ON, sfx: "hum-80f", vol: 0.2 },
  { f: LAMP_ON + 80, sfx: "hum-80f", vol: 0.2 },
  { f: LAMP_ON + 160, sfx: "hum-80f", vol: 0.2 },
  { f: SHADOW_IN[0], sfx: "whoosh-long", vol: 0.3 },
];

/** Nothing new enters: the hold after he aligns, the breath, the settle and the near-silence. */
export const quiet: Quiet[] = [
  [140, 160],
  [170, 260],
  [270, 288],
];

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const lamp = prog(f, LAMP_ON, LAMP_ON + 36, EO);
  // The shadow starts a full frame to the left and slides to where the light implies.
  const shadowShift = -2400 * (1 - prog(f, SHADOW_IN[0], SHADOW_IN[1], EO));
  const figure = prog(f, FIGURE_IN[0], FIGURE_IN[1], EO);

  return (
    <Floor>
      {f >= LAMP_ON ? <KeyLight cx={560} cy={300} r={1000} intensity={lamp} /> : null}
      {f >= SHADOW_IN[0] ? <Figure box={PORTRAIT_C1} opacity={figure} shadowOpacity={lamp} shadowShift={shadowShift} /> : null}
      <TextBlock block={LINE} x={160} y={769} width={800} />
    </Floor>
  );
};
