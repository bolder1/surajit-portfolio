// Designer reel, "funky dark" look: near-black ground, ONE hero orange, butter yellow and cream. Flat colour, no glow.
export const P = {
  void: "#0C0A08",
  ink: "#13100D",
  card: "#1B1612",
  card2: "#241D17",
  paper: "#F6EEE0",
  dim: "rgba(246,238,224,0.62)",
  faint: "rgba(246,238,224,0.34)",
  line: "rgba(246,238,224,0.11)",
  orange: "#FF6A1A",
  orangeDeep: "#E4510A",
  yellow: "#FFC93D",
} as const;

/** The visible modern grid: 12 columns x 6 rows inside a 60 px margin (cell 150 x 160). Everything snaps to it. */
export const G = {
  W: 1920,
  H: 1080,
  M: 60,
  COLS: 12,
  ROWS: 6,
  CW: 150,
  RH: 160,
  /** left edge of column c (0-based) */
  x: (c: number) => 60 + c * 150,
  /** top edge of row r (0-based) */
  y: (r: number) => 60 + r * 160,
} as const;

/** His design-system rule, applied to every drawn UI element: one stroke weight, two corner radii, three spacing steps. */
export const DS = { STROKE: 3, R1: 12, R2: 28, SP1: 8, SP2: 16, SP3: 32 } as const;
