"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type SystemState = "locked" | "unlocked";
export type GamePhase = 0 | 1 | 2 | 3 | 4;
export type NavStyle = "gesture" | "buttons";

export interface NotificationMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isRead: boolean;
}

interface OSContextType {
  systemState: SystemState;
  setSystemState: (state: SystemState) => void;
  gamePhase: GamePhase;
  setGamePhase: (phase: GamePhase) => void;
  notifications: NotificationMessage[];
  addNotification: (notif: Omit<NotificationMessage, 'id' | 'isRead'>) => void;
  markNotificationsRead: () => void;
  activeApp: string | null;
  setActiveApp: (appId: string | null) => void;
  isHydrated: boolean;
  uvModeEnabled: boolean;
  setUvModeEnabled: (val: boolean) => void;
  showControlCenter: boolean;
  setShowControlCenter: (val: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (val: boolean) => void;
  appOrigin: { x: number, y: number } | null;
  setAppOrigin: (origin: { x: number, y: number } | null) => void;
  isClosing: boolean;
  closeApp: () => void;
  navStyle: NavStyle;
  setNavStyle: (style: NavStyle) => void;
}

const OSContext = createContext<OSContextType | null>(null);

export function OSProvider({ children }: { children: ReactNode }) {
  const [systemState, setSystemStateInternal] = useState<SystemState>("locked");
  const [gamePhase, setGamePhaseInternal] = useState<GamePhase>(0);
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [activeApp, setActiveAppInternal] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [uvModeEnabled, setUvModeEnabled] = useState(false);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [appOrigin, setAppOrigin] = useState<{ x: number, y: number } | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [navStyleInternal, setNavStyleInternal] = useState<NavStyle>("gesture");

  useEffect(() => {
    try {
      const savedSys = localStorage.getItem("cq_sys_state") as SystemState;
      const savedPhase = localStorage.getItem("cq_game_phase");
      const savedNotifs = localStorage.getItem("cq_notifications");
      const savedApp = localStorage.getItem("cq_active_app");
      const savedNav = localStorage.getItem("cq_nav_style") as NavStyle;
      
      if (savedSys) setSystemStateInternal(savedSys);
      if (savedPhase) setGamePhaseInternal(parseInt(savedPhase) as GamePhase);
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
      if (savedApp && savedApp !== "null") setActiveAppInternal(savedApp);
      if (savedNav) setNavStyleInternal(savedNav);
    } catch (e) {
      console.warn("Storage restricted.");
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const setSystemState = (state: SystemState) => {
    setSystemStateInternal(state);
    if (state === "unlocked" && gamePhase === 0) setGamePhase(1);
    try { localStorage.setItem("cq_sys_state", state); } catch (e) {}
  };

  const setGamePhase = (phase: GamePhase) => {
    setGamePhaseInternal(phase);
    try { localStorage.setItem("cq_game_phase", phase.toString()); } catch (e) {}
  };

  const addNotification = (notif: Omit<NotificationMessage, 'id' | 'isRead'>) => {
    setNotifications(prev => {
      // Prevent duplicate exact messages
      if (prev.some(n => n.text === notif.text)) return prev;
      
      const newNotif = { ...notif, id: Math.random().toString(36).substring(7), isRead: false };
      const updated = [newNotif, ...prev];
      try { localStorage.setItem("cq_notifications", JSON.stringify(updated)); } catch(e){}
      
      // Haptic Vibration + Audio could go here
      if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([200, 100, 200]);
      }
      return updated;
    });
  };

  const markNotificationsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({...n, isRead: true}));
      try { localStorage.setItem("cq_notifications", JSON.stringify(updated)); } catch(e){}
      return updated;
    });
  };

  const setActiveApp = (appId: string | null) => {
    setActiveAppInternal(appId);
    try { localStorage.setItem("cq_active_app", appId || "null"); } catch (e) {}
  };

  const closeApp = () => {
    setIsClosing(true);
    setTimeout(() => {
      setActiveApp(null);
      setIsClosing(false);
    }, 300); // 300ms matches the cubic-bezier exit
  };

  const setNavStyle = (style: NavStyle) => {
    setNavStyleInternal(style);
    try { localStorage.setItem("cq_nav_style", style); } catch (e) {}
  };

  return (
    <OSContext.Provider value={{ 
      systemState, setSystemState, 
      gamePhase, setGamePhase,
      notifications, addNotification, markNotificationsRead,
      activeApp, setActiveApp, 
      isHydrated,
      uvModeEnabled, setUvModeEnabled,
      showControlCenter, setShowControlCenter,
      showNotifications, setShowNotifications,
      appOrigin, setAppOrigin,
      isClosing, closeApp,
      navStyle: navStyleInternal, setNavStyle
    }}>
      {children}
    </OSContext.Provider>
  );
}

export function useOS() {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error("useOS must be used within OSProvider");
  return ctx;
}
