// C6 B3 end and B4, the ladder down (L366..720; G3030..3384). The Alert (AlertCard subtle positive at 2x) slides
// in from below under the light, flat to camera, centre-left (366..384); MOLECULE lights at 384 (FinishKey).
// 6.4 docks right of it (402..471). The Slot's dashed outline draws around the Alert's content box with its two
// gap ticks, 12 and 16 (477..513, linear, swish); 6.5 docks (516..615); the outline fades with it. ATOM at 621:
// the inner button lifts off the Alert and scales to 3x to the shared centre position (621..639, EO, its shadow
// low to mid) while the Alert dims to 0.4; 6.6 docks right of the button (645..714). TOKEN lights at 720.
// The Slot outline is drawn inside a 2x wrapper so its tick values read 12 and 16 (the component's own values)
// while the ticks span the real 24 and 32 px on screen; dash, tick and label sizes are halved so they land at
// the direction's 8 px dash, 16 px ticks and 24 px labels; its stroke renders at 2 px, scaled with the Alert.
// Source: V1-DIRECTION.md 4.6 (B3, B4), 5.2; ILLUSTRATION.md 3.3.
import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import type { Cue } from "../../../lib/cues";
import { EO, lerp, prog } from "../../../lib/anim";
import { ALERT_BUTTON_SLOT, ALERT_CONTENT, ALERT_GAPS, AlertCard, ButtonAtom, SlotOutline } from "../../illus";
import { DockLabel } from "../../lib/explode";
import type { Quiet } from "../../registry";
import { defineBlock, type BlockSpec } from "../../text-manifest";
import { ALERT_2X, ALERT_ELEVATION, ALERT_SCALE, ALERT_SLIDE_PX, BUTTON_3X, BUTTON_SCALE, SEC } from "./shared";

export const ALERT_IN: readonly [number, number] = [366, 384];
const A64 = [402, 471] as const;
export const SLOT_DRAW: readonly [number, number] = [477, 513];
const A65 = [516, 615] as const;
export const SLOT_FADE: readonly [number, number] = [615, 621];
export const LIFT: readonly [number, number] = [621, 639];
const A66 = [645, 714] as const;
export const TOKEN_AT = 720;

const ALERT_LABEL = defineBlock({ id: "6.4", chapter: SEC, kind: "label", text: "ALERT · POSITIVE · SUBTLE", enterDone: A64[0], exitStart: A64[1], size: 28 });
const SLOT_LABEL = defineBlock({ id: "6.5", chapter: SEC, kind: "label", text: "SLOT · 12 AND 16 PX", enterDone: A65[0], exitStart: A65[1], size: 28 });
const BUTTON_LABEL_BLOCK = defineBlock({ id: "6.6", chapter: SEC, kind: "label", text: "BUTTON · PRIMARY · MEDIUM", enterDone: A66[0], exitStart: A66[1], size: 28 });

export const blocks: BlockSpec[] = [ALERT_LABEL, SLOT_LABEL, BUTTON_LABEL_BLOCK];

export const cues: Cue[] = [
  { f: ALERT_IN[1], sfx: "impact-soft", vol: 0.45 },
  { f: ALERT_IN[1], sfx: "click", vol: 0.3 },
  { f: A64[0], sfx: "snap", vol: 0.4 },
  { f: A64[1], sfx: "whoosh-rev", vol: 0.25 },
  { f: SLOT_DRAW[0], sfx: "swish", vol: 0.3 },
  { f: A65[0], sfx: "snap", vol: 0.4 },
  { f: A65[1], sfx: "whoosh-rev", vol: 0.25 },
  { f: LIFT[0], sfx: "click", vol: 0.3 },
  { f: LIFT[0], sfx: "blip-up", vol: 0.4 },
  { f: A66[0], sfx: "snap", vol: 0.4 },
  { f: A66[1], sfx: "whoosh-rev", vol: 0.25 },
  { f: TOKEN_AT, sfx: "click", vol: 0.3 },
];

/** Three breaths: the Alert and its label; the Slot and its label; the button and its label. */
export const quiet: Quiet[] = [
  [A64[0], A64[1]],
  [A65[0], A65[1]],
  [A66[0], A66[1]],
];

/** The inner button's slot on the 2x Alert, in frame px (the lift starts here). */
export const SLOT_AT = { x: ALERT_2X.x + ALERT_SCALE * ALERT_BUTTON_SLOT.x, y: ALERT_2X.y + ALERT_SCALE * ALERT_BUTTON_SLOT.y };
/** The dock right of the Alert (6.4 and 6.5) and right of the 3x button (6.6). */
const ALERT_DOCK = { anchor: [ALERT_2X.x + ALERT_2X.w + 2, ALERT_2X.y + ALERT_2X.h / 2] as const, x: ALERT_2X.x + ALERT_2X.w + 40, y: ALERT_2X.y + ALERT_2X.h / 2 - 17 };
const BUTTON_DOCK = { anchor: [BUTTON_3X.x + BUTTON_3X.w + 2, BUTTON_3X.y + BUTTON_3X.h / 2] as const, x: BUTTON_3X.x + BUTTON_3X.w + 60, y: BUTTON_3X.y + BUTTON_3X.h / 2 - 17 };

export const Beat: React.FC = () => {
  const f = useCurrentFrame();
  const slide = 1 - prog(f, ALERT_IN[0], ALERT_IN[1], EO);
  const slotDraw = prog(f, SLOT_DRAW[0], SLOT_DRAW[1], Easing.linear);
  const slotFade = 1 - prog(f, SLOT_FADE[0], SLOT_FADE[1], Easing.linear);
  const lift = prog(f, LIFT[0], LIFT[1], EO);
  // The Alert dims to 0.4 as the button lifts off it and recedes into the dark (sinking a little as it goes),
  // gone 12 f after the lift, so the lifted button and its label stand alone on the floor.
  const recede = prog(f, LIFT[0] + 6, LIFT[1] + 12, EO);
  const dim = lerp(1, 0.4, lift) * (1 - recede);
  const drop = slide * ALERT_SLIDE_PX + recede * 90;
  const slotOn = f >= SLOT_DRAW[0] && f < SLOT_FADE[1];

  // The lifted copy: from the slot at 2x to the shared centre at 3x; the status button becomes the primary redraw
  // as it rises (a crossfade of the two variants on one moving box).
  const bx = lerp(SLOT_AT.x, BUTTON_3X.x, lift);
  const by = lerp(SLOT_AT.y, BUTTON_3X.y, lift);
  const bs = lerp(ALERT_SCALE, BUTTON_SCALE, lift);

  return (
    <>
      {dim > 0 ? (
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${drop.toFixed(2)}px)`, opacity: dim, pointerEvents: "none" }}>
          <AlertCard x={ALERT_2X.x} y={ALERT_2X.y} emphasis="subtle" color="positive" scale={ALERT_SCALE} scaleOrigin="0 0" elevation={ALERT_ELEVATION} lift={lift} seed={7} />
        </div>
      ) : null}
      {slotOn ? (
        <div style={{ position: "absolute", left: ALERT_2X.x, top: ALERT_2X.y, transform: `scale(${ALERT_SCALE})`, transformOrigin: "0 0", pointerEvents: "none" }}>
          <SlotOutline box={ALERT_CONTENT} gaps={ALERT_GAPS} dash={4} draw={slotDraw} tickLength={8} tickOffset={12} labelSize={12} opacity={slotFade} />
        </div>
      ) : null}
      {lift > 0 ? (
        <>
          {lift < 1 ? <ButtonAtom x={bx} y={by} scale={bs} scaleOrigin="0 0" variant="inner" status="positive" opacity={1 - lift} /> : null}
          <ButtonAtom x={bx} y={by} scale={bs} scaleOrigin="0 0" elevation={lift} shadow={lift} opacity={lift} />
        </>
      ) : null}
      <DockLabel block={ALERT_LABEL} anchor={ALERT_DOCK.anchor} x={ALERT_DOCK.x} y={ALERT_DOCK.y} width={640} />
      <DockLabel block={SLOT_LABEL} anchor={ALERT_DOCK.anchor} x={ALERT_DOCK.x} y={ALERT_DOCK.y} width={640} />
      <DockLabel block={BUTTON_LABEL_BLOCK} anchor={BUTTON_DOCK.anchor} x={BUTTON_DOCK.x} y={BUTTON_DOCK.y} width={640} />
    </>
  );
};
