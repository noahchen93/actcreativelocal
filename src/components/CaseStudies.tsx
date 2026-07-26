import { motion } from "motion/react";
import { useRef, type RefObject } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import bigWorldImage1 from "figma:asset/50a15c0d86a008b03137d5f66091522ea2e22af0.png";
import wingsArtImage1 from "figma:asset/ce1fae3f9d7c9c86cee5a57f78785bd01887f88b.png";
import pacmanImage from "figma:asset/b24cf62a1dacab87d8adfc51e494355881e2ebd8.png";
// Neutral materials image until a verified Artbox project photo is available.
import artboxMaterialsImage from "figma:asset/1436808f505f19492ee82879766d0c80dc0901a9.png";
import hofmanImage from "figma:asset/26e483ed6154d773d2210e3142c24d5a30471e92.png";
import craigKarlImage from "figma:asset/f8ae069f17a75c4bb35568fc55aa9c42b28b80e6.png";
import k11Image from "figma:asset/9d25bfe44e81512703910c57ed786148c93dcb9b.png";

export function CaseStudies() {
  const { t } = useLanguage();
  const singaporeRailRef = useRef<HTMLDivElement>(null);
  const regionalRailRef = useRef<HTMLDivElement>(null);

  const scrollCaseRail = (
    railRef: RefObject<HTMLDivElement>,
    direction: -1 | 1,
  ) => {
    const rail = railRef.current;
    if (!rail) return;

    const firstCard = rail.querySelector<HTMLElement>(".case-item");
    const styles = window.getComputedStyle(rail);
    const parseSize = (value: string) => {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };
    const gap = parseSize(styles.columnGap) || parseSize(styles.gap);
    const cardStep = firstCard ? firstCard.offsetWidth + gap : rail.clientWidth * 0.86;

    rail.scrollBy({
      left: direction * cardStep,
      behavior: "auto",
    });
  };

  const singaporeProjects = [
    {
      title: t("A BIG BIG WORLD", "A BIG BIG WORLD"),
      subtitle: t("圣淘沙跨年灯光秀", "Sentosa New Year Light Show"),
      image: bigWorldImage1,
      href: "/case-studies/sentosa-big-big-world-event-fabrication/",
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
      href: "/case-studies/wings-of-art-barbie-runway-singapore/",
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
      href: "/case-studies/sentosa-pacman-human-game/",
      client: t("Apex Infinite Entertainment Global", "Apex Infinite Entertainment Global"),
      record: t("最大规模真人吃豆人游戏", "Largest Human PAC-MAN Game"),
      recordBy: t("新加坡纪录大全认证", "Recorded by Singapore Book of Records"),
      highlights: [
        t("高观众参与度与完美技术表现", "High audience engagement and flawless technical performance at Sentosa")
      ]
    },
    {
      title: t("WEEKEND BREW CLUB", "WEEKEND BREW CLUB"),
      subtitle: t("社区定制咖啡杯采购", "Custom Mug Sourcing & Delivery"),
      image: "/case-studies/weekend-brew-club-custom-mugs-singapore/assets/sengkang-custom-mug.webp",
      href: "/case-studies/weekend-brew-club-custom-mugs-singapore/",
      client: "INVade",
      achievement: t("一条龙", "End-to-end"),
      achievementDesc: t("寻厂 · 定制 · 跨境与本地交付", "factory · customization · delivery"),
      highlights: [
        t(
          "中国工厂寻找、沟通与多地点版本制作",
          "China factory sourcing and multi-edition production coordination"
        ),
        t(
          "跨境运输、时间线管理与新加坡本地配送",
          "Freight, timeline management and Singapore local delivery"
        )
      ]
    },
    {
      title: t("ARTBOX SINGAPORE", "ARTBOX SINGAPORE"),
      subtitle: t("活动衍生品与物料支持", "Event Merchandise & Materials Support"),
      image: artboxMaterialsImage,
      href: "/case-studies/artbox-singapore-merchandise-materials/",
      client: t("Artbox Singapore", "Artbox Singapore"),
      achievement: t("一条龙", "End-to-end"),
      achievementDesc: t("采购 · 定制 · 物流", "procurement · customization · logistics"),
      highlights: [
        t(
          "定制衍生品采购、打样与生产",
          "Custom merchandise items sourced, sampled and produced"
        ),
        t(
          "活动物料、包装与物流协调",
          "Coordinated event materials, packaging and shipment"
        )
      ]
    }
  ];

  const chinaProjects = [
    {
      title: t("FLORENTIJN HOFMAN", "FLORENTIJN HOFMAN"),
      subtitle: t("个人博物馆展览", "SOLO MUSEUM SHOW"),
      image: hofmanImage,
      href: "/case-studies/florentijn-hofman-shanghai-museum-show/",
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
      href: "/case-studies/craig-and-karl-beijing-museum-show/",
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
      href: "/case-studies/k11-shenyang-public-art-collection/",
      client: t("沈阳，中国", "Shenyang, China"),
      achievement: "30+",
      achievementDesc: t("大型公共艺术作品", "large-scale public artworks"),
      highlights: [
        t("精确安装满足严格的艺术标准", "Precise installation meeting exacting artistic standards")
      ]
    }
  ];

  return (
    <section id="cases" className="py-14 md:py-20 bg-[#0a0a0a] relative overflow-hidden">
      <style>{`
        .case-study-block {
          position: relative;
        }
        .case-study-block + .case-study-block {
          margin-top: clamp(5rem, 8vw, 7rem);
          padding-top: clamp(4rem, 6vw, 5.5rem);
          border-top: 1px solid rgba(204, 255, 0, 0.14);
        }
        .case-section-heading {
          margin-bottom: clamp(2.25rem, 3.6vw, 3.25rem);
        }
        .case-section-heading h2 {
          max-width: 980px;
        }
        .case-grid {
          display: flex;
          gap: var(--case-rail-gap);
          margin-inline: auto;
        }
        .case-rail-shell {
          --case-card-width: clamp(22rem, 24vw, 24rem);
          --case-rail-gap: clamp(1.5rem, 2vw, 2rem);
          position: relative;
          max-width: min(100%, 1760px);
          margin-inline: auto;
        }
        .case-rail {
          overflow-x: auto;
          overflow-y: visible;
          overscroll-behavior-inline: contain;
          scroll-padding-inline: clamp(1rem, 3vw, 2rem);
          padding: 0.75rem clamp(0.15rem, 0.6vw, 0.5rem) 1.25rem;
          scrollbar-width: none;
        }
        .case-rail::-webkit-scrollbar {
          display: none;
        }
        .case-item {
          flex: 0 0 var(--case-card-width);
          min-width: var(--case-card-width);
        }
        .case-card {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .case-card-detail {
          padding: 1.5rem;
          flex: 1;
        }
        .case-rail-nav {
          display: flex;
          justify-content: center;
          gap: 0.8rem;
          margin-top: 0.75rem;
        }
        .case-rail-arrow {
          width: 2.9rem;
          height: 2.9rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          border: 1px solid rgba(204, 255, 0, 0.36);
          background: rgba(20, 20, 20, 0.88);
          color: #CCFF00;
          box-shadow: 0 14px 34px -24px rgba(204, 255, 0, 0.8);
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
        }
        .case-rail-arrow:hover,
        .case-rail-arrow:focus-visible {
          transform: translateY(-1px);
          border-color: rgba(204, 255, 0, 0.72);
          background: rgba(34, 34, 34, 0.96);
          outline: none;
        }
        @media (min-width: 1536px) {
          .case-rail-shell {
            --case-card-width: clamp(23.5rem, 20vw, 25.5rem);
          }
          .case-rail-nav {
            justify-content: flex-end;
            padding-right: clamp(0.15rem, 0.6vw, 0.5rem);
          }
        }
        @media (min-width: 768px) {
          .case-grid--regional + .case-rail-nav {
            display: none;
          }
        }
        @media (min-width: 1760px) {
          .case-grid--singapore + .case-rail-nav {
            display: none;
          }
        }
        @media (max-width: 767px) {
          .case-study-block + .case-study-block {
            margin-top: 4rem;
            padding-top: 3.25rem;
          }
          .case-rail-shell {
            --case-card-width: min(84vw, 22rem);
            --case-rail-gap: 1rem;
          }
        }
      `}</style>
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
          className="case-study-block"
        >
          {/* Section Header */}
          <div className="case-section-heading text-center">
            <h2 className="text-3xl md:text-4xl text-white mb-4 tracking-wide">
              {t("新加坡精选项目", "SELECTED PROJECTS IN SINGAPORE")}
            </h2>
            <div className="w-32 h-1 bg-[#CCFF00] mx-auto"></div>
          </div>

          {/* Horizontally scrollable Singapore project cards */}
          <div className="case-rail-shell">
          <div
            ref={singaporeRailRef}
            className="case-grid case-rail case-grid--singapore"
            aria-label="Singapore case studies"
          >
            {singaporeProjects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="case-item group relative"
              >
                {/* Card background glow */}
                <div className="absolute inset-0 bg-[#CCFF00] rounded-lg blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                
                {/* Card content */}
                <a href={project.href} className="case-card block relative bg-[#1a1a1a] border border-[#CCFF00]/20 rounded-lg overflow-hidden transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl cursor-pointer">
                  {/* Project Image */}
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <ImageWithFallback
                      src={project.image}
                      alt={`${project.title} — event fabrication case study by ACT Creative Singapore`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Project Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      <h3 className="text-xl md:text-2xl text-white mb-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {project.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Project Details */}
                  {project.client && (
                    <div className="case-card-detail hidden md:block bg-[#0a0a0a] border-t border-[#CCFF00]/10">
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

                      <span className="inline-block mt-4 text-xs text-[#CCFF00] group-hover:text-white transition-colors">
                        {t("查看案例详情 →", "View case details →")}
                      </span>
                    </div>
                  )}
                  {project.client && (
                    <div className="md:hidden p-4 bg-[#0a0a0a] border-t border-[#CCFF00]/10">
                      <div className="flex items-center justify-between gap-3">
                        <span className="min-w-0 text-xs text-gray-400 truncate">
                          {project.client}
                        </span>
                        <span className="text-xs text-[#CCFF00] whitespace-nowrap">
                          {t("查看详情 →", "View details →")}
                        </span>
                      </div>
                    </div>
                  )}
                </a>
              </motion.div>
            ))}
          </div>
          <div className="case-rail-nav">
            <button
              type="button"
              className="case-rail-arrow"
              aria-label="Scroll Singapore cases left"
              onClick={() => scrollCaseRail(singaporeRailRef, -1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="case-rail-arrow"
              aria-label="Scroll Singapore cases right"
              onClick={() => scrollCaseRail(singaporeRailRef, 1)}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          </div>
        </motion.div>

        {/* Regional Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="case-study-block"
        >
          {/* Section Header */}
          <div className="case-section-heading text-center">
            <h2 className="text-3xl md:text-4xl text-white mb-4 tracking-wide">
              {t("精选区域项目", "SELECTED REGIONAL PROJECTS")}
            </h2>
            <div className="w-32 h-1 bg-[#CCFF00] mx-auto"></div>
          </div>

          {/* Projects Grid */}
          <div className="case-rail-shell">
          <div
            ref={regionalRailRef}
            className="case-grid case-rail case-grid--regional"
            aria-label="Regional case studies"
          >
            {chinaProjects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="case-item group relative"
              >
                {/* Card background glow */}
                <div className="absolute inset-0 bg-[#CCFF00] rounded-lg blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                
                {/* Card content */}
                <a href={project.href} className="case-card block relative bg-[#1a1a1a] border border-[#CCFF00]/20 rounded-lg overflow-hidden transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl cursor-pointer">
                  {/* Project Image */}
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <ImageWithFallback
                      src={project.image}
                      alt={`${project.title} — event fabrication case study by ACT Creative Singapore`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Project Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      <h3 className="text-xl md:text-2xl text-white mb-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {project.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Project Details */}
                  {project.client && (
                    <div className="case-card-detail hidden md:block bg-[#0a0a0a] border-t border-[#CCFF00]/10">
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

                      <span className="inline-block mt-4 text-xs text-[#CCFF00] group-hover:text-white transition-colors">
                        {t("查看案例详情 →", "View case details →")}
                      </span>
                    </div>
                  )}
                  {project.client && (
                    <div className="md:hidden p-4 bg-[#0a0a0a] border-t border-[#CCFF00]/10">
                      <div className="flex items-center justify-between gap-3">
                        <span className="min-w-0 text-xs text-gray-400 truncate">
                          {project.client}
                        </span>
                        <span className="text-xs text-[#CCFF00] whitespace-nowrap">
                          {t("查看详情 →", "View details →")}
                        </span>
                      </div>
                    </div>
                  )}
                </a>
              </motion.div>
            ))}
          </div>
          <div className="case-rail-nav">
            <button
              type="button"
              className="case-rail-arrow"
              aria-label="Scroll regional cases left"
              onClick={() => scrollCaseRail(regionalRailRef, -1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="case-rail-arrow"
              aria-label="Scroll regional cases right"
              onClick={() => scrollCaseRail(regionalRailRef, 1)}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
