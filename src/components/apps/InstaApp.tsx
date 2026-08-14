"use client";

import { useOS } from "@/context/OSContext";
import styles from "./InstaApp.module.css";
import { Heart, MessageCircle, Send, Bookmark, ShieldAlert, Cpu } from "lucide-react";
import AppContainer from "../os/AppContainer";

export default function InstaApp() {
  const { setActiveApp } = useOS();

  return (
    <AppContainer appId="insta" appName="Instagram">
    <div className={styles.appWrapper}>
      <div className={styles.header}>
        <span>InstaGram</span>
      </div>

      <div className={styles.feed}>
        {/* Decoy Post */}
        <div className={styles.post}>
          <div className={styles.postHeader}>
            <div className={styles.avatar} style={{ background: '#ff3b30', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={20} color="white" />
            </div>
            <span className={styles.username}>CyberPhoenix_Official</span>
          </div>
          
          <div className={styles.postImage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a' }}>
             <Cpu size={120} color="#ff3b30" />
          </div>
          
          <div className={styles.postActions}>
            <Heart size={24} className={styles.postAction} color="#ff3b30" fill="#ff3b30" />
            <MessageCircle size={24} className={styles.postAction} />
            <Send size={24} className={styles.postAction} />
            <div style={{ flex: 1 }}></div>
            <Bookmark size={24} className={styles.postAction} />
          </div>

          <div className={styles.postCaption}>
            <span className={styles.username}>CyberPhoenix_Official </span>
            Registration for the upcoming Winter CTF is now open. Hack the planet. 🌐 #cybersecurity #ctf #hacking
          </div>
          <div className={styles.postTime}>January 10, 2024</div>
        </div>

        {/* Real Puzzle Post */}
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
    </AppContainer>
  );
}
