import { useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import services from "../data/site-navigation.json";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const mobileMenu = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => { if (mobileMenu.current) mobileMenu.current.open = false; };
  const switchLanguage = () => {
    const next = language === "zh" ? "en" : "zh";
    setLanguage(next);
    window.history.replaceState(null, "", `${next === "zh" ? "/zh/" : "/"}${window.location.hash}`);
    closeMenu();
  };
  const links = <>
    <details className="core-service-menu">
      <summary>{t("服务方案", "Solutions")}</summary>
      <div className="core-service-links">
        {services.map(item => <a key={item.href} href={language === "zh" ? item.hrefZh : item.href}>{t(item.zh, item.en)}</a>)}
        <a href="/frp-sculpture-fabrication-singapore/">{t("雕塑与艺术装置", "Sculpture & art installations")}</a>
        <a href="/holiday-decorations-singapore/">{t("节日装饰", "Seasonal decorations")}</a>
        <a href="#products">{t("更多制作类型", "More production formats")}</a>
      </div>
    </details>
    <a href="/case-studies/">{t("项目案例", "Projects")}</a>
    <a href="/about/">{t("关于我们", "About")}</a>
    <a className="core-brief" href="#contact">{t("整理项目需求", "Plan your brief")}</a>
  </>;
  return <header className="core-header" onKeyDown={event => {
    if (event.key === "Escape") {
      const details = (event.target as HTMLElement).closest("details");
      if (details) { details.open = false; details.querySelector("summary")?.focus(); }
    }
  }}>
    <div className="core-header-inner">
      <a className="core-brand" href={language === "zh" ? "/zh/" : "/"} aria-label="ACT Creative home"><img src="/favicon-192.png" alt="" width="36" height="36" /><span>ACT Creative</span></a>
      <nav className="core-desktop" aria-label={t("主导航", "Primary navigation")}>{links}</nav>
      <button type="button" className="core-language" onClick={switchLanguage} aria-label={language === "zh" ? "Switch to English" : "切换到中文"}>{language === "zh" ? "EN" : "中文"}</button>
      <details className="core-mobile" ref={mobileMenu} onClick={event => { if ((event.target as HTMLElement).closest("a")) closeMenu(); }}>
        <summary>{t("菜单", "Menu")}</summary>
        <nav aria-label={t("手机导航", "Mobile navigation")}>{links}</nav>
      </details>
    </div>
  </header>;
}
