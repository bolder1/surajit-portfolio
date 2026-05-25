import type { Metadata } from "next";
import { Masthead } from "@/components/Masthead";
import { Folio } from "@/components/Folio";
import { WorkGrid } from "@/components/WorkGrid";
import { getWorkProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work — Surajit Dutta",
  description:
    "Everything but the case studies. Hover any tile — the whole page changes color.",
};

export default function WorkPage() {
  const projects = getWorkProjects();

  return (
    <>
      <Masthead variant="compact" />
      <main id="main" data-cursor="work" className="pb-20">
        {/* Work hero */}
        <section className="border-b border-[var(--rule-soft)]">
          <div className="swiss-container py-14 md:py-20">
            <p className="section-tag mb-6">/work — the archive</p>
            <div className="swiss-grid items-end">
              <div className="col-span-12 md:col-span-8">
                <h1 className="display text-[14vw] md:text-[9vw] lg:text-[128px]">
                  everything else.
                </h1>
              </div>
              <div className="col-span-12 md:col-span-4 md:pb-2">
                <p className="body-prose">
                  {projects.length} pieces. Mostly enterprise admin
                  surfaces — IAM, PAM, IGA, UEM. A few side projects in
                  between. Hover any tile, the whole page shifts to the
                  project&apos;s color. Click for the carousel.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Black-tile grid */}
        <WorkGrid projects={projects} />

        {/* Footer hint */}
        <section className="border-t border-[var(--rule-soft)]">
          <div className="swiss-container py-10 md:py-14">
            <div className="flex flex-wrap items-center justify-between gap-4 mono">
              <span className="text-[var(--muted)]">
                want the long form? read the case studies.
              </span>
              <a
                href="/cases"
                className="link inline-flex items-center gap-2"
              >
                three case studies → <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Folio pageNum="04" />
    </>
  );
}
