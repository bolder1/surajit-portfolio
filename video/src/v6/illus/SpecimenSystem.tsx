// The system-components specimen (composition "KitSystem", 90 f): every component
// of the ladder on one sheet for review. The Alert with its Slot drawing on and its
// button lifting out; the five Subtle tints assembling and an intense card showing
// its gap; the button in its variants, themes and the Transparent Back; the wire
// with its node, terminal and two docked markers; the surface panel flipping theme
// and then mode with its two switches; and the themed pieces in V2 and V3. This file
// is the one place in the kit that reads the frame: the specimen drives, the kit draws.
// Nothing here is registered in the manifest; the specimen is not the film.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { AlertCard, ALERT_CONTENT, ALERT_GAPS, ALERT_BUTTON_SLOT } from "./AlertCard";
import { ALERT, STATUS_NAMES, TOKENS, tokenName } from "./artefact";
import { ButtonAtom } from "./ButtonAtom";
import { Marker, markerAnchor } from "./Marker";
import { Slab } from "./Slab";
import { SlotOutline } from "./SlotOutline";
import { SurfacePanel } from "./SurfacePanel";
import { Switch } from "./Switch";
import { IllusProvider, THEME_V1, THEME_V2, THEME_V3, useIllus } from "./theme";
import type { IllusTheme } from "./theme";
import { Wire } from "./Wire";
import { K, supportRgba } from "../tokens";
import { label, useArchivo } from "../type";

const EO = Easing.bezier(0.16, 1, 0.3, 1);
const LIN = Easing.linear;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const P = (f: number, a: number, b: number, e: (t: number) => number = EO) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: e });
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const Caption: React.FC<{ x: number; y: number; text: string; real?: boolean; size?: number; align?: "left" | "center" | "right"; width?: number }> = ({
  x,
  y,
  text,
  real = false,
  size = 24,
  align = "left",
  width,
}) => (
  <div
    style={{
      ...label(size, real),
      position: "absolute",
      left: x,
      top: y,
      width,
      textAlign: align,
      color: supportRgba(real ? 0.9 : 0.7),
      whiteSpace: "nowrap",
      transform: align === "center" ? "translateX(-50%)" : align === "right" ? "translateX(-100%)" : undefined,
    }}
  >
    {text}
  </div>
);

const MAIN = { x: 120, y: 140 };

/** The themed pieces inside one slab, in the slab's own px. */
const ThemeStrip: React.FC<{ f: number; theme: IllusTheme; x: number; y: number }> = ({ f, theme, x, y }) => (
  <IllusProvider value={theme}>
    <Slab x={x} y={y} w={310} h={300} elevation="low" pool={{ cx: 60, cy: 40, r: 320, a: 0.08 }}>
      <Switch x={24} y={24} on={1} />
      <Wire
        points={[
          { x: 286, y: 40 },
          { x: 200, y: 40 },
          { x: 200, y: 100 },
          { x: 90, y: 100 },
        ]}
        nodes={[1]}
        draw={P(f, 6, 48, LIN)}
        nodeFill={theme.surface}
      />
      <Marker at={{ x: 150, y: 150 }} dir="left" draw={P(f, 18, 26, LIN)} />
      <Marker at={{ x: 160, y: 150 }} dir="right" draw={P(f, 18, 26, LIN)} color="state" />
      <SlotOutline
        box={{ x: 110, y: 236, w: 140, h: 44 }}
        gaps={[
          { axis: "x", at: 130, px: 12 },
          { axis: "y", at: 252, px: 16 },
        ]}
        draw={P(f, 0, 36, LIN)}
      />
    </Slab>
  </IllusProvider>
);

const Sheet: React.FC = () => {
  const f = useCurrentFrame();
  const th = useIllus();

  const slotDraw = P(f, 0, 36, LIN);
  const lift = P(f, 60, 78);
  const wireDraw = P(f, 6, 48, LIN);
  const back = 1 - P(f, 12, 24, LIN) + P(f, 48, 54, LIN);
  const themeFlip = P(f, 30, 36, LIN);
  const modeFlip = P(f, 66, 72, LIN);
  const stepOff = P(f, 54, 66);

  // The main Alert's content box and gaps in the sheet's px.
  const box = { x: MAIN.x + ALERT_CONTENT.x, y: MAIN.y + ALERT_CONTENT.y, w: ALERT_CONTENT.w, h: ALERT_CONTENT.h };
  const gaps = ALERT_GAPS.map((g) => ({ ...g, at: g.at + (g.axis === "x" ? MAIN.x : MAIN.y) }));
  // The lifted copy of the inner button: from the slot to a place beside the Alert, 1x to 2x, low to mid.
  const slot = { x: MAIN.x + ALERT_BUTTON_SLOT.x, y: MAIN.y + ALERT_BUTTON_SLOT.y };
  const liftTo = { x: 640, y: 170 };

  // The 3x button at the wire's start, and its two markers.
  const big = { x: 740, y: 790, w: 258, h: 108 };
  const fillAt = { x: big.x + big.w / 2, y: big.y };
  const borderAt = { x: big.x + big.w / 2, y: big.y + big.h };
  const fillDock = markerAnchor(fillAt, "up");
  const borderDock = markerAnchor(borderAt, "down");
  // Left off the button, down, then left to the terminal; its label sits above the last run.
  const wire = [
    { x: big.x, y: big.y + big.h / 2 },
    { x: 700, y: big.y + big.h / 2 },
    { x: 700, y: 944 },
    { x: 120, y: 944 },
  ];
  // The two token labels are long at 24 px, so on this sheet they end at the column's edge instead of centring on the dot.
  const colRight = 1180;

  // The panel's button: centred under the sample word, then stepping off below the panel.
  const panel = { x: 1240, y: 100, w: 600, h: 360 };
  const btnHome = { x: panel.x + panel.w / 2 - 43, y: panel.y + 209 - 18 };
  const btnOff = { x: btnHome.x, y: 560 - 18 };

  return (
    <AbsoluteFill style={{ background: K.ground }}>
      {/* Alert and Slot */}
      <Caption x={40} y={40} text="ALERT · POSITIVE · SUBTLE · SLOT · LIFT" />
      <AlertCard x={MAIN.x} y={MAIN.y} emphasis="subtle" color="positive" lift={lift} seed={7} />
      <SlotOutline box={box} gaps={gaps} draw={slotDraw} opacity={1 - P(f, 78, 84, LIN)} />
      {lift > 0 ? (
        <ButtonAtom
          x={lerp(slot.x, liftTo.x, lift)}
          y={lerp(slot.y, liftTo.y, lift)}
          scale={lerp(1, 2, lift)}
          scaleOrigin="0 0"
          elevation={lift}
          shadow={lift}
        />
      ) : null}

      {/* The other four Subtle tints and an intense card without verified values */}
      <Caption x={40} y={290} text="STATUS · NEGATIVE · NOTICE · INFORMATION · NEUTRAL · INTENSE" />
      {STATUS_NAMES.filter((n) => n !== "positive").map((n, i) => (
        <AlertCard
          key={n}
          x={120 + (i % 3) * 318}
          y={320 + Math.floor(i / 3) * 104}
          color={n}
          scale={0.7}
          assemble={P(f, 4 * i, 18 + 4 * i, LIN)}
          seed={11 + i}
        />
      ))}
      <AlertCard x={120 + 318} y={424} emphasis="intense" color="negative" scale={0.7} assemble={P(f, 16, 34, LIN)} />

      {/* Buttons */}
      <Caption x={40} y={540} text="BUTTON · PRIMARY · SECONDARY · INNER · THEME · TRANSPARENT BACK · LOW · MID" />
      <ButtonAtom x={120} y={570} />
      <ButtonAtom x={224} y={570} theme="orange" />
      <ButtonAtom x={328} y={570} theme={0.5} />
      <ButtonAtom x={432} y={570} variant="secondary" />
      <ButtonAtom x={536} y={570} variant="inner" status="positive" />
      <ButtonAtom x={640} y={570} variant="inner" status="negative" />
      <ButtonAtom x={744} y={570} fillAlpha={0} />
      <ButtonAtom x={848} y={570} fillAlpha={0.5} />
      <ButtonAtom x={952} y={570} elevation="low" />
      <ButtonAtom x={1056} y={570} elevation="mid" />

      {/* Wire and markers on the 3x button */}
      <Caption x={40} y={650} text="WIRE · MARKER · FILL · BORDER" />
      <ButtonAtom x={big.x} y={big.y} scale={3} scaleOrigin="0 0" fillAlpha={back} />
      <Wire points={wire} nodes={[1]} draw={wireDraw} nodeFill={K.ground} />
      <Marker at={fillAt} dir="up" draw={P(f, 18, 26, LIN)} />
      <Marker at={borderAt} dir="down" draw={P(f, 50, 58, LIN)} />
      <div style={{ opacity: P(f, 26, 30, LIN) }}>
        <Caption x={colRight} y={fillDock.y - 29} text={`FILL · ${tokenName("primaryFill")}`} real align="right" />
      </div>
      <div style={{ opacity: P(f, 58, 62, LIN) }}>
        <Caption x={colRight} y={borderDock.y} text={`BORDER · ${tokenName("primaryBorder")}`} real align="right" />
      </div>
      <Caption x={wire[3].x} y={wire[3].y - 40} text={`${tokenName("blue500")} · ${TOKENS.blue500.hex}`} real />

      {/* Surface panel, its button, its switches */}
      <Caption x={1240} y={40} text="PANEL · THEME FLIP · MODE FLIP" />
      <SurfacePanel x={panel.x} y={panel.y} w={panel.w} h={panel.h} mode={modeFlip}>
        <div style={{ width: 172, height: 72 }} />
      </SurfacePanel>
      <ButtonAtom
        x={lerp(btnHome.x, btnOff.x, stepOff)}
        y={lerp(btnHome.y, btnOff.y, stepOff)}
        scale={2}
        theme={themeFlip}
        elevation="low"
        shadow={stepOff}
      />
      <Switch x={panel.x + 24} y={panel.y + panel.h - 12} on={themeFlip} />
      <Switch x={panel.x + panel.w - 24 - 48} y={panel.y + panel.h - 12} on={modeFlip} />

      <Caption x={1240} y={610} text="SWITCH · OFF · HALF · ON" />
      <Switch x={1240} y={640} on={0} />
      <Switch x={1312} y={640} on={0.5} />
      <Switch x={1384} y={640} on={1} />

      {/* The themed pieces */}
      <Caption x={1240} y={690} text="THEMES · V2 · V3" />
      <ThemeStrip f={f} theme={THEME_V2} x={1240} y={720} />
      <ThemeStrip f={f} theme={THEME_V3} x={1570} y={720} />

      <Caption x={1880} y={1040} text={`KIT SYSTEM · ${ALERT.title.toUpperCase()} AS THE ONE WORD · ${th.font.family.toUpperCase()}`} align="right" />
    </AbsoluteFill>
  );
};

export const SpecimenSystem: React.FC = () => {
  useArchivo();
  return (
    <IllusProvider value={THEME_V1}>
      <Sheet />
    </IllusProvider>
  );
};
