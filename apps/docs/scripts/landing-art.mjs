// Downloads the landing page art from the "Ladom Agency Website" Figma file (LP - Desktop, 173:25296)
// as SVG and writes components/landing/art/figma.ts. Each illustration keeps Figma's drawing; this
// script only tags the layers that move (see landing.module.css) and drops the card background,
// which CSS draws. Read-only on Figma. Needs FIGMA_TOKEN from the environment or the repo's .env.local.
import { writeFile } from 'node:fs/promises';

const FILE_KEY = 'hmItJvSTf6wg2VLYYVFu6j';

try {
  process.loadEnvFile(new URL('../../../.env.local', import.meta.url));
} catch {
  // No .env.local; FIGMA_TOKEN may come from the environment.
}
const token = process.env.FIGMA_TOKEN;
if (!token) {
  console.error('FIGMA_TOKEN is not set. Add it to .env.local at the repo root.');
  process.exit(1);
}

// The ground line under a block: everything above it may sink, nothing shows below it.
const BLOCK_GROUND = '0,0 388,0 388,196 292.8,196 162.4,271 96.9,233.2 0,233.2';

// name: registry or page part; node: the illustration in a Component Card (or the hero part);
// tags: Figma layer name -> class; press: wraps the layers from `from` to the end in a sinking body.
const ART = [
  { name: 'avatar', node: '209:31330', tags: { 'Group 3116': 'a-coin1', 'Group 3115': 'a-coin2', 'Group 3111': 'a-coin3', 'Icon/contact_3': 'a-coin3' } },
  { name: 'button', node: 'I209:31025;209:31330', tags: { 'Rectangle 331': 'a-shadow' }, press: { from: 'Rectangle 327', clip: BLOCK_GROUND } },
  {
    name: 'checkbox',
    node: 'I209:31050;209:31330',
    tags: { 'Rectangle 333': 'a-shadow', 'tabler-icon-check': 'a-tick' },
    press: { from: 'Rectangle 334', clip: '0,0 388,0 388,190.5 259.5,190.5 194,228.3 128.5,190.5 0,190.5' },
  },
  { name: 'radio', node: 'I209:31075;209:31330', tags: { 'Rectangle 333': 'a-shadow' }, wrap: { from: 'Ellipse 194', to: 'Ellipse 193', cls: 'a-dot' } },
  {
    name: 'selectbox',
    node: 'I209:31164;209:31330',
    tags: { 'Rectangle 331': 'a-shadow', 'tabler-icon-chevron-down': 'a-chevron' },
    press: { from: 'Rectangle 327', clip: BLOCK_GROUND },
  },
  { name: 'tab', node: 'I209:31189;209:31330', tags: { 'Group 3117': 'a-tab' } },
  { name: 'cell', node: 'I223:27211;209:31330', tags: { 'Group 3120': 'a-row1', 'Group 3121': 'a-row2', 'Group 3122': 'a-row3' } },
  { name: 'modal', node: 'I209:31100;209:31330', tags: { 'Group 3119': 'a-modal', 'Icon/close': 'a-modal' } },
  { name: 'drawer', node: 'I225:26024;209:31330', tags: { 'Group 3119': 'a-drawer', 'Icon/close': 'a-drawer' } },
  { name: 'heroL', node: '209:30125', tags: { Group: 'a-l1', Group_2: 'a-l2', Group_3: 'a-l3', Group_4: 'a-l4' }, frame: false },
  { name: 'uiMark', node: '196:27842', frame: false, ink: true },
  { name: 'figmaMark', node: '196:27851', frame: false },
  { name: 'logo', node: '173:26410', frame: false },
];

const figma = async (path) => {
  const res = await fetch(`https://api.figma.com/v1/${path}`, { headers: { 'X-Figma-Token': token } });
  if (!res.ok) {
    console.error(`Figma API ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  return res;
};

const ids = ART.map((a) => a.node).join(',');
const { images } = await (await figma(`images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=svg&svg_include_id=true&svg_simplify_stroke=true`)).json();

function transform(svg, art) {
  let s = svg.replace(/\r/g, '').trim();
  // Figma writes background blur as an empty foreignObject; the page does not need it.
  s = s.replace(/<foreignObject[\s\S]*?<\/foreignObject>/g, '').replace(/ data-figma-[a-z-]+="[^"]*"/g, '');
  // Text-coloured lines follow the page's ink colour.
  if (art.ink) s = s.replaceAll('"#1C1A09"', '"currentColor"');
  const idAttr = (name) => `id="${name}"`;
  for (const [name, cls] of Object.entries(art.tags ?? {})) {
    if (!s.includes(idAttr(name))) throw new Error(`${art.name}: no layer "${name}"`);
    const start = s.lastIndexOf('<', s.indexOf(idAttr(name)));
    const end = s.indexOf('>', start) + 1;
    const tag = s.slice(start, end);
    // A transformed shape moves inside a wrapper, so the motion does not shift its own transform.
    s = tag.includes(' transform=') && tag.endsWith('/>') ? `${s.slice(0, start)}<g class="${cls}">${tag}</g>${s.slice(end)}` : s.replace(idAttr(name), `${idAttr(name)} class="${cls}"`);
  }
  if (art.wrap) {
    const start = s.lastIndexOf('<', s.indexOf(idAttr(art.wrap.from)));
    const endTag = s.indexOf('/>', s.indexOf(idAttr(art.wrap.to))) + 2;
    s = `${s.slice(0, start)}<g class="${art.wrap.cls}">${s.slice(start, endTag)}</g>${s.slice(endTag)}`;
  }
  if (art.press) {
    const start = s.lastIndexOf('<', s.indexOf(idAttr(art.press.from)));
    const defs = s.indexOf('<defs>');
    const end = s.lastIndexOf('</g>', defs >= 0 ? defs : s.lastIndexOf('</svg>'));
    s = `${s.slice(0, start)}<g clip-path="url(#ground-${art.name})"><g class="a-body">${s.slice(start, end)}</g></g>${s.slice(end)}`;
    const clip = `<clipPath id="ground-${art.name}"><polygon points="${art.press.clip}"/></clipPath>`;
    s = s.includes('<defs>') ? s.replace('<defs>', `<defs>${clip}`) : s.replace('</svg>', `<defs>${clip}</defs></svg>`);
  }
  if (art.frame !== false) {
    // The card frame (background and its soft border) is drawn by CSS.
    s = s.replace(/<rect x="9" y="9" width="370" height="340" rx="4" fill="#EFEEEC"\/>\n?/, '');
    s = s.replace(/<rect x="4.5" y="4.5" width="379" height="349" rx="8.5"[^>]*\/>\n?/, '');
    s = s.replace(/viewBox="0 0 388 358"/, 'viewBox="9 9 370 340"');
  }
  // Keep only ids that something points at, prefixed so they are unique on the page.
  const used = new Set([...s.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1]));
  s = s.replace(/ id="([^"]+)"/g, (m, id) => (used.has(id) ? ` id="${art.name}-${id}"` : ''));
  s = s.replace(/url\(#([^)]+)\)/g, (m, id) => `url(#${art.name}-${id})`);
  return s
    .replace(/<svg width="[^"]*" height="[^"]*"/, '<svg')
    .replace(/\n/g, '')
    .replace(/>\s+</g, '><');
}

let out = `// Generated by scripts/landing-art.mjs from the Ladom Agency Website Figma file. Do not edit.\n\n`;
for (const art of ART) {
  const res = await fetch(images[art.node]);
  if (!res.ok) throw new Error(`${art.name}: download failed (${res.status})`);
  const svg = await res.text();
  out += `export const ${art.name} = ${JSON.stringify(transform(svg, art))};\n`;
}
await writeFile(new URL('../components/landing/art/figma.ts', import.meta.url), out);
console.log(`Wrote ${ART.length} illustrations.`);
