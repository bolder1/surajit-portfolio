// C6 B0 to B1, the screen whole (L0..135; G2664..2799). The dead stop: black and true silence for 18 f, a single
// tone at L18, the drawn dashboard fading up whole at L24..48 as a slab lying at the 3/4 elevation (lowRaised),
// then one label beneath it (6.1, L60..129), its sink, and the index rail's arrival (FinishKey draws the rail).
// StageScreen is the one drawing of the screen on the stage; Layout, Bridge, Rebuild and Reach draw the same
// object with the same seed and placement, so the screen that lands at hit 3 is pixel-identical to this one.
// Source: V1-DIRECTION.md 4.6 (B0, B1), 5.2; ILLUSTRATION.md 1.2, 3.1.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { Cue } from "../../../lib/cues";
import { clamp } from "../../../lib/anim";
import { DASHBOARD, Screen, type Region } from "../../illus";
import { DockLabel } from "../../lib/explode";
import type { Quiet } from "../../registry";
import { defineBlock, type BlockSpec } from "../../text-manifest";
import { FLOOR_Y, LIFT_PER_PX, SCREEN, SCREEN_POOL, SEC, STAGE_C6, STAGE_ORIGIN, screenPoint } from "./shared";

export const TONE = 18;
export const FADE_UP: readonly [number, number] = [24, 48];
const LABEL_DONE = 60;
const LABEL_EXIT = 129;

/** The slab's bottom-edge midpoint on the frame: the labels under the screen centre on it and lead from it. */
export const SLAB_FOOT = screenPoint(DASHBOARD.w / 2, DASHBOARD.h);

export type StageScreenProps = {
  /** Lift per region in screen px (translateZ); the table rides with the charts. */
  lift?: Partial<Record<Region, number>>;
  /** Opacity of the whole stage (a fade-up or a recede into the dark). */
  opacity?: number;
};

/** The kit's dashboard on the 3/4 stage at the shared placement and seed. */
const scaledLift = (lift?: Partial<Record<Region, number>>) => {
  if (!lift) return undefined;
  const out: Partial<Record<Region, number>> = {};
  for (const k of Object.keys(lift) as Region[]) out[k] = (lift[k] ?? 0) * LIFT_PER_PX;
  return out;
};

export const StageScreen: React.FC<StageScreenProps> = ({ lift, opacity = 1 }) =>
  opacity <= 0 ? null : (
    <div style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
      {/* The tilted stage: Stage3Q's transform with the perspective origin at the shared vanishing point. */}
      <div style={{ position: "absolute", inset: 0, perspective: `${STAGE_C6.perspective}px`, perspectiveOrigin: `${STAGE_ORIGIN.x}px ${STAGE_ORIGIN.y}px` }}>
        <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 50%", transformStyle: "preserve-3d", transform: `rotateX(${STAGE_C6.rotateX}deg) rotateY(${STAGE_C6.rotateY}deg)` }}>
          <div
            style={{
              position: "absolute",
              left: SCREEN.x,
              top: SCREEN.y,
              width: DASHBOARD.w,
              height: DASHBOARD.h,
              transform: `scale(${SCREEN.s})`,
              transformOrigin: "top left",
              transformStyle: "preserve-3d",
            }}
          >
            <Screen layout={DASHBOARD} seed={SCREEN.seed} lift={scaledLift(lift)} pool={SCREEN_POOL} lit="nav" />
          </div>
        </div>
      </div>
    </div>
  );

const NAME = defineBlock({ id: "6.1", chapter: SEC, kind: "label", text: "DASHBOARD · ENTERPRISE SOFTWARE", enterDone: LABEL_DONE, exitStart: LABEL_EXIT, size: 28 });

export const blocks: BlockSpec[] = [NAME];

export const cues: Cue[] = [
  { f: TONE, sfx: "sine-calm", vol: 0.4 },
  { f: LABEL_DONE, sfx: "snap", vol: 0.4 },
  { f: LABEL_EXIT, sfx: "whoosh-rev", vol: 0.25 },
];

/** The breath: the whole screen and one label. */
export const quiet: Quiet[] = [[LABEL_DONE, LABEL_EXIT]];

export const Beat: React.FC = () => {
  const f = useCurrentFrame();
  const up = interpolate(f, [FADE_UP[0], FADE_UP[1]], [0, 1], clamp);
  return (
    <>
      <StageScreen opacity={up} />
      <DockLabel
        block={NAME}
        anchor={[SLAB_FOOT.x, SLAB_FOOT.y + 6]}
        points={[
          [SLAB_FOOT.x, SLAB_FOOT.y + 6],
          [SLAB_FOOT.x, FLOOR_Y - 10],
        ]}
        dot={0}
        x={SLAB_FOOT.x}
        y={FLOOR_Y}
        align="center"
        width={1200}
      />
    </>
  );
};
