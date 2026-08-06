"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * HUD — page-corner heads-up display in the matveyan register.
 *
 * Two anchored monospace blocks:
 *   top-right    scroll % + clock (IST)
 *   bottom-left  location + connection state
 *
 * Lives above page content (z-50 / below cursor). Disabled when the
 * cursor isn't usable (touch devices) — the small mono text is too
 * crowded on phones. Also disabled on /v2, which brings its own chrome
 * (top bar + scroll rail) and would otherwise collide with this.
 */
export function HUD() {
  const pathname = usePathname();
  const [scrollPct, setScrollPct] = useState(0);
  const [time, setTime] = useState("");
  const [enabled, setEnabled] = useState(true);
  const suppressed =
    (pathname?.startsWith("/v2") ||
      pathname?.startsWith("/process/design-system")) ??
    false;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isFine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(isFine);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = Math.max(1, doc.scrollHeight - window.innerHeight);
        const pct = Math.min(100, Math.round((window.scrollY / max) * 100));
        setScrollPct(pct);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const tick = () => {
      const d = new Date();
      const ist = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Kolkata",
        hour12: false,
      }).format(d);
      setTime(ist);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [enabled]);

  if (!enabled || suppressed) return null;

  return (
    <>
      {/* top-right */}
      <div
        aria-hidden
        className="fixed top-3 right-4 z-40 pointer-events-none mono text-[10px] tracking-[0.14em] text-[var(--muted)] text-right select-none"
      >
        <div>scroll · {String(scrollPct).padStart(2, "0")}%</div>
        <div>ist · {time}</div>
      </div>
      {/* bottom-left */}
      <div
        aria-hidden
        className="fixed bottom-3 left-4 z-40 pointer-events-none mono text-[10px] tracking-[0.14em] text-[var(--muted)] select-none"
      >
        <div className="flex items-center gap-1.5">
          <span className="block w-1.5 h-1.5 bg-[var(--accent)]" />
          pune · ist · async-us
        </div>
        <div>// available for work</div>
      </div>
    </>
  );
}
