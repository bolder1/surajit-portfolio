import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, dots, mona, mono, sans } from "../lib/theme";
import { clamp, EI, EIO, EO, lerp, prog } from "../lib/anim";
import { Glow } from "../lib/FX";
import type { Cue, Sfx } from "../lib/cues";

/**
 * 05 · SPEED (120 f) — the AI-workflow proof, told on a posture instrument.
 * One instrument, three states:
 *  f0–27   GAUGE: a 270° gauge of 15 day-segments sweeps full. TYPICAL CYCLE · 15 business days · 3 WEEKS
 *  f30–43  UNCURL: the arc straightens into a 3-week timeline (curvature → 0, segments become day cells)
 *  f45     beat 4: the first 5 days light vermilion; the other 10 fold flat, right to left
 *  f45–60  the Doto odometer climbs with the fold … lands on −70 % on the bar downbeat (f60)
 *  f62–84  ACTIVE DIRECTORY PROTOTYPE / FIGMA MAKE + CLAUDE · AI-ASSISTED type in; hold
 *  f105–116 exit (beat 8): stat wipes down, lines wipe left, labels drop, cells retract to the 5 days
 */

const N = 15;
const DAYS = "MTWTF";

// gauge
const G = { x: 960, y: 560 };
const R = 250;
const ARC = (R * Math.PI * 1.5) / N; // arc length per day
const SWEEP_A = 1;
const SWEEP_B = 24;
const sweepP = (f: number) => prog(f, SWEEP_A, SWEEP_B, Easing.bezier(0.3, 0.1, 0.2, 1));

// row
const CELL_W = 92;
const CELL_H = 64;
const GAP = 10;
const WEEK_GAP = 36;
const ROW_W = N * CELL_W + (N - 3) * GAP + 2 * WEEK_GAP;
const ROW_L = 960 - ROW_W / 2;
const ROW_Y = 690;
const cellLeft = (k: number) => ROW_L + k * (CELL_W + GAP) + Math.floor(k / 5) * (WEEK_GAP - GAP);
const sRow = (k: number) => cellLeft(k) + CELL_W / 2 - 960;
const sArc = (k: number) => (k - (N - 1) / 2) * ARC;

// timing
const UNCURL_A = 30;
const UNCURL_B = 43;
const STATE = 45; // 5 days light up
const foldStart = (k: number) => STATE + 1 + (N - 1 - k); // k = 14 first … k = 5 last (f55)
const FOLD_LEN = 5;
const LAND = 60; // −70 % on the downbeat
const ODO = (f: number) => 70 * interpolate(f, [STATE + 1, LAND], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0.45, 0.35, 1) });
const L1 = "ACTIVE DIRECTORY PROTOTYPE";
const L2 = "FIGMA MAKE + CLAUDE · AI-ASSISTED";
const T1 = 63;
const T2 = 72;
const CPS = 2.6; // chars per frame
const EXIT = 105;

// frame where the sweep completes each day (for the tick cues)
const DAY_FRAMES = Array.from({ length: N }, (_, k) => {
  for (let f = 0; f <= SWEEP_B; f++) if (sweepP(f) * N >= k + 1 - 1e-6) return f;
  return SWEEP_B;
});
// frames where the odometer's tens digit turns over
const ODO_FRAMES = (() => {
  const out: number[] = [];
  let last = 0;
  for (let f = STATE; f <= LAND; f++) {
    const t = Math.floor(ODO(f) / 10 + 1e-6);
    if (t !== last) {
      out.push(f);
      last = t;
    }
  }
  return out;
})();

/** curl: position + tangent of the point at arc-length s from the strip's midpoint */
const curl = (s: number, kappa: number) => {
  if (kappa < 1e-6) return { x: s, y: 0, a: 0 };
  const th = kappa * s;
  return { x: Math.sin(th) / kappa, y: (1 - Math.cos(th)) / kappa, a: th };
};

// ── odometer column ────────────────────────────────────────────────────────
const FS = 380; // Doto size
const LH = Math.round(FS * 0.86);
const CAP_TOP = LH / 2 - 0.6 * FS + 0.95 * FS - 0.7 * FS; // Doto cap top inside its line box
const PCT = 210;
const STAT_X = 172;
const STAT_Y = 200;
const Column: React.FC<{ pos: number; wght: number; color: string }> = ({ pos, wght, color }) => (
  <div style={{ position: "relative", height: LH, width: FS * 0.6, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${-pos * LH}px)` }}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, i) => (
        <div key={i} style={{ height: LH, lineHeight: `${LH}px`, fontFamily: dots, fontWeight: wght, fontSize: FS, color, textAlign: "center" }}>
          {d}
        </div>
      ))}
    </div>
  </div>
);

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const push = interpolate(f, [0, 120], [1, 1.045], clamp);
  const exitP = prog(f, EXIT + 1, EXIT + 12, EI);
  const drop = prog(f, EXIT + 2, EXIT + 9, EI); // labels fall out of their masks
  const wipe = prog(f, EXIT + 1, EXIT + 8, EI); // system lines wipe right → left

  // ── gauge state
  const p = sweepP(f);
  const daysF = p * N;
  const shown = Math.min(N, Math.floor(daysF + 1e-6));
  const gaugeOut = prog(f, UNCURL_A, UNCURL_A + 7, EO);
  const ringIn = prog(f, 0, 9, EO);

  // ── uncurl
  const u = prog(f, UNCURL_A, UNCURL_B, EIO);
  const kappa = (1 - u) / R;
  const mid = { x: 960, y: lerp(G.y - R, ROW_Y, u) };
  const lettersIn = prog(f, UNCURL_B - 4, UNCURL_B + 1, EO);

  // ── state change
  const landS = spring({ frame: f - LAND, fps, config: { stiffness: 260, damping: 14 } });
  const landed = f >= LAND;
  const odo = ODO(f);
  const statIn = prog(f, STATE + 1, STATE + 7, EO);
  const daysS = spring({ frame: f - STATE - 1, fps, config: { stiffness: 220, damping: 15 } });
  const strike = prog(f, LAND, LAND + 5, EO);

  // ── sweep tick ring
  const ticks: React.ReactNode[] = [];
  for (let j = 0; j <= 60; j++) {
    const deg = -135 + (270 * j) / 60;
    const major = j % 20 === 0;
    const rad = (deg * Math.PI) / 180;
    const r0 = R + 30;
    const r1 = major ? R + 52 : R + 40;
    const lit = j / 60 <= p + 1e-6;
    const show = j / 60 <= ringIn;
    if (!show) continue;
    ticks.push(
      <line
        key={j}
        x1={G.x + Math.sin(rad) * r0}
        y1={G.y - Math.cos(rad) * r0}
        x2={G.x + Math.sin(rad) * r1}
        y2={G.y - Math.cos(rad) * r1}
        stroke={C.paper}
        strokeOpacity={lit ? 0.85 : 0.2}
        strokeWidth={major ? 2 : 1.25}
      />,
    );
  }
  const pDeg = -135 + 270 * p;
  const pRad = (pDeg * Math.PI) / 180;

  // ── cells
  const cells = Array.from({ length: N }, (_, k) => {
    const s = lerp(sArc(k), sRow(k), u);
    const c = curl(s, kappa);
    const x = mid.x + c.x;
    const y = mid.y + c.y;
    const w = lerp(ARC - 15, CELL_W, u);
    const h = lerp(24, CELL_H, u);
    const fill = Math.max(0, Math.min(1, daysF - k)); // partial fill while sweeping
    const five = k < 5;
    const hot = five && f >= STATE + k; // vermilion state, one per frame
    const hotS = hot ? spring({ frame: f - STATE - k, fps, config: { stiffness: 380, damping: 16 } }) : 0;
    const fp = five ? 0 : prog(f, foldStart(k), foldStart(k) + FOLD_LEN, EIO);
    const ex = prog(f, EXIT + 1 + (N - 1 - k) * 0.35, EXIT + 6 + (N - 1 - k) * 0.35, EI);
    const glowPulse = landed && five ? interpolate(f, [LAND, LAND + 2, LAND + 14], [0, 1, 0.25], clamp) : 0;
    return (
      <div
        key={k}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: w,
          height: h,
          transformOrigin: "50% 50%",
          transform: `translate(${x - w / 2}px, ${y - h / 2}px) rotate(${c.a}rad) scale(${(1 + 0.08 * hotS * (1 - hotS) * 4) * (1 - ex)}, ${1 - ex * 0.6})`,
          opacity: 1 - ex * ex,
        }}
      >
        {/* ghost of the folded day: stays on the track */}
        {!five ? (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: C.paper, opacity: 0.32 * fp }} />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "50% 100%",
            transform: fp > 0 ? `perspective(520px) rotateX(${fp * 86}deg)` : undefined,
            opacity: 1 - fp * 0.6,
          }}
        >
          {/* track */}
          <div style={{ position: "absolute", inset: 0, borderRadius: lerp(3, 8, u), border: `1.25px solid rgba(243,236,222,${0.22 + 0.1 * u})`, boxSizing: "border-box" }} />
          {/* fill */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${fill * 100}%`,
              borderRadius: lerp(3, 8, u),
              background: hot ? C.acc : C.paper,
              opacity: hot ? 1 : 0.9,
              boxShadow: hot ? `0 0 ${12 + 26 * glowPulse}px rgba(255,59,31,${0.22 + 0.4 * glowPulse})` : "none",
            }}
          />
          {/* weekday letter */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: sans,
              fontWeight: 650,
              fontSize: 22,
              color: C.ink,
              opacity: lettersIn * (1 - ex),
            }}
          >
            {DAYS[k % 5]}
          </div>
        </div>
      </div>
    );
  });

  // ── odometer
  const ones = odo % 10;
  const tensPos = Math.floor(odo / 10 + 1e-6) + Math.max(0, ones - 9);
  const wght = landed ? interpolate(landS, [0, 1], [520, 880]) : 520;
  const signC = landed ? C.acc : "rgba(243,236,222,0.3)";
  const statPunch = landed ? 1 + 0.05 * (1 - landS) : 1;
  const clipBottom = 100 * (1 - statIn);
  const clipTop = 100 * prog(f, EXIT + 1, EXIT + 9, EI);

  // ── "3 WEEKS": rides from the gauge opening to the end of the track
  const wk = { x: lerp(G.x, ROW_L + ROW_W, u), y: lerp(G.y + 160, ROW_Y + 56, u) };

  const typed = (txt: string, at: number) => txt.slice(0, Math.max(0, Math.min(txt.length, Math.floor((f - at) * CPS))));
  const caret = (txt: string, at: number) => f >= at && (f - at) * CPS < txt.length + 6 && Math.floor(f / 4) % 2 === 0;

  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "960px 560px" }}>
        {/* light */}
        <Glow x={G.x} y={G.y} r={560} color="rgba(243,236,222,0.07)" opacity={1 - u} />
        <Glow x={cellLeft(2) + CELL_W / 2} y={ROW_Y} r={340} opacity={(f >= STATE ? 0.16 : 0) * (1 - exitP) + (landed ? 0.3 * interpolate(f, [LAND, LAND + 14], [1, 0], clamp) : 0)} />
        <Glow x={600} y={360} r={560} opacity={landed ? 0.34 * interpolate(f, [LAND, LAND + 18], [1, 0], clamp) : 0} />

        {/* timeline axis */}
        <div
          style={{
            position: "absolute",
            left: ROW_L - 30,
            top: ROW_Y + CELL_H / 2 + 14,
            width: ROW_W + 60,
            height: 1,
            background: C.paper,
            opacity: 0.18 * (1 - exitP),
            transform: `scaleX(${prog(f, UNCURL_A + 4, UNCURL_B + 2, EO)})`,
            transformOrigin: "50% 50%",
          }}
        />

        {/* gauge chrome */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 1 - gaugeOut }}>
          {ticks}
          {[0, 5, 10, 15].map((d) => {
            const deg = -135 + (270 * d) / 15;
            const rad = (deg * Math.PI) / 180;
            const rr = R + 80;
            return (
              <text
                key={d}
                x={G.x + Math.sin(rad) * rr}
                y={G.y - Math.cos(rad) * rr + 7}
                textAnchor="middle"
                fontFamily={mono}
                fontSize={20}
                letterSpacing="0.1em"
                fill={C.paper}
                opacity={(shown >= d ? 0.85 : 0.3) * ringIn}
              >
                {d}
              </text>
            );
          })}
          {/* pointer */}
          <g transform={`translate(${G.x + Math.sin(pRad) * (R + 64)} ${G.y - Math.cos(pRad) * (R + 64)}) rotate(${pDeg})`} opacity={ringIn}>
            <path d="M 0 -3 L -8 -16 L 8 -16 Z" fill={C.paper} transform="rotate(180)" />
          </g>
        </svg>

        {/* gauge readout */}
        <div style={{ position: "absolute", left: G.x - 300, width: 600, top: G.y - 132, textAlign: "center", opacity: 1 - gaugeOut, transform: `scale(${1 - 0.1 * gaugeOut})` }}>
          <div style={{ fontFamily: mono, fontSize: 20, letterSpacing: "0.26em", color: C.dim }}>TYPICAL CYCLE</div>
          <div style={{ fontFamily: dots, fontWeight: 800, fontSize: 200, lineHeight: "176px", color: C.paper, marginTop: 6 }}>{String(shown).padStart(2, "0")}</div>
          <div style={{ fontFamily: mono, fontSize: 20, letterSpacing: "0.26em", color: C.dim, marginTop: 8 }}>BUSINESS DAYS</div>
        </div>

        {/* cells */}
        {cells}

        {/* 3 WEEKS */}
        <div
          style={{
            position: "absolute",
            left: wk.x,
            top: wk.y,
            transform: `translateX(${lerp(-50, -100, u)}%) translateY(${drop * 60}px)`,
            whiteSpace: "nowrap",
            opacity: prog(f, 18, 26, EO) * (f < UNCURL_B ? 1 - prog(u, 0, 0.2) : prog(f, UNCURL_B, UNCURL_B + 4, EO)) * (1 - drop),
          }}
        >
          <div style={{ ...mona(100, 640), fontSize: lerp(44, 34, u), letterSpacing: "0.04em", color: C.paper, opacity: lerp(0.92, 0.5, prog(f, STATE, STATE + 10, EO)) }}>3 WEEKS</div>
          <div style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 2.5, background: C.paper, opacity: 0.85, transform: `scaleX(${strike})`, transformOrigin: "0 50%" }} />
        </div>

        {/* 5 DAYS */}
        <div style={{ position: "absolute", left: ROW_L - 4, top: ROW_Y + 50, overflow: "hidden", paddingTop: 6 }}>
          <div
            style={{
              ...mona(interpolate(daysS, [0, 1], [75, 116]), interpolate(daysS, [0, 1], [420, 820])),
              fontSize: 76,
              lineHeight: 1,
              color: C.paper,
              whiteSpace: "nowrap",
              transform: `translateY(${(1 - Math.min(1, daysS * 1.4)) * 105 + drop * 110}%)`,
              letterSpacing: "-0.01em",
            }}
          >
            5 DAYS
          </div>
        </div>

        {/* odometer: −70 % */}
        <div style={{ position: "absolute", left: STAT_X, top: STAT_Y, clipPath: `inset(${clipTop}% -60px ${clipBottom}% -60px)` }}>
          <div style={{ display: "flex", alignItems: "flex-start", transform: `scale(${statPunch})`, transformOrigin: "0% 100%" }}>
            <div
              style={{
                height: LH,
                lineHeight: `${LH}px`,
                width: FS * 0.6,
                marginRight: -34,
                fontFamily: dots,
                fontWeight: wght,
                fontSize: FS,
                color: signC,
                textAlign: "center",
                textShadow: landed ? `0 0 34px rgba(255,59,31,${0.45 * (1 - landS * 0.6)})` : "none",
              }}
            >
              −
            </div>
            <Column pos={tensPos} wght={wght} color={C.paper} />
            <Column pos={ones} wght={wght} color={C.paper} />
            {/* the unit in solid Mona Sans: dot-matrix % reads as an X at this resolution */}
            <div
              style={{
                ...mona(landed ? interpolate(landS, [0, 1], [75, 125]) : 75, landed ? interpolate(landS, [0, 1], [380, 820]) : 380),
                fontSize: PCT,
                lineHeight: `${PCT}px`,
                marginTop: CAP_TOP - 0.156 * PCT,
                marginLeft: 18,
                color: signC,
                textShadow: landed ? `0 0 34px rgba(255,59,31,${0.45 * (1 - landS * 0.6)})` : "none",
              }}
            >
              %
            </div>
          </div>
        </div>

        {/* system lines */}
        <div style={{ position: "absolute", left: 1120, top: 330, fontFamily: mono, whiteSpace: "nowrap", clipPath: `inset(0 ${wipe * 100}% 0 0)` }}>
          <div style={{ fontSize: 18, letterSpacing: "0.26em", color: C.dim, opacity: statIn, height: 26 }}>CYCLE TIME</div>
          <div style={{ width: 600, height: 1, background: C.paper, opacity: 0.2, margin: "18px 0 24px", transform: `scaleX(${prog(f, LAND, LAND + 10, EO)})`, transformOrigin: "0 50%" }} />
          <div style={{ fontSize: 30, letterSpacing: "0.12em", color: C.paper, height: 40 }}>
            {typed(L1, T1)}
            {caret(L1, T1) && f < T2 ? <span style={{ color: C.acc }}>▌</span> : null}
          </div>
          <div style={{ fontSize: 23, letterSpacing: "0.14em", color: C.dim, marginTop: 12, height: 30 }}>
            {typed(L2, T2)}
            {caret(L2, T2) ? <span style={{ color: C.acc }}>▌</span> : null}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const keys: Sfx[] = ["key-0", "key-3", "key-1", "key-4", "key-2", "key-5"];
/** thin a run of frames so no two ticks sit closer than `gap` frames */
const thin = (frames: number[], gap = 2) =>
  frames.reduce<number[]>((acc, fr) => (acc.length === 0 || fr - acc[acc.length - 1] >= gap ? [...acc, fr] : acc), []);
const dayTicks = thin(DAY_FRAMES.slice(0, N - 1));
export const cues: Cue[] = [
  { f: 0, sfx: "blip", vol: 0.24 }, // instrument powers on
  { f: 1, sfx: "chatter", vol: 0.16 }, // tick ring draws
  // a tick as the sweep crosses each day (thinned to ≥2 f apart)
  ...dayTicks.map((fr, i) => ({ f: fr, sfx: i % 2 ? ("click" as const) : ("key-1" as const), vol: 0.15 + 0.008 * i })),
  { f: DAY_FRAMES[N - 1], sfx: "click-lo", vol: 0.26 }, // day 15: full cycle
  { f: UNCURL_A - 2, sfx: "whoosh", vol: 0.42 }, // arc uncurls into 3 weeks
  { f: UNCURL_B, sfx: "snap", vol: 0.24 },
  { f: STATE, sfx: "blip-up", vol: 0.32 }, // 5 days go live
  { f: STATE + 1, sfx: "swish", vol: 0.32 }, // 10 days fold away
  // odometer: a tick each time the tens digit turns over
  ...thin(ODO_FRAMES.filter((fr) => fr <= LAND - 5)).map((fr, i) => ({ f: fr, sfx: keys[i % keys.length], vol: 0.2 })),
  // near-silence, then the landing on the downbeat
  { f: LAND, sfx: "impact-soft", vol: 0.88 },
  { f: LAND, sfx: "snap", vol: 0.3 },
  // system lines type in (every 3rd char)
  ...Array.from({ length: Math.ceil(L1.length / CPS) }, (_, i) => T1 + i)
    .filter((_, i) => i % 3 === 0)
    .map((fr, i) => ({ f: fr, sfx: keys[(i + 2) % keys.length], vol: 0.14 })),
  ...Array.from({ length: Math.ceil(L2.length / CPS) }, (_, i) => T2 + i)
    .filter((_, i) => i % 3 === 1)
    .map((fr, i) => ({ f: fr, sfx: keys[(i + 4) % keys.length], vol: 0.13 })),
  { f: EXIT, sfx: "whoosh", vol: 0.38 },
];
