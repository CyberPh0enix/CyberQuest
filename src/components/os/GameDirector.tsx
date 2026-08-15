"use client";

import { useEffect, useRef } from "react";
import { useOS } from "@/context/OSContext";
import { QUEST_HINTS } from "@/data/puzzles";

export default function GameDirector() {
  const { gamePhase, addNotification } = useOS();
  const processedIds = useRef<Set<string>>(new Set());

  // Load processed hints on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cq_hints_processed");
      if (stored) {
        JSON.parse(stored).forEach((id: string) => processedIds.current.add(id));
      }
    } catch(e) {}
  }, []);

  useEffect(() => {
    // Determine start time for the current phase
    const storageKey = `cq_phase_${gamePhase}_start`;
    let startTime = localStorage.getItem(storageKey);
    if (!startTime) {
      startTime = Date.now().toString();
      localStorage.setItem(storageKey, startTime);
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = (now - parseInt(startTime!)) / 1000;
      let newlyProcessed = false;

      QUEST_HINTS.forEach(phaseData => {
        // A. If a phase is ALREADY SOLVED, immediately push all its hints so lore isn't lost
        if (phaseData.phase < gamePhase) {
          phaseData.hints.forEach(hint => {
            if (!processedIds.current.has(hint.id)) {
              addNotification({ sender: hint.sender, text: hint.text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
              processedIds.current.add(hint.id);
              newlyProcessed = true;
            }
          });
        }
        // B. Track current phase hints based on elapsed time
        else if (phaseData.phase === gamePhase) {
          phaseData.hints.forEach(hint => {
            if (hint.delay <= elapsedSeconds && !processedIds.current.has(hint.id)) {
              addNotification({ sender: hint.sender, text: hint.text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
              processedIds.current.add(hint.id);
              newlyProcessed = true;
            }
          });
        }
      });

      if (newlyProcessed) {
        try {
          localStorage.setItem("cq_hints_processed", JSON.stringify(Array.from(processedIds.current)));
        } catch (e) {}
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gamePhase, addNotification]);

  return null; // Invisible daemon
}
