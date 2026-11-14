import * as THREE from 'three';
import { at, block, decal, ease, groundShadow, paintTexture, pill, ringSector, roundedRect, solidMaterial, span, text, type Tokens } from './kit';

export type IsoLabels = Record<string, string>;

export type Built = {
  root: THREE.Group;
  /** t: seconds since start; spread: 0 at rest, 1 when the hero is pulled apart. */
  update: (t: number, spread: number) => void;
  /** A moment that shows the finished state: the still frame under prefers-reduced-motion. */
  settle: number;
};

// ───────────── The hero L: a letter built from component blocks ─────────────

// A block seen from the front: its rounded profile is in the screen-facing XY plane and the
// component is painted on the front face. Front faces are the surface color; top and side get
// the token side tones (or `top`).
function frontBlock(T: Tokens, w: number, h: number, d: number, paint: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, top?: THREE.Color) {
  const geo = new THREE.ExtrudeGeometry(roundedRect(w, h, 14, -w / 2, 0), { depth: d, bevelEnabled: false, curveSegments: 16 });
  geo.translate(0, 0, -d / 2);
  const n = geo.getAttribute('normal');
  const colors = new Float32Array(n.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < n.count; i++) {
    const nz = n.getZ(i);
    const ny = n.getY(i);
    if (Math.abs(nz) > 0.5) c.copy(T.face);
    else if (ny > 0.5) c.copy(top ?? T.sideA);
    else c.copy(top ? top.clone().lerp(T.ink, 0.3) : T.sideB);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.clearGroups();
  const g = new THREE.Group();
  g.add(new THREE.Mesh(geo, solidMaterial()));
  g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 35), new THREE.LineBasicMaterial({ color: T.ink, transparent: true, opacity: 0.85 })));
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: paintTexture(w, h, paint), transparent: true, depthWrite: false }));
  face.position.set(0, h / 2, d / 2 + 0.4);
  face.renderOrder = 2;
  g.add(face);
  return g;
}

function hero(T: Tokens, L: IsoLabels): Built {
  const root = new THREE.Group();
  const D = 150;
  const foot = frontBlock(T, 440, 104, D, (ctx, w, h) => {
    text(ctx, T, L.statLabel ?? 'Headcount', 26, 30, 15, 500, T.css.muted);
    text(ctx, T, '48', 26, 70, 40, 700);
    pill(ctx, 84, 58, 54, 24, T.css.faceAlt);
    text(ctx, T, '↗ +3', 111, 70, 13, 700, T.css.success, 'center');
    // Sparkline in the brand color.
    const pts = [62, 58, 60, 50, 52, 40, 42, 30, 26];
    ctx.beginPath();
    pts.forEach((y, i) => (i ? ctx.lineTo(232 + i * 23, y) : ctx.moveTo(232, y)));
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = T.css.primary;
    ctx.stroke();
    ctx.lineTo(232 + 8 * 23, 84);
    ctx.lineTo(232, 84);
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = T.css.primary;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(232 + 8 * 23, 26, 5, 0, Math.PI * 2);
    ctx.fill();
    void w;
    void h;
  });
  const W = 216;
  const input = frontBlock(T, W, 90, D, (ctx) => {
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = T.css.faint;
    ctx.beginPath();
    ctx.roundRect(18, 23, W - 36, 44, 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(40, 44, 7, 0, Math.PI * 2);
    ctx.moveTo(45, 49);
    ctx.lineTo(50, 54);
    ctx.strokeStyle = T.css.muted;
    ctx.stroke();
    text(ctx, T, L.search ?? 'Search people…', 60, 45, 15, 500, T.css.muted);
  });
  const toggle = frontBlock(T, W, 90, D, (ctx) => {
    text(ctx, T, L.toggle ?? 'Email digest', 20, 45, 16, 600);
    pill(ctx, W - 76, 31, 56, 30, T.css.primary);
    ctx.fillStyle = T.css.onPrimary;
    ctx.beginPath();
    ctx.arc(W - 35, 46, 11, 0, Math.PI * 2);
    ctx.fill();
  });
  const button = frontBlock(
    T,
    W,
    90,
    D,
    (ctx) => {
      pill(ctx, 18, 21, W - 36, 48, T.css.primary, 12);
      text(ctx, T, `${L.button ?? 'Ship it'}  →`, W / 2, 45, 17, 700, T.css.onPrimary, 'center');
    },
    T.primary,
  );
  const shadow = groundShadow(T, D, 440, 14, 0.16);
  root.add(shadow, foot, input, toggle, button);
  const stem = [input, toggle, button];
  const left = -440 / 2 + W / 2;

  return {
    root,
    settle: 2.4,
    update(t, s) {
      // Blocks drop in one by one, then the stack breathes; spread pulls them apart.
      const drop = (i: number) => (1 - ease.outBack(span(t, 0.15 + i * 0.22, 0.75 + i * 0.22, (x) => x))) * 320;
      foot.position.set(s * 34, drop(0), 0);
      stem.forEach((b, i) => {
        const breathe = Math.sin(t * 1.4 + i * 0.8) * 2 * (t > 2 ? 1 : 0);
        b.position.set(left, 104 + i * 90 + drop(i + 1) + s * 26 * (i + 1) + breathe * (i + 1) * 0.6, 0);
      });
      shadow.position.x = s * 17;
    },
  };
}

// ───────────── Component cards ─────────────
// Tall compositions for portrait cards: parts float in layers above their shadows.

function withShadow(T: Tokens, root: THREE.Group, w: number, d: number, r: number) {
  const sh = groundShadow(T, w, d, r);
  root.add(sh);
  return sh;
}

const bob = (t: number, i = 0, amp = 4) => Math.sin(t * 1.6 + i * 1.3) * amp;

function cursor(T: Tokens) {
  // The arrow pointer, lying flat and lifted, like a cursor hovering over the plane.
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(0, -44);
  s.lineTo(11, -34);
  s.lineTo(19, -52);
  s.lineTo(27, -48);
  s.lineTo(19, -31);
  s.lineTo(33, -31);
  s.closePath();
  return block(T, { shape: s, h: 6, top: T.face });
}

function button(T: Tokens, L: IsoLabels): Built {
  const root = new THREE.Group();
  const w = 190;
  const d = 70;
  const sh = withShadow(T, root, w, d, 16);
  const b = block(T, { w, d, h: 18, r: 16, top: T.primary, tinted: true });
  b.add(decal(w, d, (ctx) => text(ctx, T, `${L.button ?? 'Ship it'}  →`, w / 2, d / 2, 22, 700, T.css.onPrimary, 'center'), 18));
  const ptr = cursor(T);
  root.add(b, ptr);
  return {
    root,
    settle: 0.5,
    update(t) {
      const k = t % 2.8;
      const down = span(k, 1.0, 1.3) - span(k, 1.55, 1.9);
      const press = span(k, 1.25, 1.35) - span(k, 1.5, 1.65);
      b.position.y = 46 + bob(t) * (1 - down) - 12 * press;
      at(ptr, 30, 4, 150 - 70 * down + bob(t, 1));
      (sh.material as THREE.MeshBasicMaterial).opacity = 0.8 + press * 0.2;
    },
  };
}

function toggle(T: Tokens): Built {
  const root = new THREE.Group();
  const w = 170;
  const d = 72;
  withShadow(T, root, w, d, 36);
  const rows = [0, 1].map(() => {
    const g = new THREE.Group();
    const track = block(T, { w, d, h: 12, r: 36, top: T.faceAlt });
    const onMat = new THREE.MeshBasicMaterial({ map: paintTexture(w, d, (ctx) => pill(ctx, 0, 0, w, d, T.css.primary)), transparent: true, depthWrite: false });
    const onGeo = new THREE.PlaneGeometry(w, d);
    onGeo.rotateX(-Math.PI / 2);
    onGeo.rotateY(Math.PI / 2);
    const on = new THREE.Mesh(onGeo, onMat);
    on.position.y = 12.3;
    on.renderOrder = 2;
    const knob = block(T, { shape: roundedRect(52, 52, 26), h: 16, w: 52, d: 52 });
    g.add(track, on, knob);
    root.add(g);
    return { g, knob, onMat };
  });
  return {
    root,
    settle: 1.4,
    update(t) {
      const k = t % 4;
      rows.forEach(({ g, knob, onMat }, i) => {
        // The two switches take turns.
        const x = i === 0 ? span(k, 0.5, 0.9) - span(k, 2.5, 2.9) : 1 - span(k, 0.5, 0.9) + span(k, 2.5, 2.9);
        at(knob, -46 + 92 * x, 0, 12);
        onMat.opacity = x;
        g.position.y = 30 + i * 96 + bob(t, i);
      });
    },
  };
}

function otp(T: Tokens): Built {
  const root = new THREE.Group();
  const digits = '202611';
  const cw = 48;
  const cd = 60;
  const gap = 10;
  const groupW = 3 * cw + 2 * gap;
  withShadow(T, root, groupW, cd, 10);
  const cells = Array.from(digits, (ch, i) => {
    const cell = block(T, { w: cw, d: cd, h: 10, r: 10 });
    const digit = decal(cw, cd, (ctx) => text(ctx, T, ch, cw / 2, cd / 2 + 1, 30, 700, T.css.text, 'center'), 10);
    const ring = decal(cw, cd, (ctx) => {
      ctx.lineWidth = 3;
      ctx.strokeStyle = T.css.primary;
      ctx.beginPath();
      ctx.roundRect(1.5, 1.5, cw - 3, cd - 3, 9);
      ctx.stroke();
    }, 10.2);
    cell.add(digit, ring);
    root.add(cell);
    return { cell, digit, ring };
  });
  return {
    root,
    settle: 3.6,
    update(t) {
      const k = t % 6;
      cells.forEach(({ cell, digit, ring }, i) => {
        const a = 0.5 + i * 0.4;
        const shown = span(k, a, a + 0.25, ease.outBack) * (1 - span(k, 5.2, 5.6));
        digit.scale.setScalar(Math.max(0.001, shown));
        digit.position.y = 10.4 + (1 - shown) * 14;
        (ring.material as THREE.MeshBasicMaterial).opacity = k > a - 0.4 && k < a + 0.1 ? 1 : 0;
        const dip = 4 * Math.max(0, Math.sin(Math.PI * span(k, a, a + 0.25, (x) => x)));
        // 3 + 3: the second group floats a layer above the first.
        const layer = i < 3 ? 0 : 1;
        at(cell, -groupW / 2 + cw / 2 + (i % 3) * (cw + gap), 0, 24 + layer * 84 + bob(t, layer) - dip);
      });
    },
  };
}

function bars(T: Tokens): Built {
  const root = new THREE.Group();
  const w = 200;
  const d = 110;
  withShadow(T, root, w, d, 14);
  const base = block(T, { w, d, h: 8, r: 14 });
  base.add(
    decal(w, d, (ctx) => {
      ctx.strokeStyle = T.css.line;
      ctx.lineWidth = 1.5;
      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(14, (d / 4) * i);
        ctx.lineTo(w - 14, (d / 4) * i);
        ctx.stroke();
      }
    }, 8),
  );
  root.add(base);
  const values = [60, 96, 74, 130, 168];
  const cols = values.map((v, i) => {
    const b = block(T, { w: 28, d: 28, h: 1, r: 6, top: T.chart[i % 3]!, tinted: true });
    at(b, -w / 2 + 30 + i * 35, 6, 8);
    root.add(b);
    return { b, v };
  });
  return {
    root,
    settle: 3,
    update(t) {
      const k = t % 6;
      cols.forEach(({ b, v }, i) => {
        const g = span(k, 0.3 + i * 0.14, 1.1 + i * 0.14, ease.outBack) * (1 - span(k, 5, 5.6));
        b.scale.y = Math.max(0.01, v * g);
      });
    },
  };
}

function donut(T: Tokens): Built {
  const root = new THREE.Group();
  const spin = new THREE.Group();
  root.add(groundShadow(T, 190, 190, 95));
  root.add(spin);
  const values = [40, 25, 20, 15];
  const heights = [70, 50, 36, 24];
  let a = Math.PI / 2;
  const gapA = 0.035;
  const segs = values.map((v, i) => {
    const sweep = (v / 100) * Math.PI * 2;
    const seg = block(T, { shape: ringSector(54, 92, a + gapA, a + sweep - gapA), h: 1, top: T.chart[i]!, tinted: true });
    a += sweep;
    spin.add(seg);
    return seg;
  });
  const hub = block(T, { shape: roundedRect(84, 84, 42), w: 84, d: 84, h: 10 });
  hub.add(decal(84, 84, (ctx) => text(ctx, T, '48', 42, 43, 26, 700, T.css.text, 'center'), 10));
  root.add(hub);
  return {
    root,
    settle: 2.8,
    update(t) {
      const k = t % 7;
      segs.forEach((s, i) => {
        const g = span(k, 0.3 + i * 0.25, 1.1 + i * 0.25, ease.outBack) * (1 - span(k, 6.1, 6.7));
        s.scale.y = Math.max(0.01, 10 + heights[i]! * g);
      });
      spin.rotation.y = t * 0.25;
      hub.position.y = 96 + bob(t);
    },
  };
}

function toast(T: Tokens, L: IsoLabels): Built {
  const root = new THREE.Group();
  const w = 230;
  const d = 82;
  withShadow(T, root, w, d, 16);
  const lines = [
    [L.toast ?? 'Deployed', 'ui.ladom.co · 12s', T.css.success],
    [L.build ?? 'Build passed', L.buildNote ?? '44 components', T.css.primary],
    [L.sync ?? 'Tokens synced', 'Figma → React', T.css.warning],
  ] as const;
  const cards = lines.map(([title, note, color]) => {
    const card = block(T, { w, d, h: 12, r: 16 });
    card.add(
      decal(w, d, (ctx) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(34, d / 2, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(27, d / 2);
        ctx.lineTo(32, d / 2 + 5);
        ctx.lineTo(41, d / 2 - 5);
        ctx.stroke();
        text(ctx, T, title, 62, d / 2 - 10, 17, 700);
        text(ctx, T, note, 62, d / 2 + 13, 13, 500, T.css.muted);
      }, 12),
    );
    root.add(card);
    return card;
  });
  return {
    root,
    settle: 1.5,
    update(t) {
      // A stack of toasts: the newest drops onto the top, the stack settles and lifts again.
      const k = t % 4.5;
      const inn = ease.outBack(span(k, 0.2, 0.9, (x) => x));
      const out = span(k, 3.6, 4.2);
      cards.forEach((c, i) => {
        const level = 2 - i;
        const y = 20 + level * 64 + bob(t, i, 3);
        c.position.y = i === 0 ? y + (1 - inn) * 150 + out * 150 : y;
        c.visible = i !== 0 || k < 4.3;
      });
    },
  };
}

export const SCENES = { hero, button, toggle, otp, bars, donut, toast } satisfies Record<string, (T: Tokens, L: IsoLabels) => Built>;
export type SceneName = keyof typeof SCENES;
