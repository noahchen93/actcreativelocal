import { Button } from "./ui/button";
import { Menu, Globe } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import { scrollToSection } from "../lib/scrollToSection";
import logo from "figma:asset/9f81ed77f1d1b1fce6de57ec26fc06cd89a9a112.png";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

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
            <button
              onClick={() => handleSectionLink("cases")}
              className="act-nav-pill"
            >
              {t("案例", "Work")}
            </button>
            <button
              onClick={() => handleSectionLink("services")}
              className="act-nav-pill"
            >
              {t("服务", "Services")}
            </button>
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
                <button
                  onClick={() => handleSectionLink("cases")}
                  className="text-white hover:text-[#CCFF00] transition-colors text-left px-4 py-2 rounded-lg hover:bg-[#1a1a1a]"
                >
                  {t("案例", "Work")}
                </button>
                <button
                  onClick={() => handleSectionLink("services")}
                  className="text-white hover:text-[#CCFF00] transition-colors text-left px-4 py-2 rounded-lg hover:bg-[#1a1a1a]"
                >
                  {t("服务", "Services")}
                </button>
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
