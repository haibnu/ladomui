import { existsSync } from 'node:fs';
import type { NextConfig } from 'next';

// The Pro components come from the private submodule packages/ui/src/pro; without it the molecule
// pages render a notice instead (components/ProMissing.tsx).
const hasPro = existsSync(new URL('../../packages/ui/src/pro/index.ts', import.meta.url));

const nextConfig: NextConfig = {
  // @ladom/ui and @ladom/icons ship TypeScript source (and CSS Modules); Next compiles them.
  transpilePackages: ['@ladom/ui', '@ladom/icons'],
  ...(hasPro ? {} : { turbopack: { resolveAlias: { '@ladom/ui/pro': './components/ProMissing.tsx' } }, typescript: { ignoreBuildErrors: true } }),
  headers: async () => [
    // The ladom.co showcase (public/showcase/v1, built by scripts/build-showcase.mjs) is loaded cross-origin.
    {
      source: '/showcase/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, HEAD, OPTIONS' },
        { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
        { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
      ],
    },
  ],
  redirects: async () => [
    // The site lives under /en and /tr: Turkish browsers go to /tr, everyone else to /en.
    { source: '/', has: [{ type: 'header', key: 'accept-language', value: 'tr(?:[-,;].*)?' }], destination: '/tr', permanent: false },
    { source: '/', destination: '/en', permanent: false },
    // The license link in every copied file.
    { source: '/license', has: [{ type: 'header', key: 'accept-language', value: 'tr(?:[-,;].*)?' }], destination: '/tr/docs/license', permanent: false },
    { source: '/license', destination: '/en/docs/license', permanent: false },
    // Alert and Toast were molecules.
    { source: '/:lang(en|tr)/docs/molecules/:name(alert|toast)', destination: '/:lang/docs/components/:name', permanent: true },
    // The Pro components moved from /docs/molecules to /docs/pro.
    { source: '/:lang(en|tr)/docs/molecules/:name', destination: '/:lang/docs/pro/:name', permanent: true },
    // Pages from before the languages.
    { source: '/docs/:path*', destination: '/en/docs/:path*', permanent: true },
    { source: '/tokens', destination: '/en/docs/foundations/color', permanent: true },
    { source: '/icons', destination: '/en/docs/foundations/icons', permanent: true },
  ],
};

export default nextConfig;
