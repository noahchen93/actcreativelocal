import { Button } from "./ui/button";
import { ArrowRight, Award, Facebook, Instagram, Zap } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { HeroSlideshow } from "./HeroSlideshow";
import { scrollToSection } from "../lib/scrollToSection";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-black"
      style={{ paddingTop: "6.5rem", paddingBottom: "4rem" }}
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
            grid-template-columns: minmax(0, 1.15fr) minmax(420px, 46vw);
            gap: clamp(3.5rem, 4.2vw, 5.5rem);
          }
        }
        @media (min-width: 1536px) {
          .hero-grid {
            grid-template-columns: minmax(0, 1fr) minmax(560px, 760px);
            gap: clamp(4.5rem, 5.4vw, 6.5rem);
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
          max-width: clamp(560px, 42vw, 760px);
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
          gap: 1.25rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(204,255,0,0.12);
        }
        .hero-stat-num {
          color: #CCFF00;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          line-height: 1;
          margin-bottom: 0.35rem;
        }
        .hero-stat-label {
          color: rgba(255,255,255,0.5);
          font-size: 0.7rem;
          letter-spacing: 0.04em;
          line-height: 1.4;
        }
        .hero-social-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 2rem;
        }
        .hero-social-label {
          flex-basis: 100%;
          color: rgba(255,255,255,0.48);
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .hero-social-link {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          min-height: 36px;
          padding: 0 0.85rem;
          border: 1px solid rgba(204,255,0,0.3);
          border-radius: 999px;
          color: rgba(255,255,255,0.82);
          background: rgba(26,26,26,0.58);
          font-size: 0.84rem;
          font-weight: 650;
          transition: border-color 180ms ease, color 180ms ease, background 180ms ease;
        }
        .hero-social-link:hover,
        .hero-social-link:focus-visible {
          border-color: rgba(204,255,0,0.7);
          color: #CCFF00;
          background: rgba(204,255,0,0.08);
          outline: none;
        }
        @media (max-width: 639px) {
          .hero-social-link {
            min-width: calc(50% - 0.4rem);
          }
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
        style={{ maxWidth: "min(92vw, 1760px)" }}
      >
        <div className="hero-grid">
          {/* Left: text */}
          <div className="hero-text">
            {/* Eyebrow with accent line */}
            <div
              className="hero-eyebrow"
              style={{ marginBottom: "1.25rem" }}
            >
              {t("创意制作 · 艺术呈现", "Creative Production · Artful Execution")}
            </div>

            {/* H1 */}
            <h1
              className="text-white"
              style={{
                fontSize: "clamp(2rem, 3.6vw, 3.125rem)",
                lineHeight: 1.1,
                fontWeight: 700,
                letterSpacing: "-0.025em",
                marginBottom: "1.5rem",
              }}
            >
              <span style={{ color: "#CCFF00" }}>
                {t("让灵感，", "Where inspiration finds")}
              </span>
              <br />
              {t(
                "找到最艺术的形态",
                "its most artful form",
              )}
            </h1>

            {/* Description */}
            <p
              className="text-gray-300"
              style={{
                fontSize: "clamp(0.95rem, 1.05vw, 1.0625rem)",
                lineHeight: 1.65,
                maxWidth: "520px",
                marginBottom: "1.75rem",
              }}
            >
              {t(
                "立足新加坡的创意制作伙伴。为活动机构、品牌团队与艺术项目交付定制道具、展陈装置、活动搭建与跨境生产支持。",
                "Singapore-based creative production partner for event agencies and brand teams, covering custom props, installations, event buildouts and China-side production support.",
              )}
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-3"
              style={{ marginBottom: "1rem" }}
            >
              <Button
                size="lg"
                onClick={() => scrollToSection("contact")}
                className="group bg-[#CCFF00] hover:bg-[#b8e600] text-black shadow-2xl hover:shadow-[#CCFF00]/40 transition-all text-base h-auto"
                style={{ paddingInline: "1.75rem", paddingBlock: "0.95rem" }}
              >
                <Zap className="w-4 h-4 mr-2" />
                {t("发送项目需求", "Send a Brief")}
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
                {t("查看案例", "View Work")}
              </Button>
            </div>

            <div className="hero-social-row" aria-label="Follow ACT Creative">
              <span className="hero-social-label">
                {t("关注 ACT Creative 新加坡项目动态", "Follow ACT Creative Singapore builds")}
              </span>
              <a
                href="https://www.instagram.com/act_creative_official/"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-link"
                aria-label="Follow ACT Creative Singapore on Instagram"
              >
                <Instagram className="w-4 h-4" />
                ACT Creative SG Instagram
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61590057715328"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-link"
                aria-label="Follow ACT Creative Singapore on Facebook"
              >
                <Facebook className="w-4 h-4" />
                ACT Creative SG Facebook
              </a>
            </div>

            {/* Workflow stats */}
            <div className="hero-stats">
              <div>
                <div className="hero-stat-num">{t("构思", "IDEA")}</div>
                <div className="hero-stat-label">
                  {t("概念与创意方向", "Concept & creative direction")}
                </div>
              </div>
              <div>
                <div className="hero-stat-num">{t("制作", "BUILD")}</div>
                <div className="hero-stat-label">
                  {t("定制制作与生产", "Custom fabrication & production")}
                </div>
              </div>
              <div>
                <div className="hero-stat-num">{t("落地", "LIVE")}</div>
                <div className="hero-stat-label">
                  {t("现场协调与呈现", "On-site coordination & delivery")}
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
