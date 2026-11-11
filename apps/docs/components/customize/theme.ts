// The docs "Customize" theme: a brand color (and, in Advanced, secondary and tertiary colors) and a
// density. The brand math is the same as `npx ladom-ui init` (packages/cli/bin/ladom-ui.mjs:
// primaryScale, contrastRoles, themeCss), so what the docs show is what init writes. Keep them in step.

export const DEFAULT_BRAND = '#3c3c3c';

export type Density = 'comfort' | 'narrow';
export type CustomTheme = {
  brand: string;
  density: Density;
  /** Advanced: replace the neutral secondary / tertiary surfaces. null keeps the Figma values. */
  secondary: string | null;
  tertiary: string | null;
};

export const DEFAULT_THEME: CustomTheme = { brand: DEFAULT_BRAND, density: 'comfort', secondary: null, tertiary: null };

// Ready-made brand colors for the panel.
export const PRESETS = ['#3c3c3c', '#2563eb', '#0f766e', '#16a34a', '#d9480f', '#e11d48', '#7c3aed', '#ca8a04', '#8ce99a'];

export const parseHex = (value: string) => {
  const m = String(value).trim().replace(/^#/, '').match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  const h = m[1]!.length === 3 ? [...m[1]!].map((c) => c + c).join('') : m[1]!;
  return `#${h.toLowerCase()}`;
};
const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toHex = (c: number[]) => `#${c.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')}`;
const mix = (hex: string, target: number, t: number) => toHex(rgb(hex).map((v) => v + (target - v) * t));
const luminance = (hex: string) => {
  const [r, g, b] = rgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
};
export const contrast = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x! + 0.05) / (y! + 0.05);
};
const primaryScale = (brand: string) => {
  const lightText = contrast(brand, '#ffffff') >= contrast(brand, '#1a1711');
  return {
    natural: mix(brand, 255, 0.067),
    tint: mix(brand, 255, 0.174),
    soft: mix(brand, 255, 0.908),
    shade: mix(brand, 0, 0.433),
    on: lightText ? '#ffffff' : 'var(--color-static-black-alpha-96)',
    onTint: lightText ? 'var(--color-static-white-alpha-64)' : 'var(--color-static-black-alpha-72)',
  };
};
const toHsl = (hex: string): [number, number, number] => {
  const [r, g, b] = rgb(hex).map((v) => v / 255) as [number, number, number];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
};
const fromHsl = ([h, s, l]: [number, number, number]) => {
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const ch = (t: number) => {
    const u = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
    return u < 1 / 6 ? p + (q - p) * 6 * u : u < 1 / 2 ? q : u < 2 / 3 ? p + (q - p) * (2 / 3 - u) * 6 : p;
  };
  return toHex([ch(h + 1 / 3), ch(h), ch(h - 1 / 3)].map((v) => v * 255));
};
function contrastSafe(brand: string, surfaces: string[], min: number, target: number) {
  const passes = (c: string) => Math.min(...surfaces.map((s) => contrast(c, s))) >= min;
  if (passes(brand)) return brand;
  const [h, s, l] = toHsl(brand);
  for (let step = 1; step <= 100; step++) {
    const c = fromHsl([h, s, Math.min(1, Math.max(0, l + (target ? 0.01 : -0.01) * step))]);
    if (passes(c)) return c;
  }
  return toHex([target, target, target]);
}
// The surfaces of tokens/color.css (light and dark), as init reads them.
const SURFACES = { light: ['#f2f2f2', '#ffffff', '#fafafa'], dark: ['#030805', '#1a1a1a', '#232323'] };
const ROLES = [
  { name: 'primary-foreground', min: 4.5 },
  { name: 'primary-line', min: 3 },
];

/** True when the brand is too light for text on the light surfaces (init then darkens text and lines). */
export const lowContrast = (brand: string) => Math.min(...SURFACES.light.map((s) => contrast(brand, s))) < 4.5;

// Secondary and tertiary in Advanced: a base color and the four steps the tokens use, from it.
const surfaceScale = (name: 'secondary' | 'tertiary', base: string) => [
  `  --color-${name}: ${base};`,
  `  --color-${name}-natural: ${mix(base, 255, 0.4)};`,
  `  --color-${name}-tint: ${base};`,
  `  --color-${name}-soft: ${mix(base, 255, 0.7)};`,
  `  --color-${name}-shade: ${mix(base, 0, 0.12)};`,
];

/** The CSS for a theme: what init's theme.css sets for the brand, plus the Advanced overrides. */
export function themeCss(theme: CustomTheme) {
  const out: string[] = [];
  const { brand } = theme;
  if (brand !== DEFAULT_BRAND) {
    const p = primaryScale(brand);
    out.push(
      `:root { --color-static-brand-color: ${brand}; }`,
      `:root, :root[data-theme="dark"] {`,
      `  --color-primary-natural: ${p.natural};`,
      `  --color-primary-tint: ${p.tint};`,
      `  --color-primary-soft: ${p.soft};`,
      `  --color-primary-shade: ${p.shade};`,
      `  --color-on-primary: ${p.on};`,
      `  --color-on-primary-tint: ${p.onTint};`,
      `}`,
    );
    for (const [mode, selector, target] of [
      ['light', ':root', 0],
      ['dark', ':root[data-theme="dark"]', 255],
    ] as const) {
      const surfaces = mode === 'light' ? [...SURFACES.light, p.soft] : SURFACES.dark;
      const set = ROLES.map((r) => [r.name, contrastSafe(brand, surfaces, r.min, target)] as const).filter(([, c]) => c !== brand);
      if (!set.length) continue;
      out.push(`${selector} {`, ...set.map(([n, c]) => `  --color-${n}: ${c};`));
      if (set.some(([n]) => n === 'primary-foreground')) out.push('  --color-link-color: var(--color-primary-foreground);');
      out.push('}');
    }
  }
  if (theme.secondary || theme.tertiary) {
    out.push(':root {', ...(theme.secondary ? surfaceScale('secondary', theme.secondary) : []), ...(theme.tertiary ? surfaceScale('tertiary', theme.tertiary) : []), '}');
  }
  return out.join('\n');
}

/** The install command for a theme: init takes the brand; the rest goes in the prompt. */
export const installCommand = (theme: CustomTheme) =>
  theme.brand === DEFAULT_BRAND ? 'npx ladom-ui init --yes' : `npx ladom-ui init --brand "${theme.brand}"`;

/** A prompt for an AI tool that sets up the whole theme, including what init has no flag for. */
export function agentPrompt(theme: CustomTheme, lang: 'en' | 'tr') {
  const extra: string[] = [];
  if (theme.density === 'narrow')
    extra.push(lang === 'tr' ? 'Kök <html> öğesine data-density="narrow" ekle.' : 'Add data-density="narrow" to the root <html> element.');
  for (const name of ['secondary', 'tertiary'] as const) {
    const c = theme[name];
    if (c)
      extra.push(
        lang === 'tr'
          ? `theme.css içinde --color-${name} değerini ${c} yap ve -natural, -tint, -soft, -shade adımlarını ondan türet.`
          : `In theme.css set --color-${name} to ${c} and derive its -natural, -tint, -soft and -shade steps from it.`,
      );
  }
  const head =
    lang === 'tr'
      ? `Bu projeye Ladom UI kur: ${installCommand(theme)} ve npx ladom-ui skill komutlarını çalıştır.`
      : `Set up Ladom UI in this project: run ${installCommand(theme)} and npx ladom-ui skill.`;
  const tail = lang === 'tr' ? 'Sonra ekranlarımı Ladom UI bileşenleriyle yap.' : 'Then build my screens with Ladom UI components.';
  return [head, ...extra, tail].join(' ');
}

export const STORAGE_KEY = 'ladom-customize';
export const CSS_KEY = 'ladom-customize-css';
export const STYLE_ID = 'ladom-customize';

// Runs before paint (inlined in <head>) so a saved theme does not flash the default one.
export const customizeInitScript = `try{var c=localStorage.getItem('${CSS_KEY}');if(c){var s=document.createElement('style');s.id='${STYLE_ID}';s.textContent=c;document.head.appendChild(s)}var t=JSON.parse(localStorage.getItem('${STORAGE_KEY}')||'null');if(t&&t.density==='narrow')document.documentElement.setAttribute('data-density','narrow')}catch(e){}`;
