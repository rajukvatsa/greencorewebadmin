import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  allowedDevOrigins: ['schedular.greencorecentral.com'],
  output: 'standalone',
  trailingSlash: true,
  experimental: {
    esmExternals: false,
  },
};

export default nextConfig;
