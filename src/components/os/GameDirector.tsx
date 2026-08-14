"use client";

import { useEffect, useRef } from "react";
import { useOS } from "@/context/OSContext";
import { HINTS_REGISTRY } from "@/data/puzzles";
import { QUEST_CONFIG } from "@/config/quest";

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
      scheduleNotification("Mom", HINTS_REGISTRY.phase0_hint1, 10000); // 10s
      scheduleNotification("Dad", HINTS_REGISTRY.phase0_hint2, 60000); // 60s
    } 
    else if (gamePhase === 1) {
      scheduleNotification("Alex", HINTS_REGISTRY.phase1_hint1, 10000); // 10s
      scheduleNotification("Alex", HINTS_REGISTRY.phase1_hint2, 45000); // 45s
    }
    else if (gamePhase === 2) {
      scheduleNotification("Alex", HINTS_REGISTRY.phase2_hint1, 10000); // 10s
      scheduleNotification("Alex", HINTS_REGISTRY.phase2_hint2, 45000); // 45s
    }
    else if (gamePhase === 3) {
      scheduleNotification("Alex", HINTS_REGISTRY.phase3_hint1, 10000); // 10s
      scheduleNotification("Alex", HINTS_REGISTRY.phase3_hint2, 45000); // 45s
    }

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [gamePhase, addNotification]);

  return null; // Invisible daemon
}
