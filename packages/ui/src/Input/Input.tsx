'use client';

import { forwardRef, useRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { IconClear, IconError, IconHide, IconSearch, IconShow } from '@ladom/icons';
import { useFieldContext } from '../FormField/FormField';
import styles from './Input.module.css';

// Figma: Components / Input (node 1133:303). type="search" shows the clear button (Icon/clear)
// once it has a value, as in Type=Search, State=Typed.
// size = 👕 Size (Medium, Small), error = Error,
// disabled = Disable, iconLeft/iconRight = Icon (L)/(R), prefix/suffix = Leading/Trailing Text.
// 🎛 Type follows the input type: type="search" is the Search look, type="password" adds the
// show/hide toggle, type="number" centers the value (NumberInput). 🕹 State is :hover,
// :focus-within and a filled value (Typed).
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
  /** Name of the clear button of a search input. */
  clearLabel?: string;
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
    clearLabel = 'Clear',
    value,
    defaultValue,
    onChange,
    'aria-describedby': describedBy,
    'data-state': forcedState,
    ...rest
  },
  ref,
) {
  const field = useFieldContext();
  const invalid = error ?? field?.invalid ?? false;
  const [revealed, setRevealed] = useState(false);
  const inner = useRef<HTMLInputElement | null>(null);
  const [innerFilled, setInnerFilled] = useState(String(defaultValue ?? '') !== '');
  const filled = value !== undefined ? String(value) !== '' : innerFilled;
  const isPassword = type === 'password';
  const clearable = type === 'search' && filled && !disabled;
  // Clears through the native value setter and an input event, so onChange runs for controlled
  // and uncontrolled inputs alike.
  const clear = () => {
    const el = inner.current;
    if (!el) return;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(el, '');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.focus();
  };
  const leading = iconLeft ?? (type === 'search' ? <IconSearch /> : null);

  return (
    <div
      className={[styles.box, className].filter(Boolean).join(' ')}
      data-size={size}
      data-look={type === 'search' ? 'search' : type === 'number' ? 'number' : 'default'}
      data-error={invalid || undefined}
      data-disabled={disabled || undefined}
      data-state={forcedState}
    >
      {leading != null && <span className={styles.icon}>{leading}</span>}
      {prefix != null && <span className={styles.affix}>{prefix}</span>}
      <input
        ref={(el) => {
          inner.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => {
          setInnerFilled(e.target.value !== '');
          onChange?.(e);
        }}
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
      {clearable && (
        <button type="button" className={styles.toggle} onClick={clear} aria-label={clearLabel}>
          <IconClear size={16} />
        </button>
      )}
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
