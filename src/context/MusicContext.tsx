"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { SensoryEngine } from "@/utils/sensory";

export type Track = {
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

interface MusicContextType {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  results: Track[];
  isSearching: boolean;
  currentTrackIndex: number;
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  isBuffering: boolean;
  isApiReady: boolean;
  isPlayerReady: boolean;
  handleSearch: (overrideQuery?: string, isStartup?: boolean) => Promise<void>;
  togglePlay: () => void;
  playTrack: (index: number) => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleScrub: (percent: number) => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used within MusicProvider");
  return context;
};

export const MusicProvider = ({ children }: { children: ReactNode }) => {
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
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  
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
    
    // Initial load default music
    if (results.length === 0 && !isSearching && searchQuery === "") {
      handleSearch("welcome movie songs", true);
    }
    
    return () => { if (syncInterval.current) clearInterval(syncInterval.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (overrideQuery?: string, isStartup?: boolean) => {
    const queryToSearch = typeof overrideQuery === "string" ? overrideQuery : searchQuery;
    if (!queryToSearch.trim()) return;
    
    if (!isStartup) SensoryEngine.playTap();
    setIsSearching(true);
    
    try {
      const response = await fetch(`/api/music/search?q=${encodeURIComponent(queryToSearch)}`);
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
            setTimeout(() => handleNext(), 500);
          }
        }
      });
    }
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

  const handleScrub = (percent: number) => {
    if (currentTrackIndex === -1 || duration === 0 || !playerRef.current?.seekTo) return;
    const targetTime = percent * duration;
    playerRef.current.seekTo(targetTime, true);
    setCurrentTime(targetTime);
    setProgress(percent * 100);
  };

  return (
    <MusicContext.Provider value={{
      searchQuery, setSearchQuery, results, isSearching, currentTrackIndex,
      isPlaying, progress, currentTime, duration, isBuffering, isApiReady, isPlayerReady,
      handleSearch, togglePlay, playTrack, handleNext, handlePrev, handleScrub
    }}>
      {/* OS-Level Hidden YouTube Player */}
      <div style={{ position: 'absolute', top: -9999, left: -9999, width: 200, height: 200, opacity: 0, pointerEvents: 'none' }}>
        <div id="cyberquest-yt-bridge">
          <div ref={playerContainerRef}></div>
        </div>
      </div>
      
      {children}
    </MusicContext.Provider>
  );
};
