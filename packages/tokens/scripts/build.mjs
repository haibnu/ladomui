// Builds css/*.css and meta/tokens.json from the Figma export (figma/*.json) and the
// code-side decisions in figma/typography-bindings.json and config/*.json.
// Fails if a Figma variable is not assigned to exactly one token group, if a text style
// property is not bound to a variable, or if a binding differs from the style's Figma value.
import { mkdir, writeFile } from 'node:fs/promises';
import { FONT_KEY, cssName, key, loadVariables, readJson, resolve, root, slug } from './lib/variables.mjs';
import { block, describeVariables, emitVariables, modeSelectors } from './lib/css.mjs';

const vars = await loadVariables();
const styles = await readJson('figma/styles.json');
const bindings = await readJson('figma/typography-bindings.json');
const pages = await readJson('figma/pages.json');
const legacyStyles = await readJson('config/legacy-styles.json');
const breakpoints = await readJson('config/breakpoints.json');
const colorRoles = await readJson('config/color-roles.json');
const chartColors = await readJson('config/chart-colors.json');
const selectors = modeSelectors(breakpoints);

// Figma variables that are not design tokens.
const isExcluded = (k, v) =>
  (['01 Get Started', '05 System Language', '06 Mock Data'].includes(v.collection) && k !== FONT_KEY) || // docs settings, copy, mock data
  ['02 Theme / settings/theme-name', '03 Token / device'].includes(k) || // mode labels
  v.name.startsWith('product-colors/'); // colors of another product

const TOKEN = '03 Token / ';
const GROUPS = [
  { id: 'color', title: 'Colors', match: (k, v) => v.collection === '02 Theme' },
  { id: 'typography', title: 'Typography', match: (k) => k === FONT_KEY || k.startsWith(`${TOKEN}design-tokens/typography/`) },
  { id: 'space', title: 'Spacing', match: (k, v) => v.collection === '04 Layout' || /^03 Token \/ design-tokens\/(spacing\/)?s-/.test(k) },
  { id: 'radius', title: 'Radius', match: (k) => k.startsWith(`${TOKEN}design-tokens/radius/`) || k === `${TOKEN}component-tokens/badge/radius` },
  { id: 'size', title: 'Sizes', match: (k) => k.startsWith(`${TOKEN}component-tokens/modal/`) || k === `${TOKEN}component-tokens/loader/track-height` || k.startsWith(`${TOKEN}page-tokens/`) },
  { id: 'grid', title: 'Grid', match: (k) => k.startsWith(`${TOKEN}design-tokens/grid/`) },
  { id: 'border', title: 'Border', match: () => false },
  { id: 'shadow', title: 'Depth', match: () => false },
  { id: 'motion', title: 'Animation', match: () => false },
];

const errors = [];
for (const g of GROUPS) g.keys = [];
for (const [k, v] of vars) {
  if (isExcluded(k, v)) continue;
  const owners = GROUPS.filter((g) => g.match(k, v));
  if (owners.length !== 1) errors.push(`${k}: matches ${owners.length} token groups`);
  else owners[0].keys.push(k);
}

// Extra tokens per group that do not come straight from a variable: { name, value, source }.
for (const g of GROUPS) g.extras = [];
const extras = (id) => GROUPS.find((g) => g.id === id).extras;
const themeVar = (name) => `var(${cssName(key('02 Theme', name))})`;

// Typography: every text style becomes a font shorthand built from variables.
const LEGACY_FONT_STYLES = { '55 Roman': 'Regular', '65 Medium': 'Medium' };
const varKey = (name) => (name === 'font-name' ? FONT_KEY : `${TOKEN}${name}`);
for (const style of styles.text) {
  const bound = { ...style.bound, ...bindings.styles[style.name] };
  const missing = ['fontFamily', 'fontStyle', 'fontSize', 'lineHeight'].filter((p) => !bound[p]);
  if (missing.length) {
    errors.push(`${style.name}: not bound: ${missing.join(', ')}`);
    continue;
  }
  if (bound.fontFamily !== 'font-name') errors.push(`${style.name}: fontFamily bound to ${bound.fontFamily}`);
  const checks = [
    ['fontStyle', resolve(vars, varKey(bound.fontStyle), 'Desktop'), LEGACY_FONT_STYLES[style.font.style] ?? style.font.style],
    ['fontSize', resolve(vars, varKey(bound.fontSize), 'Desktop'), style.size],
    ['lineHeight', resolve(vars, varKey(bound.lineHeight), 'Desktop'), style.lineHeight.unit === 'AUTO' ? 'AUTO' : style.lineHeight.value],
  ];
  for (const [prop, actual, expected] of checks) {
    if (actual !== expected) errors.push(`${style.name}: ${prop} binding gives ${actual}, Figma has ${expected}`);
  }
  const name = `--text-${slug(style.name)}`;
  const ref = (p) => `var(${cssName(varKey(bound[p]))})`;
  extras('typography').push({ name, value: `${ref('fontStyle')} ${ref('fontSize')}/${ref('lineHeight')} ${ref('fontFamily')}`, source: style.name });
  if (style.letterSpacing.value !== 0) {
    if (style.letterSpacing.unit !== 'PERCENT') errors.push(`${style.name}: letterSpacing unit ${style.letterSpacing.unit}`);
    extras('typography').push({ name: `${name}-letter-spacing`, value: `${style.letterSpacing.value / 100}em`, source: style.name });
  }
  if (style.textCase === 'UPPER') extras('typography').push({ name: `${name}-text-transform`, value: 'uppercase', source: style.name });
}

// Depth: effect styles become box-shadows. Colors use theme variables where Figma binds them.
for (const style of styles.effect) {
  const shadows = style.effects
    .filter((e) => e.visible && (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW'))
    .map((e) => {
      const color = e.bound?.color ? themeVar(e.bound.color) : e.color;
      return `${e.type === 'INNER_SHADOW' ? 'inset ' : ''}${e.offset.x}px ${e.offset.y}px ${e.radius}px ${e.spread}px ${color}`;
    });
  const last = style.name.split('/').at(-1);
  extras('shadow').push({ name: `--shadow-${slug(last)}`, value: shadows.join(', ') || 'none', source: style.name });
}

// Color roles: code-side tokens that default to a theme color; see config/color-roles.json.
for (const [name, role] of Object.entries(colorRoles)) {
  if (name.startsWith('$')) continue;
  if (!vars.has(key('02 Theme', role.value))) errors.push(`config/color-roles.json: ${name} points to unknown theme color ${role.value}`);
  extras('color').push({ name: `--color-${name}`, value: themeVar(role.value), source: `${role.usedFor} (min contrast ${role.minContrast}:1)` });
}

// Chart series colors: derived from the brand in CSS, with a Dark value; see config/chart-colors.json.
for (const [name, c] of Object.entries(chartColors.series)) {
  if (!c.light?.includes('var(--color-primary)') || !c.dark) errors.push(`config/chart-colors.json: ${name} needs a light and a dark value derived from --color-primary`);
  extras('color').push({ name: `--color-${name}`, value: c.light, dark: c.dark, source: c.usedFor });
}

// Border: the Figma Border page uses the legacy "Helper Color / Border" style; see config/legacy-styles.json.
{
  const b = pages.border;
  const colorName = legacyStyles[b.color];
  if (!colorName) errors.push(`Border color ${b.color} has no mapping in config/legacy-styles.json`);
  extras('border').push(
    { name: '--border-width', value: `${b.width}px`, source: pages.border.$source },
    { name: '--border-color', value: themeVar(colorName), source: `${b.color} -> ${colorName}` },
    { name: '--border', value: 'var(--border-width) solid var(--border-color)', source: 'Line' },
    { name: '--border-dashed', value: 'var(--border-width) dashed var(--border-color)', source: `DashLine (dash ${b.dashPattern.join('/')})` },
  );
}

// Animation: durations and timing functions from the Figma Animation page.
{
  const m = pages.motion;
  for (const [name, value] of Object.entries(m.durations)) extras('motion').push({ name: `--duration-${name}`, value, source: m.$source });
  for (const [name, a] of Object.entries(m.animations)) {
    if (!/^(ease|ease-in|ease-out|ease-in-out|linear)$/.test(a.easing)) {
      console.warn(`motion: skipped ${name}, Figma gives no usable timing function ("${a.easing}")`);
      continue;
    }
    extras('motion').push({ name: `--motion-${name}`, value: `var(--duration-${a.duration}) ${a.easing}`, source: `${a.usedFor}` });
  }
}

// Grid: layout grid styles (column grids only; the hidden 8px baseline grid is a canvas aid).
for (const style of styles.grid) {
  const columns = style.grids.find((g) => g.pattern === 'COLUMNS' && g.visible);
  const id = `--grid-${slug(style.name.replace(/\s*\d+\s*Grid$/, ''))}`;
  extras('grid').push(
    { name: `${id}-columns`, value: String(columns.count), source: style.name },
    { name: `${id}-column-width`, value: `${columns.sectionSize}px`, source: style.name },
    { name: `${id}-gutter`, value: `${columns.gutterSize}px`, source: style.name },
    ...(columns.alignment === 'MIN' ? [{ name: `${id}-margin`, value: `${columns.offset}px`, source: style.name }] : []),
  );
}

// Every CSS name must be unique across all groups.
const seen = new Map();
for (const g of GROUPS) {
  for (const name of [...g.keys.map(cssName), ...g.extras.map((e) => e.name)]) {
    if (seen.has(name)) errors.push(`${name} is defined by both ${seen.get(name)} and ${g.id}`);
    seen.set(name, g.id);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const header = '/* Generated by scripts/build.mjs from the Figma export. Do not edit. */\n\n';
await mkdir(new URL('css/', root), { recursive: true });
await mkdir(new URL('meta/', root), { recursive: true });
for (const g of GROUPS) {
  let css = header;
  if (g.keys.length) css += emitVariables(vars, g.keys, selectors);
  if (g.extras.length) css += `${g.keys.length ? '\n' : ''}${block(':root', g.extras.map((e) => `  ${e.name}: ${e.value};`))}`;
  // Extras with a Dark value (chart colors) get the same opt-in selector as the Figma Dark mode.
  const dark = g.extras.filter((e) => e.dark);
  if (dark.length) css += `\n${block(':root[data-theme="dark"]', dark.map((e) => `  ${e.name}: ${e.dark};`))}`;
  await writeFile(new URL(`css/${g.id}.css`, root), css);
}
await writeFile(new URL('css/index.css', root), header + GROUPS.map((g) => `@import "./${g.id}.css";`).join('\n') + '\n');

const meta = {
  breakpoints,
  groups: GROUPS.map((g) => ({ id: g.id, title: g.title, variables: describeVariables(vars, g.keys), tokens: g.extras })),
};
await writeFile(new URL('meta/tokens.json', root), JSON.stringify(meta, null, 2) + '\n');

console.log(GROUPS.map((g) => `${g.id}: ${g.keys.length + g.extras.length}`).join(', '));
