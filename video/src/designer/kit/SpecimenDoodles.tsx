import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EIO, prog } from "../../lib/anim";
import { pop as popAt } from "../motion";
import { G, P } from "../tokens";
import { head, label, numeral, sans } from "../type";
import { BlockPhoto, IconArrowUpRight, IconPlay, PHOTO, Pill, Sticker, TiltCard } from "./Collage";
import {
  Asterisk, CurlyArrow, Crown, Eye, Heart, Lightning, Plus, RingBadge, ScribbleCircle, ScribbleUnderline, Smiley, Sparkle, Spiral, SpeechBubble,
  Squiggle, Star, Starburst, Tangle, Trace, Untangle, Wobble, traceHead, type Pt,
} from "./doodles";
import { Marquee } from "./Marquee";

const cx = (c: number) => G.x(c) + G.CW / 2;
const cy = (r: number) => G.y(r) + 70;

const Lbl: React.FC<{ x: number; y: number; children: React.ReactNode; align?: "left" | "center" }> = ({ x, y, children, align = "left" }) => (
  <div style={{ ...label(14, 600), position: "absolute", left: align === "center" ? x - 150 : x, top: y, width: align === "center" ? 300 : undefined, textAlign: align, color: P.dim, whiteSpace: "nowrap" }}>{children}</div>
);

const ROUTE: Pt[] = [[110, 800], [330, 800], [400, 730], [560, 730], [630, 800], [800, 800], [860, 740], [900, 740]];

/** Specimen sheet of the illustration kit: every doodle / sticker / strip / collage piece on a dark grid, animated over 90 frames. */
export const SpecimenDoodles: React.FC = () => {
  const f = useCurrentFrame();
  const d = (i: number) => prog(f, i * 2, i * 2 + 38);
  const p = (i: number) => popAt(f, i * 2 + 2);
  const head1 = traceHead(ROUTE, prog(f, 4, 80));
  const tp = prog(f, 4, 80);

  const row0 = [
    ["Sparkle", (i: number) => <Sparkle x={cx(0)} y={cy(0)} size={92} draw={d(i)} pop={p(i)} />],
    ["Sparkle twin", (i: number) => <Sparkle x={cx(1)} y={cy(0)} size={104} twin color={P.orange} draw={d(i)} pop={p(i)} />],
    ["Star", (i: number) => <Star x={cx(2)} y={cy(0)} size={96} draw={d(i)} pop={p(i)} />],
    ["Asterisk", (i: number) => <Asterisk x={cx(3)} y={cy(0)} size={92} draw={d(i)} pop={p(i)} />],
    ["Plus", (i: number) => <Plus x={cx(4)} y={cy(0)} size={72} draw={d(i)} pop={p(i)} />],
    ["Lightning", (i: number) => <Lightning x={cx(5)} y={cy(0)} size={92} draw={d(i)} pop={p(i)} />],
    ["Heart", (i: number) => <Heart x={cx(6)} y={cy(0)} size={92} draw={d(i)} pop={p(i)} />],
    ["Crown", (i: number) => <Crown x={cx(7)} y={cy(0)} size={100} draw={d(i)} pop={p(i)} />],
    ["Eye", (i: number) => <Eye x={cx(8)} y={cy(0)} size={118} draw={d(i)} pop={p(i)} />],
    ["Smiley", (i: number) => <Smiley x={cx(9)} y={cy(0)} size={100} draw={d(i)} pop={p(i)} />],
    ["Smiley wink", (i: number) => <Smiley x={cx(10)} y={cy(0)} size={100} wink rotate={8} draw={d(i)} pop={p(i)} />],
    ["Spiral", (i: number) => <Spiral x={cx(11)} y={cy(0)} size={96} draw={d(i)} pop={p(i)} />],
  ] as const;

  const arrows = ["curl", "loop", "swoop", "tick"] as const;
  const aY = G.y(1) + 74;

  return (
    <AbsoluteFill style={{ background: P.void }}>
      {/* grid */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {Array.from({ length: G.COLS + 1 }, (_, c) => (
          <line key={`v${c}`} x1={G.x(c)} x2={G.x(c)} y1={G.y(0)} y2={G.y(G.ROWS)} stroke={P.line} strokeWidth={1} />
        ))}
        {Array.from({ length: G.ROWS + 1 }, (_, r) => (
          <line key={`h${r}`} y1={G.y(r)} y2={G.y(r)} x1={G.x(0)} x2={G.x(G.COLS)} stroke={P.line} strokeWidth={1} />
        ))}
      </svg>
      <div style={{ ...label(15, 700), position: "absolute", left: G.x(0), top: 22, color: P.orange }}>Kit / illustration layer: doodles, stickers, marquee, collage</div>

      {/* collage pieces (no wobble) */}
      <BlockPhoto block="orange" src={PHOTO.duo} x={G.x(7) + 10} y={G.y(2) + 40} w={G.CW * 2 - 20} h={G.RH * 2 - 50} pop={popAt(f, 24)}>
        <Sticker x={20} y={50} rotate={-8} bg={P.yellow} fontSize={20} pop={popAt(f, 40)}>hi</Sticker>
      </BlockPhoto>
      <TiltCard src="img/d/f06-mods-cover.png" x={cx(10) + 5} y={G.y(2) + 160} w={380} h={228} rotate={-5} shadow={P.orange} tape pop={popAt(f, 30)} />
      <Sticker x={G.x(4) + 10} y={G.y(3) + 6} rotate={-3} fontSize={26} anchor="tl" pop={popAt(f, 34)}>One stroke weight</Sticker>
      <Sticker x={G.x(6) - 10} y={G.y(3) + 14} rotate={4} fontSize={22} bg={P.paper} color={P.void} anchor="tl" pop={popAt(f, 36)}>Systems</Sticker>
      <Pill x={G.x(4) + 10} y={G.y(3) + 70} height={62} fontSize={20} label="Let's talk" icon={<IconArrowUpRight size={26} />} bg={P.paper} anchor="tl" pop={popAt(f, 38)} />
      <Pill x={G.x(4) + 250} y={G.y(3) + 70} height={62} fontSize={20} label="Watch" icon={<IconPlay size={24} />} iconSide="left" bg={P.orange} anchor="tl" pop={popAt(f, 42)} />

      {/* doodles: ONE wobble filter for the whole layer */}
      <Wobble boil={4}>
        {row0.map(([name, render], i) => (
          <React.Fragment key={name}>{render(i)}</React.Fragment>
        ))}

        {arrows.map((k, i) => (
          <CurlyArrow key={k} kind={k} x={G.x(0) + 112 + i * 225} y={aY} size={150} draw={d(12 + i)} pop={p(12 + i)} color={i % 2 ? P.yellow : P.orange} />
        ))}
        <Squiggle x={cx(6) + 75} y={aY} length={230} draw={d(17)} pop={p(17)} />
        <div style={{ ...head(58), position: "absolute", left: G.x(8) + 20, top: aY - 40, color: P.paper, width: 260, textAlign: "center" }}>systems</div>
        <ScribbleUnderline x={G.x(9)} y={aY + 24} w={250} draw={d(18)} pop={p(18)} />
        <div style={{ ...numeral(70), position: "absolute", left: cx(11) - 70, top: aY - 40, width: 140, textAlign: "center", color: P.paper }}>58</div>
        <ScribbleCircle x={cx(11)} y={aY - 4} w={150} h={96} draw={d(19)} pop={p(19)} />

        <RingBadge x={G.x(1)} y={G.y(3) - 20} size={270} items={["Product design", "UX / UI", "Systems"]} pop={p(20)}>
          <Smiley x={0} y={0} size={62} wink />
        </RingBadge>
        <Starburst x={G.x(3)} y={G.y(3) - 20} size={250} pop={p(22)}>
          <div style={{ ...sans(800, 80, 96), fontSize: 40 }}>3 weeks</div>
          <div style={{ ...sans(800, 80, 96), fontSize: 40 }}>to 5 days</div>
        </Starburst>
        <SpeechBubble x={G.x(5) + 75} y={G.y(2) + 62} w={420} h={104} fontSize={30} plain pop={p(24)}>
          I make complex software feel simple.
        </SpeechBubble>

        <Trace points={ROUTE} progress={tp} pads={[0, 2, 4, 7]} ghost headDot />
        <Sparkle x={head1.x + 34} y={head1.y - 34} size={44} draw={tp > 0 ? 1 : 0} pop={tp > 0.02 && tp < 0.999 ? 1 : 0} />

        <Tangle x={G.x(6) + 90} y={G.y(4) + 75} size={110} draw={d(26)} pop={p(26)} />
      </Wobble>
      <Untangle x={G.x(9) + 40} y={G.y(4) + 75} size={130} length={560} progress={prog(f, 30, 88, EIO)} draw={d(27)} />

      {/* labels */}
      {row0.map(([name], i) => (
        <Lbl key={name} x={G.x(i) + 10} y={G.y(0) + 128}>{name}</Lbl>
      ))}
      {arrows.map((k, i) => (
        <Lbl key={k} x={G.x(0) + 14 + i * 225} y={G.y(1) + 128}>{"Arrow " + k}</Lbl>
      ))}
      <Lbl x={G.x(6) + 10} y={G.y(1) + 128}>Squiggle</Lbl>
      <Lbl x={G.x(8) + 10} y={G.y(1) + 128}>Scribble underline</Lbl>
      <Lbl x={G.x(10) + 10} y={G.y(1) + 128}>Scribble circle</Lbl>
      <Lbl x={G.x(0) + 10} y={G.y(2) + 8}>Ring badge</Lbl>
      <Lbl x={G.x(2) + 10} y={G.y(2) + 8}>Starburst</Lbl>
      <Lbl x={G.x(4) + 10} y={G.y(2) + 8}>Speech bubble</Lbl>
      <Lbl x={G.x(4) + 10} y={G.y(3) + 130}>Sticker, Pill</Lbl>
      <Lbl x={G.x(7) + 10} y={G.y(2) + 8}>Block photo</Lbl>
      <Lbl x={G.x(9) + 10} y={G.y(2) + 8}>Tilt card + tape</Lbl>
      <Lbl x={G.x(0) + 10} y={G.y(4) + 128}>Trace + pads + head</Lbl>
      <Lbl x={G.x(6) + 10} y={G.y(4) + 128}>Tangle</Lbl>
      <Lbl x={G.x(8) + 10} y={G.y(4) + 128}>Untangle (same polyline)</Lbl>
      <Lbl x={G.x(0) + 10} y={G.y(5) + 8}>Marquee + crossing strip</Lbl>

      {/* marquee, clipped to its row */}
      <div style={{ position: "absolute", left: G.x(0), top: G.y(5), width: G.CW * 12, height: G.RH, overflow: "hidden" }}>
        <Marquee x={G.CW * 6} y={G.RH / 2 + 4} height={64} angle={-3} speed={5} items={["Product design", "UX", "UI", "Design systems", "Research", "Prototyping"]} cross={{ items: ["Figma", "Framer", "Notion", "Lottie"], angle: 4 }} />
      </div>
    </AbsoluteFill>
  );
};
