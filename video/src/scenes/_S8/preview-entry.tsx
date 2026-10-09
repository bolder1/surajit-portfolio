// Temporary isolated preview entry for S8 (renders only this scene + the global finish layer).
import React from "react";
import { AbsoluteFill, Composition, registerRoot } from "remotion";
import { Scene } from "../S8";
import { Finish } from "../../lib/Finish";
import { C } from "../../lib/theme";

const Preview: React.FC = () => (
  <AbsoluteFill style={{ background: C.void }}>
    <Scene />
    <Finish offset={1320} />
  </AbsoluteFill>
);

registerRoot(() => <Composition id="S8" component={Preview} durationInFrames={180} fps={30} width={1920} height={1080} />);
