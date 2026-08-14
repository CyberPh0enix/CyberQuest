"use client";

import { useEffect, useState } from "react";
import { Battery, Wifi, Signal } from "lucide-react";
import styles from "./StatusBar.module.css";

export default function StatusBar() {
  const [time, setTime] = useState<Date | null>(null);

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
        <Signal size={14} className={styles.icon} />
        <Wifi size={14} className={styles.icon} />
        <Battery size={16} className={styles.icon} />
      </div>
    </div>
  );
}
