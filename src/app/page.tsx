"use client";

import dynamic from "next/dynamic";

// Force the entire OS to be strictly Client-Side Rendered (CSR), completely bypassing Next.js SSR and Hydration.
// This perfectly mimics a standard Vite/React application like PhoenixOS.
const DeviceShell = dynamic(() => import("@/components/os/DeviceShell"), { ssr: false });

export default function Home() {
  return <DeviceShell />;
}
