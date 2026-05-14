import { Button } from "./ui/button";
import { Menu, Globe } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import logo from "figma:asset/9f81ed77f1d1b1fce6de57ec26fc06cd89a9a112.png";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
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
            gap: 1rem;
          }
          .act-mobile-actions {
            display: none;
          }
          .act-mobile-nav {
            display: none;
          }
        }
        @media (min-width: 1200px) {
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
        }
      `}</style>
      <div className="container mx-auto px-4">
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
              onClick={() => scrollToSection("cases")}
              className="act-nav-pill"
            >
              {t("案例", "Work")}
            </button>
            <button 
              onClick={() => scrollToSection("services")} 
              className="act-nav-pill"
            >
              {t("服务", "Services")}
            </button>
            <button 
              onClick={() => scrollToSection("products")} 
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
              onClick={() => scrollToSection("contact")} 
              className="act-nav-pill"
            >
              {t("联系我们", "Contact")}
            </button>
          </nav>

          <div className="act-header-actions">
            {/* Language Toggle Button */}
            <motion.button
              onClick={switchLanguage}
              aria-label={language === "zh" ? "Switch to English" : "切换到中文"}
              className="flex min-h-11 items-center gap-2 rounded-lg border border-[#CCFF00]/20 bg-[#1a1a1a] px-4 py-2.5 transition-all hover:bg-[#2a2a2a]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe className="w-4 h-4 text-[#CCFF00]" />
              <span className="text-white">{languageLabel}</span>
            </motion.button>

            <Button 
              onClick={() => scrollToSection("contact")}
              className="min-h-11 bg-[#CCFF00] px-5 text-[0.95rem] text-black shadow-lg transition-all hover:bg-[#b8e600] hover:shadow-[#CCFF00]/50"
            >
              {t("发送需求", "Send Brief")}
            </Button>
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
                  onClick={() => scrollToSection("cases")}
                  className="text-white hover:text-[#CCFF00] transition-colors text-left px-4 py-2 rounded-lg hover:bg-[#1a1a1a]"
                >
                  {t("案例", "Work")}
                </button>
                <button 
                  onClick={() => scrollToSection("services")} 
                  className="text-white hover:text-[#CCFF00] transition-colors text-left px-4 py-2 rounded-lg hover:bg-[#1a1a1a]"
                >
                  {t("服务", "Services")}
                </button>
                <button 
                  onClick={() => scrollToSection("products")} 
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
                  onClick={() => scrollToSection("contact")} 
                  className="text-white hover:text-[#CCFF00] transition-colors text-left px-4 py-2 rounded-lg hover:bg-[#1a1a1a]"
                >
                  {t("联系我们", "Contact")}
                </button>
                <Button 
                  onClick={() => scrollToSection("contact")} 
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
