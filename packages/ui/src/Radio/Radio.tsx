'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { useChoiceGroup } from '../ChoiceGroup/ChoiceGroup';
import { Hint } from '../Hint/Hint';
import styles from '../Checkbox/Choice.module.css';

// Figma: Components / Radio Button (1343:3). size = 👕 Size, checked = Checked, error = Error,
// disabled = Disabled, label = with Text, spacing = Form Spacing, fluid = Fluid.
// Radios with the same name form a group; wrap them in ChoiceGroup for the label and hint.
export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
  label?: ReactNode;
  size?: 'medium' | 'small';
  error?: boolean | ReactNode;
  spacing?: boolean;
  /** Stretches to the available width (Figma Fluid=True). */
  fluid?: boolean;
  /** Shows a state without interaction (docs, visual tests). */
  'data-state'?: 'hover' | 'focus';
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, size = 'medium', error, spacing = false, fluid = false, className, 'data-state': forcedState, ...rest },
  ref,
) {
  const group = useChoiceGroup();
  const invalid = Boolean(error) || (group?.invalid ?? false);
  const message = typeof error === 'boolean' ? null : error;
  return (
    <label
      className={[styles.choice, className].filter(Boolean).join(' ')}
      data-kind="radio"
      data-size={size}
      data-error={invalid || undefined}
      data-spacing={spacing || undefined}
      data-fluid={fluid || undefined}
      data-state={forcedState}
    >
      <span className={styles.control}>
        <input ref={ref} type="radio" className={styles.input} aria-invalid={invalid || undefined} {...rest} />
        <span className={styles.box} aria-hidden="true">
          <span className={styles.dot} />
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
