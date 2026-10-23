import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

// Real delivered work only; catalog references remain in the product section.
const slides = [
  { src: "/case-studies/images/kick-off-challenge.webp", title: "Kick Off Challenge", location: "The Star Vista · Singapore", href: "/case-studies/kick-off-challenge-star-vista-singapore/", alt: "Kick Off Challenge football activation at The Star Vista B1 Atrium, Singapore" },
  { src: "/case-studies/images/wings-of-art.webp", title: "Wings of Art", location: "Singapore", href: "/case-studies/wings-of-art-barbie-runway-singapore/", alt: "Wings of Art Barbie charity art exhibition runway, Singapore" },
  { src: "/case-studies/images/pacman-friends.webp", title: "PACMAN and Friends", location: "Sentosa · Singapore", href: "/case-studies/sentosa-pacman-human-game/", alt: "PACMAN and Friends human game public activation at Sentosa" },
  { src: "/case-studies/images/big-big-world.webp", title: "A BIG BIG WORLD", location: "Sentosa · Singapore", href: "/case-studies/sentosa-big-big-world-event-fabrication/", alt: "A BIG BIG WORLD light show installation at Sentosa, Singapore" },
];

export function HeroSlideshow() {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [visited, setVisited] = useState(() => new Set([0]));
  const current = slides[index];
  return <div className="hero-project">
    <div className="hero-project-image">
      {slides.map((slide, i) => visited.has(i) ? <img
        key={slide.src} src={slide.src} alt={i === index ? slide.alt : ""}
        aria-hidden={i !== index} loading="eager" decoding="async"
        {...{ fetchpriority: i === 0 ? "high" : "auto" }}
        style={{ opacity: i === index ? 1 : 0 }}
      /> : null)}
    </div>
    <div className="hero-project-caption">
      <div>
        <a href={current.href}>{current.title} <span aria-hidden="true">↗</span></a>
        <p>{current.location}</p>
      </div>
      <div className="hero-project-controls" role="group" aria-label={t("精选案例图片", "Featured project images")}>
        {slides.map((slide, i) => <button key={slide.src} type="button"
          aria-label={t(`查看 ${slide.title}`, `Show ${slide.title}`)} aria-pressed={i === index}
          onClick={() => { setVisited(previous => new Set([...previous, i])); setIndex(i); }}
        >0{i + 1}</button>)}
      </div>
    </div>
  </div>;
}
