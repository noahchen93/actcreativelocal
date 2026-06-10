import { useEffect, useState } from "react";

// Case study photos served from /public/case-studies/images/ at the URL root
const bigBigWorld = "/case-studies/images/big-big-world.webp";
const wingsOfArt = "/case-studies/images/wings-of-art.webp";
const pacmanFriends = "/case-studies/images/pacman-friends.webp";

// Catalog images (from product categories) bundled via Vite figma alias
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

const slides: { src: string; alt: string }[] = [
  { src: bigBigWorld, alt: "A BIG BIG WORLD light show installation at Sentosa, Singapore" },
  { src: wingsOfArt, alt: "Wings of Art Barbie charity art exhibition runway, Singapore" },
  { src: pacmanFriends, alt: "PACMAN and Friends human game public activation at Sentosa" },
  { src: gazeboImage, alt: "Custom weather-resistant event gazebo" },
  { src: foodTruckImage, alt: "Custom branded food truck for F&B activations" },
  { src: ledDisplayImage, alt: "Outdoor LED display screen for events" },
  { src: inflatableImage, alt: "Custom inflatable structure for brand activations" },
  { src: stageEquipmentImage, alt: "Stage equipment and rigging for live events" },
  { src: printingMaterialImage, alt: "Custom event printing and graphic materials" },
  { src: entertainmentImage, alt: "Entertainment and interactive event installations" },
  { src: hiTechImage, alt: "Hi-tech experiential and digital event installations" },
  { src: lightingImage, alt: "Architectural and event lighting installations" },
  { src: sculptureImage, alt: "Custom FRP and themed sculpture fabrication" },
];

const INTERVAL_MS = 4500;
const FADE_MS = 900;

function randomIndex(maxExclusive: number) {
  if (maxExclusive <= 1) return 0;

  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.getRandomValues) {
    const range = 0x1_0000_0000;
    const limit = range - (range % maxExclusive);
    const values = new Uint32Array(1);

    do {
      cryptoApi.getRandomValues(values);
    } while (values[0] >= limit);

    return values[0] % maxExclusive;
  }

  return Math.floor(Math.random() * maxExclusive);
}

function shuffleSlides(
  source: typeof slides,
  avoidFirstSrc?: string,
) {
  const shuffled = [...source];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const swapIndex = randomIndex(i + 1);
    [shuffled[i], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[i]];
  }

  if (avoidFirstSrc && shuffled.length > 1 && shuffled[0].src === avoidFirstSrc) {
    const swapIndex = shuffled.findIndex((slide) => slide.src !== avoidFirstSrc);
    [shuffled[0], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[0]];
  }

  return shuffled;
}

const ABSOLUTE_FILL = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: "100%",
  height: "100%",
};

export function HeroSlideshow() {
  const [orderedSlides, setOrderedSlides] = useState(() => shuffleSlides(slides));
  const [idx, setIdx] = useState(0);
  const [loadedIndexes, setLoadedIndexes] = useState<Set<number>>(
    () => new Set([0, 1]),
  );

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const id = window.setInterval(
      () => setIdx((currentIdx) => {
        if (currentIdx < orderedSlides.length - 1) {
          return currentIdx + 1;
        }

        setOrderedSlides((currentSlides) =>
          shuffleSlides(slides, currentSlides[currentSlides.length - 1]?.src),
        );
        return 0;
      }),
      INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [orderedSlides.length]);

  useEffect(() => {
    setLoadedIndexes((current) => {
      const next = new Set(current);
      next.add(idx);
      next.add((idx + 1) % orderedSlides.length);
      return next;
    });
  }, [idx, orderedSlides.length]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        flex: 1,
        minHeight: "clamp(300px, 38vw, 640px)",
        overflow: "hidden",
        borderRadius: "1rem",
        background: "#0a0a0a",
        border: "1px solid rgba(204,255,0,0.18)",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
      }}
    >
      {orderedSlides.map((s, i) => {
        if (!loadedIndexes.has(i)) return null;

        const isActive = i === idx;

        return (
          <img
            key={s.src}
            src={s.src}
            alt={isActive ? s.alt : ""}
            aria-hidden={!isActive}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            style={{
              ...ABSOLUTE_FILL,
              objectFit: "cover",
              opacity: isActive ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-in-out`,
            }}
          />
        );
      })}
    </div>
  );
}
