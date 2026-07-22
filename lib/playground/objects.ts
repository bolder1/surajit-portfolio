/*
  Objects — everything scattered around the open world.

  Layout (spawn plaza at origin, camera looks in from +x/+z):
    N (-z)  WORK      five project crate-stacks to smash through
    E (+x)  PLAY      bowling lane, ramps, cone slalom
    W (-x)  ABOUT     floor bio + brick wall
    S (+z)  CONTACT   signboard + mail crates

  Every dynamic prop is a {mesh, body} pair the world syncs each frame.
*/

import * as THREE from "three";
import * as CANNON from "cannon-es";
import {
  PALETTE,
  makeCrateFaceTexture,
  makeFloorText,
  makeSignTexture,
} from "./textures";

export type DynamicPair = { mesh: THREE.Object3D; body: CANNON.Body };

export type WorldObjects = {
  dynamics: DynamicPair[];
};

const PROJECTS = [
  { tag: "ITDR", label: "01 — IDENTITY THREAT DETECTION" },
  { tag: "CARE", label: "02 — CARE PLATFORM" },
  { tag: "DPDP", label: "03 — DPDP COMPLIANCE" },
  { tag: "FN-OS", label: "04 — FUNCTION OS · AI FIN" },
  { tag: "MEDIC", label: "05 — HEALTHCARE APP" },
];

export function buildWorldObjects(
  scene: THREE.Scene,
  world: CANNON.World
): WorldObjects {
  const dynamics: DynamicPair[] = [];
  const ctx: BuildCtx = { scene, world, dynamics };

  buildGround(ctx);
  buildCenterPlaza(ctx);
  buildWorkZone(ctx);
  buildPlayZone(ctx);
  buildAboutZone(ctx);
  buildContactZone(ctx);
  buildBoundary(ctx);

  return { dynamics };
}

type BuildCtx = {
  scene: THREE.Scene;
  world: CANNON.World;
  dynamics: DynamicPair[];
};

// ---------------------------------------------------------------------------
// shared materials / helpers
// ---------------------------------------------------------------------------

const matGround = new THREE.MeshStandardMaterial({
  color: PALETTE.ground,
  roughness: 1,
});
const matPlaza = new THREE.MeshStandardMaterial({
  color: PALETTE.plaza,
  roughness: 1,
});
const matCream = new THREE.MeshStandardMaterial({
  color: 0xf0eee8,
  roughness: 0.75,
});
const matDark = new THREE.MeshStandardMaterial({
  color: 0x24211d,
  roughness: 0.85,
});
const matAccent = new THREE.MeshStandardMaterial({
  color: 0xd9472f,
  roughness: 0.6,
});
const matAccentDeep = new THREE.MeshStandardMaterial({
  color: 0x7d1616,
  roughness: 0.7,
});

function addDynamic(
  ctx: BuildCtx,
  mesh: THREE.Object3D,
  body: CANNON.Body
): DynamicPair {
  mesh.castShadow = true;
  mesh.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).castShadow = true;
  });
  ctx.scene.add(mesh);
  body.allowSleep = true;
  body.sleepSpeedLimit = 0.4;
  body.sleepTimeLimit = 0.8;
  ctx.world.addBody(body);
  const pair = { mesh, body };
  ctx.dynamics.push(pair);
  return pair;
}

function addStaticBox(
  ctx: BuildCtx,
  mesh: THREE.Mesh,
  halfExtents: CANNON.Vec3,
  position: CANNON.Vec3,
  quaternion?: CANNON.Quaternion
) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  ctx.scene.add(mesh);
  // IMPORTANT: orientation must be set BEFORE addShape — cannon computes a
  // static body's AABB when the shape is added, and later quaternion writes
  // never mark it dirty (rays/broadphase would use a stale, unrotated AABB).
  const body = new CANNON.Body({ mass: 0, type: CANNON.Body.STATIC, position });
  if (quaternion) body.quaternion.copy(quaternion);
  body.addShape(new CANNON.Box(halfExtents));
  ctx.world.addBody(body);
}

// ---------------------------------------------------------------------------
// ground + plaza
// ---------------------------------------------------------------------------

function buildGround(ctx: BuildCtx) {
  // Infinite physics plane. Rotate FIRST, then add the shape — see the
  // AABB-staleness note in addStaticBox (this one broke wheel raycasts
  // for the entire z > 0 half of the world).
  const groundBody = new CANNON.Body({ mass: 0, type: CANNON.Body.STATIC });
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  groundBody.addShape(new CANNON.Plane());
  ctx.world.addBody(groundBody);

  // …under a big (fog-hidden) visual disc.
  const ground = new THREE.Mesh(new THREE.CircleGeometry(260, 64), matGround);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ctx.scene.add(ground);

  // Lighter plaza disc marks the spawn.
  const plaza = new THREE.Mesh(new THREE.CircleGeometry(24, 48), matPlaza);
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.y = 0.005;
  plaza.receiveShadow = true;
  ctx.scene.add(plaza);
}

function buildCenterPlaza(ctx: BuildCtx) {
  // Masthead on the floor.
  const title = makeFloorText(
    [
      { text: "SURAJIT", size: 340, font: "serif" },
      { text: "Dutta.", size: 340, font: "serifItalic", gapBefore: 20 },
    ],
    26
  );
  title.position.set(0, 0.02, -7);
  ctx.scene.add(title);

  const tagline = makeFloorText(
    [
      {
        text: "PRODUCT DESIGNER — IT, IDENTITY & SECURITY",
        size: 72,
        font: "mono",
        color: PALETTE.muted,
        letterSpacing: 0.18,
      },
      {
        text: "W A S D  /  ARROWS TO DRIVE  ·  SPACE TO BRAKE  ·  R TO RESET",
        size: 60,
        font: "mono",
        color: PALETTE.inkSoft,
        letterSpacing: 0.14,
        gapBefore: 46,
      },
    ],
    30
  );
  tagline.position.set(0, 0.02, 8.5);
  ctx.scene.add(tagline);

  // Vermilion spawn diamond.
  const diamond = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6),
    new THREE.MeshBasicMaterial({ color: 0xd9472f }));
  diamond.rotation.x = -Math.PI / 2;
  diamond.rotation.z = Math.PI / 4;
  diamond.position.set(0, 0.015, 0);
  ctx.scene.add(diamond);

  // Guide spokes to the four zones.
  const spokes: { angle: number; label: string }[] = [
    { angle: Math.PI, label: "WORK ↑" }, // -z
    { angle: Math.PI / 2, label: "PLAY →" }, // +x
    { angle: -Math.PI / 2, label: "ABOUT ←" }, // -x
    { angle: 0, label: "CONTACT ↓" }, // +z
  ];
  const dashGeo = new THREE.PlaneGeometry(0.5, 2.2);
  const dashMat = new THREE.MeshBasicMaterial({
    color: 0xf0eee8,
    transparent: true,
    opacity: 0.16,
  });
  for (const s of spokes) {
    const dir = new THREE.Vector3(Math.sin(s.angle), 0, Math.cos(s.angle));
    for (let d = 16; d <= 30; d += 4) {
      const dash = new THREE.Mesh(dashGeo, dashMat);
      dash.rotation.x = -Math.PI / 2;
      dash.rotation.z = s.angle;
      dash.position.copy(dir.clone().multiplyScalar(d));
      dash.position.y = 0.012;
      ctx.scene.add(dash);
    }
    const label = makeFloorText(
      [{ text: s.label, size: 110, font: "mono", color: PALETTE.muted, letterSpacing: 0.2 }],
      7
    );
    label.position.copy(dir.clone().multiplyScalar(13));
    label.position.y = 0.02;
    label.rotation.z = 0;
    ctx.scene.add(label);
  }
}

// ---------------------------------------------------------------------------
// N — WORK: five project crate monuments
// ---------------------------------------------------------------------------

function buildWorkZone(ctx: BuildCtx) {
  const CZ = -44; // zone center z
  gateSign(ctx, "Work", ["FIVE SHIPPED PRODUCTS", "DRIVE THROUGH THEM"], 0, CZ + 14);

  const crateGeo = new THREE.BoxGeometry(1.1, 1.1, 1.1);
  PROJECTS.forEach((project, i) => {
    const x = (i - 2) * 9;
    const z = CZ - Math.abs(i - 2) * 2.5;

    // Pyramid: 3 + 2 + 1 crates, keystone stamped with the project tag.
    const layout: [number, number, number][] = [
      [-1.15, 0.56, 0],
      [0, 0.56, 0],
      [1.15, 0.56, 0],
      [-0.58, 1.68, 0],
      [0.58, 1.68, 0],
      [0, 2.8, 0],
    ];
    layout.forEach(([cx, cy, cz], j) => {
      const isKeystone = j === layout.length - 1;
      const mesh = isKeystone
        ? makeKeystoneCrate(project.tag)
        : new THREE.Mesh(crateGeo, j % 2 ? matDark : matCream);
      mesh.position.set(x + cx, cy, z + cz);
      const body = new CANNON.Body({
        mass: isKeystone ? 1.6 : 2.4,
        shape: new CANNON.Box(new CANNON.Vec3(0.55, 0.55, 0.55)),
        position: new CANNON.Vec3(x + cx, cy, z + cz),
      });
      addDynamic(ctx, mesh, body);
    });

    const label = makeFloorText(
      [{ text: project.label, size: 74, font: "mono", color: PALETTE.muted, letterSpacing: 0.16 }],
      8.5
    );
    label.position.set(x, 0.02, z + 4.4);
    ctx.scene.add(label);
  });
}

function makeKeystoneCrate(tag: string): THREE.Mesh {
  const tex = makeCrateFaceTexture(tag, "#d9472f", "#0f0e0c");
  const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 });
  return new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), mat);
}

// ---------------------------------------------------------------------------
// E — PLAY: bowling, ramps, slalom
// ---------------------------------------------------------------------------

function buildPlayZone(ctx: BuildCtx) {
  const CX = 44;
  gateSign(ctx, "Play", ["BOWLING · RAMPS · SLALOM"], CX - 14, 0, -Math.PI / 2);

  // --- bowling lane (rolls toward +x) --------------------------------------
  const laneZ = -10;
  const lane = new THREE.Mesh(
    new THREE.PlaneGeometry(26, 5),
    new THREE.MeshBasicMaterial({ color: 0xf0eee8, transparent: true, opacity: 0.07 })
  );
  lane.rotation.x = -Math.PI / 2;
  lane.position.set(CX, 0.01, laneZ);
  ctx.scene.add(lane);

  // Ball.
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 24, 18),
    matAccentDeep
  );
  const ballBody = new CANNON.Body({
    mass: 6,
    shape: new CANNON.Sphere(0.55),
    position: new CANNON.Vec3(CX - 9, 0.55, laneZ),
  });
  ballBody.linearDamping = 0.05;
  addDynamic(ctx, ball, ballBody);

  // Ten pins, 1-2-3-4 triangle opening away from the approach.
  const pinGeo = new THREE.CylinderGeometry(0.13, 0.21, 0.95, 12);
  const pinBandGeo = new THREE.CylinderGeometry(0.145, 0.155, 0.14, 12);
  let pinIndex = 0;
  for (let row = 0; row < 4; row++) {
    for (let p = 0; p <= row; p++) {
      const px = CX + 4 + row * 0.85;
      const pz = laneZ + (p - row / 2) * 0.85;
      const pin = new THREE.Group();
      const bodyMesh = new THREE.Mesh(pinGeo, matCream);
      const band = new THREE.Mesh(pinBandGeo, matAccent);
      band.position.y = 0.18;
      pin.add(bodyMesh, band);
      pin.position.set(px, 0.475, pz);
      const body = new CANNON.Body({
        mass: 0.9,
        shape: new CANNON.Box(new CANNON.Vec3(0.16, 0.475, 0.16)),
        position: new CANNON.Vec3(px, 0.475, pz),
      });
      addDynamic(ctx, pin, body);
      pinIndex++;
    }
  }
  void pinIndex;

  // --- two facing ramps for jumps ------------------------------------------
  ramp(ctx, CX - 4, 10, 0);
  ramp(ctx, CX + 12, 10, Math.PI);

  // --- cone slalom ----------------------------------------------------------
  const coneGeo = new THREE.ConeGeometry(0.36, 0.85, 14);
  for (let i = 0; i < 7; i++) {
    const x = CX - 12 + i * 4;
    const z = 20 + (i % 2 ? 1.6 : -1.6);
    const cone = new THREE.Mesh(coneGeo, i % 2 ? matAccent : matCream);
    cone.position.set(x, 0.425, z);
    const body = new CANNON.Body({
      mass: 0.5,
      shape: new CANNON.Box(new CANNON.Vec3(0.24, 0.42, 0.24)),
      position: new CANNON.Vec3(x, 0.425, z),
    });
    addDynamic(ctx, cone, body);
  }
}

/** Static jump ramp: 4 wide, 6 long, lower edge kissing the ground. */
function ramp(ctx: BuildCtx, x: number, z: number, rotY: number) {
  const angle = 0.24;
  const L = 3; // half length
  const t = 0.16; // half thickness
  const y = L * Math.sin(angle) + t * Math.cos(angle) - 0.04;

  const mesh = new THREE.Mesh(new THREE.BoxGeometry(4, t * 2, L * 2), matDark);
  const q = new CANNON.Quaternion()
    .setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotY)
    .mult(new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(1, 0, 0), angle));
  mesh.position.set(x, y, z);
  mesh.quaternion.set(q.x, q.y, q.z, q.w);

  // Vermilion lip so the jump edge reads from a distance.
  const lip = new THREE.Mesh(new THREE.BoxGeometry(4, t * 2 + 0.02, 0.3), matAccent);
  lip.position.set(0, 0.01, -L + 0.15);
  mesh.add(lip);

  addStaticBox(
    ctx,
    mesh,
    new CANNON.Vec3(2, t, L),
    new CANNON.Vec3(x, y, z),
    q
  );
}

// ---------------------------------------------------------------------------
// W — ABOUT: floor bio + brick wall
// ---------------------------------------------------------------------------

function buildAboutZone(ctx: BuildCtx) {
  const CX = -44;
  gateSign(ctx, "About", ["THE DESIGNER BEHIND THE WHEEL"], CX + 14, 0, Math.PI / 2);

  const bio = makeFloorText(
    [
      { text: "Calm software for", size: 150, font: "serifItalic" },
      { text: "complex systems.", size: 150, font: "serifItalic", gapBefore: 14 },
      {
        text: "IAM · PAM · IGA · UEM · DESIGN SYSTEMS",
        size: 62,
        font: "mono",
        color: PALETTE.muted,
        letterSpacing: 0.18,
        gapBefore: 70,
      },
      {
        text: "ENTERPRISE PRODUCTS THAT SURVIVE AUDITS, SCALE & YEAR TWO",
        size: 48,
        font: "mono",
        color: PALETTE.inkSoft,
        letterSpacing: 0.12,
        gapBefore: 34,
      },
    ],
    24
  );
  bio.position.set(CX, 0.02, -2);
  bio.rotation.z = -Math.PI / 2; // read while driving in from the plaza
  ctx.scene.add(bio);

  // Brick wall to smash — offset bond, vermilion bricks.
  const brickGeo = new THREE.BoxGeometry(1.05, 0.5, 0.5);
  const rows = 5;
  for (let r = 0; r < rows; r++) {
    const cols = 6;
    for (let c = 0; c < cols; c++) {
      const x = CX - 2;
      const z = 12 + (c - cols / 2) * 1.1 + (r % 2 ? 0.55 : 0);
      const y = 0.26 + r * 0.52;
      const brick = new THREE.Mesh(brickGeo, r % 2 === c % 2 ? matAccentDeep : matAccent);
      brick.rotation.y = Math.PI / 2;
      brick.position.set(x, y, z);
      const body = new CANNON.Body({
        mass: 1.4,
        shape: new CANNON.Box(new CANNON.Vec3(0.25, 0.25, 0.525)),
        position: new CANNON.Vec3(x, y, z),
      });
      body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
      addDynamic(ctx, brick, body);
    }
  }
}

// ---------------------------------------------------------------------------
// S — CONTACT: signboard + mail crates
// ---------------------------------------------------------------------------

function buildContactZone(ctx: BuildCtx) {
  const CZ = 44;
  gateSign(ctx, "Contact", ["THE ROAD ACTUALLY GOES SOMEWHERE"], 0, CZ - 14, Math.PI);

  const contact = makeFloorText(
    [
      { text: "Let’s build the next one.", size: 170, font: "serifItalic" },
      {
        text: "SURAJIT3255@GMAIL.COM",
        size: 88,
        font: "mono",
        color: PALETTE.accent,
        letterSpacing: 0.14,
        gapBefore: 80,
      },
      {
        text: "LINKEDIN.COM/IN/SURAJIT3255",
        size: 58,
        font: "mono",
        color: PALETTE.muted,
        letterSpacing: 0.16,
        gapBefore: 40,
      },
    ],
    26
  );
  contact.position.set(0, 0.02, CZ + 2);
  contact.rotation.z = Math.PI; // approached from the north
  ctx.scene.add(contact);

  // A few "mail" crates stamped with @ to shove around.
  for (let i = 0; i < 3; i++) {
    const tex = makeCrateFaceTexture("@", "#f0eee8", "#0f0e0c");
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 1.1, 1.1),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 })
    );
    const x = -5 + i * 5;
    mesh.position.set(x, 0.56, CZ + 9);
    const body = new CANNON.Body({
      mass: 2,
      shape: new CANNON.Box(new CANNON.Vec3(0.55, 0.55, 0.55)),
      position: new CANNON.Vec3(x, 0.56, CZ + 9),
    });
    addDynamic(ctx, mesh, body);
  }
}

// ---------------------------------------------------------------------------
// boundary + gate signs
// ---------------------------------------------------------------------------

/** Ring of low cream bollards marking the arena edge (drivable past; fog wins). */
function buildBoundary(ctx: BuildCtx) {
  const R = 92;
  const post = new THREE.BoxGeometry(0.6, 1.4, 0.6);
  for (let a = 0; a < Math.PI * 2 - 0.001; a += Math.PI / 18) {
    const x = Math.cos(a) * R;
    const z = Math.sin(a) * R;
    const mesh = new THREE.Mesh(post, matDark);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.18, 0.6), matCream);
    cap.position.y = 0.79;
    mesh.add(cap);
    mesh.position.set(x, 0.7, z);
    addStaticBox(
      ctx,
      mesh,
      new CANNON.Vec3(0.3, 0.7, 0.3),
      new CANNON.Vec3(x, 0.7, z)
    );
  }
}

/** Standing sign at a zone gate. */
function gateSign(
  ctx: BuildCtx,
  title: string,
  meta: string[],
  x: number,
  z: number,
  rotY = 0
) {
  const tex = makeSignTexture(title, meta);
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(6, 3, 0.18),
    [
      matDark,
      matDark,
      matDark,
      matDark,
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ map: tex.clone(), roughness: 0.8 }),
    ]
  );
  board.position.set(x, 3.1, z);
  board.rotation.y = rotY;

  const legGeo = new THREE.BoxGeometry(0.22, 3.4, 0.22);
  for (const side of [-2.4, 2.4]) {
    const leg = new THREE.Mesh(legGeo, matDark);
    leg.position.set(side, -2.3, 0);
    board.add(leg);
  }

  const q = new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotY);
  // One static box for the whole sign (board + legs) so the car can't clip it.
  addStaticBox(
    ctx,
    board,
    new CANNON.Vec3(3, 2.4, 0.2),
    new CANNON.Vec3(x, 2.4, z),
    q
  );
}
