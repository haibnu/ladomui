// Builds the Design System artifact's components/bundle.js + bundle.css from the ladomui repo:
// one IIFE assigning window.LadomUI, React from window.React / window.ReactDOM.
import { createRequire } from 'node:module';
const { build } = createRequire(process.argv[2] + '/package.json')('esbuild');
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [repo, out, componentsJson] = process.argv.slice(2);
mkdirSync(join(out, 'components'), { recursive: true });

const globals = {
  name: 'react-globals',
  setup(b) {
    b.onResolve({ filter: /^(react|react-dom|react-dom\/client|react\/jsx-runtime)$/ }, (a) => ({ path: a.path, namespace: 'g' }));
    b.onLoad({ filter: /.*/, namespace: 'g' }, (a) => {
      if (a.path === 'react') return { contents: 'module.exports = window.React;', loader: 'js' };
      if (a.path.startsWith('react-dom')) return { contents: 'module.exports = window.ReactDOM;', loader: 'js' };
      // The JSX runtime over createElement (key goes into props; children stay in props).
      return {
        contents: `const R = window.React; const j = (t, p, k) => R.createElement(t, k === undefined ? p : { ...p, key: k });
          module.exports = { jsx: j, jsxs: j, Fragment: R.Fragment };`,
        loader: 'js',
      };
    });
  },
};

const entry = join(out, '_entry.ts');
writeFileSync(entry, `export * from ${JSON.stringify(join(repo, 'packages/ui/src/index.ts'))};\nexport * as Icons from ${JSON.stringify(join(repo, 'packages/icons/src/index.ts'))};\n`);

const result = await build({
  entryPoints: [entry],
  bundle: true,
  format: 'iife',
  globalName: 'LadomUI',
  minify: true,
  target: 'es2020',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  outdir: join(out, '_build'),
  plugins: [globals],
  logOverride: { 'module-level-directive': 'silent' },
  logLevel: 'warning',
  write: false,
});

const names = JSON.parse(readFileSync(componentsJson, 'utf8'));
const header = `/* @ds-bundle: ${JSON.stringify({ format: 4, namespace: 'LadomUI', components: names.map((name) => ({ name })) })} */\n`;
for (const f of result.outputFiles) {
  if (f.path.endsWith('.js')) {
    let js = f.text.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '\\x3C!--');
    writeFileSync(join(out, 'components/bundle.js'), header + js.replace(/^var LadomUI=/, 'window.LadomUI='));
  } else if (f.path.endsWith('.css')) {
    writeFileSync(join(out, 'components/_components.css'), f.text);
  }
}
console.log('bundle built');
