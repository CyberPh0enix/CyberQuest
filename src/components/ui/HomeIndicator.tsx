"use client";

import { useOS } from "@/context/OSContext";
import styles from "./HomeIndicator.module.css";

export default function HomeIndicator() {
  const { activeApp, setActiveApp } = useOS();

  const handleGoHome = () => {
    if (activeApp) {
      setActiveApp(null);
    }
  };

  return (
    <div className={styles.indicatorContainer} onClick={handleGoHome}>
      <div className={styles.indicatorBar}></div>
    </div>
  );
}
