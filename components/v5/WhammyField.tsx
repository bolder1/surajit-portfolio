"use client";

import { useEffect, useRef } from "react";

/**
 * WhammyField — the masthead backdrop, bent like a whammy bar.
 *
 * A whammy bar does two things: it BENDS everything elastically, and it
 * WOBBLES while it does it. Both are here. Two detuned oscillators drive a
 * vibrato that never settles into a loop you can hear coming, and the
 * pointer is the bar itself — grab anywhere and the field pulls toward you,
 * with the bend falling off exponentially so it stays local.
 *
 * The field is a set of strings: a warped sine stack, crushed to hard crests
 * so it reads as filament rather than fog. Colour comes from a cosine
 * palette sampled by band phase, which is what makes it iridescent instead
 * of tinted — amber running into vermilion running into magenta, all warm,
 * so it stays inside V1's world while behaving nothing like it.
 *
 * Each channel samples the band at a different phase offset, so the strings
 * carry real chromatic fringing that widens as you pull the bar.
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

// Cosine palette. Phase offsets per channel are what make it iridescent
// rather than tinted — the hue travels instead of the brightness.
vec3 pal(float x) {
  return 0.55 + 0.45 * cos(6.28318 * (x + vec3(0.00, 0.13, 0.24)));
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime;
  float aspect = uRes.x / uRes.y;
  vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0);

  // Vibrato: two detuned oscillators, so the wobble never settles into a
  // period you can predict.
  float vib = sin(t * 1.9) * 0.6 + sin(t * 3.1 + 1.3) * 0.4;

  // The bar. Grab anywhere and the field bends toward the pointer; the
  // falloff keeps the bend local instead of dragging the whole page.
  vec2 d = p - m;
  float md = length(d);
  float pull = exp(-md * md * 2.2);
  vec2 q = p - normalize(d + 1e-5) * pull * (0.30 + 0.14 * vib);

  // A slow global bend, so it breathes with no pointer at all.
  q.y += 0.11 * sin(q.x * 1.7 + t * 0.60) + 0.06 * sin(q.x * 3.3 - t * 0.90);
  q.x += 0.08 * sin(q.y * 2.1 - t * 0.70);

  // The strings.
  float warp  = fbm(q * 1.5 + vec2(0.0, t * 0.09));
  float phase = q.y * 7.2 + warp * 2.8 + t * 0.55 + vib * 0.25;

  // Chromatic split, widening as the bar is pulled.
  float o = 0.06 + pull * 0.22;
  float rr = max(sin(phase + o), 0.0);
  float gg = max(sin(phase),     0.0);
  float bb = max(sin(phase - o), 0.0);
  vec3 band = vec3(pow(rr, 7.0), pow(gg, 7.0), pow(bb, 7.0));

  vec3 hue = pal(phase * 0.055 + t * 0.035 + warp * 0.18);

  vec3 col = vec3(0.034, 0.033, 0.032);
  col += hue * band * 1.75;                        // the strings themselves
  col += hue * pow(gg, 2.2) * 0.16;                // soft halo around them
  col += hue * pull * 0.34 * (0.6 + 0.4 * vib);    // heat where the bar bites

  // Grain, so it stays a printed page rather than a render.
  float g = hash(gl_FragCoord.xy + fract(t) * vec2(37.0, 17.0));
  col += (g - 0.5) * 0.030;

  // Vignette blends the edges into the page.
  float v = smoothstep(1.34, 0.20, length(p * vec2(0.86, 1.0)));
  col *= mix(0.28, 1.0, v);

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

export function WhammyField() {
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
