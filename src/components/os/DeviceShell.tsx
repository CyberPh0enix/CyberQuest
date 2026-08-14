"use client";

import { ReactNode } from "react";
import styles from "./DeviceShell.module.css";

interface DeviceShellProps {
  children: ReactNode;
}

export default function DeviceShell({ children }: DeviceShellProps) {
  return (
    <div className={styles.workspace}>
      <div className={styles.deviceFrame}>
        <div className={styles.screen}>
          {children}
        </div>
      </div>
    </div>
  );
}
