"use client";

import { useEffect, useRef, useState } from "react";

/**
 * §05 PipelineV2 — the process, as the thing being sold.
 *
 * A pinned horizontal conveyor of eight stations. A volt rail runs through the
 * middle of the track; above it is what I decide, below it is what the models
 * execute. A token rides the rail as you scroll and the station it reaches
 * comes forward.
 *
 * The split matters more than the stations do: the reason this is fast without
 * being slop is that judgement never moves below the line.
 */

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

type Station = {
  n: string;
  title: string;
  mine: string;
  model: string;
};

/* Sixteen fifteen-word sentences on a conveyor that moves past you is
   reading nobody does. Each station is now a phrase you can take in during
   the second it is in front of you. The split — who decides, who executes —
   is the argument; the prose was never carrying it. */
const STATIONS: Station[] = [
  {
    n: "01",
    title: "Requirements",
    mine: "Find the constraint that actually binds.",
    model: "Transcribe, cluster, surface contradictions.",
  },
  {
    n: "02",
    title: "My own PRD",
    mine: "Decide what ships. Harder: what does not.",
    model: "Draft it, tear down four competitors.",
  },
  {
    n: "03",
    title: "Brand read",
    mine: "Set the register.",
    model: "Pull real tokens and type. Generate on-brand.",
  },
  {
    n: "04",
    title: "Working prototype",
    mine: "Own the interaction model.",
    model: "Build it multi-frame, on real data shapes.",
  },
  {
    n: "05",
    title: "End-to-end test",
    mine: "Define what correct means.",
    model: "Drive every path. Log every dead end.",
  },
  {
    n: "06",
    title: "Design audit",
    mine: "Judge which flags are real.",
    model: "Catch contrast, missing states, dead screens.",
  },
  {
    n: "07",
    title: "Figma push",
    mine: "Own naming and structure.",
    model: "Generate tokens, components, the matrix.",
  },
  {
    n: "08",
    title: "Handoff + A/B",
    mine: "Pick the winner. Write the spec.",
    model: "Produce variations. Wire the comparison.",
  },
];

export function PipelineV2() {
  const sceneRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const scene = sceneRef.current;
    const track = trackRef.current;
    if (!scene || !track) return;

    let frame = 0;
    const compute = () => {
      frame = 0;
      const rect = scene.getBoundingClientRect();
      const runway = rect.height - window.innerHeight;
      const p = runway > 0 ? clamp01(-rect.top / runway) : 0;

      // Translate so the station at continuous position p sits under the
      // playhead at 50% of the viewport. One pitch = station width + gap.
      const list = track.querySelector<HTMLElement>(".v2-pipe-list");
      const first = list?.firstElementChild as HTMLElement | null;
      if (list && first) {
        const gap = parseFloat(getComputedStyle(list).columnGap || "0") || 0;
        const pitch = first.offsetWidth + gap;
        const x = window.innerWidth / 2 - first.offsetWidth / 2 - p * (STATIONS.length - 1) * pitch;
        track.style.setProperty("--px", `${x.toFixed(1)}px`);
      }

      const i = Math.round(p * (STATIONS.length - 1));
      setActive((prev) => (prev === i ? prev : i));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sceneRef} id="v2-process" className="v2-pipe" aria-labelledby="v2-pipe-h">
      <div className="v2-pipe-pin">
        <div className="v2-wrap v2-pipe-head">
          <div>
            <p className="v2-eyebrow">
              <b>06</b> The operating system
            </p>
            <h2 id="v2-pipe-h" className="v2-pipe-title">
              Judgement above the line.
              <br />
              <em>Execution</em> below it.
            </h2>
          </div>
          <p className="v2-pipe-note">
            Nothing on the top row is delegated. Nothing on the bottom row is
            done by hand.
            <span className="v2-pipe-count">
              <b>{String(active + 1).padStart(2, "0")}</b> / {STATIONS.length}
            </span>
          </p>
        </div>

        <div className="v2-pipe-track" ref={trackRef}>
          <ol className="v2-pipe-list">
            {STATIONS.map((s, i) => (
              <li
                className="v2-st"
                key={s.n}
                data-on={i === active ? "1" : "0"}
                data-past={i < active ? "1" : "0"}
              >
                <div className="v2-st-lane is-mine">
                  <span className="v2-st-lane-lbl">I decide</span>
                  <p>{s.mine}</p>
                </div>

                <div className="v2-st-node">
                  <span className="v2-st-dot" aria-hidden />
                  <span className="v2-st-n">{s.n}</span>
                  <h3 className="v2-st-title">{s.title}</h3>
                </div>

                <div className="v2-st-lane is-model">
                  <span className="v2-st-lane-lbl">Models execute</span>
                  <p>{s.model}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
