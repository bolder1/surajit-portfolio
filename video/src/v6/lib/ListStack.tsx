// The list: a beat-locked accumulating list with an optional counter. Items land whole one per beat (18 f apart,
// the block's `landings`), nothing exits until the list is complete, and the whole list sinks together at the
// block's exitStart. The scene registers one block of kind "list" (one item per line) and, if it has a counter,
// one label block sharing the list's `unit`; this renders both through TextBlock as derived blocks, one per item,
// so the manifest holds one unit and the checker sees the landings. Items may carry a leading index mark ("D1
// INTERVIEWS"): with `index` set, the mark is lifted out and set in Hero at 24 px above the word with a 1 px tick,
// as chapter 5's day list has it. Source: v6/V1-DIRECTION.md 4.4 (4.7, 4.8), 4.5 (5.5), 4.6 (6.2), 9.2.
import React from "react";
import { useCurrentFrame } from "remotion";
import type { Cue, Sfx } from "../../lib/cues";
import { BEAT, K, W, supportRgba } from "../tokens";
import { TextBlock } from "../TextBlock";
import type { BlockSpec } from "../text-manifest";
import { linesOf } from "../text-manifest";
import { label } from "../type";
import { RiseSink } from "./riseSink";

export type ListCounter = {
  /** The counter's registered block (kind "label" or "caption", same `unit` as the list; text its final value). */
  block: BlockSpec;
  /** The word before the number ("SECTORS"); read off the block's text by default. */
  prefix?: string;
  /** Digits to pad to (2: "01"). */
  pad?: number;
  x: number;
  y: number;
  align?: "left" | "center" | "right";
  color?: string;
};

export type ListStackProps = {
  /** The registered list block: one item per line, `landings` one chapter-local frame per item (18 f apart). */
  block: BlockSpec;
  /** Top-left of the grid in frame px. */
  x: number;
  y: number;
  /** Columns of the grid (1); items fill down a column first unless `fill` is "row". */
  columns?: number;
  fill?: "column" | "row";
  /** Row pitch in px (the role's line height plus 24 by default). */
  pitch?: number;
  /** Column pitch in px (the frame's width over the columns by default). */
  colWidth?: number;
  /** Statement weight (500 for the sector words and the day list). */
  wght?: number;
  color?: string;
  /** Lift a leading index mark (D1..D5) out of each item: Hero, 24 px, a 1 px tick above, the word beneath. */
  index?: { color?: string; size?: number; tick?: number } | false;
  counter?: ListCounter;
};

/** The item landings, chapter-local: the block's own, or one per beat ending at its enterDone. */
export const listLandings = (block: BlockSpec): number[] => {
  const n = linesOf(block).length;
  return block.landings && block.landings.length === n ? block.landings : Array.from({ length: n }, (_, i) => block.enterDone - (n - 1 - i) * BEAT);
};

/** How many items have landed by frame f. */
export const listCount = (block: BlockSpec, f: number) => listLandings(block).filter((l) => f >= l).length;

/** The list's cues: `blip` on each landing, and `blip-hi` on each counter tick when the list has a counter. */
export const listCues = (block: BlockSpec, opts: { item?: Sfx; vol?: number; counter?: boolean; counterSfx?: Sfx; counterVol?: number } = {}): Cue[] => {
  const { item = "blip", vol = 0.35, counter = false, counterSfx = "blip-hi", counterVol = 0.3 } = opts;
  return listLandings(block).flatMap((f) => (counter ? [{ f, sfx: item, vol }, { f, sfx: counterSfx, vol: counterVol }] : [{ f, sfx: item, vol }]));
};

/** An item's derived block: its own text, visible whole from its landing, sinking with the list. */
export const listItemSpec = (block: BlockSpec, i: number, text?: string): BlockSpec => {
  const landing = listLandings(block)[i] ?? block.enterDone;
  // enterDone sits one frame after the landing: TextBlock's leader maths needs show < enterDone. The item is whole
  // from `show`; this spec is never registered, so the manifest's enterDone is the list block's own.
  return { ...block, id: `${block.id}.${i + 1}`, text: text ?? linesOf(block)[i] ?? "", enter: "items", enterDone: landing + 1, show: landing, landings: [landing] };
};

const INDEX = /^(D\d)\s+(.*)$/;

export const ListStack: React.FC<ListStackProps> = ({ block, x, y, columns = 1, fill = "column", pitch, colWidth, wght = 500, color, index = false, counter }) => {
  const f = useCurrentFrame();
  const items = linesOf(block);
  const n = items.length;
  const rows = Math.ceil(n / columns);
  const lineH = block.size * 1.15;
  const rowPitch = pitch ?? Math.round(lineH + 24);
  const colPitch = colWidth ?? Math.round((W - 2 * x) / columns);
  const idxSize = index ? (index.size ?? 24) : 0;
  const idxColor = index ? (index.color ?? K.hero) : K.hero;
  const tickH = index ? (index.tick ?? 10) : 0;
  // With an index the word sits beneath the tick and the mark: tick, 6 px, the mark's line, 8 px, the word.
  const wordDy = index ? tickH + 6 + idxSize * 1.2 + 8 : 0;
  const landings = listLandings(block);
  const landed = landings.filter((l) => f >= l).length;

  return (
    <>
      {items.map((raw, i) => {
        const col = fill === "column" ? Math.floor(i / rows) : i % columns;
        const row = fill === "column" ? i % rows : Math.floor(i / columns);
        const ix = x + col * colPitch;
        const iy = y + row * rowPitch;
        const m = index ? raw.match(INDEX) : null;
        const text = m ? m[2] : raw;
        const spec = listItemSpec(block, i, text);
        return (
          <React.Fragment key={spec.id}>
            {m && f >= landings[i] ? (
              <RiseSink x={ix} y={iy} w={colPitch} h={wordDy} exitStart={block.exitStart} exitDur={6} depth={4}>
                <div style={{ position: "absolute", left: 0, top: 0, width: 1, height: tickH, background: supportRgba(0.9) }} />
                <div style={{ ...label(idxSize), position: "absolute", left: 0, top: tickH + 6, color: idxColor, whiteSpace: "nowrap" }}>{m[1]}</div>
              </RiseSink>
            ) : null}
            <TextBlock block={spec} x={ix} y={iy + wordDy} width={colPitch - 16} wght={wght} color={color} />
          </React.Fragment>
        );
      })}
      {counter ? (
        <TextBlock
          block={{
            ...counter.block,
            text: `${counter.prefix ?? counter.block.text.replace(/\s*\d+\s*$/, "")} ${String(landed).padStart(counter.pad ?? 2, "0")}`,
          }}
          x={counter.x}
          y={counter.y}
          align={counter.align ?? "right"}
          color={counter.color}
        />
      ) : null}
    </>
  );
};
