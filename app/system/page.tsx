import type { Metadata } from "next";
import Link from "next/link";
import { CHAPTERS, READ_MINUTES } from "@/lib/systemStory";
import { SystemRail } from "@/components/system/SystemRail";
import {
  ChapterDrift,
  ChapterRoster,
  ChapterStack,
  ChapterRepoint,
  ChapterDropdown,
  ChapterScale,
} from "@/components/system/chapters";

export const metadata: Metadata = {
  title: "The Drift — a design system, told as an argument",
  description:
    "Five products pulling apart, five people who want contradictory things, and the layered system that serves all of them. A scroll-driven case study.",
};

/**
 * /system — the design system case, built to be watched rather than read.
 *
 * /process/design-system is the written version. This is the same material as
 * a demonstration: every claim it makes is proven by the thing on screen, and
 * the two interactive chapters let you try to break the claim yourself.
 *
 * Chapters are pinned scroll sections; each drops its pin below 760×620 or
 * under prefers-reduced-motion and becomes an ordinary stacked section.
 */
export default function SystemPage() {
  const [drift, roster, stack, repoint, unassisted, scale] = CHAPTERS;

  return (
    <main className="sys">
      <SystemRail />

      {/* ── cover ────────────────────────────────────────────── */}
      <header className="sys-cover">
        <div className="sys-cover-top">
          <Link href="/process/design-system" className="sys-cover-back">
            ← THE WRITTEN CASE
          </Link>
          <span className="sys-cover-meta">
            {CHAPTERS.length} CHAPTERS · {READ_MINUTES} MIN · SCROLL TO PLAY
          </span>
        </div>

        <p className="sys-cover-eyebrow">CASE STUDY · CENTRAL DESIGN SYSTEM</p>
        <h1 className="sys-cover-title">
          Five products.
          <br />
          Nobody chose <em>this.</em>
        </h1>
        <p className="sys-cover-lede">
          Every team made a defensible decision. Together they made a mess nobody
          picked, and a system that had to serve five people who wanted
          contradictory things. Here is what it took to fix it — and the one
          number that decides whether it worked.
        </p>

        <ol className="sys-cover-index">
          {CHAPTERS.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`}>
                <span className="n">{c.no}</span>
                <span className="t">{c.name}</span>
                <span className="b">{c.blurb}</span>
              </a>
            </li>
          ))}
        </ol>

        <span className="sys-cover-cue" aria-hidden>
          ↓
        </span>
      </header>

      <ChapterDrift chapter={drift} />
      <ChapterRoster chapter={roster} />
      <ChapterStack chapter={stack} />
      <ChapterRepoint chapter={repoint} />
      <ChapterDropdown chapter={unassisted} />
      <ChapterScale chapter={scale} />

      {/* ── outro ────────────────────────────────────────────── */}
      <section className="sys-outro">
        <p className="sys-outro-k">THE HONEST PART</p>
        <p className="sys-outro-line">
          Adoption and velocity figures for this system are under NDA, so none
          are published here. What is published is the measurement model — what
          to count, and what a bad reading means. An invented number would be
          worse than an empty column.
        </p>

        <div className="sys-outro-actions">
          <Link href="/process/design-system" className="sys-btn is-primary">
            READ THE FULL CASE&nbsp;↗
          </Link>
          <Link href="/process" className="sys-btn">
            ALL PROCESS CASES
          </Link>
          <Link href="/contact" className="sys-btn">
            START ONE
          </Link>
        </div>

        <footer className="sys-foot">
          <span>SURAJIT DUTTA</span>
          <span>C-06 · CENTRAL DESIGN SYSTEM</span>
          <span>MINIORANGE · 2024 — PRESENT</span>
        </footer>
      </section>
    </main>
  );
}
