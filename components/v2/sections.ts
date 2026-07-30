/**
 * The V2 home page's section index. Shared by the scroll rail (which tracks
 * the active one) and the top nav, so the two can never drift apart.
 */
export const V2_SECTIONS = [
  { id: "v2-intro", n: "01", label: "Intro" },
  { id: "v2-numbers", n: "02", label: "Numbers" },
  { id: "v2-speed", n: "03", label: "Speed" },
  { id: "v2-range", n: "04", label: "Range" },
  { id: "v2-system", n: "05", label: "System" },
  { id: "v2-process", n: "06", label: "Process" },
  { id: "v2-proof", n: "07", label: "Proof" },
  { id: "v2-engage", n: "08", label: "Engage" },
  { id: "v2-contact", n: "09", label: "Contact" },
] as const;
