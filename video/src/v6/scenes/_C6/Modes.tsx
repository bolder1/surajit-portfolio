// C6 B6, variables and modes (local 948..1417; global 3612..4081). Lane 4b.
// A 600 x 360 surface panel slides in, flat to camera, light mode, with the 2x blue button on it, one line of
// sample text above the button and two textless switches on its lower edge (drawn at 2x like the button, so
// they read as objects beside it, not artefacts). The Theme readout (R1) lands and holds (a breath); the THEME
// switch flips and the button goes Blue to Orange over 6 f as a crossfade of two ButtonAtoms through the
// Transparent Back (the blue fill clears, the orange fill fills, the label stays; no mixed hue, never mauve)
// while the readout's lit column moves; his statement fades up beneath the panel. Then the button steps off the panel to the right, the
// Mode readout (R2) lands, the MODE switch flips and the panel goes dark with its sample text light (surface and
// text only; the button is never on the dark panel); the second statement fades up. Names and values through
// tokenName(), TOKENS and MODES. Source: v6/V1-DIRECTION.md 4.6 B6, 5.2 B6; ILLUSTRATION.md 3.5.
import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import type { Cue } from "../../../lib/cues";
import { EO, lerp, prog } from "../../../lib/anim";
import { ButtonAtom, MODES, SurfacePanel, Switch, TOKENS, tokenName } from "../../illus";
import { Readout } from "../../lib/Readout";
import type { Quiet } from "../../registry";
import { TextBlock } from "../../TextBlock";
import { defineBlock, type BlockSpec } from "../../text-manifest";
import { BEATS, BUTTON_2X, BUTTON_2X_SCALE, BUTTON_OFF_PANEL, BUTTON_ON_PANEL, PANEL } from "./shared";

const LIN = Easing.linear;
const [FROM, TO] = BEATS.modes;

// The table's frames, chapter-local.
const PANEL_AT = FROM; // 3612: the panel slides in over 12 f
const PANEL_DUR = 12;
const R1_AT = FROM + 24; // 3636: R1 lands
const THEME_FLIP = FROM + 84; // 3696: the THEME switch flips over 6 f
const FLIP_DUR = 6;
const S1_AT = FROM + 106; // 3718: 6.10 is up (it fades over the 10 f before)
const S1_OUT = FROM + 226; // 3838: 6.10 fades out
const R1_OUT = FROM + 236; // 3848: R1 sinks
const STEP_AT = FROM + 242; // 3854: the button steps off the panel over 12 f
const STEP_DUR = 12;
const R2_AT = FROM + 260; // 3872: R2 lands
const MODE_FLIP = FROM + 296; // 3908: the MODE switch flips over 6 f
const S2_AT = FROM + 318; // 3930: 6.8 is up
const S2_OUT = FROM + 453; // 4065: 6.8 fades out
const R2_OUT = FROM + 463; // 4075: R2 sinks

const READOUT_SIZE = 28;
const STATEMENT_SIZE = 56;

export const blocks: BlockSpec[] = [
  defineBlock({
    id: "6.9",
    chapter: "C6",
    kind: "readout",
    text: `${tokenName("primaryFill")}\n${MODES.theme[0]} ${TOKENS.blue500.hex} · ${MODES.theme[1]} ${TOKENS.orange500.hex}`,
    enterDone: R1_AT,
    exitStart: R1_OUT,
    size: READOUT_SIZE,
    lineException: true,
  }),
  defineBlock({ id: "6.10", chapter: "C6", kind: "statement", text: "Every primary button, Blue to Orange.", enterDone: S1_AT, exitStart: S1_OUT, size: STATEMENT_SIZE }),
  defineBlock({
    id: "6.8r",
    chapter: "C6",
    kind: "readout",
    text: `${tokenName("surfaceIntense")}\n${MODES.mode[0]} ${TOKENS.surfaceIntense.onLight} · ${MODES.mode[1]} ${TOKENS.surfaceIntense.onDark}`,
    enterDone: R2_AT,
    exitStart: R2_OUT,
    size: READOUT_SIZE,
    lineException: true,
  }),
  defineBlock({ id: "6.8", chapter: "C6", kind: "statement", text: "Light and dark: one token, two values.", enterDone: S2_AT, exitStart: S2_OUT, size: STATEMENT_SIZE }),
];

export const cues: Cue[] = [
  { f: PANEL_AT, sfx: "swish", vol: 0.3 }, // the panel slides in
  { f: R1_AT, sfx: "snap", vol: 0.4 }, // R1 lands
  { f: THEME_FLIP, sfx: "click", vol: 0.35 }, // the THEME switch
  { f: THEME_FLIP, sfx: "glass-tink-2", vol: 0.5 },
  { f: R1_OUT, sfx: "whoosh-rev", vol: 0.25 }, // R1 sinks
  { f: STEP_AT, sfx: "blip-up", vol: 0.3 }, // the button steps off the panel
  { f: R2_AT, sfx: "snap", vol: 0.4 }, // R2 lands
  { f: MODE_FLIP, sfx: "click", vol: 0.35 }, // the MODE switch
  { f: MODE_FLIP, sfx: "glass-tink", vol: 0.5 },
  { f: R2_OUT, sfx: "whoosh-rev", vol: 0.25 }, // R2 sinks
];

/** The breath on the panel with R1 (3636 to 3696); the two statement holds (3718 to 3838; 3930 to 4065). */
export const quiet: Quiet[] = [
  [R1_AT, THEME_FLIP],
  [S1_AT, S1_OUT],
  [S2_AT, S2_OUT],
];

// Geometry, frame px. The panel is PANEL (centre); the readouts sit above it, left-aligned to its edge (the table
// puts them right of the panel from x 1320, but a 44-character path at 28 px measures 646 px and would run past
// the frame's right margin from there); the statements are centred beneath it; the button steps off to the right.
const READOUT_X = PANEL.x;
const READOUT_Y = PANEL.y - 164;
const STATEMENT_Y = PANEL.y + PANEL.h + 40;
// The switches at 2x (96 x 48, the kit's 48 x 24 in a scale wrapper), straddling the panel's lower edge.
const SWITCH_SCALE = 2;
const SWITCH_W = 48 * SWITCH_SCALE;
const SWITCH_H = 24 * SWITCH_SCALE;
const SWITCH_Y = PANEL.y + PANEL.h - SWITCH_H / 2;
const SWITCH_INSET = 24;
/** The blue fill clears over the flip's first 4 f and the orange fill fills over its last 4 f (2 f of overlap). */
const CLEAR_DUR = 4;
const SLIDE_PX = 80;

export type PanelViewProps = {
  /** 0..1 the Mode axis (0 onLight, 1 onDark): the panel's surface and text. */
  mode: number;
  /** The two switches' knobs, 0..1 each. */
  theme: number;
  /** Px the panel is still below its place (the slide in). */
  slide?: number;
  opacity?: number;
};

/** The surface panel with its sample text and its two switches, as B6 draws it; B7 fades the same view out. */
export const PanelView: React.FC<PanelViewProps> = ({ mode, theme, slide = 0, opacity = 1 }) => (
  <div style={{ position: "absolute", inset: 0, transform: slide ? `translateY(${slide.toFixed(2)}px)` : undefined, opacity, pointerEvents: "none" }}>
    <SurfacePanel x={PANEL.x} y={PANEL.y} w={PANEL.w} h={PANEL.h} mode={mode}>
      {/* The button's slot in the panel's flex layout; the button itself is drawn outside so it can step off. */}
      <div style={{ width: BUTTON_2X.w, height: BUTTON_2X.h }} />
    </SurfacePanel>
    <ScaledSwitch x={PANEL.x + SWITCH_INSET} y={SWITCH_Y} on={theme} />
    <ScaledSwitch x={PANEL.x + PANEL.w - SWITCH_INSET - SWITCH_W} y={SWITCH_Y} on={mode} />
  </div>
);

/** The kit's switch in a 2x wrapper at (x, y) of the drawn box's top-left. */
const ScaledSwitch: React.FC<{ x: number; y: number; on: number }> = ({ x, y, on }) => (
  <div style={{ position: "absolute", left: x, top: y, width: SWITCH_W / SWITCH_SCALE, height: SWITCH_H / SWITCH_SCALE, transform: `scale(${SWITCH_SCALE})`, transformOrigin: "0 0" }}>
    <Switch x={0} y={0} on={on} />
  </div>
);

/**
 * The 2x button across the Theme flip: two ButtonAtoms on one box. The blue one's fill clears (the Transparent
 * Back) as the orange one's fill fills; the border swaps at the knob's midpoint; the label is drawn once, on top.
 * Every frame shows a tint of Blue or of Orange over the panel, never a mix of the two hexes.
 */
const ThemeButton: React.FC<{ x: number; y: number; theme: number; shadow: number }> = ({ x, y, theme, shadow }) => {
  const t = Math.min(1, Math.max(0, theme));
  const blueFill = 1 - Math.min(1, (t * FLIP_DUR) / CLEAR_DUR);
  const orangeFill = Math.min(1, Math.max(0, (t * FLIP_DUR - (FLIP_DUR - CLEAR_DUR)) / CLEAR_DUR));
  const orangeBorder = t >= 0.5;
  if (t <= 0) return <ButtonAtom x={x} y={y} scale={BUTTON_2X_SCALE} scaleOrigin="0 0" theme="blue" elevation="low" shadow={shadow} />;
  if (t >= 1) return <ButtonAtom x={x} y={y} scale={BUTTON_2X_SCALE} scaleOrigin="0 0" theme="orange" elevation="low" shadow={shadow} />;
  return (
    <>
      <ButtonAtom x={x} y={y} scale={BUTTON_2X_SCALE} scaleOrigin="0 0" theme="blue" fillAlpha={blueFill} border={!orangeBorder} label="" />
      <ButtonAtom x={x} y={y} scale={BUTTON_2X_SCALE} scaleOrigin="0 0" theme="orange" fillAlpha={orangeFill} border={orangeBorder} />
    </>
  );
};

export const Beat: React.FC = () => {
  const f = useCurrentFrame();
  if (f < FROM || f >= TO) return null;

  const slideP = prog(f, PANEL_AT, PANEL_AT + PANEL_DUR, EO);
  const slide = SLIDE_PX * (1 - slideP);
  const arrive = prog(f, PANEL_AT, PANEL_AT + 6, LIN);
  const theme = prog(f, THEME_FLIP, THEME_FLIP + FLIP_DUR, LIN);
  const mode = prog(f, MODE_FLIP, MODE_FLIP + FLIP_DUR, LIN);
  const step = prog(f, STEP_AT, STEP_AT + STEP_DUR, EO);
  const bx = lerp(BUTTON_ON_PANEL.x, BUTTON_OFF_PANEL.x, step);

  return (
    <>
      <PanelView mode={mode} theme={theme} slide={slide} opacity={arrive} />
      {/* The 2x button: on the panel (no shadow of its own), then on the floor beside it with a lowRaised shadow. */}
      <div style={{ position: "absolute", inset: 0, transform: slide ? `translateY(${slide.toFixed(2)}px)` : undefined, opacity: arrive, pointerEvents: "none" }}>
        <ThemeButton x={bx} y={BUTTON_ON_PANEL.y} theme={theme} shadow={step} />
      </div>
      <Readout block={blocks[0]} x={READOUT_X} y={READOUT_Y} lit={theme} />
      <TextBlock block={blocks[1]} x={PANEL.x + PANEL.w / 2} y={STATEMENT_Y} align="center" width={1680} />
      <Readout block={blocks[2]} x={READOUT_X} y={READOUT_Y} lit={mode} />
      <TextBlock block={blocks[3]} x={PANEL.x + PANEL.w / 2} y={STATEMENT_Y} align="center" width={1680} />
    </>
  );
};
