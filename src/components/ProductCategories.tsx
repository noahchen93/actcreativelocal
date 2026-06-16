import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tent, Truck, Monitor, Wind, Lightbulb, FileImage, Gamepad2, Smartphone, Sparkles, ChevronDown, ChevronUp, Lamp, Shapes } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";
import { scrollToSection } from "../lib/scrollToSection";
import gazeboImage from "figma:asset/1caf9ac9a9d0d7f9cad8ed51a98bb55b8d03990a.png";
import foodTruckImage from "figma:asset/31c3a94b1e29c068a2f34e21f880665e070fc631.png";
import ledDisplayImage from "figma:asset/9895e54c650c91e8620205b506be0a07797290ab.png";
import inflatableImage from "figma:asset/1449ca57ce695e4226352bc8bf40476eeb2a6063.png";
import stageEquipmentImage from "figma:asset/1bf01d4da8788bfd1129355bf925b5c99a7cd40b.png";
import printingMaterialImage from "figma:asset/1436808f505f19492ee82879766d0c80dc0901a9.png";
import entertainmentImage from "figma:asset/3e129be199284d33c3116c2686b339ca71d8eff7.png";
import hiTechImage from "figma:asset/fca4d851468974aed832ca8c37591973f036a4d7.png";
import lightingImage from "figma:asset/6c4b2d9ca5b30a77b60b7dc9631b8f412b2e0bc7.png";
import sculptureImage from "figma:asset/f60bebcbcb0f95e82cfd56ae7974a5af64351275.png";

const productCategories = [
  {
    icon: Tent,
    title: { zh: "防雨帐篷", en: "Weather-Resistant Gazebos" },
    description: { 
      zh: "为新加坡各种室内外活动定制的专业级帐篷，防水防晒，适应多变天气，提供舒适的活动空间。",
      en: "Professional-grade custom gazebos for Singapore indoor and outdoor events, waterproof and sun-resistant, adapting to changing weather conditions."
    },
    features: [
      { zh: "多种尺寸可选，适配不同活动规模", en: "Multiple sizes for different event scales" },
      { zh: "防水PVC材料，抗UV涂层", en: "Waterproof PVC with UV coating" },
      { zh: "快速搭建，可印刷品牌LOGO", en: "Quick setup, customizable with brand logo" }
    ],
    emoji: "⛺",
    image: gazeboImage
  },
  {
    icon: Truck,
    href: "/custom-food-truck-rental-singapore/",
    linkLabel: { zh: "餐车租赁与定制方案", en: "View food truck rental and custom-build options" },
    title: { zh: "定制餐车与移动空间", en: "Food Trucks" },
    description: { 
      zh: "可租赁并定制新加坡样车，也可从零开发用于餐饮、零售或活动的移动空间，并提供生产、运输和本地支持。",
      en: "Rent and customize a Singapore sample unit, or develop a purpose-built mobile food, retail or event platform with full production and delivery coordination."
    },
    features: [
      { zh: "两台新加坡样车可讨论租赁", en: "Two Singapore sample units for rental discussions" },
      { zh: "外观、内部布局与设备可定制", en: "Exterior, interior and equipment customization" },
      { zh: "支持定制制造、运输与本地落地", en: "Custom-build, freight and local support options" }
    ],
    emoji: "🚚",
    image: foodTruckImage
  },
  {
    icon: Monitor,
    title: { zh: "室内外LED广告屏", en: "Indoor/Outdoor LED Displays" },
    description: { 
      zh: "各种规格的电子广告屏，内容可快速更换。告别传统印刷物料的重复投入，环保高效，科技感十足。",
      en: "Various sizes of LED display screens with quick content updates. Say goodbye to repetitive printing costs, eco-friendly, efficient, and technologically advanced."
    },
    features: [
      { zh: "高亮度适合户外使用", en: "High brightness for outdoor use" },
      { zh: "支持视频/图片/动画播放", en: "Supports video/image/animation" },
      { zh: "租赁或购买方案灵活", en: "Flexible rental or purchase options" }
    ],
    emoji: "📺",
    image: ledDisplayImage
  },
  {
    icon: Wind,
    href: "/custom-flying-inflatables-singapore/",
    linkLabel: { zh: "查看飞行气模案例与技术", en: "View flying inflatable systems" },
    title: { zh: "充气气模装置", en: "Inflatable Structures" },
    description: { 
      zh: "各类充气气模定制，包括密闭式、开放式，多种尺寸和材料。可定制飘空气球、无人机广告气球等创意装置。",
      en: "Custom inflatable structures including sealed and open types, various sizes and materials. Custom sky balloons, drone advertising balloons, and creative installations."
    },
    features: [
      { zh: "品牌形象立体化展示", en: "3D brand image display" },
      { zh: "轻便易运输，快速充气", en: "Lightweight, quick inflation" },
      { zh: "适合开幕式、促销活动", en: "Perfect for openings and promotions" }
    ],
    emoji: "🎈",
    image: inflatableImage
  },
  {
    icon: Lightbulb,
    title: { zh: "舞台设备", en: "Stage Equipment" },
    description: { 
      zh: "专业级LED灯光系统音响设备、舞台升降机等。为演出和活动提供完整的舞台技术解决方案。",
      en: "Professional LED lighting systems, sound equipment, stage lifts, and more. Complete stage technical solutions for performances and events."
    },
    features: [
      { zh: "DMX512标准控制系统", en: "DMX512 standard control system" },
      { zh: "可编程灯光效果", en: "Programmable lighting effects" },
      { zh: "专业音响配套方案", en: "Professional audio solutions" }
    ],
    emoji: "💡",
    image: stageEquipmentImage
  },
  {
    icon: FileImage,
    title: { zh: "各类印刷品", en: "Printing Materials" },
    description: {
      zh: "各种材料的印刷制品，包括横幅、展板、宣传册等。如时间允许，定制路径更加高效实惠。",
      en: "Printing on various materials including banners, display boards, brochures and more. Custom routes available when timeline allows for cost-effective delivery."
    },
    features: [
      { zh: "PVC横幅、X展架、易拉宝", en: "PVC banners, X-stands, roll-ups" },
      { zh: "大型喷绘和UV打印", en: "Large format and UV printing" },
      { zh: "快速交付，品质保证", en: "Fast delivery, quality guaranteed" }
    ],
    emoji: "🖨️",
    image: printingMaterialImage
  },
  {
    icon: Gamepad2,
    title: { zh: "游乐设备", en: "Entertainment Equipment" },
    description: { 
      zh: "多样化游乐设施，包括旋转木马、抓娃娃机、街机游戏、室外小火车等，为活动增添互动乐趣。",
      en: "Diverse entertainment facilities including carousels, claw machines, arcade games, outdoor trains, and more to add interactive fun to events."
    },
    features: [
      { zh: "符合安全标准认证", en: "Safety certified equipment" },
      { zh: "适合家庭日和嘉年华", en: "Perfect for family days & carnivals" },
      { zh: "可按主题定制外观", en: "Theme-customizable appearance" }
    ],
    emoji: "🎮",
    image: entertainmentImage
  },
  {
    icon: Smartphone,
    title: { zh: "高科技互动设备", en: "Hi-Tech Interactive Equipment" },
    description: { 
      zh: "AI变脸、自助拍照亭、VR/AR体验设备等。为活动注入科技元素，提升参与者互动体验。",
      en: "AI face-changing, photo booths, VR/AR experience equipment, etc. Inject technology into events and enhance participant interaction."
    },
    features: [
      { zh: "社交媒体即时分享功能", en: "Instant social media sharing" },
      { zh: "数据收集和分析", en: "Data collection and analytics" },
      { zh: "品牌曝光增强", en: "Enhanced brand exposure" }
    ],
    emoji: "📱",
    image: hiTechImage
  },
  {
    icon: Lamp,
    title: { zh: "灯光装饰设备", en: "Decorative Lighting Equipment" },
    description: { 
      zh: "各类型照明灯、装饰灯及灯光装置定制。包括LED串灯、霓虹灯、投影灯、氛围灯等，为活动打造梦幻光影效果。",
      en: "Various types of lighting, decorative lights and custom light installations. Including LED string lights, neon lights, projection lights, ambient lighting, creating magical visual effects for events."
    },
    features: [
      { zh: "节能LED技术，色彩可调", en: "Energy-efficient LED, adjustable colors" },
      { zh: "防水防尘等级，适合室内外", en: "Waterproof & dustproof, indoor/outdoor use" },
      { zh: "创意灯光装置艺术定制", en: "Custom creative light art installations" }
    ],
    emoji: "💡",
    image: lightingImage
  },
  {
    icon: Shapes,
    href: "/frp-sculpture-fabrication-singapore/",
    linkLabel: { zh: "查看雕塑案例", en: "View sculpture portfolio" },
    title: { zh: "雕塑与艺术装置定制", en: "Custom Sculptures & Art Installations" },
    description: { 
      zh: "从节庆圣诞树、生肖灯光装置到艺术雕塑、手办衍生品，我们拥有专业工厂提供高度定制化服务，将您的创意变为现实。",
      en: "From festive Christmas trees, zodiac light installations to art sculptures, figurines and merchandise, our professional factories provide highly customized services to bring your creative vision to life."
    },
    features: [
      { zh: "节庆装饰：圣诞树、生肖装置等", en: "Festive decor: Christmas trees, zodiac installations" },
      { zh: "艺术雕塑与灯光装置定制", en: "Custom art sculptures & light installations" },
      { zh: "手办、衍生品批量生产", en: "Figurines & merchandise mass production" }
    ],
    emoji: "🎨",
    image: sculptureImage
  },
  {
    icon: Sparkles,
    title: { zh: "定制化解决方案", en: "Custom Solutions" },
    description: { 
      zh: "有创意但不知如何实现？我们的专业团队为您提供从概念到落地的全方位技术支持和材料采购方案。",
      en: "Have an idea but don't know how to realize it? Our professional team provides comprehensive technical support and material procurement solutions from concept to implementation."
    },
    features: [
      { zh: "3D建模和效果图呈现", en: "3D modeling and rendering" },
      { zh: "材料选型和成本优化", en: "Material selection & cost optimization" },
      { zh: "从概念到交付一站式服务", en: "End-to-end service from concept to delivery" }
    ],
    emoji: "✨",
    image: "https://images.unsplash.com/photo-1576595579783-1f2ae5674685?w=800"
  }
];

export function ProductCategories() {
  const { t } = useLanguage();
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const visibleCategories = showAllCategories
    ? productCategories
    : productCategories.slice(0, 6);

  return (
    <section id="products" className="py-14 md:py-20 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(204,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Glowing accents */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#CCFF00] rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#CCFF00] rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-10 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl text-white mb-4 tracking-wide">
            {t("或许你正在寻找这些", "Perhaps You're Looking for These")}
          </h2>
          <div className="w-32 h-1 bg-[#CCFF00] mx-auto mb-6"></div>
          <p className="text-gray-400">
            {t(
              "这是我们做过的一部分内容，当然我们可以接受任何定制或者采购的需求，只需要把你的需求发给我们",
              "These are some of the projects we've completed. Of course, we can accommodate any custom or procurement needs - just send us your requirements"
            )}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 md:mb-12 max-w-7xl mx-auto">
          {visibleCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative"
            >
              {/* Card background glow */}
              <div className="absolute inset-0 bg-[#CCFF00] rounded-lg blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              
              {/* Card */}
              <div 
                className={`relative h-full transition-all border rounded-lg overflow-hidden cursor-pointer ${
                  expandedCategory === index 
                    ? 'border-[#CCFF00]/50 bg-[#1a1a1a]' 
                    : 'border-[#CCFF00]/20 bg-[#1a1a1a]/90 hover:border-[#CCFF00]/40'
                }`}
                onClick={() => setExpandedCategory(expandedCategory === index ? null : index)}
              >
                {/* Image Header */}
                <div className="relative">
                  <motion.div 
                    className="relative overflow-hidden"
                    animate={{ height: expandedCategory === index ? 280 : 220 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ImageWithFallback
                      src={category.image}
                      alt={`${t(category.title.zh, category.title.en)} — event production category by ACT Creative Singapore`}
                      className="w-full h-full object-cover"
                    />
                    {/* Subtle gradient only at bottom for better readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
                  </motion.div>
                </div>
                
                <div className="p-4">
                  {/* Title Section - moved below image */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#CCFF00] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <category.icon className="w-5 h-5 text-black" />
                      </div>
                      <h3 className="text-white">
                        {t(category.title.zh, category.title.en)}
                      </h3>
                    </div>
                    <div className="text-2xl">{category.emoji}</div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-300 leading-relaxed mb-3">
                    {t(category.description.zh, category.description.en)}
                  </p>
                  
                  {/* Expand/Collapse Indicator */}
                  <div className="flex items-center justify-center gap-2 text-xs text-[#CCFF00] mb-2">
                    {expandedCategory === index ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        <span>{t("收起详情", "Collapse")}</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        <span>{t("展开详情", "Expand details")}</span>
                      </>
                    )}
                  </div>
                  
                  {/* Expandable Features */}
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: expandedCategory === index ? 'auto' : 0,
                      opacity: expandedCategory === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 border-t border-[#CCFF00]/20">
                      <h4 className="text-xs text-gray-500 mb-3">
                        {t("产品特点:", "Features:")}
                      </h4>
                      <ul className="space-y-2">
                        {category.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] mt-1.5 flex-shrink-0" />
                            <span>{t(feature.zh, feature.en)}</span>
                          </li>
                        ))}
                      </ul>
                      {"href" in category && category.href && (
                        <a
                          href={category.href}
                          className="mt-5 inline-flex items-center justify-center rounded-lg border border-[#CCFF00] bg-[#CCFF00] px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#d7ff57]"
                          onClick={(event) => event.stopPropagation()}
                        >
                          {t(category.linkLabel.zh, category.linkLabel.en)}
                        </a>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!showAllCategories && (
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <button
              type="button"
              onClick={() => setShowAllCategories(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-[#CCFF00]/40 px-5 py-3 text-sm text-[#CCFF00] transition-all hover:bg-[#CCFF00] hover:text-black"
            >
              <ChevronDown className="w-4 h-4" />
              {t("查看更多产品类别", "View more categories")}
            </button>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div 
          className="mt-12 md:mt-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-[#CCFF00] rounded-lg blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            
            {/* Content */}
            <div className="relative bg-[#1a1a1a] border border-[#CCFF00]/30 rounded-lg p-6 md:p-8">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#CCFF00] rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-2xl text-white">
                    {t("找不到您需要的产品？", "Can't find what you need?")}
                  </h3>
                </div>
                <p className="text-gray-400 text-center max-w-xl">
                  {t(
                    "无论您需要什么，我们专业团队都能为您找到最佳解决方案。联系我们，告诉我们您的需求。",
                    "Whatever you need, our professional team can find the best solution for you. Contact us and tell us your requirements."
                  )}
                </p>
                <motion.button
                  className="mt-2 rounded-lg bg-[#CCFF00] px-8 py-3 text-black shadow-lg transition-all hover:bg-[#b8e600] hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection("contact")}
                >
                  {t("立即咨询", "Contact Us Now")}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
