"use client";

import { useEffect, useRef, useState } from "react";

/**
 * SiriOrb — six layered conic gradients rotating through a registered
 * `--v5-orb-angle` property.
 *
 * Registering the angle with `@property` is what makes it animatable at all:
 * an unregistered custom property is an untyped string, so the browser cannot
 * interpolate it and the rotation would jump. The registration lives in CSS
 * beside the component's other rules.
 *
 * State contract:
 *   idle       slow rotation, slightly desaturated
 *   listening  grows, fully reactive to amplitude
 *   thinking   rotation speeds up, NO size change, so the layout stays calm
 *   streaming  gentle pulse
 *   done       one settle overshoot
 *   error      desaturates and shakes once, under 200ms
 *
 * Amplitude tightens the gradient rather than only scaling the orb — a loud
 * signal reads as the orb focusing, which is legible at 16px where a size
 * change is not.
 *
 * No microphone. The upstream component can bind a real audio amplitude, but
 * prompting for mic access on a portfolio page would be hostile, so this ships
 * the simulated envelope the docs recommend for exactly this case.
 */

export type OrbState =
  | "idle"
  | "listening"
  | "thinking"
  | "streaming"
  | "done"
  | "error";

/** Energy per state — drives the simulated speech-like envelope. */
const ENERGY: Record<OrbState, number> = {
  idle: 0.12,
  listening: 0.85,
  thinking: 0.4,
  streaming: 0.55,
  done: 0.2,
  error: 0.08,
};

/**
 * A speech-shaped envelope without asking for anything: two detuned carriers
 * gated by a slow syllable rate, so it swells and dips like a voice instead of
 * oscillating like a sine.
 */
export function useSimulatedAmplitude(state: OrbState) {
  const [amp, setAmp] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAmp(0);
      return;
    }
    let t = 0;
    let last = 0;
    const loop = (now: number) => {
      raf.current = requestAnimationFrame(loop);
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      t += dt;

      const syllable = Math.max(0, Math.sin(t * 3.1)) ** 1.6;
      const carrier = 0.6 + 0.4 * Math.sin(t * 11.3) * Math.sin(t * 7.9);
      setAmp(Math.min(1, ENERGY[state] * syllable * carrier * 1.8));
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [state]);

  return amp;
}

export function SiriOrb({
  size = "96px",
  state = "idle",
  amplitude,
  className,
}: {
  size?: string;
  state?: OrbState;
  /** 0..1. Omit to use the simulated envelope. */
  amplitude?: number;
  className?: string;
}) {
  const simulated = useSimulatedAmplitude(state);
  const amp = amplitude ?? simulated;

  return (
    <span
      className={`v5-orb is-${state} ${className ?? ""}`}
      style={
        {
          "--orb-size": size,
          // Amplitude tightens the gradient and lifts contrast; size is
          // touched only in `listening`, never in `thinking`.
          "--orb-amp": amp.toFixed(3),
        } as React.CSSProperties
      }
      role="img"
      aria-label={`Assistant ${state}`}
    >
      <span className="v5-orb-layer l1" />
      <span className="v5-orb-layer l2" />
      <span className="v5-orb-layer l3" />
      <span className="v5-orb-layer l4" />
      <span className="v5-orb-layer l5" />
      <span className="v5-orb-layer l6" />
    </span>
  );
}

/** The state loop the orb is actually for: a request, thought about, answered. */
const CYCLE: { state: OrbState; ms: number }[] = [
  { state: "listening", ms: 2600 },
  { state: "thinking", ms: 1800 },
  { state: "streaming", ms: 3200 },
  { state: "done", ms: 1400 },
  { state: "idle", ms: 1600 },
];

/**
 * SiriOrbCycle — the orb walking its own state machine.
 *
 * A single static state undersells the component; the whole point is that
 * `thinking` and `listening` look different. Under reduced motion it holds
 * `idle` and never advances, so nothing on the page changes by itself.
 */
export function SiriOrbCycle({
  size = "96px",
  className,
}: {
  size?: string;
  className?: string;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(
      () => setStep((s) => (s + 1) % CYCLE.length),
      CYCLE[step].ms
    );
    return () => clearTimeout(t);
  }, [step]);

  return <SiriOrb size={size} state={CYCLE[step].state} className={className} />;
}
