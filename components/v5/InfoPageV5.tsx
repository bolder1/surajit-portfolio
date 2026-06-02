"use client";

import Link from "next/link";

/**
 * InfoPageV5 — the dedicated About / Info page (/info).
 *
 * Layout mirrors a clean editorial "info" screen: big "Info" title,
 * BACK link, a crosshair-framed portrait + meta on the left, and the
 * about copy + a four-column capability grid on the right. Background
 * reuses the v5 orange abstract with a left-weighted scrim so the copy
 * stays legible.
 */

const META = [
  { label: "Based in", value: "Kolkata, India · IST" },
  { label: "Currently", value: "Product Designer, miniOrange" },
  { label: "Status", value: "Open to senior roles & select freelance" },
];

const SKILLS: Array<{ head: string; items: string[] }> = [
  {
    head: "Design",
    items: ["Figma", "Design systems", "Prototyping", "Interaction design", "Auto-layout"],
  },
  {
    head: "Research",
    items: ["User interviews", "Usability testing", "Journey mapping", "Heuristic eval"],
  },
  {
    head: "Domains",
    items: ["IAM · PAM", "IGA · UEM", "Enterprise SaaS", "Fintech", "Healthcare"],
  },
  {
    head: "AI & Workflow",
    items: ["Claude", "Figma Make AI", "Cursor", "Framer", "Notion"],
  },
];

export function InfoPageV5() {
  return (
    <main className="v5-info">
      {/* Orange abstract background (same as the home hero) */}
      <div className="v5-hero-abstract" aria-hidden>
        <span />
      </div>
      <div className="v5-info-scrim" aria-hidden />

      <header className="v5-info-header">
        <h1 className="v5-info-title">Info</h1>
        <Link href="/" className="v5-info-back">
          ← Back
        </Link>
      </header>

      <div className="v5-info-grid">
        {/* Left rail */}
        <aside className="v5-info-side">
          <div className="v5-info-portrait">
            <span className="x tl">+</span>
            <span className="x tr">+</span>
            <span className="x bl">+</span>
            <span className="x br">+</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/v5/portrait.png"
              alt="Surajit Dutta"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
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

        {/* Right: about + skills */}
        <div className="v5-info-main">
          <p className="v5-info-eyebrow">About</p>
          <h2 className="v5-info-name">
            Surajit <em>Dutta.</em>
          </h2>

          <p className="v5-info-lead">
            Product designer for enterprise IT, identity and security
            teams — building UX that earns its second year.
          </p>

          <p className="v5-info-body">
            I craft enterprise UX where technical rigor meets clarity.
            Three years across IAM, PAM, IGA and UEM at miniOrange, I
            design for the operator who inherits the dashboard — their
            time, their context, their audit trail. Obsessed with
            systems, interaction and <em>detail</em>, and increasingly
            AI-native in how I work — roughly 70% cycle compression from
            spec to shipped flow.
          </p>

          <div className="v5-info-skills">
            {SKILLS.map((col) => (
              <div key={col.head}>
                <p className="v5-info-skill-head">{col.head}</p>
                <div className="v5-info-skill-list">
                  {col.items.map((it) => (
                    <span key={it}>{it}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="v5-info-footer">
        <a href="mailto:surajit3255@gmail.com">surajit3255@gmail.com</a>
        <span className="ver">→ V5.0</span>
      </footer>
    </main>
  );
}
