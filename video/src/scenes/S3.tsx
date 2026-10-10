import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { noise2D } from "@remotion/noise";
import { C, mona, mono, serif } from "../lib/theme";
import { clamp, EO, EI, EIO, rand } from "../lib/anim";
import { Chroma, Flash, Glow, Leak } from "../lib/FX";
import type { Cue } from "../lib/cues";
import face from "../assets/face.json";

/**
 * 03 · IDENTITY (120 f) — the drop.
 * f0 impact + flash; letters decrypt out of hex; f30 width/weight slam (beat 3);
 * f40 metallic sweep; f44 serif line; f62 mono line types; f104+ exit.
 * Sound: lock clicks thinned to ≥2 f apart and stop by f22, so f23–29 is near-silence before the f30 boom.
 */
const NAME = "SURAJIT DUTTA";
const POOL = "0123456789ABCDEF#%&*+=/<>[]{}";
const SLAM = 30;

const lockFrame = (i: number) => 3 + i * 1.6 + Math.floor(rand(i * 5.3 + 2) * 6);

// Face-mesh points become the drifting identity cloud behind the name.
const PTS = (face.pts as number[][]).filter((_, i) => i % 2 === 0);

const Cloud: React.FC = () => {
  const f = useCurrentFrame();
  const spread = interpolate(f, [0, 40], [0.2, 1], { ...clamp, easing: EO });
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {PTS.map((p, i) => {
        const bx = 960 + (p[0] - face.w / 2) * 1.05;
        const by = 560 + (p[1] - face.h * 0.42) * 1.05;
        const dx = (rand(i * 1.3) - 0.5) * 1500 * spread;
        const dy = (rand(i * 2.9) - 0.5) * 760 * spread;
        const nx = noise2D("x", i * 0.13, f * 0.012) * 40;
        const ny = noise2D("y", i * 0.13, f * 0.012) * 40;
        const x = bx + dx + nx;
        const y = by + dy + ny;
        const hot = rand(i * 7.7) < 0.06;
        const r = hot ? 2.4 : 1.4;
        return <rect key={i} x={x} y={y} width={r} height={r} fill={hot ? C.acc : C.paper} opacity={hot ? 0.8 : 0.16 + rand(i) * 0.18} />;
      })}
    </svg>
  );
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const push = interpolate(f, [0, 120], [1.0, 1.06], clamp);
  const exit = interpolate(f, [104, 119], [0, 1], { ...clamp, easing: EI });
  const chroma = interpolate(f, [SLAM, SLAM + 12], [14, 0], { ...clamp, easing: EO }) + interpolate(f, [0, 8], [8, 0], clamp);
  const punch = 1 + 0.05 * Math.exp(-Math.max(0, f - SLAM) / 2.5) * (f >= SLAM ? 1 : 0);

  const letters = NAME.split("").map((ch, i) => {
    if (ch === " ") return <span key={i} style={{ display: "inline-block", width: "0.32em" }} />;
    const lf = lockFrame(i);
    const locked = f >= lf;
    const flash = f >= lf && f < lf + 2;
    const s = spring({ frame: f - SLAM - i * 1, fps, config: { stiffness: 260, damping: 16, mass: 0.8 } });
    const wdth = interpolate(s, [0, 1], [75, 125]);
    const wght = interpolate(s, [0, 1], [260, 880]);
    if (!locked) {
      const g = POOL[Math.floor(rand(i * 7.1 + Math.floor(f / 2) * 3.3) * POOL.length)];
      const vis = f >= lf - 10;
      return (
        <span key={i} style={{ display: "inline-block", fontFamily: mono, fontSize: "0.62em", color: C.dim, opacity: vis ? 0.75 : 0, width: "0.62em", textAlign: "center" }}>
          {g}
        </span>
      );
    }
    return (
      <span
        key={i}
        style={{
          display: "inline-block",
          ...mona(wdth, wght),
          color: flash ? C.acc : C.paper,
          textShadow: flash ? `0 0 30px ${C.accGlow}` : "none",
        }}
      >
        {ch}
      </span>
    );
  });

  // Metallic light band crossing the settled name once.
  const sweep = interpolate(f, [40, 70], [130, -30], { ...clamp, easing: EIO });
  const sweepOn = f >= 40 && f <= 72;

  const lineP = interpolate(f, [44, 62], [0, 1], { ...clamp, easing: EO });
  const sub = "IDENTITY · ACCESS · SECURITY UX · 4 YEARS";
  const typed = Math.floor(interpolate(f, [62, 62 + sub.length / 2.2], [0, sub.length], clamp));
  const track = interpolate(f, [SLAM, SLAM + 30], [0.06, -0.025], { ...clamp, easing: EO });

  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        {/* warm haze rides the drop, then settles low so the held name is not sitting in a red wash */}
        <Glow x={960} y={520} r={760} opacity={interpolate(f, [0, 30, 60], [0.42, 0.26, 0.14], clamp)} />
        <Cloud />
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: 1 - exit, filter: `blur(${exit * 14}px)` }}>
          <div style={{ position: "relative", marginTop: -70, transform: `scale(${punch}) translateX(${-exit * 60}px)` }}>
            <Chroma amount={chroma} style={{ fontSize: 176, lineHeight: 1, whiteSpace: "nowrap", letterSpacing: `${track}em`, color: C.paper }}>
              {letters}
            </Chroma>
            {sweepOn ? (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  fontSize: 176,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  letterSpacing: `${track}em`,
                  ...mona(125, 880),
                  backgroundImage: "linear-gradient(105deg, transparent 40%, rgba(255,250,240,0.95) 50%, transparent 60%)",
                  backgroundSize: "300% 100%",
                  backgroundPosition: `${sweep}% 0`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  mixBlendMode: "screen",
                }}
              >
                {NAME.split("").map((ch, i) => (ch === " " ? <span key={i} style={{ display: "inline-block", width: "0.32em" }} /> : <span key={i}>{ch}</span>))}
              </div>
            ) : null}
          </div>
          <div style={{ marginTop: 30, overflow: "hidden", height: 92 }}>
            <div
              style={{
                fontFamily: serif,
                fontStyle: "italic",
                fontSize: 74,
                color: C.paper,
                transform: `translateY(${(1 - lineP) * 100}%)`,
                filter: `blur(${(1 - lineP) * 6}px)`,
              }}
            >
              I design <span style={{ color: C.acc }}>the way in.</span>
            </div>
          </div>
          <div style={{ marginTop: 34, fontFamily: mono, fontSize: 20, letterSpacing: "0.3em", color: C.dim, height: 26 }}>
            {sub.slice(0, typed)}
            {typed < sub.length && f >= 62 ? <span style={{ color: C.acc }}>▌</span> : null}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      <Flash at={0} len={8} color="#fff4e6" max={0.9} />
      <Flash at={SLAM} len={5} color={C.acc} max={0.25} />
      <Leak dur={32} seed={4} opacity={0.3} />
    </AbsoluteFill>
  );
};

// One click per letter lock, thinned: at least 2 f apart, none after f22 (pre-slam silence).
const lockClicks: Cue[] = (() => {
  const frames = NAME.split("")
    .map((ch, i) => (ch === " " ? -1 : Math.ceil(lockFrame(i))))
    .filter((fr) => fr >= 0 && fr <= SLAM - 8)
    .sort((a, b) => a - b);
  const out: Cue[] = [];
  for (const fr of frames) if (!out.length || fr - out[out.length - 1].f >= 2) out.push({ f: fr, sfx: "click", vol: 0.28 });
  return out;
})();

export const cues: Cue[] = [
  { f: 0, sfx: "impact", vol: 1 },
  { f: 0, sfx: "glitch-2", vol: 0.5 }, // the RGB split on the impact frames
  ...lockClicks,
  { f: SLAM, sfx: "boom", vol: 0.75 },
  { f: 42, sfx: "shimmer", vol: 0.35 },
  { f: 44, sfx: "swish", vol: 0.3 },
  ...Array.from({ length: 18 }, (_, k) => ({ f: 62 + k * 1, sfx: (`key-${k % 6}` as Cue["sfx"]), vol: 0.16 })).filter((_, k) => k % 2 === 0),
  // no exit whoosh: the name dissolves, it does not fly
];
