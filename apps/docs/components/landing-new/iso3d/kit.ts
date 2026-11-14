import * as THREE from 'three';

// The isometric kit: flat-shaded rounded blocks in the language of the landing illustrations
// (light faces, darker sides, one-pixel ink lines, a soft ground shadow), with every color read
// from the Ladom UI tokens at run time. One world unit is one CSS pixel of the drawing.

export type Tokens = {
  face: THREE.Color;
  faceAlt: THREE.Color;
  sunken: THREE.Color;
  sideA: THREE.Color;
  sideB: THREE.Color;
  ink: THREE.Color;
  primary: THREE.Color;
  onPrimary: THREE.Color;
  success: THREE.Color;
  warning: THREE.Color;
  chart: THREE.Color[];
  css: Record<'face' | 'faceAlt' | 'sunken' | 'text' | 'muted' | 'faint' | 'ink' | 'primary' | 'onPrimary' | 'success' | 'warning' | 'line', string>;
  font: string;
};

/** Resolves token colors inside `host` (so scoped brand colors apply) to opaque rgb() strings. */
export function readTokens(host: HTMLElement): Tokens {
  const probe = document.createElement('span');
  probe.style.display = 'none';
  host.appendChild(probe);
  const cv = document.createElement('canvas');
  cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true })!;
  const resolve = (v: string) => {
    probe.style.color = `var(${v})`;
    return getComputedStyle(probe).color;
  };
  // Composite a (possibly translucent) token over an opaque one and read the pixel back.
  const solid = (v: string, over = '--color-surface-level-1') => {
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = resolve(over);
    cx.fillRect(0, 0, 1, 1);
    cx.fillStyle = resolve(v);
    cx.fillRect(0, 0, 1, 1);
    const [r, g, b] = cx.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${b})`;
  };
  const css = {
    face: solid('--color-surface-level-1'),
    faceAlt: solid('--color-surface-level-3'),
    sunken: solid('--color-surface-background'),
    text: solid('--color-foreground-high-emphasis'),
    muted: solid('--color-foreground-medium-emphasis'),
    faint: solid('--color-foreground-ghost-emphasis'),
    ink: solid('--color-foreground-medium-emphasis', '--color-surface-background'),
    primary: solid('--color-primary'),
    onPrimary: solid('--color-on-primary', '--color-primary'),
    success: solid('--color-success'),
    warning: solid('--color-warning'),
    line: solid('--color-opacity-12'),
  };
  const chart = [1, 2, 3, 4, 5, 6].map((i) => new THREE.Color(solid(`--color-chart-${i}`)));
  const font = getComputedStyle(host).fontFamily || 'sans-serif';
  probe.remove();
  const face = new THREE.Color(css.face);
  const text = new THREE.Color(css.text);
  return {
    face,
    faceAlt: new THREE.Color(css.faceAlt),
    sunken: new THREE.Color(css.sunken),
    sideA: face.clone().lerp(text, 0.1),
    sideB: face.clone().lerp(text, 0.2),
    ink: new THREE.Color(css.ink),
    primary: new THREE.Color(css.primary),
    onPrimary: new THREE.Color(css.onPrimary),
    success: new THREE.Color(css.success),
    warning: new THREE.Color(css.warning),
    chart,
    css,
    font,
  };
}

export function roundedRect(w: number, h: number, r: number, x = -w / 2, y = -h / 2) {
  const s = new THREE.Shape();
  r = Math.max(0.01, Math.min(r, w / 2 - 0.01, h / 2 - 0.01));
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

/** A sector of a ring, for donut charts: angles in radians, counter-clockwise. */
export function ringSector(inner: number, outer: number, a0: number, a1: number) {
  const s = new THREE.Shape();
  s.moveTo(Math.cos(a0) * outer, Math.sin(a0) * outer);
  s.absarc(0, 0, outer, a0, a1, false);
  s.lineTo(Math.cos(a1) * inner, Math.sin(a1) * inner);
  s.absarc(0, 0, inner, a1, a0, true);
  return s;
}

type Paint = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

/** A transparent texture drawn in world units (w x h), sharp at `k` pixels per unit. */
export function paintTexture(w: number, h: number, paint: Paint, k = 3) {
  const cv = document.createElement('canvas');
  cv.width = Math.ceil(w * k);
  cv.height = Math.ceil(h * k);
  const ctx = cv.getContext('2d')!;
  ctx.scale(k, k);
  paint(ctx, w, h);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// The side faces get two tones by direction, like the illustrations: lighter left, darker right.
function toneSides(geo: THREE.BufferGeometry, groupStart: number, groupCount: number, a: THREE.Color, b: THREE.Color, top: THREE.Color) {
  const n = geo.getAttribute('normal');
  const colors = new Float32Array(n.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < n.count; i++) {
    const inSides = i >= groupStart && i < groupStart + groupCount;
    const ny = n.getY(i);
    const nx = n.getX(i);
    const nz = n.getZ(i);
    if (!inSides) c.copy(top);
    else if (ny > 0.5) c.copy(top);
    else c.copy(a).lerp(b, THREE.MathUtils.clamp((nx - nz) * 0.5 + 0.5, 0, 1));
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
}

// Faces sit a hair behind their ink lines so the outlines never flicker.
export const solidMaterial = () => new THREE.MeshBasicMaterial({ vertexColors: true, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });

export type BlockOptions = {
  /** Footprint shape on the ground (x along world X, y along world -Z); a rounded rectangle by default. */
  shape?: THREE.Shape;
  w?: number;
  d?: number;
  h: number;
  r?: number;
  top?: THREE.Color;
  /** Side tones; the token side colors by default, or a darker step of `top` with `tinted`. */
  tinted?: boolean;
  lines?: boolean;
};

/**
 * A block standing on the ground (y = 0 to h). w runs along the iso "u" axis (screen up-right),
 * d along "v" (screen down-right). Its top face is at y = h.
 */
export function block(T: Tokens, o: BlockOptions) {
  const w = o.w ?? 100;
  const d = o.d ?? 100;
  const top = o.top ?? T.face;
  const shape = o.shape ?? roundedRect(d, w, o.r ?? 8);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: o.h, bevelEnabled: false, curveSegments: 16 });
  geo.rotateX(-Math.PI / 2);
  // ExtrudeGeometry is non-indexed: caps first (group 0), then the walls (group 1).
  const walls = geo.groups[1] ?? { start: 0, count: 0 };
  const sideA = o.tinted ? top.clone().lerp(T.ink, 0.25) : T.sideA;
  const sideB = o.tinted ? top.clone().lerp(T.ink, 0.45) : T.sideB;
  toneSides(geo, walls.start, walls.count, sideA, sideB, top);
  geo.clearGroups();
  const mesh = new THREE.Mesh(geo, solidMaterial());
  const g = new THREE.Group();
  g.add(mesh);
  if (o.lines !== false) {
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 35), new THREE.LineBasicMaterial({ color: T.ink, transparent: true, opacity: 0.85 }));
    g.add(edges);
  }
  return g;
}

/** A painted decal lying on a top face at height y (u along -Z, v along X), drawn in world units. */
export function decal(w: number, d: number, paint: Paint, y: number) {
  const tex = paintTexture(w, d, paint);
  const geo = new THREE.PlaneGeometry(w, d);
  geo.rotateX(-Math.PI / 2);
  geo.rotateY(Math.PI / 2);
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
  mesh.position.y = y + 0.4;
  mesh.renderOrder = 2;
  return mesh;
}

/** The soft shadow on the ground under a footprint, nudged toward the viewer like the illustrations. */
export function groundShadow(T: Tokens, w: number, d: number, r = 8, strength = 0.14) {
  const pad = 24;
  const tex = paintTexture(w + pad * 2, d + pad * 2, (ctx) => {
    ctx.filter = 'blur(9px)';
    ctx.fillStyle = T.css.text;
    ctx.globalAlpha = strength;
    ctx.beginPath();
    ctx.roundRect(pad + 4, pad + 6, w, d, r);
    ctx.fill();
  }, 1.5);
  const geo = new THREE.PlaneGeometry(w + pad * 2, d + pad * 2);
  geo.rotateX(-Math.PI / 2);
  geo.rotateY(Math.PI / 2);
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
  mesh.position.y = 0.2;
  mesh.renderOrder = 1;
  // The view is fitted to the shapes, not their shadows.
  mesh.userData.noFit = true;
  return mesh;
}

/** Places an object at iso coordinates: u (up-right), v (down-right), z (up). */
export const at = (o: THREE.Object3D, u: number, v: number, z = 0) => {
  o.position.set(v, z, -u);
  return o;
};

export const ease = {
  outBack: (t: number) => {
    const c = 1.6;
    const x = THREE.MathUtils.clamp(t, 0, 1) - 1;
    return 1 + (c + 1) * x * x * x + c * x * x;
  },
  outCubic: (t: number) => 1 - Math.pow(1 - THREE.MathUtils.clamp(t, 0, 1), 3),
  inOut: (t: number) => {
    const x = THREE.MathUtils.clamp(t, 0, 1);
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  },
};

/** 0 → 1 over [a, b] of a looping clock, eased. */
export const span = (t: number, a: number, b: number, f = ease.inOut) => f((t - a) / (b - a));

// Text and small UI drawn on decals.
export function text(ctx: CanvasRenderingContext2D, T: Tokens, s: string, x: number, y: number, size: number, weight = 600, color = T.css.text, align: CanvasTextAlign = 'left') {
  ctx.font = `${weight} ${size}px ${T.font}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}

export function pill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill: string, r = h / 2) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}
