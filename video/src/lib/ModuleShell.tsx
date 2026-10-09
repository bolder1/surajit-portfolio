import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, mona, mono, serif } from "./theme";
import { clamp, EO, EI } from "./anim";

/**
 * Shared layout for the 7 SCOPE modules (each 60 frames).
 * Chapter tag top-left, big domain title + serif-italic line bottom-left, motif fills the stage behind.
 * The motif should keep its main action inside x ∈ [760, 1800], y ∈ [150, 930] so the title stays clear.
 */
export const ModuleShell: React.FC<{
  index: number; // 1..7
  title: string; // e.g. "IdP · SSO"
  line: React.ReactNode; // serif italic line, wrap the accent words in <em>
  children: React.ReactNode; // the motif
}> = ({ index, title, line, children }) => {
  const f = useCurrentFrame();
  const inP = interpolate(f, [2, 16], [0, 1], { ...clamp, easing: EO });
  const lineP = interpolate(f, [8, 22], [0, 1], { ...clamp, easing: EO });
  const outP = interpolate(f, [52, 60], [0, 1], { ...clamp, easing: EI });
  const wdth = interpolate(inP, [0, 1], [75, 112]);
  const track = interpolate(inP, [0, 1], [0.25, -0.02]);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <AbsoluteFill>{children}</AbsoluteFill>
      {/* left scrim so the title always reads */}
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(13,10,7,0.92) 0%, rgba(13,10,7,0.55) 34%, rgba(13,10,7,0) 52%)" }} />
      <div style={{ position: "absolute", left: 140, top: 190, fontFamily: mono, fontSize: 18, letterSpacing: "0.24em", color: C.dim, opacity: inP }}>
        SCOPE / WHAT I DESIGN <span style={{ color: C.acc, marginLeft: 18 }}>{String(index).padStart(2, "0")}</span>
        <span style={{ color: C.faint }}> / 07</span>
      </div>
      <div style={{ position: "absolute", left: 132, bottom: 300, overflow: "hidden", paddingTop: 10 }}>
        <div
          style={{
            ...mona(wdth, 820),
            fontSize: 112,
            lineHeight: 1,
            letterSpacing: `${track}em`,
            color: C.paper,
            whiteSpace: "nowrap",
            transform: `translateY(${(1 - inP) * 110 - outP * 40}%)`,
            opacity: 1 - outP,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 136,
          bottom: 222,
          fontFamily: serif,
          fontStyle: "italic",
          fontSize: 62,
          color: C.paper,
          opacity: lineP * (1 - outP),
          transform: `translateY(${(1 - lineP) * 26}px)`,
          filter: `blur(${(1 - lineP) * 8}px)`,
          whiteSpace: "nowrap",
        }}
      >
        {line}
      </div>
    </AbsoluteFill>
  );
};

/** Accent words inside ModuleShell `line`. */
export const Em: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: C.acc }}>{children}</span>;
