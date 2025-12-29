import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@stacks/connect', '@stacks/transactions', '@stacks/network'],
};

export default nextConfig;
