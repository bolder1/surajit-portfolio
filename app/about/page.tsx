import type { Metadata } from "next";
import Link from "next/link";
import { Masthead } from "@/components/Masthead";
import { Folio } from "@/components/Folio";

export const metadata: Metadata = {
  title: "About",
  description:
    "Product designer with four-plus years working on enterprise security and SaaS — IAM, UEM, PAM, and the design systems that power them.",
};

const PATH = [
  {
    range: "2016 — 2022",
    title: "Engineering school.",
    body:
      "Diploma in Electronics & Telecommunications at Purulia Polytechnic, then a B.Tech in Information Technology at Netaji Subhash Engineering College (CGPA 8.8/10). The systems thinking came from here. The design fluency came later.",
  },
  {
    range: "Jul 2022 — May 2023",
    title: "Fortmindz · UX/UI Designer.",
    body:
      "Kolkata. Web redesigns and e-commerce — checkout flows, product pages, brand sites. First proper job; learned to ship on a deadline alongside developers, and learned that the best design call is often the one that makes the engineer’s life easier.",
  },
  {
    range: "Jun 2023 — Jul 2024",
    title: "Impero IT · UX/UI Designer.",
    body:
      "Multiple domains in one year: mobile apps for food delivery, healthcare, and events; web platforms for social media and admin dashboards. Started building component libraries seriously and felt the pull toward enterprise — the work where systems matter most.",
  },
  {
    range: "Jul 2024 — Present",
    title: "miniOrange · Product Designer.",
    body:
      "End-to-end product design across IAM, PAM, IGA, UEM. Built and maintain the design system; shipped a production-level Active Directory prototype in five business days using Figma Make AI; drive 0-to-1 discovery and AI-augmented workflows that compress weeks of design into days.",
  },
];

const PRINCIPLES = [
  {
    n: "01",
    title: "Make complex feel calm",
    body:
      "Enterprise software fails when it asks users to hold the system in their head. My job is to put the right thing on screen at the right moment, and to leave everything else off.",
  },
  {
    n: "02",
    title: "Systems, then surfaces",
    body:
      "Tokens, components, and patterns first. Screens get faster to design and easier to change when the system underneath is doing real work. The cost of a system pays back on year two.",
  },
  {
    n: "03",
    title: "Ship, then sharpen",
    body:
      "The first version is for learning. I'd rather get a flow into reviewers' hands in week three and iterate than polish a hypothesis to perfection in Figma for a quarter.",
  },
  {
    n: "04",
    title: "Research is a teammate",
    body:
      "I do my own when I have to and pair with researchers when I can. The features that mattered on every project I've shipped came out of listening, not workshops.",
  },
];

const DOMAINS = [
  {
    label: "Identity Governance (IGA)",
    body:
      "Access certification, lifecycle management, policy authoring, audit trails. The work that keeps security and compliance teams from burning out at quarter-end.",
  },
  {
    label: "Active Directory tooling",
    body:
      "User provisioning, group policy authoring, delegation, sync. The everyday admin work that scales from 200 employees to 200,000.",
  },
  {
    label: "Unified Endpoint Management (UEM)",
    body:
      "Device enrollment, policy deployment, fleet visibility, remote actions. Tens of thousands of endpoints, one console.",
  },
  {
    label: "Design systems at scale",
    body:
      "MODS — the system across 10+ products. Tokens, foundations, contribution governance, accessibility patterns. The boring part that makes the rest possible.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Masthead variant="compact" />
      <main id="main">
        {/* Header */}
        <section className="border-b border-[var(--rule)]">
          <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24">
            <div className="section-tag mb-8">▸ ABOUT &middot; THE WRITER</div>
            <h1 className="display text-[14vw] md:text-[10vw] lg:text-[160px] tracking-tightest leading-[0.88]">
              I make enterprise software{" "}
              <span className="display-italic text-[var(--accent)]">
                feel like fewer tabs
              </span>
              .
            </h1>
          </div>
        </section>

        {/* Long-form bio */}
        <section className="border-b border-[var(--rule)]">
          <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24 grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-4">
              <div className="section-tag">▸ NOW &middot; § 01</div>
            </div>
            <div className="md:col-span-8">
              <p className="body-prose drop-cap">
                I&rsquo;m a product designer based in Pune, India, working on
                enterprise SaaS for IT and security teams. The kind of software
                where every misclick has consequences and every screen has to
                earn its place.
              </p>
              <p className="body-prose mt-6">
                Most of my time goes to two things: shipping product flows
                that hold up under real workloads, and growing the design
                system that powers them across ten-plus products. The second
                job makes the first one possible.
              </p>
              <p className="body-prose mt-6">
                Right now I&rsquo;m{" "}
                <Link href="/#contact" className="link">
                  open to full-time roles
                </Link>{" "}
                where I can keep working on enterprise products — ideally
                with teams that take research seriously and care about the
                system, not just the screen.
              </p>
            </div>
          </div>
        </section>

        {/* Domains */}
        <section className="border-b border-[var(--rule)] bg-[var(--paper-2)]">
          <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24">
            <div className="grid md:grid-cols-12 gap-8 md:gap-12 mb-10 md:mb-14">
              <div className="md:col-span-5">
                <div className="section-tag mb-6">
                  ▸ DOMAINS &middot; § 02
                </div>
                <h2 className="display text-[10vw] md:text-[5.6vw] lg:text-[80px] tracking-tightest leading-[0.92]">
                  Four{" "}
                  <span className="display-italic text-[var(--accent)]">
                    rooms in the building
                  </span>
                  .
                </h2>
              </div>
              <div className="md:col-span-7 md:pt-6">
                <p className="body-prose">
                  The work I keep coming back to. Some of it I&rsquo;ve been
                  inside long enough to have opinions; some of it I&rsquo;m
                  still learning the corners of.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-px bg-[var(--rule)] border border-[var(--rule)]">
              {DOMAINS.map((d) => (
                <div
                  key={d.label}
                  className="bg-[var(--paper)] p-8 md:p-10"
                >
                  <h3 className="display-italic text-[var(--accent)] text-[24px] md:text-[28px] mb-4">
                    {d.label}
                  </h3>
                  <p className="body-prose-sm">{d.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Path */}
        <section className="border-b border-[var(--rule)]">
          <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24">
            <div className="grid md:grid-cols-12 gap-8 md:gap-12 mb-12">
              <div className="md:col-span-5">
                <div className="section-tag mb-6">
                  ▸ THE PATH &middot; § 03
                </div>
                <h2 className="display text-[10vw] md:text-[5.6vw] lg:text-[80px] tracking-tightest leading-[0.92]">
                  A non-linear road into{" "}
                  <span className="display-italic">product design</span>.
                </h2>
              </div>
              <div className="md:col-span-7 md:pt-6">
                <p className="body-prose">
                  Three chapters, more or less. Each one taught a different
                  thing. I keep going back to the first one when the work
                  starts feeling abstract.
                </p>
              </div>
            </div>

            <div className="border-t-2 border-[var(--rule)]">
              {PATH.map((step) => (
                <div
                  key={step.range}
                  className="border-b border-[var(--rule-soft)] grid md:grid-cols-12 gap-4 md:gap-8 py-8 md:py-10"
                >
                  <div className="md:col-span-3 mono">{step.range}</div>
                  <div className="md:col-span-9">
                    <h3 className="display text-2xl md:text-3xl tracking-tightest mb-3">
                      {step.title}
                    </h3>
                    <p className="body-prose">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="border-b border-[var(--rule)] bg-[var(--paper-2)]">
          <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24">
            <div className="grid md:grid-cols-12 gap-8 md:gap-12 mb-10 md:mb-14">
              <div className="md:col-span-5">
                <div className="section-tag mb-6">
                  ▸ PRINCIPLES &middot; § 04
                </div>
                <h2 className="display text-[10vw] md:text-[5.6vw] lg:text-[80px] tracking-tightest leading-[0.92]">
                  What I work toward,{" "}
                  <span className="display-italic text-[var(--accent)]">
                    every time
                  </span>
                  .
                </h2>
              </div>
              <div className="md:col-span-7 md:pt-6">
                <p className="body-prose">
                  These aren&rsquo;t rules — they&rsquo;re what the last few
                  years of shipped work keep teaching me. I write them down so
                  the next project doesn&rsquo;t have to re-learn them.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-px bg-[var(--rule)] border border-[var(--rule)]">
              {PRINCIPLES.map((p) => (
                <div
                  key={p.n}
                  className="bg-[var(--paper)] p-8 md:p-10 flex flex-col gap-3"
                >
                  <div className="display-italic text-[var(--accent)] text-3xl">
                    {p.n}.
                  </div>
                  <h3 className="display text-[22px] md:text-[26px] tracking-tightest">
                    {p.title}
                  </h3>
                  <p className="body-prose-sm">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-b border-[var(--rule)]">
          <Link
            href="/#contact"
            className="block group hover:bg-[var(--ink)] hover:text-white transition-colors"
          >
            <div className="max-w-page mx-auto px-6 md:px-10 py-16 md:py-24 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <div className="mono mb-4 group-hover:text-white/60">
                  ▸ GET IN TOUCH
                </div>
                <h3 className="display text-[10vw] md:text-[5.6vw] lg:text-[80px] tracking-tightest">
                  Let&rsquo;s talk
                  <span className="text-[var(--accent)]">.</span>
                </h3>
              </div>
              <span
                aria-hidden
                className="display text-5xl md:text-8xl group-hover:translate-x-3 transition-transform"
              >
                →
              </span>
            </div>
          </Link>
        </section>
      </main>
      <Folio pageNum="A1" />
    </>
  );
}
