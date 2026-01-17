import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination:
          "https://jitu-backend-staging.up.railway.app/api/auth/:path*",
      },
      {
        source: "/api/proxy/:path*",
        destination: "https://jitu-backend-staging.up.railway.app/:path*",
      },
    ];
  },
};

export default nextConfig;
