// D3 NAME (film frames 240-360) = THE DROP. On 240 an orange block slams in carrying his portrait, the name hits huge, a flash fills
// frame 0. Then the pill, a doodle halo round his head, the ticker strip and (on 330) his line in a speech bubble that holds to the cut.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EO, prog } from "../../lib/anim";
import type { Cue } from "../../lib/cues";
import { pop } from "../motion";
import { BlockPhoto, IconArrowUpRight, PHOTO, Pill } from "../kit/Collage";
import { Marquee } from "../kit/Marquee";
import { ScribbleCircle, Smiley, Sparkle, SpeechBubble, Wobble } from "../kit/doodles";
import { G, P } from "../tokens";
import { head } from "../type";

const BLOCK = { x: G.x(6), y: G.y(0), w: G.CW * 6, h: G.RH * 6 };
const NAME = 250;
const NAME_LEFT = G.x(0) + 4;

/** hard slam, already moving on frame 0 so the drop is visible on its very first frame */
const slam = (f: number, delay = 0) => EO(Math.min(1, Math.max(0, (f - delay + 2.5) / 9)));

const Word: React.FC<{ f: number; delay: number; top: number; children: string }> = ({ f, delay, top, children }) => {
  const k = slam(f, delay);
  if (f < delay - 2) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: NAME_LEFT,
        top,
        ...head(NAME, 84, 800),
        lineHeight: 0.9,
        color: P.paper,
        whiteSpace: "nowrap",
        clipPath: `inset(-10px ${(1 - k) * 100}% -10px 0)`,
        transform: `translateX(${(1 - k) * -220}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const k = slam(f);
  const kf = EO(Math.min(1, f / 7)); // the orange flood that collapses into the block (full frame on frame 0)
  // block-local -> absolute
  const bx = (v: number) => BLOCK.x + v;
  const by = (v: number) => BLOCK.y + v;

  return (
    <AbsoluteFill style={{ background: P.void }}>
      {/* the drop: orange block with his B&W cut-out */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: P.orange, clipPath: `inset(${BLOCK.y * kf}px ${(1920 - BLOCK.x - BLOCK.w) * kf}px ${(1080 - BLOCK.y - BLOCK.h) * kf}px ${BLOCK.x * kf}px)` }} />
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - k) * 90}px)` }}>
        <BlockPhoto block="orange" src={PHOTO.duo} x={BLOCK.x} y={BLOCK.y} w={BLOCK.w} h={BLOCK.h} zoom={1.14} shadow={P.orangeDeep} shadowOffset={14} />
      </div>

      {/* name, pill */}
      <Word f={f} delay={0} top={96}>SURAJIT</Word>
      <Word f={f} delay={4} top={96 + NAME * 0.9 + 6}>DUTTA</Word>
      <Pill x={NAME_LEFT + 2} y={G.y(3) + 54} anchor="tl" label="Product designer · UX / UI · 4 years" icon={<IconArrowUpRight size={30} color={P.paper} />} bg={P.orange} color={P.void} chip={P.void} shadow={P.orangeDeep} height={80} fontSize={27} pop={pop(f, 15)} />

      {/* doodle halo round his head: ONE wobble for the layer */}
      <Wobble boil={4} scale={3}>
        <ScribbleCircle x={bx(462)} y={by(272)} w={450} h={540} color={P.paper} stroke={7} rotate={-6} draw={prog(f, 22, 40)} seed={3} />
        <Sparkle x={bx(812)} y={by(330)} size={120} twin color={P.paper} seed={2} draw={prog(f, 44, 54)} pop={pop(f, 44)} />
      </Wobble>
      {/* the round sticker on his ear (reference 1) */}
      <Smiley x={bx(262)} y={by(372)} size={104} rotate={-10} wink shadow={P.void} pop={pop(f, 36)} />

      {/* ticker across the bottom */}
      <Marquee
        x={960}
        y={880}
        height={88}
        angle={-3}
        speed={5}
        bg={P.paper}
        color={P.void}
        sepColor={P.orange}
        shadow={P.orangeDeep}
        frame={f + 4}
        items={["Product design", "UX", "UI", "Design systems", "Research", "Prototyping"]}
      />

      {/* his line, in a sticker bubble (lands on 330, holds to the cut) */}
      <SpeechBubble x={1010} y={790} w={660} h={206} fill={P.yellow} color={P.void} fontSize={54} plain tail="br" rotate={-3} shadow={P.orange} pop={pop(f, 90, 30, 10, 230)}>
        I make complex
        <br />
        software feel simple.
      </SpeechBubble>

    </AbsoluteFill>
  );
};

export const cues: Cue[] = [
  { f: 0, sfx: "boom", vol: 0.9 },
  { f: 0, sfx: "impact", vol: 0.8 },
  { f: 0, sfx: "gated-snare-hit", vol: 0.5 },
  { f: 2, sfx: "whoosh-retro", vol: 0.3 },
  { f: 5, sfx: "snap", vol: 0.45 },
  { f: 15, sfx: "snap", vol: 0.45 },
  { f: 22, sfx: "swish", vol: 0.3 },
  { f: 36, sfx: "snap", vol: 0.45 },
  { f: 37, sfx: "glass-tink", vol: 0.45 },
  { f: 46, sfx: "shimmer", vol: 0.25 },
  { f: 90, sfx: "snap", vol: 0.5 },
  { f: 91, sfx: "glass-tink-2", vol: 0.5 },
];
