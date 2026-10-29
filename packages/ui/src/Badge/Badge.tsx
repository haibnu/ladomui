import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styles from './Badge.module.css';

// Figma: Components / Badge (node 1394:3). tone = 💅 Style, size = 👕 Size, filled = Filled,
// disabled = Disabled, iconLeft/iconRight = Icon Leading/Trailing. A badge is a label, not a control.
export type BadgeTone = 'default' | 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'warning';
export type BadgeSize = 'medium' | 'small' | 'tiny' | 'micro';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  size?: BadgeSize;
  /** Solid tone background instead of the outline. */
  filled?: boolean;
  disabled?: boolean;
  /** Icon elements, sized by the badge (16px, 12px in Tiny, 10px in Micro). */
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'default', size = 'medium', filled = false, disabled = false, iconLeft, iconRight, className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={[styles.badge, className].filter(Boolean).join(' ')}
      data-tone={tone}
      data-size={size}
      data-filled={filled || undefined}
      data-disabled={disabled || undefined}
      aria-disabled={disabled || undefined}
      {...rest}
    >
      {iconLeft && (
        <span className={styles.icon} aria-hidden="true">
          {iconLeft}
        </span>
      )}
      <span className={styles.text}>{children}</span>
      {iconRight && (
        <span className={styles.icon} aria-hidden="true">
          {iconRight}
        </span>
      )}
    </span>
  );
});
