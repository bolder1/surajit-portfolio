// Shared by D4, D5 and D6 (all three are mine): the left text stack, the carried-over ticker rail, small motion helpers.
import React, { useEffect, useState } from "react";
import { continueRender, delayRender, interpolate, useCurrentFrame } from "remotion";
import { clamp, EO, prog } from "../../../lib/anim";
import { flex, Icon, type IconName } from "../../kit/ui";
import { Marquee } from "../../kit/Marquee";
import { P } from "../../tokens";
import { head, label } from "../../type";

/** 0 -> 1 -> 0 triangle: a press / bump that starts at frame `a`. */
export const tri = (f: number, a: number, up = 3, down = 3) => interpolate(f, [a, a + up, a + up + down], [0, 1, 0], clamp);

/** Hard slam of a big box: hidden before `at`, then scale 1.1 -> 1 (expo out). */
export const slam = (f: number, at: number, dur = 7) => {
  const t = prog(f, at, at + dur, EO);
  return { visible: f >= at, t, scale: 1 + (1 - t) * 0.1, lift: (1 - t) * 36 };
};

/** Text that rises out of a mask (a clipped box); keeps its layout box. */
export const Reveal: React.FC<{ at: number; dur?: number; from?: "up" | "left"; style?: React.CSSProperties; children: React.ReactNode }> = ({ at, dur = 8, from = "up", style, children }) => {
  const f = useCurrentFrame();
  const t = prog(f, at, at + dur, EO);
  if (f < at) return <div style={{ ...style, visibility: "hidden" }}>{children}</div>;
  return (
    <div style={{ ...style, overflow: "hidden" }}>
      <div style={{ transform: from === "up" ? `translateY(${(1 - t) * 105}%)` : `translateX(${(1 - t) * -105}%)` }}>{children}</div>
    </div>
  );
};

/** Holds the render until the Bricolage variable font is really loaded (the Marquee measures its text once, on mount). */
export const FontGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("font gate"));
  useEffect(() => {
    let alive = true;
    const done = () => {
      if (alive) setReady(true);
      continueRender(handle);
    };
    const fonts = (document as Document & { fonts?: { load: (spec: string) => Promise<unknown> } }).fonts;
    if (fonts && fonts.load) Promise.all([fonts.load("800 40px 'Bricolage Grotesque'"), fonts.load("500 24px 'Bricolage Grotesque'")]).then(done, done);
    else done();
    return () => {
      alive = false;
    };
  }, [handle]);
  return ready ? <>{children}</> : null;
};

/** The ticker rail that carries across the D4 -> D5 cut (same y, speed, items and absolute-frame clock). */
export const RAIL_ITEMS = ["Websites", "Apps", "E-commerce", "Mobile", "Dashboards", "Component libraries"];
export const RAIL_Y = 920;
export const Rail: React.FC<{ frame: number; wipeIn?: boolean }> = ({ frame, wipeIn }) => {
  const f = useCurrentFrame();
  const t = wipeIn ? prog(f, -5, 7, EO) : 1;
  // the Marquee measures its text in an absolutely positioned probe, which shrink-wraps to its containing block:
  // give it a very wide box (coordinates stay frame px) and clip to the frame on the outside.
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden", clipPath: `inset(0px ${(1 - t) * 100}% 0px 0px)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 12000, height: 1080 }}>
        <FontGate>
          <Marquee x={960} y={RAIL_Y} height={80} angle={0} speed={5} fontSize={40} items={RAIL_ITEMS} sep="star" frame={frame} />
        </FontGate>
      </div>
    </div>
  );
};

/** Left column of D4 / D5: huge year, company on an orange block, one small label. Same boxes in both scenes. */
export const LEFT = { x: 60, yearTop: 96, blockY: 380, blockW: 720, blockH: 160, labelY: 570 };
export const LeftStack: React.FC<{ year: string; name: string; text: string; icon: IconName; blockFrom?: number; nameAt: number; yearAt?: number; labelAt: number; nameSize?: number }> = ({
  year, name, text, icon, blockFrom, nameAt, yearAt = 0, labelAt, nameSize = 112,
}) => {
  const f = useCurrentFrame();
  const bt = blockFrom === undefined ? 1 : prog(f, blockFrom, blockFrom + 7, EO);
  return (
    <>
      <Reveal at={yearAt} dur={9} style={{ position: "absolute", left: LEFT.x - 6, top: LEFT.yearTop, height: 262, width: 780 }}>
        <div style={{ ...head(300, 84, 800), color: P.paper, marginTop: -8 }}>{year}</div>
      </Reveal>
      {bt > 0 && (
        <div style={{ position: "absolute", left: LEFT.x, top: LEFT.blockY, width: LEFT.blockW, height: LEFT.blockH, background: P.orange, transform: `scaleX(${bt})`, transformOrigin: "0% 50%" }}>
          <Reveal at={nameAt} dur={8} style={{ position: "absolute", left: 28, top: 0, width: LEFT.blockW - 40, height: LEFT.blockH }}>
            <div style={{ ...head(nameSize, 84, 800), color: P.void, lineHeight: `${LEFT.blockH}px`, whiteSpace: "nowrap" }}>{name}</div>
          </Reveal>
        </div>
      )}
      <Reveal at={labelAt} dur={8} style={{ position: "absolute", left: LEFT.x, top: LEFT.labelY, width: 720, height: 44 }}>
        <div style={flex("row", { gap: 14, height: 44 })}>
          <Icon name={icon} size={32} color={P.orange} />
          <span style={{ ...label(26, 640), color: P.paper, whiteSpace: "nowrap" }}>{text}</span>
        </div>
      </Reveal>
    </>
  );
};
