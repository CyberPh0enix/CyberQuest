"use client";

import { ReactNode } from "react";
import { OSProvider, useOS } from "@/context/OSContext";
import StatusBar from "@/components/ui/StatusBar";
import HomeIndicator from "@/components/ui/HomeIndicator";
import styles from "./DeviceShell.module.css";
import { Loader2, Settings2 } from "lucide-react";

import LockScreen from "./LockScreen";
import Desktop from "./Desktop";
import InstaApp from "@/components/apps/InstaApp";
import VaultApp from "@/components/apps/VaultApp";
import AppContainer from "./AppContainer";

// internal router to switch between OS states and Apps
function OSRouter() {
  const { systemState, activeApp } = useOS();

  if (systemState === "locked") {
    return <LockScreen />;
  }

  if (activeApp) {
    if (activeApp === "insta") return <InstaApp />;
    if (activeApp === "vault") return <VaultApp />;
    
    // Elegant Stub for unimplemented apps
    return (
      <AppContainer appId={activeApp} appName={activeApp.charAt(0).toUpperCase() + activeApp.slice(1)}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-dim)' }}>
          <Settings2 size={64} style={{ marginBottom: 16, opacity: 0.5 }} />
          <h2>App Not Implemented</h2>
          <p>This module is currently offline.</p>
        </div>
      </AppContainer>
    );
  }

  return <Desktop />;
}

import GlobalOverlays from "./GlobalOverlays";

function ScreenContent() {
  return (
    <>
      <StatusBar />
      <OSRouter />
      <GlobalOverlays />
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
