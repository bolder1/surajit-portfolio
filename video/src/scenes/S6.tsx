import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, mona, mono, sans, serif } from "../lib/theme";
import { clamp, EI, EO, lerp, rand } from "../lib/anim";
import { Glitch } from "../lib/FX";
import type { Cue, Sfx } from "../lib/cues";

/**
 * 06 · THESIS (120 f) — breakdown.
 * f0–56   "Security is complex." The frame floods on 8ths/16ths with real error output from his
 *         domain (MFA, HTTP 401/403, JWT, Kerberos skew, X.509, IAM explicit deny, AD password
 *         policy defaults) and tangled connectors. "complex." fights itself: every letter jumps to a
 *         different width/weight. Jitter escalates; two short stutters (f45, f50).
 * f57–59  freeze: the sound cuts out with the motion.
 * f60     downbeat SNAP: every fragment FLIPs into a 12-column layout grid (staggered left→right),
 *         duplicates merge into their original, alert dots go hollow (vermilion leaves the frame),
 *         connectors straighten into column guides. The headline lands flush-left on the grid's
 *         first column, its letters settling to one width/weight in the same left→right sweep.
 * f68/75  "Using it shouldn't be." rises from a mask on the same left edge (serif italic, cream), in
 *         silence: system events make sound, the human line does not.
 * f94–101 the resolved messages switch off column by column; f112–120 only the words, in silence.
 */

const SNAP = 60;
const FREEZE = 57;
const OFF = 94; // resolved messages switch off from here, swept left→right
const CALM_O = 0.75; // fragment opacity once resolved (keeps every glyph ≥ 45 % effective)
const TXT_DIM = "rgba(243,236,222,0.66)"; // secondary text inside fragments

/* ---------- 12-column layout grid inside the safe area ---------- */
const GX = 140;
const GW = 1640;
const GUT = 24;
const COLW = (GW - GUT * 11) / 12;
const colX = (c: number) => GX + c * (COLW + GUT);
const spanW = (n: number) => n * COLW + (n - 1) * GUT;
const GUIDE_X = [GX, ...Array.from({ length: 11 }, (_, k) => colX(k + 1) - GUT / 2), GX + GW];
const BANDS = [
  { y0: 200, y1: 330 },
  { y0: 760, y1: 876 },
];

/* ---------- fragments ---------- */
type Tok = { t: string; hi?: 1 | 2 }; // hi 1 = cream 100 %, 2 = alert (vermilion until resolved)
type Kind = "toast" | "chip" | "code";
type Frag = {
  kind: Kind;
  at: number;
  cx: number;
  cy: number;
  rot: number;
  sc: number;
  col: number;
  span: number;
  y: number;
  h: number;
  title?: string;
  detail?: string;
  lines?: Tok[][];
  alert?: boolean;
  ghost?: boolean;
  blur?: number; // foreground plane: out of focus, close to camera
};

const toast = (at: number, cx: number, cy: number, rot: number, sc: number, col: number, title: string, detail: string, ghost = false, blur = 0): Frag => ({
  kind: "toast", at, cx, cy, rot, sc, col, span: 3, y: 212, h: 58, title, detail, alert: true, ghost, blur,
});
const chip = (at: number, cx: number, cy: number, rot: number, sc: number, col: number, title: string, alert = false) => {
  const fr: Frag = { kind: "chip", at, cx, cy, rot, sc, col, span: 2, y: 286, h: 36, title, alert };
  return Object.assign(fr, { ghostify: (): Frag => ({ ...fr, ghost: true }) });
};
const code = (at: number, cx: number, cy: number, rot: number, sc: number, col: number, lines: Tok[][]): Frag => ({
  kind: "code", at, cx, cy, rot, sc, col, span: 3, y: 772, h: 102, lines,
});

const T = (t: string, hi?: 1 | 2): Tok => ({ t, hi });

/*
 * Copy is real output, in each system's own casing: OIDC / OAuth / RFC 6750 error codes, the
 * jsonwebtoken and Node/OpenSSL messages, Kerberos KRB_AP_ERR_SKEW, the AWS "explicit deny", and the
 * Active Directory password-policy defaults (24 remembered, 42-day maximum age). No invented numbers.
 */
const FRAGS: Frag[] = [
  toast(2, 560, 318, -3.5, 1.12, 0, "MFA failed", "attempt 3 of 3"),
  code(8, 430, 792, 1.5, 1.06, 0, [
    [T("<saml:Assertion ", 1), T('ID="_8f3a…c21">')],
    [T("  <ds:SignatureValue>"), T("MIIC9z…", 2)],
    [T("  <saml:Conditions NotOnOrAfter=")],
  ]),
  toast(15, 1420, 300, 2.5, 1.18, 3, "403 Forbidden", "GET /admin/users"),
  chip(15, 1010, 226, -2, 1.12, 0, "KRB_AP_ERR_SKEW"),
  code(19, 1540, 772, -3, 1.0, 3, [
    [T("× ", 2), T("12+ characters, 1 symbol", 1)],
    [T("× ", 2), T("not one of your last 24")],
    [T("× ", 2), T("expires every 42 days")],
  ]),
  chip(22, 262, 612, 4, 1.04, 2, "invalid signature", true),
  chip(26, 1690, 424, -3, 1.08, 4, "login_required"),
  toast(30, 1190, 724, -2, 1.08, 6, "Session expired", "jwt expired"),
  code(31, 300, 404, -4, 0.98, 6, [
    [T('{"Effect":', 1), T('"Deny"', 2), T(",")],
    [T(' "Action":"*",')],
    [T(' "Resource":"admin/*"}')],
  ]),
  chip(34, 870, 846, 3, 1.1, 6, "unrecognized device", true),
  chip(37, 700, 418, -5, 1.05, 8, "CERT_HAS_EXPIRED"),
  code(41, 1590, 590, 5, 0.92, 9, [
    [T("HTTP/1.1 ", 1), T("401 Unauthorized", 2)],
    [T("WWW-Authenticate: Bearer")],
    [T("  error="), T('"invalid_token"', 2)],
  ]),
  toast(45, 730, 692, 4, 1.2, 9, "Access denied", "explicit deny"),
  // alarm fatigue: the same errors fire again (they merge back into one on the snap)
  chip(36, 318, 652, 7, 1.1, 2, "invalid signature", true).ghostify(),
  toast(39, 526, 286, -6, 1.15, 0, "MFA failed", "attempt 3 of 3", true),
  toast(42, 1150, 684, 4, 1.12, 6, "Session expired", "jwt expired", true),
  chip(47, 930, 880, -3, 1.12, 6, "unrecognized device", true).ghostify(),
  toast(48, 600, 346, 1, 1.12, 0, "MFA failed", "attempt 3 of 3", true),
  chip(49, 1290, 418, -6, 1.15, 10, "account locked", true),
  chip(53, 1330, 452, 3, 1.1, 10, "account locked", true).ghostify(),
  // two repeats arrive right at the lens: huge, out of focus, cropped by the frame
  toast(51, 1400, 300, 7, 2.3, 3, "403 Forbidden", "GET /admin/users", true, 4.5),
  toast(54, 540, 796, -5, 2.6, 9, "Access denied", "explicit deny", true, 6),
  toast(56, 1222, 756, 3, 1.08, 6, "Session expired", "jwt expired", true),
];

/** Snap order: a left→right sweep, top row first. */
const fragDelay = (fr: Frag) => {
  const row = fr.kind === "toast" ? 0 : fr.kind === "chip" ? 1 : 2;
  return Math.round(((colX(fr.col) - GX) / GW) * 4 + row) + (fr.ghost ? 1 : 0);
};

/* ---------- tangled dependencies → column guides ---------- */
type Pt = { x: number; y: number };
/**
 * Node-graph links between the fragments (out-port on the right edge, in-port on the left edge), so
 * the tangle reads as dependencies, not decoration. Links loop back when the target sits to the left.
 * On the snap each link lets go of its fragments and straightens into one column guide of the grid.
 */
const NF = FRAGS.map((fr, i) => (fr.blur ? -1 : i)).filter((i) => i >= 0);
type Wire = { a: number; b: number; at: number; g: { x: number; y0: number; y1: number }; o: number; delay: number; bow: number };
const N_GUIDES = GUIDE_X.length * BANDS.length;
const WIRES: Wire[] = Array.from({ length: 42 }, (_, i) => {
  const gi = i % N_GUIDES; // more links than guides: several straighten onto the same hairline
  const gx = GUIDE_X[Math.floor(gi / 2)];
  const bi = gi % 2;
  const band = BANDS[bi];
  const r = (n: number) => rand(i * 17.3 + n * 5.1);
  const a = NF[i % NF.length];
  let b = NF[(i * 7 + 5) % NF.length];
  if (b === a) b = NF[(i * 7 + 6) % NF.length];
  return {
    a,
    b,
    at: Math.max(FRAGS[a].at, FRAGS[b].at) + 1 + Math.floor(r(10) * 3),
    g: { x: gx, y0: band.y0, y1: band.y1 },
    o: r(9) < 0.2 ? 0.62 : r(9) < 0.6 ? 0.4 : 0.22,
    delay: Math.round(((gx - GX) / GW) * 4) + bi,
    bow: 120 + r(3) * 260,
  };
});

/* ---------- chaos helpers ---------- */
const amp = (fc: number) => interpolate(fc, [0, 20, 45, 56], [0.25, 0.45, 0.8, 1], clamp);
const jitter = (i: number, fc: number, a: number) => {
  const st = Math.floor(fc / 2);
  const big = rand(i * 3.3 + st * 1.9) > 0.93 ? 4 : 1;
  return {
    x: (rand(i * 13.1 + st * 7.7) - 0.5) * 2 * 9 * a * big,
    y: (rand(i * 5.9 + st * 3.1) - 0.5) * 2 * 7 * a * big,
  };
};
/** Where fragment i sits in the chaos at chaos-clock fc. */
const fragChaos = (i: number, fc: number, a: number) => {
  const fr = FRAGS[i];
  const j = jitter(i, fc, a);
  const age = fc - fr.at;
  const pop = interpolate(age, [0, 4], [1.08, 1], { ...clamp, easing: EO });
  return {
    x: fr.cx + j.x + (rand(i * 5.1) - 0.5) * 0.9 * fc,
    y: fr.cy + j.y + (rand(i * 6.7) - 0.5) * 0.5 * fc,
    rot: fr.rot,
    sc: fr.sc * pop,
  };
};
const port = (i: number, fc: number, a: number, side: 1 | -1) => {
  const c = fragChaos(i, fc, a);
  const half = (spanW(FRAGS[i].span) * c.sc) / 2 + 2;
  const th = (c.rot * Math.PI) / 180;
  return { x: c.x + side * half * Math.cos(th), y: c.y + side * half * Math.sin(th) };
};

const snapP = (f: number, delay: number, fps: number) =>
  f < SNAP + delay ? 0 : spring({ frame: f - SNAP - delay + 1, fps, config: { stiffness: 620, damping: 34, mass: 0.55 } }); // +1: the downbeat frame already moves

/* ---------- fragment visuals ---------- */
const Dot: React.FC<{ hot: boolean; size?: number }> = ({ hot, size = 10 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      flexShrink: 0,
      background: hot ? C.acc : "transparent",
      border: hot ? "none" : `1.5px solid ${TXT_DIM}`,
      boxSizing: "border-box",
    }}
  />
);

const FragBody: React.FC<{ fr: Frag; hot: boolean }> = ({ fr, hot }) => {
  const w = spanW(fr.span);
  if (fr.kind === "toast") {
    return (
      <div
        style={{
          width: w,
          height: fr.h,
          borderRadius: 12,
          background: C.ink2,
          border: `1px solid ${hot ? "rgba(243,236,222,0.28)" : "rgba(243,236,222,0.2)"}`,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 20px",
          boxSizing: "border-box",
        }}
      >
        <Dot hot={hot} />
        <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 21, letterSpacing: "0.005em", color: C.paper, whiteSpace: "nowrap" }}>{fr.title}</div>
        <div style={{ marginLeft: "auto", fontFamily: mono, fontSize: 16, color: TXT_DIM, whiteSpace: "nowrap" }}>{fr.detail}</div>
      </div>
    );
  }
  if (fr.kind === "chip") {
    return (
      <div
        style={{
          width: w,
          height: fr.h,
          borderRadius: fr.h / 2,
          border: `1px solid ${C.dim}`,
          background: C.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          boxSizing: "border-box",
          fontFamily: mono,
          fontSize: 16,
          letterSpacing: "0.01em",
          color: "rgba(243,236,222,0.86)",
          whiteSpace: "nowrap",
        }}
      >
        {fr.alert ? <Dot hot={hot} size={7} /> : null}
        {fr.title}
      </div>
    );
  }
  return (
    <div
      style={{
        width: w,
        height: fr.h,
        border: "1px solid rgba(243,236,222,0.16)",
        background: "rgba(13,10,7,0.9)",
        padding: "12px 16px",
        boxSizing: "border-box",
        fontFamily: mono,
        fontSize: 15,
        lineHeight: 1.6,
        color: C.dim,
        whiteSpace: "pre",
        overflow: "hidden",
      }}
    >
      {fr.lines!.map((ln, li) => (
        <div key={li}>
          {ln.map((tk, ti) => (
            <span key={ti} style={{ color: tk.hi === 2 ? (hot ? C.acc : C.paper) : tk.hi === 1 ? C.paper : undefined }}>
              {tk.t}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

/* ---------- headline ---------- */
const LINE = "Security is complex.";
const COMPLEX_FROM = 12;

const Headline: React.FC<{ f: number; fc: number; pT: number }> = ({ f, fc, pT }) => {
  const ampC = interpolate(fc, [8, 30, 56], [0.55, 0.75, 1], clamp) * (1 - pT);
  const ampS = interpolate(fc, [30, 56], [0, 0.45], clamp) * (1 - pT);
  const st = Math.floor(fc / 3);
  const rise = interpolate(f, [0, 8], [0.55, 0], { ...clamp, easing: EO });
  const calmW = lerp(720, 430, pT);
  return (
    <div style={{ display: "flex", alignItems: "baseline", fontSize: 150, lineHeight: 1, color: C.paper, whiteSpace: "pre" }}>
      {LINE.split("").map((ch, i) => {
        const isC = i >= COMPLEX_FROM;
        const a = isC ? ampC : ampS;
        const wd = Math.min(125, Math.max(75, 100 + (rand(i * 9.1 + st * 3.7) - 0.5) * 2 * 60 * a));
        const wg = Math.min(900, Math.max(200, calmW + (rand(i * 4.3 + st * 5.9) - 0.5) * 2 * 520 * a));
        const dy = (rand(i * 2.2 + st * 8.1) - 0.5) * 2 * 20 * a;
        // "complex." arrives letter by letter from f8, each letter stuttering in
        const appear = isC ? 8 + (i - COMPLEX_FROM) * 0.75 : 0;
        if (f < appear) return <span key={i} style={{ ...mona(75, 200), opacity: 0 }}>{ch}</span>;
        const flick = isC && f - appear < 2 ? 0.45 : 1;
        return (
          <span key={i} style={{ display: "inline-block", overflow: isC ? "visible" : "hidden", padding: "0.2em 0 0.25em", margin: "-0.2em 0 -0.25em" }}>
            <span
              style={{
                display: "inline-block",
                ...mona(wd, wg),
                opacity: flick,
                transform: `translateY(${isC ? dy : dy + rise * 150}px)`,
              }}
            >
              {ch === " " ? " " : ch}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/* ---------- scene ---------- */
export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fc = Math.min(f, FREEZE); // chaos clock: frozen from f57, the snap takes over at f60
  const a = amp(fc);
  const calm = f >= SNAP;

  const cam = interpolate(f, [0, 120], [1, 1.025], clamp) + interpolate(f, [70, 114], [0, 0.035], { ...clamp, easing: EI });
  const stutter = (f >= 45 && f < 47) || (f >= 50 && f < 52) ? 0.42 : 0;

  // after the snap the system recedes, then leaves the words alone for the silence
  const recede = interpolate(f, [70, 100], [1, 0.55], clamp) * interpolate(f, [102, 112], [1, 0], { ...clamp, easing: EI });

  const pT = f < SNAP ? 0 : spring({ frame: f - SNAP + 1, fps, config: { stiffness: 210, damping: 26 } });
  const lineA = interpolate(f, [68, 82], [0, 1], { ...clamp, easing: EO });
  const lineB = interpolate(f, [75, 89], [0, 1], { ...clamp, easing: EO });
  const inhale = interpolate(f, [112, 118], [0, 1], { ...clamp, easing: EI });

  const wires = (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {WIRES.map((w, i) => {
        if (f < w.at) return null;
        const draw = interpolate(f, [w.at, w.at + 10], [0, 1], { ...clamp, easing: EO });
        const p = snapP(f, w.delay, fps);
        const p0 = port(w.a, fc, a, 1);
        const p3 = port(w.b, fc, a, -1);
        const chaos: Pt[] = [p0, { x: p0.x + w.bow, y: p0.y }, { x: p3.x - w.bow, y: p3.y }, p3];
        const pts = chaos.map((c, n) => ({ x: lerp(c.x, w.g.x, p), y: lerp(c.y, lerp(w.g.y0, w.g.y1, n / 3), p) }));
        const d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)} C ${pts[1].x.toFixed(1)} ${pts[1].y.toFixed(1)} ${pts[2].x.toFixed(1)} ${pts[2].y.toFixed(1)} ${pts[3].x.toFixed(1)} ${pts[3].y.toFixed(1)}`;
        const op = lerp(w.o, 0.16, p) * (calm ? recede : 1);
        const portO = (1 - Math.min(1, p * 2)) * 0.85;
        return (
          <g key={i}>
            <path d={d} pathLength={1} strokeDasharray={`${p > 0 ? 1 : draw} 1`} stroke={C.paper} strokeOpacity={op} strokeWidth={1.25} fill="none" />
            {portO > 0.02 ? (
              <>
                <circle cx={pts[0].x} cy={pts[0].y} r={3.5} fill={C.ink} stroke={C.paper} strokeWidth={1.25} opacity={portO} />
                <circle cx={pts[3].x} cy={pts[3].y} r={3.5} fill={C.paper} opacity={portO * (draw > 0.98 ? 1 : 0)} />
              </>
            ) : null}
          </g>
        );
      })}
    </svg>
  );

  const frag = (fr: Frag, i: number) => {
    if (f < fr.at) return null;
    const w = spanW(fr.span);
    const flick = f - fr.at === 1 ? 0.35 : 1;
    const p = snapP(f, fragDelay(fr), fps);
    const ch = fragChaos(i, fc, a);
    const chaosX = ch.x;
    const chaosY = ch.y;
    const slotX = colX(fr.col) + w / 2;
    const slotY = fr.y + fr.h / 2;
    const x = lerp(chaosX, slotX, p);
    const y = lerp(chaosY, slotY, p);
    const rot = lerp(fr.rot, 0, p);
    const sc = lerp(ch.sc, 1, p);
    const hot = p < 0.5;
    const ghostFade = fr.ghost ? 1 - p : 1;
    const op = flick * ghostFade * (calm ? lerp(1, 0.62, Math.min(1, p)) * recede : fr.ghost ? (fr.blur ? 0.7 : 0.8) : 1);
    const blur = (fr.blur ?? 0) * (1 - Math.min(1, p));
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x - w / 2,
          top: y - fr.h / 2,
          transform: `rotate(${rot}deg) scale(${sc})`,
          opacity: op,
          filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : undefined,
        }}
      >
        <FragBody fr={fr} hot={hot} />
      </div>
    );
  };
  const back = FRAGS.map((fr, i) => (fr.blur ? null : frag(fr, i)));
  const front = FRAGS.map((fr, i) => (fr.blur ? frag(fr, i) : null));

  const scene = (
    <AbsoluteFill style={{ transform: `scale(${cam})` }}>
      {wires}
      {back}
      {/* headline: chaos centred at y 540 → calm line one, smaller and lighter */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            transform: `translateY(${lerp(0, -118, pT)}px) scale(${lerp(1, 0.4, pT)})`,
            opacity: lerp(1, 0.72, pT) * (1 - inhale * 0.3),
          }}
        >
          <Headline f={f} fc={fc} pT={pT} />
        </div>
      </AbsoluteFill>
      {front}
      {f >= 66 ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Glow x={1150} y={590} r={420} opacity={0.22 * lineB * (1 - inhale * 0.5)} />
          <div style={{ display: "flex", gap: "0.24em", fontFamily: serif, fontStyle: "italic", fontSize: 156, lineHeight: 1.1, marginTop: 130, opacity: 1 - inhale * 0.25 }}>
            <div style={{ overflow: "hidden", padding: "0.05em 0.08em 0.12em", margin: "-0.05em -0.08em -0.12em" }}>
              <div style={{ color: C.paper, transform: `translateY(${(1 - lineA) * 105}%)`, filter: `blur(${(1 - lineA) * 7}px)` }}>Using it</div>
            </div>
            <div style={{ overflow: "hidden", padding: "0.05em 0.08em 0.12em", margin: "-0.05em -0.08em -0.12em" }}>
              <div style={{ color: C.acc, transform: `translateY(${(1 - lineB) * 105}%)`, filter: `blur(${(1 - lineB) * 7}px)`, textShadow: `0 0 34px rgba(255,59,31,${0.35 * lineB})` }}>
                shouldn’t be.
              </div>
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      {stutter > 0 ? <Glitch intensity={stutter} seed={f < 48 ? 6 : 11} slices={7}>{scene}</Glitch> : scene}
    </AbsoluteFill>
  );
};

/* ---------- sound ---------- */
const snapCues: Cue[] = (() => {
  const frames = [...new Set(FRAGS.filter((fr) => !fr.ghost).map((fr) => SNAP + fragDelay(fr)))].sort((x, y) => x - y);
  const out: Cue[] = [];
  frames.forEach((fr, k) => {
    if (fr === SNAP) return; // the downbeat has its own layered hit
    out.push({ f: fr, sfx: (k % 2 ? "snap" : "click") as Sfx, vol: Math.round(Math.max(0.14, 0.28 - k * 0.02) * 100) / 100 });
  });
  return out;
})();

export const cues: Cue[] = [
  // chaos: every arrival has its own sound; errors get the low deny tone
  { f: 0, sfx: "glitch-1", vol: 0.35 },
  { f: 0, sfx: "chatter", vol: 0.26 },
  { f: 2, sfx: "blip-down", vol: 0.26 },
  { f: 8, sfx: "key-1", vol: 0.16 },
  { f: 11, sfx: "key-4", vol: 0.13 },
  { f: 15, sfx: "blip-down", vol: 0.28 },
  { f: 15, sfx: "click", vol: 0.18 },
  { f: 19, sfx: "key-2", vol: 0.15 },
  { f: 22, sfx: "click-lo", vol: 0.2 },
  { f: 26, sfx: "click", vol: 0.16 },
  { f: 27, sfx: "chatter", vol: 0.34 },
  { f: 30, sfx: "blip-down", vol: 0.3 },
  { f: 31, sfx: "key-5", vol: 0.15 },
  { f: 34, sfx: "click-lo", vol: 0.18 },
  { f: 36, sfx: "click-lo", vol: 0.16 }, // repeats start: the same alerts fire again
  { f: 37, sfx: "click", vol: 0.18 },
  { f: 39, sfx: "blip-hi", vol: 0.2 },
  { f: 41, sfx: "key-3", vol: 0.16 },
  { f: 42, sfx: "blip-hi", vol: 0.21 },
  { f: 45, sfx: "blip-down", vol: 0.32 },
  { f: 45, sfx: "glitch-2", vol: 0.42 },
  { f: 47, sfx: "click", vol: 0.17 },
  { f: 48, sfx: "blip-hi", vol: 0.22 },
  { f: 49, sfx: "click", vol: 0.18 },
  { f: 50, sfx: "glitch-1", vol: 0.38 },
  { f: 51, sfx: "blip-hi", vol: 0.24 },
  { f: 52, sfx: "riser", vol: 0.55 }, // 2 s, inaudible until ~f76, hard stop at f112
  { f: 53, sfx: "click", vol: 0.18 },
  { f: 54, sfx: "blip-hi", vol: 0.26 },
  { f: 56, sfx: "blip-hi", vol: 0.26 },
  // f57–59 freeze: nothing new
  { f: SNAP, sfx: "lock", vol: 0.3 },
  { f: SNAP, sfx: "snap", vol: 0.3 },
  ...snapCues,
  { f: 68, sfx: "swish", vol: 0.16 },
  { f: 75, sfx: "blip-up", vol: 0.18 },
  // f112–120: silence before the final drop
];
