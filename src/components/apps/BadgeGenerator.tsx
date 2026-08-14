import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, ShieldCheck, MapPin, TerminalSquare, X } from "lucide-react";
import { QUEST_CONFIG } from "@/config/quest";

export default function BadgeGenerator({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1500);
    return () => clearTimeout(timer);
  }, []);

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
      // Temporarily ensure high quality
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
    <div className="fixed inset-0 z-[300] bg-black text-white font-mono overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(0,255,255,0.1) 0, transparent 60%)', animation: 'pulse 4s infinite' }}></div>

      {showContent && (
        <div style={{ zIndex: 10, width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', animation: 'fadeIn 1s ease' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 24, right: 24, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: 8, cursor: 'pointer' }}>
            <X size={24} color="white" />
          </button>
          
          <ShieldCheck size={64} color="#00ffff" style={{ filter: 'drop-shadow(0 0 10px #00ffff)', marginBottom: 24 }} />
          <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: 4, color: '#00ffff', marginBottom: 8, textTransform: 'uppercase' }}>
            SYSTEM RECLAIMED
          </h1>
          <p style={{ color: '#a5d6a7', letterSpacing: 2, marginBottom: 32, fontSize: '14px' }}>
            ROGUE CONNECTION TERMINATED. NETWORK SECURED.
          </p>

          <div style={{ width: '100%', background: 'rgba(20,20,20,0.8)', border: '1px solid #333', borderRadius: 12, padding: 32, backdropFilter: 'blur(10px)' }}>
            <h2 style={{ fontSize: '12px', color: '#888', letterSpacing: 2, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <TerminalSquare size={16} /> GENERATE OPERATIVE CREDENTIALS
            </h2>

            <input 
              type="text" 
              placeholder="Enter your Name or Alias..." 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '16px', background: '#000', border: '1px solid #00ffff', borderRadius: 8, color: '#fff', fontSize: '18px', textAlign: 'center', marginBottom: 24, outline: 'none', fontFamily: 'monospace' }}
            />

            {/* Hidden Badge for PDF Capture */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
              <div 
                ref={badgeRef} 
                style={{ 
                  width: '400px', 
                  height: '600px', 
                  background: '#0a0a0a', 
                  border: '4px solid #00ffff', 
                  borderRadius: '16px', 
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  fontFamily: 'monospace',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: '#00ffff', filter: 'blur(100px)', opacity: 0.2 }}></div>
                
                <h1 style={{ color: '#00ffff', fontSize: '24px', letterSpacing: '4px', fontWeight: 900, marginBottom: '8px', textAlign: 'center' }}>CYBERPHOENIX</h1>
                <h2 style={{ color: '#fff', fontSize: '14px', letterSpacing: '8px', marginBottom: '40px', opacity: 0.8 }}>CLUB</h2>

                <div style={{ 
                  width: '150px', 
                  height: '150px', 
                  background: '#111', 
                  border: '2px solid #00ffff', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '64px',
                  fontWeight: 900,
                  color: '#00ffff',
                  textShadow: '0 0 20px rgba(0,255,255,0.5)',
                  marginBottom: '40px',
                  position: 'relative'
                }}>
                  {getInitials(name)}
                  <div style={{ position: 'absolute', bottom: -10, right: -10, background: '#00ffff', color: '#000', fontSize: '10px', padding: '2px 6px', fontWeight: 'bold' }}>VERIFIED</div>
                </div>

                <div style={{ width: '100%', textAlign: 'left', marginBottom: '20px' }}>
                  <div style={{ color: '#666', fontSize: '10px', letterSpacing: '2px', marginBottom: '4px' }}>OPERATIVE ALIAS</div>
                  <div style={{ color: '#fff', fontSize: '24px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>{name || "UNKNOWN"}</div>
                </div>

                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <div style={{ color: '#666', fontSize: '10px', letterSpacing: '2px', marginBottom: '4px' }}>RANK</div>
                    <div style={{ color: '#00ffff', fontSize: '16px', fontWeight: 700, letterSpacing: '1px' }}>{QUEST_CONFIG.lore.badgeRank}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#666', fontSize: '10px', letterSpacing: '2px', marginBottom: '4px' }}>CLEARANCE</div>
                    <div style={{ color: '#fff', fontSize: '16px', fontWeight: 700, letterSpacing: '1px' }}>LEVEL 9</div>
                  </div>
                </div>

                <div style={{ width: '100%', height: '1px', background: '#333', margin: '20px 0' }}></div>

                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', color: '#a5d6a7', fontSize: '12px', letterSpacing: '1px' }}>
                  <MapPin size={14} />
                  LOCATION: {QUEST_CONFIG.lore.badgeLocation}
                </div>
                
                <div style={{ marginTop: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '32px', letterSpacing: '4px', opacity: 0.5 }}>|||| | ||| || ||</div>
                </div>
              </div>
            </div>

            <button 
              onClick={generatePDF}
              disabled={!name.trim() || isGenerating}
              style={{ 
                width: '100%', 
                padding: '16px', 
                background: name.trim() ? '#00ffff' : '#333', 
                color: name.trim() ? '#000' : '#888', 
                border: 'none', 
                borderRadius: 8, 
                fontSize: '16px', 
                fontWeight: 900, 
                letterSpacing: 2, 
                cursor: name.trim() && !isGenerating ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                transition: 'all 0.2s'
              }}
            >
              {isGenerating ? (
                "ENCRYPTING PDF..."
              ) : (
                <>
                  <Download size={20} />
                  DOWNLOAD ID CARD
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
