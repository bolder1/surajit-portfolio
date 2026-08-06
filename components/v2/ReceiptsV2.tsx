"use client";

import Link from "next/link";

import { useEffect, useRef, useState } from "react";

/**
 * §06 ReceiptsV2 — the proof, as a list you can click into.
 *
 * An editorial row list rather than a card grid. Hovering a row lifts a
 * screenshot that trails the cursor with a little inertia, so the section
 * stays quiet until you interrogate it. Every row is a URL that is actually
 * live; the tag says whether it was paid work, a lab build or a weekend.
 */

type Receipt = {
  slug: string;
  name: string;
  kind: string;
  tag: "Client" | "Lab" | "Weekend";
  year: string;
  url: string;
};

const RECEIPTS: Receipt[] = [
  { slug: "financeos", name: "FinanceOS", kind: "AI finance platform", tag: "Client", year: "2026", url: "https://financeos-by-miniorange.vercel.app/signin" },
  { slug: "uem-discovery", name: "UEM Data Discovery", kind: "Endpoint management dashboard", tag: "Client", year: "2025", url: "https://uem-data-discovery.vercel.app/data-discovery" },
  { slug: "mods-docs", name: "MODS Design System", kind: "System documentation", tag: "Client", year: "2025", url: "https://mods-web-docs.vercel.app/" },
  { slug: "uem-mobile", name: "UEM Mobile", kind: "Device fleet, pocket-sized", tag: "Client", year: "2025", url: "https://uem-mobile-app.vercel.app/" },
  { slug: "academy", name: "Orange Academy", kind: "In-house learning platform", tag: "Client", year: "2026", url: "https://orange-academy-next.vercel.app/course/c-claude-foundations/lesson/cf-1-1" },
  { slug: "claude-session", name: "Claude Session 26", kind: "Process, kept live", tag: "Lab", year: "2026", url: "https://claude-session-26.vercel.app/" },
  { slug: "family-tree", name: "Family Tree Builder", kind: "Interactive graph app", tag: "Weekend", year: "2025", url: "https://family-tree-builder-gilt.vercel.app/tree/tree-mrw6owzr-383ua" },
  { slug: "cheese", name: "Cheese", kind: "Brand site", tag: "Weekend", year: "2025", url: "https://cheese-website.vercel.app/" },
];

export function ReceiptsV2() {
  const rootRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const preview = previewRef.current;
    if (!root || !preview) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    let seeded = false;
    let frame = 0;

    const loop = () => {
      frame = requestAnimationFrame(loop);
      eased.x += (target.x - eased.x) * 0.14;
      eased.y += (target.y - eased.y) * 0.14;
      const tilt = ((target.x - eased.x) * 0.05).toFixed(2);
      preview.style.transform = `translate3d(${eased.x.toFixed(1)}px, ${eased.y.toFixed(1)}px, 0) rotate(${tilt}deg)`;
    };

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      target.x = e.clientX - r.left + 26;
      target.y = e.clientY - r.top - 118;
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
    <section id="v2-proof" className="v2-receipts" aria-labelledby="v2-receipts-h">
      <div className="v2-wrap">
        <div className="v2-receipts-head">
          <div>
            <p className="v2-eyebrow">
              <b>07</b> Receipts
            </p>
            <h2 id="v2-receipts-h" className="v2-receipts-title">
              Everything here is <em>deployed.</em>
            </h2>
          </div>
          <p className="v2-prose">
            Not screenshots of things that were nearly built. Live URLs you can
            open in a second tab and break. Client work sits next to weekend
            builds on purpose: the process does not change when the stakes drop.
          </p>
        </div>

        <div className="v2-receipts-body" ref={rootRef}>
          <ul className="v2-receipts-list">
            {RECEIPTS.map((r) => (
              <li key={r.slug}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v2-receipt"
                  onPointerEnter={() => setHovered(r.slug)}
                  onFocus={() => setHovered(r.slug)}
                  onPointerLeave={() => setHovered(null)}
                  onBlur={() => setHovered(null)}
                >
                  <span className="v2-receipt-name">{r.name}</span>
                  <span className="v2-receipt-kind">{r.kind}</span>
                  <span className="v2-receipt-tag">{r.tag}</span>
                  <span className="v2-receipt-year">{r.year}</span>
                  <span className="v2-receipt-go" aria-hidden>
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div
            className={`v2-receipt-preview ${hovered ? "is-on" : ""}`}
            ref={previewRef}
            aria-hidden
          >
            {RECEIPTS.map((r) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={r.slug}
                src={`/showcase/${r.slug}-d.jpg`}
                alt=""
                loading="lazy"
                className={hovered === r.slug ? "is-shown" : ""}
              />
            ))}
          </div>
        </div>

        <p className="v2-receipts-foot">
          <Link href="/work" className="v2-link">
            Full case studies
          </Link>
          <Link href="/gallery" className="v2-link">
            Visual gallery
          </Link>
        </p>
      </div>
    </section>
  );
}
