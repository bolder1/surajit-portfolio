// The film: one Sequence per chapter under one FinishKey, and the sound track. No camera shake, no cut glitch:
// chapter boundaries are hard cuts on bar lines. Cues are authored chapter-local and flattened here.
import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import type { Cue } from "../lib/cues";
import { V6_SECTIONS } from "./timeline";
import { V6_SCENES } from "./registry";
import { FinishKey } from "./FinishKey";
import { K } from "./tokens";

/** Every cue on the global timeline (g = chapter start + chapter-local f). */
export const V6_CUES: (Cue & { g: number })[] = V6_SECTIONS.flatMap((s) => V6_SCENES[s.id].cues.map((c) => ({ ...c, g: s.from + c.f })));

// Headroom: the raw render must not clip; loudness is mastered afterwards (render-v6.sh: loudnorm I=-14).
export const MUSIC_GAIN = 0.5;
export const SFX_GAIN = 0.62;
/** The bed, written by the sound lane (sound/compose_v6.py). Until it exists, render with music=false. */
export const BED_FILE = "music/bed-v6.wav";

export const V6Scenes: React.FC = () => (
  <>
    {V6_SECTIONS.map((s) => {
      const { Scene } = V6_SCENES[s.id];
      return (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={`${s.id} ${s.name}`}>
          <Scene />
        </Sequence>
      );
    })}
  </>
);

export const V6SoundTrack: React.FC<{ music?: boolean }> = ({ music = true }) => (
  <>
    {music ? <Audio src={staticFile(BED_FILE)} volume={MUSIC_GAIN} /> : null}
    {V6_CUES.map((c, i) => (
      <Sequence key={i} from={c.g} layout="none" name={`sfx ${c.sfx}`}>
        <Audio src={staticFile(`sfx/${c.sfx}.wav`)} volume={Math.min(1, (c.vol ?? 0.7) * SFX_GAIN)} />
      </Sequence>
    ))}
  </>
);

export type V6FilmProps = {
  /** Play the bed (public/music/bed-v6.wav must exist). */
  music?: boolean;
  /** Keep the brightness/contrast half of the grade (off to measure its cost). */
  grade?: boolean;
};

export const V6Film: React.FC<V6FilmProps> = ({ music = true, grade = true }) => (
  <AbsoluteFill style={{ background: K.ground }}>
    <FinishKey grade={grade}>
      <V6Scenes />
    </FinishKey>
    <V6SoundTrack music={music} />
  </AbsoluteFill>
);
