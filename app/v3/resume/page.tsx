import type { Metadata } from "next";
import { MastheadV3 } from "@/components/v3/MastheadV3";
import { FooterV3 } from "@/components/v3/FooterV3";

export const metadata: Metadata = {
  title: "Resume — Surajit Dutta",
  description:
    "Product Designer with 3+ years of experience designing enterprise workflows, design systems, and AI-augmented product experiences.",
};

/**
 * /v3/resume — HTML resume. Recruiter-scannable; PDF available for
 * download via the button.
 *
 * Content stays in this file as static JSX (matches the code-first
 * decision in the plan; lib/projects.ts already centralizes project
 * data, but a one-page resume is simpler to keep inline).
 */

const ROLES = [
  {
    period: "Jul 2024 — Present",
    role: "Product Designer",
    place: "miniOrange",
    location: "Pune, IN",
    bullets: [
      "Lead end-to-end product design for enterprise identity and security platforms — Active Directory, PAM, IGA, UEM — delivering scalable admin experiences for IT and security teams in compliance-driven environments.",
      "Shipped a production-level cross-functional Active Directory prototype in five business days using Figma Make AI — compressing a typical three-week design cycle by ~70%.",
      "Built and maintain a scalable design system using atomic components, variants, and Figma variables across multiple enterprise products.",
      "Drive 0-to-1 product discovery through stakeholder interviews and translation of insights into clear flows and high-fidelity designs aligned with business and technical constraints.",
      "Operationalised AI-augmented design workflows using Claude, Figma AI, and prompt-driven exploration for ideation, microcopy, edge-case enumeration, and design QA.",
    ],
    skills: ["IAM", "PAM", "IGA", "UEM", "Design Systems", "AI workflows"],
  },
  {
    period: "Jun 2023 — Jul 2024",
    role: "UX / UI Designer",
    place: "Impero IT",
    location: "India",
    bullets: [
      "Designed digital products across mobile (food delivery, healthcare, events) and web platforms (social media, admin dashboards) — research and IA through high-fidelity UI.",
      "Collaborated with development, QA, and management teams; managed time and prioritisation across concurrent projects.",
      "Standardised component libraries and interaction patterns across projects, reducing rework and improving handoff clarity.",
    ],
    skills: ["Mobile (B2C)", "Web", "Component libraries", "Cross-functional"],
  },
  {
    period: "Jul 2022 — May 2023",
    role: "UX / UI Designer",
    place: "Fortmindz",
    location: "Kolkata, IN",
    bullets: [
      "Redesigned websites and applications to lift engagement and reduce bounce rates; optimised e-commerce checkout flows.",
      "Partnered with developers to ship user-friendly interfaces and streamline workflows.",
    ],
    skills: ["Web redesign", "E-commerce", "Conversion"],
  },
];

const EDUCATION = [
  {
    period: "2019 — 2022",
    qual: "B.Tech, Information Technology",
    place: "Netaji Subhash Engineering College",
    score: "CGPA 8.8 / 10",
  },
  {
    period: "2016 — 2018",
    qual: "Diploma, Electronics & Telecommunications Engineering",
    place: "Purulia Polytechnic",
    score: "CGPA 7.2 / 10",
  },
];

const SKILLS = [
  { label: "Design", items: ["Discovery", "IA", "Interaction", "UI Systems", "Design QA"] },
  { label: "Stack", items: ["Figma", "Figma Make AI", "Cursor", "Claude", "Next.js"] },
  { label: "Domains", items: ["IAM", "PAM", "IGA", "UEM", "Design Systems", "Enterprise SaaS"] },
  { label: "AI workflow", items: ["Prompt design", "Spec generation", "Edge-case enumeration", "Design QA"] },
];

export default function V3ResumePage() {
  return (
    <>
      <MastheadV3 />
      <main id="main">
        {/* Header */}
        <section className="border-b border-[color:var(--v3-rule-soft)]">
          <div className="v3-container py-12 md:py-16 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="v3-eyebrow mb-5">/ Resume · last updated Feb 2026</p>
              <h1
                className="v3-display"
                style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
              >
                Surajit Dutta
              </h1>
              <p
                className="v3-prose mt-3"
                style={{ color: "var(--v3-ink-soft)" }}
              >
                Product designer with 3+ years designing enterprise
                workflows, design systems, and AI-augmented product
                experiences.
              </p>
              <p
                className="v3-mono mt-4"
                style={{ color: "var(--v3-ink-muted)" }}
              >
                pune · ist · surajit3255@gmail.com · /in/surajit3255
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="/resume.pdf"
                download
                className="v3-btn v3-btn-primary"
                data-event="resume_download"
                data-source="resume_page"
              >
                Download PDF
                <span aria-hidden style={{ marginLeft: 4 }}>↓</span>
              </a>
              <a
                href="mailto:surajit3255@gmail.com"
                className="v3-btn v3-btn-outlined"
                data-event="contact_click"
                data-channel="email"
              >
                Email
              </a>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section
          className="border-b border-[color:var(--v3-rule-soft)]"
          aria-label="Experience"
        >
          <div className="v3-container py-12 md:py-16">
            <p className="v3-eyebrow mb-8">/ Experience</p>
            <ol role="list">
              {ROLES.map((r, i) => (
                <li
                  key={r.role + r.period}
                  className="border-t border-[color:var(--v3-rule-soft)] py-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
                    <div className="md:col-span-3">
                      <p
                        className="v3-mono"
                        style={{ color: "var(--v3-accent)" }}
                      >
                        {r.period}
                      </p>
                      <p
                        className="v3-mono mt-2"
                        style={{ color: "var(--v3-ink-muted)" }}
                      >
                        {r.location}
                      </p>
                    </div>
                    <div className="md:col-span-4">
                      <h2
                        className="v3-display"
                        style={{ fontSize: 22, lineHeight: 1.2 }}
                      >
                        {r.role}
                      </h2>
                      <p
                        className="mt-1"
                        style={{ color: "var(--v3-ink-soft)", fontSize: 16 }}
                      >
                        {r.place}
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-2" role="list">
                        {r.skills.map((s) => (
                          <li
                            key={s}
                            className="v3-mono"
                            style={{
                              border: "1px solid var(--v3-rule-soft)",
                              padding: "4px 10px",
                              color: "var(--v3-ink-muted)",
                            }}
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <ul
                      role="list"
                      className="md:col-span-5 space-y-3"
                      style={{ color: "var(--v3-ink-soft)" }}
                    >
                      {r.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex gap-3"
                          style={{ fontSize: 15, lineHeight: 1.55 }}
                        >
                          <span
                            aria-hidden
                            className="shrink-0 mt-[8px]"
                            style={{
                              display: "block",
                              width: 12,
                              height: 1,
                              background: "var(--v3-accent)",
                            }}
                          />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Skills */}
        <section
          className="border-b border-[color:var(--v3-rule-soft)]"
          aria-label="Skills"
        >
          <div className="v3-container py-12 md:py-16">
            <p className="v3-eyebrow mb-8">/ Skills + stack</p>
            <ul role="list" className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10">
              {SKILLS.map((s) => (
                <li key={s.label}>
                  <p
                    className="v3-mono"
                    style={{ color: "var(--v3-accent)", marginBottom: 12 }}
                  >
                    {s.label.toUpperCase()}
                  </p>
                  <ul role="list" className="space-y-1">
                    {s.items.map((it) => (
                      <li key={it} style={{ color: "var(--v3-ink-soft)", fontSize: 14 }}>
                        {it}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Education */}
        <section aria-label="Education">
          <div className="v3-container py-12 md:py-16">
            <p className="v3-eyebrow mb-8">/ Education</p>
            <ol role="list">
              {EDUCATION.map((e) => (
                <li
                  key={e.qual}
                  className="border-t border-[color:var(--v3-rule-soft)] py-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8"
                >
                  <div
                    className="md:col-span-3 v3-mono"
                    style={{ color: "var(--v3-accent)" }}
                  >
                    {e.period}
                  </div>
                  <div className="md:col-span-6">
                    <h3
                      className="v3-display"
                      style={{ fontSize: 18, lineHeight: 1.3 }}
                    >
                      {e.qual}
                    </h3>
                    <p
                      className="mt-1"
                      style={{ color: "var(--v3-ink-muted)", fontSize: 14 }}
                    >
                      {e.place}
                    </p>
                  </div>
                  <div
                    className="md:col-span-3 md:text-right v3-serif-italic"
                    style={{ color: "var(--v3-ink-soft)", fontSize: 18 }}
                  >
                    {e.score}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <FooterV3 />
    </>
  );
}
