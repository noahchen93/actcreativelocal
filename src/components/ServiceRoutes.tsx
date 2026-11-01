import services from "../data/site-navigation.json";
import { useLanguage } from "../contexts/LanguageContext";

const mobileNames: Record<string, [string, string]> = {
  "/event-fabrication-singapore/": ["活动搭建", "Event builds"],
  "/custom-props-singapore/": ["道具与雕塑", "Props & sculpture"],
  "/booth-design-build-singapore/": ["展位制作", "Exhibition booths"],
  "/custom-food-truck-rental-singapore/": ["餐车与移动空间", "Food trucks"],
  "/interactive-digital-display-singapore/": ["互动数字展陈", "Interactive displays"],
  "/china-sourcing-agent/": ["采购与交付", "Sourcing & delivery"],
};

export function ServiceRoutes() {
  const { t, language } = useLanguage();
  return <section id="services" className="solution-routes">
    <h2>{t("你的项目需要什么？", "What are you planning?")}</h2>
    <p>{t("从项目类型开始，查看制作范围、案例和交付方式。", "Start with your project type. Explore the build scope, relevant work and delivery options.")}</p>
    <div className="solution-grid">{services.map(item => <a className="solution-card" key={item.href} href={language === "zh" ? item.hrefZh : item.href}>
      <h3><span className="desktop-copy">{t(item.zh,item.en)}</span><span className="mobile-copy">{t(mobileNames[item.href]?.[0] ?? item.zh,mobileNames[item.href]?.[1] ?? item.en)}</span></h3><p>{t(item.descriptionZh,item.description)}</p><span>{t("查看方案", "Explore solution")} →</span>
    </a>)}</div>
  </section>;
}
