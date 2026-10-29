'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { IconFolder, IconRefresh } from '@ladom/icons';
import { useFieldContext } from '../FormField/FormField';
import styles from './ItemSelector.module.css';

// Figma: Components / Item Selector (node 4929:292): a field that opens your own picker (a
// folder or item browser) and shows what was picked. value = Selected, error = Error,
// disabled = Disabled; Label, Hint and Form Spacing come from FormField. 🕹 State=Hover is :hover.
export type ItemSelectorProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> & {
  /** The picked item (e.g. a path); the placeholder shows when empty. */
  value?: ReactNode;
  placeholder?: ReactNode;
  /** Text of the action chip at the end. */
  actionLabel?: ReactNode;
  /** Leading icon element; a folder by default. */
  icon?: ReactNode;
  error?: boolean;
  /** Shows a state without interaction (docs, visual tests). */
  'data-state'?: 'hover';
};

export const ItemSelector = forwardRef<HTMLButtonElement, ItemSelectorProps>(function ItemSelector(
  { value, placeholder = 'Select', actionLabel = 'Change', icon, error, id, className, type = 'button', 'aria-describedby': describedBy, ...rest },
  ref,
) {
  const field = useFieldContext();
  const invalid = error ?? field?.invalid ?? false;
  const filled = value != null && value !== '';
  return (
    <button
      ref={ref}
      type={type}
      id={id ?? field?.id}
      className={[styles.selector, className].filter(Boolean).join(' ')}
      data-filled={filled || undefined}
      data-error={invalid || undefined}
      aria-invalid={invalid || undefined}
      aria-describedby={[describedBy, field?.describedBy].filter(Boolean).join(' ') || undefined}
      {...rest}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon ?? <IconFolder />}
      </span>
      <span className={styles.value}>{filled ? value : placeholder}</span>
      <span className={styles.action}>
        <IconRefresh aria-hidden="true" />
        {actionLabel}
      </span>
    </button>
  );
});
