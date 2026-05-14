import type { Metadata } from "next";
import { Masthead } from "@/components/Masthead";
import { Folio } from "@/components/Folio";
import { Button, StatusPill, Tag } from "@/components/Button";

export const metadata: Metadata = {
  title: "Hire — Surajit Dutta",
  description:
    "Surajit Dutta — Product Designer, three-plus years on enterprise SaaS at miniOrange. Open to senior product design roles. Download the CV, see the case studies, get in touch.",
};

/* ──────────────────────────────────────────────────────────
   /hire — the page recruiters and hiring managers land on.
   Single scroll, recruiter-readable, every claim defensible
   against the CV. The big primary CTA is "Download CV (PDF)";
   secondary is "Email me direct."
   ─────────────────────────────────────────────────────── */

const STATS = [
  { value: "3+", label: "YEARS", note: "designing enterprise SaaS" },
  { value: "4", label: "PLATFORMS", note: "IAM · PAM · IGA · UEM · ITDR" },
  { value: "5 days", label: "0→PROTOTYPE", note: "AD console, Figma Make AI" },
  { value: "~70%", label: "CYCLE COMPRESSION", note: "discovery to handoff" },
];

const ROLES = [
  {
    period: "Jul 2024 — Present",
    role: "Product Designer",
    place: "miniOrange",
    location: "Pune, IN",
    bullets: [
      "Lead end-to-end product design for enterprise identity and security platforms — IAM, PAM, IGA, UEM, ITDR — used by IT and security teams in compliance-driven environments.",
      "Designed and shipped a production-level cross-functional Active Directory prototype in five business days with Figma Make AI; compressed a typical three-week design cycle by ~70%.",
      "Built and maintain the miniOrange Central Design System — atomic components, variants, Figma variables — standardising UI patterns across multiple enterprise products.",
      "Drive 0-to-1 product discovery via stakeholder interviews and competitive research; translate insights into clear product flows, interaction models, and high-fidelity designs.",
      "Operationalise AI-augmented design workflows (Claude · Figma Make AI · Cursor) for ideation, microcopy, edge-case enumeration, and design QA.",
      "Partner with engineering and product on early feasibility alignment and design QA, ensuring high-quality releases without late-stage rework.",
    ],
    skills: ["IAM", "PAM", "IGA", "UEM", "ITDR", "Design Systems", "AI workflows"],
  },
  {
    period: "Jun 2023 — Jul 2024",
    role: "UX / UI Designer",
    place: "Impero IT",
    location: "India",
    bullets: [
      "Designed digital products across multiple domains — mobile apps for food delivery, healthcare, and events, plus web platforms for social media and admin dashboards — covering the full lifecycle from research and IA through high-fidelity UI.",
      "Collaborated with development, QA, and management teams to align project goals with engineering constraints; managed time and prioritisation to deliver consistently high-quality releases.",
      "Standardised component libraries and interaction patterns across projects, reducing rework and improving handoff clarity for engineering teams.",
    ],
    skills: ["Mobile (B2C)", "Web", "Component libraries", "Cross-functional"],
  },
  {
    period: "Jul 2022 — May 2023",
    role: "UX / UI Designer",
    place: "Fortmindz",
    location: "Kolkata, IN",
    bullets: [
      "Redesigned websites and applications to lift user engagement and reduce bounce rates; optimised e-commerce checkout flows and product pages to drive higher conversions.",
      "Partnered with developers to ship user-friendly interfaces and streamline workflows for on-time project delivery.",
    ],
    skills: ["Web redesign", "E-commerce", "Conversion"],
  },
];

const SKILLS_GROUPS = [
  {
    title: "Product Design & 0-to-1",
    items: [
      "User research",
      "Problem framing",
      "Stakeholder discovery",
      "Information architecture",
      "Wireframing · prototyping",
      "Usability testing",
      "Interaction design",
      "MVP scoping",
      "Design-led product definition",
    ],
  },
  {
    title: "Design Systems",
    items: [
      "Atomic components",
      "Variants",
      "Figma variables",
      "Design tokens",
      "Pattern libraries",
      "Cross-product standardisation",
    ],
  },
  {
    title: "AI-Augmented Workflows",
    items: [
      "Figma Make AI",
      "Claude (Anthropic)",
      "ChatGPT",
      "Cursor",
      "Prompt-driven design exploration",
      "AI-assisted prototyping",
      "Edge-case enumeration · microcopy",
      "Design QA",
    ],
  },
  {
    title: "Domains",
    items: [
      "Enterprise SaaS",
      "Identity & Access Management (IAM)",
      "PAM · IGA · UEM · ITDR",
      "Cybersecurity",
      "Admin platforms",
      "Mobile (B2C)",
    ],
  },
  {
    title: "Tools",
    items: [
      "Figma · FigJam · Figma Make AI",
      "Notion · Jira",
      "Basic HTML / CSS",
      "Video editing",
    ],
  },
  {
    title: "Metrics & Measurement",
    items: [
      "CVR · Activation · TTV · Drop-off",
      "DAU/MAU · Stickiness · Adoption · Retention",
      "Task Success · Time on Task · Error Rate · CSAT",
      "Churn · LTV · CAC · MRR/ARR · NRR",
      "Funnel + cohort analysis",
      "Telemetry-led iteration",
    ],
  },
];

/* The 18 KPIs Surajit reads design through — proof that design
   decisions land as numbers leadership can verify. Grouped in
   four lifecycle phases so a recruiter can scan in 20 seconds. */
const METRICS_GROUPS = [
  {
    title: "Activation & Growth",
    note: "early lifecycle — does design get the user to value?",
    items: [
      { code: "CVR", name: "Conversion Rate", use: "measuring the impact of UX changes on goal completion" },
      { code: "ACT", name: "Activation Rate", use: "evaluating onboarding effectiveness and TTV" },
      { code: "TTV", name: "Time to Value", use: "reducing friction in early product experience" },
      { code: "DROP", name: "Drop-off Rate", use: "identifying friction points in funnels" },
    ],
  },
  {
    title: "Engagement & Habit",
    note: "mid lifecycle — does the design pull users back?",
    items: [
      { code: "BNCE", name: "Bounce Rate", use: "diagnosing landing-page relevance and clarity" },
      { code: "DAU/MAU", name: "Active Users", use: "tracking overall product reach and growth" },
      { code: "STKY", name: "Stickiness (DAU÷MAU)", use: "gauging habit formation and engagement depth" },
      { code: "ADOP", name: "Feature Adoption Rate", use: "validating launches and measuring discoverability" },
      { code: "RET", name: "Retention Rate", use: "tracking retention health and product-market fit" },
    ],
  },
  {
    title: "Usability & Research",
    note: "the surface itself — does the design actually work?",
    items: [
      { code: "TSR", name: "Task Success Rate", use: "measuring usability in research and tests" },
      { code: "TOT", name: "Time on Task", use: "benchmarking efficiency before and after changes" },
      { code: "ERR", name: "Error Rate", use: "surfacing UI confusion and recoverability gaps" },
      { code: "CSAT", name: "Customer Satisfaction", use: "capturing direct sentiment after key flows" },
    ],
  },
  {
    title: "Business & Revenue",
    note: "the bottom line — does design create durable value?",
    items: [
      { code: "CHURN", name: "Churn Rate", use: "monitoring customer retention and loss" },
      { code: "LTV", name: "Customer Lifetime Value", use: "measuring long-term value of each customer" },
      { code: "CAC", name: "Customer Acquisition Cost", use: "assessing efficiency of acquisition channels" },
      { code: "MRR", name: "MRR / ARR", use: "tracking revenue stability and growth over time" },
      { code: "NRR", name: "Net Revenue Retention", use: "evaluating health of existing customer base" },
    ],
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

export default function HirePage() {
  return (
    <>
      <Masthead variant="compact" />
      <main id="main">
        {/* Hero — the moment of decision */}
        <section className="border-b border-[var(--rule)]">
          <div className="max-w-page mx-auto px-6 md:px-10 py-14 md:py-20">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8">
              <StatusPill size="md" />
              <span className="mono text-[var(--ink)]">SR. PRODUCT DESIGNER</span>
              <span aria-hidden className="text-[var(--rule-soft)]">·</span>
              <span className="mono text-[var(--ink)]">FULL-TIME · CONTRACT</span>
              <span aria-hidden className="text-[var(--rule-soft)]">·</span>
              <span className="mono text-[var(--ink)]">PUNE · IST · ASYNC US</span>
              <span className="ml-auto hidden md:inline mono text-[var(--muted)]">
                REPLY WITHIN 24H
              </span>
            </div>

            <p className="mono mb-4 text-[var(--accent)]">▸ HIRE · SURAJIT DUTTA</p>
            <h1 className="display text-[14vw] md:text-[10vw] lg:text-[160px] tracking-tightest leading-[0.88] mb-8">
              Hire the designer{" "}
              <span className="display-italic text-[var(--accent)]">
                who ships in days
              </span>
              .
            </h1>

            <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
              <div className="md:col-span-7">
                <p className="body-prose drop-cap">
                  Three-plus years on enterprise SaaS &mdash; currently leading
                  end-to-end product design at miniOrange across IAM, PAM, IGA,
                  UEM and ITDR. I orchestrate Claude, Figma Make AI, Cursor,
                  and a wider AI stack to compress discovery-to-handoff cycles
                  from weeks to days &mdash; without trading taste for speed.
                </p>
                <p className="body-prose mt-5">
                  This page is the executive summary. The case studies live on
                  the work archive; the CV lives in the PDF below.
                </p>
              </div>
              <div className="md:col-span-5">
                <div className="border-2 border-[var(--ink)] p-6 md:p-8 bg-[var(--paper-2)]">
                  <div className="mono mb-4 text-[var(--accent)]">
                    ▸ THE HIRING MOMENT
                  </div>
                  <h2 className="display text-[28px] md:text-[36px] tracking-tightest leading-[1.05] mb-6">
                    Get the CV. Get on a call.
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      href="/resume.pdf"
                      download="Surajit-Dutta-CV.pdf"
                      variant="primary"
                      size="md"
                      iconRight={<span aria-hidden>↓</span>}
                    >
                      Download CV (PDF)
                    </Button>
                    <Button
                      href="mailto:surajit3255@gmail.com?subject=Hiring%20Surajit%20Dutta"
                      variant="outlined"
                      size="md"
                    >
                      Email me direct
                    </Button>
                  </div>
                  <p className="mono mt-5 text-[var(--muted)] text-[10px]">
                    PDF · 56 KB · ONE PAGE · RECRUITER-FRIENDLY
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section
          aria-label="Headline numbers"
          className="border-b border-[var(--rule)] bg-[var(--paper-2)]"
        >
          <div className="max-w-page mx-auto px-6 md:px-10 py-10 md:py-14">
            <p className="mono mb-6 text-[var(--accent)]">▸ HEADLINE NUMBERS</p>
            <div className="grid grid-cols-2 md:grid-cols-4 border-t-2 border-[var(--rule)] divide-x divide-[var(--rule)]">
              {STATS.map((s) => (
                <div key={s.label} className="px-4 md:px-6 py-6">
                  <div className="figure display text-[40px] md:text-[60px] lg:text-[76px] leading-[0.95] text-[var(--accent)]">
                    {s.value}
                  </div>
                  <div className="mono mt-2 text-[var(--ink)]">{s.label}</div>
                  <div className="text-[14px] mt-1 text-[var(--muted)] italic">
                    {s.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience — the resume itself */}
        <section
          aria-labelledby="resume-experience"
          className="border-b border-[var(--rule)]"
        >
          <div className="max-w-page mx-auto px-6 md:px-10 py-14 md:py-20">
            <div className="flex items-end justify-between mb-10 md:mb-14 gap-6">
              <div>
                <p className="mono mb-3 text-[var(--accent)]">
                  ▸ EXPERIENCE · THREE ROLES
                </p>
                <h2
                  id="resume-experience"
                  className="display text-[10vw] md:text-[5.4vw] lg:text-[72px] tracking-tightest leading-[0.95]"
                >
                  The trajectory toward{" "}
                  <span className="display-italic text-[var(--accent)]">
                    enterprise
                  </span>
                  .
                </h2>
              </div>
              <Button
                href="/resume.pdf"
                download="Surajit-Dutta-CV.pdf"
                variant="outlined"
                size="sm"
                className="hidden md:inline-flex shrink-0"
                iconRight={<span aria-hidden>↓</span>}
              >
                Download as PDF
              </Button>
            </div>

            <ol className="border-t-2 border-[var(--rule)]">
              {ROLES.map((r, i) => (
                <li
                  key={r.role + r.period}
                  className="border-b border-[var(--rule-soft)] py-7 md:py-9"
                >
                  <div className="grid md:grid-cols-12 gap-6 md:gap-10">
                    <div className="md:col-span-3">
                      <div className="mono text-[var(--accent)]">{r.period}</div>
                      <div className="display-italic text-[18px] mt-1.5 text-[var(--ink)]">
                        {r.location}
                      </div>
                    </div>
                    <div className="md:col-span-4">
                      <h3 className="display text-[26px] md:text-[32px] tracking-tightest leading-[1.05]">
                        {r.role}
                      </h3>
                      <p className="body-prose-sm mt-1.5 text-[var(--ink)]">
                        {r.place}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {r.skills.map((s) => (
                          <Tag key={s}>{s}</Tag>
                        ))}
                      </div>
                    </div>
                    <ul className="md:col-span-5 space-y-3">
                      {r.bullets.map((b) => (
                        <li key={b} className="body-prose-sm flex gap-3">
                          <span aria-hidden className="diamond mt-2 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mono mt-6 text-[var(--muted)]">
                    ROLE № {String(ROLES.length - i).padStart(2, "0")} OF{" "}
                    {String(ROLES.length).padStart(2, "0")}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Skills — full resume skills layout */}
        <section
          aria-labelledby="resume-skills"
          className="border-b border-[var(--rule)] bg-[var(--paper-2)]"
        >
          <div className="max-w-page mx-auto px-6 md:px-10 py-14 md:py-20">
            <div className="flex items-end justify-between mb-10 md:mb-12 gap-6">
              <div>
                <p className="mono mb-3 text-[var(--accent)]">
                  ▸ SKILLS · FROM THE CV
                </p>
                <h2
                  id="resume-skills"
                  className="display text-[10vw] md:text-[5.4vw] lg:text-[72px] tracking-tightest leading-[0.95]"
                >
                  Five groups,{" "}
                  <span className="display-italic">in plain language</span>.
                </h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--rule)] border border-[var(--rule)]">
              {SKILLS_GROUPS.map((g) => (
                <div key={g.title} className="bg-[var(--paper)] p-6 md:p-7">
                  <h3 className="display-italic text-[24px] md:text-[26px] mb-4 text-[var(--accent)]">
                    {g.title}
                  </h3>
                  <ul className="space-y-2">
                    {g.items.map((it) => (
                      <li
                        key={it}
                        className="flex items-baseline gap-3 body-prose-sm"
                      >
                        <span className="mono shrink-0 text-[var(--accent)]">→</span>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Metrics fluency — the 18 KPIs Surajit reads design through */}
        <section
          aria-labelledby="resume-metrics"
          className="border-b border-[var(--rule)]"
        >
          <div className="max-w-page mx-auto px-6 md:px-10 py-14 md:py-20">
            <div className="grid md:grid-cols-12 gap-8 md:gap-12 mb-10 md:mb-12">
              <div className="md:col-span-7">
                <p className="mono mb-3 text-[var(--accent)]">
                  ▸ METRICS FLUENCY · 18 KPIs
                </p>
                <h2
                  id="resume-metrics"
                  className="display text-[10vw] md:text-[5.4vw] lg:text-[72px] tracking-tightest leading-[0.95]"
                >
                  Design impact, in{" "}
                  <span className="display-italic text-[var(--accent)]">
                    numbers leadership can verify
                  </span>
                  .
                </h2>
              </div>
              <div className="md:col-span-5 md:pt-4">
                <p className="body-prose">
                  Every design decision can be tied to a measurable signal.
                  These are the eighteen I read most often &mdash; grouped by
                  lifecycle phase, so research shapes the early metrics and
                  business outcomes anchor the late ones.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-px bg-[var(--rule)] border border-[var(--rule)]">
              {METRICS_GROUPS.map((g, gi) => (
                <div key={g.title} className="bg-[var(--paper)] p-6 md:p-7">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="display-italic text-[24px] md:text-[28px] text-[var(--accent)]">
                      {g.title}
                    </h3>
                    <span className="mono text-[var(--muted)]">
                      № {String(gi + 1).padStart(2, "0")} / 04
                    </span>
                  </div>
                  <p className="body-prose-sm mb-5 text-[var(--muted)] italic">
                    {g.note}
                  </p>
                  <ul className="space-y-3">
                    {g.items.map((m) => (
                      <li
                        key={m.code}
                        className="grid grid-cols-[80px_1fr] gap-3 items-baseline"
                      >
                        <Tag accent>{m.code}</Tag>
                        <div>
                          <div className="display text-[18px] md:text-[20px] tracking-tightest leading-tight">
                            {m.name}
                          </div>
                          <div className="text-[13px] mt-1 italic text-[var(--ink-soft)]">
                            Use when {m.use}.
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="mono mt-6 text-[var(--muted)]">
              ↑ EIGHTEEN KPIs · GROUPED IN FOUR LIFECYCLE PHASES · READABLE BY
              A CFO IN UNDER A MINUTE
            </p>
          </div>
        </section>

        {/* Education */}
        <section
          aria-labelledby="resume-education"
          className="border-b border-[var(--rule)]"
        >
          <div className="max-w-page mx-auto px-6 md:px-10 py-14 md:py-20">
            <div className="flex items-end justify-between mb-10 md:mb-12 gap-6">
              <div>
                <p className="mono mb-3 text-[var(--accent)]">▸ EDUCATION</p>
                <h2
                  id="resume-education"
                  className="display text-[10vw] md:text-[5.4vw] lg:text-[64px] tracking-tightest leading-[0.95]"
                >
                  On paper.
                </h2>
              </div>
            </div>

            <ol className="border-t-2 border-[var(--rule)]">
              {EDUCATION.map((e) => (
                <li
                  key={e.qual}
                  className="grid md:grid-cols-12 gap-6 md:gap-10 border-b border-[var(--rule-soft)] py-6 md:py-8"
                >
                  <div className="md:col-span-3 mono text-[var(--accent)]">
                    {e.period}
                  </div>
                  <div className="md:col-span-6">
                    <h3 className="display text-[22px] md:text-[28px] tracking-tightest leading-[1.05]">
                      {e.qual}
                    </h3>
                    <p className="body-prose-sm mt-1.5">{e.place}</p>
                  </div>
                  <div className="md:col-span-3 md:text-right">
                    <span className="display-italic text-[20px] md:text-[24px] text-[var(--accent)]">
                      {e.score}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Final CTA — restate availability + download */}
        <section className="border-b border-[var(--rule)]">
          <div className="max-w-page mx-auto px-6 md:px-10 py-20 md:py-28">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-10">
              <StatusPill size="md" />
              <span className="mono text-[var(--ink)]">FULL-TIME · CONTRACT</span>
              <span aria-hidden className="text-[var(--rule-soft)]">·</span>
              <span className="mono text-[var(--ink)]">STARTING WITHIN 4 WEEKS</span>
            </div>

            <h2 className="display text-[14vw] md:text-[8vw] lg:text-[120px] tracking-tightest leading-[0.92] mb-12">
              Ready when{" "}
              <span className="display-italic text-[var(--accent)]">you are</span>.
            </h2>

            <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
              <div className="md:col-span-6">
                <p className="body-prose">
                  Three ways in. Email is fastest, the CV PDF is most
                  recruiter-friendly, the work archive is the deepest
                  evidence.
                </p>
              </div>
              <div className="md:col-span-6 flex flex-wrap gap-3">
                <Button
                  href="/resume.pdf"
                  download="Surajit-Dutta-CV.pdf"
                  variant="primary"
                  size="md"
                  iconRight={<span aria-hidden>↓</span>}
                >
                  Download CV
                </Button>
                <Button
                  href="mailto:surajit3255@gmail.com?subject=Hiring%20Surajit%20Dutta"
                  variant="outlined"
                  size="md"
                >
                  Email
                </Button>
                <Button
                  href="/work"
                  variant="outlined"
                  size="md"
                >
                  See the work
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Folio pageNum="HIRE" />
    </>
  );
}
