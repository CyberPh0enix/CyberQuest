"use client";

import { useEffect, useState } from "react";
import { Battery, Wifi, Signal, Bell } from "lucide-react";
import styles from "./StatusBar.module.css";
import { useOS } from "@/context/OSContext";

export default function StatusBar() {
  const [time, setTime] = useState<Date | null>(null);
  const { notifications } = useOS();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    setTime(new Date()); // instantly forces a post-hydration re-render
    const timer = setInterval(() => setTime(new Date()), 1000); // 1s tick
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.statusBar}>
      <div className={styles.time}>
        {time ? `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}` : "00:00"}
      </div>
      
      {/* The Notch */}
      <div className={styles.notchContainer}>
        <div className={styles.notch}>
          <div className={styles.cameraHole}></div>
        </div>
      </div>
      
      <div className={styles.icons}>
        {unreadCount > 0 && (
          <div style={{ position: 'relative', marginRight: 4, display: 'flex', alignItems: 'center' }}>
            <Bell size={14} className={styles.icon} />
            <div style={{ position: 'absolute', top: -2, right: -2, width: 6, height: 6, background: '#ff3b30', borderRadius: '50%' }}></div>
          </div>
        )}
        <Signal size={14} className={styles.icon} />
        <Wifi size={14} className={styles.icon} />
        <Battery size={16} className={styles.icon} />
      </div>
    </div>
  );
}
