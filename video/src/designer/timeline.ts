// The designer story ("v3 story") on the v2 look. 120 BPM @ 30 fps (beat 15 f, bar 60 f), 52 s.
// Frame starts match the music bed's hit map (videos/designer-reel/assets/audio/README.md).
export const D_SECTIONS = [
  { id: "D1", label: "01 / ORIGIN", from: 0, dur: 120, glitch: false },
  { id: "D2", label: "02 / THESIS", from: 120, dur: 120, glitch: false },
  { id: "D3", label: "03 / NAME", from: 240, dur: 120, glitch: true },
  { id: "D4", label: "04 / 2022", from: 360, dur: 120, glitch: false },
  { id: "D5", label: "05 / 2023", from: 480, dur: 120, glitch: false },
  { id: "D6", label: "06 / 2024 → NOW", from: 600, dur: 180, glitch: false },
  { id: "D7", label: "07 / PROOF", from: 780, dur: 180, glitch: true },
  { id: "D8", label: "08 / WHAT I DO", from: 960, dur: 120, glitch: true },
  { id: "D9", label: "09 / HOW I WORK", from: 1080, dur: 120, glitch: false },
  { id: "D10", label: "10 / NUMBERS", from: 1200, dur: 120, glitch: true },
  { id: "D11", label: "11 / PRINCIPLE", from: 1320, dur: 60, glitch: true },
  { id: "D12", label: "12 / INVITATION", from: 1380, dur: 180, glitch: false },
] as const;

export const D_TOTAL = 1560;
/** The 2.39:1 letterbox opens with the final lift (1380). */
export const D_LETTERBOX_OPEN = 1380;
export type DId = (typeof D_SECTIONS)[number]["id"];
