import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: [
    '@stacks/connect',
    '@stacks/transactions',
    '@stacks/network',
    '@stacks/common',
    '@reown/appkit',
    '@reown/appkit-common'
  ],
};

export default nextConfig;
