"use client";

import { useState, useEffect } from "react";
import styles from "./BrowserApp.module.css";
import AppContainer from "../os/AppContainer";
import { Lock, RefreshCw, X, Menu, ShieldCheck } from "lucide-react";
import { useOS } from "@/context/OSContext";
import { QUEST_CONFIG } from "@/config/quest";
import BadgeGenerator from "./BadgeGenerator";
import BadgeGenerator from "./BadgeGenerator";

export default function BrowserApp() {
  const { gamePhase, setGamePhase } = useOS();
  const [url, setUrl] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  
  // Router State
  const [rogueMac, setRogueMac] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [routerAuth, setRouterAuth] = useState(false);
  const [routerTab, setRouterTab] = useState<"dashboard" | "logs" | "access">("dashboard");
  const [macInput, setMacInput] = useState("");
  const [error, setError] = useState("");
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    const chars = "0123456789ABCDEF";
    let mac = "";
    for(let i=0; i<12; i++) {
      mac += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRogueMac(mac);
  }, []);

  const formattedMac = rogueMac ? rogueMac.match(/.{1,2}/g)?.join(":") : "";
  const isBlocked = gamePhase >= 4;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = url.trim().toLowerCase();
    if (finalUrl.startsWith("http://")) finalUrl = finalUrl.replace("http://", "");
    setCurrentUrl(finalUrl);
  };

  const handleBlockDevice = () => {
    setGamePhase(4);
  };

  const handleRouterLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = atob(QUEST_CONFIG.router.passwordBase64);
    if (username === QUEST_CONFIG.router.username && password === correctPassword) {
      setRouterAuth(true);
      if (gamePhase < 3) setGamePhase(3);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

  const handleBlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMac = macInput.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (cleanMac === rogueMac) {
      setGamePhase(4);
      setError("");
    } else {
      setError("Invalid MAC Address or Device not found on bridge.");
    }
  };

  const renderContent = () => {
    if (currentUrl === QUEST_CONFIG.router.gatewayIP) {
      // Must be connected to Wi-Fi to reach the gateway!
      if (gamePhase < 2) {
        return (
          <div className={styles.notConnected}>
            <RefreshCw size={48} color="#ccc" style={{ marginBottom: 16 }} />
            <h3>No Internet Connection</h3>
            <p>You must connect to a Wi-Fi network to reach this gateway.</p>
          </div>
        );
      }

      if (!routerAuth) {
        return (
          <div className={styles.routerLogin}>
            <div className={styles.loginBox}>
              <div className={styles.brand}>NETGEAR</div>
              <h2>Router Admin Login</h2>
              <form onSubmit={handleRouterLogin}>
                <input 
                  type="text" 
                  placeholder="Username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                  type="password" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <div className={styles.error}>{error}</div>}
                <button type="submit">Log In</button>
              </form>
            </div>
          </div>
        );
      } else {
        return (
          <div className={styles.routerDashboard}>
            <header className={styles.dashHeader}>
              <div className={styles.brand}>NETGEAR</div>
              <Menu size={24} color="white" />
            </header>
            
            <div className={styles.routerNav}>
              <button className={routerTab === "dashboard" ? styles.navActive : ""} onClick={() => setRouterTab("dashboard")}>Dashboard</button>
              <button className={routerTab === "logs" ? styles.navActive : ""} onClick={() => setRouterTab("logs")}>System Logs</button>
              <button className={routerTab === "access" ? styles.navActive : ""} onClick={() => setRouterTab("access")}>Access Control</button>
            </div>

            <div className={styles.dashBody}>
              {routerTab === "dashboard" && (
                <>
                  <h3>Attached Devices</h3>
                  <div className={styles.deviceList}>
                    <div className={styles.deviceRow}>
                      <div>
                        <strong>iPhone (Your Device)</strong><br/>
                        <small>IP: 192.168.0.105</small>
                      </div>
                      <span className={styles.statusOnline}>Online</span>
                    </div>
                    
                    <div className={styles.deviceRow}>
                      <div>
                        <strong>UNKNOWN_ROGUE</strong><br/>
                        <small>IP: 192.168.0.99</small><br/>
                        {!isBlocked && <span className={styles.bandwidthWarning}>Bandwidth Usage: 99% (Hogging)</span>}
                      </div>
                      {isBlocked ? (
                        <span className={styles.statusBlocked}>Blocked</span>
                      ) : (
                        <span className={styles.statusOnline}>Online</span>
                      )}
                    </div>
                  </div>
                </>
              )}

              {routerTab === "logs" && (
                <div className={styles.sysLogs}>
                  <div className={styles.logLine}>[INFO] System initialized. NAT active.</div>
                  <div className={styles.logLine}>[INFO] DHCP ACK 192.168.0.105 (iPhone)</div>
                  <div className={styles.logLine}>[WARN] Unusual traffic volume detected on port 443</div>
                  <div className={styles.logLine}>[WARN] Bridge dropped 500 packets (Congestion)</div>
                  <div className={styles.logLine} style={{ color: '#ff3b30' }}>[CRITICAL] 192.168.0.99 is consuming 99% of total bandwidth!</div>
                  <div className={styles.logLine}>[INFO] DHCP ACK 192.168.0.99 MAC: {formattedMac}</div>
                  <div className={styles.logLine}>[INFO] NTP Synchronization complete.</div>
                  <div className={styles.logLine}>[INFO] Admin login from 192.168.0.105</div>
                </div>
              )}

              {routerTab === "access" && (
                <div className={styles.accessControl}>
                  <h3>Blacklist Devices</h3>
                  <p>Enter the physical MAC address of the device you wish to drop from the network. Format: XX:XX:XX:XX:XX:XX</p>
                  
                  {isBlocked ? (
                    <div className={styles.successBanner}>
                      <ShieldCheck size={48} color="#2e7d32" style={{ marginBottom: 16 }} />
                      <h3>Network Secured</h3>
                      <p style={{ marginTop: 8 }}>Rogue connection dropped. Phase 4 Complete.</p>
                      <button className={styles.rewardBtn} onClick={() => setShowBadge(true)}>
                        Claim Operative Badge
                      </button>
                    </div>
                  ) : (
                    <form className={styles.blockForm} onSubmit={handleBlockSubmit}>
                      <input 
                        type="text" 
                        placeholder="00:00:00:00:00:00" 
                        value={macInput}
                        onChange={(e) => setMacInput(e.target.value)}
                      />
                      <button type="submit">Blacklist MAC Address</button>
                      {error && <div className={styles.error} style={{ marginTop: 12 }}>{error}</div>}
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      }
    }

    if (currentUrl) {
      return (
        <div className={styles.notConnected}>
          <Lock size={48} color="#ccc" style={{ marginBottom: 16 }} />
          <h3>Safari cannot open the page</h3>
          <p>because it could not establish a secure connection to the server.</p>
        </div>
      );
    }

    return (
      <div className={styles.favorites}>
        <h2>Favorites</h2>
        <div className={styles.grid}>
          <div className={styles.icon}>🍎</div>
          <div className={styles.icon}>G</div>
          <div className={styles.icon}>W</div>
          <div className={styles.icon}>A</div>
        </div>
      </div>
    );
  };

  return (
    <AppContainer appId="browser" appName="Browser">
      <div className={styles.appWrapper}>
        <div className={styles.browserHeader}>
          <form className={styles.urlBar} onSubmit={handleSubmit}>
            <span className={styles.aa}>Aa</span>
            <Lock size={12} color="#000" style={{ marginRight: 6 }} />
            <input 
              type="text" 
              placeholder="Search or enter website name" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {url ? (
               <X size={16} color="#8e8e93" onClick={() => setUrl("")} style={{ cursor: 'pointer' }} />
            ) : (
               <RefreshCw size={16} color="#8e8e93" />
            )}
          </form>
        </div>
        
        <div className={styles.browserContent}>
          {renderContent()}
        </div>

        {/* The Operative Badge Overlay */}
        {showBadge && <BadgeGenerator onClose={() => setShowBadge(false)} />}
        
        <div className={styles.browserToolbar}>
          <ChevronLeft size={24} color="#007aff" />
          <ChevronRight size={24} color="#ccc" />
          <Share size={24} color="#007aff" />
          <Book size={24} color="#007aff" />
          <Square size={24} color="#007aff" />
        </div>
      </div>
    </AppContainer>
  );
}

// Dummy lucide icons for toolbar
import { ChevronLeft, ChevronRight, Share, Book, Square } from "lucide-react";
