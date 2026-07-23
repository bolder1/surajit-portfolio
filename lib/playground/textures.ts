/*
  Textures — canvas-drawn text for the playground world.

  All copy in the world (floor titles, crate stamps, signboards) is drawn
  into canvases at runtime so we ship zero image assets and stay pixel-crisp.
  Font families are resolved from the next/font CSS variables so the world
  uses the exact same Instrument Serif / JetBrains Mono as the flat site.
*/

import * as THREE from "three";

export const PALETTE = {
  paper: "#0f0e0c",
  ground: "#141210",
  plaza: "#191613",
  ink: "#f0eee8",
  inkSoft: "#c4c0b6",
  muted: "#8a8479",
  accent: "#d9472f",
  accentDeep: "#7d1616",
} as const;

type FontStack = { serif: string; mono: string; sans: string };

let fontsCache: FontStack | null = null;

/** Resolve the mangled next/font family names off the document root. */
export function resolveFonts(): FontStack {
  if (fontsCache) return fontsCache;
  const fallback: FontStack = {
    serif: "Georgia, serif",
    mono: "ui-monospace, monospace",
    sans: "system-ui, sans-serif",
  };
  if (typeof window === "undefined") return fallback;
  const style = getComputedStyle(document.documentElement);
  const read = (name: string, fb: string) => {
    const v = style.getPropertyValue(name).trim();
    return v ? v : fb;
  };
  fontsCache = {
    serif: read("--v5-serif", fallback.serif),
    mono: read("--v5-mono", fallback.mono),
    sans: read("--v5-sans", fallback.sans),
  };
  return fontsCache;
}

/** Wait for webfonts so canvas text doesn't rasterize with fallbacks. */
export function fontsReady(timeoutMs = 1500): Promise<void> {
  if (typeof document === "undefined" || !document.fonts?.ready) {
    return Promise.resolve();
  }
  return Promise.race([
    document.fonts.ready.then(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}

export function makeCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export type FloorTextLine = {
  text: string;
  /** px within the 2048-wide canvas space */
  size: number;
  font: "serif" | "serifItalic" | "mono";
  color?: string;
  letterSpacing?: number; // em
  gapBefore?: number; // px
};

/**
 * A transparent plane lying flat on the ground with stacked text lines.
 * Returns the mesh; caller positions it (y is set just above the floor).
 */
export function makeFloorText(
  lines: FloorTextLine[],
  worldWidth: number,
  opts: { align?: "center" | "left" } = {}
): THREE.Mesh {
  const fonts = resolveFonts();
  const W = 2048;
  const align = opts.align ?? "center";

  // Measure pass — total height of the stack.
  const measure = document.createElement("canvas").getContext("2d")!;
  let totalH = 0;
  for (const line of lines) {
    totalH += (line.gapBefore ?? 0) + line.size * 1.18;
  }
  const H = Math.ceil(totalH + 80);

  const texture = makeCanvasTexture(W, H, (ctx) => {
    ctx.textAlign = align;
    ctx.textBaseline = "alphabetic";
    let y = 40;
    for (const line of lines) {
      y += (line.gapBefore ?? 0) + line.size;
      ctx.font = fontFor(line, fonts);
      if (line.letterSpacing) {
        ctx.letterSpacing = `${line.letterSpacing}em`;
      } else {
        ctx.letterSpacing = "0em";
      }
      ctx.fillStyle = line.color ?? PALETTE.ink;
      ctx.fillText(line.text, align === "center" ? W / 2 : 0, y);
      y += line.size * 0.18;
    }
  });
  void measure;

  const worldHeight = worldWidth * (H / W);
  const geo = new THREE.PlaneGeometry(worldWidth, worldHeight);
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    fog: true,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.02;
  mesh.renderOrder = 1;
  return mesh;
}

function fontFor(line: FloorTextLine, fonts: FontStack): string {
  switch (line.font) {
    case "serif":
      return `400 ${line.size}px ${fonts.serif}`;
    case "serifItalic":
      return `italic 400 ${line.size}px ${fonts.serif}`;
    case "mono":
      return `500 ${line.size}px ${fonts.mono}`;
  }
}

/** Stamped label material for a crate face (project initials etc.). */
export function makeCrateFaceTexture(
  text: string,
  base: string,
  inkColor: string
): THREE.CanvasTexture {
  const fonts = resolveFonts();
  return makeCanvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);
    // Rule border, printer's-mark corners — the crate as a shipping stamp.
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(18, 18, w - 36, h - 36);
    ctx.fillStyle = inkColor;
    ctx.fillRect(10, 10, 10, 10);
    ctx.fillRect(w - 20, h - 20, 10, 10);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const size = text.length > 4 ? 54 : 76;
    ctx.font = `500 ${size}px ${fonts.mono}`;
    ctx.letterSpacing = "0.08em";
    ctx.fillText(text, w / 2, h / 2 + 4);
  });
}

/** Milestone pylon plate — index, title, sub-line. */
export function makeMilestoneTexture(
  no: string,
  title: string,
  sub: string,
  accent = PALETTE.accent
): THREE.CanvasTexture {
  const fonts = resolveFonts();
  return makeCanvasTexture(512, 640, (ctx, w, h) => {
    ctx.fillStyle = "#161412";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = PALETTE.inkSoft;
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, w - 40, h - 40);
    ctx.fillStyle = accent;
    ctx.fillRect(20, 20, 56, 56);
    ctx.fillStyle = "#161412";
    ctx.textAlign = "center";
    ctx.font = `500 26px ${fonts.mono}`;
    ctx.fillText(no, 48, 56);

    ctx.textAlign = "left";
    ctx.fillStyle = PALETTE.ink;
    ctx.font = `italic 400 52px ${fonts.serif}`;
    wrapText(ctx, title, 44, 160, w - 88, 60);

    ctx.font = `500 22px ${fonts.mono}`;
    ctx.letterSpacing = "0.14em";
    ctx.fillStyle = PALETTE.muted;
    wrapText(ctx, sub.toUpperCase(), 44, h - 150, w - 88, 34);

    // base rule + diamond
    ctx.fillStyle = accent;
    ctx.save();
    ctx.translate(w / 2, h - 66);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-8, -8, 16, 16);
    ctx.restore();
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  for (const word of words) {
    const probe = line ? `${line} ${word}` : word;
    if (ctx.measureText(probe).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = probe;
    }
  }
  if (line) ctx.fillText(line, x, y);
}

/** Two-sided standing sign texture (zone gates, contact board). */
export function makeSignTexture(
  title: string,
  metaLines: string[],
  opts: { accentTitle?: boolean } = {}
): THREE.CanvasTexture {
  const fonts = resolveFonts();
  return makeCanvasTexture(1024, 512, (ctx, w, h) => {
    ctx.fillStyle = "#151311";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = PALETTE.inkSoft;
    ctx.lineWidth = 6;
    ctx.strokeRect(26, 26, w - 52, h - 52);
    // Diamond glyph — the site's narrative spine, carried into the world.
    ctx.save();
    ctx.translate(w / 2, 96);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = PALETTE.accent;
    ctx.fillRect(-11, -11, 22, 22);
    ctx.restore();

    ctx.textAlign = "center";
    ctx.fillStyle = opts.accentTitle ? PALETTE.accent : PALETTE.ink;
    ctx.font = `italic 400 118px ${fonts.serif}`;
    ctx.fillText(title, w / 2, 250);

    ctx.font = `500 34px ${fonts.mono}`;
    ctx.letterSpacing = "0.18em";
    ctx.fillStyle = PALETTE.muted;
    metaLines.forEach((line, i) => {
      ctx.fillText(line.toUpperCase(), w / 2, 330 + i * 62);
    });
  });
}
