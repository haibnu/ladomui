// Builds the Ladom UI showcase for ladom.co: public/showcase/v1/showcase.js + showcase.css.
//   node scripts/build-showcase.mjs
// The tokens are rewritten from :root to .ladomui-showcase so the bundle styles its own container
// and never the host page; the device modes (media queries, data-device) are dropped, the desktop
// values stay. Without the Pro submodule the Pro parts become stubs and the bundle still builds.
import { build } from 'esbuild';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const docs = fileURLToPath(new URL('..', import.meta.url));
const tokenDir = fileURLToPath(new URL('../../../packages/tokens/css/', import.meta.url));
const out = `${docs}public/showcase/v1`;
const gen = `${docs}showcase/.generated`;
const SCOPE = '.ladomui-showcase';

const FILES = ['color', 'typography', 'space', 'radius', 'size', 'grid', 'border', 'shadow', 'motion'];

// Splits top-level blocks: [selector-or-at-rule header, body].
function blocks(css) {
  const found = [];
  let depth = 0;
  let start = 0;
  let head = '';
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (ch === '{') {
      if (depth === 0) head = css.slice(start, i).trim();
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) {
        found.push([head, css.slice(css.indexOf('{', start) + 1, i)]);
        start = i + 1;
      }
    }
  }
  return found;
}

function scoped(css) {
  const rules = [];
  for (const [head, body] of blocks(css.replace(/\/\*[\s\S]*?\*\//g, ''))) {
    if (head.startsWith('@')) continue; // breakpoint media queries
    if (head.includes('data-device')) continue;
    rules.push(`${head.replace(/:root/g, SCOPE)} {${body}}`);
  }
  return rules.join('\n');
}

mkdirSync(gen, { recursive: true });
writeFileSync(`${gen}/tokens.css`, FILES.map((f) => scoped(readFileSync(`${tokenDir}${f}.css`, 'utf8'))).join('\n\n'));

const hasPro = existsSync(new URL('../../../packages/ui/src/pro/index.ts', import.meta.url));
const proStub = `${docs}components/ProMissing.tsx`;

mkdirSync(out, { recursive: true });
const result = await build({
  entryPoints: { showcase: `${docs}showcase/entry.tsx` },
  outdir: out,
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2020',
  jsx: 'automatic',
  platform: 'browser',
  legalComments: 'none',
  logLevel: 'warning',
  metafile: true,
  define: { 'process.env.NODE_ENV': '"production"' },
  alias: hasPro ? {} : { '@ladom/ui/pro': proStub },
  loader: { '.svg': 'dataurl' },
  banner: { css: '/* Ladom UI showcase v1: https://ui.ladom.co */' },
  absWorkingDir: docs,
});

const size = (f) => {
  const b = readFileSync(`${out}/${f}`);
  return `${(b.length / 1024).toFixed(1)} kB (${(gzipSync(b).length / 1024).toFixed(1)} kB gzip)`;
};
console.log(`showcase v1: showcase.js ${size('showcase.js')}, showcase.css ${size('showcase.css')}${hasPro ? '' : ' [without Pro]'}`);
