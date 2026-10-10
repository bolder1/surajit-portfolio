// D6 · 2024 → NOW · miniOrange (film 600-780). His real work only: the MODS cover and two UEM Figma crops as tilted collage cards
// on an orange block; on 720 a straight orange line draws across and three spec stickers land on it.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EO, prog } from "../../lib/anim";
import type { Cue } from "../../lib/cues";
import { ScribbleUnderline, Sparkle, Wobble } from "../kit/doodles";
import { Pill, Sticker, TiltCard } from "../kit/Collage";
import { flex, Icon } from "../kit/ui";
import { pop, wob } from "../motion";
import { G, P } from "../tokens";
import { head, label } from "../type";
import { Reveal } from "./_D4/common";

const BLOCK = { x: G.x(7), y: G.y(0), w: G.CW * 5, h: G.RH * 4 };
const LINE_Y = G.y(5);
/** small sway of the stickers once they have landed */
const sw = (f: number, ph: number) => (f > 142 ? wob(f, 1.1, 40, ph) : 0);
const quoteStyle: React.CSSProperties = { ...head(54, 88, 740), color: P.paper, whiteSpace: "nowrap", lineHeight: "64px", paddingTop: 0 };

/** The "→" of 2024 → NOW: drawn as SVG (the font has no arrow). */
const Arrow: React.FC<{ draw: number }> = ({ draw }) => (
  <svg width={120} height={84} viewBox="0 0 120 84" style={{ flex: "none", overflow: "visible" }}>
    <path d="M8 42H108" stroke={P.orange} strokeWidth={15} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray="1 1.01" strokeDashoffset={1 - Math.min(1, draw * 1.25)} />
    <path d="M74 10L108 42L74 74" stroke={P.orange} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" fill="none" pathLength={1} strokeDasharray="1 1.01" strokeDashoffset={1 - Math.max(0, Math.min(1, (draw - 0.7) / 0.3))} />
  </svg>
);

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const blockT = prog(f, -4, 6, EO);
  const float = (ph: number) => (f > 20 ? Math.sin(((f + ph) / 48) * Math.PI * 2) * 3 : 0);
  const lineP = prog(f, 120, 138, EO);
  const cardPop = (at: number) => Math.min(1.08, pop(f, at));
  const tilt = (at: number, base: number) => base - (1 - Math.min(1, pop(f, at))) * 10;

  return (
    <AbsoluteFill style={{ background: P.void }}>
      {/* orange block for the work */}
      <div style={{ position: "absolute", left: BLOCK.x, top: BLOCK.y, width: BLOCK.w, height: BLOCK.h, background: P.orange, transform: `scaleX(${blockT})`, transformOrigin: "100% 50%" }} />

      {/* his real work, tilted collage cards */}
      <TiltCard src="img/d/f06-mods-cover.png" x={1485} y={284 + float(0)} w={620} h={372} rotate={tilt(15, -4)} pop={cardPop(15)} shadow={P.void} radius={20} focus="center">
        <Sticker x={62} y={-6} rotate={-6} bg={P.yellow} fontSize={22} pop={pop(f, 19)}>
          MODS v1.0
        </Sticker>
      </TiltCard>
      <TiltCard src="img/d/f06-uem-components.png" x={1380} y={584 + float(16)} w={520} h={198} rotate={tilt(30, 3)} pop={cardPop(30)} shadow={P.void} radius={20} focus="center">
        <Sticker x={116} y={194} rotate={-4} bg={P.paper} fontSize={22} pop={pop(f, 34)}>
          UEM components
        </Sticker>
      </TiltCard>
      <TiltCard src="img/d/f06-uem-screens.png" x={1664} y={606 + float(32)} w={400} h={232} rotate={tilt(45, -5)} pop={cardPop(45)} shadow={P.void} radius={20} focus="center">
        <Sticker x={330} y={4} rotate={5} bg={P.yellow} fontSize={22} pop={pop(f, 49)}>
          UEM screens
        </Sticker>
      </TiltCard>

      {/* left column */}
      <div style={{ position: "absolute", left: 52, top: 104, ...flex("row", { gap: 26, height: 150 }) }}>
        <Reveal at={-4} dur={9} style={{ height: 150 }}>
          <div style={{ ...head(168, 84, 800), color: P.paper, lineHeight: "150px" }}>2024</div>
        </Reveal>
        <Arrow draw={prog(f, 6, 18)} />
        <Reveal at={15} dur={8} style={{ height: 150 }}>
          <div style={{ ...head(168, 84, 800), color: P.orange, lineHeight: "150px" }}>NOW</div>
        </Reveal>
      </div>
      <Reveal at={30} dur={9} style={{ position: "absolute", left: 56, top: 290, width: 880, height: 124 }}>
        <div style={{ ...head(132, 84, 800), color: P.paper, lineHeight: "124px", whiteSpace: "nowrap" }}>
          MINI<span style={{ color: P.orange }}>ORANGE</span>
        </div>
      </Reveal>
      <Reveal at={36} dur={8} style={{ position: "absolute", left: 60, top: 440, width: 200, height: 52 }}>
        <div style={flex("row", { gap: 12, height: 52 })}>
          <Icon name="pin" size={34} color={P.orange} />
          <span style={{ ...label(32, 680), color: P.paper }}>PUNE</span>
        </div>
      </Reveal>
      <Pill x={250} y={438} label="Product designer" height={56} fontSize={22} bg={P.orange} color={P.void} shadow={P.orangeDeep} anchor="tl" pop={pop(f, 45)} />

      {/* his line, from 675 */}
      <Reveal at={75} dur={9} style={{ position: "absolute", left: 60, top: 556, width: 900, height: 76 }}>
        <div style={quoteStyle}>Enterprise software for IT,</div>
      </Reveal>
      <Reveal at={80} dur={9} style={{ position: "absolute", left: 60, top: 616, width: 900, height: 76 }}>
        <div style={quoteStyle}>
          <span style={{ color: P.yellow }}>identity &amp; security</span> teams.
        </div>
      </Reveal>

      {/* the straight orange line (720) and the three spec stickers */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={60} y1={LINE_Y} x2={60 + 1800 * lineP} y2={LINE_Y} stroke={P.orange} strokeWidth={10} strokeLinecap="round" opacity={lineP > 0 ? 1 : 0} />
      </svg>
      <Sticker x={228} y={LINE_Y} rotate={-2 + sw(f, 0)} bg={P.paper} color={P.void} shadow={P.orange} fontSize={28} pop={pop(f, 121)}>
        MODS design system
      </Sticker>
      <Sticker x={611} y={LINE_Y} rotate={-2 + sw(f, 9)} bg={P.yellow} fontSize={34} pop={pop(f, 126)}>
        One stroke weight
      </Sticker>
      <Sticker x={1046} y={LINE_Y} rotate={2 + sw(f, 18)} bg={P.paper} fontSize={34} pop={pop(f, 132)}>
        Two corner radii
      </Sticker>
      <Sticker x={1513} y={LINE_Y} rotate={-2 + sw(f, 27)} bg={P.yellow} fontSize={34} pop={pop(f, 138)}>
        Three spacing scales
      </Sticker>

      {/* doodles: one wobble layer */}
      <Wobble boil={4}>
        <Sparkle x={1160} y={118} size={70} color={P.yellow} twin pop={pop(f, 17)} draw={prog(f, 17, 27)} />
        <ScribbleUnderline x={247} y={700} w={384} thickness={11} color={P.orange} draw={prog(f, 92, 108)} />
        <Sparkle x={1858} y={LINE_Y - 44} size={58} color={P.yellow} pop={lineP >= 1 ? pop(f, 138) : 0} />
      </Wobble>
    </AbsoluteFill>
  );
};

export const cues: Cue[] = [
  { f: 0, sfx: "impact", vol: 0.6 },
  { f: 15, sfx: "snap", vol: 0.5 },
  { f: 17, sfx: "glass-tink", vol: 0.35 },
  { f: 30, sfx: "snap", vol: 0.5 },
  { f: 45, sfx: "snap", vol: 0.5 },
  { f: 75, sfx: "swish", vol: 0.3 },
  { f: 92, sfx: "swish", vol: 0.25 },
  { f: 120, sfx: "synth-stab", vol: 0.85 },
  { f: 120, sfx: "whoosh-retro", vol: 0.35 },
  { f: 126, sfx: "snap", vol: 0.5 },
  { f: 132, sfx: "snap", vol: 0.5 },
  { f: 138, sfx: "snap", vol: 0.55 },
  { f: 138, sfx: "glass-tink", vol: 0.5 },
];
