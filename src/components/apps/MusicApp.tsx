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
  sourceType: string;
};

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function MusicApp() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  
  const [isApiReady, setIsApiReady] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false); // Strict lock
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const syncInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => setIsApiReady(true);
    } else {
      setIsApiReady(true);
    }
    return () => { if (syncInterval.current) clearInterval(syncInterval.current); };
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    SensoryEngine.playTap();
    setIsSearching(true);
    
    try {
      // Using our custom Next.js API Edge Route to natively scrape YouTube
      const response = await fetch(`/api/music/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.results) {
        setResults(data.results);
      }
    } catch (e) {
      console.error("Extraction failed:", e);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (!isApiReady || !playerContainerRef.current) return;

    if (!playerRef.current) {
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        height: '200', 
        width: '200',
        playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, rel: 0, playsinline: 1 },
        events: {
          onReady: () => {
            setIsPlayerReady(true);
            // We do not load track here, the useEffect below will catch it now that isPlayerReady is true
          },
          onStateChange: (e: any) => {
            if (e.data === 1) { // Playing
              setIsPlaying(true);
              setIsBuffering(false);
              setDuration(e.target.getDuration());
              startSync();
            } else if (e.data === 2) { // Paused
              setIsPlaying(false);
              setIsBuffering(false);
              stopSync();
            } else if (e.data === 3) { // Buffering
              setIsBuffering(true);
            } else if (e.data === 0) { // Ended
              handleNext();
            }
          },
          onError: (e: any) => {
            console.error("YT Error:", e.data);
            // 500ms stabilization delay prevents rapid-fire "not attached to DOM" iframe crashes
            setTimeout(() => handleNext(), 500);
          }
        }
      });
    }

    return () => {
      // FIX: Robust cleanup ensures ghost audio perfectly stops when app is closed
      if (playerRef.current && playerRef.current.pauseVideo) {
        try {
          playerRef.current.pauseVideo();
        } catch(e){}
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady]);

  useEffect(() => {
    if (currentTrackIndex === -1 || results.length === 0 || !isPlayerReady || !playerRef.current) return;
    loadTrack(results[currentTrackIndex]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex, results, isPlayerReady]);

  const loadTrack = (track: Track) => {
    setProgress(0);
    setCurrentTime(0);
    setIsBuffering(true);
    playerRef.current.loadVideoById({ videoId: track.url });
  };

  const startSync = () => {
    if (syncInterval.current) clearInterval(syncInterval.current);
    syncInterval.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const time = playerRef.current.getCurrentTime();
        const dur = playerRef.current.getDuration();
        setCurrentTime(time);
        setDuration(dur);
        setProgress((time / dur) * 100);
      }
    }, 500);
  };

  const stopSync = () => {
    if (syncInterval.current) clearInterval(syncInterval.current);
  };

  const togglePlay = () => {
    SensoryEngine.playTap();
    if (!playerRef.current || !playerRef.current.playVideo || currentTrackIndex === -1) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const playTrack = (index: number) => {
    SensoryEngine.playTap();
    setCurrentTrackIndex(index);
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
    if (currentTrackIndex === -1 || duration === 0 || !playerRef.current?.seekTo) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    
    const targetTime = percent * duration;
    playerRef.current.seekTo(targetTime, true);
    setCurrentTime(targetTime);
    setProgress(percent * 100);
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
        
        {/* Hidden YouTube Player allocated correctly to bypass invisible zero-pixel crashing */}
        {/* Shielded in a generic wrapper so React doesn't fight YouTube for DOM control when div becomes iframe */}
        <div style={{ position: 'absolute', top: -9999, left: -9999, width: 200, height: 200, opacity: 0, pointerEvents: 'none' }}>
          <div id="cyberquest-yt-bridge">
            <div ref={playerContainerRef}></div>
          </div>
        </div>

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
                <Music size={48} />
                <p>Search YouTube to instantly stream full tracks.</p>
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

          <div className={styles.playbackEngine}>
            <div className={styles.progressWrapper}>
              <span>{formatTime(currentTime)}</span>
              <div className={styles.progressBar} onClick={handleScrub}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
              </div>
              <span>{formatTime(duration)}</span>
            </div>
            
            <div className={styles.controls}>
              <button className={styles.btn} onClick={handlePrev} disabled={results.length === 0 || !isPlayerReady}>
                <SkipBack size={24} />
              </button>
              
              <button className={styles.playBtn} onClick={togglePlay} disabled={results.length === 0 || !isPlayerReady}>
                {isBuffering ? (
                  <Loader2 size={24} className={styles.spinner} color="black" />
                ) : isPlaying ? (
                  <Pause size={28} fill="currentColor" />
                ) : (
                  <Play size={28} fill="currentColor" />
                )}
              </button>
              
              <button className={styles.btn} onClick={handleNext} disabled={results.length === 0 || !isPlayerReady}>
                <SkipForward size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppContainer>
  );
}
