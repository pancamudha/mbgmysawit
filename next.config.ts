import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Wildcard: Mengizinkan semua domain HTTPS eksternal
      },
      {
        protocol: "http",
        hostname: "**", // Wildcard: Mengizinkan HTTP jika ada CDN lama yang belum SSL
      },
    ],
  },
};

export default nextConfig;