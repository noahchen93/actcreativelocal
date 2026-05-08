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
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setIdx((i) => (i + 1) % slides.length),
      INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4 / 3",
        overflow: "hidden",
        borderRadius: "1rem",
        background: "#0a0a0a",
        border: "1px solid rgba(204,255,0,0.18)",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
      }}
    >
      {slides.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          loading={i < 3 ? "eager" : "lazy"}
          decoding="async"
          style={{
            ...ABSOLUTE_FILL,
            objectFit: "cover",
            opacity: i === idx ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}
