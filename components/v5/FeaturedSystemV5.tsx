"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  CHAPTERS,
  INTERACTIVE_COUNT,
  READ_MINUTES,
} from "@/lib/designSystem/chapters";
import { M } from "@/lib/designSystem/metrics";
import { SdfBlobTransition } from "./SdfBlobTransition";
import { ScrambleText } from "./ScrambleText";

/**
 * §F FeaturedSystemV5 — the design system case, given the front page.
 *
 * The other cases on this page are links. This one is a trailer: the chapter
 * list drives a preview stage, so the visitor sees the shape of the argument
 * before deciding to spend nine minutes on it. Hovering or focusing a chapter
 * scrubs to it; left alone it advances by itself, because a still frame of a
 * page with two interactive chapters undersells it.
 *
 * Autoplay stops the moment anyone touches the list — a preview that keeps
 * moving while you are reading it is an annoyance, not a feature — and never
 * starts at all under prefers-reduced-motion.
 *
 * The miniatures are deliberately abstract. They should read as *something
 * happens here*, not compete with the real figure, so each is one idea with
 * exactly one accented element.
 */

const MINI_W = 260;
const MINI_H = 150;

function Mini({ i }: { i: number }) {
  const common = { viewBox: `0 0 ${MINI_W} ${MINI_H}`, className: "v5-fs-mini" };

  // 01 the audit — many values doing one job, one of them surviving
  if (i === 0) {
    return (
      <svg {...common} aria-hidden>
        {Array.from({ length: 7 }).map((_, c) =>
          Array.from({ length: 3 }).map((_, r) => (
            <rect
              key={`${r}-${c}`}
              x={20 + c * 32}
              y={30 + r * 32}
              width={24}
              height={24}
              rx={2}
              className={r === 1 && c === 3 ? "v5-fs-pill is-hot" : "v5-fs-pill"}
            />
          ))
        )}
      </svg>
    );
  }

  // 02 the roster — five rows, two pulling one way
  if (i === 1) {
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

  // 03 the architecture — four layers, the bindable one lit
  if (i === 2) {
    return (
      <svg {...common} aria-hidden>
        {[0, 1, 2, 3].map((n) => (
          <rect
            key={n}
            x={40}
            y={22 + n * 30}
            width={180}
            height={22}
            className={n === 3 ? "v5-fs-band is-hot" : "v5-fs-band"}
          />
        ))}
      </svg>
    );
  }

  // 04 the mapping — one binding fanning out to four values
  if (i === 3) {
    return (
      <svg {...common} aria-hidden>
        <rect x={14} y={64} width={68} height={22} className="v5-fs-band is-hot" />
        {[20, 54, 88, 122].map((y, n) => (
          <g key={n}>
            <path
              d={`M 82 75 C 118 75, 118 ${y + 11}, 154 ${y + 11}`}
              className="v5-fs-arc"
              fill="none"
            />
            <rect x={154} y={y} width={92} height={22} className="v5-fs-band" />
          </g>
        ))}
      </svg>
    );
  }

  // 05 the component — the matrix, its removed row and its one hole
  if (i === 4) {
    return (
      <svg {...common} aria-hidden>
        {Array.from({ length: 4 }).map((_, r) =>
          Array.from({ length: 7 }).map((_, c) => {
            const removed = r === 3 && c > 1;
            const holed = r === 3 && c === 1;
            return (
              <rect
                key={`${r}-${c}`}
                x={22 + c * 32}
                y={28 + r * 26}
                width={26}
                height={20}
                rx={2}
                className={
                  holed
                    ? "v5-fs-pill is-hot"
                    : removed
                      ? "v5-fs-pill is-off"
                      : "v5-fs-pill"
                }
              />
            );
          })
        )}
      </svg>
    );
  }

  // 06 the library — line/fill pairs, one unmatched
  if (i === 5) {
    return (
      <svg {...common} aria-hidden>
        {Array.from({ length: 5 }).map((_, c) =>
          [0, 1].map((r) => (
            <circle
              key={`${r}-${c}`}
              cx={40 + c * 45}
              cy={54 + r * 42}
              r={13}
              className={
                c === 3 && r === 1
                  ? "v5-fs-ico-fill is-hot"
                  : r === 0
                    ? "v5-fs-ico-line"
                    : "v5-fs-ico-fill"
              }
            />
          ))
        )}
      </svg>
    );
  }

  // 07 the workflow — six gates, the last one closing publication
  if (i === 6) {
    return (
      <svg {...common} aria-hidden>
        <line x1={26} y1={75} x2={234} y2={75} className="v5-fs-axis" />
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <rect
            key={n}
            x={26 + n * 38}
            y={62}
            width={26}
            height={26}
            rx={13}
            className={n === 5 ? "v5-fs-pill is-hot" : "v5-fs-pill"}
          />
        ))}
      </svg>
    );
  }

  // 08 the reckoning — the falling curve against the flat one
  const flat = [78, 76, 79, 77, 76];
  const fall = [78, 54, 39, 29, 22];
  return (
    <svg {...common} aria-hidden>
      {flat.map((v, n) => (
        <rect
          key={`f${n}`}
          x={22 + n * 46}
          y={118 - v}
          width={14}
          height={v}
          className="v5-fs-bar"
        />
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
            <span className="v5-cs-diamond" aria-hidden /> FEATURED CASE · DESIGN SYSTEMS
          </p>

          <h2 className="v5-fs-title" id="v5-fs-title">
            <ScrambleText text="One binding." />
            <br />
            <ScrambleText text="Four" />{" "}
            <em>
              <ScrambleText text="values." />
            </em>
          </h2>

          <p className="v5-fs-lede">
            The token architecture behind five enterprise products:{" "}
            {M.totalVariables.toLocaleString("en-US")} variables across five
            collections, {M.buttonPublished.toLocaleString("en-US")} button
            variants, and a rebrand that costs {M.rebrandCost} tokens. Every
            number on the page was read out of the live Figma files rather than
            written from memory.
          </p>

          <dl className="v5-fs-meta">
            <div>
              <dt>CHAPTERS</dt>
              <dd>{CHAPTERS.length}</dd>
            </div>
            <div>
              <dt>READS</dt>
              <dd>{READ_MINUTES} MIN</dd>
            </div>
            <div>
              <dt>INTERACTIVE</dt>
              <dd>{INTERACTIVE_COUNT}</dd>
            </div>
          </dl>

          <div className="v5-fs-actions">
            <Link href="/process/design-system" className="v5-fs-play">
              <span className="v5-fs-play-glyph" aria-hidden />
              READ THE CASE STUDY
            </Link>
          </div>
        </div>

        <div className="v5-fs-stage">
          {/* The preview. Only the active miniature is mounted, so the swap
              reads as a cut rather than a cross-fade of eight overlaid SVGs. */}
          <Link
            href={`/process/design-system#${chapter.id}`}
            className="v5-fs-screen"
            aria-label={`Read chapter ${chapter.no} — ${chapter.name}`}
            data-cursor-label="Read"
          >
            <span className="v5-fs-screen-top" aria-hidden>
              <i />
              <i />
              <i />
              <span>
                {chapter.no} · {chapter.name.toUpperCase()}
              </span>
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

          <ol className="v5-fs-chapters" onMouseLeave={() => setHeld(false)}>
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
