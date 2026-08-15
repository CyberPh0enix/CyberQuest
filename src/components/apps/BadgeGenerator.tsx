"use client";

import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Download,
  Shield,
  MapPin,
  TerminalSquare,
  BadgeCheck,
  Hexagon,
  TriangleAlert,
  Camera,
  Map,
  Users,
  HardDrive,
  ExternalLink,
  Fingerprint
} from "lucide-react";
import { QUEST_CONFIG } from "@/config/quest";
import { useOS } from "@/context/OSContext";
import AppContainer from "../os/AppContainer";
import styles from "./BadgeGenerator.module.css";
import { SensoryEngine } from "@/utils/sensory";

export default function BadgeGenerator() {
  const { gamePhase, setGamePhase, setSystemState, setActiveApp } = useOS();
  const [name, setName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  const [permissionState, setPermissionState] = useState<"pending" | "success">("pending");
  const [permStep, setPermStep] = useState(1);
  const [perms, setPerms] = useState({ storage: false, camera: false, location: false, contacts: false });

  // Auto-launch when game is solved
  const isSolved = gamePhase >= 2;

  useEffect(() => {
    if (permissionState === "success") {
      SensoryEngine.playSuccess();
      const timer = setTimeout(() => {
        window.open(QUEST_CONFIG.lore.linktreeUrl, "_blank");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [permissionState]);

  useEffect(() => {
    if (permStep === 5) {
      if (!perms.storage) {
        setPermStep(6);
      } else if (perms.camera || perms.location || perms.contacts) {
        setSystemState("trapped");
      } else {
        setPermissionState("success");
      }
    }
  }, [permStep, perms, setSystemState]);

  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    if (words.length === 0 || !words[0]) return "OP";
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const generatePDF = async () => {
    if (!name.trim()) return;
    if (!badgeRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(badgeRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#050505",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / 3, canvas.height / 3],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 3, canvas.height / 3);
      pdf.save(`${QUEST_CONFIG.lore.idPrefix}_${getInitials(name)}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isSolved) {
    return (
      <AppContainer appId="badge" appName="Badge Gen">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-dim)', background: '#000' }}>
          <Fingerprint size={64} style={{ marginBottom: 16, opacity: 0.5 }} />
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif' }}>App Not Installed</h2>
          <p style={{ fontSize: 14, marginTop: 8 }}>Please connect to a secure network to provision.</p>
        </div>
      </AppContainer>
    );
  }

  return (
    <AppContainer appId="badge" appName="Badge Gen">
      <div className={styles.generatorOverlay}>
        {/* Inject Premium Web Fonts */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Space+Grotesk:wght@400;700;900&display=swap');
        `,
          }}
        />

        {/* Background Pulse */}
        <div className={styles.backgroundPulse}></div>

        {permissionState === "pending" && permStep < 5 && (
          <div className={styles.iosAlertOverlay}>
            <div className={styles.iosAlertBox}>
              <div className={styles.iosAlertContent}>
                <div className={styles.iosAlertTitle}>
                  {permStep === 1 && '"Badge Gen" Would Like to Access Your Storage'}
                  {permStep === 2 && '"Badge Gen" Would Like to Access the Camera'}
                  {permStep === 3 && '"Badge Gen" Would Like to Use Your Location'}
                  {permStep === 4 && '"Badge Gen" Would Like to Access Your Contacts'}
                </div>
                <div className={styles.iosAlertText}>
                  {permStep === 1 && "This is required to save your clearance badge locally."}
                  {permStep === 2 && "Required to authenticate your identity via facial scan."}
                  {permStep === 3 && "Allows the app to tag your location on the badge."}
                  {permStep === 4 && "Used to share your badge with network operatives."}
                </div>
              </div>
              <div className={styles.iosAlertButtons}>
                <button 
                  className={styles.iosAlertBtn} 
                  onClick={() => {
                    const key = permStep === 1 ? 'storage' : permStep === 2 ? 'camera' : permStep === 3 ? 'location' : 'contacts';
                    setPerms(prev => ({ ...prev, [key]: false }));
                    setPermStep(p => p + 1);
                  }}
                >
                  Don't Allow
                </button>
                <button 
                  className={`${styles.iosAlertBtn} ${styles.bold}`} 
                  onClick={() => {
                    const key = permStep === 1 ? 'storage' : permStep === 2 ? 'camera' : permStep === 3 ? 'location' : 'contacts';
                    setPerms(prev => ({ ...prev, [key]: true }));
                    setPermStep(p => p + 1);
                  }}
                >
                  Allow
                </button>
              </div>
            </div>
          </div>
        )}

        {permStep === 6 && (
          <div className={styles.iosAlertOverlay}>
            <div className={styles.iosAlertBox}>
              <div className={styles.iosAlertContent}>
                <div className={styles.iosAlertTitle}>Permission Required</div>
                <div className={styles.iosAlertText}>
                  "Badge Gen" requires Storage Access to operate. The application will now exit.
                </div>
              </div>
              <div className={styles.iosAlertButtons}>
                <button 
                  className={`${styles.iosAlertBtn} ${styles.bold}`} 
                  onClick={() => {
                    setActiveApp(null);
                    setPermStep(1);
                    setPerms({ storage: false, camera: false, location: false, contacts: false });
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {permissionState === "success" && (
          <div className={styles.contentWrapper}>
            <Hexagon size={48} color="#007aff" className={styles.mainIcon} />
            <h1 className={styles.mainTitle}>OPERATION CONCLUDED</h1>
            <p className={styles.subTitle}>NETWORK SECURED</p>

            <div className={styles.formBox}>
              <h2 className={styles.formTitle}>
                <TerminalSquare size={14} /> IDENTIFICATION PROTOCOL
              </h2>

              <input
                type="text"
                placeholder="ENTER NAME..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.aliasInput}
              />

              {/* Hidden Badge for PDF Capture */}
              <div className={styles.hiddenCaptureContainer}>
                <div ref={badgeRef} className={styles.pdfBadge}>
                  {/* Minimal Header */}
                  <div className={styles.badgeHeader}>
                    <img
                      src="/assets/logo.png"
                      alt="CyberPhoenix"
                      className={styles.badgeLogo}
                    />
                    <div>
                      <div className={styles.badgeIdLabel}>ID NUMBER</div>
                      <div className={styles.badgeIdValue}>
                        {QUEST_CONFIG.lore.idPrefix}-
                        {Math.floor(Math.random() * 9000) + 1000}
                      </div>
                    </div>
                  </div>

                  {/* Avatar Initial block */}
                  <div className={styles.avatarBlock}>
                    {getInitials(name)}
                    {/* Verified Icon - Fixed Shape */}
                    <div className={styles.verifiedBadge}>
                      <BadgeCheck size={24} color="#007aff" fill="#050505" />
                    </div>
                  </div>

                  {/* Name */}
                  <div className={styles.nameBlock}>
                    <div className={styles.nameLabel}>OPERATIVE ALIAS</div>
                    <div className={styles.nameValue}>{name || "UNKNOWN"}</div>
                  </div>

                  {/* Rank and Clearance */}
                  <div className={styles.statsBlock}>
                    <div className={styles.statRow}>
                      <div className={styles.statLabel}>
                        <Shield size={16} color="#007aff" />
                        <span className={styles.statLabelText}>RANK</span>
                      </div>
                      <div className={styles.statValue}>
                        {QUEST_CONFIG.lore.badgeRank}
                      </div>
                    </div>

                    <div className={styles.statRow}>
                      <div className={styles.statLabel}>
                        <Hexagon size={16} color="#007aff" />
                        <span className={styles.statLabelText}>CLEARANCE</span>
                      </div>
                      <div className={styles.statValueClearance}>
                        {QUEST_CONFIG.lore.clearance}
                      </div>
                    </div>
                  </div>

                  {/* Location Footer */}
                  <div className={styles.badgeFooter}>
                    <div className={styles.footerLocation}>
                      <MapPin size={12} color="#007aff" />
                      {QUEST_CONFIG.lore.badgeLocation}
                    </div>
                    <div>SYS.VERIFIED</div>
                  </div>
                </div>
              </div>

              <button
                onClick={generatePDF}
                disabled={!name.trim() || isGenerating}
                className={`${styles.downloadBtn} ${name.trim() && !isGenerating ? styles.active : styles.disabled}`}
              >
                {isGenerating ? (
                  <span className={styles.encryptingText}>ENCRYPTING ...</span>
                ) : (
                  <>
                    <Download size={18} />
                    DOWNLOAD BADGE
                  </>
                )}
              </button>

              <button
                onClick={() => window.open(QUEST_CONFIG.lore.linktreeUrl, "_blank")}
                className={styles.networkBtn}
                style={{ marginTop: 12 }}
              >
                <ExternalLink size={18} />
                CONNECT TO NETWORK
              </button>
            </div>
          </div>
        )}
      </div>
    </AppContainer>
  );
}
