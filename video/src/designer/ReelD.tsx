import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { D_LETTERBOX_OPEN, D_SECTIONS, D_TOTAL } from "./timeline";
import { D_SCENES } from "./registry";
import { Finish, type FinishCfg } from "../lib/Finish";
import { Glitch } from "../lib/FX";
import { clamp, rand } from "../lib/anim";
import { C, BEAT } from "../lib/theme";
import type { Cue } from "../lib/cues";

export const D_CFG: FinishCfg = {
  sections: D_SECTIONS,
  total: D_TOTAL,
  letterboxOpen: D_LETTERBOX_OPEN,
  activeAt: D_LETTERBOX_OPEN + BEAT,
  pending: "PROFILE LOADING",
  active: "OPEN TO WORK",
};

/** All cues on the global timeline (each scene authors its own, in local frames). */
export const D_CUES: (Cue & { g: number })[] = D_SECTIONS.flatMap((s) =>
  D_SCENES[s.id].cues.map((c) => ({ ...c, g: s.from + c.f })),
);

// Camera shake only on the film's three big hits: the name drop, the stat, the final lift.
const HITS = [
  { g: 240, a: 1 },
  { g: 900, a: 0.7 },
  { g: 1380, a: 0.7 },
];
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

/** Glitch-slice bursts on hard cuts only (in: first 4 f when the section asks for it, out: last 3 f before such a section). */
const CutGlitch: React.FC<{ dur: number; glitchIn: boolean; glitchOut: boolean; children: React.ReactNode }> = ({ dur, glitchIn, glitchOut, children }) => {
  const f = useCurrentFrame();
  const inI = glitchIn ? interpolate(f, [0, 4], [1, 0], clamp) : 0;
  const outI = glitchOut ? interpolate(f, [dur - 3, dur - 1], [0, 0.8], clamp) : 0;
  return <Glitch intensity={Math.max(inI, outI)} seed={dur}>{children}</Glitch>;
};

export const DScenes: React.FC = () => (
  <>
    {D_SECTIONS.map((s, i) => {
      const { Scene } = D_SCENES[s.id];
      const next = D_SECTIONS[i + 1];
      return (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
          <CutGlitch dur={s.dur} glitchIn={s.glitch} glitchOut={!!next && next.glitch}>
            <Scene />
          </CutGlitch>
        </Sequence>
      );
    })}
  </>
);

// Headroom: the raw render must not clip; loudness is mastered afterwards (render-designer.sh → loudnorm -14 LUFS).
const MUSIC_GAIN = 0.5;
const SFX_GAIN = 0.62;

export const DSoundTrack: React.FC<{ music?: boolean }> = ({ music = true }) => (
  <>
    {music ? <Audio src={staticFile("music/designer-bed.wav")} volume={MUSIC_GAIN} /> : null}
    {D_CUES.map((c, i) => (
      <Sequence key={i} from={c.g} layout="none" name={`sfx ${c.sfx}`}>
        <Audio src={staticFile(`sfx/${c.sfx}.wav`)} volume={Math.min(1, (c.vol ?? 0.7) * SFX_GAIN)} />
      </Sequence>
    ))}
  </>
);

export const Designer: React.FC = () => {
  const g = useCurrentFrame();
  const sh = useShake(g);
  return (
    <AbsoluteFill style={{ background: C.void }}>
      <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px) scale(${1 + Math.hypot(sh.x, sh.y) / 900})` }}>
        <DScenes />
      </AbsoluteFill>
      <Finish cfg={D_CFG} />
      <DSoundTrack />
    </AbsoluteFill>
  );
};
