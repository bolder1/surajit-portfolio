import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ModuleShell, Em } from "../../lib/ModuleShell";
import { C, dots, mono, sans } from "../../lib/theme";
import { clamp, EI, EO, prog } from "../../lib/anim";
import { Glow } from "../../lib/FX";
import type { Cue } from "../../lib/cues";

/**
 * SCOPE 05 · IDENTITY GOVERNANCE (60 f) · access certification sweep.
 * A review table hangs in perspective (far edge toward the title, decision column toward camera).
 * A vermilion review line sweeps down; each row it crosses is decided:
 * GRANTED (pill fills vermilion) or REVOKED (strike, row dims and slides back). Standing high-risk access goes.
 *  f0–12  camera swings onto the table, rows PENDING
 *  f10–46 review line sweeps 7 rows; stamps at DEC frames (first on beat 1)
 *  f45    beat 3: REVIEWED 07/07 → CERTIFIED
 *  f52–57 exit
 */
type Row = { ini: string; id: string; res: string; risk: "LOW" | "MED" | "HIGH"; ok: boolean; svc?: boolean };
const ROWS: Row[] = [
  { ini: "UD", id: "u.dutta", res: "prod-db-01", risk: "LOW", ok: true },
  { ini: "SB", id: "svc-backup", res: "k8s:cluster-admin", risk: "HIGH", ok: false, svc: true },
  { ini: "AR", id: "a.rao", res: "vault/finance", risk: "MED", ok: true },
  { ini: "MI", id: "m.iyer", res: "AD › Domain Admins", risk: "HIGH", ok: false },
  { ini: "JL", id: "j.lee", res: "prod-db-01 · read", risk: "LOW", ok: true },
  { ini: "SC", id: "svc-ci", res: "vault/deploy-keys", risk: "MED", ok: true, svc: true },
  { ini: "TN", id: "t.ng", res: "AD › Server Operators", risk: "HIGH", ok: false },
];

const TW = 1010; // table width (table-local px)
const HEAD = 58;
const RH = 76;
const TH = HEAD + ROWS.length * RH;
const COL = { av: 30, id: 94, res: 320, risk: 664, pill: 790 };

const SWEEP_A = 10;
const SWEEP_B = 46;
const SWEEP = Easing.bezier(0.3, 0.05, 0.6, 0.95);
const lineY = (f: number) => interpolate(f, [SWEEP_A, SWEEP_B], [HEAD - 6, TH + 4], { ...clamp, easing: SWEEP });
// frame at which the review line reaches each row's centre
const DEC = ROWS.map((_, i) => {
  const c = HEAD + i * RH + RH / 2;
  for (let f = 0; f < 60; f++) if (lineY(f) >= c) return f;
  return 59;
});
const DONE = 45;

const TC = { x: 1282, y: 424 }; // table centre on screen
const SC = 0.71;

const RowView: React.FC<{ r: Row; i: number; f: number; fps: number }> = ({ r, i, f, fps }) => {
  const d = DEC[i];
  const decided = f >= d;
  const s = spring({ frame: f - d, fps, config: { stiffness: 420, damping: 20 } });
  const strike = prog(f, d, d + 6, EO);
  const fade = r.ok ? 0 : prog(f, d + 2, d + 10, EO);
  const flash = decided ? interpolate(f, [d, d + 1, d + 10], [0, 1, 0], clamp) : 0;
  // UI snaps in: rows switch on top→bottom, one per frame, with a brief hairline flash
  const on = f >= i - 3;
  const snapFlash = f === i - 3 || f === i - 2;
  const granted = decided && r.ok;
  const revoked = decided && !r.ok;
  const top = HEAD + i * RH;
  const riskO = r.risk === "HIGH" ? 1 : r.risk === "MED" ? 0.45 : 0.2;
  if (!on) return null;
  return (
    <div style={{ position: "absolute", left: 0, top, width: TW, height: RH }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: granted ? `rgba(255,59,31,${0.14 * flash})` : `rgba(243,236,222,${0.08 * flash + (snapFlash ? 0.06 : 0)})`,
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 1, background: C.paper, opacity: 0.1 }} />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - fade * 0.68, transform: `translateX(${-fade * 26}px)` }}>
        {/* avatar: circle for people, square for service accounts */}
        <div
          style={{
            position: "absolute",
            left: COL.av,
            top: RH / 2 - 21,
            width: 42,
            height: 42,
            borderRadius: r.svc ? 8 : 21,
            border: `1.5px solid ${C.dim}`,
            fontFamily: sans,
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: "0.04em",
            color: C.paper,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {r.ini}
        </div>
        <div style={{ position: "absolute", left: COL.id, top: 0, height: RH, display: "flex", alignItems: "center", fontFamily: mono, fontSize: 26, color: C.paper }}>
          {r.id}
        </div>
        <div
          style={{
            position: "absolute",
            left: COL.res,
            top: 0,
            height: RH,
            display: "flex",
            alignItems: "center",
            fontFamily: mono,
            fontSize: 26,
            color: C.paper,
            opacity: 0.7,
            whiteSpace: "nowrap",
          }}
        >
          {r.res}
        </div>
        <div style={{ position: "absolute", left: COL.risk, top: RH / 2 - 16, height: 32, display: "flex", alignItems: "center" }}>
          <span
            style={{
              fontFamily: mono,
              fontSize: 15,
              letterSpacing: "0.18em",
              padding: "5px 10px 5px 12px",
              borderRadius: 6,
              border: `1.5px solid rgba(243,236,222,${riskO})`,
              color: `rgba(243,236,222,${Math.max(0.5, riskO)})`,
            }}
          >
            {r.risk}
          </span>
        </div>
        {/* decision pill */}
        <div style={{ position: "absolute", left: COL.pill, top: RH / 2 - 21, height: 42, display: "flex", alignItems: "center" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              height: 42,
              padding: "0 20px",
              borderRadius: 999,
              fontFamily: sans,
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "0.1em",
              background: granted ? C.acc : "transparent",
              border: `1.5px solid ${granted ? C.acc : revoked ? C.paper : C.dim}`,
              color: granted ? C.ink : revoked ? C.paper : C.dim,
              transform: `scale(${decided ? 0.8 + 0.2 * s : 1})`,
              transformOrigin: "0 50%",
              boxShadow: granted ? "0 0 22px rgba(255,59,31,0.4)" : "none",
            }}
          >
            {!decided ? <span style={{ width: 8, height: 8, borderRadius: 4, background: C.dim }} /> : null}
            {!decided ? "PENDING" : granted ? "GRANTED" : "REVOKED"}
          </span>
        </div>
      </div>
      {/* strike-through on revoke */}
      {revoked ? (
        <div
          style={{
            position: "absolute",
            left: 18,
            width: COL.pill - 34,
            top: RH / 2 - 1.5,
            height: 3,
            background: C.paper,
            transform: `scaleX(${strike})`,
            transformOrigin: "0 50%",
          }}
        />
      ) : null}
    </div>
  );
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const push = interpolate(f, [0, 60], [1, 1.05], clamp);
  const exit = interpolate(f, [52, 57], [0, 1], { ...clamp, easing: EI });
  const enter = interpolate(f, [0, 14], [0, 1], { ...clamp, easing: EO });
  const ly = lineY(f);
  const sweeping = f >= SWEEP_A - 2 && f <= SWEEP_B + 2;
  const lineO = interpolate(f, [SWEEP_A - 3, SWEEP_A, SWEEP_B, SWEEP_B + 4], [0, 1, 1, 0], clamp);

  const reviewed = DEC.filter((d) => f >= d).length;
  const grantedN = ROWS.filter((r, i) => r.ok && f >= DEC[i]).length;
  const revokedN = ROWS.filter((r, i) => !r.ok && f >= DEC[i]).length;
  const done = f >= DONE;
  const doneS = spring({ frame: f - DONE, fps, config: { stiffness: 300, damping: 16 } });

  // camera: swings onto the table; far edge toward the title, decision column toward camera
  const ry = interpolate(enter, [0, 1], [-40, -27]) + interpolate(f, [0, 60], [0, 3]);
  const rx = interpolate(f, [0, 60], [14, 10]);
  const ty = interpolate(f, [0, 60], [14, -14]);

  return (
    <ModuleShell index={5} title="IDENTITY GOVERNANCE" line={<>Who has access, <Em>and why.</Em></>}>
      <AbsoluteFill style={{ opacity: 1 - exit, transform: `scale(${push + exit * 0.03})`, transformOrigin: "1300px 420px" }}>
        <Glow x={1420} y={TC.y - (TH * SC) / 2 + ly * SC} r={340} opacity={0.32 * lineO} />
        <AbsoluteFill style={{ perspective: 1400, perspectiveOrigin: `${TC.x}px ${TC.y}px` }}>
          <div
            style={{
              position: "absolute",
              left: TC.x - TW / 2,
              top: TC.y - TH / 2,
              width: TW,
              height: TH,
              transformOrigin: "50% 50%",
              transform: `translateY(${ty}px) scale(${SC}) rotateY(${ry}deg) rotateX(${rx}deg) rotateZ(-1.5deg)`,
            }}
          >
            {/* frame */}
            <div style={{ position: "absolute", inset: 0, border: `1.5px solid ${C.faint}`, borderRadius: 14, background: "rgba(243,236,222,0.025)" }} />
            {/* header */}
            <div style={{ position: "absolute", left: 0, top: 0, width: TW, height: HEAD, borderBottom: `1px solid ${C.faint}` }}>
              {(
                [
                  ["IDENTITY", COL.av],
                  ["ENTITLEMENT", COL.res],
                  ["RISK", COL.risk],
                  ["DECISION", COL.pill],
                ] as const
              ).map(([t, x]) => (
                <div
                  key={t}
                  style={{ position: "absolute", left: x, top: 0, height: HEAD, display: "flex", alignItems: "center", fontFamily: mono, fontSize: 15, letterSpacing: "0.24em", color: C.dim }}
                >
                  {t}
                </div>
              ))}
            </div>
            {ROWS.map((r, i) => (
              <RowView key={i} r={r} i={i} f={f} fps={fps} />
            ))}
            {/* review line */}
            {sweeping ? (
              <>
                <div
                  style={{
                    position: "absolute",
                    left: -30,
                    width: TW + 50,
                    top: ly - 120,
                    height: 120,
                    background: "linear-gradient(180deg, rgba(255,59,31,0) 0%, rgba(255,59,31,0.15) 100%)",
                    opacity: lineO,
                  }}
                />
                <div style={{ position: "absolute", left: -30, width: TW + 50, top: ly - 1.5, height: 3, background: C.acc, opacity: lineO, boxShadow: `0 0 18px ${C.accGlow}` }} />
                <div
                  style={{
                    position: "absolute",
                    left: -30,
                    top: ly - 12,
                    width: 0,
                    height: 0,
                    borderTop: "12px solid transparent",
                    borderBottom: "12px solid transparent",
                    borderLeft: `16px solid ${C.acc}`,
                    opacity: lineO,
                  }}
                />
              </>
            ) : null}
          </div>
        </AbsoluteFill>

        {/* flat readout in the free corner right of the title */}
        <div style={{ position: "absolute", left: 1604, top: 690, width: 200 }}>
          <div style={{ fontFamily: mono, fontSize: 14, letterSpacing: "0.26em", color: done ? C.acc : C.dim }}>{done ? "● CERTIFIED" : "REVIEWED"}</div>
          <div
            style={{
              fontFamily: dots,
              fontWeight: 800,
              fontSize: 60,
              lineHeight: 1,
              marginTop: 10,
              color: C.paper,
              whiteSpace: "nowrap",
              transform: `scale(${done ? 1 + 0.08 * (1 - doneS) : 1})`,
              transformOrigin: "0 50%",
            }}
          >
            {String(reviewed).padStart(2, "0")}
            <span style={{ color: C.faint }}>/{String(ROWS.length).padStart(2, "0")}</span>
          </div>
          <div style={{ fontFamily: mono, fontSize: 14, letterSpacing: "0.2em", marginTop: 14, lineHeight: 1.75, whiteSpace: "nowrap" }}>
            <div style={{ color: grantedN ? C.acc : C.faint }}>■ {grantedN} GRANTED</div>
            <div style={{ color: revokedN ? C.paper : C.faint }}>□ {revokedN} REVOKED</div>
          </div>
        </div>
      </AbsoluteFill>
    </ModuleShell>
  );
};

export const cues: Cue[] = [
  { f: 0, sfx: "glitch-2", vol: 0.3 },
  { f: 0, sfx: "chatter", vol: 0.18 }, // rows snapping in
  { f: SWEEP_A, sfx: "scan", vol: 0.2 },
  // one stamp per row: grant = light click, revoke = heavier snap + low click
  ...ROWS.map((r, i) => ({ f: DEC[i], sfx: r.ok ? ("click" as const) : ("snap" as const), vol: r.ok ? 0.2 : 0.3 })),
  ...ROWS.flatMap((r, i) => (r.ok ? [] : [{ f: DEC[i] + 1, sfx: "click-lo" as const, vol: 0.2 }])),
  { f: DONE, sfx: "blip-up", vol: 0.32 },
];
