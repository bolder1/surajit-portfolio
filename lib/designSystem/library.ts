/**
 * library — the component side of the system, read from the published files.
 *
 * Variant axes, values and counts are exactly as they appear in Figma,
 * misspellings included (`Interective state`, `Secondery`, `Tercery`,
 * `Netural`). Renaming them here would make the page describe a system that
 * does not exist.
 */

export type VariantAxis = { name: string; values: readonly string[] };

/**
 * Button — the component the whole token architecture was proved against.
 *
 * 1,470 published variants. The cross-product of the five axes is 1,792; the
 * 322-variant difference is 320 removed by decision plus 2 genuine holes.
 */
export const BUTTON = {
  name: "Button",
  axes: [
    { name: "Interective state", values: ["Ideal", "Hover", "Pressed", "Disabled"] },
    { name: "Intent", values: ["Primary", "Secondery", "Tercery", "Link"] },
    {
      name: "Semantics",
      values: ["Default", "White", "Warning", "Success", "Error", "Netural", "Info"],
    },
    {
      name: "Type",
      values: ["Text Only", "With leading Icon", "With trailing Icon", "Icon Only"],
    },
    { name: "Size", values: ["Xs", "Sm", "Md", "Xl"] },
  ] as const satisfies readonly VariantAxis[],

  published: 1470,
  crossProduct: 1792,

  /** Removed by decision, not by omission. */
  removed: {
    count: 320,
    rule: "Tercery × { Warning, Success, Error, Netural, Info }",
    why: "A tertiary button is already the quietest affordance on screen. A destructive tertiary reads as neither destructive nor actionable, so the intersection was cut rather than drawn — and the cut is published so it does not get quietly refilled.",
  },

  /** Genuine coverage holes, found by differencing the matrix. */
  gaps: [
    "Disabled · Tercery · Default · With leading Icon · Sm",
    "Disabled · Tercery · White · With trailing Icon · Sm",
  ],

  /** Which axes are variants and which are token-resolved. */
  notAnAxis: {
    axes: ["Brand", "Appearance"],
    why: "Neither brand nor light/dark is a Button variant. Both resolve through the token layer, which is why 1,470 variants cover 2 brands × 2 modes without becoming 5,880.",
  },
} as const;

/** Alert — a small, complete matrix, included as the counter-example to Button. */
export const ALERT = {
  name: "Alert",
  axes: [
    { name: "Emphasis", values: ["Subtle", "Intense"] },
    {
      name: "Color",
      values: ["Positive", "Negative", "Notice", "Information", "Neutral"],
    },
  ] as const satisfies readonly VariantAxis[],
  published: 10,
  crossProduct: 10,
  note: "Every cell exists because every cell means something. A matrix is not automatically too big — Button's is pruned because five of its cells were unreadable, not because 1,792 is a large number.",
} as const;

/** The icon set. */
export const ICONS = {
  total: 3576,
  line: 1455,
  fill: 1457,
  /** Editor/AI/typography glyphs that carry no line-or-fill suffix. */
  unsuffixed: 664,
  /** Base names that have both a -line and a -fill. */
  paired: 1454,
  categories: 21,
  broken: [
    {
      pair: "bar-chart-horizontal-line ↔ bar-chart-h-fill",
      why: "Same icon, two names. One side was abbreviated and the pairing silently broke.",
    },
    { pair: "dice-1-fill", why: "Ships fill-only; no line twin." },
    { pair: "info-custom-fill", why: "Ships fill-only; no line twin." },
  ],
  rule: "Every functional icon ships as a -line/-fill pair so a component can express selected state without a second import. 1,454 of 1,457 obey it.",
} as const;

/**
 * The system's own tooling — components that exist to document components.
 *
 * These are the governance model made physical. A lifecycle badge on the
 * artefact beats an adoption spreadsheet, because the spreadsheet goes stale
 * and the badge is in the place someone is about to copy from.
 */
export const META_COMPONENTS = [
  {
    name: ".Badge",
    variants: ["Version Number", "In Progess", "Published", "Deprecated"],
    count: 4,
    does: "Marks the lifecycle state of every artefact in the library.",
  },
  {
    name: ".frame-header",
    variants: ["Documentation", "Foundation", "Component", "Sub-Component"],
    count: 4,
    does: "Types every frame, so the file itself says what kind of thing you are looking at.",
  },
  {
    name: ".anatomy-marker",
    variants: ["Top", "Left", "Right", "Bottom", "× Line | Shape"],
    count: 8,
    does: "Draws the callout leaders on anatomy diagrams, so every component's anatomy page is measured the same way.",
  },
  {
    name: "Slot",
    variants: ["axis × spacing × items"],
    count: 41,
    does: "A layout primitive published as a component — Horizontal or Vertical, five spacing steps, up to five items. Documentation examples compose from it instead of hand-spacing.",
  },
  {
    name: "_BaseFocusRing",
    variants: ["Rectangular", "Circular"],
    count: 2,
    does: "One focus treatment, shared. Focus is an accessibility contract, not a per-component styling choice.",
  },
] as const;

/**
 * The publish gate. Six pages, fixed order, all six required.
 * Taken from the IDP documentation template, which is itself a component.
 */
export const DOC_TEMPLATE = [
  {
    no: "1",
    name: "Introduction",
    holds: "Anatomy diagram with numbered keys, one-line purpose, and a caution block.",
    forces: "Naming every part before anyone builds against it.",
  },
  {
    no: "2",
    name: "Variations",
    holds: "Each variant on a stage with a caption and a note on when it applies.",
    forces: "Justifying every axis. An axis with no note is an axis nobody needed.",
  },
  {
    no: "3",
    name: "Usage guidelines",
    holds: "Do / Don't pairs, drawn with real instances rather than described.",
    forces: "Naming the failure cases while the component is still cheap to change.",
  },
  {
    no: "4",
    name: "Props & specs",
    holds: "Two tables — properties and tokens — with type, default and description.",
    forces: "A component whose spec table is empty has not been designed, only drawn.",
  },
  {
    no: "5",
    name: "Accessibility",
    holds: "Role, keyboard, focus, labelling and contrast, as key/value rows.",
    forces: "The keyboard contract to exist before hand-off, not after a bug.",
  },
  {
    no: "6",
    name: "In context",
    holds: "The component inside a real screen composition.",
    forces: "Showing it next to its neighbours, where most spacing mistakes actually appear.",
  },
] as const;

/**
 * Usage guidelines, as the plates in the file draw them.
 *
 * Each pair is real: the `do` and `dont` stages differ only in which button
 * tones are placed, which is the entire point — the mistake is never a badly
 * drawn button, it is three of them next to each other.
 */
export const GUIDELINES = [
  {
    rule: "One emphasis per group",
    do: ["brand", "neutral", "ghost"],
    dont: ["brand", "brand", "brand"],
    why: "Three primary buttons is the same as none: if everything is the recommended action, the group has no recommended action.",
  },
  {
    rule: "Destructive actions sit apart from the safe one",
    do: ["neutral", "danger"],
    dont: ["danger", "danger"],
    why: "A destructive action needs distance and a different tone. Two of them side by side turns a confirmation into a coin toss.",
  },
  {
    rule: "Rank the group, then place it",
    do: ["danger", "brand", "neutral"],
    dont: ["brand", "brand", "brand"],
    why: "Tone carries the ranking. Position alone does not survive a right-to-left locale or a narrow viewport.",
  },
] as const;

export type GuidelineTone = "brand" | "neutral" | "ghost" | "danger";
