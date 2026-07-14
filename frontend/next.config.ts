import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
