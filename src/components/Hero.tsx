import { Button } from "./ui/button";
import { ArrowRight, Award, Zap } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { HeroSlideshow } from "./HeroSlideshow";

export function Hero() {
  const { t } = useLanguage();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-black"
      style={{ paddingTop: "7rem", paddingBottom: "5rem" }}
    >
      {/* Hero-scoped CSS */}
      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: stretch;
        }
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: minmax(0, 1.25fr) minmax(360px, 540px);
            gap: 3.5rem;
          }
        }
        .hero-text {
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        .hero-slideshow-wrap {
          width: 100%;
          max-width: 560px;
          margin: 0 auto;
          align-self: stretch;
          display: flex;
        }
        @media (min-width: 1024px) {
          .hero-slideshow-wrap { margin: 0; }
        }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.875rem;
          color: #CCFF00;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        .hero-eyebrow::after {
          content: "";
          display: block;
          width: 56px;
          height: 1px;
          background: linear-gradient(to right, rgba(204,255,0,0.6), transparent);
        }
        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          padding-top: 1.75rem;
          border-top: 1px solid rgba(204,255,0,0.12);
        }
        .hero-stat-num {
          color: #CCFF00;
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1;
          margin-bottom: 0.4rem;
        }
        .hero-stat-label {
          color: rgba(255,255,255,0.55);
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          line-height: 1.4;
        }
      `}</style>

      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-32 -right-40 w-[480px] h-[480px] bg-[#CCFF00] rounded-full filter blur-3xl"
          style={{ opacity: 0.05 }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[480px] h-[480px] bg-[#CCFF00] rounded-full filter blur-3xl"
          style={{ opacity: 0.04 }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(204,255,0,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.025)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      <div
        className="container mx-auto px-4 md:px-6 relative z-10"
        style={{ maxWidth: "1280px" }}
      >
        <div className="hero-grid">
          {/* Left: text */}
          <div className="hero-text">
            {/* Eyebrow with accent line */}
            <div
              className="hero-eyebrow"
              style={{ marginBottom: "1.25rem" }}
            >
              {t("中国制造 × 新加坡市场", "China Manufacturing × Singapore Market")}
            </div>

            {/* H1 */}
            <h1
              className="text-white"
              style={{
                fontSize: "clamp(2.25rem, 4.4vw, 3.75rem)",
                lineHeight: 1.08,
                fontWeight: 700,
                letterSpacing: "-0.025em",
                marginBottom: "1.5rem",
              }}
            >
              <span style={{ color: "#CCFF00" }}>
                {t("让灵感", "Where inspiration")}
              </span>
              <br />
              {t(
                "找到最艺术的形态",
                "finds its most artful form",
              )}
            </h1>

            {/* Description */}
            <p
              className="text-gray-300"
              style={{
                fontSize: "clamp(0.95rem, 1.1vw, 1.0625rem)",
                lineHeight: 1.7,
                maxWidth: "520px",
                marginBottom: "2.25rem",
              }}
            >
              {t(
                "立足新加坡，连接中国供应链。我们陪伴活动机构、品牌团队与艺术项目，把创意从概念落地为可交付的实物制作。",
                "Singapore-based, China-connected production partner for event agencies, brand teams and art projects — turning creative concepts into delivered physical work.",
              )}
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-3"
              style={{ marginBottom: "2.5rem" }}
            >
              <Button
                size="lg"
                onClick={() => scrollToSection("contact")}
                className="group bg-[#CCFF00] hover:bg-[#b8e600] text-black shadow-2xl hover:shadow-[#CCFF00]/40 transition-all text-base h-auto"
                style={{ paddingInline: "1.75rem", paddingBlock: "0.95rem" }}
              >
                <Zap className="w-4 h-4 mr-2" />
                {t("立即获取方案", "Get Solution Now")}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("cases")}
                className="border-2 border-[#CCFF00] text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black backdrop-blur-xl text-base h-auto bg-transparent transition-all"
                style={{ paddingInline: "1.75rem", paddingBlock: "0.95rem" }}
              >
                <Award className="w-4 h-4 mr-2" />
                {t("探索案例", "Explore Cases")}
              </Button>
            </div>

            {/* Trust stats */}
            <div className="hero-stats">
              <div>
                <div className="hero-stat-num">SG</div>
                <div className="hero-stat-label">
                  {t("新加坡本地团队", "Local Singapore team")}
                </div>
              </div>
              <div>
                <div className="hero-stat-num">CN</div>
                <div className="hero-stat-label">
                  {t("中国供应链网络", "China supply network")}
                </div>
              </div>
              <div>
                <div className="hero-stat-num">SEA</div>
                <div className="hero-stat-label">
                  {t("覆盖东南亚 + 港澳", "SEA + HK / Macau delivery")}
                </div>
              </div>
            </div>
          </div>

          {/* Right: slideshow */}
          <div className="hero-slideshow-wrap">
            <HeroSlideshow />
          </div>
        </div>
      </div>
    </section>
  );
}
