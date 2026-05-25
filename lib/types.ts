export type ProjectCategory =
  | "Enterprise SaaS"
  | "Design System"
  | "Mobile App"
  | "Web App"
  | "Website";

export type ProjectAccess = "public" | "locked" | "external";

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface ProjectSection {
  heading: string;
  body: string;
}

/* ────────────────────────────────────────────────────────────
   Rich case study sections — all optional. A project can use
   any subset; the case study page renders only what's present.
   ─────────────────────────────────────────────────────────── */

export type PlaceholderKind =
  | "dashboard"
  | "form"
  | "list"
  | "mobile"
  | "flow"
  | "journey"
  | "chart"
  | "modal";

export interface ImageAsset {
  /** /projects/{slug}/gallery-01.webp etc. */
  src: string;
  alt: string;
  /** When true, overlays the REDACTED · NDA stamp + slight blur band */
  redacted?: boolean;
}

export interface GalleryItem {
  /** Stylized placeholder kind — abstract UI representation, NDA-safe */
  kind?: PlaceholderKind;
  /** Real image (or redacted real image). Takes precedence over `kind`. */
  image?: ImageAsset;
  /** Mono-type caption shown beneath. Keep terse: "01 / Review console" */
  caption: string;
  /** Optional expanded note, plain prose, beneath caption */
  note?: string;
  /** Span 1 (default) or 2 columns on a 2-up grid */
  span?: 1 | 2;
}

export interface Scenario {
  /** Persona / role this scenario centers on */
  who: string;
  /** Trigger — the moment the user enters the system */
  when: string;
  /** What happened on the old / current system */
  before: string;
  /** What the new design enables */
  after: string;
}

export interface BeforeAfter {
  before: {
    title: string;
    body: string;
    placeholder?: PlaceholderKind;
    image?: ImageAsset;
  };
  after: {
    title: string;
    body: string;
    placeholder?: PlaceholderKind;
    image?: ImageAsset;
  };
}

export interface ProcessPhase {
  /** Phase label e.g. "Discovery", "Define" */
  phase: string;
  /** Short duration string e.g. "3 weeks" */
  duration: string;
  /** What happened in this phase */
  body: string;
  /** Specific outputs e.g. ["12 user interviews", "2 journey maps"] */
  artifacts?: string[];
}

export interface Quote {
  text: string;
  /** Attribution e.g. "Senior IT Admin · Fortune 500 financial services" */
  source: string;
}

/* ────────────────────────────────────────────────────────────
   Rich case-study sections — for "interview-grade" pages.
   ─────────────────────────────────────────────────────────── */

/** A UX law / psychological principle applied in the project */
export interface UXLawApplied {
  /** "Hick's Law", "Fitts's Law", "Miller's Law", "Aesthetic-Usability Effect" etc. */
  law: string;
  /** What the law says, in one line */
  principle: string;
  /** How it shaped the design */
  applied: string;
}

/** A research method used in the project */
export interface ResearchMethod {
  /** "Stakeholder interview", "Diary study", "Cognitive walkthrough" */
  method: string;
  /** Sample / scope: "12 IT admins, 4 weeks" */
  sample: string;
  /** What it surfaced */
  finding: string;
}

/** A design decision with rationale + trade-off (richer than the existing
    decisions field — kept separate to avoid breaking the simpler schema). */
export interface DesignDecision {
  /** "Risk signals beside the row, not on a separate screen" */
  decision: string;
  /** "Why this won": evidence-backed rationale */
  rationale: string;
  /** What we gave up: "Paid the UI density tax to avoid context-switching" */
  tradeoff?: string;
  /** Type of decision — informs visual treatment */
  kind?: "visual" | "functional" | "system";
}

/** A real screen, embedded from Figma or an image. */
export interface CaseStudyScreen {
  /** Display caption: "01 / Review console" */
  caption: string;
  /** Optional plain-prose note */
  note?: string;
  /** Figma share/embed URL — when present, renders as iframe.
      Format: full Figma file URL, the embed query is added by the renderer. */
  figmaUrl?: string;
  /** Or a static image (uploaded to /public) */
  image?: { src: string; alt: string; redacted?: boolean };
  /** Or a placeholder shape if neither figma nor image is available */
  placeholder?: PlaceholderKind;
  /** Span 1 (default) or 2 columns on a 2-up grid */
  span?: 1 | 2;
}

/** Which surface this project lives on.
 *    case    — gets a full /cases/[slug] detailed page; only ~3 of these exist.
 *    work    — appears on /work as a black tile with hover color; carousel detail.
 *    gallery — appears on /gallery as an infinite-scroll tile; lighter treatment.
 */
export type ProjectTrack = "case" | "work" | "gallery";

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  confidential: boolean;
  access: ProjectAccess;
  year: string;
  role: string;
  team?: string;
  summary?: string;
  problem?: string;
  outcomes?: ProjectMetric[];
  publicSections?: ProjectSection[];
  detailedSections?: ProjectSection[];
  tags: string[];
  order: number;

  /** Which surface this lives on. Default "work" for back-compat. */
  track?: ProjectTrack;
  /** Cover image (or asset path) for /work and /gallery tiles. */
  cover?: { src: string; alt: string };
  /** Background colour the /work tile flips the page to on hover (bishal.cc pattern). */
  hoverColor?: string;
  /** Text colour when hover-color is active (use #0a0a0a or #f0eee8 typically). */
  hoverInk?: string;
  /** A short lightweight illustration / glyph shown only on hover.
      Can be an emoji, a single character, or short string ("01", "AD", "⚙"). */
  hoverIllustration?: string;

  /** Show in featured-list on home page */
  featured?: boolean;
  /** External design link (Figma, etc.) — used for `access: "external"` archive entries */
  figmaUrl?: string;

  /* Optional rich sections (existing — keep compatible) */
  scenarios?: Scenario[];
  gallery?: GalleryItem[];
  beforeAfter?: BeforeAfter;
  process?: ProcessPhase[];
  quotes?: Quote[];
  decisions?: { title: string; body: string }[];

  /* ──────────────────────────────────────────────────────────
     Rich case-study sections (interview-grade pages)
     ──────────────────────────────────────────────────────── */
  /** One-paragraph reading-time hint: "~ 4 min read" */
  readingTime?: string;
  /** UX laws / psychological principles applied */
  uxLaws?: UXLawApplied[];
  /** Research methods + findings */
  research?: ResearchMethod[];
  /** Design decisions with rationale + trade-off (richer than `decisions`) */
  designDecisions?: DesignDecision[];
  /** Visual decisions specifically — colour, type, layout, motion */
  visualDecisions?: DesignDecision[];
  /** Real Figma screens / image embeds for the gallery */
  screens?: CaseStudyScreen[];
}
