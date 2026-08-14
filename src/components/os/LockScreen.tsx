"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./LockScreen.module.css";
import PatternLock from "@/components/puzzles/PatternLock";
import { 
  Flashlight, Lock, Wifi, Bluetooth, 
  Plane, Signal, Sun, Volume2, 
  Camera, Calculator, LockKeyhole, Cast
} from "lucide-react";
import { useOS } from "@/context/OSContext";
import { HINTS_REGISTRY } from "@/data/puzzles";

export default function LockScreen() {
  const { setSystemState } = useOS();
  const [view, setView] = useState<"wallpaper" | "passcode">("wallpaper");
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [uvModeEnabled, setUvModeEnabled] = useState(false);
  
  // Dummy interactive states to make the CC feel real
  const [toggles, setToggles] = useState({ wifi: true, bt: true, plane: false, calc: false, cam: false, cast: false });
  const [brightness, setBrightness] = useState(70);
  const [volume, setVolume] = useState(40);
  
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
    if (distanceY > 50 && view === "wallpaper" && !showControlCenter && !showNotifications) {
      setView("passcode");
    }
    
    // Swipe DOWN from top-right (Control Center)
    if (distanceY < -50 && startY < 100 && startX > window.innerWidth / 2) {
      setShowControlCenter(true);
    }

    // Swipe DOWN from top-left/center (Notifications)
    if (distanceY < -50 && startY < 100 && startX <= window.innerWidth / 2 && !showControlCenter) {
      setShowNotifications(true);
    }
    
    // Swipe UP to close overlays
    if (distanceY > 50) {
      if (showControlCenter) setShowControlCenter(false);
      if (showNotifications) setShowNotifications(false);
    }
  };

  // Allow clicking on the slider bars to scrub volume/brightness
  const handleScrub = (e: React.MouseEvent, setter: (val: number) => void) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const percentage = Math.max(10, 100 - (clickY / rect.height) * 100);
    setter(percentage);
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
        <Lock size={20} fill="currentColor" className={styles.lockIcon} />
        <div className={styles.clock}>{time || "00:00"}</div>
        <div className={styles.date}>{dateStr || "Loading..."}</div>
        
        {/* Empty state hint since notifs moved */}
        <div className={styles.emptyNotifs}>No Older Notifications</div>

        <div className={styles.swipeHint}>Swipe up to open</div>
      </div>

      {/* View 1.5: Swipe down Notification Center */}
      <div className={`${styles.notificationLayer} ${showNotifications ? styles.active : ""}`}>
        <div className={styles.notifications}>
          <div className={styles.notification}>
            <div className={styles.notifHeader}>
              <span>MESSAGES</span>
              <span>now</span>
            </div>
            <div className={styles.notifBody}>
              {HINTS_REGISTRY.h1}
            </div>
          </div>
        </div>
        <div className={styles.ccHint}>Swipe up to close</div>
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

      {/* View 3: Control Center (Swipe down from top right) */}
      <div className={`${styles.controlCenterLayer} ${showControlCenter ? styles.active : ""}`}>
        
        <div className={styles.ccGrid}>
          {/* Top Left: Connectivity Block */}
          <div className={styles.ccBlock}>
            <div 
              className={`${styles.ccButton} ${toggles.plane ? styles.ccButtonActive : ""}`}
              onClick={(e) => { e.stopPropagation(); setToggles({...toggles, plane: !toggles.plane}); }}
            ><Plane size={20} /></div>
            <div className={`${styles.ccButton} ${styles.ccButtonActive}`}><Signal size={20} /></div>
            <div 
              className={`${styles.ccButton} ${toggles.wifi ? styles.ccButtonActive : ""}`}
              onClick={(e) => { e.stopPropagation(); setToggles({...toggles, wifi: !toggles.wifi}); }}
            ><Wifi size={20} /></div>
            <div 
              className={`${styles.ccButton} ${toggles.bt ? styles.ccButtonActive : ""}`}
              onClick={(e) => { e.stopPropagation(); setToggles({...toggles, bt: !toggles.bt}); }}
            ><Bluetooth size={20} /></div>
          </div>
          
          {/* Top Right: Sliders (Side by side) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className={styles.ccSliderBlock} onClick={(e) => handleScrub(e, setBrightness)}>
              <div className={styles.ccSliderFill} style={{ height: `${brightness}%` }}></div>
              <Sun size={20} className={styles.ccSliderIcon} style={{ color: brightness > 50 ? "black" : "white" }} />
            </div>
            <div className={styles.ccSliderBlock} onClick={(e) => handleScrub(e, setVolume)}>
              <div className={styles.ccSliderFill} style={{ height: `${volume}%` }}></div>
              <Volume2 size={20} className={styles.ccSliderIcon} style={{ color: volume > 50 ? "black" : "white" }} />
            </div>
          </div>
        </div>

        {/* Dummy tools + Flashlight */}
        <div className={styles.ccFlexRow}>
          <div 
            className={`${styles.ccButton} ${uvModeEnabled ? styles.ccButtonActive : ""}`}
            onClick={(e) => { e.stopPropagation(); setUvModeEnabled(!uvModeEnabled); }}
          >
            <Flashlight size={24} />
          </div>
          <div 
            className={`${styles.ccButton} ${toggles.calc ? styles.ccButtonActive : ""}`}
            onClick={(e) => { e.stopPropagation(); setToggles({...toggles, calc: !toggles.calc}); }}
          ><Calculator size={24} /></div>
          <div 
            className={`${styles.ccButton} ${toggles.cam ? styles.ccButtonActive : ""}`}
            onClick={(e) => { e.stopPropagation(); setToggles({...toggles, cam: !toggles.cam}); }}
          ><Camera size={24} /></div>
          <div 
            className={`${styles.ccButton} ${toggles.cast ? styles.ccButtonActive : ""}`}
            onClick={(e) => { e.stopPropagation(); setToggles({...toggles, cast: !toggles.cast}); }}
          ><Cast size={24} /></div>
        </div>
        
        <div className={styles.ccFlexRow} style={{ marginTop: "16px" }}>
           <div className={styles.ccButton} style={{ flex: 2, borderRadius: "16px", justifyContent: "flex-start", paddingLeft: "16px", aspectRatio: "auto", height: "60px" }}>
             <LockKeyhole size={20} style={{ marginRight: "12px" }}/> Focus
           </div>
        </div>

        <div className={styles.ccHint}>Swipe up to close</div>
      </div>
    </div>
  );
}
