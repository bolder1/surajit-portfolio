/**
 * metrics — everything the page quotes, derived rather than typed.
 *
 * The page never writes a number in its own markup. It reads from here, and
 * here reads from `figmaData.ts`, which was reduced by script from the
 * published Figma files. That chain is the point: if the system changes and
 * the data is re-extracted, the prose re-counts itself instead of quietly
 * becoming a claim about a system that no longer exists.
 */

import {
  COLLECTIONS,
  PALETTE,
  RESOLUTION,
  SCALES,
  THEME_ROWS,
  ROUTED_TOKENS,
} from "./figmaData";
import { BUTTON, ICONS } from "./library";

const count = (name: string) =>
  COLLECTIONS.find((c) => c.name === name)?.count ?? 0;

export const M = {
  /** Layer 1 — opinionless values. */
  colourPrimitives: count("_global-colors"),
  sizePrimitives: count("_global-sizes"),
  get primitives() {
    return this.colourPrimitives + this.sizePrimitives;
  },
  colourFamilies: PALETTE.length,
  /** Every family carries the same ramp shape; this is the common length. */
  rampSteps: 13,
  alphaSteps: 4,

  /** Layer 2 — named steps. */
  aliasedScales: count("global-extra"),
  scaleGroups: SCALES.length,

  /** Layer 3 — brand. */
  themeRoles: count("Theme"),
  brands: 2,

  /** Layer 4 — appearance. What components bind to. */
  bindable: count("Mode"),
  modes: 2,

  /** Resolution shape. */
  routed: RESOLUTION.routed,
  direct: RESOLUTION.direct,
  literal: RESOLUTION.raw,

  /** One binding × 2 brands × 2 modes. */
  get valuesPerRoutedBinding() {
    return this.brands * this.modes;
  },

  /** Total variable rows across all five collections. */
  get totalVariables() {
    return COLLECTIONS.reduce((n, c) => n + c.count, 0);
  },

  /** What a third brand actually costs. */
  rebrandCost: RESOLUTION.routed,

  /** Components. */
  buttonPublished: BUTTON.published,
  buttonCrossProduct: BUTTON.crossProduct,
  buttonRemoved: BUTTON.removed.count,
  buttonGaps: BUTTON.gaps.length,
  get buttonAxes() {
    return BUTTON.axes.length;
  },
  /** What the matrix would be if brand and mode were variants instead of tokens. */
  get buttonIfModesWereVariants() {
    return BUTTON.published * this.brands * this.modes;
  },

  /** Icons. */
  icons: ICONS.total,
  iconPairs: ICONS.paired,
  iconCategories: ICONS.categories,

  /** The theme leak found by auditing the file. */
  themeLeak: THEME_ROWS.filter(
    (r) => r.Orange.alias?.includes("/Blue/") ?? false
  ).length,
} as const;

/** The 8 leaking rows, grouped, for the findings section. */
export const THEME_LEAK_ROWS = THEME_ROWS.filter(
  (r) => r.Orange.alias?.includes("/Blue/") ?? false
);

/** Exemplars used by the resolver — the routed roles a Button actually binds. */
export const BUTTON_BINDINGS = ROUTED_TOKENS.filter((r) =>
  r.token.startsWith("interactive/")
);

/**
 * Sanity checks that run at module load in development.
 *
 * These are not tests of the system — they are tests that this page still
 * describes it. A mismatch means the extracted data and the hand-written
 * component facts have drifted apart, which is exactly the failure this whole
 * case study is about.
 */
if (process.env.NODE_ENV !== "production") {
  const axisProduct = BUTTON.axes.reduce((n, a) => n * a.values.length, 1);
  if (axisProduct !== BUTTON.crossProduct) {
    console.warn(
      `[designSystem] Button axes multiply to ${axisProduct}, but crossProduct says ${BUTTON.crossProduct}.`
    );
  }
  if (BUTTON.published + BUTTON.removed.count + BUTTON.gaps.length !== axisProduct) {
    console.warn(
      `[designSystem] published + removed + gaps ≠ cross-product for Button.`
    );
  }
  if (RESOLUTION.routed + RESOLUTION.direct + RESOLUTION.raw !== RESOLUTION.total) {
    console.warn(`[designSystem] resolution buckets do not sum to the total.`);
  }
}
