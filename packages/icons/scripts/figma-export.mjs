// Reads the icon components from the Figma Icons page through the Figma REST API and writes
// figma/icons.json, then downloads the SVG of every icon that icons.json sources from Figma into
// figma/svg/<name>.svg. Read-only. Needs FIGMA_TOKEN (a personal access token with
// "File content: read-only" scope), taken from the environment or the repo's .env.local.
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const FILE_KEY = 'VCJ6ew9Vk1gAqfnvQ1gfOz';
const ICONS_PAGE = '2001:2';

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

const figma = async (path, attempt = 1) => {
  const res = await fetch(`https://api.figma.com/v1/${path}`, { headers: { 'X-Figma-Token': token } });
  if (res.status === 429 && attempt <= 3) {
    const wait = Number(res.headers.get('retry-after')) || 30 * attempt;
    console.warn(`Figma rate limit, retrying in ${wait}s`);
    await new Promise((r) => setTimeout(r, wait * 1000));
    return figma(path, attempt + 1);
  }
  if (!res.ok) {
    console.error(`Figma API ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  return res.json();
};

const data = (await figma(`files/${FILE_KEY}/nodes?ids=${encodeURIComponent(ICONS_PAGE)}`)).nodes[ICONS_PAGE];
const descriptions = { ...data.components, ...data.componentSets };

const SHAPES = new Set(['VECTOR', 'BOOLEAN_OPERATION', 'ELLIPSE', 'RECTANGLE', 'LINE', 'STAR', 'REGULAR_POLYGON']);
const shapesIn = (node) => (SHAPES.has(node.type) ? [node] : (node.children ?? []).flatMap(shapesIn));

const icons = [];
const walk = (node, path) => {
  if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
    const shapes = shapesIn(node);
    const box = node.absoluteBoundingBox;
    icons.push({
      id: node.id,
      name: node.name,
      group: path.join(' / ') || undefined,
      description: descriptions[node.id]?.description || undefined,
      size: box ? `${Math.round(box.width)}x${Math.round(box.height)}` : undefined,
      variants: node.type === 'COMPONENT_SET' ? node.children.map((c) => c.name) : undefined,
      shapes: shapes.length,
      stroked: shapes.filter((s) => s.strokes?.length && s.strokeWeight > 0).length,
      strokeWeights: [...new Set(shapes.filter((s) => s.strokes?.length).map((s) => s.strokeWeight))],
    });
    return;
  }
  for (const child of node.children ?? []) walk(child, node.type === 'CANVAS' ? path : [...path, node.name]);
};
walk(data.document, []);

await mkdir(new URL('../figma/', import.meta.url), { recursive: true });
await writeFile(new URL('../figma/icons.json', import.meta.url), JSON.stringify(icons, null, 2) + '\n');
console.log(`figma/icons.json: ${icons.length} icon components`);

// SVGs of the icons that are not Tabler icons.
const mapping = JSON.parse(await readFile(new URL('../icons.json', import.meta.url), 'utf8'));
const fromFigma = Object.entries(mapping).filter(([, v]) => v.source === 'figma');
const exported = new Set(icons.map((i) => i.id));
const urls = {};
for (let i = 0; i < fromFigma.length; i += 50) {
  const ids = fromFigma.slice(i, i + 50).map(([, v]) => v.figma.id);
  for (const id of ids) if (!exported.has(id)) console.warn(`Figma node ${id} is no longer on the Icons page`);
  Object.assign(urls, (await figma(`images/${FILE_KEY}?format=svg&ids=${encodeURIComponent(ids.join(','))}`)).images);
}
await mkdir(new URL('../figma/svg/', import.meta.url), { recursive: true });
await Promise.all(
  fromFigma.map(async ([name, v]) => {
    const url = urls[v.figma.id];
    if (!url) throw new Error(`No SVG for ${name} (${v.figma.id})`);
    await writeFile(new URL(`../figma/svg/${name}.svg`, import.meta.url), await (await fetch(url)).text());
  }),
);
console.log(`figma/svg: ${fromFigma.length} icons`);
