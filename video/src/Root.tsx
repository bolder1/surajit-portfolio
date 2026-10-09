import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { Reel, REEL_DURATION } from "./Reel";
import { SECTIONS } from "./timeline";
import { SCENES } from "./registry";
import { Finish } from "./lib/Finish";
import { C } from "./lib/theme";

/** One section on its own, with the global finishing layer (for stills while building). */
const SectionPreview: React.FC<{ id: string }> = ({ id }) => {
  const s = SECTIONS.find((x) => x.id === id)!;
  const { Scene } = SCENES[s.id];
  return (
    <AbsoluteFill style={{ background: C.void }}>
      <Scene />
      <Finish offset={s.from} />
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Reel" component={Reel} durationInFrames={REEL_DURATION} fps={30} width={1920} height={1080} />
    {SECTIONS.map((s) => (
      <Composition
        key={s.id}
        id={s.id}
        component={SectionPreview}
        defaultProps={{ id: s.id }}
        durationInFrames={s.dur}
        fps={30}
        width={1920}
        height={1080}
      />
    ))}
  </>
);
