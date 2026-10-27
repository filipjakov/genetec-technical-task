import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Source-only workspace package; webpack does not compile it otherwise (ADR 0002).
  transpilePackages: ['@repo/ui'],
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
};

export default nextConfig;
