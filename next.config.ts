import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
    qualities: [75, 80, 100],
  },
  allowedDevOrigins: [
    "smoke-handmade-continues-offshore.trycloudflare.com",
  ],
};

export default nextConfig;
