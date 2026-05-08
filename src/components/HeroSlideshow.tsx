import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const slides = [
  {
    src: "/case-studies/images/big-big-world.webp",
    alt: "A BIG BIG WORLD light show installation at Sentosa, Singapore",
    label: "A BIG BIG WORLD · Sentosa",
  },
  {
    src: "/case-studies/images/wings-of-art.webp",
    alt: "Wings of Art Barbie charity art exhibition runway, Singapore",
    label: "Wings of Art · Barbie Runway",
  },
  {
    src: "/case-studies/images/pacman-friends.webp",
    alt: "PACMAN and Friends human game public activation at Sentosa",
    label: "PACMAN & Friends · Sentosa",
  },
];

const INTERVAL_MS = 5000;

export function HeroSlideshow() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setIdx((i) => (i + 1) % slides.length),
      INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-[#0a0a0a] border border-[#CCFF00]/15 shadow-2xl shadow-black/50">
      <div className="relative w-full" style={{ aspectRatio: "4 / 5" }}>
        <AnimatePresence mode="sync">
          <motion.img
            key={slides[idx].src}
            src={slides[idx].src}
            alt={slides[idx].alt}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            loading="eager"
            decoding="async"
          />
        </AnimatePresence>

        {/* gradient bottom for label legibility */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

        {/* current slide label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`label-${idx}`}
            className="absolute bottom-5 left-5 right-16 text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-xs uppercase tracking-widest text-[#CCFF00] mb-1">
              Selected work
            </p>
            <p className="text-sm md:text-base" style={{ fontWeight: 500 }}>
              {slides[idx].label}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* dots */}
        <div className="absolute bottom-5 right-5 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`transition-all rounded-full ${
                i === idx
                  ? "w-6 h-1.5 bg-[#CCFF00]"
                  : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
