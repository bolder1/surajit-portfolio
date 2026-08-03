"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * ShaderWipeTransition — a displacement wipe, driven by a persistent WebGL
 * context and triggered by `transitionKey`.
 *
 * The technique is borrowed from shader image transitions, where a
 * displacement map offsets the threshold of a wipe per pixel so the boundary
 * tears and stretches instead of travelling as a straight line. Here there is
 * no second texture to blend toward — the DOM is not readable as one — so the
 * displacement drives a *curtain* rather than a cross-dissolve: it sweeps in
 * from the left, reaches full cover, and continues out to the right.
 *
 * Sweeping one direction the whole way is deliberate. A curtain that covers
 * and then retreats the way it came reads as a mistake being undone; one that
 * carries on through reads as a page being turned.
 *
 * The children swap at the midpoint, under full cover, so the new content is
 * already mounted and laid out before any of it is uncovered.
 *
 * The context is created once and kept. Building a GL context per navigation
 * is the expensive way to do this and drops frames on the first one — which is
 * the one every visitor sees.
 *
 * Accessibility: children are always in the DOM and semantic; the canvas is a
 * decorative overlay above them and never a replacement. Under reduced motion
 * the swap is immediate and `onRest` still fires, so callers sequencing work
 * off it behave identically.
 */

const VERT = `#version 300 es
in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
out vec4 frag;

uniform vec2  uRes;
uniform float uLead;   // leading edge, in displaced-x space
uniform float uTrail;  // trailing edge
uniform vec3  uInk;    // curtain body
uniform vec3  uEdge;   // colour of the moving edges

float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x),
             mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
/* Three octaves is enough to read as cloth: one for the large tear, two for
   the fraying along it. More just costs fill rate nobody can see. */
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  // Sample the displacement in aspect-corrected space, or the tear stretches
  // into horizontal smears on a wide viewport.
  vec2 np = vec2(uv.x * (uRes.x / uRes.y), uv.y);

  float d = fbm(np * 2.6);
  // This is the whole trick: the wipe threshold is offset per pixel, so the
  // edge advances at different rates across the frame and tears.
  float x = uv.x + (d - 0.5) * 0.42
          + 0.05 * sin(uv.y * 7.0);   // a slow wave under the noise

  float soft = 0.05;
  float lead  = smoothstep(uLead  + soft, uLead  - soft, x);
  float trail = smoothstep(uTrail + soft, uTrail - soft, x);
  float cover = clamp(lead - trail, 0.0, 1.0);
  if (cover <= 0.002) discard;

  // Both edges glow — the one arriving and the one leaving.
  float dEdge = min(abs(x - uLead), abs(x - uTrail));
  float band  = 1.0 - smoothstep(0.0, 0.19, dEdge);

  vec3 col = mix(uInk, uEdge, band * 0.9);
  col += uEdge * pow(band, 3.0) * 0.5;      // a hotter core right on the edge
  col *= 0.94 + 0.06 * fbm(np * 9.0);       // grain, so the fill is not flat

  frag = vec4(col, cover);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/** `#d9472f` → `[0.851, 0.278, 0.184]`. Returns null on anything unparseable. */
function parseColor(raw: string): [number, number, number] | null {
  const s = raw.trim();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(s);
  if (hex) {
    const h = hex[1];
    const full =
      h.length === 3
        ? h
            .split("")
            .map((c) => c + c)
            .join("")
        : h;
    return [
      parseInt(full.slice(0, 2), 16) / 255,
      parseInt(full.slice(2, 4), 16) / 255,
      parseInt(full.slice(4, 6), 16) / 255,
    ];
  }
  const rgb = /^rgba?\(([^)]+)\)$/i.exec(s);
  if (rgb) {
    const parts = rgb[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    if (parts.length >= 3 && parts.slice(0, 3).every((n) => !Number.isNaN(n))) {
      return [parts[0] / 255, parts[1] / 255, parts[2] / 255];
    }
  }
  return null;
}

/** Read the accent the page is currently wearing, so /v2 wipes in its green. */
function currentAccent(fallback: [number, number, number]): [number, number, number] {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.body).getPropertyValue("--cursor-accent");
  return parseColor(raw) ?? fallback;
}

export function ShaderWipeTransition({
  transitionKey,
  children,
  /** ms for cover + uncover together */
  duration = 820,
  /** curtain body, 0..1 rgb */
  ink = [0.039, 0.039, 0.039] as [number, number, number],
  /** edge colour; defaults to the page's own accent token */
  edge,
  /** fires at full cover, the moment the children are swapped */
  onCover,
  onRest,
}: {
  transitionKey: string | number;
  children: ReactNode;
  duration?: number;
  ink?: [number, number, number];
  edge?: [number, number, number];
  onCover?: () => void;
  onRest?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<{
    gl: WebGL2RenderingContext;
    uRes: WebGLUniformLocation | null;
    uLead: WebGLUniformLocation | null;
    uTrail: WebGLUniformLocation | null;
    uInk: WebGLUniformLocation | null;
    uEdge: WebGLUniformLocation | null;
  } | null>(null);

  const [shown, setShown] = useState(children);
  const [playing, setPlaying] = useState(false);
  const firstRun = useRef(true);
  const rest = useRef(onRest);
  rest.current = onRest;
  const cover = useRef(onCover);
  cover.current = onCover;

  // ── build the context once and keep it ───────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: true });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = vs && fs ? gl.createProgram() : null;
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    glRef.current = {
      gl,
      uRes: gl.getUniformLocation(prog, "uRes"),
      uLead: gl.getUniformLocation(prog, "uLead"),
      uTrail: gl.getUniformLocation(prog, "uTrail"),
      uInk: gl.getUniformLocation(prog, "uInk"),
      uEdge: gl.getUniformLocation(prog, "uEdge"),
    };

    return () => {
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      glRef.current = null;
    };
  }, []);

  // ── play on key change ───────────────────────────────────────
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      setShown(children);
      return;
    }

    const ctx = glRef.current;
    const canvas = canvasRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // No GL, or motion is unwelcome: swap now. onRest still fires, so a caller
    // sequencing work off it is not left waiting on an animation that will
    // never run.
    if (!ctx || !canvas || reduced) {
      setShown(children);
      cover.current?.();
      rest.current?.();
      return;
    }

    let frame = 0;
    let start = 0;
    let swapped = false;
    const { gl, uRes, uLead, uTrail, uInk, uEdge } = ctx;
    // The accent is read again at the swap, so the uncover half wears the
    // destination's colour rather than the one we left.
    let accent = edge ?? currentAccent([0.851, 0.278, 0.184]);

    setPlaying(true);

    const draw = (now: number) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / duration);

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }

      // Margins past 0 and 1 so displaced pixels at either extreme are still
      // covered — without them a fringe of old content survives at the edges.
      const a = Math.min(1, p / 0.5);
      const b = Math.max(0, (p - 0.5) / 0.5);
      // Ease so the curtain arrives fast and leaves smoothly.
      const ease = (t: number) => 1 - Math.pow(1 - t, 2.2);
      const lead = -0.35 + ease(a) * 1.7;
      const trail = -0.35 + ease(b) * 1.7;

      if (p >= 0.5 && !swapped) {
        swapped = true;
        setShown(children);
        cover.current?.();
        accent = edge ?? currentAccent(accent);
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uLead, lead);
      gl.uniform1f(uTrail, trail);
      gl.uniform3f(uInk, ink[0], ink[1], ink[2]);
      gl.uniform3f(uEdge, accent[0], accent[1], accent[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (p < 1) {
        frame = requestAnimationFrame(draw);
      } else {
        gl.clear(gl.COLOR_BUFFER_BIT);
        setPlaying(false);
        rest.current?.();
      }
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      setPlaying(false);
    };
    // children is intentionally not a dep: the swap is driven by the key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transitionKey, duration]);

  return (
    <>
      {shown}
      <canvas
        ref={canvasRef}
        className={`v5-wipe${playing ? " is-playing" : ""}`}
        aria-hidden
      />
    </>
  );
}
