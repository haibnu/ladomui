import type { ReactNode } from 'react';
import { IconDateRange, IconSearch, IconSetting } from '@ladom/icons';
import { Art, Bar, Box, DARK, Disc, FILL, INK, Label, Plane, Shadow, SIDE } from './iso';

// Illustrations for the docs pages that are not components (foundations, getting started), in the
// style of the component drawings. Keyed by the last part of the docs path. The a-* classes move them.

const Icon = ({ x, y, children }: { x: number; y: number; children: ReactNode }) => (
  <g transform={`translate(${x} ${y})`} style={{ color: '#1C1A09' }}>
    {children}
  </g>
);

// Colors: a row of swatch blocks, from white to ink.
const Colors = () => (
  <Art>
    <Shadow x={-110} y={-30} w={220} d={60} r={8} />
    {[
      ['#fff', SIDE],
      [FILL, SIDE],
      [SIDE, DARK],
      [DARK, '#7A7A7A'],
      [INK, '#333'],
    ].map(([top, side], i) => (
      <g key={i} className="a-coin1" style={{ animationDelay: `${i * 0.12}s` }}>
        <Box x={-110 + i * 44} y={-30} w={40} d={60} h={18 + i * 6} r={6} top={top} side={side} />
      </g>
    ))}
  </Art>
);

// Typography: a type specimen block.
const Typography = () => (
  <Art>
    <Shadow x={-80} y={-60} w={160} d={120} r={14} />
    <Box x={-80} y={-60} w={160} d={120} h={16} r={14}>
      <Label x={60} y={52} size={64}>
        Aa
      </Label>
      <Bar x={22} y={92} w={70} />
      <Bar x={98} y={92} w={36} />
    </Box>
  </Art>
);

// Spacing: two blocks held apart by a measured gap.
const Spacing = () => (
  <Art>
    <Shadow x={-110} y={-40} w={80} d={80} r={10} />
    <Shadow x={30} y={-40} w={80} d={80} r={10} />
    <Box x={-110} y={-40} w={80} d={80} h={30} r={10} />
    <g className="a-float">
      <Box x={30} y={-40} w={80} d={80} h={30} r={10} />
    </g>
    <Plane>
      <path d="M-26 0H26M-26 -8V8M26 -8V8" stroke={INK} strokeWidth={1.5} />
    </Plane>
  </Art>
);

// Radius: the same block with growing corners.
const Radius = () => (
  <Art>
    {[0, 14, 32].map((r, i) => (
      <g key={r}>
        <Shadow x={-110 + i * 76} y={-32} w={64} d={64} r={r} />
        <Box x={-110 + i * 76} y={-32} w={64} d={64} h={22} r={r} />
      </g>
    ))}
  </Art>
);

// Sizes: three keys, small to large.
const Sizes = () => (
  <Art>
    {[
      [-110, 40, 14],
      [-56, 60, 20],
      [18, 88, 28],
    ].map(([x, s, h]) => (
      <g key={x}>
        <Shadow x={x!} y={-s! / 2} w={s!} d={s!} r={8} />
        <Box x={x!} y={-s! / 2} w={s!} d={s!} h={h!} r={8} />
      </g>
    ))}
  </Art>
);

// Grid: a page slab with column bars.
const Grid = () => (
  <Art>
    <Shadow x={-110} y={-70} w={220} d={140} r={10} />
    <Box x={-110} y={-70} w={220} d={140} h={10} r={10}>
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={14 + i * 33} y={14} width={27} height={112} rx={4} fill={FILL} stroke={SIDE} />
      ))}
    </Box>
  </Art>
);

// Border: a plate with a dashed outline and a solid one.
const Border = () => (
  <Art>
    <Shadow x={-90} y={-60} w={180} d={120} r={16} />
    <Box x={-90} y={-60} w={180} d={120} h={12} r={16}>
      <rect x={16} y={16} width={148} height={88} rx={10} stroke={INK} strokeWidth={2} />
      <rect x={32} y={32} width={116} height={56} rx={6} stroke={DARK} strokeDasharray="6 5" />
    </Box>
  </Art>
);

// Depth: a block floating over its shadow.
const Depth = () => (
  <Art>
    <g className="a-floatshadow">
      <Shadow x={-60} y={-60} w={120} d={120} r={16} className="" />
    </g>
    <g className="a-float">
      <Box x={-60} y={-60} w={120} d={120} h={18} z={34} r={16} />
    </g>
  </Art>
);

// Animation: a disc hopping across three spots.
const Animation = () => (
  <Art>
    <Shadow x={-110} y={-30} w={220} d={60} r={30} />
    <Box x={-110} y={-30} w={220} d={60} h={10} r={30} top={FILL} />
    <g className="a-hop">
      <Disc cx={-80} cy={0} r={20} z={10} h={14} top={DARK} side={INK} />
    </g>
  </Art>
);

// Icons: three keys with an icon each.
const Icons = () => (
  <Art>
    {[IconSearch, IconDateRange, IconSetting].map((I, i) => (
      <g key={i} className="a-coin1" style={{ animationDelay: `${i * 0.2}s` }}>
        <Shadow x={-100 + i * 70} y={-28} w={56} d={56} r={12} />
        <Box x={-100 + i * 70} y={-28} w={56} d={56} h={18} r={12}>
          <Icon x={16} y={16}>
            <I size={24} />
          </Icon>
        </Box>
      </g>
    ))}
  </Art>
);

// Introduction: a key with the Ladom sparkle.
const Introduction = () => (
  <Art>
    <Shadow x={-55} y={-55} w={110} d={110} r={20} />
    <Box x={-55} y={-55} w={110} d={110} h={22} r={20}>
      <Label x={55} y={55} size={40}>
        UI
      </Label>
    </Box>
    <g className="a-float">
      <path d="M185 70Q189 92 210 96Q189 100 185 122Q181 100 160 96Q181 92 185 70Z" fill={INK} />
    </g>
  </Art>
);

// Installation: a terminal block with the command.
const Installation = () => (
  <Art>
    <Shadow x={-110} y={-45} w={220} d={90} r={12} />
    <Box x={-110} y={-45} w={220} d={90} h={14} r={12} top={INK} side="#333">
      <circle cx={18} cy={16} r={4} fill={DARK} />
      <circle cx={32} cy={16} r={4} fill={DARK} />
      <circle cx={46} cy={16} r={4} fill={DARK} />
      <text x={18} y={56} fontSize={18} fontWeight={700} fill="#fff" fontFamily="ui-monospace, monospace">
        $ npx ladom-ui
      </text>
      <rect className="a-blink" x={174} y={44} width={10} height={18} fill="#fff" />
    </Box>
  </Art>
);

// License: a document with a seal.
const License = () => (
  <Art>
    <Shadow x={-70} y={-85} w={140} d={170} r={10} />
    <Box x={-70} y={-85} w={140} d={170} h={8} r={10}>
      <Bar x={20} y={24} w={80} h={10} />
      <Bar x={20} y={48} w={100} />
      <Bar x={20} y={64} w={92} />
      <Bar x={20} y={80} w={100} />
      <Bar x={20} y={96} w={60} />
    </Box>
    <g className="a-pop">
      <Disc cx={40} cy={50} r={24} z={8} h={8} top={DARK} side={INK} />
    </g>
  </Art>
);

export const DOC_ART: Record<string, () => ReactNode> = {
  color: Colors,
  typography: Typography,
  space: Spacing,
  radius: Radius,
  size: Sizes,
  grid: Grid,
  border: Border,
  shadow: Depth,
  motion: Animation,
  icons: Icons,
  introduction: Introduction,
  installation: Installation,
  license: License,
};
