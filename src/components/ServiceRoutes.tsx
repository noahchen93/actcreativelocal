import services from "../data/site-navigation.json";
import { useLanguage } from "../contexts/LanguageContext";

export function ServiceRoutes() {
  const { t, language } = useLanguage();
  return <section id="services" className="solution-routes">
    <h2>{t("你的项目需要什么？", "What are you planning?")}</h2>
    <p>{t("从项目类型开始，查看制作范围、案例和交付方式。", "Start with your project type. Explore the build scope, relevant work and delivery options.")}</p>
    <div className="solution-grid">{services.map(item => <a className="solution-card" key={item.href} href={language === "zh" ? item.hrefZh : item.href}>
      <h3>{t(item.zh,item.en)}</h3><p>{t(item.descriptionZh,item.description)}</p><span>{t("查看方案", "Explore solution")} →</span>
    </a>)}</div>
  </section>;
}
