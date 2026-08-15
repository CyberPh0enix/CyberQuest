"use client";

import { useState } from "react";
import styles from "./GalleryApp.module.css";
import AppContainer from "../os/AppContainer";
import { ChevronLeft, Share, Heart, Trash2 } from "lucide-react";
import RouterSticker from "./RouterSticker";

const PHOTOS = [
  { id: 1, type: "album", src: "/assets/logo.png", title: "CyberPhoenix" },
  { id: 2, type: "album", src: "/assets/gallery/puppy.png", title: "Buster" },
  { id: 3, type: "album", src: "/assets/gallery/park.jpg", title: "Park" },
  { id: 4, type: "puzzle", src: "", title: "Router Info" },
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
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#fdfdfd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '80%', height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RouterSticker />
                  </div>
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
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', padding: 16 }}>
                  <RouterSticker />
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
