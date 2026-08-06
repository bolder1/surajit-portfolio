"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";

/**
 * BlackHoleField — a Schwarzschild black hole, ray-traced along real null
 * geodesics.
 *
 * This is not a lens shader faking a bend. For every pixel the fragment shader
 * integrates the actual photon orbit equation for Schwarzschild spacetime,
 *
 *     d²u/dφ² = −u + (3/2) r_s u²        where u = 1/r
 *
 * which is Newtonian gravity plus the relativistic (3/2) r_s u² term — the
 * term that is the whole difference between a star and a black hole. Working
 * in units where r_s = 1 makes it `u'' = −u + 1.5u²`, integrated with velocity
 * Verlet in the plane the photon actually orbits in (the plane spanned by the
 * camera position and the ray, since angular momentum is conserved and the
 * orbit is planar).
 *
 * Everything visible falls out of that integration rather than being drawn:
 *
 * - **The shadow** is where photons cross r = 1 and never come back. Its
 *   apparent size is ~2.6 r_s across, larger than the horizon, because light
 *   grazing it is bent inward.
 * - **The photon ring** at r = 1.5 is where light orbits; rays passing near it
 *   wind several times before escaping, so the sky and the disk appear
 *   smeared into a thin bright circle.
 * - **The disk over the top** is not a second disk. It is the *far side* of
 *   the same disk, its light bent over the hole and back down to the camera.
 *   No compositing produces that; only the geodesics do.
 * - **One side is brighter.** The disk orbits at v = √(M/r), so relativistic
 *   beaming boosts the approaching side by the Doppler factor δ⁴. This is the
 *   asymmetry in the M87* image, and it is why the picture reads as *fast*.
 * - **The inner edge stops at r = 3**, the innermost stable circular orbit for
 *   a Schwarzschild hole. Inside it there are no stable orbits, so there is no
 *   disk — a real edge, not an artistic fade.
 * - **Colour is temperature.** A Shakura–Sunyaev thin disk runs
 *   T ∝ r^(−3/4)(1 − √(r_in/r))^(1/4), so it whitens toward the middle and
 *   cools to orange at the rim, and the emission goes as T⁴.
 * - **Gravitational redshift** dims light climbing out of the well by
 *   √(1 − r_s/r), strongest exactly where the disk is hottest.
 *
 * Rendering cost is real: ~200 integration steps per pixel. So the canvas
 * renders at a capped internal width and is scaled up by CSS — the image is
 * smooth and continuous, which is the one kind of image that survives being
 * upscaled. DPR is capped, time accumulates on drawn frames, and the loop
 * pauses when off screen, like every other field on this site.
 */

export type BlackHoleHandle = {
  /** 0..1 — collapse intensity, driven by the intro's suck phase. */
  setSuck: (v: number) => void;
  /** Resolves once the first frame has actually been drawn. */
  ready: () => Promise<void>;
};

const VERT = `#version 300 es
in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
out vec4 frag;

uniform vec2  uRes;
uniform float uT;
uniform float uSuck;
uniform vec2  uMouse;

#define PI 3.14159265359
#define STEPS 170
#define R_IN  3.0     /* ISCO for Schwarzschild: 6GM/c^2 = 3 r_s */
#define R_OUT 10.0
#define R_ESC 45.0

float hash21(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

/* Background sky. Lensed for free: we sample it with the photon's escape
   direction, which the integration has already bent. */
vec3 sky(vec3 dir){
  float phi = atan(dir.z, dir.x);
  float th  = acos(clamp(dir.y, -1.0, 1.0));
  vec2 uv = vec2(phi / (2.0 * PI) + 0.5, th / PI);

  vec3 col = vec3(0.0);
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float scale = 190.0 + fi * 320.0;
    vec2 g = uv * scale;
    vec2 id = floor(g);
    vec2 f = fract(g) - 0.5;
    float h = hash21(id + fi * 37.0);
    if (h > 0.974) {
      vec2 off = (vec2(hash21(id + 11.0), hash21(id + 23.0)) - 0.5) * 0.7;
      float d = length(f - off);
      float s = smoothstep(0.13, 0.0, d);
      float tw = 0.72 + 0.28 * sin(uT * 1.3 + h * 40.0);
      vec3 tint = mix(vec3(0.72, 0.80, 1.0), vec3(1.0, 0.87, 0.72), hash21(id + 7.0));
      col += tint * s * tw * (0.22 + h * 0.6);
    }
  }
  /* A faint galactic band, so the lensing has something continuous to warp. */
  float band = exp(-pow((th - PI * 0.5) * 2.4, 2.0));
  col += vec3(0.007, 0.006, 0.013) * band;
  return col;
}

/* Thin-disk colour by temperature: orange at the rim, near-white inside. */
vec3 temp2rgb(float t){
  t = clamp(t, 0.0, 1.0);
  vec3 cool = vec3(1.00, 0.21, 0.03);
  vec3 mid  = vec3(1.00, 0.57, 0.15);
  vec3 hot  = vec3(1.00, 0.93, 0.82);
  return t < 0.5 ? mix(cool, mid, t * 2.0) : mix(mid, hot, (t - 0.5) * 2.0);
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;

  /* Camera: a little above the disk plane, which is what makes the far side
     visible over the top. Pointer nudges it, so the lensing is felt as
     parallax rather than read as a picture. */
  float incl = 0.155 + uMouse.y * 0.05;
  float yaw  = uMouse.x * 0.10;
  float R0   = 24.0;
  vec3 camPos = vec3(sin(yaw) * cos(incl) * R0, sin(incl) * R0, -cos(yaw) * cos(incl) * R0);

  vec3 fwd   = normalize(-camPos);
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), fwd));
  vec3 up    = cross(fwd, right);
  vec3 dir   = normalize(fwd + (uv.x * right + uv.y * up) * 0.62);

  /* Angular momentum fixes the orbital plane. A photon aimed dead centre has
     none, and falls straight in. */
  vec3 L = cross(camPos, dir);
  float Lm = length(L);
  if (Lm < 1e-4) { frag = vec4(0.0, 0.0, 0.0, 1.0); return; }

  vec3 n  = L / Lm;
  vec3 e1 = normalize(camPos);
  vec3 e2 = normalize(cross(n, e1));
  if (dot(dir, e2) < 0.0) { e2 = -e2; n = -n; }

  float r  = length(camPos);
  float u  = 1.0 / r;
  float vr = dot(dir, e1);
  float vt = dot(dir, e2);
  float du = -u * vr / max(vt, 1e-5);

  float phi = 0.0;
  vec3 pos  = camPos;
  vec3 prev = camPos;

  vec3 col = vec3(0.0);
  bool done = false;

  for (int i = 0; i < STEPS; i++) {
    if (done) break;

    /* Shorter steps where the field is strong — the orbit turns fastest
       exactly where a fixed step would overshoot it. */
    float h = 0.062 / (1.0 + 6.0 * u);

    float acc = -u + 1.5 * u * u;
    float uN  = u + du * h + 0.5 * acc * h * h;
    float accN = -uN + 1.5 * uN * uN;
    float duN = du + 0.5 * (acc + accN) * h;

    u = uN; du = duN; phi += h;

    if (u >= 1.0) { col = vec3(0.0); done = true; break; }   /* horizon */
    if (u <= 1.0 / R_ESC) {
      col = sky(normalize(pos - prev));
      done = true;
      break;
    }

    prev = pos;
    r = 1.0 / u;
    pos = (e1 * cos(phi) + e2 * sin(phi)) * r;

    /* Disk crossing: the equatorial plane, y = 0. */
    if (prev.y * pos.y < 0.0) {
      float t  = prev.y / (prev.y - pos.y);
      vec3  cp = mix(prev, pos, t);
      float rc = length(cp);

      if (rc > R_IN && rc < R_OUT) {
        vec3 radial = normalize(vec3(cp.x, 0.0, cp.z));
        vec3 vdir   = normalize(cross(vec3(0.0, 1.0, 0.0), radial));
        vec3 toObs  = -normalize(pos - prev);

        /* Keplerian orbit speed in units of c. M = r_s/2 = 0.5. */
        float beta  = sqrt(0.5 / rc);
        float gamma = 1.0 / sqrt(max(1.0 - beta * beta, 1e-4));
        float dop   = 1.0 / (gamma * (1.0 - beta * dot(vdir, toObs)));
        float grav  = sqrt(max(1.0 - 1.0 / rc, 1e-3));
        float g     = clamp(dop * grav, 0.0, 3.2);

        /* Shakura-Sunyaev temperature, zero at the ISCO. */
        float f  = max(1.0 - sqrt(R_IN / rc), 0.0);
        float T  = pow(rc, -0.75) * pow(f, 0.25);
        /* Emission uses the temperature straight: I goes as T^4, and that is
           what makes the inner disk dominate. Colour uses a squared version of
           the same field purely to read — a real disk at these temperatures
           radiates in the UV and X-ray, so *any* visible-light picture of one
           is already a false-colour map, and mapping it linearly clipped
           almost the whole disk to white. */
        float Tphys = clamp(T / 0.215, 0.0, 1.0);
        float Tn    = pow(Tphys, 2.0);

        /* Differential rotation: inner annuli shear past outer ones,
           because omega goes as r^-3/2. That shear is the texture. */
        float ang   = atan(cp.z, cp.x);
        float omega = pow(rc, -1.5) * (1.4 + 9.0 * uSuck);
        float sw    = ang - omega * uT;
        float turb  = 0.62
                    + 0.26 * sin(sw * 7.0 + rc * 2.3)
                    + 0.16 * sin(sw * 3.0 - rc * 4.1 + 1.7);

        float emit = pow(Tphys, 4.0) * 1.7 + 0.03;
        float beam = pow(g, 4.0);              /* relativistic beaming */

        col = temp2rgb(Tn) * emit * beam * max(turb, 0.05);
        col *= 1.0 + 5.0 * uSuck;
        done = true;
        break;
      }
    }
  }

  /* Anything still in flight after the step budget has wound up near the
     photon ring and is, for our purposes, captured. */

  /* Collapse: the whole field floods on the way out. */
  col += vec3(1.0, 0.93, 0.86) * pow(uSuck, 5.0) * 2.4;

  col += col * col * 0.32;                 /* cheap bloom */
  col = col / (1.0 + col);                 /* tonemap */
  col = pow(max(col, 0.0), vec3(0.4545));  /* gamma */

  frag = vec4(col, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    // Surfaced rather than swallowed: a silently blank canvas is the hardest
    // shader bug there is.
    console.error("BlackHoleField shader:", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function BlackHoleField({
  handleRef,
  className,
}: {
  handleRef?: Ref<BlackHoleHandle>;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const suck = useRef(0);
  const firstFrame = useRef<(() => void) | null>(null);
  const drawn = useRef(false);

  useImperativeHandle(
    handleRef,
    () => ({
      setSuck: (v: number) => {
        suck.current = v;
      },
      ready: () =>
        drawn.current
          ? Promise.resolve()
          : new Promise<void>((res) => {
              firstFrame.current = res;
            }),
    }),
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
    if (!gl) {
      canvas.setAttribute("data-fallback", "true");
      drawn.current = true;
      firstFrame.current?.();
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = vs && fs ? gl.createProgram() : null;
    if (!vs || !fs || !prog) {
      canvas.setAttribute("data-fallback", "true");
      drawn.current = true;
      firstFrame.current?.();
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("BlackHoleField link:", gl.getProgramInfoLog(prog));
      canvas.setAttribute("data-fallback", "true");
      drawn.current = true;
      firstFrame.current?.();
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
    const uSuck = gl.getUniformLocation(prog, "uSuck");
    const uMouse = gl.getUniformLocation(prog, "uMouse");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let clock = 0;
    let last = 0;
    let frame = 0;
    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };

    // ~200 integration steps per pixel is the cost of doing this honestly, so
    // the internal buffer is capped and CSS scales it up. The image is smooth
    // and has no text in it, which is exactly what upscales without telling.
    const MAX_W = 900;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const cssW = canvas.clientWidth || 1;
      const cssH = canvas.clientHeight || 1;
      const scale = Math.min(1, MAX_W / (cssW * dpr));
      const w = Math.max(1, Math.round(cssW * dpr * scale));
      const h = Math.max(1, Math.round(cssH * dpr * scale));
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

      eased.x += (target.x - eased.x) * 0.05;
      eased.y += (target.y - eased.y) * 0.05;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, reduced ? 4.0 : clock);
      gl.uniform1f(uSuck, suck.current);
      gl.uniform2f(uMouse, eased.x, eased.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!drawn.current) {
        drawn.current = true;
        firstFrame.current?.();
      }
      // Reduced motion still needs to animate the collapse, or pressing the
      // button would appear to do nothing at all.
      if (!reduced || suck.current > 0) frame = requestAnimationFrame(draw);
      else frame = 0;
    };

    const onPointer = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    frame = requestAnimationFrame(draw);

    const io = new IntersectionObserver(
      ([entry]) => {
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
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return <canvas ref={canvasRef} className={`v5-bh ${className ?? ""}`} aria-hidden />;
}
