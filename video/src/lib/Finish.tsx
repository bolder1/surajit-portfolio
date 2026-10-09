import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, mono } from "./theme";
import { clamp, EIO } from "./anim";
import { Grain, Scanlines, Vignette } from "./FX";
import { LETTERBOX_OPEN, SECTIONS, TOTAL } from "../timeline";

const BAR_H = 138; // 2.39:1 inside 1920×1080

/** Global finishing layer: letterbox, HUD chrome, grain, vignette. `offset` maps local→global frames. */
export const Finish: React.FC<{ offset?: number }> = ({ offset = 0 }) => {
  const g = useCurrentFrame() + offset;
  const open = interpolate(g, [LETTERBOX_OPEN, LETTERBOX_OPEN + 14], [0, 1], { ...clamp, easing: EIO });
  const intro = interpolate(g, [0, 18], [0, 1], { ...clamp, easing: EIO });
  const barH = BAR_H * intro * (1 - open);
  const sec = [...SECTIONS].reverse().find((s) => g >= s.from) ?? SECTIONS[0];
  const s = Math.floor(g / 30);
  const tc = `00:${String(s).padStart(2, "0")}:${String(g % 30).padStart(2, "0")}`;
  const hudO = interpolate(g, [10, 30], [0, 1], clamp);
  // the end card fades to black: take the whole finishing layer down with it
  const endO = interpolate(g, [TOTAL - 16, TOTAL - 4], [1, 0], clamp);
  const txt: React.CSSProperties = { position: "absolute", fontFamily: mono, fontSize: 15, letterSpacing: "0.22em", color: C.dim, textTransform: "uppercase" };
  const inset = 44;
  const top = Math.max(inset, barH + 26);
  const L = 30;
  const corner = (style: React.CSSProperties, d: string) => (
    <svg style={{ position: "absolute", ...style }} width={L} height={L}>
      <path d={d} stroke={C.dim} strokeWidth={1.5} fill="none" />
    </svg>
  );
  const granted = g >= LETTERBOX_OPEN;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: endO }}>
      <Scanlines opacity={0.035} />
      <Vignette strength={0.7} />
      <Grain opacity={0.11} />
      <AbsoluteFill style={{ opacity: hudO }}>
        {corner({ left: inset, top }, `M 0 ${L} L 0 0 L ${L} 0`)}
        {corner({ right: inset, top }, `M 0 0 L ${L} 0 L ${L} ${L}`)}
        {corner({ left: inset, bottom: top }, `M 0 0 L 0 ${L} L ${L} ${L}`)}
        {corner({ right: inset, bottom: top }, `M ${L} 0 L ${L} ${L} L 0 ${L}`)}
        <div style={{ ...txt, left: inset + 48, top: top + 6 }}>{sec.label}</div>
        <div style={{ ...txt, right: inset + 48, top: top + 6, color: granted ? C.acc : C.dim }}>
          {granted ? "SESSION ACTIVE ●" : g % 30 < 15 ? "AUTH PENDING ●" : "AUTH PENDING ○"}
        </div>
        <div style={{ ...txt, left: inset + 48, bottom: top + 6 }}>SURAJIT DUTTA · PORTFOLIO ’26</div>
        <div style={{ ...txt, right: inset + 48, bottom: top + 6 }}>{tc}</div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: barH, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: barH, background: "#000" }} />
    </AbsoluteFill>
  );
};
