// C8 PRINCIPLE AND INVITATION (5400 to 5976, 576 f, 19.2 s). "CALM." crops the frame, the camera backs off to his
// principle; the end card; the lamp clicks off. Source: V1-DIRECTION.md 4.8. Chapter-local L = global - 5400.
//   L0        hard cut: "CALM." cropped huge in Ink, standing with its shadow (a composed still; click)
//   L1..96    PULL 3: the camera dollies out and reveals "MAKE COMPLEX FEEL CALM." fitted (swell)
//   L96..216  breath, 4.0 s
//   L216      final chord: hard cut to the end card: his portrait left in the key light with his silhouette
//             shadow; SURAJIT over DUTTA right, Display 120 (glass-tink on the name)
//   L234..244 8.3 "Let's build something that lasts." fades up beneath the name; out L360..370
//   L366..372 the contact block's leader; L372 8.4 lands (snap) and holds; the hum under it from L300
//   L540      the lamp clicks off: black (click-lo); L541..576 black, silence
import React from "react";
import { useCurrentFrame } from "remotion";
import type { Cue } from "../../lib/cues";
import { Pull } from "../lib/Pull";
import type { Quiet } from "../registry";
import { Floor, KeyLight } from "../stage";
import { TextBlock } from "../TextBlock";
import { defineBlock, type BlockSpec } from "../text-manifest";
import { V6_CHORD, V6_LAMP_OFF, V6_PULLS, toLocal } from "../timeline";
import { K, SIDE_MARGIN, W } from "../tokens";
import { display, fitLine, label, measureLine, pullScale, useArchivo } from "../type";
import { Figure } from "./_C1/Figure";

const SEC = "C8" as const;
const PULL_START = toLocal(SEC, V6_PULLS[2][0]); // 0
const PULL_DUR = V6_PULLS[2][1]; // 96
const SETTLE = PULL_START + PULL_DUR; // 96
const CARD = toLocal(SEC, V6_CHORD); // 216
const LINE_DONE = CARD + 28; // 244
const LINE_EXIT = CARD + 144; // 360
const CONTACT_AT = CARD + 156; // 372
const LAMP_OFF = toLocal(SEC, V6_LAMP_OFF); // 540
const END = 576;
const HUM_FROM = 300; // 5700: the hum under the chord at 0.1

// 8.1 is his sentence set as Display (R4: 4.0 s), fitted to the frame minus the side margins (150 px).
const PRINCIPLE = defineBlock({ id: "8.1", chapter: SEC, kind: "display", text: "MAKE COMPLEX FEEL CALM.", enterDone: SETTLE, exitStart: CARD, size: 150, enter: "cut", show: PULL_START, exit: "cut", minHold: 120 });
// 8.2 is seen from the chord; the scene gates it on the cut, and `show` is one frame early only so the entrance window is not empty.
const NAME = defineBlock({ id: "8.2", chapter: SEC, kind: "display", text: "SURAJIT\nDUTTA", enterDone: CARD, exitStart: LAMP_OFF, size: 120, enter: "cut", show: CARD - 1, exit: "cut" });
const LINE = defineBlock({ id: "8.3", chapter: SEC, kind: "sentence", text: "Let's build something that lasts.", enterDone: LINE_DONE, exitStart: LINE_EXIT, size: 48 });
const CONTACT = defineBlock({
  id: "8.4",
  chapter: SEC,
  kind: "contact",
  text: "OPEN TO SENIOR ROLES AND SELECT FREELANCE\nsurajit3255@gmail.com\nsurajit-dutta.vercel.app\nlinkedin.com/in/surajit3255",
  enterDone: CONTACT_AT,
  exitStart: LAMP_OFF,
  size: 28,
  exit: "cut",
});

export const blocks: BlockSpec[] = [PRINCIPLE, NAME, LINE, CONTACT];

export const cues: Cue[] = [
  { f: PULL_START, sfx: "click", vol: 0.35 },
  { f: PULL_START + 1, sfx: "swell", vol: 0.5 },
  { f: CARD, sfx: "glass-tink", vol: 0.5 },
  { f: HUM_FROM, sfx: "hum-80f", vol: 0.1 },
  { f: HUM_FROM + 80, sfx: "hum-80f", vol: 0.1 },
  { f: HUM_FROM + 160, sfx: "hum-80f", vol: 0.1 },
  { f: CONTACT_AT, sfx: "snap", vol: 0.4 },
  { f: LAMP_OFF, sfx: "click-lo", vol: 0.4 },
];

export const quiet: Quiet[] = [
  [SETTLE, CARD],
  [LINE_DONE, LINE_EXIT],
  [CONTACT_AT, LAMP_OFF],
  [LAMP_OFF + 1, END],
];

// The contact block is one registered block rendered as two specs: line 1 as a label (uppercase, tracked, with
// the leader) and lines 2 to 4 in their real case with tracking 0; the email line carries a 1 px Hero underline.
const CONTACT_LINES = CONTACT.text.split("\n");
const CONTACT_HEAD: BlockSpec = { ...CONTACT, id: "8.4a", kind: "label", text: CONTACT_LINES[0] };
const CONTACT_BODY: BlockSpec = { ...CONTACT, id: "8.4b", text: CONTACT_LINES.slice(1).join("\n") };
const EMAIL = CONTACT_LINES[1];
const LABEL_LINE = 28 * 1.2;

// The end card's columns: his portrait left in the light; the name, his line and the contact block right.
// The contact block's first line is 918 px at 28 px, so the column starts at x 860 to keep the 120 px right margin.
const PORTRAIT_C8 = { x: 30, y: 120, w: 850, h: 1020 } as const;
const COL_X = 860;
const NAME_Y = 430; // the first baseline (the second is 120 px under it)
const LINE_Y = 600;
const CONTACT_Y = 600;
const CONTACT_GAP = 8;

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const ready = useArchivo();

  // Pull 3 backs away from the "AL" of "CALM.": the word alone is set at 3.2 times the frame width at the start,
  // so the composed still crops it on all four sides; the sentence lands fitted with the side margins.
  const pull = (() => {
    if (!ready) return { from: 3.2, origin: "50% 50%" };
    const size = fitLine(PRINCIPLE.text, "display", W - 2 * SIDE_MARGIN);
    const style = display(size);
    const total = measureLine(PRINCIPLE.text, style).width;
    const lead = measureLine("MAKE COMPLEX FEEL C", style).width;
    const al = measureLine("AL", style).width;
    const word = measureLine("CALM.", style).width;
    const left = W / 2 - total / 2;
    return { from: pullScale(word, 3.2), origin: `${(left + lead + al / 2).toFixed(1)}px 55%` };
  })();

  const emailW = ready ? measureLine(EMAIL, label(28, true)).width : 0;
  // The email's baseline: its line box top plus the half-leading at line height 1.2 and the ascent (0.934 em).
  const emailBaseline = CONTACT_Y + LABEL_LINE + CONTACT_GAP + 28 * 0.934;

  if (f >= LAMP_OFF) return <Floor />;

  return (
    <Floor>
      {f < CARD ? (
        <>
          <KeyLight cx={760} cy={360} r={1100} intensity={0.9} />
          <Pull from={pull.from} to={1} start={PULL_START} dur={PULL_DUR} origin={pull.origin}>
            <TextBlock block={PRINCIPLE} x={W / 2} y={590} align="center" width={W - 2 * SIDE_MARGIN} fit />
          </Pull>
        </>
      ) : (
        <>
          <KeyLight cx={360} cy={300} r={1000} intensity={1} />
          <Figure box={PORTRAIT_C8} />
          <TextBlock block={NAME} x={COL_X} y={NAME_Y} width={800} />
          <TextBlock block={LINE} x={COL_X} y={LINE_Y} width={820} />
          <TextBlock block={CONTACT_HEAD} x={COL_X} y={CONTACT_Y} width={820} />
          <TextBlock block={CONTACT_BODY} x={COL_X} y={CONTACT_Y + LABEL_LINE + CONTACT_GAP} width={820} leader={false} />
          {f >= CONTACT_AT ? <div style={{ position: "absolute", left: COL_X, top: Math.round(emailBaseline) + 4, width: emailW, height: 1, background: K.hero }} /> : null}
        </>
      )}
    </Floor>
  );
};
