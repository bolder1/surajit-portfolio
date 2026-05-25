import type { Metadata } from "next";
import Link from "next/link";
import { Masthead } from "@/components/Masthead";
import { Folio } from "@/components/Folio";
import { getCaseProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Cases — Surajit Dutta",
  description:
    "Three case studies in depth. Research, design decisions, trade-offs, and outcomes.",
};

/**
 * /cases — the three long-form case studies.
 *
 * Intentionally short list page; the meat is in /cases/[slug] (which
 * we route to /work/[slug] under the hood for now to reuse the
 * existing CaseStudy components).
 */
export default function CasesPage() {
  const cases = getCaseProjects();

  return (
    <>
      <Masthead variant="compact" />
      <main id="main" className="pb-20">
        <section className="border-b border-[var(--rule-soft)]">
          <div className="swiss-container py-14 md:py-24">
            <p className="section-tag mb-6">/cases — depth over breadth</p>
            <div className="swiss-grid items-end">
              <div className="col-span-12 md:col-span-8">
                <h1 className="display text-[14vw] md:text-[8vw] lg:text-[128px]">
                  three case studies.
                </h1>
              </div>
              <div className="col-span-12 md:col-span-4 md:pb-2">
                <p className="body-prose">
                  The portfolio is full of projects. These three earn the
                  full write-up: research, design decisions, trade-offs,
                  outcomes. Skim the others in{" "}
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
            </div>
          </div>
        </section>

        <ul role="list">
          {cases.map((p, i) => (
            <li key={p.slug} className="border-b border-[var(--rule-soft)]">
              <Link
                href={`/cases/${p.slug}`}
                className="group block py-10 md:py-14 hover:bg-[var(--paper-2)] transition-colors"
              >
                <div className="swiss-container">
                  <div className="swiss-grid items-baseline">
                    <div className="col-span-2 md:col-span-1 mono-accent">
                      0{i + 1}
                    </div>
                    <div className="col-span-10 md:col-span-7">
                      <h2 className="display text-[34px] md:text-[56px] lg:text-[72px] leading-[1] group-hover:text-[var(--accent)] transition-colors">
                        {p.title}
                      </h2>
                      <p className="body-prose mt-3 max-w-2xl">{p.subtitle}</p>
                    </div>
                    <div className="col-span-12 md:col-span-3 mt-4 md:mt-0">
                      <p className="mono text-[var(--muted)]">{p.year}</p>
                      <p className="mono text-[var(--muted)] mt-1">{p.role}</p>
                      {p.readingTime && (
                        <p className="mono mt-3 text-[var(--ink)]">
                          {p.readingTime}
                        </p>
                      )}
                    </div>
                    <div className="col-span-12 md:col-span-1 md:text-right mt-4 md:mt-0">
                      <span className="mono-accent group-hover:translate-x-1 inline-block transition-transform">
                        read →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Folio pageNum="03" />
    </>
  );
}
