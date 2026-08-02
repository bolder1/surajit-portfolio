"use client";

import { useEffect, useRef } from "react";

/**
 * InkPlateField — the masthead backdrop, as a misprinted page.
 *
 * Concept 02's hero runs a velocity field, which is right for a page about
 * speed and wrong for this one. V1's whole register is print: folio numbers,
 * diamond glyphs, printer's registration ticks. So this is the same idea
 * carried into that language rather than the same shader recoloured.
 *
 * Three plates of one image, badly out of register. Separation is what
 * produces the colour: bone, vermilion and deep maroon are the same ridged
 * field sampled at increasing offsets, so every filament carries a chromatic
 * fringe. The register drifts on a slow lissajous, and the pointer is a lens
 * that tears the plates apart around the cursor — move it and the misprint
 * follows you.
 *
 * Cost control: the domain warp is computed once and both plates are sampled
 * from it with an offset. Misregistration IS a translation of one image, so
 * this is both cheaper and more accurate than warping twice.
 *
 * Without WebGL2 it sets data-fallback and CSS paints a static wash. Under
 * prefers-reduced-motion it draws one frame and stops.
 */

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
out vec4 frag;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;   // 0..1, smoothed
uniform float uScroll;  // 0..1 across the hero runway

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + 17.3;
    a *= 0.5;
  }
  return v;
}

// Ridged noise. Soft fbm gives clouds; folding it about its midpoint gives
// filaments with hard crests, which is what makes the plates read as printed
// structure rather than fog.
float ridged(vec2 p) {
  return 1.0 - abs(fbm(p) * 2.0 - 1.0);
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime;
  float aspect = uRes.x / uRes.y;
  vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0);

  // The pointer is a lens that tears the plates apart. Tight falloff so the
  // effect belongs to the cursor rather than washing the whole field.
  float md = length(p - m);
  float lens = exp(-md * md * 3.4);

  // One domain warp, shared by every plate.
  vec2 q = vec2(fbm(p * 1.35 + vec2(0.0, t * 0.060)),
                fbm(p * 1.35 + vec2(5.2, 1.3) - t * 0.050));
  vec2 r = vec2(fbm(p * 1.35 + 2.4 * q + vec2(1.7, 9.2) + t * 0.035),
                fbm(p * 1.35 + 2.4 * q + vec2(8.3, 2.8) - t * 0.028));
  vec2 base = p * 1.35 + 2.0 * r;

  // Register error: a slow drift, plus a hard pull away from the cursor.
  vec2 drift = vec2(sin(t * 0.23), cos(t * 0.19)) * 0.20;
  vec2 away  = (p - m) / max(md, 0.001);
  vec2 reg   = drift + away * lens * 0.90;

  // Three plates off one image. Separation is what produces the colour.
  float a = ridged(base);
  float b = ridged(base + reg);
  float c = ridged(base + reg * 2.0);

  vec3 col = vec3(0.035, 0.034, 0.033);
  col += vec3(0.94, 0.91, 0.86) * pow(a, 3.4) * 0.62;  // bone plate
  col += vec3(0.85, 0.28, 0.18) * pow(b, 2.4) * 1.35;  // vermilion plate
  col += vec3(0.42, 0.06, 0.05) * pow(c, 2.0) * 0.95;  // deep maroon plate

  // Heat where the tear is widest, so the cursor reads as the cause.
  col += vec3(0.85, 0.28, 0.18) * lens * 0.30 * (0.55 + 0.45 * sin(t * 0.9));

  // Halftone: a fine screen, angled like a real separation, biting only into
  // the lit areas so the darks stay clean.
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  vec2 sp = (gl_FragCoord.xy) * 0.9;
  float ang = 0.4;
  vec2 rot = vec2(sp.x * cos(ang) - sp.y * sin(ang), sp.x * sin(ang) + sp.y * cos(ang));
  float screenDots = sin(rot.x) * sin(rot.y);
  col *= 1.0 - smoothstep(0.05, 0.45, lum) * 0.16 * smoothstep(0.0, 1.0, screenDots);

  // Grain, so it reads as printed rather than rendered.
  float g = hash(gl_FragCoord.xy + fract(t) * vec2(37.0, 17.0));
  col += (g - 0.5) * 0.030;

  // Vignette blends the edges into the page.
  float v = smoothstep(1.34, 0.20, length(p * vec2(0.86, 1.0)));
  col *= mix(0.30, 1.0, v);

  // Hand off to the section below, matching the old backdrop's fade.
  col *= (1.0 - uScroll * 0.92);

  frag = vec4(col, 1.0);
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

export function InkPlateField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      canvas.dataset.fallback = "1";
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = vs && fs ? gl.createProgram() : null;
    if (!vs || !fs || !prog) {
      canvas.dataset.fallback = "1";
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.dataset.fallback = "1";
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uScroll = gl.getUniformLocation(prog, "uScroll");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const target = { x: 0.5, y: 0.42 };
    const eased = { x: 0.5, y: 0.42 };
    let scroll = 0;

    // Time is accumulated on DRAWN frames and the step is clamped, so a
    // background tab or a long pause cannot push a huge dt through and
    // teleport the field to an unrelated state.
    let clock = 0;
    let last = 0;
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const draw = (now: number) => {
      resize();
      const dt = last ? Math.min((now - last) / 1000, 0.034) : 0;
      last = now;
      clock += dt;

      eased.x += (target.x - eased.x) * 0.14;
      eased.y += (target.y - eased.y) * 0.14;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduced ? 7.2 : clock);
      gl.uniform2f(uMouse, eased.x, 1.0 - eased.y);
      gl.uniform1f(uScroll, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!reduced) frame = requestAnimationFrame(draw);
    };

    const onPointer = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = e.clientY / window.innerHeight;
    };

    // Scroll progress is read from the canvas's OWN box, so it stays correct
    // however the document above the hero changes height.
    const onScroll = () => {
      const r = canvas.getBoundingClientRect();
      const travel = r.height || 1;
      scroll = Math.min(1, Math.max(0, -r.top / travel));
      // Parked off-screen the loop is paused, so keep the clock's reference
      // current — otherwise the first visible frame computes a huge dt.
      if (!frame && !reduced) last = 0;
    };

    onScroll();
    if (reduced) {
      // One frame, then stop. Still needs a resize pass first.
      frame = requestAnimationFrame((n) => {
        draw(n);
        frame = 0;
      });
    } else {
      frame = requestAnimationFrame(draw);
    }

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return <canvas ref={canvasRef} className="v5-hero-shader" aria-hidden />;
}
