import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { Reel, REEL_DURATION } from "./Reel";
import { SECTIONS } from "./timeline";
import { SCENES } from "./registry";
import { Finish } from "./lib/Finish";
import { C } from "./lib/theme";
import { Designer } from "./designer/ReelD";
import { FinishFunk } from "./designer/FinishFunk";
import { P } from "./designer/tokens";
import { SpecimenDoodles } from "./designer/kit/SpecimenDoodles";
import { SpecimenUI } from "./designer/kit/SpecimenUI";
import { D_SECTIONS, D_TOTAL } from "./designer/timeline";
import { D_SCENES } from "./designer/registry";

/** One designer-reel scene on its own, with the global finishing layer (for stills while building). */
const DesignerPreview: React.FC<{ id: string }> = ({ id }) => {
  const s = D_SECTIONS.find((x) => x.id === id)!;
  const { Scene } = D_SCENES[s.id];
  return (
    <AbsoluteFill style={{ background: P.void }}>
      <Scene />
      <FinishFunk offset={s.from} />
    </AbsoluteFill>
  );
};

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
    <Composition id="KitDoodles" component={SpecimenDoodles} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Composition id="KitUI" component={SpecimenUI} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Composition id="Designer" component={Designer} durationInFrames={D_TOTAL} fps={30} width={1920} height={1080} />
    {D_SECTIONS.map((s) => (
      <Composition
        key={s.id}
        id={s.id}
        component={DesignerPreview}
        defaultProps={{ id: s.id }}
        durationInFrames={s.dur}
        fps={30}
        width={1920}
        height={1080}
      />
    ))}
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
