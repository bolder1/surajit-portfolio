"use client";

import { useEffect, useRef } from "react";

/**
 * CausticField — the poster's backdrop. Wave interference, not filament.
 *
 * The site already runs two shaders and this had to be a third *language*,
 * not a third tint. The masthead is a stack of horizontal bands crushed to
 * hard crests; the page wipe is a displaced edge. This is neither: three
 * drifting point sources emit radial waves, their heights sum, and the caustic
 * lines are drawn along the zero crossings of that sum. The result is
 * concentric interference — rings meeting rings, bright where they cancel —
 * which shares no silhouette with either of the others.
 *
 * Two behaviours make the section feel different rather than merely look it:
 *
 * - **It wakes with the scroll.** Amplitude is driven by how centred the
 *   poster is in the viewport, so the field rises as you arrive, holds while
 *   you read, and settles as you leave. The masthead's field is simply always
 *   on; this one is a room you walk into.
 * - **The pointer is a fourth source.** Moving across it drops a wave in, with
 *   an exponential falloff so the disturbance stays local. The masthead bends
 *   toward the pointer like a whammy bar — a pull. This is a drop.
 *
 * Kept deliberately dim. It sits behind a 62px serif statement, and a backdrop
 * that competes with the type would defeat the point of an interstitial whose
 * whole job is to be read. The measured floor is enforced by a scrim in CSS.
 *
 * Engineering, matching the other two fields: DPR capped at 1.5, time
 * accumulated on drawn frames with a clamped step so a background tab cannot
 * teleport the phase, scroll read from the canvas's own box, and the loop
 * paused by an IntersectionObserver when the section is off screen.
 */

const VERT = `#version 300 es
in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
out vec4 frag;

uniform vec2  uRes;
uniform float uT;
uniform vec2  uMouse;   // 0..1, y already flipped
uniform float uWake;    // 0..1, how centred the section is
uniform float uNear;    // 0..1, pointer proximity energy

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

/* Warm, and narrower than the masthead's palette on purpose: this one stays
   between ember and bone so it reads as one material lit from inside, rather
   than as a spectrum. */
vec3 pal(float t){
  return vec3(0.34, 0.16, 0.11)
       + vec3(0.42, 0.24, 0.16) * cos(6.28318 * (vec3(1.0, 0.92, 0.86) * t
                                     + vec3(0.02, 0.10, 0.18)));
}

void main(){
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 2.0;
  float t = uT;

  // Three sources on slow, mutually prime orbits, so the pattern never
  // repeats inside the time anybody spends here.
  vec2 s1 = vec2(sin(t * 0.11) * 0.95, cos(t * 0.09) * 0.42);
  vec2 s2 = vec2(cos(t * 0.07) * -1.05, sin(t * 0.13) * 0.36);
  vec2 s3 = vec2(sin(t * 0.05 + 2.0) * 0.45, cos(t * 0.06 + 1.0) * -0.55);

  float h = 0.0;
  h += sin(length(p - s1) * 13.0 - t * 1.15);
  h += sin(length(p - s2) * 10.0 - t * 0.85);
  h += sin(length(p - s3) * 16.0 + t * 0.70);

  // The pointer, as a fourth source. exp() keeps the drop local instead of
  // washing the whole field.
  float dm = length(p - m);
  float drop = exp(-dm * dm * 2.4);
  h += sin(dm * 20.0 - t * 2.6) * drop * 1.7;

  h /= 3.0;

  // A little large-scale noise so the interference is not perfectly
  // symmetrical — real water is never that tidy.
  h += (noise(p * 1.4 + t * 0.05) - 0.5) * 0.18;

  // Caustics live on the zero crossings: brightest where the waves cancel.
  float c = pow(max(0.0, 1.0 - abs(h)), 9.0);
  float glow = pow(max(0.0, 1.0 - abs(h)), 2.6) * 0.16;

  vec3 col = pal(h * 0.4 + t * 0.02) * (c * 1.25 + glow);
  // The pointer's own ripple gets a touch more heat, so the drop is visible
  // as light rather than only as geometry.
  col += pal(0.35) * c * drop * 0.55 * uNear;

  // Vignette: hold the centre clear for the statement, let the edges carry it.
  float r = length(p * vec2(0.62, 1.0));
  col *= smoothstep(0.16, 0.95, r) * 0.85 + 0.15;

  col *= uWake;
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

export function CausticField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
    if (!gl) {
      // CSS keeps a static wash in this case.
      canvas.setAttribute("data-fallback", "true");
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = vs && fs ? gl.createProgram() : null;
    if (!vs || !fs || !prog) {
      canvas.setAttribute("data-fallback", "true");
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.setAttribute("data-fallback", "true");
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uT = gl.getUniformLocation(prog, "uT");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uWake = gl.getUniformLocation(prog, "uWake");
    const uNear = gl.getUniformLocation(prog, "uNear");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let clock = 0;
    let last = 0;
    let frame = 0;
    let wake = 0;
    let near = 0;
    const target = { x: 0.5, y: 0.5 };
    const eased = { x: 0.5, y: 0.5 };

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

    // Wake is how centred the section is, measured from its own box so it
    // stays correct however the document above it changes height.
    const measure = () => {
      const r = canvas.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const centre = r.top + r.height / 2;
      const off = Math.abs(centre - vh / 2) / (vh / 2 + r.height / 2);
      return Math.max(0, Math.min(1, 1 - off * off));
    };

    const draw = (now: number) => {
      resize();
      const dt = last ? Math.min((now - last) / 1000, 0.034) : 0;
      last = now;
      clock += dt;

      const want = measure();
      wake += (want - wake) * 0.08;
      near += (0 - near) * 0.03;
      eased.x += (target.x - eased.x) * 0.07;
      eased.y += (target.y - eased.y) * 0.07;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, reduced ? 6.0 : clock);
      gl.uniform2f(uMouse, eased.x, 1 - eased.y);
      gl.uniform1f(uWake, reduced ? 1 : wake);
      gl.uniform1f(uNear, near);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!reduced) frame = requestAnimationFrame(draw);
    };

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      target.x = (e.clientX - r.left) / (r.width || 1);
      target.y = (e.clientY - r.top) / (r.height || 1);
      // Energy decays every frame; moving across keeps topping it up.
      near = Math.min(1, near + 0.08);
    };

    if (reduced) {
      frame = requestAnimationFrame((n) => {
        draw(n);
        frame = 0;
      });
    } else {
      frame = requestAnimationFrame(draw);
    }

    // Off screen, stop drawing entirely — this canvas is tall and would
    // otherwise burn a full frame budget on something nobody can see.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (reduced) return;
        if (entry.isIntersecting) {
          if (!frame) {
            last = 0;
            frame = requestAnimationFrame(draw);
          }
        } else if (frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const host = canvas.parentElement ?? canvas;
    host.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      io.disconnect();
      host.removeEventListener("pointermove", onPointer);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return <canvas ref={ref} className="v5-poster-shader" aria-hidden />;
}
