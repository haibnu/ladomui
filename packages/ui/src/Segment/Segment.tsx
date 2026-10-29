'use client';

import { useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { IconInfo } from '@ladom/icons';
import { Badge } from '../Badge/Badge';
import styles from './Segment.module.css';

// Figma: Components / Segment (node 1229:1786) with .Segment Item (1335:2234). size = 👕 Size,
// fluid = Fluid, disabled = Disable, spacing = Form Spacing; Count is the number of options.
// Item Type follows the option: icon (Left Icon / Right Icon), badge (Badge), info (Info).
// Native radios keep the arrow keys, the form value and the screen reader roles.
export type SegmentSize = 'medium' | 'small';

export type SegmentOption = {
  value: string;
  label: ReactNode;
  /** Icon element (16px Medium, 12px Small) and its side. */
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  /** Count shown in a Micro badge after the label. */
  badge?: ReactNode;
  /** Shows the small info icon after the label. */
  info?: boolean;
  disabled?: boolean;
};

export type SegmentProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> & {
  options: SegmentOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: SegmentSize;
  /** Stretches to the container and shares the width between the options. */
  fluid?: boolean;
  disabled?: boolean;
  /** Adds the form gutter below (Figma Form Spacing=True). */
  spacing?: boolean;
  /** Radio group name; generated when omitted. */
  name?: string;
};

export function Segment({
  options,
  value,
  defaultValue,
  onChange,
  size = 'medium',
  fluid = false,
  disabled = false,
  spacing = false,
  name,
  className,
  ...rest
}: SegmentProps) {
  const generated = useId();
  const group = name ?? `segment-${generated}`;
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value);
  const current = value ?? inner;

  return (
    <div
      role="radiogroup"
      aria-disabled={disabled || undefined}
      className={[styles.segment, className].filter(Boolean).join(' ')}
      data-size={size}
      data-fluid={fluid || undefined}
      data-disabled={disabled || undefined}
      data-spacing={spacing || undefined}
      {...rest}
    >
      {options.map((o) => {
        const off = disabled || o.disabled;
        return (
          <label key={o.value} className={styles.item} data-disabled={off || undefined}>
            <input
              type="radio"
              className={styles.input}
              name={group}
              value={o.value}
              checked={current === o.value}
              disabled={off}
              onChange={() => {
                if (value === undefined) setInner(o.value);
                onChange?.(o.value);
              }}
            />
            {o.icon != null && o.iconPosition !== 'end' && (
              <span className={styles.icon} aria-hidden="true">
                {o.icon}
              </span>
            )}
            <span>{o.label}</span>
            {o.info && <IconInfo className={styles.info} aria-hidden="true" />}
            {o.badge != null && (
              <Badge size="micro" tone="primary" filled disabled={off && current !== o.value}>
                {o.badge}
              </Badge>
            )}
            {o.icon != null && o.iconPosition === 'end' && (
              <span className={styles.icon} aria-hidden="true">
                {o.icon}
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}
