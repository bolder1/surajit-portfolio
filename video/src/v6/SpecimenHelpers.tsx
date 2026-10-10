// The helpers specimen (composition "KitHelpers", 120 f): every scene helper in src/v6/lib/ on one stage so a
// reviewer can check each move on a still. Frames 0 to 60: a Pull of "5 DAYS" (Hero) from the composed cropped
// still at frame 0 to the fitted word, with a leader and a label landing on the settle. From frame 66: the explode
// stage (Stage3Q with the kit's dashboard lifting two planes, two DockLabels at projected corners), a Readout with
// a flip at 96, a Dimension line, a struck "3 WEEKS", a Count to ~70%, a ListStack with index marks and a counter,
// and a slab rising and sinking through RiseSink. No block here is registered: the specimen is not the film.
import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { EO, prog } from "../lib/anim";
import { FinishKey } from "./FinishKey";
import { DASHBOARD, LIFT_Z, Screen } from "./illus";
import { Count } from "./lib/Count";
import { Dimension, Strike, struckInk } from "./lib/Dimension";
import { DockLabel, Stage3Q, project3Q } from "./lib/explode";
import { Leader } from "./lib/Leader";
import { ListStack } from "./lib/ListStack";
import { Pull } from "./lib/Pull";
import { Readout } from "./lib/Readout";
import { RiseSink } from "./lib/riseSink";
import { Floor, KeyLight, SlabShadow } from "./stage";
import { TextBlock } from "./TextBlock";
import type { BlockSpec } from "./text-manifest";
import { K, inkRgba } from "./tokens";
import { display, measureLine, useArchivo } from "./type";

const PB = 66; // phase B begins
const OUT = 118; // everything in phase B starts leaving here

// Phase A: the Pull and its label.
const PULL_WORD: BlockSpec = { id: "h.1", chapter: "C5", kind: "display", text: "5 DAYS", enterDone: 48, exitStart: 54, size: 400, enter: "cut", show: 0 };
const PULL_LABEL: BlockSpec = { id: "h.2", chapter: "C5", kind: "label", text: "PRODUCT DESIGNER · DESIGNING SINCE 2022", enterDone: 54, exitStart: 60, size: 28 };

// Phase B: one block per helper.
const NAV: BlockSpec = { id: "h.3", chapter: "C6", kind: "diagram", text: "NAVIGATION", enterDone: PB + 24, exitStart: OUT, size: 28 };
const HEADER: BlockSpec = { id: "h.4", chapter: "C6", kind: "diagram", text: "HEADER", enterDone: PB + 42, exitStart: OUT, size: 28 };
const R1: BlockSpec = { id: "h.5", chapter: "C6", kind: "readout", text: "interactive/background/primary/Light/default\nBLUE #0052CC · ORANGE #EB5424", enterDone: PB + 6, exitStart: OUT, size: 28 };
const DIM: BlockSpec = { id: "h.6", chapter: "C6", kind: "diagram", text: "RADIUS · 8 PX · CONTAINERS", enterDone: PB + 18, exitStart: OUT, size: 28 };
const WEEKS: BlockSpec = { id: "h.7", chapter: "C5", kind: "display", text: "3 WEEKS", enterDone: PB + 12, exitStart: OUT, size: 120 };
const PCT: BlockSpec = { id: "h.8", chapter: "C5", kind: "number", text: "~70%", enterDone: PB + 30, exitStart: OUT, size: 150, exit: "cut" };
const DAYS: BlockSpec = { id: "h.9", chapter: "C5", kind: "list", text: "D1 INTERVIEWS\nD2 FLOW VARIANTS\nD3 HI-FI SCREENS", enterDone: PB + 42, exitStart: OUT, size: 40, landings: [PB + 6, PB + 24, PB + 42], unit: "days" };
const DAYS_N: BlockSpec = { id: "h.10", chapter: "C5", kind: "label", text: "DAYS 03", enterDone: PB + 6, exitStart: OUT, size: 28, unit: "days" };

// The dashboard on the tilted stage, at this scale and place (stage px).
const SCR = { x: 80, y: 300, s: 0.42 };

export const HelpersSpecimen: React.FC = () => {
  const f = useCurrentFrame();
  const phaseB = f >= PB;
  const navLift = LIFT_Z.nav * prog(f, PB, PB + 18, EO);
  const headerLift = LIFT_Z.header * prog(f, PB + 18, PB + 36, EO);
  const nav = DASHBOARD.regions.nav!;
  const header = DASHBOARD.regions.header!;
  // Anchors: the nav plane's top-right corner and the header plane's right edge, projected through the tilt.
  const navPt = project3Q(SCR.x + SCR.s * (nav.x + nav.w), SCR.y + SCR.s * (nav.y + 16), navLift);
  const headerPt = project3Q(SCR.x + SCR.s * (header.x + header.w), SCR.y + SCR.s * (header.y + header.h / 2), headerLift);
  const lit = prog(f, 96, 102, Easing.linear);
  const ready = useArchivo();
  const weeksW = ready ? measureLine(WEEKS.text, display(WEEKS.size, 125)).width : 0;

  return (
    <FinishKey offset={2664}>
      <Floor>
        <KeyLight cx={560} cy={300} r={1100} intensity={0.9} />

        {f < PB ? (
          <>
            <Pull from={3.2} to={1} start={0} dur={48}>
              <TextBlock block={PULL_WORD} x={960} y={620} align="center" fit color={K.hero} />
            </Pull>
            <Leader points={[[960, 660], [960, 700]]} at={PULL_LABEL.enterDone} exitStart={PULL_LABEL.exitStart} />
            <TextBlock block={PULL_LABEL} x={960} y={712} align="center" width={1400} leader={false} />
          </>
        ) : null}

        {phaseB ? (
          <>
            {/* The explode stage: the dashboard lying at the 3/4 elevation, two planes lifting, labels docked flat to camera. */}
            <Stage3Q>
              <div style={{ position: "absolute", left: SCR.x, top: SCR.y, transform: `scale(${SCR.s})`, transformOrigin: "top left", transformStyle: "preserve-3d" }}>
                <Screen layout={DASHBOARD} seed={3} lift={{ nav: navLift, header: headerLift }} />
              </div>
            </Stage3Q>
            <DockLabel block={NAV} anchor={[navPt.x, navPt.y]} x={790} y={navPt.y - 17} />
            <DockLabel block={HEADER} anchor={[headerPt.x, headerPt.y]} x={790} y={headerPt.y - 17} />

            {/* The Theme readout; the lit column moves on the flip at 96. */}
            <Readout block={R1} x={1040} y={100} lit={lit} />

            {/* A dimension line under a container's edge. */}
            <SlabShadow x={1040} y={230} w={240} h={80} elevation="low" />
            <Dimension from={[1040, 330]} to={[1280, 330]} block={DIM} offset={20} />

            {/* The revision: "3 WEEKS" turns Support and is struck left to right from 96. */}
            <TextBlock block={WEEKS} x={1040} y={500} width={700} wdth={125} color={struckInk(f, 96)} />
            <Strike x={1040} width={weeksW} baseline={500} size={120} at={96} exitStart={OUT} />

            {/* The count: 0 to 70 over 30 f, the prefix pinned, the final string centred on x 1500. */}
            <Count block={PCT} start={PB} dur={30} x={1500} y={690} />

            {/* The day list: three items on beats with their index marks and a counter at top right. */}
            <ListStack block={DAYS} x={1000} y={780} columns={3} colWidth={300} index={{}} counter={{ block: DAYS_N, x: 1840, y: 780 }} />

            {/* A slab rising from the floor at 66 to 78 and sinking from 106. */}
            <RiseSink x={160} y={880} w={320} h={120} enterDone={PB + 12} exitStart={106} reach={20}>
              <SlabShadow x={0} y={0} w={320} h={120} elevation="mid" pool={{ cx: 60, cy: 20, r: 300 }}>
                <div style={{ position: "absolute", left: 20, top: 20, width: 140, height: 10, borderRadius: 2, background: inkRgba(0.3) }} />
                <div style={{ position: "absolute", left: 20, top: 44, width: 220, height: 8, borderRadius: 2, background: inkRgba(0.14) }} />
              </SlabShadow>
            </RiseSink>
          </>
        ) : null}
      </Floor>
    </FinishKey>
  );
};
