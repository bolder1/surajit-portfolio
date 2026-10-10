// D4 · 2022 · Fortmindz (film 360-480). A drawn checkout plays in a browser window; four sticker chips light on 375/390/405/420.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { prog } from "../../lib/anim";
import type { Cue } from "../../lib/cues";
import { keySfx } from "../../lib/cues";
import { CurlyArrow, ScribbleCircle, Wobble } from "../kit/doodles";
import { Sticker } from "../kit/Collage";
import { pop } from "../motion";
import { P } from "../tokens";
import { head } from "../type";
import { LeftStack, Rail, Reveal, slam } from "./_D4/common";
import { BEATS, ShopWindow, WIN } from "./_D4/Shop";

const FROM = 360;
const STEPS = ["Cart", "Address", "Pay", "Done"];
const LIT = [BEATS.cart, BEATS.address, BEATS.pay, BEATS.done];
const CHIP_W = 166;
const CHIP_Y = 790;
const gap = (WIN.w - 4 * CHIP_W) / 3;
const chipX = (i: number) => WIN.x + CHIP_W / 2 + i * (CHIP_W + gap);

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const w = slam(f, 4, 8);
  return (
    <AbsoluteFill style={{ background: P.void }}>
      <LeftStack year="2022" name="FORTMINDZ" text="KOLKATA · UX/UI DESIGNER" icon="pin" blockFrom={-3} nameAt={0} yearAt={-4} labelAt={8} nameSize={110} />

      {/* his line, from 436 */}
      <Reveal at={76} dur={9} style={{ position: "absolute", left: 60, top: 652, width: 780, height: 74 }}>
        <div style={{ ...head(56, 88, 760), color: P.paper, whiteSpace: "nowrap", lineHeight: "60px" }}>
          Learned to <span style={{ color: P.orange }}>ship</span>
        </div>
      </Reveal>
      <Reveal at={80} dur={9} style={{ position: "absolute", left: 60, top: 712, width: 780, height: 74 }}>
        <div style={{ ...head(56, 88, 760), color: P.paper, whiteSpace: "nowrap", lineHeight: "60px" }}>on a deadline</div>
      </Reveal>
      <Reveal at={84} dur={9} style={{ position: "absolute", left: 60, top: 772, width: 780, height: 74 }}>
        <div style={{ ...head(56, 88, 760), color: P.paper, whiteSpace: "nowrap", lineHeight: "60px" }}>alongside developers.</div>
      </Reveal>

      <Rail frame={FROM + f} wipeIn />

      {/* browser window with the checkout */}
      {w.visible && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${w.lift}px) scale(${w.scale})`, transformOrigin: `${WIN.x + WIN.w / 2}px ${WIN.y + WIN.h / 2}px` }}>
          <ShopWindow f={f} />
        </div>
      )}

      {/* stepper as sticker chips */}
      {STEPS.map((s, i) => {
        const lit = f >= LIT[i];
        const bump = lit ? 1 + 0.12 * Math.max(0, 1 - (f - LIT[i]) / 6) : 1;
        return (
          <Sticker
            key={s}
            x={chipX(i)}
            y={CHIP_Y}
            rotate={[-3, 2, -2, 3][i]}
            bg={lit ? P.orange : P.card2}
            color={lit ? P.void : P.dim}
            shadow={lit ? P.orangeDeep : false}
            fontSize={28}
            pop={pop(f, 8 + i * 2) * bump}
          >
            <div style={{ width: CHIP_W - 38, textAlign: "center" }}>{s}</div>
          </Sticker>
        );
      })}

      {/* stickers on the window corners */}
      <Sticker x={WIN.x + WIN.w - 70} y={WIN.y + 2} rotate={5} bg={P.yellow} fontSize={34} pop={pop(f, 66)}>
        Websites
      </Sticker>
      <Sticker x={WIN.x + 96} y={WIN.y + WIN.h + 2} rotate={-5} bg={P.paper} fontSize={34} pop={pop(f, 72)}>
        Apps
      </Sticker>

      {/* doodles: one wobble layer, illustrations only */}
      <Wobble boil={4}>
        {[0, 1, 2].map((i) => {
          const x0 = chipX(i) + CHIP_W / 2;
          const x1 = chipX(i + 1) - CHIP_W / 2;
          return <CurlyArrow key={i} kind="tick" x={(x0 + x1) / 2} y={CHIP_Y - 4} size={Math.min(76, x1 - x0 - 8)} color={P.yellow} seed={5 + i} draw={prog(f, LIT[i] + 3, LIT[i] + 11)} />;
        })}
        <ScribbleCircle x={348} y={684} w={104} h={54} color={P.yellow} stroke={6} draw={prog(f, 92, 104)} />
      </Wobble>
    </AbsoluteFill>
  );
};

export const cues: Cue[] = [
  { f: 0, sfx: "impact", vol: 0.6 },
  { f: 4, sfx: "whoosh", vol: 0.3 },
  { f: 8, sfx: "snap", vol: 0.3 },
  { f: 12, sfx: "click", vol: 0.4 },
  { f: 13, sfx: "swish", vol: 0.25 },
  { f: 15, sfx: keySfx(0), vol: 0.5 },
  { f: 30, sfx: keySfx(1), vol: 0.5 },
  { f: 45, sfx: keySfx(2), vol: 0.5 },
  { f: 56, sfx: "click", vol: 0.4 },
  { f: 60, sfx: keySfx(3), vol: 0.55 },
  { f: 60, sfx: "glass-tink", vol: 0.45 },
  { f: 66, sfx: "snap", vol: 0.5 },
  { f: 72, sfx: "snap", vol: 0.5 },
  { f: 76, sfx: "swish", vol: 0.25 },
  { f: 92, sfx: "swish", vol: 0.25 },
];
