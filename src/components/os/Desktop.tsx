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
  { id: "insta", name: "Instagram", Icon: Instagram, color: "#e1306c" },
  { id: "vault", name: "Secure Vault", Icon: FolderLock, color: "#34c759" },
  { id: "settings", name: "Settings", Icon: Settings, color: "#8e8e93" },
  { id: "maps", name: "Maps", Icon: Map, color: "#34a853" },
  { id: "calendar", name: "Calendar", Icon: Calendar, color: "#ff3b30" }
];

const DOCK_APPS = [
  { id: "phone", name: "Phone", Icon: Phone, color: "#34c759" },
  { id: "messages", name: "Messages", Icon: MessageSquare, color: "#34c759" },
  { id: "safari", name: "Browser", Icon: Globe, color: "#007aff" },
  { id: "music", name: "Music", Icon: Music, color: "#ff2d55" }
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
            <div className={styles.appIcon}>
              <app.Icon size={32} strokeWidth={1.5} color={app.color} />
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
            <div className={styles.appIcon}>
              <app.Icon size={32} strokeWidth={1.5} color={app.color} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
