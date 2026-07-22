"use client";

import { useEffect, useRef, useState } from "react";
import type { PlaygroundWorld } from "@/lib/playground/world";
import styles from "./Playground.module.css";

/*
  Playground — React shell for the 3D driving world.

  Mounts a full-viewport canvas, lazy-loads the Three.js world (keeps the
  heavy chunk off the main bundle), and renders the overlay chrome:
  loading veil, back link, controls hint, speed readout, reset button and
  a touch joystick on coarse pointers.
*/

type Phase = "loading" | "ready" | "error";

export function Playground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<PlaygroundWorld | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [speed, setSpeed] = useState(0);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);

    let mounted = true;
    let world: PlaygroundWorld | undefined;

    (async () => {
      const { PlaygroundWorld } = await import("@/lib/playground/world");
      if (!mounted || !canvasRef.current) return;
      world = new PlaygroundWorld(canvasRef.current, {
        onReady: () => mounted && setPhase("ready"),
        onSpeed: (kmh) => mounted && setSpeed(kmh),
      });
      worldRef.current = world;
    })().catch((err) => {
      console.error("[playground] failed to start:", err);
      if (mounted) setPhase("error");
    });

    return () => {
      mounted = false;
      worldRef.current = null;
      world?.dispose();
    };
  }, []);

  return (
    <div className={styles.stage}>
      <canvas ref={canvasRef} className={styles.canvas} aria-label="3D driving playground" />

      {/* chrome */}
      <a href="/" className={styles.back}>
        ← Back to the flat world
      </a>

      <div className={styles.title} aria-hidden>
        <span className={styles.diamond} />
        3D PLAYGROUND
      </div>

      {phase === "ready" && (
        <>
          <div className={styles.speed} aria-hidden>
            {String(speed).padStart(3, "0")} <em>KM/H</em>
          </div>

          {!isTouch && (
            <div className={styles.hints} aria-hidden>
              <span><b>WASD / ↑↓←→</b> drive</span>
              <span className={styles.sep}>·</span>
              <span><b>SPACE</b> brake</span>
              <span className={styles.sep}>·</span>
              <span><b>R</b> reset</span>
            </div>
          )}

          <button
            type="button"
            className={styles.reset}
            onClick={() => worldRef.current?.resetCar()}
          >
            ⟲ RESET CAR
          </button>

          {isTouch && <TouchJoystick worldRef={worldRef} />}
        </>
      )}

      {/* loading veil */}
      <div
        className={`${styles.veil} ${phase !== "loading" ? styles.veilHidden : ""}`}
        aria-hidden={phase !== "loading"}
      >
        {phase === "error" ? (
          <>
            <p className={styles.veilTitle}>No WebGL here.</p>
            <p className={styles.veilMeta}>
              THIS PLAYGROUND NEEDS A GPU — <a href="/">DRIVE BACK HOME</a>
            </p>
          </>
        ) : (
          <>
            <span className={`${styles.diamond} ${styles.diamondSpin}`} />
            <p className={styles.veilTitle}>The Playground</p>
            <p className={styles.veilMeta}>POURING CONCRETE · STACKING CRATES</p>
          </>
        )}
      </div>
    </div>
  );
}

/*
  TouchJoystick — a fixed-base virtual stick (bottom-left). Pointer offset
  from the base center becomes the drive vector; the nub is purely visual.
*/
function TouchJoystick({
  worldRef,
}: {
  worldRef: React.RefObject<PlaygroundWorld | null>;
}) {
  const baseRef = useRef<HTMLDivElement>(null);
  const nubRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const base = baseRef.current;
    const nub = nubRef.current;
    if (!base || !nub) return;

    const RADIUS = 52;
    let activeId: number | null = null;

    const apply = (clientX: number, clientY: number) => {
      const rect = base.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = clientX - cx;
      let dy = clientY - cy;
      const len = Math.hypot(dx, dy);
      if (len > RADIUS) {
        dx = (dx / len) * RADIUS;
        dy = (dy / len) * RADIUS;
      }
      nub.style.transform = `translate(${dx}px, ${dy}px)`;
      worldRef.current?.input.setTouchAxis(dx / RADIUS, dy / RADIUS);
    };

    const release = () => {
      activeId = null;
      nub.style.transform = "translate(0, 0)";
      worldRef.current?.input.clearTouchAxis();
    };

    const onDown = (e: PointerEvent) => {
      activeId = e.pointerId;
      base.setPointerCapture(e.pointerId);
      apply(e.clientX, e.clientY);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerId === activeId) apply(e.clientX, e.clientY);
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId === activeId) release();
    };

    base.addEventListener("pointerdown", onDown);
    base.addEventListener("pointermove", onMove);
    base.addEventListener("pointerup", onUp);
    base.addEventListener("pointercancel", onUp);
    return () => {
      base.removeEventListener("pointerdown", onDown);
      base.removeEventListener("pointermove", onMove);
      base.removeEventListener("pointerup", onUp);
      base.removeEventListener("pointercancel", onUp);
      release();
    };
  }, [worldRef]);

  return (
    <div ref={baseRef} className={styles.joystick} aria-hidden>
      <div ref={nubRef} className={styles.joystickNub} />
    </div>
  );
}
