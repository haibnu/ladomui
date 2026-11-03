// Builds the registry the ladom-ui CLI installs from: apps/docs/registry/registry.json, served by
// apps/docs/app/r (free items to everyone, Pro items with a license key). Every component folder
// of packages/ui/src becomes an item with its files, the items it imports and the icons it uses
// (the Pro folders come from the private submodule packages/ui/src/pro and are left out when it
// is not checked out; they are served with the same ../<Folder> paths as the free ones);
// @ladom/icons imports are rewritten to the local icons folder the CLI writes. Each file gets the
// license header of its tier. Fails when a free item depends on a Pro one.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = join(dirname(fileURLToPath(import.meta.url)), '../..');
const config = JSON.parse(readFileSync(join(repo, 'scripts/registry/items.json'), 'utf8'));
const uiSrc = join(repo, 'packages/ui/src');
const out = join(repo, 'apps/docs/registry/registry.json');

const HEADER = {
  free: 'Ladom UI (free) · MIT License · https://ui.ladom.co/license',
  pro: 'Ladom UI Pro · Licensed under the Ladom UI Pro License; do not redistribute · https://ui.ladom.co/license',
};
// The license line goes on top; a 'use client' directive has to stay the first statement.
const withHeader = (path, text, tier) => {
  if (path.endsWith('.css')) return `/* ${HEADER[tier]} */\n${text}`;
  const directive = /^(['"])use client\1;\n/.exec(text);
  return directive ? `${directive[0]}// ${HEADER[tier]}\n${text.slice(directive[0].length)}` : `// ${HEADER[tier]}\n${text}`;
};

const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const kebab = (s) => s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const proSrc = join(uiSrc, 'pro');
const dirsIn = (dir) => (existsSync(dir) ? readdirSync(dir).filter((f) => !f.startsWith('.') && statSync(join(dir, f)).isDirectory()) : []);
// Folder -> its source directory; Pro folders live one level down and import '../../<Folder>/'.
const sourceOf = Object.fromEntries([...dirsIn(uiSrc).filter((f) => f !== 'pro').map((f) => [f, uiSrc]), ...dirsIn(proSrc).map((f) => [f, proSrc])]);
const folders = Object.keys(sourceOf).sort();
if (!dirsIn(proSrc).length) console.warn('registry: packages/ui/src/pro is not checked out; building the free items only.');
const nameOf = Object.fromEntries(folders.map((f) => [f, Object.entries(config.items).find(([, v]) => v.folder === f)?.[0] ?? kebab(f)]));

// Read every folder: its files, the folders it imports and the icons it uses.
const units = {};
for (const folder of folders) {
  const deps = new Set();
  const icons = new Set();
  const files = [];
  const base = sourceOf[folder];
  for (const file of walk(join(base, folder)).sort()) {
    let text = readFileSync(file, 'utf8');
    if (base === proSrc) text = text.replaceAll("from '../../", "from '../");
    for (const m of text.matchAll(/from '\.\.\/([A-Za-z]+)\//g)) if (m[1] !== folder) deps.add(m[1]);
    for (const m of text.matchAll(/import \{([^}]*)\} from '@ladom\/icons';/g))
      for (const spec of m[1].split(',').map((s) => s.trim()).filter(Boolean)) if (/^Icon[A-Z]/.test(spec)) icons.add(spec);
    text = text.replaceAll("from '@ladom/icons'", "from '../icons'");
    files.push({ path: relative(base, file), content: text });
  }
  units[folder] = { folder, deps: [...deps].sort(), icons: [...icons].sort(), files };
}

// Tiers: listed items as configured; an internal part is free when a free item needs it.
const tierOf = {};
for (const [name, v] of Object.entries(config.items)) tierOf[v.folder] = v.tier;
const freeNeeds = new Set();
const visit = (folder) => {
  for (const d of units[folder].deps) if (!freeNeeds.has(d)) (freeNeeds.add(d), visit(d));
};
for (const [folder, tier] of Object.entries(tierOf)) if (tier === 'free') visit(folder);
for (const folder of folders) tierOf[folder] ??= freeNeeds.has(folder) ? 'free' : 'pro';
const errors = [];
for (const folder of folders)
  if (tierOf[folder] === 'free') for (const d of units[folder].deps) if (tierOf[d] !== 'free') errors.push(`${folder} (free) depends on ${d} (pro)`);
if (errors.length) throw new Error(`Registry tiers:\n${errors.join('\n')}`);

const items = { tokens: {
  name: 'tokens', type: 'tokens', tier: 'free', description: 'The Ladom UI design tokens as CSS variables; import tokens/index.css once.', dependencies: [], icons: [],
  files: readdirSync(join(repo, 'packages/tokens/css')).filter((f) => f.endsWith('.css')).sort().map((f) => ({ path: `tokens/${f}`, content: withHeader(f, readFileSync(join(repo, 'packages/tokens/css', f), 'utf8'), 'free') })),
} };
for (const folder of folders) {
  const u = units[folder];
  const name = nameOf[folder];
  const listed = config.items[name];
  items[name] = {
    name,
    type: listed ? 'component' : 'internal',
    tier: tierOf[folder],
    description: listed?.description ?? `Internal part (${folder}) used by other components.`,
    dependencies: ['tokens', ...u.deps.map((d) => nameOf[d])],
    icons: u.icons,
    files: u.files.map((f) => ({ path: f.path, content: withHeader(f.path, f.content, tierOf[folder]) })),
  };
}

// A short hash of each item's files: the CLI compares it with what a project installed to tell
// which items have an update.
const hashOf = (files) => createHash('sha256').update(JSON.stringify(files)).digest('hex').slice(0, 12);
for (const item of Object.values(items)) item.hash = hashOf(item.files);

// Icons: free; createIcon plus one file per icon, imported from a generated index.
const iconsSrc = join(repo, 'packages/icons/src');
const icons = { createIcon: withHeader('createIcon.tsx', readFileSync(join(iconsSrc, 'createIcon.tsx'), 'utf8'), 'free') };
for (const f of readdirSync(join(iconsSrc, 'icons')).sort()) {
  icons[f.replace(/\.ts$/, '')] = withHeader(f, readFileSync(join(iconsSrc, 'icons', f), 'utf8').replace("from '../createIcon'", "from './createIcon'"), 'free');
}
for (const item of Object.values(items)) for (const i of item.icons) if (!icons[i]) throw new Error(`${item.name} uses ${i}, which is not an icon`);

mkdirSync(dirname(out), { recursive: true });
// The Claude Code skill, for `npx ladom-ui skill`.
const skill = readFileSync(join(repo, 'skills/ladom-ui/SKILL.md'), 'utf8');
writeFileSync(out, JSON.stringify({ version: config.version, items, icons, skill }));
// The tier of each component, for the docs sidebar (small, safe to ship to the browser).
// The license texts, shown in full on the docs license page.
writeFileSync(join(dirname(out), 'licenses.json'), JSON.stringify({ mit: readFileSync(join(repo, 'LICENSE.md'), 'utf8').split('## MIT License\n\n')[1], pro: readFileSync(join(repo, 'LICENSE-PRO.md'), 'utf8') }));
writeFileSync(join(dirname(out), 'tiers.json'), JSON.stringify(Object.fromEntries(Object.entries(config.items).map(([n, v]) => [n, v.tier]))));
const count = (t) => Object.values(items).filter((i) => i.tier === t).length;
console.log(`registry ${config.version}: ${Object.keys(items).length} items (${count('free')} free, ${count('pro')} pro), ${Object.keys(icons).length - 1} icons`);
