import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // @ladom/ui and @ladom/icons ship TypeScript source (and CSS Modules); Next compiles them.
  transpilePackages: ['@ladom/ui', '@ladom/icons'],
  // Pages that moved under /docs.
  redirects: async () => [
    { source: '/tokens', destination: '/docs/foundations/color', permanent: true },
    { source: '/icons', destination: '/docs/foundations/icons', permanent: true },
  ],
};

export default nextConfig;
