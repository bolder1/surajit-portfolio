/**
 * Home-page sections — interview-friendly resume-portfolio.
 * Fact-checked against Surajit Dutta's CV (Jul 2022 – present).
 *
 * Information architecture (top to bottom, fast-scan order):
 *   01  Hero               — name, role, status, TL;DR, hire-me CTA, four stats
 *   02  What I do          — Domains / Strengths / Tools, scannable
 *   03  Selected Work      — five projects with role + scope (outcomes "on request")
 *   04  Experience         — three roles (miniOrange, Impero IT, Fortmindz)
 *   05  How I work         — three principles + compact 8-step process row
 *   06  Education          — B.Tech IT + Diploma E&T
 *   07  Beyond work        — short personal note
 *   08  Contact            — email / phone / LinkedIn / Resume PDF
 *
 * Numbers and claims are bound to the CV. Anything not on the CV is
 * either omitted or labelled "shared on request".
 */

import Link from "next/link";
import { getFeaturedProjects } from "@/lib/projects";
import { Button, StatusPill, Tag } from "./Button";

/* ──────────────────────────────────────────────────────────
   01  HERO
   Fact-bound: 3+ years, four platforms (IAM/PAM/IGA/UEM),
   5-day AD prototype + ~70% cycle compression, currently at
   miniOrange.
   ─────────────────────────────────────────────────────── */
export function HomeHero() {
  return (
    <section
      id="hero"
      className="border-b border-[var(--rule)] scroll-mt-20"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-page mx-auto px-6 md:px-10 py-14 md:py-20">
        {/* Status row — leads with availability */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pb-6 border-b border-[var(--rule-soft)] mono text-[var(--ink)]">
          <span className="inline-flex items-center gap-2">
            <span className="diamond" aria-hidden />
            <span className="text-[var(--accent)]">OPEN TO ROLES</span>
          </span>
          <Sep />
          <span>PRODUCT DESIGNER</span>
          <Sep />
          <span>FULL-TIME · CONTRACT</span>
          <Sep />
          <span>PUNE · IST · ASYNC US</span>
          <span className="ml-auto hidden md:inline text-[var(--muted)]">
            REPLY WITHIN 24H
          </span>
        </div>

        {/* Headline + supporting paragraph */}
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 pt-10 md:pt-14 items-end">
          <div className="md:col-span-8">
            <p className="mono mb-5 text-[var(--accent)]">▸ § 01 · LEAD</p>
            <h2
              id="hero-heading"
              className="display text-[12vw] md:text-[8vw] lg:text-[120px] leading-[0.88] tracking-tightest"
            >
              I design product flows for{" "}
              <span className="display-italic text-[var(--accent)]">
                IT and security teams
              </span>
              .
            </h2>
          </div>
          <div className="md:col-span-4">
            <p className="body-prose drop-cap">
              Three-plus years on enterprise SaaS &mdash; currently at
              miniOrange, leading end-to-end design across IAM, PAM, IGA and
              UEM. I orchestrate Claude, Figma Make AI, Cursor, and a
              widening AI stack to compress discovery-to-handoff cycles from
              weeks to days &mdash; without trading taste for speed.
              Receipts in &sect; 06.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/hire" variant="primary">
                Hire me
              </Button>
              <Button
                href="/resume.pdf"
                download="Surajit-Dutta-CV.pdf"
                variant="outlined"
                iconRight={<span aria-hidden>↓</span>}
              >
                Download CV
              </Button>
            </div>
          </div>
        </div>

        {/* Stats strip — defensible CV-bound numbers only */}
        <div className="mt-14 md:mt-20 grid grid-cols-2 md:grid-cols-4 border-t-2 border-[var(--rule)] divide-x divide-[var(--rule)]">
          {STATS.map((s) => (
            <div key={s.label} className="px-4 md:px-6 py-6">
              <div className="figure display text-[40px] md:text-[60px] lg:text-[76px] leading-[0.95] text-[var(--accent)]">
                {s.value}
              </div>
              <div className="mono mt-2 text-[var(--ink-soft)]">{s.label}</div>
              <div className="text-[14px] mt-1 text-[var(--muted)] italic">
                {s.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* CV-bound stats only. No invented numbers. */
const STATS = [
  { value: "3+", label: "YEARS", note: "designing enterprise SaaS" },
  { value: "4", label: "PLATFORMS", note: "IAM · PAM · IGA · UEM" },
  { value: "5 days", label: "0→PROTOTYPE", note: "AD console, Figma Make AI" },
  { value: "~70%", label: "CYCLE COMPRESSION", note: "discovery to handoff" },
];

/* ──────────────────────────────────────────────────────────
   02  WHAT I DO — straight from CV's Skills block
   ─────────────────────────────────────────────────────── */
const COLS = [
  {
    label: "DOMAINS",
    title: "Where I work",
    items: [
      "Identity & Access (IAM)",
      "Privileged Access (PAM)",
      "Identity Governance (IGA)",
      "Endpoint Management (UEM)",
      "Cybersecurity admin",
      "Mobile (B2C)",
    ],
  },
  {
    label: "STRENGTHS",
    title: "How I help",
    items: [
      "AI-orchestrated design (5-day prototypes)",
      "0-to-1 product discovery",
      "Design systems at scale",
      "Metrics fluency (CVR · TTV · retention · LTV · CAC)",
      "Stakeholder interviews · IA",
      "Design QA · handoff",
    ],
  },
  {
    label: "TOOLS",
    title: "What I use",
    items: [
      "Figma · FigJam · Figma Make AI",
      "Claude · ChatGPT · Cursor · Antigravity",
      "Imagen · Higgsfield · Freepik · Sora · Flow",
      "NotebookLM · ElevenLabs · Cowork",
      "Variables · tokens · component libraries",
      "Notion · Jira · basic HTML/CSS",
    ],
  },
];

export function HomeWhatIDo() {
  return (
    <section
      id="what-i-do"
      className="border-b border-[var(--rule)] scroll-mt-20 bg-[var(--paper-2)]"
      aria-labelledby="what-i-do-heading"
    >
      <div className="max-w-page mx-auto px-6 md:px-10 py-14 md:py-20">
        <div className="flex items-end justify-between mb-10 md:mb-12 gap-6">
          <div>
            <p className="mono mb-3 text-[var(--accent)]">▸ § 02 · CAPABILITIES</p>
            <h2
              id="what-i-do-heading"
              className="display text-[10vw] md:text-[5.4vw] lg:text-[72px] tracking-tightest leading-[0.95]"
            >
              What I bring,{" "}
              <span className="display-italic">in three columns</span>.
            </h2>
          </div>
          <p className="hidden md:block max-w-xs text-right body-prose-sm">
            Lifted directly from the CV. Read across for the answer most
            hiring managers ask first.
          </p>
        </div>

        <div className="grid md:grid-cols-3 border-t-2 border-[var(--rule)]">
          {COLS.map((c, idx) => (
            <div
              key={c.label}
              className={`py-7 md:py-9 ${
                idx > 0
                  ? "md:border-l border-[var(--rule)] md:pl-8"
                  : "md:pr-8"
              }`}
            >
              <div className="flex items-baseline justify-between mb-5">
                <span className="mono text-[var(--accent)]">{c.label}</span>
                <span className="mono text-[var(--muted)]">№ 0{idx + 1}</span>
              </div>
              <h3 className="display-italic text-[28px] md:text-[32px] mb-5 text-[var(--ink)]">
                {c.title}
              </h3>
              <ul className="space-y-2.5">
                {c.items.map((it) => (
                  <li
                    key={it}
                    className="flex items-baseline gap-3 body-prose-sm"
                  >
                    <span className="mono shrink-0 text-[var(--accent)]">→</span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   03  SELECTED WORK
   Each project carries verifiable problem framing + scope.
   Specific outcome metrics that aren't on the CV are
   replaced with "shared on request" notes.
   ─────────────────────────────────────────────────────── */
export function HomeSelectedWork() {
  const projects = getFeaturedProjects().slice(0, 5);

  return (
    <section
      id="work"
      className="border-b border-[var(--rule)] scroll-mt-20"
      aria-labelledby="work-heading"
    >
      <div className="max-w-page mx-auto px-6 md:px-10 py-14 md:py-20">
        <div className="flex items-end justify-between mb-10 md:mb-12 gap-6">
          <div>
            <p className="mono mb-3 text-[var(--accent)]">▸ § 03 · SELECTED WORK</p>
            <h2
              id="work-heading"
              className="display text-[12vw] md:text-[7vw] lg:text-[96px] tracking-tightest leading-[0.92]"
            >
              Five projects, told{" "}
              <span className="display-italic text-[var(--accent)]">
                in the time it takes to scan
              </span>
              .
            </h2>
          </div>
          <p className="hidden md:block max-w-xs text-right body-prose-sm">
            Most enterprise work at miniOrange is under NDA. Public summaries
            below; full case studies, screens, and outcome metrics shared on
            request.
          </p>
        </div>

        <ul className="border-t-2 border-[var(--rule)]">
          {projects.map((p, i) => (
            <li
              key={p.slug}
              className="border-b border-[var(--rule-soft)] py-7 md:py-9"
            >
              <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-baseline">
                {/* Index */}
                <div className="md:col-span-1 mono text-[var(--muted)]">
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Title + meta */}
                <div className="md:col-span-5">
                  <h3 className="display text-[32px] md:text-[40px] lg:text-[48px] tracking-tightest leading-[0.95]">
                    {p.title}
                    {p.confidential && (
                      <span className="display-italic text-[var(--muted)] text-[18px] ml-3 align-baseline">
                        (NDA)
                      </span>
                    )}
                  </h3>
                  <p className="body-prose mt-1.5">{p.subtitle}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 mono text-[var(--muted)]">
                    <span>{p.year}</span>
                    <span aria-hidden>·</span>
                    <span>{p.role}</span>
                  </div>
                </div>

                {/* Problem one-liner */}
                <div className="md:col-span-3">
                  <p className="mono mb-1.5 text-[var(--accent)]">
                    THE PROBLEM
                  </p>
                  <p className="body-prose-sm">
                    {(p.problem ??
                      "Confidential — full brief shared on request.")
                      .split(".")
                      .filter(Boolean)[0] + "."}
                  </p>
                </div>

                {/* Scope, not invented metrics */}
                <div className="md:col-span-3">
                  <p className="mono mb-1.5 text-[var(--accent)]">SCOPE</p>
                  <p className="body-prose-sm">
                    End-to-end product design — discovery, IA, flows,
                    high-fidelity UI, design QA.{" "}
                    <span className="italic text-[var(--muted)]">
                      Outcome metrics shared in full case study.
                    </span>
                  </p>
                </div>
              </div>

              {/* Tags + Read CTA */}
              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2 mono text-[var(--muted)]">
                  {p.tags.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="border border-[var(--rule-soft)] px-2 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/work/${p.slug}`}
                  className="mono link inline-flex items-center gap-2 shrink-0 min-h-[44px]"
                  aria-label={`Read the case study for ${p.title}`}
                >
                  READ THE CASE STUDY <span aria-hidden>→</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
          <Link href="/work" className="mono link">
            SEE THE FULL ARCHIVE →
          </Link>
          <a href="#contact" className="mono link text-[var(--accent)]">
            HAVE A PROJECT IN MIND? LET&rsquo;S TALK →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   04  EXPERIENCE — straight from CV.
   Three roles, real dates, real bullets. No invented seniority.
   ─────────────────────────────────────────────────────── */
const ROLES = [
  {
    period: "Jul 2024 — Present",
    role: "Product Designer",
    place: "miniOrange",
    location: "Pune, IN",
    bullets: [
      "Lead end-to-end product design for enterprise identity and security platforms — Active Directory, PAM, IGA, UEM — delivering scalable admin experiences for IT and security teams in compliance-driven environments.",
      "Designed and shipped a production-level cross-functional Active Directory prototype in five business days by orchestrating Figma Make AI to rapidly generate, iterate, and refine UI flows ready for engineering handoff — compressing a typical three-week design cycle by ~70%.",
      "Built and maintain a scalable design system using atomic components, variants, and Figma variables across multiple enterprise products — standardising UI patterns and improving design + dev velocity across teams.",
      "Drive 0-to-1 product discovery through stakeholder interviews, competitive research, and translation of insights into clear product flows, interaction models, and high-fidelity designs aligned with business and technical constraints.",
      "Operationalise AI-augmented design workflows — using Claude, Figma AI, and prompt-driven exploration for rapid ideation, microcopy, edge-case enumeration, and design QA — reducing repetitive work and freeing time for higher-leverage decisions.",
      "Partner with engineering and product managers on early feasibility alignment and design QA, ensuring high-quality releases without late-stage rework.",
    ],
    skills: ["IAM", "PAM", "IGA", "UEM", "Design Systems", "AI workflows"],
  },
  {
    period: "Jun 2023 — Jul 2024",
    role: "UX / UI Designer",
    place: "Impero IT",
    location: "India",
    bullets: [
      "Designed digital products across multiple domains — mobile apps for food delivery, healthcare, and events, plus web platforms for social media and admin dashboards — covering the full lifecycle from research and IA through high-fidelity UI.",
      "Collaborated with development, QA, and management teams to align project goals with engineering constraints; managed time and prioritisation to deliver consistently high-quality releases.",
      "Standardised component libraries and interaction patterns across projects, reducing rework and improving handoff clarity for engineering teams.",
    ],
    skills: ["Mobile (B2C)", "Web", "Component libraries", "Cross-functional"],
  },
  {
    period: "Jul 2022 — May 2023",
    role: "UX / UI Designer",
    place: "Fortmindz",
    location: "Kolkata, IN",
    bullets: [
      "Redesigned websites and applications to lift user engagement and reduce bounce rates; optimised e-commerce checkout flows and product pages to drive higher conversions.",
      "Partnered with developers to ship user-friendly interfaces and streamline workflows for on-time project delivery.",
    ],
    skills: ["Web redesign", "E-commerce", "Conversion"],
  },
];

export function HomeExperience() {
  return (
    <section
      id="experience"
      className="border-b border-[var(--rule)] scroll-mt-20 bg-[var(--paper-2)]"
      aria-labelledby="experience-heading"
    >
      <div className="max-w-page mx-auto px-6 md:px-10 py-14 md:py-20">
        <div className="flex items-end justify-between mb-10 md:mb-14 gap-6">
          <div>
            <p className="mono mb-3 text-[var(--accent)]">▸ § 04 · EXPERIENCE</p>
            <h2
              id="experience-heading"
              className="display text-[10vw] md:text-[5.4vw] lg:text-[72px] tracking-tightest leading-[0.95]"
            >
              Three roles,{" "}
              <span className="display-italic text-[var(--accent)]">
                one trajectory toward enterprise
              </span>
              .
            </h2>
          </div>
          <a
            href="/resume.pdf"
            className="hidden md:inline-flex items-center gap-2 mono link shrink-0"
          >
            DOWNLOAD AS PDF ↓
          </a>
        </div>

        <ol className="border-t-2 border-[var(--rule)]">
          {ROLES.map((r, i) => (
            <li
              key={r.role + r.period}
              className="border-b border-[var(--rule-soft)] py-7 md:py-9"
            >
              <div className="grid md:grid-cols-12 gap-6 md:gap-10">
                <div className="md:col-span-3">
                  <div className="mono text-[var(--accent)]">{r.period}</div>
                  <div className="display-italic text-[18px] mt-1.5 text-[var(--ink)]">
                    {r.location}
                  </div>
                </div>
                <div className="md:col-span-4">
                  <h3 className="display text-[26px] md:text-[32px] tracking-tightest leading-[1.05]">
                    {r.role}
                  </h3>
                  <p className="body-prose-sm mt-1.5 text-[var(--ink)]">
                    {r.place}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 mono text-[var(--muted)]">
                    {r.skills.map((s) => (
                      <span
                        key={s}
                        className="border border-[var(--rule-soft)] px-2 py-0.5"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <ul className="md:col-span-5 space-y-3">
                  {r.bullets.map((b) => (
                    <li key={b} className="body-prose-sm flex gap-3">
                      <span aria-hidden className="diamond mt-2 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mono mt-6 text-[var(--muted)]">
                ROLE № {String(ROLES.length - i).padStart(2, "0")} OF{" "}
                {String(ROLES.length).padStart(2, "0")}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   05  HOW I WORK
   Three principles + the 8-step process compressed.
   ─────────────────────────────────────────────────────── */
const PRINCIPLES = [
  {
    n: "i",
    title: "Make complex feel calm",
    body: "Right thing on screen at the right moment. Everything else, off.",
  },
  {
    n: "ii",
    title: "Systems, then surfaces",
    body: "Tokens, components, patterns first. The system pays back on year two.",
  },
  {
    n: "iii",
    title: "Compress with AI, polish with judgment",
    body:
      "Use AI to spin variants and write edge cases. Reserve human time for the calls that need taste.",
  },
];

const PHASES = [
  { num: "01", label: "Desk", filled: false },
  { num: "02", label: "Field", filled: false },
  { num: "03", label: "Synthesis", filled: true },
  { num: "04", label: "Draft", filled: false },
  { num: "05", label: "System", filled: true },
  { num: "06", label: "Motion", filled: false },
  { num: "07", label: "Hand-off", filled: true },
  { num: "08", label: "Talk", filled: true },
];

export function HomeHowIWork() {
  return (
    <section
      id="how-i-work"
      className="border-b border-[var(--rule)] scroll-mt-20"
      aria-labelledby="how-i-work-heading"
    >
      <div className="max-w-page mx-auto px-6 md:px-10 py-14 md:py-20">
        <div className="flex items-end justify-between mb-10 md:mb-14 gap-6">
          <div>
            <p className="mono mb-3 text-[var(--accent)]">▸ § 05 · APPROACH</p>
            <h2
              id="how-i-work-heading"
              className="display text-[10vw] md:text-[5.4vw] lg:text-[72px] tracking-tightest leading-[0.95]"
            >
              How I work,{" "}
              <span className="display-italic">in three rules</span>.
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-[var(--rule)] border border-[var(--rule)]">
          {PRINCIPLES.map((p) => (
            <div
              key={p.n}
              className="bg-[var(--paper)] p-6 md:p-8 flex flex-col gap-3"
            >
              <div className="display-italic text-[28px] text-[var(--accent)]">
                {p.n}.
              </div>
              <h3 className="display text-[22px] md:text-[26px] tracking-tightest">
                {p.title}
              </h3>
              <p className="body-prose-sm">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 md:mt-14">
          <div className="flex items-baseline justify-between mb-4">
            <span className="mono text-[var(--accent)]">
              ▸ THE LOOP · VIII PHASES
            </span>
            <Link href="/about#process" className="mono link hidden md:inline">
              READ THE LONG VERSION →
            </Link>
          </div>
          <ol className="grid grid-cols-4 md:grid-cols-8 border-t-2 border-[var(--rule)]">
            {PHASES.map((p) => (
              <li
                key={p.num}
                className="border-b border-r border-[var(--rule-soft)] last:border-r-0 py-5 px-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    aria-hidden
                    className={p.filled ? "diamond" : "diamond-open"}
                  />
                  <span className="mono text-[var(--accent)]">{p.num}</span>
                </div>
                <div className="display-italic text-[17px] md:text-[18px] leading-[1.1]">
                  {p.label}
                </div>
              </li>
            ))}
          </ol>
          <p className="mono mt-3 text-[var(--muted)]">
            ◇ DIVERGE &middot; ◆ CONVERGE &middot; ↺ MOST PHASES LOOP BACK TO
            FIELDWORK
          </p>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   06  AI-NATIVE TOOLKIT
   The biggest competitive line in 2026: this designer
   orchestrates a working AI stack. Three sub-modules:
     a) The manifesto — positioning ("I orchestrate, models
        execute") so a recruiter doesn't read it as cargo cult.
     b) The toolkit — taxonomy of tools by function with a
        one-line "how I use it" per tool. Daily / Weekly /
        Exploring tags so claims stay defensible.
     c) The receipts — what these tools actually shipped.
   ─────────────────────────────────────────────────────── */
const TOOLKIT = [
  {
    category: "REASONING & WRITING",
    note: "the thinking partner layer",
    tools: [
      { name: "Claude", maker: "Anthropic", cadence: "DAILY",
        use: "JTBD framing · design critique · edge-case enumeration · microcopy · this whole portfolio was built with Claude Code" },
      { name: "ChatGPT", maker: "OpenAI", cadence: "DAILY",
        use: "alt-copy · structured summaries · second-opinion checks on specs" },
      { name: "Cowork", maker: "Anthropic", cadence: "WEEKLY",
        use: "skill orchestration — running brand-voice, impeccable, design-taste skills as repeatable workflows" },
    ],
  },
  {
    category: "DESIGN GENERATION",
    note: "the make-it-real layer",
    tools: [
      { name: "Figma Make AI", maker: "Figma", cadence: "DAILY",
        use: "production prototypes — 5-day Active Directory console, multi-frame flows ready for engineering handoff" },
      { name: "Cursor", maker: "Cursor", cadence: "DAILY",
        use: "design tokens · prototype scaffolding · spec refactors paired with Claude" },
      { name: "Antigravity", maker: "Google", cadence: "EXPLORING",
        use: "agentic IDE — multi-file design + code orchestration for system contributions" },
    ],
  },
  {
    category: "VIBE CODING",
    note: "ship-a-page-from-a-vibe — AI builds the artifact, I direct the taste",
    tools: [
      { name: "Claude Design", maker: "Anthropic", cadence: "DAILY",
        use: "HTML/CSS/JS prototype generation from a brief — produced the Internal Banking Tool's full surface ready for handoff" },
      { name: "Claude Code", maker: "Anthropic", cadence: "DAILY",
        use: "engineering pair — wrote this portfolio end-to-end (Next.js 15, React 19, Motion); refactors, audits, CI workflows" },
      { name: "Figma Make", maker: "Figma", cadence: "DAILY",
        use: "live click-through prototypes for stakeholder review — DPDP, Sign-up Customizer, Patient Portal, AD V2" },
      { name: "Lovable", maker: "Lovable", cadence: "WEEKLY",
        use: "ship-a-MVP-in-an-afternoon for landing pages and lightweight tools" },
      { name: "Bolt", maker: "StackBlitz", cadence: "WEEKLY",
        use: "rapid full-stack scaffolds when a prototype needs a real backend behind it" },
      { name: "Replit", maker: "Replit", cadence: "EXPLORING",
        use: "agent-driven scaffolding — prototype-to-deploy without leaving the browser" },
    ],
  },
  {
    category: "IMAGE",
    note: "moodboarding to brand assets",
    tools: [
      { name: "Imagen 3", maker: "Google", cadence: "WEEKLY",
        use: "moodboards · hero illustrations · alt-explorations during 0-to-1 discovery" },
      { name: "Freepik (Mystic · Pikaso · Spaces)", maker: "Freepik", cadence: "WEEKLY",
        use: "texture · brand assets · composite work for case-study covers" },
      { name: "Higgsfield", maker: "Higgsfield AI", cadence: "EXPLORING",
        use: "cinematic stills with motion intent baked in — marketing studio compositions" },
    ],
  },
  {
    category: "VIDEO",
    note: "for product films & motion specs",
    tools: [
      { name: "Sora", maker: "OpenAI", cadence: "EXPLORING",
        use: "animated process diagrams · micro-interactions for engineering handoff" },
      { name: "Flow", maker: "Google DeepMind", cadence: "EXPLORING",
        use: "director-style scene composition for product walkthroughs" },
      { name: "Higgsfield Cinema", maker: "Higgsfield AI", cadence: "EXPLORING",
        use: "cinematic motion control for hero reels" },
    ],
  },
  {
    category: "AUDIO",
    note: "the narration layer",
    tools: [
      { name: "ElevenLabs", maker: "ElevenLabs", cadence: "WEEKLY",
        use: "voiceover prototypes · narrated walkthroughs · onboarding scripts" },
    ],
  },
  {
    category: "KNOWLEDGE",
    note: "the research layer",
    tools: [
      { name: "NotebookLM", maker: "Google", cadence: "WEEKLY",
        use: "interview synthesis · competitive research · JTBD distillation across multi-source corpora" },
    ],
  },
];

const SKILLS_RUN = [
  {
    name: "impeccable",
    by: "Anthropic",
    use: "Design polish + critique. Used to redesign two illustrations on this portfolio under the bolder rules.",
  },
  {
    name: "brand-voice",
    by: "Anthropic",
    use: "Discover, generate, and enforce brand voice. Used to set the editorial tone that runs through this site.",
  },
  {
    name: "figma-use + figma-generate-design",
    by: "Figma + Anthropic",
    use: "Push designed pages from code into Figma using the Plugin API. Pushed three frames into the file you're reading from.",
  },
  {
    name: "design-taste-frontend",
    by: "Anthropic",
    use: "UI/UX engineering rules. Enforces metric-based typography and component architecture.",
  },
  {
    name: "high-end-visual-design",
    by: "Anthropic",
    use: "Premium frontend design system. Defines the spacing, shadows, and animations that make a website feel expensive.",
  },
  {
    name: "vercel-react-best-practices",
    by: "Vercel",
    use: "React + Next.js performance and composition patterns. Applied to keep this site lean and fast.",
  },
];

const RECEIPTS = [
  {
    title: "Active Directory — Five-Day Prototype",
    where: "miniOrange, 2024",
    body:
      "Production-level cross-functional prototype shipped in 5 business days using Figma Make AI + Claude. ~70% cycle compression vs. the typical three-week design path.",
  },
  {
    title: "This portfolio",
    where: "Built with Claude Code, 2026",
    body:
      "Next.js 15, React 19, Motion. Twelve hand-coded SVG illustrations, an editorial design system in CSS variables, three Figma frames pushed via the Plugin API. Built end-to-end with Claude Code.",
  },
  {
    title: "Brand voice + design system",
    where: "Folio brand · 2026",
    body:
      "PRODUCT.md and DESIGN.md generated via the Anthropic brand-voice skill. Tokens scoped, typography ratios committed, principles documented — the system the screens compose against.",
  },
];

export function HomeAIToolkit() {
  return (
    <section
      id="ai-toolkit"
      className="border-b border-[var(--rule)] scroll-mt-20 bg-[var(--paper-2)]"
      aria-labelledby="ai-toolkit-heading"
    >
      <div className="max-w-page mx-auto px-6 md:px-10 py-14 md:py-20">
        {/* Header + manifesto */}
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-16">
          <div className="md:col-span-7">
            <p className="mono mb-3 text-[var(--accent)]">
              ▸ § 06 · AI-NATIVE WORKFLOW
            </p>
            <h2
              id="ai-toolkit-heading"
              className="display text-[10vw] md:text-[6vw] lg:text-[88px] tracking-tightest leading-[0.92]"
            >
              I orchestrate.{" "}
              <span className="display-italic text-[var(--accent)]">
                The models execute
              </span>
              .
            </h2>
          </div>
          <div className="md:col-span-5 md:pt-4">
            <p className="body-prose drop-cap">
              AI doesn&rsquo;t make me a designer. It lets me be the designer
              who ships in days what used to take weeks &mdash; same taste,
              more reps. The judgment about <em>what</em> to ship still has to
              be human; the work to make it real is where AI earns its keep.
              Vibe-coding tools (Claude Design, Figma Make, Lovable, Bolt)
              turn a brief into a clickable artifact in an afternoon.
            </p>
            <p className="body-prose-sm mt-4 text-[var(--ink-soft)]">
              Daily &middot; Weekly &middot; Exploring labels keep the claims
              defensible. Ask in an interview &mdash; I&rsquo;ll show
              receipts.
            </p>
          </div>
        </div>

        {/* Toolkit grid */}
        <div className="border-t-2 border-[var(--rule)]">
          {TOOLKIT.map((cat, ci) => (
            <div
              key={cat.category}
              className="grid md:grid-cols-12 gap-6 md:gap-10 py-7 md:py-9 border-b border-[var(--rule-soft)]"
            >
              <div className="md:col-span-3">
                <div className="mono text-[var(--accent)] mb-2">
                  {String(ci + 1).padStart(2, "0")} · {cat.category}
                </div>
                <p className="display-italic text-[18px] md:text-[20px] text-[var(--ink-soft)]">
                  {cat.note}
                </p>
              </div>
              <ul className="md:col-span-9 space-y-4 md:space-y-5">
                {cat.tools.map((t) => (
                  <li
                    key={t.name}
                    className="grid md:grid-cols-12 gap-3 md:gap-6 items-baseline"
                  >
                    <div className="md:col-span-4">
                      <div className="display text-[22px] md:text-[26px] tracking-tightest leading-tight">
                        {t.name}
                      </div>
                      <div className="mono text-[var(--muted)] mt-1">
                        BY {t.maker.toUpperCase()}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <CadenceBadge cadence={t.cadence} />
                    </div>
                    <div className="md:col-span-6 body-prose-sm">{t.use}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Skills run — concrete orchestration proof */}
        <div className="mt-14 md:mt-20">
          <div className="flex items-baseline justify-between mb-8">
            <h3 className="display text-[28px] md:text-[36px] tracking-tightest">
              Skills I&rsquo;ve run end-to-end{" "}
              <span className="display-italic text-[var(--accent)]">
                in production work
              </span>
              .
            </h3>
            <span className="mono text-[var(--muted)] hidden md:inline">
              ↑ ORCHESTRATED, NOT ONE-OFF
            </span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--rule)] border border-[var(--rule)]">
            {SKILLS_RUN.map((s) => (
              <div
                key={s.name}
                className="bg-[var(--paper)] p-5 md:p-6 flex flex-col gap-2"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="mono text-[var(--accent)]">
                    /{s.name}
                  </span>
                  <span className="mono text-[var(--muted)] text-[10px]">
                    {s.by.toUpperCase()}
                  </span>
                </div>
                <p className="body-prose-sm">{s.use}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Receipts — actual outputs */}
        <div className="mt-14 md:mt-20">
          <div className="flex items-baseline justify-between mb-8">
            <h3 className="display text-[28px] md:text-[36px] tracking-tightest">
              The receipts.
            </h3>
            <span className="mono text-[var(--muted)] hidden md:inline">
              WHAT THE STACK ACTUALLY SHIPPED
            </span>
          </div>
          <ol className="border-t-2 border-[var(--rule)]">
            {RECEIPTS.map((r, i) => (
              <li
                key={r.title}
                className="grid md:grid-cols-12 gap-6 md:gap-10 border-b border-[var(--rule-soft)] py-5 md:py-7"
              >
                <div className="md:col-span-1 mono text-[var(--muted)]">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="md:col-span-4">
                  <div className="display text-[22px] md:text-[26px] tracking-tightest leading-[1.05]">
                    {r.title}
                  </div>
                  <div className="mono text-[var(--accent)] mt-1.5">
                    {r.where}
                  </div>
                </div>
                <p className="md:col-span-7 body-prose-sm">{r.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function CadenceBadge({ cadence }: { cadence: string }) {
  const styleMap: Record<string, string> = {
    DAILY: "bg-[var(--accent)] !text-white border-[var(--accent)]",
    WEEKLY: "border-[var(--ink)] text-[var(--ink)]",
    EXPLORING: "border-[var(--rule)] text-[var(--muted)] italic",
  };
  return (
    <span
      className={`inline-flex items-center mono text-[10px] tracking-widest uppercase border px-2 py-1 ${
        styleMap[cadence] ?? styleMap.EXPLORING
      }`}
    >
      {cadence}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────
   07  EDUCATION — from CV.
   ─────────────────────────────────────────────────────── */
const EDUCATION = [
  {
    period: "2019 — 2022",
    qual: "B.Tech, Information Technology",
    place: "Netaji Subhash Engineering College",
    score: "CGPA 8.8 / 10",
  },
  {
    period: "2016 — 2018",
    qual: "Diploma, Electronics & Telecommunications Engineering",
    place: "Purulia Polytechnic",
    score: "CGPA 7.2 / 10",
  },
];

export function HomeEducation() {
  return (
    <section
      id="education"
      className="border-b border-[var(--rule)] scroll-mt-20 bg-[var(--paper-2)]"
      aria-labelledby="education-heading"
    >
      <div className="max-w-page mx-auto px-6 md:px-10 py-14 md:py-20">
        <div className="flex items-end justify-between mb-10 md:mb-12 gap-6">
          <div>
            <p className="mono mb-3 text-[var(--accent)]">▸ § 07 · EDUCATION</p>
            <h2
              id="education-heading"
              className="display text-[10vw] md:text-[5.4vw] lg:text-[64px] tracking-tightest leading-[0.95]"
            >
              On paper.
            </h2>
          </div>
          <p className="hidden md:block max-w-xs text-right body-prose-sm">
            Engineering training. The design fluency came from shipping work
            on the job.
          </p>
        </div>

        <ol className="border-t-2 border-[var(--rule)]">
          {EDUCATION.map((e) => (
            <li
              key={e.qual}
              className="grid md:grid-cols-12 gap-6 md:gap-10 border-b border-[var(--rule-soft)] py-6 md:py-8"
            >
              <div className="md:col-span-3 mono text-[var(--accent)]">
                {e.period}
              </div>
              <div className="md:col-span-6">
                <h3 className="display text-[22px] md:text-[28px] tracking-tightest leading-[1.05]">
                  {e.qual}
                </h3>
                <p className="body-prose-sm mt-1.5">{e.place}</p>
              </div>
              <div className="md:col-span-3 md:text-right">
                <span className="display-italic text-[20px] md:text-[24px] text-[var(--accent)]">
                  {e.score}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   07  BEYOND WORK — light personal note (no invented hobbies)
   ─────────────────────────────────────────────────────── */
export function HomeBeyondWork() {
  return (
    <section
      className="border-b border-[var(--rule)]"
      aria-labelledby="beyond-heading"
    >
      <div className="max-w-page mx-auto px-6 md:px-10 py-14 md:py-20">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-5">
            <p className="mono mb-3 text-[var(--accent)]">
              ▸ § 08 · OFF THE CLOCK
            </p>
            <h2
              id="beyond-heading"
              className="display text-[8vw] md:text-[4.4vw] lg:text-[60px] tracking-tightest leading-[1]"
            >
              When I&rsquo;m not at the desk.
            </h2>
          </div>
          <div className="md:col-span-7">
            <p className="body-prose drop-cap">
              I&rsquo;m a quiet collaborator who does best in a writing-heavy
              culture and on teams that take research seriously. Most of my
              spare attention goes to learning new tools deeply &mdash;
              recently that&rsquo;s been Figma Make AI, Claude, and Cursor
              &mdash; and figuring out how to fold them into how I design
              without losing the human judgment that decides what&rsquo;s
              worth shipping. I read more long-form than I should, and I
              still edit the occasional video for fun.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   08  CONTACT — real channels from CV
   ─────────────────────────────────────────────────────── */
const CHANNELS = [
  {
    label: "EMAIL",
    value: "surajit3255@gmail.com",
    href: "mailto:surajit3255@gmail.com",
    note: "fastest · reply within 24h",
  },
  {
    label: "PHONE",
    value: "+91 70010 64616",
    href: "tel:+917001064616",
    note: "IST · scheduled calls preferred",
  },
  {
    label: "LINKEDIN",
    value: "/in/surajit3255",
    href: "https://www.linkedin.com/in/surajit3255/",
    note: "for warm intros & coffee chats",
  },
  {
    label: "RESUME",
    value: "Download PDF",
    href: "/resume.pdf",
    note: "single-page, recruiter-friendly",
  },
];

export function HomeContact() {
  return (
    <section
      id="contact"
      className="border-b border-[var(--rule)] scroll-mt-20"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-page mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-10 mono">
          <span className="inline-flex items-center gap-2">
            <span className="diamond" aria-hidden />
            <span className="text-[var(--accent)]">OPEN TO ROLES</span>
          </span>
          <span className="text-[var(--muted)]">·</span>
          <span>FULL-TIME · CONTRACT · IST OR ASYNC US</span>
          <span className="text-[var(--muted)]">·</span>
          <span>STARTING WITHIN 4 WEEKS</span>
        </div>

        <p className="mono mb-3 text-[var(--accent)]">▸ § 09 · CONTACT</p>
        <h2
          id="contact-heading"
          className="display text-[14vw] md:text-[8vw] lg:text-[120px] tracking-tightest leading-[0.92]"
        >
          Let&rsquo;s build{" "}
          <span className="display-italic text-[var(--accent)]">
            something good
          </span>{" "}
          together.
        </h2>

        <div className="grid md:grid-cols-12 gap-8 md:gap-16 mt-10 md:mt-14">
          <div className="md:col-span-5">
            <p className="body-prose">
              I&rsquo;m looking for product design roles working on enterprise
              SaaS, design systems, or workflow-heavy products. Email is
              fastest. A 30-minute call is the shortest path.
            </p>
            <p className="body-prose-sm mt-5">
              Async-friendly for US time zones. Comfortable in a writing-heavy
              culture. Willing to relocate for the right team.
            </p>
          </div>

          <ul className="md:col-span-6 md:col-start-7 border-y-2 border-[var(--rule)] divide-y divide-[var(--rule-soft)]">
            {CHANNELS.map((c) => {
              const isExternal = c.href.startsWith("http");
              return (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer noopener" : undefined}
                    aria-label={`${c.label}: ${c.value}${
                      isExternal ? ", opens in new tab" : ""
                    }`}
                    className="group grid grid-cols-[80px_1fr_auto] items-baseline gap-4 py-5 md:py-6 min-h-[64px] hover:text-[var(--accent)] focus-visible:text-[var(--accent)] transition-colors"
                  >
                    <span className="mono">{c.label}</span>
                    <div>
                      <div className="display text-[20px] md:text-[24px] tracking-tightest">
                        {c.value}
                      </div>
                      <div className="text-[13px] mt-1 italic text-[var(--muted)]">
                        {c.note}
                      </div>
                    </div>
                    <span
                      aria-hidden
                      className="text-[18px] group-hover:translate-x-2 transition-transform"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   Helper
   ─────────────────────────────────────────────────────── */
function Sep() {
  return (
    <span aria-hidden className="text-[var(--rule-soft)]">
      ·
    </span>
  );
}
