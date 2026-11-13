// Generates the Ladom UI design system files (project/…) from the ladomui repository.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { COMPONENTS } from './components.mjs';
import { PARTS } from './check.mjs';

const [repo, outRoot, sha] = process.argv.slice(2);
const P = join(outRoot, 'project');
const w = (path, text) => {
  mkdirSync(dirname(join(P, path)), { recursive: true });
  writeFileSync(join(P, path), text);
};
const meta = JSON.parse(readFileSync(join(repo, 'packages/tokens/meta/tokens.json'), 'utf8'));
const G = Object.fromEntries(meta.groups.map((g) => [g.id, g]));
const first = (values) => Object.values(values)[0];

// Variable lookup: name -> value per theme ('Light' / 'Dark') or the first mode.
const vars = new Map();
for (const g of meta.groups) {
  for (const v of g.variables) vars.set(v.name, v.values);
  for (const t of g.tokens ?? []) vars.set(t.name, { _: t.value });
}
const valueIn = (name, theme) => {
  const v = vars.get(name);
  if (!v) throw new Error(`unknown ${name}`);
  return v[theme] ?? first(v);
};
// Replaces every var(--x) with its literal value in that theme.
const literal = (value, theme) =>
  value.replace(/var\((--[a-z0-9-]+)(?:,[^)]*)?\)/g, (_, n) => literal(valueIn(n, theme), theme));

// Colors: aliases stay aliases.
const colorNames = new Set(G.color.variables.map((v) => v.name));
const colorUsage = (n) => {
  const s = n.replace('--color-', '');
  if (/^surface-background-invert/.test(s)) return 'Inverted page background (dark toasts); text on it is foreground-level-2.';
  if (/^surface-background/.test(s)) return 'Page background behind every surface.';
  if (/^surface-level-1/.test(s)) return 'Cards, panels, inputs, dropdowns: the raised surface.';
  if (/^surface-level-2/.test(s)) return 'Hover fill, disabled fields, the search input.';
  if (/^surface-level-3/.test(s)) return 'Tracks (Segment), neutral chips and badges, pressed fills, dividers.';
  if (/^surface-level-4/.test(s)) return 'Field and control lines, the default border color.';
  if (/^foreground-high/.test(s)) return 'Body text and icons on surface-background and surface-level-1…3.';
  if (/^foreground-medium/.test(s)) return 'Secondary text: descriptions, subtitles, hints.';
  if (/^foreground-low/.test(s)) return 'Placeholders and disabled text; not for content that must be read.';
  if (/^foreground-ghost/.test(s)) return 'The faintest line on Micro outline badges.';
  if (/^foreground-level-1/.test(s)) return 'Page titles and calendar days.';
  if (/^foreground-level-2/.test(s)) return 'Text on foreground-high-emphasis fills and on surface-background-invert.';
  if (/^static-brand/.test(s)) return 'The Ladom brand gray of the keycap mark; primary aliases it.';
  if (/^static-/.test(s)) return 'Fixed black or white (and their alphas) that do not change with the theme.';
  if (/^(opacity|invert-opacity)/.test(s)) return 'Shadow and overlay tint; used inside the shadow tokens.';
  if (/^on-/.test(s)) return `Text and icons on ${s.replace(/^on-/, '').replace(/-tint$/, '-tint')} fills.`;
  if (/^link/.test(s)) return 'Text links.';
  if (/^component-modal/.test(s)) return 'Modal overlay behind dialogs.';
  const m = /^(primary|secondary|tertiary|success|error|warning|info)(?:-(natural|shade|soft|tint))?$/.exec(s);
  if (m) {
    const role = { primary: 'the main action and selection', secondary: 'secondary actions and hover fills', tertiary: 'quiet, white tertiary buttons', success: 'success', error: 'errors and destructive actions', warning: 'warnings', info: 'information' }[m[1]];
    const step = { undefined: 'Solid fill and text color for', natural: 'Hover step of', shade: 'Darkest step (pressed, text on soft fills) of', soft: 'Lightest background of', tint: 'Light tint (focus rings, disabled fills) of' }[m[2]];
    return `${step} ${role}.`;
  }
  return 'Theme color.';
};
const colorValue = (raw, theme) => {
  const m = /^var\((--[a-z0-9-]+)\)$/.exec(raw);
  if (m && colorNames.has(m[1])) return `{${m[1].slice(2)}}`;
  return literal(raw, theme).toLowerCase();
};
const colorTokens = G.color.variables.map((v) => ({
  name: v.name.slice(2),
  value: { light: colorValue(v.values.Light, 'Light'), dark: colorValue(v.values.Dark, 'Dark') },
  usage: colorUsage(v.name),
}));

// Code-side colors (config/color-roles.json, config/chart-colors.json) sit in G.color.tokens. The
// roles alias a theme color; the chart colors are relative oklch() of --color-primary, which
// tokens.json cannot hold (no var()), so they are worked out here for the Ladom brand per theme.
const toOklch = (hex) => {
  const n = hex.replace('#', '');
  const rgb = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  const [r, g, b] = rgb;
  const [l_, m_, s_] = [0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b, 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b, 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b].map(Math.cbrt);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const C = Math.hypot(A, B);
  // A gray has no hue (CSS treats it as 0); browsers keep a rounding remainder there, so the exact
  // colors come from the formulas in bundle.css and these values are for the Colors view.
  return { l: L, c: C, h: C < 1e-3 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 };
};
const splitTop = (str) => {
  const out = [];
  let depth = 0, cur = '';
  for (const ch of str) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ' ' && depth === 0) {
      if (cur) out.push(cur);
      cur = '';
    } else cur += ch;
  }
  if (cur) out.push(cur);
  return out;
};
const relativeOklch = (expr, theme) => {
  const m = /^oklch\(from var\((--[a-z0-9-]+)\) (.+)\)$/.exec(expr);
  if (!m) throw new Error(`cannot resolve ${expr}`);
  const base = toOklch(literal(`var(${m[1]})`, theme));
  const [l, c, h] = splitTop(m[2]).map((e) => Function('l', 'c', 'h', `return ${e.replace(/\bmin\(/g, 'Math.min(').replace(/\bmax\(/g, 'Math.max(').replace(/\bcalc\(/g, '(')};`)(base.l, base.c, base.h));
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${(((h % 360) + 360) % 360).toFixed(1)})`;
};
const extraColor = (raw, theme) => (raw.startsWith('oklch(from') ? relativeOklch(raw, theme) : colorValue(raw, theme));
for (const t of G.color.tokens ?? []) {
  colorTokens.push({
    name: t.name.slice(2),
    value: { light: extraColor(t.value, 'Light'), dark: extraColor(t.dark ?? t.value, 'Dark') },
    usage: t.value.startsWith('oklch(from') ? `${t.source}. Worked out for the Ladom brand; bundle.css derives it from color-primary as in code.` : t.source,
  });
}
// The chart colors as code writes them (relative to --color-primary), for bundle.css.
const relativeColors = (G.color.tokens ?? []).filter((t) => t.value.startsWith('oklch(from'));

const lengthUsage = (n) => {
  const s = n.slice(2);
  if (s.startsWith('layout-')) return `Layout gap and padding step (${s.slice(7)}); narrower in the Narrow density.`;
  if (s.startsWith('space-form')) return 'Form spacing: ' + s.slice(11).replace(/-/g, ' ') + '.';
  if (s.startsWith('space-')) return `Spacing step ${s.slice(6)} for paddings and gaps.`;
  if (s.startsWith('radius-full') || s === 'badge-radius') return 'Pills and circles: badges, chips, avatars, icon buttons.';
  if (s.startsWith('radius-form-element')) return 'Corner of form elements: inputs, selects, buttons, cells.';
  if (s.startsWith('radius-card')) return 'Corner of cards and toasts.';
  if (s.startsWith('radius-checkbox')) return 'Checkbox corner.';
  if (s.startsWith('radius-layout')) return 'Corner of layout panels: dropdowns, date and time pickers.';
  return s.replace(/-/g, ' ') + '.';
};
const lengths = (group) => group.variables.map((v) => ({ name: v.name.slice(2), value: literal(first(v.values), 'Light'), usage: lengthUsage(v.name) }));

const shadowTokens = G.shadow.tokens.map((t) => ({
  name: t.name.slice(2),
  // Shadows with code-side Dark values (config/dark-shadows.json) carry them in `dark`.
  value: { light: literal(t.value, 'Light'), dark: literal(t.dark ?? t.value, 'Dark') },
  usage: t.name.includes('focus') ? 'Focus ring of controls.' : t.name.includes('line') ? 'One-pixel line drawn as a shadow.' : `Elevation: ${t.name.slice(9).replace(/-/g, ' ')}.`,
}));

// Type: the text styles (font shorthands) resolved to size, line height and weight.
const styleOf = (t) => {
  const m = /var\(--font-weight-([a-z]+)\) var\((--font-size-[a-z0-9-]+)\)\/var\((--line-height-[a-z0-9-]+)\)/.exec(t.value);
  if (!m) return null;
  const s = { name: t.name.replace('--text-', ''), fontSize: valueIn(m[2], 'Desktop'), fontWeight: Number(valueIn(`--font-weight-${m[1]}`, 'Desktop')) };
  const lh = valueIn(m[3], 'Desktop');
  if (lh !== 'normal') s.lineHeight = lh;
  const ls = vars.get(`${t.name}-letter-spacing`);
  if (ls) s.letterSpacing = ls._;
  s.usage = `font: var(${t.name});` + (vars.get(`${t.name}-text-transform`) ? ' Set in capitals.' : '');
  return s;
};
const styles = G.typography.tokens.map(styleOf).filter(Boolean);
const tokens = {
  name: 'Ladom UI',
  version: 1,
  meta: { source: 'github', repo: 'haibnu/ladomui', ref: `main@${sha}`, package: 'packages/tokens', paths: { tokens: ['packages/tokens/meta/tokens.json'], components: ['packages/ui/src'] }, synced: new Date().toISOString().slice(0, 10) },
  color: { themes: [{ id: 'light', name: 'Light' }, { id: 'dark', name: 'Dark' }], tokens: colorTokens },
  type: {
    fonts: [],
    families: { sans: '"Hanken Grotesk", system-ui, sans-serif' },
    groups: [
      { name: 'UI', family: 'sans', styles: styles.filter((s) => s.name.startsWith('ui-')) },
      { name: 'Content', family: 'sans', styles: styles.filter((s) => s.name.startsWith('content-')) },
    ],
  },
  spacing: { tokens: lengths(G.space) },
  radius: { tokens: lengths(G.radius) },
  shadow: { tokens: shadowTokens },
  size: { tokens: lengths(G.size) },
};
w('tokens.json', JSON.stringify(tokens, null, 2) + '\n');

// bundle.css: the Google font, the token CSS tokens.json cannot hold (text styles, line heights,
// font sizes, motion, border, grid, the chart color formulas), then the components.
const css = (f) => readFileSync(join(repo, 'packages/tokens/css', f), 'utf8').replace(/^\/\*.*\*\/\n/, '');
w(
  'components/bundle.css',
  `@import url("https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap");\n` +
    `/* Ladom UI tokens that tokens.json does not hold: text styles, motion, border, grid. */\n` +
    ['typography.css', 'motion.css', 'border.css', 'grid.css'].map(css).join('\n') +
    `\n/* Chart colors derived from the brand color, as in code (tokens.json holds their values for the Ladom brand). */\n` +
    `:root, [data-theme="light"] {\n${relativeColors.map((t) => `  ${t.name}: ${t.value};`).join('\n')}\n}\n` +
    `[data-theme="dark"] {\n${relativeColors.map((t) => `  ${t.name}: ${t.dark ?? t.value};`).join('\n')}\n}\n` +
    `\n/* Components */\n` +
    readFileSync(join(outRoot, 'components/_components.css'), 'utf8'),
);
cpSync(join(outRoot, 'components/bundle.js'), join(P, 'components/bundle.js'));

// index.d.ts: the declarations of @ladom/ui, one file, local imports dropped.
const dts = [];
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
for (const f of walk(join(repo, 'packages/ui/dist')).filter((f) => f.endsWith('.d.ts') && !f.endsWith('index.d.ts')).sort()) {
  const body = readFileSync(f, 'utf8').split('\n').filter((l) => !/^import .* from '\.\.?\//.test(l) && !/^import .* from "\.\.?\//.test(l) && !/^export \{\};?$/.test(l) && !/^import .*react'/.test(l)).join('\n').trim();
  const path = relative(join(repo, 'packages/ui/dist'), f).replace(/\.d\.ts$/, '');
  // Pro declarations say so on every exported component, where a model reading the types will see it.
  const pro = path.startsWith('pro/');
  const marked = pro ? body.replace(/^export declare (const|function) ([A-Z]\w*)/gm, (m) => `/** @pro Ladom UI Pro: free to use in designs; shipping it in an app needs a license (https://ui.ladom.co/license). */\n${m}`) : body;
  if (body) dts.push(`// ${path}${pro ? ' (Ladom UI Pro, licensed)' : ''}\n${marked}`);
}
w('components/index.d.ts', `// Types of @ladom/ui (window.LadomUI). Icons are window.LadomUI.Icons.\nimport type { ComponentType, ReactNode, ReactElement, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes, KeyboardEvent, MouseEventHandler } from 'react';\n\n${dts.join('\n\n')}\n`);

// Pro components: every name exported from packages/ui/src/pro, with its registry name for the CLI.
const LICENSE_URL = 'https://ui.ladom.co/license';
const proIndex = join(repo, 'packages/ui/src/pro/index.ts');
const registryByFolder = Object.fromEntries(Object.entries(JSON.parse(readFileSync(join(repo, 'scripts/registry/items.json'), 'utf8')).items).map(([name, item]) => [item.folder, name]));
const PRO = new Map();
if (existsSync(proIndex)) {
  for (const m of readFileSync(proIndex, 'utf8').matchAll(/^export \{([^}]*)\} from '\.\/([^/]+)\//gm)) {
    for (const name of m[1].split(',').map((x) => x.trim()).filter((x) => /^[A-Z]/.test(x))) PRO.set(name, registryByFolder[m[2]]);
  }
}
// The first sentence of a Pro card names the license, so it shows wherever the card summary does.
const summaryOf = (c) => (PRO.has(c.name) ? `Ladom UI Pro (needs a license to ship): ${c.summary.replace(/^Pro\. /, '')}` : c.summary);
const licenseOf = (c) =>
  PRO.has(c.name)
    ? `\n## License\nLadom UI Pro. Use it freely in designs; shipping it in an app needs a Ladom UI Pro license (${LICENSE_URL}). In code: \`LADOM_UI_KEY=<your key> npx ladom-ui add ${PRO.get(c.name)}\`. When a design uses it, say so in the hand-off (see the README).\n`
    : '';
// A Pro badge at the top right of every Pro preview, in a strip of its own, drawn with the Badge component.
const proBadge = (c) =>
  PRO.has(c.name)
    ? `<style>body{padding-top:48px!important}</style>\n<div id="pro" style="position:absolute;top:16px;right:16px"></div>\n<script>ReactDOM.createRoot(document.getElementById('pro')).render(React.createElement(window.LadomUI.Badge, { size: 'small', tone: 'primary', filled: true, title: 'Ladom UI Pro: needs a license to ship (${LICENSE_URL})' }, 'PRO'));</script>\n`
    : '';

// Component cards.
for (const c of COMPONENTS) {
  w(
    `components/${c.name}/README.md`,
    `# ${c.name}\n\n${summaryOf(c)}\n${licenseOf(c)}\n## When to use\n${c.use.map((u) => `- ${u}`).join('\n')}\n\n## What you provide\n${c.provides}\n\nFull guide and playground: https://ui.ladom.co/en/docs\n`,
  );
  w(
    `components/${c.name}/preview.html`,
    `<!-- @dsCard group="${c.group}" height=${c.height + (PRO.has(c.name) ? 32 : 0)} -->\n<style>body{margin:0;padding:16px;background:var(--color-surface-background);color:var(--color-foreground-high-emphasis);font:var(--text-ui-text-regular)}</style>\n${proBadge(c)}<div id="root"></div>\n<script>\nconst h = React.createElement;\nconst { ${[...new Set([...COMPONENTS.map((x) => x.name), ...Object.keys(PARTS), 'Icons'])].join(', ')} } = window.LadomUI;\nfunction Preview() {\n${c.code}\n}\nReactDOM.createRoot(document.getElementById('root')).render(h(Preview));\n</script>\n`,
  );
}
writeFileSync(join(outRoot, 'names.json'), JSON.stringify(COMPONENTS.map((c) => c.name)));
console.log(`tokens: ${colorTokens.length} colors, ${styles.length} styles, ${tokens.spacing.tokens.length} spacing, ${tokens.radius.tokens.length} radius, ${shadowTokens.length} shadows; ${COMPONENTS.length} components`);
