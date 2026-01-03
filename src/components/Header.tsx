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

  const toggleLanguage = () => {
    setLanguage(language === "zh" ? "en" : "zh");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-[#CCFF00]/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <img src={logo} alt="ACT CREATIVE" className="h-12 w-auto" />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection("home")} 
              className="text-white hover:text-[#CCFF00] transition-colors relative group"
            >
              {t("首页", "Home")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#CCFF00] group-hover:w-full transition-all"></span>
            </button>
            <button 
              onClick={() => scrollToSection("solutions")} 
              className="text-white hover:text-[#CCFF00] transition-colors relative group"
            >
              {t("解决方案", "Solutions")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#CCFF00] group-hover:w-full transition-all"></span>
            </button>
            <button 
              onClick={() => scrollToSection("services")} 
              className="text-white hover:text-[#CCFF00] transition-colors relative group"
            >
              {t("服务", "Services")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#CCFF00] group-hover:w-full transition-all"></span>
            </button>
            <button 
              onClick={() => scrollToSection("cases")} 
              className="text-white hover:text-[#CCFF00] transition-colors relative group"
            >
              {t("案例", "Cases")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#CCFF00] group-hover:w-full transition-all"></span>
            </button>
            <button 
              onClick={() => scrollToSection("products")} 
              className="text-white hover:text-[#CCFF00] transition-colors relative group"
            >
              {t("产品", "Products")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#CCFF00] group-hover:w-full transition-all"></span>
            </button>
            <button 
              onClick={() => scrollToSection("team")} 
              className="text-white hover:text-[#CCFF00] transition-colors relative group"
            >
              {t("团队", "Team")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#CCFF00] group-hover:w-full transition-all"></span>
            </button>
            <button 
              onClick={() => scrollToSection("contact")} 
              className="text-white hover:text-[#CCFF00] transition-colors relative group"
            >
              {t("联系我们", "Contact")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#CCFF00] group-hover:w-full transition-all"></span>
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle Button */}
            <motion.button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-all border border-[#CCFF00]/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe className="w-4 h-4 text-[#CCFF00]" />
              <span className="text-white">{language === "zh" ? "EN" : "中文"}</span>
            </motion.button>

            <Button 
              onClick={() => scrollToSection("contact")}
              className="bg-[#CCFF00] hover:bg-[#b8e600] text-black shadow-lg hover:shadow-[#CCFF00]/50 transition-all"
            >
              {t("免费咨询", "Free Consultation")}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Language Toggle */}
            <motion.button
              onClick={toggleLanguage}
              className="p-2 rounded-lg bg-[#1a1a1a] border border-[#CCFF00]/20"
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-sm text-[#CCFF00]">{language === "zh" ? "EN" : "中文"}</span>
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
              className="md:hidden py-4 border-t border-[#CCFF00]/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => scrollToSection("home")} 
                  className="text-white hover:text-[#CCFF00] transition-colors text-left px-4 py-2 rounded-lg hover:bg-[#1a1a1a]"
                >
                  {t("首页", "Home")}
                </button>
                <button 
                  onClick={() => scrollToSection("solutions")} 
                  className="text-white hover:text-[#CCFF00] transition-colors text-left px-4 py-2 rounded-lg hover:bg-[#1a1a1a]"
                >
                  {t("解决方案", "Solutions")}
                </button>
                <button 
                  onClick={() => scrollToSection("services")} 
                  className="text-white hover:text-[#CCFF00] transition-colors text-left px-4 py-2 rounded-lg hover:bg-[#1a1a1a]"
                >
                  {t("服务", "Services")}
                </button>
                <button 
                  onClick={() => scrollToSection("cases")} 
                  className="text-white hover:text-[#CCFF00] transition-colors text-left px-4 py-2 rounded-lg hover:bg-[#1a1a1a]"
                >
                  {t("案例", "Cases")}
                </button>
                <button 
                  onClick={() => scrollToSection("products")} 
                  className="text-white hover:text-[#CCFF00] transition-colors text-left px-4 py-2 rounded-lg hover:bg-[#1a1a1a]"
                >
                  {t("产品", "Products")}
                </button>
                <button 
                  onClick={() => scrollToSection("team")} 
                  className="text-white hover:text-[#CCFF00] transition-colors text-left px-4 py-2 rounded-lg hover:bg-[#1a1a1a]"
                >
                  {t("团队", "Team")}
                </button>
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
                  {t("免费咨询", "Free Consultation")}
                </Button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}