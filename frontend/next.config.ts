import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@stacks/connect', '@stacks/transactions', '@stacks/network'],
};

export default nextConfig;
