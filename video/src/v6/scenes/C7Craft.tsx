// C7 CRAFT (4608 to 5400, 792 f): four cards on hard cuts. Each card: a discipline label lands on the cut and
// sinks after its minimum, an artefact from the kit arrives under the light, and one decision line in his words
// stays alone with the artefact for the rest of the card. Every frame here is chapter-local (global minus 4608)
// and comes from v6/V1-DIRECTION.md section 4.7; the artefacts are the kit's (ILLUSTRATION.md section 4).
//   card 1    0 to 216    SYSTEM RESEARCH; the drawn token table far, slid in 6 to 30; line 7.2 from 30
//   card 2  216 to 432    PRODUCT STRATEGY; the drawn canvas, falling to 15 percent at 234 but three lit pages; 7.4 from 246
//   card 3  432 to 612    PROTOTYPING; three light-mode banking screens stepping forward at 438, 446, 454; 7.6 from 466
//   card 4  612 to 792    PRODUCT DESIGN; five drawn alerts cropped to their title band fan in 618 to 642; 7.8 from 642
import React from "react";
import { useCurrentFrame } from "remotion";
import type { Cue } from "../../lib/cues";
import { EO, prog } from "../../lib/anim";
import { defineBlock, type BlockSpec } from "../text-manifest";
import type { Quiet } from "../registry";
import { Floor, KeyLight, elevationShadow } from "../stage";
import { TextBlock } from "../TextBlock";
import {
  ALERT,
  AlertCard,
  BANKING_CONFIGURE,
  BANKING_PROCESS,
  BANKING_REPORT,
  CANVAS_AD,
  CanvasThumbs,
  MODES,
  STATUS_NAMES,
  Screen,
  Slab,
  TOKENS,
  TokenTable,
  tokenName,
  type TokenRow,
} from "../illus";

const CARD_FROM = [0, 216, 432, 612] as const;
const LINE_X = 120;

// The eight blocks. Labels land on the cut (L0) and sink after their minimum; the lines fade in over 10 f and
// stay to the card's hard cut (exit "cut": the cut is the exit, nothing fades before it).
const B71 = defineBlock({ id: "7.1", chapter: "C7", kind: "label", text: "SYSTEM RESEARCH", enterDone: 0, exitStart: 54, size: 28 });
const B72 = defineBlock({ id: "7.2", chapter: "C7", kind: "sentence", text: "A primitive-only token graph is a colour\ncatalogue, not a system.", enterDone: 30, exitStart: 216, size: 48, exit: "cut" });
const B73 = defineBlock({ id: "7.3", chapter: "C7", kind: "label", text: "PRODUCT STRATEGY", enterDone: 216, exitStart: 270, size: 28 });
// 7.4 is 45 characters on one line, over the 42 the TextBlock accepts, so it is set on two lines at the two-line size.
const B74 = defineBlock({ id: "7.4", chapter: "C7", kind: "sentence", text: "Decide what to ship and, harder,\nwhat not to.", enterDone: 246, exitStart: 432, size: 48, exit: "cut" });
// 7.5: the table gives 30 f, but the label rate (0.8 s + 0.5 s per word) is 39 f, so the sink moves from 462 to 471.
const B75 = defineBlock({ id: "7.5", chapter: "C7", kind: "label", text: "PROTOTYPING", enterDone: 432, exitStart: 471, size: 28 });
const B76 = defineBlock({ id: "7.6", chapter: "C7", kind: "sentence", text: "Configure, process, report.\nNot an instant dashboard.", enterDone: 466, exitStart: 612, size: 48, exit: "cut" });
const B77 = defineBlock({ id: "7.7", chapter: "C7", kind: "label", text: "PRODUCT DESIGN", enterDone: 612, exitStart: 666, size: 28 });
const B78 = defineBlock({ id: "7.8", chapter: "C7", kind: "sentence", text: "Status uses colour for state,\nnot for severity.", enterDone: 642, exitStart: 792, size: 48, exit: "cut" });

export const blocks: BlockSpec[] = [B71, B72, B73, B74, B75, B76, B77, B78];

// Card 3's three screens arrive 12 f each, 8 f apart, all still by 466. Card 4's five alerts fan in one per 6 f.
const SLAB_AT = [438, 446, 454] as const;
const FAN_AT = [618, 624, 630, 636, 642] as const;

export const cues: Cue[] = [
  // card 1
  { f: 0, sfx: "click", vol: 0.35 }, // the rail ticks to 07 / 08
  { f: 0, sfx: "snap", vol: 0.4 }, // SYSTEM RESEARCH lands on the cut
  { f: 6, sfx: "whoosh-long", vol: 0.3 }, // the token table slides in
  { f: 30, sfx: "impact-soft", vol: 0.4 }, // and lands
  { f: 54, sfx: "whoosh-rev", vol: 0.25 }, // the label sinks
  // card 2
  { f: 216, sfx: "snap", vol: 0.4 },
  { f: 222, sfx: "impact-soft", vol: 0.4 }, // the canvas lands
  { f: 234, sfx: "click-lo", vol: 0.3 }, // the canvas dims
  { f: 270, sfx: "whoosh-rev", vol: 0.25 },
  // card 3
  { f: 432, sfx: "snap", vol: 0.4 },
  { f: SLAB_AT[0], sfx: "whoosh-long", vol: 0.3 }, // the first slab slides
  ...SLAB_AT.map((a): Cue => ({ f: a + 12, sfx: "impact-soft", vol: 0.4 })), // each slab lands
  { f: 471, sfx: "whoosh-rev", vol: 0.25 },
  // card 4
  { f: 612, sfx: "snap", vol: 0.4 },
  ...FAN_AT.map((a): Cue => ({ f: a, sfx: "snap", vol: 0.3 })), // each alert chip lands
  { f: 666, sfx: "whoosh-rev", vol: 0.25 },
];

/** Nothing new enters from each line's landing to the card's cut; the breath (one block) begins once the label is gone. */
export const quiet: Quiet[] = [
  [30, 60],
  [60, 216],
  [246, 276],
  [276, 432],
  [466, 477],
  [477, 612],
  [642, 672],
  [672, 792],
];

// Card 1: the drawn token table, eight rows of 44, seven greeked, one typed: the primary fill with its two themes.
const TOKEN_ROWS: TokenRow[] = [
  { greek: true },
  { greek: true },
  { greek: true },
  { name: tokenName("primaryFill"), a: { hex: TOKENS.blue500.hex }, b: { hex: TOKENS.orange500.hex }, typed: true },
  { greek: true },
  { greek: true },
  { greek: true },
  { greek: true },
];
const TABLE = { w: 1200, h: 444, scale: 0.55, x: 840, y: 318 };

// Card 4: the fan. Each alert at 2x, cropped to its title band (the top 48 px at 1x), pivoting on its right end.
const FAN = { pivot: { x: 1780, y: 620 }, scale: 2, step: 7, band: 48 };

const Card1: React.FC<{ f: number }> = ({ f }) => {
  const slide = prog(f, 6, 30, EO);
  const on = prog(f, 6, 18, EO);
  return (
    <>
      <TextBlock block={B71} x={LINE_X} y={120} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, perspective: 2400, perspectiveOrigin: "50% 50%", pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            left: TABLE.x + (1 - slide) * 560,
            top: TABLE.y,
            transform: `rotateY(-12deg) scale(${TABLE.scale})`,
            transformOrigin: "50% 50%",
            width: TABLE.w,
            height: TABLE.h,
            opacity: on,
          }}
        >
          <Slab w={TABLE.w} h={TABLE.h} elevation="low" opacity={0.6} pool={{ cx: 180, cy: 40, r: 1100, a: 0.08 }}>
            <TokenTable rows={TOKEN_ROWS} colA={MODES.theme[0]} colB={MODES.theme[1]} lit="a" far seed={61} />
          </Slab>
        </div>
      </div>
      <TextBlock block={B72} x={LINE_X} y={430} width={880} />
    </>
  );
};

// Three pages chosen for shape (carrying only bars) stay lit when the canvas falls to 15 percent.
const LIT_PAGES = [4, 15, 27];

const Card2: React.FC<{ f: number }> = ({ f }) => {
  const on = prog(f, 216, 222, EO);
  const fall = prog(f, 234, 252, EO);
  const dim = 1 - 0.85 * fall;
  return (
    <>
      <TextBlock block={B73} x={LINE_X} y={120} />
      <div style={{ position: "absolute", left: 900, top: 40, transform: "scale(0.5)", transformOrigin: "top left", opacity: on }}>
        <Slab w={CANVAS_AD.w} h={CANVAS_AD.h} elevation={on} pool={{ cx: 360, cy: 240, r: 1500, a: 0.08 }}>
          <CanvasThumbs layout={CANVAS_AD} lit={LIT_PAGES} dim={dim} seed={71} />
        </Slab>
      </div>
      <TextBlock block={B74} x={LINE_X} y={430} width={760} />
    </>
  );
};

// Card 3: the three light-mode screens as slabs stepping forward, each from a little behind and below its place.
const BANKING = [
  { layout: BANKING_CONFIGURE, x: 660, y: 20, elevation: "low" as const },
  { layout: BANKING_PROCESS, x: 710, y: 310, elevation: "mid" as const },
  { layout: BANKING_REPORT, x: 760, y: 600, elevation: "high" as const },
];

const Card3: React.FC<{ f: number }> = ({ f }) => (
  <>
    <TextBlock block={B75} x={LINE_X} y={120} />
    {BANKING.map((b, i) => {
      const step = prog(f, SLAB_AT[i], SLAB_AT[i] + 12, EO);
      if (step <= 0) return null;
      const s = 0.5 * (0.94 + 0.06 * step);
      return (
        <div
          key={b.layout.id}
          style={{
            position: "absolute",
            left: b.x + 36 * (1 - step),
            top: b.y + 36 * (1 - step),
            transform: `scale(${s.toFixed(4)})`,
            transformOrigin: "top left",
            opacity: step,
          }}
        >
          <Screen layout={b.layout} mode="light" seed={41 + i} elevation={b.elevation} pool={{ cx: 240, cy: 100, r: 1500, a: 0.06 }} />
        </div>
      );
    })}
    <TextBlock block={B76} x={LINE_X} y={760} width={560} />
  </>
);

const Card4: React.FC<{ f: number }> = ({ f }) => (
  <>
    <TextBlock block={B77} x={LINE_X} y={120} />
    {STATUS_NAMES.map((name, i) => {
      const at = FAN_AT[i];
      const p = prog(f, at - 6, at, EO);
      if (p <= 0) return null;
      // Each chip swings out from under the one before it, pivoting on the fan's right end.
      const angle = FAN.step * (i - 1 + p);
      const w = ALERT.w * FAN.scale;
      const h = FAN.band * FAN.scale;
      return (
        <div
          key={name}
          style={{
            position: "absolute",
            left: FAN.pivot.x - w,
            top: FAN.pivot.y - h,
            width: w,
            height: h,
            transform: `rotate(${(i === 0 ? 0 : angle).toFixed(3)}deg)`,
            transformOrigin: "100% 100%",
            opacity: i === 0 ? p : 1,
            zIndex: 10 - i,
            borderRadius: `${ALERT.radius * FAN.scale}px ${ALERT.radius * FAN.scale}px 0 0`,
            boxShadow: elevationShadow("low"),
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, width: ALERT.w, height: ALERT.h, transform: `scale(${FAN.scale})`, transformOrigin: "top left", clipPath: `inset(0 0 ${ALERT.h - FAN.band}px 0)` }}>
            <AlertCard emphasis="subtle" color={name} seed={11 + i} />
          </div>
        </div>
      );
    })}
    <TextBlock block={B78} x={LINE_X} y={430} width={760} />
  </>
);

// The light steps between artefacts on each cut: onto the table, the canvas, the slabs, the fan.
const LIGHT = [
  { cx: 1240, cy: 380, r: 1100 },
  { cx: 1300, cy: 420, r: 1200 },
  { cx: 1200, cy: 360, r: 1200 },
  { cx: 1340, cy: 420, r: 1100 },
];

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const card = f < CARD_FROM[1] ? 0 : f < CARD_FROM[2] ? 1 : f < CARD_FROM[3] ? 2 : 3;
  const light = LIGHT[card];
  return (
    <Floor>
      <KeyLight cx={light.cx} cy={light.cy} r={light.r} intensity={0.9} />
      {card === 0 ? <Card1 f={f} /> : card === 1 ? <Card2 f={f} /> : card === 2 ? <Card3 f={f} /> : <Card4 f={f} />}
    </Floor>
  );
};
