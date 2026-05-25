/**
 * Home-page sections — Brutalist + Electric rebuild.
 *
 * The home is intentionally concise. Each section is a low-density
 * preview that links to its dedicated page; nothing tries to be the
 * full story up front.
 *
 *   01  Hero
 *   02  What I do
 *   03  Cases (3 — link to /cases)
 *   04  Work (preview — link to /work)
 *   05  Gallery (preview — link to /gallery)
 *   06  AI section (preview — link to /ai)
 *   07  Contact (with CV download)
 */

import Link from "next/link";
import { getCaseProjects, getWorkProjects } from "@/lib/projects";
import { Button, StatusPill } from "./Button";

/* ──────────────────────────────────────────────────────────
   01  HERO — short, single statement, two CTAs
   ─────────────────────────────────────────────────────── */
export function HomeHero() {
  return (
    <section
      id="hero"
      className="border-b border-[var(--rule-soft)] scroll-mt-20"
      aria-labelledby="hero-heading"
    >
      <div className="swiss-container py-14 md:py-24">
        <p className="section-tag mb-8">01 — Lead</p>
        <div className="swiss-grid items-end">
          <div className="col-span-12 md:col-span-9">
            <h2
              id="hero-heading"
              className="display text-[16vw] sm:text-[12vw] md:text-[9vw] lg:text-[136px]"
            >
              i design product flows for it and security teams.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-3 md:pb-2">
            <p className="body-prose-sm">
              Three years on enterprise SaaS — IAM, PAM, IGA, UEM. AI-native
              workflow, ~70% cycle compression. Currently at miniOrange.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/cases" variant="primary">
                See cases
              </Button>
              <Button href="/hire" variant="outlined">
                Hire me
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   02  WHAT I DO — three terse columns
   ─────────────────────────────────────────────────────── */
const CAPABILITIES = [
  {
    label: "DOMAINS",
    items: ["Identity & Access (IAM)", "Privileged Access (PAM)", "Identity Governance (IGA)", "Endpoint Management (UEM)"],
  },
  {
    label: "STRENGTHS",
    items: ["AI-orchestrated design", "0-to-1 discovery", "Design systems at scale", "Stakeholder synthesis · IA · QA"],
  },
  {
    label: "TOOLS",
    items: ["Figma · Figma Make AI", "Claude · ChatGPT · Cursor", "Antigravity · Lovable · Bolt", "Variables · tokens · libraries"],
  },
];

export function HomeWhatIDo() {
  return (
    <section
      id="what-i-do"
      className="border-b border-[var(--rule-soft)] scroll-mt-20"
      aria-labelledby="what-i-do-heading"
    >
      <div className="swiss-container py-14 md:py-20">
        <div className="swiss-grid items-end mb-8">
          <div className="col-span-12 md:col-span-8">
            <p className="section-tag mb-5">02 — What I do</p>
            <h2
              id="what-i-do-heading"
              className="display text-[10vw] md:text-[5vw] lg:text-[64px]"
            >
              three columns. read across.
            </h2>
          </div>
        </div>

        <div className="swiss-grid border-t-2 border-[var(--rule)]">
          {CAPABILITIES.map((c, idx) => (
            <div
              key={c.label}
              className={`col-span-12 md:col-span-4 py-7 md:py-9 ${
                idx > 0 ? "md:border-l border-[var(--rule-soft)] md:pl-8" : "md:pr-8"
              }`}
            >
              <div className="mono-accent mb-5">{c.label}</div>
              <ul className="space-y-2.5">
                {c.items.map((it) => (
                  <li key={it} className="flex items-baseline gap-3 body-prose-sm">
                    <span aria-hidden className="mono shrink-0 text-[var(--accent)]">
                      ›
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
   03  CASES — the three flagship case studies
   ─────────────────────────────────────────────────────── */
export function HomeSelectedWork() {
  const cases = getCaseProjects();

  return (
    <section
      id="cases"
      className="border-b border-[var(--rule-soft)] scroll-mt-20"
      aria-labelledby="cases-heading"
    >
      <div className="swiss-container py-14 md:py-20">
        <div className="swiss-grid items-end mb-10 md:mb-12">
          <div className="col-span-12 md:col-span-8">
            <p className="section-tag mb-5">03 — Cases</p>
            <h2
              id="cases-heading"
              className="display text-[12vw] md:text-[6vw] lg:text-[80px]"
            >
              three projects, told in depth.
            </h2>
          </div>
          <p className="col-span-12 md:col-span-4 body-prose-sm md:text-right">
            The full story — research, decisions, trade-offs. Three deep
            ones. Everything else lives in{" "}
            <Link href="/work" className="link">
              work
            </Link>{" "}
            or{" "}
            <Link href="/gallery" className="link">
              gallery
            </Link>
            .
          </p>
        </div>

        <ul className="border-t-2 border-[var(--rule)]" role="list">
          {cases.map((p, i) => (
            <li key={p.slug} className="border-b border-[var(--rule-soft)]">
              <Link
                href={`/cases/${p.slug}`}
                className="group block py-8 md:py-10 hover:bg-[var(--paper-2)] transition-colors"
              >
                <div className="swiss-grid items-baseline">
                  <div className="col-span-2 md:col-span-1 mono text-[var(--muted)]">
                    0{i + 1}
                  </div>
                  <div className="col-span-10 md:col-span-6">
                    <h3 className="display text-[28px] md:text-[40px] lg:text-[48px] group-hover:text-[var(--accent)] transition-colors">
                      {p.title}
                    </h3>
                    <p className="body-prose mt-2">{p.subtitle}</p>
                  </div>
                  <div className="col-span-12 md:col-span-4 mt-4 md:mt-0">
                    <p className="mono text-[var(--muted)]">
                      {p.year} · {p.role}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-1 md:text-right mt-4 md:mt-0">
                    <span className="mono-accent group-hover:translate-x-1 inline-block transition-transform">
                      read →
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Link href="/cases" className="mono link">
            all cases →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   04  WORK PREVIEW — small strip with link to /work
   ─────────────────────────────────────────────────────── */
export function HomeExperience() {
  const work = getWorkProjects().slice(0, 6);

  return (
    <section
      id="work-preview"
      className="border-b border-[var(--rule-soft)] scroll-mt-20"
      aria-labelledby="work-preview-heading"
    >
      <div className="swiss-container py-14 md:py-20">
        <div className="swiss-grid items-end mb-8">
          <div className="col-span-12 md:col-span-8">
            <p className="section-tag mb-5">04 — Work</p>
            <h2
              id="work-preview-heading"
              className="display text-[10vw] md:text-[5vw] lg:text-[64px]"
            >
              everything else.
            </h2>
            <p className="body-prose-sm mt-4 max-w-prose">
              Hover any tile. The whole page changes color.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {work.map((p, i) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              className="work-tile group min-h-[140px] md:min-h-[180px]"
              style={
                {
                  "--tile-hover": p.hoverColor ?? "#1a1a1a",
                  "--tile-hover-ink": p.hoverInk ?? "#f0eee8",
                } as React.CSSProperties
              }
            >
              <div className="flex items-start justify-between">
                <span className="mono text-[var(--muted)] group-hover:text-current/70 transition-colors">
                  0{i + 1}
                </span>
                <span
                  aria-hidden
                  className="mono text-[var(--muted)] group-hover:text-current/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  {p.hoverIllustration ?? "→"}
                </span>
              </div>
              <h3 className="display text-[20px] md:text-[28px] mt-12 md:mt-16 leading-[1.05]">
                {p.title}
              </h3>
              <p className="mono mt-2 text-[var(--muted)] group-hover:text-current/70">
                {p.category}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/work" className="mono link">
            all work →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   05  GALLERY PREVIEW — terse, links to /gallery
   ─────────────────────────────────────────────────────── */
export function HomeHowIWork() {
  return (
    <section
      id="gallery-preview"
      className="border-b border-[var(--rule-soft)] scroll-mt-20"
      aria-labelledby="gallery-preview-heading"
    >
      <div className="swiss-container py-14 md:py-20">
        <div className="swiss-grid items-end mb-10">
          <div className="col-span-12 md:col-span-8">
            <p className="section-tag mb-5">05 — Gallery</p>
            <h2
              id="gallery-preview-heading"
              className="display text-[10vw] md:text-[5vw] lg:text-[64px]"
            >
              the infinite plane.
            </h2>
            <p className="body-prose mt-5 max-w-prose">
              Every Dribbble shot, side project, and visual exploration laid
              out on a 2D plane. Drag, scroll, or use the arrow keys.
              Click any piece to zoom in.
            </p>
          </div>
        </div>

        <Link
          href="/gallery"
          className="block relative overflow-hidden border border-[var(--rule-soft)] aspect-[16/8] md:aspect-[16/6] bg-[var(--paper-2)] group"
        >
          {/* Mini preview — abstract scattered frames */}
          <div className="absolute inset-0 pointer-events-none">
            {MINI_FRAMES.map((f, i) => (
              <span
                key={i}
                className="absolute border border-[var(--rule-soft)] bg-[var(--paper-3)] transition-transform duration-700 group-hover:scale-105"
                style={{
                  left: `${f.x}%`,
                  top: `${f.y}%`,
                  width: `${f.w}%`,
                  height: `${f.h}%`,
                }}
                aria-hidden
              />
            ))}
          </div>
          <div className="relative h-full flex items-end justify-between p-6 md:p-8">
            <span className="mono">drag · scroll · ←↑↓→ keys</span>
            <span className="mono-accent group-hover:translate-x-1 inline-block transition-transform">
              enter gallery →
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

const MINI_FRAMES = [
  { x: 3, y: 12, w: 14, h: 36 },
  { x: 22, y: 28, w: 18, h: 44 },
  { x: 46, y: 8,  w: 12, h: 30 },
  { x: 62, y: 36, w: 22, h: 50 },
  { x: 88, y: 14, w: 8,  h: 26 },
  { x: 8,  y: 60, w: 10, h: 22 },
  { x: 42, y: 56, w: 14, h: 34 },
  { x: 78, y: 72, w: 12, h: 22 },
];

/* ──────────────────────────────────────────────────────────
   06  AI SECTION — preview with link to /ai
   ─────────────────────────────────────────────────────── */
export function HomeAIToolkit() {
  return (
    <section
      id="ai-preview"
      className="border-b border-[var(--rule-soft)] scroll-mt-20 bg-[var(--paper-2)]"
      aria-labelledby="ai-preview-heading"
    >
      <div className="swiss-container py-14 md:py-20">
        <div className="swiss-grid items-end mb-10">
          <div className="col-span-12 md:col-span-7">
            <p className="section-tag mb-5">06 — AI Workflow</p>
            <h2
              id="ai-preview-heading"
              className="display text-[10vw] md:text-[6vw] lg:text-[80px]"
            >
              i orchestrate. models execute.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:pt-2">
            <p className="body-prose">
              Claude, Figma Make AI, Cursor, Antigravity — chained into a
              repeatable workflow. Five-day prototypes that used to take
              three weeks. The judgment about <em>what</em> to ship stays
              human; the work to make it real is where AI earns its keep.
            </p>
          </div>
        </div>

        {/* Cadence strip — three terse lines */}
        <div className="swiss-grid border-t-2 border-[var(--rule)]">
          {AI_BEATS.map((b, i) => (
            <div
              key={b.label}
              className={`col-span-12 md:col-span-4 py-7 ${
                i > 0 ? "md:border-l border-[var(--rule-soft)] md:pl-8" : "md:pr-8"
              }`}
            >
              <div className="mono-accent mb-3">{b.cadence}</div>
              <h3 className="display text-[24px] md:text-[28px] mb-3">{b.label}</h3>
              <p className="body-prose-sm">{b.use}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/ai" className="mono link">
            full ai workflow →
          </Link>
        </div>
      </div>
    </section>
  );
}

const AI_BEATS = [
  {
    cadence: "DAILY",
    label: "claude code",
    use: "Engineering pair. Built this portfolio end-to-end. Refactors, audits, CI workflows.",
  },
  {
    cadence: "DAILY",
    label: "figma make ai",
    use: "Production prototypes — the 5-day AD console. Multi-frame flows ready for handoff.",
  },
  {
    cadence: "WEEKLY",
    label: "cowork + skills",
    use: "Skill orchestration. brand-voice, impeccable, design-taste run as workflows.",
  },
];

/* ──────────────────────────────────────────────────────────
   07  EDUCATION — kept short, only on the about page now
   ─────────────────────────────────────────────────────── */
export function HomeEducation() {
  return null; // moved to /about
}

export function HomeBeyondWork() {
  return null; // moved to /about
}

/* ──────────────────────────────────────────────────────────
   08  CONTACT — terse + CV CTA
   ─────────────────────────────────────────────────────── */
const CHANNELS = [
  { label: "EMAIL", value: "surajit3255@gmail.com", href: "mailto:surajit3255@gmail.com" },
  { label: "LINKEDIN", value: "/in/surajit3255", href: "https://www.linkedin.com/in/surajit3255/" },
  { label: "DRIBBBLE", value: "/surajit3255", href: "https://dribbble.com/surajit3255" },
];

export function HomeContact() {
  return (
    <section
      id="contact"
      className="scroll-mt-20"
      aria-labelledby="contact-heading"
    >
      <div className="swiss-container py-20 md:py-28">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 mono">
          <StatusPill size="md" />
          <span className="text-[var(--muted-soft)]">·</span>
          <span>full-time · contract · ist or async us</span>
          <span className="text-[var(--muted-soft)]">·</span>
          <span>starting within 4 weeks</span>
        </div>

        <p className="section-tag mb-5">07 — Contact</p>
        <h2
          id="contact-heading"
          className="display text-[14vw] md:text-[8vw] lg:text-[112px]"
        >
          let&apos;s build something.
        </h2>

        <div className="swiss-grid mt-10">
          <div className="col-span-12 md:col-span-5">
            <p className="body-prose">
              Looking for product design roles on enterprise SaaS, design
              systems, or workflow-heavy products. Email is fastest. A
              30-minute call is the shortest path.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                href="/resume.pdf"
                download="Surajit-Dutta-CV.pdf"
                variant="primary"
                iconRight={<span aria-hidden>↓</span>}
              >
                Download CV
              </Button>
              <Button href="/hire" variant="outlined">
                Hire me
              </Button>
            </div>
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
                    className="group grid grid-cols-[100px_1fr_auto] items-center gap-4 py-5 md:py-6 min-h-[64px] hover:text-[var(--accent)] focus-visible:text-[var(--accent)] transition-colors"
                  >
                    <span className="mono">{c.label}</span>
                    <span className="display text-[18px] md:text-[22px]">
                      {c.value}
                    </span>
                    <span aria-hidden className="text-[18px] group-hover:translate-x-2 transition-transform">
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
