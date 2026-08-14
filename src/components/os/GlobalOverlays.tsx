"use client";

import { useState, useRef } from "react";
import styles from "./LockScreen.module.css";
import { 
  Flashlight, LockKeyhole, Wifi, Bluetooth, 
  Plane, Signal, Sun, Volume2, 
  Camera, Calculator, Cast
} from "lucide-react";
import { HINTS_REGISTRY } from "@/data/puzzles";

export default function GlobalOverlays() {
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [uvModeEnabled, setUvModeEnabled] = useState(false);
  
  // Dummy CC states
  const [toggles, setToggles] = useState({ wifi: true, bt: true, plane: false, calc: false, cam: false, cast: false });
  const [brightness, setBrightness] = useState(70);
  const [volume, setVolume] = useState(40);

  const pointerStartY = useRef(0);
  const pointerStartX = useRef(0);
  const isDragging = useRef(false);

  // We add a global listener to the top edge (20px) to pull down the overlays
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.clientY < 30) {
      pointerStartY.current = e.clientY;
      pointerStartX.current = e.clientX;
      isDragging.current = true;
    }
    // Also allow dragging UP to close them if they are open
    if (showControlCenter || showNotifications) {
      pointerStartY.current = e.clientY;
      pointerStartX.current = e.clientX;
      isDragging.current = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const pointerEndY = e.clientY;
    const distanceY = pointerStartY.current - pointerEndY;
    const startX = pointerStartX.current;
    
    // Swipe DOWN from top-right (Control Center)
    if (distanceY < -50 && !showControlCenter && startX > window.innerWidth / 2) {
      setShowControlCenter(true);
    }
    // Swipe DOWN from top-left (Notifications)
    if (distanceY < -50 && !showNotifications && startX <= window.innerWidth / 2) {
      setShowNotifications(true);
    }
    // Swipe UP to close
    if (distanceY > 50) {
      setShowControlCenter(false);
      setShowNotifications(false);
    }
  };

  const handleScrub = (e: React.MouseEvent, setter: (val: number) => void) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const percentage = Math.max(10, 100 - (clickY / rect.height) * 100);
    setter(percentage);
  };

  return (
    <div 
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: (showControlCenter || showNotifications) ? 'auto' : 'none', zIndex: 100 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Invisible Top Edge Hitbox */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '30px', pointerEvents: 'auto', zIndex: 101 }}></div>

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

      {/* View 3: Control Center */}
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
           <div className={styles.ccButton} style={{ flex: 2, borderRadius: "16px", justifySelf: "flex-start", width: "100%", justifyContent: "flex-start", paddingLeft: "16px", height: "60px", aspectRatio: "auto" }}>
             <LockKeyhole size={20} style={{ marginRight: "12px" }}/> Focus
           </div>
        </div>

        <div className={styles.ccHint}>Swipe up to close</div>
      </div>
    </div>
  );
}
