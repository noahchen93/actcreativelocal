import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Clock, DollarSign, CheckCircle2, Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import { useState } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export function CaseDetailDialog({ caseData, isOpen, onClose, onPrev, onNext }) {
  const { t } = useLanguage();
  const [imageIndex, setImageIndex] = useState(0);
  
  if (!caseData) return null;

  const images = caseData.images || [caseData.mainImage || caseData.image];
  const hasMultipleImages = images.length > 1;

  const handlePrevImage = () => {
    setImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    setImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        {/* Accessible Title and Description (Hidden) */}
        <VisuallyHidden.Root>
          <DialogTitle>{t(caseData.title.zh, caseData.title.en)}</DialogTitle>
          <DialogDescription>{t(caseData.description.zh, caseData.description.en)}</DialogDescription>
        </VisuallyHidden.Root>
        
        <button 
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-white shadow-lg transition-all" 
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image Section with Gallery */}
        <div className="relative h-[60vh] overflow-hidden bg-black group">
          <AnimatePresence mode="wait">
            <motion.div
              key={imageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <ImageWithFallback
                src={images[imageIndex]}
                alt={t(caseData.title.zh, caseData.title.en)}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Image Navigation */}
          {hasMultipleImages && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-xl z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-xl z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === imageIndex
                        ? "bg-white w-8"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t ${caseData.gradient} opacity-10`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Emoji Badge */}
          <motion.div 
            className="absolute top-6 left-6 w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-2xl"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            {caseData.emoji}
          </motion.div>

          {/* Title Overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <motion.h2 
              className="text-white text-3xl mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {t(caseData.title.zh, caseData.title.en)}
            </motion.h2>
            <p className="text-gray-200 text-lg">{t(caseData.client.zh, caseData.client.en)}</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30">
          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-700 text-lg leading-relaxed">
              {t(caseData.description.zh, caseData.description.en)}
            </p>
          </div>

          {/* Services Tags */}
          <div className="flex flex-wrap gap-3 mb-8">
            {caseData.services.map((service, idx) => (
              <Badge 
                key={idx} 
                variant="secondary"
                className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 px-4 py-2 text-sm"
              >
                {t(service.zh, service.en)}
              </Badge>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-6 mb-8 p-6 bg-white rounded-2xl shadow-lg border-2 border-purple-100">
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                <DollarSign className="w-5 h-5" />
                <span className="text-sm">{t("成本节省", "Cost Savings")}</span>
              </div>
              <div className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {t(caseData.stats.cost.zh, caseData.stats.cost.en)}
              </div>
            </motion.div>
            <motion.div 
              className="text-center border-l-2 border-r-2 border-purple-100"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm">{t("交付时间", "Delivery Time")}</span>
              </div>
              <div className="text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {t(caseData.stats.time.zh, caseData.stats.time.en)}
              </div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-center gap-2 text-purple-600 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm">{t("项目成果", "Result")}</span>
              </div>
              <div className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t(caseData.stats.result.zh, caseData.stats.result.en)}
              </div>
            </motion.div>
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <h3 className="text-xl text-gray-900">{t("项目亮点", "Project Highlights")}</h3>
            </div>
            <ul className="space-y-3">
              {caseData.details.map((detail, idx) => (
                <motion.li 
                  key={idx} 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className={`w-6 h-6 bg-gradient-to-r ${caseData.gradient} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 text-base">{t(detail.zh, detail.en)}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Thumbnail Gallery */}
          {hasMultipleImages && (
            <div className="mt-8">
              <h4 className="text-sm text-gray-600 mb-3">{t("项目图集", "Project Gallery")}</h4>
              <div className="grid grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`relative h-32 rounded-xl overflow-hidden border-4 transition-all ${
                      idx === imageIndex
                        ? `border-purple-500 shadow-lg`
                        : "border-transparent hover:border-purple-300"
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${t(caseData.title.zh, caseData.title.en)} - Image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Footer */}
          <div className="mt-8 pt-6 border-t-2 border-purple-100 flex justify-between items-center">
            <motion.button 
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-xl hover:shadow-lg transition-all"
              onClick={onPrev}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
              {t("上一个案例", "Previous Case")}
            </motion.button>
            <motion.button 
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-xl hover:shadow-lg transition-all"
              onClick={onNext}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("下一个案例", "Next Case")}
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}