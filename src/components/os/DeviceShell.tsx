"use client";

import { ReactNode } from "react";
import { OSProvider, useOS } from "@/context/OSContext";
import StatusBar from "@/components/ui/StatusBar";
import HomeIndicator from "@/components/ui/HomeIndicator";
import styles from "./DeviceShell.module.css";
import { Loader2 } from "lucide-react";

import LockScreen from "./LockScreen";
import Desktop from "./Desktop";
import InstaApp from "@/components/apps/InstaApp";
import VaultApp from "@/components/apps/VaultApp";

// internal router to switch between OS states and Apps
function OSRouter() {
  const { systemState, activeApp } = useOS();

  if (systemState === "locked") {
    return <LockScreen />;
  }

  if (activeApp) {
    if (activeApp === "insta") return <InstaApp />;
    if (activeApp === "vault") return <VaultApp />;
    return <div style={{ padding: "60px 20px" }}>App "{activeApp}" not implemented yet.</div>;
  }

  return <Desktop />;
}

function ScreenContent() {
  return (
    <>
      <StatusBar />
      <OSRouter />
      <HomeIndicator />
    </>
  );
}

interface DeviceShellProps {
  children?: ReactNode;
}

export default function DeviceShell({ children }: DeviceShellProps) {
  return (
    <OSProvider>
      <div className={styles.workspace}>
        <div className={styles.deviceFrame}>
          <div className={styles.screen}>
            <ScreenContent />
          </div>
        </div>
      </div>
    </OSProvider>
  );
}
