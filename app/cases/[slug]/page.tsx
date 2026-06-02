import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, getAllSlugs } from "@/lib/projects";
import { CaseStudyV5 } from "@/components/v5/CaseStudyV5";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: "Case study not found" };
  return {
    title: `${p.title} — Case study`,
    description: p.subtitle ?? p.summary,
  };
}

export default async function CasePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <CaseStudyV5 project={project} />;
}
