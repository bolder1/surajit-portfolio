"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CHAPTERS, READ_MINUTES } from "@/lib/systemStory";
import { SdfBlobTransition } from "./SdfBlobTransition";
import { ScrambleText } from "./ScrambleText";

/**
 * §F FeaturedSystemV5 — the design system case, given the front page.
 *
 * The other cases on this page are links. This one is a trailer: the chapter
 * list drives a preview stage, so the visitor sees what the experience does
 * before deciding to spend six minutes on it. Hovering or focusing a chapter
 * scrubs to it; left alone it advances by itself, because a still frame of an
 * interactive page undersells it.
 *
 * Autoplay stops the moment anyone touches the list — a preview that keeps
 * moving while you are reading it is an annoyance, not a feature — and never
 * starts at all under prefers-reduced-motion.
 */

const MINI_W = 260;
const MINI_H = 150;

/** Miniature of each chapter's visual. Deliberately abstract: it should read
 *  as "something happens here", not compete with the real thing. */
function Mini({ i }: { i: number }) {
  const common = { viewBox: `0 0 ${MINI_W} ${MINI_H}`, className: "v5-fs-mini" };

  if (i === 0) {
    // the drift — five surfaces pulling apart
    const drift = [0, 5, -4, 8, -6];
    const radii = [3, 9, 2, 14, 20];
    return (
      <svg {...common} aria-hidden>
        {drift.map((dy, n) => (
          <rect
            key={n}
            x={16 + n * 46}
            y={44 + dy}
            width={36}
            height={62}
            rx={radii[n]}
            className={n === 0 ? "v5-fs-sh" : "v5-fs-sh is-off"}
          />
        ))}
      </svg>
    );
  }

  if (i === 1) {
    // the roster — five rows, two pulling against three
    return (
      <svg {...common} aria-hidden>
        {[0, 1, 2, 3, 4].map((n) => (
          <g key={n}>
            <rect x={20} y={26 + n * 21} width={150} height={12} className="v5-fs-row" />
            <rect
              x={182}
              y={26 + n * 21}
              width={n < 2 ? 40 : 24}
              height={12}
              className={n < 2 ? "v5-fs-row is-hot" : "v5-fs-row"}
            />
          </g>
        ))}
      </svg>
    );
  }

  if (i === 2) {
    // the stack — four layers, the semantic one lit
    return (
      <svg {...common} aria-hidden>
        {[0, 1, 2, 3].map((n) => (
          <rect
            key={n}
            x={40}
            y={22 + n * 30}
            width={180}
            height={22}
            className={n === 1 ? "v5-fs-band is-hot" : "v5-fs-band"}
          />
        ))}
      </svg>
    );
  }

  if (i === 3) {
    // the re-point — the chain, with the tail aimed somewhere new
    return (
      <svg {...common} aria-hidden>
        {[0, 1, 2].map((n) => (
          <rect key={n} x={26} y={22 + n * 42} width={104} height={28} className="v5-fs-band" />
        ))}
        <path d="M 130 50 C 168 62, 168 98, 130 110" className="v5-fs-arc" fill="none" />
        <rect x={168} y={40} width={66} height={70} rx={5} className="v5-fs-sh" />
      </svg>
    );
  }

  if (i === 4) {
    // no designer — a vocabulary with one value chosen
    return (
      <svg {...common} aria-hidden>
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3].map((c) => (
            <rect
              key={`${r}-${c}`}
              x={22 + c * 56}
              y={30 + r * 32}
              width={46}
              height={18}
              className={r === 1 && c === 2 ? "v5-fs-pill is-hot" : "v5-fs-pill"}
            />
          ))
        )}
      </svg>
    );
  }

  // how it scales — the falling curve over the flat one
  const flat = [78, 76, 79, 77, 76];
  const fall = [78, 54, 39, 29, 22];
  return (
    <svg {...common} aria-hidden>
      {flat.map((v, n) => (
        <rect key={`f${n}`} x={22 + n * 46} y={118 - v} width={14} height={v} className="v5-fs-bar" />
      ))}
      {fall.map((v, n) => (
        <rect
          key={`d${n}`}
          x={40 + n * 46}
          y={118 - v}
          width={14}
          height={v}
          className="v5-fs-bar is-hot"
        />
      ))}
      <line x1={16} y1={118} x2={244} y2={118} className="v5-fs-axis" />
    </svg>
  );
}

export function FeaturedSystemV5() {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (held) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setInterval(() => {
      setActive((a) => (a + 1) % CHAPTERS.length);
    }, 2600);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [held]);

  const chapter = CHAPTERS[active];

  return (
    <section className="v5-fs" aria-labelledby="v5-fs-title">
      <div className="v5-fs-wrap">
        <div className="v5-fs-side">
          <p className="v5-fs-eyebrow">
            <span className="v5-cs-diamond" aria-hidden /> FEATURED CASE · C-06 · DESIGN SYSTEMS
          </p>

          <h2 className="v5-fs-title" id="v5-fs-title">
            <ScrambleText text="Five products." />
            <br />
            <ScrambleText text="Nobody chose" />{" "}
            <em>
              <ScrambleText text="this." />
            </em>
          </h2>

          <p className="v5-fs-lede">
            A design system for five enterprise products, and the five people who
            wanted contradictory things from it. Built as a scroll experience —
            every claim is demonstrated by the thing on screen, and two chapters
            let you try to break it yourself.
          </p>

          <dl className="v5-fs-meta">
            <div>
              <dt>CHAPTERS</dt>
              <dd>{CHAPTERS.length}</dd>
            </div>
            <div>
              <dt>RUNS</dt>
              <dd>{READ_MINUTES} MIN</dd>
            </div>
            <div>
              <dt>INTERACTIVE</dt>
              <dd>2</dd>
            </div>
          </dl>

          <div className="v5-fs-actions">
            <Link href="/system" className="v5-fs-play">
              <span className="v5-fs-play-glyph" aria-hidden />
              PLAY THE EXPERIENCE
            </Link>
            <Link href="/process/design-system" className="v5-fs-read">
              READ THE WRITTEN CASE&nbsp;↗
            </Link>
          </div>
        </div>

        <div className="v5-fs-stage">
          {/* The preview. Only the active miniature is mounted, so the swap
              reads as a cut rather than a cross-fade of six overlaid SVGs. */}
          <Link
            href="/system"
            className="v5-fs-screen"
            aria-label={`Play the experience — ${chapter.name}`}
            data-cursor-label="Play"
          >
            <span className="v5-fs-screen-top" aria-hidden>
              <i />
              <i />
              <i />
              <span>{chapter.no} · {chapter.name.toUpperCase()}</span>
            </span>
            {/* A cut between two abstract diagrams reads as a glitch. The blob
                wipe covers the swap, so the change looks authored — and because
                the curtain hides the exact frame the SVG is replaced, the new
                miniature is already laid out when it is uncovered. */}
            <div className="v5-fs-screen-body">
              <SdfBlobTransition transitionKey={active} duration={760}>
                <Mini i={active} />
              </SdfBlobTransition>
            </div>
            <span className="v5-fs-screen-cap">{chapter.blurb}</span>
          </Link>

          <ol
            className="v5-fs-chapters"
            onMouseLeave={() => setHeld(false)}
          >
            {CHAPTERS.map((c, i) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={`v5-fs-chapter${i === active ? " is-on" : ""}`}
                  aria-pressed={i === active}
                  onMouseEnter={() => {
                    setHeld(true);
                    setActive(i);
                  }}
                  onFocus={() => {
                    setHeld(true);
                    setActive(i);
                  }}
                  onClick={() => setActive(i)}
                >
                  <span className="n">{c.no}</span>
                  <span className="t">{c.name}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
