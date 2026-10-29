import { forwardRef, type HTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';
import { IconClear } from '@ladom/icons';
import styles from './Chip.module.css';

// Figma: Components / Chip (node 76:36872). tone = 💅 Style (Danger -> error), size = 👕 Size,
// selected = Select, iconLeft/iconRight = Show Icon / Show Icon (R), keyLabel = Key + ⮑ Key,
// onRemove = Remove. With onClick the chip is a toggle button (aria-pressed = selected).
export type ChipTone = 'default' | 'primary' | 'success' | 'error' | 'warning';
export type ChipSize = 'medium' | 'small' | 'tiny' | 'micro';

export type ChipProps = Omit<HTMLAttributes<HTMLSpanElement>, 'onClick'> & {
  tone?: ChipTone;
  size?: ChipSize;
  selected?: boolean;
  /** Icon elements, sized by the chip (20px Medium, 16px Small, 12px Tiny and Micro). */
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /** A key part before the text, e.g. "Status" in "Status: Active". */
  keyLabel?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Shows the remove button. */
  onRemove?: MouseEventHandler<HTMLButtonElement>;
  /** Accessible name of the remove button; defaults to "Remove". */
  removeLabel?: string;
};

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { tone = 'default', size = 'medium', selected = false, iconLeft, iconRight, keyLabel, onClick, onRemove, removeLabel = 'Remove', className, children, ...rest },
  ref,
) {
  const content = (
    <>
      {iconLeft && (
        <span className={styles.icon} aria-hidden="true">
          {iconLeft}
        </span>
      )}
      <span>{children}</span>
      {iconRight && (
        <span className={styles.icon} aria-hidden="true">
          {iconRight}
        </span>
      )}
    </>
  );
  return (
    <span
      ref={ref}
      className={[styles.chip, className].filter(Boolean).join(' ')}
      data-tone={tone}
      data-size={size}
      data-selected={selected || undefined}
      {...rest}
    >
      {keyLabel != null && <span className={styles.key}>{keyLabel}</span>}
      {onClick ? (
        <button type="button" className={styles.body} aria-pressed={selected} onClick={onClick}>
          {content}
        </button>
      ) : (
        <span className={styles.body}>{content}</span>
      )}
      {onRemove && (
        <button type="button" className={styles.remove} aria-label={removeLabel} onClick={onRemove}>
          <IconClear />
        </button>
      )}
    </span>
  );
});
