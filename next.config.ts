import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // explicitly allow lan connections so react hydrated correctly
  allowedDevOrigins: ["*"],
};

export default nextConfig;
