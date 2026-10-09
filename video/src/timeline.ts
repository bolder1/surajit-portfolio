// Section map. 120 BPM @ 30 fps: 1 beat = 15 f, 1 bar = 60 f. All starts are bar downbeats.
export const SECTIONS = [
  { id: "S0", label: "00 / REQUEST", from: 0, dur: 120 },
  { id: "S1", label: "01 / HOOK", from: 120, dur: 120 },
  { id: "S2", label: "02 / CHALLENGE", from: 240, dur: 180 },
  { id: "S3", label: "03 / IDENTITY", from: 420, dur: 120 },
  { id: "M1", label: "04 / SCOPE", from: 540, dur: 60 },
  { id: "M2", label: "04 / SCOPE", from: 600, dur: 60 },
  { id: "M3", label: "04 / SCOPE", from: 660, dur: 60 },
  { id: "M4", label: "04 / SCOPE", from: 720, dur: 60 },
  { id: "M5", label: "04 / SCOPE", from: 780, dur: 60 },
  { id: "M6", label: "04 / SCOPE", from: 840, dur: 60 },
  { id: "M7", label: "04 / SCOPE", from: 900, dur: 60 },
  { id: "S5", label: "05 / SPEED", from: 960, dur: 120 },
  { id: "S6", label: "06 / THESIS", from: 1080, dur: 120 },
  { id: "S7", label: "07 / GRANTED", from: 1200, dur: 120 },
  { id: "S8", label: "08 / SESSION", from: 1320, dur: 180 },
] as const;

export const TOTAL = 1500;
export const LETTERBOX_OPEN = 1200;
export type SectionId = (typeof SECTIONS)[number]["id"];
