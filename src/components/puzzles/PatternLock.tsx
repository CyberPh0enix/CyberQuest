"use client";

import { useState, useRef, useCallback } from "react";
import styles from "./PatternLock.module.css";
import { ENCRYPTED_ANSWERS } from "@/data/puzzles";
import { SensoryEngine } from "@/utils/sensory";

interface Point { x: number; y: number }

export default function PatternLock({ 
  onSuccess, 
  uvModeEnabled = false 
}: { 
  onSuccess: () => void,
  uvModeEnabled?: boolean
}) {
  const [pattern, setPattern] = useState<number[]>([]);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPos, setCurrentPos] = useState<Point | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Convert array like [2, 1, 0] into a string for comparison
  const validatePattern = useCallback((drawn: number[]) => {
    const drawnStr = drawn.join(",");
    if (drawnStr === ENCRYPTED_ANSWERS.lockPatternHash) {
      SensoryEngine.playSuccess();
      onSuccess();
    } else {
      SensoryEngine.playError();
      setErrorStatus("Incorrect Pattern");
      // Flash error for 1s then reset
      setTimeout(() => {
        setPattern([]);
        setErrorStatus(null);
      }, 1000);
    }
  }, [onSuccess]);

  // Handle Touch/Mouse Events globally for the container
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only accept left clicks or touch
    if (e.button !== 0 && e.button !== -1) return;
    
    if (errorStatus) return; // Locked during error animation
    
    setIsDrawing(true);
    setPattern([]);
    processPointerEvent(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    
    // Update the live line end coordinate relative to the grid
    if (gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();
      setCurrentPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    
    processPointerEvent(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setCurrentPos(null);
      if (pattern.length > 0) {
        validatePattern(pattern);
      }
    }
  };

  // Find which node (if any) the pointer is currently over
  const processPointerEvent = (clientX: number, clientY: number) => {
    // Use elementFromPoint for robust touch tracking across elements
    const element = document.elementFromPoint(clientX, clientY);
    if (!element) return;
    
    const indexStr = element.getAttribute("data-index");
    if (indexStr !== null) {
      const index = parseInt(indexStr, 10);
      if (!pattern.includes(index)) {
        setPattern(prev => [...prev, index]);
        SensoryEngine.playKeystroke();
      }
    }
  };

  // Build the SVG path connecting the selected nodes
  const buildSvgPath = () => {
    if (pattern.length === 0 || !gridRef.current) return "";
    
    let path = "";
    const rect = gridRef.current.getBoundingClientRect();

    pattern.forEach((nodeIndex, i) => {
      const nodeEl = nodesRef.current[nodeIndex];
      if (!nodeEl) return;
      
      const nodeRect = nodeEl.getBoundingClientRect();
      const x = nodeRect.left - rect.left + nodeRect.width / 2;
      const y = nodeRect.top - rect.top + nodeRect.height / 2;
      
      if (i === 0) path += `M ${x} ${y}`;
      else path += ` L ${x} ${y}`;
    });

    // Add the active drawing segment
    if (isDrawing && currentPos && pattern.length > 0) {
      path += ` L ${currentPos.x} ${currentPos.y}`;
    }

    return path;
  };

  return (
    <div 
      className={`${styles.container} ${uvModeEnabled ? styles.uvActive : ""}`}
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className={styles.grid} ref={gridRef}>
        {/* UV Smudge Mechanics */}
        <div className={styles.smudgeOverlay}></div>
        <svg className={styles.smudgeTrails}>
          {/* Faint paths mimicking the zigzag grease marks [1,4,9,14,15,11,6,2] */}
          {/* 
            Node Coordinates mapping (320px grid, 4x4):
            1: 120, 40
            4: 40, 120
            9: 120, 200
            14: 200, 280
            15: 280, 280
            11: 280, 200
            6: 200, 120
            2: 200, 40
          */}
          <path d="M 120 40 L 40 120 L 120 200 L 200 280 L 280 280 L 280 200 L 200 120 L 200 40" stroke="rgba(200, 210, 215, 0.15)" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="blur(6px)" />
        </svg>

        {/* Live Drawing SVG */}
        <svg className={styles.svgLayer}>
          <path 
            d={buildSvgPath()} 
            className={`${styles.line} ${errorStatus ? styles.lineError : ""}`} 
          />
        </svg>

        {/* 4x4 Grid Nodes */}
        {Array.from({ length: 16 }).map((_, i) => (
          <div 
            key={i} 
            className={styles.node}
            data-index={i}
            ref={el => { nodesRef.current[i] = el; }}
          >
            <div className={`
              ${styles.nodeInner} 
              ${pattern.includes(i) ? styles.active : ""}
              ${errorStatus && pattern.includes(i) ? styles.error : ""}
            `}></div>
          </div>
        ))}
      </div>

      <div className={styles.feedback}>
        {errorStatus || ""}
      </div>
    </div>
  );
}
