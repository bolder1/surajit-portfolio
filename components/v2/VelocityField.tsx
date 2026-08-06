"use client";

import { useEffect, useRef } from "react";

/**
 * VelocityField — the hero's background, a hand-written GLSL fragment shader
 * on a single full-screen triangle pair. No three.js, no gradient stack.
 *
 * What it draws: an anisotropic domain-warped flow field. The noise lattice
 * is squashed hard on X and stretched on Y, so the crests resolve into long
 * horizontal filaments that read as light trails at speed. Three things
 * modulate it:
 *
 *   pointer   a radial lens displaces the field away from the cursor, so the
 *             streaks bend around it
 *   scroll    raises flow rate and drops exposure as the hero hands off
 *   time      two warp octaves advect at different rates, which is what
 *             stops the motion from looping visibly
 *
 * Crests are sampled at three slightly offset x positions to split them into
 * R/G/B, giving real chromatic aberration on the filament edges rather than a
 * blurred glow. Colour never leaves the void→moss→volt ramp: one accent.
 *
 * Budget: DPR capped at 1.5, paused when off-screen, single frame when
 * prefers-reduced-motion is set.
 */

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;    // 0..1, smoothed
uniform float uScroll;   // 0..1 across the hero runway
out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p = p * 2.03 + 17.1;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;

  float t = uTime * (0.045 + uScroll * 0.05);

  // Pointer lens — the field is pushed outward from the cursor.
  vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  vec2 d = p - m;
  float r = length(d);
  p += normalize(d + 1e-5) * 0.14 * exp(-r * 3.4);

  // Squash X, stretch Y => horizontal trails.
  vec2 q = vec2(p.x * 0.5, p.y * 2.9);

  float w1 = fbm(q + vec2(t * 3.2, t * 0.35));
  float w2 = fbm(q * 1.72 + vec2(-t * 4.4, w1 * 1.5));

  // Chromatic split: same field, three x offsets.
  float ca = 0.016 + uScroll * 0.02;
  vec2 base = q * 0.92 + vec2(t * 5.4 + w2 * 1.9, w1 * 0.95);
  float fr = fbm(base + vec2(ca, 0.0));
  float fg = fbm(base);
  float fb = fbm(base - vec2(ca, 0.0));

  float lo = 0.44;
  float hi = 0.85;
  vec3 crest = smoothstep(vec3(lo), vec3(hi), vec3(fr, fg, fb));
  vec3 fila = pow(crest, vec3(2.2));

  // A faint moving column grid — the design grid sliding past.
  float gx = abs(fract(p.x * 7.0 + t * 1.6) * 2.0 - 1.0);
  float grid = smoothstep(0.972, 1.0, gx) * 0.05;

  // Light is WHITE. The field is a black-and-white photograph of speed; the
  // brand green only ever survives in the very brightest crest cores, which
  // is where a real lens would show its coating. Painting the whole hero in
  // accent is what made this read as decoration instead of light.
  vec3 col = vec3(0.039);                            // void
  col += vec3(0.085) * fg * 1.7;                     // grey body
  col += vec3(1.0) * fila * 0.80;                    // white filaments
  col += vec3(0.627, 1.0, 0.6) * pow(fila, vec3(4.0)) * 0.34;  // green core only
  col += vec3(0.42) * grid;

  // Exposure falls as the hero hands off to the page.
  col *= 1.0 - uScroll * 0.62;

  // Vignette + a floor so the section can dissolve into the page colour.
  float vig = smoothstep(1.38, 0.24, length(vec2(p.x * 0.72, p.y)));
  col *= 0.44 + vig * 0.56;
  col = mix(col, vec3(0.039), smoothstep(0.62, 1.0, uv.y) * 0.55);

  // Per-pixel dither so the dark ramp never bands.
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.012;

  fragColor = vec4(col, 1.0);
}
`;

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

export function VelocityField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
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
    if (!vs || !fs) {
      canvas.dataset.fallback = "1";
      return;
    }
    const prog = gl.createProgram();
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

    // pointer: target vs smoothed, so the lens trails the cursor
    const target = { x: 0.62, y: 0.34 };
    const eased = { x: 0.62, y: 0.34 };
    let scroll = 0;
    let visible = true;
    let frame = 0;

    // The shader clock is ACCUMULATED, not derived from a fixed epoch. When
    // the hero scrolls out we stop drawing; if the clock kept running off a
    // t0, scrolling back up resumed it seconds ahead and the whole field
    // jumped to an unrelated state. Advancing only on drawn frames — and
    // clamping the step so a long pause or a background tab cannot push a
    // huge dt through — makes scroll-out/scroll-in continuous.
    let clock = 0;
    let last = performance.now();

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
      // Cap the step at ~2 frames. Anything longer is a pause, not motion.
      const dt = Math.min((now - last) / 1000, 0.034);
      last = now;
      clock += dt;
      eased.x += (target.x - eased.x) * 0.055;
      eased.y += (target.y - eased.y) * 0.055;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduced ? 8.4 : clock);
      gl.uniform2f(uMouse, eased.x, 1.0 - eased.y);
      gl.uniform1f(uScroll, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible) {
        // Keep the clock's reference point current while parked, so the
        // first visible frame computes a normal dt instead of a jump.
        last = now;
        return;
      }
      draw(now);
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = e.clientY / window.innerHeight;
    };
    // Progress is measured against the hero's own box, not window.scrollY, so
    // the fade is correct no matter where the hero sits in the document and
    // never goes stale when the canvas is resized or re-laid-out.
    const onScroll = () => {
      const r = canvas.getBoundingClientRect();
      const h = r.height || window.innerHeight;
      scroll = Math.min(1, Math.max(0, -r.top / h));
    };

    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { visible = e.isIntersecting; }),
      { threshold: 0 }
    );
    io.observe(canvas);

    const onResize = () => draw(performance.now());

    draw(performance.now());
    if (reduced) {
      window.addEventListener("resize", onResize);
    } else {
      frame = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
