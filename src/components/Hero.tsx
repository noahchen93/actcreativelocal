import { Button } from "./ui/button";
import { ArrowRight, Globe, Award, Zap } from "lucide-react";
import { motion } from "motion/react";
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
      className="relative pt-24 pb-20 overflow-hidden bg-black"
    >
      {/* Subtle background — softer than before, doesn't compete with the slideshow */}
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

      <div className="container mx-auto px-4 relative z-10">
        {/* Brand block — kept compact */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
          style={{ marginBottom: "3rem" }}
        >
          <div className="inline-flex items-center gap-5">
            <img
              src={logo}
              alt="ACT Creative — cross-border event fabrication and production partner in Singapore"
              className="h-16 md:h-20 w-auto"
            />
            <div className="text-left">
              <p
                className="text-gray-400"
                style={{
                  fontSize: "0.85rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                {t("艺术化的概念创意表达", "Artful Concept To Creative Expression")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* 2-column layout */}
        <div className="grid lg:grid-cols-12 items-center" style={{ columnGap: "3.5rem", rowGap: "3rem" }}>
          {/* Left column — text */}
          <motion.div
            className="lg:col-span-7 space-y-7"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#1a1a1a]/90 backdrop-blur-xl rounded-full border border-[#CCFF00]/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse" />
              <Globe className="w-4 h-4 text-[#CCFF00]" />
              <span className="text-white text-sm">
                {t("连接中国制造与新加坡市场", "Connecting China Manufacturing with Singapore Market")}
              </span>
            </motion.div>

            <h1
              className="text-[#CCFF00] tracking-tight"
              style={{
                fontSize: "clamp(2.25rem, 4.6vw, 4rem)",
                lineHeight: 1.1,
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              {t("让灵感，找到最艺术的形态", "Where inspiration finds its most artful form")}
            </h1>

            <p
              className="text-gray-300"
              style={{
                fontSize: "clamp(1rem, 1.2vw, 1.125rem)",
                lineHeight: 1.65,
                maxWidth: "560px",
              }}
            >
              {t(
                "立足新加坡，连接中国供应链。我们陪伴活动机构、品牌团队与艺术项目，将创意从概念落地为可交付的实物制作。",
                "Singapore-based, China-connected. We help event agencies, brand teams and art projects turn concepts into delivered physical work."
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                size="lg"
                onClick={() => scrollToSection("contact")}
                className="group bg-[#CCFF00] hover:bg-[#b8e600] text-black shadow-2xl hover:shadow-[#CCFF00]/50 transition-all text-base px-7 py-6 h-auto"
              >
                <Zap className="w-5 h-5 mr-2" />
                {t("立即获取方案", "Get Solution Now")}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("cases")}
                className="border-2 border-[#CCFF00] text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black backdrop-blur-xl text-base px-7 py-6 h-auto bg-transparent transition-all"
              >
                <Award className="w-5 h-5 mr-2" />
                {t("探索案例", "Explore Cases")}
              </Button>
            </div>
          </motion.div>

          {/* Right column — auto-rotating slideshow */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
          >
            <HeroSlideshow />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
