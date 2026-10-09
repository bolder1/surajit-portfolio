import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ModuleShell, Em } from "../../lib/ModuleShell";
import { C, dots, mono } from "../../lib/theme";
import { clamp, EI, EO, rand } from "../../lib/anim";
import type { Cue } from "../../lib/cues";

/**
 * SCOPE 06 · ENDPOINT MANAGEMENT (60 f) · a policy wave across the fleet.
 * A wall of 96 line-art devices (laptop / phone / tablet / desktop) sits dim and unmanaged. One device is
 * selected, the policy is pushed from it and radiates outward: each device flips to enrolled (cream). A few
 * come back out of policy (vermilion ✕), then remediate. Every number on screen counts icons on screen:
 * ENROLLED climbs to 096/096, OUT OF POLICY rises with the ✕ marks and falls back to 00.
 * Vermilion = the policy front and the alerts only; when the last alert clears, the accent leaves the wall.
 *  f2     origin device selected (UI snap)
 *  f8     PUSH (the and-of-1): selection hands off to the wave
 *  f8–22  wave crosses the wall; devices flip, ✕ marks appear
 *  f19–30 out-of-policy devices remediate, one by one; near-silence f23–29
 *  f30    beat 2: last device fixed, OUT OF POLICY 00, held 23 f
 *  f53–58 exit
 */
const PUSH = 8;
const DONE = 30;
const EXIT = 53;
const FLIP = 6; // frames for a device flip

// wall geometry: 16 × 6 = 96 devices, all inside the safe area (x ≤ 1780, above the title band)
const X0 = 876;
const Y0 = 320;
const P = 56; // pitch
const S = 38; // icon box
const COLS = 16;
const ROWS = 6;
const RIGHT = X0 + (COLS - 1) * P + S;

type Kind = "laptop" | "phone" | "tablet" | "desktop";
const KINDS: Kind[] = ["laptop", "laptop", "phone", "desktop", "tablet", "laptop", "phone", "desktop"];

const ORIGIN = { c: 7, r: 2 };
const OX = X0 + ORIGIN.c * P + S / 2;
const OY = Y0 + ORIGIN.r * P + S / 2;

type Dev = { x: number; y: number; kind: Kind; d: number; a: number; nc: boolean; res: number; k: number };
const RMAX = 500; // reaches the farthest corner device
const WAVE = Easing.bezier(0.3, 0.25, 0.55, 1);
const WAVE_END = 22;
const radius = (f: number) => interpolate(f, [PUSH, WAVE_END], [0, RMAX], { ...clamp, easing: WAVE });
const actFrame = (d: number) => {
  for (let f = PUSH; f <= WAVE_END; f += 0.1) if (radius(f) >= d) return f;
  return WAVE_END;
};

const DEVS: Dev[] = (() => {
  const out: Dev[] = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const x = X0 + c * P;
      const y = Y0 + r * P;
      const k = out.length;
      const d = Math.hypot(x + S / 2 - OX, y + S / 2 - OY);
      const kind = KINDS[Math.floor(rand(c * 3.7 + r * 11.3) * KINDS.length)];
      const isOrigin = c === ORIGIN.c && r === ORIGIN.r;
      const nc = !isOrigin && d > 90 && rand(c * 5.1 + r * 7.9 + 2) < 0.075;
      out.push({ x, y, kind, d, a: actFrame(d), nc, res: 0, k });
    }
  // remediation: each ✕ holds ≥ 8 f; they clear in the order they appeared and the last one lands on DONE
  const ncs = out.filter((v) => v.nc).sort((p, q) => p.a - q.a);
  ncs.forEach((v, i) => {
    // res = frame the remediation flip starts; the device reads fixed at res + FLIP/2
    const last = DONE - FLIP / 2;
    v.res = i === ncs.length - 1 ? last : Math.min(last - 1, Math.max(Math.ceil(v.a + FLIP / 2 + 8), last - 2 * (ncs.length - 1 - i)));
  });
  return out;
})();
const NC = DEVS.filter((v) => v.nc);
const TOTAL = DEVS.length;
const pad = (n: number) => String(n).padStart(2, "0");

/** Device glyphs, 38×38, 1.5 px line. `on` variants carry the enrolled screen fill. */
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
      <rect x={X0 - 24} y={Y0 - 22} width={RIGHT - X0 + 48} height={ROWS * P + 30} />
    </clipPath>
  </defs>
);

/** ✕ visible on this device at frame f (enrolled, out of policy, not yet remediated) */
const alertOn = (v: Dev, f: number) => v.nc && f >= v.a + FLIP / 2 && f < v.res + FLIP / 2;

const DeviceView: React.FC<{ v: Dev; f: number }> = ({ v, f }) => {
  const t = f - v.a;
  let sx = 1;
  let on = false;
  let color: string = C.paper;
  let op = 0.22;
  const cross = alertOn(v, f);
  if (t >= 0) {
    if (t < FLIP) sx = Math.abs(Math.cos((Math.PI * t) / FLIP)); // enrolment flip
    if (t >= FLIP / 2) {
      if (cross) {
        color = C.acc;
        op = 1;
        if (f >= v.res) sx = Math.abs(Math.cos((Math.PI * (f - v.res)) / FLIP)); // remediation flip, first half
      } else {
        on = true;
        op = 0.88;
        if (v.nc && f < v.res + FLIP) sx = Math.abs(Math.cos((Math.PI * (f - v.res)) / FLIP)); // second half
      }
    }
  } else if (v.d < 1 && f >= 2) {
    op = 1; // the selected origin device
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

const Label: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.dim }) => (
  <div style={{ fontFamily: mono, fontSize: 18, letterSpacing: "0.24em", color, whiteSpace: "nowrap" }}>{children}</div>
);

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const push = interpolate(f, [0, 60], [1, 1.05], clamp);
  const exit = interpolate(f, [EXIT, EXIT + 5], [0, 1], { ...clamp, easing: EI });
  const R = radius(f);
  const waveO = f >= PUSH ? interpolate(R, [0, 30, RMAX * 0.8, RMAX], [0, 1, 0.6, 0], clamp) : 0;

  const enrolled = DEVS.filter((v) => f >= v.a + FLIP / 2).length;
  const outN = NC.filter((v) => alertOn(v, f)).length;
  const reporting = f >= PUSH + FLIP / 2; // the fleet starts reporting once the first device has the policy
  const done = f >= DONE;
  const doneS = spring({ frame: f - DONE, fps, config: { stiffness: 320, damping: 15 } });

  // selection: snaps around the origin device, then hands off to the wave
  const selS = spring({ frame: f - 2, fps, config: { stiffness: 520, damping: 22 } });
  const selO = f < 2 ? 0 : interpolate(f, [PUSH, PUSH + 3], [1, 0], clamp);
  const selR = 27 * (1.35 - 0.35 * selS) + interpolate(f, [PUSH, PUSH + 3], [0, 10], clamp);

  const rule = interpolate(f, [0, 9], [0, 1], { ...clamp, easing: EO });

  return (
    <ModuleShell index={6} title="ENDPOINT MANAGEMENT" line={<>Every device, <Em>in policy.</Em></>}>
      <AbsoluteFill style={{ opacity: 1 - exit, transform: `scale(${push + exit * 0.03})`, transformOrigin: `${OX}px ${OY}px` }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <Symbols />
          {/* header rule draws on */}
          <line x1={X0} y1={Y0 - 30} x2={X0 + (RIGHT - X0) * rule} y2={Y0 - 30} stroke={C.paper} strokeWidth={1} opacity={0.22} />
          {DEVS.map((v) => (
            <DeviceView key={v.k} v={v} f={f} />
          ))}
          {/* policy front: one hairline ring, the only moving accent */}
          {f >= PUSH && waveO > 0.01 ? (
            <g clipPath="url(#m6-wall)">
              <circle cx={OX} cy={OY} r={Math.max(1, R)} fill="none" stroke={C.acc} strokeWidth={1.5} opacity={0.9 * waveO} />
            </g>
          ) : null}
          {/* selection on the origin device */}
          {selO > 0.01 ? (
            <rect
              x={OX - selR}
              y={OY - selR}
              width={selR * 2}
              height={selR * 2}
              rx={8}
              fill="none"
              stroke={f >= PUSH - 1 ? C.acc : C.paper}
              strokeWidth={1.5}
              opacity={selO}
            />
          ) : null}
        </svg>

        {/* readouts: every number counts icons on screen */}
        <div style={{ position: "absolute", left: X0, top: 196, display: "flex", gap: 96, alignItems: "flex-end", opacity: f >= 1 ? 1 : 0 }}>
          <div>
            <Label>ENROLLED</Label>
            <div style={{ fontFamily: dots, fontWeight: 800, fontSize: 58, lineHeight: 1, marginTop: 10, color: C.paper, whiteSpace: "nowrap" }}>
              {String(enrolled).padStart(3, "0")}
              <span style={{ color: C.dim }}>/{String(TOTAL).padStart(3, "0")}</span>
            </div>
          </div>
          <div>
            <Label color={outN > 0 ? C.paper : C.dim}>OUT OF POLICY</Label>
            <div
              style={{
                fontFamily: dots,
                fontWeight: 800,
                fontSize: 58,
                lineHeight: 1,
                marginTop: 10,
                whiteSpace: "nowrap",
                color: outN > 0 ? C.acc : C.paper,
                transform: `scale(${done ? 1 + 0.1 * (1 - doneS) : 1})`,
                transformOrigin: "0 100%",
              }}
            >
              {reporting ? pad(outN) : "--"}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </ModuleShell>
  );
};

// sound: the selection, the push, a thinned click texture while the wave crosses, one alert, then quiet
const firstAlert = Math.ceil([...NC].sort((p, q) => p.a - q.a)[0].a + FLIP / 2);
export const cues: Cue[] = [
  { f: 2, sfx: "click", vol: 0.18 }, // device selected
  { f: PUSH, sfx: "blip-hi", vol: 0.3 }, // policy pushed
  ...[10, 13, 16, 20].map((t, i) => ({ f: t, sfx: (["click-lo", "key-2", "click", "key-4"] as const)[i], vol: 0.15 - i * 0.01 })),
  { f: firstAlert, sfx: "blip-down", vol: 0.18 }, // first device out of policy
  // f23–29 near-silence while the last ✕ marks clear
  { f: DONE, sfx: "blip", vol: 0.3 },
  { f: DONE, sfx: "click-lo", vol: 0.2 },
];
