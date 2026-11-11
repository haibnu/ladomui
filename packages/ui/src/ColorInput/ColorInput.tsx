'use client';

import { forwardRef, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { IconAdd } from '@ladom/icons';
import { Input, type InputProps } from '../Input/Input';
import { Popover } from '../Popover/Popover';
import styles from './ColorInput.module.css';

// Not drawn in Figma yet: built from Input (1133:303) and Popover (4201:12502). A swatch at the
// start of the box shows the color; it opens the browser's color picker, or, with presets, a
// Popover of preset swatches and a custom one that opens the picker. The hex code is typed after
// a "#" (Leading Text), in capitals: six digits apply as they are typed, three ("f60") on blur or Enter.
// A value that is not a hex code is never reported; the field goes back to the last color on blur.
export type ColorInputProps = Omit<
  InputProps,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'prefix' | 'inputMode' | 'name' | 'iconLeft' | 'maxLength'
> & {
  /** The color as "#rrggbb". Three-digit and upper-case codes are accepted and normalized. */
  value?: string;
  defaultValue?: string;
  /** Called with a valid "#rrggbb" code only. */
  onValueChange?: (value: string) => void;
  /** Colors offered in a Popover under the swatch; without them the swatch opens the picker. */
  presets?: string[];
  /** Form field name: the color is submitted as "#rrggbb". */
  name?: string;
  /** Name of the swatch button. */
  pickerLabel?: string;
  /** Name of the custom color swatch in the presets. */
  customLabel?: string;
  /** Name of the presets group. */
  presetsLabel?: string;
};

/** "#F60", "f60" or "#ff6600" -> "#ff6600"; anything else -> null. */
export function normalizeHex(input: string): string | null {
  const hex = input.trim().replace(/^#/, '').toLowerCase();
  if (/^[0-9a-f]{6}$/.test(hex)) return `#${hex}`;
  if (/^[0-9a-f]{3}$/.test(hex)) return `#${[...hex].map((c) => c + c).join('')}`;
  return null;
}

// The code is shown in capitals after the "#"; the value stays lower-case.
const shown = (hex: string) => hex.slice(1).toUpperCase();

const swatchStyle = (color: string) => ({ '--_color': color }) as CSSProperties;

export const ColorInput = forwardRef<HTMLInputElement, ColorInputProps>(function ColorInput(
  {
    value,
    defaultValue = '#000000',
    onValueChange,
    presets,
    name,
    pickerLabel = 'Pick a color',
    customLabel = 'Custom color',
    presetsLabel = 'Colors',
    size = 'medium',
    disabled,
    onBlur,
    onKeyDown,
    className,
    ...rest
  },
  ref,
) {
  const [inner, setInner] = useState(() => normalizeHex(defaultValue) ?? '#000000');
  const current = (value !== undefined ? normalizeHex(value) : null) ?? inner;
  const [text, setText] = useState(shown(current));
  const [open, setOpen] = useState(false);
  const emitted = useRef(current);
  // A new value from outside is shown.
  useEffect(() => {
    if (current !== emitted.current) {
      emitted.current = current;
      setText(shown(current));
    }
  }, [current]);

  // Capitalizing or dropping a character rewrites the text; the caret stays where it was typed.
  const field = useRef<HTMLInputElement | null>(null);
  const caret = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (caret.current != null && field.current === document.activeElement) field.current?.setSelectionRange(caret.current, caret.current);
    caret.current = null;
  }, [text]);

  const set = (next: string) => {
    emitted.current = next;
    setText(shown(next));
    if (value === undefined) setInner(next);
    if (next !== current) onValueChange?.(next);
  };

  // Applies a three- or six-digit code, or puts the last color back.
  const commit = () => {
    const next = normalizeHex(text);
    if (next) set(next);
    else setText(shown(current));
  };

  const native = (label: string) => (
    <input
      type="color"
      className={styles.native}
      value={current}
      disabled={disabled}
      aria-label={label}
      onChange={(e) => {
        const next = normalizeHex(e.target.value);
        if (next) set(next);
      }}
    />
  );

  const list = presets?.map((p) => normalizeHex(p)).filter((p): p is string => p != null) ?? [];
  const swatch = list.length ? (
    <Popover
      open={open}
      onOpenChange={setOpen}
      placement="bottom-start"
      className={styles.popover}
      trigger={<button type="button" className={styles.swatch} style={swatchStyle(current)} disabled={disabled} aria-label={pickerLabel} />}
    >
      <div className={styles.presets} role="group" aria-label={presetsLabel}>
        {list.map((color) => (
          <button
            key={color}
            type="button"
            className={styles.preset}
            style={swatchStyle(color)}
            aria-label={color}
            aria-pressed={color === current}
            onClick={() => {
              set(color);
              setOpen(false);
            }}
          />
        ))}
        <span className={styles.preset} data-custom="" data-selected={!list.includes(current) || undefined}>
          <IconAdd />
          {native(customLabel)}
        </span>
      </div>
    </Popover>
  ) : (
    <span className={styles.swatch} style={swatchStyle(current)}>
      {native(pickerLabel)}
    </span>
  );

  return (
    <>
      <Input
        ref={(el) => {
          field.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        type="text"
        autoComplete="off"
        spellCheck={false}
        size={size}
        disabled={disabled}
        className={[styles.box, className].filter(Boolean).join(' ')}
        value={text}
        prefix={
          <span className={styles.lead}>
            {swatch}
            <span aria-hidden="true">#</span>
          </span>
        }
        onChange={(e) => {
          const clean = (t: string) => t.replace(/^#+/, '').replace(/[^0-9a-f]/gi, '');
          const el = e.target;
          const raw = clean(el.value).slice(0, 6);
          caret.current = Math.min(clean(el.value.slice(0, el.selectionStart ?? el.value.length)).length, raw.length);
          setText(raw.toUpperCase());
          if (raw.length === 6) set(`#${raw.toLowerCase()}`);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          onKeyDown?.(e);
        }}
        onBlur={(e) => {
          commit();
          onBlur?.(e);
        }}
        {...rest}
      />
      {name != null && <input type="hidden" name={name} value={current} />}
    </>
  );
});
