import { useId, type JSX, type SVGProps } from 'react';
import { FLAG_SVG } from './countries';

// Flags. From the Figma Icons page: Flags / TR (2001:1354) and Flags / EN (2001:1362, the US flag),
// exported as SVG. Their colors are the flags' own, not tokens. Ids are per instance so that
// several flags on a page do not share a mask.
type FlagProps = SVGProps<SVGSVGElement>;

export function FlagTR(props: FlagProps) {
  const id = useId();
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <mask id={`${id}m`} style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="3" width="24" height="18">
        <rect y="3" width="24" height="17.1429" rx="1.71429" fill="white" />
      </mask>
      <g mask={`url(#${id}m)`}>
        <rect y="3" width="24" height="17.1429" fill="#E92434" />
        <path
          d="M16.0164 12.2678L14.6729 13.2256L15.1686 11.6519L13.8425 10.6701L15.4924 10.6552L16.0164 9.09069L16.5403 10.6552L18.1902 10.6701L16.8642 11.6519L17.3599 13.2256L16.0164 12.2678Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="white"
        />
        <path
          d="M14.9166 8.41365C14.1904 7.88584 13.2774 7.57145 12.2857 7.57145C9.91873 7.57145 7.99995 9.36231 7.99995 11.5714C7.99995 13.7806 9.91873 15.5714 12.2857 15.5714C13.2774 15.5714 14.1904 15.2571 14.9166 14.7293C13.9755 15.9373 12.507 16.7143 10.8571 16.7143C8.01677 16.7143 5.71423 14.4118 5.71423 11.5714C5.71423 8.73111 8.01677 6.42857 10.8571 6.42857C12.5071 6.42857 13.9756 7.20558 14.9166 8.41365Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="white"
        />
      </g>
    </svg>
  );
}

// The canton's dots as Figma draws them: 5 rows of 4 and 3, 1.1429 apart.
const STARS = [0, 1, 2, 3, 4].flatMap((row) =>
  (row % 2 ? [2.85713, 5.14284, 7.42854] : [1.71426, 3.99997, 6.2857, 8.57141]).map((cx) => [cx, 4.71427 + row * 1.142857]),
);

export function FlagUS(props: FlagProps) {
  const id = useId();
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect y="3" width="24" height="17.1429" rx="2" fill="white" />
      <mask id={`${id}m`} style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="3" width="24" height="18">
        <rect y="3" width="24" height="17.1429" rx="2" fill="white" />
      </mask>
      <g mask={`url(#${id}m)`}>
        <path
          d="M24 3H0V4.14286H24V3ZM24 5.28568H0V6.42854H24V5.28568ZM0 7.57146H24V8.71432H0V7.57146ZM24 9.85714H0V11H24V9.85714ZM0 12.1428H24V13.2857H0V12.1428ZM24 14.4286H0V15.5715H24V14.4286ZM0 16.7143H24V17.8571H0V16.7143ZM24 19H0V20.1428H24V19Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#D02F44"
        />
        <rect y="3" width="10.2857" height="8" fill="#46467F" />
        <g fill={`url(#${id}g)`} filter={`url(#${id}f)`}>
          {STARS.map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="0.5714" />
          ))}
        </g>
      </g>
      <defs>
        <filter id={`${id}f`} x="1.14282" y="4.1429" width="8" height="6.71432" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="shadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="shadow" result="shape" />
        </filter>
        <linearGradient id={`${id}g`} x1="1.14282" y1="4.1429" x2="1.14282" y2="9.85718" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="#F0F0F0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const FIGMA_FLAGS: Record<string, (props: FlagProps) => JSX.Element> = { TR: FlagTR, US: FlagUS };

/**
 * The flag of a country, drawn in Figma's flag frame (24px, a 24 x 17 rectangle with 2px
 * corners): Figma's own for TR and US, country-flag-icons (MIT) for the others. Null when there
 * is none.
 */
export function CountryFlag({ code, ...props }: FlagProps & { code: string }) {
  const id = useId();
  const Figma = FIGMA_FLAGS[code];
  if (Figma) return <Figma {...props} />;
  const flag = FLAG_SVG[code];
  if (!flag) return null;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <clipPath id={`${id}c`}>
        <rect y="3" width="24" height="17.1429" rx="1.71429" />
      </clipPath>
      <g clipPath={`url(#${id}c)`}>
        <svg y="3" width="24" height="17.1429" viewBox={flag[0]} preserveAspectRatio="xMidYMid slice" dangerouslySetInnerHTML={{ __html: flag[1] }} />
      </g>
    </svg>
  );
}
