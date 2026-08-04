"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BlackHoleField, type BlackHoleHandle } from "./BlackHoleField";

/**
 * BlackHoleIntro — the starter page: load, hold, collapse, reveal.
 *
 * Four phases.
 *
 * 1. **load** — a counter and a rule, driven by *real* signals: fonts
 *    resolving, the black hole's first drawn frame, and window load. The
 *    displayed number eases toward whatever has actually completed and can
 *    never run ahead of it, so it animates smoothly without lying. A progress
 *    bar that is really a 2-second animation is a small dishonesty this page
 *    can do without, given what it is introducing.
 * 2. **hold** — the hole, a line, and one button.
 * 3. **collapse** — every element spirals into the singularity while the disk
 *    spins up and floods. The path is an arc, not a straight line, because
 *    infalling matter carries angular momentum; a radial fall reads as
 *    elements being deleted rather than captured.
 * 4. **reveal** — the overlay clears and the hero is underneath, already
 *    laid out. Nothing about the page below waits on this.
 *
 * ## Not a trap
 *
 * An intro that holds the page hostage is a bad intro. So:
 *
 * - It shows **once per session**, not once per navigation.
 * - **Escape**, a visible Skip, and the button all dismiss it.
 * - It is a real `dialog` with a label, focus moves to it on mount and returns
 *   to the page on exit, and background scroll is locked only while it is up.
 * - Under **reduced motion** the hole renders a single still frame and the
 *   collapse is a short fade — the beat still resolves, nothing flies around.
 * - It is hidden before first paint for anyone who has already seen it this
 *   session, by an attribute set in the document head, so returning to the
 *   page never flashes it.
 */

const SUCK_MS = 1500;
const FLASH_MS = 420;

/**
 * The load phase gives up waiting after this and shows the UI anyway.
 *
 * This is not impatience, it is a safety valve. Progress is driven by real
 * signals, and one of them is the black hole's first drawn frame — on a weak
 * GPU, a software rasteriser, or a throttled tab, that frame can take tens of
 * seconds or never arrive at all. Without a ceiling the page would sit on a
 * counter that never reaches 100 with its controls disabled, which is the
 * worst thing an intro can do. After this the visitor gets the button whether
 * the field is ready or not; the field catches up on its own.
 */
const MAX_LOAD_MS = 4200;

export function BlackHoleIntro() {
  const [phase, setPhase] = useState<"load" | "hold" | "collapse" | "gone">("load");
  const [shown, setShown] = useState(true);
  const [pct, setPct] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const bh = useRef<BlackHoleHandle>(null);
  const target = useRef(0);
  const returnFocus = useRef<HTMLElement | null>(null);

  // ── already seen this session: leave without ever starting ──────
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("bh-intro") === "seen";
    } catch {
      // Private mode / storage disabled — treat as unseen rather than crash.
    }
    if (seen) setShown(false);
  }, []);

  // ── real loading progress ───────────────────────────────────────
  useEffect(() => {
    if (!shown) return;
    let alive = true;

    const bump = (n: number) => {
      target.current = Math.min(1, target.current + n);
    };

    // Three real milestones. Nothing here is a timer.
    document.fonts?.ready.then(() => alive && bump(0.35)).catch(() => alive && bump(0.35));
    bh.current?.ready().then(() => alive && bump(0.4));
    if (document.readyState === "complete") bump(0.25);
    else window.addEventListener("load", () => alive && bump(0.25), { once: true });

    let frame = 0;
    let display = 0;
    const started = performance.now();

    const tick = () => {
      const elapsed = performance.now() - started;
      // Past the ceiling, drive it home regardless of what has not arrived.
      const goal = elapsed > MAX_LOAD_MS ? 1 : target.current;
      // Ease toward the truth, never past it.
      display += (goal - display) * 0.06;
      if (goal >= 1 && (display > 0.995 || elapsed > MAX_LOAD_MS + 900)) display = 1;
      setPct(Math.round(display * 100));
      if (display >= 1) {
        setPhase("hold");
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
    };
  }, [shown]);

  // ── modal behaviour: scroll lock and focus ──────────────────────
  useEffect(() => {
    if (!shown) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    rootRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [shown]);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem("bh-intro", "seen");
    } catch {
      /* nothing to do; the intro simply shows again next time */
    }
    setShown(false);
    // Hand focus back to the page rather than dropping it on <body>, where a
    // keyboard user would have to tab from the very top again.
    requestAnimationFrame(() => {
      const main = document.getElementById("main");
      if (main) {
        main.setAttribute("tabindex", "-1");
        main.focus({ preventScroll: true });
      } else {
        returnFocus.current?.focus?.();
      }
    });
  }, []);

  // ── the collapse ────────────────────────────────────────────────
  const collapse = useCallback(() => {
    if (phase === "collapse") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setPhase("collapse");
      window.setTimeout(finish, 420);
      return;
    }

    // Each element gets its own arc into the centre. Computed here rather than
    // in CSS because only JS knows where anything actually is.
    const root = rootRef.current;
    if (root) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const nodes = root.querySelectorAll<HTMLElement>("[data-suck]");
      let maxD = 1;
      const boxes: { el: HTMLElement; dx: number; dy: number; d: number }[] = [];
      nodes.forEach((el) => {
        const r = el.getBoundingClientRect();
        const dx = cx - (r.left + r.width / 2);
        const dy = cy - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy);
        maxD = Math.max(maxD, d);
        boxes.push({ el, dx, dy, d });
      });
      boxes.forEach(({ el, dx, dy, d }) => {
        // Rotate the halfway point off the straight line: that is the angular
        // momentum, and it is what makes the fall read as an orbit decaying.
        const a = -0.95;
        const mx = (dx * Math.cos(a) - dy * Math.sin(a)) * 0.5;
        const my = (dx * Math.sin(a) + dy * Math.cos(a)) * 0.5;
        el.style.setProperty("--sx", `${dx.toFixed(1)}px`);
        el.style.setProperty("--sy", `${dy.toFixed(1)}px`);
        el.style.setProperty("--mx", `${mx.toFixed(1)}px`);
        el.style.setProperty("--my", `${my.toFixed(1)}px`);
        el.style.setProperty("--sr", `${(180 + d * 0.25).toFixed(0)}deg`);
        // Nearest falls first — the steeper the well, the sooner you go.
        el.style.setProperty("--sd", `${((d / maxD) * 260).toFixed(0)}ms`);
      });
    }

    setPhase("collapse");

    // Ramp the field. Quadratic, because infall accelerates.
    const t0 = performance.now();
    const ramp = (now: number) => {
      const p = Math.min(1, (now - t0) / SUCK_MS);
      bh.current?.setSuck(p * p);
      if (p < 1) requestAnimationFrame(ramp);
    };
    requestAnimationFrame(ramp);

    window.setTimeout(finish, SUCK_MS + FLASH_MS);
  }, [phase, finish]);

  // ── escape hatch ────────────────────────────────────────────────
  useEffect(() => {
    if (!shown) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shown, finish]);

  if (!shown) return null;

  return (
    <div
      ref={rootRef}
      className="v5-intro"
      data-phase={phase}
      role="dialog"
      aria-modal="true"
      aria-label="Introduction"
      tabIndex={-1}
    >
      <BlackHoleField handleRef={bh} />
      <div className="v5-intro-vig" aria-hidden />

      <div className="v5-intro-ui">
        <p className="v5-intro-eyebrow" data-suck>
          <span className="v5-intro-dot" aria-hidden />
          SCHWARZSCHILD · r<sub>s</sub> = 1
        </p>

        <h1 className="v5-intro-title" data-suck>
          Surajit <em>Dutta.</em>
        </h1>

        <p className="v5-intro-sub" data-suck>
          Product designer for IT, identity and security teams. Every photon on
          this screen is traced along a real null geodesic — the bright side is
          the disk coming toward you at a third of light speed.
        </p>

        <div className="v5-intro-actions" data-suck>
          <button type="button" className="v5-intro-enter" onClick={collapse}>
            <span className="t">ENTER</span>
            <span className="r" aria-hidden />
          </button>
        </div>
      </div>

      {/* Deliberately outside the phase-gated UI, so it is clickable from the
          first frame. During loading the panel above is inert; if the only way
          out lived inside it, a slow first frame would leave someone with no
          way past this screen at all. */}
      <button type="button" className="v5-intro-skip" onClick={finish}>
        Skip intro
      </button>

      {/* Loader chrome. Lives at the bottom so the hole is never covered. */}
      <div className="v5-intro-load" aria-live="polite" aria-busy={phase === "load"}>
        <span className="n">{String(pct).padStart(3, "0")}</span>
        <span className="bar" aria-hidden>
          <i style={{ transform: `scaleX(${pct / 100})` }} />
        </span>
        <span className="l">{phase === "load" ? "TRACING GEODESICS" : "READY"}</span>
      </div>

      <div className="v5-intro-flash" aria-hidden />
    </div>
  );
}
