// Slanted ticker strips (the podcast reference): text in Bricolage 800 uppercase, drawn separators, seamless loop from the frame number.
import React, { useLayoutEffect, useRef, useState } from "react";
import { continueRender, delayRender, useCurrentFrame } from "remotion";
import { P } from "../tokens";
import { sans } from "../type";
import { SepMark } from "./doodles";

export interface StripOptions {
  /** words / phrases, separated by a drawn mark */
  items: string[];
  /** px per frame (default 6) */
  speed?: number;
  /** degrees, negative = rising to the right (default -4) */
  angle?: number;
  /** strip thickness in px (default 96) */
  height?: number;
  bg?: string;
  /** text colour */
  color?: string;
  /** default height * 0.5 */
  fontSize?: number;
  /** which way the text travels (default "left") */
  direction?: "left" | "right";
  /** drawn separator between items */
  sep?: "dot" | "star" | "sparkle" | "asterisk";
  sepColor?: string;
  /** extra start phase in px */
  offset?: number;
  /** hard offset shadow colour under the strip (default none) */
  shadow?: string | false;
}

export interface MarqueeProps extends StripOptions {
  /** centre of the strip in px (default frame centre 960 x 540) */
  x?: number;
  y?: number;
  /** override the clock (e.g. to freeze or restart); default useCurrentFrame() */
  frame?: number;
  /** a second strip crossing the first (drawn on top); only the fields you give differ from the first strip */
  cross?: Partial<StripOptions> & { items: string[] };
  /** strip length (default 2700, enough to bleed the 1920 frame at any angle up to ~25 deg) */
  length?: number;
}

const FONT = (fs: number): React.CSSProperties => ({ ...sans(800, 88, 60), fontSize: fs, letterSpacing: "0.02em", textTransform: "uppercase", whiteSpace: "nowrap" });

/** One strip: measures one group of items once (after the font is loaded), then loops it seamlessly by frame. */
const Strip: React.FC<StripOptions & { x: number; y: number; frame: number; length: number }> = ({
  items,
  speed = 6,
  angle = -4,
  height = 96,
  bg = P.orange,
  color = P.void,
  fontSize,
  direction = "left",
  sep = "star",
  sepColor,
  offset = 0,
  shadow = false,
  x,
  y,
  frame,
  length,
}) => {
  const fs = fontSize ?? Math.round(height * 0.5);
  const probe = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [handle] = useState(() => delayRender("Marquee measure"));
  const itemsKey = items.join("|") + fs;
  useLayoutEffect(() => {
    let alive = true;
    const measure = () => {
      if (alive && probe.current) setW(Math.ceil(probe.current.getBoundingClientRect().width));
    };
    measure();
    const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts;
    (fonts ? fonts.ready : Promise.resolve()).then(() => {
      measure();
      continueRender(handle);
    });
    return () => {
      alive = false;
    };
  }, [itemsKey, handle]);

  const sc = sepColor ?? (bg === P.orange ? P.paper : P.orange);
  const group = (key: React.Key, fixedW?: number) => (
    <div key={key} style={{ float: "left", height, lineHeight: `${height}px`, whiteSpace: "nowrap", width: fixedW, color, ...FONT(fs) }}>
      {items.map((it, i) => (
        <span key={i}>
          {it}
          <SepMark kind={sep} size={fs * 0.62} color={sc} style={{ margin: `0 ${Math.round(fs * 0.7)}px`, position: "relative", top: -1 }} />
        </span>
      ))}
    </div>
  );
  const period = w || 1;
  const shift = (((frame * speed + offset) % period) + period) % period;
  const copies = w ? Math.ceil((length + period) / period) + 1 : 1;
  const tx = direction === "left" ? -shift : shift - period;
  const rot: React.CSSProperties = { position: "absolute", left: x - length / 2, top: y - height / 2, width: length, height, transform: `rotate(${angle}deg)`, transformOrigin: "50% 50%" };
  return (
    <>
      <div ref={probe} style={{ position: "absolute", left: 0, top: -9999, visibility: "hidden", lineHeight: `${height}px`, whiteSpace: "nowrap", ...FONT(fs) }}>
        {items.map((it, i) => (
          <span key={i}>
            {it}
            <SepMark kind={sep} size={fs * 0.62} style={{ margin: `0 ${Math.round(fs * 0.7)}px` }} />
          </span>
        ))}
      </div>
      {shadow ? <div style={{ ...rot, background: shadow, transform: `translate(0px, 10px) rotate(${angle}deg)` }} /> : null}
      <div style={{ ...rot, background: bg, overflow: "hidden" }}>
        <div data-period={w} style={{ position: "absolute", left: 0, top: 0, height, width: period * copies, transform: `translateX(${tx}px)` }}>
          {w ? Array.from({ length: copies }, (_, i) => group(i, period)) : group("probe")}
        </div>
      </div>
    </>
  );
};

/** Slanted ticker strip(s). Add `cross` for a second strip at another angle. Wrap in a clipped box to confine it. */
export const Marquee: React.FC<MarqueeProps> = ({ x = 960, y = 540, frame, length = 2700, cross, ...strip }) => {
  const cur = useCurrentFrame();
  const f = frame ?? cur;
  return (
    <>
      <Strip {...strip} x={x} y={y} frame={f} length={length} />
      {cross ? (
        <Strip speed={strip.speed} height={strip.height} fontSize={strip.fontSize} sep={strip.sep} shadow={strip.shadow} {...cross} bg={cross.bg ?? P.paper} color={cross.color ?? P.void} sepColor={cross.sepColor ?? P.orange} angle={cross.angle ?? 5} direction={cross.direction ?? "right"} x={x} y={y} frame={f} length={length} />
      ) : null}
    </>
  );
};
