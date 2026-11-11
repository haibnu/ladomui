import type { ReactNode } from 'react';
import { IconAdd, IconCheck, IconClose, IconFolder, IconInfo, IconRemove, IconSearch, IconSuccess, IconFileUpload, IconArrowBottom } from '@ladom/icons';
import { Art, Bar, Box, DARK, Disc, FILL, INK, Label, Plane, Shadow, SIDE } from './iso';

// Illustrations for the components the Figma file has no drawing for, in the same style.
// The a-* classes move them; see landing.module.css.

const Icon = ({ x, y, children }: { x: number; y: number; children: ReactNode }) => (
  <g transform={`translate(${x} ${y})`} style={{ color: '#1C1A09' }}>
    {children}
  </g>
);

const Switch = () => (
  <Art>
    <Shadow x={-75} y={-30} w={150} d={60} r={30} />
    <Box x={-75} y={-30} w={150} d={60} h={14} r={30} />
    <Box className="a-on" x={-75} y={-30} w={150} d={60} h={0} z={14} r={30} top={DARK} />
    <g className="a-knob">
      <Disc cx={-45} cy={0} r={24} z={14} h={12} />
    </g>
  </Art>
);

const Alert = () => (
  <Art>
    <g className="a-drop">
      <Shadow x={-115} y={-35} w={230} d={70} r={12} />
      <Box x={-115} y={-35} w={230} d={70} h={10} r={12}>
        <circle cx={36} cy={35} r={17} fill={FILL} stroke={INK} />
        <Icon x={24} y={23}>
          <IconInfo size={24} />
        </Icon>
        <Bar x={68} y={22} w={110} h={10} />
        <Bar x={68} y={40} w={80} />
        <Icon x={198} y={14}>
          <IconClose size={16} />
        </Icon>
      </Box>
    </g>
  </Art>
);

const Badge = () => (
  <Art>
    <Shadow x={-80} y={-40} w={160} d={80} r={10} />
    <Box x={-80} y={-40} w={160} d={80} h={26} r={10}>
      <Label x={70} y={40}>
        INBOX
      </Label>
    </Box>
    <g className="a-pop">
      <Disc cx={64} cy={-30} r={20} z={26} h={8} top={DARK}>
        <text x={20} y={21} fontSize={16} fontWeight={800} fill="#fff" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-jakarta), sans-serif">
          3
        </text>
      </Disc>
    </g>
  </Art>
);

const Breadcrumb = () => (
  <Art>
    {[-120, -30, 60].map((x, i) => (
      <g key={x}>
        <Shadow x={x} y={-20} w={60} d={40} r={8} />
        <g className={`a-step a-step${i + 1}`}>
          <Box x={x} y={-20} w={60} d={40} h={10} r={8} top={i === 2 ? DARK : '#fff'}>
            <Bar x={14} y={16} w={32} fill={i === 2 ? '#fff' : SIDE} />
          </Box>
        </g>
      </g>
    ))}
    {[-52, 38].map((x) => (
      <Plane key={x} x={x} y={0}>
        <path d="M-4 -7L4 0L-4 7" stroke={INK} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </Plane>
    ))}
  </Art>
);

const Chips = () => (
  <Art>
    {[-145, -48, 49].map((x, i) => (
      <g key={x} className={i === 1 ? 'a-remove' : undefined}>
        <Shadow x={x} y={-18} w={92} d={36} r={18} />
        <Box x={x} y={-18} w={92} d={36} h={8} r={18}>
          <Bar x={16} y={14} w={44} />
          <Icon x={66} y={11}>
            <IconClose size={14} />
          </Icon>
        </Box>
      </g>
    ))}
  </Art>
);

const DatePicker = () => (
  <Art>
    <Shadow x={-100} y={-85} w={200} d={170} r={12} />
    <Box x={-100} y={-85} w={200} d={170} h={10} r={12}>
      <Bar x={18} y={16} w={70} h={10} />
      {Array.from({ length: 35 }, (_, i) => (
        <rect key={i} x={18 + (i % 7) * 24} y={42 + Math.floor(i / 7) * 24} width={14} height={14} rx={4} fill={FILL} stroke={SIDE} />
      ))}
    </Box>
    <g className="a-hop">
      <Box x={-29} y={-6} w={20} d={20} h={10} z={10} r={5} top={DARK} />
    </g>
  </Art>
);

const Dropdown = () => (
  <Art>
    <Shadow x={-90} y={-100} w={150} d={46} r={8} />
    <Box x={-90} y={-100} w={150} d={46} h={16} r={8}>
      <Bar x={16} y={19} w={70} />
      <Icon x={118} y={15}>
        <IconArrowBottom size={16} />
      </Icon>
    </Box>
    <g className="a-unfold">
      <Shadow x={-90} y={-36} w={150} d={130} r={10} />
      <Box x={-90} y={-36} w={150} d={130} h={6} z={14} r={10}>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            {i === 1 && <rect x={6} y={8 + i * 29} width={138} height={26} rx={6} fill={FILL} />}
            <circle cx={22} cy={21 + i * 29} r={6} fill={SIDE} />
            <Bar x={36} y={17 + i * 29} w={i % 2 ? 60 : 80} />
          </g>
        ))}
      </Box>
    </g>
  </Art>
);

const EmptyState = () => (
  <Art>
    <Box x={-95} y={-70} w={190} d={140} h={6} r={14} top={FILL}>
      <rect x={14} y={14} width={162} height={112} rx={10} stroke={INK} strokeDasharray="6 6" />
    </Box>
    <Shadow className="a-floatshadow" x={-35} y={-25} w={70} d={50} r={10} />
    <g className="a-float">
      <Box x={-35} y={-25} w={70} d={50} h={12} z={40} r={10}>
        <Icon x={23} y={13}>
          <IconFolder size={24} />
        </Icon>
      </Box>
    </g>
  </Art>
);

const Hint = () => (
  <Art>
    <Shadow x={-100} y={-60} w={200} d={48} r={8} />
    <Box x={-100} y={-60} w={200} d={48} h={14} r={8}>
      <Bar x={16} y={20} w={90} />
    </Box>
    <Plane className="a-fadein" x={-100} y={2}>
      <circle cx={10} cy={10} r={9} fill={DARK} />
      <text x={10} y={10.5} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-jakarta), sans-serif">
        i
      </text>
      <Bar x={26} y={6} w={120} />
    </Plane>
  </Art>
);

const Input = () => (
  <Art>
    <Shadow x={-110} y={-28} w={220} d={56} r={8} />
    <Box x={-110} y={-28} w={220} d={56} h={14} r={8}>
      <Icon x={14} y={18}>
        <IconSearch size={20} />
      </Icon>
      <Bar className="a-type" x={44} y={24} w={120} />
      <g className="a-caret">
        <rect className="a-blink" x={168} y={16} width={2} height={24} rx={1} fill={INK} />
      </g>
    </Box>
  </Art>
);

const ItemSelector = () => (
  <Art>
    {[-140, 10].map((x) => (
      <g key={x}>
        <Shadow x={x} y={-80} w={120} d={160} r={10} />
        <Box x={x} y={-80} w={120} d={160} h={8} r={10}>
          {[0, 1, 2].map((i) => (
            <Bar key={i} x={16} y={86 + i * 24} w={x < 0 ? 70 : 60} />
          ))}
        </Box>
      </g>
    ))}
    <g className="a-move">
      <Box x={-128} y={-66} w={96} d={26} h={8} z={8} r={6}>
        <Icon x={8} y={5}>
          <IconCheck size={16} />
        </Icon>
        <Bar x={30} y={9} w={50} />
      </Box>
    </g>
  </Art>
);

const LabelArt = () => (
  <Art>
    <Shadow className="a-floatshadow" x={-75} y={-28} w={150} d={56} r={8} />
    <g className="a-float">
      <Box x={-75} y={-28} w={150} d={56} h={10} z={14} r={8}>
        <circle cx={22} cy={28} r={6} stroke={INK} fill={FILL} />
        <Label x={86} y={28}>
          LABEL
        </Label>
      </Box>
    </g>
  </Art>
);

const Loader = () => (
  <Art>
    <Box x={-90} y={-90} w={180} d={180} h={6} r={90} top={FILL} />
    {Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return (
        <g key={i} className="a-blip" style={{ animationDelay: `${i * 0.15}s` }}>
          <Disc cx={Math.round(Math.cos(a) * 58)} cy={Math.round(Math.sin(a) * 58)} r={12} z={6} h={10} />
        </g>
      );
    })}
  </Art>
);

const GsmInput = () => (
  <Art>
    <Shadow x={-130} y={-30} w={260} d={60} r={8} />
    <Box x={-130} y={-30} w={260} d={60} h={14} r={8}>
      <g className="a-num1">
        <Label x={76} y={30} size={18} anchor="start">
          +90 0532 123 45 67
        </Label>
      </g>
      <g className="a-num2">
        <Label x={76} y={30} size={18} anchor="start">
          90 (532) 123 45 67
        </Label>
      </g>
    </Box>
    <g className="a-tap">
      {/* The Turkish flag in the illustrations' black and white. */}
      <Box x={-112} y={-14} w={36} d={28} h={6} z={14} r={3} top={INK} side={DARK}>
        <circle cx={14} cy={14} r={7} fill="#fff" />
        <circle cx={15.8} cy={14} r={5.6} fill={INK} />
        <path d="M23.5 11.2l.66 2.04h2.14l-1.73 1.26.66 2.04-1.73-1.26-1.73 1.26.66-2.04-1.73-1.26h2.14z" fill="#fff" />
      </Box>
    </g>
  </Art>
);

const CurrencyInput = () => (
  <Art>
    <Shadow x={-120} y={-30} w={240} d={60} r={8} />
    <Box x={-120} y={-30} w={240} d={60} h={14} r={8}>
      <Label x={28} y={30} size={20}>
        $
      </Label>
      <g className="a-num1">
        <Label x={96} y={30} size={20}>
          1,250
        </Label>
      </g>
      <g className="a-num2">
        <Label x={96} y={30} size={20}>
          1,250.00
        </Label>
      </g>
    </Box>
    <g className="a-tap">
      <Box x={44} y={-20} w={64} d={40} h={8} z={14} r={8}>
        <Label x={24} y={20} size={14}>
          USD
        </Label>
        <Icon x={42} y={12}>
          <IconArrowBottom size={16} />
        </Icon>
      </Box>
    </g>
  </Art>
);

const ColorInput = () => (
  <Art>
    <Shadow x={-110} y={-30} w={220} d={60} r={8} />
    <Box x={-110} y={-30} w={220} d={60} h={14} r={8}>
      <g className="a-num1">
        <Label x={66} y={30} size={18} anchor="start">
          # 4F46E5
        </Label>
      </g>
      <g className="a-num2">
        <Label x={66} y={30} size={18} anchor="start">
          # 111827
        </Label>
      </g>
    </Box>
    <g className="a-tap">
      <Box x={-94} y={-15} w={30} d={30} h={8} z={14} r={6} top={DARK} />
    </g>
  </Art>
);

const NumberInput = () => (
  <Art>
    <Shadow x={-100} y={-30} w={200} d={60} r={8} />
    <Box x={-100} y={-30} w={200} d={60} h={14} r={8}>
      <Icon x={20} y={20}>
        <IconRemove size={20} />
      </Icon>
      <g className="a-num1">
        <Label x={100} y={30} size={20}>
          12
        </Label>
      </g>
      <g className="a-num2">
        <Label x={100} y={30} size={20}>
          13
        </Label>
      </g>
    </Box>
    <g className="a-tap">
      <Box x={48} y={-20} w={40} d={40} h={8} z={14} r={8}>
        <Icon x={10} y={10}>
          <IconAdd size={20} />
        </Icon>
      </Box>
    </g>
  </Art>
);

const Pagination = () => (
  <Art>
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <Shadow x={-122 + i * 50} y={-20} w={40} d={40} r={8} />
        <Box x={-122 + i * 50} y={-20} w={40} d={40} h={8} r={8}>
          <Label x={20} y={20} size={13}>
            {i + 1}
          </Label>
        </Box>
      </g>
    ))}
    <g className="a-page">
      <Box x={-122} y={-20} w={40} d={40} h={0} z={8} r={8} top="rgba(77, 77, 77, 0.35)" />
    </g>
  </Art>
);

const Popover = () => (
  <Art>
    <Shadow x={-60} y={40} w={120} d={46} r={8} />
    <Box x={-60} y={40} w={120} d={46} h={14} r={8}>
      <Bar x={20} y={19} w={80} />
    </Box>
    <g className="a-popover">
      <Shadow x={-85} y={-90} w={170} d={96} r={12} />
      <Box x={-85} y={-90} w={170} d={96} h={6} z={34} r={12}>
        <Bar x={18} y={20} w={90} h={10} />
        <Bar x={18} y={42} w={130} />
        <Bar x={18} y={58} w={100} />
      </Box>
    </g>
  </Art>
);

const Segment = () => (
  <Art>
    <Shadow x={-125} y={-26} w={250} d={52} r={14} />
    <Box x={-125} y={-26} w={250} d={52} h={8} r={14} top={FILL}>
      {[0, 1, 2].map((i) => (
        <Bar key={i} x={24 + i * 80} y={22} w={44} />
      ))}
    </Box>
    <g className="a-seg">
      <Box x={-120} y={-21} w={80} d={42} h={10} z={8} r={10}>
        <Bar x={18} y={17} w={44} fill={DARK} />
      </Box>
    </g>
  </Art>
);

const Stepper = () => (
  <Art>
    <Plane x={-100} y={0}>
      <line x1={0} y1={0} x2={200} y2={0} stroke={SIDE} strokeWidth={4} strokeLinecap="round" />
      <line className="a-grow" x1={0} y1={0} x2={200} y2={0} stroke={INK} strokeWidth={4} strokeLinecap="round" />
    </Plane>
    {[-100, 0, 100].map((x, i) => (
      <g key={x}>
        <Disc cx={x} cy={0} r={26} h={12} />
        <g className={`a-done a-done${i + 1}`}>
          <Disc cx={x} cy={0} r={26} z={12} h={0} top={DARK}>
            <Icon x={14} y={14}>
              <g style={{ color: '#fff' }}>
                <IconCheck size={24} />
              </g>
            </Icon>
          </Disc>
        </g>
      </g>
    ))}
  </Art>
);

const Table = () => (
  <Art>
    <Shadow x={-115} y={-85} w={230} d={170} r={10} />
    <Box x={-115} y={-85} w={230} d={170} h={8} r={10}>
      <rect className="a-scan" x={6} y={46} width={218} height={26} rx={6} fill={FILL} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <Bar x={18} y={55 + i * 30} w={50} />
          <Bar x={92} y={55 + i * 30} w={60} />
          <Bar x={176} y={55 + i * 30} w={34} />
          {i < 3 && <line x1={10} x2={220} y1={73 + i * 30} y2={73 + i * 30} stroke={FILL} />}
        </g>
      ))}
    </Box>
    <Box x={-115} y={-85} w={230} d={36} h={6} z={8} r={10} top={FILL}>
      <Bar x={18} y={14} w={40} fill={DARK} />
      <Bar x={92} y={14} w={50} fill={DARK} />
      <Bar x={176} y={14} w={30} fill={DARK} />
    </Box>
  </Art>
);

const Textarea = () => (
  <Art>
    <Shadow x={-110} y={-60} w={220} d={120} r={8} />
    <Box x={-110} y={-60} w={220} d={120} h={14} r={8}>
      <Bar className="a-line1" x={18} y={20} w={170} />
      <Bar className="a-line2" x={18} y={38} w={150} />
      <Bar className="a-line3" x={18} y={56} w={100} />
      <text x={204} y={104} fontSize={10} fontWeight={600} fill="#1C1A09" textAnchor="end" fontFamily="var(--font-jakarta), sans-serif">
        42/200
      </text>
    </Box>
  </Art>
);

const TimePicker = () => (
  <Art>
    <Shadow x={-80} y={-80} w={160} d={160} r={80} />
    <Disc cx={0} cy={0} r={80} h={14}>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <circle key={i} cx={80 + Math.cos(a) * 64} cy={80 + Math.sin(a) * 64} r={i % 3 ? 2 : 4} fill={i % 3 ? SIDE : INK} />;
      })}
      <g transform="translate(80 80)">
        <rect className="a-hour" x={-3} y={-36} width={6} height={36} rx={3} fill={INK} />
        <rect className="a-minute" x={-2} y={-56} width={4} height={56} rx={2} fill={DARK} />
        <circle r={6} fill="#fff" stroke={INK} />
      </g>
    </Disc>
  </Art>
);

const ScrollArea = () => (
  <Art>
    <Shadow x={-80} y={-90} w={160} d={180} r={12} />
    <Box x={-80} y={-90} w={160} d={180} h={14} r={12}>
      <defs>
        <clipPath id="art-scroll-clip">
          <rect x={6} y={8} width={148} height={164} rx={8} />
        </clipPath>
      </defs>
      <g clipPath="url(#art-scroll-clip)">
        <g className="a-scrollrows">
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i}>
              {i === 2 && <rect x={8} y={10 + i * 30} width={126} height={26} rx={6} fill={FILL} />}
              <circle cx={24} cy={23 + i * 30} r={6} fill={SIDE} />
              <Bar x={38} y={19 + i * 30} w={i % 3 ? 70 : 88} />
            </g>
          ))}
        </g>
      </g>
      <rect x={142} y={12} width={8} height={156} rx={4} fill={FILL} />
      <rect className="a-scrollthumb" x={143} y={14} width={6} height={60} rx={3} fill={DARK} />
    </Box>
  </Art>
);

const Toast = () => (
  <Art>
    <g className="a-toast">
      <Shadow x={-100} y={-28} w={200} d={56} r={12} />
      <Box x={-100} y={-28} w={200} d={56} h={10} r={12}>
        <Icon x={16} y={16}>
          <IconSuccess size={24} />
        </Icon>
        <Bar x={52} y={18} w={100} h={9} />
        <Bar x={52} y={32} w={70} h={6} />
      </Box>
    </g>
  </Art>
);

const Tooltip = () => (
  <Art>
    <Shadow x={-25} y={30} w={50} d={50} r={10} />
    <Box x={-25} y={30} w={50} d={50} h={14} r={10}>
      <Icon x={13} y={13}>
        <IconInfo size={24} />
      </Icon>
    </Box>
    <g className="a-popover">
      <Box x={-60} y={-60} w={120} d={42} h={6} z={40} r={10} top={DARK}>
        <Bar x={20} y={17} w={80} fill="#fff" />
      </Box>
    </g>
  </Art>
);

const Uploader = () => (
  <Art>
    <Box x={-100} y={-75} w={200} d={150} h={6} r={14} top={FILL}>
      <rect x={14} y={14} width={172} height={122} rx={10} stroke={INK} strokeDasharray="6 6" />
      <Bar x={30} y={118} w={140} h={6} fill={SIDE} />
      <Bar className="a-progress" x={30} y={118} w={140} h={6} fill={INK} />
    </Box>
    <g className="a-file">
      <Box x={-30} y={-40} w={60} d={76} h={4} z={6} r={4}>
        <Icon x={18} y={26}>
          <IconFileUpload size={24} />
        </Icon>
      </Box>
    </g>
  </Art>
);

const Accordion = () => (
  <Art>
    <Shadow x={-110} y={-95} w={220} d={40} r={8} />
    <Box x={-110} y={-95} w={220} d={40} h={10} r={8}>
      <Bar x={18} y={16} w={90} />
    </Box>
    <Shadow x={-110} y={-45} w={220} d={40} r={8} />
    <Box x={-110} y={-45} w={220} d={40} h={10} r={8}>
      <Bar x={18} y={16} w={110} />
      <g transform="translate(196 20)">
        <path className="a-flip" d="M-6 -3L0 3L6 -3" stroke={INK} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Box>
    <g className="a-panel">
      <Box x={-104} y={0} w={208} d={50} h={4} r={6} top={FILL}>
        <Bar x={14} y={14} w={150} />
        <Bar x={14} y={30} w={110} />
      </Box>
    </g>
    <g className="a-push">
      <Shadow x={-110} y={58} w={220} d={40} r={8} />
      <Box x={-110} y={58} w={220} d={40} h={10} r={8}>
        <Bar x={18} y={16} w={70} />
      </Box>
    </g>
  </Art>
);

const FileShare = () => (
  <Art>
    <Box x={-120} y={-85} w={240} d={170} h={6} r={14} top={FILL}>
      <Bar x={18} y={18} w={70} h={6} />
      <rect x={18} y={36} width={140} height={22} rx={8} fill="#FFFFFF" stroke={SIDE} />
      <rect x={166} y={36} width={56} height={22} rx={8} fill={INK} />
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(0 ${i * 36})`}>
          <circle cx={30} cy={96} r={11} fill={SIDE} />
          <Bar x={50} y={88} w={80} />
          <Bar x={50} y={102} w={56} h={6} />
          <rect x={170} y={88} width={52} height={18} rx={9} fill="#FFFFFF" stroke={SIDE} />
        </g>
      ))}
    </Box>
  </Art>
);

const Navigation = () => (
  <Art>
    <Box x={-130} y={-20} w={260} d={110} h={4} r={10} top={FILL} />
    <Shadow x={-130} y={-75} w={260} d={48} r={10} />
    <Box x={-130} y={-75} w={260} d={48} h={12} r={10}>
      <circle cx={26} cy={24} r={11} fill="#1C1A09" />
      {[0, 1, 2].map((i) => (
        <Bar key={i} x={70 + i * 56} y={20} w={40} />
      ))}
      <Bar className="a-navline" x={70} y={34} w={40} h={3} fill={INK} />
      <rect x={226} y={14} width={20} height={20} rx={10} fill={SIDE} />
    </Box>
  </Art>
);

const AppSidebar = () => (
  <Art>
    <Shadow x={-110} y={-110} w={60} d={220} r={10} />
    <Box x={-110} y={-110} w={60} d={220} h={10} r={10}>
      {[0, 1, 2, 3].map((i) => (
        <Bar key={i} x={22} y={40 + i * 44} w={16} />
      ))}
    </Box>
    <g className="a-tap">
      <Shadow x={-30} y={-110} w={140} d={220} r={10} />
      <Box x={-30} y={-110} w={140} d={220} h={10} r={10}>
        <Bar x={20} y={40} w={90} />
        <Bar x={36} y={76} w={70} fill={DARK} />
        <Bar x={36} y={104} w={60} />
        <Bar x={20} y={140} w={80} />
        <Bar x={20} y={176} w={96} />
      </Box>
    </g>
  </Art>
);

const NavMenu = () => (
  <Art>
    <Shadow x={-90} y={-110} w={180} d={220} r={10} />
    <Box x={-90} y={-110} w={180} d={220} h={10} r={10}>
      {[0, 1, 2, 3].map((i) => (
        <Bar key={i} x={52} y={40 + i * 44} w={i === 1 ? 80 : 96} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Bar key={`d${i}`} x={24} y={40 + i * 44} w={16} />
      ))}
    </Box>
    <g className="a-tap">
      <Box x={-78} y={-62} w={156} d={36} h={6} z={10} r={8} top={FILL}>
        <Bar x={40} y={18} w={70} fill={DARK} />
        <Bar x={12} y={18} w={16} fill={DARK} />
      </Box>
    </g>
  </Art>
);

const CardArt = () => (
  <Art>
    <Shadow x={-110} y={-80} w={220} d={160} r={12} />
    <Box x={-110} y={-80} w={220} d={160} h={10} r={12}>
      <Bar x={18} y={20} w={90} h={10} />
      <Bar x={18} y={38} w={120} h={6} />
      <line x1={12} x2={208} y1={62} y2={62} stroke={FILL} strokeWidth={2} />
      <Bar className="a-line1" x={18} y={80} w={170} />
      <Bar className="a-line2" x={18} y={98} w={140} />
      <Bar className="a-line3" x={18} y={116} w={100} />
    </Box>
    <g className="a-tap">
      <Box x={44} y={-66} w={52} d={24} h={6} z={10} r={7} top={DARK}>
        <Bar x={12} y={9} w={28} h={6} fill="#fff" />
      </Box>
    </g>
  </Art>
);

const StatCard = () => (
  <Art>
    <Shadow x={-95} y={-65} w={190} d={130} r={12} />
    <Box x={-95} y={-65} w={190} d={130} h={14} r={12}>
      <Bar x={18} y={20} w={70} />
      <circle cx={164} cy={24} r={10} fill={FILL} stroke={SIDE} />
      <g className="a-num1">
        <Label x={18} y={64} size={30} anchor="start">
          1,284
        </Label>
      </g>
      <g className="a-num2">
        <Label x={18} y={64} size={30} anchor="start">
          1,312
        </Label>
      </g>
      <Bar x={18} y={100} w={90} h={6} />
      <rect x={120} y={95} width={46} height={16} rx={8} fill={FILL} stroke={SIDE} />
    </Box>
  </Art>
);

const PersonCell = () => (
  <Art>
    <Shadow x={-120} y={-38} w={240} d={76} r={14} />
    <Box x={-120} y={-38} w={240} d={76} h={12} r={14}>
      <Bar x={78} y={26} w={110} h={10} />
      <Bar x={78} y={44} w={76} h={6} />
    </Box>
    <g className="a-float">
      <Disc cx={-82} cy={0} r={24} z={12} h={8} top={SIDE} side={DARK}>
        <Label x={24} y={24} size={16}>
          AY
        </Label>
      </Disc>
    </g>
  </Art>
);

const BarList = () => {
  const rows = [176, 128, 92, 56];
  return (
    <Art>
      <Shadow x={-110} y={-85} w={220} d={170} r={12} />
      <Box x={-110} y={-85} w={220} d={170} h={8} r={12}>
        {rows.map((w, i) => (
          <g key={i}>
            <Bar x={18} y={20 + i * 38} w={i % 2 ? 40 : 56} h={6} />
            <Bar x={18} y={32 + i * 38} w={184} h={12} fill={FILL} />
            {/* a-line1..3 grow the bars one after another; the fourth reuses a-line3, later. */}
            <g style={i === 3 ? { animationDelay: '1.2s' } : undefined} className={i === 3 ? 'a-line3' : undefined}>
              <Bar className={i < 3 ? `a-line${i + 1}` : undefined} x={18} y={32 + i * 38} w={w} h={12} fill={i ? DARK : INK} />
            </g>
          </g>
        ))}
      </Box>
    </Art>
  );
};

const SummaryList = () => (
  <Art>
    <Shadow x={-100} y={-80} w={200} d={160} r={12} />
    <Box x={-100} y={-80} w={200} d={160} h={10} r={12}>
      {[70, 56, 84].map((w, i) => (
        <g key={i}>
          <Bar x={18} y={22 + i * 28} w={w} />
          <Bar x={142} y={22 + i * 28} w={40} fill={DARK} />
        </g>
      ))}
      <line x1={18} x2={182} y1={110} y2={110} stroke={INK} />
      <Bar x={18} y={128} w={50} h={10} fill={DARK} />
      <g className="a-num1">
        <Label x={182} y={133} size={16} anchor="end">
          $1,250
        </Label>
      </g>
      <g className="a-num2">
        <Label x={182} y={133} size={16} anchor="end">
          $1,480
        </Label>
      </g>
    </Box>
  </Art>
);

const DataToolbar = () => (
  <Art>
    <Shadow x={-150} y={-32} w={300} d={64} r={12} />
    <Box x={-150} y={-32} w={300} d={64} h={4} r={12} top={FILL} />
    <Box x={-140} y={-20} w={96} d={40} h={8} z={4} r={8}>
      <Icon x={10} y={12}>
        <IconSearch size={16} />
      </Icon>
      <Bar x={32} y={16} w={48} />
    </Box>
    {[-36, 28].map((x) => (
      <Box key={x} x={x} y={-20} w={56} d={40} h={8} z={4} r={8}>
        <Bar x={10} y={16} w={22} />
        <Icon x={36} y={13}>
          <IconArrowBottom size={14} />
        </Icon>
      </Box>
    ))}
    <g className="a-tap">
      <Box x={92} y={-20} w={48} d={40} h={8} z={4} r={8} top={DARK}>
        <Icon x={14} y={10}>
          <g style={{ color: '#fff' }}>
            <IconAdd size={20} />
          </g>
        </Icon>
      </Box>
    </g>
  </Art>
);

const WizardModal = () => (
  <Art>
    <Box x={-112} y={-92} w={224} d={184} h={4} r={14} top={FILL} />
    <g className="a-modal">
      <Shadow x={-95} y={-75} w={190} d={150} r={12} />
      <Box x={-95} y={-75} w={190} d={150} h={10} z={4} r={12}>
        <line x1={39} x2={151} y1={20} y2={20} stroke={SIDE} strokeWidth={2} />
        {[39, 95, 151].map((cx) => (
          <circle key={cx} cx={cx} cy={20} r={6} fill="#fff" stroke={SIDE} strokeWidth={2} />
        ))}
        <circle className="a-navline" cx={39} cy={20} r={7} fill={INK} />
        <Bar x={18} y={42} w={100} h={10} />
        <Bar x={18} y={64} w={150} />
        <Bar x={18} y={80} w={120} />
        <rect x={18} y={110} width={64} height={24} rx={8} fill="#fff" stroke={SIDE} />
        <Bar x={34} y={118} w={32} />
        <rect x={108} y={110} width={64} height={24} rx={8} fill={INK} />
        <Bar x={124} y={118} w={32} fill="#fff" />
      </Box>
    </g>
  </Art>
);

const AppShell = () => (
  <Art>
    <Shadow x={-52} y={-100} w={152} d={36} r={10} />
    <Box x={-52} y={-100} w={152} d={36} h={10} r={10}>
      <Bar x={16} y={14} w={60} />
      <circle cx={134} cy={18} r={9} fill={SIDE} />
    </Box>
    {[
      { x: 28, y: -56, w: 72, d: 64, c: 'a-row2' },
      { x: -52, y: -56, w: 72, d: 64, c: 'a-row1' },
      { x: -52, y: 16, w: 152, d: 84, c: 'a-row3' },
    ].map((b) => (
      <g key={b.c}>
        <Shadow x={b.x} y={b.y} w={b.w} d={b.d} r={10} />
        <g className={b.c}>
          <Box x={b.x} y={b.y} w={b.w} d={b.d} h={8} r={10}>
            <Bar x={12} y={14} w={b.w > 100 ? 70 : 36} h={6} />
            <Bar x={12} y={30} w={b.w > 100 ? 120 : 48} fill={DARK} />
            {b.w > 100 && <Bar x={12} y={48} w={96} />}
          </Box>
        </g>
      </g>
    ))}
    <Shadow x={-110} y={-100} w={50} d={200} r={10} />
    <Box x={-110} y={-100} w={50} d={200} h={10} r={10}>
      <circle cx={25} cy={24} r={9} fill="#1C1A09" />
      {[0, 1, 2, 3].map((i) => (
        <Bar key={i} x={17} y={60 + i * 34} w={16} fill={i === 1 ? DARK : SIDE} />
      ))}
    </Box>
  </Art>
);

export const DRAWN: Record<string, () => ReactNode> = {
  switch: Switch,
  alert: Alert,
  badge: Badge,
  breadcrumb: Breadcrumb,
  chips: Chips,
  'date-picker': DatePicker,
  dropdown: Dropdown,
  'empty-state': EmptyState,
  hint: Hint,
  input: Input,
  'item-selector': ItemSelector,
  label: LabelArt,
  loader: Loader,
  'number-input': NumberInput,
  'currency-input': CurrencyInput,
  'color-input': ColorInput,
  'gsm-input': GsmInput,
  'nav-menu': NavMenu,
  pagination: Pagination,
  popover: Popover,
  'scroll-area': ScrollArea,
  segment: Segment,
  stepper: Stepper,
  table: Table,
  textarea: Textarea,
  'time-picker': TimePicker,
  toast: Toast,
  tooltip: Tooltip,
  uploader: Uploader,
  accordion: Accordion,
  'app-sidebar': AppSidebar,
  'file-share': FileShare,
  navigation: Navigation,
  card: CardArt,
  'stat-card': StatCard,
  'person-cell': PersonCell,
  'bar-list': BarList,
  'summary-list': SummaryList,
  'data-toolbar': DataToolbar,
  'wizard-modal': WizardModal,
  'app-shell': AppShell,
};
