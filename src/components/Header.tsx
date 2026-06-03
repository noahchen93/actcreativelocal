import { Button } from "./ui/button";
import { Menu, Globe } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import { scrollToSection } from "../lib/scrollToSection";
import logo from "figma:asset/9f81ed77f1d1b1fce6de57ec26fc06cd89a9a112.png";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeProjectGroup, setActiveProjectGroup] = useState<"local" | "china">("local");
  const { language, setLanguage, t } = useLanguage();
  const localizedHref = (englishHref: string, chineseHref?: string) =>
    language === "zh" && chineseHref ? chineseHref : englishHref;

  const projectGroups = [
    {
      id: "local" as const,
      label: t("本地 Projects", "Singapore Projects"),
      description: t("新加坡活动、品牌快闪与公共体验", "Singapore events, brand activations and public experiences"),
      projects: [
        {
          title: "A BIG BIG WORLD at Sentosa",
          href: "/case-studies/sentosa-big-big-world-event-fabrication/",
          meta: t("圣淘沙跨年灯光秀", "Sentosa light show"),
        },
        {
          title: "PACMAN and Friends at Sentosa",
          href: "/case-studies/sentosa-pacman-human-game/",
          meta: t("主题公共互动活动", "Themed public activation"),
        },
        {
          title: "Wings of Art Barbie Runway",
          href: "/case-studies/wings-of-art-barbie-runway-singapore/",
          meta: t("慈善艺术展与道具制作", "Charity art exhibition and props"),
        },
        {
          title: "Artbox Singapore",
          href: localizedHref(
            "/case-studies/artbox-singapore-merchandise-materials/",
            "/zh/case-studies/artbox-singapore-merchandise-materials/",
          ),
          meta: t("活动周边与物料支持", "Event merchandise and materials"),
        },
      ],
    },
    {
      id: "china" as const,
      label: t("中国国内 Projects", "China Projects"),
      description: t("中国博物馆展览、公共艺术与商业空间项目", "China museum exhibitions, public art and retail installations"),
      projects: [
        {
          title: "Florentijn Hofman Shanghai Museum Show",
          href: "/case-studies/florentijn-hofman-shanghai-museum-show/",
          meta: t("上海个人博物馆巡展", "Shanghai solo museum show"),
        },
        {
          title: "Craig & Karl Beijing Museum Show",
          href: "/case-studies/craig-and-karl-beijing-museum-show/",
          meta: t("北京个人博物馆展览", "Beijing solo museum show"),
        },
        {
          title: "K11 Shenyang Public Artworks",
          href: "/case-studies/k11-shenyang-public-art-collection/",
          meta: t("30+ 件大型公共艺术装置", "30+ large-scale public artworks"),
        },
      ],
    },
  ];

  const activeProjects = projectGroups.find((group) => group.id === activeProjectGroup) ?? projectGroups[0];

  const serviceItems = [
    {
      title: t("展位设计和搭建", "Booth Design & Build"),
      href: localizedHref("/booth-design-build-singapore/", "/zh/booth-design-build-singapore/"),
      meta: t("展会、快闪与品牌活动空间", "Exhibition, pop-up and activation spaces"),
    },
    {
      title: t("中国采购代理", "China Sourcing Agent"),
      href: localizedHref("/china-sourcing-agent/", "/zh/china-sourcing-agent/"),
      meta: t("供应商筛选、比价、打样与定制跟进", "Supplier search, price comparison, samples and custom production"),
    },
    {
      title: t("文创礼品与道具咨询", "Merchandise & Props Consulting"),
      href: "/custom-merchandise-props-consulting/",
      meta: t("定制咨询、报价参考与生产建议", "Quote reference, specs and production direction"),
    },
    {
      title: t("中国与东南亚运输协调", "China & SEA Logistics"),
      href: "/china-southeast-asia-logistics/",
      meta: t("运输代理、装箱、交付与现场协调", "Packing, shipment planning and delivery coordination"),
    },
    {
      title: t("艺术展览策划与布展", "Art Exhibition Planning & Installation"),
      href: "/art-exhibition-planning-installation/",
      meta: t("展陈策划、制作协调、运输与布展", "Display planning, fabrication, logistics and installation"),
    },
  ];

  const handleSectionLink = (id: string) => {
    scrollToSection(id);
    setIsMenuOpen(false);
  };

  const switchLanguage = () => {
    const nextLanguage = language === "zh" ? "en" : "zh";
    const nextPath = nextLanguage === "zh" ? "/zh/" : "/";
    const nextUrl = `${nextPath}${window.location.hash}`;

    setLanguage(nextLanguage);
    window.history.replaceState(null, "", nextUrl);
    setIsMenuOpen(false);
  };

  const languageLabel = language === "zh" ? "EN" : "中文";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-[#CCFF00]/20">
      <style>{`
        .act-header-row {
          min-height: 86px;
        }
        .act-header-container {
          padding-left: 1rem;
          padding-right: 1.25rem;
        }
        .act-desktop-nav {
          display: none;
        }
        .act-nav-pill {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 0.68rem 0.28rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.98rem;
          font-weight: 650;
          line-height: 1.1;
          white-space: nowrap;
          transition: color 180ms ease, opacity 180ms ease;
        }
        .act-nav-pill:hover,
        .act-nav-pill:focus-visible {
          color: #CCFF00;
          outline: none;
        }
        .act-nav-pill::after {
          content: "";
          position: absolute;
          left: 1rem;
          right: 1rem;
          bottom: 0.25rem;
          height: 2px;
          background: #CCFF00;
          opacity: 0;
          transform: scaleX(0.2);
          transition: opacity 180ms ease, transform 180ms ease;
        }
        .act-nav-pill:hover::after,
        .act-nav-pill:focus-visible::after {
          opacity: 1;
          transform: scaleX(1);
        }
        .act-project-menu {
          position: relative;
          display: inline-flex;
        }
        .act-project-trigger {
          gap: 0.42rem;
        }
        .act-project-trigger-icon {
          display: inline-block;
          width: 0.42rem;
          height: 0.42rem;
          border-right: 1.5px solid currentColor;
          border-bottom: 1.5px solid currentColor;
          transform: rotate(45deg) translateY(-1px);
          transition: transform 180ms ease;
        }
        .act-project-menu:hover .act-project-trigger-icon,
        .act-project-menu:focus-within .act-project-trigger-icon {
          transform: rotate(225deg) translateY(-1px);
        }
        .act-project-dropdown {
          position: absolute;
          top: calc(100% + 0.85rem);
          left: 0;
          display: grid;
          grid-template-columns: minmax(14.5rem, 0.85fr) minmax(23rem, 1.35fr);
          gap: 1rem;
          width: min(46rem, calc(100vw - 2rem));
          padding: 0.85rem;
          border: 1px solid rgba(204, 255, 0, 0.26);
          border-radius: 0.5rem;
          background: rgba(5, 5, 5, 0.98);
          box-shadow: 0 24px 70px -38px rgba(204, 255, 0, 0.72), 0 18px 60px rgba(0, 0, 0, 0.46);
          opacity: 0;
          pointer-events: none;
          transform: translateY(-0.35rem);
          transition: opacity 160ms ease, transform 160ms ease;
        }
        .act-project-dropdown::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: -0.9rem;
          height: 0.9rem;
        }
        .act-project-menu:hover .act-project-dropdown,
        .act-project-menu:focus-within .act-project-dropdown {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }
        .act-project-groups,
        .act-project-list {
          min-width: 0;
          border: 1px solid rgba(204, 255, 0, 0.14);
          border-radius: 0.5rem;
          background: rgba(18, 18, 18, 0.88);
          padding: 0.5rem;
        }
        .act-project-group-button {
          display: block;
          width: 100%;
          padding: 0.85rem 0.9rem;
          border-radius: 0.5rem;
          text-align: left;
          transition: background 160ms ease;
        }
        .act-project-group-button strong {
          display: block;
          color: #fff;
          font-size: 0.92rem;
          line-height: 1.2;
        }
        .act-project-group-button span {
          display: block;
          margin-top: 0.25rem;
          color: rgba(255, 255, 255, 0.52);
          font-size: 0.76rem;
          line-height: 1.35;
        }
        .act-project-group-button:hover,
        .act-project-group-button:focus-visible,
        .act-project-group-button[data-active="true"] {
          background: rgba(204, 255, 0, 0.1);
          outline: none;
        }
        .act-project-group-button:hover strong,
        .act-project-group-button:focus-visible strong,
        .act-project-group-button[data-active="true"] strong {
          color: #CCFF00;
        }
        .act-project-list-header {
          padding: 0.55rem 0.65rem 0.45rem;
          color: rgba(255, 255, 255, 0.52);
          font-size: 0.72rem;
          font-weight: 750;
          letter-spacing: 0;
          text-transform: uppercase;
        }
        .act-project-link {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0.85rem;
          align-items: center;
          padding: 0.82rem 0.75rem;
          border-radius: 0.5rem;
          color: #fff;
          transition: background 160ms ease, color 160ms ease;
        }
        .act-project-link:hover,
        .act-project-link:focus-visible {
          background: rgba(204, 255, 0, 0.1);
          color: #CCFF00;
          outline: none;
        }
        .act-project-link-title {
          display: block;
          font-size: 0.92rem;
          font-weight: 700;
          line-height: 1.22;
        }
        .act-project-link-meta {
          display: block;
          margin-top: 0.2rem;
          color: rgba(255, 255, 255, 0.52);
          font-size: 0.76rem;
          line-height: 1.35;
        }
        .act-project-link-arrow {
          color: #CCFF00;
          font-size: 1rem;
        }
        .act-service-menu {
          position: relative;
          display: inline-flex;
        }
        .act-service-dropdown {
          position: absolute;
          top: calc(100% + 0.85rem);
          left: 50%;
          z-index: 2;
          width: min(29rem, calc(100vw - 2rem));
          padding: 0.65rem;
          border: 1px solid rgba(204, 255, 0, 0.26);
          border-radius: 0.5rem;
          background: rgba(5, 5, 5, 0.98);
          box-shadow: 0 24px 70px -38px rgba(204, 255, 0, 0.72), 0 18px 60px rgba(0, 0, 0, 0.46);
          opacity: 0;
          pointer-events: none;
          transform: translate(-50%, -0.35rem);
          transition: opacity 160ms ease, transform 160ms ease;
        }
        .act-service-dropdown::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: -0.9rem;
          height: 0.9rem;
        }
        .act-service-menu:hover .act-service-dropdown,
        .act-service-menu:focus-within .act-service-dropdown {
          opacity: 1;
          pointer-events: auto;
          transform: translate(-50%, 0);
        }
        .act-service-menu:hover .act-project-trigger-icon,
        .act-service-menu:focus-within .act-project-trigger-icon {
          transform: rotate(225deg) translateY(-1px);
        }
        .act-service-link {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0.8rem;
          align-items: center;
          padding: 0.82rem 0.8rem;
          border-radius: 0.5rem;
          color: #fff;
          transition: background 160ms ease, color 160ms ease;
        }
        .act-service-link:hover,
        .act-service-link:focus-visible {
          background: rgba(204, 255, 0, 0.1);
          color: #CCFF00;
          outline: none;
        }
        .act-service-link-title {
          display: block;
          font-size: 0.92rem;
          font-weight: 750;
          line-height: 1.22;
        }
        .act-service-link-meta {
          display: block;
          margin-top: 0.2rem;
          color: rgba(255, 255, 255, 0.52);
          font-size: 0.76rem;
          line-height: 1.35;
        }
        .act-mobile-project-block {
          padding: 0.7rem 1rem 0.85rem;
          border: 1px solid rgba(204, 255, 0, 0.16);
          border-radius: 0.5rem;
          background: rgba(26, 26, 26, 0.68);
        }
        .act-mobile-project-heading {
          display: block;
          color: #CCFF00;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0;
          text-transform: uppercase;
          margin-bottom: 0.45rem;
        }
        .act-mobile-project-link {
          display: block;
          padding: 0.55rem 0;
          color: #fff;
          font-size: 0.92rem;
          line-height: 1.25;
        }
        .act-mobile-project-link span {
          display: block;
          margin-top: 0.12rem;
          color: rgba(255, 255, 255, 0.52);
          font-size: 0.75rem;
        }
        .act-header-actions {
          display: none;
        }
        .act-action-cluster {
          align-items: center;
          gap: 0.4rem;
          padding: 0.25rem;
          border: 1px solid rgba(204, 255, 0, 0.16);
          border-radius: 0.9rem;
          background: rgba(10, 10, 10, 0.74);
          flex-shrink: 0;
        }
        .act-action-button {
          display: inline-flex;
          height: 44px;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 0.7rem;
          font-size: 0.92rem;
          font-weight: 650;
          line-height: 1;
          white-space: nowrap;
          transition: background 180ms ease, border-color 180ms ease, color 180ms ease;
        }
        .act-language-button {
          min-width: 126px;
          padding: 0 0.95rem;
          border: 1px solid rgba(204, 255, 0, 0.22);
          background: rgba(26, 26, 26, 0.9);
          color: #fff;
        }
        .act-language-button:hover,
        .act-language-button:focus-visible {
          border-color: rgba(204, 255, 0, 0.48);
          background: rgba(34, 34, 34, 0.95);
          outline: none;
        }
        .act-brief-button {
          min-width: 126px;
          padding: 0 1rem;
          border: 1px solid #CCFF00;
          background: #CCFF00;
          color: #000;
          box-shadow: 0 10px 26px -22px rgba(204, 255, 0, 0.9);
        }
        .act-brief-button:hover,
        .act-brief-button:focus-visible {
          background: #b8e600;
          border-color: #b8e600;
          outline: none;
        }
        .act-mobile-actions {
          display: flex;
        }
        .act-mobile-nav {
          display: block;
        }
        @media (min-width: 1120px) {
          .act-desktop-nav {
            display: flex;
            align-items: center;
            gap: 1.55rem;
            padding: 0.42rem 0;
            border: 1px solid rgba(204, 255, 0, 0.16);
            border-left: 0;
            border-right: 0;
            background: transparent;
          }
          .act-header-actions {
            display: flex;
            align-items: center;
            margin-left: 1rem;
          }
          .act-mobile-actions {
            display: none;
          }
          .act-mobile-nav {
            display: none;
          }
        }
        @media (min-width: 1200px) {
          .act-header-container {
            padding-left: 1.5rem;
            padding-right: 1.75rem;
          }
          .act-desktop-nav {
            gap: 2rem;
          }
          .act-nav-pill {
            padding-inline: 0.35rem;
          }
        }
        @media (min-width: 1360px) {
          .act-desktop-nav {
            gap: 2.35rem;
          }
          .act-header-container {
            padding-right: 2rem;
          }
        }
      `}</style>
      <div className="act-header-container container mx-auto">
        <div className="act-header-row flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <img src={logo} alt="ACT Creative logo — Singapore event fabrication and cross-border production agency" className="h-12 w-auto" />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="act-desktop-nav" aria-label="Primary navigation">
            <div className="act-project-menu">
              <button
                type="button"
                onMouseEnter={() => setActiveProjectGroup("local")}
                onFocus={() => setActiveProjectGroup("local")}
                className="act-nav-pill act-project-trigger"
              >
                {t("精选项目", "Selected Projects")}
                <span className="act-project-trigger-icon" aria-hidden="true" />
              </button>
              <div className="act-project-dropdown" role="menu" aria-label="Selected projects">
                <div className="act-project-groups" aria-label="Project regions">
                  {projectGroups.map((group) => (
                    <button
                      key={group.id}
                      type="button"
                      className="act-project-group-button"
                      data-active={activeProjectGroup === group.id}
                      onMouseEnter={() => setActiveProjectGroup(group.id)}
                      onFocus={() => setActiveProjectGroup(group.id)}
                    >
                      <strong>{group.label}</strong>
                      <span>{group.description}</span>
                    </button>
                  ))}
                </div>
                <div className="act-project-list">
                  <div className="act-project-list-header">{activeProjects.label}</div>
                  {activeProjects.projects.map((project) => (
                    <a key={project.href} href={project.href} className="act-project-link" role="menuitem">
                      <span>
                        <span className="act-project-link-title">{project.title}</span>
                        <span className="act-project-link-meta">{project.meta}</span>
                      </span>
                      <span className="act-project-link-arrow" aria-hidden="true">→</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="act-service-menu">
              <button
                type="button"
                className="act-nav-pill act-project-trigger"
              >
                {t("服务", "Services")}
                <span className="act-project-trigger-icon" aria-hidden="true" />
              </button>
              <div className="act-service-dropdown" role="menu" aria-label="Services">
                {serviceItems.map((service) => (
                  <a key={service.href} href={service.href} className="act-service-link" role="menuitem">
                    <span>
                      <span className="act-service-link-title">{service.title}</span>
                      <span className="act-service-link-meta">{service.meta}</span>
                    </span>
                    <span className="act-project-link-arrow" aria-hidden="true">→</span>
                  </a>
                ))}
              </div>
            </div>
            <button
              onClick={() => handleSectionLink("products")}
              className="act-nav-pill"
            >
              {t("产品", "Products")}
            </button>
            <a
              href="/about/"
              className="act-nav-pill"
            >
              {t("关于", "About")}
            </a>
            <button
              onClick={() => handleSectionLink("contact")}
              className="act-nav-pill"
            >
              {t("联系我们", "Contact")}
            </button>
          </nav>

          <div className="act-header-actions act-action-cluster">
            {/* Language Toggle Button */}
            <button
              onClick={switchLanguage}
              aria-label={language === "zh" ? "Switch to English" : "切换到中文"}
              className="act-action-button act-language-button"
            >
              <Globe className="h-4.5 w-4.5 text-[#CCFF00]" />
              <span>{languageLabel}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSectionLink("contact")}
              className="act-action-button act-brief-button"
            >
              {t("发送需求", "Send Brief")}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="act-mobile-actions items-center gap-2">
            {/* Mobile Language Toggle */}
            <motion.button
              onClick={switchLanguage}
              aria-label={language === "zh" ? "Switch to English" : "切换到中文"}
              className="p-2 rounded-lg bg-[#1a1a1a] border border-[#CCFF00]/20"
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-sm text-[#CCFF00]">{languageLabel}</span>
            </motion.button>

            <motion.button
              className="p-2 rounded-lg bg-[#1a1a1a]"
              aria-label={isMenuOpen ? t("关闭菜单", "Close menu") : t("打开菜单", "Open menu")}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <Menu className="w-6 h-6 text-[#CCFF00]" />
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              className="act-mobile-nav py-4 border-t border-[#CCFF00]/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex flex-col space-y-4">
                <div className="act-mobile-project-block">
                  <span className="act-mobile-project-heading">{t("精选项目", "Selected Projects")}</span>
                  <div className="space-y-3">
                    {projectGroups.map((group) => (
                      <div key={group.id}>
                        <span className="block text-xs font-semibold text-white/60">{group.label}</span>
                        <div className="mt-1">
                          {group.projects.map((project) => (
                            <a
                              key={project.href}
                              href={project.href}
                              className="act-mobile-project-link"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {project.title}
                              <span>{project.meta}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="act-mobile-project-block">
                  <span className="act-mobile-project-heading">{t("服务", "Services")}</span>
                  <div>
                    {serviceItems.map((service) => (
                      <a
                        key={service.href}
                        href={service.href}
                        className="act-mobile-project-link"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {service.title}
                        <span>{service.meta}</span>
                      </a>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleSectionLink("products")}
                  className="text-white hover:text-[#CCFF00] transition-colors text-left px-4 py-2 rounded-lg hover:bg-[#1a1a1a]"
                >
                  {t("产品", "Products")}
                </button>
                <a
                  href="/about/"
                  className="text-white hover:text-[#CCFF00] transition-colors text-left px-4 py-2 rounded-lg hover:bg-[#1a1a1a]"
                >
                  {t("关于", "About")}
                </a>
                <button
                  onClick={() => handleSectionLink("contact")}
                  className="text-white hover:text-[#CCFF00] transition-colors text-left px-4 py-2 rounded-lg hover:bg-[#1a1a1a]"
                >
                  {t("联系我们", "Contact")}
                </button>
                <Button
                  onClick={() => handleSectionLink("contact")}
                  className="w-full bg-[#CCFF00] hover:bg-[#b8e600] text-black"
                >
                  {t("发送需求", "Send Brief")}
                </Button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
