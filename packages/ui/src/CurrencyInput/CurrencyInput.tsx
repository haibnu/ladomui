'use client';

import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Input, type InputProps } from '../Input/Input';
import { InlinePicker } from '../Picker/InlinePicker';
import { currencyName, currencySymbol, formatAmount, fractionDigits, mask, separators } from './currencyFormat';
import styles from './CurrencyInput.module.css';

// Not drawn in Figma: built from Input (1133:303) and the Selectbox list, a Dropdown (1145:669) of
// Cells (87:46114). The amount is masked as it is typed: the locale's group separator every three
// digits, one decimal separator ("." or "," both work) and the currency's fraction digits, padded
// on blur. The currency picker sits at the end of the box; currencySelect={false} removes it and
// showSymbol={false} hides the symbol.
export type CurrencyInputProps = Omit<
  InputProps,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'prefix' | 'suffix' | 'inputMode' | 'name'
> & {
  /** The amount, or null when the field is empty. */
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  /** ISO 4217 code, e.g. "USD". */
  currency?: string;
  defaultCurrency?: string;
  onCurrencyChange?: (currency: string) => void;
  /** The codes in the picker. */
  currencies?: string[];
  /** Shows the currency picker; false leaves the currency fixed. */
  currencySelect?: boolean;
  /** Shows the currency symbol ("$", "₺") before or after the amount, as the locale writes it. */
  showSymbol?: boolean;
  /** Sets the separators and the symbol's place, e.g. "tr-TR" gives 1.234,56. */
  locale?: string;
  /** Fraction digits; the currency's own by default (2 for USD, 0 for JPY). */
  decimals?: number;
  allowNegative?: boolean;
  /** Form field names: the amount is submitted as a plain number, the currency as its code. */
  name?: string;
  currencyName?: string;
  /** Name of the currency picker. */
  currencyLabel?: string;
};

export const DEFAULT_CURRENCIES = ['USD', 'EUR', 'GBP', 'TRY'];

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(function CurrencyInput(
  {
    value,
    defaultValue = null,
    onValueChange,
    currency: currencyProp,
    defaultCurrency,
    onCurrencyChange,
    currencies = DEFAULT_CURRENCIES,
    currencySelect = true,
    showSymbol = true,
    locale = 'en-US',
    decimals: decimalsProp,
    allowNegative = false,
    name,
    currencyName: currencyField,
    currencyLabel = 'Currency',
    size = 'medium',
    disabled,
    onBlur,
    onKeyDown,
    className,
    ...rest
  },
  ref,
) {
  const [innerCurrency, setInnerCurrency] = useState(defaultCurrency ?? currencies[0] ?? 'USD');
  const currency = currencyProp ?? innerCurrency;
  const sep = useMemo(() => separators(locale), [locale]);
  const decimals = decimalsProp ?? fractionDigits(currency);
  const symbol = useMemo(() => currencySymbol(locale, currency), [locale, currency]);

  const [inner, setInner] = useState<number | null>(defaultValue);
  const current = value !== undefined ? value : inner;
  const show = (n: number | null) => (n == null ? '' : formatAmount(n, sep, decimals));
  const [text, setText] = useState(() => show(current));
  const emitted = useRef(current);
  // A new value from outside (or a new locale or currency) is shown formatted.
  useEffect(() => {
    if (value !== undefined && value !== emitted.current) {
      emitted.current = value;
      setText(show(value));
    }
  }, [value]);
  useEffect(() => {
    setText(show(current));
  }, [sep, decimals]);

  const field = useRef<HTMLInputElement | null>(null);
  const caret = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (caret.current != null && field.current === document.activeElement) field.current?.setSelectionRange(caret.current, caret.current);
    caret.current = null;
  }, [text]);

  const set = (next: number | null) => {
    emitted.current = next;
    if (value === undefined) setInner(next);
    if (next !== current) onValueChange?.(next);
  };

  const pickCurrency = (code: string) => {
    if (currencyProp === undefined) setInnerCurrency(code);
    if (code !== currency) onCurrencyChange?.(code);
  };

  const affix = showSymbol ? <span className={styles.symbol}>{symbol.symbol}</span> : undefined;
  const picker = currencySelect ? (
    <InlinePicker
      value={currency}
      options={currencies.map((code) => ({ value: code, trigger: code, title: code, bodycopy: currencyName(locale, code), search: code }))}
      size={size}
      disabled={disabled}
      label={currencyLabel}
      align="end"
      className={styles.picker}
      onPick={pickCurrency}
      onDone={() => field.current?.focus()}
    />
  ) : null;

  return (
    <>
      <Input
        ref={(el) => {
          field.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        type="text"
        inputMode={decimals > 0 ? 'decimal' : 'numeric'}
        autoComplete="off"
        size={size}
        disabled={disabled}
        className={[styles.box, className].filter(Boolean).join(' ')}
        value={text}
        prefix={symbol.before ? affix : undefined}
        suffix={
          !symbol.before || picker ? (
            <>
              {!symbol.before && affix}
              {picker}
            </>
          ) : undefined
        }
        onChange={(e) => {
          const m = mask(e.target.value, e.target.selectionStart ?? e.target.value.length, sep, decimals, allowNegative);
          caret.current = m.caret;
          setText(m.text);
          set(m.value);
        }}
        onKeyDown={(e) => {
          // Deleting next to a group separator deletes the digit behind it.
          const el = e.currentTarget;
          const at = el.selectionStart ?? 0;
          if (at === el.selectionEnd) {
            if (e.key === 'Backspace' && text[at - 1] === sep.group) el.setSelectionRange(at - 1, at - 1);
            if (e.key === 'Delete' && text[at] === sep.group) el.setSelectionRange(at + 1, at + 1);
          }
          onKeyDown?.(e);
        }}
        onBlur={(e) => {
          setText(show(current));
          onBlur?.(e);
        }}
        {...rest}
      />
      {name != null && <input type="hidden" name={name} value={current ?? ''} />}
      {currencyField != null && <input type="hidden" name={currencyField} value={currency} />}
    </>
  );
});
