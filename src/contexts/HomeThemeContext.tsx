import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { isThemePreference, scheduledTheme, THEME_STORAGE_KEY, type HomeTheme, type ThemePreference } from "../lib/homeTheme";

const HomeThemeContext = createContext<{
  preference: ThemePreference;
  theme: HomeTheme;
  setPreference: (value: ThemePreference) => void;
} | null>(null);

function initialPreference(): ThemePreference {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(saved) ? saved : "auto";
  } catch {
    return "auto";
  }
}

export function HomeThemeProvider({ children }: { children: ReactNode }) {
  const [preference, updatePreference] = useState<ThemePreference>(initialPreference);
  const [timeTheme, setTimeTheme] = useState<HomeTheme>(() => scheduledTheme());
  const theme = preference === "auto" ? timeTheme : preference;

  useEffect(() => {
    if (preference !== "auto") return;
    const refresh = () => setTimeTheme(scheduledTheme());
    refresh();
    const timer = window.setInterval(refresh, 60_000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [preference]);

  useEffect(() => {
    document.documentElement.dataset.homeTheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#171D1A" : "#F4F2EC");
  }, [theme]);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
      updatePreference(isThemePreference(event.newValue) ? event.newValue : "auto");
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const setPreference = (value: ThemePreference) => {
    setTimeTheme(scheduledTheme());
    updatePreference(value);
    try { window.localStorage.setItem(THEME_STORAGE_KEY, value); } catch { /* Still usable without storage. */ }
  };

  return <HomeThemeContext.Provider value={{ preference, theme, setPreference }}>{children}</HomeThemeContext.Provider>;
}

export function useHomeTheme() {
  const context = useContext(HomeThemeContext);
  if (!context) throw new Error("useHomeTheme requires HomeThemeProvider");
  return context;
}
