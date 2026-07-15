import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  serverExternalPackages: ["@stacks/connect", "@stacks/transactions", "@stacks/network", "@stacks/common"],
};

export default nextConfig;
