import type { ReactNode } from 'react';
import { Bar, Box, DARK, Disc, FILL, INK, Label, Shadow, SIDE } from './iso';

// Small iconographic drawings for the "Why Ladom UI" cards, in the language of the component
// illustrations (iso.tsx) but with one or two shapes each. Same order as `features` in i18n.ts.

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="100 90 170 150" fill="none" aria-hidden>
      {children}
    </svg>
  );
}

// A four-pointed sparkle, drawn flat on a block's top face.
const Sparkle = ({ cx, cy, r, fill = INK }: { cx: number; cy: number; r: number; fill?: string }) => {
  const k = r * 0.22;
  return (
    <path
      d={`M${cx} ${cy - r}Q${cx + k} ${cy - k} ${cx + r} ${cy}Q${cx + k} ${cy + k} ${cx} ${cy + r}Q${cx - k} ${cy + k} ${cx - r} ${cy}Q${cx - k} ${cy - k} ${cx} ${cy - r}Z`}
      fill={fill}
    />
  );
};

// Built for AI: a key with the sparkle.
const Ai = () => (
  <Glyph>
    <Shadow x={-40} y={-40} w={80} d={80} r={16} />
    <Box x={-40} y={-40} w={80} d={80} h={16} r={16}>
      <Sparkle cx={40} cy={40} r={14} fill={SIDE} />
    </Box>
    {/* Upright, floating over the key. */}
    <Sparkle cx={185} cy={118} r={20} />
  </Glyph>
);

// Consistent by default: three equal plates on one scale.
const Consistent = () => (
  <Glyph>
    <Shadow x={-42} y={-42} w={84} d={84} r={10} />
    <Box x={-42} y={-42} w={84} d={84} h={8} r={10} />
    <Box x={-42} y={-42} w={84} d={84} h={8} z={14} r={10} />
    <Box x={-42} y={-42} w={84} d={84} h={8} z={28} r={10} />
  </Glyph>
);

// Copy it, own it: a file and its copy lifted in front of it.
const Copy = () => (
  <Glyph>
    <Shadow x={-50} y={-30} w={64} d={80} r={8} />
    <Box x={-50} y={-30} w={64} d={80} h={6} r={8} top={FILL} />
    <g>
      <Box x={-10} y={-50} w={64} d={80} h={6} z={18} r={8}>
        <Bar x={12} y={16} w={40} />
        <Bar x={12} y={32} w={28} />
        <Bar x={12} y={48} w={34} />
      </Box>
    </g>
  </Glyph>
);

// Built for real products: a table with a header row.
const Products = () => (
  <Glyph>
    <Shadow x={-50} y={-45} w={100} d={90} r={8} />
    <Box x={-50} y={-45} w={100} d={90} h={10} r={8}>
      <rect x={0} y={0} width={100} height={22} rx={8} fill={FILL} />
      {[22, 45, 68].map((y) => (
        <line key={y} x1={0} x2={100} y1={y} y2={y} stroke={INK} />
      ))}
      <line x1={38} x2={38} y1={0} y2={90} stroke={INK} />
    </Box>
  </Glyph>
);

// No Tailwind required: plain CSS braces.
const Css = () => (
  <Glyph>
    <Shadow x={-45} y={-35} w={90} d={70} r={14} />
    <Box x={-45} y={-35} w={90} d={70} h={14} r={14}>
      <Label x={45} y={33} size={46}>
        {'{ }'}
      </Label>
    </Box>
  </Glyph>
);

// A finished look: a light and a dark theme, side by side.
const Look = () => (
  <Glyph>
    <Shadow x={-58} y={-28} w={56} d={56} r={28} />
    <Shadow x={2} y={-28} w={56} d={56} r={28} />
    <Disc cx={-30} cy={0} r={28} h={14} />
    <Disc cx={30} cy={0} r={28} h={14} top={INK} side={DARK} />
  </Glyph>
);

export const FEATURE_ART = [Ai, Consistent, Copy, Products, Css, Look];
