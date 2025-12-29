import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@stacks/connect', '@stacks/transactions', '@stacks/network', '@stacks/common', '@reown/appkit', '@reown/appkit-common', '@reown/appkit-adapter-solana'],
  serverExternalPackages: ['@stacks/connect', '@stacks/transactions', '@stacks/network', '@stacks/common'],
};

export default nextConfig;
