"use client";

import { useRef } from "react";
import { useOS } from "@/context/OSContext";
import styles from "./HomeIndicator.module.css";
import { SensoryEngine } from "@/utils/sensory";

export default function HomeIndicator() {
  const { activeApp, closeApp } = useOS();
  const startY = useRef(0);
  const isDragging = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    startY.current = e.clientY;
    isDragging.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const deltaY = e.clientY - startY.current;
    
    // Swipe UP to close app
    if (deltaY < -30 && activeApp) {
      SensoryEngine.playTap();
      closeApp();
    } else if (Math.abs(deltaY) < 10 && activeApp) {
      // Tap to close (fallback)
      SensoryEngine.playTap();
      closeApp();
    }
  };

  return (
    <div 
      className={styles.indicatorContainer} 
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: 'none' }}
    >
      <div className={styles.indicatorBar}></div>
    </div>
  );
}
