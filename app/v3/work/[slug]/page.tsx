import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MastheadV3 } from "@/components/v3/MastheadV3";
import { FooterV3 } from "@/components/v3/FooterV3";
import {
  ProjectHero,
  ProjectMeta,
  Summary,
  Problem,
  Quotes,
  BeforeAfterSection,
  ProcessTimeline,
  Scenarios,
  Decisions,
  Gallery,
  Outcomes,
  PublicSections,
  Tags,
  LockedCTA,
  NextProject,
} from "@/components/CaseStudy";
import {
  UXLaws,
  ResearchMethods,
  DesignDecisionsRich,
  FigmaScreens,
  CaseStudyTLDR,
} from "@/components/CaseStudyRich";
import { WorkLean } from "@/components/WorkLean";
import { getProject, getAllSlugs, projects } from "@/lib/projects";
import type { Project } from "@/lib/types";

/**
 * /v3/work/[slug] — thin wrapper around the shared case-study renderer.
 *
 * Same branching logic as /work/[slug]:
 *   - case-track  → full CaseStudy + CaseStudyRich sections
 *   - work-track  → WorkLean (cover + carousel + meta)
 *
 * Difference vs V1: renders MastheadV3 + FooterV3 instead of V1
 * masthead/folio. The case-study component sequence will be reordered
 * to the 10-section recruiter template in Phase B — that reorder
 * benefits this route automatically since it shares the renderer.
 */
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return { title: "Not found" };
  return {
    title: `${project.title} — ${project.subtitle}`,
    description: project.summary,
  };
}

export default async function V3CaseStudyPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  /* Next project nav — cycle through chapter pages only. */
  const ordered = [...projects]
    .filter((p) => p.access !== "external")
    .sort((a, b) => a.order - b.order);
  const idx = ordered.findIndex((p) => p.slug === slug);
  const next: Project = ordered[(idx + 1) % ordered.length];

  const isLocked = project.access === "locked";
  const noStamp = project.access === "public";

  if (project.track === "work") {
    return (
      <>
        <MastheadV3 />
        <main id="main">
          <WorkLean project={project} next={next} />
        </main>
        <FooterV3 />
      </>
    );
  }

  return (
    <>
      <MastheadV3 />
      <main id="main">
        <ProjectHero project={project} />
        <ProjectMeta project={project} />

        {project.summary && project.readingTime && (
          <CaseStudyTLDR
            readingTime={project.readingTime}
            oneLiner={project.summary}
          />
        )}

        {project.summary && <Summary text={project.summary} />}
        {project.problem && <Problem text={project.problem} />}
        {project.quotes?.length ? <Quotes quotes={project.quotes} /> : null}
        {project.beforeAfter && (
          <BeforeAfterSection data={project.beforeAfter} />
        )}
        {project.research?.length ? (
          <ResearchMethods research={project.research} />
        ) : null}
        {project.process?.length ? (
          <ProcessTimeline phases={project.process} />
        ) : null}
        {project.scenarios?.length ? (
          <Scenarios scenarios={project.scenarios} />
        ) : null}
        {project.uxLaws?.length ? <UXLaws laws={project.uxLaws} /> : null}
        {(project.designDecisions?.length || project.visualDecisions?.length) ? (
          <DesignDecisionsRich
            functional={project.designDecisions}
            visual={project.visualDecisions}
          />
        ) : null}
        {project.decisions?.length ? (
          <Decisions decisions={project.decisions} />
        ) : null}
        {project.screens?.length ? (
          <FigmaScreens screens={project.screens} noStamp={noStamp} />
        ) : null}
        {project.gallery?.length ? (
          <Gallery items={project.gallery} noStamp={noStamp} />
        ) : null}
        {project.outcomes?.length ? (
          <Outcomes outcomes={project.outcomes} />
        ) : null}
        {project.publicSections?.length ? (
          <PublicSections sections={project.publicSections} />
        ) : null}

        <Tags tags={project.tags} />

        {isLocked && <LockedCTA project={project} />}

        <NextProject project={next} />
      </main>
      <FooterV3 />
    </>
  );
}
