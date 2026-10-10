// The redrawn Alert, 420 x 125 at 1x. A container in the status tint (radius 8,
// 16 px padding), a 20 px status glyph in the icon colour, the title (the one
// allowed word) in the text colour, two body rules in place of the file's lorem, the
// inner ButtonAtom with a greeked link bar beside it, and a 16 px close glyph. Gaps
// 12 (icon to text column) and 16 (body to action row), as the component binds them.
// The file's Subtle tint is an alpha over the system's light surface, so the card
// carries that surface beneath the tint (`base`) and reads the same on the dark floor.
// An unverified tint is never drawn from an empty string: the card becomes a Support
// outline with the status name, so a reviewer sees the gap.
import type { CSSProperties } from "react";
import { ALERT, BUTTON, STATUS, STATUS_LABELS, TOKENS } from "./artefact";
import type { StatusName, StatusTint } from "./artefact";
import { artefactFamily, ButtonAtom, slabShadow } from "./ButtonAtom";
import { Glyph } from "./Glyph";
import type { GlyphName } from "./Glyph";
import { BAR_RADIUS, GREEK, greekLines, seedFrom, stagger } from "./greek";
import type { Elevation } from "./Slab";
import { alpha, useIllus } from "./theme";
import { archivo } from "../type";

export type AlertEmphasis = "subtle" | "intense";

/** The status glyph each colour carries (the kit's own two-stroke drawings). */
export const STATUS_GLYPH: Record<StatusName, GlyphName> = {
  positive: "check-circle",
  negative: "x-circle",
  notice: "triangle",
  information: "info-circle",
  neutral: "circle",
};

const PAD = 16;
/** The text column starts after the padding, the 20 px glyph and the 12 px gap. */
const COL_X = PAD + ALERT.iconLarge + ALERT.gapIconText;
const TITLE_H = 20;
/** The body band: two rules under the title, then the 16 px gap to the action row. */
const BODY_Y = PAD + TITLE_H;
const RULE_Y = [BODY_Y + 5, BODY_Y + 16];
const BODY_H = 21;
const ACTION_Y = BODY_Y + BODY_H + ALERT.gapBodyActions;
const LINK_W = 40;

/** The Alert's content box at 1x (the padded box the Slot outline is drawn around). */
export const ALERT_CONTENT = { x: PAD, y: PAD, w: ALERT.w - 2 * PAD, h: ALERT.h - 2 * PAD };
/** The two gaps the Alert binds, as SlotOutline takes them: 12 along x, 16 along y, in the card's px. */
export const ALERT_GAPS = [
  { axis: "x" as const, at: PAD + ALERT.iconLarge, px: ALERT.gapIconText },
  { axis: "y" as const, at: BODY_Y + BODY_H, px: ALERT.gapBodyActions },
];
/** Where the inner button sits in the card's px, for a scene that lifts a copy out. */
export const ALERT_BUTTON_SLOT = { x: COL_X, y: ACTION_Y };

export type AlertCardProps = {
  x?: number;
  y?: number;
  emphasis?: AlertEmphasis;
  color?: StatusName;
  /** A tint to draw with instead of STATUS[color] (an intense set, once it is verified). */
  tint?: StatusTint;
  /** The title and the glyphs typed; false greeks the title as a bar and drops the glyphs. */
  anatomy?: boolean;
  /** Two 1 px rules for the body; false draws two greeked bars instead. */
  bodyAsRules?: boolean;
  scale?: number;
  scaleOrigin?: string;
  /** 0..1: the inner button leaving its slot (the scene draws the lifted copy). */
  lift?: number;
  /** 0..1: container, glyph, title, rules, action row, in that order. */
  assemble?: number;
  seed?: number;
  /** The surface under the tint; defaults to the system's light surface, as in the file. */
  base?: string;
  elevation?: Elevation;
  shadow?: number;
  opacity?: number;
  style?: CSSProperties;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** A local 0..1 window of a 0..1 progress. */
const win = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

export const AlertCard = ({
  x = 0,
  y = 0,
  emphasis = "subtle",
  color = "positive",
  tint,
  anatomy = true,
  bodyAsRules = true,
  scale = 1,
  scaleOrigin = "0 0",
  lift = 0,
  assemble = 1,
  seed,
  base = TOKENS.surfaceIntense.onLight,
  elevation = "flat",
  shadow = 1,
  opacity = 1,
  style,
}: AlertCardProps) => {
  const th = useIllus();
  const s = seed ?? seedFrom(x, y);
  const p = clamp01(assemble);
  // Only the Subtle tints live in artefact.ts; an intense card without a tint of its own shows the gap.
  const t = tint ?? (emphasis === "subtle" ? STATUS[color] : undefined);
  const outer: CSSProperties = {
    position: "absolute",
    left: x,
    top: y,
    width: ALERT.w,
    height: ALERT.h,
    boxSizing: "border-box",
    borderRadius: ALERT.radius,
    boxShadow: slabShadow(th, elevation, shadow),
    opacity: opacity * win(p, 0, 0.3),
    transform: scale === 1 ? undefined : `scale(${scale})`,
    transformOrigin: scaleOrigin,
    ...style,
  };

  if (!t || !t.verified) {
    const line = alpha(th.stroke, 1);
    return (
      <div style={{ ...outer, border: `1px solid ${line}` }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: `"${th.font.family}", "${archivo}"`,
            fontVariationSettings: th.font.settings,
            fontSize: 24,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: line,
            whiteSpace: "nowrap",
          }}
        >
          {STATUS_LABELS[color]}
        </div>
      </div>
    );
  }

  const colW = ALERT.w - COL_X - PAD - ALERT.iconSmall - ALERT.gapIconText;
  const ruleColor = alpha(t.text, 0.3);
  const widths = greekLines(s, 2, colW);
  const glyphDraw = win(p, 0.25, 0.6);
  const titleOn = win(p, 0.4, 0.6);
  const rulesP = win(p, 0.45, 0.85);
  const actionOn = win(p, 0.7, 1);
  const buttonOn = 1 - clamp01(lift);

  return (
    <div style={{ ...outer, background: base }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: ALERT.radius, background: t.container }} />
      {anatomy ? (
        <Glyph name={STATUS_GLYPH[color]} size={ALERT.iconLarge} color={t.icon} x={PAD} y={PAD} draw={glyphDraw} />
      ) : (
        <div style={{ position: "absolute", left: PAD, top: PAD + 2, width: 16, height: 16, borderRadius: 4, border: `1px solid ${t.icon}`, opacity: glyphDraw }} />
      )}
      {anatomy ? (
        <div
          style={{
            position: "absolute",
            left: COL_X,
            top: PAD,
            height: TITLE_H,
            lineHeight: `${TITLE_H}px`,
            fontFamily: artefactFamily(th),
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: 0,
            color: t.text,
            whiteSpace: "nowrap",
            opacity: titleOn,
          }}
        >
          {ALERT.title}
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            left: COL_X,
            top: PAD + 4,
            width: 80,
            height: GREEK.title.h,
            borderRadius: BAR_RADIUS,
            background: t.text,
            transform: `scaleX(${titleOn})`,
            transformOrigin: "left center",
          }}
        />
      )}
      {widths.map((bw, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: COL_X,
            top: bodyAsRules ? RULE_Y[i] : RULE_Y[i] - 3,
            width: bw,
            height: bodyAsRules ? 1 : GREEK.body.h,
            borderRadius: bodyAsRules ? 0 : BAR_RADIUS,
            background: ruleColor,
            transform: `scaleX(${stagger(rulesP, i, 2, 8, 2)})`,
            transformOrigin: "left center",
          }}
        />
      ))}
      <ButtonAtom x={COL_X} y={ACTION_Y} variant="inner" tint={t} opacity={actionOn * buttonOn} />
      <div
        style={{
          position: "absolute",
          left: COL_X + BUTTON.w + ALERT.gapIconText,
          top: ACTION_Y + 14,
          width: LINK_W,
          height: GREEK.body.h,
          borderRadius: BAR_RADIUS,
          background: t.buttonText,
          opacity: actionOn,
        }}
      />
      {anatomy ? <Glyph name="x" size={ALERT.iconSmall} color={t.text} x={ALERT.w - PAD - ALERT.iconSmall} y={PAD + 2} draw={glyphDraw} /> : null}
    </div>
  );
};
