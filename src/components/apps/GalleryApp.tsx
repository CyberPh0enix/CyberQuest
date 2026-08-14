"use client";

import { useState } from "react";
import styles from "./GalleryApp.module.css";
import AppContainer from "../os/AppContainer";
import { ChevronLeft, Share, Heart, Trash2 } from "lucide-react";

const PHOTOS = [
  { id: 1, type: "album", src: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?auto=format&fit=crop&q=80&w=400", title: "Doggo" },
  { id: 2, type: "album", src: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=400", title: "Buster" },
  { id: 3, type: "album", src: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400", title: "Park" },
  { id: 4, type: "puzzle", src: "", title: "Important" },
  { id: 5, type: "album", src: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400", title: "Sleepy" },
  { id: 6, type: "album", src: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&q=80&w=400", title: "Walk" },
];

export default function GalleryApp() {
  const [activePhoto, setActivePhoto] = useState<typeof PHOTOS[0] | null>(null);

  return (
    <AppContainer appId="gallery" appName="Photos">
      <div className={styles.appWrapper}>
        <div className={styles.header}>
          <h2>Photos</h2>
        </div>
        
        <div className={styles.photoGrid}>
          {PHOTOS.map((photo) => (
            <div 
              key={photo.id} 
              className={styles.gridItem}
              onClick={() => setActivePhoto(photo)}
            >
              {photo.type === "puzzle" ? (
                <div style={{ width: '100%', height: '100%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10 }}>
                  DOCUMENT
                </div>
              ) : (
                <img src={photo.src} alt={photo.title} loading="lazy" />
              )}
            </div>
          ))}
        </div>

        {activePhoto && (
          <div className={styles.fullscreenViewer}>
            <div className={styles.viewerHeader}>
              <button className={styles.iconBtn} onClick={() => setActivePhoto(null)}>
                <ChevronLeft size={28} color="#007aff" />
              </button>
              <span className={styles.viewerTitle}>{activePhoto.title}</span>
              <div style={{ width: 44 }}></div>
            </div>
            
            <div className={styles.viewerBody}>
              {activePhoto.type === "puzzle" ? (
                <div className={styles.stickerContainer}>
                  <div className={styles.stickerBox}>
                    <div className={styles.stickerBrand}>NETGEAR</div>
                    <div className={styles.stickerModel}>Nighthawk AC1900 Smart WiFi Router</div>
                    <div className={styles.stickerDivider}></div>
                    <div className={styles.stickerInfo}>
                      <span><strong>Admin Login</strong></span>
                      <span>admin</span>
                    </div>
                    <div className={styles.stickerInfo}>
                      <span><strong>Key</strong></span>
                      <span style={{ fontFamily: 'monospace', letterSpacing: 1 }}>CyPh-8A3B</span>
                    </div>
                    <div className={styles.stickerDivider}></div>
                    <div className={styles.stickerBarcode}>|| |||| | |||||| || | || ||||</div>
                    <div className={styles.stickerSerial}>S/N: 4N81938T0012C</div>
                  </div>
                </div>
              ) : (
                <img src={activePhoto.src} alt={activePhoto.title} className={styles.fullImage} />
              )}
            </div>

            <div className={styles.viewerFooter}>
              <button className={styles.iconBtn}><Share size={24} color="#007aff" /></button>
              <button className={styles.iconBtn}><Heart size={24} color="#007aff" /></button>
              <button className={styles.iconBtn}><Trash2 size={24} color="#007aff" /></button>
            </div>
          </div>
        )}
      </div>
    </AppContainer>
  );
}
