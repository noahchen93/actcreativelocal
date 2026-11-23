import services from "../data/site-navigation.json";
import { useLanguage } from "../contexts/LanguageContext";

const mobileNames: Record<string, [string, string]> = {
  "/event-fabrication-singapore/": ["活动搭建", "Event builds"],
  "/custom-props-singapore/": ["道具定制", "Custom props"],
  "/booth-design-build-singapore/": ["展位制作", "Exhibition booths"],
  "/custom-food-truck-rental-singapore/": ["餐车与移动空间", "Food trucks"],
  "/interactive-digital-display-singapore/": ["互动数字展陈", "Interactive displays"],
  "/china-sourcing-agent/": ["采购与交付", "Sourcing & delivery"],
};

// Business priorities are explicit; traffic volume alone must not promote rentals.
const corePaths = [
  "/custom-props-singapore/",
  "/frp-sculpture-fabrication-singapore/",
  "/custom-flying-inflatables-singapore/",
  "/booth-design-build-singapore/",
  "/event-fabrication-singapore/",
  "/holiday-decorations-singapore/",
  "/china-sourcing-agent/",
];
const coreServices = corePaths.map(href => services.find(item => item.href === href) ?? ({
  href,
  ...({
    "/frp-sculpture-fabrication-singapore/": {
      en: "Sculpture & art installations", zh: "雕塑与艺术装置",
      hrefZh: "/zh/frp-sculpture-fabrication-singapore/",
      description: "Custom sculpture production, packing and Singapore installation.",
      descriptionZh: "雕塑定制、制作协调、包装运输与新加坡安装。",
    },
    "/custom-flying-inflatables-singapore/": {
      en: "Custom inflatables", zh: "气模与充气装置",
      hrefZh: href,
      description: "Branded inflatable forms for events and displays, scoped to your site.",
      descriptionZh: "活动气模、品牌造型与充气展示装置，按场地条件规划。",
    },
    "/holiday-decorations-singapore/": {
      en: "Christmas & New Year", zh: "圣诞与新年布置",
      hrefZh: href,
      description: "Festive displays, including sourcing and installation from your drawings.",
      descriptionZh: "节庆装置与布置，也可按客户图纸采购及安装。",
    },
  } as Record<string, Omit<(typeof services)[number], "href">>)[href],
}));
const additionalServices = services.filter(item => !corePaths.includes(item.href));

export function ServiceRoutes() {
  const { t, language } = useLanguage();
  return <section id="services" className="solution-routes">
    <h2>{t("你的项目需要什么？", "What are you planning?")}</h2>
    <p>{t("从项目类型开始，查看制作范围、案例和交付方式。", "Start with your project type. Explore the build scope, relevant work and delivery options.")}</p>
    <div className="solution-grid">{coreServices.map(item => <a className="solution-card" key={item.href} href={language === "zh" ? item.hrefZh : item.href}>
      <h3><span className="desktop-copy">{t(item.zh,item.en)}</span><span className="mobile-copy">{t(mobileNames[item.href]?.[0] ?? item.zh,mobileNames[item.href]?.[1] ?? item.en)}</span></h3><p>{t(item.descriptionZh,item.description)}</p><span>{language === "zh" && item.hrefZh === item.href ? "查看方案（英文）" : t("查看方案", "Explore solution")} →</span>
    </a>)}</div>
    <details className="additional-solutions">
      <summary>{t("补充方案：餐车与互动展陈", "Additional options: food trucks & interactive displays")}</summary>
      <div className="solution-grid">{additionalServices.map(item => <a className="solution-card" key={item.href} href={language === "zh" ? item.hrefZh : item.href}>
        <h3>{t(item.zh, item.en)}</h3><p>{t(item.descriptionZh, item.description)}</p><span>{t("查看方案", "Explore solution")} →</span>
      </a>)}</div>
    </details>
  </section>;
}
