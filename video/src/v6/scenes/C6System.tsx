// C6 SYSTEM (2664 to 4608, 1944 f, 64.8 s). Dead stop. A drawn screen explodes into layout, down the ladder
// (Alert, Slot, Button) to a token, is mapped, flips modes, is measured, and rebuilds. The chapter is nine beats
// in src/v6/scenes/_C6/, each exporting { Beat, blocks, cues, quiet } in chapter-local frames (L = G - 2664) and
// rendered here inside the shared stage for its window (shared.ts BEATS): the floor and the one key light are
// drawn once here from lightAt(f); the beats draw objects and labels. The index rail is chrome: FinishKey reads
// its lit step from C6_RAIL_STEPS on the global frame (railStepAt below gives the same answer chapter-locally).
//   B0 to B1  whole    0..135     dead stop, the tone, the screen fades up as a slab, 6.1        (Whole.tsx)
//   B2        layout   135..309   ORGANISM; four planes lift; NAVIGATION · HEADER · STAT TILES · CHARTS (Layout.tsx)
//   B3        bridge   309..423   the planes recede; "DESIGN SYSTEM · v1.0" lands once              (Bridge.tsx)
//   B4        ladder   366..720   the Alert; MOLECULE; the Slot; ATOM, the button lifts to 3x; TOKEN   (Ladder.tsx)
//   B5        wire     720..948   Transparent Back, the wire, the FILL and BORDER markers              (Wire.tsx, lane 4b)
//   B6        modes    948..1417  the surface panel, the Theme and Mode flips, two readouts           (Modes.tsx, lane 4b)
//   B7        rule     1417..1674 three dimension lines and his quoted rule                           (Rule.tsx, lane 4b)
//   B8        rebuild  1674..1800 the breath, then the fast reverse; HIT 3 at 1800                    (Rebuild.tsx)
//   B9        reach    1800..1944 the rebuilt screen; the reach line as two labels                    (Reach.tsx)
// Source: v6/V1-DIRECTION.md 4.6 and 5; ILLUSTRATION.md 3 and 4.
import React from "react";
import { useCurrentFrame } from "remotion";
import type { Cue } from "../../lib/cues";
import type { Quiet } from "../registry";
import { Floor, KeyLight } from "../stage";
import type { BlockSpec } from "../text-manifest";
import { C6_RAIL_STEPS } from "../timeline";
import * as Bridge from "./_C6/Bridge";
import * as Ladder from "./_C6/Ladder";
import * as Layout from "./_C6/Layout";
import * as Modes from "./_C6/Modes";
import * as Reach from "./_C6/Reach";
import * as Rebuild from "./_C6/Rebuild";
import * as Rule from "./_C6/Rule";
import * as Whole from "./_C6/Whole";
import * as Wire from "./_C6/Wire";
import { BEATS, C6_START, lightAt, type BeatModule } from "./_C6/shared";

const BEAT_LIST: { id: string; mod: BeatModule; window: readonly [number, number] }[] = [
  { id: "whole", mod: Whole, window: BEATS.whole },
  { id: "layout", mod: Layout, window: BEATS.layout },
  { id: "bridge", mod: Bridge, window: BEATS.bridge },
  { id: "ladder", mod: Ladder, window: BEATS.ladder },
  { id: "wire", mod: Wire, window: BEATS.wire },
  { id: "modes", mod: Modes, window: BEATS.modes },
  { id: "rule", mod: Rule, window: BEATS.rule },
  { id: "rebuild", mod: Rebuild, window: BEATS.rebuild },
  { id: "reach", mod: Reach, window: BEATS.reach },
];

export const blocks: BlockSpec[] = BEAT_LIST.flatMap((b) => b.mod.blocks);
export const cues: Cue[] = BEAT_LIST.flatMap((b) => b.mod.cues);
export const quiet: Quiet[] = BEAT_LIST.flatMap((b) => b.mod.quiet as Quiet[]);

/** The lit step of the index rail at a chapter-local frame (0 ORGANISM .. 3 TOKEN; -1 before the first). */
export const railStepAt = (local: number) => C6_RAIL_STEPS.filter((s) => C6_START + local >= s).length - 1;

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const light = lightAt(f);
  return (
    <Floor>
      <KeyLight cx={light.cx} cy={light.cy} r={light.r} intensity={light.intensity} />
      {BEAT_LIST.map((b) => (f >= b.window[0] && f < b.window[1] ? <b.mod.Beat key={b.id} /> : null))}
    </Floor>
  );
};
