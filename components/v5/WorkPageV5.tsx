"use client";

import { useState } from "react";
import Link from "next/link";
import { getAllProjects } from "@/lib/projects";

/**
 * WorkPageV5 — the full work archive. Every project (incl. NDA) with
 * category filters and a grid / list view toggle. Each entry links to its
 * case study at /cases/[slug].
 */

const CAT_COLOR: Record<string, string> = {
  "Enterprise SaaS": "#2f57c4",
  "Design System": "#9a6a2f",
  "Mobile App": "#7a36c0",
  "Web App": "#11806a",
  "Website": "#b4501f",
};

export function WorkPageV5() {
  const all = getAllProjects();
  const cats = ["All", ...Array.from(new Set(all.map((p) => p.category)))];
  const [cat, setCat] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");

  const items = cat === "All" ? all : all.filter((p) => p.category === cat);

  return (
    <main id="main" className="v5-work">
      <div className="v5-work-topbar">
        <span className="eyebrow">/ work</span>
        <Link href="/" className="v5-work-back">← Back</Link>
      </div>

      <header className="v5-work-head">
        <h1 className="v5-work-title">
          Everything I&rsquo;ve <em>shipped.</em>
        </h1>
        <p className="v5-work-sub">
          {all.length} projects across enterprise SaaS, mobile, web and design
          systems. Some are under NDA — outcomes shared on request.
        </p>
      </header>

      <div className="v5-work-controls">
        <div className="v5-work-filters" role="tablist" aria-label="Filter by category">
          {cats.map((c) => (
            <button key={c} role="tab" aria-selected={c === cat} className={c === cat ? "on" : ""} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="v5-work-view" role="group" aria-label="View">
          <button aria-pressed={view === "grid"} className={view === "grid" ? "on" : ""} onClick={() => setView("grid")}>Grid</button>
          <button aria-pressed={view === "list"} className={view === "list" ? "on" : ""} onClick={() => setView("list")}>List</button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="v5-work-grid">
          {items.map((p) => (
            <Link key={p.slug} href={`/cases/${p.slug}`} className="v5-work-card" aria-label={p.title}>
              <span className="cover" style={{ background: `radial-gradient(ellipse 90% 80% at 60% 20%, ${CAT_COLOR[p.category] ?? "#2a2a28"}, #0c0c0e 76%)` }}>
                <span className="glyph">{p.title.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase()}</span>
                {p.confidential && <span className="nda">NDA</span>}
              </span>
              <span className="meta">
                <span className="cat">{p.category} · {p.year}</span>
                <span className="ttl">{p.title}</span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <ul className="v5-work-list">
          {items.map((p, i) => (
            <li key={p.slug}>
              <Link href={`/cases/${p.slug}`} className="v5-work-row" aria-label={p.title}>
                <span className="no">{String(i + 1).padStart(2, "0")}</span>
                <span className="ttl">{p.title}{p.confidential && <span className="nda">NDA</span>}</span>
                <span className="cat">{p.category}</span>
                <span className="yr">{p.year}</span>
                <span className="arr" aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
