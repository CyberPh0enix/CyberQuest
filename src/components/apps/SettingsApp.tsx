"use client";

import { useState } from "react";
import styles from "./SettingsApp.module.css";
import AppContainer from "../os/AppContainer";
import { ChevronRight, Wifi, Bluetooth, Plane, Info, Lock, Square } from "lucide-react";
import { useOS, NavStyle } from "@/context/OSContext";
import { QUEST_CONFIG } from "@/config/quest";

export default function SettingsApp() {
  const { gamePhase, setGamePhase, navStyle, setNavStyle } = useOS();
  const [view, setView] = useState<"main" | "wifi">("main");
  const [wifiPassword, setWifiPassword] = useState("");
  const [promptNetwork, setPromptNetwork] = useState<string | null>(null);
  const [localConnected, setLocalConnected] = useState<string | null>(null);
  const [error, setError] = useState("");

  const activeNetwork = gamePhase >= 2 ? QUEST_CONFIG.wifi.targetSSID : localConnected;

  const handleConnect = () => {
    const correctPassword = atob(QUEST_CONFIG.wifi.passwordBase64);
    
    if (wifiPassword.toLowerCase().replace(/\s/g, "") === correctPassword) {
      if (promptNetwork === QUEST_CONFIG.wifi.targetSSID) {
        setGamePhase(2);
      } else {
        setLocalConnected(promptNetwork);
      }
      setPromptNetwork(null);
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
            <>
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
                  <span className={styles.valueText}>{activeNetwork ? activeNetwork : "Not Connected"}</span>
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

            <div className={styles.list} style={{ marginTop: 24 }}>
              <div className={styles.listItem} onClick={() => setNavStyle(navStyle === 'gesture' ? 'buttons' : 'gesture')}>
                <div className={styles.iconBox} style={{ background: '#5ac8fa' }}>
                  <Square size={18} color="white" />
                </div>
                <div className={styles.itemText}>3-Button Navigation</div>
                <div className={styles.itemRight}>
                  <div className={`${styles.toggle} ${navStyle === 'buttons' ? styles.toggleOn : ''}`}></div>
                </div>
              </div>
            </div>
            </>
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
              <div className={styles.listItem} onClick={() => activeNetwork !== QUEST_CONFIG.wifi.targetSSID && setPromptNetwork(QUEST_CONFIG.wifi.targetSSID)}>
                <div className={styles.itemText}>
                  {QUEST_CONFIG.wifi.targetSSID}
                </div>
                <div className={styles.itemRight}>
                  {activeNetwork !== QUEST_CONFIG.wifi.targetSSID && <Lock size={14} color="#8e8e93" style={{ marginRight: 4 }} />}
                  {activeNetwork === QUEST_CONFIG.wifi.targetSSID ? <Wifi size={18} color="#0a84ff" /> : <Wifi size={18} color="#8e8e93" />}
                  <Info size={22} color="#0a84ff" style={{ marginLeft: 8 }} />
                </div>
              </div>

              {activeNetwork === QUEST_CONFIG.wifi.targetSSID && (
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
                    <span className={styles.highlight}>{QUEST_CONFIG.router.gatewayIP}</span>
                  </div>
                </div>
              )}

              <h2 className={styles.sectionTitle}>OTHER NETWORKS</h2>
              <div className={styles.listItem} onClick={() => activeNetwork !== "xfinitywifi" && setPromptNetwork("xfinitywifi")}>
                <div className={styles.itemText}>xfinitywifi</div>
                <div className={styles.itemRight}>
                  {activeNetwork === "xfinitywifi" ? <Wifi size={18} color="#0a84ff" /> : <Wifi size={18} color="#8e8e93" />}
                  <Info size={22} color="#0a84ff" style={{ marginLeft: 8 }} />
                </div>
              </div>
              {activeNetwork === "xfinitywifi" && (
                <div className={styles.networkDetails}>
                  <div className={styles.detailRow}>
                    <span>IP Address</span>
                    <span>10.0.0.42</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Router</span>
                    <span className={styles.highlight}>10.0.0.1</span>
                  </div>
                </div>
              )}

              <div className={styles.listItem} onClick={() => activeNetwork !== "Guest_Net" && setPromptNetwork("Guest_Net")}>
                <div className={styles.itemText}>Guest_Net</div>
                <div className={styles.itemRight}>
                  {activeNetwork !== "Guest_Net" && <Lock size={14} color="#8e8e93" style={{ marginRight: 4 }} />}
                  {activeNetwork === "Guest_Net" ? <Wifi size={18} color="#0a84ff" /> : <Wifi size={18} color="#8e8e93" />}
                  <Info size={22} color="#0a84ff" style={{ marginLeft: 8 }} />
                </div>
              </div>
              {activeNetwork === "Guest_Net" && (
                <div className={styles.networkDetails}>
                  <div className={styles.detailRow}>
                    <span>IP Address</span>
                    <span>172.16.0.5</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Router</span>
                    <span className={styles.highlight}>172.16.0.1</span>
                  </div>
                </div>
              )}

              <div className={styles.listItem} onClick={() => activeNetwork !== "NETGEAR_24" && setPromptNetwork("NETGEAR_24")}>
                <div className={styles.itemText}>NETGEAR_24</div>
                <div className={styles.itemRight}>
                  {activeNetwork !== "NETGEAR_24" && <Lock size={14} color="#8e8e93" style={{ marginRight: 4 }} />}
                  {activeNetwork === "NETGEAR_24" ? <Wifi size={18} color="#0a84ff" /> : <Wifi size={18} color="#8e8e93" />}
                  <Info size={22} color="#0a84ff" style={{ marginLeft: 8 }} />
                </div>
              </div>
              {activeNetwork === "NETGEAR_24" && (
                <div className={styles.networkDetails}>
                  <div className={styles.detailRow}>
                    <span>IP Address</span>
                    <span>192.168.1.100</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Router</span>
                    <span className={styles.highlight}>192.168.1.1</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Password Prompt Overlay */}
        {promptNetwork && (
          <div className={styles.promptOverlay}>
            <div className={styles.promptBox}>
              <h3>Enter Password</h3>
              <p>Password for "{promptNetwork}"</p>
              <input 
                type="password" 
                autoFocus 
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
              />
              {error && <div className={styles.error}>{error}</div>}
              <div className={styles.promptActions}>
                <button onClick={() => { setPromptNetwork(null); setError(""); setWifiPassword(""); }}>Cancel</button>
                <button style={{ fontWeight: 600 }} onClick={handleConnect}>Join</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppContainer>
  );
}
