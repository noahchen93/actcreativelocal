import { Card, CardContent } from "./ui/card";
import { Package, Truck, DollarSign, ShieldCheck, Scale, MessageSquare, Mail, ArrowRight, ArrowDown, Settings, Headphones, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import { PROJECT_INQUIRY_MAILTO } from "../lib/contactLinks";

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
      { zh: "比较不同供应与制作路线", en: "Compare sourcing and production routes" },
      { zh: "对接合适的专业供应商", en: "Match suitable specialist suppliers" },
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
    title: { zh: "许可与本地合规", en: "Permits & Local Compliance" },
    emoji: "🛠️",
    description: { 
      zh: "持续的维护和技术支持",
      en: "Coordinate local requirements"
    },
    details: [
      { zh: "场地方与主办方资料提交", en: "Venue and organiser submissions" },
      { zh: "许可证与合规协调", en: "Permit and compliance coordination" },
      { zh: "现场交付与问题响应", en: "Site handover and issue response" }
    ],
    gradient: "from-[#CCFF00] to-[#b8e600]"
  }
];

const desktopFlowLayout = [
  { column: 1, row: 1, arrow: "right" },
  { column: 2, row: 1, arrow: "right" },
  { column: 3, row: 1, arrow: "right" },
  { column: 4, row: 1, arrow: "down" },
  { column: 4, row: 2, arrow: "left" },
  { column: 3, row: 2, arrow: "left" },
  { column: 2, row: 2, arrow: "left" },
  { column: 1, row: 2, arrow: null },
] as const;

export function Services() {
  const { t } = useLanguage();

  return (
    <section id="services" className="py-14 md:py-20 bg-black relative overflow-hidden">
      <style>{`
        .service-flow-shell {
          max-width: 1180px;
          margin: 0 auto 4rem;
          padding: clamp(1.1rem, 2.4vw, 2rem);
          border: 1px solid rgba(204, 255, 0, 0.14);
          border-radius: 8px;
          background:
            linear-gradient(135deg, rgba(204, 255, 0, 0.08), rgba(204, 255, 0, 0) 34%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.01));
        }
        .service-flow-map {
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(4rem, 5vw, 5.25rem) clamp(3.75rem, 4.4vw, 5rem);
          position: relative;
        }
        .service-flow-node {
          position: relative;
          min-width: 0;
        }
        .service-flow-card {
          height: 100%;
          min-height: 254px;
          border-radius: 8px;
          border-color: rgba(204, 255, 0, 0.22);
          background: rgba(18, 18, 18, 0.92);
          box-shadow: 0 20px 55px -46px rgba(204, 255, 0, 0.7);
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
        }
        .service-flow-card:hover {
          transform: translateY(-3px);
          border-color: rgba(204, 255, 0, 0.62);
          background: rgba(24, 24, 24, 0.96);
        }
        .service-flow-card-content {
          display: flex;
          height: 100%;
          flex-direction: column;
          padding: 1.25rem !important;
        }
        .service-flow-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .service-flow-step {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          color: #ccff00;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .service-flow-step-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 999px;
          background: #ccff00;
          color: #000;
          font-size: 0.82rem;
          letter-spacing: 0;
        }
        .service-flow-icon {
          display: inline-flex;
          width: 2.75rem;
          height: 2.75rem;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: rgba(204, 255, 0, 0.1);
          color: #ccff00;
          border: 1px solid rgba(204, 255, 0, 0.22);
        }
        .service-flow-card h3 {
          margin-bottom: 0.55rem;
          color: #fff;
          font-size: 1.08rem;
          line-height: 1.22;
        }
        .service-flow-card p {
          color: rgba(255, 255, 255, 0.62);
          font-size: 0.9rem;
          line-height: 1.52;
        }
        .service-flow-list {
          display: grid;
          gap: 0.55rem;
          margin-top: 1rem;
          padding-top: 1rem;
          color: rgba(255, 255, 255, 0.62);
          font-size: 0.8rem;
          line-height: 1.4;
        }
        .service-flow-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
        }
        .service-flow-arrow {
          position: absolute;
          z-index: 5;
          display: inline-flex;
          width: 2.6rem;
          height: 2.6rem;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          border: 1px solid rgba(204, 255, 0, 0.55);
          background: #ccff00;
          color: #000;
          box-shadow: 0 0 0 8px rgba(204, 255, 0, 0.055), 0 12px 28px -18px rgba(204, 255, 0, 0.9);
        }
        .service-flow-arrow::before {
          content: "";
          position: absolute;
          z-index: -1;
          background: linear-gradient(90deg, rgba(204, 255, 0, 0.32), rgba(204, 255, 0, 0.06));
        }
        .service-flow-arrow--right {
          right: calc(clamp(3.75rem, 4.4vw, 5rem) / -2);
          top: 50%;
          transform: translate(50%, -50%);
        }
        .service-flow-arrow--right::before {
          width: clamp(2.5rem, 3vw, 3.5rem);
          height: 1px;
          left: -2.25rem;
          top: 50%;
        }
        .service-flow-arrow--left {
          left: calc(clamp(3.75rem, 4.4vw, 5rem) / -2);
          top: 50%;
          transform: translate(-50%, -50%);
        }
        .service-flow-arrow--left svg {
          transform: rotate(180deg);
        }
        .service-flow-arrow--left::before {
          width: clamp(2.5rem, 3vw, 3.5rem);
          height: 1px;
          right: -2.25rem;
          top: 50%;
        }
        .service-flow-arrow--down {
          left: 50%;
          bottom: calc(clamp(4rem, 5vw, 5.25rem) / -2);
          transform: translate(-50%, 50%);
        }
        .service-flow-arrow--down::before {
          width: 1px;
          height: clamp(2.6rem, 3.2vw, 3.8rem);
          left: 50%;
          top: -2.4rem;
          background: linear-gradient(180deg, rgba(204, 255, 0, 0.32), rgba(204, 255, 0, 0.06));
        }
        .service-flow-mobile {
          gap: 0;
          max-width: 680px;
          margin: 0 auto 3rem;
        }
        .service-flow-mobile-node {
          position: relative;
          display: flow-root;
          padding-bottom: 4.7rem;
        }
        .service-flow-mobile-node:last-child {
          padding-bottom: 0;
        }
        .service-flow-mobile-node + .service-flow-mobile-node {
          margin-top: 0;
        }
        .service-flow-mobile-arrow {
          position: absolute;
          left: 50%;
          bottom: 1.15rem;
          transform: translateX(-50%);
          display: flex;
          width: 2.25rem;
          height: 2.25rem;
          align-items: center;
          justify-content: center;
          margin: 0;
          border-radius: 999px;
          background: #ccff00;
          color: #000;
          box-shadow: 0 0 0 7px rgba(204, 255, 0, 0.06);
        }
        .service-outcome-grid {
          margin-bottom: clamp(1.75rem, 2.4vw, 2.25rem);
        }
        .service-outcome-card {
          min-height: 150px;
          padding: 1.25rem !important;
        }
        .service-outcome-cta {
          display: inline-flex;
          width: fit-content;
          max-width: min(100%, 32rem);
          margin: 0 auto;
          text-align: center;
        }
        .service-outcome-cta-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
        }
        .service-outcome-cta-text {
          line-height: 1.25;
        }
        @media (min-width: 1024px) {
          .service-flow-map {
            display: grid !important;
          }
          .service-flow-mobile {
            display: none !important;
          }
        }
        @media (max-width: 1023px) {
          .service-flow-map {
            display: none !important;
          }
          .service-flow-mobile {
            display: grid !important;
          }
          .service-flow-shell {
            margin-bottom: 3rem;
            padding: 0;
            border: 0;
            background: transparent;
          }
          .service-flow-card {
            min-height: auto;
          }
          .service-flow-card-content {
            padding: 1.15rem !important;
          }
          .service-flow-list {
            margin-top: 0;
          }
        }
        @media (min-width: 768px) {
          .service-outcome-card {
            padding: 1.5rem !important;
          }
          .service-outcome-cta-icon {
            width: 1.5rem;
            height: 1.5rem;
          }
        }
        @media (max-width: 767px) {
          .service-outcome-grid {
            margin-bottom: 2.25rem;
          }
          .service-outcome-card {
            min-height: auto;
          }
          .service-outcome-cta {
            width: 100%;
          }
        }
      `}</style>
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
            {t("一条龙服务流程", "End-to-End Service Flow")}
          </div>
          <h2 className="text-3xl md:text-4xl text-white mb-4">
            {t("一个需求，一套整合交付方案", "One Brief, One Coordinated Delivery")}
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            {t(
              "从咨询到维护，8个环节无缝衔接，让跨境采购变得像网购一样简单。",
              "From supplier comparison to production, customs, local installation and compliance, we coordinate the service chain around one project brief."
            )}
          </p>
        </motion.div>

        <div className="service-flow-shell">
          {/* Desktop Flow */}
          <div className="service-flow-map hidden lg:grid" aria-label={t("一条龙服务流程", "End-to-end service flow")}>
            {serviceFlowData.map((service, index) => {
              const position = desktopFlowLayout[index];
              const arrowClass = position.arrow ? `service-flow-arrow service-flow-arrow--${position.arrow}` : "";

              return (
                <motion.div
                  key={service.step}
                  className="service-flow-node"
                  style={{ gridColumn: position.column, gridRow: position.row }}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.38, delay: index * 0.06 }}
                >
                  <Card className="service-flow-card">
                    <CardContent className="service-flow-card-content">
                      <div className="service-flow-top">
                        <div className="service-flow-step">
                          <span className="service-flow-step-number">{String(service.step).padStart(2, "0")}</span>
                          <span>{t("步骤", "Step")}</span>
                        </div>
                        <div className="service-flow-icon">
                          <service.icon className="w-5 h-5" />
                        </div>
                      </div>

                      <h3>{t(service.title.zh, service.title.en)}</h3>
                      <p>{t(service.description.zh, service.description.en)}</p>

                      <ul className="service-flow-list">
                        {service.details.map((detail, detailIndex) => (
                          <li key={detailIndex}>
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#CCFF00]" />
                            <span>{t(detail.zh, detail.en)}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {position.arrow && (
                    <div className={arrowClass} aria-hidden="true">
                      {position.arrow === "down" ? (
                        <ArrowDown className="h-5 w-5" />
                      ) : (
                        <ArrowRight className="h-5 w-5" />
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Mobile & Tablet Flow */}
          <div className="service-flow-mobile lg:hidden" aria-label={t("一条龙服务流程", "End-to-end service flow")}>
            {serviceFlowData.map((service, index) => (
              <motion.div
                key={service.step}
                className="service-flow-mobile-node"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.34, delay: index * 0.04 }}
              >
                <Card className="service-flow-card">
                  <CardContent className="service-flow-card-content">
                    <div className="service-flow-top">
                      <div className="service-flow-step">
                        <span className="service-flow-step-number">{String(service.step).padStart(2, "0")}</span>
                        <span>{t("步骤", "Step")}</span>
                      </div>
                      <div className="service-flow-icon">
                        <service.icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3>{t(service.title.zh, service.title.en)}</h3>
                    <p>{t(service.description.zh, service.description.en)}</p>

                    <ul className="service-flow-list">
                      {service.details.map((detail, detailIndex) => (
                        <li key={detailIndex}>
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#CCFF00]" />
                          <span>{t(detail.zh, detail.en)}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {index < serviceFlowData.length - 1 && (
                  <div className="service-flow-mobile-arrow" aria-hidden="true">
                    <ArrowDown className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

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

            <div className="service-outcome-grid grid md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
              <motion.div
                className="service-outcome-card bg-black/10 backdrop-blur-sm rounded-lg border border-black/20"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.15)" }}
              >
                <div className="text-4xl mb-3">⏱️</div>
                <div className="mb-2">{t("节省时间", "Save Time")}</div>
                <div className="text-sm text-black/60">
                  {t("无需自己对接供应商", "No need to contact suppliers")}
                </div>
              </motion.div>

              <motion.div
                className="service-outcome-card bg-black/10 backdrop-blur-sm rounded-lg border border-black/20"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.15)" }}
              >
                <div className="text-4xl mb-3">💰</div>
                <div className="mb-2">{t("节省成本", "Save Money")}</div>
                <div className="text-sm text-black/60">
                  {t("多方案比价与成本优化", "Competitive options through comparison")}
                </div>
              </motion.div>

              <motion.div
                className="service-outcome-card bg-black/10 backdrop-blur-sm rounded-lg border border-black/20"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.15)" }}
              >
                <div className="text-4xl mb-3">😌</div>
                <div className="mb-2">{t("省心省力", "Peace of Mind")}</div>
                <div className="text-sm text-black/60">
                  {t("专业团队全程把控", "Expert team manages everything")}
                </div>
              </motion.div>
            </div>

            <motion.a
              href={PROJECT_INQUIRY_MAILTO}
              className="service-outcome-cta items-center justify-center gap-3 bg-black text-[#CCFF00] px-5 md:px-8 py-3 md:py-4 rounded-lg shadow-lg cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail className="service-outcome-cta-icon" />
              <span className="service-outcome-cta-text font-bold">{t("邮件提交需求，开始整合方案", "Email a Brief for an Integrated Solution")}</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
