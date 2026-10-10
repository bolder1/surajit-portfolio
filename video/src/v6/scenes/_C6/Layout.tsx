// C6 B2, the explode (L135..309; G2799..2973). ORGANISM lights at L138 (FinishKey). Four region planes lift off
// the slab along the view axis 18 f apart (nav 138, header 156, tiles 174, charts with the table 192; each 18 f,
// EO) to the system's lift heights, their shadows going lowRaised to midRaised to highRaised against their own
// lift (the kit interpolates the elevation rows); the slab beneath dims to 0.6 as they leave it (the kit again).
// Four labels dock flat to camera beside their planes, one per beat (NAVIGATION 174, HEADER 192, STAT TILES 210,
// CHARTS 228), each with a 6 f leader from the plane's edge; the list holds 75 f after the last and sinks at 303.
// The four labels are one unit ("6.2"), registered as four diagram blocks so each holds its own minimum and
// the group obeys the list rule (75 f after the last landing), per the checker's unit rule.
// Source: V1-DIRECTION.md 4.6 (B2), 5.2; ILLUSTRATION.md 3.2.
import React from "react";
import { useCurrentFrame } from "remotion";
import type { Cue } from "../../../lib/cues";
import { EO, prog } from "../../../lib/anim";
import { DASHBOARD, LIFT_Z } from "../../illus";
import { DockLabel } from "../../lib/explode";
import type { Quiet } from "../../registry";
import { defineBlock, type BlockSpec } from "../../text-manifest";
import { FLOOR_Y, LIFT_ORDER, SEC, liftAt, screenPoint } from "./shared";
import { StageScreen } from "./Whole";

/** Each plane's lift window, chapter-local: 18 f, 18 f apart. */
export const LIFT_START = 138;
export const LIFT_DUR = 18;
const liftWindow = (i: number): [number, number] => [LIFT_START + i * LIFT_DUR, LIFT_START + (i + 1) * LIFT_DUR];
/** The lift progress of every plane at frame f. */
export const liftProgress = (f: number) => {
  const p: Record<string, number> = {};
  LIFT_ORDER.forEach((r, i) => {
    const [a, b] = liftWindow(i);
    p[r] = prog(f, a, b, EO);
  });
  return p;
};

const LANDINGS = [174, 192, 210, 228] as const;
const LIST_EXIT = 303;
const UNIT = "6.2";

const NAV = defineBlock({ id: "6.2a", chapter: SEC, kind: "diagram", text: "NAVIGATION", enterDone: LANDINGS[0], exitStart: LIST_EXIT, size: 28, unit: UNIT });
const HEADER = defineBlock({ id: "6.2b", chapter: SEC, kind: "diagram", text: "HEADER", enterDone: LANDINGS[1], exitStart: LIST_EXIT, size: 28, unit: UNIT });
const TILES = defineBlock({ id: "6.2c", chapter: SEC, kind: "diagram", text: "STAT TILES", enterDone: LANDINGS[2], exitStart: LIST_EXIT, size: 28, unit: UNIT });
const CHARTS = defineBlock({ id: "6.2d", chapter: SEC, kind: "diagram", text: "CHARTS", enterDone: LANDINGS[3], exitStart: LIST_EXIT, size: 28, unit: UNIT });

export const blocks: BlockSpec[] = [NAV, HEADER, TILES, CHARTS];

export const cues: Cue[] = [
  { f: LIFT_START, sfx: "click", vol: 0.3 },
  ...LIFT_ORDER.map((_, i) => ({ f: liftWindow(i)[0], sfx: "blip-up" as const, vol: 0.4 })),
  ...LANDINGS.map((l) => ({ f: l - 6, sfx: "swish" as const, vol: 0.3 })),
  ...LANDINGS.map((l) => ({ f: l, sfx: "blip" as const, vol: 0.35 })),
  { f: LIST_EXIT, sfx: "whoosh-rev", vol: 0.25 },
];

/** The list holds: nothing new from the last label to the sink. */
export const quiet: Quiet[] = [[LANDINGS[3], LIST_EXIT]];

// Where each label docks, with its leader's start on the lifted plane's edge (the plane is still by then).
const R = DASHBOARD.regions;
const navPt = () => screenPoint(R.nav!.x, R.nav!.y + R.nav!.h, LIFT_Z.nav);
const headerPt = () => screenPoint(R.header!.x + R.header!.w, R.header!.y + R.header!.h * 0.5, LIFT_Z.header);
const tilesPt = () => screenPoint(R.tiles!.x + R.tiles!.w, R.tiles!.y + R.tiles!.h * 0.7, LIFT_Z.tiles);
const chartsPt = () => screenPoint(R.charts!.x + R.charts!.w, R.charts!.y + R.charts!.h * 0.5, LIFT_Z.charts);

export const Beat: React.FC = () => {
  const f = useCurrentFrame();
  const lift = liftAt(liftProgress(f));
  const nav = navPt();
  const header = headerPt();
  const tiles = tilesPt();
  const charts = chartsPt();
  return (
    <>
      <StageScreen lift={lift} />
      {/* NAVIGATION beneath the nav plane's foot; the other three to the right of their planes' near edges. */}
      <DockLabel
        block={NAV}
        anchor={[nav.x, nav.y + 4]}
        points={[
          [nav.x, nav.y + 4],
          [nav.x, FLOOR_Y - 10],
        ]}
        x={nav.x - 4}
        y={FLOOR_Y}
        width={600}
      />
      <DockLabel block={HEADER} anchor={[header.x + 2, header.y]} x={header.x + 60} y={header.y - 17} width={400} />
      <DockLabel block={TILES} anchor={[tiles.x + 2, tiles.y]} x={tiles.x + 60} y={tiles.y - 17} width={400} />
      <DockLabel block={CHARTS} anchor={[charts.x + 2, charts.y]} x={charts.x + 60} y={charts.y - 17} width={400} />
    </>
  );
};
