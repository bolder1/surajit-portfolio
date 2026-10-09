import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ModuleShell, Em } from "../../lib/ModuleShell";
import { C, mono, sans } from "../../lib/theme";
import { clamp, EI, EIO, EO, prog } from "../../lib/anim";
import { Glow } from "../../lib/FX";
import type { Cue } from "../../lib/cues";

/**
 * SCOPE 07 · DESIGN SYSTEMS (60 f) — "Systems, then surfaces."
 * An unbranded sign-in card is taken apart into its system, then put back as a surface.
 *  f0–6    card builds front-on, one component per frame (UI snaps)
 *  f3–16   card swings into an isometric view
 *  f9–20   EXPLODE: 8 layers separate along the card normal; surfaces drop to blueprint linework
 *  f17–30  vermilion leaders run to spec annotations (radius / token / spacing / error / focus)
 *          f30 (beat 3): focus ring switches on, 2px vermilion
 *  f39–45  leaders retract, layers collapse (accelerating) and SNAP flat on beat 4;
 *          the blueprint renders back into a solid cream surface on the hit
 *  f52–57  exit
 *
 * Projection is orthographic (true isometric drawing): every layer is a plane parallel to the card,
 * so each one is a single 2D affine matrix, and annotation anchors use the exact same math.
 */

// ── card geometry (card-native px) ─────────────────────────────────────────
const CW = 400;
const CH = 580;
const PAD = 36;
const RAD = 18;

// ── timing ─────────────────────────────────────────────────────────────────
const TILT_A = 2;
const TILT_B = 14;
const EXPLODE = 13;
const WIRE_A = 14;
const WIRE_B = 16;
const COLLAPSE_A = 39;
const SNAP = 45;
const FOCUS = 30;

// ── layer stack (bottom → top) ─────────────────────────────────────────────
const LAYERS = ["grid", "surface", "primary", "input", "divider", "passkey", "sso", "header"] as const;
type LayerId = (typeof LAYERS)[number];
const MID = (LAYERS.length - 1) / 2;
/** reading order: the card builds top to bottom, one component per frame */
const BUILD: LayerId[] = ["grid", "surface", "header", "sso", "passkey", "divider", "input", "primary"];
const SPREAD = 46; // card-native px per layer at full explode
const zIndexOf = (id: LayerId) => LAYERS.indexOf(id);

// ── colour helpers ─────────────────────────────────────────────────────────
const hex = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const INK = hex(C.ink);
const PAPER = hex(C.paper);
/** ink (real UI on cream) → paper (blueprint on ink) */
const tone = (t: number, a = 1) => {
  const c = INK.map((v, i) => Math.round(v + (PAPER[i] - v) * t));
  return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
};
const paperA = (a: number) => `rgba(243,236,222,${Math.max(0, a)})`;

// ── projection ─────────────────────────────────────────────────────────────
type View = { ax: number; az: number; s: number; cx: number; cy: number };
const D2R = Math.PI / 180;
/** card-local (u,v) in px from the top-left, z along the normal → screen */
const project = (v: View, u: number, w: number, z: number) => {
  const x = u - CW / 2;
  const y = w - CH / 2;
  const ca = Math.cos(v.az * D2R);
  const sa = Math.sin(v.az * D2R);
  const cx = Math.cos(v.ax * D2R);
  const sx = Math.sin(v.ax * D2R);
  const x1 = x * ca - y * sa;
  const y1 = x * sa + y * ca;
  return { x: v.cx + v.s * x1, y: v.cy + v.s * (y1 * cx - z * sx) };
};
const layerMatrix = (v: View, z: number) => {
  const ca = Math.cos(v.az * D2R);
  const sa = Math.sin(v.az * D2R);
  const cx = Math.cos(v.ax * D2R);
  const sx = Math.sin(v.ax * D2R);
  const a = v.s * ca;
  const b = v.s * sa * cx;
  const c = -v.s * sa;
  const d = v.s * ca * cx;
  const e = v.cx - a * (CW / 2) - c * (CH / 2);
  const f = v.cy - v.s * z * sx - b * (CW / 2) - d * (CH / 2);
  return `matrix(${a},${b},${c},${d},${e},${f})`;
};

// ── small glyphs ───────────────────────────────────────────────────────────
const KeyGlyph: React.FC<{ color: string }> = ({ color }) => (
  <svg width={26} height={16} viewBox="0 0 26 16" style={{ display: "block" }}>
    <circle cx={6} cy={8} r={4.6} fill="none" stroke={color} strokeWidth={1.8} />
    <path d="M10.6 8 H24 M19 8 V12.2 M23 8 V11" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </svg>
);

// ── layers ─────────────────────────────────────────────────────────────────
type LayerProps = { wire: number; f: number; focus: number; err: number; snapIn: number };

const btn = (top: number, wire: number, filled = false): React.CSSProperties => ({
  position: "absolute",
  left: PAD,
  top,
  width: CW - PAD * 2,
  height: 52,
  borderRadius: 10,
  boxSizing: "border-box",
  border: filled ? `1.5px solid ${paperA(0.75 * wire)}` : `1.5px solid ${tone(wire, 0.2 + 0.4 * wire)}`,
  background: filled ? `rgba(13,10,7,${1 - wire})` : `rgba(255,252,246,${0.55 * (1 - wire)})`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  fontFamily: sans,
  fontWeight: 600,
  fontSize: 18,
  letterSpacing: "-0.005em",
  color: filled ? C.paper : tone(wire),
});

const Layer: React.FC<{ id: LayerId } & LayerProps> = ({ id, wire, f, focus, err }) => {
  switch (id) {
    case "grid": {
      // the 8pt grid + margins the card is built on (only visible as a system)
      const lines: React.ReactNode[] = [];
      for (let x = 16; x < CW; x += 16) lines.push(<line key={`x${x}`} x1={x} y1={0} x2={x} y2={CH} stroke={paperA(0.08)} strokeWidth={1} />);
      for (let y = 16; y < CH; y += 16) lines.push(<line key={`y${y}`} x1={0} y1={y} x2={CW} y2={y} stroke={paperA(0.08)} strokeWidth={1} />);
      return (
        <svg width={CW} height={CH} style={{ position: "absolute", inset: 0, opacity: wire, overflow: "visible" }}>
          {lines}
          <line x1={PAD} y1={0} x2={PAD} y2={CH} stroke={paperA(0.4)} strokeWidth={1} strokeDasharray="6 6" />
          <line x1={CW - PAD} y1={0} x2={CW - PAD} y2={CH} stroke={paperA(0.4)} strokeWidth={1} strokeDasharray="6 6" />
          <rect x={0.75} y={0.75} width={CW - 1.5} height={CH - 1.5} rx={RAD} fill="none" stroke={paperA(0.45)} strokeWidth={1.5} strokeDasharray="10 7" />
        </svg>
      );
    }
    case "surface":
      return (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: RAD,
            boxSizing: "border-box",
            background: `rgba(243,236,222,${1 - 0.96 * wire})`,
            border: `1.5px solid ${paperA(0.7 * wire)}`,
          }}
        />
      );
    case "header":
      return (
        <>
          <div
            style={{
              position: "absolute",
              left: PAD,
              top: 38,
              width: 46,
              height: 46,
              borderRadius: 11,
              boxSizing: "border-box",
              background: `rgba(13,10,7,${1 - wire})`,
              border: `1.5px solid ${paperA(0.8 * wire)}`,
            }}
          >
            <div style={{ position: "absolute", left: 13, top: 13, width: 17, height: 17, borderRadius: 9, border: `2.5px solid ${C.paper}`, boxSizing: "border-box", opacity: 1 - wire * 0.3 }} />
          </div>
          <div style={{ position: "absolute", left: PAD - 2, top: 104, fontFamily: sans, fontWeight: 650, fontSize: 38, letterSpacing: "-0.02em", lineHeight: 1, color: tone(wire) }}>
            Sign in
          </div>
          <div style={{ position: "absolute", left: PAD, top: 152, fontFamily: sans, fontWeight: 450, fontSize: 18, lineHeight: 1, color: tone(wire, 0.55) }}>
            to your workspace
          </div>
        </>
      );
    case "sso":
      return (
        <div style={btn(200, wire)}>
          <KeyGlyph color={tone(wire)} />
          Continue with SSO
        </div>
      );
    case "passkey":
      return <div style={btn(264, wire)}>Use a passkey</div>;
    case "divider":
      return (
        <div style={{ position: "absolute", left: PAD, top: 334, width: CW - PAD * 2, height: 20, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ flex: 1, height: 1.5, background: tone(wire, 0.18 + 0.3 * wire) }} />
          <div style={{ fontFamily: sans, fontSize: 15, fontWeight: 500, color: tone(wire, 0.5) }}>or</div>
          <div style={{ flex: 1, height: 1.5, background: tone(wire, 0.18 + 0.3 * wire) }} />
        </div>
      );
    case "input": {
      const caretOn = Math.floor(f / 4) % 2 === 0;
      return (
        <>
          <div style={{ position: "absolute", left: PAD, top: 370, fontFamily: sans, fontWeight: 600, fontSize: 15, lineHeight: 1, color: tone(wire, 0.8) }}>Work email</div>
          <div
            style={{
              position: "absolute",
              left: PAD,
              top: 394,
              width: CW - PAD * 2,
              height: 52,
              borderRadius: 10,
              boxSizing: "border-box",
              border: `1.5px solid ${tone(wire, 0.28 + 0.35 * wire)}`,
              background: `rgba(255,252,246,${0.7 * (1 - wire)})`,
              display: "flex",
              alignItems: "center",
              paddingLeft: 16,
              fontFamily: sans,
              fontSize: 18,
              color: tone(wire, 0.42),
            }}
          >
            {focus > 0 ? <div style={{ width: 2, height: 24, marginRight: 2, background: C.acc, opacity: caretOn ? 1 : 0 }} /> : null}
            name@company.com
          </div>
          {/* focus ring: 2px, the one accent the card owns */}
          <div
            style={{
              position: "absolute",
              left: PAD - 5,
              top: 389,
              width: CW - PAD * 2 + 10,
              height: 62,
              borderRadius: 14,
              boxSizing: "border-box",
              border: `2px solid ${C.acc}`,
              opacity: focus,
              transform: `scale(${1 + 0.04 * (1 - focus)})`,
              boxShadow: `0 0 18px rgba(255,59,31,${0.45 * focus})`,
            }}
          />
          <div style={{ position: "absolute", left: PAD, top: 458, display: "flex", alignItems: "center", gap: 8, fontFamily: sans, fontWeight: 500, fontSize: 15, color: C.acc, opacity: err }}>
            <svg width={14} height={14} viewBox="0 0 14 14">
              <circle cx={7} cy={7} r={6} fill="none" stroke={C.acc} strokeWidth={1.5} />
              <path d="M7 3.6 V7.6 M7 9.6 V10.2" stroke={C.acc} strokeWidth={1.6} strokeLinecap="round" />
            </svg>
            Enter your work email
          </div>
        </>
      );
    }
    case "primary":
      return (
        <div style={{ ...btn(492, wire, true), gap: 10 }}>
          Continue
          <svg width={16} height={12} viewBox="0 0 16 12">
            <path d="M1 6 H14 M9.5 1.5 L14 6 L9.5 10.5" fill="none" stroke={C.paper} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
  }
};

// ── spec annotations ───────────────────────────────────────────────────────
type Note = { key: string; val: string; layer: LayerId; u: number; v: number; side: "L" | "R"; lx: number; ly: number; at: number };
const NOTES: Note[] = [
  { key: "token", val: "ink-900", layer: "header", u: PAD + 23, v: 61, side: "L", lx: 930, ly: 300, at: 18 },
  { key: "radius", val: "12", layer: "surface", u: CW - 5.3, v: CH - 5.3, side: "R", lx: 1648, ly: 590, at: 21 },
  { key: "spacing", val: "8pt", layer: "grid", u: 16, v: 64, side: "L", lx: 906, ly: 560, at: 24 },
  { key: "state", val: "error", layer: "input", u: PAD + 186, v: 466, side: "R", lx: 1590, ly: 700, at: 27 },
  { key: "focus", val: "2px", layer: "input", u: CW - PAD + 5, v: 420, side: "R", lx: 1590, ly: 430, at: FOCUS },
];
const NOTE_OUT_A = 39;
const NOTE_OUT_B = 43;

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // camera onto the card
  const tilt = prog(f, TILT_A, TILT_B, EIO);
  const drift = interpolate(f, [TILT_B, 58], [0, 1], clamp);
  const view: View = {
    ax: 58 * tilt,
    az: -34 * tilt - 4 * drift,
    s: interpolate(tilt, [0, 1], [0.76, 0.9]) + 0.02 * drift,
    cx: interpolate(tilt, [0, 1], [1420, 1300]),
    cy: interpolate(tilt, [0, 1], [410, 476]),
  };

  // explode → collapse
  const burst = spring({ frame: f - EXPLODE, fps, config: { stiffness: 130, damping: 14, mass: 0.9 } });
  const collapse = prog(f, COLLAPSE_A, SNAP, EI);
  const spread = f >= SNAP ? 0 : burst * (1 - collapse);
  const zOf = (i: number) => (i - MID) * SPREAD * spread + i * 0.01;

  // blueprint while exploded, hard cut back to a rendered surface on the snap
  const wire = f >= SNAP ? 0 : prog(f, WIRE_A, WIRE_B, EIO);
  const focus = f >= FOCUS ? interpolate(f, [FOCUS, FOCUS + 3], [0, 1], { ...clamp, easing: EO }) : 0;
  const err = f >= SNAP ? 0 : prog(f, 26, 29, EO) * (1 - prog(f, NOTE_OUT_A, NOTE_OUT_B, EO));
  const snapFlash = interpolate(f, [SNAP, SNAP + 1, SNAP + 8], [0, 1, 0], clamp);
  const settle = f >= SNAP ? spring({ frame: f - SNAP, fps, config: { stiffness: 420, damping: 18 } }) : 1;

  // build: one component per frame
  const built = (id: LayerId) => f >= BUILD.indexOf(id) - 2;

  const push = interpolate(f, [0, 60], [1, 1.05], clamp);
  const exit = interpolate(f, [52, 57], [0, 1], { ...clamp, easing: EI });

  // exploded-view guides: the four corner posts through the stack
  const zBot = zOf(0);
  const zTop = zOf(LAYERS.length - 1);
  const posts = [
    [0, 0],
    [CW, 0],
    [CW, CH],
    [0, CH],
  ].map(([u, v]) => ({ a: project(view, u, v, zBot), b: project(view, u, v, zTop) }));

  const centre = project(view, CW / 2, CH / 2, 0);

  return (
    <ModuleShell index={7} title="DESIGN SYSTEMS" line={<>Systems, <Em>then surfaces.</Em></>}>
      <AbsoluteFill style={{ opacity: 1 - exit, transform: `scale(${push + exit * 0.04})`, transformOrigin: "1262px 520px" }}>
        <Glow x={centre.x} y={centre.y + 30} r={520} color="rgba(243,236,222,0.10)" opacity={1 - wire * 0.5} />
        <Glow x={centre.x} y={centre.y} r={400} color="rgba(255,244,228,0.16)" opacity={snapFlash} />

        {/* corner posts */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {posts.map((p, i) => (
            <line key={i} x1={p.a.x} y1={p.a.y} x2={p.b.x} y2={p.b.y} stroke={paperA(0.2 * wire * spread)} strokeWidth={1} strokeDasharray="3 5" />
          ))}
        </svg>

        {/* the layers */}
        <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.035 * (1 - settle)})`, transformOrigin: `${centre.x}px ${centre.y}px` }}>
          {LAYERS.map((id, i) =>
            built(id) ? (
              <div
                key={id}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: CW,
                  height: CH,
                  transformOrigin: "0 0",
                  transform: layerMatrix(view, zOf(i)),
                }}
              >
                <Layer id={id} wire={wire} f={f} focus={focus} err={err} snapIn={snapFlash} />
              </div>
            ) : null,
          )}
          {/* the snap: surface renders in with a short cream bloom */}
          {snapFlash > 0.01 ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: CW,
                height: CH,
                borderRadius: RAD,
                transformOrigin: "0 0",
                transform: layerMatrix(view, 0),
                background: "#fffaf0",
                opacity: 0.4 * snapFlash,
                mixBlendMode: "screen",
              }}
            />
          ) : null}
        </div>

        {/* leaders + annotations */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {NOTES.map((n, i) => {
            const draw = prog(f, n.at, n.at + 5, EO);
            const out = prog(f, NOTE_OUT_A + i * 0.5, NOTE_OUT_B, EO);
            const vis = draw * (1 - out);
            if (vis <= 0.001) return null;
            const a = project(view, n.u, n.v, zOf(zIndexOf(n.layer)));
            const dir = n.side === "R" ? 1 : -1;
            const end = { x: n.lx - dir * 14, y: n.ly };
            const knee = { x: end.x - dir * 46, y: n.ly };
            const l1 = Math.hypot(knee.x - a.x, knee.y - a.y);
            const l2 = Math.hypot(end.x - knee.x, end.y - knee.y);
            const L = l1 + l2;
            return (
              <g key={n.key}>
                <path
                  d={`M ${a.x} ${a.y} L ${knee.x} ${knee.y} L ${end.x} ${end.y}`}
                  fill="none"
                  stroke={C.acc}
                  strokeWidth={1.25}
                  strokeDasharray={L}
                  strokeDashoffset={L * (1 - vis)}
                />
                <circle cx={a.x} cy={a.y} r={3.5 * Math.min(1, draw * 3)} fill={C.acc} opacity={1 - out} />
                <circle cx={a.x} cy={a.y} r={4 + 6 * draw} fill="none" stroke={C.acc} strokeWidth={1} opacity={(1 - out) * (1 - draw * 0.6)} />
              </g>
            );
          })}
        </svg>
        {NOTES.map((n, i) => {
          const txt = `${n.key} / ${n.val}`;
          const typed = Math.floor(interpolate(f, [n.at + 1, n.at + 1 + txt.length / 3.4], [0, txt.length], clamp));
          const out = prog(f, NOTE_OUT_A + i * 0.5, NOTE_OUT_B, EO);
          if (f < n.at + 1 || out >= 1) return null;
          const k = txt.slice(0, Math.min(typed, n.key.length + 3));
          const v = typed > n.key.length + 3 ? txt.slice(n.key.length + 3, typed) : "";
          return (
            <div
              key={n.key}
              style={{
                position: "absolute",
                top: n.ly - 14,
                ...(n.side === "R" ? { left: n.lx } : { right: 1920 - n.lx }),
                fontFamily: mono,
                fontSize: 21,
                lineHeight: "28px",
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
                opacity: 1 - out,
                clipPath: `inset(0 ${n.side === "R" ? out * 100 : 0}% 0 ${n.side === "L" ? out * 100 : 0}%)`,
              }}
            >
              <span style={{ color: C.dim }}>{k}</span>
              <span style={{ color: n.key === "focus" || n.key === "state" ? C.acc : C.paper }}>{v}</span>
            </div>
          );
        })}
      </AbsoluteFill>
    </ModuleShell>
  );
};

export const cues: Cue[] = [
  { f: 0, sfx: "glitch-1", vol: 0.26 },
  { f: 1, sfx: "chatter", vol: 0.2 }, // components snap in
  { f: 9, sfx: "whoosh", vol: 0.42 }, // swing lands, card bursts apart on beat 2
  { f: 15, sfx: "click-lo", vol: 0.24 }, // x-ray to blueprint
  // annotations land
  { f: 18, sfx: "click", vol: 0.2 },
  { f: 21, sfx: "key-2", vol: 0.18 },
  { f: 24, sfx: "click", vol: 0.17 },
  { f: 27, sfx: "blip-down", vol: 0.2 }, // error state
  { f: FOCUS, sfx: "blip-up", vol: 0.3 }, // focus ring on (beat 3)
  { f: 38, sfx: "whoosh-rev", vol: 0.36 }, // collapse inhale
  { f: SNAP, sfx: "snap", vol: 0.36 },
  { f: SNAP, sfx: "impact-soft", vol: 0.42 },
  { f: 52, sfx: "swish", vol: 0.24 },
];
