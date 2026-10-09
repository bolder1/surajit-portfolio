import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, mono } from "../lib/theme";
import type { Cue } from "../lib/cues";

// PLACEHOLDER — replace with the real scene (see STORYBOARD.md).
export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.ink, color: C.dim, fontFamily: mono, fontSize: 40, justifyContent: "center", alignItems: "center" }}>
      S7 · {f}
    </AbsoluteFill>
  );
};

export const cues: Cue[] = [];
