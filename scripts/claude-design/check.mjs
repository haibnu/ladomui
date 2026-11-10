// Fails when a component exported by @ladom/ui (and @ladom/ui/pro, when checked out) has no card
// in components.mjs, so the claude.ai design system cannot fall behind the package. Run by the
// registry build (and so by every docs build); `node scripts/claude-design/check.mjs` alone too.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMPONENTS } from './components.mjs';

// Parts shown on their parent's card.
export const PARTS = { AvatarGroup: 'Avatar', Calendar: 'DatePicker', CellActions: 'Cell', CellHelper: 'Cell', CellSearch: 'Cell', ToastProvider: 'Toast', SidebarNavSection: 'SidebarNav', SidebarNavItem: 'SidebarNav', TopNavItem: 'TopNav' };

export function missingCards(repo) {
  const exported = ['packages/ui/src/index.ts', 'packages/ui/src/pro/index.ts']
    .map((f) => join(repo, f))
    .filter(existsSync)
    .flatMap((f) => [...readFileSync(f, 'utf8').matchAll(/^export \{([^}]*)\}/gm)].flatMap((m) => m[1].split(',')))
    .map((s) => s.trim())
    .filter((s) => /^[A-Z]/.test(s));
  const cards = new Set(COMPONENTS.map((c) => c.name));
  return exported.filter((name) => !cards.has(name) && !PARTS[name]);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const missing = missingCards(join(dirname(fileURLToPath(import.meta.url)), '../..'));
  if (missing.length) {
    console.error(`claude design system: no card in scripts/claude-design/components.mjs for ${missing.join(', ')}`);
    process.exit(1);
  }
  console.log('claude design system: every component has a card');
}
