import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import { MapPin, Briefcase } from "lucide-react";
import noahChenImage from "figma:asset/598844c2d12f583dd14c291d98d5ddcf2dac2377.png";
import daisyImage from "figma:asset/7582ec62f07c47830049bf1681f8cfcd9e219d4e.png";
import jimmyTangImage from "figma:asset/f03d52731a85bf6a927dcf21ae7cdc5f4209373b.png";
import steveYangImage from "figma:asset/cd8d22454703fb7138abd251f5d7e528160024c7.png";

export function TeamSection() {
  const { t } = useLanguage();

  const team = [
    {
      name: "Noah Chen",
      title: t("创始人 & 首席执行官", "Founder & CEO"),
      location: t("新加坡", "SG HQ"),
      image: noahChenImage
    },
    {
      name: "Daisy",
      title: t("设计师", "Designer"),
      location: t("中国总部", "CN HQ"),
      image: daisyImage
    },
    {
      name: "Jimmy Tang",
      title: t("供应链专家", "Supply Chain Expert"),
      location: t("中国总部", "CN HQ"),
      image: jimmyTangImage
    },
    {
      name: "Steve Yang",
      title: t("技术总监", "Technical Director"),
      location: t("中国总部", "CN HQ"),
      image: steveYangImage
    }
  ];

  return (
    <section id="team" className="py-20 bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(204,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Glowing accents */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#CCFF00] rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#CCFF00] rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl text-white mb-4 tracking-wide">
            {t("核心团队与全球网络", "Core Team & Global Network")}
          </h2>
          <div className="w-32 h-1 bg-[#CCFF00] mx-auto"></div>
        </motion.div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Card background glow */}
              <div className="absolute inset-0 bg-[#CCFF00] rounded-lg blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              
              {/* Card content */}
              <div className="relative bg-[#1a1a1a] border border-[#CCFF00]/20 rounded-lg overflow-hidden transform transition-transform duration-300 group-hover:-translate-y-2">
                {/* Member Image */}
                <div className="aspect-square overflow-hidden bg-[#1a1a1a] flex items-center justify-center p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-full"
                  />
                </div>
                
                {/* Member Info */}
                <div className="p-6 text-center">
                  <h3 className="text-xl text-white mb-2">
                    {member.name}
                  </h3>
                  
                  <div className="flex items-center justify-center gap-2 text-[#CCFF00] mb-2">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm">{member.title}</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{member.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}