"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SHOWCASE_PRODUCTS } from "@/lib/showcase";
import { InfiniteSlider } from "./InfiniteSlider";
import { ScrambleText } from "./ScrambleText";
import { ClippedCircle } from "./ClippedCircle";

/**
 * §C ReceiptsV5 — the proof, as a list you can click into.
 *
 * Replaces the pinned desk reel. The reel spent a long scroll showing
 * captured screens inside a laptop, and a capture taken before an app
 * finished loading reads as a skeleton — which made real, shipped work look
 * like a mockup. A row list has no such failure mode: the name and the URL
 * carry the claim, and the screenshot is a bonus that appears on hover.
 *
 * Editorial row list rather than a card grid, so it stays quiet until
 * interrogated. The preview trails the cursor with a little inertia and is
 * suppressed entirely on coarse pointers, where there is no hover to follow.
 *
 * Driven from SHOWCASE_PRODUCTS so the reel's data and captures stay the
 * single source; nothing here is a second copy of that list.
 */

const TAG_LABEL: Record<string, string> = {
  COMPANY: "CLIENT",
  LAB: "LAB",
  FUN: "WEEKEND",
};

export function ReceiptsV5() {
  const rootRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const preview = previewRef.current;
    if (!root || !preview) return;
    // No hover to follow on touch, and prefers-reduced-motion should not get
    // a thing that chases the pointer.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    let seeded = false;
    let frame = 0;

    const loop = () => {
      frame = requestAnimationFrame(loop);
      eased.x += (target.x - eased.x) * 0.14;
      eased.y += (target.y - eased.y) * 0.14;
      // Lag becomes a slight tilt, so the panel feels carried rather than glued.
      const tilt = ((target.x - eased.x) * 0.045).toFixed(2);
      preview.style.transform = `translate3d(${eased.x.toFixed(1)}px, ${eased.y.toFixed(1)}px, 0) rotate(${tilt}deg)`;
    };

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      target.x = e.clientX - r.left + 28;
      target.y = e.clientY - r.top - 120;
      if (!seeded) {
        eased.x = target.x;
        eased.y = target.y;
        seeded = true;
      }
    };

    root.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(loop);
    return () => {
      root.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="v5-rc" aria-labelledby="v5-rc-title">
      <div className="v5-rc-wrap">
        <header className="v5-rc-head">
          <div>
            <p className="v5-rc-eyebrow">
              <span className="v5-cs-diamond" aria-hidden /> / receipts
            </p>
            <h2 className="v5-rc-title" id="v5-rc-title">
              <ScrambleText text="Everything here is" />{" "}
              <em>
                <ScrambleText text="deployed." />
              </em>
            </h2>
          </div>
          <p className="v5-rc-lede">
            Not screenshots of things that were nearly built — live URLs you can
            open in a second tab and break. Client work sits next to weekend
            builds on purpose: the process does not change when the stakes drop.
          </p>
        </header>

        {/* The ticker. Same twelve products as the list below, moving — the
            list is for reading, this is for registering that there are a lot
            of them. Duplicated inside the slider, so its second run is
            aria-hidden and nothing is announced twice. */}
        <div className="v5-rc-ticker" aria-hidden>
          <InfiniteSlider duration={46} gap={0}>
            {SHOWCASE_PRODUCTS.map((p) => (
              <span className="v5-rc-tick" key={p.slug}>
                <span className="v5-rc-tick-dot" />
                {p.name}
                <i>{TAG_LABEL[p.tag] ?? p.tag}</i>
              </span>
            ))}
          </InfiniteSlider>
        </div>

        <div className="v5-rc-body" ref={rootRef}>
          <ul className="v5-rc-list">
            {SHOWCASE_PRODUCTS.map((p) => (
              <li key={p.slug}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v5-rc-row"
                  data-cursor-label="Open live"
                  onPointerEnter={() => setHovered(p.slug)}
                  onFocus={() => setHovered(p.slug)}
                  onPointerLeave={() => setHovered(null)}
                  onBlur={() => setHovered(null)}
                >
                  <span className="v5-rc-name">{p.name}</span>
                  <span className="v5-rc-kind">{p.kind}</span>
                  <span className="v5-rc-tag">{TAG_LABEL[p.tag] ?? p.tag}</span>
                  <span className="v5-rc-go" aria-hidden>
                    ↗
                  </span>
                  <ClippedCircle circleSize={160} />
                </a>
              </li>
            ))}
          </ul>

          <div
            className={`v5-rc-preview${hovered ? " is-on" : ""}`}
            ref={previewRef}
            aria-hidden
          >
            {/* Chrome bar carrying the real host. The capture alone floats as
                a picture of a screen; framed and addressed, it reads as the
                product itself — which is the claim this section is making. */}
            <span className="v5-rc-preview-bar">
              <i />
              <i />
              <i />
              <em>
                {hovered
                  ? SHOWCASE_PRODUCTS.find((p) => p.slug === hovered)?.url.replace(
                      /^https?:\/\//,
                      ""
                    )
                  : ""}
              </em>
            </span>
            <span className="v5-rc-preview-stage">
              {SHOWCASE_PRODUCTS.map((p) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={p.slug}
                  src={`/showcase/${p.slug}-d.jpg`}
                  alt=""
                  loading="lazy"
                  className={hovered === p.slug ? "is-shown" : ""}
                />
              ))}
            </span>
          </div>
        </div>

        <p className="v5-rc-foot">
          <span>{SHOWCASE_PRODUCTS.length} LIVE BUILDS</span>
          <Link href="/work">Full case studies&nbsp;↗</Link>
          <Link href="/gallery">Visual gallery&nbsp;↗</Link>
        </p>
      </div>
    </section>
  );
}
