"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { themes, defaultTheme, ThemeTokens } from "@/config/theme";

type ThemeMode = "light-mode" | "dark-mode";

interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cyberquest_theme") as ThemeMode;
    if (saved === "light-mode" || saved === "dark-mode") {
      setMode(saved);
    }
    setMounted(true);
  }, []);

  const toggleMode = () => {
    const nextMode = mode === "dark-mode" ? "light-mode" : "dark-mode";
    setMode(nextMode);
    localStorage.setItem("cyberquest_theme", nextMode);
  };

  const getThemeStyles = () => {
    const tokens = themes[mode];
    const styleObj: Record<string, string> = {};
    Object.entries(tokens).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      styleObj[cssVar] = value;
    });
    return styleObj;
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <div style={mounted ? getThemeStyles() : { ...getThemeStyles(), opacity: 1 }} className="theme-root">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
