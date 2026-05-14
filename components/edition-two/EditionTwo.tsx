import Link from "next/link";
import { getFeaturedProjects } from "@/lib/projects";
import { ERev } from "./ERev";
import s from "@/app/edition-two/edition.module.css";

/**
 * Edition Two — "After Dark"
 * ─────────────────────────────────────────────────────────────
 * A parallel-content version of the editorial Folio home, rebuilt
 * on a deep warm-carbon stage with oversized type, extreme
 * whitespace, and viewport-triggered reveals. Same facts as
 * components/HomeSections.tsx — different IA + atmosphere so the
 * two editions can be compared head-to-head.
 *
 * Voice is unchanged from PRODUCT.md. Anti-references still apply:
 * no glassmorphism (the switcher pill is the one allowed exception,
 * matching v1's chooser), no gradient text, no card grids.
 */

/* ──────────────────────────────────────────────────────────
   Constants pulled directly from the editorial home so the two
   editions stay fact-aligned. Single source of truth still lives
   on the CV.
   ─────────────────────────────────────────────────────── */
const STATS = [
  { value: "3+", label: "Years", note: "enterprise SaaS" },
  { value: "4", label: "Platforms", note: "IAM · PAM · IGA · UEM" },
  { value: "5d", label: "0 → prototype", note: "AD console, Figma Make AI" },
  { value: "~70%", label: "Cycle compression", note: "discovery to handoff" },
];

const CAP_COLS = [
  {
    label: "Domains",
    title: "Where I work",
    items: [
      "Identity & Access (IAM)",
      "Privileged Access (PAM)",
      "Identity Governance (IGA)",
      "Endpoint Management (UEM)",
      "Cybersecurity admin",
      "Mobile (B2C)",
    ],
  },
  {
    label: "Strengths",
    title: "How I help",
    items: [
      "AI-orchestrated design (5-day prototypes)",
      "0-to-1 product discovery",
      "Design systems at scale",
      "Metrics fluency (CVR · TTV · retention · LTV)",
      "Stakeholder interviews · IA",
      "Design QA · handoff",
    ],
  },
  {
    label: "Tools",
    title: "What I use",
    items: [
      "Figma · FigJam · Figma Make AI",
      "Claude · ChatGPT · Cursor · Antigravity",
      "Imagen · Higgsfield · Freepik · Sora · Flow",
      "NotebookLM · ElevenLabs · Cowork",
      "Variables · tokens · component libraries",
      "Notion · Jira · basic HTML/CSS",
    ],
  },
];

const ROLES = [
  {
    period: "Jul 2024 — Present",
    role: "Product Designer",
    place: "miniOrange",
    location: "Pune, IN",
    bullets: [
      "Lead end-to-end product design for enterprise identity and security platforms — Active Directory, PAM, IGA, UEM — delivering scalable admin experiences for IT and security teams in compliance-driven environments.",
      "Designed and shipped a production-level cross-functional Active Directory prototype in five business days by orchestrating Figma Make AI to rapidly generate, iterate, and refine UI flows ready for engineering handoff. ~70% cycle compression on a typical three-week design path.",
      "Built and maintain a scalable design system using atomic components, variants, and Figma variables across multiple enterprise products — standardising UI patterns and improving design + dev velocity across teams.",
      "Drive 0-to-1 product discovery through stakeholder interviews, competitive research, and translation of insights into clear product flows aligned with business and technical constraints.",
      "Operationalise AI-augmented design workflows with Claude, Figma AI, and prompt-driven exploration for rapid ideation, microcopy, edge-case enumeration, and design QA.",
    ],
    skills: ["IAM", "PAM", "IGA", "UEM", "Design Systems", "AI workflows"],
  },
  {
    period: "Jun 2023 — Jul 2024",
    role: "UX / UI Designer",
    place: "Impero IT",
    location: "India",
    bullets: [
      "Designed digital products across multiple domains: mobile apps for food delivery, healthcare, and events, plus web platforms for social media and admin dashboards.",
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

const PRINCIPLES = [
  {
    n: "i.",
    title: "Make complex feel calm.",
    body: "The right thing on screen at the right moment. Everything else, off.",
  },
  {
    n: "ii.",
    title: "Systems, then surfaces.",
    body: "Tokens, components, patterns first. The system pays back on year two.",
  },
  {
    n: "iii.",
    title: "Compress with AI, polish with judgment.",
    body:
      "Use AI to spin variants and write edge cases. Reserve human time for the calls that need taste.",
  },
];

const PHASES = [
  { num: "01", label: "Desk", filled: false },
  { num: "02", label: "Field", filled: false },
  { num: "03", label: "Synthesis", filled: true },
  { num: "04", label: "Draft", filled: false },
  { num: "05", label: "System", filled: true },
  { num: "06", label: "Motion", filled: false },
  { num: "07", label: "Hand-off", filled: true },
  { num: "08", label: "Talk", filled: true },
];

const TOOLKIT = [
  {
    category: "Reasoning & writing",
    note: "the thinking partner layer",
    tools: [
      {
        name: "Claude",
        maker: "Anthropic",
        cadence: "DAILY",
        use: "JTBD framing, design critique, edge-case enumeration, microcopy. This whole portfolio was built with Claude Code.",
      },
      {
        name: "ChatGPT",
        maker: "OpenAI",
        cadence: "DAILY",
        use: "Alt-copy, structured summaries, second-opinion checks on specs.",
      },
      {
        name: "Cowork",
        maker: "Anthropic",
        cadence: "WEEKLY",
        use: "Skill orchestration — running brand-voice, impeccable, design-taste skills as repeatable workflows.",
      },
    ],
  },
  {
    category: "Design generation",
    note: "the make-it-real layer",
    tools: [
      {
        name: "Figma Make AI",
        maker: "Figma",
        cadence: "DAILY",
        use: "Production prototypes — 5-day Active Directory console, multi-frame flows ready for engineering handoff.",
      },
      {
        name: "Cursor",
        maker: "Cursor",
        cadence: "DAILY",
        use: "Design tokens, prototype scaffolding, spec refactors paired with Claude.",
      },
      {
        name: "Antigravity",
        maker: "Google",
        cadence: "EXPLORING",
        use: "Agentic IDE — multi-file design + code orchestration for system contributions.",
      },
    ],
  },
  {
    category: "Vibe coding",
    note: "ship-a-page-from-a-vibe — AI builds, I direct the taste",
    tools: [
      {
        name: "Claude Design",
        maker: "Anthropic",
        cadence: "DAILY",
        use: "HTML/CSS/JS prototype generation from a brief — produced the Internal Banking Tool's full surface ready for handoff.",
      },
      {
        name: "Claude Code",
        maker: "Anthropic",
        cadence: "DAILY",
        use: "Engineering pair — this portfolio end-to-end (Next.js 15, React 19, Motion), refactors, audits, CI.",
      },
      {
        name: "Figma Make",
        maker: "Figma",
        cadence: "DAILY",
        use: "Live click-through prototypes for stakeholder review — DPDP, Sign-up Customizer, Patient Portal, AD V2.",
      },
      {
        name: "Lovable",
        maker: "Lovable",
        cadence: "WEEKLY",
        use: "Ship-a-MVP-in-an-afternoon for landing pages and lightweight tools.",
      },
    ],
  },
  {
    category: "Image · Video · Audio",
    note: "moodboarding, motion specs, narration",
    tools: [
      {
        name: "Imagen 3",
        maker: "Google",
        cadence: "WEEKLY",
        use: "Moodboards, hero illustrations, alt-explorations during 0-to-1 discovery.",
      },
      {
        name: "Higgsfield",
        maker: "Higgsfield AI",
        cadence: "EXPLORING",
        use: "Cinematic stills with motion intent baked in — marketing studio compositions.",
      },
      {
        name: "ElevenLabs",
        maker: "ElevenLabs",
        cadence: "WEEKLY",
        use: "Voiceover prototypes, narrated walkthroughs, onboarding scripts.",
      },
      {
        name: "NotebookLM",
        maker: "Google",
        cadence: "WEEKLY",
        use: "Interview synthesis, competitive research, JTBD distillation across multi-source corpora.",
      },
    ],
  },
];

const SKILLS_RUN = [
  {
    name: "impeccable",
    by: "Anthropic",
    use: "Design polish + critique. Used to redesign two illustrations on this portfolio under the bolder rules — and to design this very edition.",
  },
  {
    name: "brand-voice",
    by: "Anthropic",
    use: "Discover, generate, and enforce brand voice. Used to set the editorial tone that runs through this site.",
  },
  {
    name: "figma-use + figma-generate-design",
    by: "Figma + Anthropic",
    use: "Push designed pages from code into Figma using the Plugin API. Pushed three frames into a working file.",
  },
  {
    name: "design-taste-frontend",
    by: "Anthropic",
    use: "UI/UX engineering rules. Enforces metric-based typography and component architecture.",
  },
  {
    name: "high-end-visual-design",
    by: "Anthropic",
    use: "Premium frontend design system. Defines spacing, shadows, and animations that make a website feel expensive.",
  },
  {
    name: "vercel-react-best-practices",
    by: "Vercel",
    use: "React + Next.js performance and composition patterns. Applied to keep this site lean and fast.",
  },
];

const RECEIPTS = [
  {
    title: "Active Directory — five-day prototype",
    where: "miniOrange · 2024",
    body:
      "Production-level cross-functional prototype shipped in 5 business days using Figma Make AI + Claude. ~70% cycle compression on a typical three-week design path.",
  },
  {
    title: "This portfolio — two editions",
    where: "Built with Claude Code · 2026",
    body:
      "Next.js 15, React 19, Motion. Twelve hand-coded SVG illustrations, an editorial design system in CSS variables, three Figma frames pushed via the Plugin API. Two parallel design editions for A/B feel.",
  },
  {
    title: "Brand voice + design system",
    where: "Folio brand · 2026",
    body:
      "PRODUCT.md and DESIGN.md generated via the Anthropic brand-voice skill. Tokens scoped, typography ratios committed, principles documented — the system the screens compose against.",
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

const CHANNELS = [
  {
    label: "Email",
    value: "surajit3255@gmail.com",
    href: "mailto:surajit3255@gmail.com",
    note: "fastest · reply within 24h",
  },
  {
    label: "Phone",
    value: "+91 70010 64616",
    href: "tel:+917001064616",
    note: "IST · scheduled calls preferred",
  },
  {
    label: "LinkedIn",
    value: "/in/surajit3255",
    href: "https://www.linkedin.com/in/surajit3255/",
    note: "for warm intros & coffee chats",
  },
  {
    label: "Resume",
    value: "Download PDF",
    href: "/resume.pdf",
    note: "single-page, recruiter-friendly",
  },
];

/* ──────────────────────────────────────────────────────────
   The composed page
   ─────────────────────────────────────────────────────── */
export function EditionTwo() {
  const projects = getFeaturedProjects().slice(0, 5);

  return (
    <div className={s.scope}>
      {/* Topbar */}
      <header className={s.topbar}>
        <Link href="/edition-two" className={s.topbarBrand} aria-label="Edition Two home">
          <span aria-hidden className={s.topbarMark} />
          <span className={s.topbarName}>
            Surajit Dutta <span className={s.muted}>· Edition Two</span>
          </span>
        </Link>
        <div className={s.topbarMeta}>
          <span className={s.mono}>2026 · After Dark</span>
          <span className={s.muted} aria-hidden>
            /
          </span>
          <Link href="/work" className={s.mono} style={{ color: "var(--e-ink)" }}>
            Work →
          </Link>
        </div>
      </header>

      <main id="main" className={s.page}>
        <div className={s.container}>
          {/* ──────────────────────────────────────────────────
              01 HERO
              ────────────────────────────────────────────── */}
          <section className={s.hero} aria-labelledby="e2-hero">
            <ERev>
              <div className={s.heroMeta}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                  <span aria-hidden className={s.heroDot} />
                  <span className={s.eyebrow}>Open to roles</span>
                </span>
                <span className={s.mono}>Product designer</span>
                <span className={s.mono}>Full-time · Contract</span>
                <span className={s.mono}>Pune · IST · Async US</span>
                <span className={s.mono} style={{ marginLeft: "auto" }}>
                  Reply within 24h
                </span>
              </div>
            </ERev>

            <ERev delay={120}>
              <h1 id="e2-hero" className={s.heroHeadline}>
                I design product flows for{" "}
                <em style={{ fontStyle: "italic", color: "var(--e-accent)" }}>
                  IT and security teams
                </em>
                .
              </h1>
            </ERev>

            <ERev delay={240}>
              <p className={s.heroSub}>
                Three-plus years on enterprise SaaS. Currently at miniOrange,
                leading end-to-end design across IAM, PAM, IGA and UEM. I
                orchestrate <em>Claude</em>, <em>Figma Make AI</em>,{" "}
                <em>Cursor</em> and a widening AI stack to compress
                discovery-to-handoff cycles from weeks to days. Without trading
                taste for speed.
              </p>
              <div className={s.heroCtas}>
                <Link href="/hire" className={`${s.btn} ${s.btnPrimary}`}>
                  Hire me
                </Link>
                <a
                  href="/resume.pdf"
                  download="Surajit-Dutta-CV.pdf"
                  className={`${s.btn} ${s.btnGhost}`}
                >
                  Download CV ↓
                </a>
              </div>
            </ERev>

            <ERev delay={360}>
              <div className={s.heroStats}>
                {STATS.map((stat) => (
                  <div key={stat.label} className={s.heroStat}>
                    <div className={s.heroStatVal}>{stat.value}</div>
                    <div className={s.heroStatLabel}>{stat.label}</div>
                    <div className={s.heroStatNote}>{stat.note}</div>
                  </div>
                ))}
              </div>
            </ERev>
          </section>

          {/* ──────────────────────────────────────────────────
              02 CAPABILITIES
              ────────────────────────────────────────────── */}
          <section
            className={s.section}
            aria-labelledby="e2-capabilities"
            id="capabilities"
          >
            <ERev className={s.sectionHead}>
              <div>
                <span className={s.sectionTag}>§ 02 · Capabilities</span>
                <h2 id="e2-capabilities" style={{ marginTop: 18 }}>
                  Three columns, one practice.
                </h2>
              </div>
              <p className={s.prose} style={{ marginTop: 0 }}>
                Lifted directly from the CV. Read across for the answer most
                hiring managers ask first.
              </p>
            </ERev>

            <div className={s.capGrid}>
              {CAP_COLS.map((c, i) => (
                <ERev key={c.label} delay={i * 120} className={s.capCol}>
                  <div className={s.capLabel}>
                    <span className={s.eyebrow}>{c.label}</span>
                    <span className={s.mono}>№ 0{i + 1}</span>
                  </div>
                  <h3 className={s.capHeading}>{c.title}</h3>
                  <ul className={s.capList}>
                    {c.items.map((it) => (
                      <li key={it} className={s.capItem}>
                        <span aria-hidden className={s.capArrow}>
                          →
                        </span>
                        {it}
                      </li>
                    ))}
                  </ul>
                </ERev>
              ))}
            </div>
          </section>

          {/* ──────────────────────────────────────────────────
              03 SELECTED WORK
              ────────────────────────────────────────────── */}
          <section className={s.section} aria-labelledby="e2-work" id="work">
            <ERev className={s.sectionHead}>
              <div>
                <span className={s.sectionTag}>§ 03 · Selected work</span>
                <h2 id="e2-work" style={{ marginTop: 18 }}>
                  Five projects,{" "}
                  <em style={{ fontStyle: "italic", color: "var(--e-accent)" }}>
                    told as scenes
                  </em>
                  .
                </h2>
              </div>
              <p className={s.prose} style={{ marginTop: 0 }}>
                Most enterprise work at miniOrange is under NDA. Public
                summaries below. Full case studies, screens, and outcome
                metrics on request.
              </p>
            </ERev>

            <div className={s.workList}>
              {projects.map((p, i) => (
                <ERev key={p.slug} delay={i * 80}>
                  <Link
                    href={`/work/${p.slug}`}
                    className={s.workRow}
                    aria-label={`Read the case study for ${p.title}`}
                  >
                    <div className={s.workIndex}>
                      {String(i + 1).padStart(2, "0")} / 05
                    </div>
                    <div>
                      <h3 className={s.workTitle}>
                        {p.title}
                        {p.confidential && (
                          <span
                            className={s.displayItalic}
                            style={{
                              fontSize: "0.45em",
                              color: "var(--e-muted)",
                              marginLeft: 18,
                              verticalAlign: "baseline",
                            }}
                          >
                            (NDA)
                          </span>
                        )}
                      </h3>
                      <p className={s.workSub}>{p.subtitle}</p>
                      <div className={s.workMeta}>
                        <span>{p.year}</span>
                        <span aria-hidden style={{ opacity: 0.4 }}>
                          ·
                        </span>
                        <span>{p.role}</span>
                        <span aria-hidden style={{ opacity: 0.4 }}>
                          ·
                        </span>
                        <span>{p.category}</span>
                      </div>
                    </div>
                    <p className={s.workProblem}>
                      {(p.problem ?? "Confidential. Full brief on request.")
                        .split(".")
                        .filter(Boolean)[0] + "."}
                    </p>
                    <div className={s.workArrow} aria-hidden>
                      →
                    </div>
                  </Link>
                </ERev>
              ))}
            </div>

            <ERev>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  gap: 24,
                  marginTop: 56,
                }}
              >
                <Link href="/work" className={`${s.btn} ${s.btnGhost}`}>
                  See the full archive →
                </Link>
                <a href="#e2-contact" className={`${s.btn} ${s.btnGhost}`}>
                  Have a project in mind? →
                </a>
              </div>
            </ERev>
          </section>

          {/* ──────────────────────────────────────────────────
              04 EXPERIENCE
              ────────────────────────────────────────────── */}
          <section
            className={`${s.section} ${s.sectionAlt}`}
            aria-labelledby="e2-experience"
            id="experience"
          >
            <ERev className={s.sectionHead}>
              <div>
                <span className={s.sectionTag}>§ 04 · Experience</span>
                <h2 id="e2-experience" style={{ marginTop: 18 }}>
                  Three roles,{" "}
                  <em style={{ fontStyle: "italic", color: "var(--e-accent)" }}>
                    one trajectory
                  </em>
                  .
                </h2>
              </div>
              <p className={s.prose} style={{ marginTop: 0 }}>
                A continuous arc from generalist web work into enterprise
                identity. Receipts in the case studies and the resume PDF.
              </p>
            </ERev>

            <div className={s.expRail}>
              {ROLES.map((r) => (
                <ERev key={r.role + r.period} className={s.expEntry}>
                  <div className={s.expHead}>
                    <div className={s.expPeriod}>{r.period}</div>
                    <div>
                      <h3 className={s.expRole}>
                        {r.role}{" "}
                        <em>
                          · {r.place}, {r.location}
                        </em>
                      </h3>
                      <div className={s.expSkills}>
                        {r.skills.map((sk) => (
                          <span key={sk} className={s.expSkill}>
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ul className={s.expBullets}>
                    {r.bullets.map((b) => (
                      <li key={b} className={s.expBullet}>
                        <span aria-hidden className={s.expBulletDot} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </ERev>
              ))}
            </div>
          </section>

          {/* ──────────────────────────────────────────────────
              05 HOW I WORK
              ────────────────────────────────────────────── */}
          <section
            className={s.section}
            aria-labelledby="e2-process"
            id="process"
          >
            <ERev className={s.sectionHead}>
              <div>
                <span className={s.sectionTag}>§ 05 · Approach</span>
                <h2 id="e2-process" style={{ marginTop: 18 }}>
                  How I work,{" "}
                  <em style={{ fontStyle: "italic" }}>in three rules</em>.
                </h2>
              </div>
              <p className={s.prose} style={{ marginTop: 0 }}>
                The principles below show up in every case study. The 8-phase
                loop is the operating manual.
              </p>
            </ERev>

            <div className={s.principleGrid}>
              {PRINCIPLES.map((p, i) => (
                <ERev key={p.n} delay={i * 100} className={s.principle}>
                  <span className={s.principleNum}>{p.n}</span>
                  <h3 className={s.principleTitle}>{p.title}</h3>
                  <p className={s.principleBody}>{p.body}</p>
                </ERev>
              ))}
            </div>

            <ERev>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  marginBottom: 18,
                  gap: 24,
                  flexWrap: "wrap",
                }}
              >
                <span className={s.eyebrow}>▸ The loop · VIII phases</span>
                <Link
                  href="/about#process"
                  className={s.mono}
                  style={{ color: "var(--e-ink)" }}
                >
                  Read the long version →
                </Link>
              </div>
              <ol
                className={s.phases}
                style={{ listStyle: "none", margin: 0, padding: 0 }}
              >
                {PHASES.map((p) => (
                  <li key={p.num} className={s.phase}>
                    <div className={s.phaseHead}>
                      <span
                        aria-hidden
                        className={p.filled ? s.phaseMark : s.phaseMarkOpen}
                      />
                      <span className={s.phaseNum}>{p.num}</span>
                    </div>
                    <div className={s.phaseLabel}>{p.label}</div>
                  </li>
                ))}
              </ol>
              <p className={s.mono} style={{ marginTop: 18 }}>
                ◇ Diverge · ◆ Converge · ↺ most phases loop back to fieldwork
              </p>
            </ERev>
          </section>

          {/* ──────────────────────────────────────────────────
              06 AI TOOLKIT
              ────────────────────────────────────────────── */}
          <section
            className={`${s.section} ${s.sectionAlt}`}
            aria-labelledby="e2-toolkit"
            id="toolkit"
          >
            <ERev className={s.tkManifesto}>
              <div>
                <span className={s.sectionTag}>§ 06 · AI-native workflow</span>
                <h2
                  id="e2-toolkit"
                  style={{
                    marginTop: 18,
                    fontSize: "clamp(56px, 8.5vw, 132px)",
                    lineHeight: 0.9,
                    letterSpacing: "-0.028em",
                  }}
                >
                  I orchestrate.{" "}
                  <em
                    style={{
                      fontStyle: "italic",
                      color: "var(--e-accent)",
                    }}
                  >
                    The models execute
                  </em>
                  .
                </h2>
              </div>
              <p className={s.prose}>
                AI doesn&rsquo;t make me a designer. It lets me be the designer
                who ships in days what used to take weeks. Same taste, more
                reps. The judgment about <em>what</em> to ship still has to be
                human. The work to make it real is where AI earns its keep.
              </p>
            </ERev>

            <div>
              {TOOLKIT.map((cat, ci) => (
                <ERev key={cat.category} className={s.tkCategory}>
                  <div className={s.tkCatLabel}>
                    <span className="num">
                      {String(ci + 1).padStart(2, "0")} · {cat.category.toUpperCase()}
                    </span>
                    <span className="name">{cat.note}</span>
                  </div>
                  <ul className={s.tkTools}>
                    {cat.tools.map((t) => (
                      <li key={t.name} className={s.tkTool}>
                        <div>
                          <div className={s.tkToolName}>{t.name}</div>
                          <div className={s.tkToolMaker}>by {t.maker}</div>
                        </div>
                        <span
                          className={`${s.tkBadge} ${
                            t.cadence === "DAILY"
                              ? s.tkBadgeDaily
                              : t.cadence === "WEEKLY"
                                ? s.tkBadgeWeekly
                                : s.tkBadgeExploring
                          }`}
                        >
                          {t.cadence}
                        </span>
                        <p className={s.tkUse} style={{ margin: 0 }}>
                          {t.use}
                        </p>
                      </li>
                    ))}
                  </ul>
                </ERev>
              ))}
            </div>

            <ERev>
              <h3
                className={s.display}
                style={{
                  fontSize: "clamp(28px, 3vw, 40px)",
                  marginTop: 80,
                  marginBottom: 32,
                }}
              >
                Skills I&rsquo;ve run end-to-end{" "}
                <em style={{ fontStyle: "italic", color: "var(--e-accent)" }}>
                  in production work
                </em>
                .
              </h3>
              <div className={s.skillsGrid}>
                {SKILLS_RUN.map((sk) => (
                  <div key={sk.name} className={s.skill}>
                    <div className={s.skillHead}>
                      <span className={s.skillName}>/{sk.name}</span>
                      <span className={s.skillMaker}>{sk.by.toUpperCase()}</span>
                    </div>
                    <p className={s.skillBody} style={{ margin: 0 }}>
                      {sk.use}
                    </p>
                  </div>
                ))}
              </div>
            </ERev>

            <ERev>
              <div className={s.receipts}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    padding: "20px 0",
                    borderBottom: "1px solid var(--e-edge)",
                  }}
                >
                  <h3
                    className={s.display}
                    style={{ fontSize: 28, margin: 0 }}
                  >
                    The receipts.
                  </h3>
                  <span className={s.mono}>What the stack actually shipped</span>
                </div>
                {RECEIPTS.map((r, i) => (
                  <div key={r.title} className={s.receipt}>
                    <div className={s.receiptNum}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <div className={s.receiptTitle}>{r.title}</div>
                      <div className={s.receiptWhere}>{r.where}</div>
                    </div>
                    <p className={s.receiptBody} style={{ margin: 0 }}>
                      {r.body}
                    </p>
                  </div>
                ))}
              </div>
            </ERev>
          </section>

          {/* ──────────────────────────────────────────────────
              07 EDUCATION
              ────────────────────────────────────────────── */}
          <section
            className={s.section}
            aria-labelledby="e2-edu"
            id="education"
          >
            <ERev className={s.sectionHead}>
              <div>
                <span className={s.sectionTag}>§ 07 · Education</span>
                <h2 id="e2-edu" style={{ marginTop: 18 }}>
                  On paper.
                </h2>
              </div>
              <p className={s.prose} style={{ marginTop: 0 }}>
                Engineering training. The design fluency came from shipping
                work on the job.
              </p>
            </ERev>

            <div className={s.eduList}>
              {EDUCATION.map((e) => (
                <ERev key={e.qual} className={s.eduRow}>
                  <div className={s.eduPeriod}>{e.period}</div>
                  <div>
                    <h3 className={s.eduQual}>{e.qual}</h3>
                    <p className={s.eduPlace}>{e.place}</p>
                  </div>
                  <div className={s.eduScore}>{e.score}</div>
                </ERev>
              ))}
            </div>
          </section>

          {/* ──────────────────────────────────────────────────
              08 BEYOND
              ────────────────────────────────────────────── */}
          <section
            className={`${s.section} ${s.sectionAlt}`}
            aria-labelledby="e2-beyond"
          >
            <ERev className={s.beyondGrid}>
              <div>
                <span className={s.sectionTag}>§ 08 · Off the clock</span>
                <h2
                  id="e2-beyond"
                  style={{
                    marginTop: 18,
                    fontSize: "clamp(40px, 5vw, 80px)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.025em",
                  }}
                >
                  When I&rsquo;m not at the desk.
                </h2>
              </div>
              <p className={s.beyondQuote}>
                I&rsquo;m a <em>quiet collaborator</em> who does best in a
                writing-heavy culture and on teams that take research seriously.
                Most of my spare attention goes to learning new tools deeply —
                recently <em>Figma Make AI, Claude, Cursor</em> — and figuring
                out how to fold them into how I design without losing the human
                judgment that decides what&rsquo;s worth shipping. I read more
                long-form than I should, and still edit the occasional video
                for fun.
              </p>
            </ERev>
          </section>

          {/* ──────────────────────────────────────────────────
              09 CONTACT
              ────────────────────────────────────────────── */}
          <section
            className={s.section}
            aria-labelledby="e2-contact"
            id="e2-contact"
            style={{ paddingBottom: "clamp(64px, 10vh, 120px)" }}
          >
            <ERev>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 18,
                  marginBottom: 32,
                  alignItems: "center",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                  <span aria-hidden className={s.heroDot} />
                  <span className={s.eyebrow}>Open to roles</span>
                </span>
                <span className={s.mono}>
                  Full-time · Contract · IST or async US · Starting within 4 weeks
                </span>
              </div>
              <span className={s.sectionTag}>§ 09 · Contact</span>
              <h2
                id="e2-contact-heading"
                className={s.ctaHeadline}
                style={{ marginTop: 18 }}
              >
                Let&rsquo;s build{" "}
                <em>something good</em> together.
              </h2>
              <p className={s.ctaSub}>
                I&rsquo;m looking for product design roles working on enterprise
                SaaS, design systems, or workflow-heavy products. Email is
                fastest. A 30-minute call is the shortest path.
              </p>
            </ERev>

            <ERev>
              <ul className={s.ctaChannels} style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {CHANNELS.map((c) => {
                  const isExternal = c.href.startsWith("http");
                  return (
                    <li key={c.label}>
                      <a
                        href={c.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noreferrer noopener" : undefined}
                        className={s.ctaChannel}
                        aria-label={`${c.label}: ${c.value}`}
                      >
                        <span className={s.ctaChannelLabel}>{c.label}</span>
                        <span>
                          <span className={s.ctaChannelVal}>{c.value}</span>
                          <span className={s.ctaChannelNote}>{c.note}</span>
                        </span>
                        <span aria-hidden className={s.ctaChannelArrow}>
                          ↗
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </ERev>
          </section>

          {/* Footer */}
          <footer className={s.foot}>
            <span>Surajit Dutta · Folio Edition Two · 2026</span>
            <span>
              <Link href="/">← Back to Edition One (cream)</Link>
            </span>
            <span>Pune · IST</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
