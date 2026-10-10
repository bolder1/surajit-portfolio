import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../../lib/anim";
import { G, P } from "../tokens";
import { head, label } from "../type";
import { ICON_NAMES, Icon, type IconName } from "./icons";
import {
  AppointmentCard,
  Avatar,
  Badge,
  Btn,
  Calendar,
  CalendarCell,
  Card,
  Checkbox,
  Chip,
  Field,
  FoodCard,
  IconTile,
  Phone,
  Pop,
  ProductCard,
  Progress,
  Row,
  SearchBar,
  Seg,
  Stat,
  Stepper,
  Tabs,
  TicketCard,
  Toast,
  Toggle,
  Window,
  flex,
  windowInner,
} from "./ui";

// SPECIMEN SHEET for the icon + UI kit (composition KitUI, 90 f). Four pages that take over from each other:
//   0-23 icons (two sizes), 24-47 controls, 48-69 Window / Calendar / Stepper / Toast, 70-89 four Phones with the screen cards.
// Items pop in staggered; each page starts already mid-entrance so stills at 0 / 30 / 60 / 89 all show components entering.
const PAGES = [0, 24, 48, 70, 90];

const Cap: React.FC<{ text: string; x: number; y: number }> = ({ text, x, y }) => (
  <div style={{ ...label(18, 600), position: "absolute", left: x, top: y, color: P.dim, whiteSpace: "nowrap" }}>{text}</div>
);

const Grid: React.FC = () => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
    {Array.from({ length: 13 }, (_, c) => (
      <line key={`v${c}`} x1={G.x(c)} x2={G.x(c)} y1={G.y(0)} y2={G.y(6)} stroke={P.line} strokeWidth={1} />
    ))}
    {Array.from({ length: 7 }, (_, r) => (
      <line key={`h${r}`} y1={G.y(r)} y2={G.y(r)} x1={G.x(0)} x2={G.x(12)} stroke={P.line} strokeWidth={1} />
    ))}
  </svg>
);

/** staggered pop inside the current page; entrance starts 8 frames before the page does */
const usePop = (page: number, step = 0.5) => {
  let n = 0;
  return (extra: Place = {}) => ({ at: PAGES[page] - 8 + step * n++, ...extra });
};
type Place = { x?: number; y?: number };

// ---------------------------------------------------------------- page 0: icons
const IconsPage: React.FC = () => {
  const p = usePop(0, 0.22);
  const f = useCurrentFrame();
  const demo: IconName[] = ["cart", "heart", "bell", "calendar", "pulse", "ticket", "fork", "bolt"];
  return (
    <>
      {ICON_NAMES.map((name, i) => {
        const c = i % 12;
        const r = Math.floor(i / 12);
        return (
          <Pop key={name} {...p({ x: G.x(c), y: G.y(r) })} style={{ width: G.CW, height: G.RH }}>
            <div style={{ position: "absolute", left: 27, top: 4 }}>
              <Icon name={name} size={96} />
            </div>
            <div style={{ position: "absolute", left: 14, top: 110 }}>
              <Icon name={name} size={24} color={P.orange} />
            </div>
            <div style={{ position: "absolute", left: 46, top: 106 }}>
              <Icon name={name} size={32} color={P.yellow} />
            </div>
            <div style={{ ...label(17, 600), letterSpacing: "0.04em", position: "absolute", left: 14, top: 141, color: P.dim }}>{name}</div>
          </Pop>
        );
      })}
      <Cap text="IconTile  /  fill  /  draw-on  /  stroke ladder 16 20 24 32 48 64" x={G.x(0) + 4} y={G.y(4) + 6} />
      <div style={{ ...flex("row", { gap: 14 }), position: "absolute", left: G.x(0) + 4, top: G.y(4) + 40 }}>
        {demo.map((n, i) => (
          <Pop key={n} {...p()}>
            <IconTile name={n} size={72} tone={(["orange", "yellow", "cream", "dark"] as const)[i % 4]} />
          </Pop>
        ))}
      </div>
      <div style={{ ...flex("row", { gap: 22 }), position: "absolute", left: G.x(0) + 4, top: G.y(4) + 130 }}>
        {demo.map((n, i) => (
          <Icon key={n} name={n} size={64} color={P.paper} fill={i % 2 ? P.orange : P.yellow} />
        ))}
      </div>
      <div style={{ ...flex("row", { gap: 26 }), position: "absolute", left: G.x(7), top: G.y(4) + 40 }}>
        {[16, 20, 24, 32, 48, 64].map((s) => (
          <Icon key={s} name="bell" size={s} color={P.paper} />
        ))}
      </div>
      <div style={{ ...flex("row", { gap: 26 }), position: "absolute", left: G.x(7), top: G.y(4) + 112 }}>
        {[16, 20, 24, 32, 48, 64].map((s) => (
          <Icon key={s} name="search" size={s} color={P.orange} />
        ))}
      </div>
      <div style={{ ...flex("row", { gap: 26 }), position: "absolute", left: G.x(7), top: G.y(4) + 196 }}>
        {(["cart", "check", "star", "pulse", "arrow", "heart"] as IconName[]).map((n, i) => (
          <Icon key={n} name={n} size={64} color={P.yellow} draw={interpolate(f, [2 + i * 3, 20 + i * 3], [0, 1], clamp)} />
        ))}
      </div>
    </>
  );
};

// ---------------------------------------------------------------- page 1: controls
const ControlsPage: React.FC = () => {
  const p = usePop(1, 0.4);
  const f = useCurrentFrame();
  const t = (a: number, b: number) => interpolate(f - PAGES[1], [a, b], [0, 1], clamp);
  const A = 60;
  const B = 660;
  const C = 1140;
  const D = 1580;
  const top = 100;
  return (
    <>
      <Cap text="Btn  variants + pressed" x={A} y={top - 34} />
      <Pop {...p({ x: A, y: top })}><Btn label="Add to cart" icon="cart" /></Pop>
      <Pop {...p({ x: A + 250, y: top })}><Btn label="Details" variant="secondary" /></Pop>
      <Pop {...p({ x: A, y: top + 80 })}><Btn label="Save" variant="yellow" icon="bookmark" size="s" /></Pop>
      <Pop {...p({ x: A + 160, y: top + 80 })}><Btn label="Share" variant="cream" icon="send" size="s" /></Pop>
      <Pop {...p({ x: A + 324, y: top + 80 })}><Btn label="Next" variant="dark" icon="arrow" iconRight size="s" /></Pop>
      <Pop {...p({ x: A, y: top + 156 })}><Btn label="Pressed" pressed={0.5 + 0.5 * Math.sin(f / 5)} /></Pop>

      <Cap text="Field  idle / focused + typing + caret" x={A} y={top + 250} />
      <Pop {...p({ x: A, y: top + 284 })}><Field label="Email" value="surajit@mail.com" /></Pop>
      <Pop {...p({ x: A + 296, y: top + 284 })}><Field label="Search city" value="Pune, 411001" focused typed={t(4, 24)} icon="pin" w={248} /></Pop>
      <Pop {...p({ x: A, y: top + 400 })}><SearchBar placeholder="Search dishes" w={268} /></Pop>
      <Pop {...p({ x: A + 296, y: top + 400 })}><SearchBar value="ramen" focused typed={t(4, 24)} action="sliders" w={248} /></Pop>

      <Cap text="Seg  /  Tabs  /  Badge  /  Avatar" x={A} y={top + 490} />
      <Pop {...p({ x: A, y: top + 524 })}><Seg items={["Day", "Week", "Month"]} index={t(0, 24) * 2} w={330} /></Pop>
      <Pop {...p({ x: A + 360, y: top + 520 })}><Tabs items={["Menu", "Info"]} index={t(0, 24)} w={190} /></Pop>
      <div style={{ ...flex("row", { gap: 12 }), position: "absolute", left: A, top: top + 596 }}>
        <Pop {...p()}><Badge label="New" /></Pop>
        <Pop {...p()}><Badge label="Open" tone="yellow" /></Pop>
        <Pop {...p()}><Badge label="-20%" tone="cream" /></Pop>
        <Pop {...p()}><Badge label="Sold out" tone="dark" icon="x" /></Pop>
      </div>
      <div style={{ ...flex("row", { gap: 14 }), position: "absolute", left: A, top: top + 652 }}>
        <Pop {...p()}><Avatar initials="SD" tone="yellow" /></Pop>
        <Pop {...p()}><Avatar initials="AR" tone="orange" /></Pop>
        <Pop {...p()}><Avatar initials="MK" tone="cream" /></Pop>
        <Pop {...p()}><Avatar face={0} tone="orange" size={64} /></Pop>
        <Pop {...p()}><Avatar face={1} tone="yellow" size={64} /></Pop>
        <Pop {...p()}><Avatar face={2} tone="cream" size={64} /></Pop>
      </div>

      <Cap text="Toggle  /  Checkbox  /  Chip" x={B} y={top - 34} />
      <Pop {...p({ x: B, y: top })}><Toggle on={false} /></Pop>
      <Pop {...p({ x: B + 100, y: top })}><Toggle on={t(4, 16)} /></Pop>
      <Pop {...p({ x: B + 200, y: top })}><Toggle on /></Pop>
      <Pop {...p({ x: B, y: top + 62 })}><Checkbox checked={t(4, 20)} label="Remember me" /></Pop>
      <Pop {...p({ x: B + 250, y: top + 62 })}><Checkbox checked={false} label="Off" /></Pop>
      <Pop {...p({ x: B, y: top + 124 })}><Chip label="Over-ear" active /></Pop>
      <Pop {...p({ x: B + 146, y: top + 124 })}><Chip label="In-ear" /></Pop>
      <Pop {...p({ x: B + 262, y: top + 124 })}><Chip label="Sale" icon="tag" active tone="yellow" /></Pop>
      <Pop {...p({ x: B, y: top + 184 })}><Chip label="Vegan" icon="check" active tone="cream" /></Pop>

      <Cap text="Row  /  Progress" x={B} y={top + 262} />
      <Pop {...p({ x: B, y: top + 296 })}><Row icon="mail" title="Messages" sub="3 unread" w={380} /></Pop>
      <Pop {...p({ x: B, y: top + 388 })}><Row icon="calendar" title="Next visit" sub="Tue, 14 Oct" tone="yellow" right="09:30" w={380} /></Pop>
      <Pop {...p({ x: B, y: top + 480 })}><Row icon="sliders" title="Preferences" tone="cream" w={380} right={<Toggle on={t(8, 20)} w={64} />} /></Pop>
      <Pop {...p({ x: B, y: top + 586 })}><Progress value={t(2, 24) * 0.7} label="Design system" w={380} /></Pop>
      <Pop {...p({ x: B, y: top + 654 })}><Progress value={t(4, 24) * 0.35} w={380} /></Pop>

      <Cap text="Stat  /  Card" x={C} y={top - 34} />
      <Pop {...p({ x: C, y: top })}><Stat value="58" label="Projects" delta="+12" w={200} /></Pop>
      <Pop {...p({ x: C + 220, y: top })}><Stat value="4" label="Years" tone="orange" w={180} /></Pop>
      <Pop {...p({ x: C, y: top + 200 })}>
        <Card w={200} h={150} tone="yellow"><IconTile name="layers" tone="dark" /><span style={{ ...head(34), color: P.void, marginTop: "auto" }}>Tokens</span></Card>
      </Pop>
      <Pop {...p({ x: C + 220, y: top + 200 })}>
        <Card w={180} h={150} tone="cream"><IconTile name="grid" tone="orange" /><span style={{ ...head(34), color: P.void, marginTop: "auto" }}>Grid</span></Card>
      </Pop>
      <Pop {...p({ x: C, y: top + 400 })}>
        <Card w={400} tone="dark">
          <span style={{ ...head(44), color: P.paper }}>Systems then surfaces</span>
          <div style={flex("row", { gap: 10 })}><Chip label="Research" active /><Chip label="Ship" /><Chip label="Repeat" /></div>
        </Card>
      </Pop>

      <Cap text="Toast" x={D} y={top - 34} />
      <Pop {...p({ x: D, y: top })}><Toast title="Added to cart" sub="Studio Headphones" w={280} /></Pop>
      <Pop {...p({ x: D, y: top + 116 })}><Toast title="Table booked" icon="calendar" tone="yellow" w={280} /></Pop>
      <Pop {...p({ x: D, y: top + 232 })}><Toast title="Saved" sub="3 changes" icon="bookmark" tone="orange" w={280} /></Pop>
    </>
  );
};

// ---------------------------------------------------------------- page 2: window + calendar + stepper
const WindowPage: React.FC = () => {
  const p = usePop(2, 0.35);
  const f = useCurrentFrame() - PAGES[2];
  const inn = windowInner(840, 540);
  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  return (
    <>
      <Cap text="Window  browser frame with an e-commerce page" x={G.x(0)} y={G.y(0) - 36} />
      <Pop {...p({ x: G.x(0), y: G.y(0) + 10 })}>
        <Window w={840} h={540} url="maison.co/audio" shadow={P.orangeDeep}>
          <div style={{ ...flex("row", { justifyContent: "space-between" }), padding: "14px 20px", height: 80, width: inn.w, boxSizing: "border-box" }}>
            <span style={{ ...head(40), color: P.paper }}>maison<span style={{ color: P.orange }}>.</span></span>
            <Tabs items={["Audio", "Home", "Gifts"]} index={0} w={300} />
            <div style={{ position: "relative" }}>
              <Icon name="cart" size={36} />
              <div style={{ position: "absolute", right: -12, top: -14 }}><Badge label="2" /></div>
            </div>
          </div>
          <div style={{ ...flex("row", { gap: 20 }), padding: "0 14px", alignItems: "flex-start" }}>
            <ProductCard w={256} shadow={P.orangeDeep} />
            <ProductCard w={256} pressed={0.5 + 0.5 * Math.sin(f / 4)} />
            <FoodCard w={256} />
          </div>
        </Window>
      </Pop>

      <Cap text="Calendar" x={960} y={G.y(0) - 36} />
      <Pop {...p({ x: 960, y: G.y(0) + 10 })}><Calendar marks={{ 14: "orange", 15: "yellow", 20: "cream" }} today={10} /></Pop>

      <Cap text="CalendarCell  (15 workday cells)" x={1340} y={G.y(0) - 36} />
      {Array.from({ length: 15 }, (_, i) => (
        <Pop key={i} {...p({ x: 1340 + (i % 5) * 104, y: G.y(0) + 10 + Math.floor(i / 5) * 90 })}>
          <CalendarCell w={98} h={84} day={i + 1} caption={days[i % 5]} on={interpolate(f, [2 + i * 0.6, 10 + i * 0.6], [0, 1], clamp) * (i % 3 === 0 ? 1 : 0)} mark={interpolate(f, [8 + i * 0.6, 16 + i * 0.6], [0, 1], clamp) * (i % 3 === 0 ? 1 : 0)} />
        </Pop>
      ))}

      <Cap text="Stepper  (index animates 0 to 3)" x={1340} y={G.y(0) + 310} />
      <Pop {...p({ x: 1340, y: G.y(0) + 346 })}><Stepper w={500} index={interpolate(f, [0, 20], [0, 3], clamp)} /></Pop>

      <Cap text="Toast  /  Progress" x={1340} y={G.y(0) + 470} />
      <Pop {...p({ x: 1340, y: G.y(0) + 506 })}><Toast title="Order placed" sub="Arrives in 25 min" icon="bag" w={440} /></Pop>
      <Pop {...p({ x: 1340, y: G.y(0) + 610 })}><Progress value={interpolate(f, [0, 20], [0, 0.8], clamp)} label="Uploading mockups" w={440} /></Pop>

      <Cap text="Row" x={G.x(0)} y={G.y(0) + 676} />
      <Pop {...p({ x: G.x(0), y: G.y(0) + 712 })}><Row icon="home" title="Home" sub="Pune, MH" w={270} /></Pop>
      <Pop {...p({ x: G.x(0) + 285, y: G.y(0) + 712 })}><Row icon="users" title="Team" sub="12 members" tone="yellow" w={270} /></Pop>
      <Pop {...p({ x: G.x(0) + 570, y: G.y(0) + 712 })}><Row icon="chart" title="Reports" sub="Weekly" tone="cream" w={270} /></Pop>
    </>
  );
};

// ---------------------------------------------------------------- page 3: phones
const PhonesPage: React.FC = () => {
  const p = usePop(3, 0.8);
  const f = useCurrentFrame() - PAGES[3];
  const xs = [150, 150 + 332 + 76, 150 + 2 * (332 + 76), 150 + 3 * (332 + 76)];
  const y = 200;
  return (
    <>
      <Cap text="Phone 300 x 620 screen  +  ProductCard / FoodCard / AppointmentCard / TicketCard" x={xs[0]} y={y - 44} />
      <Pop {...p({ x: xs[0], y })}>
        <Phone nav={0}>
          <SearchBar value="headphones" placeholder="Search" typed={1} w={268} />
          <ProductCard pressed={0.5 + 0.5 * Math.sin(f / 4)} />
        </Phone>
      </Pop>
      <Pop {...p({ x: xs[1], y })}>
        <Phone nav={1}>
          <Tabs items={["Nearby", "Top rated"]} index={interpolate(f, [4, 20], [0, 1], clamp)} w={268} />
          <FoodCard />
        </Phone>
      </Pop>
      <Pop {...p({ x: xs[2], y })}>
        <Phone nav={2}>
          <AppointmentCard slot={f > 14 ? 1 : 0} />
          <Row icon="pulse" title="Blood test" sub="Thu, 9:00" tone="yellow" />
        </Phone>
      </Pop>
      <Pop {...p({ x: xs[3], y })}>
        <Phone nav={3}>
          <TicketCard />
        </Phone>
      </Pop>
    </>
  );
};

export const SpecimenUI: React.FC = () => {
  const f = useCurrentFrame();
  const page = PAGES.findIndex((s, i) => f >= s && f < PAGES[i + 1]);
  return (
    <AbsoluteFill style={{ background: P.void }}>
      <Grid />
      {page === 0 && <IconsPage />}
      {page === 1 && <ControlsPage />}
      {page === 2 && <WindowPage />}
      {page === 3 && <PhonesPage />}
    </AbsoluteFill>
  );
};
