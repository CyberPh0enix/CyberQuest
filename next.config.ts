import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // explicitly allow lan connections so react hydrated correctly
  allowedDevOrigins: ["*", "192.168.29.236"],
};

export default nextConfig;
