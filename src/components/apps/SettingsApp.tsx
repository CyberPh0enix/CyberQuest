"use client";

import { useState } from "react";
import styles from "./SettingsApp.module.css";
import AppContainer from "../os/AppContainer";
import { ChevronRight, Wifi, Bluetooth, Plane, Info, Lock } from "lucide-react";
import { useOS } from "@/context/OSContext";

export default function SettingsApp() {
  const { gamePhase, setGamePhase } = useOS();
  const [view, setView] = useState<"main" | "wifi">("main");
  const [wifiPassword, setWifiPassword] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [error, setError] = useState("");

  const wifiConnected = gamePhase >= 2;

  const handleConnect = () => {
    if (wifiPassword.toLowerCase().replace(/\s/g, "") === "buster2023") {
      setGamePhase(2);
      setShowPrompt(false);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <AppContainer appId="settings" appName="Settings">
      <div className={styles.appWrapper}>
        <div className={styles.header}>
          {view === "wifi" ? (
            <button className={styles.backBtn} onClick={() => setView("main")}>
              Settings
            </button>
          ) : (
            <span style={{ marginLeft: 16 }}>Settings</span>
          )}
        </div>

        <div className={styles.content}>
          {view === "main" && (
            <div className={styles.list}>
              <div className={styles.listItem}>
                <div className={styles.iconBox} style={{ background: '#ff9500' }}>
                  <Plane size={18} color="white" />
                </div>
                <div className={styles.itemText}>Airplane Mode</div>
                <div className={styles.itemRight}>
                  <div className={styles.toggle}></div>
                </div>
              </div>
              <div className={styles.listItem} onClick={() => setView("wifi")}>
                <div className={styles.iconBox} style={{ background: '#007aff' }}>
                  <Wifi size={18} color="white" />
                </div>
                <div className={styles.itemText}>Wi-Fi</div>
                <div className={styles.itemRight}>
                  <span className={styles.valueText}>{wifiConnected ? "Home_Network_5G" : "Not Connected"}</span>
                  <ChevronRight size={20} color="#c7c7cc" />
                </div>
              </div>
              <div className={styles.listItem}>
                <div className={styles.iconBox} style={{ background: '#007aff' }}>
                  <Bluetooth size={18} color="white" />
                </div>
                <div className={styles.itemText}>Bluetooth</div>
                <div className={styles.itemRight}>
                  <span className={styles.valueText}>On</span>
                  <ChevronRight size={20} color="#c7c7cc" />
                </div>
              </div>
            </div>
          )}

          {view === "wifi" && (
            <div className={styles.list}>
              <h2 className={styles.sectionTitle}>WI-FI</h2>
              <div className={styles.listItem}>
                <div className={styles.itemText}>Wi-Fi</div>
                <div className={styles.itemRight}>
                  <div className={`${styles.toggle} ${styles.toggleOn}`}></div>
                </div>
              </div>

              <h2 className={styles.sectionTitle}>MY NETWORKS</h2>
              <div className={styles.listItem} onClick={() => !wifiConnected && setShowPrompt(true)}>
                <div className={styles.itemText}>
                  Home_Network_5G
                </div>
                <div className={styles.itemRight}>
                  {!wifiConnected && <Lock size={14} color="#8e8e93" style={{ marginRight: 4 }} />}
                  {wifiConnected ? <Wifi size={18} color="#0a84ff" /> : <Wifi size={18} color="#8e8e93" />}
                  <Info size={22} color="#0a84ff" style={{ marginLeft: 8 }} />
                </div>
              </div>

              {wifiConnected && (
                <div className={styles.networkDetails}>
                  <div className={styles.detailRow}>
                    <span>IP Address</span>
                    <span>192.168.0.105</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Subnet Mask</span>
                    <span>255.255.255.0</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Router</span>
                    <span className={styles.highlight}>192.168.0.1</span>
                  </div>
                </div>
              )}

              <h2 className={styles.sectionTitle}>OTHER NETWORKS</h2>
              <div className={styles.listItem}>
                <div className={styles.itemText}>xfinitywifi</div>
                <div className={styles.itemRight}>
                  <Wifi size={18} color="#8e8e93" />
                  <Info size={22} color="#0a84ff" style={{ marginLeft: 8 }} />
                </div>
              </div>
              <div className={styles.listItem}>
                <div className={styles.itemText}>Guest_Net</div>
                <div className={styles.itemRight}>
                  <Lock size={14} color="#8e8e93" style={{ marginRight: 4 }} />
                  <Wifi size={18} color="#8e8e93" />
                  <Info size={22} color="#0a84ff" style={{ marginLeft: 8 }} />
                </div>
              </div>
              <div className={styles.listItem}>
                <div className={styles.itemText}>NETGEAR_24</div>
                <div className={styles.itemRight}>
                  <Lock size={14} color="#8e8e93" style={{ marginRight: 4 }} />
                  <Wifi size={18} color="#8e8e93" />
                  <Info size={22} color="#0a84ff" style={{ marginLeft: 8 }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Password Prompt Overlay */}
        {showPrompt && (
          <div className={styles.promptOverlay}>
            <div className={styles.promptBox}>
              <h3>Enter Password</h3>
              <p>Password for "Home_Network_5G"</p>
              <input 
                type="password" 
                autoFocus 
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
              />
              {error && <div className={styles.error}>{error}</div>}
              <div className={styles.promptActions}>
                <button onClick={() => setShowPrompt(false)}>Cancel</button>
                <button style={{ fontWeight: 600 }} onClick={handleConnect}>Join</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppContainer>
  );
}
