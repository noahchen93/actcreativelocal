import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import bigWorldImage1 from "figma:asset/50a15c0d86a008b03137d5f66091522ea2e22af0.png";
import wingsArtImage1 from "figma:asset/ce1fae3f9d7c9c86cee5a57f78785bd01887f88b.png";
import pacmanImage from "figma:asset/b24cf62a1dacab87d8adfc51e494355881e2ebd8.png";
import hofmanImage from "figma:asset/26e483ed6154d773d2210e3142c24d5a30471e92.png";
import craigKarlImage from "figma:asset/f8ae069f17a75c4bb35568fc55aa9c42b28b80e6.png";
import k11Image from "figma:asset/9d25bfe44e81512703910c57ed786148c93dcb9b.png";

export function CaseStudies() {
  const { t } = useLanguage();

  const singaporeProjects = [
    {
      title: t("A BIG BIG WORLD", "A BIG BIG WORLD"),
      subtitle: t("圣淘沙跨年灯光秀", "Sentosa New Year Light Show"),
      image: bigWorldImage1,
      client: t("圣淘沙发展局", "Sentosa Development Corporation"),
      participants: "10,000+",
      highlights: [
        t("超过万名参与者", "Tens of thousands of visitors engaged"),
        t("新加坡最大浮动气球舞台制作之一", "One of Singapore's largest floating balloon stage productions")
      ]
    },
    {
      title: t("WINGS OF ART", "WINGS OF ART"),
      subtitle: t("芭比主题慈善艺术展", "Barbie Charity Art Exhibition"),
      image: wingsArtImage1,
      client: t("Peace of Art SG", "Peace of Art SG"),
      fundsRaised: "S$161,621.77",
      fundsLabel: t("为困境儿童筹款", "Raised For Children in Need"),
      highlights: [
        t("新加坡最长的芭比时装秀", "Singapore's Longest Barbie Runway")
      ]
    },
    {
      title: t("PACMAN & FRIENDS", "PACMAN & FRIENDS"),
      subtitle: t("圣淘沙主题活动", "Sentosa Theme Event"),
      image: pacmanImage,
      client: t("Apex Infinite Entertainment Global", "Apex Infinite Entertainment Global"),
      record: t("最大规模真人吃豆人游戏", "Largest Human PAC-MAN Game"),
      recordBy: t("新加坡纪录大全认证", "Recorded by Singapore Book of Records"),
      highlights: [
        t("高观众参与度与完美技术表现", "High audience engagement and flawless technical performance at Sentosa")
      ]
    }
  ];

  const chinaProjects = [
    {
      title: t("FLORENTIJN HOFMAN", "FLORENTIJN HOFMAN"),
      subtitle: t("个人博物馆展览", "SOLO MUSEUM SHOW"),
      image: hofmanImage,
      client: t("上海，中国", "Shanghai, China"),
      achievement: t("首次", "First"),
      achievementDesc: t("在中国的个人巡回展览", "solo touring exhibition in China"),
      highlights: [
        t("高观众参与度并达成营收目标", "High visitor engagement and met revenue targets")
      ]
    },
    {
      title: t("CRAIG & KARL", "CRAIG & KARL"),
      subtitle: t("个人博物馆展览", "SOLO MUSEUM SHOW"),
      image: craigKarlImage,
      client: t("北京，中国", "Beijing, China"),
      achievement: t("首次", "First"),
      achievementDesc: t("在中国的个人巡回展览", "solo touring exhibition in China"),
      highlights: [
        t("从概念到安装的端到端交付", "End-to-end delivery from concept to installation")
      ]
    },
    {
      title: t("K11 SHENYANG", "K11 SHENYANG"),
      subtitle: t("艺术作品收藏", "ARTWORKS COLLECTION"),
      image: k11Image,
      client: t("沈阳，中国", "Shenyang, China"),
      achievement: "30+",
      achievementDesc: t("大型公共艺术作品", "large-scale public artworks"),
      highlights: [
        t("精确安装满足严格的艺术标准", "Precise installation meeting exacting artistic standards")
      ]
    }
  ];

  return (
    <section id="cases" className="py-20 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(204,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Glowing accents */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#CCFF00] rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#CCFF00] rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Singapore Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl text-white mb-4 tracking-wide">
              {t("新加坡精选项目", "SELECTED PROJECTS IN SINGAPORE")}
            </h2>
            <div className="w-32 h-1 bg-[#CCFF00] mx-auto"></div>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {singaporeProjects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group relative"
              >
                {/* Card background glow */}
                <div className="absolute inset-0 bg-[#CCFF00] rounded-lg blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                
                {/* Card content */}
                <div className="relative bg-[#1a1a1a] border border-[#CCFF00]/20 rounded-lg overflow-hidden transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl cursor-pointer">
                  {/* Project Image */}
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Project Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl text-white mb-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {project.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Project Details (only for A BIG BIG WORLD) */}
                  {project.client && (
                    <div className="p-6 bg-[#0a0a0a] border-t border-[#CCFF00]/10">
                      {/* Client */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">
                          {t("客户", "Client")}
                        </p>
                        <p className="text-sm text-[#CCFF00]">
                          {project.client}
                        </p>
                      </div>

                      {/* Impact Stats - Unified format for all Singapore projects */}
                      <div className="mb-4 border-l-4 border-[#CCFF00] pl-4 py-2 min-h-[80px] flex flex-col justify-center">
                        {project.fundsRaised ? (
                          <>
                            <div className="mb-1">
                              <span className="text-2xl text-[#CCFF00] break-words">{project.fundsRaised}</span>
                            </div>
                            <p className="text-xs text-gray-400">{project.fundsLabel}</p>
                          </>
                        ) : project.record ? (
                          <>
                            <div className="mb-1">
                              <span className="text-base text-[#CCFF00] leading-snug">{project.record}</span>
                            </div>
                            <p className="text-xs text-gray-400">{project.recordBy}</p>
                          </>
                        ) : project.achievement ? (
                          <>
                            <div className="mb-1">
                              <span className="text-2xl text-[#CCFF00]">{project.achievement}</span>
                              <span className="text-sm text-white ml-2">{project.achievementDesc}</span>
                            </div>
                          </>
                        ) : project.participants ? (
                          <>
                            <div className="mb-1">
                              <span className="text-2xl text-[#CCFF00]">{project.participants}</span>
                              <span className="text-sm text-gray-400 ml-2">{t("参与者", "participants")}</span>
                            </div>
                          </>
                        ) : null}
                      </div>

                      {/* Highlights - Fixed height container */}
                      <div className="space-y-2 min-h-[60px]">
                        {project.highlights?.map((highlight, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-[#CCFF00] rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                              {highlight}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* China Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl text-white mb-4 tracking-wide">
              {t("中国精选项目", "SELECTED PROJECTS IN CHINA")}
            </h2>
            <div className="w-32 h-1 bg-[#CCFF00] mx-auto"></div>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {chinaProjects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group relative"
              >
                {/* Card background glow */}
                <div className="absolute inset-0 bg-[#CCFF00] rounded-lg blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                
                {/* Card content */}
                <div className="relative bg-[#1a1a1a] border border-[#CCFF00]/20 rounded-lg overflow-hidden transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl cursor-pointer">
                  {/* Project Image */}
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Project Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl text-white mb-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {project.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Project Details (only for A BIG BIG WORLD) */}
                  {project.client && (
                    <div className="p-6 bg-[#0a0a0a] border-t border-[#CCFF00]/10">
                      {/* Client */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">
                          {t("客户", "Client")}
                        </p>
                        <p className="text-sm text-[#CCFF00]">
                          {project.client}
                        </p>
                      </div>

                      {/* Impact Stats - Unified format for all China projects */}
                      <div className="mb-4 border-l-4 border-[#CCFF00] pl-4 py-2 min-h-[80px] flex flex-col justify-center">
                        {project.fundsRaised ? (
                          <>
                            <div className="mb-1">
                              <span className="text-2xl text-[#CCFF00] break-words">{project.fundsRaised}</span>
                            </div>
                            <p className="text-xs text-gray-400">{project.fundsLabel}</p>
                          </>
                        ) : project.record ? (
                          <>
                            <div className="mb-1">
                              <span className="text-base text-[#CCFF00] leading-snug">{project.record}</span>
                            </div>
                            <p className="text-xs text-gray-400">{project.recordBy}</p>
                          </>
                        ) : project.achievement ? (
                          <>
                            <div className="mb-1">
                              <span className="text-2xl text-[#CCFF00]">{project.achievement}</span>
                              <span className="text-sm text-white ml-2">{project.achievementDesc}</span>
                            </div>
                          </>
                        ) : project.participants ? (
                          <>
                            <div className="mb-1">
                              <span className="text-2xl text-[#CCFF00]">{project.participants}</span>
                              <span className="text-sm text-gray-400 ml-2">{t("参与者", "participants")}</span>
                            </div>
                          </>
                        ) : null}
                      </div>

                      {/* Highlights - Fixed height container */}
                      <div className="space-y-2 min-h-[60px]">
                        {project.highlights?.map((highlight, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-[#CCFF00] rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                              {highlight}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}