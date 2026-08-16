import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // explicitly allow lan connections so react hydrated correctly
  allowedDevOrigins: ["*", "192.168.29.236"],
  // static out (disabled to allow Cloudflare Pages Edge Functions for API routes)
  // output: "export",
};

export default nextConfig;
