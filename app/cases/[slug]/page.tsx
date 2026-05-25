import { redirect } from "next/navigation";

/**
 * /cases/[slug] — currently delegates to the same renderer that powers
 * /work/[slug]. The IA distinction (cases vs work) lives at the listing
 * level; the detail-page experience is identical.
 *
 * Server-side redirect keeps the URL clean for inbound links and avoids
 * duplicating the rich CaseStudy + CaseStudyRich component tree.
 */
export default async function CaseStudyRedirect(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  redirect(`/work/${slug}`);
}
