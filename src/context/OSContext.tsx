"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type SystemState = "locked" | "unlocked";

interface OSContextType {
  systemState: SystemState;
  setSystemState: (state: SystemState) => void;
  activeApp: string | null;
  setActiveApp: (appId: string | null) => void;
  isHydrated: boolean;
}

const OSContext = createContext<OSContextType | null>(null);

export function OSProvider({ children }: { children: ReactNode }) {
  const [systemState, setSystemStateInternal] = useState<SystemState>("locked");
  const [activeApp, setActiveAppInternal] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedSys = localStorage.getItem("cq_sys_state") as SystemState;
      const savedApp = localStorage.getItem("cq_active_app");
      if (savedSys) setSystemStateInternal(savedSys);
      if (savedApp && savedApp !== "null") setActiveAppInternal(savedApp);
    } catch (e) {
      console.warn("Storage restricted.");
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const setSystemState = (state: SystemState) => {
    setSystemStateInternal(state);
    try { localStorage.setItem("cq_sys_state", state); } catch (e) {}
  };

  const setActiveApp = (appId: string | null) => {
    setActiveAppInternal(appId);
    try { localStorage.setItem("cq_active_app", appId || "null"); } catch (e) {}
  };

  return (
    <OSContext.Provider value={{ systemState, setSystemState, activeApp, setActiveApp, isHydrated }}>
      {children}
    </OSContext.Provider>
  );
}

export function useOS() {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error("useOS must be used within OSProvider");
  return ctx;
}
