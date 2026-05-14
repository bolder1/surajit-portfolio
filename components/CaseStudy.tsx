/**
 * Case-study sections for individual project pages.
 * All server components — typography-driven magazine layout.
 *
 * Sections in render order (each is optional based on project data):
 *   ProjectHero → Meta → Summary → Problem → Quotes → BeforeAfter →
 *   ProcessTimeline → Scenarios → Decisions → Gallery → Outcomes →
 *   PublicSections → Tags → LockedCTA → NextProject
 */

import Link from "next/link";
import { CountUp } from "@/components/CountUp";
import { RequestAccess } from "@/components/RequestAccess";
import type {
  Project,
  ProjectMetric,
  ProjectSection,
  Scenario,
  GalleryItem,
  BeforeAfter,
  ProcessPhase,
  Quote,
  PlaceholderKind,
} from "@/lib/types";

/* ──────────────────────────────────────────────────────────
   PROJECT HERO — case-study lead
   ─────────────────────────────────────────────────────── */
export function ProjectHero({ project }: { project: Project }) {
  return (
    <section className="border-b border-[var(--rule)]">
      <div className="max-w-page mx-auto px-6 md:px-10 py-12 md:py-16">
        <Link
          href="/work"
          className="mono link inline-flex items-center gap-2 mb-10"
        >
          ← ALL WORK
        </Link>

        <div className="flex flex-wrap gap-3 mb-8">
          <span className="mono border border-[var(--rule)] px-3 py-1.5">
            {project.category}
          </span>
          {project.confidential && (
            <span className="mono border border-[var(--accent)] text-[var(--accent)] px-3 py-1.5">
              UNDER NDA
            </span>
          )}
          <span className="mono border border-[var(--rule-soft)] text-[var(--muted)] px-3 py-1.5">
            {project.year}
          </span>
        </div>

        <div className="section-tag mb-6">
          ▸ CASE STUDY &middot; № {String(project.order).padStart(2, "0")}
        </div>
        <h1 className="display text-[14vw] md:text-[10vw] lg:text-[160px] tracking-tightest leading-[0.88] mb-6">
          {project.title}
          <span className="text-[var(--accent)]">.</span>
        </h1>
        <p className="display-italic text-2xl md:text-4xl text-[var(--ink-soft)] max-w-3xl">
          {project.subtitle}
        </p>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   META STRIP — newspaper info row
   ─────────────────────────────────────────────────────── */
export function ProjectMeta({ project }: { project: Project }) {
  const isLocked = project.access === "locked";
  return (
    <section className="border-b border-[var(--rule)] bg-[var(--paper-2)]">
      <div className="max-w-page mx-auto px-6 md:px-10 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        <Meta label="Role" value={project.role} />
        <Meta label="Team" value={project.team ?? "—"} />
        <Meta label="Year" value={project.year} />
        <Meta
          label="Access"
          value={isLocked ? "On request" : "Public"}
          accent={isLocked}
        />
      </div>
    </section>
  );
}

function Meta({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="mono mb-2">{label}</div>
      <div
        className={`display text-[20px] md:text-[24px] tracking-tightest ${
          accent ? "text-[var(--accent)]" : "text-[var(--ink)]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   SUMMARY
   ─────────────────────────────────────────────────────── */
export function Summary({ text }: { text: string }) {
  return (
    <section className="border-b border-[var(--rule)]">
      <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24 grid md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-4">
          <div className="section-tag">▸ SUMMARY</div>
        </div>
        <div className="md:col-span-8">
          <p className="display text-3xl md:text-4xl tracking-tightest leading-snug">
            {text}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   PROBLEM
   ─────────────────────────────────────────────────────── */
export function Problem({ text }: { text: string }) {
  return (
    <section className="border-b border-[var(--rule)]">
      <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24 grid md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-4">
          <div className="section-tag">▸ THE PROBLEM</div>
        </div>
        <div className="md:col-span-8">
          <p className="body-prose text-xl md:text-2xl drop-cap">{text}</p>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   QUOTES — voices from the work
   ─────────────────────────────────────────────────────── */
export function Quotes({ quotes }: { quotes: Quote[] }) {
  return (
    <section className="border-b border-[var(--rule)] bg-[var(--paper-2)]">
      <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="section-tag mb-10">▸ THE VOICES</div>
        <div className="grid md:grid-cols-3 gap-px bg-[var(--rule)] border border-[var(--rule)]">
          {quotes.map((q, i) => (
            <figure key={i} className="bg-[var(--paper)] p-8 md:p-10">
              <span aria-hidden className="display text-6xl text-[var(--accent)]">
                &ldquo;
              </span>
              <blockquote className="display-italic text-xl md:text-2xl leading-snug text-[var(--ink)] mb-6 -mt-4">
                {q.text}
              </blockquote>
              <figcaption className="mono">— {q.source}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   BEFORE / AFTER
   ─────────────────────────────────────────────────────── */
export function BeforeAfterSection({ data }: { data: BeforeAfter }) {
  return (
    <section className="border-b border-[var(--rule)]">
      <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="section-tag mb-10">▸ BEFORE / AFTER</div>
        <div className="grid md:grid-cols-2 gap-px bg-[var(--rule)] border border-[var(--rule)]">
          <div className="bg-[var(--paper-2)] p-8 md:p-10">
            <span className="mono text-[var(--muted)] mb-4 block">BEFORE</span>
            <h3 className="display text-2xl md:text-3xl tracking-tightest mb-4">
              {data.before.title}
            </h3>
            <p className="body-prose-sm">{data.before.body}</p>
            <PlaceholderTile kind={data.before.placeholder} className="mt-6" />
          </div>
          <div className="bg-[var(--paper)] p-8 md:p-10">
            <span className="mono text-[var(--accent)] mb-4 block">AFTER</span>
            <h3 className="display text-2xl md:text-3xl tracking-tightest mb-4">
              {data.after.title}
            </h3>
            <p className="body-prose-sm">{data.after.body}</p>
            <PlaceholderTile kind={data.after.placeholder} className="mt-6" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   PROCESS TIMELINE
   ─────────────────────────────────────────────────────── */
export function ProcessTimeline({ phases }: { phases: ProcessPhase[] }) {
  return (
    <section className="border-b border-[var(--rule)]">
      <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="section-tag mb-10">▸ PROCESS</div>
        <h2 className="display text-[10vw] md:text-[5.6vw] lg:text-[80px] tracking-tightest leading-[0.92] mb-12 max-w-3xl">
          From discovery to{" "}
          <span className="display-italic text-[var(--accent)]">ship</span>.
        </h2>

        <div>
          {phases.map((p, i) => (
            <div
              key={p.phase}
              className="border-t-2 border-[var(--rule)] py-8 md:py-10 grid md:grid-cols-12 gap-6 md:gap-10"
            >
              <div className="md:col-span-2">
                <div className="display-italic text-[40px] md:text-[56px] text-[var(--accent)] leading-none">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mono mt-2">{p.duration}</div>
              </div>
              <div className="md:col-span-4">
                <h3 className="display text-2xl md:text-3xl tracking-tightest">
                  {p.phase}
                </h3>
              </div>
              <div className="md:col-span-6">
                <p className="body-prose-sm">{p.body}</p>
                {p.artifacts && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {p.artifacts.map((a) => (
                      <li
                        key={a}
                        className="mono border border-[var(--rule-soft)] px-2.5 py-1"
                      >
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
          <div className="border-t-2 border-[var(--rule)]" />
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   SCENARIOS — persona + before/after stories
   ─────────────────────────────────────────────────────── */
export function Scenarios({ scenarios }: { scenarios: Scenario[] }) {
  return (
    <section className="border-b border-[var(--rule)]">
      <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="section-tag mb-10">▸ SCENARIOS</div>
        <h2 className="display text-[10vw] md:text-[5.6vw] lg:text-[80px] tracking-tightest leading-[0.92] mb-12 max-w-3xl">
          Three users,{" "}
          <span className="display-italic">three days that change</span>.
        </h2>

        <div className="space-y-12 md:space-y-16">
          {scenarios.map((s, i) => (
            <article
              key={i}
              className="border-t-2 border-[var(--rule)] pt-8 md:pt-10 grid md:grid-cols-12 gap-6 md:gap-10"
            >
              <div className="md:col-span-4">
                <div className="display-italic text-[var(--accent)] text-2xl mb-3">
                  Sketch № {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="display text-2xl md:text-3xl tracking-tightest leading-tight mb-3">
                  {s.who}
                </h3>
                <p className="mono">{s.when}</p>
              </div>
              <div className="md:col-span-8 grid md:grid-cols-2 gap-6 md:gap-10">
                <div className="border-l-2 border-[var(--rule-soft)] pl-5">
                  <div className="mono mb-2 text-[var(--muted)]">BEFORE</div>
                  <p className="body-prose-sm">{s.before}</p>
                </div>
                <div className="border-l-2 border-[var(--accent)] pl-5">
                  <div className="mono mb-2 text-[var(--accent)]">AFTER</div>
                  <p className="body-prose-sm">{s.after}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   DECISIONS — design calls explained
   ─────────────────────────────────────────────────────── */
export function Decisions({
  decisions,
}: {
  decisions: { title: string; body: string }[];
}) {
  return (
    <section className="border-b border-[var(--rule)] bg-[var(--paper-2)]">
      <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="section-tag mb-10">▸ DECISIONS</div>
        <h2 className="display text-[10vw] md:text-[5.6vw] lg:text-[80px] tracking-tightest leading-[0.92] mb-12 max-w-3xl">
          Choices the design{" "}
          <span className="display-italic text-[var(--accent)]">
            actually had to make
          </span>
          .
        </h2>

        <div className="grid md:grid-cols-2 gap-px bg-[var(--rule)] border border-[var(--rule)]">
          {decisions.map((d, i) => (
            <div
              key={d.title}
              className="bg-[var(--paper)] p-8 md:p-10"
            >
              <div className="display-italic text-[var(--accent)] text-3xl mb-3">
                {String(i + 1).padStart(2, "0")}.
              </div>
              <h3 className="display text-xl md:text-2xl tracking-tightest leading-tight mb-3">
                {d.title}
              </h3>
              <p className="body-prose-sm">{d.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   GALLERY — placeholders for NDA-safe representation
   ─────────────────────────────────────────────────────── */
export function Gallery({
  items,
  noStamp,
}: {
  items: GalleryItem[];
  noStamp: boolean;
}) {
  return (
    <section className="border-b border-[var(--rule)]">
      <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="flex items-baseline justify-between mb-10 gap-6">
          <div className="section-tag">▸ THE WORK</div>
          {!noStamp && (
            <span className="mono text-[var(--accent)]">REDACTED · NDA</span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {items.map((item, i) => (
            <figure
              key={i}
              className={`${item.span === 2 ? "md:col-span-2" : ""}`}
            >
              <PlaceholderTile kind={item.kind} className="aspect-[4/3]" />
              <figcaption className="mt-3">
                <div className="mono">{item.caption}</div>
                {item.note && (
                  <p className="body-prose-sm mt-1">{item.note}</p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   OUTCOMES — the payoff, on dark ink
   ─────────────────────────────────────────────────────── */
export function Outcomes({ outcomes }: { outcomes: ProjectMetric[] }) {
  return (
    <section className="border-b border-[var(--rule)] bg-[var(--ink)] text-white">
      <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="mono text-white/60 mb-10">▸ OUTCOMES</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {outcomes.map((m, i) => (
            <div key={i} className="border-l-2 border-[var(--paper)]/20 pl-6">
              <div className="figure display text-[64px] md:text-[88px] lg:text-[112px] leading-[0.95] text-[var(--accent)]">
                <CountUp value={m.value} />
              </div>
              <div className="mono text-white/70 mt-2 max-w-[220px] leading-snug">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   PUBLIC SECTIONS — extra prose blocks
   ─────────────────────────────────────────────────────── */
export function PublicSections({ sections }: { sections: ProjectSection[] }) {
  return (
    <section className="border-b border-[var(--rule)]">
      <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24 space-y-14 md:space-y-20">
        {sections.map((s, i) => (
          <div
            key={i}
            className="grid md:grid-cols-12 gap-8 md:gap-12 border-t border-[var(--rule)] pt-10 first:border-t-0 first:pt-0"
          >
            <div className="md:col-span-4">
              <div className="section-tag mb-3">§ {String(i + 1).padStart(2, "0")}</div>
              <h2 className="display text-3xl md:text-5xl tracking-tightest">
                {s.heading}
              </h2>
            </div>
            <div className="md:col-span-8">
              <p className="body-prose">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   TAGS
   ─────────────────────────────────────────────────────── */
export function Tags({ tags }: { tags: string[] }) {
  return (
    <section className="border-b border-[var(--rule)]">
      <div className="max-w-page mx-auto px-6 md:px-10 py-12">
        <div className="flex flex-wrap items-center gap-3">
          <span className="mono mr-2">DOMAINS</span>
          {tags.map((t) => (
            <span
              key={t}
              className="mono border border-[var(--rule)] px-3 py-1.5"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   LOCKED CTA — request access
   ─────────────────────────────────────────────────────── */
export function LockedCTA({ project }: { project: Project }) {
  return (
    <section className="border-b border-[var(--rule)] bg-[var(--paper-2)]">
      <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="border-2 border-[var(--rule)] p-8 md:p-14 bg-[var(--paper)]">
          <div className="section-tag mb-6">
            ▸ WANT THE UNREDACTED VERSION?
          </div>
          <h3 className="display text-3xl md:text-5xl tracking-tightest mb-6 max-w-2xl">
            The full case study —
            <span className="display-italic text-[var(--accent)]">
              {" "}screens, decisions,{" "}
            </span>
            trade-offs — is shared on request.
          </h3>
          <p className="body-prose mb-10 max-w-xl">
            Most of this work sits behind an enterprise NDA. Drop me a line and
            I&rsquo;ll share the deck — including the unhappy paths, the dead
            ends, and the thinking behind each decision.
          </p>
          <RequestAccess projectTitle={project.title} />
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   NEXT PROJECT — turn-the-page
   ─────────────────────────────────────────────────────── */
export function NextProject({ project }: { project: Project }) {
  return (
    <section className="border-b border-[var(--rule)]">
      <Link
        href={`/work/${project.slug}`}
        aria-label={`Next case study in the folio: ${project.title}`}
        className="block group hover:bg-[var(--ink)] focus-visible:bg-[var(--ink)] hover:text-white focus-visible:text-white transition-colors"
      >
        <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="mono mb-4 text-[var(--muted)] group-hover:!text-white/70 group-focus-visible:!text-white/70 transition-colors">
              ▸ NEXT IN THE FOLIO
            </div>
            <h3 className="display text-[10vw] md:text-[5.6vw] lg:text-[80px] tracking-tightest leading-tight group-hover:!text-white group-focus-visible:!text-white transition-colors">
              {project.title}
              {/* Period stays vermilion in both states — the brand mark
                  reads cleanly against ink and against paper. */}
              <span className="text-[var(--accent)]">.</span>
            </h3>
            <p className="body-prose-sm mt-2 group-hover:!text-white/80 group-focus-visible:!text-white/80 transition-colors">
              {project.subtitle}
            </p>
          </div>
          <span
            aria-hidden
            className="display text-5xl md:text-8xl group-hover:!text-white group-focus-visible:!text-white group-hover:translate-x-3 transition-all"
          >
            →
          </span>
        </div>
      </Link>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   PLACEHOLDER TILE — abstract NDA-safe representation
   ─────────────────────────────────────────────────────── */
function PlaceholderTile({
  kind,
  className = "",
}: {
  kind?: PlaceholderKind;
  className?: string;
}) {
  if (!kind) return null;
  return (
    <div
      className={`relative bg-[var(--paper-2)] border border-[var(--rule-soft)] overflow-hidden ${className}`}
      aria-hidden
    >
      {/* Subtle paper-grid pattern beneath the shape */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`pt-grid-${kind}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--ink-soft)" strokeWidth="0.4" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#pt-grid-${kind})`} />
      </svg>

      {/* Corner registration marks */}
      <RegMarks />

      <div className="absolute inset-0 flex items-center justify-center text-[var(--muted)]">
        <PlaceholderShape kind={kind} />
      </div>
      <div className="absolute top-3 left-3 mono text-[var(--accent)]">▸ {kind}</div>
      <div className="absolute bottom-3 right-3 mono opacity-60">
        ↺ representative
      </div>
    </div>
  );
}

function RegMarks() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
      <g stroke="var(--ink-soft)" strokeWidth="1" opacity="0.45">
        <line x1="6" y1="6" x2="20" y2="6" />
        <line x1="6" y1="6" x2="6" y2="20" />
        <line x1="100%" y1="6" x2="calc(100% - 14px)" y2="6" />
        <line x1="100%" y1="6" x2="100%" y2="20" />
        <line x1="6" y1="100%" x2="20" y2="100%" />
        <line x1="6" y1="100%" x2="6" y2="calc(100% - 14px)" />
        <line x1="100%" y1="100%" x2="calc(100% - 14px)" y2="100%" />
        <line x1="100%" y1="100%" x2="100%" y2="calc(100% - 14px)" />
      </g>
    </svg>
  );
}

function PlaceholderShape({ kind }: { kind: PlaceholderKind }) {
  const stroke = "var(--ink-soft)";
  const accent = "var(--accent)";
  const opacity = 0.55;
  switch (kind) {
    case "dashboard":
      return (
        <svg viewBox="0 0 200 140" width="80%" height="80%" opacity={opacity}>
          <rect x="0" y="0" width="200" height="20" fill={stroke} opacity="0.15" />
          <rect x="0" y="28" width="60" height="112" fill={stroke} opacity="0.08" />
          <rect x="68" y="28" width="60" height="40" fill={accent} opacity="0.5" />
          <rect x="136" y="28" width="64" height="40" fill={stroke} opacity="0.2" />
          <rect x="68" y="76" width="132" height="64" fill={stroke} opacity="0.12" />
        </svg>
      );
    case "list":
      return (
        <svg viewBox="0 0 200 140" width="80%" height="80%" opacity={opacity}>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(0,${i * 28})`}>
              <rect x="0" y="0" width="200" height="22" fill={stroke} opacity="0.08" />
              <circle cx="14" cy="11" r="4" fill={accent} opacity={i === 2 ? 1 : 0.4} />
              <rect x="28" y="7" width="80" height="8" fill={stroke} opacity="0.3" />
              <rect x="120" y="7" width="60" height="8" fill={stroke} opacity="0.2" />
            </g>
          ))}
        </svg>
      );
    case "form":
      return (
        <svg viewBox="0 0 200 140" width="80%" height="80%" opacity={opacity}>
          <rect x="20" y="20" width="160" height="20" fill={stroke} opacity="0.1" />
          <rect x="20" y="50" width="160" height="20" fill={stroke} opacity="0.1" />
          <rect x="20" y="80" width="160" height="40" fill={stroke} opacity="0.1" />
          <rect x="120" y="100" width="60" height="20" fill={accent} opacity="0.7" />
        </svg>
      );
    case "mobile":
      return (
        <svg viewBox="0 0 200 140" width="80%" height="80%" opacity={opacity}>
          <rect x="80" y="10" width="40" height="120" rx="6" fill="none" stroke={stroke} strokeWidth="1.5" />
          <rect x="86" y="22" width="28" height="60" fill={accent} opacity="0.4" />
          <rect x="86" y="88" width="28" height="6" fill={stroke} opacity="0.4" />
          <rect x="86" y="100" width="22" height="6" fill={stroke} opacity="0.3" />
        </svg>
      );
    case "flow":
      return (
        <svg viewBox="0 0 200 140" width="80%" height="80%" opacity={opacity}>
          <rect x="10" y="55" width="40" height="30" fill={stroke} opacity="0.2" />
          <path d="M52 70 L78 70" stroke={accent} strokeWidth="1.5" />
          <rect x="80" y="55" width="40" height="30" fill={accent} opacity="0.5" />
          <path d="M122 70 L148 70" stroke={accent} strokeWidth="1.5" />
          <rect x="150" y="55" width="40" height="30" fill={stroke} opacity="0.2" />
        </svg>
      );
    case "journey":
      return (
        <svg viewBox="0 0 200 140" width="80%" height="80%" opacity={opacity}>
          <path d="M10 110 Q60 30 100 80 T190 50" stroke={accent} strokeWidth="2" fill="none" />
          {[10, 60, 100, 140, 190].map((x, i) => (
            <circle key={i} cx={x} cy={[110, 50, 80, 60, 50][i]} r="4" fill={stroke} />
          ))}
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 200 140" width="80%" height="80%" opacity={opacity}>
          {[20, 50, 80, 110, 140, 170].map((x, i) => (
            <rect key={i} x={x} y={140 - (i + 1) * 18} width="22" height={(i + 1) * 18} fill={i === 4 ? accent : stroke} opacity={i === 4 ? 0.7 : 0.3} />
          ))}
        </svg>
      );
    case "modal":
      return (
        <svg viewBox="0 0 200 140" width="80%" height="80%" opacity={opacity}>
          <rect x="0" y="0" width="200" height="140" fill={stroke} opacity="0.05" />
          <rect x="40" y="30" width="120" height="80" fill="none" stroke={accent} strokeWidth="1.5" />
          <rect x="50" y="42" width="100" height="10" fill={stroke} opacity="0.4" />
          <rect x="50" y="60" width="80" height="6" fill={stroke} opacity="0.3" />
          <rect x="50" y="72" width="60" height="6" fill={stroke} opacity="0.3" />
          <rect x="100" y="92" width="50" height="14" fill={accent} opacity="0.8" />
        </svg>
      );
    default:
      return null;
  }
}
