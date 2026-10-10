// A whole screen: the slab, and its layout's regions as planes. Each region is its own
// Slab so it can lift along the view axis (`lift` in px, a translateZ) with its own
// shadow interpolated through the elevation rows against its own lift; the slab beneath
// keeps its low shadow and dims as the planes leave it. With no children the layout's
// recipe draws the default contents; with children, they draw in the slab's own px.
// `assemble` runs the 48-unit grammar: frame, regions in reading order, bars, charts,
// then the one lit thing.
import type { ReactNode } from "react";
import { DetailPanel } from "./DetailPanel";
import { Donut } from "./Donut";
import { Form, formHeight } from "./Form";
import { Bar } from "./Greek";
import { GREEK, greekWidths, stagger } from "./greek";
import { Header } from "./Header";
import { chartRects, DASHBOARD, tileRects } from "./layouts";
import type { Layout, Rect, Region } from "./layouts";
import { LineChart } from "./LineChart";
import { eo, Outline, unit } from "./Outline";
import { Progress } from "./Progress";
import { Sidebar } from "./Sidebar";
import { Slab } from "./Slab";
import type { Elevation, Pool } from "./Slab";
import { StatTile } from "./StatTile";
import { Table } from "./Table";
import { Tabs, TABS_H } from "./Tabs";
import { alpha, modeT, toneColor, useIllus } from "./theme";
import type { Mode } from "./theme";
import { Tree } from "./Tree";

/** The resting height of each plane when fully lifted, in px of translateZ. */
export const LIFT_Z: Record<Region, number> = { nav: 90, header: 150, tiles: 210, charts: 270, table: 270, tree: 210, detail: 270, main: 210 };

/** The whole-screen assembly runs over this many units (frames at 1 unit per frame). */
export const SCREEN_ASSEMBLE = 48;

export type ScreenProps = {
  layout?: Layout;
  x?: number;
  y?: number;
  mode?: Mode;
  elevation?: Elevation;
  assemble?: number;
  lift?: Partial<Record<Region, number>>;
  /** Opacity of the whole group. Note: below 1 it flattens the 3D, so dim only a flat screen. */
  dim?: number;
  seed?: number;
  pool?: Pool | false;
  /** The one region whose marker is the state colour; every other marker is the hi tone. */
  lit?: Region;
  children?: ReactNode;
};

const CARD_PAD = 24;

/** The window a region assembles in, in 48 units: 6 apart in reading order, 18 long. */
const regionWindow = (order: Region[], r: Region) => {
  const i = Math.max(0, order.indexOf(r));
  return { a: 6 + 6 * i, b: 6 + 6 * i + 18 };
};

const p48 = (p: number, a: number, b: number) => unit((p * SCREEN_ASSEMBLE - a) / (b - a));

type RegionContentProps = { layout: Layout; region: Region; rect: Rect; seed: number; assemble: number; state: number; lineDraw: number; donutDraw: number; marker: "state" | "hi" };

/** The layout recipe's default contents for one region, drawn in the region's own px. */
const RegionContent = ({ layout, region, rect, seed, assemble, state, lineDraw, donutDraw, marker }: RegionContentProps) => {
  const rc = layout.recipe;
  const local: Rect = { x: 0, y: 0, w: rect.w, h: rect.h };
  switch (region) {
    case "nav": {
      const s = rc.sidebar ?? { rows: 8, groups: [3, 5], active: 2, glyph: "slot" as const };
      return <Sidebar w={rect.w} h={rect.h} rows={s.rows} groups={s.groups} active={s.active} glyph={s.glyph} seed={seed + 1} assemble={assemble} state={state} panel={false} rule markerTone={marker} />;
    }
    case "header": {
      const hd = rc.header ?? { actions: 2, search: false };
      return <Header w={rect.w} h={rect.h} actions={hd.actions} search={hd.search} titleH={hd.titleH} seed={seed + 2} assemble={assemble} />;
    }
    case "tiles": {
      const tl = rc.tiles ?? { count: 4, gap: 16, h: 120 };
      return (
        <>
          {tileRects(local, tl.count, tl.gap).map((r, i) => (
            <StatTile key={i} x={r.x} y={r.y} w={r.w} h={r.h} seed={seed + 10 + i} assemble={stagger(assemble, i, tl.count, 14, 1)} />
          ))}
        </>
      );
    }
    case "charts": {
      const ch = rc.charts ?? { lineShare: 0.62, gap: 16, points: 24, grid: 4, donutSegments: 3 };
      const { line, donut } = chartRects(local, ch.lineShare, ch.gap);
      const r = 72;
      return (
        <>
          <LineChart x={line.x} y={line.y} w={line.w} h={line.h} points={ch.points} grid={ch.grid} seed={seed + 20} assemble={assemble} draw={lineDraw} />
          <DonutCard rect={donut} r={r} segments={ch.donutSegments} seed={seed + 21} assemble={assemble} draw={donutDraw} />
        </>
      );
    }
    case "table": {
      const tb = rc.table ?? { rows: 4, cols: 6, rowH: 40, header: true };
      return <Table w={rect.w} h={rect.h} rows={tb.rows} cols={tb.cols} rowH={tb.rowH} header={tb.header} seed={seed + 30} assemble={assemble} state={state} markerTone={marker} />;
    }
    case "tree": {
      const tr = rc.tree ?? { nodes: 12, depth: 3, open: [0, 1, 4], rowH: 36 };
      return <Tree w={rect.w} h={rect.h} nodes={tr.nodes} depth={tr.depth} open={tr.open} rowH={tr.rowH} selected={tr.open[tr.open.length - 1] + 1} seed={seed + 40} assemble={assemble} state={state} markerTone={marker} />;
    }
    case "detail": {
      const dt = rc.detail ?? { tabs: 3, rows: 6 };
      return <DetailPanel w={rect.w} h={rect.h} tabs={dt.tabs} rows={dt.rows} seed={seed + 50} assemble={assemble} markerTone={marker} />;
    }
    case "main": {
      if (rc.form) {
        const fw = Math.min(rect.w - CARD_PAD * 2, 1200);
        const fh = formHeight(rc.form.fields, rc.form.cols, rc.form.buttons.length);
        return (
          <>
            <Slab w={rect.w} h={fh + CARD_PAD * 2} elevation="flat" tone="panel" opacity={eo(unit(assemble * 3))} />
            <Outline w={rect.w} h={fh + CARD_PAD * 2} radius={8} draw={unit(assemble * 1.5)} />
            <Form x={CARD_PAD} y={CARD_PAD} w={fw} fields={rc.form.fields} cols={rc.form.cols} buttons={rc.form.buttons} seed={seed + 60} assemble={assemble} />
          </>
        );
      }
      if (rc.card) {
        const c = rc.card;
        const cx = Math.round((rect.w - c.w) / 2);
        const cy = Math.round((rect.h - c.h) / 2);
        const barsP = unit((assemble * 18 - 4) / 12);
        return (
          <>
            <Slab x={cx} y={cy} w={c.w} h={c.h} elevation="flat" tone="panel" opacity={eo(unit(assemble * 3))} />
            <Outline x={cx} y={cy} w={c.w} h={c.h} radius={8} draw={unit(assemble * 1.5)} />
            <Bar x={cx + CARD_PAD} y={cy + CARD_PAD + 8} w={greekWidths(seed + 70, 1, 240)[0]} h={GREEK.title.h} tone="hi" grow={stagger(barsP, 0, 2)} />
            <Bar x={cx + CARD_PAD} y={cy + CARD_PAD + 8 + GREEK.title.pitch + 4} w={greekWidths(seed + 71, 1, 320)[0]} h={GREEK.body.h} tone="lo" grow={stagger(barsP, 1, 2)} />
            <Progress x={cx + CARD_PAD} y={cy + c.h - CARD_PAD - 24} w={c.w - CARD_PAD * 2} value={c.progress} label seed={seed + 72} assemble={assemble} />
          </>
        );
      }
      if (rc.tabs || rc.table) {
        const tb = rc.table ?? { rows: 8, cols: 6, rowH: 40, header: true };
        const top = rc.tabs ? TABS_H + 16 : 0;
        return (
          <>
            {rc.tabs ? <Tabs w={rect.w} items={rc.tabs.items} index={0} seed={seed + 80} assemble={assemble} markerTone={marker} /> : null}
            <Table y={top} w={rect.w} h={rect.h - top} rows={tb.rows} cols={tb.cols} rowH={tb.rowH} header={tb.header} seed={seed + 81} assemble={assemble} state={state} markerTone={marker} />
          </>
        );
      }
      return null;
    }
    default:
      return null;
  }
};

type DonutCardProps = { rect: Rect; r: number; segments: number; seed: number; assemble: number; draw: number };

/** The donut's card: a panel with a greeked title and the donut centred below it. */
const DonutCard = ({ rect, r, seed, assemble, draw }: DonutCardProps) => {
  const surface = eo(unit(assemble * 3));
  const strokes = unit(assemble * 1.5);
  const bars = unit((assemble * 18 - 4) / 8);
  return (
    <>
      <Slab x={rect.x} y={rect.y} w={rect.w} h={rect.h} elevation="flat" tone="panel" opacity={surface} />
      <Outline x={rect.x} y={rect.y} w={rect.w} h={rect.h} radius={8} draw={strokes} />
      <Bar x={rect.x + CARD_PAD} y={rect.y + CARD_PAD} w={greekWidths(seed, 1, 160)[0]} h={GREEK.title.h} tone="hi" grow={stagger(bars, 0, 1)} />
      <Donut x={rect.x + Math.round((rect.w - r * 2) / 2)} y={rect.y + CARD_PAD + 36 + Math.round((rect.h - CARD_PAD * 2 - 36 - r * 2) / 2)} r={r} seed={seed} draw={draw} />
    </>
  );
};

export const Screen = ({ layout = DASHBOARD, x = 0, y = 0, mode, elevation = "low", assemble = 1, lift, dim = 1, seed = 1, pool, lit = "nav", children }: ScreenProps) => {
  const th = useIllus();
  const t = modeT(mode, modeT(layout.mode));
  const { w, h } = layout;
  const frame = eo(p48(assemble, 0, 12));
  const basePool: Pool | undefined = pool === false ? undefined : (pool ?? { cx: Math.round(w * 0.2), cy: Math.round(h * 0.15), r: Math.round(w * 0.8), a: 0.08 });
  const regions = (Object.keys(layout.regions) as Region[]).filter((r) => layout.regions[r]);
  const ks = regions.map((r) => unit((lift?.[r] ?? 0) / LIFT_Z[r]));
  const maxK = ks.length ? Math.max(...ks) : 0;
  const state = p48(assemble, 44, 48);
  const lineDraw = p48(assemble, 24, 48);
  const donutDraw = p48(assemble, 24, 42);
  const surface = toneColor(th, t, "surface");

  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transformStyle: "preserve-3d", opacity: dim }}>
      <Slab w={w} h={h} radius={8} elevation={elevation} shadow={frame} mode={t} opacity={frame * (1 - 0.4 * maxK)} pool={basePool}>
        {children}
      </Slab>
      {children
        ? null
        : regions.map((r, i) => {
            const rect = layout.regions[r] as Rect;
            const k = ks[i];
            const z = lift?.[r] ?? 0;
            const { a, b } = regionWindow(layout.order, r);
            const local = p48(assemble, a, b);
            const planePool: Pool | undefined = basePool && k > 0 ? { cx: basePool.cx - rect.x, cy: basePool.cy - rect.y, r: basePool.r, a: basePool.a * k } : undefined;
            return (
              <Slab
                key={r}
                x={rect.x}
                y={rect.y}
                w={rect.w}
                h={rect.h}
                radius={8}
                elevation={2 * k}
                shadow={unit(k * 4)}
                mode={t}
                pool={planePool}
                style={{ transform: `translateZ(${z}px)`, background: alpha(surface, k), borderRadius: 8 * k }}
              >
                <RegionContent layout={layout} region={r} rect={rect} seed={seed} assemble={local} state={state} lineDraw={lineDraw} donutDraw={donutDraw} marker={r === lit ? "state" : "hi"} />
              </Slab>
            );
          })}
    </div>
  );
};
