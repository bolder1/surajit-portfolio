import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { SECTIONS, TOTAL } from "./timeline";
import { SCENES } from "./registry";
import { Finish } from "./lib/Finish";
import { Glitch } from "./lib/FX";
import { clamp, rand } from "./lib/anim";
import { C } from "./lib/theme";
import type { Cue } from "./lib/cues";

/** All cues on the global timeline. */
export const ALL_CUES: (Cue & { g: number })[] = SECTIONS.flatMap((s) =>
  SCENES[s.id].cues.map((c) => ({ ...c, g: s.from + c.f })),
);
const HITS = ALL_CUES.filter((c) => c.sfx === "impact" || c.sfx === "boom").map((c) => ({ g: c.g, a: (c.vol ?? 0.7) }));

/** Camera shake from impact cues (deterministic). */
const useShake = (g: number) => {
  let x = 0;
  let y = 0;
  for (const h of HITS) {
    const d = g - h.g;
    if (d < 0 || d > 14) continue;
    const amp = 16 * h.a * Math.exp(-d / 4);
    x += (rand(g * 1.7 + h.g) - 0.5) * 2 * amp;
    y += (rand(g * 3.1 + h.g) - 0.5) * 2 * amp;
  }
  return { x, y };
};

/** Glitch-slice bursts on section cuts (in: first 4 f, out: last 3 f). */
const CutGlitch: React.FC<{ dur: number; first: boolean; children: React.ReactNode }> = ({ dur, first, children }) => {
  const f = useCurrentFrame();
  const inI = first ? 0 : interpolate(f, [0, 4], [1, 0], clamp);
  const outI = interpolate(f, [dur - 3, dur - 1], [0, 0.8], clamp);
  return <Glitch intensity={Math.max(inI, outI)} seed={dur}>{children}</Glitch>;
};

export const Scenes: React.FC = () => (
  <>
    {SECTIONS.map((s, i) => {
      const { Scene } = SCENES[s.id];
      return (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
          <CutGlitch dur={s.dur} first={i === 0}>
            <Scene />
          </CutGlitch>
        </Sequence>
      );
    })}
  </>
);

// Mix headroom: the raw render must not clip; loudness is mastered afterwards (render.sh → loudnorm -14 LUFS).
const MUSIC_GAIN = 0.42;
const SFX_GAIN = 0.62;

export const SoundTrack: React.FC<{ music?: boolean }> = ({ music = true }) => (
  <>
    {music ? <Audio src={staticFile("music/bed.wav")} volume={MUSIC_GAIN} /> : null}
    {ALL_CUES.map((c, i) => (
      <Sequence key={i} from={c.g} layout="none" name={`sfx ${c.sfx}`}>
        <Audio src={staticFile(`sfx/${c.sfx}.wav`)} volume={Math.min(1, (c.vol ?? 0.7) * SFX_GAIN)} />
      </Sequence>
    ))}
  </>
);

export const Reel: React.FC = () => {
  const g = useCurrentFrame();
  const sh = useShake(g);
  return (
    <AbsoluteFill style={{ background: C.void }}>
      <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px) scale(${1 + Math.hypot(sh.x, sh.y) / 900})` }}>
        <Scenes />
      </AbsoluteFill>
      <Finish />
      <SoundTrack />
    </AbsoluteFill>
  );
};

export const REEL_DURATION = TOTAL;
