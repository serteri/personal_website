import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Uyarı: Bu ayar ESLint hatalarını üretim (production) yapısında yok sayar.
    ignoreDuringBuilds: true,
  },
  /* config options here */
};

export default nextConfig;
