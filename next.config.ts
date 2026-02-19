import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Para que Tailwind v4 funcione en monorepo
  }
};

export default nextConfig;
