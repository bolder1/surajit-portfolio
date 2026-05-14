/**
 * Rich case-study sections — UX Laws, Research methods,
 * Design Decisions (with rationale + trade-off), Figma Screens.
 *
 * These add a "designer's reasoning" layer on top of the existing
 * problem/process/outcome blocks. Each component is a server component;
 * iframes render Figma embeds when a public Figma URL is present.
 *
 * Reading-time target per case study: 2–5 minutes.
 *
 * Accessibility:
 *   - All section landmarks have aria-labelledby pointing at the heading
 *   - Iframes carry descriptive titles
 *   - Decoration glyphs (◇ ◆ ↗) are aria-hidden
 *   - Figure captions are real <figcaption> elements
 */

import type {
  UXLawApplied,
  ResearchMethod,
  DesignDecision,
  CaseStudyScreen,
} from "@/lib/types";

/* ──────────────────────────────────────────────────────────
   UX LAWS APPLIED
   ─────────────────────────────────────────────────────── */
export function UXLaws({ laws }: { laws: UXLawApplied[] }) {
  return (
    <section
      className="border-b border-[var(--rule)]"
      aria-labelledby="uxlaws-heading"
    >
      <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="section-tag mb-8">▸ UX LAWS APPLIED</div>
        <h2
          id="uxlaws-heading"
          className="display text-[10vw] md:text-[5.4vw] lg:text-[72px] tracking-tightest leading-[0.95] mb-12 max-w-3xl"
        >
          The principles{" "}
          <span className="display-italic text-[var(--accent)]">
            doing the work underneath
          </span>
          .
        </h2>

        <ol className="border-t-2 border-[var(--rule)]">
          {laws.map((l, i) => (
            <li
              key={l.law}
              className="grid md:grid-cols-12 gap-6 md:gap-10 border-b border-[var(--rule-soft)] py-7 md:py-9"
            >
              <div className="md:col-span-3">
                <div className="mono text-[var(--muted)] mb-1.5">
                  LAW № {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="display text-[24px] md:text-[28px] tracking-tightest leading-tight">
                  {l.law}
                </h3>
              </div>
              <div className="md:col-span-4">
                <p className="mono text-[var(--accent)] mb-2">
                  THE PRINCIPLE
                </p>
                <p className="body-prose-sm">{l.principle}</p>
              </div>
              <div className="md:col-span-5">
                <p className="mono text-[var(--accent)] mb-2">
                  HOW I APPLIED IT
                </p>
                <p className="body-prose-sm">{l.applied}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   RESEARCH METHODS + FINDINGS
   ─────────────────────────────────────────────────────── */
export function ResearchMethods({ research }: { research: ResearchMethod[] }) {
  return (
    <section
      className="border-b border-[var(--rule)] bg-[var(--paper-2)]"
      aria-labelledby="research-heading"
    >
      <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="section-tag mb-8">▸ RESEARCH</div>
        <h2
          id="research-heading"
          className="display text-[10vw] md:text-[5.4vw] lg:text-[72px] tracking-tightest leading-[0.95] mb-12 max-w-3xl"
        >
          What I asked, who I asked,{" "}
          <span className="display-italic text-[var(--accent)]">
            what came back
          </span>
          .
        </h2>

        <div className="grid md:grid-cols-3 gap-px bg-[var(--rule)] border border-[var(--rule)]">
          {research.map((r, i) => (
            <article
              key={r.method + i}
              className="bg-[var(--paper)] p-6 md:p-8 flex flex-col gap-4"
            >
              <div className="flex items-baseline justify-between">
                <span className="mono text-[var(--accent)]">
                  METHOD № {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden className="diamond" />
              </div>
              <h3 className="display text-[22px] md:text-[26px] tracking-tightest leading-[1.1]">
                {r.method}
              </h3>
              <div className="mono text-[var(--ink-soft)]">{r.sample}</div>
              <p className="body-prose-sm mt-auto pt-4 border-t border-[var(--rule-soft)]">
                <span className="mono text-[var(--accent)] block mb-1.5">
                  WHAT IT SURFACED
                </span>
                {r.finding}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   DESIGN DECISIONS (with rationale + trade-off)
   Splits visual vs functional vs system decisions if both are
   provided; otherwise renders as one list.
   ─────────────────────────────────────────────────────── */
export function DesignDecisionsRich({
  functional,
  visual,
}: {
  functional?: DesignDecision[];
  visual?: DesignDecision[];
}) {
  const groups = [
    { title: "Functional", body: "What the screen has to do.", items: functional ?? [] },
    { title: "Visual", body: "How it looks and feels.", items: visual ?? [] },
  ].filter((g) => g.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <section
      className="border-b border-[var(--rule)]"
      aria-labelledby="decisions-heading"
    >
      <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="section-tag mb-8">▸ DESIGN DECISIONS</div>
        <h2
          id="decisions-heading"
          className="display text-[10vw] md:text-[5.4vw] lg:text-[72px] tracking-tightest leading-[0.95] mb-12 max-w-3xl"
        >
          Choices that{" "}
          <span className="display-italic text-[var(--accent)]">
            actually had to be made
          </span>
          .
        </h2>

        {groups.map((g) => (
          <div key={g.title} className="mb-14 md:mb-20 last:mb-0">
            <div className="flex items-baseline justify-between border-b-2 border-[var(--rule)] pb-3 mb-8">
              <h3 className="display text-[24px] md:text-[32px] tracking-tightest">
                {g.title} <span className="display-italic">decisions</span>
              </h3>
              <span className="mono text-[var(--muted)]">{g.body}</span>
            </div>

            <ol className="space-y-7 md:space-y-9">
              {g.items.map((d, i) => (
                <li
                  key={d.decision}
                  className="grid md:grid-cols-12 gap-6 md:gap-10"
                >
                  <div className="md:col-span-1">
                    <span className="display-italic text-[40px] md:text-[56px] text-[var(--accent)] leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="md:col-span-5">
                    <h4 className="display text-[22px] md:text-[28px] tracking-tightest leading-[1.1]">
                      {d.decision}
                    </h4>
                  </div>
                  <div className="md:col-span-6">
                    <div>
                      <span className="mono text-[var(--accent)] block mb-1.5">
                        WHY THIS WON
                      </span>
                      <p className="body-prose-sm">{d.rationale}</p>
                    </div>
                    {d.tradeoff && (
                      <div className="mt-4 pt-4 border-t border-[var(--rule-soft)]">
                        <span className="mono text-[var(--muted)] block mb-1.5">
                          THE TRADE-OFF
                        </span>
                        <p className="body-prose-sm italic">{d.tradeoff}</p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   FIGMA SCREENS — embeds when a Figma URL is given,
   placeholders when not. Each screen sits as its own <figure>
   with caption + optional note.

   Two Figma URL shapes need different handling:
     - figma.com/design/...  → iframe via /embed query (works)
     - figma.com/make/...    → no embed support; render a
       branded "Open prototype" CTA tile with a "live prototype"
       label so it's clearly a click-out, not a broken embed.
   ─────────────────────────────────────────────────────── */
function figmaEmbedSrc(url: string) {
  return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(
    url
  )}`;
}

function isFigmaMakeUrl(url: string) {
  return /^https?:\/\/(www\.)?figma\.com\/make\//.test(url);
}

export function FigmaScreens({
  screens,
  noStamp,
}: {
  screens: CaseStudyScreen[];
  noStamp?: boolean;
}) {
  return (
    <section
      className="border-b border-[var(--rule)]"
      aria-labelledby="screens-heading"
    >
      <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="flex items-baseline justify-between mb-10 gap-6">
          <div>
            <div className="section-tag mb-4">▸ THE WORK</div>
            <h2
              id="screens-heading"
              className="display text-[10vw] md:text-[5.4vw] lg:text-[72px] tracking-tightest leading-[0.95] max-w-3xl"
            >
              Screens, in their{" "}
              <span className="display-italic text-[var(--accent)]">
                designed shape
              </span>
              .
            </h2>
          </div>
          {!noStamp && (
            <span className="mono text-[var(--accent)]">
              REDACTED · NDA
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {screens.map((s, i) => (
            <figure
              key={s.caption + i}
              className={s.span === 2 ? "md:col-span-2" : ""}
            >
              <div className="relative aspect-[4/3] bg-[var(--paper-2)] border border-[var(--rule-soft)] overflow-hidden">
                {/* Static image takes priority: when both are present
                    we show the image and use figmaUrl as a deep-link
                    in the caption below. */}
                {s.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.image.src}
                    alt={s.image.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : s.figmaUrl && !isFigmaMakeUrl(s.figmaUrl) ? (
                  /* Figma design files iframe-embed cleanly */
                  <iframe
                    title={s.caption}
                    src={figmaEmbedSrc(s.figmaUrl)}
                    className="w-full h-full"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : s.figmaUrl && isFigmaMakeUrl(s.figmaUrl) ? (
                  /* Make prototypes can't iframe — render a CTA tile */
                  <a
                    href={s.figmaUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`Open the live prototype: ${s.caption}, opens in new tab`}
                    className="group block w-full h-full p-6 md:p-10 flex flex-col justify-between hover:bg-[var(--ink)] hover:text-white focus-visible:bg-[var(--ink)] focus-visible:text-white transition-colors"
                  >
                    <div className="flex items-baseline justify-between mono">
                      <span className="text-[var(--accent)]">▸ LIVE PROTOTYPE</span>
                      <span className="opacity-60">FIGMA MAKE</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <span
                        aria-hidden
                        className="display text-[60px] md:text-[80px] tracking-tightest leading-none group-hover:translate-x-2 transition-transform"
                      >
                        ↗
                      </span>
                    </div>
                    <div className="display-italic text-[20px] md:text-[26px] leading-tight">
                      Open the prototype in a new tab.
                    </div>
                  </a>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--muted)] mono">
                    {s.placeholder ?? "preview"}
                  </div>
                )}
                {s.image?.redacted && (
                  <div className="absolute inset-0 backdrop-blur-sm bg-[var(--paper)]/30 flex items-center justify-center">
                    <span className="mono text-[var(--accent)] border-2 border-[var(--accent)] px-3 py-1.5">
                      REDACTED · NDA
                    </span>
                  </div>
                )}
              </div>
              <figcaption className="mt-3">
                <div className="mono text-[var(--accent)]">{s.caption}</div>
                {s.note && (
                  <p className="body-prose-sm mt-1.5">{s.note}</p>
                )}
                {s.figmaUrl && (
                  <a
                    href={s.figmaUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mono link inline-block mt-2"
                  >
                    OPEN IN FIGMA ↗
                  </a>
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
   READING TIME / TL;DR — sits at the top of a case study so
   a recruiter knows the time investment up front.
   ─────────────────────────────────────────────────────── */
export function CaseStudyTLDR({
  readingTime,
  oneLiner,
}: {
  readingTime: string;
  oneLiner: string;
}) {
  return (
    <section
      className="border-b border-[var(--rule)] bg-[var(--paper-2)]"
      aria-label="TL;DR"
    >
      <div className="max-w-page mx-auto px-6 md:px-10 py-7 md:py-9 grid md:grid-cols-12 gap-6 items-baseline">
        <div className="md:col-span-2 mono text-[var(--accent)]">
          ▸ TL;DR · {readingTime.toUpperCase()}
        </div>
        <p className="md:col-span-10 display-italic text-[22px] md:text-[28px] leading-[1.2] text-[var(--ink)]">
          {oneLiner}
        </p>
      </div>
    </section>
  );
}
