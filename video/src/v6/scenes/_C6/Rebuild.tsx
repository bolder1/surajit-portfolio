// C6 settle and B8, the rebuild (L1674..1800; G4338..4464). The orange button and the Alert alone under the light
// for 78 f (a breath, no text), then the fast reverse: six steps of 8 f, EIO, in reverse order from 1752. The
// button drops into the Alert's slot (the status button takes its place); the Alert flies into the charts plane's
// donut card and fades as the exploded screen returns on the stage; charts (with the table), tiles, header and
// navigation re-seat onto the slab, shadows high to mid to low, blip-down per step. The riser file is 60 f, so it
// is cued at 1732 (20 f before the steps; the table says 1752) and ends at 1792, where the near-silence begins;
// the last step (1792..1800) is near-silence, so it carries no blip. HIT 3 at 1800 as the screen lands pixel-identical
// to B1 (same seed, same placement, every lift 0). The exploded screen is the same object as B2's, drawn again:
// it fades back in under the Alert's flight (1760..1768) so the planes are there to re-seat.
// Source: V1-DIRECTION.md 4.6 (settle, B8), 5.2; ILLUSTRATION.md 3.6.
import React from "react";
import { useCurrentFrame } from "remotion";
import type { Cue } from "../../../lib/cues";
import { EIO, lerp, prog } from "../../../lib/anim";
import { ALERT, ALERT_BUTTON_SLOT, AlertCard, ButtonAtom, DASHBOARD, LIFT_Z, chartRects } from "../../illus";
import type { Quiet } from "../../registry";
import type { BlockSpec } from "../../text-manifest";
import { ALERT_ELEVATION, ALERT_SCALE, BUTTON_2X_SCALE, LIFT_ORDER, PAIR, liftAt, screenPoint } from "./shared";
import { StageScreen } from "./Whole";

export const SETTLE: readonly [number, number] = [1674, 1752];
export const STEP = 8;
export const STEPS_START = 1752;
export const HIT = 1800;
/** The riser's start: the 60 f file must end by the near-silence at 1792 (G4456), so 20 f ahead of the steps. */
export const RISER_AT = STEPS_START - 20;
/** Step i runs [start, start + 8): 0 button, 1 Alert, 2 charts, 3 tiles, 4 header, 5 nav. */
const step = (i: number): [number, number] => [STEPS_START + i * STEP, STEPS_START + (i + 1) * STEP];

export const blocks: BlockSpec[] = [];

export const cues: Cue[] = [
  { f: RISER_AT, sfx: "riser", vol: 0.5 },
  ...[0, 1, 2, 3, 4].map((i) => ({ f: step(i)[0], sfx: "blip-down" as const, vol: 0.4 })),
  { f: HIT, sfx: "impact", vol: 0.9 },
];

/** The breath: the two objects alone, no text. */
export const quiet: Quiet[] = [[SETTLE[0], SETTLE[1]]];

/** The Alert's slot for the 2x button, in frame px. */
const SLOT_AT = { x: PAIR.alert.x + ALERT_SCALE * ALERT_BUTTON_SLOT.x, y: PAIR.alert.y + ALERT_SCALE * ALERT_BUTTON_SLOT.y };
/** The donut card's centre on the lifted charts plane, where the Alert flies to. */
const CHARTS = DASHBOARD.regions.charts!;
const DONUT = chartRects({ x: 0, y: 0, w: CHARTS.w, h: CHARTS.h }, DASHBOARD.recipe.charts!.lineShare, DASHBOARD.recipe.charts!.gap).donut;
const DONUT_AT = screenPoint(CHARTS.x + DONUT.x + DONUT.w / 2, CHARTS.y + DONUT.y + DONUT.h / 2, LIFT_Z.charts);
const DONUT_SCALE = (DONUT.w * 0.78 * DONUT_AT.scale) / ALERT.w;

export const Beat: React.FC = () => {
  const f = useCurrentFrame();
  const drop = prog(f, step(0)[0], step(0)[1], EIO);
  const fly = prog(f, step(1)[0], step(1)[1], EIO);
  // The planes re-seat in reverse lift order: charts, tiles, header, nav.
  const p: Record<string, number> = {};
  LIFT_ORDER.forEach((r, i) => {
    const k = LIFT_ORDER.length - 1 - i;
    p[r] = 1 - prog(f, step(2 + k)[0], step(2 + k)[1], EIO);
  });
  const lift = liftAt(p);
  const stageOn = fly;

  // The button: where B6 left it, dropping into the slot; the primary redraw becomes the status button as it lands.
  const bx = lerp(PAIR.button.x, SLOT_AT.x, drop);
  const by = lerp(PAIR.button.y, SLOT_AT.y, drop);
  const buttonOn = f < step(0)[1];
  // The Alert: at its place beside the button, then flying to the donut card, shrinking and fading.
  const ax = lerp(PAIR.alert.x, DONUT_AT.x - (ALERT.w * DONUT_SCALE) / 2, fly);
  const ay = lerp(PAIR.alert.y, DONUT_AT.y - (ALERT.h * DONUT_SCALE) / 2, fly);
  const as = lerp(ALERT_SCALE, DONUT_SCALE, fly);
  const alertOn = f < step(1)[1];

  return (
    <>
      <StageScreen lift={lift} opacity={stageOn} />
      {alertOn ? (
        <AlertCard x={ax} y={ay} emphasis="subtle" color="positive" scale={as} scaleOrigin="0 0" elevation={ALERT_ELEVATION} lift={1 - drop} seed={7} opacity={1 - fly} />
      ) : null}
      {buttonOn ? (
        <>
          <ButtonAtom x={bx} y={by} scale={BUTTON_2X_SCALE} scaleOrigin="0 0" theme="orange" elevation="low" shadow={1 - drop} opacity={1 - drop} />
          {drop > 0 ? <ButtonAtom x={bx} y={by} scale={BUTTON_2X_SCALE} scaleOrigin="0 0" variant="inner" status="positive" opacity={drop} /> : null}
        </>
      ) : null}
    </>
  );
};
