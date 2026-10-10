// Layouts: named region rectangles at 1x, in the proportions the direction documents
// describe. No export is measured for these; the numbers here are the spec. A region
// is a rectangle and a default content recipe, nothing more. Builders never add a word.
import { rand } from "../../lib/anim";

export type Rect = { x: number; y: number; w: number; h: number };

export type Region = "nav" | "header" | "tiles" | "charts" | "table" | "tree" | "detail" | "main";

export type LayoutId = "DASHBOARD" | "EXPLORER" | "BANKING_CONFIGURE" | "BANKING_PROCESS" | "BANKING_REPORT" | "CANVAS_AD" | "CANVAS_LIBRARY";

/** The region padding and the gaps between tiles and regions. */
export const LAYOUT_PAD = 24;
export const TILE_GAP = 16;

export type Recipe = {
  sidebar?: { rows: number; groups: number[]; active: number; glyph: "slot" | "dot" | "none" };
  header?: { actions: number; search: boolean; titleH?: number };
  tiles?: { count: number; gap: number; h: number };
  charts?: { lineShare: number; gap: number; points: number; grid: number; donutSegments: number };
  table?: { rows: number; cols: number; rowH: number; header: boolean };
  tree?: { nodes: number; depth: number; open: number[]; rowH: number };
  detail?: { tabs: number; rows: number };
  form?: { fields: number; cols: number; buttons: ("fill" | "outline")[] };
  card?: { w: number; h: number; progress: number };
  tabs?: { items: number };
};

export type Layout = {
  id: LayoutId;
  w: number;
  h: number;
  mode: "dark" | "light";
  regions: Partial<Record<Region, Rect>>;
  recipe: Recipe;
  /** Reading order for assembly: regions appear 6 f apart in this order. */
  order: Region[];
};

const column = (w: number, h: number, navW: number, headerH: number): Partial<Record<Region, Rect>> => ({
  nav: { x: 0, y: 0, w: navW, h },
  header: { x: navW, y: 0, w: w - navW, h: headerH },
});

export const DASHBOARD: Layout = {
  id: "DASHBOARD",
  w: 1530,
  h: 853,
  mode: "dark",
  regions: {
    ...column(1530, 853, 240, 64),
    tiles: { x: 264, y: 88, w: 1242, h: 120 },
    charts: { x: 264, y: 232, w: 1242, h: 300 },
    table: { x: 264, y: 556, w: 1242, h: 853 - 556 - LAYOUT_PAD },
  },
  recipe: {
    sidebar: { rows: 8, groups: [3, 5], active: 2, glyph: "slot" },
    header: { actions: 2, search: false },
    tiles: { count: 4, gap: TILE_GAP, h: 120 },
    charts: { lineShare: 0.62, gap: TILE_GAP, points: 24, grid: 4, donutSegments: 3 },
    table: { rows: 4, cols: 6, rowH: 40, header: true },
  },
  order: ["nav", "header", "tiles", "charts", "table"],
};

export const EXPLORER: Layout = {
  id: "EXPLORER",
  w: 1560,
  h: 768,
  mode: "dark",
  regions: {
    ...column(1560, 768, 240, 64),
    tree: { x: 264, y: 88, w: 520, h: 768 - 88 - LAYOUT_PAD },
    detail: { x: 808, y: 88, w: 1560 - 808 - LAYOUT_PAD, h: 768 - 88 - LAYOUT_PAD },
  },
  recipe: {
    sidebar: { rows: 8, groups: [3, 5], active: 2, glyph: "slot" },
    header: { actions: 2, search: false },
    tree: { nodes: 12, depth: 3, open: [0, 1, 4], rowH: 36 },
    detail: { tabs: 3, rows: 6 },
  },
  order: ["nav", "header", "tree", "detail"],
};

// The three banking screens share one frame: nav 220, header 56 with a title bar 44 tall,
// and a main region inside the padding. Light mode.
const banking = (id: LayoutId, recipe: Recipe): Layout => ({
  id,
  w: 1900,
  h: 866,
  mode: "light",
  regions: {
    ...column(1900, 866, 220, 56),
    main: { x: 220 + LAYOUT_PAD, y: 56 + LAYOUT_PAD, w: 1900 - 220 - 2 * LAYOUT_PAD, h: 866 - 56 - 2 * LAYOUT_PAD },
  },
  recipe: {
    sidebar: { rows: 8, groups: [3, 5], active: 2, glyph: "slot" },
    header: { actions: 1, search: false, titleH: 44 },
    ...recipe,
  },
  order: ["nav", "header", "main"],
});

export const BANKING_CONFIGURE = banking("BANKING_CONFIGURE", { form: { fields: 6, cols: 2, buttons: ["fill", "outline"] } });
export const BANKING_PROCESS = banking("BANKING_PROCESS", { card: { w: 520, h: 220, progress: 0.4 } });
export const BANKING_REPORT = banking("BANKING_REPORT", { tabs: { items: 3 }, table: { rows: 8, cols: 6, rowH: 40, header: true } });

// Canvases. The page rectangles are generated once, deterministically, from a fixed seed,
// so every still is reproducible. The scene picks which pages are lit.
export type CanvasLayout = {
  id: LayoutId;
  w: number;
  h: number;
  mode: "dark";
  pages: Rect[];
  /** Texture inside a page: bars this tall, this many per page (range). */
  bars: { h: number; min: number; max: number };
  /** Rectangle clusters for the library canvas (drawn as one path per cluster). */
  clusters: { box: Rect; rects: Rect[] }[];
};

const q4 = (v: number) => Math.round(v / 4) * 4;

const adPages = (seed: number, W: number, H: number, count: number): Rect[] => {
  const pages: Rect[] = [];
  const margin = 48;
  const rowPitch = Math.floor((H - 2 * margin) / 6);
  let x = margin;
  let y = margin;
  let i = 0;
  while (pages.length < count && y + 100 <= H - margin) {
    const w = q4(100 + 260 * rand(seed * 101 + i * 7));
    if (x + w > W - margin) {
      x = margin;
      y += rowPitch;
      continue;
    }
    const h = q4(Math.min(rowPitch - 32, w * (0.7 + 0.7 * rand(seed * 131 + i * 11))));
    const jitter = q4(24 * rand(seed * 151 + i * 13));
    pages.push({ x, y: y + jitter, w, h: Math.max(64, h) });
    x += w + q4(24 + 48 * rand(seed * 171 + i * 17));
    i++;
  }
  return pages;
};

const clusterRects = (seed: number, box: Rect, count: number): Rect[] => {
  const out: Rect[] = [];
  for (let i = 0; i < count; i++) {
    const w = q4(20 + 40 * rand(seed * 211 + i * 7));
    const h = q4(20 + 40 * rand(seed * 223 + i * 11));
    const x = box.x + q4((box.w - w) * rand(seed * 227 + i * 13));
    const y = box.y + q4((box.h - h) * rand(seed * 229 + i * 17));
    out.push({ x, y, w, h });
  }
  return out;
};

export const CANVAS_AD: CanvasLayout = {
  id: "CANVAS_AD",
  w: 2000,
  h: 1847,
  mode: "dark",
  pages: adPages(7, 2000, 1847, 36),
  bars: { h: 3, min: 5, max: 14 },
  clusters: [],
};

const LIB_FORMS: Rect = { x: 920, y: 80, w: 720, h: 720 };
const LIB_BAND: Rect = { x: 60, y: 1040, w: 1580, h: 520 };

export const CANVAS_LIBRARY: CanvasLayout = {
  id: "CANVAS_LIBRARY",
  w: 1700,
  h: 2000,
  mode: "dark",
  pages: [],
  bars: { h: 3, min: 0, max: 0 },
  clusters: [
    { box: LIB_FORMS, rects: clusterRects(11, LIB_FORMS, 100) },
    { box: LIB_BAND, rects: clusterRects(13, LIB_BAND, 120) },
  ],
};

export const LAYOUTS = { DASHBOARD, EXPLORER, BANKING_CONFIGURE, BANKING_PROCESS, BANKING_REPORT } as const;
export const CANVASES = { CANVAS_AD, CANVAS_LIBRARY } as const;

/** The tile rectangles inside a tiles region, `count` tiles `gap` apart. */
export const tileRects = (region: Rect, count: number, gap: number): Rect[] => {
  const w = Math.floor((region.w - gap * (count - 1)) / count);
  const rects: Rect[] = [];
  for (let i = 0; i < count; i++) rects.push({ x: region.x + i * (w + gap), y: region.y, w, h: region.h });
  return rects;
};

/** The two chart cards inside a charts region: the line at `lineShare`, the donut card beside it. */
export const chartRects = (region: Rect, lineShare: number, gap: number): { line: Rect; donut: Rect } => {
  const lineW = Math.round((region.w - gap) * lineShare);
  return {
    line: { x: region.x, y: region.y, w: lineW, h: region.h },
    donut: { x: region.x + lineW + gap, y: region.y, w: region.w - gap - lineW, h: region.h },
  };
};
