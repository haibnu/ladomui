// Masking helpers of CurrencyInput: the locale's group and decimal separators, the currency's
// fraction digits and symbol, and the formatting of typed text with the caret kept in place.
// Grouping is always by three and digits are always Latin, so typed text and numbers match.

export type Separators = { group: string; decimal: string };

export function separators(locale: string): Separators {
  const parts = new Intl.NumberFormat(locale, { numberingSystem: 'latn' }).formatToParts(1234567.5);
  const group = parts.find((p) => p.type === 'group')?.value ?? ',';
  const decimal = parts.find((p) => p.type === 'decimal')?.value ?? '.';
  // Some locales group with a (narrow) no-break space; a plain space is easier to type over.
  return { group: /\s/.test(group) ? ' ' : group, decimal };
}

/** The currency's minor unit digits: 2 for USD, 0 for JPY, 3 for KWD. */
export function fractionDigits(currency: string): number {
  try {
    return new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  } catch {
    return 2;
  }
}

/** The narrow symbol and whether the locale writes it before the amount ("$1" or "1 €"). */
export function currencySymbol(locale: string, currency: string): { symbol: string; before: boolean } {
  try {
    const parts = new Intl.NumberFormat(locale, { style: 'currency', currency, currencyDisplay: 'narrowSymbol' }).formatToParts(1);
    const at = parts.findIndex((p) => p.type === 'currency');
    const number = parts.findIndex((p) => p.type === 'integer');
    return { symbol: parts[at]?.value ?? currency, before: at < number };
  } catch {
    return { symbol: currency, before: true };
  }
}

export function currencyName(locale: string, currency: string): string | undefined {
  try {
    return new Intl.DisplayNames(locale, { type: 'currency' }).of(currency);
  } catch {
    return undefined;
  }
}

const group3 = (digits: string, sep: string) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, sep);

/** The number as the field shows it after blur: grouped, with every fraction digit. */
export function formatAmount(value: number, sep: Separators, decimals: number): string {
  const negative = value < 0;
  const [int = '0', frac = ''] = Math.abs(value).toFixed(decimals).split('.');
  return (negative ? '-' : '') + group3(int, sep.group) + (decimals > 0 ? sep.decimal + frac : '');
}

export type Masked = { text: string; value: number | null; caret: number };

/**
 * Cleans typed text: keeps digits, one decimal separator (a "." or "," that is not the group
 * separator counts as one, so both keyboard habits work), an optional
 * leading minus, at most `decimals` fraction digits, and regroups the integer part. The caret
 * stays after the same digit it was after.
 */
export function mask(raw: string, caret: number, sep: Separators, decimals: number, allowNegative: boolean): Masked {
  let negative = false;
  let int = '';
  let frac = '';
  let hasDecimal = false;
  let before = 0; // digits and the decimal separator before the caret
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i]!;
    const counted = i < caret;
    if (ch >= '0' && ch <= '9') {
      if (hasDecimal) {
        if (frac.length < decimals) {
          frac += ch;
          if (counted) before++;
        }
      } else {
        int += ch;
        if (counted) before++;
      }
    } else if (ch === '-' && allowNegative && int === '' && !hasDecimal) {
      negative = !negative;
    } else if (decimals > 0 && !hasDecimal && (ch === sep.decimal || ((ch === '.' || ch === ',') && ch !== sep.group))) {
      hasDecimal = true;
      if (counted) before++;
    }
  }
  // Leading zeros go, but "0" stays before the decimal separator.
  const trimmed = int.replace(/^0+(?=\d)/, '');
  before = Math.max(0, before - (int.length - trimmed.length));
  int = trimmed;
  if (int === '' && hasDecimal) {
    int = '0';
    before++;
  }
  const sign = negative ? '-' : '';
  const text = sign + group3(int, sep.group) + (hasDecimal ? sep.decimal + frac : '');
  // Walk the new text to the same count of digits and separators.
  let pos = sign.length;
  let seen = 0;
  while (pos < text.length && seen < before) {
    if (text[pos] !== sep.group) seen++;
    pos++;
  }
  const value = int === '' ? null : Number(`${sign}${int}.${frac || '0'}`);
  return { text, value, caret: pos };
}
