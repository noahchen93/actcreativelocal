import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram, Heart } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import logo from "figma:asset/9f81ed77f1d1b1fce6de57ec26fc06cd89a9a112.png";

export function Footer() {
  const { t } = useLanguage();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-black text-gray-300 relative overflow-hidden border-t border-[#CCFF00]/20">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#CCFF00] rounded-full mix-blend-screen filter blur-3xl opacity-5"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#CCFF00] rounded-full mix-blend-screen filter blur-3xl opacity-5"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* 公司信息 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img src={logo} alt="ACT CREATIVE" className="h-12 w-auto mb-4" />
            <p className="text-sm mb-4 text-gray-400">
              {t(
                "专注为新加坡活动行业提供中国定制采购解决方案，让跨境采购变得简单高效。",
                "Focused on providing China custom procurement solutions for Singapore event industry, making cross-border procurement simple and efficient."
              )}
            </p>
            {/* Social media links removed - will be added when accounts are ready */}
          </motion.div>

          {/* 快速链接 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-white mb-4">{t("快速链接", "Quick Links")}</h4>
            <nav className="space-y-2">
              <button onClick={() => scrollToSection("home")} className="block text-gray-400 hover:text-[#CCFF00] transition-colors">
                {t("首页", "Home")}
              </button>
              <button onClick={() => scrollToSection("solutions")} className="block text-gray-400 hover:text-[#CCFF00] transition-colors">
                {t("解决方案", "Solutions")}
              </button>
              <button onClick={() => scrollToSection("services")} className="block text-gray-400 hover:text-[#CCFF00] transition-colors">
                {t("服务", "Services")}
              </button>
              <button onClick={() => scrollToSection("cases")} className="block text-gray-400 hover:text-[#CCFF00] transition-colors">
                {t("案例", "Cases")}
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
              <li className="text-gray-400">{t("道具定制", "Props Customization")}</li>
              <li className="text-gray-400">{t("运输物流", "Logistics")}</li>
              <li className="text-gray-400">{t("质量把控", "Quality Control")}</li>
              <li className="text-gray-400">{t("成本控制", "Cost Control")}</li>
              <li className="text-gray-400">{t("3D打印", "3D Printing")}</li>
              <li className="text-gray-400">{t("租赁调配", "Rental Service")}</li>
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
                <span className="text-gray-400">contact@actcreative.net</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#CCFF00] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">+65 84515268</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#CCFF00] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">{t("新加坡 • 全球供应链", "Singapore • Global Supply Chain")}</span>
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