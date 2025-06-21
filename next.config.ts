import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kingz-cut-admin.vercel.app",
        pathname: "/*/**",
      },
    ],
  },
};

export default nextConfig;
