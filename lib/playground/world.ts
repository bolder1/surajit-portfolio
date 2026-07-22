/*
  PlaygroundWorld — the whole 3D driving experience behind /playground.

  Owns the renderer, scene, physics world, car, props and the frame loop.
  The React shell (components/playground/Playground.tsx) only mounts a
  canvas, constructs this class and renders overlay UI.

  Fixed-angle follow camera (isometric-ish diagonal), warm key light with
  a shadow frustum that tracks the car, fog that swallows the arena edge.
*/

import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Car } from "./car";
import { InputManager } from "./input";
import { buildWorldObjects, type DynamicPair } from "./objects";
import { fontsReady } from "./textures";

const BG = 0x0f0e0c;
const CAMERA_OFFSET = new THREE.Vector3(13, 15.5, 13);

export type PlaygroundDebugState = {
  ready: boolean;
  frames: number;
  simTime: number;
  position: [number, number, number];
  forward: [number, number, number];
  yaw: number;
  speed: number;
  bodies: number;
};

export class PlaygroundWorld {
  readonly input = new InputManager();

  private canvas: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera!: THREE.PerspectiveCamera;
  private key!: THREE.DirectionalLight;
  private world!: CANNON.World;
  private car!: Car;
  private dynamics: DynamicPair[] = [];

  private lookTarget = new THREE.Vector3();
  private camPos = new THREE.Vector3();
  private frames = 0;
  private ready = false;
  private disposed = false;
  private lastTime = 0;

  private onSpeed?: (kmh: number) => void;

  constructor(
    canvas: HTMLCanvasElement,
    opts: { onReady?: () => void; onSpeed?: (kmh: number) => void } = {}
  ) {
    this.canvas = canvas;
    this.onSpeed = opts.onSpeed;
    void this.init(opts.onReady);
  }

  private async init(onReady?: () => void) {
    // Renderer first — if WebGL is unavailable this throws and the shell
    // shows the fallback message.
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene.background = new THREE.Color(BG);
    this.scene.fog = new THREE.Fog(BG, 70, 165);

    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 400);
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

    // Cool rim from the opposite side keeps unlit faces readable.
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
    const { dynamics } = buildWorldObjects(this.scene, world);
    this.dynamics = dynamics;

    this.car = new Car(this.scene, world);
    this.car.addWheelsTo(this.scene);

    this.input.attach();
    this.exposeDebug();

    this.lastTime = performance.now();
    this.renderer.setAnimationLoop(this.tick);

    this.ready = true;
    onReady?.();
  }

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
    for (const { mesh, body } of this.dynamics) {
      mesh.position.copy(body.position as unknown as THREE.Vector3);
      mesh.quaternion.copy(body.quaternion as unknown as THREE.Quaternion);
    }

    this.updateCamera(dt);
    this.updateShadowFrustum();

    this.frames++;
    if (this.onSpeed && this.frames % 6 === 0) {
      this.onSpeed(Math.round(this.car.speed() * 3.6));
    }

    this.renderer.render(this.scene, this.camera);
  };

  private updateCamera(dt: number) {
    const carPos = this.car.group.position;

    // Slight pull-back with speed, fixed diagonal angle otherwise.
    const zoom = 1 + Math.min(this.car.speed() * 0.008, 0.3);
    const desired = carPos.clone().add(CAMERA_OFFSET.clone().multiplyScalar(zoom));

    const posLerp = 1 - Math.pow(0.0015, dt);
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
        };
      },
      reset: () => this.car.reset(),
    };
  }

  dispose() {
    this.disposed = true;
    window.removeEventListener("resize", this.onResize);
    this.input.detach();
    delete (window as unknown as Record<string, unknown>).__PLAYGROUND__;

    if (this.renderer) {
      this.renderer.setAnimationLoop(null);
      this.scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry?.dispose();
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          for (const m of mats) {
            const std = m as THREE.MeshStandardMaterial;
            std.map?.dispose();
            m.dispose();
          }
        }
      });
      this.renderer.dispose();
    }
  }
}
