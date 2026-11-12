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
// font sizes, motion, border, grid), then the components.
const css = (f) => readFileSync(join(repo, 'packages/tokens/css', f), 'utf8').replace(/^\/\*.*\*\/\n/, '');
w(
  'components/bundle.css',
  `@import url("https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap");\n` +
    `/* Ladom UI tokens that tokens.json does not hold: text styles, motion, border, grid. */\n` +
    ['typography.css', 'motion.css', 'border.css', 'grid.css'].map(css).join('\n') +
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
