import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Masthead } from "@/components/Masthead";
import { Folio } from "@/components/Folio";
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

export default async function CaseStudyPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  /* Next-project nav cycles through chapter pages only — skip externals. */
  const ordered = [...projects]
    .filter((p) => p.access !== "external")
    .sort((a, b) => a.order - b.order);
  const idx = ordered.findIndex((p) => p.slug === slug);
  const next: Project = ordered[(idx + 1) % ordered.length];

  const isLocked = project.access === "locked";
  const noStamp = project.access === "public";

  /* Branch by track:
       work  → lean template (cover hero + carousel + basic info)
       case  → full case-study renderer below */
  if (project.track === "work") {
    return (
      <>
        <Masthead variant="compact" />
        <main id="main">
          <WorkLean project={project} next={next} />
        </main>
        <Folio pageNum={String(project.order).padStart(2, "0")} />
      </>
    );
  }

  return (
    <>
      <Masthead variant="compact" />
      <main id="main">
        <ProjectHero project={project} />
        <ProjectMeta project={project} />

        {/* TL;DR for fast-scan readers */}
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
      <Folio pageNum={String(project.order).padStart(2, "0")} />
    </>
  );
}
