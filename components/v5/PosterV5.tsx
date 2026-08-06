"use client";

import { KineticCenterBuild } from "./KineticCenterBuild";
import { ClippedCircle } from "./ClippedCircle";
import { ScrambleText } from "./ScrambleText";
import { CausticField } from "./CausticField";

/**
 * §P PosterV5 — the interstitial, brought over from V2's poster beat.
 *
 * V1 runs eight dense sections back to back and every one of them arrives at
 * the same volume. This is the full stop: one statement, no navigation, no
 * data. Its job is pacing — you cannot help but read it because there is
 * nothing else on the screen.
 *
 * V2's version parked a pressable keycap beside the sentence. That object
 * belongs to V2's palette and would read as borrowed here, so V1 gets the
 * motion instead of the prop: the sentence assembles itself word by word and
 * rewrites to the next one, and a difference-blended disc inverts the type as
 * the pointer crosses it. Same beat, this system's voice.
 *
 * The stage reserves its height so a phrase that wraps to two lines does not
 * shove the rest of the page down when it lands.
 */

const PHRASES = [
  "Design that survives contact with engineering.",
  "Five products, one vocabulary, no repaints.",
  "Every claim here has a URL behind it.",
  "Systems outlive the screens they shipped in.",
];

export function PosterV5() {
  return (
    <section className="v5-poster" aria-labelledby="v5-poster-h">
      {/* Wave interference, not the masthead's filament. It wakes as the
          section centres and takes the pointer as a fourth wave source, so
          the beat is a room you walk into rather than a band you scroll past. */}
      <CausticField />
      <div className="v5-poster-scrim" aria-hidden />

      <div className="v5-poster-wrap">
        <p className="v5-poster-eyebrow">
          <ScrambleText text="( the short version )" />
        </p>

        <h2 id="v5-poster-h" className="v5-poster-stage">
          <KineticCenterBuild phrases={PHRASES} />
        </h2>

        <span className="v5-poster-rule" aria-hidden />

        <p className="v5-poster-note">
          Four sentences that took eight years to be able to say. The sections
          on either side of this one are the evidence.
        </p>
      </div>

      <ClippedCircle circleSize={230} />
    </section>
  );
}
