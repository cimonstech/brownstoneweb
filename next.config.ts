import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "@fortawesome/fontawesome-svg-core",
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/free-brands-svg-icons",
      "@fortawesome/react-fontawesome",
    ],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  // Ensure FontAwesome vendor chunks are generated correctly (avoids MODULE_NOT_FOUND for @fortawesome)
  transpilePackages: ["@fortawesome/fontawesome-svg-core", "@fortawesome/free-solid-svg-icons", "@fortawesome/free-brands-svg-icons", "@fortawesome/react-fontawesome"],
  // Allow dev server from other devices on the network (e.g. 192.168.28.186)
  allowedDevOrigins: ["192.168.28.186", "localhost"],
};

export default nextConfig;
