// D1 ORIGIN (film frames 0-120). Void + the grid drawing itself (FinishFunk). A circuit trace routes down the left, lands on two pads
// at grid intersections and stamps his two degree years beside them: he trained as an engineer first. The trace is still travelling
// when the film cuts to D2, which continues the very same route (see _D1/route.ts).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { prog } from "../../lib/anim";
import type { Cue } from "../../lib/cues";
import { pop } from "../motion";
import { Sparkle } from "../kit/doodles";
import { P } from "../tokens";
import { Stamps, T_A, T_B } from "./_D1/Stamps";
import { TraceRun } from "./_D1/TraceRun";
import { headDist, headTip, PAD_A, PAD_B } from "./_D1/route";

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const head = headDist(f);
  const tip = headTip(f);
  return (
    <AbsoluteFill style={{ background: P.void }}>
      <TraceRun t={f} head={head} pads={[PAD_A, PAD_B]} />
      {head > 0 ? <Sparkle x={tip.x + 34} y={tip.y - 36} size={46} seed={7} pop={pop(f, 4)} draw={prog(f, 4, 10)} /> : null}
      <Stamps f={f} />
    </AbsoluteFill>
  );
};

const r = Math.round;
export const cues: Cue[] = [
  { f: 0, sfx: "crt-on", vol: 0.4 },
  { f: 4, sfx: "laser", vol: 0.3 },
  { f: r(T_A), sfx: "blip", vol: 0.5 },
  { f: r(T_A) + 2, sfx: "snap", vol: 0.5 },
  { f: r(T_A) + 8, sfx: "glass-tink", vol: 0.35 },
  { f: r(T_B), sfx: "blip-hi", vol: 0.5 },
  { f: r(T_B) + 2, sfx: "snap", vol: 0.5 },
  { f: r(T_B) + 8, sfx: "glass-tink-2", vol: 0.35 },
  { f: r(T_B) + 26, sfx: "snap", vol: 0.45 },
  { f: r(T_B) + 28, sfx: "shimmer", vol: 0.3 },
];
