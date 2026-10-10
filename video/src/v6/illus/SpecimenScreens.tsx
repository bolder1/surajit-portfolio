// The screens specimen (composition KitScreens, 90 f): every screen component of the kit
// on one sheet, in three pages, so a reviewer sees each one from four stills (0, 30, 60, 89).
//   0 to 29   the dashboard assembling (V1 dark), and the single components in a dark slab
//   30 to 59  the dashboard exploded into its planes in the tilted stage, then re-seating;
//             a phone (V3 dark) and a browser window (V2 light) beside it
//   60 to 89  the three banking screens in light mode, the explorer, the token table far,
//             the two canvases, a header with a search box
// The specimen is a scene: it reads the frame and drives the kit with progress props. The
// kit itself never reads the frame.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { K } from "../tokens";
import { KeyLight } from "../stage";
import { MODES, TOKENS, tokenName } from "./artefact";
import { BarChart } from "./BarChart";
import { CanvasThumbs } from "./CanvasThumbs";
import { Donut } from "./Donut";
import { Form } from "./Form";
import { Lines } from "./Greek";
import { Header } from "./Header";
import { BANKING_CONFIGURE, BANKING_PROCESS, BANKING_REPORT, CANVAS_AD, CANVAS_LIBRARY, DASHBOARD, EXPLORER } from "./layouts";
import type { Region } from "./layouts";
import { LineChart } from "./LineChart";
import { Phone } from "./Phone";
import { Progress } from "./Progress";
import { LIFT_Z, Screen } from "./Screen";
import { Sidebar } from "./Sidebar";
import { Slab } from "./Slab";
import { StatTile } from "./StatTile";
import { Table } from "./Table";
import { Tabs } from "./Tabs";
import { IllusProvider, THEME_V1, THEME_V2, THEME_V3 } from "./theme";
import { TokenTable } from "./TokenTable";
import type { TokenRow } from "./TokenTable";
import { Window } from "./Window";

// The film's two curves, as the shared helpers define them.
const EO = Easing.bezier(0.16, 1, 0.3, 1);
const EIO = Easing.bezier(0.83, 0, 0.17, 1);
const prog = (f: number, a: number, b: number, easing = EO) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** A scaled wrapper: the component keeps its 1x drawing, the wrapper scales it. */
const Scaled: React.FC<{ x: number; y: number; s: number; children?: React.ReactNode; three?: boolean }> = ({ x, y, s, children, three }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `scale(${s})`, transformOrigin: "top left", transformStyle: three ? "preserve-3d" : undefined }}>{children}</div>
);

const PageOne: React.FC<{ f: number }> = ({ f }) => {
  // Whole from the first frame: the still at 0 is the flat dashboard and every single component at rest.
  const assemble = 1;
  const parts = 1;
  const tab = prog(f, 6, 26) * 2;
  return (
    <>
      <Scaled x={80} y={120} s={0.6}>
        <Screen layout={DASHBOARD} assemble={assemble} seed={3} />
      </Scaled>
      <Slab x={1080} y={100} w={760} h={900} elevation="low" pool={{ cx: 120, cy: 80, r: 700, a: 0.08 }}>
        <LineChart x={24} y={24} w={464} h={240} highlight={14} seed={5} assemble={parts} draw={1} />
        <BarChart x={512} y={60} w={224} h={180} seed={6} state={5} draw={1} />
        <Donut x={24} y={300} r={72} seed={7} draw={1} state={1} />
        <Progress x={200} y={300} w={320} value={0.4} seed={8} assemble={parts} />
        <Tabs x={200} y={348} w={320} items={4} index={tab} seed={9} assemble={parts} />
        <StatTile x={24} y={476} w={280} h={120} delta spark seed={10} assemble={parts} />
        <StatTile x={320} y={476} w={280} h={120} seed={11} assemble={parts} />
        <Sidebar x={24} y={620} w={240} h={264} rows={4} groups={[2, 2]} active={1} glyph="dot" seed={12} assemble={parts} panel />
        <Form x={288} y={620} w={448} fields={2} cols={2} seed={13} assemble={parts} />
      </Slab>
    </>
  );
};

const ORDER: Region[] = ["nav", "header", "tiles", "charts", "table"];

const PageTwo: React.FC<{ f: number }> = ({ f }) => {
  // Lifted from the first frame of the page; the planes re-seat in reverse order, 4 f apart, over the last frames.
  const lift: Partial<Record<Region, number>> = {};
  ORDER.forEach((r, i) => {
    const step = ORDER.length - 1 - i;
    const down = prog(f, 44 + step * 3, 52 + step * 3, EIO);
    lift[r] = LIFT_Z[r] * (1 - down);
  });
  return (
    <>
      <div style={{ position: "absolute", left: 40, top: 60, width: 1080, height: 900, perspective: 2400, perspectiveOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: 150, top: 250, transform: "rotateX(26deg) rotateY(-16deg) scale(0.5)", transformOrigin: "50% 50%", transformStyle: "preserve-3d" }}>
          <Screen layout={DASHBOARD} seed={3} lift={lift} />
        </div>
      </div>
      <IllusProvider value={THEME_V3}>
        <Scaled x={1160} y={60} s={0.8}>
          <Slab w={364} h={684} elevation="low" radius={32} pool={{ cx: 60, cy: 40, r: 500, a: 0.08 }}>
            <Phone seed={21} assemble={lin(f, 18, 36)}>
              <Lines x={16} y={16} w={268} n={3} seed={22} titled grow={lin(f, 22, 40)} />
              <StatTile x={16} y={96} w={268} h={100} seed={23} assemble={lin(f, 24, 42)} spark />
              <Table x={16} y={212} w={268} cols={3} rows={4} seed={24} assemble={lin(f, 26, 44)} highlight={2} />
            </Phone>
          </Slab>
        </Scaled>
      </IllusProvider>
      <IllusProvider value={THEME_V2}>
        <Scaled x={1160} y={650} s={0.5}>
          <Slab w={1200} h={760} elevation="low" mode="light">
            <Window seed={31} assemble={lin(f, 18, 36)}>
              <Form x={48} y={48} w={800} fields={6} cols={2} seed={32} assemble={lin(f, 22, 40)} />
              <Tabs x={48} y={400} w={1104} items={3} index={1} seed={33} assemble={lin(f, 24, 42)} />
              <Table x={48} y={456} w={1104} cols={5} rows={4} seed={34} assemble={lin(f, 26, 44)} highlight={1} />
            </Window>
          </Slab>
        </Scaled>
      </IllusProvider>
    </>
  );
};

const TOKEN_ROWS: TokenRow[] = [
  { greek: true },
  { greek: true },
  { greek: true },
  { name: tokenName("primaryFill"), a: { hex: TOKENS.blue500.hex }, b: { hex: TOKENS.orange500.hex }, typed: true },
  { greek: true },
  { greek: true },
  { greek: true },
  { greek: true },
];

const PageThree: React.FC<{ f: number }> = ({ f }) => (
  <>
    {[BANKING_CONFIGURE, BANKING_PROCESS, BANKING_REPORT].map((lay, i) => (
      <Scaled key={lay.id} x={60 + i * 120} y={60 + i * 120} s={0.42}>
        <Screen layout={lay} seed={41 + i} assemble={lin(f, 46 + i * 3, 78 + i * 3)} elevation={i === 0 ? "low" : i === 1 ? "mid" : "high"} />
      </Scaled>
    ))}
    <Scaled x={1120} y={60} s={0.42}>
      <Screen layout={EXPLORER} seed={51} assemble={lin(f, 44, 84)} />
    </Scaled>
    <Scaled x={1120} y={430} s={0.55}>
      <Slab w={1200} h={444} elevation="low" opacity={0.95} pool={{ cx: 200, cy: 60, r: 900, a: 0.08 }}>
        <TokenTable rows={TOKEN_ROWS} colA={MODES.theme[0]} colB={MODES.theme[1]} lit="a" far seed={61} assemble={lin(f, 52, 72)} />
      </Slab>
    </Scaled>
    <Scaled x={60} y={660} s={0.22}>
      <Slab w={2000} h={1847} elevation="low" pool={{ cx: 400, cy: 200, r: 1600, a: 0.08 }}>
        <CanvasThumbs layout={CANVAS_AD} lit={[3, 11, 20]} dim={0.15} seed={71} assemble={lin(f, 54, 74)} />
      </Slab>
    </Scaled>
    <Scaled x={540} y={680} s={0.18}>
      <Slab w={1700} h={2000} elevation="low">
        <CanvasThumbs layout={CANVAS_LIBRARY} dim={0.5} seed={72} assemble={lin(f, 54, 74)} />
      </Slab>
    </Scaled>
    <Slab x={1120} y={720} w={760} h={96} elevation="low" pool={{ cx: 100, cy: 20, r: 600, a: 0.08 }}>
      <Header w={760} h={96} actions={2} search seed={81} assemble={lin(f, 56, 74)} />
    </Slab>
    <Slab x={1120} y={840} w={760} h={160} elevation="mid" mode="light">
      <Tabs x={24} y={16} w={400} items={3} index={0.5} seed={82} assemble={lin(f, 56, 74)} />
      <Progress x={24} y={88} w={360} value={0.6} seed={83} assemble={lin(f, 58, 76)} />
      <Donut x={560} y={8} r={72} seed={84} draw={lin(f, 58, 76)} />
    </Slab>
  </>
);

export const SpecimenScreens: React.FC = () => {
  const f = useCurrentFrame();
  const page = f < 30 ? 1 : f < 60 ? 2 : 3;
  return (
    <AbsoluteFill style={{ background: K.ground }}>
      <KeyLight cx={480} cy={240} r={1300} intensity={0.9} />
      <IllusProvider value={THEME_V1}>
        {page === 1 ? <PageOne f={f} /> : page === 2 ? <PageTwo f={f} /> : <PageThree f={f} />}
      </IllusProvider>
    </AbsoluteFill>
  );
};

export default SpecimenScreens;
