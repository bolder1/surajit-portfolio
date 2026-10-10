/** Every SFX file in public/sfx (synthesised by sound/sfx.py). */
export type Sfx =
  | "boom" | "impact" | "impact-soft" | "whoosh" | "whoosh-long" | "whoosh-rev" | "swish"
  | "riser" | "riser-long" | "swell" | "glitch-1" | "glitch-2" | "glitch-3"
  | "click" | "click-lo" | "blip" | "blip-hi" | "blip-up" | "blip-down" | "chatter" | "chatter-long"
  | "scan" | "granted" | "lock" | "dial" | "power-down" | "heartbeat" | "snap" | "tape-stop" | "shimmer"
  | "arcade-blip" | "crt-on" | "crt-off" | "gated-snare-hit" | "glass-tink" | "glass-tink-2" | "laser" | "synth-stab"
  | "whoosh-retro" | "hum-80f" | "sine-calm" | "tape-rewind" | "whoosh-flyby"
  | "key-0" | "key-1" | "key-2" | "key-3" | "key-4" | "key-5";

/** A sound cue at a scene-local frame. vol 0..1 (default 0.7). */
export type Cue = { f: number; sfx: Sfx; vol?: number };

export const keySfx = (i: number): Sfx => (`key-${i % 6}` as Sfx);
