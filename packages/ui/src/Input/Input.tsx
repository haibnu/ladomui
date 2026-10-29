'use client';

import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { IconError, IconHide, IconSearch, IconShow } from '@ladom/icons';
import { useFieldContext } from '../FormField/FormField';
import styles from './Input.module.css';

// Figma: Components / Input (node 1133:303). size = 👕 Size (Medium, Small), error = Error,
// disabled = Disable, iconLeft/iconRight = Icon (L)/(R), prefix/suffix = Leading/Trailing Text.
// 🎛 Type follows the input type: type="search" is the Search look, type="password" adds the
// show/hide toggle. 🕹 State is :hover, :focus-within and a filled value (Typed).
export type InputSize = 'medium' | 'small';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> & {
  size?: InputSize;
  error?: boolean;
  /** Icon element before the value, e.g. <IconProfile />. Drawn at 16px. */
  iconLeft?: ReactNode;
  /** Icon element after the value. Drawn at 16px. */
  iconRight?: ReactNode;
  /** Text before the value (e.g. "https://"). */
  prefix?: ReactNode;
  /** Text after the value (e.g. "@gmail.com"). */
  suffix?: ReactNode;
  /** Class for the outer box; className goes there too. */
  className?: string;
  /** Labels of the password toggle. */
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
  /** Shows a state without interaction (docs, visual tests). */
  'data-state'?: 'hover' | 'focus' | 'typed';
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'medium',
    error,
    iconLeft,
    iconRight,
    prefix,
    suffix,
    className,
    type = 'text',
    disabled,
    id,
    placeholder,
    showPasswordLabel = 'Show password',
    hidePasswordLabel = 'Hide password',
    'aria-describedby': describedBy,
    'data-state': forcedState,
    ...rest
  },
  ref,
) {
  const field = useFieldContext();
  const invalid = error ?? field?.invalid ?? false;
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';
  const leading = iconLeft ?? (type === 'search' ? <IconSearch /> : null);

  return (
    <div
      className={[styles.box, className].filter(Boolean).join(' ')}
      data-size={size}
      data-look={type === 'search' ? 'search' : 'default'}
      data-error={invalid || undefined}
      data-disabled={disabled || undefined}
      data-state={forcedState}
    >
      {leading != null && <span className={styles.icon}>{leading}</span>}
      {prefix != null && <span className={styles.affix}>{prefix}</span>}
      <input
        ref={ref}
        id={id ?? field?.id}
        type={isPassword && revealed ? 'text' : type}
        disabled={disabled}
        // A placeholder is needed for :placeholder-shown, which drives the filled (Typed) style.
        placeholder={placeholder ?? ' '}
        aria-invalid={invalid || undefined}
        aria-describedby={[describedBy, field?.describedBy].filter(Boolean).join(' ') || undefined}
        className={styles.input}
        {...rest}
      />
      {suffix != null && <span className={styles.affix}>{suffix}</span>}
      {invalid && <IconError size={16} className={styles.errorIcon} />}
      {iconRight != null && <span className={styles.icon}>{iconRight}</span>}
      {isPassword && (
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setRevealed((r) => !r)}
          aria-label={revealed ? hidePasswordLabel : showPasswordLabel}
          aria-pressed={revealed}
          disabled={disabled}
        >
          {revealed ? <IconShow size={16} /> : <IconHide size={16} />}
        </button>
      )}
    </div>
  );
});
