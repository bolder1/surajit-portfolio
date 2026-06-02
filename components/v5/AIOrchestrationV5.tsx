"use client";

import Link from "next/link";

/**
 * AIOrchestrationV5 — the full AI orchestration page (/ai).
 *
 * Restyled to mirror the Info page's editorial one-pager: orange abstract
 * + scrim, big header title + BACK, a left meta/visual rail, and a right
 * column with manifesto copy + a four-column capability grid (the stack).
 * Skills-run and receipts follow in the same visual language.
 */

const META = [
  { label: "Cycle", value: "~70% faster · spec → shipped" },
  { label: "Core stack", value: "Claude · Figma Make AI · Cursor" },
];

const STACK: Array<{ head: string; note: string; tools: Array<{ name: string; cadence: string }> }> = [
  {
    head: "Reasoning & writing",
    note: "the thinking-partner layer",
    tools: [
      { name: "Claude", cadence: "DAILY" },
      { name: "ChatGPT", cadence: "DAILY" },
      { name: "Cowork", cadence: "WEEKLY" },
    ],
  },
  {
    head: "Design generation",
    note: "the make-it-real layer",
    tools: [
      { name: "Figma Make AI", cadence: "DAILY" },
      { name: "Cursor", cadence: "DAILY" },
      { name: "Antigravity", cadence: "EXPLORING" },
    ],
  },
  {
    head: "Vibe coding",
    note: "AI builds it, I direct the taste",
    tools: [
      { name: "Claude Code", cadence: "DAILY" },
      { name: "Lovable", cadence: "WEEKLY" },
      { name: "Bolt", cadence: "WEEKLY" },
    ],
  },
  {
    head: "Image · video · research",
    note: "moodboards, films, synthesis",
    tools: [
      { name: "Imagen 3", cadence: "WEEKLY" },
      { name: "Sora", cadence: "EXPLORING" },
      { name: "NotebookLM", cadence: "WEEKLY" },
    ],
  },
];

export function AIOrchestrationV5() {
  return (
    <main className="v5-info v5-aip">
      {/* Orange abstract background (same as the home hero / info page) */}
      <div className="v5-hero-abstract" aria-hidden>
        <span />
      </div>
      <div className="v5-info-scrim" aria-hidden />

      <header className="v5-info-header">
        <h1 className="v5-info-title">AI</h1>
        <Link href="/" className="v5-info-back">← Back</Link>
      </header>

      <div className="v5-info-grid">
        {/* Left rail: framed 3D render + meta */}
        <aside className="v5-info-side">
          <div className="v5-info-portrait v5-aip-portrait">
            <span className="x tl">+</span>
            <span className="x tr">+</span>
            <span className="x bl">+</span>
            <span className="x br">+</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/v5/img-b.avif"
              alt=""
              aria-hidden
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          </div>
          <div className="v5-info-meta">
            {META.map((m) => (
              <div className="v5-info-meta-row" key={m.label}>
                <span className="v5-info-meta-label">{m.label}</span>
                <span className="v5-info-meta-value">{m.value}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Right: manifesto + the stack */}
        <div className="v5-info-main">
          <p className="v5-info-eyebrow">AI Orchestration</p>
          <h2 className="v5-info-name">
            I orchestrate. <em>Models execute.</em>
          </h2>

          <p className="v5-info-lead">
            AI doesn&rsquo;t make me a designer. It lets me be the designer
            who ships in days what used to take weeks — same taste, more reps.
          </p>

          <p className="v5-info-body">
            The judgment about <em>what</em> to ship stays human; the work to
            make it real is where AI earns its keep. Daily · Weekly · Exploring
            labels keep the claims defensible — ask in an interview and
            I&rsquo;ll show receipts.
          </p>

          <div className="v5-aistack">
            {STACK.map((col) => (
              <div className="v5-aistack-cat" key={col.head}>
                <p className="v5-aistack-head">{col.head}</p>
                <p className="v5-aistack-note">{col.note}</p>
                <ul className="v5-aistack-tools">
                  {col.tools.map((t) => (
                    <li key={t.name}>
                      <span className="nm">{t.name}</span>
                      <span className={`cad cad-${t.cadence.toLowerCase()}`}>{t.cadence}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="v5-aistack-cta">
            <Link href="/#contact" className="v5-btn-primary">Work with me&nbsp;↗</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
