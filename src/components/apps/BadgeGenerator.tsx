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
} from "lucide-react";
import { QUEST_CONFIG } from "@/config/quest";
import { useOS } from "@/context/OSContext";
import AppContainer from "../os/AppContainer";
import styles from "./BadgeGenerator.module.css";

export default function BadgeGenerator() {
  const { gamePhase } = useOS();
  const [name, setName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  // Auto-launch when game is solved
  const isSolved = gamePhase >= 4;

  useEffect(() => {
    if (isSolved) {
      const timer = setTimeout(() => setShowContent(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isSolved]);

  if (!isSolved) return null;

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

  return (
    <AppContainer appId="badge" appName="Clearance">
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

        {showContent && (
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
            </div>
          </div>
        )}
      </div>
    </AppContainer>
  );
}
