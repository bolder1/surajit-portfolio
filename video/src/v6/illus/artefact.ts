// Every value the film reads from the design system lives here and nowhere else.
// Slash paths only (the Tokens file's convention); documentation spellings only.
// Nothing in a scene or a component carries a token name or a system hex as a
// literal; it imports from here. NAME_MODE flips every token name on screen between
// the real path and a role name in one edit.

export type NameMode = "real" | "role";
export const NAME_MODE: NameMode = "real";

export const TOKENS = {
  primaryFill: { real: "interactive/background/primary/Light/default", role: "Primary fill" },
  primaryBorder: { real: "interactive/border/primary/Light/default", role: "Primary border", verify: true },
  blue500: { real: "_global-colors/Product/Blue/500", role: "Blue primitive", hex: "#0052CC" },
  orange500: { real: "_global-colors/Product/Orange/500", role: "Orange primitive", hex: "#EB5424" },
  surfaceIntense: { real: "surface/background/gray/intense", role: "Surface", onLight: "#FFFFFF", onDark: "#232B33" },
  textNormal: { real: "surface/text/gray/normal", role: "Text", onLight: "#232B33", onDark: "#F1F4F6" },
  // The file spells this group with a typo; tokenName() returns the documentation spelling.
  error600: { real: "_global-colors/Aleart/Error/600", role: "Negative primitive", hex: "#E61E1E" },
} as const;

export type TokenId = keyof typeof TOKENS;

/** The name a token shows on screen: the corrected real path, or the role name. */
export const tokenName = (id: TokenId) => (NAME_MODE === "real" ? TOKENS[id].real.replace("Aleart", "Alert") : TOKENS[id].role);

/** The tables' own column names. */
export const MODES = { theme: ["BLUE", "ORANGE"], mode: ["onLight", "onDark"] } as const;

/** The Primary Md button in the Blue theme. */
export const BUTTON = { fill: "#0052CC", text: "#FFFFFF", border: "#0052CC", radius: 4, paddingX: 20, gap: 6, icon: 20, w: 86, h: 36 };

/** The Orange theme's fill and border for the same button (the Theme flip's end value). */
export const BUTTON_ORANGE = { fill: "#EB5424", border: "#EB5424" };

// Read from the button master's Blue variant (node 995:4512, text node 995:3153 "labelDesktop")
// through the Figma tool on 2026-10-10. The text content of that node is the one word below.
export const BUTTON_LABEL = "Button";

export const ALERT = { w: 420, h: 125, radius: 8, gapIconText: 12, gapBodyActions: 16, iconSmall: 16, iconLarge: 20, title: "Alert Title" };

export type StatusName = "positive" | "negative" | "notice" | "information" | "neutral";
export type StatusTint = { container: string; text: string; buttonText: string; border: string; icon: string; verified: boolean };

// Subtle emphasis. Positive was verified earlier against variant 502:97760.
// The other four were read on 2026-10-10 with the Figma variable tool on the variants
// listed under the Alert set 502:97888: Negative 502:98230, Notice 502:98296,
// Information 502:98362, Neutral 502:98428. The tool's keys map to the roles as on the
// Positive variant (Background = container, Text = text, Text color = button text,
// the inner button's border key = border, Icon = icon), and the same values were
// cross-checked against the export on disk with sample_tints.py (coordinates in that file).
export const STATUS: Record<StatusName, StatusTint> = {
  positive: { container: "#49D58452", text: "#313C47", buttonText: "#34975E", border: "#2FC66F", icon: "#1F5937", verified: true },
  negative: { container: "#FD212152", text: "#313C47", buttonText: "#E61E1E", border: "#E61E1E", icon: "#6A0E0E", verified: true },
  notice: { container: "#FD8A2152", text: "#313C47", buttonText: "#B46217", border: "#E67E1E", icon: "#6A3A0E", verified: true },
  information: { container: "#2CAEF152", text: "#313C47", buttonText: "#1F7CAB", border: "#109DE5", icon: "#124965", verified: true },
  neutral: { container: "#748EA90F", text: "#313C47", buttonText: "#1E1E1E", border: "#526578", icon: "#232B33", verified: true },
};

export const STATUS_NAMES: StatusName[] = ["positive", "negative", "notice", "information", "neutral"];

/** The five status names as the file's own variant axis spells them (allowed as labels outside the cards). */
export const STATUS_LABELS: Record<StatusName, string> = {
  positive: "Positive",
  negative: "Negative",
  notice: "Notice",
  information: "Information",
  neutral: "Neutral",
};

/**
 * A tint that may be drawn. Throws in development on an unverified entry so a
 * component never draws an empty string; the specimen shows the gap instead.
 */
export const requireStatus = (name: StatusName): StatusTint => {
  const s = STATUS[name];
  if (!s.verified && process.env.NODE_ENV !== "production") throw new Error(`STATUS.${name} is not verified; draw it as an outline with its name`);
  return s;
};

export const RULE = { stroke: 1, radiusControl: 4, radiusContainer: 8, gaps: [12, 16] as const };

/** The elevation tokens: lowRaised, midRaised, highRaised. Blur, y offset and spread in px. */
export const ELEVATION = {
  low: { blur: 16, y: 2, spread: 0 },
  mid: { blur: 24, y: 8, spread: 0 },
  high: { blur: 48, y: 16, spread: -4 },
};

export type ElevationName = keyof typeof ELEVATION;

/** The only reach line allowed in any version; or nothing. */
export const REACH_LINE = "TWO FIGMA FILES · FOUR COLLECTIONS · 626 VARIABLES";

/** The system's one name on screen. */
export const SYSTEM_LABEL = "DESIGN SYSTEM · v1.0";

/** Inter inside the redrawn artefacts (the two anatomy words); exempt from the film's one-family rule. */
export const ARTEFACT_FONT = "Inter";
