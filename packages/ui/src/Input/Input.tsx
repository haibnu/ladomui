'use client';

import { forwardRef, useId, useRef, useState, type InputHTMLAttributes, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import { IconClear, IconError, IconHide, IconSearch, IconShow } from '@ladom/icons';
import { useFieldContext } from '../FormField/FormField';
import styles from './Input.module.css';

// Figma: Components / Input (node 1133:303). type="search" shows the clear button (Icon/clear)
// once it has a value, as in Type=Search, State=Typed.
// size = 👕 Size (Medium, Small; Large is Figma's Mobile Large, 48px, used on every device and
// the only size that takes floatingLabel = 🎛 Type=Floating Label), error = Error,
// disabled = Disable, iconLeft/iconRight = Icon (L)/(R), prefix/suffix = Leading/Trailing Text.
// 🎛 Type follows the input type: type="search" is the Search look, type="password" adds the
// show/hide toggle, type="number" centers the value (NumberInput). 🕹 State is :hover,
// :focus-within and a filled value (Typed).
const TEXT_LIKE: Record<string, { inputMode: 'email' | 'url'; autoComplete: string; pattern?: string } | undefined> = {
  email: { inputMode: 'email', autoComplete: 'email', pattern: '[^@\\s]+@[^@\\s]+\\.[^@\\s]+' },
  url: { inputMode: 'url', autoComplete: 'url' },
};

export type InputSize = 'medium' | 'small';

/** The floating label needs the room of the large size, so only large inputs take it. */
type Sizing =
  | { size?: InputSize | 'large'; floatingLabel?: never }
  | {
      size: 'large';
      /** A label inside the field: it sits where the placeholder would and moves up, smaller,
       *  on focus or once there is a value (autofill too). Only on size="large". */
      floatingLabel?: ReactNode;
    };

/** Input props without the large size and the floating label: the base of the inputs built on
 *  Input (NumberInput, CurrencyInput, GsmInput, ColorInput). */
export type InputBaseProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> & {
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

export type InputProps = Omit<InputBaseProps, 'size'> & Sizing;

// A press anywhere on the box (padding, icon, affix, label) focuses the field, the way a press on
// the text does. Controls inside the box (buttons, inline pickers and their lists) keep their own
// presses. Shared with Textarea.
const OWN_PRESS = 'input, textarea, select, button, a, label, [tabindex], [role="listbox"], [role="menu"]';
export function focusFromBox(e: ReactMouseEvent<HTMLElement>, field: HTMLInputElement | HTMLTextAreaElement | null) {
  if (e.button !== 0 || !field || field.disabled) return;
  const target = e.target as Element;
  if (target === field) return;
  const own = target.closest(OWN_PRESS);
  if (own && own !== e.currentTarget && e.currentTarget.contains(own) && !own.matches(`label[for="${field.id}"]`)) return;
  e.preventDefault();
  if (document.activeElement === field) return;
  field.focus();
  // The caret goes to the end of the text. Some types (number, email) have no selection API.
  try {
    field.setSelectionRange(field.value.length, field.value.length);
  } catch {
    /* no caret to place */
  }
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'medium',
    floatingLabel,
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
  const autoId = useId();
  const floating = size === 'large' && floatingLabel != null;
  const inputId = id ?? field?.id ?? (floating ? autoId : undefined);
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
  // Browsers turn off macOS text replacement (and autocorrect) in type="email" and type="url"
  // fields, so shortcuts like "!g" for an address do nothing there. These render as text fields
  // with the matching keyboard and autofill instead; email keeps form validation with a pattern.
  const asText = TEXT_LIKE[type];

  const input = (
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
        id={inputId}
        type={asText || (isPassword && revealed) ? 'text' : type}
        inputMode={asText?.inputMode}
        autoComplete={asText?.autoComplete}
        autoCapitalize={asText ? 'none' : undefined}
        pattern={asText?.pattern}
        disabled={disabled}
        // A placeholder is needed for :placeholder-shown, which drives the filled (Typed) style.
        // With a floating label it shows only once the label has moved up.
        placeholder={placeholder ?? ' '}
        aria-invalid={invalid || undefined}
        aria-describedby={[describedBy, field?.describedBy].filter(Boolean).join(' ') || undefined}
        className={styles.input}
        {...rest}
      />
  );

  return (
    <div
      className={[styles.box, className].filter(Boolean).join(' ')}
      data-size={size}
      data-look={type === 'search' ? 'search' : type === 'number' ? 'number' : 'default'}
      data-error={invalid || undefined}
      data-disabled={disabled || undefined}
      data-state={forcedState}
      data-floating={floating || undefined}
      onMouseDown={(e) => focusFromBox(e, inner.current)}
    >
      {leading != null && <span className={styles.icon}>{leading}</span>}
      {prefix != null && <span className={styles.affix}>{prefix}</span>}
      {floating ? (
        <span className={styles.field}>
          {input}
          <label htmlFor={inputId} className={styles.floatingLabel}>
            {floatingLabel}
          </label>
        </span>
      ) : (
        input
      )}
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
