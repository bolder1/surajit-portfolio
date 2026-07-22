/*
  Car — a low-poly pickup built from primitives (cream body, vermilion
  accents) on a cannon-es RaycastVehicle. Arcade tuning: strong gravity,
  stiff suspension, speed-sensitive steering, all-wheel drive.

  Sign conventions were verified empirically (headless drive test):
  with indexForwardAxis = 2, a NEGATIVE engineForce drives the car
  toward its local +z (the way the headlights point), and a positive
  steer value turns it left (+yaw).
*/

import * as THREE from "three";
import * as CANNON from "cannon-es";
import type { InputState } from "./input";

const BODY_CREAM = 0xf0eee8;
const BODY_DARK = 0x1c1a17;
const ACCENT = 0xd9472f;
const TYRE = 0x211f1c;

const SPAWN = new CANNON.Vec3(0, 1.6, 0);

const TUNING = {
  mass: 180,
  /** per wheel, ×4 (AWD) — keep below tyre grip so launches don't burn out */
  engineForce: 950,
  /** m/s — engine cuts beyond these so the arcade stays drivable */
  maxForwardSpeed: 28,
  maxReverseSpeed: 13,
  brakeForce: 52,
  maxSteer: 0.55,
  wheelRadius: 0.42,
  suspensionStiffness: 48,
  suspensionRestLength: 0.5,
  frictionSlip: 5,
  dampingRelaxation: 2.6,
  dampingCompression: 4.5,
  maxSuspensionForce: 100000,
  rollInfluence: 0.02,
  maxSuspensionTravel: 0.4,
};

export class Car {
  readonly group = new THREE.Group();
  readonly chassisBody: CANNON.Body;
  readonly vehicle: CANNON.RaycastVehicle;

  private wheelMeshes: THREE.Object3D[] = [];
  private upsideDownFor = 0;

  constructor(scene: THREE.Scene, world: CANNON.World) {
    this.buildMeshes();
    scene.add(this.group);

    // ---- physics chassis --------------------------------------------------
    const chassisBody = new CANNON.Body({ mass: TUNING.mass });
    chassisBody.addShape(
      new CANNON.Box(new CANNON.Vec3(0.95, 0.42, 1.85)),
      new CANNON.Vec3(0, 0.15, 0)
    );
    chassisBody.position.copy(SPAWN);
    chassisBody.angularDamping = 0.18;
    this.chassisBody = chassisBody;

    const vehicle = new CANNON.RaycastVehicle({
      chassisBody,
      indexRightAxis: 0,
      indexUpAxis: 1,
      indexForwardAxis: 2,
    });

    const wheelOptions = {
      radius: TUNING.wheelRadius,
      directionLocal: new CANNON.Vec3(0, -1, 0),
      suspensionStiffness: TUNING.suspensionStiffness,
      suspensionRestLength: TUNING.suspensionRestLength,
      frictionSlip: TUNING.frictionSlip,
      dampingRelaxation: TUNING.dampingRelaxation,
      dampingCompression: TUNING.dampingCompression,
      maxSuspensionForce: TUNING.maxSuspensionForce,
      rollInfluence: TUNING.rollInfluence,
      axleLocal: new CANNON.Vec3(-1, 0, 0),
      chassisConnectionPointLocal: new CANNON.Vec3(),
      maxSuspensionTravel: TUNING.maxSuspensionTravel,
    };

    // FL, FR, RL, RR — front wheels steer, all four drive.
    const connections: [number, number, number][] = [
      [0.88, 0, 1.25],
      [-0.88, 0, 1.25],
      [0.88, 0, -1.3],
      [-0.88, 0, -1.3],
    ];
    for (const [x, y, z] of connections) {
      wheelOptions.chassisConnectionPointLocal.set(x, y, z);
      vehicle.addWheel(wheelOptions);
    }
    vehicle.addToWorld(world);
    this.vehicle = vehicle;
  }

  // ---- visuals ------------------------------------------------------------

  private buildMeshes() {
    const cream = new THREE.MeshStandardMaterial({
      color: BODY_CREAM,
      roughness: 0.7,
    });
    const dark = new THREE.MeshStandardMaterial({
      color: BODY_DARK,
      roughness: 0.8,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: ACCENT,
      roughness: 0.55,
    });
    const tyre = new THREE.MeshStandardMaterial({ color: TYRE, roughness: 0.95 });
    const headlight = new THREE.MeshStandardMaterial({
      color: 0xfff2cf,
      emissive: 0xffe6a3,
      emissiveIntensity: 1.6,
    });
    const taillight = new THREE.MeshStandardMaterial({
      color: ACCENT,
      emissive: ACCENT,
      emissiveIntensity: 1.4,
    });

    const add = (
      geo: THREE.BufferGeometry,
      mat: THREE.Material,
      x: number,
      y: number,
      z: number
    ) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      this.group.add(m);
      return m;
    };

    // Deck + hood + bed — the pickup silhouette (front = +z).
    add(new THREE.BoxGeometry(1.8, 0.42, 3.7), cream, 0, 0.02, 0); // main deck
    add(new THREE.BoxGeometry(1.7, 0.34, 1.05), cream, 0, 0.4, 1.22); // hood
    add(new THREE.BoxGeometry(1.72, 0.62, 1.25), dark, 0, 0.54, 0.08); // cabin
    add(new THREE.BoxGeometry(1.78, 0.1, 1.3), accent, 0, 0.9, 0.08); // roof
    add(new THREE.BoxGeometry(1.7, 0.5, 1.1), cream, 0, 0.36, -1.2); // bed walls
    add(new THREE.BoxGeometry(1.5, 0.52, 0.9), dark, 0, 0.38, -1.2); // bed cavity
    add(new THREE.BoxGeometry(1.9, 0.18, 0.3), accent, 0, -0.1, 1.85); // front bumper
    add(new THREE.BoxGeometry(1.9, 0.18, 0.24), accent, 0, -0.1, -1.85); // rear bumper

    // Lights.
    add(new THREE.BoxGeometry(0.3, 0.14, 0.06), headlight, 0.62, 0.32, 1.78);
    add(new THREE.BoxGeometry(0.3, 0.14, 0.06), headlight, -0.62, 0.32, 1.78);
    add(new THREE.BoxGeometry(0.26, 0.12, 0.06), taillight, 0.66, 0.3, -1.84);
    add(new THREE.BoxGeometry(0.26, 0.12, 0.06), taillight, -0.66, 0.3, -1.84);

    // Antenna with a tiny vermilion diamond — the site glyph, on the move.
    const mast = add(
      new THREE.CylinderGeometry(0.02, 0.02, 0.9, 6),
      dark,
      -0.72,
      1.3,
      -1.55
    );
    mast.castShadow = false;
    const pennant = add(new THREE.BoxGeometry(0.14, 0.14, 0.04), accent, -0.72, 1.78, -1.55);
    pennant.rotation.z = Math.PI / 4;
    pennant.castShadow = false;

    // Wheels — cylinder tyre + cream hub cap, lying along the x axle.
    const tyreGeo = new THREE.CylinderGeometry(
      TUNING.wheelRadius,
      TUNING.wheelRadius,
      0.34,
      18
    );
    tyreGeo.rotateZ(Math.PI / 2);
    const hubGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.36, 12);
    hubGeo.rotateZ(Math.PI / 2);
    for (let i = 0; i < 4; i++) {
      const wheel = new THREE.Group();
      const t = new THREE.Mesh(tyreGeo, tyre);
      t.castShadow = true;
      const hub = new THREE.Mesh(hubGeo, cream);
      wheel.add(t, hub);
      this.wheelMeshes.push(wheel);
      this.group.parent?.add(wheel);
    }
  }

  /** Wheel meshes live in the scene root (they follow physics transforms). */
  addWheelsTo(scene: THREE.Scene) {
    for (const w of this.wheelMeshes) scene.add(w);
  }

  // ---- per-frame ----------------------------------------------------------

  applyControls(input: InputState) {
    const v = this.vehicle;
    const speed = this.speed();

    // Speed-sensitive steering keeps high-speed driving stable.
    const steerScale = 1 / (1 + speed * 0.09);
    const steer = input.steer * TUNING.maxSteer * steerScale;
    v.setSteeringValue(steer, 0);
    v.setSteeringValue(steer, 1);

    // Signed speed along the nose: cut the engine past the caps.
    const fwd = this.forwardDir();
    const vel = this.chassisBody.velocity;
    const forwardVel = fwd.x * vel.x + fwd.y * vel.y + fwd.z * vel.z;
    let throttle = input.throttle;
    if (throttle > 0 && forwardVel > TUNING.maxForwardSpeed) throttle = 0;
    if (throttle < 0 && forwardVel < -TUNING.maxReverseSpeed) throttle = 0;

    // Negative force = drive toward local +z (see header note).
    const force = -throttle * TUNING.engineForce;
    for (let i = 0; i < 4; i++) {
      v.applyEngineForce(force, i);
      v.setBrake(0, i);
    }
    if (input.brake) {
      for (let i = 0; i < 4; i++) v.setBrake(TUNING.brakeForce, i);
    } else if (input.throttle === 0) {
      // Light drag so the car coasts to a stop instead of gliding forever.
      for (let i = 0; i < 4; i++) v.setBrake(2.2, i);
    }
  }

  /** Sync meshes from physics. Returns true if the car needed a rescue. */
  syncVisuals(dt: number): boolean {
    this.group.position.copy(this.chassisBody.position as unknown as THREE.Vector3);
    this.group.quaternion.copy(
      this.chassisBody.quaternion as unknown as THREE.Quaternion
    );

    for (let i = 0; i < this.vehicle.wheelInfos.length; i++) {
      this.vehicle.updateWheelTransform(i);
      const t = this.vehicle.wheelInfos[i].worldTransform;
      const mesh = this.wheelMeshes[i];
      mesh.position.copy(t.position as unknown as THREE.Vector3);
      mesh.quaternion.copy(t.quaternion as unknown as THREE.Quaternion);
    }

    // Rescue: flipped for 2.5s, or fell off the world.
    const up = new CANNON.Vec3(0, 1, 0);
    const localUp = this.chassisBody.quaternion.vmult(up);
    this.upsideDownFor = localUp.y < 0.15 ? this.upsideDownFor + dt : 0;
    if (this.upsideDownFor > 2.5 || this.chassisBody.position.y < -20) {
      this.reset(true);
      return true;
    }
    return false;
  }

  /** m/s along the chassis. */
  speed(): number {
    return this.chassisBody.velocity.length();
  }

  forwardDir(): THREE.Vector3 {
    const f = new CANNON.Vec3(0, 0, 1);
    const w = this.chassisBody.quaternion.vmult(f);
    return new THREE.Vector3(w.x, w.y, w.z);
  }

  /**
   * Reset the car. In-place rescue keeps x/z (flipped car rights itself
   * where it is); a full reset returns to spawn.
   */
  reset(inPlace = false) {
    const b = this.chassisBody;
    const pos = inPlace
      ? new CANNON.Vec3(b.position.x, 2.2, b.position.z)
      : SPAWN.clone();
    // Keep heading on in-place rescue; face +z from spawn.
    let yaw = 0;
    if (inPlace) {
      const f = b.quaternion.vmult(new CANNON.Vec3(0, 0, 1));
      yaw = Math.atan2(f.x, f.z);
    }
    if (pos.y < 2.2) pos.y = 2.2;
    b.position.copy(pos);
    b.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), yaw);
    b.velocity.setZero();
    b.angularVelocity.setZero();
    b.wakeUp();
    this.upsideDownFor = 0;
  }
}
