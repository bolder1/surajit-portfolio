/**
 * resolve — walk a binding down to a painted colour, the way Figma does.
 *
 * This is the multimapping expressed as code. A component holds one token
 * name; two independent mode axes are applied to it, in order, and only at
 * the bottom does a hex appear. The page runs this live rather than showing a
 * picture of it, because "one binding, four values" is a claim that should be
 * checkable by clicking.
 */

import { ROUTED_TOKENS, THEME_ROWS, type ModeRow } from "./figmaData";

export type Brand = "Blue" | "Orange";
export type Appearance = "onLight" | "onDark";

export type Hop = {
  /** Which collection this hop lives in. */
  collection: string;
  /** The variable name at this hop. */
  token: string;
  /** The mode that selected the next hop, if this hop had one. */
  via?: string;
};

export type Resolution = {
  hops: Hop[];
  /** The primitive the chain lands on. */
  primitive: string | null;
  /** The published value, verbatim — may carry an alpha suffix. */
  raw: string;
  /** The same value as something CSS can paint. */
  css: string;
};

const themeByToken = new Map(THEME_ROWS.map((r) => [r.token, r]));
const routedByToken = new Map(ROUTED_TOKENS.map((r) => [r.token, r]));

/**
 * Figma publishes alpha steps as `#RRGGBB @NN%`, which is not a colour any
 * browser accepts. Converted here rather than at extraction time so the raw
 * string can still be shown next to the swatch — the point of the page is that
 * these are the real published values, including their formatting.
 */
export function toCss(value: string): string {
  const m = /^(#[0-9a-fA-F]{6})\s*@\s*(\d+)%$/.exec(value.trim());
  if (!m) return value.trim();
  const [, hex, pct] = m;
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${Number(pct) / 100})`;
}

/** True when the value carries an alpha suffix rather than being opaque. */
export function isAlpha(value: string): boolean {
  return /@\s*\d+%$/.test(value.trim());
}

export function resolve(
  binding: string,
  brand: Brand,
  appearance: Appearance
): Resolution | null {
  const row = routedByToken.get(binding);
  if (!row) return null;

  const themeToken = row[appearance].alias;
  const hops: Hop[] = [
    { collection: "Mode", token: binding, via: appearance },
  ];

  if (!themeToken) {
    return {
      hops,
      primitive: null,
      raw: row[appearance].value,
      css: toCss(row[appearance].value),
    };
  }

  hops.push({ collection: "Theme", token: themeToken, via: brand });

  const themeRow = themeByToken.get(themeToken);
  if (!themeRow) {
    return { hops, primitive: null, raw: "—", css: "transparent" };
  }

  const leaf = themeRow[brand];
  if (leaf.alias) hops.push({ collection: "_global-colors", token: leaf.alias });

  return {
    hops,
    primitive: leaf.alias,
    raw: leaf.value,
    css: toCss(leaf.value),
  };
}

/** All four resolutions of one binding, for the "one binding, four values" plate. */
export function resolveAll(binding: string) {
  const out: { brand: Brand; appearance: Appearance; res: Resolution }[] = [];
  for (const appearance of ["onLight", "onDark"] as const) {
    for (const brand of ["Blue", "Orange"] as const) {
      const res = resolve(binding, brand, appearance);
      if (res) out.push({ brand, appearance, res });
    }
  }
  return out;
}

/**
 * The bindings a Button surface actually uses, in paint order.
 * Picked from the routed set so every one of them demonstrates the full
 * two-hop chain rather than resolving in one.
 */
export const SURFACE_BINDINGS: { label: string; token: string }[] = (
  [
    ["Background", "interactive/background/primary/default"],
    ["Background · hover", "interactive/background/primary/highlighted"],
    ["Background · disabled", "interactive/background/primary/disabled"],
    ["Border", "interactive/border/primary/default"],
    ["Label", "interactive/text/primary/normal"],
    ["Icon", "interactive/icon/primary/normal"],
  ] as const
)
  .filter(([, token]) => routedByToken.has(token))
  .map(([label, token]) => ({ label, token }));

export type { ModeRow };
