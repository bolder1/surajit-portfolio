/**
 * Home-page sections — Swiss Modernism rebuild.
 *
 * Same content, same fact-binding to Surajit's CV. The visual register
 * changes: one grotesk family (Inter), one accent (vermilion) appearing
 * once per section, strict 12-col grid via .swiss-grid + .swiss-container,
 * 8px spacing rhythm, hierarchy via weight + size, not decoration.
 *
 * Sections (top to bottom):
 *   01  Hero               — name moment + four stats
 *   02  What I do          — Domains / Strengths / Tools
 *   03  Selected Work      — five projects, scope + role
 *   04  Experience         — three roles, real bullets
 *   05  How I work         — three principles + 8-step process strip
 *   06  AI-native Toolkit  — manifesto + tool taxonomy + receipts
 *   07  Education          — B.Tech IT + Diploma
 *   08  Beyond work        — short personal note
 *   09  Contact            — channels
 */

import Link from "next/link";
import { getFeaturedProjects } from "@/lib/projects";
import { Button, StatusPill } from "./Button";

/* ──────────────────────────────────────────────────────────
   01  HERO
   ─────────────────────────────────────────────────────── */
export function HomeHero() {
  return (
    <section
      id="hero"
      className="border-b border-[var(--rule)] scroll-mt-20"
      aria-labelledby="hero-heading"
    >
      <div className="swiss-container py-14 md:py-20">
        {/* Status strip */}
        <div className="swiss-grid items-center pb-6 border-b border-[var(--rule-soft)] mono">
          <span className="col-span-6 md:col-span-3 text-[var(--accent-deep)]">
            OPEN TO ROLES
          </span>
          <span className="col-span-6 md:col-span-6 md:text-center">
            FULL-TIME · CONTRACT · PUNE / IST / ASYNC US
          </span>
          <span className="col-span-12 md:col-span-3 md:text-right text-[var(--muted)]">
            REPLY WITHIN 24H
          </span>
        </div>

        {/* Headline + supporting paragraph */}
        <div className="swiss-grid items-end pt-10 md:pt-14">
          <div className="col-span-12 md:col-span-8">
            <p className="section-tag mb-6">01 — Lead</p>
            <h2
              id="hero-heading"
              className="display text-[14vw] sm:text-[11vw] md:text-[8vw] lg:text-[120px]"
            >
              I design product flows for IT and security teams.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4">
            <p className="body-prose">
              Three-plus years on enterprise SaaS — currently at miniOrange,
              leading end-to-end design across IAM, PAM, IGA and UEM. I
              orchestrate Claude, Figma Make AI, Cursor, and a widening AI
              stack to compress discovery-to-handoff cycles from weeks to
              days — without trading taste for speed. Receipts in § 06.
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

        {/* Stats strip — defensible CV-bound numbers.
            Swiss adjustment: figures in heavy sans, single accent on the
            number itself, dividers are hairline-soft (not full ink). */}
        <div className="mt-14 md:mt-20 swiss-grid border-t-2 border-[var(--rule)]">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`col-span-6 md:col-span-3 py-6 ${
                i > 0 ? "md:border-l border-[var(--rule-soft)] md:pl-6" : ""
              }`}
            >
              <div className="figure display text-[40px] md:text-[60px] lg:text-[76px] text-[var(--ink)]">
                {s.value}
              </div>
              <div className="mono mt-2 text-[var(--ink-soft)]">{s.label}</div>
              <div className="text-[14px] mt-1 text-[var(--muted)]">{s.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STATS = [
  { value: "3+", label: "YEARS", note: "designing enterprise SaaS" },
  { value: "4", label: "PLATFORMS", note: "IAM · PAM · IGA · UEM" },
  { value: "5 days", label: "0 → PROTOTYPE", note: "AD console, Figma Make AI" },
  { value: "~70%", label: "CYCLE COMPRESSION", note: "discovery to handoff" },
];

/* ──────────────────────────────────────────────────────────
   02  WHAT I DO
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
      <div className="swiss-container py-14 md:py-20">
        <div className="swiss-grid items-end mb-10 md:mb-12">
          <div className="col-span-12 md:col-span-8">
            <p className="section-tag mb-5">02 — Capabilities</p>
            <h2
              id="what-i-do-heading"
              className="display text-[10vw] md:text-[6vw] lg:text-[72px]"
            >
              What I bring, in three columns.
            </h2>
          </div>
          <p className="col-span-12 md:col-span-4 body-prose-sm md:text-right">
            Lifted directly from the CV. Read across for the answer most
            hiring managers ask first.
          </p>
        </div>

        <div className="swiss-grid border-t-2 border-[var(--rule)]">
          {COLS.map((c, idx) => (
            <div
              key={c.label}
              className={`col-span-12 md:col-span-4 py-7 md:py-9 ${
                idx > 0
                  ? "md:border-l border-[var(--rule-soft)] md:pl-8"
                  : "md:pr-8"
              }`}
            >
              <div className="flex items-baseline justify-between mb-5">
                <span className="mono-accent">{c.label}</span>
                <span className="mono-xs">№ 0{idx + 1}</span>
              </div>
              <h3 className="display text-[26px] md:text-[30px] mb-5">
                {c.title}
              </h3>
              <ul className="space-y-2.5">
                {c.items.map((it) => (
                  <li
                    key={it}
                    className="flex items-baseline gap-3 body-prose-sm"
                  >
                    <span aria-hidden className="mono shrink-0">
                      →
                    </span>
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
   ─────────────────────────────────────────────────────── */
export function HomeSelectedWork() {
  const projects = getFeaturedProjects().slice(0, 5);

  return (
    <section
      id="work"
      className="border-b border-[var(--rule)] scroll-mt-20"
      aria-labelledby="work-heading"
    >
      <div className="swiss-container py-14 md:py-20">
        <div className="swiss-grid items-end mb-10 md:mb-12">
          <div className="col-span-12 md:col-span-8">
            <p className="section-tag mb-5">03 — Selected Work</p>
            <h2
              id="work-heading"
              className="display text-[11vw] md:text-[7vw] lg:text-[96px]"
            >
              Five projects, told in the time it takes to scan.
            </h2>
          </div>
          <p className="col-span-12 md:col-span-4 body-prose-sm md:text-right">
            Most enterprise work at miniOrange is under NDA. Public summaries
            below; full case studies, screens, and outcome metrics shared on
            request.
          </p>
        </div>

        <ul className="border-t-2 border-[var(--rule)]" role="list">
          {projects.map((p, i) => (
            <li
              key={p.slug}
              className="border-b border-[var(--rule-soft)] py-7 md:py-9"
            >
              <div className="swiss-grid items-baseline">
                <div className="col-span-2 md:col-span-1 mono text-[var(--muted)]">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className="col-span-10 md:col-span-5">
                  <h3 className="display text-[28px] md:text-[36px] lg:text-[44px]">
                    {p.title}
                    {p.confidential && (
                      <span className="mono ml-3 align-middle text-[var(--muted)]">
                        NDA
                      </span>
                    )}
                  </h3>
                  <p className="body-prose mt-2">{p.subtitle}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 mono text-[var(--muted)]">
                    <span>{p.year}</span>
                    <span aria-hidden>·</span>
                    <span>{p.role}</span>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-3 mt-4 md:mt-0">
                  <p className="mono-accent mb-1.5">THE PROBLEM</p>
                  <p className="body-prose-sm">
                    {(p.problem ?? "Confidential — full brief shared on request.")
                      .split(".")
                      .filter(Boolean)[0] + "."}
                  </p>
                </div>

                <div className="col-span-12 md:col-span-3 mt-4 md:mt-0">
                  <p className="mono-accent mb-1.5">SCOPE</p>
                  <p className="body-prose-sm">
                    End-to-end product design — discovery, IA, flows,
                    high-fidelity UI, design QA.{" "}
                    <span className="text-[var(--muted)]">
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
          <a href="#contact" className="mono link text-[var(--accent-deep)]">
            HAVE A PROJECT IN MIND? LET&rsquo;S TALK →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   04  EXPERIENCE
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
      <div className="swiss-container py-14 md:py-20">
        <div className="swiss-grid items-end mb-10 md:mb-14">
          <div className="col-span-12 md:col-span-8">
            <p className="section-tag mb-5">04 — Experience</p>
            <h2
              id="experience-heading"
              className="display text-[10vw] md:text-[6vw] lg:text-[72px]"
            >
              Three roles, one trajectory toward enterprise.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:text-right">
            <a
              href="/resume.pdf"
              className="inline-flex items-center gap-2 mono link"
            >
              DOWNLOAD AS PDF ↓
            </a>
          </div>
        </div>

        <ol className="border-t-2 border-[var(--rule)]">
          {ROLES.map((r, i) => (
            <li
              key={r.role + r.period}
              className="border-b border-[var(--rule-soft)] py-7 md:py-9"
            >
              <div className="swiss-grid">
                <div className="col-span-12 md:col-span-3">
                  <div className="mono-accent">{r.period}</div>
                  <div className="text-[16px] mt-1.5 text-[var(--ink-soft)]">
                    {r.location}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4 mt-3 md:mt-0">
                  <h3 className="display text-[24px] md:text-[30px]">{r.role}</h3>
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
                <ul className="col-span-12 md:col-span-5 space-y-3 mt-3 md:mt-0">
                  {r.bullets.map((b) => (
                    <li key={b} className="body-prose-sm flex gap-3">
                      <span
                        aria-hidden
                        className="shrink-0 mt-[10px] block w-2 h-px bg-[var(--accent)]"
                      />
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
   ─────────────────────────────────────────────────────── */
const PRINCIPLES = [
  {
    n: "01",
    title: "Make complex feel calm",
    body: "Right thing on screen at the right moment. Everything else, off.",
  },
  {
    n: "02",
    title: "Systems, then surfaces",
    body: "Tokens, components, patterns first. The system pays back on year two.",
  },
  {
    n: "03",
    title: "Compress with AI, polish with judgment",
    body:
      "Use AI to spin variants and write edge cases. Reserve human time for the calls that need taste.",
  },
];

const PHASES = [
  { num: "01", label: "Desk" },
  { num: "02", label: "Field" },
  { num: "03", label: "Synthesis" },
  { num: "04", label: "Draft" },
  { num: "05", label: "System" },
  { num: "06", label: "Motion" },
  { num: "07", label: "Hand-off" },
  { num: "08", label: "Talk" },
];

export function HomeHowIWork() {
  return (
    <section
      id="how-i-work"
      className="border-b border-[var(--rule)] scroll-mt-20"
      aria-labelledby="how-i-work-heading"
    >
      <div className="swiss-container py-14 md:py-20">
        <div className="swiss-grid items-end mb-10 md:mb-14">
          <div className="col-span-12 md:col-span-8">
            <p className="section-tag mb-5">05 — Approach</p>
            <h2
              id="how-i-work-heading"
              className="display text-[10vw] md:text-[6vw] lg:text-[72px]"
            >
              How I work, in three rules.
            </h2>
          </div>
        </div>

        <div className="swiss-grid border-t-2 border-[var(--rule)]">
          {PRINCIPLES.map((p, i) => (
            <div
              key={p.n}
              className={`col-span-12 md:col-span-4 py-7 md:py-9 ${
                i > 0 ? "md:border-l border-[var(--rule-soft)] md:pl-8" : "md:pr-8"
              }`}
            >
              <div className="mono-accent mb-4">{p.n}</div>
              <h3 className="display text-[22px] md:text-[26px] mb-3">
                {p.title}
              </h3>
              <p className="body-prose-sm">{p.body}</p>
            </div>
          ))}
        </div>

        {/* Process strip — 8 phases, single accent rule above the first
            phase, otherwise a flat divided strip. */}
        <div className="mt-10 md:mt-14">
          <div className="flex items-baseline justify-between mb-4">
            <span className="mono-accent">THE LOOP · 8 PHASES</span>
            <Link href="/about#process" className="mono link hidden md:inline">
              READ THE LONG VERSION →
            </Link>
          </div>
          <ol className="swiss-grid border-t-2 border-[var(--rule)] gap-0">
            {PHASES.map((p, i) => (
              <li
                key={p.num}
                className={`col-span-6 md:col-span-3 lg:col-span-[1.5] py-5 px-4 border-b border-[var(--rule-soft)] ${
                  i % 2 !== 0 || i % 4 === 3
                    ? ""
                    : "md:border-r border-[var(--rule-soft)]"
                } ${
                  i < 7 ? "lg:border-r" : ""
                }`}
                style={{ gridColumn: `span ${i === 7 ? 1.5 : 1.5}` }}
              >
                <div className="mono text-[var(--muted)] mb-2">{p.num}</div>
                <div className="text-[17px] md:text-[18px] font-medium text-[var(--ink)]">
                  {p.label}
                </div>
              </li>
            ))}
          </ol>
          <p className="mono mt-3 text-[var(--muted)]">
            MOST PHASES LOOP BACK TO FIELDWORK
          </p>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   06  AI-NATIVE TOOLKIT
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
    note: "AI builds the artifact, I direct the taste",
    tools: [
      { name: "Claude Design", maker: "Anthropic", cadence: "DAILY",
        use: "HTML/CSS/JS prototype generation from a brief — produced the Internal Banking Tool's full surface ready for handoff" },
      { name: "Claude Code", maker: "Anthropic", cadence: "DAILY",
        use: "engineering pair — wrote this portfolio end-to-end (Next.js, React 19); refactors, audits, CI workflows" },
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
    name: "ui-ux-pro-max",
    by: "Community",
    use: "Comprehensive design intelligence — 50+ styles, 161 palettes, 99 UX rules. Used to direct this Swiss revamp.",
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
      "Next.js, React 19, Inter + JetBrains Mono on a strict 12-col Swiss grid. Token-driven theming (light + dark). Built end-to-end with Claude Code; design direction from the ui-ux-pro-max skill.",
  },
  {
    title: "Throughline — feedback-to-decision tool",
    where: "Built with Claude Code, 2026",
    body:
      "A standalone product anchoring the portfolio. Triage Inbox, decision log, primitive library. Live at throughline-app.vercel.app.",
  },
];

export function HomeAIToolkit() {
  return (
    <section
      id="ai-toolkit"
      className="border-b border-[var(--rule)] scroll-mt-20 bg-[var(--paper-2)]"
      aria-labelledby="ai-toolkit-heading"
    >
      <div className="swiss-container py-14 md:py-20">
        {/* Header + manifesto */}
        <div className="swiss-grid gap-y-8 mb-12 md:mb-16">
          <div className="col-span-12 md:col-span-7">
            <p className="section-tag mb-5">06 — AI-native workflow</p>
            <h2
              id="ai-toolkit-heading"
              className="display text-[10vw] md:text-[7vw] lg:text-[88px]"
            >
              I orchestrate. The models execute.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:pt-4">
            <p className="body-prose">
              AI doesn&rsquo;t make me a designer. It lets me be the designer
              who ships in days what used to take weeks — same taste, more
              reps. The judgment about <em>what</em> to ship still has to be
              human; the work to make it real is where AI earns its keep.
              Vibe-coding tools (Claude Design, Figma Make, Lovable, Bolt)
              turn a brief into a clickable artifact in an afternoon.
            </p>
            <p className="body-prose-sm mt-4 text-[var(--ink-soft)]">
              Daily · Weekly · Exploring labels keep the claims defensible.
              Ask in an interview — I&rsquo;ll show receipts.
            </p>
          </div>
        </div>

        {/* Toolkit grid */}
        <div className="border-t-2 border-[var(--rule)]">
          {TOOLKIT.map((cat, ci) => (
            <div
              key={cat.category}
              className="swiss-grid gap-y-4 py-7 md:py-9 border-b border-[var(--rule-soft)]"
            >
              <div className="col-span-12 md:col-span-3">
                <div className="mono-accent mb-2">
                  {String(ci + 1).padStart(2, "0")} · {cat.category}
                </div>
                <p className="text-[17px] md:text-[18px] text-[var(--ink-soft)]">
                  {cat.note}
                </p>
              </div>
              <ul className="col-span-12 md:col-span-9 space-y-4 md:space-y-5">
                {cat.tools.map((t) => (
                  <li
                    key={t.name}
                    className="swiss-grid gap-y-1 items-baseline"
                  >
                    <div className="col-span-12 md:col-span-4">
                      <div className="display text-[20px] md:text-[24px]">
                        {t.name}
                      </div>
                      <div className="mono text-[var(--muted)] mt-1">
                        BY {t.maker.toUpperCase()}
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <CadenceBadge cadence={t.cadence} />
                    </div>
                    <div className="col-span-12 md:col-span-6 body-prose-sm">
                      {t.use}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Skills run */}
        <div className="mt-14 md:mt-20">
          <div className="swiss-grid items-baseline mb-8">
            <h3 className="col-span-12 md:col-span-8 display text-[26px] md:text-[34px]">
              Skills I&rsquo;ve run end-to-end in production.
            </h3>
            <span className="hidden md:inline-block col-span-4 md:text-right mono text-[var(--muted)]">
              ORCHESTRATED, NOT ONE-OFF
            </span>
          </div>
          <div className="swiss-grid border-t-2 border-[var(--rule)]">
            {SKILLS_RUN.map((s, i) => (
              <div
                key={s.name}
                className={`col-span-12 md:col-span-6 lg:col-span-4 p-5 md:p-6 border-b border-[var(--rule-soft)] ${
                  i % 3 !== 0 ? "lg:border-l" : ""
                } ${i % 2 !== 0 ? "md:border-l lg:border-l" : ""}`}
              >
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <span className="mono-accent">/{s.name}</span>
                  <span className="mono-xs">{s.by.toUpperCase()}</span>
                </div>
                <p className="body-prose-sm">{s.use}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Receipts */}
        <div className="mt-14 md:mt-20">
          <div className="swiss-grid items-baseline mb-8">
            <h3 className="col-span-12 md:col-span-8 display text-[26px] md:text-[34px]">
              The receipts.
            </h3>
            <span className="hidden md:inline-block col-span-4 md:text-right mono text-[var(--muted)]">
              WHAT THE STACK ACTUALLY SHIPPED
            </span>
          </div>
          <ol className="border-t-2 border-[var(--rule)]">
            {RECEIPTS.map((r, i) => (
              <li
                key={r.title}
                className="swiss-grid border-b border-[var(--rule-soft)] py-5 md:py-7"
              >
                <div className="col-span-2 md:col-span-1 mono text-[var(--muted)]">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="col-span-10 md:col-span-4">
                  <div className="display text-[20px] md:text-[24px]">
                    {r.title}
                  </div>
                  <div className="mono-accent mt-1.5">{r.where}</div>
                </div>
                <p className="col-span-12 md:col-span-7 body-prose-sm mt-3 md:mt-0">
                  {r.body}
                </p>
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
    DAILY: "bg-[var(--accent)] !text-white border-[var(--accent)] [&]:!text-white",
    WEEKLY: "border-[var(--ink)] text-[var(--ink)]",
    EXPLORING: "border-[var(--rule-soft)] text-[var(--muted)]",
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
   07  EDUCATION
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
      <div className="swiss-container py-14 md:py-20">
        <div className="swiss-grid items-end mb-10 md:mb-12">
          <div className="col-span-12 md:col-span-8">
            <p className="section-tag mb-5">07 — Education</p>
            <h2
              id="education-heading"
              className="display text-[10vw] md:text-[5vw] lg:text-[64px]"
            >
              On paper.
            </h2>
          </div>
          <p className="col-span-12 md:col-span-4 body-prose-sm md:text-right">
            Engineering training. The design fluency came from shipping work
            on the job.
          </p>
        </div>

        <ol className="border-t-2 border-[var(--rule)]">
          {EDUCATION.map((e) => (
            <li
              key={e.qual}
              className="swiss-grid border-b border-[var(--rule-soft)] py-6 md:py-8"
            >
              <div className="col-span-12 md:col-span-3 mono-accent">
                {e.period}
              </div>
              <div className="col-span-12 md:col-span-6">
                <h3 className="display text-[20px] md:text-[26px]">{e.qual}</h3>
                <p className="body-prose-sm mt-1.5">{e.place}</p>
              </div>
              <div className="col-span-12 md:col-span-3 md:text-right">
                <span className="text-[18px] md:text-[22px] font-semibold text-[var(--ink)]">
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
   08  BEYOND WORK
   ─────────────────────────────────────────────────────── */
export function HomeBeyondWork() {
  return (
    <section
      className="border-b border-[var(--rule)]"
      aria-labelledby="beyond-heading"
    >
      <div className="swiss-container py-14 md:py-20">
        <div className="swiss-grid">
          <div className="col-span-12 md:col-span-5">
            <p className="section-tag mb-5">08 — Off the clock</p>
            <h2
              id="beyond-heading"
              className="display text-[8vw] md:text-[5vw] lg:text-[56px]"
            >
              When I&rsquo;m not at the desk.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-7 mt-6 md:mt-0">
            <p className="body-prose">
              I&rsquo;m a quiet collaborator who does best in a writing-heavy
              culture and on teams that take research seriously. Most of my
              spare attention goes to learning new tools deeply — recently
              that&rsquo;s been Figma Make AI, Claude, and Cursor — and
              figuring out how to fold them into how I design without losing
              the human judgment that decides what&rsquo;s worth shipping. I
              read more long-form than I should, and I still edit the
              occasional video for fun.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   09  CONTACT
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
      <div className="swiss-container py-20 md:py-28">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-10 mono">
          <StatusPill size="md" />
          <span className="text-[var(--muted)]">·</span>
          <span>FULL-TIME · CONTRACT · IST OR ASYNC US</span>
          <span className="text-[var(--muted)]">·</span>
          <span>STARTING WITHIN 4 WEEKS</span>
        </div>

        <p className="section-tag mb-5">09 — Contact</p>
        <h2
          id="contact-heading"
          className="display text-[12vw] md:text-[7vw] lg:text-[112px]"
        >
          Let&rsquo;s build something good together.
        </h2>

        <div className="swiss-grid mt-10 md:mt-14">
          <div className="col-span-12 md:col-span-5">
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

          <ul
            className="col-span-12 md:col-span-6 md:col-start-7 border-y-2 border-[var(--rule)]"
            role="list"
          >
            {CHANNELS.map((c, i) => {
              const isExternal = c.href.startsWith("http");
              return (
                <li
                  key={c.label}
                  className={i > 0 ? "border-t border-[var(--rule-soft)]" : ""}
                >
                  <a
                    href={c.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer noopener" : undefined}
                    aria-label={`${c.label}: ${c.value}${
                      isExternal ? ", opens in new tab" : ""
                    }`}
                    className="group grid grid-cols-[80px_1fr_auto] items-baseline gap-4 py-5 md:py-6 min-h-[64px] hover:text-[var(--accent-deep)] focus-visible:text-[var(--accent-deep)] transition-colors"
                  >
                    <span className="mono">{c.label}</span>
                    <div>
                      <div className="display text-[18px] md:text-[22px]">
                        {c.value}
                      </div>
                      <div className="text-[13px] mt-1 text-[var(--muted)]">
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
