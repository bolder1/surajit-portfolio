import type React from "react";
import type { Cue } from "../lib/cues";
import type { DId } from "./timeline";
import * as D1 from "./scenes/D1";
import * as D2 from "./scenes/D2";
import * as D3 from "./scenes/D3";
import * as D4 from "./scenes/D4";
import * as D5 from "./scenes/D5";
import * as D6 from "./scenes/D6";
import * as D7 from "./scenes/D7";
import * as D8 from "./scenes/D8";
import * as D9 from "./scenes/D9";
import * as D10 from "./scenes/D10";
import * as D11 from "./scenes/D11";
import * as D12 from "./scenes/D12";

export const D_SCENES: Record<DId, { Scene: React.FC; cues: Cue[] }> = {
  D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12,
};
