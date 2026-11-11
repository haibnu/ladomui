'use client';

import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Input, type InputProps } from '../Input/Input';
import { InlinePicker } from '../Picker/InlinePicker';
import { COUNTRY_DATA, FLAG_SVG } from './countries';
import { CountryFlag } from './flags';
import { cleanPaste, digitCount, formatNational, maskNational, type Country } from './phoneFormat';
import styles from './GsmInput.module.css';

// Figma: Components / Input, 🎛 Type=GSM (1591:5, Typed 1593:54). The flag and its chevron open
// the country list (the Selectbox one: a Dropdown of Cells); the calling code and the national
// number follow, masked as they are typed. A pasted number loses its "+90", "0090" or trunk "0"
// before it is written. Every country is listed by default (Turkey first, the rest by name);
// flags are Figma's for TR and US and country-flag-icons for the others. countrySelect={false}
// fixes the country and shows only its calling code.
export type GsmCountry = Country & {
  /** A 24px flag; by default the built-in one for the code, or the code where there is none. */
  flag?: ReactNode;
};

export type GsmInputProps = Omit<
  InputProps,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'prefix' | 'suffix' | 'inputMode' | 'name' | 'iconLeft'
> & {
  /** The number in E.164, e.g. "+905321234567", or null when it is empty. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null, detail: { country: string; national: string; complete: boolean }) => void;
  /** ISO 3166-1 alpha-2 code of the country, e.g. "TR". */
  country?: string;
  defaultCountry?: string;
  onCountryChange?: (country: string) => void;
  /** The countries in the list, in order. */
  countries?: GsmCountry[];
  /** Shows the country list; false leaves the country fixed. */
  countrySelect?: boolean;
  /** Language of the country names in the list. */
  locale?: string;
  /** Form field names: the number is submitted in E.164, the country as its code. */
  name?: string;
  countryName?: string;
  /** Name of the country picker. */
  countryLabel?: string;
};

/** Every country, Turkey first; the list sorts the rest by name in its locale. */
export const DEFAULT_COUNTRIES: GsmCountry[] = COUNTRY_DATA;

const placeholderOf = (c: Country) => c.placeholder ?? c.format.replace(/#/g, 'X');

function regionNames(locale: string): (code: string) => string {
  try {
    const names = new Intl.DisplayNames([locale], { type: 'region' });
    return (code) => names.of(code) ?? code;
  } catch {
    return (code) => code;
  }
}

/** Splits an E.164 number into a listed country and its national digits. */
function parse(value: string | null | undefined, current: GsmCountry, countries: GsmCountry[]) {
  if (!value) return { country: current, digits: '' };
  const { digits, country } = cleanPaste(value.startsWith('+') ? value : `+${value}`, current, countries);
  return { country: country as GsmCountry, digits };
}

export const GsmInput = forwardRef<HTMLInputElement, GsmInputProps>(function GsmInput(
  {
    value,
    defaultValue = null,
    onValueChange,
    country: countryProp,
    defaultCountry,
    onCountryChange,
    countries: countriesProp,
    countrySelect = true,
    locale = 'en-US',
    name,
    countryName: countryField,
    countryLabel = 'Country',
    size = 'medium',
    disabled,
    placeholder,
    onKeyDown,
    onPaste,
    className,
    ...rest
  },
  ref,
) {
  const nameOf = useMemo(() => regionNames(locale), [locale]);
  // A list that is passed keeps its order; the default one is sorted by name, Turkey first.
  const countries = useMemo(
    () =>
      countriesProp ??
      [...DEFAULT_COUNTRIES].sort((a, b) => (a.code === 'TR' ? -1 : b.code === 'TR' ? 1 : nameOf(a.code).localeCompare(nameOf(b.code), locale))),
    [countriesProp, nameOf, locale],
  );
  const first = countries.find((c) => c.code === defaultCountry) ?? countries[0]!;
  const initial = useMemo(() => parse(value !== undefined ? value : defaultValue, first, countries), []);
  const [innerCountry, setInnerCountry] = useState(initial.country.code);
  const code = countryProp ?? innerCountry;
  const country = countries.find((c) => c.code === code) ?? countries[0]!;

  const [digits, setDigits] = useState(initial.digits);
  const e164 = (c: Country, d: string) => (d ? `+${c.dial}${d}` : null);
  const emitted = useRef(e164(country, digits));
  // A new value from outside is split into its country and number.
  useEffect(() => {
    if (value !== undefined && value !== emitted.current) {
      emitted.current = value;
      const next = parse(value, country, countries);
      setDigits(next.digits);
      if (next.country !== country) setCountry(next.country, false);
    }
  }, [value]);

  const field = useRef<HTMLInputElement | null>(null);
  const caret = useRef<number | null>(null);
  const text = formatNational(digits, country.format);
  useLayoutEffect(() => {
    if (caret.current != null && field.current === document.activeElement) field.current?.setSelectionRange(caret.current, caret.current);
    caret.current = null;
  }, [text]);

  const emit = (c: Country, d: string) => {
    const next = e164(c, d);
    if (next === emitted.current) return;
    emitted.current = next;
    onValueChange?.(next, { country: c.code, national: d, complete: d.length >= (c.minDigits ?? digitCount(c.format)) });
  };
  function setCountry(c: GsmCountry, notify = true) {
    if (countryProp === undefined) setInnerCountry(c.code);
    if (notify && c.code !== code) onCountryChange?.(c.code);
  }
  const update = (c: GsmCountry, d: string) => {
    if (c !== country) setCountry(c);
    setDigits(d);
    emit(c, d);
  };

  const flag = (c: GsmCountry) =>
    c.flag ?? (FLAG_SVG[c.code] || c.code === 'TR' || c.code === 'US' ? <CountryFlag code={c.code} /> : <span className={styles.code}>{c.code}</span>);
  const options = useMemo(
    () => countries.map((c) => ({ value: c.code, trigger: flag(c), iconLeft: flag(c), title: nameOf(c.code), bodycopy: `+${c.dial}`, search: nameOf(c.code) })),
    [countries, nameOf],
  );
  const lead = (
    <span className={styles.lead}>
      {countrySelect ? (
        <InlinePicker
          value={country.code}
          options={options}
          size={size}
          disabled={disabled}
          label={countryLabel}
          align="start"
          arrow="small"
          onPick={(next) => {
            const c = countries.find((x) => x.code === next)!;
            update(c, digits.slice(0, digitCount(c.format)));
          }}
          onDone={() => field.current?.focus()}
        />
      ) : null}
      <span className={styles.dial}>{country.dial}</span>
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
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        size={size}
        disabled={disabled}
        className={[styles.box, className].filter(Boolean).join(' ')}
        placeholder={placeholder ?? placeholderOf(country)}
        value={text}
        prefix={lead}
        onChange={(e) => {
          const m = maskNational(e.target.value, e.target.selectionStart ?? e.target.value.length, country.format);
          caret.current = m.caret;
          update(country, m.digits);
        }}
        onPaste={(e) => {
          onPaste?.(e);
          if (e.defaultPrevented) return;
          const pasted = e.clipboardData.getData('text');
          const el = e.currentTarget;
          const whole = (el.selectionStart ?? 0) === 0 && (el.selectionEnd ?? 0) >= text.length;
          // A whole number (into an empty or fully selected field) is cleaned of its country code
          // and trunk "0"; a few digits pasted inside the number go through the usual mask.
          if (!whole && !/^\s*(\+|00)/.test(pasted)) return;
          e.preventDefault();
          const clean = cleanPaste(pasted, country, countries);
          caret.current = formatNational(clean.digits, clean.country.format).length;
          update(clean.country as GsmCountry, clean.digits);
        }}
        onKeyDown={(e) => {
          // Deleting next to a formatting character deletes the digit behind it.
          const el = e.currentTarget;
          let at = el.selectionStart ?? 0;
          if (at === el.selectionEnd) {
            if (e.key === 'Backspace') {
              while (at > 0 && !/\d/.test(text[at - 1]!)) at--;
              el.setSelectionRange(at, at);
            }
            if (e.key === 'Delete') {
              while (at < text.length && !/\d/.test(text[at]!)) at++;
              el.setSelectionRange(at, at);
            }
          }
          onKeyDown?.(e);
        }}
        {...rest}
      />
      {name != null && <input type="hidden" name={name} value={e164(country, digits) ?? ''} />}
      {countryField != null && <input type="hidden" name={countryField} value={country.code} />}
    </>
  );
});
