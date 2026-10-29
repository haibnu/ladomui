// Makes a Ladom UI Pro license key. Give the key to the licensee; add its digest to the
// LADOM_UI_PRO_KEYS environment variable of the docs project on Vercel (comma-separated), then
// redeploy. Removing a digest revokes that key.
// Usage: node scripts/registry/new-key.mjs [label]
import { createHash, randomBytes } from 'node:crypto';

const key = `ldm_pro_${randomBytes(24).toString('base64url')}`;
const digest = createHash('sha256').update(key).digest('hex');
const label = process.argv[2] ? ` (${process.argv[2]})` : '';
console.log(`key${label}:    ${key}\ndigest: ${digest}`);
