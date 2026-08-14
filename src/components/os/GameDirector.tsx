"use client";

import { useEffect, useRef } from "react";
import { useOS } from "@/context/OSContext";
import { HINTS_REGISTRY } from "@/data/puzzles";

export default function GameDirector() {
  const { gamePhase, addNotification } = useOS();
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Clear any existing timers when phase changes
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const scheduleNotification = (sender: string, text: string, delayMs: number) => {
      const t = setTimeout(() => {
        addNotification({
          sender,
          text,
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        });
      }, delayMs);
      timersRef.current.push(t);
    };

    if (gamePhase === 0) {
      // Lockscreen puzzle hint
      scheduleNotification("Mom", HINTS_REGISTRY.h1, 10000); // 10s after load
    } 
    else if (gamePhase === 1) {
      // OSINT / Wi-Fi hint
      scheduleNotification("Alex", HINTS_REGISTRY.h2, 15000); // 15s after unlock
    }
    else if (gamePhase === 2) {
      // Router login hint
      scheduleNotification("Dad", HINTS_REGISTRY.h3, 10000); // 10s after Wi-Fi connect
    }

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [gamePhase, addNotification]);

  return null; // Invisible daemon
}
