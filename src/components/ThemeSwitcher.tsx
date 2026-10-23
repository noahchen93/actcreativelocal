import { useEffect, useRef } from "react";
import { Check, ChevronDown, Clock3, Moon, Sun } from "lucide-react";
import { useHomeTheme } from "../contexts/HomeThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import type { ThemePreference } from "../lib/homeTheme";

const options = [
  { value: "auto", zh: "自动", en: "Auto", Icon: Clock3 },
  { value: "light", zh: "浅色", en: "Light", Icon: Sun },
  { value: "dark", zh: "深色", en: "Dark", Icon: Moon },
] as const;

export function ThemeSwitcher() {
  const { preference, theme, setPreference } = useHomeTheme();
  const { t } = useLanguage();
  const menu = useRef<HTMLDetailsElement>(null);
  const CurrentIcon = theme === "light" ? Sun : Moon;

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (menu.current && !menu.current.contains(event.target as Node)) menu.current.open = false;
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  const choose = (value: ThemePreference) => {
    setPreference(value);
    if (menu.current) {
      menu.current.open = false;
      menu.current.querySelector("summary")?.focus();
    }
  };

  return <details ref={menu} className="theme-switcher">
    <summary aria-label={t("切换外观", "Change appearance")} title={t("切换外观", "Change appearance")}>
      <CurrentIcon size={18} aria-hidden="true" />
      <ChevronDown size={12} aria-hidden="true" />
    </summary>
    <div className="theme-switcher-panel" role="group" aria-label={t("外观模式", "Appearance options")}>
      <p className="theme-switcher-title">{t("外观", "Appearance")}</p>
      {options.map(({ value, zh, en, Icon }) => <button
        type="button" key={value} aria-pressed={preference === value} onClick={() => choose(value)}
      >
        <Icon size={17} aria-hidden="true" /><span>{t(zh, en)}</span>
        {preference === value && <Check size={16} aria-hidden="true" />}
      </button>)}
      <p className="theme-switcher-hint">{t("自动：当地时间 07:00–19:00 为浅色", "Auto: light from 07:00–19:00 local time")}</p>
    </div>
  </details>;
}
