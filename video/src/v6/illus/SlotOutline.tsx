// The Slot: a dashed 1 px outline around a component's content box, drawn on along
// its perimeter, with each bound gap shown as two hairline end ticks and its value
// typed at the tick. After the style of the file's Slot utility, recoloured to the
// theme's support role; nothing of the file is placed. A dash pattern restarts at
// every subpath, so the outline is one short path per dash, each drawn with
// evolvePath as the head reaches it: the whole reads as one line drawing on.
import { evolvePath } from "@remotion/paths";
import { useMemo } from "react";
import { alpha, useIllus } from "./theme";
import { archivo } from "../type";

export type SlotBox = { x: number; y: number; w: number; h: number };
/** A bound gap: along x (a horizontal spacing starting at `at`) or along y, `px` wide. */
export type SlotGap = { axis: "x" | "y"; at: number; px: number };

export type SlotOutlineProps = {
  box: SlotBox;
  gaps?: SlotGap[];
  dash?: number;
  /** 0..1, the outline drawing on clockwise from the top-left corner; ticks follow in the last fifth. */
  draw?: number;
  ticks?: boolean;
  /** Tick length and its distance from the box, so ticks clear a component's padding. */
  tickLength?: number;
  tickOffset?: number;
  labelSize?: number;
  color?: string;
  opacity?: number;
};

type Pt = { x: number; y: number };

/** The point at distance s along the box's perimeter, clockwise from the top-left corner. */
const along = (b: SlotBox, s: number): Pt => {
  const { x, y, w, h } = b;
  if (s <= w) return { x: x + s, y };
  if (s <= w + h) return { x: x + w, y: y + (s - w) };
  if (s <= 2 * w + h) return { x: x + w - (s - w - h), y: y + h };
  return { x, y: y + h - (s - 2 * w - h) };
};

/** One dash as a path, split at any corner it crosses. */
const dashPath = (b: SlotBox, a: number, c: number): string => {
  const corners = [b.w, b.w + b.h, 2 * b.w + b.h];
  const pts: Pt[] = [along(b, a)];
  for (const k of corners) if (k > a && k < c) pts.push(along(b, k));
  pts.push(along(b, c));
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const SlotOutline = ({
  box,
  gaps = [],
  dash = 8,
  draw = 1,
  ticks = true,
  tickLength = 16,
  tickOffset = 24,
  labelSize = 24,
  color,
  opacity = 1,
}: SlotOutlineProps) => {
  const th = useIllus();
  const line = color ?? alpha(th.stroke, 1);
  const d = clamp01(draw);
  const perimeter = 2 * (box.w + box.h);

  const dashes = useMemo(() => {
    const out: { a: number; c: number; d: string }[] = [];
    for (let s = 0; s < perimeter; s += 2 * dash) {
      const c = Math.min(perimeter, s + dash);
      out.push({ a: s / perimeter, c: c / perimeter, d: dashPath(box, s, c) });
    }
    return out;
  }, [box, dash, perimeter]);

  const tickOn = clamp01((d - 0.8) / 0.2);
  const font = `"${th.font.family}", "${archivo}"`;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity, pointerEvents: "none" }}>
      <svg width={1} height={1} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", display: "block" }}>
        {dashes.map((k, i) => {
          const local = clamp01((d - k.a) / (k.c - k.a));
          if (local <= 0) return null;
          const e = evolvePath(local, k.d);
          return <path key={i} d={k.d} fill="none" stroke={line} strokeWidth={1} strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />;
        })}
        {ticks
          ? gaps.map((g, i) => {
              if (g.axis === "x") {
                const y1 = box.y - tickOffset - tickLength;
                const y2 = box.y - tickOffset;
                return (
                  <g key={i} opacity={tickOn}>
                    <path d={`M${g.at} ${y1} V${y2} M${g.at + g.px} ${y1} V${y2}`} fill="none" stroke={line} strokeWidth={1} />
                  </g>
                );
              }
              const x1 = box.x - tickOffset - tickLength;
              const x2 = box.x - tickOffset;
              return (
                <g key={i} opacity={tickOn}>
                  <path d={`M${x1} ${g.at} H${x2} M${x1} ${g.at + g.px} H${x2}`} fill="none" stroke={line} strokeWidth={1} />
                </g>
              );
            })
          : null}
      </svg>
      {ticks
        ? gaps.map((g, i) => {
            const label = {
              position: "absolute" as const,
              fontFamily: font,
              fontVariationSettings: th.font.settings,
              fontSize: labelSize,
              lineHeight: 1,
              letterSpacing: "0.12em",
              color: line,
              whiteSpace: "nowrap" as const,
              opacity: tickOn,
            };
            if (g.axis === "x") {
              return (
                <div key={i} style={{ ...label, left: g.at + g.px / 2, top: box.y - tickOffset - tickLength - 8 - labelSize, transform: "translateX(-50%)" }}>
                  {g.px}
                </div>
              );
            }
            return (
              <div key={i} style={{ ...label, left: box.x - tickOffset - tickLength - 12, top: g.at + g.px / 2, transform: "translate(-100%, -50%)" }}>
                {g.px}
              </div>
            );
          })
        : null}
    </div>
  );
};
