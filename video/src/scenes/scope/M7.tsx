import React from "react";
import { AbsoluteFill } from "remotion";
import { ModuleShell, Em } from "../../lib/ModuleShell";
import type { Cue } from "../../lib/cues";

// PLACEHOLDER — replace the motif (see STORYBOARD.md, SCOPE module 7).
export const Scene: React.FC = () => (
  <ModuleShell index={7} title="MODULE 7" line={<>Placeholder <Em>line.</Em></>}>
    <AbsoluteFill />
  </ModuleShell>
);

export const cues: Cue[] = [];
