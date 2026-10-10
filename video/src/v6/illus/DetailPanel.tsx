// A detail panel: a card with a tab row at the top, a rule under it, and key-value
// rows beneath on a 32 px pitch.
import { KV } from "./Greek";
import { stagger } from "./greek";
import { Outline, phase } from "./Outline";
import { Slab } from "./Slab";
import { Tabs, TABS_H } from "./Tabs";

export type DetailPanelProps = {
  x?: number;
  y?: number;
  w?: number;
  h: number;
  tabs?: number;
  activeTab?: number;
  rows?: number;
  seed?: number;
  assemble?: number;
  markerTone?: "state" | "hi";
};

const PAD = 24;
const PITCH = 32;

export const DetailPanel = ({ x = 0, y = 0, w = 680, h, tabs = 3, activeTab = 0, rows = 6, seed = 1, assemble = 1, markerTone = "state" }: DetailPanelProps) => {
  const surface = phase(assemble, 0, 6);
  const strokes = phase(assemble, 0, 12);
  const rowsP = phase(assemble, 6, 18);
  const top = PAD + TABS_H + 16;
  const innerW = Math.min(w - PAD * 2, 560);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      <Slab w={w} h={h} elevation="flat" tone="panel" opacity={surface} />
      <Outline w={w} h={h} radius={8} draw={strokes} />
      <Tabs x={PAD} y={PAD} w={w - PAD * 2} items={tabs} index={activeTab} seed={seed} assemble={assemble} markerTone={markerTone} />
      {Array.from({ length: rows }, (_, i) => (
        <KV key={i} x={PAD} y={top + i * PITCH} w={innerW} seed={seed * 13 + i * 7} grow={stagger(rowsP, i, rows, 8, 2)} pitch={PITCH} />
      ))}
    </div>
  );
};
