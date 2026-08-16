"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Loader2, Search, Music } from "lucide-react";
import styles from "./MusicApp.module.css";
import AppContainer from "../os/AppContainer";
import { useMusic } from "@/context/MusicContext";

export default function MusicApp() {
  const {
    searchQuery, setSearchQuery, results, isSearching, currentTrackIndex,
    isPlaying, progress, currentTime, duration, isBuffering, isPlayerReady,
    handleSearch, togglePlay, playTrack, handleNext, handlePrev, handleScrub
  } = useMusic();

  const handleScrubClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    handleScrub(percent);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AppContainer appId="music" appName="Music">
      <div className={styles.container}>
        
        {/* Dynamic Glowing Background */}
        {currentTrackIndex !== -1 && results[currentTrackIndex] && (
          <div className={styles.nowPlayingBackground}>
            <img src={results[currentTrackIndex].albumArt} alt="" className={styles.bgImage} />
            <div className={styles.bgOverlay}></div>
          </div>
        )}

        <div className={styles.searchHeader}>
          <Search size={20} color="rgba(255,255,255,0.5)" />
          <input 
            type="text" 
            className={styles.searchInput}
            placeholder="Search YouTube..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {isSearching && <Loader2 size={20} className={styles.spinner} color="rgba(255,255,255,0.5)" />}
        </div>

        <div className={styles.content}>
          <div className={styles.trackList}>
            {results.length === 0 && !isSearching ? (
              <div className={styles.emptyState}>
                <Music size={56} opacity={0.5} />
                <p>Search YouTube to instantly stream<br/>full high-resolution tracks.</p>
              </div>
            ) : (
              results.map((track, idx) => (
                <div 
                  key={track.id} 
                  className={`${styles.trackItem} ${idx === currentTrackIndex ? styles.active : ""}`}
                  onClick={() => playTrack(idx)}
                >
                  <img src={track.albumArt} alt={track.title} className={styles.albumArt} />
                  <div className={styles.trackDetails}>
                    <span className={styles.trackTitle}>{track.title}</span>
                    <span className={styles.trackArtist}>{track.artist}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {currentTrackIndex !== -1 && results[currentTrackIndex] && (
            <div className={styles.playbackEngine}>
              <div className={styles.nowPlayingInfo}>
                <img 
                  src={results[currentTrackIndex].albumArt} 
                  alt="Now Playing" 
                  className={`${styles.nowPlayingArt} ${isPlaying && !isBuffering ? styles.spin : ''}`} 
                />
                <div className={styles.nowPlayingText}>
                  <span className={styles.nowPlayingTitle}>{results[currentTrackIndex].title}</span>
                  <span className={styles.nowPlayingArtist}>{results[currentTrackIndex].artist}</span>
                </div>
              </div>

              <div className={styles.progressWrapper}>
                <span>{formatTime(currentTime)}</span>
                <div className={styles.progressBar} onClick={handleScrubClick}>
                  <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                </div>
                <span>{formatTime(duration)}</span>
              </div>
              
              <div className={styles.controls}>
                <button className={styles.btn} onClick={handlePrev} disabled={results.length === 0 || !isPlayerReady}>
                  <SkipBack size={28} />
                </button>
                
                <button className={styles.playBtn} onClick={togglePlay} disabled={results.length === 0 || !isPlayerReady}>
                  {isBuffering ? (
                    <Loader2 size={28} className={styles.spinner} color="black" />
                  ) : isPlaying ? (
                    <Pause size={32} fill="currentColor" />
                  ) : (
                    <Play size={32} fill="currentColor" />
                  )}
                </button>
                
                <button className={styles.btn} onClick={handleNext} disabled={results.length === 0 || !isPlayerReady}>
                  <SkipForward size={28} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppContainer>
  );
}
