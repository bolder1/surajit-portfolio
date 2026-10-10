import type React from "react";
import type { Cue } from "./lib/cues";
import type { SectionId } from "./timeline";
import * as S0 from "./scenes/S0";
import * as S1 from "./scenes/S1";
import * as S2 from "./scenes/S2";
import * as S3 from "./scenes/S3";
import * as M1 from "./scenes/scope/M1";
import * as M2 from "./scenes/scope/M2";
import * as M3 from "./scenes/scope/M3";
import * as M4 from "./scenes/scope/M4";
import * as M5 from "./scenes/scope/M5";
import * as M6 from "./scenes/scope/M6";
import * as M7 from "./scenes/scope/M7";
import * as S5 from "./scenes/S5";
import * as S6 from "./scenes/S6";
import * as S7 from "./scenes/S7";
import * as S8 from "./scenes/S8";

export const SCENES: Record<SectionId, { Scene: React.FC; cues: Cue[] }> = {
  S0, S1, S2, S3, M1, M2, M3, M4, M5, M6, M7, S5, S6, S7, S8,
};
