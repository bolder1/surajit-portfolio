// The redrawn Primary Md button. Fill, text, border, radius and padding come from
// BUTTON in artefact.ts; the label is the string the file has (BUTTON_LABEL). `theme`
// is "blue", "orange" or a number 0..1 so the Theme flip can tween fill and border
// between the two themes while the text stays. `fillAlpha` is the Transparent Back:
// the fill fades and the label and the 1 px border stay on an empty box. `inner` is
// the Alert's own button: text and border in the status colours, no fill. A scene
// scales the whole drawing with `scale`; the 1 px border scales with it, which is
// correct, because the viewer is looking at the component closer.
import type { CSSProperties, ReactNode } from "react";
import { ARTEFACT_FONT, BUTTON, BUTTON_LABEL, BUTTON_ORANGE, STATUS, STATUS_LABELS } from "./artefact";
import type { StatusName, StatusTint } from "./artefact";
import { elevationAt } from "./Slab";
import type { Elevation } from "./Slab";
import { alpha, mixColor, parseColor, useIllus } from "./theme";
import type { IllusTheme } from "./theme";
import { archivo } from "../type";

export type ButtonTheme = "blue" | "orange" | number;
export type ButtonVariant = "primary" | "secondary" | "inner";

/** The Theme axis as 0..1: 0 Blue, 1 Orange. */
export const themeT = (t: ButtonTheme) => (t === "blue" ? 0 : t === "orange" ? 1 : Math.min(1, Math.max(0, t)));

/** The fill and border colour of a primary button at a point on the Theme axis. */
export const buttonColors = (t: ButtonTheme) => {
  const k = themeT(t);
  return { fill: mixColor(BUTTON.fill, BUTTON_ORANGE.fill, k), border: mixColor(BUTTON.border, BUTTON_ORANGE.border, k), text: BUTTON.text };
};

const r1 = (v: number) => Math.round(v * 10) / 10;

/**
 * The theme's shadow for an object at an elevation, as Slab draws it; `shadow` 0..1
 * fades it in. Exported for anything small enough not to be a Slab (a lifted button).
 */
export const slabShadow = (th: IllusTheme, elevation: Elevation, shadow = 1): string | undefined => {
  const row = elevationAt(elevation);
  const s = Math.min(1, Math.max(0, shadow));
  if (!row || s <= 0) return undefined;
  if (th.shadow === "elevation") {
    const c = parseColor(th.shadowColor);
    return `0 ${r1(row.y * s)}px ${r1(row.blur * s)}px ${r1(row.spread * s)}px ${alpha(th.shadowColor, c.a * s)}`;
  }
  if (th.shadow === "hard") {
    const off = r1((12 + 6 * row.t) * s);
    return `${off}px ${off}px 0 0 ${th.shadowColor}`;
  }
  return undefined;
};

/** The artefact face with the film's label face behind it, for the two anatomy words. */
export const artefactFamily = (th: IllusTheme) => `"${ARTEFACT_FONT}", "${th.font.family}", "${archivo}"`;

export type ButtonAtomProps = {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  radius?: number;
  padding?: number;
  theme?: ButtonTheme;
  fill?: boolean;
  /** 0..1, the fill's opacity (the Transparent Back). */
  fillAlpha?: number;
  border?: boolean;
  label?: string;
  variant?: ButtonVariant;
  /** The status an `inner` button belongs to. */
  status?: StatusName;
  /** A tint to draw an `inner` button with instead of STATUS[status]. */
  tint?: StatusTint;
  /** A shadow of its own once it stands on the floor; "flat" (the default) casts none. */
  elevation?: Elevation;
  shadow?: number;
  scale?: number;
  scaleOrigin?: string;
  opacity?: number;
  /** In the flow of a flex parent (a SurfacePanel's children) instead of absolute. */
  inline?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
};

export const ButtonAtom = ({
  x = 0,
  y = 0,
  w = BUTTON.w,
  h = BUTTON.h,
  radius = BUTTON.radius,
  padding = BUTTON.paddingX,
  theme = "blue",
  fill = true,
  fillAlpha = 1,
  border = true,
  label = BUTTON_LABEL,
  variant = "primary",
  status = "positive",
  tint,
  elevation = "flat",
  shadow = 1,
  scale = 1,
  scaleOrigin = "50% 50%",
  opacity = 1,
  inline = false,
  style,
  children,
}: ButtonAtomProps) => {
  const th = useIllus();
  const c = buttonColors(theme);
  const fa = Math.min(1, Math.max(0, fillAlpha));

  let background: string | undefined;
  let color: string;
  let borderColor: string | undefined;
  let text: string = label;

  if (variant === "inner") {
    const t = tint ?? STATUS[status];
    if (!t.verified && !tint) {
      // An unverified tint is never drawn from an empty string: a Support outline with its name.
      color = alpha(th.stroke, 1);
      borderColor = color;
      text = STATUS_LABELS[status];
    } else {
      color = t.buttonText;
      borderColor = t.border;
    }
  } else if (variant === "secondary") {
    // The file's secondary text is a darker blue than the border; artefact.ts holds only the border value.
    color = c.border;
    borderColor = c.border;
  } else {
    background = fill ? alpha(c.fill, fa) : undefined;
    color = c.text;
    borderColor = c.border;
  }

  const boxShadow = slabShadow(th, elevation, shadow);

  return (
    <div
      style={{
        position: inline ? "relative" : "absolute",
        left: inline ? undefined : x,
        top: inline ? undefined : y,
        width: w,
        height: h,
        boxSizing: "border-box",
        borderRadius: radius,
        background,
        border: border ? `1px solid ${borderColor}` : undefined,
        boxShadow,
        padding: `0 ${padding}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: artefactFamily(th),
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1,
        letterSpacing: 0,
        whiteSpace: "nowrap",
        color,
        opacity,
        transform: scale === 1 ? undefined : `scale(${scale})`,
        transformOrigin: scaleOrigin,
        ...style,
      }}
    >
      {text}
      {children}
    </div>
  );
};
