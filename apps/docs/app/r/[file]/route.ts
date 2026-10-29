import { createHash, timingSafeEqual } from 'node:crypto';
import registry from '@/registry/registry.json';

// The registry of the ladom-ui CLI:
//   /r/index.json   every item with its tier and dependencies (no code)
//   /r/icons.json   the icon files (free)
//   /r/skill.json   the Claude Code skill (free)
//   /r/<name>.json  one item with its files; Pro items need a license key
// Pro keys are sent as "Authorization: Bearer <key>" and checked against LADOM_UI_PRO_KEYS, a
// comma-separated list of the keys' SHA-256 hex digests (scripts/registry/new-key.mjs makes one).
type Item = { name: string; type: string; tier: 'free' | 'pro'; description: string; dependencies: string[]; icons: string[]; files: { path: string; content: string }[] };
const items = registry.items as Record<string, Item>;

const json = (body: unknown, status = 200, cache = 'public, max-age=300') =>
  Response.json(body, { status, headers: { 'Cache-Control': cache, 'Access-Control-Allow-Origin': '*' } });

const digests = () =>
  (process.env.LADOM_UI_PRO_KEYS ?? '')
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter((d) => /^[0-9a-f]{64}$/.test(d))
    .map((d) => Buffer.from(d, 'hex'));

function validKey(request: Request) {
  const key = /^Bearer\s+(\S+)$/i.exec(request.headers.get('authorization') ?? '')?.[1];
  if (!key) return false;
  const digest = createHash('sha256').update(key).digest();
  return digests().some((d) => d.length === digest.length && timingSafeEqual(d, digest));
}

export async function GET(request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (file === 'index.json') {
    return json({
      version: registry.version,
      items: Object.values(items).map(({ files: _files, ...meta }) => meta),
    });
  }
  if (file === 'icons.json') return json({ version: registry.version, icons: registry.icons });
  if (file === 'skill.json') return json({ version: registry.version, path: '.claude/skills/ladom-ui/SKILL.md', content: registry.skill });

  const item = items[file.replace(/\.json$/, '')];
  if (!file.endsWith('.json') || !item) return json({ error: `No item named "${file.replace(/\.json$/, '')}".` }, 404);
  if (item.tier === 'pro') {
    if (!validKey(request))
      return json(
        { error: `"${item.name}" is a Ladom UI Pro component. Set LADOM_UI_KEY to your license key; see https://ui.ladom.co/license.` },
        401,
        'no-store',
      );
    return json({ version: registry.version, ...item }, 200, 'private, no-store');
  }
  return json({ version: registry.version, ...item });
}
