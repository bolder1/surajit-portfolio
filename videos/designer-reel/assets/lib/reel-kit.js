/*
 * ReelKit: shared, deterministic helpers for the designer reel. See frame.md.
 * Loaded once by index.html (after GSAP). Every frame sub-composition can call window.ReelKit.
 * Pure functions of their inputs: no clocks, no Math.random, no network.
 */
(function (g) {
  var K = {};

  K.color = {
    void: "#0b0716",
    voidDeep: "#070410",
    tube: "#140c26",
    grid: "#4a2c8c",
    haze: "#3b1e6e",
    ink: "#f3eeff",
    inkDim: "#b4a8da",
    inkFaint: "#8c7eb8",
    beam: "#ff2e97",
    beamCore: "#ffd9ec",
    cyan: "#22e6ff",
    volt: "#f5ff3b",
  };

  /* Rounded-rect lens displacement map.
   * dir +1: sample OUTWARD (Tier H lens over a duplicated world; the rim wraps neon from outside).
   * dir -1: sample INWARD (Tier B backdrop-filter; the rim magnifies what is under the element).
   * power: falloff across the bezel band (2 = convex slab, 1.6 = pill chip). */
  K.lensMap = function (w, h, r, bezel, dir, power) {
    var c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    var ctx = c.getContext("2d");
    var img = ctx.createImageData(w, h);
    var d = img.data;
    var hw = w / 2,
      hh = h / 2,
      rn = Math.max(r, bezel);
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var px = x + 0.5 - hw,
          py = y + 0.5 - hh;
        var qx = Math.abs(px) - (hw - r),
          qy = Math.abs(py) - (hh - r);
        var dist = -(Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r);
        // normals come from a rounder shape (radius >= bezel) so the field has no diagonal seams
        var nqx = Math.abs(px) - (hw - rn),
          nqy = Math.abs(py) - (hh - rn),
          nx,
          ny;
        if (nqx > 0 && nqy > 0) {
          var L = Math.hypot(nqx, nqy);
          nx = nqx / L;
          ny = nqy / L;
        } else if (nqx > nqy) {
          nx = 1;
          ny = 0;
        } else {
          nx = 0;
          ny = 1;
        }
        nx *= px < 0 ? -1 : 1;
        ny *= py < 0 ? -1 : 1;
        var m = dist <= 0 ? 1 : dist >= bezel ? 0 : Math.pow(1 - dist / bezel, power);
        var i = (y * w + x) * 4;
        d[i] = Math.round(128 + 127 * m * nx * dir);
        d[i + 1] = Math.round(128 + 127 * m * ny * dir);
        d[i + 2] = 128;
        d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return c.toDataURL("image/png");
  };

  /* SVG <filter> markup for one glass element: displacement split per channel (R 1.00, G 0.90, B 0.80)
   * so the rim shows edge chroma. Insert into an <svg><defs> of the frame, then drive with setRefraction.
   * o: { w, h, r, bezel, dir, power, pad }. pad > max displacement (Tier H: 80; Tier B: 0). */
  K.lensFilter = function (id, o) {
    var pad = o.pad || 0;
    var map = K.lensMap(o.w, o.h, o.r, o.bezel, o.dir, o.power || 2);
    var ch = function (name, sel) {
      return (
        '<feDisplacementMap data-lg="' + name + '" in="SourceGraphic" in2="map" scale="0" xChannelSelector="R" yChannelSelector="G" result="d' + name + '"/>' +
        '<feColorMatrix in="d' + name + '" type="matrix" values="' + sel + '" result="' + name + '"/>'
      );
    };
    return (
      '<filter id="' + id + '" x="' + -pad + '" y="' + -pad + '" width="' + (o.w + 2 * pad) + '" height="' + (o.h + 2 * pad) +
      '" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">' +
      '<feImage href="' + map + '" x="0" y="0" width="' + o.w + '" height="' + o.h + '" preserveAspectRatio="none" result="map"/>' +
      ch("r", "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0") +
      ch("g", "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0") +
      ch("b", "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0") +
      '<feBlend in="r" in2="g" mode="screen" result="rg"/><feBlend in="rg" in2="b" mode="screen"/>' +
      "</filter>"
    );
  };

  /* Refraction strength. scale = feDisplacementMap scale for the red channel (max pixel shift ~ scale / 2). */
  K.setRefraction = function (filterEl, scale) {
    var r = filterEl.querySelector('[data-lg="r"]'),
      gg = filterEl.querySelector('[data-lg="g"]'),
      b = filterEl.querySelector('[data-lg="b"]');
    r.setAttribute("scale", scale);
    gg.setAttribute("scale", scale * 0.9);
    b.setAttribute("scale", scale * 0.8);
  };

  /* Baked damped spring as a GSAP ease (seek-safe closed form).
   * response ~ seconds per oscillation; damping 1 = no overshoot, 0.8 = iOS register, 0.62 = liquid wobble.
   * span = seconds of spring time mapped onto the tween (set the tween duration to the same value). */
  K.spring = function (response, damping, span) {
    var w = (2 * Math.PI) / response,
      z = Math.min(damping, 0.999),
      wd = w * Math.sqrt(1 - z * z),
      T = span || 1.2;
    return function (p) {
      if (p >= 1) return 1;
      var t = p * T;
      return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
    };
  };

  /* Seeded grain tile (256 px, grey around 128) for the finishing layer (mix-blend-mode: overlay). */
  K.grainURL = function (seed) {
    var c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    var ctx = c.getContext("2d");
    var img = ctx.createImageData(256, 256);
    var v = seed >>> 0;
    function rnd() {
      v += 0x6d2b79f5;
      var m = v;
      m = Math.imul(m ^ (m >>> 15), m | 1);
      m ^= m + Math.imul(m ^ (m >>> 7), m | 61);
      return ((m ^ (m >>> 14)) >>> 0) / 4294967296;
    }
    for (var i = 0; i < img.data.length; i += 4) {
      var gr = Math.round(128 + (rnd() - 0.5) * 210);
      img.data[i] = img.data[i + 1] = img.data[i + 2] = gr;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return "url(" + c.toDataURL("image/png") + ")";
  };
  /* Grain jumps to a new hashed offset every video frame (30 fps). */
  K.grainPos = function (t) {
    var n = Math.floor(t * 30 + 1e-6);
    return (n * 97) % 256 + "px " + ((n * 61 + ((n * n) % 37)) % 256) + "px";
  };

  /* Beam dash state. len = measured path length; s = distance travelled by the head.
   * seg null -> everything drawn so far; seg N -> a moving segment of N px ending at the head. */
  K.dash = function (paths, len, s, seg) {
    for (var i = 0; i < paths.length; i++) {
      var p = paths[i];
      if (seg == null) {
        p.style.strokeDasharray = len + " " + (len + 10);
        p.style.strokeDashoffset = len - s;
      } else {
        p.style.strokeDasharray = seg + " " + (len + seg + 10);
        p.style.strokeDashoffset = seg - s;
      }
    }
  };

  /* Perspective floor grid row y for row k at scroll phase (1 cell per beat when phase advances 2 per second). */
  K.gridRowY = function (k, phase, horizon, fh, z0) {
    var f = phase - Math.floor(phase);
    return horizon + fh / ((z0 || 3.2) + k - f);
  };

  g.ReelKit = K;
})(window);
