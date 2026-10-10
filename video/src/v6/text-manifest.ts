// The text manifest: every block of text in the film, registered at module level by `defineBlock()` so the
// checker (scripts/check-holds.ts) can import it without rendering a frame. Frames are chapter-local.
// Holds are measured from `enterDone` (complete and still) to `exitStart` (the exit begins).
// Minimums are ruling 2 as written in v6/V1-DIRECTION.md section 4 (conventions). No React in this file.
import type { V6Id } from "./timeline";

export type Kind =
  | "display" // a display word: rises from the floor 12 f, sinks 12 f, TypeShadow
  | "statement" // a caption or decision line in his voice, set in Statement: fades 10 f with an 8 px rise
  | "sentence" // his own sentence: Statement, the sentence rate (1.2 s + 0.45 s per word, floor 3.0 s)
  | "label" // a label: a 6 f leader, then whole with `snap`
  | "caption" // a number's or a display word's one-line caption (label rate, part of the unit)
  | "number" // a counted number: counts about 1 s, holds 75 f
  | "list" // an accumulating list: items land on beats, the list holds 1 s + 0.3 s per word after the last
  | "readout" // a two-row token readout (label rate, two rows one block)
  | "diagram" // a diagram label (marker, wire terminal, dimension value); up to three form one unit
  | "contact"; // the four-line contact block (R7: 5.0 s)

export type Enter = "rise" | "fade" | "leader" | "cut" | "items";
export type Exit = "sink" | "fade" | "dark" | "cut";

export type BlockSpec = {
  /** The storyboard id, "2.2". */
  id: string;
  chapter: V6Id;
  kind: Kind;
  /** Verbatim, lines joined by "\n" (lists and the contact block: one item per line). */
  text: string;
  /** Word count override (the conventions: a token path is one word per slash segment, a hex value one, D1..D5 none). */
  words?: number;
  /** Chapter-local frame the block is complete and still. */
  enterDone: number;
  /** Chapter-local frame its exit begins. */
  exitStart: number;
  /** Blocks sharing a unit count as one block (display + caption, number + caption, list + counter, a diagram group). */
  unit?: string;
  /** Font size in px. */
  size: number;
  /** Chapter-local landing frames of list items or diagram labels (each must pass the eighth-note test). */
  landings?: number[];
  /** A minimum hold in frames that only raises the computed one ("Make complex feel calm." 120 f). */
  minHold?: number;
  /** The one declared exception: a single unbreakable token path up to 48 characters. */
  lineException?: boolean;
  /** Entrance override (default by kind). "cut": visible from `show` with no entrance (the Pull words). */
  enter?: Enter;
  /** Exit override (default by kind). */
  exit?: Exit;
  /** Chapter-local first visible frame for "cut" entrances (a Pull word is seen from the hit, complete at the settle). */
  show?: number;
  /** Exit duration override in frames ("dark": over a light pan). */
  exitDur?: number;
};

export const MANIFEST: BlockSpec[] = [];

/** Register a block at module level and hand it back for the scene to render. Re-registration by id replaces. */
export const defineBlock = (b: BlockSpec): BlockSpec => {
  const i = MANIFEST.findIndex((m) => m.id === b.id && m.chapter === b.chapter);
  if (i >= 0) MANIFEST[i] = b;
  else MANIFEST.push(b);
  return b;
};

export const blocksOf = (chapter: V6Id) => MANIFEST.filter((b) => b.chapter === chapter);

export const linesOf = (b: Pick<BlockSpec, "text">) => b.text.split("\n");

/** Word count per the conventions: slash-path segments count one each, a hex counts one, index marks D1..D5 none. */
export const countWords = (text: string): number => {
  let n = 0;
  for (const raw of text.split(/[\s\n]+/)) {
    const t = raw.trim();
    if (!t || t === "·" || t === "/" || t === "|") continue;
    if (/^D\d$/.test(t)) continue;
    const slashes = (t.match(/\//g) ?? []).length;
    if (slashes >= 2) n += t.split("/").filter(Boolean).length;
    else n += 1;
  }
  return n;
};

export const wordsOf = (b: BlockSpec) => b.words ?? countWords(b.text);

/** The minimum hold in frames by kind and word count (ruling 2; 30 fps). */
export const minHold = (kind: Kind, words: number): number => {
  switch (kind) {
    case "display":
      return Math.max(60, 30 + 15 * words);
    case "sentence":
    case "statement":
      return Math.max(90, Math.ceil(36 + 13.5 * words));
    case "label":
    case "caption":
    case "readout":
    case "diagram":
      return Math.max(30, 24 + 15 * words);
    case "number":
      return 75;
    case "list":
      return 30 + 9 * words;
    case "contact":
      return 150;
  }
};

export const requiredHold = (b: BlockSpec) => Math.max(minHold(b.kind, wordsOf(b)), b.minHold ?? 0);
export const actualHold = (b: BlockSpec) => b.exitStart - b.enterDone;

/** The visual role a kind renders in. */
export const roleOf = (kind: Kind): "display" | "statement" | "label" =>
  kind === "display" || kind === "number" ? "display" : kind === "sentence" || kind === "statement" || kind === "list" ? "statement" : "label";

export const defaultEnter = (kind: Kind): Enter =>
  kind === "display" || kind === "number" ? "rise" : kind === "sentence" || kind === "statement" ? "fade" : kind === "list" ? "items" : "leader";
export const defaultExit = (kind: Kind): Exit => (kind === "sentence" || kind === "statement" ? "fade" : "sink");

/** Entrance length in frames by kind (rise 12, fade 10, leader 6). */
export const enterDur = (b: BlockSpec): number => {
  const e = b.enter ?? defaultEnter(b.kind);
  return e === "rise" ? 12 : e === "fade" ? 10 : e === "leader" ? 6 : 0;
};
/** Exit length in frames by kind (display sink 12, label sink 6, fade 10). */
export const exitDur = (b: BlockSpec): number => {
  if (b.exitDur !== undefined) return b.exitDur;
  const x = b.exit ?? defaultExit(b.kind);
  if (x === "cut") return 0;
  if (x === "fade") return 10;
  if (x === "dark") return 36;
  return roleOf(b.kind) === "display" ? 12 : 6;
};

/** Minimum size by kind (R11). */
export const minSize = (kind: Kind) => (roleOf(kind) === "display" ? 72 : roleOf(kind) === "statement" ? 40 : kind === "contact" ? 28 : 24);

/** The unit key: blocks without a unit are their own. */
export const unitOf = (b: BlockSpec) => `${b.chapter}:${b.unit ?? b.id}`;
