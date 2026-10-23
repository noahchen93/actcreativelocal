export type HomeTheme = "light" | "dark";
export type ThemePreference = "auto" | HomeTheme;
export const THEME_STORAGE_KEY = "act-home-theme-v1";

export function isThemePreference(value: string | null): value is ThemePreference {
  return value === "auto" || value === "light" || value === "dark";
}

export function scheduledTheme(date = new Date()): HomeTheme {
  const hour = date.getHours();
  return hour >= 7 && hour < 19 ? "light" : "dark";
}
