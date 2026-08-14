export interface ThemeTokens {
  bg: string;
  surface: string;
  elevated: string;
  border: string;
  borderSubtle: string;
  muted: string;
  textDim: string;
  text: string;
  textStrong: string;
  danger: string;
  warn: string;
  note: string;
  success: string;
  accent: string;
}

export const themes: Record<"light-mode" | "dark-mode", ThemeTokens> = {
  "light-mode": {
    bg: "#f4f4f5",
    surface: "#ffffff",
    elevated: "#e4e4e7",
    border: "#d4d4d8",
    borderSubtle: "color-mix(in srgb, #d4d4d8 50%, transparent)",
    muted: "#a1a1aa",
    textDim: "#52525b",
    text: "#27272a",
    textStrong: "#18181b",
    danger: "#ef4444",
    warn: "#f59e0b",
    note: "#3b82f6",
    success: "#10b981",
    accent: "#0ea5e9",
  },
  "dark-mode": {
    bg: "#09090b",
    surface: "#18181b",
    elevated: "#27272a",
    border: "#3f3f46",
    borderSubtle: "color-mix(in srgb, #3f3f46 50%, transparent)",
    muted: "#71717a",
    textDim: "#a1a1aa",
    text: "#e4e4e7",
    textStrong: "#fafafa",
    danger: "#f87171",
    warn: "#fbbf24",
    note: "#60a5fa",
    success: "#34d399",
    accent: "#38bdf8",
  }
};

export const defaultTheme = "dark-mode";
