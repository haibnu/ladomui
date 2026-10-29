import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // @ladom/ui and @ladom/icons ship TypeScript source (and CSS Modules); Next compiles them.
  transpilePackages: ['@ladom/ui', '@ladom/icons'],
  redirects: async () => [
    // The site lives under /en and /tr: Turkish browsers go to /tr, everyone else to /en.
    { source: '/', has: [{ type: 'header', key: 'accept-language', value: 'tr(?:[-,;].*)?' }], destination: '/tr', permanent: false },
    { source: '/', destination: '/en', permanent: false },
    // The license link in every copied file.
    { source: '/license', has: [{ type: 'header', key: 'accept-language', value: 'tr(?:[-,;].*)?' }], destination: '/tr/docs/license', permanent: false },
    { source: '/license', destination: '/en/docs/license', permanent: false },
    // Pages from before the languages.
    { source: '/docs/:path*', destination: '/en/docs/:path*', permanent: true },
    { source: '/tokens', destination: '/en/docs/foundations/color', permanent: true },
    { source: '/icons', destination: '/en/docs/foundations/icons', permanent: true },
  ],
};

export default nextConfig;
