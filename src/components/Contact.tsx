import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import { MessageCircle, Mail } from "lucide-react";
import { Button } from "./ui/button";

export function Contact() {
  const { t } = useLanguage();

  const handleWhatsApp = () => {
    window.open("https://wa.me/6584515268", "_blank");
  };

  const handleEmail = () => {
    window.location.href = "mailto:contact@actcreative.net";
  };

  return (
    <section id="contact" className="py-20 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(204,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl text-white mb-4 tracking-wide">
            {t("让我们将您的愿景变为现实", "LET'S TURN YOUR VISION INTO REALITY")}
          </h2>
          <div className="w-32 h-1 bg-[#CCFF00] mx-auto"></div>
        </motion.div>

        {/* Contact Methods */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* WhatsApp */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group relative"
            >
              {/* Card background glow */}
              <div className="absolute inset-0 bg-[#CCFF00] rounded-lg blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              
              {/* Card content */}
              <div className="relative bg-[#1a1a1a] border border-[#CCFF00]/20 rounded-lg p-8 text-center h-full transform transition-transform duration-300 group-hover:-translate-y-2">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-[#CCFF00] flex items-center justify-center">
                    <MessageCircle className="w-10 h-10 text-black" />
                  </div>
                </div>
                
                <h3 className="text-white mb-2">
                  {t("WhatsApp 咨询", "WhatsApp Consultation")}
                </h3>
                
                <p className="text-gray-400 text-sm mb-6">
                  {t("快速响应，即时沟通", "Quick response, instant communication")}
                </p>
                
                <Button
                  onClick={handleWhatsApp}
                  className="w-full bg-[#CCFF00] hover:bg-[#b8e600] text-black"
                >
                  {t("立即联系", "Contact Now")}
                </Button>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group relative"
            >
              {/* Card background glow */}
              <div className="absolute inset-0 bg-[#CCFF00] rounded-lg blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              
              {/* Card content */}
              <div className="relative bg-[#1a1a1a] border border-[#CCFF00]/20 rounded-lg p-8 text-center h-full transform transition-transform duration-300 group-hover:-translate-y-2">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-[#CCFF00] flex items-center justify-center">
                    <Mail className="w-10 h-10 text-black" />
                  </div>
                </div>
                
                <h3 className="text-white mb-2">
                  {t("邮件咨询", "Email Consultation")}
                </h3>
                
                <p className="text-gray-400 text-sm mb-6">
                  {t("详细方案，专业回复", "Detailed solutions, professional response")}
                </p>
                
                <Button
                  onClick={handleEmail}
                  className="w-full bg-[#CCFF00] hover:bg-[#b8e600] text-black"
                >
                  {t("发送邮件", "Send Email")}
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div className="bg-[#1a1a1a] border border-[#CCFF00]/20 rounded-lg p-8">
              <p className="text-gray-300 mb-4">
                {t(
                  "我们的团队随时待命，为您提供专业的咨询服务。无论是大型活动还是小型项目，我们都能为您量身定制解决方案。",
                  "Our team is always ready to provide professional consultation services. Whether it's a large-scale event or small project, we can tailor solutions for you."
                )}
              </p>
              <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse"></div>
                  <span>{t("24小时响应", "24h Response")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse"></div>
                  <span>{t("免费咨询", "Free Consultation")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse"></div>
                  <span>{t("专业团队", "Expert Team")}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}