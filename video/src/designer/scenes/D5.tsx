// D5 · 2023 · Impero IT (film 480-600). Three phones land on 480/495/510; on 540 their components fly out and snap into a board.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { prog } from "../../lib/anim";
import type { Cue } from "../../lib/cues";
import { CurlyArrow, Sparkle, Wobble } from "../kit/doodles";
import { Sticker } from "../kit/Collage";
import { pop } from "../motion";
import { P } from "../tokens";
import { LeftStack, Rail } from "./_D4/common";
import { Board, Flyers, Phones, TAG_AT } from "./_D5/Library";

const FROM = 480;

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: P.void }}>
      <LeftStack year="2023" name="IMPERO IT" text="UX/UI DESIGNER" icon="layers" nameAt={-3} yearAt={-4} labelAt={6} nameSize={112} />

      <Board f={f} />
      <Phones f={f} />
      <Rail frame={FROM + f} />
      <Flyers f={f} />

      {/* his line, as a sticker on 575 */}
      <Sticker x={340} y={744} rotate={-3} bg={P.yellow} fontSize={54} plain pop={pop(f, 95)}>
        Felt the pull
        <br />
        toward enterprise.
      </Sticker>

      <Wobble boil={4}>
        <CurlyArrow kind="swoop" flip x={800} y={762} size={220} color={P.yellow} draw={prog(f, 100, 114)} />
        <Sparkle x={1846} y={548} size={64} color={P.yellow} pop={pop(f, TAG_AT + 1)} />
      </Wobble>
    </AbsoluteFill>
  );
};

export const cues: Cue[] = [
  { f: 0, sfx: "impact", vol: 0.6 },
  { f: 3, sfx: "snap", vol: 0.35 },
  { f: 15, sfx: "impact-soft", vol: 0.5 },
  { f: 18, sfx: "snap", vol: 0.35 },
  { f: 30, sfx: "impact-soft", vol: 0.5 },
  { f: 33, sfx: "snap", vol: 0.35 },
  { f: 60, sfx: "whoosh", vol: 0.5 },
  { f: 72, sfx: "snap", vol: 0.4 },
  { f: 76, sfx: "snap", vol: 0.4 },
  { f: 79, sfx: "blip-hi", vol: 0.35 },
  { f: 83, sfx: "snap", vol: 0.4 },
  { f: 85, sfx: "snap", vol: 0.4 },
  { f: 88, sfx: "glass-tink", vol: 0.5 },
  { f: 95, sfx: "snap", vol: 0.55 },
  { f: 95, sfx: "glass-tink-2", vol: 0.4 },
  { f: 100, sfx: "swish", vol: 0.25 },
];
