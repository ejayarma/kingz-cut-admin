import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allow any domain
        pathname: "**", // allow any path
      },
    ],
  },
};

export default nextConfig;
