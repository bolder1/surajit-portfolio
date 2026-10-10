// The mode panel: a slab filled with the system's surface token and one line of
// sample text in its text token, each read by mode. `mode` follows the Mode axis
// as the readout prints it: "light" (0) is onLight, "dark" (1) is onDark, and a
// number between tweens fill and text together with no fade (the Mode flip). The
// children (a ButtonAtom, inline) sit centred under the sample word. Note the
// order differs from the kit's slab mode, where 1 is light; this panel converts.
import type { CSSProperties, ReactNode } from "react";
import { ALERT, TOKENS } from "./artefact";
import { artefactFamily } from "./ButtonAtom";
import { Slab } from "./Slab";
import type { Elevation } from "./Slab";
import { mixColor, useIllus } from "./theme";

export type PanelMode = "light" | "dark" | number;

/** The Mode axis as 0..1: 0 onLight, 1 onDark. */
export const panelT = (m: PanelMode) => (m === "light" ? 0 : m === "dark" ? 1 : Math.min(1, Math.max(0, m)));

/** The surface and text colours at a point on the Mode axis. */
export const panelColors = (m: PanelMode) => {
  const t = panelT(m);
  return { surface: mixColor(TOKENS.surfaceIntense.onLight, TOKENS.surfaceIntense.onDark, t), text: mixColor(TOKENS.textNormal.onLight, TOKENS.textNormal.onDark, t) };
};

export type SurfacePanelProps = {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  mode?: PanelMode;
  radius?: number;
  sampleText?: boolean;
  sampleSize?: number;
  /** Space between the sample word and the children. */
  gap?: number;
  elevation?: Elevation;
  shadow?: number;
  opacity?: number;
  style?: CSSProperties;
  children?: ReactNode;
};

export const SurfacePanel = ({
  x = 0,
  y = 0,
  w = 600,
  h = 360,
  mode = "light",
  radius = 8,
  sampleText = true,
  sampleSize = 28,
  gap = 24,
  elevation = "low",
  shadow = 1,
  opacity = 1,
  style,
  children,
}: SurfacePanelProps) => {
  const th = useIllus();
  const t = panelT(mode);
  const c = panelColors(t);
  return (
    <Slab x={x} y={y} w={w} h={h} radius={radius} elevation={elevation} shadow={shadow} mode={1 - t} opacity={opacity} style={{ background: c.surface, ...style }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap }}>
        {sampleText ? (
          <div style={{ fontFamily: artefactFamily(th), fontSize: sampleSize, fontWeight: 500, lineHeight: 1.2, letterSpacing: 0, color: c.text, whiteSpace: "nowrap" }}>
            {ALERT.title}
          </div>
        ) : null}
        {children ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div> : null}
      </div>
    </Slab>
  );
};
