"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./LockScreen.module.css";
import PatternLock from "@/components/puzzles/PatternLock";
import { 
  Flashlight, Lock, Wifi, Bluetooth, 
} from "lucide-react";
import { useOS } from "@/context/OSContext";

export default function LockScreen() {
  const { setSystemState, uvModeEnabled, notifications } = useOS();
  const [view, setView] = useState<"wallpaper" | "passcode">("wallpaper");

  // Group notifications by sender to keep the lockscreen clean
  const groupedNotifs = notifications.reduce((acc, n) => {
    if (!acc[n.sender]) acc[n.sender] = [];
    acc[n.sender].push(n);
    return acc;
  }, {} as Record<string, typeof notifications>);
  
  // Use pointer state instead of touch to fully support laptop mice dragging!
  const pointerStartY = useRef(0);
  const pointerStartX = useRef(0);
  const isDragging = useRef(false);

  // Time formatting for the giant lockscreen clock
  const [time, setTime] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
    };
    update();
    const int = setInterval(update, 10000);
    return () => clearInterval(int);
  }, []);

  // Handle Drag Gestures (Mouse AND Touch simultaneously via onPointer)
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartY.current = e.clientY;
    pointerStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const pointerEndY = e.clientY;
    const distanceY = pointerStartY.current - pointerEndY;
    const startX = pointerStartX.current;
    const startY = pointerStartY.current;
    
    // Swipe UP to unlock
    if (distanceY > 50 && view === "wallpaper") {
      setView("passcode");
    }
  };

  const unlockDevice = () => {
    setSystemState("unlocked");
  };

  return (
    <div 
      className={styles.lockScreenWrapper}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp} // Cancel drag if mouse leaves
    >
      {/* View 1: The Wallpaper & Clock */}
      <div className={`${styles.wallpaperLayer} ${view === "passcode" ? styles.shifted : ""}`}>
        <Lock size={20} className={styles.lockIcon} />
        <div className={styles.clock}>{time || "00:00"}</div>
        <div className={styles.date}>{dateStr || "Loading..."}</div>
        
        <div className={styles.notifList} onPointerDown={(e) => e.stopPropagation()}>
          {Object.entries(groupedNotifs).map(([sender, notifs]) => (
            <div key={sender} className={styles.notification}>
              <div className={styles.notifHeader}>
                <span>{sender}</span>
                <span>{notifs[0].time}</span>
              </div>
              <div className={styles.notifBody}>
                {notifs[0].text}
                {notifs.length > 1 && (
                  <div style={{ fontSize: 13, marginTop: 6, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                    +{notifs.length - 1} more message{notifs.length > 2 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className={styles.emptyNotifs}>No older notifications</div>
          )}
        </div>

        <div className={styles.swipeHint}>Swipe up to open</div>
      </div>

      {/* View 2: The Passcode Entry */}
      <div className={`${styles.passcodeLayer} ${view === "passcode" ? styles.active : ""}`}>
        <h2 className={styles.passcodeTitle}>Enter Passcode</h2>
        
        <PatternLock 
          onSuccess={unlockDevice} 
          uvModeEnabled={uvModeEnabled} 
        />
        
        {/* Cancel button to go back down */}
        <button 
          style={{ marginTop: "40px", fontSize: "16px", color: "var(--text-dim)", padding: "10px" }}
          onClick={(e) => { e.stopPropagation(); setView("wallpaper"); }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
