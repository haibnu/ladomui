// Phone number helpers for GsmInput. A country's format writes its national number with "#" for
// each digit, e.g. "(###) ### ## ##"; the number of "#" is the national number's length.

export type Country = {
  /** ISO 3166-1 alpha-2 code, e.g. "TR". */
  code: string;
  /** Calling code without "+", e.g. "90". */
  dial: string;
  /** The national number, "#" per digit. */
  format: string;
  /** Shown while the field is empty; the format with "X" by default. */
  placeholder?: string;
};

export const digitCount = (format: string) => format.split('').filter((c) => c === '#').length;

/** Writes the digits into the format; formatting characters after the last digit are left off. */
export function formatNational(digits: string, format: string): string {
  let out = '';
  let i = 0;
  for (const ch of format) {
    if (i >= digits.length) break;
    if (ch === '#') out += digits[i++];
    else out += ch;
  }
  return out;
}

/** The number of digits in text before the caret, and the caret after that many digits. */
const digitsBefore = (text: string, caret: number) => text.slice(0, caret).replace(/\D/g, '').length;
export function caretAfterDigits(text: string, n: number): number {
  if (n <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < text.length; i++) if (/\d/.test(text[i]!) && ++seen === n) return i + 1;
  return text.length;
}

/** Masks typed text: keeps digits, drops a leading trunk "0" and cuts at the national length. */
export function maskNational(raw: string, caret: number, format: string): { text: string; digits: string; caret: number } {
  let digits = raw.replace(/\D/g, '');
  let before = digitsBefore(raw, caret);
  while (digits.startsWith('0')) {
    digits = digits.slice(1);
    before = Math.max(0, before - 1);
  }
  digits = digits.slice(0, digitCount(format));
  const text = formatNational(digits, format);
  return { text, digits, caret: caretAfterDigits(text, Math.min(before, digits.length)) };
}

/**
 * Cleans a pasted number: an international prefix ("+90", "0090") or, for a number longer than
 * the national one, the bare calling code ("90532...") is removed, then a trunk "0". Returns the
 * national digits and, when the prefix belongs to another listed country, that country.
 */
export function cleanPaste(raw: string, current: Country, countries: Country[]): { digits: string; country: Country } {
  const trimmed = raw.trim();
  let digits = trimmed.replace(/\D/g, '');
  let country = current;
  const international = trimmed.startsWith('+') || digits.startsWith('00');
  if (digits.startsWith('00')) digits = digits.slice(2);
  // The current country first, then the longest matching calling code.
  const byDial = [current, ...countries.filter((c) => c !== current).sort((a, b) => b.dial.length - a.dial.length)];
  if (international) {
    const hit = byDial.find((c) => digits.startsWith(c.dial));
    if (hit) {
      country = hit;
      digits = digits.slice(hit.dial.length);
    }
  } else if (digits.startsWith(current.dial) && digits.replace(/^0+/, '').length > digitCount(current.format)) {
    digits = digits.slice(current.dial.length);
  }
  digits = digits.replace(/^0+/, '').slice(0, digitCount(country.format));
  return { digits, country };
}
