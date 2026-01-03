import { TrendingDown, Palette, Rocket, Shield, Scale, Truck, UserCheck, Eye, Zap, Sparkles, FileText, Headphones } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";

export function WhyActCreative() {
  const { t } = useLanguage();

  // 核心价值主张 - 3大亮点
  const coreValues = [
    {
      icon: TrendingDown,
      title: t("30%+", "30%+"),
      subtitle: t("成本节省", "Cost Efficiency"),
      description: t("直接对接中国供应商，省去中间环节", "Direct connection with Chinese suppliers, eliminating intermediaries")
    },
    {
      icon: Palette,
      title: t("100%", "100%"),
      subtitle: t("定制化制作", "Custom Fabrication"),
      description: t("完全按照您的需求定制生产", "Fully customized production according to your requirements")
    },
    {
      icon: Rocket,
      title: t("BUILD", "BUILD"),
      subtitle: t("实现不可能", "The Impossible"),
      description: t("突破创意边界，实现您的想象", "Break creative boundaries and realize your imagination")
    }
  ];

  return (
    <section id="solutions" className="py-20 bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(204,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Glowing accents */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#CCFF00] rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#CCFF00] rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>

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
            {t("为什么选择 ACT CREATIVE", "WHY ACT CREATIVE")}
          </h2>
          <div className="w-32 h-1 bg-[#CCFF00] mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t(
              "连接中国制造实力与新加坡创意产业，为您提供无可比拟的价值",
              "Connecting China's manufacturing power with Singapore's creative industry, delivering unmatched value"
            )}
          </p>
        </motion.div>

        {/* Core Value Propositions - 3大核心价值 */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {coreValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative group"
              >
                {/* Card background glow */}
                <div className="absolute inset-0 bg-[#CCFF00] rounded-lg blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                
                {/* Card content */}
                <div className="relative bg-[#1a1a1a] border border-[#CCFF00]/20 rounded-lg p-8 text-center h-full transform transition-transform duration-300 group-hover:-translate-y-2">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-[#CCFF00] flex items-center justify-center">
                      <Icon className="w-10 h-10 text-black" />
                    </div>
                  </div>
                  
                  <div className="text-5xl text-[#CCFF00] mb-2">
                    {value.title}
                  </div>
                  
                  <div className="text-xl text-white mb-4">
                    {value.subtitle}
                  </div>
                  
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}