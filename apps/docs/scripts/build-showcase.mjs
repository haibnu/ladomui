// Builds the Ladom UI showcase for ladom.co: public/showcase/v1/showcase.js + showcase.css.
//   node scripts/build-showcase.mjs
// The tokens are rewritten from :root to .ladomui-showcase so the bundle styles its own container
// and never the host page; the device modes (media queries, data-device) are dropped, the desktop
// values stay. CSS Module class and keyframe names are renamed to `lds-<n>`, so the global
// showcase.css never matches a host page's own classes (a bare `.js` once disabled ladom.co's
// <html class="js">); the showcase's own global classes all start with `ls-` or `ladomui-`.
// Without the Pro submodule the Pro parts become stubs and the bundle still builds.
import { build, transform } from 'esbuild';
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
  // Identifiers stay long here so CSS Module names come out as `File_local`; renamed and minified below.
  minifyWhitespace: true,
  minifySyntax: true,
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

// esbuild names CSS Module classes and keyframes `<File>_<local>` (plus a number on clashes) and
// has no option for a prefix, so they are renamed here, in the CSS and in the JS string literals.
const cssPath = `${out}/showcase.css`;
const jsPath = `${out}/showcase.js`;
let css = readFileSync(cssPath, 'utf8');
let js = readFileSync(jsPath, 'utf8');
const LOCAL = /(?<=\.|@keyframes\s*)[A-Za-z][A-Za-z0-9]*_[A-Za-z0-9_-]+/g;
const names = new Map();
for (const name of css.match(LOCAL) ?? []) if (!names.has(name)) names.set(name, `lds-${names.size.toString(36)}`);
const word = (name) => new RegExp(`(?<![\\w-])${name}(?![\\w-])`, 'g');
for (const [name, short] of names) {
  css = css.replace(word(name), short);
  js = js.replaceAll(`"${name}"`, `"${short}"`);
}
const bare = [...new Set(css.match(/(?<![\w-])\.[A-Za-z_-][\w-]*/g))].filter(
  (c) => !/^\.(lds-|ls-|ladomui-)/.test(c) && !/^\.(css|com|googleapis)$/.test(c),
);
if (bare.length) throw new Error(`showcase: unprefixed classes in showcase.css: ${bare.join(' ')}`);
writeFileSync(cssPath, css);
writeFileSync(jsPath, (await transform(js, { minify: true, target: 'es2020', legalComments: 'none' })).code);

const size = (f) => {
  const b = readFileSync(`${out}/${f}`);
  return `${(b.length / 1024).toFixed(1)} kB (${(gzipSync(b).length / 1024).toFixed(1)} kB gzip)`;
};
console.log(`showcase v1: showcase.js ${size('showcase.js')}, showcase.css ${size('showcase.css')}${hasPro ? '' : ' [without Pro]'}`);
