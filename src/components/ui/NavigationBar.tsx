"use client";

import { useOS } from "@/context/OSContext";
import styles from "./NavigationBar.module.css";
import { Triangle, Circle, Square } from "lucide-react";
import { SensoryEngine } from "@/utils/sensory";

export default function NavigationBar() {
  const { activeApp, closeApp } = useOS();

  return (
    <div className={styles.navBar}>
      <button 
        className={styles.navBtn} 
        onClick={() => { SensoryEngine.playTap(); if (activeApp) closeApp(); }}
      >
        <Triangle size={18} fill="currentColor" style={{ transform: 'rotate(-90deg)' }} />
      </button>
      
      <button 
        className={styles.navBtn} 
        onClick={() => { SensoryEngine.playTap(); if (activeApp) closeApp(); }}
      >
        <Circle size={20} fill="currentColor" />
      </button>
      
      <button className={styles.navBtn} onClick={() => SensoryEngine.playTap()}>
        <Square size={18} fill="currentColor" />
      </button>
    </div>
  );
}
