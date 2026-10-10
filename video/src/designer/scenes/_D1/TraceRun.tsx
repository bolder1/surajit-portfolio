// A circuit trace with a head AND a tail (the kit's Trace only has a head): the tail can retract, so D2 can pull the old route away and
// leave just the rail. Same look as the kit Trace (round caps, void pad with a cream ring and an orange dot), built on its traceGeometry.
import React from "react";
import { easeOutBack, type Pt } from "../../kit/doodles";
import { P } from "../../tokens";
import { GEO, padTime } from "./route";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const c01 = (v: number) => Math.min(1, Math.max(0, v));
const f2 = (n: number) => Math.round(n * 100) / 100;

/** dense sub-polyline between two distances along the route */
const slice = (a: number, b: number): Pt[] => {
  const out: Pt[] = [];
  const { pts, cum } = GEO;
  const at = (d: number): Pt => {
    let i = 1;
    while (i < pts.length - 1 && cum[i] < d) i++;
    const seg = Math.max(1e-6, cum[i] - cum[i - 1]);
    const t = c01((d - cum[i - 1]) / seg);
    return [lerp(pts[i - 1][0], pts[i][0], t), lerp(pts[i - 1][1], pts[i][1], t)];
  };
  if (b <= a) return out;
  out.push(at(a));
  for (let i = 0; i < pts.length; i++) if (cum[i] > a && cum[i] < b) out.push(pts[i]);
  out.push(at(b));
  return out;
};

const path = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${f2(p[0])} ${f2(p[1])}`).join("");

export const TraceRun: React.FC<{
  /** film frame (pads pop by time, so the last one still pops after the head has stopped) */
  t: number;
  head: number;
  tail?: number;
  pads: number[];
  /** vertex indices drawn as hollow rings from the start (a promise of the nodes to come) */
  hollow?: number[];
  hollowOn?: number;
  ghost?: number;
  stroke?: number;
  padSize?: number;
  headDot?: boolean;
  /** frames a pad takes to pop once the head arrives */
  popSpan?: number;
  /** extra scale for every pad (to collapse them) */
  padScale?: number;
}> = ({ t, head, tail = 0, pads, hollow = [], hollowOn = 0, ghost = 0, stroke = 6, padSize = 17, headDot = true, popSpan = 6, padScale = 1 }) => {
  const vis = slice(tail, head);
  const tipPt = vis.length ? vis[vis.length - 1] : null;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      {ghost > 0 ? (
        <path d={path(slice(ghost, GEO.total))} fill="none" stroke="rgba(246,238,224,0.13)" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
      ) : null}
      {vis.length > 1 ? <path d={path(vis)} fill="none" stroke={P.orange} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" /> : null}
      {hollowOn > 0
        ? hollow.map((vi) => {
            const v = GEO.vertex[vi];
            if (t >= padTime(vi) - 0.5) return null;
            const s = easeOutBack(hollowOn);
            return (
              <g key={`h${vi}`} transform={`translate(${f2(v[0])} ${f2(v[1])}) scale(${f2(s)})`}>
                <circle r={padSize} fill={P.void} stroke="rgba(246,238,224,0.34)" strokeWidth={Math.max(4, stroke * 0.85)} />
              </g>
            );
          })
        : null}
      {pads.map((vi) => {
        const v = GEO.vertex[vi];
        const grow = easeOutBack((t - padTime(vi) + 0.5) / popSpan);
        const away = c01((v[2] - tail + 70) / 70);
        const s = grow * away * padScale;
        if (s <= 0.001) return null;
        return (
          <g key={vi} transform={`translate(${f2(v[0])} ${f2(v[1])}) scale(${f2(s)})`}>
            <circle r={padSize} fill={P.void} stroke={P.paper} strokeWidth={Math.max(4, stroke * 0.85)} />
            <circle r={padSize * 0.52} fill={P.orange} />
          </g>
        );
      })}
      {headDot && tipPt && head > 0 && head < GEO.total - 1 ? <circle cx={f2(tipPt[0])} cy={f2(tipPt[1])} r={stroke * 1.05} fill={P.paper} /> : null}
    </svg>
  );
};

