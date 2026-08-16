"use client";

import styles from "./Desktop.module.css";
import { useOS } from "@/context/OSContext";
import { 
  Instagram, MessageSquare, Phone, Globe, 
  Music, Map, Settings, Calendar, 
  Image, Fingerprint
} from "lucide-react";

// We'll use lucide-react icons for fake apps
const APPS = [
  { id: "insta", name: "Instagram", Icon: Instagram, color: "#e1306c" },
  { id: "gallery", name: "Photos", Icon: Image, color: "#007aff" },
  { id: "settings", name: "Settings", Icon: Settings, color: "#8e8e93" },
  { id: "badge", name: "Badge Gen", Icon: Fingerprint, color: "#34c759" },
  { id: "maps", name: "Maps", Icon: Map, color: "#34a853" },
  { id: "calendar", name: "Calendar", Icon: Calendar, color: "#ff3b30" }
];

const DOCK_APPS = [
  { id: "phone", name: "Phone", Icon: Phone, color: "#34c759" },
  { id: "messages", name: "Messages", Icon: MessageSquare, color: "#34c759" },
  { id: "browser", name: "Browser", Icon: Globe, color: "#007aff" },
  { id: "music", name: "Music", Icon: Music, color: "#ff2d55" }
];

export default function Desktop() {
  const { setActiveApp, setAppOrigin, notifications, gamePhase, activeApp, isClosing } = useOS();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleAppClick = (e: React.MouseEvent, appId: string) => {
    const iconRect = e.currentTarget.getBoundingClientRect();
    const screenEl = e.currentTarget.closest('[data-screen="true"]');
    
    if (screenEl) {
      const screenRect = screenEl.getBoundingClientRect();
      setAppOrigin({ 
        x: (iconRect.left - screenRect.left) + iconRect.width / 2, 
        y: (iconRect.top - screenRect.top) + iconRect.height / 2 
      });
    } else {
      setAppOrigin({ x: iconRect.left + iconRect.width / 2, y: iconRect.top + iconRect.height / 2 });
    }
    
    setActiveApp(appId);
  };

  const isAppOpen = activeApp && !isClosing;

  return (
    <div className={`${styles.desktopWrapper} ${isAppOpen ? styles.appOpen : ""}`} data-screen="true">
      
      {/* Main Grid */}
      <div className={styles.appGrid}>
        {APPS.map((app) => (
          <div 
            key={app.id} 
            className={styles.appWrapper}
            onClick={(e) => handleAppClick(e, app.id)}
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
        {DOCK_APPS.map((app) => (
          <div 
            key={app.id} 
            className={styles.appWrapper}
            onClick={(e) => handleAppClick(e, app.id)}
            style={{ position: 'relative' }}
          >
            {app.id === "messages" && unreadCount > 0 && (
              <div style={{ position: 'absolute', top: -5, right: -5, background: '#ff3b30', color: 'white', borderRadius: '10px', padding: '2px 6px', fontSize: 12, fontWeight: 'bold', zIndex: 10, border: '2px solid rgba(255,255,255,0.2)' }}>
                {unreadCount}
              </div>
            )}
            <div className={styles.appIcon}>
              <app.Icon size={32} strokeWidth={1.5} color={app.color} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
