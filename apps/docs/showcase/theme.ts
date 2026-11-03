// Brand color, radius, mode and density of one showcase, applied to its container only.
export type Radius = 'modern' | 'rounded' | 'circle';
export type Mode = 'light' | 'dark';
export type Density = 'comfort' | 'narrow';

export type Settings = { theme: string; radius: Radius; mode: Mode; density: Density };

/** Example brand colors; any #rgb / #rrggbb works as well. */
export const PRESETS: Record<string, string> = { stone: '#3c3c3c', sky: '#0ea5e9', sunrise: '#f97316' };

export const DEFAULTS: Settings = { theme: 'stone', radius: 'modern', mode: 'light', density: 'comfort' };

export const RADII: Radius[] = ['modern', 'rounded', 'circle'];

/** A preset name or a hex color to #rrggbb; null when it is neither. */
export function resolveColor(value: string): string | null {
  const v = value.trim().toLowerCase();
  if (PRESETS[v]) return PRESETS[v]!;
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/.exec(v);
  if (!m) return null;
  const h = m[1]!.length === 3 ? [...m[1]!].map((c) => c + c).join('') : m[1]!;
  return `#${h}`;
}

type Rgb = [number, number, number];
const toRgb = (hex: string): Rgb => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as Rgb;
const toHex = (c: Rgb) => `#${c.map((n) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0')).join('')}`;
const mix = (a: Rgb, b: Rgb, t: number): Rgb => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

const WHITE: Rgb = [255, 255, 255];
const BLACK: Rgb = [0, 0, 0];
const SURFACE_DARK: Rgb = [26, 26, 26];

const luminance = ([r, g, b]: Rgb) => {
  const f = (c: number) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

/**
 * The tokens that follow the brand color. --color-static-brand-color drives primary and the link
 * color; natural, tint, shade and soft are mixed from it the way the default Stone scale relates
 * to #3c3c3c, and on-primary flips to dark text when white would not read.
 */
export function brandTokens(hex: string, mode: Mode): Record<string, string> {
  const c = toRgb(hex);
  const dark = mode === 'dark';
  const onPrimary = luminance(c) > 0.4 ? '#1a1711' : '#ffffff';
  return {
    '--color-static-brand-color': hex,
    '--color-primary-natural': toHex(mix(c, WHITE, 0.06)),
    '--color-primary-tint': toHex(mix(c, WHITE, 0.16)),
    '--color-primary-shade': toHex(mix(c, BLACK, 0.4)),
    '--color-primary-soft': toHex(dark ? mix(c, SURFACE_DARK, 0.78) : mix(c, WHITE, 0.9)),
    '--color-link-color-light': toHex(mix(c, WHITE, 0.16)),
    '--color-on-primary': onPrimary,
    '--color-on-primary-tint': onPrimary === '#ffffff' ? '#ffffffa3' : '#1a1711a3',
  };
}
