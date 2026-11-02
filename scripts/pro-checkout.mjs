// Checks out the private Pro components (haibnu/ladomuipro) at packages/ui/src/pro when the
// submodule is empty, as on Vercel, which cannot fetch private submodules. Uses LADOM_PRO_TOKEN,
// a GitHub token that can read that repository; without it the build goes on with the free
// components only. Fetches the commit the submodule points at, or main when that is unknown.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(repo, 'packages/ui/src/pro');
const token = process.env.LADOM_PRO_TOKEN;

if (existsSync(join(dir, 'index.ts'))) process.exit(0);
if (!token) {
  console.warn('pro-checkout: packages/ui/src/pro is empty and LADOM_PRO_TOKEN is not set; building without the Pro components.');
  process.exit(0);
}

const git = (args, cwd = dir) => execFileSync('git', args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
let ref = 'main';
try {
  ref = git(['ls-tree', 'HEAD', 'packages/ui/src/pro'], repo).split(/\s+/)[2] || 'main';
} catch {
  // No git metadata in the build; take main.
}

mkdirSync(dir, { recursive: true });
const url = `https://x-access-token:${token}@github.com/haibnu/ladomuipro.git`;
try {
  git(['init', '-q']);
  git(['fetch', '-q', '--depth', '1', url, ref]);
  git(['checkout', '-q', 'FETCH_HEAD']);
} catch (e) {
  // Keep the token out of the log.
  console.error(`pro-checkout: could not fetch ladomuipro@${ref}: ${String(e.stderr ?? e.message).replaceAll(token, '***')}`);
  process.exit(1);
}
console.log(`pro-checkout: ladomuipro@${ref.slice(0, 7)} checked out.`);
