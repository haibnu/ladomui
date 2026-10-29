'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { useChoiceGroup } from '../ChoiceGroup/ChoiceGroup';
import styles from './Switch.module.css';

// Figma: Components / Switch (1125:29). size = 👕 Size, checked = Active, error = Error,
// disabled = Disabled, label + labelPosition = Label (L) / Label (R). 🕹 State is :hover.
// A native checkbox with role="switch" keeps keyboard and form behavior.
export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
  label?: ReactNode;
  /** Label before (Label (L)) or after (Label (R)) the switch. */
  labelPosition?: 'start' | 'end';
  size?: 'medium' | 'large';
  error?: boolean;
  /** Shows a state without interaction (docs, visual tests). */
  'data-state'?: 'hover' | 'focus';
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, labelPosition = 'end', size = 'medium', error, className, 'data-state': forcedState, ...rest },
  ref,
) {
  const group = useChoiceGroup();
  const invalid = error ?? group?.invalid ?? false;
  const text = label != null ? <span className={styles.label}>{label}</span> : null;
  return (
    <label
      className={[styles.switch, className].filter(Boolean).join(' ')}
      data-size={size}
      data-error={invalid || undefined}
      data-state={forcedState}
    >
      {labelPosition === 'start' && text}
      <span className={styles.track}>
        <input ref={ref} type="checkbox" role="switch" className={styles.input} aria-invalid={invalid || undefined} {...rest} />
        <span className={styles.thumb} aria-hidden="true" />
      </span>
      {labelPosition === 'end' && text}
    </label>
  );
});
