import { useEffect, useState } from "react";

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
const FADE_MS = 900;

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
      className="relative w-full overflow-hidden rounded-2xl bg-[#0a0a0a] border border-[#CCFF00]/15 shadow-2xl shadow-black/50"
      style={{ aspectRatio: "4 / 3" }}
    >
      {/* All slides stacked; only the current one is opaque */}
      {slides.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: i === idx ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ease-in-out`,
          }}
        />
      ))}

      {/* gradient bottom for label legibility */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

      {/* current slide label */}
      <div
        className="absolute bottom-4 left-5 right-20 text-white"
        style={{ pointerEvents: "none" }}
      >
        <p
          className="text-[#CCFF00]"
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: "0.25rem",
          }}
        >
          Selected work
        </p>
        <p
          className="text-white"
          style={{ fontSize: "0.875rem", fontWeight: 500 }}
          key={`label-${idx}`}
        >
          {slides[idx].label}
        </p>
      </div>

      {/* dots */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Show slide ${i + 1}`}
            className="rounded-full transition-all"
            style={{
              width: i === idx ? "20px" : "6px",
              height: "6px",
              background: i === idx ? "#CCFF00" : "rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
