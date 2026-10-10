// C3 ORIGIN AND THESIS (504 to 1296, 792 f, 26.4 s). Two years stand on the floor; his sentence about them; then
// the operator: the drawn dashboard dimmed under the key light, one sidebar row lit, his line about who inherits
// it. Source: V1-DIRECTION.md 4.3; ILLUSTRATION.md 3.1 and 4. Chapter-local L = global - 504.
//   L0        hard cut to the empty floor, light pool left (click)
//   L18..30   3.1 "2016" rises at frame left, Display 180 (impact-soft); L36 3.2 lands beneath (snap)
//   L135..171 the light pans right; 2016 and its label fall into the dark (whoosh-long)
//   L171..183 3.3 "2019" rises at frame right (impact-soft); L192 3.4 lands beneath (snap)
//   L261..273 2019 and its label sink (whoosh-rev); L273..291 the light pans to centre-left (whoosh-long)
//   L291..301 line 1 of 3.5 fades up; L319..329 line 2; L329..515 breath; L515..525 fade out
//   L525..561 the operator's screen slides in from the right at 0.6, tilted 8 degrees, assembling, dimmed 0.55
//   L561..579 the pool narrows onto the active sidebar row (the assembly's state phase: its marker goes Hero)
//   L579..589 3.6 fades up left of the slab; L607 3.7 lands beneath (snap 0.3); both hold to L747
//   L747..759 3.6 and 3.7 fade; the slab falls into the dark as the pool widens (whoosh-rev); L759..792 settle
import React from "react";
import { useCurrentFrame } from "remotion";
import type { Cue } from "../../lib/cues";
import { EO, lerp, prog } from "../../lib/anim";
import { DASHBOARD, SIDEBAR_PITCH, Screen, sidebarRows } from "../illus";
import { Stage3Q, project3Q, type Stage3QSpec } from "../lib/explode";
import { Leader } from "../lib/Leader";
import type { Quiet } from "../registry";
import { Floor, KeyLight } from "../stage";
import { K, inkRgba } from "../tokens";
import { TextBlock } from "../TextBlock";
import { defineBlock, type BlockSpec } from "../text-manifest";


const SEC = "C3" as const;
const END = 792;

// Beats, chapter-local (the storyboard tables are law).
const Y1_DONE = 30;
const Y1_LABEL = 36;
const Y1_EXIT = 135;
const PAN_RIGHT = [135, 171] as const;
const Y2_DONE = 183;
const Y2_LABEL = 192;
const Y2_EXIT = 261;
const PAN_CENTRE = [273, 291] as const;
const S1_LINE1 = 301;
const S1_LINE2 = 329;
const S1_EXIT = 515;
const SLAB_IN = [525, 561] as const;
const NARROW = [561, 579] as const;
const S2_DONE = 589;
const S2_LABEL = 607;
const S2_EXIT = 747;
const SLAB_OUT = [747, 759] as const;

// 3.2 and 3.7 are 44 characters each, over the 42 limit, so both are set on two lines (the holds are unchanged).
const Y2016 = defineBlock({ id: "3.1", chapter: SEC, kind: "display", text: "2016", enterDone: Y1_DONE, exitStart: Y1_EXIT, size: 180, exit: "dark", unit: "y2016" });
const Y2016_TAG = defineBlock({ id: "3.2", chapter: SEC, kind: "label", text: "DIPLOMA · ELECTRONICS AND\nTELECOMMUNICATIONS", enterDone: Y1_LABEL, exitStart: Y1_EXIT, size: 28, exit: "dark", unit: "y2016" });
const Y2019 = defineBlock({ id: "3.3", chapter: SEC, kind: "display", text: "2019", enterDone: Y2_DONE, exitStart: Y2_EXIT, size: 180, unit: "y2019" });
const Y2019_TAG = defineBlock({ id: "3.4", chapter: SEC, kind: "label", text: "B.TECH · INFORMATION TECHNOLOGY", enterDone: Y2_LABEL, exitStart: Y2_EXIT, size: 28, unit: "y2019" });
const ORIGIN = defineBlock({ id: "3.5", chapter: SEC, kind: "sentence", text: "The systems thinking came from here.\nThe design fluency came later.", enterDone: S1_LINE2, exitStart: S1_EXIT, size: 48 });
const OPERATOR = defineBlock({ id: "3.6", chapter: SEC, kind: "sentence", text: "I design for the operator\nwho inherits the dashboard.", enterDone: S2_DONE, exitStart: S2_EXIT, size: 56 });
const OPERATOR_TAG = defineBlock({ id: "3.7", chapter: SEC, kind: "label", text: "their time, their context,\ntheir audit trail", enterDone: S2_LABEL, exitStart: S2_EXIT, size: 28, exit: "fade" });

export const blocks: BlockSpec[] = [Y2016, Y2016_TAG, Y2019, Y2019_TAG, ORIGIN, OPERATOR, OPERATOR_TAG];

export const cues: Cue[] = [
  { f: 0, sfx: "click", vol: 0.35 },
  { f: Y1_DONE - 12, sfx: "impact-soft", vol: 0.45 },
  { f: Y1_LABEL, sfx: "snap", vol: 0.4 },
  { f: PAN_RIGHT[0], sfx: "whoosh-long", vol: 0.3 },
  { f: Y2_DONE - 12, sfx: "impact-soft", vol: 0.45 },
  { f: Y2_LABEL, sfx: "snap", vol: 0.4 },
  { f: Y2_EXIT, sfx: "whoosh-rev", vol: 0.3 },
  { f: PAN_CENTRE[0], sfx: "whoosh-long", vol: 0.3 },
  { f: SLAB_IN[0], sfx: "whoosh-long", vol: 0.3 },
  { f: S2_LABEL, sfx: "snap", vol: 0.3 },
  { f: SLAB_OUT[0], sfx: "whoosh-rev", vol: 0.3 },
];

export const quiet: Quiet[] = [
  [Y1_LABEL, Y1_EXIT],
  [Y2_LABEL, Y2_EXIT],
  [S1_LINE2, S1_EXIT],
  [S2_LABEL, S2_EXIT],
  [SLAB_OUT[1], END],
];

// The origin sentence lands line by line (795 and 823 global): one registered block, rendered as two line specs
// with the block's own exit. The eighth-note test holds for both landings (805 and 833 are 13 and 5 mod 18).
const [ORIGIN_L1, ORIGIN_L2] = ORIGIN.text.split("\n");
const ORIGIN_A: BlockSpec = { ...ORIGIN, id: "3.5a", text: ORIGIN_L1, enterDone: S1_LINE1 };
const ORIGIN_B: BlockSpec = { ...ORIGIN, id: "3.5b", text: ORIGIN_L2, enterDone: S1_LINE2 };
const STATEMENT_LINE = 48 * 1.15;

// The operator's screen: the kit's dashboard (1530 x 853) at 0.6 lying on the floor right of the text, tilted
// 8 degrees around the vertical axis (its right edge away), dimmed to 0.55 as opacity on the whole group (the
// direction's 0.4 left the regions a few levels above Ground; at 0.55 they read as regions at 100 percent while
// nothing inside is readable: the content is greek).
const SLAB_SCALE = 0.6;
const SLAB = { x: 960, y: 300, w: Math.round(DASHBOARD.w * SLAB_SCALE), h: Math.round(DASHBOARD.h * SLAB_SCALE) };
const SLAB_DIM = 0.55;
const SLAB_SEED = 3; // the same drawing as chapter 6 (shared seeds)
const TILT: Stage3QSpec = { perspective: 2400, rotateX: 0, rotateY: 8, w: SLAB.w, h: SLAB.h };
// The active sidebar row (row 2 of 8, groups 3 and 5) in the screen's own px, and where it lands on the frame.
const NAV = DASHBOARD.regions.nav!;
const ROW_TOP = NAV.y + sidebarRows(8, [3, 5]).tops[2];
const ROW = { x: NAV.x + 120, y: ROW_TOP + SIDEBAR_PITCH / 2 };
const ROW_ON_FRAME = (() => {
  const p = project3Q(ROW.x * SLAB_SCALE, ROW.y * SLAB_SCALE, 0, TILT);
  return { x: SLAB.x + p.x, y: SLAB.y + p.y };
})();
// The slab's own clipped pool: a wide pool (the kit's default position, lifted to 0.14 so the regions read under
// the dim) narrowing onto the row (about 290 px on the frame, at 0.3), so "a dashboard, one row lit" reads in the
// first second of the hold.
const POOL_WIDE = { cx: Math.round(DASHBOARD.w * 0.2), cy: Math.round(DASHBOARD.h * 0.15), r: Math.round(DASHBOARD.w * 0.8), a: 0.14 };
const POOL_ROW = { cx: ROW.x, cy: ROW.y, r: Math.round(480 / SLAB_SCALE), a: 0.3 };
// The lit row, drawn over the kit's own 2 px tick (the kit is untouched): a 3 px Hero marker on the frame (5 px
// in the screen's px at 0.6) and a row highlight, both in the sidebar's rect, appearing with the state phase.
const ROW_MARK = { x: NAV.x, y: ROW_TOP + 8, w: 5, h: SIDEBAR_PITCH - 16 };
const ROW_LIGHT = { x: NAV.x, y: ROW_TOP, w: NAV.w, h: SIDEBAR_PITCH };
// The assembly: phases 1 to 4 (44 of 48 units) over the slide, the state phase (the marker) over the narrowing.
const STATE_AT = 44 / 48;

export const Scene: React.FC = () => {
  const f = useCurrentFrame();

  // The key light: left for 2016, right for 2019, centre-left for the sentence, then narrowing onto the row.
  const panR = prog(f, PAN_RIGHT[0], PAN_RIGHT[1], EO);
  const panC = prog(f, PAN_CENTRE[0], PAN_CENTRE[1], EO);
  const narrow = prog(f, NARROW[0], NARROW[1], EO);
  const widen = prog(f, SLAB_OUT[0], SLAB_OUT[1] + 24, EO);
  let cx = lerp(480, 1440, panR);
  let cy = 380;
  if (f >= PAN_CENTRE[0]) {
    cx = lerp(1440, 700, panC);
    cy = lerp(380, 420, panC);
  }
  let r = 900;
  if (f >= NARROW[0]) {
    const k = narrow * (1 - widen);
    cx = lerp(700, ROW_ON_FRAME.x, k);
    cy = lerp(420, ROW_ON_FRAME.y, k);
    r = lerp(900, 140, k);
  }

  // The operator's slab: slides in from the right while it assembles; falls into the dark as the pool widens.
  const slabOn = f >= SLAB_IN[0] && f < SLAB_OUT[1];
  const slide = 1000 * (1 - prog(f, SLAB_IN[0], SLAB_IN[1], EO));
  const assemble = STATE_AT * prog(f, SLAB_IN[0], SLAB_IN[1], EO) + (1 - STATE_AT) * narrow;
  const fall = 1 - prog(f, SLAB_OUT[0], SLAB_OUT[1], EO);
  const pool = {
    cx: lerp(POOL_WIDE.cx, POOL_ROW.cx, narrow),
    cy: lerp(POOL_WIDE.cy, POOL_ROW.cy, narrow),
    r: lerp(POOL_WIDE.r, POOL_ROW.r, narrow),
    a: lerp(POOL_WIDE.a, POOL_ROW.a, narrow),
  };
  // The marker and the row highlight appear over the state phase (the last 4 of 48 assembly units), with the kit's own tick.
  const rowLit = Math.max(0, Math.min(1, (assemble - STATE_AT) / (1 - STATE_AT)));

  return (
    <Floor>
      <KeyLight cx={cx} cy={cy} r={r} intensity={0.9} />

      {/* The two years and their labels: 2016 at frame left, 2019 at frame right. */}
      <TextBlock block={Y2016} x={160} y={560} width={900} />
      {/* 3.2 and 3.7 leave by a fade, not a sink, so their leaders are drawn here to fade with them. */}
      <Leader points={[[160, 608], [216, 608]]} at={Y2016_TAG.enterDone} exitStart={Y2016_TAG.exitStart} exitDur={36} />
      <TextBlock block={Y2016_TAG} x={160} y={620} width={900} leader={false} />
      <TextBlock block={Y2019} x={1760} y={560} align="right" width={900} />
      <TextBlock block={Y2019_TAG} x={1760} y={620} align="right" width={900} />

      {/* His origin sentence, left of centre, one line at a time. */}
      <TextBlock block={ORIGIN_A} x={200} y={470} width={1000} />
      <TextBlock block={ORIGIN_B} x={200} y={470 + STATEMENT_LINE} width={1000} />

      {/* The operator's screen: a slab lying on the floor, tilted, dimmed, one sidebar row lit under the pool. */}
      {slabOn ? (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${slide.toFixed(2)}px)`, opacity: fall, pointerEvents: "none" }}>
          <Stage3Q x={SLAB.x} y={SLAB.y} w={SLAB.w} h={SLAB.h} perspective={TILT.perspective} rotateX={TILT.rotateX} rotateY={TILT.rotateY}>
            <div style={{ position: "absolute", left: 0, top: 0, width: DASHBOARD.w, height: DASHBOARD.h, transform: `scale(${SLAB_SCALE})`, transformOrigin: "top left" }}>
              <Screen layout={DASHBOARD} seed={SLAB_SEED} assemble={assemble} dim={SLAB_DIM} pool={pool} lit="nav" />
              <div style={{ position: "absolute", left: ROW_LIGHT.x, top: ROW_LIGHT.y, width: ROW_LIGHT.w, height: ROW_LIGHT.h, background: inkRgba(0.1), opacity: rowLit }} />
              <div style={{ position: "absolute", left: ROW_MARK.x, top: ROW_MARK.y, width: ROW_MARK.w, height: ROW_MARK.h, background: K.hero, opacity: rowLit }} />
            </div>
          </Stage3Q>
        </div>
      ) : null}

      {/* His line about the operator, left of the slab, and its continuation beneath. */}
      <TextBlock block={OPERATOR} x={160} y={420} width={780} />
      <Leader points={[[160, 572], [216, 572]]} at={OPERATOR_TAG.enterDone} exitStart={OPERATOR_TAG.exitStart} exitDur={10} />
      <TextBlock block={OPERATOR_TAG} x={160} y={584} width={780} real leader={false} />
    </Floor>
  );
};
