import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { IconRefresh } from '@ladom/icons';
import styles from './Loader.module.css';

// Figma: Components / Loader (node 1780:103). variant = 🎛 Type (Infinitive -> infinite,
// Finitive -> finite, Finitive with Text -> finite with valueText/loaded/total, Brand -> brand),
// tone = Style (Danger -> error, Information -> info).
export type LoaderTone = 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'warning' | 'info';

type Base = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  /** Accessible name; defaults to "Loading". */
  label?: string;
};

export type LoaderProps = Base &
  (
    | { variant?: 'infinite'; tone?: LoaderTone }
    | { variant: 'brand'; tone?: never }
    | {
        variant: 'finite';
        tone?: LoaderTone;
        /** Progress from 0 to 100. */
        value: number;
        /** Text under the middle of the bar, e.g. "54%". */
        valueText?: ReactNode;
        /** Amount done and the total, shown under the end of the bar ("45 Mb / 98 Mb"). */
        loaded?: ReactNode;
        total?: ReactNode;
      }
  );

export const Loader = forwardRef<HTMLSpanElement, LoaderProps>(function Loader(props, ref) {
  if (props.variant === 'finite') {
    const { variant, tone = 'primary', value, valueText, loaded, total, label = 'Loading', className, ...rest } = props;
    const clamped = Math.min(100, Math.max(0, value));
    const hasText = valueText != null || loaded != null || total != null;
    return (
      <span
        ref={ref}
        className={[styles.finite, className].filter(Boolean).join(' ')}
        data-tone={tone}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        {...rest}
      >
        <span className={styles.bar}>
          <span className={styles.fill} style={{ inlineSize: `${clamped}%` }} />
        </span>
        {hasText && (
          <span className={styles.texts}>
            <span className={styles.value}>{valueText}</span>
            {(loaded != null || total != null) && (
              <span className={styles.amount}>
                {loaded != null && <span className={styles.loaded}>{loaded}</span>}
                {total != null && <span>/ {total}</span>}
              </span>
            )}
          </span>
        )}
      </span>
    );
  }

  const { variant = 'infinite', tone = 'primary', label = 'Loading', className, ...rest } = props;
  return (
    <span
      ref={ref}
      className={[variant === 'brand' ? styles.brand : styles.infinite, className].filter(Boolean).join(' ')}
      data-tone={variant === 'brand' ? undefined : tone}
      role="status"
      aria-label={label}
      {...rest}
    >
      {variant === 'brand' ? <BrandMark /> : <IconRefresh size={16} aria-hidden="true" />}
    </span>
  );
});

// The Figma "Brand" instance (2109:35679) as exported: the keycap on the static brand color with
// the white gradient mark. Its inner shadows come from the Figma effect, as raw values.
function BrandMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect width="24" height="24" fill="var(--color-static-brand-color)" />
      <g filter="url(#ladom-loader-brand-shadow)">
        <path d="M7 10.125C7 8.39911 8.39911 7 10.125 7C10.2401 7 10.3333 7.09327 10.3333 7.20833V13.2424C10.3333 13.8639 9.99502 14.4361 9.45048 14.7356L7.63133 15.7361C7.34741 15.8923 7 15.6869 7 15.3628V10.125Z" fill="black" fillOpacity="0.4" />
        <path d="M7 10.125C7 8.39911 8.39911 7 10.125 7C10.2401 7 10.3333 7.09327 10.3333 7.20833V13.2424C10.3333 13.8639 9.99502 14.4361 9.45048 14.7356L7.63133 15.7361C7.34741 15.8923 7 15.6869 7 15.3628V10.125Z" fill="url(#ladom-loader-brand-fill)" fillOpacity="0.6" />
        <path d="M14.0834 13.6667C15.6942 13.6667 17 14.9725 17 16.5833C17 16.8135 16.8135 17 16.5834 17H9.1441C8.7045 17 8.55293 16.4151 8.93721 16.2016L13.0222 13.9321C13.3356 13.758 13.6882 13.6667 14.0467 13.6667H14.0834Z" fill="black" fillOpacity="0.4" />
        <path d="M14.0834 13.6667C15.6942 13.6667 17 14.9725 17 16.5833C17 16.8135 16.8135 17 16.5834 17H9.1441C8.7045 17 8.55293 16.4151 8.93721 16.2016L13.0222 13.9321C13.3356 13.758 13.6882 13.6667 14.0467 13.6667H14.0834Z" fill="url(#ladom-loader-brand-fill)" fillOpacity="0.6" />
      </g>
      <defs>
        <filter id="ladom-loader-brand-shadow" x="7" y="6.78699" width="10" height="12.3431" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <InnerShadow dy={0.639033} blur={0.319516} alpha={0.4} in2="shape" result="s1" />
          <InnerShadow dy={-0.213011} blur={0.106505} alpha={0.18} in2="s1" result="s2" />
          <InnerShadow dy={2.13011} blur={1.06505} alpha={0.32} in2="s2" result="s3" />
          <InnerShadow dy={0.106505} blur={0.0532527} alpha={0.8} in2="s3" result="s4" />
        </filter>
        <linearGradient id="ladom-loader-brand-fill" x1="8.66667" y1="7" x2="8.66667" y2="16.0833" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function InnerShadow({ dy, blur, alpha, in2, result }: { dy: number; blur: number; alpha: number; in2: string; result: string }) {
  return (
    <>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
      <feOffset dy={dy} />
      <feGaussianBlur stdDeviation={blur} />
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
      <feColorMatrix type="matrix" values={`0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 ${alpha} 0`} />
      <feBlend mode="normal" in2={in2} result={result} />
    </>
  );
}
