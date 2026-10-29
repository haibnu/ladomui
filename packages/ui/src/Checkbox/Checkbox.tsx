'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { IconCheck, IconRemove } from '@ladom/icons';
import { useChoiceGroup } from '../ChoiceGroup/ChoiceGroup';
import { Hint } from '../Hint/Hint';
import styles from './Choice.module.css';

// Figma: Components / Checkbox (1182:3). size = Size, checked = Checked, indeterminate =
// Indeterminate, error = Error, disabled = Disabled, label = with Label, spacing = Form Spacing.
// 🕹 State is :hover and :focus-visible. A native checkbox keeps keyboard and form behavior.
export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
  label?: ReactNode;
  size?: 'medium' | 'small';
  /** Shows the dash instead of the check (e.g. "some selected"). */
  indeterminate?: boolean;
  /** Error border; a message is shown under the label. */
  error?: boolean | ReactNode;
  spacing?: boolean;
  /** Shows a state without interaction (docs, visual tests). */
  'data-state'?: 'hover' | 'focus';
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, size = 'medium', indeterminate = false, error, spacing = false, className, 'data-state': forcedState, ...rest },
  ref,
) {
  const inner = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inner.current!);
  useEffect(() => {
    if (inner.current) inner.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const group = useChoiceGroup();
  const invalid = Boolean(error) || (group?.invalid ?? false);
  const message = typeof error === 'boolean' ? null : error;
  const glyph = size === 'medium' ? 10 : 8;

  return (
    <label
      className={[styles.choice, className].filter(Boolean).join(' ')}
      data-kind="checkbox"
      data-size={size}
      data-error={invalid || undefined}
      data-spacing={spacing || undefined}
      data-state={forcedState}
      // Mirrors the native indeterminate state (set after hydration) so the dash renders from the server.
      data-indeterminate={indeterminate || undefined}
    >
      <span className={styles.control}>
        <input ref={inner} type="checkbox" className={styles.input} aria-invalid={invalid || undefined} {...rest} />
        <span className={styles.box} aria-hidden="true">
          <IconCheck size={glyph} className={styles.check} />
          <IconRemove size={glyph} className={styles.dash} />
        </span>
      </span>
      {(label != null || message != null) && (
        <span className={styles.text}>
          {label != null && <span className={styles.label}>{label}</span>}
          {message != null && <Hint tone="error">{message}</Hint>}
        </span>
      )}
    </label>
  );
});
