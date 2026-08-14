"use client";

import styles from "./Desktop.module.css";
import { useOS } from "@/context/OSContext";
import { 
  Instagram, MessageSquare, Phone, Globe, 
  Music, Map, Settings, Calendar, 
  FolderLock
} from "lucide-react";
import { HINTS_REGISTRY } from "@/data/puzzles";

// We'll use lucide-react icons for fake apps
const APPS = [
  { id: "insta", name: "Instagram", Icon: Instagram, customClass: styles.instaIcon },
  { id: "vault", name: "Secure Vault", Icon: FolderLock, customClass: styles.vaultIcon },
  { id: "settings", name: "Settings", Icon: Settings, customClass: "" },
  { id: "maps", name: "Maps", Icon: Map, customClass: "" },
  { id: "calendar", name: "Calendar", Icon: Calendar, customClass: "" }
];

const DOCK_APPS = [
  { id: "phone", name: "Phone", Icon: Phone, customClass: "" },
  { id: "messages", name: "Messages", Icon: MessageSquare, customClass: "" },
  { id: "safari", name: "Browser", Icon: Globe, customClass: "" },
  { id: "music", name: "Music", Icon: Music, customClass: "" }
];

export default function Desktop() {
  const { setActiveApp } = useOS();

  return (
    <div className={styles.desktopWrapper}>
      
      {/* Main Grid */}
      <div className={styles.appGrid}>
        {APPS.map(app => (
          <div 
            key={app.id} 
            className={styles.appWrapper}
            onClick={() => setActiveApp(app.id)}
          >
            <div className={`${styles.appIcon} ${app.customClass}`}>
              <app.Icon size={32} strokeWidth={1.5} color="white" />
            </div>
            <span className={styles.appLabel}>{app.name}</span>
          </div>
        ))}
      </div>

      {/* Dock */}
      <div className={styles.dock}>
        {DOCK_APPS.map(app => (
          <div 
            key={app.id} 
            className={styles.appWrapper}
            // For dummy apps, we can just log or alert, or actually set activeApp to show a stub
            onClick={() => setActiveApp(app.id)}
          >
            <div className={`${styles.appIcon} ${app.customClass}`}>
              <app.Icon size={32} strokeWidth={1.5} color="white" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
