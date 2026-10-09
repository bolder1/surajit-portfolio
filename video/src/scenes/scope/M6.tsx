import React from "react";
import { AbsoluteFill } from "remotion";
import { ModuleShell, Em } from "../../lib/ModuleShell";
import type { Cue } from "../../lib/cues";

export const Scene: React.FC = () => (
  <ModuleShell index={6} title="ENDPOINT MANAGEMENT" line={<>Every device, <Em>in policy.</Em></>}>
    <AbsoluteFill>
      <svg width={1920} height={1080}>
        {Array.from({ length: 20 }, (_, i) => <line key={i} x1={i * 100} y1={0} x2={i * 100} y2={1080} stroke="#888" strokeWidth={1} opacity={0.4} />)}
      </svg>
    </AbsoluteFill>
  </ModuleShell>
);
export const cues: Cue[] = [];
