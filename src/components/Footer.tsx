import { Mail, Phone, MapPin, Facebook, Instagram, Heart } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import { scrollToSection } from "../lib/scrollToSection";
import logo from "figma:asset/9f81ed77f1d1b1fce6de57ec26fc06cd89a9a112.png";

export function Footer() {
  const { language, setLanguage, t } = useLanguage();

  const switchLanguage = () => {
    const nextLanguage = language === "zh" ? "en" : "zh";
    const nextPath = nextLanguage === "zh" ? "/zh/" : "/";

    setLanguage(nextLanguage);
    window.history.replaceState(null, "", `${nextPath}${window.location.hash}`);
  };

  return (
    <footer className="bg-black text-gray-300 relative overflow-hidden border-t border-[#CCFF00]/20">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#CCFF00] rounded-full mix-blend-screen filter blur-3xl opacity-5"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#CCFF00] rounded-full mix-blend-screen filter blur-3xl opacity-5"></div>

      <div className="container mx-auto px-4 py-10 md:py-12 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-8">
          {/* 公司信息 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img src={logo} alt="ACT Creative — Singapore-based creative production and event fabrication partner" className="h-12 w-auto mb-4" />
            <p className="text-sm mb-4 text-gray-400 max-w-sm">
              {t(
                "立足新加坡的创意制作伙伴，为活动机构与品牌团队提供定制制作与项目落地支持。",
                "Singapore-based creative production partner — custom fabrication and project delivery for event agencies and brand teams."
              )}
            </p>
            <div className="flex items-center gap-3" aria-label="ACT Creative Singapore official social media">
              <a
                href="https://www.facebook.com/profile.php?id=61590057715328"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ACT Creative Singapore official Facebook page"
                title="ACT Creative Singapore official Facebook page"
                className="w-9 h-9 rounded-full border border-[#CCFF00]/30 flex items-center justify-center text-gray-400 hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/act_creative_official/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ACT Creative Singapore official Instagram account"
                title="ACT Creative Singapore official Instagram account"
                className="w-9 h-9 rounded-full border border-[#CCFF00]/30 flex items-center justify-center text-gray-400 hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* 快速链接 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-white mb-4">{t("快速链接", "Quick Links")}</h4>
            <nav className="space-y-2 text-sm">
              <a href="/about/" className="block text-gray-400 hover:text-[#CCFF00] transition-colors">
                {t("关于我们", "About")}
              </a>
              <button onClick={() => scrollToSection("home")} className="block text-gray-400 hover:text-[#CCFF00] transition-colors">
                {t("首页", "Home")}
              </button>
              <button onClick={() => scrollToSection("services")} className="block text-gray-400 hover:text-[#CCFF00] transition-colors">
                {t("服务", "Services")}
              </button>
              <button onClick={() => scrollToSection("cases")} className="block text-gray-400 hover:text-[#CCFF00] transition-colors">
                {t("案例", "Cases")}
              </button>
              <a href="/case-studies/" className="block text-gray-400 hover:text-[#CCFF00] transition-colors">
                {t("案例总览", "Case Studies")}
              </a>
              <a href="/blog/" className="block text-gray-400 hover:text-[#CCFF00] transition-colors">
                {t("博客", "Blog")}
              </a>
              <button onClick={switchLanguage} className="block text-gray-400 hover:text-[#CCFF00] transition-colors">
                {language === "zh" ? "English" : "中文"}
              </button>
              <button onClick={() => scrollToSection("contact")} className="block text-gray-400 hover:text-[#CCFF00] transition-colors">
                {t("联系我们", "Contact")}
              </button>
            </nav>
          </motion.div>

          {/* 服务 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-white mb-4">{t("核心服务", "Core Services")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/event-fabrication-singapore/" className="text-gray-400 hover:text-[#CCFF00] transition-colors">
                  {t("活动制作", "Event Fabrication Singapore")}
                </a>
              </li>
              <li>
                <a href="/custom-props-singapore/" className="text-gray-400 hover:text-[#CCFF00] transition-colors">
                  {t("道具定制", "Custom Props Singapore")}
                </a>
              </li>
              <li>
                <a href="/frp-sculpture-fabrication-singapore/" className="text-gray-400 hover:text-[#CCFF00] transition-colors">
                  {t("FRP雕塑制作", "FRP Sculpture Fabrication")}
                </a>
              </li>
              <li>
                <a href="/exhibition-booth-production-singapore/" className="text-gray-400 hover:text-[#CCFF00] transition-colors">
                  {t("展会展台制作", "Exhibition Booth Production")}
                </a>
              </li>
              <li>
                <a href="/china-event-production-support/" className="text-gray-400 hover:text-[#CCFF00] transition-colors">
                  {t("跨境制作支持", "Cross-Border Production Support")}
                </a>
              </li>
              <li>
                <a href="/event-merchandise-sourcing/" className="text-gray-400 hover:text-[#CCFF00] transition-colors">
                  {t("活动周边采购", "Event Merchandise Sourcing")}
                </a>
              </li>
            </ul>
          </motion.div>

          {/* 联系方式 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-white mb-4">{t("联系我们", "Contact Us")}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#CCFF00] mt-0.5 flex-shrink-0" />
                <a href="mailto:contact@actcreative.net" className="text-gray-400 hover:text-[#CCFF00] transition-colors">contact@actcreative.net</a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#CCFF00] mt-0.5 flex-shrink-0" />
                <a href="https://wa.me/6584515268" className="text-gray-400 hover:text-[#CCFF00] transition-colors">+65 84515268</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#CCFF00] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  {t(
                    "65 Chulia Street #25-03 OCBC Centre, Singapore 049513",
                    "65 Chulia Street #25-03 OCBC Centre, Singapore 049513"
                  )}
                </span>
              </li>
              <li className="text-gray-500 pl-6">
                ACT CREATIVE PTE. LTD. · UEN 202600226K
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-[#CCFF00]/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} ACT CREATIVE. {t("版权所有", "All rights reserved")}.
            </p>
            <motion.div 
              className="flex items-center gap-2 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {t("用", "Made with")} <Heart className="w-4 h-4 text-[#CCFF00]" fill="currentColor" /> {t("在新加坡制作", "in Singapore")}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
