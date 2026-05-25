import type { Metadata } from "next";
import { Masthead } from "@/components/Masthead";
import { Folio } from "@/components/Folio";

export const metadata: Metadata = {
  title: "AI Workflow — Surajit Dutta",
  description:
    "How I orchestrate Claude, Figma Make AI, Cursor, and the rest of the stack into a repeatable design workflow.",
};

/**
 * /ai — the AI workflow page.
 *
 * Manifesto, toolkit, skills run, receipts. Lifted out of the home so
 * the home can stay concise and this page can do the full long-form
 * argument.
 */

const TOOLKIT = [
  {
    category: "REASONING & WRITING",
    note: "the thinking partner layer",
    tools: [
      { name: "Claude", maker: "Anthropic", cadence: "DAILY", use: "JTBD framing · design critique · edge-case enumeration · microcopy" },
      { name: "ChatGPT", maker: "OpenAI", cadence: "DAILY", use: "alt-copy · structured summaries · second-opinion checks" },
      { name: "Cowork", maker: "Anthropic", cadence: "WEEKLY", use: "skill orchestration — brand-voice, impeccable, design-taste run as workflows" },
    ],
  },
  {
    category: "DESIGN GENERATION",
    note: "the make-it-real layer",
    tools: [
      { name: "Figma Make AI", maker: "Figma", cadence: "DAILY", use: "production prototypes — 5-day Active Directory console, multi-frame flows ready for handoff" },
      { name: "Cursor", maker: "Cursor", cadence: "DAILY", use: "design tokens · prototype scaffolding · spec refactors paired with Claude" },
      { name: "Antigravity", maker: "Google", cadence: "EXPLORING", use: "agentic IDE — multi-file design + code orchestration" },
    ],
  },
  {
    category: "VIBE CODING",
    note: "AI builds the artifact, I direct the taste",
    tools: [
      { name: "Claude Code", maker: "Anthropic", cadence: "DAILY", use: "engineering pair — wrote this portfolio end-to-end (Next.js, React 19)" },
      { name: "Claude Design", maker: "Anthropic", cadence: "DAILY", use: "HTML/CSS/JS prototype generation from a brief — Banking Tool" },
      { name: "Figma Make", maker: "Figma", cadence: "DAILY", use: "live click-through prototypes for stakeholder review" },
      { name: "Lovable", maker: "Lovable", cadence: "WEEKLY", use: "ship-a-MVP-in-an-afternoon for landing pages" },
      { name: "Bolt", maker: "StackBlitz", cadence: "WEEKLY", use: "rapid full-stack scaffolds when a prototype needs a backend" },
    ],
  },
  {
    category: "IMAGE",
    note: "moodboarding to brand assets",
    tools: [
      { name: "Imagen 3", maker: "Google", cadence: "WEEKLY", use: "moodboards · hero illustrations · alt-explorations" },
      { name: "Freepik (Mystic · Pikaso · Spaces)", maker: "Freepik", cadence: "WEEKLY", use: "texture · brand assets · composite work" },
      { name: "Higgsfield", maker: "Higgsfield AI", cadence: "EXPLORING", use: "cinematic stills with motion intent baked in" },
    ],
  },
  {
    category: "VIDEO & AUDIO",
    note: "product films + voiceover",
    tools: [
      { name: "Sora", maker: "OpenAI", cadence: "EXPLORING", use: "animated process diagrams · micro-interactions" },
      { name: "Flow", maker: "Google DeepMind", cadence: "EXPLORING", use: "director-style scene composition" },
      { name: "ElevenLabs", maker: "ElevenLabs", cadence: "WEEKLY", use: "voiceover prototypes · narrated walkthroughs" },
    ],
  },
  {
    category: "KNOWLEDGE",
    note: "the research layer",
    tools: [
      { name: "NotebookLM", maker: "Google", cadence: "WEEKLY", use: "interview synthesis · competitive research · JTBD distillation" },
    ],
  },
];

const SKILLS_RUN = [
  { name: "impeccable",          by: "Anthropic", use: "Design polish + critique. Redesigned two illustrations on this portfolio under bolder rules." },
  { name: "brand-voice",         by: "Anthropic", use: "Discover, generate, and enforce brand voice." },
  { name: "design-taste-frontend",by: "Anthropic", use: "UI/UX engineering rules. Metric-based typography, component architecture." },
  { name: "ui-ux-pro-max",       by: "Community", use: "50+ styles, 161 palettes, 99 UX rules. Directed the Swiss → Brutalist pivot." },
  { name: "figma-use",           by: "Figma + Anthropic", use: "Push designs from code into Figma via the Plugin API." },
  { name: "high-end-visual-design",by: "Anthropic", use: "Premium frontend system. Spacing, shadows, motion that read as expensive." },
];

const RECEIPTS = [
  {
    title: "Active Directory — Five-Day Prototype",
    where: "miniOrange, 2024",
    body: "Production-level cross-functional prototype shipped in 5 business days using Figma Make AI + Claude. ~70% cycle compression.",
  },
  {
    title: "This portfolio",
    where: "Built with Claude Code, 2026",
    body: "Brutalist + Electric edition. Inter Display + JetBrains Mono. Built end-to-end with Claude Code; direction from ui-ux-pro-max skill.",
  },
  {
    title: "Throughline — feedback-to-decision tool",
    where: "Standalone product, 2026",
    body: "Triage Inbox, decision log, primitive library. throughline-app.vercel.app",
  },
];

function CadenceBadge({ cadence }: { cadence: string }) {
  const styleMap: Record<string, string> = {
    DAILY: "bg-[var(--accent)] !text-[var(--paper)] border-[var(--accent)] [&]:!text-[var(--paper)]",
    WEEKLY: "border-[var(--ink)] text-[var(--ink)]",
    EXPLORING: "border-[var(--rule-soft)] text-[var(--muted)]",
  };
  return (
    <span
      className={`inline-flex items-center mono text-[10px] tracking-[0.14em] uppercase border px-2 py-1 ${
        styleMap[cadence] ?? styleMap.EXPLORING
      }`}
    >
      {cadence}
    </span>
  );
}

export default function AIWorkflowPage() {
  return (
    <>
      <Masthead variant="compact" />
      <main id="main" className="pb-20">
        {/* Hero / manifesto */}
        <section className="border-b border-[var(--rule-soft)]">
          <div className="swiss-container py-14 md:py-24">
            <p className="section-tag mb-6">/ai — orchestrate. execute.</p>
            <div className="swiss-grid items-end">
              <div className="col-span-12 md:col-span-8">
                <h1 className="display text-[14vw] md:text-[8vw] lg:text-[120px]">
                  i orchestrate. <br />
                  models execute.
                </h1>
              </div>
              <div className="col-span-12 md:col-span-4 md:pb-2">
                <p className="body-prose">
                  AI doesn&apos;t make me a designer. It lets me be the
                  designer who ships in days what used to take weeks — same
                  taste, more reps. The judgment about <em>what</em> to ship
                  stays human; the work to make it real is where AI earns
                  its keep.
                </p>
                <p className="body-prose-sm mt-4 text-[var(--ink-soft)]">
                  Daily · Weekly · Exploring labels keep the claims
                  defensible. Ask in an interview — I&apos;ll show receipts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Toolkit */}
        <section className="border-b border-[var(--rule-soft)]">
          <div className="swiss-container py-14 md:py-20">
            <p className="section-tag mb-6">— the stack</p>
            <div className="border-t-2 border-[var(--rule)]">
              {TOOLKIT.map((cat, ci) => (
                <div
                  key={cat.category}
                  className="swiss-grid gap-y-4 py-7 md:py-9 border-b border-[var(--rule-soft)]"
                >
                  <div className="col-span-12 md:col-span-3">
                    <div className="mono-accent mb-2">
                      {String(ci + 1).padStart(2, "0")} · {cat.category}
                    </div>
                    <p className="text-[17px] md:text-[18px] text-[var(--ink-soft)]">
                      {cat.note}
                    </p>
                  </div>
                  <ul className="col-span-12 md:col-span-9 space-y-4 md:space-y-5">
                    {cat.tools.map((t) => (
                      <li key={t.name} className="swiss-grid gap-y-1 items-baseline">
                        <div className="col-span-12 md:col-span-4">
                          <div className="display text-[20px] md:text-[24px]">
                            {t.name}
                          </div>
                          <div className="mono text-[var(--muted)] mt-1">
                            by {t.maker.toUpperCase()}
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-2">
                          <CadenceBadge cadence={t.cadence} />
                        </div>
                        <div className="col-span-12 md:col-span-6 body-prose-sm">
                          {t.use}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills run */}
        <section className="border-b border-[var(--rule-soft)]">
          <div className="swiss-container py-14 md:py-20">
            <p className="section-tag mb-6">— skills run in production</p>
            <h2 className="display text-[8vw] md:text-[5vw] lg:text-[56px] mb-8">
              orchestrated, not one-off.
            </h2>
            <div className="swiss-grid border-t-2 border-[var(--rule)]">
              {SKILLS_RUN.map((s, i) => (
                <div
                  key={s.name}
                  className={`col-span-12 md:col-span-6 lg:col-span-4 p-5 md:p-6 border-b border-[var(--rule-soft)] ${
                    i % 3 !== 0 ? "lg:border-l" : ""
                  } ${i % 2 !== 0 ? "md:border-l lg:border-l" : ""}`}
                >
                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <span className="mono-accent">/{s.name}</span>
                    <span className="mono-xs">{s.by.toUpperCase()}</span>
                  </div>
                  <p className="body-prose-sm">{s.use}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Receipts */}
        <section>
          <div className="swiss-container py-14 md:py-20">
            <p className="section-tag mb-6">— receipts</p>
            <h2 className="display text-[8vw] md:text-[5vw] lg:text-[56px] mb-8">
              what the stack shipped.
            </h2>
            <ol className="border-t-2 border-[var(--rule)]">
              {RECEIPTS.map((r, i) => (
                <li
                  key={r.title}
                  className="swiss-grid border-b border-[var(--rule-soft)] py-5 md:py-7"
                >
                  <div className="col-span-2 md:col-span-1 mono text-[var(--muted)]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="col-span-10 md:col-span-4">
                    <div className="display text-[22px] md:text-[28px]">
                      {r.title}
                    </div>
                    <div className="mono-accent mt-1.5">{r.where}</div>
                  </div>
                  <p className="col-span-12 md:col-span-7 body-prose-sm mt-3 md:mt-0">
                    {r.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <Folio pageNum="06" />
    </>
  );
}
