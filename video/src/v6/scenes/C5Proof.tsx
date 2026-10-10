// C5 PROOF (1944 to 2664, 720 f): "3 WEEKS" is struck and compresses to nothing; HIT 2 cuts to "5 DAYS" cropped
// and Pull 2 backs the camera off until it fits; the day list; "~70%" counts and FASTER lands; the dead stop.
// Every frame here is chapter-local (global minus 1944) and comes from v6/V1-DIRECTION.md section 4.5.
//   0           hard cut to the empty floor, the light centred and dim; rail ticks to 05 / 08
//   18 to 30    5.1 "3 WEEKS" rises (Display 240 px, wdth 125); 5.2 lands at 36 (leader 30 to 36); hold to 120
//   120 to 132  the revision: the word turns Support and a 1 px hairline strikes through it; the label sinks
//   144 to 204  fast passage 1: the struck word's width axis compresses 125 to 62 while the light dims to black
//   204 to 216  near-silence, black
//   216         HIT 2: "5 DAYS" in Hero, cropped on all sides, the composed still; PULL 2 from 217 to 324
//   330 to 414  5.4 lands beneath (leader 324 to 330) and holds; sinks 414 to 420
//   426 to 498  5.5, the day list, one per beat beneath "5 DAYS"; held to 600; both sink 600 to 612
//   612 to 642  5.6 "~70%" counts 0 to 70 in 30 f on the dial; 642 FASTER lands; held to the dead stop at 720
import React from "react";
import { useCurrentFrame } from "remotion";
import type { Cue } from "../../lib/cues";
import { EI, EO, prog } from "../../lib/anim";
import { defineBlock, type BlockSpec } from "../text-manifest";
import type { Quiet } from "../registry";
import { BEAT } from "../timeline";
import { Floor, KeyLight } from "../stage";
import { K, W } from "../tokens";
import { TextBlock } from "../TextBlock";
import { display, measureLine, pullScale, useArchivo } from "../type";
import { Strike, struckInk } from "../lib/Dimension";
import { Pull } from "../lib/Pull";
import { ListStack, listCues } from "../lib/ListStack";
import { Count, countCues } from "../lib/Count";

const WEEKS_WDTH = 125;
const WEEKS_BASELINE = 560;
const STRIKE_AT = 120;
const COMPRESS = { from: 144, to: 204 };
const HIT = 216;
const PULL_DUR = 108;
const SETTLE = HIT + PULL_DUR; // 324 (global 2268)
const DAYS_BASELINE = 520;
const COUNT_START = 612;

// 5.1 and 5.2: one unit (a display word with its caption). The word's registered exit is the strike at 120: from
// there it is grey and struck, no longer a readable block, and a derived spec carries it through the compress.
const B51 = defineBlock({ id: "5.1", chapter: "C5", kind: "display", text: "3 WEEKS", enterDone: 30, exitStart: STRIKE_AT, size: 240, unit: "weeks", exit: "cut" });
const B52 = defineBlock({ id: "5.2", chapter: "C5", kind: "label", text: "A TYPICAL DESIGN CYCLE", enterDone: 36, exitStart: STRIKE_AT, size: 28, unit: "weeks" });
// 5.3: seen from the hit (cut), complete at the settle; sinks with the day list at 600.
const B53 = defineBlock({ id: "5.3", chapter: "C5", kind: "display", text: "5 DAYS", enterDone: SETTLE, exitStart: 600, size: 400, unit: "five", enter: "cut", show: HIT });
// 5.4: the table's one line is 45 characters with spaces, which TextBlock's lineException does not cover (it
// covers only an unbreakable token path), so the label is set on two lines; the line break stands for the dot.
const B54 = defineBlock({ id: "5.4", chapter: "C5", kind: "label", text: "ACTIVE DIRECTORY PROTOTYPE\nPRODUCTION-LEVEL", enterDone: SETTLE + 6, exitStart: 414, size: 28, unit: "five" });
const DAY_LANDINGS = Array.from({ length: 5 }, (_, i) => 426 + i * BEAT);
const B55 = defineBlock({
  id: "5.5",
  chapter: "C5",
  kind: "list",
  text: ["D1 INTERVIEWS", "D2 FLOW VARIANTS", "D3 HI-FI SCREENS", "D4 DESIGN QA", "D5 HANDOFF"].join("\n"),
  enterDone: DAY_LANDINGS[4],
  exitStart: 600,
  size: 40,
  landings: DAY_LANDINGS,
});
// 5.6 and 5.7: the number and its caption, one unit, held to the dead stop (nothing exits: the cut is the end).
const B56 = defineBlock({ id: "5.6", chapter: "C5", kind: "number", text: "~70%", enterDone: COUNT_START + 30, exitStart: 720, size: 320, unit: "pct", enter: "cut", show: COUNT_START, exit: "cut" });
const B57 = defineBlock({ id: "5.7", chapter: "C5", kind: "caption", text: "FASTER", enterDone: COUNT_START + 30, exitStart: 720, size: 28, unit: "pct", exit: "cut" });

export const blocks: BlockSpec[] = [B51, B52, B53, B54, B55, B56, B57];

export const cues: Cue[] = [
  { f: 0, sfx: "click", vol: 0.35 }, // the rail ticks to 05 / 08
  { f: 18, sfx: "impact-soft", vol: 0.45 }, // "3 WEEKS" rises from the floor
  { f: 36, sfx: "snap", vol: 0.4 }, // 5.2 lands
  { f: STRIKE_AT, sfx: "blip-down", vol: 0.3 }, // the strike
  { f: STRIKE_AT, sfx: "whoosh-rev", vol: 0.3 }, // the label sinks
  { f: COMPRESS.from, sfx: "riser", vol: 0.5 }, // the width compress
  { f: HIT, sfx: "impact", vol: 0.9 }, // HIT 2, the turn
  { f: HIT + 1, sfx: "swell", vol: 0.5 }, // the camera pulls back
  { f: SETTLE + 6, sfx: "snap", vol: 0.4 }, // 5.4 lands
  { f: 414, sfx: "whoosh-rev", vol: 0.3 }, // 5.4 sinks
  ...listCues(B55), // blip per day
  { f: 600, sfx: "whoosh-rev", vol: 0.3 }, // "5 DAYS" and the list sink together
  ...countCues(COUNT_START, 30, 14, "dial", 0.45), // the count's detents
  { f: COUNT_START + 30, sfx: "snap", vol: 0.4 }, // FASTER lands
];

/** Nothing new enters: the two label holds, the day-list hold and the number's hold into the stop. */
export const quiet: Quiet[] = [
  [36, STRIKE_AT],
  [SETTLE + 6, 414],
  [DAY_LANDINGS[4], 600],
  [COUNT_START + 30, 720],
];

/** The struck word after its registered exit: the same block, seen whole, carried through the compress (never registered). */
const STRUCK: BlockSpec = { ...B51, id: "5.1s", enter: "cut", show: STRIKE_AT, enterDone: STRIKE_AT + 1, exitStart: COMPRESS.to, exit: "cut" };

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const ready = useArchivo();

  // The compress: the width axis 125 to 62 (EI) while the pool goes out; the sliver scales to nothing at the end.
  const squeeze = prog(f, COMPRESS.from, COMPRESS.to, EI);
  const wdth = WEEKS_WDTH + (62 - WEEKS_WDTH) * squeeze;
  const sliver = 1 - prog(f, COMPRESS.from + 30, COMPRESS.to, EI);
  const weeksW = ready ? measureLine(B51.text, display(B51.size, wdth)).width : 0;
  const dark = prog(f, COMPRESS.from + 24, COMPRESS.to, EI);

  // Pull 2: "5 DAYS" at 3.2 times the frame width on the hit, backing off to its fit by the settle.
  const fittedW = ready ? Math.min(measureLine(B53.text, display(400)).width, W - 240) : W - 240;
  const pullFrom = pullScale(fittedW, 3.2);

  // The light: centred and dim; out by the black; back with the hit on the word, steady to the stop.
  const beforeHit = f < HIT;
  const light = beforeHit
    ? { cx: 960, cy: 480, r: 900, intensity: (0.5 + 0.2 * prog(f, 18, 30, EO)) * (1 - prog(f, COMPRESS.from, COMPRESS.to, EI)) }
    : { cx: 960, cy: 420, r: 1000, intensity: 0.9 };

  return (
    <Floor>
      <KeyLight cx={light.cx} cy={light.cy} r={light.r} intensity={light.intensity} />

      {beforeHit ? (
        <>
          {/* 5.1 as a readable block until the strike. */}
          <TextBlock block={B51} x={960} y={WEEKS_BASELINE} align="center" wdth={WEEKS_WDTH} />
          <TextBlock block={B52} x={960} y={WEEKS_BASELINE + 40} align="center" width={1200} />
          {/* The revision and the compress: grey, struck, narrowing to a sliver as the light goes out. */}
          {f >= STRIKE_AT && f < COMPRESS.to ? (
            <div style={{ position: "absolute", inset: 0, transform: `scaleX(${sliver.toFixed(4)})`, transformOrigin: "50% 50%", opacity: sliver > 0 ? 1 : 0 }}>
              <TextBlock block={STRUCK} x={960} y={WEEKS_BASELINE} align="center" wdth={wdth} color={struckInk(f, STRIKE_AT)} />
              <Strike x={960 - weeksW / 2} width={weeksW} baseline={WEEKS_BASELINE} size={B51.size} at={STRIKE_AT} dur={12} exitStart={COMPRESS.to} />
            </div>
          ) : null}
          {/* The floor falls into shadow with the light: black by 204, held through the near-silence. */}
          <div style={{ position: "absolute", inset: 0, background: K.shadow, opacity: dark, pointerEvents: "none" }} />
        </>
      ) : (
        <>
          {/* HIT 2 and Pull 2: the composed cropped still on the hit, motion from the next frame. */}
          <Pull from={pullFrom} to={1} start={HIT} dur={PULL_DUR} origin="50% 37%">
            <TextBlock block={B53} x={960} y={DAYS_BASELINE} align="center" fit color={K.hero} />
          </Pull>
          <TextBlock block={B54} x={960} y={DAYS_BASELINE + 40} align="center" width={1200} />

          {/* The day list in a row beneath, each with its Hero index and a tick on the floor line. */}
          <ListStack block={B55} x={120} y={DAYS_BASELINE + 150} columns={5} fill="row" colWidth={336} wght={500} index={{}} />

          {/* The count and its caption, centred, into the dead stop. */}
          <Count block={B56} start={COUNT_START} dur={30} from={0} to={70} x={960} y={600} align="center" color={K.hero} />
          <TextBlock block={B57} x={960} y={640} align="center" width={600} />
        </>
      )}
    </Floor>
  );
};
