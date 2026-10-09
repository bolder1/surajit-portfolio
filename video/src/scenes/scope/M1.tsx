import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ModuleShell, Em } from "../../lib/ModuleShell";
import { C, mono } from "../../lib/theme";
import { clamp, EO, prog } from "../../lib/anim";
import { Glow } from "../../lib/FX";
import type { Cue, Sfx } from "../../lib/cues";
import { DotGrid, flashAt, Mono, partialAttr, pointAt, poly, roundPoly, Stage, Wipe, type Poly, type Pt } from "../_M1/kit";

/**
 * SCOPE 01 · IdP · SSO (60 f): "One identity. Every app."
 * f0     identity node live (portrait, vermilion ring draws on).
 * f0–10  dotted elbow connectors race out of the identity; app surfaces snap in as the front reaches them.
 *        The mosaic is deliberately uneven: wide app windows, square tools, small monogram chips.
 * f6–28  packets travel; arrivals accelerate (15 → 28). Each arrival authorises its app: status dot →
 *        vermilion, border brightens, and wide windows swap their sign-in form for the app itself
 *        (no second password prompt: the point of SSO).
 * f30    (beat 3) every app signed in: one pulse off the identity. f30–50 hold. f50–58 exit.
 */

const I: Pt = { x: 872, y: 520 };
const R_IMG = 84;
const PORT_R = 112;
const XA = 1066; // trunk
const ROW_Y = [254, 444, 634];
const FOCUS: Pt = { x: 1300, y: 520 };
const GRANT = 30;

type Kind = "win" | "sq" | "sm";
const SIZE: Record<Kind, { w: number; h: number; r: number }> = {
  win: { w: 252, h: 150, r: 18 },
  sq: { w: 112, h: 112, r: 24 },
  sm: { w: 64, h: 64, r: 16 },
};
type Spec = { kind: Kind; row: number; x: number; v: number };
// v: content variant (win: 0 terminal, 1 chart, 2 docs · sq: glyph index · sm: monogram index)
const SPECS: Spec[] = [
  { kind: "win", row: 0, x: 1116, v: 0 },
  { kind: "sq", row: 0, x: 1392, v: 0 },
  { kind: "sm", row: 0, x: 1528, v: 0 },
  { kind: "sq", row: 0, x: 1616, v: 1 },
  { kind: "sm", row: 1, x: 1116, v: 1 },
  { kind: "sq", row: 1, x: 1204, v: 2 },
  { kind: "win", row: 1, x: 1340, v: 1 },
  { kind: "sq", row: 2, x: 1116, v: 3 },
  { kind: "win", row: 2, x: 1252, v: 2 },
  { kind: "sq", row: 2, x: 1528, v: 4 },
];

/* signal front: px reached along every connector at frame f */
const FRONT_LEN = 1000;
const front = (f: number) => FRONT_LEN * interpolate(f, [0, 10], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 0.75, 0.3, 1) });
const whenFront = (s: number) => {
  for (let f = 0; f <= 60; f += 0.25) if (front(f) >= s) return f;
  return 60;
};

type Tile = Spec & { y: number; w: number; h: number; r: number; px: number; path: Poly; appear: number; arrive: number; depart: number };
const TILES: Tile[] = (() => {
  const raw = SPECS.map((s) => {
    const { w, h, r } = SIZE[s.kind];
    const y = ROW_Y[s.row];
    const px = s.x + w / 2;
    const bus = y - 20;
    const path = poly(
      roundPoly(
        [
          { x: I.x + PORT_R, y: I.y },
          { x: XA, y: I.y },
          { x: XA, y: bus },
          { x: px, y: bus },
          { x: px, y },
        ],
        12,
      ),
    );
    return { ...s, y, w, h, r, px, path };
  });
  const order = [...raw].sort((a, b) => a.path.len - b.path.len);
  const n = raw.length;
  return raw.map((t) => {
    const k = order.indexOf(t);
    const arrive = Math.round(15 + 13 * Math.pow(k / (n - 1), 0.65)); // accelerating cascade, first on beat 2
    const travel = 7 + t.path.len / 125;
    return { ...t, appear: whenFront(t.path.len - 30), arrive, depart: arrive - travel };
  });
})();
const PACKET = Easing.bezier(0.45, 0, 0.3, 1);

/* ---------------- line-art content (drawn from real app chrome, unbranded) ---------------- */
const st = { fill: "none", stroke: C.paper, strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const SQ_GLYPHS: React.ReactNode[] = [
  // chat
  <g key="chat" {...st}><rect x={6} y={8} width={28} height={20} rx={5} /><polyline points="12,28 12,34 19,28" /></g>,
  // database
  <g key="db" {...st}><ellipse cx={20} cy={10} rx={12} ry={4} /><path d="M8 10 V30 A12 4 0 0 0 32 30 V10 M8 20 A12 4 0 0 0 32 20" /></g>,
  // calendar
  <g key="cal" {...st}><rect x={6} y={9} width={28} height={25} rx={3} /><path d="M6 16 H34 M13 5 V12 M27 5 V12" /><rect x={20} y={22} width={7} height={6} rx={1} /></g>,
  // branch
  <g key="git" {...st}><circle cx={13} cy={9} r={3} /><circle cx={13} cy={31} r={3} /><circle cx={27} cy={15} r={3} /><path d="M13 12 V28 M27 18 C27 25 15 22 13.5 28" /></g>,
  // board
  <g key="board" {...st}><rect x={6} y={7} width={8} height={26} rx={2} /><rect x={16} y={7} width={8} height={16} rx={2} /><rect x={26} y={7} width={8} height={21} rx={2} /></g>,
];
const MONO = ["HR", "VPN"];

/** sign-in form skeleton shown inside a window until its packet lands */
const SignIn: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => (
  <g>
    <rect x={x + 22} y={y + 46} width={w - 44} height={20} rx={5} {...st} strokeOpacity={0.35} />
    <rect x={x + 22} y={y + 74} width={w - 44} height={20} rx={5} {...st} strokeOpacity={0.35} />
    {[0, 1, 2, 3, 4, 5].map((k) => (
      <circle key={k} cx={x + 36 + k * 11} cy={y + 84} r={2.2} fill={C.paper} opacity={0.35} />
    ))}
    <rect x={x + 22} y={y + 106} width={86} height={22} rx={11} {...st} strokeOpacity={0.5} />
    <path d={`M ${x + 46} ${y + 117} H ${x + 84}`} {...st} strokeOpacity={0.5} />
  </g>
);

/** the app itself, revealed once authorised */
const AppBody: React.FC<{ v: number; x: number; y: number; w: number; f: number; at: number }> = ({ v, x, y, w, f, at }) => {
  const p = prog(f, at, at + 9, EO);
  if (v === 0) {
    // terminal
    const lines = [150, 96, 176, 120];
    return (
      <g>
        <polyline points={`${x + 24},${y + 50} ${x + 31},${y + 56} ${x + 24},${y + 62}`} {...st} />
        {lines.map((L, k) => (
          <path key={k} d={`M ${x + (k === 0 ? 40 : 24)} ${y + 56 + k * 19} H ${x + (k === 0 ? 40 : 24) + L * Math.min(1, Math.max(0, p * 1.6 - k * 0.2))}`} {...st} strokeOpacity={k === 0 ? 0.9 : 0.4} />
        ))}
      </g>
    );
  }
  if (v === 1) {
    // analytics line chart
    const pts = [0, 0.35, 0.25, 0.55, 0.48, 0.8, 0.7, 0.95];
    const W = w - 48;
    const d = pts.map((q, k) => `${(x + 24 + (W * k) / (pts.length - 1)).toFixed(1)},${(y + 128 - q * 66).toFixed(1)}`).join(" ");
    return (
      <g>
        <path d={`M ${x + 24} ${y + 130} H ${x + w - 24}`} {...st} strokeOpacity={0.3} />
        <polyline points={d} {...st} strokeDasharray={`${p * 400} 400`} />
        {[0.33, 0.66].map((q, k) => (
          <path key={k} d={`M ${x + 24 + W * q} ${y + 54} V ${y + 130}`} stroke={C.paper} strokeOpacity={0.12} strokeDasharray="2 4" />
        ))}
      </g>
    );
  }
  // docs: sidebar + heading + paragraph
  return (
    <g>
      <path d={`M ${x + 70} ${y + 40} V ${y + 136}`} stroke={C.paper} strokeOpacity={0.2} />
      {[0, 1, 2, 3].map((k) => (
        <path key={k} d={`M ${x + 22} ${y + 56 + k * 18} H ${x + 50}`} {...st} strokeOpacity={k === 1 ? 0.9 : 0.3} />
      ))}
      <path d={`M ${x + 88} ${y + 58} H ${x + 88 + 96 * p}`} {...st} strokeWidth={4} />
      {[0, 1, 2, 3].map((k) => (
        <path key={k} d={`M ${x + 88} ${y + 82 + k * 15} H ${x + 88 + [134, 120, 140, 70][k] * Math.min(1, Math.max(0, p * 1.5 - k * 0.15))}`} {...st} strokeOpacity={0.4} />
      ))}
    </g>
  );
};

const TileView: React.FC<{ t: Tile; f: number }> = ({ t, f }) => {
  const ap = prog(f, t.appear - 1, t.appear + 4, EO);
  if (ap <= 0) return null;
  const q = prog(f, t.arrive, t.arrive + 6, EO);
  const fl = flashAt(f, t.arrive, 7);
  const g = flashAt(f, GRANT, 10);
  const cx = t.x + t.w / 2;
  const cy = t.y + t.h / 2;
  const sc = (0.94 + 0.06 * ap) * (1 + 0.035 * fl);
  const authed = f >= t.arrive;
  const dot = { x: t.x + t.w - 16, y: t.y + 16 };
  return (
    <g opacity={ap} transform={`translate(${cx} ${cy}) scale(${sc}) translate(${-cx} ${-cy})`}>
      <rect x={t.x} y={t.y} width={t.w} height={t.h} rx={t.r} fill={C.ink2} fillOpacity={0.94} />
      <rect
        x={t.x + 0.75}
        y={t.y + 0.75}
        width={t.w - 1.5}
        height={t.h - 1.5}
        rx={t.r - 0.75}
        fill="none"
        stroke={C.paper}
        strokeOpacity={authed ? 0.5 + 0.3 * q + 0.2 * g : 0.22}
        strokeWidth={1.2}
        strokeDasharray={authed ? undefined : "3 5"}
      />
      {fl > 0.01 ? <rect x={t.x} y={t.y} width={t.w} height={t.h} rx={t.r} fill="none" stroke={C.acc} strokeWidth={2} opacity={fl} /> : null}
      {/* top port */}
      <circle cx={t.px} cy={t.y} r={3} fill={C.ink} stroke={C.paper} strokeOpacity={0.6} strokeWidth={1.2} />

      {t.kind === "win" ? (
        <>
          <path d={`M ${t.x} ${t.y + 30} H ${t.x + t.w}`} stroke={C.paper} strokeOpacity={0.16} />
          <path d={`M ${t.x + 18} ${t.y + 15} H ${t.x + 58}`} {...st} strokeOpacity={0.45} />
          {authed ? (
            <AppBody v={t.v} x={t.x} y={t.y} w={t.w} f={f} at={t.arrive} />
          ) : (
            <SignIn x={t.x} y={t.y} w={t.w} />
          )}
        </>
      ) : t.kind === "sq" ? (
        <>
          <g transform={`translate(${cx - 20} ${cy - 18})`} opacity={0.35 + 0.65 * q}>
            {SQ_GLYPHS[t.v]}
          </g>
          <rect x={cx - 20} y={t.y + t.h - 20} width={40} height={2} rx={1} fill={C.paper} opacity={0.12} />
          <rect x={cx - 20} y={t.y + t.h - 20} width={40 * q} height={2} rx={1} fill={C.paper} opacity={0.8} />
        </>
      ) : (
        <text
          x={cx}
          y={cy + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fill={C.paper}
          fillOpacity={0.4 + 0.6 * q}
          style={{ fontFamily: mono, fontSize: 15, fontWeight: 600, letterSpacing: "0.06em" }}
        >
          {MONO[t.v]}
        </text>
      )}
      {/* status: hollow ring (pending) → vermilion dot (authorised) */}
      {t.kind !== "sm" ? (
        authed ? (
          <>
            <circle cx={dot.x} cy={dot.y} r={10} fill={C.acc} opacity={0.22 * q} />
            <circle cx={dot.x} cy={dot.y} r={4.2} fill={C.acc} />
          </>
        ) : (
          <circle cx={dot.x} cy={dot.y} r={4} fill="none" stroke={C.paper} strokeOpacity={0.35} strokeWidth={1.2} />
        )
      ) : authed ? (
        <circle cx={t.x + t.w - 10} cy={t.y + 10} r={3.2} fill={C.acc} />
      ) : null}
    </g>
  );
};

const Network: React.FC<{ f: number }> = ({ f }) => {
  const s = front(f);
  const g = prog(f, GRANT, GRANT + 8, EO);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {TILES.map((t, i) => (
        <polyline
          key={i}
          points={partialAttr(t.path, Math.min(s, t.path.len))}
          fill="none"
          stroke={C.paper}
          strokeOpacity={0.42 + 0.2 * g}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="0 8"
        />
      ))}
      {s < FRONT_LEN - 4
        ? TILES.filter((t) => s < t.path.len).map((t, i) => {
            const p = pointAt(t.path, s);
            return <circle key={i} cx={p.x} cy={p.y} r={2.6} fill={C.paper} />;
          })
        : null}
      {TILES.map((t, i) => {
        if (f < t.depart || f > t.arrive) return null;
        const at = (fr: number) => Math.min(front(fr) - 8, t.path.len * PACKET(Math.max(0, Math.min(1, (fr - t.depart) / (t.arrive - t.depart)))));
        const head = pointAt(t.path, at(f));
        return (
          <g key={i}>
            {[5, 4, 3, 2, 1].map((j) => {
              const g2 = pointAt(t.path, at(f - j * 0.4));
              return <circle key={j} cx={g2.x} cy={g2.y} r={4.4 - j * 0.6} fill={C.acc} opacity={0.6 * Math.pow(0.66, j)} />;
            })}
            <circle cx={head.x} cy={head.y} r={11} fill={C.acc} opacity={0.2} />
            <circle cx={head.x} cy={head.y} r={4.6} fill={C.acc} />
            <circle cx={head.x} cy={head.y} r={1.8} fill="#fff4e6" />
          </g>
        );
      })}
    </svg>
  );
};

const Identity: React.FC<{ f: number }> = ({ f }) => {
  const ring = prog(f, 0, 10, EO);
  const circ = 2 * Math.PI * 96;
  const pulse = flashAt(f, GRANT, 12);
  const rot = f * 0.5;
  const s = 0.31;
  const lab = prog(f, 4, 13, EO);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: I.x - R_IMG,
          top: I.y - R_IMG,
          width: R_IMG * 2,
          height: R_IMG * 2,
          borderRadius: "50%",
          overflow: "hidden",
          background: C.ink2,
          transform: `scale(${1 + 0.03 * pulse})`,
        }}
      >
        <Img
          src={staticFile("img/portrait-cut.png")}
          style={{ position: "absolute", width: 1500 * s, height: 1800 * s, left: R_IMG - 808 * s, top: R_IMG - 800 * s, filter: "contrast(1.08) saturate(0.85)" }}
        />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: "inset 0 0 26px 6px rgba(13,10,7,0.85)" }} />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <circle
          cx={I.x}
          cy={I.y}
          r={96}
          fill="none"
          stroke={C.acc}
          strokeWidth={2.5}
          strokeDasharray={`${circ * ring} ${circ}`}
          transform={`rotate(-90 ${I.x} ${I.y})`}
          style={{ filter: `drop-shadow(0 0 ${5 + 12 * pulse}px ${C.accGlow})` }}
        />
        <circle cx={I.x} cy={I.y} r={PORT_R} fill="none" stroke={C.paper} strokeOpacity={0.4} strokeWidth={1} strokeDasharray="2 6" transform={`rotate(${-rot} ${I.x} ${I.y})`} />
        <g transform={`rotate(${rot} ${I.x} ${I.y})`} opacity={0.5}>
          {Array.from({ length: 72 }, (_, i) => {
            const a = (i / 72) * Math.PI * 2;
            const r1 = i % 6 === 0 ? 121 : 124;
            return (
              <line
                key={i}
                x1={I.x + Math.cos(a) * r1}
                y1={I.y + Math.sin(a) * r1}
                x2={I.x + Math.cos(a) * 129}
                y2={I.y + Math.sin(a) * 129}
                stroke={C.paper}
                strokeOpacity={i % 6 === 0 ? 0.9 : 0.4}
                strokeWidth={1}
              />
            );
          })}
        </g>
        <circle cx={I.x + PORT_R} cy={I.y} r={4} fill={C.ink} stroke={C.paper} strokeWidth={1.5} />
      </svg>
      <Wipe p={lab} style={{ position: "absolute", left: I.x - 96, top: I.y + 150 }}>
        <Mono size={15} color={C.paper}>Subject · S. Dutta</Mono>
        <Mono size={14} style={{ marginTop: 10 }}>IdP · SAML / OIDC</Mono>
      </Wipe>
    </>
  );
};

const Motif: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = prog(f, GRANT, GRANT + 14, EO);
  return (
    <Stage focus={FOCUS} exitA={50}>
      <DotGrid focus={FOCUS} id="m1" />
      <Glow x={I.x} y={I.y} r={240} opacity={0.18 + 0.32 * flashAt(f, GRANT, 16)} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <circle cx={I.x} cy={I.y} r={190} fill="none" stroke={C.paper} strokeOpacity={0.07} />
        <circle cx={I.x} cy={I.y} r={270} fill="none" stroke={C.paper} strokeOpacity={0.05} strokeDasharray="1 7" />
        {pulse > 0 && pulse < 1 ? <circle cx={I.x} cy={I.y} r={PORT_R + 280 * pulse} fill="none" stroke={C.acc} strokeWidth={1.5} opacity={0.75 * (1 - pulse)} /> : null}
      </svg>
      <Network f={f} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {TILES.map((t, i) => (
          <TileView key={i} t={t} f={f} />
        ))}
      </svg>
      <Identity f={f} />
    </Stage>
  );
};

export const Scene: React.FC = () => (
  <ModuleShell index={1} title="IdP · SSO" line={<>One identity. <Em>Every app.</Em></>}>
    <AbsoluteFill>
      <Motif />
    </AbsoluteFill>
  </ModuleShell>
);

const arrivals = [...new Set(TILES.map((t) => t.arrive))].sort((a, b) => a - b);
const arrivalCues: Cue[] = arrivals
  .filter((_, k) => k % 2 === 0)
  .map((fr, k) => ({ f: fr, sfx: (k % 2 === 0 ? "blip" : "blip-hi") as Sfx, vol: 0.2 + 0.02 * k }));

export const cues: Cue[] = [
  { f: 0, sfx: "swish", vol: 0.32 }, // connectors race out of the identity
  { f: 4, sfx: "click-lo", vol: 0.16 }, // app surfaces snap in
  { f: 8, sfx: "click", vol: 0.13 },
  { f: 9, sfx: "chatter", vol: 0.16 }, // packets in flight
  ...arrivalCues,
  { f: GRANT, sfx: "blip-up", vol: 0.36 }, // every app signed in
  { f: GRANT, sfx: "snap", vol: 0.2 },
];
