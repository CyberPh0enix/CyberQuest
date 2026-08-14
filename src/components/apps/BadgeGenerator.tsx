"use client";

import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, ShieldCheck, MapPin, TerminalSquare, X, BadgeCheck, ShieldAlert } from "lucide-react";
import { QUEST_CONFIG } from "@/config/quest";
import { useOS } from "@/context/OSContext";
import AppContainer from "../os/AppContainer";

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
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 3, canvas.height / 3]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3);
      pdf.save(`CyberPhoenix_Operative_${name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppContainer appId="badge" appName="Clearance">
      <div className="h-full w-full bg-black text-white font-mono overflow-y-auto custom-scrollbar relative" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Background Pulse */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(0,122,255,0.15) 0, transparent 70%)', animation: 'pulse 4s infinite' }}></div>

      {showContent && (
        <div style={{ zIndex: 10, width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', animation: 'fadeIn 1s ease', padding: 24 }}>
          
          <ShieldCheck size={64} color="#007aff" style={{ filter: 'drop-shadow(0 0 15px #007aff)', marginBottom: 24 }} />
          <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: 2, color: '#fff', marginBottom: 8, textTransform: 'uppercase' }}>
            OPERATION CONCLUDED
          </h1>
          <p style={{ color: '#007aff', letterSpacing: 2, marginBottom: 32, fontSize: '12px', fontWeight: 'bold' }}>
            NETWORK SECURED. CLEARANCE GRANTED.
          </p>

          <div style={{ width: '100%', background: 'rgba(10,10,10,0.8)', border: '1px solid #222', borderRadius: 16, padding: 32, backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <h2 style={{ fontSize: '11px', color: '#888', letterSpacing: 2, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <TerminalSquare size={14} /> GENERATE CREDENTIALS
            </h2>

            <input 
              type="text" 
              placeholder="Enter your Name or Alias..." 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '16px', background: '#000', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: '16px', textAlign: 'center', marginBottom: 24, outline: 'none', fontFamily: 'monospace', transition: 'border 0.2s' }}
              onFocus={(e) => e.target.style.border = '1px solid #007aff'}
              onBlur={(e) => e.target.style.border = '1px solid #333'}
            />

            {/* Hidden Badge for PDF Capture */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
              <div 
                ref={badgeRef} 
                style={{ 
                  width: '420px', 
                  height: '600px', 
                  background: '#0a0a0a', 
                  border: '2px solid #222', 
                  borderRadius: '16px', 
                  padding: '40px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  fontFamily: 'sans-serif',
                  position: 'relative',
                  overflow: 'hidden',
                  boxSizing: 'border-box'
                }}
              >
                {/* CyberPhoenix Logo */}
                <img src="/assets/logo.png" alt="CyberPhoenix" style={{ height: '70px', objectFit: 'contain', marginBottom: '16px', opacity: 0.9 }} />
                
                <h1 style={{ color: '#fff', fontSize: '22px', letterSpacing: '4px', fontWeight: 900, marginBottom: '32px', textAlign: 'center', fontFamily: 'monospace' }}>CYBERPHOENIX</h1>

                {/* Avatar Initial block */}
                <div style={{ 
                  width: '150px', 
                  height: '150px', 
                  background: '#111', 
                  border: '1px solid #333', 
                  borderRadius: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '56px',
                  fontWeight: 900,
                  color: '#fff',
                  marginBottom: '32px',
                  position: 'relative'
                }}>
                  {getInitials(name)}
                  {/* Verified Icon - Fixed Shape */}
                  <div style={{ 
                    position: 'absolute', 
                    bottom: -10, 
                    right: -10, 
                    background: '#0a0a0a', 
                    borderRadius: '50%', 
                    width: '36px', 
                    height: '36px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '2px solid #007aff'
                  }}>
                    <BadgeCheck size={22} color="#007aff" fill="#000" />
                  </div>
                </div>

                {/* Name */}
                <div style={{ width: '100%', textAlign: 'center', marginBottom: '32px', borderBottom: '1px solid #222', paddingBottom: '24px' }}>
                  <div style={{ color: '#888', fontSize: '11px', letterSpacing: '2px', marginBottom: '8px', fontFamily: 'monospace' }}>OPERATIVE ALIAS</div>
                  <div style={{ color: '#fff', fontSize: '28px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>{name || "UNKNOWN"}</div>
                </div>

                {/* Rank and Clearance */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', marginBottom: 'auto' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ color: '#888', fontSize: '11px', letterSpacing: '2px', marginBottom: '6px', fontFamily: 'monospace' }}>RANK</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldAlert size={18} color="#007aff" />
                      <span style={{ color: '#fff', fontSize: '16px', fontWeight: 800, letterSpacing: '1px' }}>{QUEST_CONFIG.lore.badgeRank}</span>
                    </div>
                  </div>
                  
                  <div style={{ width: '1px', background: '#333' }}></div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ color: '#888', fontSize: '11px', letterSpacing: '2px', marginBottom: '6px', fontFamily: 'monospace' }}>CLEARANCE</div>
                    <div style={{ color: '#007aff', fontSize: '16px', fontWeight: 800, letterSpacing: '1px' }}>LEVEL 9</div>
                  </div>
                </div>

                {/* Location Footer */}
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#666', fontSize: '11px', letterSpacing: '1px', fontFamily: 'monospace', marginTop: '32px' }}>
                  <MapPin size={14} color="#007aff" />
                  VERIFIED LOCATION: {QUEST_CONFIG.lore.badgeLocation}
                </div>
              </div>
            </div>

            <button 
              onClick={generatePDF}
              disabled={!name.trim() || isGenerating}
              style={{ 
                width: '100%', 
                padding: '16px', 
                background: name.trim() ? '#fff' : '#222', 
                color: name.trim() ? '#000' : '#666', 
                border: 'none', 
                borderRadius: 8, 
                fontSize: '14px', 
                fontWeight: 800, 
                letterSpacing: 1, 
                cursor: name.trim() && !isGenerating ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.2s',
                textTransform: 'uppercase'
              }}
            >
              {isGenerating ? (
                "GENERATING SECURE PDF..."
              ) : (
                <>
                  <Download size={18} />
                  DOWNLOAD ID CARD
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
