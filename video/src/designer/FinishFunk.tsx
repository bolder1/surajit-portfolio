import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, EO } from "../lib/anim";
import { Grain, Vignette } from "../lib/FX";
import { D_SECTIONS, D_TOTAL } from "./timeline";
import { G, P } from "./tokens";
import { label } from "./type";

/** Global layer: the visible hairline grid (12 x 6) with small meta labels in its first and last rows, grain, a soft vignette. */
export const FinishFunk: React.FC<{ offset?: number }> = ({ offset = 0 }) => {
  const g = useCurrentFrame() + offset;
  const sec = [...D_SECTIONS].reverse().find((s) => g >= s.from) ?? D_SECTIONS[0];
  const idx = D_SECTIONS.findIndex((s) => s.id === sec.id) + 1;
  const grow = interpolate(g, [0, 26], [0, 1], { ...clamp, easing: EO });
  const endO = interpolate(g, [D_TOTAL - 16, D_TOTAL - 4], [1, 0], clamp);
  const lab: React.CSSProperties = { ...label(17, 560), position: "absolute", color: P.dim, whiteSpace: "nowrap" };
  const open = g >= 1380;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: endO }}>
      <Vignette strength={0.5} />
      <Grain opacity={0.085} />
      <svg width={G.W} height={G.H} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: G.COLS + 1 }, (_, c) => (
          <line key={`v${c}`} x1={G.x(c)} x2={G.x(c)} y1={G.y(0)} y2={G.y(0) + (G.y(G.ROWS) - G.y(0)) * grow} stroke={P.line} strokeWidth={1} />
        ))}
        {Array.from({ length: G.ROWS + 1 }, (_, r) => (
          <line key={`h${r}`} y1={G.y(r)} y2={G.y(r)} x1={G.x(0)} x2={G.x(0) + (G.x(G.COLS) - G.x(0)) * grow} stroke={P.line} strokeWidth={1} />
        ))}
      </svg>
      <div style={{ ...lab, left: G.x(0) + 18, top: G.y(0) + 16 }}>Surajit Dutta</div>
      <div style={{ ...lab, left: G.x(4), width: G.CW * 4, textAlign: "center", top: G.y(0) + 16 }}>{sec.label}</div>
      <div style={{ ...lab, right: G.W - G.x(12) + 18, top: G.y(0) + 16, color: open ? P.orange : P.dim }}>{open ? "Open to work" : "Portfolio 2026"}</div>
      <div style={{ ...lab, left: G.x(0) + 18, bottom: G.H - G.y(6) + 16 }}>Product designer</div>
      <div style={{ ...lab, right: G.W - G.x(12) + 18, bottom: G.H - G.y(6) + 16 }}>
        {String(idx).padStart(2, "0")} / {String(D_SECTIONS.length).padStart(2, "0")}
      </div>
    </AbsoluteFill>
  );
};
