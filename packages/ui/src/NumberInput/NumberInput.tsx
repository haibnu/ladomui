'use client';

import { forwardRef, useEffect, useState } from 'react';
import { IconAdd, IconRemove } from '@ladom/icons';
import { Button } from '../Button/Button';
import { Input, type InputProps } from '../Input/Input';

// Figma: Components / Input / Number Input (4238:3913). size = 👕 Size, 🕹 State = :focus-within,
// error and disabled. The Input box with tiny ghost buttons that step the value; min and max
// disable them at the limits. Typing is free; the value is clamped and rounded to step on blur.
export type NumberInputProps = Omit<InputProps, 'type' | 'value' | 'defaultValue' | 'onChange' | 'iconLeft' | 'iconRight' | 'prefix' | 'suffix' | 'min' | 'max' | 'step'> & {
  value?: number | null;
  defaultValue?: number | null;
  /** Called with the number, or null when the field is empty. */
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  decrementLabel?: string;
  incrementLabel?: string;
};

const decimals = (n: number) => (String(n).split('.')[1] ?? '').length;

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { value, defaultValue = null, onValueChange, min, max, step = 1, disabled, decrementLabel = 'Decrease', incrementLabel = 'Increase', onBlur, ...rest },
  ref,
) {
  const [inner, setInner] = useState<number | null>(defaultValue);
  const current = value !== undefined ? value : inner;
  const [text, setText] = useState(current == null ? '' : String(current));
  useEffect(() => {
    if (value !== undefined) setText(value == null ? '' : String(value));
  }, [value]);

  const set = (next: number | null, show = true) => {
    if (value === undefined) setInner(next);
    if (show) setText(next == null ? '' : String(next));
    if (next !== current) onValueChange?.(next);
  };
  const clamp = (n: number) => {
    const places = Math.max(decimals(step), decimals(min ?? 0));
    const rounded = Number(n.toFixed(places));
    return Math.min(max ?? Infinity, Math.max(min ?? -Infinity, rounded));
  };
  const stepBy = (dir: 1 | -1) => set(clamp((current ?? min ?? 0) + dir * step));

  return (
    <Input
      ref={ref}
      type="number"
      inputMode={decimals(step) ? 'decimal' : 'numeric'}
      value={text}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      onChange={(e) => {
        setText(e.target.value);
        const n = e.target.value === '' ? null : Number(e.target.value);
        if (n === null || !Number.isNaN(n)) set(n, false);
      }}
      onBlur={(e) => {
        if (current != null && clamp(current) !== current) set(clamp(current));
        else setText(current == null ? '' : String(current));
        onBlur?.(e);
      }}
      iconLeft={
        <Button
          variant="ghost"
          tone="tertiary"
          size="tiny"
          icon={IconRemove}
          aria-label={decrementLabel}
          tabIndex={-1}
          disabled={disabled || (min != null && current != null && current <= min)}
          onClick={() => stepBy(-1)}
        />
      }
      iconRight={
        <Button
          variant="ghost"
          tone="tertiary"
          size="tiny"
          icon={IconAdd}
          aria-label={incrementLabel}
          tabIndex={-1}
          disabled={disabled || (max != null && current != null && current >= max)}
          onClick={() => stepBy(1)}
        />
      }
      {...rest}
    />
  );
});
