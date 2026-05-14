import type { Metadata } from "next";
import { Masthead } from "@/components/Masthead";
import { Folio } from "@/components/Folio";
import { WorkArchive } from "@/components/WorkArchive";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work — Full archive",
  description:
    "57 projects across enterprise SaaS, design systems, mobile, web, and websites. Filter by domain.",
};

export default function WorkPage() {
  const projects = getAllProjects();
  const total = projects.length;

  return (
    <>
      <Masthead variant="compact" />
      <main id="main" className="pb-20">
        {/* Work-page hero */}
        <section className="border-b border-[var(--rule)]">
          <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24">
            <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
              <div className="md:col-span-8">
                <div className="section-tag mb-6">
                  ▸ WORK &middot; THE ARCHIVE
                </div>
                <h1 className="display text-[12vw] md:text-[8vw] lg:text-[112px] tracking-tightest leading-[0.9]">
                  Everything,{" "}
                  <span className="display-italic text-[var(--accent)]">
                    at the desk
                  </span>
                  .
                </h1>
              </div>
              <div className="md:col-span-4">
                <p className="body-prose drop-cap">
                  Every shipped artifact, in one place. {total} projects from
                  three-plus years of practice. Enterprise work at miniOrange
                  carries the (NDA) marker; the rest links out to the live
                  Figma file or hosted prototype.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How I read this portfolio — recruiter cheat-sheet */}
        <section className="border-b border-[var(--rule)] bg-[var(--paper-2)]">
          <div className="max-w-page mx-auto px-6 md:px-10 py-10 md:py-12">
            <div className="flex items-baseline justify-between mb-6 gap-6">
              <div>
                <p className="mono mb-2 text-[var(--accent)]">
                  ▸ HOW TO READ THIS ARCHIVE
                </p>
                <h2 className="display text-[7vw] md:text-[3.6vw] lg:text-[44px] tracking-tightest leading-[1]">
                  Three kinds of entry, three reading paths.
                </h2>
              </div>
              <span className="hidden md:inline mono text-[var(--muted)]">
                ~ 30 SEC TO ORIENT
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-px bg-[var(--rule)] border border-[var(--rule)]">
              <div className="bg-[var(--paper)] p-5 md:p-6">
                <div className="mono text-[var(--accent)] mb-2">
                  01 · NDA CASE STUDIES
                </div>
                <p className="body-prose-sm">
                  miniOrange enterprise work — IAM, PAM, IGA, UEM, ITDR.
                  Detailed write-up with problem, process, UX laws, decisions,
                  and trade-offs. Specific outcome metrics are confidential and
                  shared on request.
                </p>
              </div>
              <div className="bg-[var(--paper)] p-5 md:p-6">
                <div className="mono text-[var(--accent)] mb-2">
                  02 · FEATURED EXTERNAL
                </div>
                <p className="body-prose-sm">
                  Public mobile and web apps from earlier roles. Case studies
                  in progress; in the meantime, click through to the live
                  Figma file. Note the year and employer in each card.
                </p>
              </div>
              <div className="bg-[var(--paper)] p-5 md:p-6">
                <div className="mono text-[var(--accent)] mb-2">
                  03 · WEBSITE ARCHIVE
                </div>
                <p className="body-prose-sm">
                  Marketing sites, landers, brand work — mostly from the
                  Fortmindz era. Links out to Figma directly. Useful for
                  range; not a substitute for the case studies in 01.
                </p>
              </div>
            </div>
          </div>
        </section>

        <WorkArchive projects={projects} />
      </main>
      <Folio pageNum="02" />
    </>
  );
}
