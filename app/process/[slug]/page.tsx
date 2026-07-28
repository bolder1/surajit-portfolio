import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProcessCase, getAllProcessCaseSlugs, processCases } from "@/lib/processCases";
import { ProcessCaseStudyV5 } from "@/components/v5/ProcessCaseStudyV5";

export function generateStaticParams() {
  return getAllProcessCaseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const study = getProcessCase(slug);
  if (!study) return { title: "Case study not found" };
  return {
    title: `${study.name} — Process case study — Surajit Dutta`,
    description: study.oneLiner,
  };
}

export default async function ProcessCasePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const study = getProcessCase(slug);
  if (!study) notFound();
  const others = processCases.filter((c) => c.slug !== slug);
  return <ProcessCaseStudyV5 study={study} others={others} />;
}
