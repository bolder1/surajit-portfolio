/*
  Objects — everything scattered around the parallel worlds.

  Two variants share one engine and one car:

  COMPANY — the editorial dark world (spawn plaza at origin):
    N (-z)  WORK      five product crate-stacks to smash through
    E (+x)  PLAY      bowling lane, ramps, cone slalom
    W (-x)  ABOUT     floor bio + brick wall
    S (+z)  CONTACT   signboard + mail crates
    NNE     MILESTONES — pylon arc with the real career markers
    N far   PORTAL    → the fun side

  FUN — the dreamy parallel world: glowing monuments for the weekend
  builds, luminous orbs to shove around, denser stars, portal home.

  buildWorld() returns everything the engine needs to tear the variant
  down again: one THREE.Group, every physics body, the dream floaters
  and the portal trigger position.
*/

import * as THREE from "three";
import * as CANNON from "cannon-es";
import { SHOWCASE_PRODUCTS } from "@/lib/showcase";
import {
  PALETTE,
  makeCrateFaceTexture,
  makeFloorText,
  makeMilestoneTexture,
  makeSignTexture,
} from "./textures";

export type DynamicPair = { mesh: THREE.Object3D; body: CANNON.Body };

export type WorldVariantKey = "company" | "fun";

export type BuiltWorld = {
  group: THREE.Group;
  dynamics: DynamicPair[];
  bodies: CANNON.Body[];
  /** dream objects the engine bobs/rotates each frame */
  floaters: THREE.Object3D[];
  portalPos: THREE.Vector3;
};

export const WORLD_PALETTES: Record<
  WorldVariantKey,
  { bg: number; fogNear: number; fogFar: number; ground: number; plaza: number }
> = {
  company: { bg: 0x0f0e0c, fogNear: 70, fogFar: 165, ground: 0x141210, plaza: 0x191613 },
  fun: { bg: 0x0b0b17, fogNear: 65, fogFar: 180, ground: 0x121020, plaza: 0x181530 },
};

export const MILESTONES = [
  { no: "01", title: "Enterprise security era", sub: "IAM · PAM · IGA · UEM" },
  { no: "02", title: "MODS design system", sub: "Tokens to components" },
  { no: "03", title: "ITDR", sub: "Identity threat detection" },
  { no: "04", title: "DPDP compliance", sub: "Privacy act, productized" },
  { no: "05", title: "Function OS", sub: "AI finance platform" },
  { no: "06", title: "The 2-day build era", sub: "Claude Code in the chain" },
];

const PROJECTS = [
  { tag: "ITDR", label: "01 — IDENTITY THREAT DETECTION" },
  { tag: "CARE", label: "02 — CARE PLATFORM" },
  { tag: "DPDP", label: "03 — DPDP COMPLIANCE" },
  { tag: "FN-OS", label: "04 — FUNCTION OS · AI FIN" },
  { tag: "MEDIC", label: "05 — HEALTHCARE APP" },
];

const PORTAL_POS = new THREE.Vector3(0, 0, -74);

type BuildCtx = {
  group: THREE.Group;
  world: CANNON.World;
  dynamics: DynamicPair[];
  bodies: CANNON.Body[];
  floaters: THREE.Object3D[];
  variant: WorldVariantKey;
};

export function buildWorld(
  scene: THREE.Scene,
  world: CANNON.World,
  variant: WorldVariantKey
): BuiltWorld {
  const ctx: BuildCtx = {
    group: new THREE.Group(),
    world,
    dynamics: [],
    bodies: [],
    floaters: [],
    variant,
  };

  buildGround(ctx);
  buildStars(ctx);
  buildPortal(ctx);
  buildBoundary(ctx);

  if (variant === "company") {
    buildCenterPlaza(ctx);
    buildWorkZone(ctx);
    buildPlayZone(ctx);
    buildAboutZone(ctx);
    buildContactZone(ctx);
    buildMilestones(ctx);
  } else {
    buildFunCenter(ctx);
    buildFunMonuments(ctx);
    buildFunToys(ctx);
  }

  scene.add(ctx.group);
  return {
    group: ctx.group,
    dynamics: ctx.dynamics,
    bodies: ctx.bodies,
    floaters: ctx.floaters,
    portalPos: PORTAL_POS.clone(),
  };
}

// ---------------------------------------------------------------------------
// shared materials (module-scoped, reused across rebuilds — never disposed)
// ---------------------------------------------------------------------------

const matCream = new THREE.MeshStandardMaterial({ color: 0xf0eee8, roughness: 0.75 });
const matDark = new THREE.MeshStandardMaterial({ color: 0x24211d, roughness: 0.85 });
const matAccent = new THREE.MeshStandardMaterial({ color: 0xd9472f, roughness: 0.6 });
const matAccentDeep = new THREE.MeshStandardMaterial({ color: 0x7d1616, roughness: 0.7 });
const matDream = new THREE.MeshStandardMaterial({ color: 0x2a2745, roughness: 0.8 });

/** Per-build materials get marked so teardown can dispose them (+ maps). */
function owned<T extends THREE.Material>(mat: T): T {
  mat.userData.owned = true;
  return mat;
}

function addDynamic(ctx: BuildCtx, mesh: THREE.Object3D, body: CANNON.Body): DynamicPair {
  mesh.castShadow = true;
  mesh.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).castShadow = true;
  });
  ctx.group.add(mesh);
  body.allowSleep = true;
  body.sleepSpeedLimit = 0.4;
  body.sleepTimeLimit = 0.8;
  ctx.world.addBody(body);
  ctx.bodies.push(body);
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
  ctx.group.add(mesh);
  // IMPORTANT: orientation must be set BEFORE addShape — cannon computes a
  // static body's AABB when the shape is added, and later quaternion writes
  // never mark it dirty (rays/broadphase would use a stale, unrotated AABB).
  const body = new CANNON.Body({ mass: 0, type: CANNON.Body.STATIC, position });
  if (quaternion) body.quaternion.copy(quaternion);
  body.addShape(new CANNON.Box(halfExtents));
  ctx.world.addBody(body);
  ctx.bodies.push(body);
}

// ---------------------------------------------------------------------------
// shared scenery: ground, stars, portal, boundary
// ---------------------------------------------------------------------------

function buildGround(ctx: BuildCtx) {
  const palette = WORLD_PALETTES[ctx.variant];

  // Infinite physics plane. Rotate FIRST, then add the shape — see the
  // AABB-staleness note in addStaticBox (this one broke wheel raycasts
  // for the entire z > 0 half of the world).
  const groundBody = new CANNON.Body({ mass: 0, type: CANNON.Body.STATIC });
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  groundBody.addShape(new CANNON.Plane());
  ctx.world.addBody(groundBody);
  ctx.bodies.push(groundBody);

  // …under a big (fog-hidden) visual disc.
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(260, 64),
    owned(new THREE.MeshStandardMaterial({ color: palette.ground, roughness: 1 }))
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ctx.group.add(ground);

  // Lighter plaza disc marks the spawn.
  const plaza = new THREE.Mesh(
    new THREE.CircleGeometry(24, 48),
    owned(new THREE.MeshStandardMaterial({ color: palette.plaza, roughness: 1 }))
  );
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.y = 0.005;
  plaza.receiveShadow = true;
  ctx.group.add(plaza);
}

/** Dome of stars — the dreamy sky. Denser and bluer on the fun side. */
function buildStars(ctx: BuildCtx) {
  const fun = ctx.variant === "fun";
  const count = fun ? 900 : 380;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 230 + Math.random() * 130;
    const theta = Math.random() * Math.PI * 2;
    // keep stars above the horizon band
    const y = 40 + Math.random() * 200;
    const horiz = Math.sqrt(Math.max(r * r - y * y, 400));
    positions[i * 3] = Math.cos(theta) * horiz;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * horiz;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = owned(
    new THREE.PointsMaterial({
      color: fun ? 0xaebcff : 0xd9d4c8,
      size: fun ? 2.6 : 1.7,
      transparent: true,
      opacity: fun ? 0.95 : 0.6,
      fog: false,
      sizeAttenuation: true,
    })
  );
  const stars = new THREE.Points(geo, mat);
  ctx.group.add(stars);
}

/** The gate between worlds. Drive through it. */
function buildPortal(ctx: BuildCtx) {
  const toFun = ctx.variant === "company";
  const glowColor = toFun ? 0x8f7bff : 0xd9472f;
  const { x, z } = { x: PORTAL_POS.x, z: PORTAL_POS.z };

  const pillarGeo = new THREE.BoxGeometry(0.9, 6.6, 0.9);
  for (const side of [-3.6, 3.6]) {
    const pillar = new THREE.Mesh(pillarGeo, ctx.variant === "fun" ? matDream : matDark);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.3, 1.1), matCream);
    cap.position.y = 3.45;
    pillar.add(cap);
    pillar.position.set(x + side, 3.3, z);
    addStaticBox(
      ctx,
      pillar,
      new CANNON.Vec3(0.45, 3.3, 0.45),
      new CANNON.Vec3(x + side, 3.3, z)
    );
  }
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.9, 1), matCream);
  lintel.position.set(x, 7, z);
  lintel.castShadow = true;
  ctx.group.add(lintel);

  // The shimmer — a translucent veil between the pillars.
  const veil = new THREE.Mesh(
    new THREE.PlaneGeometry(6.4, 6.2),
    owned(
      new THREE.MeshBasicMaterial({
        color: glowColor,
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    )
  );
  veil.position.set(x, 3.3, z);
  ctx.group.add(veil);

  const light = new THREE.PointLight(glowColor, 60, 30, 1.8);
  light.position.set(x, 4, z + 1.5);
  ctx.group.add(light);

  // Floating gate diamonds.
  const diaGeo = new THREE.OctahedronGeometry(0.42);
  const diaMat = owned(
    new THREE.MeshStandardMaterial({
      color: glowColor,
      emissive: glowColor,
      emissiveIntensity: 1.4,
      roughness: 0.4,
    })
  );
  for (const [dx, baseY, phase] of [
    [-4.6, 5.4, 0],
    [4.6, 5.4, 2.1],
    [0, 8.4, 4.2],
  ] as const) {
    const dia = new THREE.Mesh(diaGeo, diaMat);
    dia.position.set(x + dx, baseY, z);
    dia.userData.baseY = baseY;
    dia.userData.phase = phase;
    ctx.group.add(dia);
    ctx.floaters.push(dia);
  }

  const label = makeFloorText(
    [
      {
        text: toFun ? "PARALLEL WORLD ↑ THE FUN SIDE" : "PARALLEL WORLD ↑ THE COMPANY SIDE",
        size: 74,
        font: "mono",
        color: toFun ? "#8f7bff" : PALETTE.accent,
        letterSpacing: 0.18,
      },
      {
        text: "DRIVE THROUGH THE GATE",
        size: 52,
        font: "mono",
        color: PALETTE.muted,
        letterSpacing: 0.16,
        gapBefore: 36,
      },
    ],
    16
  );
  label.position.set(x, 0.02, z + 9);
  ctx.group.add(label);
}

/** Ring of low bollards marking the arena edge (drivable past; fog wins). */
function buildBoundary(ctx: BuildCtx) {
  const R = 92;
  const post = new THREE.BoxGeometry(0.6, 1.4, 0.6);
  const bodyMat = ctx.variant === "fun" ? matDream : matDark;
  for (let a = 0; a < Math.PI * 2 - 0.001; a += Math.PI / 18) {
    const x = Math.cos(a) * R;
    const z = Math.sin(a) * R;
    const mesh = new THREE.Mesh(post, bodyMat);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.18, 0.6), matCream);
    cap.position.y = 0.79;
    mesh.add(cap);
    mesh.position.set(x, 0.7, z);
    addStaticBox(ctx, mesh, new CANNON.Vec3(0.3, 0.7, 0.3), new CANNON.Vec3(x, 0.7, z));
  }
}

// ---------------------------------------------------------------------------
// COMPANY WORLD
// ---------------------------------------------------------------------------

function buildCenterPlaza(ctx: BuildCtx) {
  const title = makeFloorText(
    [
      { text: "SURAJIT", size: 340, font: "serif" },
      { text: "Dutta.", size: 340, font: "serifItalic", gapBefore: 20 },
    ],
    26
  );
  title.position.set(0, 0.02, -7);
  ctx.group.add(title);

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
      {
        text: "CLICK THE SKY FOR THE MAP OF EVERYTHING",
        size: 52,
        font: "mono",
        color: PALETTE.accent,
        letterSpacing: 0.18,
        gapBefore: 40,
      },
    ],
    30
  );
  tagline.position.set(0, 0.02, 8.5);
  ctx.group.add(tagline);

  const diamond = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 1.6),
    owned(new THREE.MeshBasicMaterial({ color: 0xd9472f }))
  );
  diamond.rotation.x = -Math.PI / 2;
  diamond.rotation.z = Math.PI / 4;
  diamond.position.set(0, 0.015, 0);
  ctx.group.add(diamond);

  const spokes: { angle: number; label: string }[] = [
    { angle: Math.PI, label: "WORK ↑" },
    { angle: Math.PI / 2, label: "PLAY →" },
    { angle: -Math.PI / 2, label: "ABOUT ←" },
    { angle: 0, label: "CONTACT ↓" },
  ];
  const dashGeo = new THREE.PlaneGeometry(0.5, 2.2);
  const dashMat = owned(
    new THREE.MeshBasicMaterial({ color: 0xf0eee8, transparent: true, opacity: 0.16 })
  );
  for (const s of spokes) {
    const dir = new THREE.Vector3(Math.sin(s.angle), 0, Math.cos(s.angle));
    for (let d = 16; d <= 30; d += 4) {
      const dash = new THREE.Mesh(dashGeo, dashMat);
      dash.rotation.x = -Math.PI / 2;
      dash.rotation.z = s.angle;
      dash.position.copy(dir.clone().multiplyScalar(d));
      dash.position.y = 0.012;
      ctx.group.add(dash);
    }
    const label = makeFloorText(
      [{ text: s.label, size: 110, font: "mono", color: PALETTE.muted, letterSpacing: 0.2 }],
      7
    );
    label.position.copy(dir.clone().multiplyScalar(13));
    label.position.y = 0.02;
    ctx.group.add(label);
  }
}

function buildWorkZone(ctx: BuildCtx) {
  const CZ = -44;
  gateSign(ctx, "Work", ["FIVE SHIPPED PRODUCTS", "DRIVE THROUGH THEM"], 0, CZ + 14);

  const crateGeo = new THREE.BoxGeometry(1.1, 1.1, 1.1);
  PROJECTS.forEach((project, i) => {
    const x = (i - 2) * 9;
    const z = CZ - Math.abs(i - 2) * 2.5;

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
    ctx.group.add(label);
  });
}

function makeKeystoneCrate(tag: string): THREE.Mesh {
  const tex = makeCrateFaceTexture(tag, "#d9472f", "#0f0e0c");
  const mat = owned(new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 }));
  return new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), mat);
}

function buildPlayZone(ctx: BuildCtx) {
  const CX = 44;
  gateSign(ctx, "Play", ["BOWLING · RAMPS · SLALOM"], CX - 14, 0, -Math.PI / 2);

  const laneZ = -10;
  const lane = new THREE.Mesh(
    new THREE.PlaneGeometry(26, 5),
    owned(new THREE.MeshBasicMaterial({ color: 0xf0eee8, transparent: true, opacity: 0.07 }))
  );
  lane.rotation.x = -Math.PI / 2;
  lane.position.set(CX, 0.01, laneZ);
  ctx.group.add(lane);

  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 18), matAccentDeep);
  const ballBody = new CANNON.Body({
    mass: 6,
    shape: new CANNON.Sphere(0.55),
    position: new CANNON.Vec3(CX - 9, 0.55, laneZ),
  });
  ballBody.linearDamping = 0.05;
  addDynamic(ctx, ball, ballBody);

  const pinGeo = new THREE.CylinderGeometry(0.13, 0.21, 0.95, 12);
  const pinBandGeo = new THREE.CylinderGeometry(0.145, 0.155, 0.14, 12);
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
    }
  }

  ramp(ctx, CX - 4, 10, 0);
  ramp(ctx, CX + 12, 10, Math.PI);

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
  const L = 3;
  const t = 0.16;
  const y = L * Math.sin(angle) + t * Math.cos(angle) - 0.04;

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(4, t * 2, L * 2),
    ctx.variant === "fun" ? matDream : matDark
  );
  const q = new CANNON.Quaternion()
    .setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotY)
    .mult(new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(1, 0, 0), angle));
  mesh.position.set(x, y, z);
  mesh.quaternion.set(q.x, q.y, q.z, q.w);

  const lip = new THREE.Mesh(new THREE.BoxGeometry(4, t * 2 + 0.02, 0.3), matAccent);
  lip.position.set(0, 0.01, -L + 0.15);
  mesh.add(lip);

  addStaticBox(ctx, mesh, new CANNON.Vec3(2, t, L), new CANNON.Vec3(x, y, z), q);
}

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
  bio.rotation.z = -Math.PI / 2;
  ctx.group.add(bio);

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
      const body = new CANNON.Body({ mass: 1.4, position: new CANNON.Vec3(x, y, z) });
      body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
      body.addShape(new CANNON.Box(new CANNON.Vec3(0.25, 0.25, 0.525)));
      addDynamic(ctx, brick, body);
    }
  }
}

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
  contact.rotation.z = Math.PI;
  ctx.group.add(contact);

  for (let i = 0; i < 3; i++) {
    const tex = makeCrateFaceTexture("@", "#f0eee8", "#0f0e0c");
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 1.1, 1.1),
      owned(new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 }))
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

/** The pylon arc — real markers of the road so far. */
function buildMilestones(ctx: BuildCtx) {
  const R = 62;
  MILESTONES.forEach((m, i) => {
    const a = ((-150 + i * 24) * Math.PI) / 180;
    const x = Math.cos(a) * R;
    const z = Math.sin(a) * R;
    const rotY = Math.atan2(-x, -z);

    const tex = makeMilestoneTexture(m.no, m.title, m.sub);
    const face = owned(new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 }));
    const pylon = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 2.15, 0.4),
      [matDark, matDark, matDark, matDark, face, owned(new THREE.MeshStandardMaterial({ map: tex.clone(), roughness: 0.85 }))]
    );
    pylon.position.set(x, 1.55, z);
    pylon.rotation.y = rotY;
    const cap = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.14, 0.55), matCream);
    cap.position.y = 1.15;
    pylon.add(cap);

    const q = new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotY);
    addStaticBox(
      ctx,
      pylon,
      new CANNON.Vec3(0.85, 1.55, 0.25),
      new CANNON.Vec3(x, 1.55, z),
      q
    );

    // small vermilion diamond on the floor before each pylon
    const marker = new THREE.Mesh(
      new THREE.PlaneGeometry(0.7, 0.7),
      owned(new THREE.MeshBasicMaterial({ color: 0xd9472f }))
    );
    marker.rotation.x = -Math.PI / 2;
    marker.rotation.z = Math.PI / 4;
    marker.position.set(x * 0.92, 0.015, z * 0.92);
    ctx.group.add(marker);
  });

  const label = makeFloorText(
    [
      {
        text: "MILESTONE ARC — THE ROAD SO FAR",
        size: 66,
        font: "mono",
        color: PALETTE.muted,
        letterSpacing: 0.2,
      },
    ],
    14
  );
  label.position.set(0, 0.02, -56);
  ctx.group.add(label);
}

function gateSign(
  ctx: BuildCtx,
  title: string,
  meta: string[],
  x: number,
  z: number,
  rotY = 0
) {
  const tex = makeSignTexture(title, meta);
  const board = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 0.18), [
    matDark,
    matDark,
    matDark,
    matDark,
    owned(new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 })),
    owned(new THREE.MeshStandardMaterial({ map: tex.clone(), roughness: 0.8 })),
  ]);
  board.position.set(x, 3.1, z);
  board.rotation.y = rotY;

  const legGeo = new THREE.BoxGeometry(0.22, 3.4, 0.22);
  for (const side of [-2.4, 2.4]) {
    const leg = new THREE.Mesh(legGeo, matDark);
    leg.position.set(side, -2.3, 0);
    board.add(leg);
  }

  const q = new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotY);
  addStaticBox(ctx, board, new CANNON.Vec3(3, 2.4, 0.2), new CANNON.Vec3(x, 2.4, z), q);
}

// ---------------------------------------------------------------------------
// FUN WORLD
// ---------------------------------------------------------------------------

function buildFunCenter(ctx: BuildCtx) {
  const title = makeFloorText(
    [
      { text: "THE FUN", size: 320, font: "serif", color: "#cfd6ff" },
      { text: "side.", size: 320, font: "serifItalic", gapBefore: 20, color: "#8f7bff" },
    ],
    26
  );
  title.position.set(0, 0.02, -7);
  ctx.group.add(title);

  const tagline = makeFloorText(
    [
      {
        text: "WEEKEND BUILDS · STILL SHIPPED",
        size: 72,
        font: "mono",
        color: "#7f7aa8",
        letterSpacing: 0.2,
      },
      {
        text: "EVERYTHING GLOWS — PUSH IT AND SEE",
        size: 56,
        font: "mono",
        color: "#a9a4cf",
        letterSpacing: 0.16,
        gapBefore: 44,
      },
    ],
    28
  );
  tagline.position.set(0, 0.02, 8.5);
  ctx.group.add(tagline);
}

const FUN_SLUGS = new Set([
  "cma",
  "cheese",
  "mosaic",
  "family-tree",
  "sb-pr",
  "claude-session",
]);

/** Glowing monuments — one per weekend/lab build, in a ring. */
function buildFunMonuments(ctx: BuildCtx) {
  const products = SHOWCASE_PRODUCTS.filter((p) => FUN_SLUGS.has(p.slug));
  const R = 32;
  const diaGeo = new THREE.OctahedronGeometry(1.0);
  products.forEach((prod, i) => {
    const a = (i / products.length) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * R;
    const z = Math.sin(a) * R;

    // pedestal
    const pedestal = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 1.6), matDream);
    pedestal.position.set(x, 0.55, z);
    addStaticBox(
      ctx,
      pedestal,
      new CANNON.Vec3(0.8, 0.55, 0.8),
      new CANNON.Vec3(x, 0.55, z)
    );

    // floating gem in the product's signature color
    const gem = new THREE.Mesh(
      diaGeo,
      owned(
        new THREE.MeshStandardMaterial({
          color: prod.color,
          emissive: prod.color,
          emissiveIntensity: 1.8,
          roughness: 0.35,
        })
      )
    );
    const baseY = 3.1;
    gem.position.set(x, baseY, z);
    gem.userData.baseY = baseY;
    gem.userData.phase = i * 1.3;
    ctx.group.add(gem);
    ctx.floaters.push(gem);

    const label = makeFloorText(
      [
        { text: prod.name.toUpperCase(), size: 84, font: "mono", color: "#cfd6ff", letterSpacing: 0.16 },
        {
          text: prod.kind,
          size: 50,
          font: "mono",
          color: "#7f7aa8",
          letterSpacing: 0.2,
          gapBefore: 30,
        },
      ],
      10
    );
    label.position.set(x * 1.32, 0.02, z * 1.32);
    label.rotation.z = Math.atan2(-x, -z) + Math.PI;
    ctx.group.add(label);
  });
}

/** Luminous orbs to shove, dream ramps, a cone ring. */
function buildFunToys(ctx: BuildCtx) {
  const orbColors = [0x8f7bff, 0xff7bb8, 0x7bd7ff, 0xffd77b, 0x9dffa8];
  for (let i = 0; i < 10; i++) {
    const color = orbColors[i % orbColors.length];
    const r = 0.5 + (i % 3) * 0.12;
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(r, 20, 16),
      owned(
        new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 1.1,
          roughness: 0.4,
        })
      )
    );
    const a = (i / 10) * Math.PI * 2;
    const dist = 14 + (i % 4) * 3;
    const x = Math.cos(a) * dist;
    const z = Math.sin(a) * dist;
    orb.position.set(x, r, z);
    const body = new CANNON.Body({
      mass: 1.1,
      shape: new CANNON.Sphere(r),
      position: new CANNON.Vec3(x, r, z),
    });
    body.linearDamping = 0.08;
    addDynamic(ctx, orb, body);
  }

  ramp(ctx, -18, 26, Math.PI / 4);
  ramp(ctx, 18, -26, Math.PI + Math.PI / 4);

  const coneGeo = new THREE.ConeGeometry(0.36, 0.85, 14);
  const coneMat = owned(
    new THREE.MeshStandardMaterial({
      color: 0x8f7bff,
      emissive: 0x8f7bff,
      emissiveIntensity: 0.5,
      roughness: 0.6,
    })
  );
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const x = Math.cos(a) * 7;
    const z = 40 + Math.sin(a) * 7;
    const cone = new THREE.Mesh(coneGeo, i % 2 ? coneMat : matCream);
    cone.position.set(x, 0.425, z);
    const body = new CANNON.Body({
      mass: 0.5,
      shape: new CANNON.Box(new CANNON.Vec3(0.24, 0.42, 0.24)),
      position: new CANNON.Vec3(x, 0.425, z),
    });
    addDynamic(ctx, cone, body);
  }
}
