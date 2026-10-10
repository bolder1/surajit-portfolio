// D5: three phones (kit Phone + FoodCard / AppointmentCard / TicketCard) whose own components lift out and snap into a
// tidy component board on the grid. The flyers are the SAME kit components that sit on the phones (SearchBar, Row, Btn, Chip,
// Toggle, Avatar, Badge, the tab-bar icons), starting exactly where they are on the screens.
import React from "react";
import { prog, EO, EI } from "../../../lib/anim";
import {
  AppointmentCard, Avatar, Badge, Btn, Chip, FoodCard, flex, Icon, IconTile, Phone, Row, SearchBar, TicketCard, Toggle, phoneOuter,
} from "../../kit/ui";
import { Sticker } from "../../kit/Collage";
import { pop } from "../../motion";
import { G, P } from "../../tokens";
import { head, label } from "../../type";
import { slam } from "../_D4/common";

// ---------------------------------------------------------------- geometry
const PH = { w: 300, h: 620 };
const OUT = phoneOuter(PH.w, PH.h); // 332 x 652
export const PHONE_Y = 104;
const PHONE_X = [810, 1169, 1528];
const PHONE_AT = [0, 15, 30];
const PHONE_SINK = [63, 67, 71];
/** content origin of a phone (film px): outer + 16 frame + 16 pad, 16 frame + 44 status bar */
const origin = (i: number) => ({ x: PHONE_X[i] + 32, y: PHONE_Y + 60 });

/** board: 3 x 3 cells of 2 grid columns x 1 grid row, starting at grid col 6 / row 1 */
const CELL = { x0: G.x(6), y0: G.y(1), w: 300, h: 160 };
const cellXY = (c: number, r: number) => ({ x: CELL.x0 + c * CELL.w, y: CELL.y0 + r * CELL.h });

type Kind = "search" | "btn" | "row" | "chips" | "icon0" | "icon1" | "icon2" | "icon3" | "avatar" | "switchrow" | "badge";
const SIZE: Record<Kind, { w: number; h: number }> = {
  search: { w: 268, h: 56 },
  btn: { w: 268, h: 56 },
  row: { w: 268, h: 76 },
  chips: { w: 268, h: 44 },
  switchrow: { w: 268, h: 76 },
  icon0: { w: 48, h: 48 },
  icon1: { w: 48, h: 48 },
  icon2: { w: 48, h: 48 },
  icon3: { w: 48, h: 48 },
  avatar: { w: 60, h: 60 },
  badge: { w: 160, h: 32 },
};
const NAV_ICONS = ["home", "search", "heart", "user"] as const;

/** One component, rendered the same way on the phone and on the board. */
export const Piece: React.FC<{ kind: Kind }> = ({ kind }) => {
  switch (kind) {
    case "search":
      return <SearchBar value="ramen" action="sliders" w={268} />;
    case "btn":
      return <Btn label="View cart" icon="cart" w={268} />;
    case "row":
      return <Row icon="pulse" title="Blood test" sub="Thu, 9:00" tone="yellow" w={268} />;
    case "chips":
      return (
        <div style={flex("row", { gap: 8 })}>
          <Chip label="Today" active w={84} />
          <Chip label="Week" w={84} />
          <Chip label="Month" w={84} />
        </div>
      );
    case "switchrow":
      return <Row icon="bell" title="Reminder" sub="Tomorrow" tone="orange" right={<Toggle on w={64} />} w={268} />;
    case "avatar":
      return <Avatar face={1} tone="yellow" size={60} />;
    case "badge":
      return <Badge label="Live music" tone="dark" />;
    default:
      return <IconTile name={NAV_ICONS[Number(kind.slice(4))]} size={48} tone={kind === "icon0" ? "orange" : "dark"} />;
  }
};

interface Flyer {
  kind: Kind;
  /** film px of the component's top-left on the phone */
  src: { x: number; y: number };
  /** which board cell */
  cell: [number, number];
  launch: number;
  /** left offset inside the cell (icons sit side by side) */
  dx?: number;
  /** start scale (icons grow out of the tab bar) */
  s0?: number;
  /** hide the original on the phone from the launch frame (false: the flyer is a copy) */
  hide?: boolean;
  /** phone index it comes from */
  phone: number;
}
const o1 = origin(0);
const o2 = origin(1);
const o3 = origin(2);
// tab bar: pills are 56 x 38, icon centres at screen x 37.5 + 75 i, y 576 (screen = content + (16, 44))
const navSrc = (i: number) => ({ x: o2.x - 16 + 37.5 + 75 * i - 24, y: o2.y - 44 + 576 - 24 });
const FLYERS: Flyer[] = [
  { kind: "search", src: { x: o1.x, y: o1.y }, cell: [0, 0], launch: 60, phone: 0, hide: true },
  { kind: "btn", src: { x: o1.x, y: o1.y + 400 }, cell: [2, 0], launch: 62, phone: 0, hide: true },
  { kind: "row", src: { x: o2.x, y: o2.y + 404 }, cell: [1, 0], launch: 64, phone: 1, hide: true },
  { kind: "chips", src: { x: o2.x, y: o2.y }, cell: [0, 1], launch: 66, phone: 1, hide: true },
  { kind: "icon0", src: navSrc(0), cell: [2, 1], launch: 67, dx: 0, s0: 0.54, phone: 1 },
  { kind: "icon1", src: navSrc(1), cell: [2, 1], launch: 67, dx: 64, s0: 0.54, phone: 1 },
  { kind: "icon2", src: navSrc(2), cell: [2, 1], launch: 67, dx: 128, s0: 0.54, phone: 1 },
  { kind: "icon3", src: navSrc(3), cell: [2, 1], launch: 67, dx: 192, s0: 0.54, phone: 1 },
  { kind: "avatar", src: { x: o2.x + 17, y: o2.y + 56 + 17 }, cell: [0, 2], launch: 69, phone: 1 },
  { kind: "switchrow", src: { x: o3.x, y: o3.y + 412 }, cell: [1, 1], launch: 71, phone: 2, hide: true },
  { kind: "badge", src: { x: o3.x + 20, y: o3.y + 20 }, cell: [1, 2], launch: 73, phone: 2 },
];
const FLIGHT = 12;
export const LAND = (fl: Flyer) => fl.launch + FLIGHT;
const LABELS: Record<string, string> = { "0,0": "Search", "1,0": "List row", "2,0": "Button", "0,1": "Chips", "1,1": "Switch row", "2,1": "Tab icons", "0,2": "Avatar", "1,2": "Badge" };
/** frame the orange tag cell fills */
export const TAG_AT = 88;

const dst = (fl: Flyer) => {
  const c = cellXY(fl.cell[0], fl.cell[1]);
  const sz = SIZE[fl.kind];
  return { x: c.x + 16 + (fl.dx ?? 0), y: c.y + 22 + (76 - sz.h) / 2 };
};

// ---------------------------------------------------------------- phone screens
const hidden = (f: number, kind: Kind) => {
  const fl = FLYERS.find((x) => x.kind === kind);
  return !!fl && !!fl.hide && f >= fl.launch;
};
const At: React.FC<{ y: number; hide?: boolean; children: React.ReactNode }> = ({ y, hide, children }) => (
  <div style={{ position: "absolute", left: 0, top: y, visibility: hide ? "hidden" : "visible" }}>{children}</div>
);

const Screen1: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "relative", width: 268, height: 488 }}>
    <At y={0} hide={hidden(f, "search")}>
      <Piece kind="search" />
    </At>
    <FoodCard x={0} y={68} w={268} shadow={false} />
    <At y={400} hide={hidden(f, "btn")}>
      <Piece kind="btn" />
    </At>
  </div>
);
const Screen2: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "relative", width: 268, height: 488 }}>
    <At y={0} hide={hidden(f, "chips")}>
      <Piece kind="chips" />
    </At>
    <AppointmentCard x={0} y={56} w={268} shadow={false} slot={1} />
    <At y={404} hide={hidden(f, "row")}>
      <Piece kind="row" />
    </At>
  </div>
);

const Screen3: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "relative", width: 268, height: 488 }}>
    <TicketCard x={0} y={0} w={268} shadow={false} />
    <At y={412} hide={hidden(f, "switchrow")}>
      <Piece kind="switchrow" />
    </At>
  </div>
);

const SCREENS = [Screen1, Screen2, Screen3];
const TAGS = ["Food delivery", "Healthcare", "Events"];
const NAV_ACTIVE = [1, 2, 3];

/** The phones: slam in on 0 / 15 / 30, sink away behind the rail after their components have lifted out. */
export const Phones: React.FC<{ f: number }> = ({ f }) => (
  <>
    {PHONE_X.map((px, i) => {
      const s = slam(f, PHONE_AT[i], 7);
      const sink = prog(f, PHONE_SINK[i], PHONE_SINK[i] + 14, EI);
      if (!s.visible || sink >= 1) return null;
      const Scr = SCREENS[i];
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: px,
            top: PHONE_Y,
            width: OUT.w,
            height: OUT.h,
            transform: `translateY(${s.lift * 0.5 + sink * 980}px) rotate(${sink * (i === 1 ? -6 : 5)}deg) scale(${s.scale})`,
            transformOrigin: "50% 50%",
          }}
        >
          <Phone x={0} y={0} w={PH.w} h={PH.h} nav={NAV_ACTIVE[i]} shadow={P.orangeDeep}>
            <Scr f={f} />
          </Phone>
          <Sticker x={OUT.w / 2} y={OUT.h + 4} rotate={[-3, 2, -2][i]} bg={[P.yellow, P.paper, P.yellow][i]} fontSize={28} pop={pop(f, PHONE_AT[i] + 3)}>
            {TAGS[i]}
          </Sticker>
        </div>
      );
    })}
  </>
);

// ---------------------------------------------------------------- board
const Cell: React.FC<{ c: number; r: number; f: number; landAt: number | null }> = ({ c, r, f, landAt }) => {
  const { x, y } = cellXY(c, r);
  const appear = pop(f, 56 + c + r);
  const flash = landAt === null ? 0 : Math.max(0, 1 - (f - landAt) / 8) * (f >= landAt ? 1 : 0);
  return (
    <div style={{ position: "absolute", left: x + 6, top: y + 6, width: CELL.w - 12, height: CELL.h - 12, transform: `scale(${Math.min(1, appear)})`, opacity: appear < 0.01 ? 0 : 1 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: P.card, border: `3px solid ${flash > 0.05 ? P.orange : P.line}` }} />
      <span style={{ ...label(20, 620), position: "absolute", left: 10, bottom: 8, color: flash > 0.05 ? P.orange : P.dim, whiteSpace: "nowrap" }}>{LABELS[`${c},${r}`]}</span>
    </div>
  );
};

/** The orange tag cell: fills on TAG_AT with the board's name. */
const TagCell: React.FC<{ f: number }> = ({ f }) => {
  const { x, y } = cellXY(2, 2);
  const t = prog(f, TAG_AT, TAG_AT + 6, EO);
  if (f < TAG_AT) return null;
  return (
    <div style={{ position: "absolute", left: x + 6, top: y + 6, width: CELL.w - 12, height: CELL.h - 12, borderRadius: 12, background: P.orange, transform: `scale(${0.8 + 0.2 * t})`, boxShadow: `8px 8px 0 0 ${P.orangeDeep}` }}>
      <Icon name="layers" size={36} color={P.void} style={{ position: "absolute", left: 16, top: 14 }} />
      <div style={{ ...head(40, 84, 800), position: "absolute", left: 16, bottom: 12, color: P.void, lineHeight: "40px", whiteSpace: "nowrap" }}>
        COMPONENT
        <br />
        LIBRARIES
      </div>
    </div>
  );
};

export const Board: React.FC<{ f: number }> = ({ f }) => {
  const landOf = (c: number, r: number) => {
    const ls = FLYERS.filter((x) => x.cell[0] === c && x.cell[1] === r).map(LAND);
    return ls.length ? Math.max(...ls) : null;
  };
  if (f < 56) return null;
  return (
    <>
      {[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => (c === 2 && r === 2 ? null : <Cell key={`${c}${r}`} c={c} r={r} f={f} landAt={landOf(c, r)} />)))}
      <TagCell f={f} />
    </>
  );
};

/** The lifted components: arc from the phone to the cell, a small squash on landing. */
export const Flyers: React.FC<{ f: number }> = ({ f }) => (
  <>
    {FLYERS.map((fl, i) => {
      if (f < fl.launch) return null;
      const t = prog(f, fl.launch, LAND(fl), EO);
      const d = dst(fl);
      const sz = SIZE[fl.kind];
      const x = fl.src.x + (d.x - fl.src.x) * t;
      const y = fl.src.y + (d.y - fl.src.y) * t - Math.sin(Math.PI * t) * 70;
      const lift = Math.sin(Math.PI * Math.min(1, t));
      const s0 = fl.s0 ?? 1;
      const sc = s0 + (1 - s0) * Math.min(1, t * 1.6) + lift * 0.08 + (f >= LAND(fl) ? 0.07 * Math.max(0, 1 - (f - LAND(fl)) / 5) : 0);
      const rot = (1 - t) * (i % 2 ? -7 : 7) * lift;
      return (
        <div key={i} style={{ position: "absolute", left: x, top: y, width: sz.w, height: sz.h, transform: `scale(${sc}) rotate(${rot}deg)`, transformOrigin: "50% 50%", zIndex: 5 }}>
          <Piece kind={fl.kind} />
        </div>
      );
    })}
  </>
);

/** Frames where a component lands, for the cues. */
export const LANDINGS = FLYERS.map(LAND);
