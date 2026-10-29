import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // @ladom/ui ships TypeScript source and CSS Modules; Next compiles it.
  transpilePackages: ['@ladom/ui'],
};

export default nextConfig;
