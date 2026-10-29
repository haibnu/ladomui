import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { IconRefresh } from '@ladom/icons';
import { BrandMark } from '../Brand/BrandMark';
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
