"use client";

import { useEffect, useRef, useState } from "react";
import type { Destination, PlaygroundWorld } from "@/lib/playground/world";
import type { WorldVariantKey } from "@/lib/playground/objects";
import { SHOWCASE_PRODUCTS } from "@/lib/showcase";
import styles from "./Playground.module.css";

/*
  Playground — React shell for the 3D parallel-worlds experience.

  Mounts a full-viewport canvas, lazy-loads the Three.js world (keeps the
  heavy chunk off the main bundle), and renders the overlay chrome:
  loading veil, back link, world chip, controls hint, speed readout,
  reset button, sky-map overlay and a touch joystick on coarse pointers.
*/

type Phase = "loading" | "ready" | "error";

const WORLD_LABEL: Record<WorldVariantKey, string> = {
  company: "THE COMPANY SIDE",
  fun: "THE FUN SIDE",
};

const MAP_MILESTONES = [
  "Enterprise security era — IAM · PAM · IGA · UEM",
  "MODS design system",
  "ITDR — identity threat detection",
  "DPDP compliance",
  "Function OS — AI finance",
  "The 2-day build era — Claude Code",
];

export function Playground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<PlaygroundWorld | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [speed, setSpeed] = useState(0);
  const [isTouch, setIsTouch] = useState(false);
  const [variant, setVariant] = useState<WorldVariantKey>("company");
  const [mapOpen, setMapOpen] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [toast, setToast] = useState<Destination | null>(null);

  // Arrival toast lingers, then fades.
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 7000);
    return () => window.clearTimeout(id);
  }, [toast]);

  // Refresh the destination list whenever the map opens or worlds switch.
  useEffect(() => {
    if (mapOpen) setDestinations(worldRef.current?.getDestinations() ?? []);
  }, [mapOpen, variant]);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);

    let mounted = true;
    let world: PlaygroundWorld | undefined;

    (async () => {
      const { PlaygroundWorld } = await import("@/lib/playground/world");
      if (!mounted || !canvasRef.current) return;
      world = new PlaygroundWorld(canvasRef.current, {
        onReady: () => mounted && setPhase("ready"),
        onError: () => mounted && setPhase("error"),
        onSpeed: (kmh) => mounted && setSpeed(kmh),
        onWorldChange: (v) => mounted && setVariant(v),
        onMapMode: (open) => mounted && setMapOpen(open),
        onArrive: (dest) => mounted && setToast(dest),
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
    <div className={`${styles.stage} ${variant === "fun" ? styles.stageFun : ""}`}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        aria-label="3D driving playground"
      />

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
          <button
            type="button"
            className={styles.worldChip}
            onClick={() => worldRef.current?.switchWorld()}
            title="Switch to the parallel world"
          >
            <span className={styles.worldChipGlyph} aria-hidden />
            {WORLD_LABEL[variant]}
            <em>⇄</em>
          </button>

          <div className={styles.speed} aria-hidden>
            {String(speed).padStart(3, "0")} <em>KM/H</em>
          </div>

          {!isTouch && !mapOpen && (
            <div className={styles.hints} aria-hidden>
              <span><b>WASD / ↑↓←→</b> drive</span>
              <span className={styles.sep}>·</span>
              <span><b>SPACE</b> brake</span>
              <span className={styles.sep}>·</span>
              <span><b>R</b> reset</span>
              <span className={styles.sep}>·</span>
              <span><b>SKY</b> click for map</span>
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

          <Minimap
            worldRef={worldRef}
            isTouch={isTouch}
            onOpenMap={() => worldRef.current?.setMapMode(true)}
          />

          {toast && (
            <div className={styles.toast} role="status">
              <span className={styles.toastGlyph} aria-hidden />
              <span>
                ARRIVED — <b>{toast.label}</b>
              </span>
              {toast.page && (
                <a
                  href={toast.page}
                  target={toast.page.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                >
                  OPEN ↗
                </a>
              )}
            </div>
          )}

          {mapOpen && (
            <div className={styles.map} role="dialog" aria-label="Map of everything">
              <div className={styles.mapPanel}>
                <div className={styles.mapHead}>
                  <p className={styles.mapEyebrow}>/ SEEN FROM THE SKY</p>
                  <h2 className={styles.mapTitle}>The whole work.</h2>
                  <button
                    type="button"
                    className={styles.mapClose}
                    onClick={() => worldRef.current?.setMapMode(false)}
                  >
                    ✕ BACK TO THE CAR
                  </button>
                </div>

                <p className={styles.mapLabel}>
                  SET A WAYPOINT — THE BEACON + MINIMAP GUIDE YOU THERE
                </p>
                <div className={styles.mapDests}>
                  {destinations.map((d) => (
                    <button
                      key={d.key}
                      type="button"
                      className={styles.mapDest}
                      onClick={() => {
                        worldRef.current?.setWaypoint(d.key);
                        worldRef.current?.setMapMode(false);
                      }}
                    >
                      <i aria-hidden />
                      {d.label}
                    </button>
                  ))}
                </div>

                <div className={styles.mapCols}>
                  <div>
                    <p className={styles.mapLabel}>THIS WORLD</p>
                    <ul className={styles.mapList}>
                      {variant === "company" ? (
                        <>
                          <li>WORK — five shipped products, crated</li>
                          <li>PLAY — bowling · ramps · slalom</li>
                          <li>ABOUT — the designer, on the floor</li>
                          <li>CONTACT — the road goes somewhere</li>
                          <li>MILESTONE ARC — the road so far</li>
                        </>
                      ) : (
                        <>
                          <li>SIX GLOWING WEEKEND BUILDS</li>
                          <li>LUMINOUS ORBS — push them</li>
                          <li>DREAM RAMPS · CONE RING</li>
                        </>
                      )}
                      <li className={styles.mapAccent}>
                        PORTAL — drive through → {variant === "company" ? "the fun side" : "the company side"}
                      </li>
                    </ul>

                    <p className={styles.mapLabel}>MILESTONES</p>
                    <ul className={styles.mapList}>
                      {MAP_MILESTONES.map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className={styles.mapLabel}>EVERY PRODUCT — LIVE</p>
                    <div className={styles.mapProducts}>
                      {SHOWCASE_PRODUCTS.map((p) => (
                        <a
                          key={p.slug}
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.mapProduct}
                        >
                          <i style={{ background: p.color }} aria-hidden />
                          {p.name}
                        </a>
                      ))}
                    </div>

                    <p className={styles.mapLabel}>THE FLAT WORLD</p>
                    <div className={styles.mapProducts}>
                      <a href="/work" className={styles.mapProduct}>Work archive</a>
                      <a href="/process" className={styles.mapProduct}>Real-time builds</a>
                      <a href="/gallery" className={styles.mapProduct}>Gallery</a>
                      <a href="/contact" className={styles.mapProduct}>Contact</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
            <p className={styles.veilMeta}>POURING CONCRETE · CHARGING THE PORTAL</p>
          </>
        )}
      </div>
    </div>
  );
}

/*
  Minimap — round radar above the speed readout. Redraws ~10×/s from
  getNavState(): arena ring, destination dots, pulsing amber waypoint
  (edge-clamped when far), and the car as an accent heading arrow at the
  centre. Click opens the sky map.
*/
function Minimap({
  worldRef,
  isTouch,
  onOpenMap,
}: {
  worldRef: React.RefObject<PlaygroundWorld | null>;
  isTouch: boolean;
  onOpenMap: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const SIZE = isTouch ? 104 : 148;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.scale(dpr, dpr);

    const WORLD_R = 100; // world units from car to the radar edge
    const C = SIZE / 2;
    const mapR = C - 7;

    let raf = 0;
    let last = 0;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < 100) return; // ~10 fps is plenty for a radar
      last = now;
      const nav = worldRef.current?.getNavState();
      if (!nav) return;
      const accent = nav.variant === "fun" ? "#8f7bff" : "#d9472f";

      ctx.clearRect(0, 0, SIZE, SIZE);

      // arena ring + faint cross
      ctx.strokeStyle = "rgba(240, 238, 232, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(C, C, mapR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(240, 238, 232, 0.08)";
      ctx.beginPath();
      ctx.moveTo(C - mapR, C);
      ctx.lineTo(C + mapR, C);
      ctx.moveTo(C, C - mapR);
      ctx.lineTo(C, C + mapR);
      ctx.stroke();

      // car-centred world→radar projection, clamped inside the ring
      const toMap = (x: number, z: number): [number, number] => {
        let dx = (x - nav.car.x) * (mapR / WORLD_R);
        let dz = (z - nav.car.z) * (mapR / WORLD_R);
        const len = Math.hypot(dx, dz);
        const max = mapR - 5;
        if (len > max) {
          dx = (dx / len) * max;
          dz = (dz / len) * max;
        }
        return [C + dx, C + dz];
      };

      for (const d of nav.destinations) {
        const [px, py] = toMap(d.x, d.z);
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(240, 238, 232, 0.55)";
        ctx.fill();
      }

      if (nav.waypoint) {
        const [px, py] = toMap(nav.waypoint.x, nav.waypoint.z);
        ctx.strokeStyle = "#f5b942";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(px, py, 3.4 + Math.sin(now / 220) * 1.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#f5b942";
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // the car — heading arrow at centre. Screen maps x→right, z→down,
      // and yaw = atan2(fx, fz), so the arrow angle from screen-up is π − yaw.
      ctx.save();
      ctx.translate(C, C);
      ctx.rotate(Math.PI - nav.car.yaw);
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(4.4, 5);
      ctx.lineTo(0, 2.6);
      ctx.lineTo(-4.4, 5);
      ctx.closePath();
      ctx.fillStyle = accent;
      ctx.fill();
      ctx.restore();
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [worldRef, isTouch]);

  return (
    <button
      type="button"
      className={styles.minimap}
      onClick={onOpenMap}
      aria-label="Open the sky map"
      title="Open the sky map"
    >
      <canvas ref={canvasRef} className={styles.minimapCanvas} aria-hidden />
    </button>
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
