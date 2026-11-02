'use client';

import { forwardRef, useEffect, useState, type TextareaHTMLAttributes } from 'react';
import { IconError } from '@ladom/icons';
import { useFieldContext } from '../FormField/FormField';
import input from '../Input/Input.module.css';
import styles from './Textarea.module.css';

// Figma: Components / Input / Textarea (1212:1629), Type=Normal; the count is Textarea / Count
// (4238:3914). It shares the Input box: error = Error, disabled = Disabled, 🕹 State is :hover,
// :focus-within and a filled value. showCount puts "length/maxLength" at the end of the hint row
// (inside a FormField) or under the box.
export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
  /** Shows the character count; over maxLength it turns to the error color. */
  showCount?: boolean;
  /** Shows a state without interaction (docs, visual tests). */
  'data-state'?: 'hover' | 'focus' | 'typed';
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { error, showCount = false, className, disabled, id, placeholder, rows = 3, value, defaultValue, onChange, maxLength, 'aria-describedby': describedBy, 'data-state': forcedState, ...rest },
  ref,
) {
  const field = useFieldContext();
  const invalid = error ?? field?.invalid ?? false;
  const [innerLength, setInnerLength] = useState(String(defaultValue ?? '').length);
  const length = value !== undefined ? String(value).length : innerLength;
  const over = maxLength != null && length > maxLength;
  const count = showCount ? (
    <span className={styles.count} data-over={over || undefined}>
      {maxLength != null ? `${length}/${maxLength}` : length}
    </span>
  ) : null;

  // In a FormField the count goes to the end of its hint row.
  const setCount = field?.setCount;
  useEffect(() => {
    if (!setCount) return;
    setCount(count);
    return () => setCount(null);
  }, [setCount, length, maxLength, showCount, over]);

  const box = (
    <div
      className={[input.box, styles.box, className].filter(Boolean).join(' ')}
      data-size="medium"
      data-error={invalid || undefined}
      data-disabled={disabled || undefined}
      data-state={forcedState}
    >
      <textarea
        ref={ref}
        id={id ?? field?.id}
        rows={rows}
        disabled={disabled}
        // A placeholder is needed for :placeholder-shown, which drives the filled (Typed) style.
        placeholder={placeholder ?? ' '}
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        onChange={(e) => {
          setInnerLength(e.target.value.length);
          onChange?.(e);
        }}
        aria-invalid={invalid || undefined}
        aria-describedby={[describedBy, field?.describedBy].filter(Boolean).join(' ') || undefined}
        className={[input.input, styles.textarea].join(' ')}
        {...rest}
      />
      {invalid && <IconError size={16} className={[input.errorIcon, styles.errorIcon].join(' ')} />}
    </div>
  );

  if (!count || setCount) return box;
  return (
    <div className={styles.wrap}>
      {box}
      <div className={styles.countRow}>{count}</div>
    </div>
  );
});
