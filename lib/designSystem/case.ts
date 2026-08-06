/**
 * case — the written spine of the design system case study.
 *
 * Every number quoted in this file is either imported from `figmaData.ts`
 * (which was reduced by script from the live libraries) or derived from it in
 * `metrics.ts`. Nothing is typed in by hand. If a count here disagrees with
 * the Figma file, the file is right and this page is stale — which is the
 * only failure mode worth having.
 *
 * The `explainer` on each step is the part the brief actually asked for: not
 * what was built, but why that was the next move rather than something else.
 */

export type Step = {
  no: string;
  title: string;
  /** What was done. */
  body: string;
  /** Why this, here, instead of the obvious alternative. */
  explainer: string;
  /** The artefact this step produced. */
  output: string;
};

export type Finding = {
  id: string;
  headline: string;
  detail: string;
  /** How it was found — the method, not the result. */
  method: string;
  severity: "structural" | "coverage" | "naming";
};

export const MASTHEAD = {
  eyebrow: "CASE STUDY · DESIGN SYSTEMS",
  title: "One definition behind five products",
  standfirst:
    "The miniOrange Central Design System: a four-layer variable architecture where a single component binding resolves against brand and appearance independently, so a new brand is 23 values and a dark mode is zero screens.",
  role: "Product Designer · miniOrange",
  year: "2024 — present",
  scope: [
    "DRIFT AUDIT",
    "TOKEN ARCHITECTURE",
    "MULTI-MODE MAPPING",
    "COMPONENT API",
    "DOCUMENTATION SPEC",
    "GOVERNANCE",
  ],
};

/** Chapter 01 — the problem, and how it was actually located. */
export const PROBLEM = {
  headline: "Five products drifting apart, one defensible decision at a time",
  body: "IAM, PAM, IGA, UEM and ITDR were already sold and in daily operation. The same logical component — a data table row, a primary button, an alert — existed in a subtly different shape in each one, and every variant had a good local reason. That is what makes drift expensive: no single decision is wrong, and the cumulative result was still the largest source of customer-reported inconsistency.",
  howFound: {
    headline: "The audit came before the argument",
    body: "I did not start from a proposal. I started by collecting every colour, radius, spacing and border value in circulation across the five product files and counting how many distinct values were doing the same job. A count is an argument that does not need a slide.",
    explainer:
      "Leading with a proposal invites a debate about taste. Leading with a census turns it into arithmetic: nobody defends the eleventh grey once they can see the other ten. It also produces the baseline every later claim is measured against, which is the difference between a system you can report on and one you can only advocate for.",
  },
  constraints: [
    {
      title: "Nothing already shipped could be redrawn",
      body: "Five products in daily operation by long-tenured administrators. Anything that cost them their muscle memory would not be adopted whatever its merits, so the system had to describe what already existed before proposing anything new.",
    },
    {
      title: "Strict universal components had already failed here",
      body: "They disagreed with each product's reality often enough that teams forked quietly. A quiet fork is worse than open divergence because it cannot be measured.",
    },
    {
      title: "Brands and colour modes multiply, they do not add",
      body: "Two brands and two appearance modes treated as separate work is four sets of screens. Only a layered variable model turns it into one definition with modes on top.",
    },
  ],
};

/** Chapter 02 — the five audiences whose interests genuinely conflict. */
export const ROSTER = [
  {
    who: "Product designer",
    wants: "Enough range to solve a screen without filing a request.",
    breaks:
      "Serve only them and the primitive set grows every sprint until it is a palette again.",
    pull: "move",
  },
  {
    who: "Engineer with no designer on the ticket",
    wants: "To pick a correct value without knowing why it is correct.",
    breaks:
      "Serve only them and the system optimises for defaults, and every non-default case becomes a fork.",
    pull: "still",
  },
  {
    who: "Product manager",
    wants: "The screen shipped this sprint, not next.",
    breaks:
      "Serve only them and the system becomes a component dump with no contract, which is fast twice and slow forever.",
    pull: "move",
  },
  {
    who: "Long-tenured administrator",
    wants: "The thing to stay where it was.",
    breaks:
      "Serve only them and the system can never modernise, and it ossifies into a style guide of 2021.",
    pull: "still",
  },
  {
    who: "The next maintainer",
    wants: "To understand a decision without the person who made it.",
    breaks:
      "Serve only them and the system optimises for documentation over use — thorough, current, unadopted.",
    pull: "still",
  },
] as const;

/** Chapter 03 — the build, in dependency order. */
export const STEPS: Step[] = [
  {
    no: "01",
    title: "Count what already exists",
    body: "Every colour, size and spacing value in circulation across the five product files, collected and de-duplicated. The survivors became the primitive layer: 211 colour primitives on 11 families and 50 size primitives on a 2px grid.",
    explainer:
      "The primitive layer is deliberately opinionless — a hex with no idea where it will be used. That sounds like a missing decision and is the opposite: the moment a primitive carries intent, two roles that happen to share a value get welded together, and changing one changes the other. Every family got the identical 13-step ramp plus 4 alpha steps, so a designer reaching for a step in a family they have never used already knows what it will look like.",
    output: "261 primitives · 11 colour families on one ramp shape",
  },
  {
    no: "02",
    title: "Name the steps, not the numbers",
    body: "A second collection aliases the size primitives into named scales: spacing, borderRadius, borderWidth, iconSize, opacity and elevation. `borderRadius/2Xl` points at `_global-sizes/20px = 1-25rem`; it does not hold 20.",
    explainer:
      "This layer exists so the primitive set can stay small while the vocabulary stays expressive. When a product asked for more radius variety, the answer was another alias, not another primitive — the scale grew and the foundation did not. It also means a global change to what 'large radius' means is one edit, not a find-and-replace across every component that happened to use 20.",
    output: "68 aliased steps across 6 scales",
  },
  {
    no: "03",
    title: "Split brand from appearance — the decision the whole system rests on",
    body: "Two independent collections instead of one. `Theme` carries the brand-owned roles with a mode per brand (Blue, Orange). `Mode` carries what components actually bind to, with a mode per appearance (onLight, onDark). Neither knows about the other.",
    explainer:
      "The obvious approach is one collection with four modes — Blue-light, Blue-dark, Orange-light, Orange-dark — and it works right up to the third brand, at which point it is six modes, then eight, and every new role has to be authored in all of them. Keeping the axes independent means brand and appearance multiply at resolution time instead of at authoring time. Adding a third brand adds one mode to one collection; it does not touch the other 251 tokens and it does not touch a single component.",
    output: "2 collections · 2 modes each · resolved independently",
  },
  {
    no: "04",
    title: "Route only what the brand actually owns",
    body: "Of the 251 bindable tokens, 23 route through Theme and resolve to four values. The other 222 alias straight to a primitive and resolve to two. Status colour, greys, overlays and popups never touch the brand layer.",
    explainer:
      "A negative alert is red in both brands, and routing it through Theme would mean authoring the same red twice and inviting someone to make them different. So the brand surface is exactly 23 tokens wide, and that number is the honest answer to 'what does a rebrand cost' — not 251, not 'the whole system'. It also makes the review cheap: a brand change has 23 things to check.",
    output: "23 routed · 222 direct · 6 literal",
  },
  {
    no: "05",
    title: "Give components one binding and no values",
    body: "A component binds `interactive/background/primary/default` and nothing else. The two collections resolve it against brand and appearance at render, so one binding carries four values and the component file contains none of them.",
    explainer:
      "This is the whole point of the architecture and the only part a component author has to understand. It is also the test of whether the layers were drawn correctly: if a component ever needs to know which brand or which mode it is in, a role is missing and the fix belongs in the token layer, not in a variant. No component in the library takes a brand or mode prop.",
    output: "1 binding → 4 resolved values",
  },
  {
    no: "06",
    title: "Make the variant matrix an argument, not a product",
    body: "Button carries five axes — state, intent, semantics, type, size. The full cross-product is 1,792. The library ships 1,470. The 320-variant difference is the entire status range removed from the tertiary intent.",
    explainer:
      "A tertiary button is already the quietest affordance on the screen. Giving it a destructive treatment produces a control that reads as neither destructive nor actionable, so the combination was cut rather than drawn. Publishing the gap deliberately is what stops it being refilled by the next person who notices it missing — an unexplained hole in a matrix always gets filled eventually.",
    output: "1,470 of 1,792 · 320 removed on purpose",
  },
  {
    no: "07",
    title: "Ship the documentation as part of the component",
    body: "Six pages per component, in a fixed order: Introduction and anatomy, Variations, Usage guidelines, Props and specs, Accessibility, In context. A component is not published until all six exist.",
    explainer:
      "Documentation written after adoption describes the system people already worked around. Making the six pages a release gate means the awkward questions — what are the do-not cases, what is the keyboard contract — get asked while the component is still cheap to change. The template is itself a component, so the shape of the answer is fixed and only the content varies.",
    output: "6-page spec · enforced at publish",
  },
  {
    no: "08",
    title: "Let the system document its own state",
    body: "The library carries meta-components for its own governance: a frame header with a variant per artefact type, and a status badge with Version Number, In Progess, Published and Deprecated.",
    explainer:
      "A separate adoption tracker goes stale within a quarter because updating it is a second job. Putting the lifecycle on the artefact makes the file the source of truth, and makes a deprecation visible in the place someone is about to copy from rather than in a document they will not open.",
    output: "4 lifecycle states · on the artefact",
  },
];

/** Chapter 05 — what the audit of my own system turned up. */
export const FINDINGS: Finding[] = [
  {
    id: "theme-leak",
    headline: "8 of 46 brand roles still resolve to Blue in the Orange theme",
    detail:
      "surface/border/primary (×4), surface/icon/primary (×2) and surface/text/primary (×2) alias a Product/Blue primitive in both theme modes. Switch a product to Orange and those surfaces stay blue.",
    method:
      "Compared the alias target of every Theme row across both modes and flagged any Orange-mode alias whose path contains a different brand family. Eight rows, all in the surface group, none in interactive.",
    severity: "structural",
  },
  {
    id: "button-gaps",
    headline: "Two Button variants are missing, and both are Disabled · Tercery · Sm",
    detail:
      "Disabled/Tercery/Default/With leading Icon/Sm and Disabled/Tercery/White/With trailing Icon/Sm. Every other cell of the intended 1,470 is present.",
    method:
      "Built the full cross-product of the five variant axes, subtracted the published set, then subtracted the 320 deliberately-removed tertiary status cells. Two remained.",
    severity: "coverage",
  },
  {
    id: "icon-pair",
    headline: "One icon pair out of 1,454 is broken by an abbreviation",
    detail:
      "`bar-chart-horizontal-line` has no `-fill` twin; `bar-chart-h-fill` has no `-line` twin. They are the same icon under two names. `dice-1` and `info-custom` ship fill-only.",
    method:
      "Stripped the -line/-fill suffix off all 3,576 icon components and set-differenced the two base-name sets. 1,454 matched; the residue was four names.",
    severity: "naming",
  },
  {
    id: "spelling",
    headline: "Five misspellings are load-bearing",
    detail:
      "`Aleart` names 51 published tokens across three families. `Interective state`, `Secondery`, `Tercery` and `Netural` name variant axes and values on Button. All are wrong, all are in use, and renaming them detaches every instance in five products.",
    method:
      "Read the published names rather than the intended ones. They are reproduced verbatim throughout this page for the same reason.",
    severity: "naming",
  },
];

/** Chapter 06 — how it scales, and the measurement that settles it. */
export const SCALE = {
  wrongQuestion: "How many components does it have?",
  wrongWhy:
    "Component count measures how much was drawn, not how much was reused. A library and a system look identical on that axis.",
  rightQuestion:
    "Does each new product cost less to onboard than the one before it?",
  rightWhy:
    "Record the onboarding cost of every product in arrival order. A flat curve means a well-organised library — each team pays full price for the same shelf. A falling curve means a system: the work compounds because the answer to the fifth product's question was already settled by the third.",
  readings:
    "The curve itself is under NDA, along with adoption and velocity figures. What ships here is the measurement model, which is the part that transfers.",
};

export const HONEST = {
  headline: "What this page does not claim",
  points: [
    "No adoption, velocity or defect numbers. They are confidential, and an invented figure is worse than an empty column.",
    "No product screenshots. Every visual here is drawn from the token and component data itself.",
    "The counts are a snapshot. They were read from the published files and will drift as the system does — the generator is checked in so they can be re-read rather than re-typed.",
  ],
};
