// C4 RANGE (1296 to 1944, 648 f): three career cards ride a hairline 12-column grid drawn once as a stage;
// then eight sector words accumulate under a counter and the light rakes across the finished list.
// Every frame here is chapter-local (global minus 1296) and comes from v6/V1-DIRECTION.md section 4.4.
//   0 to 12     the grid draws itself across the floor (1 px Support, evolvePath); rail ticks to 04 / 08
//   12 to 24    card 1, "2022", rises on columns 1 to 4; its label lands at 24 (leader 18 to 24); hold to 108
//   108 to 120  card 1 sinks, the light pans to columns 5 to 8; card 2 "2023" rises 120 to 132, holds to 216
//   216 to 228  card 2 sinks, the light pans right; card 3 "2024" rises 228 to 240, holds to 324
//   324 to 336  card 3 sinks; 336 to 354 the light widens over the whole grid
//   360 to 486  the sector list, one word per beat, two columns of four on grid rows 2 to 5; the counter ticks
//   486 to 642  the list holds; the light rakes slowly left to right. Nothing new enters. Breath.
import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { evolvePath } from "@remotion/paths";
import type { Cue } from "../../lib/cues";
import { EO, prog } from "../../lib/anim";
import { defineBlock, type BlockSpec } from "../text-manifest";
import type { Quiet } from "../registry";
import { BEAT } from "../timeline";
import { Floor, KeyLight } from "../stage";
import { H, W, supportRgba } from "../tokens";
import { TextBlock } from "../TextBlock";
import { ListStack, listCues } from "../lib/ListStack";

// The grid: 12 columns between the side margins (13 hairlines 140 px apart) and 6 rows of 140 px from y 120.
const GRID_X0 = 120;
const GRID_Y0 = 120;
const PITCH = 140;
const COLS = 12;
const ROWS = 6;
const colX = (c: number) => GRID_X0 + (c - 1) * PITCH; // the left edge of column c (1..12)
const rowY = (r: number) => GRID_Y0 + (r - 1) * PITCH; // the top of row r (1..6)

const GRID_PATH = [
  ...Array.from({ length: COLS + 1 }, (_, i) => `M${colX(i + 1)} 0 L${colX(i + 1)} ${H}`),
  ...Array.from({ length: ROWS + 1 }, (_, j) => `M${GRID_X0} ${rowY(j + 1)} L${colX(COLS + 1)} ${rowY(j + 1)}`),
].join(" ");

// The three cards: a year (Display 160 px) and its caption as one unit; the frames are the table's.
const CARD = [
  { year: "2022", caption: "FORTMINDZ · UX/UI DESIGNER", rise: 12, enter: 24, exit: 108, col: 1, align: "left" as const },
  { year: "2023", caption: "IMPERO IT · UX/UI DESIGNER", rise: 120, enter: 132, exit: 216, col: 5, align: "left" as const },
  { year: "2024", caption: "TO NOW · ENTERPRISE SOFTWARE", rise: 228, enter: 240, exit: 324, col: 9, align: "right" as const },
];
const YEAR_BASELINE = 560;
const CAPTION_TOP = 600;

const B41 = defineBlock({ id: "4.1", chapter: "C4", kind: "display", text: CARD[0].year, enterDone: 24, exitStart: 108, size: 160, unit: "card1" });
const B42 = defineBlock({ id: "4.2", chapter: "C4", kind: "label", text: CARD[0].caption, enterDone: 24, exitStart: 108, size: 28, unit: "card1" });
const B43 = defineBlock({ id: "4.3", chapter: "C4", kind: "display", text: CARD[1].year, enterDone: 132, exitStart: 216, size: 160, unit: "card2" });
const B44 = defineBlock({ id: "4.4", chapter: "C4", kind: "label", text: CARD[1].caption, enterDone: 132, exitStart: 216, size: 28, unit: "card2" });
const B45 = defineBlock({ id: "4.5", chapter: "C4", kind: "display", text: CARD[2].year, enterDone: 240, exitStart: 324, size: 160, unit: "card3" });
const B46 = defineBlock({ id: "4.6", chapter: "C4", kind: "label", text: CARD[2].caption, enterDone: 240, exitStart: 324, size: 28, unit: "card3" });

// The sector list: eight words, one per beat from 360 (global 1656), complete at 486 (1782), held to the cut.
const LIST_FIRST = 360;
const LANDINGS = Array.from({ length: 8 }, (_, i) => LIST_FIRST + i * BEAT);
const LIST_DONE = LANDINGS[7];
const B47 = defineBlock({
  id: "4.7",
  chapter: "C4",
  kind: "list",
  text: ["E-COMMERCE", "FOOD DELIVERY", "HEALTHCARE", "EVENTS", "SOCIAL", "FINTECH AND BANKING", "ENTERPRISE IT AND SECURITY", "EDUCATION"].join("\n"),
  enterDone: LIST_DONE,
  exitStart: 648,
  size: 48,
  landings: LANDINGS,
  unit: "sectors",
  exit: "cut",
});
// The counter is the list's caption: visible from the first word (ticking 01 to 08), at its final value from 486.
const B48 = defineBlock({ id: "4.8", chapter: "C4", kind: "label", text: "SECTORS 08", enterDone: LIST_DONE, exitStart: 648, size: 28, unit: "sectors", enter: "cut", show: LIST_FIRST, exit: "cut" });

export const blocks: BlockSpec[] = [B41, B42, B43, B44, B45, B46, B47, B48];

export const cues: Cue[] = [
  { f: 0, sfx: "swish", vol: 0.3 }, // the grid draws
  { f: 0, sfx: "click", vol: 0.35 }, // the rail ticks to 04 / 08
  ...CARD.flatMap((c, i): Cue[] => [
    { f: c.rise, sfx: "impact-soft", vol: 0.45 }, // the year rises from the floor
    { f: c.enter, sfx: "snap", vol: 0.4 }, // the caption lands
    { f: c.exit, sfx: "whoosh-rev", vol: 0.3 }, // the card sinks
    ...(i < 2 ? [{ f: c.exit, sfx: "whoosh-long", vol: 0.3 } as Cue] : []), // the light pans to the next columns
  ]),
  { f: 336, sfx: "whoosh-long", vol: 0.3 }, // the light widens over the whole grid
  ...listCues(B47, { counter: true }), // blip per word, blip-hi per counter tick
];

/** Nothing new enters: the three card holds and the list hold with the rake (the table's quiet windows). */
export const quiet: Quiet[] = [
  [24, 108],
  [132, 216],
  [240, 324],
  [LIST_DONE, 648],
];

// The light: centred on each card's columns, panning over the 12 f sink between cards, widening at 336, then
// raking slowly left to right across the finished list from 486.
const lightAt = (f: number) => {
  const c1 = (colX(1) + colX(5)) / 2;
  const c2 = (colX(5) + colX(9)) / 2;
  const c3 = (colX(9) + colX(13)) / 2;
  let cx = c1;
  cx += (c2 - c1) * prog(f, 108, 120, EO);
  cx += (c3 - c2) * prog(f, 216, 228, EO);
  const widen = prog(f, 336, 354, EO);
  cx += (520 - c3) * widen;
  const r = 760 + (1300 - 760) * widen;
  // The rake: linear, no easing, from the left column to the right over the whole breath.
  cx += (1400 - 520) * prog(f, LIST_DONE, 642, Easing.linear);
  return { cx, cy: 480, r, intensity: 0.6 + 0.3 * prog(f, 0, 12, EO) };
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const light = lightAt(f);
  const draw = prog(f, 0, 12, EO);

  return (
    <Floor>
      <KeyLight cx={light.cx} cy={light.cy} r={light.r} intensity={light.intensity} />

      {/* The grid, drawn once as a stage: columns left to right, then the rows. */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        <path d={GRID_PATH} fill="none" stroke={supportRgba(0.26)} strokeWidth={1} {...evolvePath(draw, GRID_PATH)} />
      </svg>

      {/* The three cards: each year stands on its columns with its caption beneath; both rise and sink as one. */}
      {[
        [B41, B42, CARD[0]],
        [B43, B44, CARD[1]],
        [B45, B46, CARD[2]],
      ].map(([year, caption, card]) => {
        const c = card as (typeof CARD)[number];
        const x = c.align === "left" ? colX(c.col) : colX(c.col + 4);
        return (
          <React.Fragment key={c.year}>
            <TextBlock block={year as BlockSpec} x={x} y={YEAR_BASELINE} align={c.align} width={4 * PITCH} />
            <TextBlock block={caption as BlockSpec} x={x} y={CAPTION_TOP} align={c.align} width={4 * PITCH + 120} />
          </React.Fragment>
        );
      })}

      {/* The sector list on grid rows 2 to 5, two columns of four; the counter top right on row 1, columns 11 to 12. */}
      <ListStack
        block={B47}
        x={colX(1)}
        y={rowY(2) + PITCH - Math.round(48 * 1.15) - 24}
        columns={2}
        fill="column"
        pitch={PITCH}
        colWidth={6 * PITCH}
        wght={500}
        counter={{ block: B48, x: colX(13), y: rowY(2) - Math.round(28 * 1.2) - 24, align: "right" }}
      />
    </Floor>
  );
};
