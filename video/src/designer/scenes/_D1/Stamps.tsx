// D1's year stamps (2016 / 2019), their label stickers, the "engineer first" ring badge and the landing sparkles.
// Shared with D2, which sweeps them out in its first frames (exit 0..1) so the trace is the only thing that carries over the cut.
import React from "react";
import { prog } from "../../../lib/anim";
import { pop } from "../../motion";
import { Sticker } from "../../kit/Collage";
import { Lightning, RingBadge, Sparkle } from "../../kit/doodles";
import { G, P } from "../../tokens";
import { head } from "../../type";
import { arriveAt, PAD_A, PAD_B, vPos } from "./route";

export const T_A = 4; // the head leaves pad A at film frame 4
export const T_B = arriveAt(PAD_B);

const NUM = 340;
/** year number box: left edge, vertical centre (the number sits on the same line as its pad) */
const YEARS = [
  { text: "2016", left: G.x(2), cy: G.y(1), at: T_A + 1, label: "Electronics & Telecom", bg: P.yellow, rot: -2 },
  { text: "2019", left: G.x(5), cy: G.y(3), at: T_B + 1, label: "B.Tech, Information Technology", bg: P.paper, rot: 1.5 },
] as const;

const Num: React.FC<{ f: number; text: string; left: number; cy: number; at: number; label: string; bg: string; rot: number }> = ({
  f, text, left, cy, at, label, bg, rot,
}) => {
  const k = prog(f, at, at + 9);
  if (f < at) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left,
          top: cy - NUM * 0.45 + 4,
          ...head(NUM, 86, 800),
          lineHeight: 0.9,
          color: P.paper,
          whiteSpace: "nowrap",
          clipPath: `inset(-20px ${(1 - k) * 100}% -20px 0)`,
          transform: `translateX(${(1 - k) * -90}px)`,
        }}
      >
        {text}
      </div>
      <Sticker x={left + 6} y={cy + 118} rotate={rot} bg={bg} fontSize={28} shadow={P.orange} anchor="tl" pop={pop(f, at + 7)}>
        {label}
      </Sticker>
    </>
  );
};

/** one year (number + label sticker + landing sparkle) that, on exit, shrinks back into its own pad */
const Year: React.FC<{ f: number; exit: number; pad: number; seed: number; y: (typeof YEARS)[number] }> = ({ f, exit, pad, seed, y }) => {
  const p = vPos(pad);
  const at = pad === PAD_A ? T_A : T_B;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${Math.max(0, 1 - exit)})`, transformOrigin: `${p[0]}px ${p[1]}px` }}>
      <Num f={f} {...y} />
      <Sparkle x={p[0] + 44} y={p[1] - 46} size={62} seed={seed} draw={prog(f, at, at + 8)} pop={pop(f, at)} />
    </div>
  );
};

export const Stamps: React.FC<{ f: number; exit?: number }> = ({ f, exit = 0 }) => {
  const badge = pop(f, T_B + 26) * (1 - exit);
  return (
    <>
      <Year f={f} exit={exit} pad={PAD_A} seed={2} y={YEARS[0]} />
      <Year f={f} exit={exit} pad={PAD_B} seed={5} y={YEARS[1]} />
      <RingBadge x={G.x(10) + 20} y={G.y(1) + 90} size={300} items={["Engineer first", "Design later"]} bg={P.yellow} ink={P.void} centerBg={P.void} shadow={P.orange} speed={1.2} pop={badge} rotate={-6}>
        <Lightning x={0} y={0} size={86} color={P.orange} rotate={6} seed={4} />
      </RingBadge>
    </>
  );
};
