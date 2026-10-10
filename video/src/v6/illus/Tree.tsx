// A tree: nodes as rows with an indent per depth, a chevron (turned when the node is
// open), and a lo bar. The structure comes from the seed and `depth`: only open nodes
// have children, the deepest nodes are leaves without a caret. The selected node lifts
// its surface one step and carries the state marker.
import { Glyph } from "./Glyph";
import { Bar } from "./Greek";
import { GREEK, greekWidths, stagger } from "./greek";
import { Outline, phase, rowLift } from "./Outline";
import { Slab } from "./Slab";
import { toneColor, useIllus, useIllusMode } from "./theme";

export type TreeProps = {
  x?: number;
  y?: number;
  w?: number;
  h: number;
  nodes?: number;
  depth?: number;
  open?: number[];
  selected?: number;
  rowH?: number;
  seed?: number;
  assemble?: number;
  state?: number;
  card?: boolean;
  markerTone?: "state" | "hi";
};

const PAD = 16;
const INDENT = 20;

/** Node depths: a node after an open node steps in, otherwise it stays or steps out by the seed. */
export const treeDepths = (seed: number, nodes: number, depth: number, open: number[]) => {
  const out: number[] = [];
  const r = greekWidths(seed * 3, nodes, 1000);
  for (let i = 0; i < nodes; i++) {
    if (i === 0) {
      out.push(0);
      continue;
    }
    const prev = out[i - 1];
    if (open.includes(i - 1) && prev < depth - 1) out.push(prev + 1);
    else if (prev > 0 && r[i] < 560) out.push(prev - 1);
    else out.push(prev);
  }
  return out;
};

export const Tree = ({ x = 0, y = 0, w = 520, h, nodes = 12, depth = 3, open = [0, 1, 4], selected, rowH = 36, seed = 1, assemble = 1, state, card = true, markerTone = "state" }: TreeProps) => {
  const th = useIllus();
  const t = useIllusMode();
  const depths = treeDepths(seed, nodes, depth, open);
  const widths = greekWidths(seed + 5, nodes, 160);
  const surface = phase(assemble, 0, 6);
  const strokes = phase(assemble, 0, 12);
  const bars = phase(assemble, 4, 18);
  const lit = state ?? phase(assemble, 14, 18);
  const pad = card ? PAD : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      {card ? (
        <>
          <Slab w={w} h={h} elevation="flat" tone="panel" opacity={surface} />
          <Outline w={w} h={h} radius={8} draw={strokes} />
        </>
      ) : null}
      {selected !== undefined && selected >= 0 && selected < nodes ? (
        <>
          <div style={{ position: "absolute", left: card ? 8 : 0, top: pad + selected * rowH, width: w - (card ? 16 : 0), height: rowH, background: rowLift(toneColor(th, t, "lo")), opacity: lit }} />
          <div style={{ position: "absolute", left: 0, top: pad + selected * rowH + 8, width: 2, height: rowH - 16, background: toneColor(th, t, markerTone), opacity: lit }} />
        </>
      ) : null}
      {depths.map((d, i) => {
        const top = pad + i * rowH;
        const left = pad + 8 + d * INDENT;
        const caret = d < depth - 1;
        const isOpen = open.includes(i);
        return (
          <div key={i}>
            {caret ? <Glyph name="chevron" x={left} y={top + (rowH - 16) / 2} rotate={isOpen ? 90 : 0} draw={stagger(strokes, i, nodes, 6, 1)} /> : null}
            <Bar x={left + 24} y={top + (rowH - GREEK.body.h) / 2} w={widths[i]} h={GREEK.body.h} tone="lo" grow={stagger(bars, i, nodes)} />
          </div>
        );
      })}
    </div>
  );
};
