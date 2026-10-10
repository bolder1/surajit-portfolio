// The chapter registry: one entry per chapter id with its scene, its cues (chapter-local frames), its registered
// text blocks and its quiet windows (chapter-local [from, to) in which nothing new enters). The checker imports
// this file in Node, so a scene module must be importable without a browser (fonts load only in one).
import type React from "react";
import type { Cue } from "../lib/cues";
import type { BlockSpec } from "./text-manifest";
import type { V6Id } from "./timeline";
import * as C1 from "./scenes/C1Open";
import * as C2 from "./scenes/C2Who";
import * as C3 from "./scenes/C3Origin";
import * as C4 from "./scenes/C4Range";
import * as C5 from "./scenes/C5Proof";
import * as C6 from "./scenes/C6System";
import * as C7 from "./scenes/C7Craft";
import * as C8 from "./scenes/C8End";

/** A quiet window, chapter-local [from, to): nothing new enters (the key light may move). */
export type Quiet = readonly [number, number];

export type Chapter = {
  Scene: React.FC;
  cues: Cue[];
  blocks: BlockSpec[];
  quiet: Quiet[];
};

export const V6_SCENES: Record<V6Id, Chapter> = { C1, C2, C3, C4, C5, C6, C7, C8 };
