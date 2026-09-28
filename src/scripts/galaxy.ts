import type { GalaxyShape } from '../data/brands';

/*
 * Deep Field Plate renderer.
 *
 * One procedural spiral is generated once and redrawn with different shape
 * uniforms for each scene (the opening galaxy plus one per brand stop). While
 * the visitor scrolls, the two nearest scenes are drawn together with weights
 * that crossfade between them. Stars near the pointer are pulled gently
 * toward it and settle back. The warp opens the "shutter": the frame stops
 * clearing, rotation accelerates, and every star leaves a long-exposure trail.
 */

const VOID: [number, number, number] = [0.016, 0.024, 0.043];

// Pass ids, shared with the shaders.
const PASS_GAS = 0;
const PASS_DUST = 1;
const PASS_STARS = 2;
const PASS_FIELD = 3;
const PASS_SPIKES = 4;

/**
 * Knocks the shader remembers: swipe samples and taps. Each one starts at
 * zero displacement and swells smoothly, so adding one never makes a star
 * jump; 24 slots at one sample per 45ms outlast a knock's ~1s life.
 */
const KNOCKS = 24;

const VERT = /* glsl */ `
precision highp float;
precision highp int;
attribute float a_r;
attribute vec4 a_seed;
attribute float a_kind;

uniform vec2 u_res;
uniform float u_dpr;
uniform float u_time;
uniform int u_pass;
uniform float u_arms;
uniform float u_wind;
uniform float u_tilt;
uniform float u_angle;
uniform float u_warmth;
uniform vec2 u_center;
uniform float u_scale;
uniform float u_alpha;
// Knocks in device px: xy = where, zw = push direction x strength (swipe)
// or (strength, 0) for a tap.
uniform vec4 u_knock[${KNOCKS}];
// x = age in seconds (negative = empty), y = kind (0 swipe, 1 tap).
uniform vec2 u_knockMeta[${KNOCKS}];
uniform float u_warp;
uniform float u_headroom;
uniform float u_pointScale;

varying vec4 v_color;
varying float v_kind;

const vec3 TEAL = vec3(0.12, 0.66, 0.63);
const vec3 TEAL_PALE = vec3(0.62, 0.90, 0.86);
const vec3 GOLD = vec3(0.89, 0.64, 0.29);
const vec3 GOLD_PALE = vec3(0.98, 0.86, 0.62);
const vec3 RUST = vec3(0.78, 0.30, 0.22);
const vec3 WHITE = vec3(0.96, 0.94, 0.90);
const vec3 BLUEWHITE = vec3(0.78, 0.90, 0.98);

/*
 * Knocked about: stars near a swipe or tap get a push and spring back. Each
 * star takes its own share, heading and timing of the push, so a group
 * scatters like particles rather than moving as one sheet. The response
 * rises from zero (t/tp * e^(1 - t/tp)), so nothing ever snaps.
 */
vec2 knock(vec2 px, float seed) {
  vec2 disp = vec2(0.0);
  float tp = 0.10 + 0.08 * fract(seed * 23.71 + 0.17);
  for (int i = 0; i < ${KNOCKS}; i++) {
    vec2 meta = u_knockMeta[i];
    float age = meta.x;
    if (age < 0.0 || age > 1.1) continue;
    vec4 k = u_knock[i];
    vec2 d = px - k.xy;
    float r2 = dot(d, d);
    float reach = (meta.y < 0.5 ? 70.0 : 60.0) * u_dpr;
    float fall = exp(-r2 / (reach * reach));
    if (fall < 0.01) continue;
    float dist = max(sqrt(r2), 1.0);
    vec2 outward = d / dist;
    float t = age / tp;
    float pulse = t * exp(1.0 - t);
    if (meta.y < 0.5) {
      // Swipe: along the stroke, and a little away from its path.
      float strength = length(k.zw);
      disp += (k.zw * 0.8 + outward * strength * 0.5) * fall * pulse * 7.0 * u_dpr;
    } else {
      // Tap: straight out from the fingertip.
      disp += outward * fall * pulse * k.z * 8.0 * u_dpr;
    }
  }
  float share = 0.4 + 1.1 * fract(seed * 17.13 + 0.37);
  float turn = (fract(seed * 41.7 + 0.11) - 0.5) * 1.2;
  float c = cos(turn), sn = sin(turn);
  disp = vec2(disp.x * c - disp.y * sn, disp.x * sn + disp.y * c) * share;
  // Soft ceiling near 14 CSS px.
  float cap = 14.0 * u_dpr;
  float m = length(disp);
  if (m > 0.0001) {
    float e = exp(-2.0 * m / cap);
    disp *= cap * ((1.0 - e) / (1.0 + e)) / m;
  }
  return disp;
}

void main() {
  v_kind = a_kind;

  // Field stars and spiked foreground stars live in screen space.
  if (u_pass == ${PASS_FIELD} || u_pass == ${PASS_SPIKES}) {
    vec2 p = a_seed.xy * u_res;
    // A very slow drift so the backdrop is never frozen, stronger during warp.
    p += (a_seed.xy - 0.5) * u_res * u_warp * u_warp * 0.35;
    if (u_pass == ${PASS_FIELD}) p += knock(p, a_seed.z + a_seed.w) * 0.4;
    gl_Position = vec4(p / u_res * 2.0 - 1.0, 0.0, 1.0);
    gl_Position.y = -gl_Position.y;
    float twinkle = 0.82 + 0.18 * sin(u_time * (0.6 + a_seed.w * 1.4) + a_seed.z * 40.0);
    if (u_pass == ${PASS_SPIKES}) {
      gl_PointSize = (26.0 + a_seed.z * 34.0) * u_dpr;
      vec3 c = mix(BLUEWHITE, GOLD_PALE, step(0.55, a_seed.w));
      v_color = vec4(c, (0.55 + 0.45 * a_seed.z) * twinkle * u_headroom);
    } else {
      gl_PointSize = (0.8 + a_seed.z * a_seed.z * 2.2) * u_dpr;
      vec3 c = mix(WHITE, mix(BLUEWHITE, GOLD_PALE, a_seed.w), 0.6);
      v_color = vec4(c, (0.25 + 0.75 * a_seed.z) * twinkle * u_headroom);
    }
    return;
  }

  float r = a_r;
  float armIdx = floor(a_seed.x * u_arms);
  float armBase = armIdx * 6.2831853 / u_arms;
  float spiral = u_wind * log(1.0 + r * 5.0) * 1.25;

  // a_kind: 0 = arm star, 1 = diffuse disk star, 2 = bulge star, 3 = HII knot.
  float theta;
  if (a_kind > 1.5 && a_kind < 2.5) {
    theta = a_seed.y * 6.2831853;
  } else if (a_kind > 0.5 && a_kind < 1.5) {
    theta = a_seed.y * 6.2831853;
  } else {
    // Arm scatter narrows toward the rim and is tighter for HII knots and dust.
    float spread = (a_kind > 2.5 ? 0.22 : 0.78) * (1.0 - 0.35 * r);
    if (u_pass == ${PASS_DUST}) spread = 0.18;
    // Concentrate stars along the arm's spine with soft tails.
    float off = (a_seed.y - 0.5) * 2.0;
    theta = armBase + spiral + off * abs(off) * spread;
    // Dust lanes trail slightly inside the arm's leading edge.
    if (u_pass == ${PASS_DUST}) theta -= 0.22;
  }

  // Nearly rigid rotation with a gentle differential term.
  float omega = 0.035 * (0.82 + 0.18 * 0.3 / (r + 0.3));
  // Arms open toward +theta, so turning toward -theta keeps them trailing:
  // every galaxy winds its arms inward, as real spirals do.
  theta -= u_time * omega;

  float h = (a_seed.z - 0.5) * 0.09 * (1.0 - r) ;
  if (a_kind > 1.5 && a_kind < 2.5) h *= 3.5;
  vec3 p3 = vec3(cos(theta) * r, sin(theta) * r, h);

  // Incline the disk toward the viewer, then orient it on screen.
  float ct = cos(u_tilt), st = sin(u_tilt);
  vec2 p2 = vec2(p3.x, p3.y * ct - p3.z * st);
  float ca = cos(u_angle), sa = sin(u_angle);
  p2 = vec2(p2.x * ca - p2.y * sa, p2.x * sa + p2.y * ca);

  float scale = u_scale * (1.0 + u_warp * u_warp * 0.9);
  vec2 px = u_center + p2 * scale;
  px += knock(px, a_seed.y + a_seed.w);

  gl_Position = vec4(px / u_res * 2.0 - 1.0, 0.0, 1.0);
  gl_Position.y = -gl_Position.y;

  float sizeScale = clamp(u_scale / (520.0 * u_dpr), 0.6, 1.5);

  if (u_pass == ${PASS_GAS}) {
    gl_PointSize = (40.0 + a_seed.w * 70.0) * u_dpr * sizeScale * u_pointScale;
    vec3 c = mix(TEAL, GOLD, clamp(u_warmth * 0.5 + (1.0 - r) * 1.1 - 0.62, 0.0, 1.0));
    if (a_seed.w > 0.88) c = RUST;
    float a = 0.045 * (1.0 - r * 0.6);
    if (a_kind > 1.5) {
      // Bulge glow: a few broad, warm sprites around the core.
      gl_PointSize = (120.0 + a_seed.w * 160.0) * u_dpr * sizeScale * u_pointScale;
      c = mix(GOLD, GOLD_PALE, a_seed.w);
      a = 0.04;
    }
    v_color = vec4(c, a * u_alpha * u_headroom);
    return;
  }

  if (u_pass == ${PASS_DUST}) {
    gl_PointSize = (16.0 + a_seed.w * 34.0) * u_dpr * sizeScale * u_pointScale;
    // Absorption strength; lanes stay off the core rim and fade at the edge.
    float a = 0.32 * smoothstep(0.4, 0.62, r) * (1.0 - smoothstep(0.75, 1.0, r));
    v_color = vec4(0.62, 0.3, 0.2, a * u_alpha);
    return;
  }

  // Stars.
  vec3 c;
  float size = 0.9 + a_seed.w * a_seed.w * 2.4;
  float a = 0.55 + 0.45 * a_seed.w;
  if (a_kind > 2.5) {
    c = mix(RUST, vec3(0.95, 0.45, 0.42), a_seed.w);
    size = 2.2 + a_seed.w * 3.0;
    a = 0.75;
  } else if (a_kind > 1.5) {
    c = mix(GOLD, GOLD_PALE, a_seed.w);
    c = mix(c, WHITE, smoothstep(0.06, 0.0, r) * 0.6);
    a = (0.08 + 0.12 * a_seed.w) * (0.35 + smoothstep(0.0, 0.22, r) * 0.65);
    size *= 0.8;
  } else {
    vec3 young = mix(TEAL_PALE, BLUEWHITE, a_seed.w);
    vec3 old = mix(GOLD, WHITE, a_seed.w * 0.6);
    float warm = clamp(u_warmth * 0.5 + (1.0 - r) * 0.7 - 0.45 + (a_seed.z - 0.5) * 0.5, 0.0, 1.0);
    c = mix(young, old, warm);
    // Thin the inner disk so it rolls into the bulge instead of clipping.
    a *= mix(0.3, 1.0, smoothstep(0.08, 0.4, r));
  }
  gl_PointSize = size * u_dpr * sizeScale * (1.0 + u_warp * 0.6);
  // Fewer screen pixels per star means more overlap: dim to keep the core from clipping.
  float density = clamp(pow(u_scale / (1000.0 * u_dpr), 1.1), 0.42, 1.0);
  v_color = vec4(c, a * u_alpha * density * u_headroom);
}
`;

const FRAG = /* glsl */ `
precision highp float;
precision highp int;
uniform int u_pass;
varying vec4 v_color;
varying float v_kind;

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d2 = dot(p, p);
  float a;
  if (u_pass == ${PASS_SPIKES}) {
    // Core plus four diffraction spikes.
    float core = exp(-d2 * 900.0);
    float halo = exp(-d2 * 90.0) * 0.18;
    float sx = exp(-abs(p.y) * 160.0) * (1.0 - smoothstep(0.0, 0.5, abs(p.x)));
    float sy = exp(-abs(p.x) * 160.0) * (1.0 - smoothstep(0.0, 0.5, abs(p.y)));
    a = core + halo + (sx + sy) * 0.55;
  } else if (u_pass == ${PASS_DUST}) {
    // Falls to zero at the sprite edge: overlapping sprites leave no rims.
    float soft = max(0.0, 1.0 - d2 * 4.0);
    float k = v_color.a * soft * soft;
    gl_FragColor = vec4(mix(vec3(1.0), v_color.rgb, k), 1.0);
    return;
  } else if (u_pass == ${PASS_GAS}) {
    // Falls to zero at the sprite edge. A cut-off Gaussian left a faint rim on
    // every sprite, and dense cores stacked those rims into a hard-edged block.
    float soft = max(0.0, 1.0 - d2 * 4.0);
    a = soft * soft;
  } else {
    a = exp(-d2 * 22.0) * (1.0 - smoothstep(0.2, 0.25, d2));
  }
  gl_FragColor = vec4(v_color.rgb, v_color.a * a);
}
`;

const QUAD_VERT = /* glsl */ `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const QUAD_FRAG = /* glsl */ `
precision mediump float;
uniform vec4 u_color;
void main() { gl_FragColor = u_color; }
`;

// Resolve: compress the additive light so dense cores roll off instead of clipping.
const RESOLVE_VERT = /* glsl */ `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const RESOLVE_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D u_tex;
uniform float u_headroom;
uniform vec3 u_void;
uniform float u_exposure;
varying vec2 v_uv;
void main() {
  vec3 c = texture2D(u_tex, v_uv).rgb / u_headroom;
  vec3 mapped = 1.0 - exp(-c * u_exposure);
  vec3 col = u_void + (1.0 - u_void) * mapped;
  // Photographic grain, fixed per pixel (replaces a full-screen CSS blend layer).
  float n = fract(sin(dot(floor(gl_FragCoord.xy), vec2(12.9898, 78.233))) * 43758.5453);
  col += (n - 0.5) * 0.045 * (0.4 + col);
  gl_FragColor = vec4(col, 1.0);
}
`;

// Adds the half-resolution gas and dust buffer into the full-resolution light buffer.
const COPY_FRAG = /* glsl */ `
precision mediump float;
uniform sampler2D u_tex;
varying vec2 v_uv;
void main() { gl_FragColor = vec4(texture2D(u_tex, v_uv).rgb, 1.0); }
`;

/*
 * Quality steps, taken only when frames keep running long. Step 1 lowers the
 * render resolution; step 2 lowers it further and thins the star field.
 */
const QUALITY = [
  { res: 1, stars: 1 },
  { res: 0.8, stars: 1 },
  { res: 0.62, stars: 0.6 },
];

/** Canvas pixel budget: 4K and ultra-wide screens render slightly softer, never slower. */
const MAX_PIXELS = 4.2e6;

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number) {
  // Sum of uniforms: cheap, bounded bell curve in 0..1.
  return (rand() + rand() + rand() + rand()) / 4;
}

interface Buffers {
  buf: WebGLBuffer;
  count: number;
}

function buildCloud(
  gl: WebGLRenderingContext,
  count: number,
  make: (rand: () => number, out: Float32Array, o: number) => void,
  seed: number,
): Buffers {
  const rand = rng(seed);
  const data = new Float32Array(count * 6);
  for (let i = 0; i < count; i++) make(rand, data, i * 6);
  const buf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  return { buf, count };
}

function compile(gl: WebGLRenderingContext, vs: string, fs: string) {
  const prog = gl.createProgram()!;
  for (const [type, src] of [
    [gl.VERTEX_SHADER, vs],
    [gl.FRAGMENT_SHADER, fs],
  ] as const) {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(sh) || 'shader compile failed');
    }
    gl.attachShader(prog, sh);
  }
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(prog) || 'program link failed');
  }
  return prog;
}

export interface Scene {
  shape: GalaxyShape;
  el: HTMLElement;
  /** hero: the opening plate; close: the horizon under the final call; stop: a brand. */
  kind: 'hero' | 'stop' | 'close';
}

export interface GalaxyController {
  warp(durationMs: number): Promise<void>;
  reset(): void;
  /** Stop rendering and remove every listener; the canvas is left for the caller. */
  destroy(): void;
}

export interface GalaxyOptions {
  /**
   * Called when the browser drops the WebGL context (a GPU reset, or a phone
   * reclaiming memory from a background tab). The renderer has already shut
   * itself down; the caller shows the still plate and may start a new one.
   */
  onLost?: () => void;
}

export function startGalaxy(
  canvas: HTMLCanvasElement,
  scenes: Scene[],
  options: GalaxyOptions = {},
): GalaxyController | null {
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: 'high-performance',
  });
  if (!gl) return null;

  let prog: WebGLProgram;
  let quad: WebGLProgram;
  let resolveProg: WebGLProgram;
  let copyProg: WebGLProgram;
  try {
    prog = compile(gl, VERT, FRAG);
    quad = compile(gl, QUAD_VERT, QUAD_FRAG);
    resolveProg = compile(gl, RESOLVE_VERT, RESOLVE_FRAG);
    copyProg = compile(gl, RESOLVE_VERT, COPY_FRAG);
  } catch (err) {
    console.warn('[cosmos] galaxy disabled:', err);
    return null;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Every listener hangs off this signal so the renderer can be torn down cleanly.
  const listeners = new AbortController();
  const signal = listeners.signal;
  let dead = false;
  const small = Math.min(window.innerWidth, window.innerHeight) < 700;

  // --- Geometry -----------------------------------------------------------
  const starCount = small ? 16000 : 38000;
  const stars = buildCloud(
    gl,
    starCount,
    (rand, out, o) => {
      const k = rand();
      let kind: number;
      let r: number;
      if (k < 0.18) {
        kind = 2; // bulge
        r = Math.pow(rand(), 1.6) * 0.26;
      } else {
        kind = k < 0.66 ? 0 : k < 0.975 ? 1 : 3;
        // Exponential disk, clipped at the rim; arms begin outside the bulge.
        r = -Math.log(1 - rand() * 0.95) / 3.0;
        r = 0.1 + r * 0.9;
      }
      out[o] = r;
      out[o + 1] = rand();
      out[o + 2] = gaussian(rand);
      out[o + 3] = rand();
      out[o + 4] = rand();
      out[o + 5] = kind;
    },
    7,
  );
  const gas = buildCloud(
    gl,
    small ? 520 : 900,
    (rand, out, o) => {
      const k = rand();
      const kind = k < 0.08 ? 2 : k < 0.78 ? 0 : 1;
      out[o] = kind === 2 ? Math.pow(rand(), 2) * 0.16 : 0.1 + Math.pow(rand(), 0.9) * 0.85;
      out[o + 1] = rand();
      out[o + 2] = gaussian(rand);
      out[o + 3] = rand();
      out[o + 4] = rand();
      out[o + 5] = kind;
    },
    11,
  );
  const dust = buildCloud(
    gl,
    small ? 700 : 1300,
    (rand, out, o) => {
      out[o] = 0.08 + rand() * 0.85;
      out[o + 1] = rand();
      out[o + 2] = gaussian(rand);
      out[o + 3] = rand();
      out[o + 4] = rand();
      out[o + 5] = 0;
    },
    13,
  );
  const field = buildCloud(
    gl,
    small ? 500 : 1100,
    (rand, out, o) => {
      out[o] = 0;
      out[o + 1] = rand();
      out[o + 2] = rand();
      out[o + 3] = Math.pow(rand(), 3);
      out[o + 4] = rand();
      out[o + 5] = 0;
    },
    17,
  );
  const spikes = buildCloud(
    gl,
    small ? 7 : 13,
    (rand, out, o) => {
      out[o] = 0;
      out[o + 1] = 0.04 + rand() * 0.92;
      out[o + 2] = 0.04 + rand() * 0.92;
      out[o + 3] = rand();
      out[o + 4] = rand();
      out[o + 5] = 0;
    },
    23,
  );
  // Field and spike seeds are stored in slots 1..4 (x, y, size, hue).
  // The shader reads a_seed.xy as screen position for those passes.

  const quadBuf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  // --- Uniforms -----------------------------------------------------------
  const loc = {
    r: gl.getAttribLocation(prog, 'a_r'),
    seed: gl.getAttribLocation(prog, 'a_seed'),
    kind: gl.getAttribLocation(prog, 'a_kind'),
  };
  const u = (name: string) => gl.getUniformLocation(prog, name);
  const U = {
    res: u('u_res'),
    dpr: u('u_dpr'),
    time: u('u_time'),
    pass: u('u_pass'),
    arms: u('u_arms'),
    wind: u('u_wind'),
    tilt: u('u_tilt'),
    angle: u('u_angle'),
    warmth: u('u_warmth'),
    center: u('u_center'),
    scale: u('u_scale'),
    alpha: u('u_alpha'),
    knock: u('u_knock'),
    knockMeta: u('u_knockMeta'),
    warp: u('u_warp'),
  };
  const quadPos = gl.getAttribLocation(quad, 'a_pos');
  const quadColor = gl.getUniformLocation(quad, 'u_color');
  const resolvePos = gl.getAttribLocation(resolveProg, 'a_pos');
  const R = {
    tex: gl.getUniformLocation(resolveProg, 'u_tex'),
    headroom: gl.getUniformLocation(resolveProg, 'u_headroom'),
    void: gl.getUniformLocation(resolveProg, 'u_void'),
    exposure: gl.getUniformLocation(resolveProg, 'u_exposure'),
  };
  const headroomLoc = gl.getUniformLocation(prog, 'u_headroom');
  const pointScaleLoc = gl.getUniformLocation(prog, 'u_pointScale');
  const copyPos = gl.getAttribLocation(copyProg, 'a_pos');
  const copyTexLoc = gl.getUniformLocation(copyProg, 'u_tex');

  // Offscreen light buffer: half-float where supported, else 8-bit with headroom.
  const halfExt = gl.getExtension('OES_texture_half_float');
  gl.getExtension('EXT_color_buffer_half_float');
  const halfLinear = !!gl.getExtension('OES_texture_half_float_linear');
  const lightTex = gl.createTexture()!;
  const fbo = gl.createFramebuffer()!;
  // Soft gas and dust render at half resolution: a quarter of the fill cost, same look.
  const gasTex = gl.createTexture()!;
  const gasFbo = gl.createFramebuffer()!;
  let GW = 1;
  let GH = 1;
  let texType: number = halfExt ? halfExt.HALF_FLOAT_OES : gl.UNSIGNED_BYTE;
  let headroom = 1;

  function allocLight(w: number, h: number) {
    gl!.bindTexture(gl!.TEXTURE_2D, lightTex);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.NEAREST);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.NEAREST);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, w, h, 0, gl!.RGBA, texType, null);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
    gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, lightTex, 0);
    if (texType !== gl!.UNSIGNED_BYTE && gl!.checkFramebufferStatus(gl!.FRAMEBUFFER) !== gl!.FRAMEBUFFER_COMPLETE) {
      texType = gl!.UNSIGNED_BYTE;
      allocLight(w, h);
      return;
    }
    // 8-bit targets store light at reduced intensity so highlights have room.
    headroom = texType === gl!.UNSIGNED_BYTE ? 0.45 : 1;

    GW = Math.max(1, Math.ceil(w / 2));
    GH = Math.max(1, Math.ceil(h / 2));
    const filter = texType === gl!.UNSIGNED_BYTE || halfLinear ? gl!.LINEAR : gl!.NEAREST;
    gl!.bindTexture(gl!.TEXTURE_2D, gasTex);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, filter);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, filter);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, GW, GH, 0, gl!.RGBA, texType, null);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, gasFbo);
    gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, gasTex, 0);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
  }

  // --- State --------------------------------------------------------------
  let dpr = 1;
  let W = 0;
  let H = 0;
  /*
   * Knocks: while a pointer or finger moves, a lightly smoothed follower lays
   * swipe knocks along its path; taps add one outward knock from a shared
   * energy budget. Ages advance per frame; the shader does the rest.
   */
  const knockData = new Float32Array(KNOCKS * 4);
  const knockMeta = new Float32Array(KNOCKS * 2).fill(-1);
  const knockBorn = new Float64Array(KNOCKS).fill(-1e9);
  let knockNext = 0;
  let lastSwipeKnock = 0;
  let tapEnergy = 1;
  const follow = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, on: false };
  let warp = 0;
  let warping = false;
  let time = 12; // start mid-rotation so the first frame is already composed
  let last = performance.now();
  let raf = 0;
  let quality = 0;
  let lastInput = performance.now();
  let frameEma = 16.7;
  let slowFrames = 0;
  let drawn = 0;
  let prevActive = true;
  let lastScrollY = window.scrollY;
  let scrollDir = 1;

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const budget = Math.sqrt(MAX_PIXELS / Math.max(1, w * h));
    dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75, budget) * QUALITY[quality].res;
    W = Math.max(1, Math.round(w * dpr));
    H = Math.max(1, Math.round(h * dpr));
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }
    gl!.viewport(0, 0, W, H);
    allocLight(W, H);
  }

  function bindCloud(c: Buffers) {
    gl!.bindBuffer(gl!.ARRAY_BUFFER, c.buf);
    gl!.enableVertexAttribArray(loc.r);
    gl!.vertexAttribPointer(loc.r, 1, gl!.FLOAT, false, 24, 0);
    gl!.enableVertexAttribArray(loc.seed);
    gl!.vertexAttribPointer(loc.seed, 4, gl!.FLOAT, false, 24, 4);
    gl!.enableVertexAttribArray(loc.kind);
    gl!.vertexAttribPointer(loc.kind, 1, gl!.FLOAT, false, 24, 20);
  }

  /** Scene weights from section positions: the two closest to the viewport centre. */
  function sceneWeights() {
    const vh = window.innerHeight;
    const mid = vh / 2;
    const list = scenes.map((s, i) => {
      const rect = s.el.getBoundingClientRect();
      const c = rect.top + rect.height / 2;
      const dist = Math.abs(c - mid) / (vh * 0.9);
      return { i, w: Math.max(0, 1 - dist), offset: c - mid };
    });
    list.sort((a, b) => b.w - a.w);
    const top = list.slice(0, 2).filter((s) => s.w > 0);
    if (!top.length) return [{ i: 0, w: 1, offset: 0 }];
    if (reduceMotion.matches) return [{ ...top[0], w: 1, offset: 0 }];
    // The galaxy scrolling in waits until the outgoing stop's text has mostly
    // left, so text never sits over two cores at once.
    if (top.length === 2) {
      const incoming = top.find((s) => Math.sign(s.offset) === scrollDir);
      if (incoming) incoming.w *= incoming.w;
    }
    // Smoothstep the pair so the crossfade lingers on each galaxy.
    const sum = top.reduce((a, s) => a + s.w, 0);
    return top.map((s) => {
      const t = s.w / sum;
      return { ...s, w: t * t * (3 - 2 * t) };
    });
  }

  /** Mirrors the CSS: stacked below 760px, and on portrait screens under 1100px. */
  function isStacked(cssW: number, cssH: number) {
    return cssW < 760 || (cssH > cssW && cssW < 1100);
  }

  function layout(scene: Scene) {
    const cssW = W / dpr;
    const cssH = H / dpr;
    const stacked = isStacked(cssW, cssH);
    // Galaxies fill the whole viewport, ultra-wide included.
    const frame = cssW;
    const left = 0;
    const s = scene.shape;
    let x = left + s.x * frame;
    let y = s.y * cssH;
    let radius: number;
    if (scene.kind === 'close') {
      // A near edge-on disk lying under the closing call, like a horizon.
      radius = stacked ? cssW * 0.95 : Math.min(frame * 0.46, cssH * 0.9);
      x = cssW / 2;
      // High enough that the colophon at the page end sits on dark sky.
      y = cssH * (stacked ? 0.7 : 0.66);
    } else if (scene.kind === 'hero') {
      // On ultra-wide screens the spiral grows with the width so it stays full-bleed.
      radius = stacked
        ? Math.max(cssW * 0.85, cssH * 0.4)
        : Math.min(frame * 0.5, Math.max(cssH * 0.78, cssW * 0.4));
      if (stacked) {
        x = cssW * 0.62;
        y = cssH * 0.3;
      }
    } else {
      radius = stacked ? Math.min(cssW * 0.62, cssH * 0.3) : Math.min(frame * 0.34, cssH * 0.52);
      if (stacked) {
        x = cssW * 0.5;
        y = cssH * 0.3;
      }
    }
    return { x: x * dpr, y: y * dpr, radius: radius * dpr };
  }

  function setScene(scene: Scene, weight: number, offset: number) {
    const s = scene.shape;
    const L = layout(scene);
    gl!.uniform1f(U.arms, s.arms);
    gl!.uniform1f(U.wind, s.wind);
    gl!.uniform1f(U.tilt, s.tilt);
    gl!.uniform1f(U.angle, s.angle);
    gl!.uniform1f(U.warmth, s.warmth);
    // Drift with the scroll so the galaxy travels with its section.
    gl!.uniform2f(U.center, L.x, L.y + offset * 0.35 * dpr);
    gl!.uniform1f(U.scale, L.radius);
    gl!.uniform1f(U.alpha, weight);
  }

  function drawGas(scene: Scene, weight: number, offset: number) {
    setScene(scene, weight, offset);
    gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE);
    gl!.uniform1i(U.pass, PASS_GAS);
    bindCloud(gas);
    gl!.drawArrays(gl!.POINTS, 0, gas.count);

    // Multiply: dust tints and absorbs the light behind it, never punches black.
    gl!.blendFunc(gl!.ZERO, gl!.SRC_COLOR);
    gl!.uniform1i(U.pass, PASS_DUST);
    bindCloud(dust);
    gl!.drawArrays(gl!.POINTS, 0, dust.count);
  }

  function drawStars(scene: Scene, weight: number, offset: number) {
    setScene(scene, weight, offset);
    gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE);
    gl!.uniform1i(U.pass, PASS_STARS);
    bindCloud(stars);
    gl!.drawArrays(gl!.POINTS, 0, Math.floor(stars.count * QUALITY[quality].stars));
  }

  /** Fade the bound buffer toward black: a full clear, or a partial one to leave warp trails. */
  function fadeTarget(fade: number) {
    gl!.useProgram(quad);
    gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE_MINUS_SRC_ALPHA);
    gl!.bindBuffer(gl!.ARRAY_BUFFER, quadBuf);
    gl!.enableVertexAttribArray(quadPos);
    gl!.vertexAttribPointer(quadPos, 2, gl!.FLOAT, false, 0, 0);
    gl!.uniform4f(quadColor, 0, 0, 0, fade);
    gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    gl!.disableVertexAttribArray(quadPos);
  }

  function setCommon() {
    gl!.useProgram(prog);
    gl!.uniform2f(U.res, W, H);
    gl!.uniform1f(U.dpr, dpr);
    gl!.uniform1f(U.time, time);
    gl!.uniform4fv(U.knock, knockData);
    gl!.uniform2fv(U.knockMeta, knockMeta);
    gl!.uniform1f(U.warp, warp);
    gl!.uniform1f(headroomLoc, headroom);
  }

  /** Step quality down if frames keep running long; never steps back up mid-visit. */
  function adapt(interval: number, active: boolean) {
    if (!active || !prevActive || warping || drawn < 90 || quality >= QUALITY.length - 1) return;
    frameEma = frameEma * 0.93 + interval * 0.07;
    slowFrames = frameEma > 24 ? slowFrames + 1 : 0;
    if (slowFrames > 45) {
      quality++;
      slowFrames = 0;
      frameEma = 16.7;
      resize();
    }
  }

  function addKnock(x: number, y: number, zx: number, zy: number, kind: number, now: number) {
    const i = knockNext;
    knockNext = (knockNext + 1) % KNOCKS;
    knockData.set([x * dpr, y * dpr, zx, zy], i * 4);
    knockMeta[i * 2 + 1] = kind;
    knockBorn[i] = now;
  }

  function clearKnocks() {
    knockBorn.fill(-1e9);
    knockMeta.fill(-1);
    follow.on = false;
  }

  /** Follow the pointer, lay swipe knocks while it moves, age every knock. */
  function updateKnocks(now: number, dt: number, still: boolean) {
    if (still || warping) {
      clearKnocks();
      return;
    }
    tapEnergy = Math.min(1, tapEnergy + dt / 0.9);
    if (follow.on && dt > 0) {
      const a = 1 - Math.exp(-dt / 0.05);
      const nx = follow.x + (follow.tx - follow.x) * a;
      const ny = follow.y + (follow.ty - follow.y) * a;
      const b = 1 - Math.exp(-dt / 0.06);
      follow.vx += ((nx - follow.x) / dt - follow.vx) * b;
      follow.vy += ((ny - follow.y) / dt - follow.vy) * b;
      follow.x = nx;
      follow.y = ny;
      const speed = Math.hypot(follow.vx, follow.vy);
      if (speed > 60 && now - lastSwipeKnock > 45) {
        const strength = Math.min(1, Math.max(0.15, speed / 1500));
        addKnock(follow.x, follow.y, (follow.vx / speed) * strength, (follow.vy / speed) * strength, 0, now);
        lastSwipeKnock = now;
      }
    }
    for (let i = 0; i < KNOCKS; i++) {
      const age = (now - knockBorn[i]) / 1000;
      knockMeta[i * 2] = age <= 1.1 ? age : -1;
    }
  }

  function frame(now: number) {
    raf = 0;
    if (dead) return;
    const still = reduceMotion.matches;
    // With no pointer, scroll or warp for a moment, the slow rotation runs at
    // 30fps: it reads the same and costs half the GPU time.
    const active = warping || now - lastInput < 2500;
    if (!active && !still && now - last < 31) {
      schedule();
      return;
    }
    const interval = now - last;
    const dt = Math.min(0.05, interval / 1000);
    last = now;
    adapt(interval, active);
    prevActive = active;
    drawn++;
    if (!still) time += dt * (1 + warp * warp * 40);

    updateKnocks(now, dt, still);

    // During the warp the previous frame persists as a trail instead of clearing.
    const fade = warping ? Math.max(0.05, 1 - warp * 1.4) : 1;
    const weights = sceneWeights().filter((w) => w.w > 0.002);
    gl!.enable(gl!.BLEND);

    // 1. Gas and dust, half resolution.
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, gasFbo);
    gl!.viewport(0, 0, GW, GH);
    fadeTarget(fade);
    setCommon();
    gl!.uniform1f(pointScaleLoc, 0.5);
    for (const w of weights) drawGas(scenes[w.i], w.w, w.offset);

    // 2. Stars, full resolution, over the backdrop and the upsampled gas.
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
    gl!.viewport(0, 0, W, H);
    fadeTarget(fade);
    setCommon();
    gl!.uniform1f(pointScaleLoc, 1);
    gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE);
    gl!.uniform1i(U.pass, PASS_FIELD);
    gl!.uniform1f(U.alpha, 1);
    bindCloud(field);
    gl!.drawArrays(gl!.POINTS, 0, field.count);

    gl!.useProgram(copyProg);
    gl!.blendFunc(gl!.ONE, gl!.ONE);
    gl!.activeTexture(gl!.TEXTURE0);
    gl!.bindTexture(gl!.TEXTURE_2D, gasTex);
    gl!.uniform1i(copyTexLoc, 0);
    gl!.bindBuffer(gl!.ARRAY_BUFFER, quadBuf);
    gl!.enableVertexAttribArray(copyPos);
    gl!.vertexAttribPointer(copyPos, 2, gl!.FLOAT, false, 0, 0);
    gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    gl!.disableVertexAttribArray(copyPos);

    gl!.useProgram(prog);
    for (const w of weights) drawStars(scenes[w.i], w.w, w.offset);

    gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE);
    gl!.uniform1i(U.pass, PASS_SPIKES);
    gl!.uniform1f(U.alpha, 1);
    bindCloud(spikes);
    gl!.drawArrays(gl!.POINTS, 0, spikes.count);

    // 3. Resolve the light buffer to the screen through the tone curve.
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
    gl!.viewport(0, 0, W, H);
    gl!.disable(gl!.BLEND);
    gl!.useProgram(resolveProg);
    gl!.activeTexture(gl!.TEXTURE0);
    gl!.bindTexture(gl!.TEXTURE_2D, lightTex);
    gl!.uniform1i(R.tex, 0);
    gl!.uniform1f(R.headroom, headroom);
    gl!.uniform3f(R.void, VOID[0], VOID[1], VOID[2]);
    // The warp holds the shutter open until the plate burns out to light.
    gl!.uniform1f(R.exposure, 1.85 * (1 + Math.pow(warp, 3) * 9));
    gl!.bindBuffer(gl!.ARRAY_BUFFER, quadBuf);
    gl!.enableVertexAttribArray(resolvePos);
    gl!.vertexAttribPointer(resolvePos, 2, gl!.FLOAT, false, 0, 0);
    gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    gl!.disableVertexAttribArray(resolvePos);

    // Keep animating unless motion is reduced; then draw only on change.
    if (!still || warping) schedule();
  }

  function schedule() {
    if (!raf && !dead && !document.hidden) raf = requestAnimationFrame(frame);
  }

  function invalidate() {
    lastInput = performance.now();
    schedule();
  }

  // --- Events -------------------------------------------------------------
  const ro = new ResizeObserver(() => {
    resize();
    invalidate();
  });
  ro.observe(canvas);
  resize();

  const startFollow = (x: number, y: number) => {
    follow.x = follow.tx = x;
    follow.y = follow.ty = y;
    follow.vx = follow.vy = 0;
    follow.on = true;
  };
  const onMove = (e: PointerEvent) => {
    lastInput = performance.now();
    if (reduceMotion.matches || warping) return;
    // Mouse hover swipes; a finger swipes while it is down.
    if (e.pointerType === 'mouse' || e.buttons > 0 || e.pressure > 0) {
      if (!follow.on) startFollow(e.clientX, e.clientY);
      follow.tx = e.clientX;
      follow.ty = e.clientY;
    }
    schedule();
  };
  const onDown = (e: PointerEvent) => {
    lastInput = performance.now();
    if (reduceMotion.matches || warping) return;
    // Every touch starts where it lands: no streak from the last one.
    startFollow(e.clientX, e.clientY);
    const strength = Math.min(1, tapEnergy);
    tapEnergy = Math.max(0, tapEnergy - 0.3);
    if (strength > 0.05) addKnock(e.clientX, e.clientY, strength, 0, 1, performance.now());
    schedule();
  };
  const release = (e?: Event) => {
    // Lifting a finger ends its swipe; a mouse keeps hovering.
    if (!(e instanceof PointerEvent) || e.pointerType !== 'mouse') follow.on = false;
  };
  const passive = { passive: true, signal };
  window.addEventListener('pointermove', onMove, passive);
  window.addEventListener('pointerdown', onDown, passive);
  window.addEventListener('pointerup', release, passive);
  window.addEventListener('pointercancel', release, passive);
  document.documentElement.addEventListener('pointerleave', release, { signal });
  window.addEventListener('blur', release, { signal });
  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      if (y !== lastScrollY) scrollDir = y > lastScrollY ? 1 : -1;
      lastScrollY = y;
      invalidate();
    },
    passive,
  );
  document.addEventListener(
    'visibilitychange',
    () => {
      last = lastInput = performance.now();
      schedule();
    },
    { signal },
  );
  reduceMotion.addEventListener('change', invalidate, { signal });

  function destroy() {
    if (dead) return;
    dead = true;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    ro.disconnect();
    listeners.abort();
  }

  canvas.addEventListener(
    'webglcontextlost',
    (e) => {
      // Claim the event so the browser may hand back a context later.
      e.preventDefault();
      destroy();
      options.onLost?.();
    },
    { signal },
  );

  schedule();

  return {
    warp(durationMs: number) {
      if (dead || reduceMotion.matches) return Promise.resolve();
      warping = true;
      clearKnocks();
      const start = performance.now();
      schedule();
      return new Promise((resolve) => {
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          // Exponential ease-in: the shutter opens slowly, then everything goes.
          warp = t === 0 ? 0 : Math.pow(2, 10 * t - 10);
          warp = Math.min(1, warp * 1.0 + t * 0.35);
          if (t < 1 && !dead) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      });
    },
    reset() {
      warping = false;
      warp = 0;
      invalidate();
    },
    destroy,
  };
}
