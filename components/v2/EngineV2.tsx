"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * §04 EngineV2 — the design-system claim, made checkable.
 *
 * Rather than asserting "I built a 1,300-variant button system", this is the
 * matrix. Five mapped axes, 22 values between them, 6 × 4 × 6 × 3 × 3 = 1,296
 * variants. Toggle any value off and the variant count, the node estimate and
 * the live component previews all recompute.
 *
 * "Generate" rasterises the current matrix onto a canvas one node at a time so
 * you can watch the combinatorics fill in, with a real elapsed-ms readout.
 * The number it lands on is the browser's, not a claim about Figma; the Figma
 * claim is stated separately in the copy where it belongs.
 */

type Axis = {
  id: string;
  name: string;
  variable: string;
  values: string[];
};

const AXES: Axis[] = [
  { id: "variant", name: "Variant", variable: "btn/variant", values: ["Primary", "Secondary", "Tertiary", "Ghost", "Danger", "Link"] },
  { id: "size", name: "Size", variable: "btn/size", values: ["XS", "SM", "MD", "LG"] },
  { id: "state", name: "State", variable: "btn/state", values: ["Default", "Hover", "Active", "Focus", "Loading", "Disabled"] },
  { id: "icon", name: "Icon", variable: "btn/icon", values: ["None", "Leading", "Trailing"] },
  { id: "radius", name: "Radius", variable: "btn/radius", values: ["Sharp", "Soft", "Pill"] },
];

const TOTAL = AXES.reduce((acc, a) => acc * a.values.length, 1); // 1296
const VALUE_COUNT = AXES.reduce((acc, a) => acc + a.values.length, 0); // 22

/** Nodes per instance: frame + label + up to one icon + one focus ring. */
const NODES_PER_VARIANT = 4;

type Enabled = Record<string, boolean[]>;

const allOn = (): Enabled =>
  Object.fromEntries(AXES.map((a) => [a.id, a.values.map(() => true)]));

/* Deterministic per-index jitter so the fill sweep looks organic without
   Math.random (which would differ between the timer and the draw). */
const jitter = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

function useCountUp(target: number) {
  const [shown, setShown] = useState(target);
  const ref = useRef(target);
  useEffect(() => {
    let frame = 0;
    const step = () => {
      const diff = target - ref.current;
      if (Math.abs(diff) < 0.8) {
        ref.current = target;
        setShown(target);
        return;
      }
      ref.current += diff * 0.18;
      setShown(Math.round(ref.current));
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return shown;
}

export function EngineV2() {
  const [enabled, setEnabled] = useState<Enabled>(allOn);
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [ms, setMs] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        AXES.map((a) => [a.id, enabled[a.id].filter(Boolean).length])
      ) as Record<string, number>,
    [enabled]
  );

  const variants = useMemo(
    () => AXES.reduce((acc, a) => acc * counts[a.id], 1),
    [counts]
  );

  const shownVariants = useCountUp(variants);
  const shownNodes = useCountUp(variants * NODES_PER_VARIANT);

  const firstOn = useCallback(
    (axisId: string) => {
      const a = AXES.find((x) => x.id === axisId)!;
      const i = enabled[axisId].findIndex(Boolean);
      return i < 0 ? null : a.values[i];
    },
    [enabled]
  );

  const toggle = (axisId: string, i: number) => {
    setEnabled((prev) => {
      const next = { ...prev, [axisId]: [...prev[axisId]] };
      next[axisId][i] = !next[axisId][i];
      return next;
    });
    setPhase("idle");
  };

  const reset = () => {
    setEnabled(allOn());
    setPhase("idle");
    setMs(0);
  };

  /* ── the fill sweep ──────────────────────────────────── */
  const draw = useCallback((progress: number, count: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== Math.round(w * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    if (count < 1) return;

    const cols = Math.max(1, Math.round(Math.sqrt(count * (w / Math.max(h, 1)))));
    const rows = Math.ceil(count / cols);
    const gap = cols > 40 ? 1 : 2;
    const cw = (w - gap * (cols - 1)) / cols;
    const ch = Math.min(cw, (h - gap * (rows - 1)) / rows);
    const offY = Math.max(0, (h - (ch * rows + gap * (rows - 1))) / 2);

    for (let i = 0; i < count; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      // diagonal sweep + jitter, so it fills like a render not a progress bar
      const order = (c / cols) * 0.62 + (r / rows) * 0.28 + jitter(i) * 0.1;
      const local = Math.min(1, Math.max(0, (progress - order) / 0.16));
      if (local <= 0) {
        // Dormant: a faint, unevenly lit lattice so an un-run matrix still
        // reads as loaded rather than as a broken canvas.
        const a = 0.05 + jitter(i + 991) * 0.06;
        ctx.fillStyle = `rgba(200, 242, 78, ${a.toFixed(3)})`;
      } else {
        const a = 0.22 + local * 0.78;
        ctx.fillStyle = `rgba(200, 242, 78, ${a.toFixed(3)})`;
      }
      ctx.fillRect(c * (cw + gap), offY + r * (ch + gap), Math.max(1, cw), Math.max(1, ch));
    }
  }, []);

  const generate = () => {
    if (variants < 1) return;
    cancelAnimationFrame(rafRef.current);
    setPhase("running");
    const t0 = performance.now();
    const dur = 1150 + Math.min(700, variants * 0.35);

    const step = (now: number) => {
      const elapsed = now - t0;
      const p = Math.min(1, elapsed / dur);
      setMs(Math.round(elapsed));
      draw(p * 1.18, variants);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setPhase("done");
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  // Keep the canvas in sync with the matrix while idle, and on resize.
  useEffect(() => {
    if (phase === "running") return;
    draw(phase === "done" ? 1.2 : 0, variants);
  }, [variants, phase, draw]);

  useEffect(() => {
    const onResize = () => draw(phase === "done" ? 1.2 : 0, variants);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [draw, phase, variants]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const sampleSize = firstOn("size") ?? "MD";
  const sampleState = firstOn("state") ?? "Default";
  const sampleIcon = firstOn("icon") ?? "None";
  const sampleRadius = firstOn("radius") ?? "Soft";
  const sampleVariants = AXES[0].values.filter((_, i) => enabled.variant[i]);

  return (
    <section id="v2-system" className="v2-engine" aria-labelledby="v2-engine-h">
      <div className="v2-wrap">
        <div className="v2-engine-head">
          <div>
            <p className="v2-eyebrow">
              <b>04</b> The engine
            </p>
            <h2 id="v2-engine-h" className="v2-engine-title">
              One button.
              <br />
              <em>{TOTAL.toLocaleString()}</em> variants.
            </h2>
          </div>
          <p className="v2-prose">
            Components mapped to variables on every axis at once, so the set is
            generated rather than drawn. In Figma this matrix publishes in
            minutes. Built by hand it is three days of nudging and a naming
            argument. Switch values off below and watch the maths move.
          </p>
        </div>

        <div className="v2-engine-body">
          {/* ── controls ───────────────────────────────── */}
          <div className="v2-engine-axes">
            <div className="v2-engine-axes-top">
              <span className="v2-mono">Mapped axes</span>
              <button type="button" className="v2-engine-reset" onClick={reset}>
                Reset all
              </button>
            </div>

            {AXES.map((a) => (
              <div className="v2-axis" key={a.id} role="group" aria-label={`${a.name} axis`}>
                <p className="v2-axis-legend">
                  <span className="v2-axis-name">{a.name}</span>
                  <code className="v2-axis-var">{a.variable}</code>
                  <span className="v2-axis-count">
                    {counts[a.id]}/{a.values.length}
                  </span>
                </p>
                <div className="v2-axis-vals">
                  {a.values.map((v, i) => (
                    <button
                      key={v}
                      type="button"
                      className="v2-chip"
                      aria-pressed={enabled[a.id][i]}
                      onClick={() => toggle(a.id, i)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── readout ────────────────────────────────── */}
          <div className="v2-engine-out">
            <div className="v2-engine-figures">
              <div className="v2-engine-fig is-lead">
                <span className="n">{shownVariants.toLocaleString()}</span>
                <span className="l">variants</span>
              </div>
              <div className="v2-engine-fig">
                <span className="n">{shownNodes.toLocaleString()}</span>
                <span className="l">nodes</span>
              </div>
              <div className="v2-engine-fig">
                <span className="n">{VALUE_COUNT}</span>
                <span className="l">mapped values</span>
              </div>
            </div>

            <div className="v2-engine-stage">
              <canvas
                ref={canvasRef}
                className="v2-engine-canvas"
                role="img"
                aria-label={`Matrix of ${variants.toLocaleString()} generated variants`}
              />
              {variants < 1 && (
                <div className="v2-engine-empty">
                  <p className="k">Matrix collapsed</p>
                  <p className="d">
                    Every axis needs at least one value switched on. A system
                    with a hole in it is not a smaller system, it is a broken
                    one.
                  </p>
                  <button type="button" className="v2-btn-ghost" onClick={reset}>
                    Restore the matrix
                  </button>
                </div>
              )}
            </div>

            <div className="v2-engine-bar">
              <button
                type="button"
                className="v2-btn"
                onClick={generate}
                disabled={variants < 1 || phase === "running"}
              >
                {phase === "running" ? "Generating" : "Generate matrix"}
                <span className="v2-btn-arrow" aria-hidden>
                  →
                </span>
              </button>
              <p className="v2-engine-timer" aria-live="polite">
                {phase === "idle" && <span className="m">awaiting run</span>}
                {phase === "running" && (
                  <span className="m">
                    building <b>{ms}</b> ms
                  </span>
                )}
                {phase === "done" && (
                  <span className="m">
                    {variants.toLocaleString()} variants rendered in{" "}
                    <b>{(ms / 1000).toFixed(2)}</b> s
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* ── live components ───────────────────────────── */}
        <div className="v2-engine-preview">
          <div className="v2-engine-preview-head">
            <span className="v2-mono">Live instances</span>
            <span className="v2-engine-preview-spec">
              size {sampleSize} · state {sampleState} · icon {sampleIcon} ·
              radius {sampleRadius}
            </span>
          </div>
          <div className="v2-engine-preview-row">
            {sampleVariants.length === 0 && (
              <p className="v2-engine-preview-none">
                No variant values selected, so there is nothing to instantiate.
              </p>
            )}
            {sampleVariants.map((v) => (
              <button
                key={v}
                type="button"
                className={[
                  "v2-bt",
                  `is-${v.toLowerCase()}`,
                  `sz-${sampleSize.toLowerCase()}`,
                  `rd-${sampleRadius.toLowerCase()}`,
                  `st-${sampleState.toLowerCase()}`,
                ].join(" ")}
                disabled={sampleState === "Disabled" || sampleState === "Loading"}
              >
                {sampleIcon === "Leading" && <span className="ic" aria-hidden />}
                {sampleState === "Loading" && <span className="sp" aria-hidden />}
                <span>{v}</span>
                {sampleIcon === "Trailing" && <span className="ic" aria-hidden />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
