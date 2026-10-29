// Loads the Figma variables (plus code-side additions) and turns them into CSS names and values.
import { readFile } from 'node:fs/promises';

export const root = new URL('../../', import.meta.url);
export const readJson = async (path) => JSON.parse(await readFile(new URL(path, root), 'utf8'));

// First mode is the default (emitted on :root).
export const MODES = {
  '01 Get Started': ['Mode 1'],
  '02 Theme': ['Light', 'Dark'],
  '03 Token': ['Desktop', 'Tablet', 'Mobile'],
  '04 Layout': ['Comfort', 'Narrow'],
};

export const FONT_KEY = '01 Get Started / font-name';
const TYPO = 'design-tokens/typography/';
const WEIGHTS = { Regular: 400, Medium: 500, SemiBold: 600, Bold: 700 };

export const key = (collection, name) => `${collection} / ${name}`;
export const slug = (name) => name.toLowerCase().replace(/[\s/]+/g, '-');

// Map of "collection / name" -> { collection, name, type, values: { mode: raw } }
export async function loadVariables() {
  const collections = await readJson('figma/variables.json');
  const bindings = await readJson('figma/typography-bindings.json');
  const vars = new Map();
  for (const c of collections) {
    for (const v of c.variables) {
      vars.set(key(c.collection, v.name), { collection: c.collection, name: v.name, type: v.type, values: v.values, description: v.description });
    }
  }
  for (const v of bindings.newVariables) {
    const k = key('03 Token', v.name);
    if (vars.has(k)) throw new Error(`New variable already exists in Figma: ${v.name}`);
    const type = typeof v.value === 'number' ? 'FLOAT' : 'STRING';
    vars.set(k, { collection: '03 Token', name: v.name, type, values: Object.fromEntries(MODES['03 Token'].map((m) => [m, v.value])), added: true });
  }
  vars.get(FONT_KEY).values = { 'Mode 1': bindings.fontFamily };
  return vars;
}

export const aliasOf = (raw) => (raw && typeof raw === 'object' && raw.alias) || null;

// Follows aliases. A cross-collection alias resolves in the target collection's default mode.
export function resolve(vars, k, mode) {
  const v = vars.get(k);
  if (!v) throw new Error(`Unknown variable: ${k}`);
  const target = aliasOf(v.values[mode]);
  if (!target) return v.values[mode];
  const t = vars.get(target);
  if (!t) throw new Error(`${k} aliases unknown variable ${target}`);
  return resolve(vars, target, t.collection === v.collection ? mode : MODES[t.collection][0]);
}

// Drops a path segment when the next one already contains it as a word: static/static-white-alpha-4 -> static-white-alpha-4.
const colorPath = (name) => {
  const segments = name.split('/');
  return segments.filter((s, i) => !(segments[i + 1]?.split('-').includes(s))).join('-');
};

export function cssName(k) {
  if (k === FONT_KEY) return '--font-family';
  const [collection, name] = k.split(' / ');
  let m;
  if (collection === '02 Theme') return `--color-${colorPath(name)}`;
  if (collection === '04 Layout') return `--${name}`;
  if (collection === '03 Token') {
    if (name.startsWith(TYPO)) {
      const [group, ...rest] = name.slice(TYPO.length).split('/');
      const prefix = { size: 'font-size', weight: 'font-weight', 'line-height': 'line-height' }[group];
      if (prefix) return `--${prefix}-${rest.join('-').replace(/\s+/g, '-')}`;
    }
    if ((m = name.match(/^design-tokens\/radius\/r-(.+)$/))) return `--radius-${m[1]}`;
    if ((m = name.match(/^design-tokens\/(?:spacing\/)?s-(.+)$/))) return `--space-${m[1]}`;
    if ((m = name.match(/^design-tokens\/grid\/(.+)$/))) return `--grid-${m[1]}`;
    if ((m = name.match(/^component-tokens\/(.+)$/))) return `--${m[1].replaceAll('/', '-')}`;
    if ((m = name.match(/^page-tokens\/(.+)$/))) return `--${m[1]}`;
  }
  throw new Error(`No CSS name for ${collection} / ${name}`);
}

export function cssValue(vars, k, mode) {
  const v = vars.get(k);
  const raw = v.values[mode];
  const target = aliasOf(raw);
  if (target) return `var(${cssName(target)})`;
  // Apps that load the font under another family name (e.g. next/font) set --font-<family> on <html>.
  if (k === FONT_KEY) return `var(--font-${slug(raw)}, "${raw}"), system-ui, sans-serif`;
  if (v.type === 'COLOR') return raw;
  if (raw === 'AUTO') return 'normal';
  if (v.type === 'STRING') {
    if (!v.name.includes('/weight/') || !(raw in WEIGHTS)) throw new Error(`Unexpected string ${JSON.stringify(raw)} in ${k}`);
    return String(WEIGHTS[raw]);
  }
  if (typeof raw !== 'number') throw new Error(`Unexpected value ${JSON.stringify(raw)} in ${k}`);
  return `${raw}px`;
}
