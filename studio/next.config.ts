import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  experimental: {
    serverActions: { bodySizeLimit: "50mb" },
    middlewareClientMaxBodySize: "50mb",
  },
};

export default nextConfig;
