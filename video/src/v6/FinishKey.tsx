// FinishKey: the one global grade and the persistent chrome, above every scene. Source: V1-DIRECTION.md 2.5.
//   grade   brightness(1.02) contrast(1.04) on the wrapper, a flat #2A1E12 4 percent soft-light overlay div,
//           grain from the eight tiles (FX.Grain) at 0.04. No letterbox, no scanlines, no vignette layer.
//   chrome  the chapter rail bottom right "0n / 08" (Label 24 px, Support at 70 percent), ticking on each cut;
//           in chapter 6 only, the atomic index rail on the left edge with the lit step in Hero and the unlit
//           steps in Support at full (Label 24 px, Support; the 70 percent belongs to the chapter rail only).
//   end     the chapter rail goes out with the lamp (5940 to 5944: nothing stays lit on the black); a 16 f fade of
//           the grain at the film's end.
// It wraps the scene (the filter needs the pixels under it): <FinishKey offset={from}><Scene /></FinishKey>.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../lib/anim";
import { Grain } from "../lib/FX";
import { C6_RAIL_STEPS, V6_LAMP_OFF, V6_SECTIONS, V6_TOTAL, sectionAt } from "./timeline";
import { K, supportRgba } from "./tokens";
import { label } from "./type";

export const RAIL_STEPS = ["ORGANISM", "MOLECULE", "ATOM", "TOKEN"] as const;

export type FinishKeyProps = {
  /** The chapter's global start, so a preview composition reads the right rail. */
  offset?: number;
  /** Keep the brightness/contrast filter (off to measure its cost; the overlay and grain stay). */
  grade?: boolean;
  /** The lit step of the index rail (0..3), by default read from C6_RAIL_STEPS on the global frame; -1 for none lit. */
  litStep?: number;
  /** Show the index rail (by default only inside chapter 6, from its first lit step). */
  indexRail?: boolean;
  children?: React.ReactNode;
};

const litStepAt = (g: number) => C6_RAIL_STEPS.filter((s) => g >= s).length - 1;

export const FinishKey: React.FC<FinishKeyProps> = ({ offset = 0, grade = true, litStep, indexRail, children }) => {
  const g = useCurrentFrame() + offset;
  const sec = sectionAt(g);
  const idx = V6_SECTIONS.findIndex((s) => s.id === sec.id) + 1;
  const endO = interpolate(g, [V6_TOTAL - 16, V6_TOTAL], [1, 0], clamp);
  const lampO = interpolate(g, [V6_LAMP_OFF, V6_LAMP_OFF + 4], [1, 0], clamp);
  const lit = litStep ?? litStepAt(g);
  const railOn = indexRail ?? (sec.id === "C6" && g >= C6_RAIL_STEPS[0] - 3);
  const railIn = interpolate(g, [C6_RAIL_STEPS[0] - 3, C6_RAIL_STEPS[0]], [0, 1], clamp);
  const rail: React.CSSProperties = { ...label(24), position: "absolute", whiteSpace: "nowrap" };

  return (
    <AbsoluteFill style={{ background: K.ground }}>
      <AbsoluteFill style={grade ? { filter: "brightness(1.02) contrast(1.04)" } : undefined}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ background: K.warm, opacity: 0.04, mixBlendMode: "soft-light", pointerEvents: "none" }} />
      <AbsoluteFill style={{ pointerEvents: "none", opacity: endO }}>
        <Grain opacity={0.04} />
        <div style={{ ...rail, right: 64, bottom: 56, color: supportRgba(0.7), opacity: lampO }}>
          {String(idx).padStart(2, "0")} / {String(V6_SECTIONS.length).padStart(2, "0")}
        </div>
        {railOn ? (
          <div style={{ position: "absolute", left: 64, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 28, opacity: indexRail ? 1 : railIn }}>
            {RAIL_STEPS.map((s, i) => (
              <div key={s} style={{ ...label(24), position: "relative", color: i === lit ? K.hero : K.support, whiteSpace: "nowrap" }}>
                {s}
              </div>
            ))}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
