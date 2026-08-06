/*
  PlaygroundWorld — the whole 3D experience behind /playground.

  Owns the renderer, scene, physics world, car, the ACTIVE world variant
  (company ⇄ fun — parallel worlds sharing one engine) and the frame
  loop. The React shell (components/playground/Playground.tsx) mounts a
  canvas, constructs this class and renders overlay UI.

  - Drive through the glowing gate (or use the UI chip) to switch worlds.
  - Click the sky to fly up into MAP mode — the overview of everything;
    the shell renders the work index overlay while we hover above.
  - Fixed-angle follow camera otherwise; warm key light with a shadow
    frustum that tracks the car; fog swallowing the arena edge.
*/

import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Car } from "./car";
import { InputManager } from "./input";
import {
  buildWorld,
  WORLD_PALETTES,
  type BuiltWorld,
  type WorldVariantKey,
} from "./objects";
import { fontsReady } from "./textures";

const CAMERA_OFFSET = new THREE.Vector3(13, 15.5, 13);
const MAP_OFFSET = new THREE.Vector3(0, 150, 26);

export type PlaygroundDebugState = {
  ready: boolean;
  frames: number;
  simTime: number;
  position: [number, number, number];
  forward: [number, number, number];
  yaw: number;
  speed: number;
  bodies: number;
  variant: WorldVariantKey;
  mapMode: boolean;
};

export type Destination = {
  key: string;
  label: string;
  x: number;
  z: number;
  /** flat-world page (or live URL) offered on arrival */
  page?: string;
};

export type NavState = {
  car: { x: number; z: number; yaw: number };
  waypoint: (Destination & { dist: number }) | null;
  destinations: Destination[];
  variant: WorldVariantKey;
};

export type PlaygroundCallbacks = {
  onReady?: () => void;
  onError?: (err: unknown) => void;
  onSpeed?: (kmh: number) => void;
  onWorldChange?: (variant: WorldVariantKey) => void;
  onMapMode?: (open: boolean) => void;
  onArrive?: (dest: Destination) => void;
};

/** GTA-style destination boards, per world. */
function destinationsFor(variant: WorldVariantKey): Destination[] {
  if (variant === "company") {
    return [
      { key: "work", label: "MY WORK PORTFOLIO", x: 0, z: -44, page: "/work" },
      { key: "career", label: "MY CAREER — MILESTONE ARC", x: 0, z: -58, page: "/process" },
      { key: "case-itdr", label: "CASE STUDY — ITDR", x: -18, z: -46, page: "/process/itdr" },
      { key: "case-dpdp", label: "CASE STUDY — DPDP COMPLIANCE", x: 2, z: -44, page: "/process/dpdp-compliance" },
      { key: "case-fnos", label: "CASE STUDY — FUNCTION OS", x: 9, z: -45, page: "/process/function-os" },
      { key: "about", label: "MY ABOUT", x: -44, z: 0, page: "/info" },
      { key: "play", label: "PLAY", x: 44, z: 0 },
      { key: "contact", label: "CONTACT", x: 0, z: 44, page: "/contact" },
      { key: "portal", label: "PORTAL — THE FUN SIDE", x: 0, z: -74 },
    ];
  }
  const ring: Destination[] = ["cma", "cheese", "mosaic", "family-tree", "sb-pr", "claude-session"]
    .map((slug, i, arr) => {
      const a = (i / arr.length) * Math.PI * 2 - Math.PI / 2;
      return {
        key: `fun-${slug}`,
        label: slug.replace(/-/g, " ").toUpperCase(),
        x: Math.cos(a) * 32,
        z: Math.sin(a) * 32,
      };
    });
  return [
    ...ring,
    { key: "portal", label: "PORTAL — THE COMPANY SIDE", x: 0, z: -74 },
  ];
}

export class PlaygroundWorld {
  readonly input = new InputManager();

  private canvas: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera!: THREE.PerspectiveCamera;
  private key!: THREE.DirectionalLight;
  private world!: CANNON.World;
  private car!: Car;
  private built!: BuiltWorld;
  private variant: WorldVariantKey = "company";

  private mode: "follow" | "map" = "follow";
  private lookTarget = new THREE.Vector3();
  private camPos = new THREE.Vector3();
  private frames = 0;
  private floatT = 0;
  private portalCooldown = 0;
  private ready = false;
  private disposed = false;
  private lastTime = 0;

  private pointerDown: { x: number; y: number; t: number } | null = null;
  private raycaster = new THREE.Raycaster();

  private waypoint: Destination | null = null;
  private beacon!: THREE.Group;

  private cb: PlaygroundCallbacks;

  constructor(canvas: HTMLCanvasElement, callbacks: PlaygroundCallbacks = {}) {
    this.canvas = canvas;
    this.cb = callbacks;
    // Surface async init failures instead of swallowing them — the shell
    // flips to its error veil via onError.
    this.init().catch((err) => {
      console.error("[playground] init failed:", err);
      this.cb.onError?.(err);
    });
  }

  private async init() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene.background = new THREE.Color(WORLD_PALETTES.company.bg);
    this.scene.fog = new THREE.Fog(
      WORLD_PALETTES.company.bg,
      WORLD_PALETTES.company.fogNear,
      WORLD_PALETTES.company.fogFar
    );

    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 600);
    this.camPos.copy(CAMERA_OFFSET);
    this.camera.position.copy(this.camPos);
    this.camera.lookAt(0, 0, 0);

    this.setSize();
    window.addEventListener("resize", this.onResize);

    // ---- lights -----------------------------------------------------------
    const hemi = new THREE.HemisphereLight(0x4a463f, 0x151310, 1.1);
    this.scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfff1dd, 2.4);
    key.position.set(26, 42, 18);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -48;
    key.shadow.camera.right = 48;
    key.shadow.camera.top = 48;
    key.shadow.camera.bottom = -48;
    key.shadow.camera.near = 5;
    key.shadow.camera.far = 140;
    key.shadow.bias = -0.0004;
    this.scene.add(key, key.target);
    this.key = key;

    const rim = new THREE.DirectionalLight(0x9aa5b8, 0.5);
    rim.position.set(-30, 24, -26);
    this.scene.add(rim);

    // ---- physics ------------------------------------------------------------
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -22, 0) });
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.allowSleep = true;
    world.defaultContactMaterial.friction = 0.3;
    world.defaultContactMaterial.restitution = 0.15;
    this.world = world;

    // Wait for webfonts so the canvas-drawn world copy is crisp.
    await fontsReady();
    if (this.disposed) return;

    // ---- content ------------------------------------------------------------
    this.built = buildWorld(this.scene, world, this.variant);

    this.car = new Car(this.scene, world);
    this.car.addWheelsTo(this.scene);
    this.buildBeacon();

    this.input.attach();
    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    this.canvas.addEventListener("pointerup", this.onPointerUp);
    this.exposeDebug();

    this.lastTime = performance.now();
    this.renderer.setAnimationLoop(this.tick);

    this.ready = true;
    this.cb.onReady?.();
  }

  // ---- parallel worlds ------------------------------------------------------

  getVariant(): WorldVariantKey {
    return this.variant;
  }

  switchWorld(to?: WorldVariantKey) {
    if (!this.ready || this.disposed) return;
    const next = to ?? (this.variant === "company" ? "fun" : "company");
    if (next === this.variant) return;

    this.teardownBuilt();
    this.clearWaypoint(); // destinations don't survive a dimension jump
    this.variant = next;
    this.applyPalette(next);
    this.built = buildWorld(this.scene, this.world, next);
    this.car.reset();
    this.portalCooldown = 2.5;
    this.cb.onWorldChange?.(next);
  }

  private applyPalette(variant: WorldVariantKey) {
    const p = WORLD_PALETTES[variant];
    (this.scene.background as THREE.Color).set(p.bg);
    const fog = this.scene.fog as THREE.Fog;
    fog.color.set(p.bg);
    fog.near = p.fogNear;
    fog.far = p.fogFar;
  }

  private teardownBuilt() {
    if (!this.built) return;
    for (const body of this.built.bodies) this.world.removeBody(body);
    this.scene.remove(this.built.group);
    this.built.group.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh || (obj as THREE.Points).isPoints) {
        mesh.geometry?.dispose();
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const m of mats) {
          // Module-scoped shared materials survive rebuilds; per-build ones
          // (textures, glows) are marked `owned` and disposed here.
          if (m && (m as THREE.Material).userData?.owned) {
            (m as THREE.MeshStandardMaterial).map?.dispose();
            (m as THREE.Material).dispose();
          }
        }
      }
    });
  }

  // ---- waypoints (the GTA layer) --------------------------------------------

  /** Amber beacon pillar marking the active waypoint. */
  private buildBeacon() {
    const group = new THREE.Group();
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.65, 34, 20, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0xe8a33d,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    pillar.position.y = 17;
    const core = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 34, 8),
      new THREE.MeshBasicMaterial({
        color: 0xffd27a,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      })
    );
    core.position.y = 17;
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.6, 2.3, 32),
      new THREE.MeshBasicMaterial({
        color: 0xe8a33d,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    group.add(pillar, core, ring);
    group.visible = false;
    this.scene.add(group);
    this.beacon = group;
  }

  getDestinations(): Destination[] {
    return destinationsFor(this.variant);
  }

  setWaypoint(key: string) {
    const dest = destinationsFor(this.variant).find((d) => d.key === key) ?? null;
    this.waypoint = dest;
    if (dest) {
      this.beacon.position.set(dest.x, 0, dest.z);
      this.beacon.visible = true;
    } else {
      this.beacon.visible = false;
    }
  }

  clearWaypoint() {
    this.waypoint = null;
    this.beacon.visible = false;
  }

  getNavState(): NavState {
    const p = this.car.chassisBody.position;
    const f = this.car.forwardDir();
    const wp = this.waypoint;
    return {
      car: { x: p.x, z: p.z, yaw: Math.atan2(f.x, f.z) },
      waypoint: wp
        ? { ...wp, dist: Math.hypot(wp.x - p.x, wp.z - p.z) }
        : null,
      destinations: destinationsFor(this.variant),
      variant: this.variant,
    };
  }

  // ---- map mode ---------------------------------------------------------------

  isMapMode(): boolean {
    return this.mode === "map";
  }

  setMapMode(open: boolean) {
    if (this.mode === (open ? "map" : "follow")) return;
    this.mode = open ? "map" : "follow";
    this.cb.onMapMode?.(open);
  }

  private onPointerDown = (e: PointerEvent) => {
    this.pointerDown = { x: e.clientX, y: e.clientY, t: performance.now() };
  };

  private onPointerUp = (e: PointerEvent) => {
    const d = this.pointerDown;
    this.pointerDown = null;
    if (!d || !this.ready) return;
    const moved = Math.hypot(e.clientX - d.x, e.clientY - d.y);
    const held = performance.now() - d.t;
    if (moved > 7 || held > 400) return; // drag, not a click

    if (this.mode === "map") {
      // clicking the world outside the overlay returns to the car
      this.setMapMode(false);
      return;
    }

    // Click the SKY (a ray that never meets the ground) → map mode.
    const rect = this.canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    this.raycaster.setFromCamera(ndc, this.camera);
    const dir = this.raycaster.ray.direction;
    if (dir.y >= -0.06) {
      this.setMapMode(true);
      return;
    }
    // Rays that only meet the ground far beyond the fog also read as sky.
    const t = -this.raycaster.ray.origin.y / dir.y;
    const hit = this.raycaster.ray.at(t, new THREE.Vector3());
    if (hit.distanceTo(this.camera.position) > 220) this.setMapMode(true);
  };

  // ---- frame loop -----------------------------------------------------------

  private tick = (now: number) => {
    const dt = Math.min((now - this.lastTime) / 1000, 1 / 20);
    this.lastTime = now;
    if (dt <= 0) return;

    this.input.update();
    if (this.input.consumeReset()) this.car.reset();
    this.car.applyControls(this.input.state);

    // Generous sub-step budget so slow devices (or software GL) still
    // simulate near-real-time instead of slow motion.
    this.world.step(1 / 60, dt, 10);

    this.car.syncVisuals(dt);
    for (const { mesh, body } of this.built.dynamics) {
      mesh.position.copy(body.position as unknown as THREE.Vector3);
      mesh.quaternion.copy(body.quaternion as unknown as THREE.Quaternion);
    }

    // Dream floaters bob + slowly turn.
    this.floatT += dt;
    for (const f of this.built.floaters) {
      f.rotation.y += dt * 0.9;
      const baseY = (f.userData.baseY as number) ?? f.position.y;
      const phase = (f.userData.phase as number) ?? 0;
      f.position.y = baseY + Math.sin(this.floatT * 1.4 + phase) * 0.4;
    }

    // Portal crossing → the parallel world.
    if (this.portalCooldown > 0) this.portalCooldown -= dt;
    else {
      const carPos = this.car.group.position;
      const dx = carPos.x - this.built.portalPos.x;
      const dz = carPos.z - this.built.portalPos.z;
      if (dx * dx + dz * dz < 3.2 * 3.2) this.switchWorld();
    }

    // Waypoint arrival — beacon pulse + hand the moment to the shell.
    if (this.waypoint) {
      const carPos = this.car.group.position;
      const wx = this.waypoint.x - carPos.x;
      const wz = this.waypoint.z - carPos.z;
      this.beacon.rotation.y += dt * 0.6;
      if (wx * wx + wz * wz < 6 * 6) {
        const arrived = this.waypoint;
        this.clearWaypoint();
        this.cb.onArrive?.(arrived);
      }
    }

    this.updateCamera(dt);
    this.updateShadowFrustum();

    this.frames++;
    if (this.cb.onSpeed && this.frames % 6 === 0) {
      this.cb.onSpeed(Math.round(this.car.speed() * 3.6));
    }

    this.renderer.render(this.scene, this.camera);
  };

  private updateCamera(dt: number) {
    const carPos = this.car.group.position;

    let desired: THREE.Vector3;
    if (this.mode === "map") {
      desired = carPos.clone().add(MAP_OFFSET);
    } else {
      const zoom = 1 + Math.min(this.car.speed() * 0.008, 0.3);
      desired = carPos.clone().add(CAMERA_OFFSET.clone().multiplyScalar(zoom));
    }

    const posLerp = 1 - Math.pow(this.mode === "map" ? 0.05 : 0.0015, dt);
    const lookLerp = 1 - Math.pow(0.0005, dt);
    this.camPos.lerp(desired, posLerp);
    this.lookTarget.lerp(carPos, lookLerp);

    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this.lookTarget);
  }

  /** Keep the shadow box centred on the car so shadows never pop out. */
  private updateShadowFrustum() {
    const carPos = this.car.group.position;
    this.key.position.set(carPos.x + 26, 42, carPos.z + 18);
    this.key.target.position.copy(carPos);
    this.key.target.updateMatrixWorld();
  }

  // ---- window plumbing --------------------------------------------------------

  private onResize = () => this.setSize();

  private setSize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  resetCar() {
    this.input.requestReset();
  }

  /** Test/debug hook — lets the drive smoke-test assert real movement. */
  private exposeDebug() {
    (window as unknown as Record<string, unknown>).__PLAYGROUND__ = {
      getState: (): PlaygroundDebugState => {
        const p = this.car.chassisBody.position;
        const f = this.car.forwardDir();
        return {
          ready: this.ready,
          frames: this.frames,
          simTime: this.world.time,
          position: [p.x, p.y, p.z],
          forward: [f.x, f.y, f.z],
          yaw: Math.atan2(f.x, f.z),
          speed: this.car.speed(),
          bodies: this.world.bodies.length,
          variant: this.variant,
          mapMode: this.mode === "map",
        };
      },
      reset: () => this.car.reset(),
      switchWorld: (to?: WorldVariantKey) => this.switchWorld(to),
      setMapMode: (open: boolean) => this.setMapMode(open),
      setWaypoint: (key: string) => this.setWaypoint(key),
      getNavState: () => this.getNavState(),
    };
  }

  dispose() {
    this.disposed = true;
    window.removeEventListener("resize", this.onResize);
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointerup", this.onPointerUp);
    this.input.detach();
    delete (window as unknown as Record<string, unknown>).__PLAYGROUND__;

    if (this.renderer) {
      this.renderer.setAnimationLoop(null);
      this.scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.isMesh || (obj as THREE.Points).isPoints) {
          mesh.geometry?.dispose();
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          for (const m of mats) {
            const std = m as THREE.MeshStandardMaterial;
            std?.map?.dispose();
            m?.dispose();
          }
        }
      });
      this.renderer.dispose();
    }
  }
}
