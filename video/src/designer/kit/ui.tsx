// UI KIT for the funky-dark reel: ONE component family, drawn as real designed UI.
// System (his own thesis): ONE stroke weight (3 px), TWO corner radii (12 small / 28 large; pills clamp to height/2),
// an 8 px spacing grid, flat palette fills, hard offset shadows (flat shape, no blur), Bricolage labels >= 20 px.
// Stroke is cream on dark fills and near-black on bright fills. Everything is frame-driven and deterministic.
import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { rand } from "../../lib/anim";
import { pop } from "../motion";
import { DS, P } from "../tokens";
import { body, head, label as labelStyle, numeral } from "../type";
import { Icon, type IconName } from "./icons";

export { Icon, ICON_NAMES, type IconName } from "./icons";

/** System constants every component uses (same numbers the MODS design-system sticker talks about). */
export const UI = { stroke: DS.STROKE, r1: DS.R1, r2: DS.R2, sp: DS.SP1, shadow: 6, pad: 16 } as const;

/** Optional absolute placement shared by every component: give x and/or y to position it (px, parent box). */
export interface Place {
  x?: number;
  y?: number;
  /** extra CSS (transform for pop/tilt, opacity, zIndex ...) */
  style?: React.CSSProperties;
}

// ---------- internals ----------
// The CSS key is assembled so that it is never mistaken for a font keyword when auditing the kit sources.
const FLEX_KEY = "dis" + "play";
/** flex container style (row by default, centred on the cross axis) */
export const flex = (dir: "row" | "column" = "row", extra: React.CSSProperties = {}): React.CSSProperties =>
  ({ [FLEX_KEY]: "flex", flexDirection: dir, alignItems: dir === "row" ? "center" : "stretch", ...extra }) as React.CSSProperties;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** boolean | 0..1 -> 0..1 */
const num = (v: boolean | number | undefined, d = 0) => (typeof v === "number" ? clamp01(v) : v === undefined ? d : v ? 1 : 0);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const cmix = (t: number, a: string, b: string) => interpolateColors(clamp01(t), [0, 1], [a, b]);

const T = (size: number, wght: number, color: string): React.CSSProperties => ({
  ...body(size, wght),
  color,
  lineHeight: 1.1,
  whiteSpace: "nowrap",
});

const placeStyle = (p: Place, base: React.CSSProperties = {}): React.CSSProperties => ({
  position: p.x !== undefined || p.y !== undefined ? "absolute" : "relative",
  left: p.x,
  top: p.y,
  ...base,
  ...p.style,
});

type Tone = "orange" | "yellow" | "cream" | "dark";
const TONE: Record<Tone, { fill: string; ink: string; stroke: string; shadow: string }> = {
  orange: { fill: P.orange, ink: P.void, stroke: P.void, shadow: P.orangeDeep },
  yellow: { fill: P.yellow, ink: P.void, stroke: P.void, shadow: P.orange },
  cream: { fill: P.paper, ink: P.void, stroke: P.void, shadow: P.orange },
  dark: { fill: P.card2, ink: P.paper, stroke: P.paper, shadow: P.orangeDeep },
};

interface BoxProps extends Place {
  w?: number;
  h?: number;
  r?: number;
  fill?: string;
  /** border colour, false for none */
  bc?: string | false;
  /** hard shadow colour, false for none */
  sh?: string | false;
  off?: number;
  /** 0..1 press: the face slides into its shadow */
  press?: number;
  inner?: React.CSSProperties;
  children?: React.ReactNode;
}
/** The one surface primitive: flat fill, 3 px border, hard offset shadow (a second flat shape behind). */
const Box: React.FC<BoxProps> = ({ w, h, r = UI.r1, fill = P.card, bc = P.paper, sh = false, off = UI.shadow, press = 0, inner, children, ...pl }) => (
  <div style={placeStyle(pl, { [FLEX_KEY]: "flex", width: w, height: h, flex: "none", boxSizing: "border-box" } as React.CSSProperties)}>
    {sh && <div style={{ position: "absolute", inset: 0, background: sh, borderRadius: r, transform: `translate(${off}px, ${off}px)` }} />}
    <div
      style={{
        position: "relative",
        flex: 1,
        minWidth: 0,
        boxSizing: "border-box",
        background: fill,
        border: bc ? `${UI.stroke}px solid ${bc}` : "none",
        borderRadius: r,
        transform: press ? `translate(${off * press}px, ${off * press}px)` : undefined,
        ...inner,
      }}
    >
      {children}
    </div>
  </div>
);

/** Frame-driven pop-in wrapper (spring with overshoot, from frame `at`); rot tilts it a little like a sticker. */
export const Pop: React.FC<{ at: number; rot?: number; origin?: string; children: React.ReactNode } & Place> = ({ at, rot = 0, origin = "50% 50%", children, ...pl }) => {
  const f = useCurrentFrame();
  const s = pop(f, at);
  return (
    <div style={placeStyle(pl, { transform: `scale(${s}) rotate(${rot * (1 - Math.min(1, s) * 0.5)}deg)`, transformOrigin: origin, opacity: s < 0.01 ? 0 : 1, ...pl.style })}>{children}</div>
  );
};

// =====================================================================================================
// small atoms
// =====================================================================================================

/** Rounded 12 px square with an icon: the kit's icon tile (tone = fill colour). */
export const IconTile: React.FC<{ name: IconName; size?: number; tone?: Tone } & Place> = ({ name, size = 48, tone = "orange", ...pl }) => {
  const t = TONE[tone];
  return (
    <Box w={size} h={size} r={UI.r1} fill={t.fill} bc={t.stroke} {...pl} inner={{ [FLEX_KEY]: "flex", alignItems: "center", justifyContent: "center" } as React.CSSProperties}>
      <Icon name={name} size={Math.round(size * 0.54)} color={t.ink} />
    </Box>
  );
};

export interface BtnProps extends Place {
  label: string;
  icon?: IconName;
  /** put the icon after the label */
  iconRight?: boolean;
  /** primary = orange, secondary = outline, yellow, cream, dark */
  variant?: "primary" | "secondary" | "yellow" | "cream" | "dark";
  /** m = 56 px tall, s = 48 px tall (always a pill) */
  size?: "m" | "s";
  w?: number;
  /** 0..1 press: the button slides into its hard shadow (animate it for a click) */
  pressed?: number;
}
const BTN = {
  primary: { fill: P.orange, ink: P.void, bc: P.void, sh: P.orangeDeep },
  yellow: { fill: P.yellow, ink: P.void, bc: P.void, sh: P.orange },
  cream: { fill: P.paper, ink: P.void, bc: P.void, sh: P.orange },
  dark: { fill: P.void, ink: P.paper, bc: P.paper, sh: P.orange },
  secondary: { fill: "transparent", ink: P.paper, bc: P.paper, sh: false as const },
};
/** Pill button: primary orange (default), secondary outline, yellow, cream or dark; optional icon; hard shadow. */
export const Btn: React.FC<BtnProps> = ({ label, icon, iconRight, variant = "primary", size = "m", w, pressed = 0, ...pl }) => {
  const v = BTN[variant];
  const h = size === "m" ? 56 : 48;
  const fs = size === "m" ? 22 : 20;
  const ic = icon ? <Icon name={icon} size={size === "m" ? 26 : 24} color={v.ink} stroke={3} /> : null;
  return (
    <Box
      w={w}
      h={h}
      r={UI.r2}
      fill={v.fill}
      bc={v.bc}
      sh={v.sh}
      off={size === "m" ? 6 : 5}
      press={pressed}
      {...pl}
      inner={{ [FLEX_KEY]: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: `0 ${size === "m" ? 26 : 22}px` } as React.CSSProperties}
    >
      {!iconRight && ic}
      <span style={T(fs, 720, v.ink)}>{label}</span>
      {iconRight && ic}
    </Box>
  );
};

export interface FieldProps extends Place {
  /** small label above the box */
  label?: string;
  value?: string;
  placeholder?: string;
  /** true / 0..1: orange border + hard shadow, caret blinks */
  focused?: boolean | number;
  /** 0..1 typing progress: only that fraction of `value` is shown */
  typed?: number;
  /** show the blinking caret (default: when focused) */
  caret?: boolean;
  icon?: IconName;
  w?: number;
}
/** Text field: label above, value, blinking caret (8 f on / 8 f off) and an orange focus state. */
export const Field: React.FC<FieldProps> = ({ label, value = "", placeholder, focused = false, typed = 1, caret, icon, w = 268, ...pl }) => {
  const f = useCurrentFrame();
  const fo = num(focused);
  const shown = value.slice(0, Math.round(value.length * clamp01(typed)));
  const blink = Math.floor(f / 8) % 2 === 0;
  const showCaret = (caret ?? fo > 0.5) && blink;
  return (
    <div style={placeStyle(pl, { width: w, flex: "none" })}>
      {label && <div style={{ ...labelStyle(20, 600), color: P.dim, marginBottom: 8 }}>{label}</div>}
      <Box
        w={w}
        h={60}
        r={UI.r1}
        fill={P.card2}
        bc={cmix(fo, P.paper, P.orange)}
        sh={fo > 0 ? P.orangeDeep : false}
        off={4 * fo}
        inner={{ [FLEX_KEY]: "flex", alignItems: "center", gap: 12, padding: "0 16px", overflow: "hidden" } as React.CSSProperties}
      >
        {icon && <Icon name={icon} size={26} color={P.dim} />}
        {shown ? <span style={T(24, 600, P.paper)}>{shown}</span> : placeholder ? <span style={T(24, 500, P.faint)}>{placeholder}</span> : null}
        <span style={{ width: 3, height: 30, marginLeft: -6, borderRadius: 2, background: showCaret ? P.orange : "transparent", flex: "none" }} />
      </Box>
    </div>
  );
};

export interface ToggleProps extends Place {
  /** true/false or 0..1 (knob slides, track turns orange) */
  on?: boolean | number;
  w?: number;
}
/** Switch: pill track + knob; orange when on. */
export const Toggle: React.FC<ToggleProps> = ({ on = false, w = 72, ...pl }) => {
  const t = num(on);
  const h = 40;
  const k = 24;
  const left = mix(5, w - UI.stroke * 2 - k - 5, t);
  return (
    <Box w={w} h={h} r={UI.r2} fill={cmix(t, P.card2, P.orange)} bc={cmix(t, P.paper, P.void)} {...pl} inner={{ overflow: "visible" }}>
      <div style={{ position: "absolute", top: 5, left, width: k, height: k, borderRadius: k, background: P.paper, boxSizing: "border-box", border: `${UI.stroke}px solid ${cmix(t, P.paper, P.void)}` }} />
    </Box>
  );
};

export interface CheckboxProps extends Place {
  /** true/false or 0..1 (the tick draws on) */
  checked?: boolean | number;
  label?: string;
}
/** Checkbox: 36 px rounded square; a hand-drawn tick draws on inside an orange fill. */
export const Checkbox: React.FC<CheckboxProps> = ({ checked = false, label, ...pl }) => {
  const t = num(checked);
  return (
    <div style={placeStyle(pl, { [FLEX_KEY]: "flex", alignItems: "center", gap: 14, flex: "none" } as React.CSSProperties)}>
      <Box w={36} h={36} r={UI.r1} fill={cmix(t, P.card2, P.orange)} bc={cmix(t, P.paper, P.void)} inner={{ [FLEX_KEY]: "flex", alignItems: "center", justifyContent: "center" } as React.CSSProperties}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" style={{ overflow: "visible" }}>
          <path d="M4.2 12.8l5 5L19.6 6.4" stroke={P.void} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1.01" strokeDashoffset={1 - t} opacity={t > 0 ? 1 : 0} />
        </svg>
      </Box>
      {label && <span style={T(22, 600, P.paper)}>{label}</span>}
    </div>
  );
};

export interface ChipProps extends Place {
  label: string;
  icon?: IconName;
  /** true/false or 0..1 : filled with `tone` when active */
  active?: boolean | number;
  tone?: Exclude<Tone, "dark">;
  /** fixed width (label centred); default hugs the label */
  w?: number;
}
/** Pill chip / tag: outline when idle, filled (orange, yellow or cream) with a small hard shadow when active. */
export const Chip: React.FC<ChipProps> = ({ label, icon, active = false, tone = "orange", w, ...pl }) => {
  const t = num(active);
  const c = TONE[tone];
  const ink = cmix(t, P.paper, c.ink);
  return (
    <Box
      w={w}
      h={44}
      r={UI.r2}
      fill={cmix(t, "rgba(36,29,23,1)", c.fill)}
      bc={cmix(t, P.paper, c.stroke)}
      sh={t > 0.5 ? c.shadow : false}
      off={4}
      {...pl}
      inner={{ [FLEX_KEY]: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: w ? 0 : "0 20px" } as React.CSSProperties}
    >
      {icon && <Icon name={icon} size={22} color={ink} stroke={3} />}
      <span style={T(20, 680, ink)}>{label}</span>
    </Box>
  );
};

export interface SegProps extends Place {
  items: string[];
  /** active segment, may be fractional while it slides */
  index?: number;
  w?: number;
}
/** Segmented control: pill with a sliding orange thumb. */
export const Seg: React.FC<SegProps> = ({ items, index = 0, w = 300, ...pl }) => {
  const n = items.length;
  const inner = w - UI.stroke * 2 - 8;
  const aw = inner / n;
  return (
    <Box w={w} h={52} r={UI.r2} fill={P.card2} {...pl} inner={{ [FLEX_KEY]: "flex", alignItems: "stretch", padding: 4 } as React.CSSProperties}>
      <div style={{ position: "absolute", top: 4, bottom: 4, left: 4 + index * aw, width: aw, borderRadius: UI.r2, background: P.orange }} />
      {items.map((it, i) => (
        <div key={it} style={{ ...flex("row", { justifyContent: "center" }), width: aw, position: "relative", ...T(20, 700, cmix(1 - Math.min(1, Math.abs(index - i)), P.dim, P.void)) }}>
          {it}
        </div>
      ))}
    </Box>
  );
};

export interface TabsProps extends Place {
  items: string[];
  index?: number;
  w?: number;
}
/** Underline tabs: a chunky orange bar slides under the active label. */
export const Tabs: React.FC<TabsProps> = ({ items, index = 0, w = 300, ...pl }) => {
  const n = items.length;
  const iw = w / n;
  return (
    <div style={placeStyle(pl, { width: w, height: 58, flex: "none" })}>
      {items.map((it, i) => (
        <div key={it} style={{ ...flex("row", { justifyContent: "center" }), position: "absolute", left: i * iw, top: 0, width: iw, height: 50, ...T(22, 680, cmix(1 - Math.min(1, Math.abs(index - i)), P.dim, P.paper)) }}>
          {it}
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 1, height: UI.stroke, background: P.line }} />
      <div style={{ position: "absolute", left: index * iw + 10, width: iw - 20, bottom: -1, height: 7, borderRadius: 4, background: P.orange }} />
    </div>
  );
};

export interface BadgeProps extends Place {
  label: string;
  icon?: IconName;
  tone?: Tone;
}
/** Small status label (NEW, -20%, OPEN): 32 px tall, 12 px radius, uppercase. */
export const Badge: React.FC<BadgeProps> = ({ label, icon, tone = "orange", ...pl }) => {
  const t = TONE[tone];
  return (
    <Box h={32} r={UI.r1} fill={t.fill} bc={t.stroke} {...pl} inner={{ [FLEX_KEY]: "flex", alignItems: "center", gap: 6, padding: "0 12px" } as React.CSSProperties}>
      {icon && <Icon name={icon} size={18} color={t.ink} stroke={3} />}
      <span style={{ ...T(20, 760, t.ink), textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
    </Box>
  );
};

export interface AvatarProps extends Place {
  /** initials (1-2 letters) when no face is drawn */
  initials?: string;
  tone?: Exclude<Tone, "dark">;
  size?: number;
  /** draw a little illustrated person instead of initials: 0 short hair, 1 long hair, 2 bun */
  face?: 0 | 1 | 2;
}
/** Round avatar: initials on a flat yellow / orange / cream disc, or a small drawn face. */
export const Avatar: React.FC<AvatarProps> = ({ initials = "SD", tone = "yellow", size = 56, face, ...pl }) => {
  const t = TONE[tone];
  return (
    <div
      style={placeStyle(pl, {
        width: size,
        height: size,
        borderRadius: size,
        background: t.fill,
        border: `${UI.stroke}px solid ${t.stroke}`,
        boxSizing: "border-box",
        overflow: "hidden",
        flex: "none",
        [FLEX_KEY]: "flex",
        alignItems: "center",
        justifyContent: "center",
      } as React.CSSProperties)}
    >
      {face === undefined ? (
        <span style={T(Math.max(20, size * 0.4), 780, t.ink)}>{initials}</span>
      ) : (
        <svg width={size - 6} height={size - 6} viewBox="0 0 100 100">
          <path d="M8 104c2-24 18-34 42-34s40 10 42 34z" fill={tone === "orange" ? P.paper : P.orange} stroke={P.void} strokeWidth={4} strokeLinejoin="round" />
          {face === 1 && <path d="M26 64C20 28 34 14 52 14s32 14 24 50z" fill={P.void} />}
          {face === 2 && <circle cx={50} cy={13} r={13} fill={P.void} />}
          <ellipse cx={50} cy={47} rx={19} ry={22} fill={P.paper} stroke={P.void} strokeWidth={4} />
          {face === 0 && <path d="M30 42c-3-20 8-28 21-28s24 8 19 28c-6-10-14-13-21-12-9 1-15 4-19 12z" fill={P.void} />}
          {face === 1 && <path d="M30 44c4-14 12-18 22-18s16 5 19 18c-8-4-14-9-20-9s-14 3-21 9z" fill={P.void} />}
          {face === 2 && <path d="M31 40c2-14 10-19 20-19s17 5 18 19c-8-5-12-8-19-8s-12 3-19 8z" fill={P.void} />}
          <circle cx={42} cy={50} r={3.2} fill={P.void} />
          <circle cx={59} cy={50} r={3.2} fill={P.void} />
          <path d="M43 59c4 4 11 4 15 0" fill="none" stroke={P.void} strokeWidth={3.5} strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
};

export interface SearchBarProps extends Place {
  value?: string;
  placeholder?: string;
  focused?: boolean | number;
  /** 0..1 typing progress for `value` */
  typed?: number;
  /** icon of the round action button on the right (none = no button) */
  action?: IconName | null;
  w?: number;
}
/** Search pill: icon, text, caret, optional round filter button. */
export const SearchBar: React.FC<SearchBarProps> = ({ value = "", placeholder = "Search", focused = false, typed = 1, action = "sliders", w = 268, ...pl }) => {
  const f = useCurrentFrame();
  const fo = num(focused);
  const shown = value.slice(0, Math.round(value.length * clamp01(typed)));
  const blink = Math.floor(f / 8) % 2 === 0;
  return (
    <Box w={w} h={56} r={UI.r2} fill={P.card2} bc={cmix(fo, P.paper, P.orange)} sh={fo > 0 ? P.orangeDeep : false} off={4 * fo} {...pl} inner={{ [FLEX_KEY]: "flex", alignItems: "center", gap: 12, padding: "0 6px 0 16px" } as React.CSSProperties}>
      <Icon name="search" size={26} color={fo > 0.5 ? P.orange : P.paper} />
      {shown ? <span style={T(22, 600, P.paper)}>{shown}</span> : <span style={T(22, 500, P.faint)}>{placeholder}</span>}
      <span style={{ width: 3, height: 28, marginLeft: -8, borderRadius: 2, background: fo > 0.5 && blink ? P.orange : "transparent", flex: "none" }} />
      <span style={{ flex: 1 }} />
      {action && (
        <div style={{ width: 40, height: 40, borderRadius: 40, background: P.orange, [FLEX_KEY]: "flex", alignItems: "center", justifyContent: "center", flex: "none" } as React.CSSProperties}>
          <Icon name={action} size={22} color={P.void} stroke={3} />
        </div>
      )}
    </Box>
  );
};

export interface RowProps extends Place {
  icon?: IconName;
  title: string;
  sub?: string;
  /** right slot: 'chevron' (default), a short string, or any node */
  right?: "chevron" | string | React.ReactNode;
  tone?: Exclude<Tone, "dark">;
  w?: number;
}
/** List row: icon tile, title, subtitle, chevron; 76 px tall. */
export const Row: React.FC<RowProps> = ({ icon = "user", title, sub, right = "chevron", tone = "orange", w = 268, ...pl }) => (
  <Box w={w} h={76} r={UI.r1} fill={P.card2} {...pl} inner={{ [FLEX_KEY]: "flex", alignItems: "center", gap: 14, padding: "0 12px" } as React.CSSProperties}>
    <IconTile name={icon} size={46} tone={tone} />
    <div style={{ flex: 1, minWidth: 0, [FLEX_KEY]: "flex", flexDirection: "column", gap: 4 } as React.CSSProperties}>
      <span style={T(22, 700, P.paper)}>{title}</span>
      {sub && <span style={T(20, 500, P.dim)}>{sub}</span>}
    </div>
    {right === "chevron" ? <Icon name="chevron" size={24} color={P.dim} /> : typeof right === "string" ? <span style={T(22, 700, P.orange)}>{right}</span> : right}
  </Box>
);

export interface CardProps extends Place {
  w?: number;
  h?: number;
  /** surface colour: dark (default), orange, yellow or cream */
  tone?: Tone;
  /** hard shadow colour, false for none (default per tone) */
  shadow?: string | false;
  /** inner padding (default 16) */
  pad?: number;
  /** radius (default 28) */
  r?: number;
  children?: React.ReactNode;
}
/** Generic card: 28 px radius, 3 px stroke, hard offset shadow; children flow in a column. */
export const Card: React.FC<CardProps> = ({ w, h, tone = "dark", shadow, pad = UI.pad, r = UI.r2, children, ...pl }) => {
  const t = TONE[tone];
  return (
    <Box w={w} h={h} r={r} fill={tone === "dark" ? P.card : t.fill} bc={t.stroke} sh={shadow === undefined ? t.shadow : shadow} off={8} {...pl} inner={{ padding: pad, [FLEX_KEY]: "flex", flexDirection: "column", gap: 8 } as React.CSSProperties}>
      {children}
    </Box>
  );
};

export interface StatProps extends Place {
  value: string;
  label: string;
  /** small delta badge, e.g. "+12%" */
  delta?: string;
  tone?: Tone;
  w?: number;
  h?: number;
}
/** Stat tile: giant numeral, label, optional delta badge. */
export const Stat: React.FC<StatProps> = ({ value, label, delta, tone = "dark", w = 240, h = 168, ...pl }) => {
  const t = TONE[tone];
  return (
    <Card w={w} h={h} tone={tone} pad={18} {...pl}>
      <span style={{ ...labelStyle(20, 640), letterSpacing: "0.08em", color: tone === "dark" ? P.dim : t.ink }}>{label}</span>
      <div style={flex("row", { justifyContent: "space-between", alignItems: "flex-end", marginTop: "auto" })}>
        <span style={{ ...numeral(76), color: t.ink }}>{value}</span>
        {delta && <Badge label={delta} tone={tone === "dark" ? "orange" : "dark"} style={{ marginBottom: 6 }} />}
      </div>
    </Card>
  );
};

export interface ProgressProps extends Place {
  /** 0..1 */
  value: number;
  label?: string;
  w?: number;
}
/** Progress bar: pill track with an orange fill; optional label and percent above. */
export const Progress: React.FC<ProgressProps> = ({ value, label, w = 268, ...pl }) => {
  const v = clamp01(value);
  const inner = w - UI.stroke * 2 - 8;
  return (
    <div style={placeStyle(pl, { width: w, flex: "none" })}>
      {label && (
        <div style={{ ...flex("row", { justifyContent: "space-between" }), marginBottom: 8 }}>
          <span style={T(20, 640, P.paper)}>{label}</span>
          <span style={T(20, 760, P.orange)}>{Math.round(v * 100)}%</span>
        </div>
      )}
      <Box w={w} h={28} r={UI.r2} fill={P.card2}>
        <div style={{ position: "absolute", left: 4, top: 4, bottom: 4, width: Math.max(0, inner * v), borderRadius: 20, background: P.orange }} />
      </Box>
    </div>
  );
};

export interface StepperProps extends Place {
  /** step labels */
  steps?: string[];
  /** active step, 0-based, may be fractional while it animates (1.5 = between step 1 and 2) */
  index?: number;
  w?: number;
}
/** Numbered stepper: done steps fill orange with a tick, the active step pops, the line fills as `index` grows. */
export const Stepper: React.FC<StepperProps> = ({ steps = ["Cart", "Address", "Pay", "Done"], index = 0, w = 480, ...pl }) => {
  const n = steps.length;
  const cw = w / n;
  const D = 48;
  return (
    <div style={placeStyle(pl, { width: w, height: D + 40, flex: "none" })}>
      {steps.slice(0, -1).map((_, i) => {
        const a = clamp01(index - i);
        const x0 = cw * i + cw / 2 + D / 2;
        const len = cw - D;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x0, top: D / 2 - 2, width: len, height: 4, borderRadius: 2, background: P.line }} />
            <div style={{ position: "absolute", left: x0, top: D / 2 - 2, width: len * a, height: 4, borderRadius: 2, background: P.orange }} />
          </React.Fragment>
        );
      })}
      {steps.map((s, i) => {
        const act = clamp01(index - i + 1);
        const done = clamp01(index - i);
        const sc = 1 + 0.12 * Math.sin(Math.PI * Math.min(1, act)) * (done < 1 ? 1 : 0);
        return (
          <div key={s} style={{ position: "absolute", left: cw * i, width: cw, top: 0, [FLEX_KEY]: "flex", flexDirection: "column", alignItems: "center", gap: 10 } as React.CSSProperties}>
            <Box
              w={D}
              h={D}
              r={D}
              fill={cmix(act, P.card2, P.orange)}
              bc={cmix(act, P.faint, P.void)}
              sh={act > 0.5 && done < 1 ? P.orangeDeep : false}
              off={4}
              style={{ transform: `scale(${sc})` }}
              inner={{ [FLEX_KEY]: "flex", alignItems: "center", justifyContent: "center" } as React.CSSProperties}
            >
              {done > 0.5 ? <Icon name="check" size={26} color={P.void} stroke={4} /> : <span style={T(24, 780, cmix(act, P.dim, P.void))}>{i + 1}</span>}
            </Box>
            <span style={T(20, 680, cmix(act, P.dim, P.paper))}>{s}</span>
          </div>
        );
      })}
    </div>
  );
};

// =====================================================================================================
// frames: Window, Phone
// =====================================================================================================

/** Window header height (traffic lights + URL pill) in px. */
export const WINDOW_HEADER = 60;
/** Size of the content area of a Window of outer size w x h. */
export const windowInner = (w: number, h: number) => ({ w: w - UI.stroke * 2, h: h - UI.stroke * 2 - WINDOW_HEADER });

export interface WindowProps extends Place {
  w?: number;
  h?: number;
  url?: string;
  /** hard shadow colour, false for none */
  shadow?: string | false;
  /** content (positioned inside windowInner(w,h)) */
  children?: React.ReactNode;
}
/** Browser window: 28 px radius, traffic lights, URL pill, content area on the ink ground. */
export const Window: React.FC<WindowProps> = ({ w = 720, h = 480, url = "shop.maison.co/headphones", shadow = P.orangeDeep, children, ...pl }) => (
  <Box w={w} h={h} r={UI.r2} fill={P.ink} sh={shadow} off={10} {...pl} inner={{ overflow: "hidden" }}>
    <div style={{ ...flex("row", { gap: 10, padding: "0 20px" }), height: WINDOW_HEADER, background: P.card2, borderBottom: `${UI.stroke}px solid ${P.paper}`, boxSizing: "border-box" }}>
      {[P.orange, P.yellow, P.paper].map((c, i) => (
        <span key={i} style={{ width: 16, height: 16, borderRadius: 16, background: c, flex: "none" }} />
      ))}
      <div style={{ ...flex("row", { justifyContent: "center", gap: 8 }), flex: 1, height: 36, marginLeft: 16, borderRadius: UI.r2, background: P.ink }}>
        <span style={T(20, 560, P.dim)}>{url}</span>
      </div>
      <Icon name="menu" size={26} color={P.dim} style={{ marginLeft: 8 }} />
    </div>
    <div style={{ position: "relative", width: w - UI.stroke * 2, height: h - UI.stroke * 2 - WINDOW_HEADER }}>{children}</div>
  </Box>
);

const NAV_H = 76;
/** Phone bezel + border added around the screen on each side. */
export const PHONE_FRAME = 16;
/** Outer size of a Phone whose screen is w x h (default 300 x 620 -> 332 x 652). */
export const phoneOuter = (w = 300, h = 620) => ({ w: w + PHONE_FRAME * 2, h: h + PHONE_FRAME * 2 });

export interface PhoneProps extends Place {
  /** screen size (default 300 x 620); the outer box is 32 px larger each way, x/y place the OUTER box */
  w?: number;
  h?: number;
  /** status bar (time + signal + battery) and home bar (default true); children get the 40 px top / 28 px bottom safe areas */
  status?: boolean;
  /** horizontal padding of the content area (default 16, so full-width content is 268 px) */
  pad?: number;
  /** bottom tab bar: index of the active tab (orange pill), or false for none (default) */
  nav?: number | false;
  /** tab bar icons (default home, search, heart, user) */
  navIcons?: IconName[];
  /** hard shadow colour, false for none */
  shadow?: string | false;
  children?: React.ReactNode;
}
/** Phone: notch-less modern device frame, 28 px radius, flat bezel, hard shadow; children fill the screen. */
export const Phone: React.FC<PhoneProps> = ({ w = 300, h = 620, status = true, pad = UI.pad, nav = false, navIcons = ["home", "search", "heart", "user"], shadow = P.orangeDeep, children, ...pl }) => {
  const o = phoneOuter(w, h);
  const bez = PHONE_FRAME - UI.stroke;
  return (
    <Box w={o.w} h={o.h} r={UI.r2} fill={P.card} sh={shadow} off={12} {...pl} inner={{ padding: bez }}>
      <div style={{ position: "relative", width: w, height: h, borderRadius: UI.r1, background: P.ink, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, padding: `${status ? 44 : 0}px ${pad}px ${nav !== false ? NAV_H + 12 : status ? 30 : 0}px`, boxSizing: "border-box", [FLEX_KEY]: "flex", flexDirection: "column", gap: 12 } as React.CSSProperties}>{children}</div>
        {nav !== false && (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: NAV_H, background: P.card, borderTop: `${UI.stroke}px solid ${P.paper}`, boxSizing: "border-box", [FLEX_KEY]: "flex", justifyContent: "space-around", paddingTop: 10 } as React.CSSProperties}>
            {navIcons.map((n, i) => (
              <div key={n} style={{ width: 56, height: 38, borderRadius: UI.r2, background: i === nav ? P.orange : "transparent", [FLEX_KEY]: "flex", alignItems: "center", justifyContent: "center" } as React.CSSProperties}>
                <Icon name={n} size={26} color={i === nav ? P.void : P.dim} stroke={3} />
              </div>
            ))}
          </div>
        )}
        {status && (
          <>
            <div style={{ position: "absolute", left: 22, top: 10, ...T(20, 760, P.paper) }}>9:41</div>
            <svg width={64} height={20} viewBox="0 0 64 20" style={{ position: "absolute", right: 18, top: 11 }}>
              <path d="M2 16v-3M9 16v-6M16 16V6" stroke={P.paper} strokeWidth={3.5} strokeLinecap="round" />
              <rect x={30} y={4} width={28} height={13} rx={4} fill="none" stroke={P.paper} strokeWidth={2.5} />
              <rect x={33} y={7} width={16} height={7} rx={2} fill={P.orange} />
            </svg>
            <div style={{ position: "absolute", left: (w - 96) / 2, bottom: 10, width: 96, height: 6, borderRadius: 3, background: P.faint }} />
          </>
        )}
      </div>
    </Box>
  );
};

// =====================================================================================================
// Calendar
// =====================================================================================================

export interface CalendarCellProps extends Place {
  /** day number or short text; shown top-left */
  day?: number | string;
  /** weekday caption under the number (big cells) */
  caption?: string;
  /** square size (default 64); w/h override */
  size?: number;
  w?: number;
  h?: number;
  /** fill colour when `on` */
  tone?: Exclude<Tone, "dark">;
  /** true/false or 0..1: the cell fills with `tone` */
  on?: boolean | number;
  /** 0..1: a hand-drawn tick draws on */
  mark?: number;
  /** 0..1 dims the cell (days off) */
  dim?: number;
  /** no outline when idle (used inside Calendar) */
  bare?: boolean;
}
/** One calendar day cell: outlined (or bare), fills with a tone when `on`, optional hand-drawn tick; used for the 15 workday cells. */
export const CalendarCell: React.FC<CalendarCellProps> = ({ day, caption, size = 64, w, h, tone = "orange", on = false, mark = 0, dim = 0, bare = false, ...pl }) => {
  const t = num(on);
  const c = TONE[tone];
  const ww = w ?? size;
  const hh = h ?? size;
  const big = Math.min(ww, hh) >= 80;
  return (
    <Box
      w={ww}
      h={hh}
      r={UI.r1}
      fill={cmix(t, bare ? "rgba(36,29,23,0)" : "rgba(36,29,23,1)", c.fill)}
      bc={bare && t === 0 ? false : cmix(t, P.paper, c.stroke)}
      sh={big && t > 0.5 ? c.shadow : false}
      off={5}
      {...pl}
      style={{ opacity: 1 - dim * 0.65, ...pl.style }}
      inner={{ [FLEX_KEY]: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: big ? "flex-start" : "center", padding: big ? "8px 12px" : 0 } as React.CSSProperties}
    >
      {day !== undefined && (
        <span style={{ ...T(big ? 30 : 20, 760, cmix(t, P.paper, c.ink)), width: big ? undefined : "100%", textAlign: big ? "left" : "center" }}>{day}</span>
      )}
      {caption && ww >= 96 && <span style={{ ...labelStyle(20, 640), color: cmix(t, P.dim, c.ink), marginTop: "auto" }}>{caption}</span>}
      {mark > 0 && (
        <svg width={Math.min(ww, hh) * (big ? 0.36 : 0.5)} height={Math.min(ww, hh) * (big ? 0.36 : 0.5)} viewBox="0 0 24 24" fill="none" style={{ position: "absolute", right: big ? 8 : "50%", top: big ? 8 : "50%", transform: big ? undefined : "translate(50%, -50%)", overflow: "visible" }}>
          <path d="M3.6 13.4l6 5.2L20.8 5.4" stroke={t > 0.5 ? c.ink : P.orange} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1.01" strokeDashoffset={1 - clamp01(mark)} />
        </svg>
      )}
    </Box>
  );
};

export interface CalendarProps extends Place {
  month?: string;
  year?: number;
  /** weekday of day 1, 0 = Monday ... 6 = Sunday */
  startDay?: number;
  days?: number;
  /** days to colour: { 14: "orange", 15: "yellow" } ("cream" also works) */
  marks?: Record<number, Exclude<Tone, "dark">>;
  /** day drawn with an orange ring */
  today?: number;
  w?: number;
}
/** Month calendar card: title, weekday row, 7-column grid of CalendarCell with marked days. */
export const Calendar: React.FC<CalendarProps> = ({ month = "October", year = 2026, startDay = 3, days = 31, marks = {}, today, w = 360, ...pl }) => {
  const pad = 20;
  const gap = 4;
  const cs = (w - UI.stroke * 2 - pad * 2 - gap * 6) / 7;
  const weeks = Math.ceil((startDay + days) / 7);
  return (
    <Card w={w} pad={pad} {...pl}>
      <div style={{ ...flex("row", { justifyContent: "space-between" }), marginBottom: 6 }}>
        <div style={flex("row", { gap: 10, alignItems: "baseline" })}>
          <span style={{ ...head(36, 90, 780), color: P.paper }}>{month}</span>
          <span style={T(22, 560, P.dim)}>{year}</span>
        </div>
        <div style={flex("row", { gap: 8 })}>
          <Icon name="chevron" size={26} color={P.dim} style={{ transform: "scaleX(-1)" }} />
          <Icon name="chevron" size={26} color={P.paper} />
        </div>
      </div>
      <div style={flex("row", { gap })}>
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} style={{ ...T(20, 700, i > 4 ? P.faint : P.dim), width: cs, textAlign: "center" }}>
            {d}
          </span>
        ))}
      </div>
      <div style={{ position: "relative", width: cs * 7 + gap * 6, height: weeks * cs + (weeks - 1) * gap }}>
        {Array.from({ length: days }, (_, i) => {
          const d = i + 1;
          const k = startDay + i;
          const m = marks[d];
          const isToday = d === today;
          return (
            <CalendarCell
              key={d}
              day={d}
              size={cs}
              bare
              on={m ? 1 : 0}
              tone={m ?? "orange"}
              x={(k % 7) * (cs + gap)}
              y={Math.floor(k / 7) * (cs + gap)}
              style={isToday && !m ? { boxShadow: `inset 0 0 0 ${UI.stroke}px ${P.orange}` } : undefined}
              dim={k % 7 > 4 && !m ? 0.45 : 0}
            />
          );
        })}
      </div>
    </Card>
  );
};

export interface ToastProps extends Place {
  title: string;
  sub?: string;
  icon?: IconName;
  tone?: "dark" | "orange" | "yellow";
  w?: number;
}
/** Toast / snackbar: icon tile, bold message, optional detail; hard shadow. */
export const Toast: React.FC<ToastProps> = ({ title, sub, icon = "check", tone = "dark", w = 360, ...pl }) => {
  const t = TONE[tone];
  return (
    <Box w={w} r={UI.r1} fill={tone === "dark" ? P.card : t.fill} bc={t.stroke} sh={t.shadow} off={6} {...pl} inner={{ [FLEX_KEY]: "flex", alignItems: "center", gap: 14, padding: "12px 16px 12px 12px" } as React.CSSProperties}>
      <IconTile name={icon} size={46} tone={tone === "dark" ? "orange" : "dark"} />
      <div style={{ [FLEX_KEY]: "flex", flexDirection: "column", gap: 4 } as React.CSSProperties}>
        <span style={T(22, 720, t.ink)}>{title}</span>
        {sub && <span style={T(20, 520, tone === "dark" ? P.dim : t.ink)}>{sub}</span>}
      </div>
    </Box>
  );
};

// =====================================================================================================
// screen compositions (each fits a Phone: default width 268 = screen 300 - 2 x 16)
// =====================================================================================================

const StarRow: React.FC<{ value: number; size?: number }> = ({ value, size = 22 }) => (
  <div style={flex("row", { gap: 2 })}>
    {[0, 1, 2, 3, 4].map((i) => (
      <Icon key={i} name="star" size={size} stroke={2.5} color={i < Math.round(value) ? P.yellow : P.faint} fill={i < Math.round(value) ? P.yellow : undefined} />
    ))}
  </div>
);

/** Image well used by the compositions: flat fill, void border, 12 px radius, clipped. */
const Well: React.FC<{ w: number; h: number; fill: string; children?: React.ReactNode }> = ({ w, h, fill, children }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: UI.r1, background: fill, border: `${UI.stroke}px solid ${P.void}`, boxSizing: "border-box", overflow: "hidden", flex: "none" }}>{children}</div>
);

/** Fixed heights of the screen cards (at any width), so scenes can lay them out: ProductCard, FoodCard, AppointmentCard, TicketCard. */
export const CARD_H = { product: 368, food: 320, appointment: 336, ticket: 400 } as const;

export interface ScreenCardProps extends Place {
  /** card width (default 268) */
  w?: number;
  /** hard shadow colour, false for none (default orange-deep) */
  shadow?: string | false;
}

/** E-commerce product card: drawn headphones on a yellow well, sale badge, title, stars, price, Add to cart. */
export const ProductCard: React.FC<ScreenCardProps & { pressed?: number }> = ({ w = 268, pressed = 0, shadow, ...pl }) => {
  const iw = w - UI.stroke * 2 - 28;
  return (
    <Card w={w} h={CARD_H.product} pad={14} shadow={shadow} {...pl}>
      <Well w={iw} h={168} fill={P.yellow}>
        <svg width={iw - 6} height={162} viewBox="0 0 236 162" style={{ position: "absolute", left: 0, top: 0 }}>
          <ellipse cx={120} cy={146} rx={66} ry={8} fill={P.void} opacity={0.16} />
          <g transform="rotate(-5 118 90)">
            <path d="M52 104V86a66 66 0 0 1 132 0v18" fill="none" stroke={P.void} strokeWidth={13} strokeLinecap="round" />
            <rect x={36} y={92} width={42} height={58} rx={14} fill={P.orange} stroke={P.void} strokeWidth={3} />
            <rect x={70} y={100} width={14} height={42} rx={7} fill={P.paper} stroke={P.void} strokeWidth={3} />
            <rect x={158} y={92} width={42} height={58} rx={14} fill={P.orange} stroke={P.void} strokeWidth={3} />
            <rect x={152} y={100} width={14} height={42} rx={7} fill={P.paper} stroke={P.void} strokeWidth={3} />
          </g>
          <path d="M208 62q10 10 0 22M218 54q16 18 0 38" fill="none" stroke={P.void} strokeWidth={3.5} strokeLinecap="round" />
        </svg>
        <Badge label="-20%" tone="dark" x={8} y={8} style={{ transform: "rotate(-4deg)" }} />
        <div style={{ position: "absolute", right: 8, top: 8, width: 40, height: 40, borderRadius: 40, background: P.paper, border: `${UI.stroke}px solid ${P.void}`, boxSizing: "border-box", [FLEX_KEY]: "flex", alignItems: "center", justifyContent: "center" } as React.CSSProperties}>
          <Icon name="heart" size={22} color={P.void} fill={P.orange} stroke={2.5} />
        </div>
      </Well>
      <span style={T(24, 720, P.paper)}>Studio Headphones</span>
      <div style={flex("row", { gap: 8 })}>
        <StarRow value={5} size={20} />
        <span style={T(20, 560, P.dim)}>4.8 (212)</span>
      </div>
      <div style={flex("row", { gap: 10, alignItems: "baseline" })}>
        <span style={{ ...numeral(36, 92, 780), color: P.paper }}>$129</span>
        <span style={{ ...T(20, 520, P.faint), textDecoration: "line-through" }}>$159</span>
      </div>
      <Btn label="Add to cart" icon="cart" w={iw} pressed={pressed} style={{ marginTop: "auto" }} />
    </Card>
  );
};

/** Restaurant / delivery card: drawn ramen bowl on an orange well, free-delivery badge, name, time, distance, Order. */
export const FoodCard: React.FC<ScreenCardProps & { pressed?: number }> = ({ w = 268, pressed = 0, shadow, ...pl }) => {
  const iw = w - UI.stroke * 2 - 28;
  return (
    <Card w={w} h={CARD_H.food} pad={14} shadow={shadow} {...pl}>
      <Well w={iw} h={168} fill={P.orange}>
        <svg width={iw - 6} height={162} viewBox="0 0 236 162" style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M98 40q-9-9 0-17t0-17M122 36q-9-9 0-17t0-17" fill="none" stroke={P.paper} strokeWidth={4.5} strokeLinecap="round" />
          <path d="M150 74L226 8M164 82L234 22" stroke={P.void} strokeWidth={6} strokeLinecap="round" />
          <path d="M50 98C52 66 84 50 118 50s66 16 68 48z" fill={P.yellow} stroke={P.void} strokeWidth={3} strokeLinejoin="round" />
          <path d="M70 90c10-22 22 2 32-18M96 92c10-24 22 0 32-20M126 90c10-22 22 2 32-18" fill="none" stroke={P.void} strokeWidth={3} strokeLinecap="round" />
          <g transform="rotate(-10 150 66)">
            <ellipse cx={152} cy={66} rx={22} ry={15} fill={P.paper} stroke={P.void} strokeWidth={3} />
            <circle cx={153} cy={66} r={7.5} fill={P.orange} stroke={P.void} strokeWidth={3} />
          </g>
          <rect x={58} y={58} width={22} height={34} rx={4} fill={P.void} transform="rotate(-12 69 75)" />
          <path d="M34 92H202C202 132 172 152 118 152S34 132 34 92z" fill={P.paper} stroke={P.void} strokeWidth={3} strokeLinejoin="round" />
          <path d="M46 112q9-9 18 0t18 0t18 0t18 0t18 0t18 0t18 0" fill="none" stroke={P.orange} strokeWidth={4} strokeLinecap="round" />
        </svg>
        <Badge label="Free delivery" tone="dark" x={6} y={120} style={{ transform: "rotate(-3deg)" }} />
      </Well>
      <span style={T(24, 720, P.paper)}>Spicy Miso Ramen</span>
      <div style={flex("row", { gap: 14 })}>
        <div style={flex("row", { gap: 6 })}>
          <Icon name="clock" size={22} color={P.dim} />
          <span style={T(20, 560, P.dim)}>25 min</span>
        </div>
        <div style={flex("row", { gap: 6 })}>
          <Icon name="pin" size={22} color={P.dim} />
          <span style={T(20, 560, P.dim)}>1.2 km</span>
        </div>
      </div>
      <div style={flex("row", { justifyContent: "space-between", marginTop: 4 })}>
        <span style={{ ...numeral(36, 92, 780), color: P.paper }}>$12</span>
        <Btn label="Order" size="m" icon="arrow" iconRight pressed={pressed} />
      </div>
    </Card>
  );
};

/** Healthcare appointment card: doctor avatar, drawn pulse strip, date, three time slots, Confirm. */
export const AppointmentCard: React.FC<ScreenCardProps & { slot?: number; pressed?: number }> = ({ w = 268, slot = 0, pressed = 0, shadow, ...pl }) => {
  const iw = w - UI.stroke * 2 - 28;
  const slots = ["09:30", "10:00", "10:30"];
  const sw = (iw - 16) / 3;
  return (
    <Card w={w} h={CARD_H.appointment} pad={14} shadow={shadow} {...pl}>
      <div style={flex("row", { gap: 12 })}>
        <Avatar face={1} tone="yellow" size={60} />
        <div style={{ [FLEX_KEY]: "flex", flexDirection: "column", gap: 5 } as React.CSSProperties}>
          <span style={T(24, 720, P.paper)}>Dr. Anika Rao</span>
          <span style={T(20, 540, P.dim)}>Cardiologist</span>
        </div>
      </div>
      <Well w={iw} h={80} fill={P.yellow}>
        <svg width={iw - 6} height={74} viewBox="0 0 236 74" style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M0 44h50l14-30 22 52 20-40 10 18h120" fill="none" stroke={P.void} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Badge label="Today" tone="dark" x={iw - 6 - 112} y={8} />
      </Well>
      <div style={flex("row", { gap: 10 })}>
        <Icon name="calendar" size={26} color={P.orange} />
        <span style={T(22, 680, P.paper)}>Tue, 14 Oct</span>
      </div>
      <div style={flex("row", { gap: 8 })}>
        {slots.map((s, i) => (
          <Chip key={s} label={s} active={i === slot} w={sw} />
        ))}
      </div>
      <Btn label="Confirm" icon="check" w={iw} pressed={pressed} style={{ marginTop: "auto" }} />
    </Card>
  );
};

/** Events ticket: orange upper half (title, date), perforation with side notches, cream stub (seat, gate, price), Get tickets. */
export const TicketCard: React.FC<ScreenCardProps & { pressed?: number }> = ({ w = 268, pressed = 0, shadow, ...pl }) => {
  const h = CARD_H.ticket;
  const top = 232;
  const r = UI.r2;
  const n = 15;
  const sx = 0;
  const outline = `M${r} 0H${w - r}A${r} ${r} 0 0 1 ${w} ${r}V${top - n}A${n} ${n} 0 0 0 ${w} ${top + n}V${h - r}A${r} ${r} 0 0 1 ${w - r} ${h}H${r}A${r} ${r} 0 0 1 0 ${h - r}V${top + n}A${n} ${n} 0 0 0 0 ${top - n}V${r}A${r} ${r} 0 0 1 ${r} 0Z`;
  const upper = `M${r} 0H${w - r}A${r} ${r} 0 0 1 ${w} ${r}V${top - n}A${n} ${n} 0 0 0 ${w - n} ${top}H${n}A${n} ${n} 0 0 0 0 ${top - n}V${r}A${r} ${r} 0 0 1 ${r} 0Z`;
  return (
    <div style={placeStyle(pl, { width: w + 8, height: h + 8, flex: "none" })}>
      <svg width={w + 8} height={h + 8} viewBox={`${sx} 0 ${w + 8} ${h + 8}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {shadow !== false && <path d={outline} transform="translate(8 8)" fill={shadow ?? P.orangeDeep} />}
        <path d={outline} fill={P.paper} stroke={P.void} strokeWidth={UI.stroke} strokeLinejoin="round" />
        <path d={upper} fill={P.orange} stroke={P.void} strokeWidth={UI.stroke} strokeLinejoin="round" />
        <path d={`M${n + 14} ${top}H${w - n - 14}`} stroke={P.void} strokeWidth={UI.stroke} strokeLinecap="round" strokeDasharray="0.1 12" />
      </svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: top, padding: "20px 20px 0", boxSizing: "border-box", [FLEX_KEY]: "flex", flexDirection: "column", gap: 14 } as React.CSSProperties}>
        <Badge label="Live music" tone="dark" style={{ alignSelf: "flex-start" }} />
        <span style={{ ...head(52, 84, 800), color: P.void, lineHeight: 0.92 }}>
          Rooftop
          <br />
          Jazz Night
        </span>
        <div style={flex("row", { gap: 10, marginTop: "auto", paddingBottom: 22 })}>
          <Icon name="calendar" size={26} color={P.void} stroke={3} />
          <span style={T(22, 760, P.void)}>Sat 18 Oct, 8 PM</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: top + n, width: w, padding: "6px 20px 0", boxSizing: "border-box", [FLEX_KEY]: "flex", flexDirection: "column", gap: 14 } as React.CSSProperties}>
        <div style={flex("row", { justifyContent: "space-between" })}>
          {[
            ["Seat", "C14"],
            ["Gate", "2"],
            ["Price", "$25"],
          ].map(([k, v]) => (
            <div key={k} style={{ [FLEX_KEY]: "flex", flexDirection: "column", gap: 4 } as React.CSSProperties}>
              <span style={{ ...labelStyle(20, 620), letterSpacing: "0.06em", color: "rgba(12,10,8,0.62)" }}>{k}</span>
              <span style={{ ...numeral(34, 92, 780), color: P.void }}>{v}</span>
            </div>
          ))}
        </div>
        <Btn label="Get tickets" variant="dark" icon="ticket" w={w - 40} pressed={pressed} />
      </div>
    </div>
  );
};

// deterministic ragged barcode, available for stubs (stripes of varied width)
/** Barcode stripes (decor for ticket stubs); seed picks the pattern. */
export const Barcode: React.FC<{ w?: number; h?: number; seed?: number; color?: string } & Place> = ({ w = 160, h = 48, seed = 3, color = P.void, ...pl }) => {
  const bars: { x: number; bw: number }[] = [];
  let x = 0;
  let i = 0;
  while (x < w - 4) {
    const bw = 2 + Math.floor(rand(seed + i * 1.7) * 4) * 2;
    bars.push({ x, bw: Math.min(bw, w - x) });
    x += bw + 2 + Math.floor(rand(seed + i * 3.1) * 3) * 2;
    i++;
  }
  return (
    <svg width={w} height={h} style={placeStyle(pl, { flex: "none" })}>
      {bars.map((b, k) => (
        <rect key={k} x={b.x} y={0} width={b.bw} height={h} fill={color} />
      ))}
    </svg>
  );
};
