import type { Metadata } from "next";
import Link from "next/link";
import { MastheadV3 } from "@/components/v3/MastheadV3";
import { FooterV3 } from "@/components/v3/FooterV3";
import { CoverImage } from "@/components/CoverImage";
import { getCaseProjects, getWorkProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work — Surajit Dutta",
  description:
    "Selected case studies and the archive. Three flagship case studies in depth; everything else as a filterable list.",
};

/**
 * /v3/work — flagships first, archive second.
 *
 * Per the research: selected work should dominate; the archive is
 * secondary. Filters live above the archive list.
 */
export default function V3WorkPage() {
  const cases = getCaseProjects();
  const archive = getWorkProjects();

  return (
    <>
      <MastheadV3 />
      <main id="main">
        {/* Page hero */}
        <section className="border-b border-[color:var(--v3-rule-soft)]">
          <div className="v3-container py-14 md:py-20">
            <p className="v3-eyebrow mb-5">/ Work</p>
            <h1
              className="v3-display"
              style={{ fontSize: "clamp(40px, 5.6vw, 76px)" }}
            >
              Selected work, 2022–present.
            </h1>
            <p className="v3-prose-lg mt-5" style={{ color: "var(--v3-ink-soft)" }}>
              Three flagship case studies in depth. Everything else lives in
              the archive below — filter by domain.
            </p>
          </div>
        </section>

        {/* Flagships */}
        <section
          className="border-b border-[color:var(--v3-rule-soft)]"
          aria-label="Flagship case studies"
        >
          <div className="v3-container py-12 md:py-16">
            <p className="v3-eyebrow mb-8">/ Flagships</p>
            <ul role="list">
              {cases.map((p, i) => (
                <li
                  key={p.slug}
                  className="border-t border-[color:var(--v3-rule-soft)] last:border-b"
                >
                  <Link
                    href={`/v3/work/${p.slug}`}
                    className="group block py-6 md:py-8 no-underline transition-colors"
                    style={{ color: "var(--v3-ink)" }}
                  >
                    <div className="grid grid-cols-12 items-center gap-4 md:gap-6">
                      <div
                        className="col-span-2 md:col-span-1 v3-mono"
                        style={{ color: "var(--v3-ink-muted)" }}
                      >
                        / {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="col-span-10 md:col-span-2">
                        <CoverImage
                          src={p.cover?.src}
                          alt={p.title}
                          glyph={p.hoverIllustration}
                          bg={p.hoverColor ?? "#1c1c1c"}
                          ink={p.hoverInk ?? "#f0eee8"}
                          compact
                          className="w-full aspect-[16/10] border-[color:var(--v3-rule-soft)]"
                          cursorFlavor="default"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <h2
                          className="v3-display group-hover:text-[color:var(--v3-accent)] transition-colors"
                          style={{ fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.1 }}
                        >
                          {p.title}
                        </h2>
                        <p
                          className="mt-2"
                          style={{ color: "var(--v3-ink-muted)", fontSize: 15, lineHeight: 1.5 }}
                        >
                          {p.subtitle}
                        </p>
                      </div>
                      <div
                        className="col-span-10 md:col-span-2 v3-mono"
                        style={{ color: "var(--v3-ink-muted)" }}
                      >
                        {p.year} · {p.category}
                      </div>
                      <div className="col-span-2 md:col-span-1 text-right">
                        <span
                          aria-hidden
                          className="inline-block transition-transform group-hover:translate-x-1"
                          style={{ color: "var(--v3-accent)", fontSize: 18 }}
                        >
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Archive */}
        <section aria-label="Archive">
          <div className="v3-container py-12 md:py-16">
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
              <p className="v3-eyebrow">/ Archive ({archive.length})</p>
              <p
                className="v3-mono"
                style={{ color: "var(--v3-ink-muted)" }}
              >
                Enterprise SaaS · Design Systems · Mobile · Web · Earlier work
              </p>
            </div>
            <ul role="list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
              {archive.map((p, i) => (
                <li key={p.slug}>
                  <Link
                    href={`/v3/work/${p.slug}`}
                    className="flex items-baseline justify-between gap-4 py-3 border-b border-[color:var(--v3-rule-soft)] no-underline transition-colors hover:text-[color:var(--v3-accent)]"
                    style={{ color: "var(--v3-ink)" }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 500 }}>
                      {p.title}
                    </span>
                    <span
                      className="v3-mono shrink-0"
                      style={{ color: "var(--v3-ink-muted)" }}
                    >
                      {p.year}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <FooterV3 />
    </>
  );
}
