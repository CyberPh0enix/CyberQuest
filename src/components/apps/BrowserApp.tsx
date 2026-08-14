"use client";

import { useState, useEffect } from "react";
import styles from "./BrowserApp.module.css";
import AppContainer from "../os/AppContainer";
import { Lock, RefreshCw, X, Menu, ShieldCheck } from "lucide-react";
import { useOS } from "@/context/OSContext";

export default function BrowserApp() {
  const { gamePhase, setGamePhase } = useOS();
  const [url, setUrl] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  
  // Router State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [routerAuth, setRouterAuth] = useState(false);
  const [error, setError] = useState("");

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
    if (username === "admin" && password === "cipherX") {
      setRouterAuth(true);
      if (gamePhase < 3) setGamePhase(3);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

  const renderContent = () => {
    if (currentUrl === "192.168.0.1") {
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
            
            <div className={styles.dashBody}>
              <h3>Attached Devices</h3>
              
              <div className={styles.deviceList}>
                <div className={styles.deviceRow}>
                  <div>
                    <strong>iPhone</strong><br/>
                    <small>192.168.0.105 | AA:BB:CC:DD:EE:FF</small>
                  </div>
                  <span className={styles.statusOnline}>Online</span>
                </div>
                
                <div className={styles.deviceRow}>
                  <div>
                    <strong>UNKNOWN_ROGUE</strong><br/>
                    <small>192.168.0.99 | 00:1A:2B:3C:4D:5E</small><br/>
                    {!isBlocked && <span className={styles.bandwidthWarning}>Bandwidth Usage: 99% (Hogging)</span>}
                  </div>
                  {isBlocked ? (
                    <span className={styles.statusBlocked}>Blocked</span>
                  ) : (
                    <button className={styles.blockBtn} onClick={handleBlockDevice}>
                      Block Device
                    </button>
                  )}
                </div>
              </div>

              {isBlocked && (
                <div className={styles.successBanner}>
                  <ShieldCheck size={48} color="#2e7d32" style={{ marginBottom: 16 }} />
                  <h3>Network Secured</h3>
                  <p style={{ marginTop: 8 }}>Rogue connection dropped. Phase 4 Complete.</p>
                  <button className={styles.rewardBtn} onClick={() => alert("GENERATING BADGE (TODO)")}>
                    Claim Operative Badge
                  </button>
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
