// Builds css/typography.css from the Figma export (figma/variables.json, figma/styles.json)
// plus the code-side bindings in figma/typography-bindings.json.
// Fails if a text style property is not bound to a variable, or if a binding
// resolves to a value different from the style's Figma value.
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const readJson = async (path) => JSON.parse(await readFile(new URL(path, root), 'utf8'));

const collections = await readJson('figma/variables.json');
const { text: textStyles } = await readJson('figma/styles.json');
const bindings = await readJson('figma/typography-bindings.json');
const breakpoints = await readJson('config/breakpoints.json');

const TYPO = 'design-tokens/typography/';
const FONT_NAME = 'font-name';
const MODES = ['Desktop', 'Tablet', 'Mobile'];
const WEIGHTS = { Regular: 400, Medium: 500, SemiBold: 600, Bold: 700 };
// Figma style names of fonts that are being replaced, mapped to the equivalent weight name.
const LEGACY_FONT_STYLES = { '55 Roman': 'Regular', '65 Medium': 'Medium' };

// Variable name -> { mode: raw value }
const vars = new Map();
const tokenCollection = collections.find((c) => c.collection === '03 Token');
for (const v of tokenCollection.variables) {
  if (v.name.startsWith(TYPO)) vars.set(v.name, v.values);
}
for (const v of bindings.newVariables) {
  if (vars.has(v.name)) throw new Error(`New variable already exists in Figma: ${v.name}`);
  vars.set(v.name, Object.fromEntries(MODES.map((m) => [m, v.value])));
}
vars.set(FONT_NAME, Object.fromEntries(MODES.map((m) => [m, bindings.fontFamily])));

const aliasTarget = (raw) => raw?.alias?.replace(/^03 Token \/ /, '');

const cssName = (name) => {
  if (name === FONT_NAME) return '--font-family';
  const [group, ...rest] = name.slice(TYPO.length).split('/');
  const prefix = { size: 'font-size', weight: 'font-weight', 'line-height': 'line-height' }[group];
  if (!prefix) throw new Error(`Unknown typography group: ${name}`);
  return `--${prefix}-${rest.join('-').replace(/\s+/g, '-')}`;
};

const cssValue = (name, raw) => {
  const target = aliasTarget(raw);
  if (target) return `var(${cssName(target)})`;
  // Apps that load the font under another family name (e.g. next/font) set --font-<family> on <html>.
  if (name === FONT_NAME) return `var(--font-${slug(raw)}, "${raw}"), system-ui, sans-serif`;
  if (name.includes('/weight/')) {
    if (!(raw in WEIGHTS)) throw new Error(`Unknown weight "${raw}" in ${name}`);
    return String(WEIGHTS[raw]);
  }
  if (raw === 'AUTO') return 'normal';
  if (typeof raw !== 'number') throw new Error(`Unexpected value ${JSON.stringify(raw)} in ${name}`);
  return `${raw}px`;
};

const resolve = (name, mode) => {
  const values = vars.get(name);
  if (!values) throw new Error(`Unknown variable: ${name}`);
  const target = aliasTarget(values[mode]);
  return target ? resolve(target, mode) : values[mode];
};

const slug = (name) => name.toLowerCase().replace(/[\s/]+/g, '-');

// Text styles
const styleLines = [];
const errors = [];
for (const style of textStyles) {
  const bound = { ...style.bound, ...bindings.styles[style.name] };
  const missing = ['fontFamily', 'fontStyle', 'fontSize', 'lineHeight'].filter((k) => !bound[k]);
  if (missing.length) {
    errors.push(`${style.name}: not bound: ${missing.join(', ')}`);
    continue;
  }
  if (bound.fontFamily !== FONT_NAME) errors.push(`${style.name}: fontFamily bound to ${bound.fontFamily}`);

  const weight = LEGACY_FONT_STYLES[style.font.style] ?? style.font.style;
  const checks = [
    ['fontStyle', resolve(bound.fontStyle, 'Desktop'), weight],
    ['fontSize', resolve(bound.fontSize, 'Desktop'), style.size],
    ['lineHeight', resolve(bound.lineHeight, 'Desktop'), style.lineHeight.unit === 'AUTO' ? 'AUTO' : style.lineHeight.value],
  ];
  for (const [prop, actual, expected] of checks) {
    if (actual !== expected) errors.push(`${style.name}: ${prop} binding gives ${actual}, Figma has ${expected}`);
  }

  const id = `--text-${slug(style.name)}`;
  styleLines.push(
    `  ${id}: var(${cssName(bound.fontStyle)}) var(${cssName(bound.fontSize)})/var(${cssName(bound.lineHeight)}) var(--font-family);`,
  );
  if (style.letterSpacing.value !== 0) {
    if (style.letterSpacing.unit !== 'PERCENT') errors.push(`${style.name}: letterSpacing unit ${style.letterSpacing.unit}`);
    styleLines.push(`  ${id}-letter-spacing: ${style.letterSpacing.value / 100}em;`);
  }
  if (style.textCase === 'UPPER') styleLines.push(`  ${id}-text-transform: uppercase;`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

// Variables: Desktop is the default. Every non-desktop block lists all variables that vary
// between modes, so a narrower mode never inherits a value from a wider one.
const names = [...vars.keys()].sort((a, b) => cssName(a).localeCompare(cssName(b)));
const varying = names.filter((n) => new Set(MODES.map((m) => JSON.stringify(vars.get(n)[m]))).size > 1);
const indent = (text) => text.replace(/^(?=.)/gm, '  ');
const block = (selector, lines) => `${selector} {\n${lines.join('\n')}\n}\n`;
const varLines = (mode, list) => list.map((n) => `  ${cssName(n)}: ${cssValue(n, vars.get(n)[mode])};`);
// Tablet applies below the desktop width, Mobile below the tablet width (Mobile comes last so it wins).
const maxWidth = { Tablet: breakpoints.desktop, Mobile: breakpoints.tablet };

let css = '/* Generated by scripts/build-typography.mjs. Do not edit. */\n\n';
css += block(':root', varLines('Desktop', names));
if (varying.length) {
  for (const mode of MODES.slice(1)) {
    css += `\n@media (width < ${maxWidth[mode]}px) {\n${indent(block(':root:not([data-device])', varLines(mode, varying)))}}\n`;
  }
  for (const mode of MODES.slice(1)) {
    css += `\n${block(`:root[data-device="${mode.toLowerCase()}"]`, varLines(mode, varying))}`;
  }
}
css += `\n/* Text styles: use as \`font: var(--text-…)\`. */\n${block(':root', styleLines)}`;

await mkdir(new URL('css/', root), { recursive: true });
await writeFile(new URL('css/typography.css', root), css);
console.log(`typography.css: ${names.length} variables, ${textStyles.length} text styles`);
