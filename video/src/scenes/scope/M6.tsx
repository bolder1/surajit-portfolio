import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ModuleShell, Em } from "../../lib/ModuleShell";
import { C, dots, mono } from "../../lib/theme";
import { clamp, EI, EIO, EO, rand } from "../../lib/anim";
import { Glow } from "../../lib/FX";
import type { Cue } from "../../lib/cues";

/**
 * SCOPE 06 · ENDPOINT MANAGEMENT (60 f) · a policy wave across the fleet.
 * A wall of line-art devices (laptop / phone / tablet / desktop) sits dim and unmanaged. A reticle closes
 * on one device, the policy launches on beat 1 and radiates outward: each device flips (vermilion as it
 * takes the policy, then settles cream = enrolled). A few flash a vermilion ✕ (non-compliant), then
 * remediate. ENROLLED counts up; COMPLIANT climbs 94% → 100% on beat 3.
 *  f0–14  wall dim, reticle converges on the origin device
 *  f15    LAUNCH (beat 1): origin flips, wave ring leaves
 *  f15–40 wave crosses the wall; flips, ✕ flashes
 *  f45    beat 3: last device remediated, COMPLIANT 100%
 *  f52–57 exit
 */
const LAUNCH = 15;
const DONE = 45;
const FLIP = 6; // frames for a device flip

// wall geometry
const X0 = 862;
const Y0 = 320;
const P = 56; // pitch
const S = 38; // icon box
const COLS = 19; // last column bleeds off the right edge
const ROWS = 6;
const fits = (y: number) => y + S <= 662; // the wall stops above the title band

type Kind = "laptop" | "phone" | "tablet" | "desktop";
const KINDS: Kind[] = ["laptop", "laptop", "phone", "desktop", "tablet", "laptop", "phone", "desktop"];

const ORIGIN = { c: 8, r: 2 };
const OX = X0 + ORIGIN.c * P + S / 2;
const OY = Y0 + ORIGIN.r * P + S / 2;

type Dev = { x: number; y: number; kind: Kind; d: number; a: number; nc: boolean; res: number; k: number };
const RMAX = 640;
const WAVE = Easing.bezier(0.3, 0.25, 0.55, 1);
const radius = (f: number) => interpolate(f, [LAUNCH, 41], [0, RMAX], { ...clamp, easing: WAVE });
const actFrame = (d: number) => {
  for (let f = LAUNCH; f <= 41; f += 0.1) if (radius(f) >= d) return f;
  return 41;
};

const DEVS: Dev[] = (() => {
  const out: Dev[] = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const x = X0 + c * P;
      const y = Y0 + r * P;
      if (!fits(y)) continue;
      const k = out.length;
      const d = Math.hypot(x + S / 2 - OX, y + S / 2 - OY);
      const kind = KINDS[Math.floor(rand(c * 3.7 + r * 11.3) * KINDS.length)];
      const isOrigin = c === ORIGIN.c && r === ORIGIN.r;
      const nc = !isOrigin && d > 90 && rand(c * 5.1 + r * 7.9 + 2) < 0.075;
      out.push({ x, y, kind, d, a: actFrame(d), nc, res: 0, k });
    }
  // remediation frames: each ✕ holds ~10–14 f; the last one lands exactly on DONE
  const ncs = out.filter((v) => v.nc).sort((p, q) => p.a - q.a);
  ncs.forEach((v, i) => {
    // res = frame the remediation flip starts; the device reads fixed at res + FLIP/2
    v.res = i === ncs.length - 1 ? DONE - FLIP / 2 : Math.min(DONE - FLIP / 2 - 1, Math.round(v.a + 10 + rand(v.k * 1.9) * 5));
  });
  return out;
})();
const NC = DEVS.filter((v) => v.nc);
const TOTAL = DEVS.length;

/** Device glyphs, 38×38, 1.5 px line. `on` variants carry the enrolled screen fill + status dot. */
const Symbols: React.FC = () => (
  <defs>
    {(["off", "on"] as const).map((st) => (
      <React.Fragment key={st}>
        <symbol id={`m6-laptop-${st}`} viewBox="0 0 38 38">
          <rect x={6.5} y={8.5} width={25} height={16} rx={2} fill="currentColor" fillOpacity={st === "on" ? 0.16 : 0} stroke="currentColor" strokeWidth={1.5} />
          <path d="M3 29.5 H35 L33 32 H5 Z" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
        </symbol>
        <symbol id={`m6-phone-${st}`} viewBox="0 0 38 38">
          <rect x={12.5} y={4.5} width={13} height={29} rx={3} fill="currentColor" fillOpacity={st === "on" ? 0.16 : 0} stroke="currentColor" strokeWidth={1.5} />
          <path d="M17 30 H21" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        </symbol>
        <symbol id={`m6-tablet-${st}`} viewBox="0 0 38 38">
          <rect x={7.5} y={5.5} width={23} height={28} rx={3} fill="currentColor" fillOpacity={st === "on" ? 0.16 : 0} stroke="currentColor" strokeWidth={1.5} />
          <circle cx={19} cy={30} r={0.9} fill="currentColor" />
        </symbol>
        <symbol id={`m6-desktop-${st}`} viewBox="0 0 38 38">
          <rect x={4.5} y={6.5} width={29} height={19} rx={1.5} fill="currentColor" fillOpacity={st === "on" ? 0.16 : 0} stroke="currentColor" strokeWidth={1.5} />
          <path d="M19 25.5 V31 M13 32.5 H25" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        </symbol>
      </React.Fragment>
    ))}
    <clipPath id="m6-wall">
      <rect x={X0 - 30} y={Y0 - 26} width={1920 - X0 + 30} height={662 - Y0 + 26} />
    </clipPath>
  </defs>
);

const DeviceView: React.FC<{ v: Dev; f: number }> = ({ v, f }) => {
  const t = f - v.a;
  let sx = 1;
  let on = false;
  let color: string = C.paper;
  let op = 0.2;
  let cross = false;
  if (t >= 0) {
    // first flip
    if (t < FLIP) sx = Math.abs(Math.cos((Math.PI * t) / FLIP));
    const turned = t >= FLIP / 2;
    if (turned) {
      if (v.nc && f < v.res + FLIP / 2) {
        color = C.acc;
        op = 1;
        cross = true;
        if (f >= v.res) sx = Math.abs(Math.cos((Math.PI * (f - v.res)) / FLIP)); // remediation flip
      } else {
        on = true;
        const since = v.nc ? f - (v.res + FLIP / 2) : t - FLIP / 2;
        if (v.nc && f < v.res + FLIP) sx = Math.abs(Math.cos((Math.PI * (f - v.res)) / FLIP));
        // fresh devices flash vermilion as they take the policy; remediated ones settle straight to cream
        const hot = !v.nc && since < 4;
        color = hot ? C.acc : C.paper;
        op = hot ? 1 : 0.88;
      }
    }
  }
  if (v.d < 1 && t < 0) {
    // the origin device is selected while the reticle closes in
    op = interpolate(f, [4, 10], [0.2, 1], clamp);
  }
  const cx = v.x + S / 2;
  const cy = v.y + S / 2;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${Math.max(0.04, sx)} 1) translate(${-S / 2} ${-S / 2})`} style={{ color }} opacity={op}>
      <use href={`#m6-${v.kind}-${on ? "on" : "off"}`} width={S} height={S} />
      {cross ? <path d="M14 11 L24 21 M24 11 L14 21" stroke={C.acc} strokeWidth={2.2} strokeLinecap="round" /> : null}
    </g>
  );
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const push = interpolate(f, [0, 60], [1, 1.05], clamp);
  const exit = interpolate(f, [52, 57], [0, 1], { ...clamp, easing: EI });
  const R = radius(f);
  const waveO = interpolate(R, [0, 40, RMAX * 0.85, RMAX], [0, 1, 0.5, 0], clamp) * (f >= LAUNCH ? 1 : 0);

  const enrolled = DEVS.filter((v) => f >= v.a + FLIP / 2).length;
  const fixedN = NC.filter((v) => f >= v.res + FLIP / 2).length;
  const pct = f >= DONE ? 100 : 94 + Math.floor((6 * fixedN) / NC.length);
  const done = f >= DONE;
  const doneS = spring({ frame: f - DONE, fps, config: { stiffness: 300, damping: 15 } });
  const anyAlert = NC.some((v) => f >= v.a + FLIP / 2 && f < v.res + FLIP / 2);

  // reticle converging on the origin before launch
  const ret = interpolate(f, [2, LAUNCH], [0, 1], { ...clamp, easing: EIO });
  const retR = interpolate(ret, [0, 1], [P * 2.5, 27]); // starts in the gutters between devices
  const retO = interpolate(f, [0, 4, LAUNCH, LAUNCH + 4], [0, 0.8, 1, 0], clamp);

  const headIn = interpolate(f, [0, 10], [0.35, 1], { ...clamp, easing: EO });

  return (
    <ModuleShell index={6} title="ENDPOINT MANAGEMENT" line={<>Every device, <Em>in policy.</Em></>}>
      <AbsoluteFill style={{ opacity: 1 - exit, transform: `scale(${push + exit * 0.03})`, transformOrigin: `${OX}px ${OY}px` }}>
        <Glow x={OX} y={OY} r={160 + R * 0.9} opacity={0.38 * waveO} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <Symbols />
          {/* header rule */}
          <line x1={X0} y1={Y0 - 30} x2={1780} y2={Y0 - 30} stroke={C.paper} strokeWidth={1} opacity={0.2 * headIn} />
          {[0, 0.25, 0.5, 0.75, 1].map((p) => (
            <line key={p} x1={X0 + (1780 - X0) * p} y1={Y0 - 34} x2={X0 + (1780 - X0) * p} y2={Y0 - 26} stroke={C.paper} strokeWidth={1} opacity={0.35 * headIn} />
          ))}
          {DEVS.map((v) => (
            <DeviceView key={v.k} v={v} f={f} />
          ))}
          {/* wave front */}
          <g clipPath="url(#m6-wall)">
            {f >= LAUNCH ? (
              <>
                <circle cx={OX} cy={OY} r={Math.max(1, R)} fill="none" stroke={C.acc} strokeWidth={22} opacity={0.07 * waveO} />
                <circle cx={OX} cy={OY} r={Math.max(1, R)} fill="none" stroke={C.acc} strokeWidth={1.5} opacity={0.9 * waveO} />
                <circle cx={OX} cy={OY} r={Math.max(1, R * 0.82)} fill="none" stroke={C.paper} strokeWidth={1} opacity={0.18 * waveO} />
              </>
            ) : null}
          </g>
          {/* reticle on the origin device */}
          <g opacity={retO}>
            {[0, 90, 180, 270].map((a) => (
              <path
                key={a}
                d={`M ${OX - retR} ${OY - retR + 16} V ${OY - retR} H ${OX - retR + 16}`}
                fill="none"
                stroke={f >= LAUNCH - 2 ? C.acc : C.paper}
                strokeWidth={1.5}
                transform={`rotate(${a} ${OX} ${OY})`}
              />
            ))}
          </g>
        </svg>

        {/* header readouts */}
        <div style={{ position: "absolute", left: X0, top: 200, display: "flex", gap: 84, alignItems: "flex-end", opacity: headIn }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: 14, letterSpacing: "0.26em", color: C.dim }}>ENROLLED</div>
            <div style={{ fontFamily: dots, fontWeight: 800, fontSize: 58, lineHeight: 1, marginTop: 8, color: C.paper, whiteSpace: "nowrap" }}>
              {String(enrolled).padStart(3, "0")}
              <span style={{ color: C.faint }}>/{TOTAL}</span>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: mono, fontSize: 14, letterSpacing: "0.26em", color: done ? C.acc : anyAlert ? C.paper : C.dim }}>
              {done ? "● COMPLIANT" : anyAlert ? "✕ REMEDIATING" : "COMPLIANT"}
            </div>
            <div
              style={{
                fontFamily: dots,
                fontWeight: 800,
                fontSize: 58,
                lineHeight: 1,
                marginTop: 8,
                whiteSpace: "nowrap",
                color: done ? C.acc : C.paper,
                textShadow: done ? `0 0 ${26 * (1.2 - doneS * 0.4)}px ${C.accGlow}` : "none",
                transform: `scale(${done ? 1 + 0.1 * (1 - doneS) : 1})`,
                transformOrigin: "0 100%",
              }}
            >
              {pct}%
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </ModuleShell>
  );
};

// sound: a soft click every few frames while the wave is crossing (thinned), chatter underneath
const FLIP_TEXTURE: Cue[] = [17, 20, 23, 26, 29, 32, 35, 38, 41].map((t, i) => ({
  f: t,
  sfx: i % 3 === 0 ? "click" : i % 3 === 1 ? "click-lo" : "key-2",
  vol: i % 3 === 0 ? 0.16 : 0.13,
}));
const firstAlerts = [...NC]
  .sort((p, q) => p.a - q.a)
  .slice(0, 2)
  .map((v, i) => ({ f: Math.ceil(v.a + FLIP / 2), sfx: "blip-down" as const, vol: i === 0 ? 0.18 : 0.13 }));

export const cues: Cue[] = [
  { f: 0, sfx: "glitch-1", vol: 0.28 },
  { f: 0, sfx: "whoosh-rev", vol: 0.26 }, // reticle converging into the launch
  { f: LAUNCH, sfx: "blip-hi", vol: 0.3 },
  { f: LAUNCH, sfx: "whoosh", vol: 0.32 },
  { f: LAUNCH + 1, sfx: "chatter", vol: 0.3 },
  ...FLIP_TEXTURE,
  ...firstAlerts,
  { f: DONE, sfx: "blip-up", vol: 0.32 },
  { f: DONE, sfx: "snap", vol: 0.22 },
];
