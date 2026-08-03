"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * SdfBlobTransition — an organic reveal, driven by signed distance fields.
 *
 * Wrap content and change `transitionKey`. A persistent WebGL canvas plays a
 * wipe over the top while the children swap underneath, so the new content is
 * already mounted and laid out before it is uncovered.
 *
 * Why SDF circles rather than a mask image: several circles smooth-merged with
 * a polynomial min behave like drops of liquid — they bulge toward each other
 * and fuse as they meet, which no static mask reproduces. Perimeter noise
 * keeps the boundary from reading as a machined circle, and because the field
 * is evaluated per pixel it leaves no residue when it clears.
 *
 * The canvas is created once and kept, not mounted per transition; spinning up
 * a GL context per swap is the expensive way to do this and drops frames on
 * the first one.
 *
 * Accessibility: children are always in the DOM and semantic — the canvas is
 * a decorative overlay above them, never a replacement. Under reduced motion
 * the content swaps immediately and `onRest` still fires, so callers that
 * sequence work off it behave identically.
 */

const VERT = `#version 300 es
in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
out vec4 frag;

uniform vec2  uRes;
uniform float uT;     // 0..1 progress
uniform vec3  uInk;   // curtain colour

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

// Polynomial smooth-min. This is the whole trick: it blends two distance
// fields instead of taking the nearer one, so circles bulge toward each
// other and fuse rather than intersecting with a visible seam.
float smin(float a, float b, float k){
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

void main(){
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uT;

  // Five drops on fixed seats, growing on staggered offsets so the field
  // fuses progressively instead of all at once.
  vec2 seats[5];
  seats[0] = vec2(-0.62, -0.18);
  seats[1] = vec2(-0.18,  0.22);
  seats[2] = vec2( 0.20, -0.24);
  seats[3] = vec2( 0.64,  0.14);
  seats[4] = vec2( 0.02,  0.02);
  float lead[5];
  lead[0] = 0.00; lead[1] = 0.10; lead[2] = 0.06; lead[3] = 0.16; lead[4] = 0.03;

  float d = 1e5;
  for (int i = 0; i < 5; i++) {
    float g = clamp((t - lead[i]) / (1.0 - lead[i]), 0.0, 1.0);
    // Ease so the drops open fast and settle, rather than growing linearly.
    float r = 1.15 * (1.0 - pow(1.0 - g, 2.4));
    d = smin(d, length(p - seats[i]) - r, 0.24);
  }

  // Perimeter noise, scaled by how close we are to the edge so the interior
  // stays solid and only the boundary breathes.
  d += (noise(p * 5.0 + t * 2.0) - 0.5) * 0.09 * smoothstep(0.30, 0.0, abs(d));

  float cover = smoothstep(0.012, -0.012, d);
  if (cover <= 0.001) discard;
  frag = vec4(uInk, cover);
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

export function SdfBlobTransition({
  transitionKey,
  children,
  /** ms for cover + uncover together */
  duration = 900,
  /** curtain colour, 0..1 rgb */
  ink = [0.851, 0.278, 0.184] as [number, number, number],
  onRest,
  className,
}: {
  transitionKey: string | number;
  children: ReactNode;
  duration?: number;
  ink?: [number, number, number];
  onRest?: () => void;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<{
    gl: WebGL2RenderingContext;
    uRes: WebGLUniformLocation | null;
    uT: WebGLUniformLocation | null;
    uInk: WebGLUniformLocation | null;
  } | null>(null);

  const [shown, setShown] = useState(children);
  const firstRun = useRef(true);
  const rest = useRef(onRest);
  rest.current = onRest;

  // ── set the context up once and keep it ──────────────────────
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
      uT: gl.getUniformLocation(prog, "uT"),
      uInk: gl.getUniformLocation(prog, "uInk"),
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

    // No GL, or motion is unwelcome: swap now. onRest still fires, so a
    // caller sequencing work off it is not left waiting.
    if (!ctx || !canvas || reduced) {
      setShown(children);
      rest.current?.();
      return;
    }

    let frame = 0;
    let start = 0;
    let swapped = false;
    const { gl, uRes, uT, uInk } = ctx;

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

      // Cover on the way in, uncover on the way out. The swap happens at
      // full cover, so the change is never visible.
      const cover = p < 0.5 ? p / 0.5 : 1 - (p - 0.5) / 0.5;
      if (p >= 0.5 && !swapped) {
        swapped = true;
        setShown(children);
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, cover);
      gl.uniform3f(uInk, ink[0], ink[1], ink[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (p < 1) {
        frame = requestAnimationFrame(draw);
      } else {
        gl.clear(gl.COLOR_BUFFER_BIT);
        rest.current?.();
      }
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
    // children is intentionally not a dep: the swap is driven by the key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transitionKey, duration]);

  return (
    <div className={`v5-sdf ${className ?? ""}`}>
      <div className="v5-sdf-content">{shown}</div>
      <canvas ref={canvasRef} className="v5-sdf-canvas" aria-hidden />
    </div>
  );
}
