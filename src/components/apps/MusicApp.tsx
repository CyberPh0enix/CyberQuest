"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Loader2, Search, Music } from "lucide-react";
import styles from "./MusicApp.module.css";
import { SensoryEngine } from "@/utils/sensory";
import AppContainer from "../os/AppContainer";

type Track = {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  url: string;
};

export default function MusicApp() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Universal Extraction Engine Foundation
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    SensoryEngine.playTap();
    setIsSearching(true);
    
    try {
      // FOUNDATION: Using iTunes API because it is free, incredibly fast, and CORS universally enabled.
      // This serves as the perfect foundational proxy to prove dynamic extraction and HTML5 Audio playback.
      // In the next phase, we will map this exact data structure to a YTM/Spotify Next.js endpoint.
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&media=music&limit=25`);
      const data = await response.json();
      
      const tracks: Track[] = data.results.map((item: any) => ({
        id: item.trackId.toString(),
        title: item.trackName,
        artist: item.artistName,
        albumArt: item.artworkUrl100,
        url: item.previewUrl // High-quality 30s preview audio
      }));
      
      setResults(tracks);
    } catch (e) {
      console.error("Extraction failed:", e);
    } finally {
      setIsSearching(false);
    }
  };

  // Pure HTML5 Playback Engine
  useEffect(() => {
    if (currentTrackIndex === -1 || results.length === 0) return;
    const currentTrack = results[currentTrackIndex];

    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.url);
    } else {
      audioRef.current.src = currentTrack.url;
    }

    const audio = audioRef.current;
    
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };
    
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => handleNext();

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    if (isPlaying) {
      audio.play().catch(e => {
        console.error("Playback engine error:", e);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex, results, isPlaying]);

  const togglePlay = () => {
    SensoryEngine.playTap();
    if (currentTrackIndex === -1) return;
    setIsPlaying(!isPlaying);
  };

  const playTrack = (index: number) => {
    SensoryEngine.playTap();
    setCurrentTrackIndex(index);
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleNext = () => {
    SensoryEngine.playTap();
    if (results.length === 0) return;
    setCurrentTrackIndex(prev => (prev + 1) % results.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    SensoryEngine.playTap();
    if (results.length === 0) return;
    setCurrentTrackIndex(prev => (prev === 0 ? results.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (currentTrackIndex === -1 || duration === 0 || !audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    
    const targetTime = percent * duration;
    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
    setProgress(percent * 100);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const activeTrack = currentTrackIndex >= 0 ? results[currentTrackIndex] : null;

  return (
    <AppContainer appId="music" appName="Music">
      <div className={styles.container}>
        
        {/* Universal Search Header */}
        <div className={styles.searchHeader}>
          <Search size={20} color="rgba(255,255,255,0.5)" />
          <input 
            type="text" 
            className={styles.searchInput}
            placeholder="Search tracks, artists, albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {isSearching && <Loader2 size={20} className={styles.spinner} color="rgba(255,255,255,0.5)" />}
        </div>

        {/* Dynamic Results Engine */}
        <div className={styles.content}>
          <div className={styles.trackList}>
            {results.length === 0 && !isSearching ? (
              <div className={styles.emptyState}>
                <Music size={48} />
                <p>Search the global catalog to begin playback.</p>
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

          {/* Persistent Playback Controller */}
          <div className={styles.playbackEngine}>
            <div className={styles.progressWrapper}>
              <span>{formatTime(currentTime)}</span>
              <div className={styles.progressBar} onClick={handleScrub}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
              </div>
              <span>{formatTime(duration)}</span>
            </div>
            
            <div className={styles.controls}>
              <button className={styles.btn} onClick={handlePrev} disabled={results.length === 0}>
                <SkipBack size={24} />
              </button>
              
              {/* Perfectly aligned Play button using generic flexbox context */}
              <button className={styles.playBtn} onClick={togglePlay} disabled={results.length === 0}>
                {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
              </button>
              
              <button className={styles.btn} onClick={handleNext} disabled={results.length === 0}>
                <SkipForward size={24} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </AppContainer>
  );
}
