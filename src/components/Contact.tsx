import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import { MessageCircle, Mail, Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";

const EMAIL = "contact@actcreative.net";
const WHATSAPP = "6584515268";
const MAILTO_SUBJECT = "Project Inquiry — ACT Creative";

export function Contact() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      "Hi ACT Creative, I'd like to discuss a project."
    );
    window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, "_blank", "noopener");
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      toast.success(
        t("邮箱已复制到剪贴板", "Email copied to clipboard"),
        {
          description: EMAIL,
        }
      );
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback for older browsers
      toast(t("请手动复制邮箱", "Please copy the email manually"), {
        description: EMAIL,
      });
    }
  };

  // Open mail client AND copy to clipboard so user always has a path forward
  const handleEmail = () => {
    const subject = encodeURIComponent(MAILTO_SUBJECT);
    const body = encodeURIComponent(
      "Hi ACT Creative,\n\nI'd like to discuss a project.\n\n— "
    );
    // Open in same tab; if no handler is registered the page just stays put,
    // so we ALSO copy the address to clipboard as a fallback.
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    copyEmail();
  };

  return (
    <section
      id="contact"
      className="py-14 md:py-20 bg-[#0a0a0a] relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(204,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl text-white mb-4 tracking-wide">
            {t(
              "让我们将您的愿景变为现实",
              "LET'S TURN YOUR VISION INTO REALITY"
            )}
          </h2>
          <div className="w-32 h-1 bg-[#CCFF00] mx-auto"></div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-5 md:gap-8">
            {/* WhatsApp */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-[#CCFF00] rounded-lg blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

              <div className="relative bg-[#1a1a1a] border border-[#CCFF00]/20 rounded-lg p-6 md:p-8 text-center h-full transform transition-transform duration-300 group-hover:-translate-y-2 flex flex-col">
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-lg bg-[#CCFF00] flex items-center justify-center">
                    <MessageCircle className="w-7 h-7 md:w-10 md:h-10 text-black" />
                  </div>
                </div>

                <h3 className="text-white mb-2">
                  {t("WhatsApp 咨询", "WhatsApp Consultation")}
                </h3>

                <p className="text-gray-400 text-sm mb-4 md:mb-6">
                  {t(
                    "快速响应，即时沟通",
                    "Quick response, instant communication"
                  )}
                </p>

                {/* Visible WhatsApp number */}
                <p
                  className="text-white text-base mb-4 md:mb-6"
                  style={{ fontWeight: 500, letterSpacing: "0.02em" }}
                >
                  +65 8451 5268
                </p>

                <Button
                  onClick={handleWhatsApp}
                  className="w-full bg-[#CCFF00] hover:bg-[#b8e600] text-black mt-auto"
                >
                  {t("打开 WhatsApp", "Open WhatsApp")}
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
              <div className="absolute inset-0 bg-[#CCFF00] rounded-lg blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

              <div className="relative bg-[#1a1a1a] border border-[#CCFF00]/20 rounded-lg p-6 md:p-8 text-center h-full transform transition-transform duration-300 group-hover:-translate-y-2 flex flex-col">
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-lg bg-[#CCFF00] flex items-center justify-center">
                    <Mail className="w-7 h-7 md:w-10 md:h-10 text-black" />
                  </div>
                </div>

                <h3 className="text-white mb-2">
                  {t("邮件咨询", "Email Consultation")}
                </h3>

                <p className="text-gray-400 text-sm mb-4 md:mb-6">
                  {t(
                    "详细方案，专业回复",
                    "Detailed solutions, professional response"
                  )}
                </p>

                {/* Visible email address — clickable + copyable */}
                <button
                  onClick={copyEmail}
                  className="text-white text-base mb-4 md:mb-6 inline-flex items-center justify-center gap-2 hover:text-[#CCFF00] transition-colors group/email"
                  style={{ fontWeight: 500 }}
                  aria-label={t("复制邮箱", "Copy email address")}
                  title={t("点击复制", "Click to copy")}
                >
                  <span>{EMAIL}</span>
                  {copied ? (
                    <Check className="w-4 h-4 text-[#CCFF00]" />
                  ) : (
                    <Copy className="w-4 h-4 opacity-50 group-hover/email:opacity-100 transition-opacity" />
                  )}
                </button>

                <Button
                  onClick={handleEmail}
                  className="w-full bg-[#CCFF00] hover:bg-[#b8e600] text-black mt-auto"
                >
                  {t("发送邮件", "Send Email")}
                </Button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 md:mt-12 text-center"
          >
            <div className="bg-[#1a1a1a] border border-[#CCFF00]/20 rounded-lg p-6 md:p-8">
              <p className="text-gray-300 mb-4 text-sm md:text-base">
                {t(
                  "我们的团队随时待命，为您提供专业的咨询服务。无论是大型活动还是小型项目，我们都能为您量身定制解决方案。",
                  "Our team is always ready to provide professional consultation services. Whether it's a large-scale event or small project, we can tailor solutions for you."
                )}
              </p>
              <div className="flex items-center justify-center gap-4 md:gap-8 text-sm text-gray-400 flex-wrap">
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
