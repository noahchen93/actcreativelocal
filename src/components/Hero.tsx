import { Button } from "./ui/button";
import { ArrowRight, Globe, Star, Award, TrendingUp, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import logo from "figma:asset/9f81ed77f1d1b1fce6de57ec26fc06cd89a9a112.png";

export function Hero() {
  const { t } = useLanguage();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative pt-24 pb-16 flex items-center overflow-hidden bg-black">
      {/* Premium Animated Background */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs with neon green */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#CCFF00] rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#CCFF00] rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#CCFF00] rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(204,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.03)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      {/* Decorative floating elements */}
      <motion.div 
        className="absolute top-1/4 right-20 text-[#CCFF00] opacity-20"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Star className="w-16 h-16" fill="currentColor" />
      </motion.div>
      <motion.div 
        className="absolute bottom-1/3 left-20 text-[#CCFF00] opacity-20"
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -360],
          scale: [1, 1.3, 1]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Zap className="w-20 h-20" />
      </motion.div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Company Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-6">
            {/* Logo */}
            <motion.img 
              src={logo} 
              alt="ACT Creative — cross-border event fabrication and production partner in Singapore"
              className="h-20 md:h-28 w-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            
            {/* Company Name */}
            <div className="text-left">
              <motion.h1 
                className="text-4xl md:text-6xl text-[#CCFF00] tracking-widest mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                {t("及物创意", "ACT CREATIVE")}
              </motion.h1>
              <motion.div 
                className="h-1 bg-gradient-to-r from-[#CCFF00] to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              ></motion.div>
              <motion.p 
                className="text-sm md:text-base text-gray-400 tracking-wider mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                {t("Artful Concept To Creative Expression", "Artful Concept To Creative Expression")}
              </motion.p>
            </div>
          </div>
        </motion.div>

        <div className="max-w-5xl mx-auto" style={{ marginTop: "3.5rem" }}>
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          >
            {/* Premium Badge */}
            <motion.div 
              className="inline-flex items-center gap-3 px-6 py-3 bg-[#1a1a1a] backdrop-blur-xl rounded-full border border-[#CCFF00]/30 shadow-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.05, borderColor: "rgba(204, 255, 0, 0.5)" }}
            >
              <div className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse"></div>
              <Globe className="w-5 h-5 text-[#CCFF00]" />
              <span className="text-white">{t("连接中国制造与新加坡市场", "Connecting China Manufacturing with Singapore Market")}</span>
            </motion.div>
            
            <div className="space-y-6">
              <motion.h3 
                className="text-white leading-[1.1] tracking-tight"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <span className="block text-[#CCFF00] relative">
                  {t("让灵感，找到最艺术的形态", "where inspiration finds its most artful form")}
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-[#CCFF00]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </span>
              </motion.h3>
              
              <motion.p 
                className="text-gray-300 text-xl leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                {t(
                  "在及物创意，我们坚信每一个富有远见的创意都值得以艺术的态度绽放。我们陪伴大胆的概念从初生灵感到完美呈现——无论是定制高端活动与艺术装置、创新雕塑及游乐体验，还是策划 IP 合作、展览引进与跨文化交流项目。",
                  "At ACT Creative, we believe every visionary idea deserves to be brought to life with artistry and imagination. We guide bold concepts from their earliest spark to extraordinary creative expressions — whether through bespoke events and art installations, innovative sculptures and amusement experiences, or curated IP collaborations, exhibitions, and cross-cultural exchanges."
                )}
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              <Button 
                size="lg" 
                onClick={() => scrollToSection("contact")} 
                className="group bg-[#CCFF00] hover:bg-[#b8e600] text-black shadow-2xl hover:shadow-[#CCFF00]/50 transition-all text-lg px-8 py-6 h-auto"
              >
                <Zap className="w-5 h-5 mr-2" />
                {t("立即获取方案", "Get Solution Now")}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => scrollToSection("cases")}
                className="border-2 border-[#CCFF00] text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black backdrop-blur-xl text-lg px-8 py-6 h-auto bg-transparent transition-all"
              >
                <Award className="w-5 h-5 mr-2" />
                {t("探索案例", "Explore Cases")}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}