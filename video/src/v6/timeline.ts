// KEY LIGHT (v6, V1): the clock. 100 BPM at 30 fps, one beat 18 f, one bar 72 f = 2.4 s.
// Every chapter starts on a bar; every frame here is absolute (film frame). Chapter-local = global - from.
// Source: v6/V1-DIRECTION.md sections 3.1 and 3.2. Holds live here and in the manifest, never in scene code.

export const BPM = 100;
export const BEAT = 18;
export const BAR = 72;
export const V6_TOTAL = 5976; // 83 bars, 199.2 s, 3:19.2

export const V6_SECTIONS = [
  { id: "C1", name: "COLD OPEN", from: 0, dur: 288 },
  { id: "C2", name: "WHO", from: 288, dur: 216 },
  { id: "C3", name: "ORIGIN AND THESIS", from: 504, dur: 792 },
  { id: "C4", name: "RANGE", from: 1296, dur: 648 },
  { id: "C5", name: "PROOF", from: 1944, dur: 720 },
  { id: "C6", name: "SYSTEM", from: 2664, dur: 1944 },
  { id: "C7", name: "CRAFT", from: 4608, dur: 792 },
  { id: "C8", name: "PRINCIPLE AND INVITATION", from: 5400, dur: 576 },
] as const;

export type V6Id = (typeof V6_SECTIONS)[number]["id"];
export type V6Section = (typeof V6_SECTIONS)[number];

/** The three big hits (the only uses of `impact`): the drop, the turn, the payoff. */
export const V6_HITS = [288, 2160, 4464] as const;
/** The dead stop: the band ends on this frame with no tail; 18 f of true silence follow. */
export const V6_STOP = 2664;
/** The final chord lands on the end card. */
export const V6_CHORD = 5616;
/** The lamp clicks off; black to the end. Audio silent by 5960. */
export const V6_LAMP_OFF = 5940;
/** The three Pulls: [start, dur]. Motion starts on the second frame; the display hold starts at the settle frame. */
export const V6_PULLS = [
  [288, 108],
  [2160, 108],
  [5400, 96],
] as const;
/** Chapter 6 only: the index rail lights ORGANISM, MOLECULE, ATOM, TOKEN on these global frames. */
export const C6_RAIL_STEPS = [2802, 3048, 3285, 3384] as const;
/** The bed's silences stay silent: no SFX inside these windows (global, [from, to)). */
export const V6_SILENCES: ReadonlyArray<readonly [number, number]> = [
  [278, 288],
  [2148, 2160],
  [2664, 2682],
  [4456, 4464],
  [5941, V6_TOTAL],
];

// The hit map `public/music/bed-v6-hits.json` is written by the sound lane with the bed; it is not imported
// here so the film and the checker build before the bed exists. The hits above are the map's contract.

export const sectionOf = (id: V6Id): V6Section => V6_SECTIONS.find((s) => s.id === id)!;
/** The chapter a global frame falls in. */
export const sectionAt = (g: number): V6Section =>
  [...V6_SECTIONS].reverse().find((s) => g >= s.from) ?? V6_SECTIONS[0];
export const toGlobal = (id: V6Id, local: number) => sectionOf(id).from + local;
export const toLocal = (id: V6Id, global: number) => global - sectionOf(id).from;
