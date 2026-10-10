// The kit's theme: one object per film version. Every colour the kit draws with
// comes from here (or from artefact.ts for the system's own values); no other
// file in src/v6/illus carries a hex. The same component renders in all three
// films and only the theme object changes.
import { createContext, createElement, useContext } from "react";
import type { ReactNode } from "react";

export type IllusTheme = {
  surface: string; // the screen surface in dark mode (the film's ground lifted one step)
  panel: string; // a panel inside a screen, one more step
  stroke: string; // every 1 px line inside an illustration
  barHi: string; // greeked bar, titles and values
  barLo: string; // greeked bar, body and captions
  state: string; // the one lit thing per screen
  light: { surface: string; stroke: string; barHi: string; barLo: string; panel?: string };
  shadow: "elevation" | "hard" | "none";
  shadowColor: string; // elevation: the floor in shadow at its alpha; hard: the flat offset colour; none: unused
  border?: { width: number; color: string };
  font: { family: string; settings: string }; // the version's label role for the few typed words outside artefacts; Inter inside artefacts is exempt
  pool: string; // the key-light pool's base colour (the film's ink), drawn inside a slab at 6 to 10 percent
};

// Colour helpers. They parse #rgb, #rrggbb, #rrggbbaa and rgba() and return rgba() strings,
// so a theme may hold either form and a mode flip can tween between them.
export type RGBA = { r: number; g: number; b: number; a: number };

export const parseColor = (c: string): RGBA => {
  const s = c.trim();
  if (s[0] === "#") {
    const h = s.slice(1);
    const short = h.length <= 4;
    const x = (i: number) => parseInt(short ? h[i] + h[i] : h.slice(i * 2, i * 2 + 2), 16);
    return { r: x(0), g: x(1), b: x(2), a: h.length === 4 || h.length === 8 ? x(3) / 255 : 1 };
  }
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) return { r: 0, g: 0, b: 0, a: 1 };
  const p = m[1].split(",").map((v) => parseFloat(v));
  return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
};

export const rgba = ({ r, g, b, a }: RGBA) => `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${+a.toFixed(4)})`;

/** A colour at an alpha (the alpha replaces the colour's own). */
export const alpha = (c: string, a: number) => rgba({ ...parseColor(c), a });

/** Linear mix of two colours, t in 0..1, channels and alpha both. */
export const mixColor = (a: string, b: string, t: number) => {
  const A = parseColor(a);
  const B = parseColor(b);
  const k = Math.min(1, Math.max(0, t));
  return rgba({ r: A.r + (B.r - A.r) * k, g: A.g + (B.g - A.g) * k, b: A.b + (B.b - A.b) * k, a: A.a + (B.a - A.a) * k });
};

// The three films' palettes. Each hex is named once here and referenced by role below.
const V1 = { ground: "#121214", ink: "#ECE9E2", hero: "#EB5424", support: "#A9A7A1", shadow: "#050506", surface: "#1A1A1D", panel: "#202024" };
const V2 = { ground: "#0E0D0C", deep: "#1A1816", paper: "#EDE6D6", hero: "#F2C230", panel: "#221F1C" };
const V3 = { ground: "#0B0C0A", panel: "#141612", rule: "#2A2D27", cream: "#F2F0E6", hero: "#D7FF3B", inner: "#1A1D18" };

export const THEME_V1: IllusTheme = {
  surface: V1.surface,
  panel: V1.panel,
  stroke: alpha(V1.support, 0.22),
  barHi: alpha(V1.ink, 0.3),
  barLo: alpha(V1.ink, 0.14),
  state: V1.hero,
  light: { surface: V1.ink, stroke: alpha(V1.ground, 0.16), barHi: alpha(V1.ground, 0.7), barLo: alpha(V1.ground, 0.32) },
  shadow: "elevation",
  shadowColor: alpha(V1.shadow, 0.85),
  font: { family: "Archivo", settings: "'wdth' 112, 'wght' 600" },
  pool: V1.ink,
};

export const THEME_V2: IllusTheme = {
  surface: V2.deep,
  panel: V2.panel,
  stroke: alpha(V2.paper, 0.14),
  barHi: alpha(V2.paper, 0.34),
  barLo: alpha(V2.paper, 0.16),
  state: V2.hero,
  light: { surface: V2.paper, stroke: alpha(V2.deep, 0.18), barHi: alpha(V2.ground, 0.72), barLo: alpha(V2.ground, 0.34) },
  shadow: "hard",
  shadowColor: V2.deep,
  border: { width: 2, color: V2.paper },
  font: { family: "Anybody", settings: "'wdth' 100, 'wght' 600" },
  pool: V2.paper,
};

export const THEME_V3: IllusTheme = {
  surface: V3.panel,
  panel: V3.inner,
  stroke: V3.rule,
  barHi: alpha(V3.cream, 0.32),
  barLo: alpha(V3.cream, 0.14),
  state: V3.hero,
  light: { surface: V3.cream, stroke: alpha(V3.ground, 0.16), barHi: alpha(V3.ground, 0.7), barLo: alpha(V3.ground, 0.32) },
  shadow: "none",
  shadowColor: V3.rule,
  border: { width: 1, color: V3.rule },
  font: { family: "Archivo", settings: "'wdth' 112, 'wght' 600" },
  pool: V3.cream,
};

const ThemeContext = createContext<IllusTheme>(THEME_V1);

/** Wraps a film (or a preview composition) once. */
export const IllusProvider = ({ value = THEME_V1, children }: { value?: IllusTheme; children?: ReactNode }) =>
  createElement(ThemeContext.Provider, { value }, children);

export const useIllus = () => useContext(ThemeContext);

// Mode. A Slab sets the mode for everything inside it, so a Bar in a light slab
// picks the light tones on its own. Stored as a number 0..1 (0 dark, 1 light) so a
// mode flip can tween it; "dark" and "light" are accepted everywhere a mode is.
export type Mode = "dark" | "light" | number;

export const modeT = (m: Mode | undefined, fallback = 0) => (m === undefined ? fallback : m === "dark" ? 0 : m === "light" ? 1 : Math.min(1, Math.max(0, m)));

const ModeContext = createContext<number>(0);

export const IllusMode = ({ value, children }: { value: number; children?: ReactNode }) => createElement(ModeContext.Provider, { value }, children);

/** The mode of the nearest Slab, 0..1. */
export const useIllusMode = () => useContext(ModeContext);

export type Tone = "surface" | "panel" | "stroke" | "hi" | "lo" | "state";

/** The colour for a tone at a mode in 0..1; between 0 and 1 the two mode values tween. */
export const toneColor = (th: IllusTheme, t: number, tone: Tone): string => {
  const dark =
    tone === "surface" ? th.surface : tone === "panel" ? th.panel : tone === "stroke" ? th.stroke : tone === "hi" ? th.barHi : tone === "lo" ? th.barLo : th.state;
  if (tone === "state") return th.state;
  const light =
    tone === "surface"
      ? th.light.surface
      : tone === "panel"
        ? (th.light.panel ?? th.light.surface)
        : tone === "stroke"
          ? th.light.stroke
          : tone === "hi"
            ? th.light.barHi
            : th.light.barLo;
  return t <= 0 ? dark : t >= 1 ? light : mixColor(dark, light, t);
};
