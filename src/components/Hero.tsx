import { Button } from "./ui/button";
import { ArrowRight, Globe, Award, Zap } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import logo from "figma:asset/9f81ed77f1d1b1fce6de57ec26fc06cd89a9a112.png";
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
      style={{ paddingTop: "6rem", paddingBottom: "5rem" }}
    >
      {/* Hero-scoped CSS — bypasses Tailwind JIT issues with lg: utilities */}
      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
        }
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: minmax(0, 1.35fr) minmax(320px, 460px);
            gap: 4rem;
          }
        }
        .hero-text { min-width: 0; }
        .hero-slideshow-wrap {
          width: 100%;
          max-width: 460px;
          margin: 0 auto;
        }
        @media (min-width: 1024px) {
          .hero-slideshow-wrap { margin: 0; }
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
        {/* Brand strip — compact, single line */}
        <div
          className="flex items-center gap-4"
          style={{ marginBottom: "2.5rem" }}
        >
          <img
            src={logo}
            alt="ACT Creative — cross-border event fabrication and production partner in Singapore"
            className="w-auto"
            style={{ height: "44px" }}
          />
          <div
            style={{
              height: "1px",
              flex: 1,
              maxWidth: "120px",
              background:
                "linear-gradient(to right, rgba(204,255,0,0.4), transparent)",
            }}
          />
          <p
            className="text-gray-500"
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {t("艺术化的概念创意表达", "Artful Concept · Creative Expression")}
          </p>
        </div>

        {/* 2-column grid */}
        <div className="hero-grid">
          {/* Left: text */}
          <div className="hero-text">
            <div
              className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#1a1a1a]/90 backdrop-blur-xl rounded-full border border-[#CCFF00]/30"
              style={{ marginBottom: "1.75rem" }}
            >
              <div className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse" />
              <Globe className="w-4 h-4 text-[#CCFF00]" />
              <span className="text-white text-sm">
                {t(
                  "连接中国制造与新加坡市场",
                  "China Manufacturing × Singapore Market",
                )}
              </span>
            </div>

            <h1
              className="text-[#CCFF00]"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                lineHeight: 1.1,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "1.5rem",
              }}
            >
              {t(
                "让灵感，找到最艺术的形态",
                "Where inspiration finds its most artful form",
              )}
            </h1>

            <p
              className="text-gray-300"
              style={{
                fontSize: "clamp(0.95rem, 1.1vw, 1.0625rem)",
                lineHeight: 1.65,
                maxWidth: "520px",
                marginBottom: "2rem",
              }}
            >
              {t(
                "立足新加坡，连接中国供应链。我们陪伴活动机构、品牌团队与艺术项目，将创意从概念落地为可交付的实物制作。",
                "Singapore-based, China-connected. We help event agencies, brand teams and art projects turn concepts into delivered physical work.",
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
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
