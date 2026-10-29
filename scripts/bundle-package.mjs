// Builds the publishable dist/ of a package, then tsc writes the type declarations.
// Usage (from a package folder):
//   node ../../scripts/bundle-package.mjs <entry...>   bundles the entries to ES modules
//   node ../../scripts/bundle-package.mjs --files      compiles every file of src on its own
// --files keeps each file's 'use client' and leaves the CSS Modules to the app's bundler, so
// server components stay server components (the React components need it).
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { build } from 'esbuild';

const args = process.argv.slice(2);
const perFile = args.includes('--files');
const cwd = process.cwd();
const pkg = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
const external = [...Object.keys(pkg.peerDependencies ?? {}), ...Object.keys(pkg.dependencies ?? {}), 'react/jsx-runtime'];
const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));

rmSync(join(cwd, 'dist'), { recursive: true, force: true });

const common = { outdir: 'dist', outbase: 'src', format: 'esm', platform: 'neutral', target: 'es2022', jsx: 'automatic', logLevel: 'warning' };

if (perFile) {
  const sources = walk(join(cwd, 'src')).filter((f) => /\.tsx?$/.test(f) && !f.endsWith('.d.ts'));
  await build({ ...common, entryPoints: sources, bundle: false });
  // CSS Modules go next to the files that import them.
  for (const css of walk(join(cwd, 'src')).filter((f) => f.endsWith('.css'))) cpSync(css, join(cwd, 'dist', relative(join(cwd, 'src'), css)));
  // Fully specified relative imports, which ESM bundlers require in "type": "module" packages.
  for (const file of walk(join(cwd, 'dist')).filter((f) => f.endsWith('.js'))) {
    const code = readFileSync(file, 'utf8').replace(/(from\s+|import\s*\(\s*|import\s+)(["'])(\.{1,2}\/[^"']+?)\2/g, (m, lead, q, spec) => {
      if (/\.(js|css|json)$/.test(spec)) return m;
      const base = join(dirname(file), spec);
      const target = existsSync(`${base}.js`) ? `${spec}.js` : existsSync(join(base, 'index.js')) ? `${spec}/index.js` : spec;
      return `${lead}${q}${target}${q}`;
    });
    writeFileSync(file, code);
  }
} else {
  const entries = args.filter((a) => !a.startsWith('--'));
  await build({ ...common, entryPoints: entries, bundle: true, splitting: entries.length > 1, external, minifySyntax: true, treeShaking: true });
}

// Type declarations next to the code (dist/index.d.ts, dist/Button/Button.d.ts, …).
const tsconfig = join(cwd, 'tsconfig.dist.json');
writeFileSync(
  tsconfig,
  JSON.stringify({
    extends: './tsconfig.json',
    compilerOptions: { noEmit: false, declaration: true, emitDeclarationOnly: true, rootDir: 'src', outDir: 'dist' },
    include: ['src'],
  }),
);
try {
  execFileSync(join(cwd, '../../node_modules/.bin/tsc'), ['-p', tsconfig], { cwd, stdio: 'inherit' });
} finally {
  rmSync(tsconfig);
}
console.log(`${pkg.name}: dist built`);
