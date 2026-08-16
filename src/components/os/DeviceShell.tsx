"use client";

import { ReactNode } from "react";
import { OSProvider, useOS } from "@/context/OSContext";
import StatusBar from "@/components/ui/StatusBar";
import HomeIndicator from "@/components/ui/HomeIndicator";
import NavigationBar from "@/components/ui/NavigationBar";
import styles from "./DeviceShell.module.css";
import { Loader2, Settings2, TriangleAlert, ExternalLink } from "lucide-react";
import { QUEST_CONFIG } from "@/config/quest";
import { SensoryEngine } from "@/utils/sensory";

import LockScreen from "./LockScreen";
import Desktop from "./Desktop";
import InstaApp from "@/components/apps/InstaApp";
import GalleryApp from "@/components/apps/GalleryApp";
import SettingsApp from "@/components/apps/SettingsApp";
import BrowserApp from "@/components/apps/BrowserApp";
import MessagesApp from "@/components/apps/MessagesApp";
import AppContainer from "./AppContainer";
import GameDirector from "./GameDirector";
import BadgeGenerator from "@/components/apps/BadgeGenerator";
import MusicApp from "@/components/apps/MusicApp";

// internal router to switch between OS states and Apps
function OSRouter() {
  const { systemState, activeApp } = useOS();

  if (systemState === "locked") {
    return <LockScreen />;
  }

  return (
    <>
      <Desktop />
      
      {activeApp === "insta" && <InstaApp />}
      {activeApp === "gallery" && <GalleryApp />}
      {activeApp === "settings" && <SettingsApp />}
      {activeApp === "browser" && <BrowserApp />}
      {activeApp === "messages" && <MessagesApp />}
      {activeApp === "badge" && <BadgeGenerator />}
      {activeApp === "music" && <MusicApp />}
      
      {/* Elegant Stub for unimplemented apps */}
      {activeApp && !["insta", "gallery", "settings", "browser", "messages", "badge", "music"].includes(activeApp) && (
        <AppContainer appId={activeApp} appName={activeApp.charAt(0).toUpperCase() + activeApp.slice(1)}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-dim)' }}>
            <Settings2 size={64} style={{ marginBottom: 16, opacity: 0.5 }} />
            <h2>App Not Installed</h2>
            <p>Please connect to a secure network to provision.</p>
          </div>
        </AppContainer>
      )}
    </>
  );
}

import GlobalOverlays from "./GlobalOverlays";
import { useEffect } from "react";

function ScreenContent() {
  const { navStyle, systemState, setSystemState, setGamePhase, setActiveApp, wipeSystem, isFullscreenEnforced } = useOS();

  const handleReboot = () => {
    wipeSystem();
    window.location.reload();
  };

  // Enforce immersive fullscreen mode on mobile browsers
  useEffect(() => {
    let isRequesting = false;
    const enforceFullscreen = async () => {
      if (isFullscreenEnforced && document.documentElement.requestFullscreen && !document.fullscreenElement && !isRequesting) {
        isRequesting = true;
        try {
          await document.documentElement.requestFullscreen();
        } catch (e) {
          // Silent catch for browsers that block it
        } finally {
          isRequesting = false;
        }
      }
    };
    
    if (isFullscreenEnforced) {
      document.addEventListener('click', enforceFullscreen);
      document.addEventListener('touchend', enforceFullscreen);
      document.addEventListener('pointerdown', enforceFullscreen);
    }
    
    return () => {
      document.removeEventListener('click', enforceFullscreen);
      document.removeEventListener('touchend', enforceFullscreen);
      document.removeEventListener('pointerdown', enforceFullscreen);
    };
  }, [isFullscreenEnforced]);

  useEffect(() => {
    if (systemState === "trapped") {
      SensoryEngine.playError();
      const t = setTimeout(() => {
        window.open(QUEST_CONFIG.lore.linktreeUrl, "_blank");
        handleReboot();
      }, 10000);
      return () => clearTimeout(t);
    }
  }, [systemState]);

  if (systemState === "trapped") {
    return (
      <div style={{
        position: 'absolute', inset: 0, background: '#0a0000', zIndex: 999999,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 24, textAlign: 'center', color: '#ff3b30'
      }}>
        <TriangleAlert size={64} color="#ff3b30" />
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 900, marginTop: 16, marginBottom: 16 }}>SYSTEM COMPROMISED</h1>
        <p style={{ color: '#ff8888', fontSize: 14, lineHeight: 1.5, marginBottom: 32, maxWidth: 300 }}>
          You blindly clicked "Allow" and granted unnecessary permissions to an unverified payload. 
          Over-privileging is a critical vulnerability. Re-evaluate your OpSec.
        </p>
        
        <a href={QUEST_CONFIG.lore.linktreeUrl} target="_blank" style={{
          background: '#fff', color: '#000', padding: '12px 24px', borderRadius: 100, textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16
        }}>
          <ExternalLink size={18} /> Join CyberPhoenix
        </a>
        
        <button onClick={handleReboot} style={{
          background: 'transparent', color: '#888', border: '1px solid #333', padding: '8px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer'
        }}>
          REBOOT DEVICE
        </button>
      </div>
    );
  }

  return (
    <>
      <StatusBar />
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <OSRouter />
        <GlobalOverlays />
        {navStyle === 'gesture' && <HomeIndicator />}
      </div>
      {navStyle === 'buttons' && <NavigationBar />}
    </>
  );
}

interface DeviceShellProps {
  children?: ReactNode;
}

export default function DeviceShell({ children }: DeviceShellProps) {
  return (
    <OSProvider>
      <GameDirector />
      <div className={styles.workspace}>
        <div className={styles.deviceFrame}>
          <div className={styles.screen} data-screen="true">
            <ScreenContent />
          </div>
        </div>
      </div>
    </OSProvider>
  );
}
