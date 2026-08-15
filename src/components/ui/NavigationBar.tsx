"use client";

import { useOS } from "@/context/OSContext";
import styles from "./NavigationBar.module.css";
import { Triangle, Circle, Square } from "lucide-react";

export default function NavigationBar() {
  const { activeApp, closeApp } = useOS();

  return (
    <div className={styles.navBar}>
      <button 
        className={styles.navBtn} 
        onClick={() => { if (activeApp) closeApp(); }}
      >
        <Triangle size={18} fill="currentColor" style={{ transform: 'rotate(-90deg)' }} />
      </button>
      
      <button 
        className={styles.navBtn} 
        onClick={() => { if (activeApp) closeApp(); }}
      >
        <Circle size={20} fill="currentColor" />
      </button>
      
      <button className={styles.navBtn}>
        <Square size={18} fill="currentColor" />
      </button>
    </div>
  );
}
