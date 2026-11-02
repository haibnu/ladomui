import type { ReactNode } from 'react';

// Isometric drawing in the language of the Figma illustrations: white tops, #CCCCCC sides,
// #4D4D4D one-pixel lines, a soft shadow on the ground. Plane x runs up-right, plane y runs
// down-right, z is height. Shapes are drawn on a 370 x 340 card centred on the plane origin.

export const INK = '#4D4D4D';
export const SIDE = '#CCCCCC';
export const DARK = '#999999';
export const FILL = '#EFEEEC';
const O = { x: 185, y: 185 };
const C = Math.cos(Math.PI / 6);

const n = (v: number) => Math.round(v * 100) / 100;
export const project = (x: number, y: number, z = 0) => [n(O.x + C * (x + y)), n(O.y + 0.5 * (y - x) - z)] as const;
// Draws children laid flat on the plane at height z, with their origin at plane (x, y).
export const planeMatrix = (x: number, y: number, z: number) => {
  const [e, f] = project(x, y, z);
  return `matrix(${n(C)} -0.5 ${n(C)} 0.5 ${e} ${f})`;
};

function outline(x: number, y: number, w: number, d: number, r: number) {
  r = Math.min(r, w / 2, d / 2);
  const pts: [number, number][] = [];
  const arc = (cx: number, cy: number, from: number) => {
    const steps = r > 0 ? 8 : 0;
    for (let i = 0; i <= steps; i++) {
      const a = from + (Math.PI / 2) * (i / (steps || 1));
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
      if (!steps) break;
    }
  };
  arc(x + w - r, y + r, -Math.PI / 2);
  arc(x + w - r, y + d - r, 0);
  arc(x + r, y + d - r, Math.PI / 2);
  arc(x + r, y + r, Math.PI);
  // A circle has no straight sides; drop the repeated points so every edge has a direction.
  return pts.filter(([a, b], i) => {
    const [c, d2] = pts[(i + 1) % pts.length]!;
    return Math.hypot(a - c, b - d2) > 1e-6;
  });
}

const path = (pts: readonly (readonly [number, number])[], close = true) =>
  pts.map(([a, b], i) => `${i ? 'L' : 'M'}${a} ${b}`).join('') + (close ? 'Z' : '');

type BoxProps = {
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  z?: number;
  r?: number;
  top?: string;
  side?: string;
  className?: string;
  children?: ReactNode;
};

// A rounded block on the plane; children are drawn on its top face, origin at its corner.
export function Box({ x, y, w, d, h, z = 0, r = 4, top = '#fff', side = SIDE, className, children }: BoxProps) {
  const pts = outline(x, y, w, d, r);
  const visible = pts.map((p, i) => {
    const q = pts[(i + 1) % pts.length]!;
    const nx = q[1] - p[1];
    const ny = -(q[0] - p[0]);
    return ny - nx > 1e-6;
  });
  // The visible faces form one run along the outline; rotate it to start at index 0.
  const start = visible.findIndex((v, i) => v && !visible[(i - 1 + visible.length) % visible.length]);
  const run: [number, number][] = [];
  for (let k = 0; k <= pts.length; k++) {
    const i = (start + k) % pts.length;
    run.push(pts[i]!);
    if (!visible[i]) break;
  }
  const topRun = run.map(([a, b]) => project(a, b, z + h));
  const bottomRun = run.map(([a, b]) => project(a, b, z));
  const sideFace = path([...topRun, ...bottomRun.reverse()]);
  bottomRun.reverse();
  const lines = `M${topRun[0]!.join(' ')}L${bottomRun.map((p) => p.join(' ')).join('L')}L${topRun[topRun.length - 1]!.join(' ')}`;
  return (
    <g className={className}>
      {h > 0 && <path d={sideFace} fill={side} stroke={side} strokeWidth={0.5} />}
      {h > 0 && <path d={lines} stroke={INK} strokeLinejoin="round" />}
      <path d={path(pts.map(([a, b]) => project(a, b, z + h)))} fill={top} stroke={INK} strokeLinejoin="round" />
      {children && <g transform={planeMatrix(x, y, z + h)}>{children}</g>}
    </g>
  );
}

export function Disc({ cx, cy, r, ...rest }: Omit<BoxProps, 'x' | 'y' | 'w' | 'd'> & { cx: number; cy: number; r: number }) {
  return <Box x={cx - r} y={cy - r} w={2 * r} d={2 * r} {...rest} r={r} />;
}

// The soft ground shadow, a little in front of the shape.
export function Shadow({ x, y, w, d, r = 4, className }: { x: number; y: number; w: number; d: number; r?: number; className?: string }) {
  const pts = outline(x + 4, y + 10, w + 8, d + 6, r);
  return <path className={className ?? 'a-shadow'} d={path(pts.map(([a, b]) => project(a, b)))} fill={INK} stroke={INK} opacity={0.1} />;
}

// Flat content on the plane (lines, text, icons) without a block under it.
export function Plane({ x = 0, y = 0, z = 0, className, children }: { x?: number; y?: number; z?: number; className?: string; children: ReactNode }) {
  return (
    <g transform={planeMatrix(x, y, z)}>
      <g className={className}>{children}</g>
    </g>
  );
}

// A placeholder line of text, as the Figma cells and modals draw it.
export const Bar = ({ x, y, w, h = 8, fill = SIDE, className }: { x: number; y: number; w: number; h?: number; fill?: string; className?: string }) => (
  <rect className={className} x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} />
);

// Small caps label as on the Figma Button and Select blocks.
export const Label = ({ x, y, size = 14, children, anchor = 'middle' }: { x: number; y: number; size?: number; children: ReactNode; anchor?: 'start' | 'middle' | 'end' }) => (
  <text x={x} y={y} fontSize={size} fontWeight={800} letterSpacing={size * 0.04} fill="#1C1A09" textAnchor={anchor} dominantBaseline="central" fontFamily="var(--font-jakarta), sans-serif">
    {children}
  </text>
);

export function Art({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <svg viewBox="0 0 370 340" fill="none" role={label ? 'img' : undefined} aria-hidden={label ? undefined : true} aria-label={label}>
      {children}
    </svg>
  );
}
