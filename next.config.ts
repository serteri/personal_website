import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore
  eslint: {
    // Uyarı: Bu ayar ESLint hatalarını üretim (production) yapısında yok sayar.
    ignoreDuringBuilds: true,
  },
  // Embeds must be frameable from any client website
  async headers() {
    return [
      {
        source: "/embed/:path*",
        headers: [{ key: "Content-Security-Policy", value: "frame-ancestors *" }],
      },
    ];
  },
  // Old service pages were removed; keep indexed URLs from 404ing.
  async redirects() {
    return [
      { source: "/whatwedo", destination: "/#services", permanent: true },
      { source: "/whatwedo/:path*", destination: "/#services", permanent: true },
    ];
  },
};

export default nextConfig;
