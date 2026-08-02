/**
 * /system — the design system told as a scrollable argument.
 *
 * The /process/design-system page is the written case. This is the same
 * material built to be *watched*: every claim it makes is demonstrated by
 * the thing on screen rather than described next to it.
 *
 * Narration lives here so the chapter components stay presentational. Each
 * chapter's `beats` array is one-to-one with the steps its pinned scroll
 * drives — add a beat and the chapter gets longer on its own.
 *
 * Same sanitisation rule as the rest of the site: structural counts from the
 * Figma files are publishable, adoption and velocity are not.
 */

export interface Beat {
  kicker: string;
  line: string;
  note?: string;
}

export interface Chapter {
  id: string;
  no: string;
  name: string;
  /** Shown on the cover and the rail — sets expectation before you commit. */
  blurb: string;
  beats: Beat[];
}

export const READ_MINUTES = 6;

/* ── 01 · the drift ──────────────────────────────────────────────
   Five products, each making a locally defensible call, ending up
   somewhere no one chose. */
export const DRIFT_PRODUCTS = ["IAM", "PAM", "IGA", "UEM", "ITDR"];

export const CHAPTERS: Chapter[] = [
  {
    id: "drift",
    no: "01",
    name: "The drift",
    blurb: "How five products end up somewhere nobody chose.",
    beats: [
      {
        kicker: "ONE PRODUCT",
        line: "A team picks a blue. It is a good blue, chosen for a good reason, and nobody will ever question it.",
      },
      {
        kicker: "TWO PRODUCTS",
        line: "The second team needs the same component in a slightly different shape. They have a deadline, so they copy it and adjust.",
      },
      {
        kicker: "FIVE PRODUCTS",
        line: "Every variant has a defensible local reason. That is what makes drift hard — no single decision was wrong.",
        note: "The audit found the same logical component in a subtly different shape in every product.",
      },
      {
        kicker: "THE BILL",
        line: "Cumulatively it became the largest single source of customer-reported inconsistency.",
        note: "A dark-mode pass meant redrawing files. A new brand meant a new library.",
      },
    ],
  },
  {
    id: "roster",
    no: "02",
    name: "The roster",
    blurb: "Five people who want contradictory things from one file.",
    beats: [
      {
        kicker: "PERSON 01",
        line: "The product designer wants to extend the system this week, without waiting for it and without forking it.",
      },
      {
        kicker: "PERSON 02",
        line: "The engineer has no designer on the ticket. They are not trying to make a visual decision — they are trying to avoid having to.",
      },
      {
        kicker: "PERSON 03",
        line: "The product manager demos five products in the same hour. Every visual disagreement is a question they have to answer.",
      },
      {
        kicker: "PERSON 04",
        line: "The administrator has run these consoles for years and did not ask for any of this. They want the product they already know.",
      },
      {
        kicker: "PERSON 05",
        line: "The next maintainer inherits every name they did not choose, and has to decide on day one without the person who chose it.",
      },
      {
        kicker: "THE PROBLEM",
        line: "Two of them need the system to move quickly. Two need it never to move. Serve any one of them alone and the system fails the others.",
        note: "The architecture is not a preference. It is the shape that survives all five.",
      },
    ],
  },
  {
    id: "stack",
    no: "03",
    name: "The stack",
    blurb: "Layers exist so different people can move at different speeds.",
    beats: [
      {
        kicker: "LAYER 01 · PRIMITIVES",
        line: "The raw values the products already shipped with, under mechanical names. A primitive records what a value is, never where it is used.",
        note: "This layer is deliberately inert. That is what makes it trustworthy.",
      },
      {
        kicker: "LAYER 02 · ALIASED SCALES",
        line: "Spacing, radius, border width and icon size all point back at one pixel scale instead of restating numbers.",
        note: "Change the base unit and every scale moves together.",
      },
      {
        kicker: "LAYER 03 · SEMANTIC ROLES",
        line: "Where intent enters: surface, feedback, interactive. The only layer components may reference, and the only one carrying light and dark.",
        note: "This is the layer a product team may add to. It is why extending no longer means forking.",
      },
      {
        kicker: "LAYER 04 · THEME MODES",
        line: "Brand lives in its own collection with a mode per identity, kept apart from light and dark.",
        note: "Which is what turns three brands × two modes into a multiplication rather than six sets of work.",
      },
    ],
  },
  {
    id: "repoint",
    no: "04",
    name: "The re-point",
    blurb: "Modernise the surface without touching a single screen.",
    beats: [
      {
        kicker: "THE MECHANISM",
        line: "A component references a role. The role references a primitive. Change which primitive it points at and every surface follows.",
        note: "Nothing in any product file was opened. The token name never changed.",
      },
    ],
  },
  {
    id: "unassisted",
    no: "05",
    name: "No designer on the ticket",
    blurb: "The wrong value is not in the dropdown.",
    beats: [
      {
        kicker: "THE TEST",
        line: "The test of a system is not whether a designer can use it. It is whether a screen built with nobody in the room comes out right.",
        note: "Try to make it wrong. The vocabulary has no word for a 7px gap.",
      },
    ],
  },
  {
    id: "scale",
    no: "06",
    name: "How it scales",
    blurb: "One number decides whether this is a system or a library.",
    beats: [
      {
        kicker: "THE WRONG QUESTION",
        line: "How many variables does it have? A system nobody adopted has exactly the same count as one everybody uses.",
      },
      {
        kicker: "THE RIGHT ONE",
        line: "What did each product cost to onboard, in the order they arrived?",
      },
      {
        kicker: "FLAT",
        line: "Every product pays full price. What you have is a well-organised library.",
      },
      {
        kicker: "FALLING",
        line: "The nth product is cheaper than the one before it, because the semantic layer already holds the roles it needs.",
        note: "That decline — not the variable count — is the entire argument for having built it.",
      },
    ],
  },
];

/* ── chapter 03 · the layers, as drawn ─────────────────────────── */
export const STACK_LAYERS = [
  { name: "PRIMITIVES", holds: "the shipped values" },
  { name: "ALIASED SCALES", holds: "the rhythm" },
  { name: "SEMANTIC ROLES", holds: "what it means" },
  { name: "THEME MODES", holds: "which identity" },
];

/* ── chapter 04 · the re-point demo ────────────────────────────────
   Two ramp steps a single role can aim at. Values are illustrative of
   the mechanism, not lifted from the production palette. */
export const REPOINT_TARGETS = [
  { id: "raised", label: "surface/raised/step-2", swatch: "#1d1c1a", ink: "#f2efe9" },
  { id: "sunken", label: "surface/raised/step-6", swatch: "#f2efe9", ink: "#141312" },
];

/* ── chapter 05 · the dropdown that cannot be wrong ────────────── */
export const AXES = [
  { id: "pad", label: "padding", options: ["space/1", "space/2", "space/3", "space/4"] },
  { id: "radius", label: "radius", options: ["radius/sharp", "radius/soft", "radius/pill"] },
  { id: "tone", label: "tone", options: ["primary", "secondary", "ghost"] },
];

/** Rendered values per option — the point is that nothing else is reachable. */
export const AXIS_VALUES: Record<string, Record<string, string>> = {
  pad: { "space/1": "8px 14px", "space/2": "10px 18px", "space/3": "13px 24px", "space/4": "16px 30px" },
  radius: { "radius/sharp": "2px", "radius/soft": "8px", "radius/pill": "999px" },
  tone: { primary: "solid", secondary: "outline", ghost: "bare" },
};

/* ── chapter 06 · the two curves ───────────────────────────────── */
export const CURVE_FLAT = [88, 87, 89, 88, 87];
export const CURVE_FALLING = [88, 61, 44, 33, 26];
