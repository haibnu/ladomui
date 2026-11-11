'use client';

import {
  forwardRef,
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
} from 'react';
import { IconRemove } from '@ladom/icons';
import { useFieldContext } from '../FormField/FormField';
import type { InputSize } from '../Input/Input';
import styles from './OtpInput.module.css';

// Not drawn in Figma yet: built from Input (1133:303). A row of square Input boxes, one per
// character, optionally split into groups by a minus icon. One real text input sits under the
// boxes (autocomplete="one-time-code", so SMS codes and pasting fill every box); the boxes only
// draw its value and the active position. Typing moves forward, Backspace clears a box or moves back, a paste fills the boxes, the arrow
// keys, Home and End move between boxes. With mask, each character shows briefly, then shrinks into a filled circle.
export type OtpInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'maxLength' | 'minLength' | 'pattern' | 'children'
> & {
  /** Number of characters (boxes). */
  length?: number;
  value?: string;
  defaultValue?: string;
  /** Called with the code as it is typed (only allowed characters, at most length). */
  onValueChange?: (value: string) => void;
  /** Called once every box is filled. */
  onComplete?: (value: string) => void;
  /** Sizes of the box groups, e.g. [3, 3]; a separator goes between them. */
  groups?: number[];
  /** Shows each character briefly, then turns it into a filled circle. */
  mask?: boolean;
  /** How long a masked character stays visible, in ms. */
  maskDelay?: number;
  /** Digits only, or letters and digits. */
  chars?: 'numeric' | 'alphanumeric';
  size?: InputSize;
  error?: boolean;
  /** Class for the row of boxes. */
  className?: string;
};

const ALLOWED = { numeric: /[^0-9]/g, alphanumeric: /[^0-9a-z]/gi };

export const OtpInput = forwardRef<HTMLInputElement, OtpInputProps>(function OtpInput(
  {
    length = 6,
    value,
    defaultValue = '',
    onValueChange,
    onComplete,
    groups,
    mask = false,
    maskDelay = 1000,
    chars = 'numeric',
    size = 'medium',
    error,
    disabled,
    className,
    id,
    autoComplete = 'one-time-code',
    inputMode,
    onFocus,
    onBlur,
    onKeyDown,
    'aria-describedby': describedBy,
    ...rest
  },
  ref,
) {
  const field = useFieldContext();
  const invalid = error ?? field?.invalid ?? false;
  const clean = (text: string) => text.replace(ALLOWED[chars], '').slice(0, length);

  const [inner, setInner] = useState(() => clean(defaultValue));
  const current = value !== undefined ? clean(value) : inner;
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(0);
  // The index of the character that is shown before it turns into a bullet.
  const [revealed, setRevealed] = useState<number | null>(null);

  const input = useRef<HTMLInputElement | null>(null);
  const clicked = useRef<number | null>(null);

  // Clamps the active box to the filled ones plus the next empty one.
  const at = Math.min(active, current.length, length - 1);

  // The native selection follows the active box: a filled box is selected so typing replaces it.
  useLayoutEffect(() => {
    const el = input.current;
    if (!el || !focused || document.activeElement !== el) return;
    el.setSelectionRange(at, at < current.length ? at + 1 : at);
  }, [at, current, focused]);

  useEffect(() => {
    if (revealed == null) return;
    const timer = setTimeout(() => setRevealed(null), maskDelay);
    return () => clearTimeout(timer);
  }, [revealed, maskDelay]);

  const set = (next: string, caret: number) => {
    if (value === undefined) setInner(next);
    setActive(caret);
    if (next === current) return;
    onValueChange?.(next);
    if (next.length === length) onComplete?.(next);
  };

  const move = (to: number) => setActive(Math.max(0, Math.min(to, current.length, length - 1)));

  // Box sizes; groups that do not add up to length are ignored.
  const parts = groups && groups.length > 1 && groups.every((g) => g > 0) && groups.reduce((a, b) => a + b, 0) === length ? groups : [length];
  let start = 0;
  const rows = parts.map((count) => {
    const indexes = Array.from({ length: count }, (_, i) => start + i);
    start += count;
    return indexes;
  });

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-size={size}
      data-error={invalid || undefined}
      data-disabled={disabled || undefined}
    >
      <input
        ref={(el) => {
          input.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        {...rest}
        id={id ?? field?.id}
        type="text"
        className={styles.input}
        value={current}
        maxLength={length}
        autoComplete={autoComplete}
        inputMode={inputMode ?? (chars === 'numeric' ? 'numeric' : 'text')}
        pattern={chars === 'numeric' ? '[0-9]*' : undefined}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={[describedBy, field?.describedBy].filter(Boolean).join(' ') || undefined}
        onChange={(e) => {
          const el = e.target;
          const raw = el.value;
          // An SMS code (autofill) fills the boxes from the start.
          const pasted = raw.length > current.length + 1;
          const next = clean(raw);
          const caret = pasted ? next.length : clean(raw.slice(0, el.selectionStart ?? raw.length)).length;
          if (mask && !pasted && next.length >= current.length && caret > 0) setRevealed(caret - 1);
          else setRevealed(null);
          set(next, caret);
          // Characters that are not allowed are dropped; the selection is put back.
          if (next === current) requestAnimationFrame(() => el.setSelectionRange(at, at < current.length ? at + 1 : at));
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.defaultPrevented) return;
          const keys: Record<string, number> = { ArrowLeft: at - 1, ArrowRight: at + 1, Home: 0, End: length };
          if (e.key in keys) {
            e.preventDefault();
            move(keys[e.key]!);
          } else if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            setRevealed(null);
            // A filled box is cleared in place; from an empty box Backspace clears the one before.
            if (at < current.length) set(current.slice(0, at) + current.slice(at + 1), at);
            else if (e.key === 'Backspace' && at > 0) set(current.slice(0, at - 1), at - 1);
          }
        }}
        onPaste={(e) => {
          e.preventDefault();
          const text = clean(e.clipboardData.getData('text'));
          if (!text) return;
          setRevealed(null);
          // A whole code replaces the boxes; a shorter piece goes in from the active box.
          if (text.length >= length) set(text, length);
          else set(clean(current.slice(0, at) + text + current.slice(at + text.length)), at + text.length);
        }}
        onFocus={(e) => {
          setFocused(true);
          setActive(clicked.current ?? current.length);
          clicked.current = null;
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          setRevealed(null);
          onBlur?.(e);
        }}
      />
      {rows.map((indexes, g) => (
        <Fragment key={g}>
          {g > 0 && (
            <span className={styles.separator} aria-hidden="true">
              <IconRemove />
            </span>
          )}
          <div className={styles.group} aria-hidden="true">
            {indexes.map((i) => {
              const char = current[i];
              const isActive = focused && i === at;
              return (
                <div
                  key={i}
                  className={styles.slot}
                  data-active={isActive || undefined}
                  data-filled={char != null || undefined}
                  onMouseDown={(e) => {
                    if (disabled) return;
                    e.preventDefault();
                    const to = Math.min(i, current.length, length - 1);
                    if (document.activeElement === input.current) move(to);
                    else {
                      clicked.current = to;
                      input.current?.focus();
                    }
                  }}
                >
                  {char != null ? (
                    mask ? (
                      // The character shrinks into a circle; both stay in the box so the change animates.
                      <span className={styles.masked} data-hidden={i !== revealed || undefined}>
                        <span className={styles.char}>{char}</span>
                        <span className={styles.dot} />
                      </span>
                    ) : (
                      char
                    )
                  ) : isActive ? (
                    <span className={styles.caret} />
                  ) : null}
                </div>
              );
            })}
          </div>
        </Fragment>
      ))}
    </div>
  );
});
