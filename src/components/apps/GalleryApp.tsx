"use client";

import { useState } from "react";
import styles from "./GalleryApp.module.css";
import AppContainer from "../os/AppContainer";
import { ChevronLeft } from "lucide-react";

export default function GalleryApp() {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  // Array of dummy images + 1 special puzzle image
  const images = [
    { id: "1", type: "img", src: "/puppy.png" },
    { id: "2", type: "img", src: "/logo.png" },
    { id: "3", type: "puzzle" },
    { id: "4", type: "color", color: "#e1e1e1" },
    { id: "5", type: "color", color: "#d1d1d1" },
    { id: "6", type: "color", color: "#c1c1c1" },
  ];

  return (
    <AppContainer appId="gallery" appName="Photos">
      <div className={styles.appWrapper}>
        
        {selectedImg ? (
          <div className={styles.fullView}>
            <div className={styles.fullHeader}>
              <button className={styles.backBtn} onClick={() => setSelectedImg(null)}>
                <ChevronLeft size={28} />
                <span>Albums</span>
              </button>
              <div style={{ width: 60 }}></div>
            </div>
            
            <div className={styles.fullContent}>
              {selectedImg === "puzzle" ? (
                <div className={styles.routerStickerContainer}>
                  <div className={styles.routerSticker}>
                    <div className={styles.stickerHeader}>
                      <span>NETGEAR</span>
                      <span>N600 Wireless Dual Band Router</span>
                    </div>
                    <div className={styles.stickerBarcode}>|| |||| | ||||| |||| || |</div>
                    <div className={styles.stickerBody}>
                      <p><strong>Router Login</strong></p>
                      <p>URL: http://192.168.0.1</p>
                      <p>User: admin</p>
                      <p>Password: password</p>
                      <div style={{ height: 16 }}></div>
                      <p><strong>Wireless Network (2.4GHz)</strong></p>
                      <p>SSID: NETGEAR_24</p>
                      <p>Pass: cipherX</p>
                    </div>
                    <div className={styles.stickerFooter}>
                      MAC: 00:1A:2B:3C:4D:5E
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.placeholderImg}>
                  {images.find(i => i.id === selectedImg)?.src && (
                     <img src={images.find(i => i.id === selectedImg)?.src} style={{width:'100%', height:'100%', objectFit: 'contain'}} />
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <span>Albums</span>
            </div>
            <div className={styles.grid}>
              {images.map(img => (
                <div 
                  key={img.id} 
                  className={styles.gridItem}
                  onClick={() => setSelectedImg(img.id === "3" ? "puzzle" : img.id)}
                  style={{ background: img.color || '#333' }}
                >
                  {img.type === "puzzle" && (
                    <div className={styles.puzzleThumb}>
                      <div className={styles.fakeBarcode}>||| | ||</div>
                      <div className={styles.fakeText}>admin</div>
                    </div>
                  )}
                  {img.src && <img src={img.src} style={{width: '100%', height: '100%', objectFit: 'cover'}} />}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AppContainer>
  );
}
