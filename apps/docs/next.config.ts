import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // @ladom/ui and @ladom/icons ship TypeScript source (and CSS Modules); Next compiles them.
  transpilePackages: ['@ladom/ui', '@ladom/icons'],
};

export default nextConfig;
