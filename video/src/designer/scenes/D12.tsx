// D12 INVITATION (abs 1380-1560). The final lift on local 0: orange block + his portrait slam in on frame 0, SURAJIT DUTTA. huge, role, pill, contacts,
// his line. A hand-drawn underline under "that lasts." lands EXACTLY on local 120 (abs 1500, the final chord) as the rotating badge stops with the band.
// Hold, then dim to black over the last 20 frames (160-180).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, EO } from "../../lib/anim";
import type { Cue } from "../../lib/cues";
import { G, P } from "../tokens";
import { body, head } from "../type";
import { pop } from "../motion";
import { RingBadge, ScribbleUnderline, Smiley, Sparkle } from "../kit/doodles";
import { BlockPhoto, PHOTO, Pill, IconArrowUpRight } from "../kit/Collage";
import { IconTile } from "../kit/ui";

const HIT = 120; // the final chord (abs 1500)
const X0 = G.x(6) + 30; // right column
const NAME_FS = 176;
const NAME_LH = 0.9;
const NAME_Y = 140;
const ROLE_Y = NAME_Y + 2 * NAME_FS * NAME_LH + 22;
const PILL_Y = ROLE_Y + 56 + 20;
const CONTACT_Y = PILL_Y + 76 + 24;
const TAG_Y = CONTACT_Y + 2 * 68 + 34;
const TAG_FS = 70;
const TAG_LH = 72;

/** 0..1 slam progress that is already `start` visible ON its first frame (so the lift lands on frame `at`) */
const slam = (f: number, at: number, dur = 9, start = 0.3) => (f < at ? 0 : start + (1 - start) * interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: EO }));

/** rotating things keep their rate until 104, then ease to a dead stop exactly on the chord */
const rate = (f: number) => {
  const t = interpolate(f, [104, HIT], [0, 1], clamp);
  return (1 - t) * (1 - t);
};
const travel = (f: number) => {
  let s = 0;
  for (let k = 0; k < f; k++) s += rate(k);
  return s;
};

/** one line of big type that rises out of a mask */
const MaskLine: React.FC<{ t: number; h: number; top: number; left?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ t, h, top, left = X0, children, style }) =>
  t <= 0 ? null : (
    <div style={{ position: "absolute", left, top, width: 1860 - left, height: h, overflow: "hidden" }}>
      <div style={{ transform: `translateY(${(1 - t) * 108}%)`, whiteSpace: "nowrap", ...style }}>{children}</div>
    </div>
  );

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const m = travel(f);
  // 1. the block + portrait slam in from the left, already 40% in on frame 0
  const blk = slam(f, 0, 11, 0.4);
  const nameH = NAME_FS * NAME_LH;
  const tag = (at: number) => slam(f, at, 12, 0);
  const flash = interpolate(f, [0, 3], [0.16, 0], clamp);
  const dim = interpolate(f, [160, 180], [0, 1], clamp);
  const underline = interpolate(f, [HIT - 9, HIT], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) * 0.4 + x * x * 0.6 });
  const rows = [
    { icon: "mail" as const, text: "surajit3255@gmail.com", at: 36 },
    { icon: "globe" as const, text: "surajit-dutta.vercel.app", at: 42 },
  ];
  return (
    <AbsoluteFill style={{ background: P.void }}>
      {/* portrait on the orange block (cols 0-5, rows 1-5), head pokes up into row 0 */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${-(1 - blk) * 900}px)` }}>
        <BlockPhoto block="orange" src={PHOTO.duo} x={G.x(0)} y={G.y(1)} w={6 * G.CW} h={5 * G.RH} zoom={1.22} shadow={P.orangeDeep} shadowOffset={14}>
          <Sparkle x={800} y={70} size={92} color={P.yellow} twin rotate={6 * Math.sin(m * 0.12)} pop={pop(f, 26)} seed={3} />
        </BlockPhoto>
      </div>
      <RingBadge x={G.x(0) + 128} y={G.y(4) + 84} size={236} items={["Open to work", "Usually replies in a day"]} speed={0} angle={m * 1.5} pop={pop(f, 24)} shadow={P.void} bg={P.paper} ink={P.void}>
        <Smiley x={0} y={0} size={72} wink />
      </RingBadge>

      {/* name */}
      <MaskLine t={slam(f, 0, 9, 0.3)} h={nameH + 12} top={NAME_Y} style={{ ...head(NAME_FS, 86, 800), color: P.paper, lineHeight: `${nameH}px` }}>
        SURAJIT
      </MaskLine>
      <MaskLine t={slam(f, 4, 9, 0.3)} h={nameH + 12} top={NAME_Y + nameH} style={{ ...head(NAME_FS, 86, 800), color: P.paper, lineHeight: `${nameH}px` }}>
        DUTTA<span style={{ color: P.orange }}>.</span>
      </MaskLine>
      {/* role */}
      <MaskLine t={tag(12)} h={60} top={ROLE_Y} style={{ ...head(46, 90, 700), letterSpacing: "0.1em", color: P.yellow, lineHeight: "56px" }}>
        PRODUCT DESIGNER
      </MaskLine>
      {/* pill */}
      <Pill x={X0} y={PILL_Y} anchor="tl" label="Open to senior roles & select freelance" icon={<IconArrowUpRight size={30} color={P.paper} />} bg={P.orange} color={P.void} chip={P.void} height={76} fontSize={24} shadow={P.orangeDeep} rotate={-1} pop={pop(f, 20)} />
      {/* contacts */}
      {rows.map((r, i) => {
        const y = CONTACT_Y + i * 68;
        const t = slam(f, r.at, 10, 0);
        return t > 0 ? (
          <div key={r.text} style={{ position: "absolute", left: X0, top: y, width: 860, height: 60, overflow: "hidden" }}>
            <div style={{ transform: `translateX(${-(1 - t) * 110}%)` }}>
              <IconTile name={r.icon} size={60} tone="yellow" x={0} y={0} />
              <div style={{ position: "absolute", left: 84, top: 0, height: 60, lineHeight: "60px", whiteSpace: "nowrap", color: P.paper, ...body(38, 600) }}>{r.text}</div>
            </div>
          </div>
        ) : null;
      })}
      {/* his line */}
      <MaskLine t={tag(52)} h={TAG_LH + 4} top={TAG_Y} style={{ ...head(TAG_FS, 92, 700), color: P.paper, lineHeight: `${TAG_LH}px`, textTransform: "none", letterSpacing: "-0.01em" }}>
        Let&apos;s build something
      </MaskLine>
      <MaskLine t={tag(58)} h={TAG_LH + 8} top={TAG_Y + TAG_LH} style={{ ...head(TAG_FS, 92, 700), color: P.paper, lineHeight: `${TAG_LH}px`, textTransform: "none", letterSpacing: "-0.01em" }}>
        that lasts.
      </MaskLine>
      {/* the final chord: the underline lands on HIT */}
      <ScribbleUnderline x={X0 + 140} y={TAG_Y + 2 * TAG_LH + 16} w={290} thickness={16} color={P.orange} rotate={-2} draw={underline} seed={9} />
      <Sparkle x={X0 + 338} y={TAG_Y + TAG_LH + 36} size={74} color={P.yellow} rotate={8} pop={f >= HIT ? pop(f, HIT) : 0} seed={5} />

      <AbsoluteFill style={{ background: P.orange, opacity: flash }} />
      <AbsoluteFill style={{ background: P.void, opacity: dim }} />
    </AbsoluteFill>
  );
};

export const cues: Cue[] = [
  { f: 0, sfx: "impact", vol: 0.85 },
  { f: 0, sfx: "snap", vol: 0.5 },
  { f: 4, sfx: "snap", vol: 0.4 },
  { f: 12, sfx: "swish", vol: 0.3 },
  { f: 20, sfx: "snap", vol: 0.45 },
  { f: 20, sfx: "glass-tink", vol: 0.4 },
  { f: 24, sfx: "glass-tink-2", vol: 0.4 },
  { f: 36, sfx: "click", vol: 0.3 },
  { f: 42, sfx: "click", vol: 0.3 },
  { f: 52, sfx: "swish", vol: 0.3 },
  { f: 111, sfx: "swish", vol: 0.4 },
  { f: HIT, sfx: "boom", vol: 0.6 },
  { f: HIT, sfx: "glass-tink", vol: 0.55 },
  { f: HIT, sfx: "snap", vol: 0.5 },
];
