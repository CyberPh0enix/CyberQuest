"use client";

import { ReactNode, useRef, useState, useEffect } from "react";
import { useOS } from "@/context/OSContext";
import styles from "./AppContainer.module.css";

interface AppContainerProps {
  appId: string;
  appName: string;
  children: ReactNode;
}

export default function AppContainer({ appId, appName, children }: AppContainerProps) {
  const { activeApp, closeApp, appOrigin, isClosing } = useOS();
  const [mounted, setMounted] = useState(false);
  const [dragY, setDragY] = useState(0);
  const startY = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    // Mount un-shrunk on next frame
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Swipe to close logic (iOS style fallback from AppContainer body)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (window.innerHeight - e.clientY < 50) {
      isDragging.current = true;
      startY.current = e.clientY;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaY = e.clientY - startY.current;
    if (deltaY < 0) { // Swiping UP
      setDragY(deltaY);
    }
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    // If swiped up more than 100px, close the app
    if (dragY < -100) {
      closeApp();
    } else {
      setDragY(0);
    }
  };

  if (activeApp !== appId) return null;

  const scale = dragY < 0 ? Math.max(0.7, 1 + (dragY / 1000)) : 1;
  const opacity = dragY < 0 ? Math.max(0, 1 + (dragY / 300)) : 1;

  const dynamicStyle: React.CSSProperties = {
    transformOrigin: appOrigin ? `${appOrigin.x}px ${appOrigin.y}px` : 'center center',
  };

  if (dragY < 0) {
    dynamicStyle.transform = `translateY(${dragY}px) scale(${scale})`;
    dynamicStyle.opacity = opacity;
    dynamicStyle.transition = isDragging.current ? 'none' : 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.3s ease';
  }

  return (
    <div 
      className={`${styles.appContainer} ${(!mounted || isClosing) ? styles.shrunk : ''}`}
      style={dynamicStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className={styles.macWindowHeader}>
        <div className={styles.macTrafficLights}>
          <div className={styles.macClose} onClick={closeApp}></div>
          <div className={styles.macMin}></div>
          <div className={styles.macMax}></div>
        </div>
        <div className={styles.macTitle}>{appName}</div>
      </div>
      
      <div className={styles.appContent}>
        {children}
      </div>
    </div>
  );
}
