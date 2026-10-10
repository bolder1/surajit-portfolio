// C7 CRAFT: a stub from the foundation lane. Renders the floor, the key light and the chapter name so stills
// work; the chapter lane replaces this file. Exports Scene, cues (chapter-local), blocks and quiet windows.
import React from "react";
import { useCurrentFrame } from "remotion";
import type { Cue } from "../../lib/cues";
import { prog } from "../../lib/anim";
import type { BlockSpec } from "../text-manifest";
import type { Quiet } from "../registry";
import { sectionOf } from "../timeline";
import { Floor, KeyLight } from "../stage";
import { supportRgba } from "../tokens";
import { label } from "../type";

const SEC = sectionOf("C7");

export const cues: Cue[] = [];
export const blocks: BlockSpec[] = [];
/** The stub is all quiet: nothing enters. */
export const quiet: Quiet[] = [[0, SEC.dur]];

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const on = prog(f, 0, 24);
  return (
    <Floor>
      <KeyLight cx={640} cy={320} r={980} intensity={0.6 + 0.4 * on} />
      <div style={{ ...label(24), position: "absolute", left: 160, bottom: 56, color: supportRgba(0.7), whiteSpace: "nowrap" }}>
        C7 · CRAFT
      </div>
    </Floor>
  );
};
