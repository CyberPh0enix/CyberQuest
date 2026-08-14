"use client";

import { useState } from "react";
import { useOS } from "@/context/OSContext";
import styles from "./VaultApp.module.css";
import { FolderLock, ShieldCheck } from "lucide-react";
import AppContainer from "../os/AppContainer";

export default function VaultApp() {
  const { setActiveApp } = useOS();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const handleUnlock = () => {
    // OSINT Puzzle Answer: buster2023
    const normalized = password.toLowerCase().replace(/\s/g, "");
    if (normalized === "buster2023") {
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect Master Password");
      setPassword("");
    }
  };

  return (
    <AppContainer appId="vault" appName="Secure Vault">
      <div className={styles.appWrapper}>
        <div className={styles.content}>
        {!unlocked ? (
          <>
            <FolderLock size={64} className={styles.icon} />
            <h1 className={styles.title}>Enter Password</h1>
            <p className={styles.subtitle}>
              This vault contains sensitive network configuration files.
            </p>

            <div className={styles.inputGroup}>
              <input 
                type="password" 
                className={styles.input}
                placeholder="Master Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              />
              <button className={styles.submitBtn} onClick={handleUnlock}>
                Unlock
              </button>
            </div>
            
            {error && <div className={styles.error}>{error}</div>}
          </>
        ) : (
          <div className={styles.unlockedContent}>
            <div className={styles.unlockedTitle}>
              <ShieldCheck size={24} />
              Access Granted
            </div>
            <div className={styles.unlockedBody}>
              <p>CONFIDENTIAL NETWORK LOG:</p>
              <br />
              <p>The main network terminal has been disconnected due to a severe bandwidth anomaly.</p>
              <br />
              <p>We suspect an unauthorized rogue device is hogging the gateway.</p>
              <p>To restore terminal access, identify the rogue device's <span className={styles.highlight}>MAC Address</span> in the Syslog and drop its connection.</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </AppContainer>
  );
}
