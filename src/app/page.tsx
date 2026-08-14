"use client";

import DeviceShell from "@/components/os/DeviceShell";

export default function Home() {
  return (
    <DeviceShell>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <p style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
          booting os environment...
        </p>
      </div>
    </DeviceShell>
  );
}
