// The Stage specimen (composition "Stage", 90 f): one still of the foundation for review. The light pool, a
// display word standing on the floor with its TypeShadow, a slab with a mid shadow and the pool clipped inside,
// the untreated portrait with its silhouette shadow, a statement and a label at their sizes, under FinishKey.
// No block here is registered in the manifest: the specimen is not the film.
import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { prog } from "../lib/anim";
import { FinishKey } from "./FinishKey";
import { Floor, KeyLight, SilhouetteShadow, SlabShadow } from "./stage";
import { TextBlock } from "./TextBlock";
import type { BlockSpec } from "./text-manifest";
import { K, inkRgba, supportRgba } from "./tokens";
import { label } from "./type";

// The portrait as chapter 1 places it: 1500 x 1800 scaled to 1020 px tall, right of centre, the bottom edge below the frame.
const PORTRAIT = { w: 850, h: 1020, x: 1010, y: 120 };
// Three blocks through TextBlock (plain specs, not registered): a display word rising 0..12 and sinking from 78,
// a statement fading 20..30 and out from 80, a label with its leader 30..36 and sinking from 84.
const WORD: BlockSpec = { id: "s.1", chapter: "C8", kind: "display", text: "CALM", enterDone: 12, exitStart: 78, size: 240 };
const LINE: BlockSpec = { id: "s.2", chapter: "C8", kind: "sentence", text: "Systems then surfaces.", enterDone: 30, exitStart: 80, size: 48 };
const TAG: BlockSpec = { id: "s.3", chapter: "C8", kind: "label", text: "PRODUCT DESIGNER · DESIGNING SINCE 2022", enterDone: 36, exitStart: 84, size: 28 };

export const StageSpecimen: React.FC = () => {
  const f = useCurrentFrame();
  const on = prog(f, 0, 30);
  return (
    <FinishKey offset={2664}>
      <Floor>
        <KeyLight cx={560} cy={300} r={1000} intensity={0.6 + 0.4 * on} />

        {/* The silhouette shadow lies on the floor to the right of the figure, skewed away from the light. */}
        <SilhouetteShadow portrait={PORTRAIT} skew={-26} dx={-120} dy={0} squash={1} opacity={on} />
        <Img
          src={staticFile("img/d/portrait-clean.png")}
          style={{ position: "absolute", left: PORTRAIT.x, top: PORTRAIT.y, width: PORTRAIT.w, height: PORTRAIT.h, opacity: on }}
        />

        {/* A display word standing on the floor, baseline at y 560, through TextBlock. */}
        <TextBlock block={WORD} x={160} y={560} width={800} />

        {/* A slab lying on the floor at mid elevation, the pool clipped inside with its lit corner upper-left. */}
        <SlabShadow x={160} y={640} w={600} h={300} elevation="mid" pool={{ cx: 120, cy: 60, r: 520 }}>
          <div style={{ position: "absolute", left: 24, top: 24, width: 180, height: 10, borderRadius: 2, background: inkRgba(0.3) }} />
          <div style={{ position: "absolute", left: 24, top: 52, width: 300, height: 8, borderRadius: 2, background: inkRgba(0.14) }} />
          <div style={{ position: "absolute", left: 24, top: 72, width: 240, height: 8, borderRadius: 2, background: inkRgba(0.14) }} />
          <div style={{ position: "absolute", left: 24, right: 24, bottom: 24, height: 1, background: supportRgba(0.22) }} />
        </SlabShadow>

        <TextBlock block={LINE} x={800} y={650} width={700} />
        <TextBlock block={TAG} x={800} y={730} width={900} />
        <div style={{ ...label(28, true), position: "absolute", left: 800, top: 780, color: K.ink, whiteSpace: "nowrap" }}>
          _global-colors/Product/Blue/500 · #0052CC · ~70%
        </div>
        <div style={{ ...label(24), position: "absolute", left: 800, top: 830, color: supportRgba(0.7), whiteSpace: "nowrap" }}>
          STAGE SPECIMEN · LOW MID HIGH
        </div>
        <SlabShadow x={800} y={880} w={120} h={60} elevation="low" />
        <SlabShadow x={940} y={880} w={120} h={60} elevation="mid" />
        <SlabShadow x={1080} y={880} w={120} h={60} elevation="high" />
      </Floor>
    </FinishKey>
  );
};
