import { Card, CardContent } from "./ui/card";
import { Package, Truck, DollarSign, ShieldCheck, Scale, MessageSquare, CheckCircle2, ArrowRight, ArrowDown, Settings, Headphones } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import { useState } from "react";

const serviceFlowData = [
  {
    step: 1,
    icon: MessageSquare,
    title: { zh: "需求沟通", en: "Consultation" },
    emoji: "💬",
    description: { 
      zh: "告诉我们您的需求和预算",
      en: "Share your needs and budget"
    },
    details: [
      { zh: "一对一咨询服务", en: "One-on-one consultation" },
      { zh: "专业建议和方案", en: "Expert advice and solutions" },
      { zh: "快速响应24小时内", en: "Quick response within 24h" }
    ],
    gradient: "from-[#CCFF00] to-[#b8e600]"
  },
  {
    step: 2,
    icon: Scale,
    title: { zh: "多家比价", en: "Price Comparison" },
    emoji: "⚖️",
    description: { 
      zh: "对接多家优质供应商",
      en: "Connect multiple suppliers"
    },
    details: [
      { zh: "筛选5+家供应商", en: "Screen 5+ suppliers" },
      { zh: "详细报价对比", en: "Detailed price comparison" },
      { zh: "推荐最优方案", en: "Best solution recommended" }
    ],
    gradient: "from-[#CCFF00] to-[#b8e600]"
  },
  {
    step: 3,
    icon: DollarSign,
    title: { zh: "成本优化", en: "Cost Optimization" },
    emoji: "💰",
    description: { 
      zh: "为您争取最优价格",
      en: "Negotiate best pricing"
    },
    details: [
      { zh: "利用规模采购优势", en: "Leverage bulk purchasing power" },
      { zh: "直接对接工厂源头", en: "Direct factory connection" },
      { zh: "透明定价无隐藏", en: "Transparent pricing" }
    ],
    gradient: "from-[#CCFF00] to-[#b8e600]"
  },
  {
    step: 4,
    icon: Package,
    title: { zh: "定制生产", en: "Custom Production" },
    emoji: "🎨",
    description: { 
      zh: "工厂开始生产您的订单",
      en: "Factory starts production"
    },
    details: [
      { zh: "严格按图纸生产", en: "Strict blueprint adherence" },
      { zh: "实时进度更新", en: "Real-time progress updates" },
      { zh: "样品确认后批量", en: "Mass production after samples" }
    ],
    gradient: "from-[#CCFF00] to-[#b8e600]"
  },
  {
    step: 5,
    icon: ShieldCheck,
    title: { zh: "质量把控", en: "Quality Control" },
    emoji: "✅",
    description: { 
      zh: "严格检验每件产品",
      en: "Inspect every product"
    },
    details: [
      { zh: "出厂前全面检查", en: "Full pre-shipment inspection" },
      { zh: "第三方质检报告", en: "Third-party QC reports" },
      { zh: "不合格品退换", en: "Defective items replaced" }
    ],
    gradient: "from-[#CCFF00] to-[#b8e600]"
  },
  {
    step: 6,
    icon: Truck,
    title: { zh: "物流配送", en: "Logistics & Delivery" },
    emoji: "🚚",
    description: { 
      zh: "安全准时送达",
      en: "Safe & timely delivery"
    },
    details: [
      { zh: "海运/空运可选", en: "Sea/air freight options" },
      { zh: "清关一站式代理", en: "One-stop customs clearance" },
      { zh: "门到门配送服务", en: "Door-to-door delivery" }
    ],
    gradient: "from-[#CCFF00] to-[#b8e600]"
  },
  {
    step: 7,
    icon: Settings,
    title: { zh: "现场安装监督", en: "On-site Installation" },
    emoji: "🔧",
    description: { 
      zh: "专业团队现场指导安装",
      en: "Professional on-site installation guidance"
    },
    details: [
      { zh: "技术人员现场支持", en: "Technical staff on-site support" },
      { zh: "安装质量检查", en: "Installation quality inspection" },
      { zh: "确保符合安全标准", en: "Ensure safety standards compliance" }
    ],
    gradient: "from-[#CCFF00] to-[#b8e600]"
  },
  {
    step: 8,
    icon: Headphones,
    title: { zh: "本地运营维护支持", en: "Local Operations Support" },
    emoji: "🛠️",
    description: { 
      zh: "持续的维护和技术支持",
      en: "Ongoing maintenance & support"
    },
    details: [
      { zh: "长期维护服务", en: "Long-term maintenance service" },
      { zh: "技术咨询热线", en: "Technical consultation hotline" },
      { zh: "零配件供应保障", en: "Spare parts supply guarantee" }
    ],
    gradient: "from-[#CCFF00] to-[#b8e600]"
  }
];

export function Services() {
  const { t } = useLanguage();
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const visibleMobileSteps = showAllSteps
    ? serviceFlowData
    : serviceFlowData.slice(0, 4);

  return (
    <section id="services" className="py-14 md:py-20 bg-black relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#CCFF00] rounded-full mix-blend-screen filter blur-3xl opacity-5 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#CCFF00] rounded-full mix-blend-screen filter blur-3xl opacity-5 animate-float" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-5 py-2.5 bg-[#CCFF00] text-black rounded-lg mb-4 shadow-lg">
            {t("一条龙服务流程 🎪", "End-to-End Service Flow 🎪")}
          </div>
          <h2 className="text-3xl md:text-4xl text-white mb-4">
            {t("您只需等待收货，其他交给我们", "You Just Wait for Delivery, We Handle the Rest")}
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            {t(
              "从咨询到维护，8个环节无缝衔接，让跨境采购变得像网购一样简单 ✨",
              "From consultation to maintenance, 8 seamless steps make cross-border procurement as easy as online shopping ✨"
            )}
          </p>
        </motion.div>

        {/* Desktop Flow - Compact Zigzag Layout */}
        <div className="hidden lg:block mb-16">
          <div className="max-w-6xl mx-auto">
            {/* Row 1: Steps 1-3 */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {serviceFlowData.slice(0, 3).map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onHoverStart={() => setHoveredStep(index)}
                  onHoverEnd={() => setHoveredStep(null)}
                  onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                  className="relative cursor-pointer"
                >
                  <Card className={`bg-[#1a1a1a] backdrop-blur-sm border-2 transition-all ${
                    hoveredStep === index || expandedStep === index
                      ? 'border-[#CCFF00] shadow-xl shadow-[#CCFF00]/20' 
                      : 'border-[#CCFF00]/20 shadow-md'
                  }`}>
                    <CardContent className="p-5">
                      {/* Compact Header */}
                      <div className="flex items-center gap-3 mb-3">
                        {/* Step Number + Icon */}
                        <div className={`w-12 h-12 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center shadow-lg relative flex-shrink-0`}>
                          <service.icon className="w-6 h-6 text-black" />
                          <div className="absolute -top-1.5 -left-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-[#CCFF00] shadow-md">
                            <span className="text-xs font-bold text-black">{service.step}</span>
                          </div>
                          <span className="absolute -bottom-1 -right-1 text-lg">{service.emoji}</span>
                        </div>
                        
                        {/* Title */}
                        <div className="flex-1">
                          <h3 className="text-white mb-0.5">{t(service.title.zh, service.title.en)}</h3>
                          <p className="text-xs text-gray-500">
                            {t("点击查看详情", "Click for details")}
                          </p>
                        </div>
                      </div>
                      
                      {/* Brief Description - Always Visible */}
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {t(service.description.zh, service.description.en)}
                      </p>
                      
                      {/* Expandable Details */}
                      <motion.div
                        initial={false}
                        animate={{ 
                          height: expandedStep === index ? 'auto' : 0,
                          opacity: expandedStep === index ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <ul className="space-y-2 mt-3 pt-3 border-t border-[#CCFF00]/20">
                          {service.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
                              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#CCFF00]" />
                              <span>{t(detail.zh, detail.en)}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </CardContent>
                  </Card>

                  {/* Arrow to next step (horizontal) */}
                  {index < 2 && (
                    <motion.div
                      className="absolute -right-3 top-1/2 -translate-y-1/2 z-20"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <div className={`w-6 h-6 bg-gradient-to-r ${service.gradient} rounded-full flex items-center justify-center shadow-md`}>
                        <ArrowRight className="w-4 h-4 text-black" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Connecting Arrow Down (from step 3 to step 4) */}
            <div className="flex justify-end mb-8 pr-8">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex flex-col items-center"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#CCFF00] to-[#b8e600] rounded-full flex items-center justify-center shadow-md">
                  <ArrowDown className="w-5 h-5 text-black" />
                </div>
                <div className="w-0.5 h-12 bg-gradient-to-b from-[#CCFF00] to-[#b8e600] opacity-40"></div>
              </motion.div>
            </div>

            {/* Row 2: Steps 4-6 (Reversed order for zigzag) */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {serviceFlowData.slice(3, 6).reverse().map((service, index) => {
                const actualIndex = 5 - index;
                return (
                  <motion.div
                    key={actualIndex}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
                    onHoverStart={() => setHoveredStep(actualIndex)}
                    onHoverEnd={() => setHoveredStep(null)}
                    onClick={() => setExpandedStep(expandedStep === actualIndex ? null : actualIndex)}
                    className="relative cursor-pointer"
                  >
                    <Card className={`bg-[#1a1a1a] backdrop-blur-sm border-2 transition-all ${
                      hoveredStep === actualIndex || expandedStep === actualIndex
                        ? 'border-[#CCFF00] shadow-xl shadow-[#CCFF00]/20' 
                        : 'border-[#CCFF00]/20 shadow-md'
                    }`}>
                      <CardContent className="p-5">
                        {/* Compact Header */}
                        <div className="flex items-center gap-3 mb-3">
                          {/* Step Number + Icon */}
                          <div className={`w-12 h-12 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center shadow-lg relative flex-shrink-0`}>
                            <service.icon className="w-6 h-6 text-black" />
                            <div className="absolute -top-1.5 -left-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-[#CCFF00] shadow-md">
                              <span className="text-xs font-bold text-black">{service.step}</span>
                            </div>
                            <span className="absolute -bottom-1 -right-1 text-lg">{service.emoji}</span>
                          </div>
                          
                          {/* Title */}
                          <div className="flex-1">
                            <h3 className="text-white mb-0.5">{t(service.title.zh, service.title.en)}</h3>
                            <p className="text-xs text-gray-500">
                              {t("点击查看详情", "Click for details")}
                            </p>
                          </div>
                        </div>
                        
                        {/* Brief Description - Always Visible */}
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {t(service.description.zh, service.description.en)}
                        </p>
                        
                        {/* Expandable Details */}
                        <motion.div
                          initial={false}
                          animate={{ 
                            height: expandedStep === actualIndex ? 'auto' : 0,
                            opacity: expandedStep === actualIndex ? 1 : 0
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <ul className="space-y-2 mt-3 pt-3 border-t border-[#CCFF00]/20">
                            {service.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
                                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#CCFF00]" />
                                <span>{t(detail.zh, detail.en)}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      </CardContent>
                    </Card>

                    {/* Arrow to next step (horizontal, left direction) */}
                    {index < 2 && (
                      <motion.div
                        className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 rotate-180"
                        animate={{ x: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <div className={`w-6 h-6 bg-gradient-to-r ${service.gradient} rounded-full flex items-center justify-center shadow-md`}>
                          <ArrowRight className="w-4 h-4 text-black" />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Connecting Arrow Down (from step 6 to step 7) */}
            <div className="flex justify-start mb-8 pl-8">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex flex-col items-center"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#CCFF00] to-[#b8e600] rounded-full flex items-center justify-center shadow-md">
                  <ArrowDown className="w-5 h-5 text-black" />
                </div>
                <div className="w-0.5 h-12 bg-gradient-to-b from-[#CCFF00] to-[#b8e600] opacity-40"></div>
              </motion.div>
            </div>

            {/* Row 3: Steps 7-8 */}
            <div className="grid grid-cols-3 gap-6">
              {serviceFlowData.slice(6, 8).map((service, index) => {
                const actualIndex = 6 + index;
                return (
                  <motion.div
                    key={actualIndex}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.8 }}
                    onHoverStart={() => setHoveredStep(actualIndex)}
                    onHoverEnd={() => setHoveredStep(null)}
                    onClick={() => setExpandedStep(expandedStep === actualIndex ? null : actualIndex)}
                    className="relative cursor-pointer"
                  >
                    <Card className={`bg-[#1a1a1a] backdrop-blur-sm border-2 transition-all ${
                      hoveredStep === actualIndex || expandedStep === actualIndex
                        ? 'border-[#CCFF00] shadow-xl shadow-[#CCFF00]/20' 
                        : 'border-[#CCFF00]/20 shadow-md'
                    }`}>
                      <CardContent className="p-5">
                        {/* Compact Header */}
                        <div className="flex items-center gap-3 mb-3">
                          {/* Step Number + Icon */}
                          <div className={`w-12 h-12 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center shadow-lg relative flex-shrink-0`}>
                            <service.icon className="w-6 h-6 text-black" />
                            <div className="absolute -top-1.5 -left-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-[#CCFF00] shadow-md">
                              <span className="text-xs font-bold text-black">{service.step}</span>
                            </div>
                            <span className="absolute -bottom-1 -right-1 text-lg">{service.emoji}</span>
                          </div>
                          
                          {/* Title */}
                          <div className="flex-1">
                            <h3 className="text-white mb-0.5">{t(service.title.zh, service.title.en)}</h3>
                            <p className="text-xs text-gray-500">
                              {t("点击查看详情", "Click for details")}
                            </p>
                          </div>
                        </div>
                        
                        {/* Brief Description - Always Visible */}
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {t(service.description.zh, service.description.en)}
                        </p>
                        
                        {/* Expandable Details */}
                        <motion.div
                          initial={false}
                          animate={{ 
                            height: expandedStep === actualIndex ? 'auto' : 0,
                            opacity: expandedStep === actualIndex ? 1 : 0
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <ul className="space-y-2 mt-3 pt-3 border-t border-[#CCFF00]/20">
                            {service.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
                                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#CCFF00]" />
                                <span>{t(detail.zh, detail.en)}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      </CardContent>
                    </Card>

                    {/* Arrow to next step (horizontal) */}
                    {index < 1 && (
                      <motion.div
                        className="absolute -right-3 top-1/2 -translate-y-1/2 z-20"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <div className={`w-6 h-6 bg-gradient-to-r ${service.gradient} rounded-full flex items-center justify-center shadow-md`}>
                          <ArrowRight className="w-4 h-4 text-black" />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Flow Path Hint */}
          <motion.div
            className="text-center mt-8 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
          >
            {t("💡 点击任意卡片查看详细信息", "💡 Click any card to view details")}
          </motion.div>
        </div>

        {/* Mobile & Tablet Flow - Compact Vertical Layout */}
        <div className="lg:hidden grid gap-4 mb-8">
          {visibleMobileSteps.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <Card
                className={`bg-[#1a1a1a] backdrop-blur-sm border transition-all relative ${
                  expandedStep === index
                    ? "border-[#CCFF00]/70"
                    : "border-[#CCFF00]/20"
                }`}
                onClick={() => setExpandedStep(expandedStep === index ? null : index)}
              >
                <CardContent className="p-5">
                  {/* Step Number Badge */}
                  <div className={`absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br ${service.gradient} rounded-lg flex items-center justify-center text-black shadow-lg z-10 border border-black`}>
                    <span className="font-bold">{service.step}</span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 bg-gradient-to-br ${service.gradient} rounded-lg flex items-center justify-center shadow-lg relative`}>
                        <service.icon className="w-6 h-6 text-black" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="mb-1 text-white">{t(service.title.zh, service.title.en)}</h3>
                        <span className="text-xs text-[#CCFF00] whitespace-nowrap">
                          {expandedStep === index ? t("收起", "Close") : t("详情", "Details")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {t(service.description.zh, service.description.en)}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedStep === index ? "auto" : 0,
                      opacity: expandedStep === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <ul className="space-y-2 mt-4 pt-4 border-t border-[#CCFF00]/20">
                      {service.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#CCFF00]" />
                          <span>{t(detail.zh, detail.en)}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {!showAllSteps && (
          <div className="lg:hidden mb-10 text-center">
            <button
              type="button"
              onClick={() => setShowAllSteps(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-[#CCFF00]/40 px-5 py-3 text-sm text-[#CCFF00] transition-all hover:bg-[#CCFF00] hover:text-black"
            >
              <ArrowDown className="w-4 h-4" />
              {t("查看完整交付流程", "View full delivery flow")}
            </button>
          </div>
        )}

        {/* Final Outcome - You Just Receive */}
        <motion.div
          className="bg-gradient-to-r from-[#CCFF00] to-[#b8e600] text-black rounded-lg p-5 md:p-8 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center">
            <motion.div
              className="hidden md:block text-5xl mb-6"
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
            >
              📦
            </motion.div>

            <div className="grid md:grid-cols-3 gap-3 md:gap-6 max-w-4xl mx-auto">
              <motion.div
                className="bg-black/10 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-black/20"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.15)" }}
              >
                <div className="text-4xl mb-3">⏱️</div>
                <div className="mb-2">{t("节省时间", "Save Time")}</div>
                <div className="text-sm text-black/60">
                  {t("无需自己对接供应商", "No need to contact suppliers")}
                </div>
              </motion.div>

              <motion.div
                className="bg-black/10 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-black/20"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.15)" }}
              >
                <div className="text-4xl mb-3">💰</div>
                <div className="mb-2">{t("节省成本", "Save Money")}</div>
                <div className="text-sm text-black/60">
                  {t("平均节省30-50%采购成本", "Average 30-50% cost savings")}
                </div>
              </motion.div>

              <motion.div
                className="bg-black/10 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-black/20"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.15)" }}
              >
                <div className="text-4xl mb-3">😌</div>
                <div className="mb-2">{t("省心省力", "Peace of Mind")}</div>
                <div className="text-sm text-black/60">
                  {t("专业团队全程把控", "Expert team manages everything")}
                </div>
              </motion.div>
            </div>

            <motion.div
              className="mt-6 md:mt-8 inline-flex items-center justify-center gap-3 bg-black text-[#CCFF00] px-5 md:px-8 py-3 md:py-4 rounded-lg shadow-lg cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              <CheckCircle2 className="w-6 h-6" />
              <span className="font-bold">{t("立即开始您的无忧采购之旅", "Start Your Hassle-Free Procurement Journey")}</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
