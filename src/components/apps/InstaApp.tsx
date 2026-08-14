"use client";

import { useOS } from "@/context/OSContext";
import styles from "./InstaApp.module.css";
import { Heart, MessageCircle, Send, Bookmark, ChevronLeft } from "lucide-react";

export default function InstaApp() {
  const { setActiveApp } = useOS();

  return (
    <div className={styles.appWrapper}>
      <div className={styles.header}>
        <button className={styles.closeButton} onClick={() => setActiveApp(null)}>
          <ChevronLeft size={28} />
        </button>
        <span>InstaGram</span>
        <div style={{ width: 44 }}></div> {/* spacer for centering */}
      </div>

      <div className={styles.feed}>
        <div className={styles.post}>
          <div className={styles.postHeader}>
            <div className={styles.avatar}></div>
            <span className={styles.username}>alex_sec99</span>
          </div>
          
          {/* The AI-generated puppy image serving as the OSINT clue */}
          <img src="/puppy.png" alt="Puppy" className={styles.postImage} />
          
          <div className={styles.postActions}>
            <Heart size={24} className={styles.postAction} />
            <MessageCircle size={24} className={styles.postAction} />
            <Send size={24} className={styles.postAction} />
            <div style={{ flex: 1 }}></div>
            <Bookmark size={24} className={styles.postAction} />
          </div>

          <div className={styles.postCaption}>
            <span className={styles.username}>alex_sec99 </span>
            Welcome to the family, Buster! Best Christmas present ever. ❤️🐕 #2023 #puppy #goldenretriever
          </div>
          
          <div className={styles.postTime}>December 25, 2023</div>
        </div>
      </div>
    </div>
  );
}
