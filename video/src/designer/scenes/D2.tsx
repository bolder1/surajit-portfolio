// D2 THESIS (film frames 120-240). The trace from D1 keeps travelling (same route, same head position at local 0), sweeps the year stamps
// away, pulls its old tail back and becomes a three-node flow along the bottom row: ELECTRONICS, IT, DESIGN. His two lines go huge above it.
// 210-232 everything collapses into one orange grid cell that shrinks to a point; 232-240 pure void (and silence).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EI, EIO, prog } from "../../lib/anim";
import type { Cue } from "../../lib/cues";
import { pop } from "../motion";
import { Sticker } from "../kit/Collage";
import { CurlyArrow, ScribbleUnderline, Sparkle, Wobble } from "../kit/doodles";
import { G, P } from "../tokens";
import { head } from "../type";
import { Stamps } from "./_D1/Stamps";
import { TraceRun } from "./_D1/TraceRun";
import { arriveAt, headDist, headTip, NODES, PAD_A, PAD_B, RUN_Y, TOTAL, vCum, vPos } from "./_D1/route";

const FS = 140;
const PITCH = 134;
const LEFT = G.x(0) + 6;

// his two lines
const S1_AT = 15; // film 135
const S2_AT = 60; // film 180
const COLLAPSE = 88; // film 208
const S1_TOP = 128;
const BLOCK = { x: G.x(3), y: G.y(3), w: G.CW * 9, h: G.RH * 2 };
const CELL = { x: G.x(6), y: G.y(3), w: G.CW, h: G.RH };

/** one line of huge type that slams up out of its own mask; `wipe` eats it from the left on the way out */
const Line: React.FC<{ f: number; at: number; top: number; left: number; color: string; wipe: number; children: React.ReactNode }> = ({ f, at, top, left, color, wipe, children }) => {
  const k = prog(f, at, at + 9);
  if (f < at) return null;
  return (
    <div style={{ position: "absolute", left, top, height: PITCH, overflow: "hidden", whiteSpace: "nowrap", clipPath: wipe > 0 ? `inset(0 0 0 ${wipe * 100}%)` : undefined }}>
      <div style={{ ...head(FS, 86, 800), lineHeight: `${PITCH}px`, color, transform: `translateY(${(1 - k) * 112}%)` }}>{children}</div>
    </div>
  );
};

const NODE_LABELS = ["Electronics", "IT", "Design"] as const;

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const t = 120 + f;
  const collapse = prog(f, COLLAPSE, COLLAPSE + 10, EI);
  const wipe = prog(f, COLLAPSE, COLLAPSE + 8, EI);
  const stampsOut = prog(f, 1, 10, EI);

  // trace: tail pulls the old route back to the rail's corner; at the collapse the whole thing is drawn back into its end
  const railStart = vCum(5);
  const tailIn = prog(f, 3, 17, EIO) * railStart;
  const tail = f < COLLAPSE ? tailIn : railStart + (TOTAL - railStart) * prog(f, COLLAPSE, COLLAPSE + 10, EIO);
  const head_ = headDist(t);
  const tip = headTip(t);

  // morph of the orange block into one grid cell, then the cell shrinks to a point
  const morph = prog(f, COLLAPSE + 2, COLLAPSE + 16, EIO);
  const bx = BLOCK.x + (CELL.x - BLOCK.x) * morph;
  const bw = BLOCK.w + (CELL.w - BLOCK.w) * morph;
  const bh = BLOCK.h + (CELL.h - BLOCK.h) * morph;
  const shrink = prog(f, 104, 112, EI);
  const blockIn = prog(f, S2_AT, S2_AT + 8);

  const nodePos = NODES.map((v) => vPos(v));
  const nodeAt = NODES.map((v) => arriveAt(v) - 120);

  return (
    <AbsoluteFill style={{ background: P.void }}>
      {/* the carried-over trace (and the stamps it sweeps away) */}
      <Stamps f={t} exit={stampsOut} />
      <TraceRun
        t={t}
        head={head_}
        tail={tail}
        pads={[PAD_A, PAD_B, ...NODES]}
        hollow={[...NODES]}
        hollowOn={f >= 14 && f < COLLAPSE ? pop(f, 14) : 0}
        ghost={f >= 14 && f < COLLAPSE ? railStart : 0}
        headDot={f < COLLAPSE}
        padScale={1 - prog(f, COLLAPSE + 2, COLLAPSE + 12, EI)}
      />
      {f < nodeAt[2] + 2 && f >= 2 ? <Sparkle x={tip.x + 34} y={tip.y - 36} size={46} seed={7} /> : null}

      {/* flow labels land with their node */}
      {NODES.map((v, i) => (
        <Sticker
          key={v}
          x={nodePos[i][0]}
          y={RUN_Y + 26}
          anchor="t"
          rotate={i === 1 ? 2 : -2}
          fontSize={26}
          bg={i === 2 ? P.orange : P.paper}
          color={P.void}
          shadow={i === 2 ? P.orangeDeep : P.orange}
          pop={pop(f, nodeAt[i] + 2) * (1 - collapse)}
        >
          {NODE_LABELS[i]}
        </Sticker>
      ))}
      <Sparkle x={nodePos[2][0] + 88} y={RUN_Y + 6} size={64} twin seed={3} draw={prog(f, nodeAt[2], nodeAt[2] + 8)} pop={pop(f, nodeAt[2]) * (1 - collapse)} />

      {/* sentence one */}
      <Line f={f} at={S1_AT} top={S1_TOP} left={LEFT} color={P.paper} wipe={wipe}>
        The systems thinking
      </Line>
      <Line f={f} at={S1_AT + 3} top={S1_TOP + PITCH} left={LEFT} color={P.paper} wipe={wipe}>
        came from here.
      </Line>

      {/* sentence two: black on an orange block */}
      {f >= S2_AT ? (
        <div
          style={{
            position: "absolute",
            left: bx,
            top: BLOCK.y,
            width: bw * (f < COLLAPSE + 2 ? blockIn : 1) + 0,
            height: bh,
            background: P.orange,
            boxShadow: `10px 10px 0 0 ${P.orangeDeep}`,
            transform: `scale(${1 - shrink})`,
            transformOrigin: "50% 50%",
          }}
        />
      ) : null}
      {f < COLLAPSE + 2 ? (
        <>
          <Line f={f} at={S2_AT + 3} top={BLOCK.y + 26} left={BLOCK.x + 42} color={P.void} wipe={wipe}>
            The design fluency
          </Line>
          <Line f={f} at={S2_AT + 6} top={BLOCK.y + 26 + PITCH} left={BLOCK.x + 42} color={P.void} wipe={wipe}>
            came later.
          </Line>
        </>
      ) : null}

      {/* doodles that say something: the marker under his key words, the arrow at "later." (one Wobble for the whole layer) */}
      <Wobble boil={4} scale={3}>
        <ScribbleUnderline x={LEFT + 655} y={S1_TOP + 138} w={900} thickness={18} draw={prog(f, 30, 44)} pop={1 - wipe} seed={7} />
        <CurlyArrow x={BLOCK.x + 900} y={BLOCK.y + 238} size={240} kind="curl" color={P.void} flip rotate={-18} draw={prog(f, 76, 90)} pop={1 - wipe} seed={4} />
      </Wobble>
    </AbsoluteFill>
  );
};

const nodeF = (i: number) => Math.round(arriveAt(NODES[i]) - 120);
export const cues: Cue[] = [
  { f: 1, sfx: "whoosh", vol: 0.35 },
  { f: 5, sfx: "whoosh-rev", vol: 0.25 },
  { f: S1_AT, sfx: "snap", vol: 0.5 },
  { f: S1_AT + 1, sfx: "whoosh-retro", vol: 0.25 },
  { f: 30, sfx: "swish", vol: 0.3 },
  { f: nodeF(0), sfx: "blip", vol: 0.45 },
  { f: nodeF(1), sfx: "blip-up", vol: 0.45 },
  { f: S2_AT, sfx: "synth-stab", vol: 0.55 },
  { f: S2_AT + 1, sfx: "gated-snare-hit", vol: 0.45 },
  { f: nodeF(2), sfx: "glass-tink", vol: 0.5 },
  { f: 76, sfx: "swish", vol: 0.25 },
  { f: COLLAPSE, sfx: "whoosh-rev", vol: 0.45 },
  { f: 104, sfx: "blip-down", vol: 0.4 },
];
