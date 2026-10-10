// Designer kit, collage layer: cut-out photo on a flat colour block, tilted screenshot cards, stickers, pill buttons.
// x,y are the CENTRE of the element unless `anchor` says otherwise (BlockPhoto defaults to the top-left corner: it snaps to grid cells).
import React from "react";
import { Img, staticFile } from "remotion";
import { DS, P } from "../tokens";
import { label, sans } from "../type";
import { type Anchor, placeStyle, shadowLocal } from "./doodles";

/** Ready-made static paths of the house portraits (1500 x 1800 RGBA cut-outs). */
export const PHOTO = {
  clean: staticFile("img/d/portrait-clean.png"),
  duo: staticFile("img/d/portrait-duo.png"),
  rim: staticFile("img/d/portrait-rim.png"),
};

const BLOCKS = { orange: P.orange, yellow: P.yellow, cream: P.paper } as const;
export type BlockName = keyof typeof BLOCKS;
/** Hard-shadow colour that suits a flat fill. */
const shadowFor = (fill: string) => (fill === P.orange ? P.orangeDeep : fill === P.paper || fill === P.yellow ? P.orange : P.orangeDeep);
const resolveSrc = (src: string) => (/^(https?:|data:|blob:|\/)/.test(src) ? src : staticFile(src));

/** CSS box-shadow value for a hard offset shadow that keeps its screen direction when the box is rotated. */
const hardShadow = (color: string | false, rotate: number, scale: number, d: number) => {
  if (!color) return undefined;
  const [lx, ly] = shadowLocal(rotate, scale, false, d);
  return `${lx.toFixed(2)}px ${ly.toFixed(2)}px 0 0 ${color}`;
};

/* ------------------------------------------------------------------ BlockPhoto */

export interface BlockPhotoProps {
  /** block colour name or any CSS colour */
  block?: BlockName | string;
  /** image: PHOTO.duo / PHOTO.clean, a static path ("img/d/portrait-duo.png") or a URL */
  src: string;
  /** top-left of the block in px (anchor changes that) and its size - use whole grid cells: G.x(7), G.y(0), 6 * G.CW, 6 * G.RH */
  x: number;
  y: number;
  w: number;
  h: number;
  anchor?: Anchor;
  /** photo height as a multiple of the block height (default 1.22: the head pokes above the block). Never smaller than "cover". */
  zoom?: number;
  /** 0..1: which part of the photo sits at the block centre horizontally (default 0.5) */
  focusX?: number;
  /** nudge the photo (px) */
  offsetX?: number;
  offsetY?: number;
  /** let the photo rise above the block top (default true) */
  overflowTop?: boolean;
  /** corner radius of the block (default 0) */
  radius?: number;
  /** hard shadow colour of the block, false for none (default depends on the block colour) */
  shadow?: string | false;
  shadowOffset?: number;
  rotate?: number;
  pop?: number;
  /** natural size of the image (default 1500 x 1800) */
  imgW?: number;
  imgH?: number;
  /** overlay in BLOCK coordinates (0,0 = block top-left): stickers, doodles */
  children?: React.ReactNode;
}

/** Flat colour block with a cut-out photo standing on its bottom edge (reference 1/4 treatment), hard shadow. */
export const BlockPhoto: React.FC<BlockPhotoProps> = ({
  block = "orange", src, x, y, w, h, anchor = "tl", zoom = 1.22, focusX = 0.5, offsetX = 0, offsetY = 0, overflowTop = true, radius = 0, shadow, shadowOffset = 14,
  rotate = 0, pop = 1, imgW = 1500, imgH = 1800, children,
}) => {
  if (pop <= 0.001) return null;
  const fill = BLOCKS[block as BlockName] ?? block;
  const sh = shadow === undefined ? shadowFor(fill) : shadow;
  const ph = Math.max(h * zoom, (w * imgH) / imgW);
  const pw = (ph * imgW) / imgH;
  const left = (w - pw) * focusX + offsetX;
  const top = h - ph + offsetY;
  const clip = `inset(${overflowTop ? "-4000px" : "0px"} 0px 0px 0px round 0px 0px ${radius}px ${radius}px)`;
  return (
    <div style={placeStyle(x, y, w, h, anchor, rotate, pop)}>
      <div style={{ position: "absolute", inset: 0, background: fill, borderRadius: radius, boxShadow: hardShadow(sh, rotate, pop, shadowOffset) }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, clipPath: clip }}>
        <Img src={resolveSrc(src)} style={{ position: "absolute", left, top, width: pw, height: ph, maxWidth: "none" }} />
      </div>
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ TiltCard */

/** Tilted screenshot / mock-up card: rounded corners, hard shadow, optional piece of tape. */
export const TiltCard: React.FC<{
  /** image path (static path or URL) */
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** degrees (default -4) */
  rotate?: number;
  /** hard shadow colour, false for none (default void; pass P.orange on a dark ground) */
  shadow?: string | false;
  shadowOffset?: number;
  radius?: number;
  /** frame width in px around the image (default 0) */
  border?: number;
  borderColor?: string;
  /** piece of tape at the top edge: true for yellow or a colour */
  tape?: boolean | string;
  /** CSS object-position of the image inside the card (default "top left") */
  focus?: string;
  fit?: "cover" | "contain";
  pop?: number;
  anchor?: Anchor;
  /** overlay in card coordinates */
  children?: React.ReactNode;
}> = ({ src, x, y, w, h, rotate = -4, shadow = P.void, shadowOffset = 12, radius = DS.R2, border = 0, borderColor = P.paper, tape = false, focus = "top left", fit = "cover", pop = 1, anchor = "c", children }) => {
  if (pop <= 0.001) return null;
  const tapeCol = typeof tape === "string" ? tape : P.yellow;
  return (
    <div style={placeStyle(x, y, w, h, anchor, rotate, pop)}>
      <div style={{ position: "absolute", inset: 0, borderRadius: radius, background: P.card, boxShadow: hardShadow(shadow, rotate, pop, shadowOffset), border: border ? `${border}px solid ${borderColor}` : undefined, boxSizing: "border-box", overflow: "hidden" }}>
        <Img src={resolveSrc(src)} style={{ width: "100%", height: "100%", objectFit: fit, objectPosition: focus }} />
      </div>
      {tape ? <div style={{ position: "absolute", left: w / 2 - 70, top: -18, width: 140, height: 38, background: tapeCol, transform: "rotate(-3deg)", borderRadius: 4 }} /> : null}
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ Sticker */

/** Rounded label sticker with a hard shadow: short uppercase text. */
export const Sticker: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  rotate?: number;
  bg?: string;
  color?: string;
  fontSize?: number;
  /** hard shadow colour, false for none (default follows bg) */
  shadow?: string | false;
  shadowOffset?: number;
  radius?: number;
  pop?: number;
  anchor?: Anchor;
  /** keep case as written */
  plain?: boolean;
}> = ({ x, y, children, rotate = -3, bg = P.yellow, color = P.void, fontSize = 30, shadow, shadowOffset = 7, radius = DS.R1, pop = 1, anchor = "c", plain = false }) => {
  if (pop <= 0.001) return null;
  const sh = shadow === undefined ? shadowFor(bg) : shadow;
  const [ax, ay] = anchorPct(anchor);
  const pad = Math.round(fontSize * 0.32);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: "max-content",
        padding: `${pad}px ${Math.round(pad * 2.1)}px ${pad + 2}px`,
        background: bg,
        color,
        borderRadius: radius,
        boxShadow: hardShadow(sh, rotate, pop, shadowOffset),
        transform: `translate(${ax}%, ${ay}%) rotate(${rotate}deg) scale(${pop})`,
        transformOrigin: "50% 50%",
        whiteSpace: "nowrap",
        ...sans(800, 90, 48),
        fontSize,
        lineHeight: 1,
        letterSpacing: plain ? "0" : "0.03em",
        textTransform: plain ? "none" : "uppercase",
      }}
    >
      {children}
    </div>
  );
};

const anchorPct = (a: Anchor): [number, number] => {
  const s = placeStyle(0, 0, 1, 1, a).transform as string;
  const m = /translate\((-?\d+)%, (-?\d+)%\)/.exec(s);
  return m ? [Number(m[1]), Number(m[2])] : [-50, -50];
};

/* ------------------------------------------------------------------ icons + Pill */

/** Drawn play triangle (rounded), fits a 24 px grid scaled to `size`. */
export const IconPlay: React.FC<{ size?: number; color?: string }> = ({ size = 28, color = P.paper }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ verticalAlign: "middle" }}>
    <path d="M8 5.2L19 12L8 18.8Z" fill={color} stroke={color} strokeWidth={2.4} strokeLinejoin="round" />
  </svg>
);

/** Drawn up-right arrow (the arrow glyph the font lacks). */
export const IconArrowUpRight: React.FC<{ size?: number; color?: string; stroke?: number }> = ({ size = 28, color = P.paper, stroke = 3 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ verticalAlign: "middle" }} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 17.5L17.5 6.5" />
    <path d="M8.5 6.5H17.5V15.5" />
  </svg>
);

/** Drawn right arrow. */
export const IconArrowRight: React.FC<{ size?: number; color?: string; stroke?: number }> = ({ size = 28, color = P.paper, stroke = 3 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ verticalAlign: "middle" }} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 12H19.5" />
    <path d="M13.5 6L19.5 12L13.5 18" />
  </svg>
);

/** Pill button: label plus a round icon chip (use IconPlay / IconArrowUpRight / IconArrowRight, or any SVG). */
export const Pill: React.FC<{
  x: number;
  y: number;
  label: string;
  /** icon shown in a round chip (e.g. <IconPlay/>); none = plain pill */
  icon?: React.ReactNode;
  iconSide?: "left" | "right";
  bg?: string;
  color?: string;
  /** chip colour behind the icon */
  chip?: string;
  /** pill height in px (default 76) */
  height?: number;
  fontSize?: number;
  shadow?: string | false;
  shadowOffset?: number;
  rotate?: number;
  pop?: number;
  anchor?: Anchor;
}> = ({ x, y, label: text, icon, iconSide = "right", bg = P.paper, color = P.void, chip = P.void, height = 76, fontSize = 27, shadow, shadowOffset = 7, rotate = 0, pop = 1, anchor = "c" }) => {
  if (pop <= 0.001) return null;
  const sh = shadow === undefined ? shadowFor(bg) : shadow;
  const [ax, ay] = anchorPct(anchor);
  const gap = Math.round(height * 0.12);
  const chipD = height - gap * 2;
  const pad = Math.round(height * 0.4);
  const left = iconSide === "left" && icon ? chipD + gap * 2 + Math.round(pad * 0.4) : pad;
  const right = iconSide === "right" && icon ? chipD + gap * 2 + Math.round(pad * 0.4) : pad;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: "max-content",
        height,
        boxSizing: "border-box",
        paddingLeft: left,
        paddingRight: right,
        background: bg,
        color,
        borderRadius: height / 2,
        boxShadow: hardShadow(sh, rotate, pop, shadowOffset),
        transform: `translate(${ax}%, ${ay}%) rotate(${rotate}deg) scale(${pop})`,
        transformOrigin: "50% 50%",
        whiteSpace: "nowrap",
        ...label(fontSize, 700),
        lineHeight: `${height}px`,
      }}
    >
      {text}
      {icon ? (
        <div style={{ position: "absolute", top: gap, [iconSide === "left" ? "left" : "right"]: gap, width: chipD, height: chipD, borderRadius: chipD / 2, background: chip, textAlign: "center", lineHeight: `${chipD}px` }}>
          {icon}
        </div>
      ) : null}
    </div>
  );
};
